import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { requireApprovedSession } from '@/lib/require-approved';
import connectDB from '@/lib/db';
import { TalentPoolBatch } from '@/models/TalentPoolBatch';

export async function POST(
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

  batch.students.push({
    name: body.name,
    rollNumber: body.rollNumber,
    dob: body.dob ? new Date(body.dob) : undefined,
    gender: body.gender,
    cgpa: body.cgpa != null ? Number(body.cgpa) : undefined,
    skills: body.skills || [],
    resumeUrl: body.resumeUrl,
    resumeOriginalName: body.resumeOriginalName,
    phone: body.phone,
    email: body.email,
    address: body.address,
    languagesKnown: body.languagesKnown || [],
    certifications: body.certifications || [],
  });
  await batch.save();
  const added = batch.students[batch.students.length - 1];
  return NextResponse.json({ success: true, data: added }, { status: 201 });
}
