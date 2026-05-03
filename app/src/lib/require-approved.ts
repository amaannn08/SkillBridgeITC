import { NextResponse } from 'next/server';
import type { Session } from 'next-auth';
import connectDB from '@/lib/db';
import { User } from '@/models/User';

export async function requireApprovedSession(session: Session | null) {
  if (!session?.user?.email) {
    return { user: null, error: NextResponse.json({ success: false, error: 'Authentication required' }, { status: 401 }) };
  }
  await connectDB();
  const user = await User.findOne({ email: session.user.email.toLowerCase() });
  if (!user) {
    return { user: null, error: NextResponse.json({ success: false, error: 'User not found' }, { status: 404 }) };
  }
  if (user.approvalStatus !== 'approved' && user.role !== 'super_admin') {
    return { user: null, error: NextResponse.json({ success: false, error: 'Account not active' }, { status: 403 }) };
  }
  return { user, error: null as null };
}
