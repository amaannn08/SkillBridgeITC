import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { requireApprovedSession } from '@/lib/require-approved';
import connectDB from '@/lib/db';
import { Company } from '@/models/Company';
import { User } from '@/models/User';

export async function GET() {
  const session = await auth();
  const gate = await requireApprovedSession(session);
  if (gate.error) return gate.error;
  const user = gate.user!;
  if (user.role !== 'recruiter' || !user.companyId) {
    return NextResponse.json({ success: false, error: 'Not a recruiter' }, { status: 403 });
  }
  await connectDB();
  const company = await Company.findById(user.companyId).lean();
  return NextResponse.json({ success: true, data: company });
}

export async function PATCH(req: NextRequest) {
  const session = await auth();
  const gate = await requireApprovedSession(session);
  if (gate.error) return gate.error;
  const user = gate.user!;
  if (user.role !== 'recruiter' || !user.companyId) {
    return NextResponse.json({ success: false, error: 'Not a recruiter' }, { status: 403 });
  }
  const body = await req.json();
  await connectDB();
  // Only allow updating non-sensitive fields
  const company = await Company.findById(user.companyId);
  if (!company) return NextResponse.json({ success: false, error: 'Not found' }, { status: 404 });
  if (body.website !== undefined) company.website = body.website;
  if (body.address !== undefined) company.address = body.address;
  await company.save();
  return NextResponse.json({ success: true, data: company });
}
