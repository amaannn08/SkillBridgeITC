import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { requireApprovedSession } from '@/lib/require-approved';
import connectDB from '@/lib/db';
import { TalentPoolBatch } from '@/models/TalentPoolBatch';

export async function GET(
  _req: NextRequest,
  ctx: { params: Promise<{ batchId: string }> }
) {
  const session = await auth();
  const gate = await requireApprovedSession(session);
  if (gate.error) return gate.error;
  const user = gate.user!;
  const { batchId } = await ctx.params;

  await connectDB();
  const batch = await TalentPoolBatch.findById(batchId).lean();
  if (!batch) return NextResponse.json({ success: false, error: 'Not found' }, { status: 404 });
  if (String(batch.coordinatorId) !== String(user._id) && user.role !== 'super_admin') {
    return NextResponse.json({ success: false, error: 'Forbidden' }, { status: 403 });
  }
  return NextResponse.json({ success: true, data: batch });
}

export async function PATCH(
  req: NextRequest,
  ctx: { params: Promise<{ batchId: string }> }
) {
  const session = await auth();
  const gate = await requireApprovedSession(session);
  if (gate.error) return gate.error;
  const user = gate.user!;
  const { batchId } = await ctx.params;
  const body = await req.json();

  await connectDB();
  const batch = await TalentPoolBatch.findById(batchId);
  if (!batch) return NextResponse.json({ success: false, error: 'Not found' }, { status: 404 });
  if (String(batch.coordinatorId) !== String(user._id)) {
    return NextResponse.json({ success: false, error: 'Forbidden' }, { status: 403 });
  }

  if (body.name) batch.name = body.name;
  if (body.status) batch.status = body.status;
  if (body.qualification) batch.qualification = body.qualification;
  if (body.branch) batch.branch = body.branch;
  await batch.save();
  return NextResponse.json({ success: true, data: batch });
}
