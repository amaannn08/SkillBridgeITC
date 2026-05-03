import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { requireApprovedSession } from '@/lib/require-approved';
import connectDB from '@/lib/db';
import { Application } from '@/models/Application';
import { JobRequirement } from '@/models/JobRequirement';

export async function GET(
  _req: NextRequest,
  ctx: { params: Promise<{ appId: string }> }
) {
  const session = await auth();
  const gate = await requireApprovedSession(session);
  if (gate.error) return gate.error;
  const user = gate.user!;
  const { appId } = await ctx.params;

  await connectDB();
  const app = await Application.findById(appId)
    .populate('jobRequirementId')
    .populate('talentPoolBatchId')
    .populate('coordinatorId', 'name email');
  if (!app) return NextResponse.json({ success: false, error: 'Not found' }, { status: 404 });
  if (user.role === 'coordinator' && String(app.coordinatorId) !== String(user._id)) {
    return NextResponse.json({ success: false, error: 'Forbidden' }, { status: 403 });
  }
  if (user.role === 'recruiter' && String(app.companyId) !== String(user.companyId)) {
    return NextResponse.json({ success: false, error: 'Forbidden' }, { status: 403 });
  }
  return NextResponse.json({ success: true, data: app });
}

export async function DELETE(
  _req: NextRequest,
  ctx: { params: Promise<{ appId: string }> }
) {
  const session = await auth();
  const gate = await requireApprovedSession(session);
  if (gate.error) return gate.error;
  const user = gate.user!;
  const { appId } = await ctx.params;

  await connectDB();
  const app = await Application.findById(appId);
  if (!app) return NextResponse.json({ success: false, error: 'Not found' }, { status: 404 });
  if (user.role !== 'coordinator' || String(app.coordinatorId) !== String(user._id)) {
    return NextResponse.json({ success: false, error: 'Forbidden' }, { status: 403 });
  }
  if (app.status !== 'submitted') {
    return NextResponse.json({ success: false, error: 'Can only withdraw submitted applications' }, { status: 400 });
  }
  const job = await JobRequirement.findById(app.jobRequirementId);
  if (job && job.status !== 'open') {
    return NextResponse.json({ success: false, error: 'Job no longer open' }, { status: 400 });
  }
  await Application.findByIdAndDelete(appId);
  return NextResponse.json({ success: true });
}
