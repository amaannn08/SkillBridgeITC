import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { requireApprovedSession } from '@/lib/require-approved';
import connectDB from '@/lib/db';
import { TalentPoolBatch } from '@/models/TalentPoolBatch';
import mongoose from 'mongoose';

export async function PATCH(
  req: NextRequest,
  ctx: { params: Promise<{ batchId: string; studentId: string }> }
) {
  const session = await auth();
  const gate = await requireApprovedSession(session);
  if (gate.error) return gate.error;
  const user = gate.user!;
  const { batchId, studentId } = await ctx.params;
  const body = await req.json();

  await connectDB();
  const batch = await TalentPoolBatch.findById(batchId);
  if (!batch || String(batch.coordinatorId) !== String(user._id)) {
    return NextResponse.json({ success: false, error: 'Forbidden' }, { status: 403 });
  }
  const sid = new mongoose.Types.ObjectId(studentId);
  const sub = batch.students.id(sid);
  if (!sub) return NextResponse.json({ success: false, error: 'Student not in batch' }, { status: 404 });

  Object.assign(sub, {
    ...body,
    dob: body.dob ? new Date(body.dob) : sub.dob,
    cgpa: body.cgpa != null ? Number(body.cgpa) : sub.cgpa,
  });
  await batch.save();
  return NextResponse.json({ success: true, data: sub });
}

export async function DELETE(
  _req: NextRequest,
  ctx: { params: Promise<{ batchId: string; studentId: string }> }
) {
  const session = await auth();
  const gate = await requireApprovedSession(session);
  if (gate.error) return gate.error;
  const user = gate.user!;
  const { batchId, studentId } = await ctx.params;

  await connectDB();
  const batch = await TalentPoolBatch.findById(batchId);
  if (!batch || String(batch.coordinatorId) !== String(user._id)) {
    return NextResponse.json({ success: false, error: 'Forbidden' }, { status: 403 });
  }
  batch.students.pull({ _id: new mongoose.Types.ObjectId(studentId) });
  await batch.save();
  return NextResponse.json({ success: true });
}
