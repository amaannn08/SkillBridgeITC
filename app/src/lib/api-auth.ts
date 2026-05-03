import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import type { UserRole } from '@/models/User';

export async function requireAuth() {
  const session = await auth();
  if (!session?.user?.id) {
    return { session: null, error: NextResponse.json({ success: false, error: 'Authentication required' }, { status: 401 }) };
  }
  return { session, error: null };
}

export async function requireRole(allowed: UserRole | UserRole[]) {
  const r = await requireAuth();
  if (r.error) return { session: null, userDoc: null, error: r.error };
  const roles = Array.isArray(allowed) ? allowed : [allowed];
  const role = r.session!.user.role as UserRole | undefined;
  if (!role || !roles.includes(role)) {
    return {
      session: null,
      userDoc: null,
      error: NextResponse.json({ success: false, error: 'Insufficient permissions' }, { status: 403 }),
    };
  }
  return { session: r.session, error: null };
}
