import NextAuth from 'next-auth';
import { authConfig } from '@/lib/auth.config';

// Middleware uses ONLY the edge-safe config — no bcryptjs, no mongoose
export default NextAuth(authConfig).auth;

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|public/).*)'],
};
