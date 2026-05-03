import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import connectDB from '@/lib/db';
import { Notification } from '@/models/Notification';
import { User } from '@/models/User';

export async function GET() {
  const session = await auth();
  if (!session?.user?.email) {
    return NextResponse.json({ success: false, error: 'Authentication required' }, { status: 401 });
  }
  await connectDB();
  const user = await User.findOne({ email: session.user.email.toLowerCase() });
  if (!user) return NextResponse.json({ success: true, data: [] });
  const items = await Notification.find({ userId: user._id }).sort({ createdAt: -1 }).limit(50).lean();
  return NextResponse.json({ success: true, data: items });
}
