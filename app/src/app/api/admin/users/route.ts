import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import { User } from '@/models/User';
import { requireRole } from '@/lib/api-auth';

export async function GET(req: NextRequest) {
  const gate = await requireRole('super_admin');
  if (gate.error) return gate.error;

  const role = req.nextUrl.searchParams.get('role');
  const approvalStatus = req.nextUrl.searchParams.get('approvalStatus');

  await connectDB();
  const q: Record<string, string> = {};
  if (role) q.role = role;
  if (approvalStatus) q.approvalStatus = approvalStatus;

  const users = await User.find(q)
    .populate('institutionId')
    .populate('companyId')
    .sort({ createdAt: -1 })
    .limit(500)
    .lean();

  return NextResponse.json({ success: true, data: users });
}
