import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';

/**
 * POST-login redirect handler.
 * NextAuth sends users here after sign-in (callbackUrl).
 * We read the JWT role and send them to the correct dashboard.
 */
export async function GET() {
  const session = await auth();
  const user = session?.user as {
    role?: string;
    approvalStatus?: string;
    needsRegistration?: boolean;
  } | undefined;

  if (!user) return NextResponse.redirect(new URL('/login', process.env.NEXTAUTH_URL || 'http://localhost:3000'));

  const base = process.env.NEXTAUTH_URL || 'http://localhost:3000';

  if (user.needsRegistration) return NextResponse.redirect(new URL('/register', base));
  if (user.approvalStatus === 'pending') return NextResponse.redirect(new URL('/pending', base));
  if (user.approvalStatus === 'rejected' || user.approvalStatus === 'suspended') return NextResponse.redirect(new URL('/rejected', base));

  switch (user.role) {
    case 'super_admin': return NextResponse.redirect(new URL('/admin/dashboard', base));
    case 'recruiter':   return NextResponse.redirect(new URL('/recruiter/dashboard', base));
    case 'coordinator': return NextResponse.redirect(new URL('/coordinator/dashboard', base));
    default:            return NextResponse.redirect(new URL('/register', base));
  }
}
