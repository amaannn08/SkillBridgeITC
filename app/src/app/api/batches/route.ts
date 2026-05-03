import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { requireApprovedSession } from '@/lib/require-approved';
import connectDB from '@/lib/db';
import { TalentPoolBatch } from '@/models/TalentPoolBatch';

export async function GET() {
  const session = await auth();
  const gate = await requireApprovedSession(session);
  if (gate.error) return gate.error;
  const user = gate.user!;
  if (user.role !== 'coordinator') {
    return NextResponse.json({ success: false, error: 'Insufficient permissions' }, { status: 403 });
  }

  await connectDB();
  const batches = await TalentPoolBatch.find({ coordinatorId: user._id }).sort({ updatedAt: -1 }).lean();
  return NextResponse.json({ success: true, data: batches });
}

export async function POST(req: NextRequest) {
  const session = await auth();
  const gate = await requireApprovedSession(session);
  if (gate.error) return gate.error;
  const user = gate.user!;
  if (user.role !== 'coordinator' || !user.institutionId) {
    return NextResponse.json({ success: false, error: 'Coordinator with institution required' }, { status: 403 });
  }

  const body = await req.json();
  const { name, qualification, branch, passingYear, status } = body;
  if (!name || !qualification || !branch || !passingYear) {
    return NextResponse.json({ success: false, error: 'Missing fields' }, { status: 422 });
  }

  await connectDB();
  const batch = await TalentPoolBatch.create({
    institutionId: user.institutionId,
    coordinatorId: user._id,
    name,
    qualification,
    branch,
    passingYear: Number(passingYear),
    students: [],
    status: status === 'active' ? 'active' : 'draft',
  });

  return NextResponse.json({ success: true, data: batch }, { status: 201 });
}
