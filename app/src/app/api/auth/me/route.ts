import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import connectDB from '@/lib/db';
import { User } from '@/models/User';

export async function GET() {
  const session = await auth();
  if (!session?.user?.email) {
    return NextResponse.json({ success: false, error: 'Authentication required' }, { status: 401 });
  }

  await connectDB();
  const profile = await User.findOne({ email: session.user.email.toLowerCase() })
    .populate('institutionId')
    .populate('companyId')
    .lean();

  return NextResponse.json({
    success: true,
    data: {
      session: {
        id: session.user.id,
        name: session.user.name,
        email: session.user.email,
        image: session.user.image,
        role: session.user.role,
        approvalStatus: session.user.approvalStatus,
        needsRegistration: session.user.needsRegistration,
        institutionId: session.user.institutionId,
        companyId: session.user.companyId,
      },
      profile,
    },
  });
}
