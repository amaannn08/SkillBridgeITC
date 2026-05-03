import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import { AdminAuditLog } from '@/models/AdminAuditLog';
import { requireRole } from '@/lib/api-auth';

export async function GET(req: NextRequest) {
  const gate = await requireRole('super_admin');
  if (gate.error) return gate.error;

  const limit = Math.min(Number(req.nextUrl.searchParams.get('limit') || '200'), 500);
  const action = req.nextUrl.searchParams.get('action');

  await connectDB();

  const filter: Record<string, unknown> = {};
  if (action) filter.action = action;

  const logs = await AdminAuditLog.find(filter)
    .populate('adminId', 'name email')
    .populate('targetUserId', 'name email role')
    .sort({ createdAt: -1 })
    .limit(limit)
    .lean();

  return NextResponse.json({ success: true, data: logs });
}
