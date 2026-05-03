import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import { User } from '@/models/User';
import { requireRole } from '@/lib/api-auth';

export async function GET(req: NextRequest) {
  const gate = await requireRole('super_admin');
  if (gate.error) return gate.error;

  const status = req.nextUrl.searchParams.get('status') || 'pending';
  await connectDB();

  const filter: Record<string, unknown> = {};
  if (status !== 'all') filter.approvalStatus = status;

  const users = await User.find(filter)
    .populate('institutionId')
    .populate('companyId')
    .sort({ createdAt: -1 })
    .limit(200)
    .lean();

  return NextResponse.json({ success: true, data: users });
}
