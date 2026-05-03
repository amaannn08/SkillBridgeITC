import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import connectDB from '@/lib/db';
import { Notification } from '@/models/Notification';
import { User } from '@/models/User';

export async function PATCH(
  _req: Request,
  ctx: { params: Promise<{ notifId: string }> }
) {
  const session = await auth();
  if (!session?.user?.email) {
    return NextResponse.json({ success: false, error: 'Authentication required' }, { status: 401 });
  }
  const { notifId } = await ctx.params;
  await connectDB();
  const user = await User.findOne({ email: session.user.email.toLowerCase() });
  if (!user) return NextResponse.json({ success: false, error: 'User not found' }, { status: 404 });
  await Notification.updateOne({ _id: notifId, userId: user._id }, { read: true });
  return NextResponse.json({ success: true });
}
