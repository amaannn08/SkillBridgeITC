import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
import { auth } from '@/lib/auth';
import { requireApprovedSession } from '@/lib/require-approved';
import connectDB from '@/lib/db';
import { TalentPoolBatch } from '@/models/TalentPoolBatch';
import { saveResumePdf } from '@/lib/storage';

const MAX = 5 * 1024 * 1024;

export async function POST(
  req: NextRequest,
  ctx: { params: Promise<{ batchId: string }> }
) {
  const session = await auth();
  const gate = await requireApprovedSession(session);
  if (gate.error) return gate.error;
  const user = gate.user!;
  const { batchId } = await ctx.params;

  const form = await req.formData();
  const studentId = form.get('studentId') as string | null;
  const file = form.get('file') as File | null;
  if (!studentId || !file) {
    return NextResponse.json({ success: false, error: 'studentId and file required' }, { status: 422 });
  }
  if (file.size > MAX) {
    return NextResponse.json({ success: false, error: 'File exceeds 5MB limit' }, { status: 413 });
  }
  if (file.type !== 'application/pdf') {
    return NextResponse.json({ success: false, error: 'Only PDF files are accepted' }, { status: 415 });
  }

  await connectDB();
  const batch = await TalentPoolBatch.findById(batchId);
  if (!batch || String(batch.coordinatorId) !== String(user._id)) {
    return NextResponse.json({ success: false, error: 'Forbidden' }, { status: 403 });
  }

  const buf = Buffer.from(await file.arrayBuffer());
  const { storageKey } = await saveResumePdf({
    institutionId: String(batch.institutionId),
    batchId: String(batch._id),
    studentId,
    buffer: buf,
  });

  const sid = new mongoose.Types.ObjectId(studentId);
  const sub = batch.students.id(sid);
  if (!sub) {
    return NextResponse.json({ success: false, error: 'Student not in batch' }, { status: 404 });
  }
  sub.resumeUrl = storageKey;
  sub.resumeOriginalName = file.name;
  await batch.save();

  return NextResponse.json({ success: true, data: { storageKey, resumeUrl: storageKey } });
}
