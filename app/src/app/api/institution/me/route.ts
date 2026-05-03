import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { requireApprovedSession } from '@/lib/require-approved';
import connectDB from '@/lib/db';
import { Institution } from '@/models/Institution';

export async function GET() {
  const session = await auth();
  const gate = await requireApprovedSession(session);
  if (gate.error) return gate.error;
  const user = gate.user!;
  if (user.role !== 'coordinator' || !user.institutionId) {
    return NextResponse.json({ success: false, error: 'Not a coordinator' }, { status: 403 });
  }
  await connectDB();
  const inst = await Institution.findById(user.institutionId).lean();
  return NextResponse.json({ success: true, data: inst });
}

export async function PATCH(req: NextRequest) {
  const session = await auth();
  const gate = await requireApprovedSession(session);
  if (gate.error) return gate.error;
  const user = gate.user!;
  if (user.role !== 'coordinator' || !user.institutionId) {
    return NextResponse.json({ success: false, error: 'Not a coordinator' }, { status: 403 });
  }
  const body = await req.json();
  await connectDB();
  const inst = await Institution.findById(user.institutionId);
  if (!inst) return NextResponse.json({ success: false, error: 'Not found' }, { status: 404 });
  if (body.name) inst.name = body.name;
  if (body.district) inst.district = body.district;
  if (body.address) inst.address = body.address;
  if (body.website) inst.website = body.website;
  await inst.save();
  return NextResponse.json({ success: true, data: inst });
}
