import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
import { auth } from '@/lib/auth';
import { requireApprovedSession } from '@/lib/require-approved';
import connectDB from '@/lib/db';
import {
  Application,
  type IStudentStatus,
  type StudentPipelineStatus,
} from '@/models/Application';
import { JobRequirement, type ISlot } from '@/models/JobRequirement';
import { notifyUser } from '@/lib/notify';

function syncApplicationLevelStatus(app: InstanceType<typeof Application>) {
  const statuses = app.studentStatuses.map((s: IStudentStatus) => s.status);
  if (statuses.some((s: StudentPipelineStatus) => s !== 'applied')) {
    app.status = 'shortlisting';
  }
  if (
    statuses.some(
      (s: StudentPipelineStatus) =>
        s === 'shortlisted' || s === 'rejected' || s === 'selected'
    )
  ) {
    app.status = 'shortlisting';
  }
}

export async function PATCH(
  req: NextRequest,
  ctx: { params: Promise<{ appId: string; studentId: string }> }
) {
  const session = await auth();
  const gate = await requireApprovedSession(session);
  if (gate.error) return gate.error;
  const user = gate.user!;
  if (user.role !== 'recruiter') {
    return NextResponse.json({ success: false, error: 'Only recruiters update student status' }, { status: 403 });
  }

  const { appId, studentId } = await ctx.params;
  const body = await req.json();
  const { status, recruiterNote } = body;

  await connectDB();
  const app = await Application.findById(appId);
  if (!app || String(app.companyId) !== String(user.companyId)) {
    return NextResponse.json({ success: false, error: 'Forbidden' }, { status: 403 });
  }

  if (app.status === 'submitted') {
    app.status = 'under_review';
  }

  const sid = new mongoose.Types.ObjectId(studentId);
  const row = app.studentStatuses.find(
    (s: IStudentStatus) => String(s.studentId) === String(sid)
  );
  if (!row) {
    return NextResponse.json({ success: false, error: 'Student not in application' }, { status: 404 });
  }
  if (status) row.status = status;
  if (recruiterNote !== undefined) row.recruiterNote = recruiterNote;
  row.updatedAt = new Date();
  app.lastUpdatedBy = user._id;

  syncApplicationLevelStatus(app);

  const job = await JobRequirement.findById(app.jobRequirementId);
  if (status === 'selected' && job) {
    const slot = job.slots.find((sl: ISlot) => sl.qualification);
    if (slot && slot.filledSeats < slot.seats) {
      slot.filledSeats += 1;
      await job.save();
    }
  }

  await app.save();

  await notifyUser(String(app.coordinatorId), {
    type: 'student_status',
    message: `Application updated for ${job?.title || 'job'} — student status: ${status}`,
    link: `/coordinator/applications`,
  });

  return NextResponse.json({ success: true, data: app });
}
