import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { requireApprovedSession } from '@/lib/require-approved';
import connectDB from '@/lib/db';
import { JobRequirement } from '@/models/JobRequirement';
import DOMPurify from 'isomorphic-dompurify';

export async function GET(
  _req: NextRequest,
  ctx: { params: Promise<{ jobId: string }> }
) {
  const session = await auth();
  const gate = await requireApprovedSession(session);
  if (gate.error) return gate.error;
  const { jobId } = await ctx.params;
  await connectDB();
  const job = await JobRequirement.findById(jobId).populate('companyId').lean();
  if (!job) return NextResponse.json({ success: false, error: 'Not found' }, { status: 404 });
  return NextResponse.json({ success: true, data: job });
}

export async function PATCH(
  req: NextRequest,
  ctx: { params: Promise<{ jobId: string }> }
) {
  const session = await auth();
  const gate = await requireApprovedSession(session);
  if (gate.error) return gate.error;
  const user = gate.user!;
  const { jobId } = await ctx.params;
  const body = await req.json();

  await connectDB();
  const job = await JobRequirement.findById(jobId);
  if (!job) return NextResponse.json({ success: false, error: 'Not found' }, { status: 404 });
  if (user.role !== 'recruiter' || String(job.postedBy) !== String(user._id)) {
    if (user.role !== 'super_admin') {
      return NextResponse.json({ success: false, error: 'Forbidden' }, { status: 403 });
    }
  }

  if (body.title) job.title = body.title;
  if (body.description) job.description = DOMPurify.sanitize(String(body.description));
  if (body.status) job.status = body.status;
  if (body.slots) {
    job.slots = body.slots.map((s: { qualification: string; branch?: string; seats: number; filledSeats?: number }) => ({
      qualification: s.qualification,
      branch: s.branch || '',
      seats: Number(s.seats) || 0,
      filledSeats: Number(s.filledSeats) || 0,
    }));
  }
  if (body.applicationDeadline) job.applicationDeadline = new Date(body.applicationDeadline);
  if (body.status === 'closed') {
    job.status = 'closed';
    job.closedAt = new Date();
  }
  await job.save();
  return NextResponse.json({ success: true, data: job });
}

export async function DELETE(
  _req: NextRequest,
  ctx: { params: Promise<{ jobId: string }> }
) {
  const session = await auth();
  const gate = await requireApprovedSession(session);
  if (gate.error) return gate.error;
  const user = gate.user!;
  const { jobId } = await ctx.params;
  await connectDB();
  const job = await JobRequirement.findById(jobId);
  if (!job) return NextResponse.json({ success: false, error: 'Not found' }, { status: 404 });
  if (user.role !== 'recruiter' || String(job.companyId) !== String(user.companyId)) {
    return NextResponse.json({ success: false, error: 'Forbidden' }, { status: 403 });
  }
  job.status = 'closed';
  job.closedAt = new Date();
  await job.save();
  return NextResponse.json({ success: true, data: job });
}
