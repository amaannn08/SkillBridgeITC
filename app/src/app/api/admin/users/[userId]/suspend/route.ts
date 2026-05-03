import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import { User } from '@/models/User';
import { requireRole } from '@/lib/api-auth';
import { AdminAuditLog } from '@/models/AdminAuditLog';
import { notifyUser } from '@/lib/notify';

export async function PATCH(
  req: NextRequest,
  ctx: { params: Promise<{ userId: string }> }
) {
  const gate = await requireRole('super_admin');
  if (gate.error) return gate.error;
  const session = gate.session!;
  const { userId } = await ctx.params;
  const body = await req.json();
  const suspend = Boolean(body.suspend);

  await connectDB();
  const admin = await User.findOne({ email: session.user?.email?.toLowerCase() });
  if (!admin) return NextResponse.json({ success: false, error: 'Admin not found' }, { status: 404 });

  const target = await User.findById(userId);
  if (!target || target.role === 'super_admin') {
    return NextResponse.json({ success: false, error: 'Cannot modify user' }, { status: 403 });
  }

  target.approvalStatus = suspend ? 'suspended' : 'approved';
  await target.save();

  await AdminAuditLog.create({
    adminId: admin._id,
    action: suspend ? 'suspend' : 'reinstate',
    targetUserId: target._id,
  });

  await notifyUser(target._id.toString(), {
    type: 'account_status',
    message: suspend
      ? 'Your SkillBridge account has been suspended.'
      : 'Your SkillBridge account has been reinstated.',
  });

  return NextResponse.json({ success: true, data: target });
}
