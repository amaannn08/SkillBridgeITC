import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { requireApprovedSession } from '@/lib/require-approved';
import connectDB from '@/lib/db';
import { Application } from '@/models/Application';
import { JobRequirement } from '@/models/JobRequirement';
import { TalentPoolBatch, type IEmbeddedStudent } from '@/models/TalentPoolBatch';
import { User } from '@/models/User';
import { notifyUser } from '@/lib/notify';

export async function GET() {
  const session = await auth();
  const gate = await requireApprovedSession(session);
  if (gate.error) return gate.error;
  const user = gate.user!;

  await connectDB();
  if (user.role === 'coordinator') {
    const apps = await Application.find({ coordinatorId: user._id })
      .populate('jobRequirementId')
      .populate('talentPoolBatchId')
      .sort({ submittedAt: -1 })
      .lean();
    return NextResponse.json({ success: true, data: apps });
  }
  if (user.role === 'recruiter' && user.companyId) {
    const apps = await Application.find({ companyId: user.companyId })
      .populate('jobRequirementId')
      .populate('talentPoolBatchId')
      .populate('coordinatorId', 'name email')
      .sort({ submittedAt: -1 })
      .lean();
    return NextResponse.json({ success: true, data: apps });
  }
  if (user.role === 'super_admin') {
    const apps = await Application.find({})
      .limit(200)
      .populate('jobRequirementId')
      .populate('talentPoolBatchId')
      .lean();
    return NextResponse.json({ success: true, data: apps });
  }
  return NextResponse.json({ success: false, error: 'Forbidden' }, { status: 403 });
}

export async function POST(req: NextRequest) {
  const session = await auth();
  const gate = await requireApprovedSession(session);
  if (gate.error) return gate.error;
  const user = gate.user!;
  if (user.role !== 'coordinator' || !user.institutionId) {
    return NextResponse.json({ success: false, error: 'Only coordinators can apply' }, { status: 403 });
  }

  const body = await req.json();
  const { jobRequirementId, talentPoolBatchId, coverNote } = body;
  if (!jobRequirementId || !talentPoolBatchId) {
    return NextResponse.json({ success: false, error: 'jobRequirementId and talentPoolBatchId required' }, { status: 422 });
  }

  await connectDB();
  const existing = await Application.findOne({ jobRequirementId, talentPoolBatchId });
  if (existing) {
    return NextResponse.json({ success: false, error: 'Application already submitted for this job' }, { status: 409 });
  }

  const batch = await TalentPoolBatch.findById(talentPoolBatchId);
  if (!batch || String(batch.coordinatorId) !== String(user._id)) {
    return NextResponse.json({ success: false, error: 'Invalid batch' }, { status: 400 });
  }
  if (batch.status !== 'active') {
    return NextResponse.json({ success: false, error: 'Batch must be active' }, { status: 400 });
  }

  const job = await JobRequirement.findById(jobRequirementId);
  if (!job || job.status !== 'open') {
    return NextResponse.json({ success: false, error: 'Job not open' }, { status: 400 });
  }
  if (new Date() > new Date(job.applicationDeadline)) {
    return NextResponse.json({ success: false, error: 'Deadline passed' }, { status: 400 });
  }

  const studentStatuses = batch.students.map((s: IEmbeddedStudent) => ({
    studentId: s._id,
    status: 'applied' as const,
    updatedAt: new Date(),
  }));

  const app = await Application.create({
    jobRequirementId,
    talentPoolBatchId,
    coordinatorId: user._id,
    companyId: job.companyId!,
    status: 'submitted',
    coverNote: coverNote || undefined,
    studentStatuses,
  });

  const recruiters = await User.find({ companyId: job.companyId, role: 'recruiter', approvalStatus: 'approved' });
  for (const r of recruiters) {
    await notifyUser(r._id.toString(), {
      type: 'new_application',
      message: `New application for ${job.title}`,
      link: `/recruiter/jobs/${job._id}/applications`,
    });
  }

  return NextResponse.json({ success: true, data: app }, { status: 201 });
}
