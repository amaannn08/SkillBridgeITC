import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import { User } from '@/models/User';
import { Company } from '@/models/Company';
import { requireRole } from '@/lib/api-auth';
import { AdminAuditLog } from '@/models/AdminAuditLog';
import { notifyUser } from '@/lib/notify';
import { sendEmail } from '@/lib/email';

export async function PATCH(
  req: NextRequest,
  ctx: { params: Promise<{ userId: string }> }
) {
  const gate = await requireRole('super_admin');
  if (gate.error) return gate.error;
  const session = gate.session!;
  const { userId } = await ctx.params;

  const body = await req.json();
  const action = body.action as 'approve' | 'reject';
  if (!['approve', 'reject'].includes(action)) {
    return NextResponse.json({ success: false, error: 'Invalid action' }, { status: 422 });
  }

  await connectDB();
  const admin = await User.findOne({ email: session.user?.email?.toLowerCase() });
  if (!admin) return NextResponse.json({ success: false, error: 'Admin not found' }, { status: 404 });

  const target = await User.findById(userId);
  if (!target) return NextResponse.json({ success: false, error: 'User not found' }, { status: 404 });

  if (action === 'approve') {
    target.approvalStatus = 'approved';
    target.approvedBy = admin._id;
    target.approvedAt = new Date();
    if (target.role === 'recruiter' && target.companyId) {
      await Company.findByIdAndUpdate(target.companyId, { verifiedAt: new Date() });
    }
    await target.save();
    await notifyUser(target._id.toString(), {
      type: 'registration_approved',
      message: 'Your SkillBridge account has been approved. You can sign in.',
      link: '/login',
    });
    await sendEmail({
      to: target.email,
      subject: '[SkillBridge] Registration approved',
      html: '<p>Your account is approved. Sign in with Google to continue.</p>',
    });
  } else {
    const reason = (body.rejectionReason as string)?.trim();
    if (!reason) {
      return NextResponse.json({ success: false, error: 'rejectionReason required' }, { status: 422 });
    }
    target.approvalStatus = 'rejected';
    target.rejectionReason = reason;
    await target.save();
    await sendEmail({
      to: target.email,
      subject: '[SkillBridge] Registration update',
      html: `<p>Your registration was not approved.</p><p>${reason}</p>`,
    });
  }

  await AdminAuditLog.create({
    adminId: admin._id,
    action: `approval_${action}`,
    targetUserId: target._id,
    meta: { email: target.email },
  });

  return NextResponse.json({ success: true, data: target });
}
