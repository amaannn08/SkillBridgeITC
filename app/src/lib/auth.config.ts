import type { NextAuthConfig } from 'next-auth';

/**
 * Edge-compatible auth config — no mongoose imports.
 * JWT/session callbacks live in auth.ts (Node runtime).
 */
export const authConfig: NextAuthConfig = {
  providers: [],
  trustHost: true,
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const path = nextUrl.pathname;
      const isLoggedIn = !!auth?.user;
      const role = (auth?.user as { role?: string } | undefined)?.role;
      const approvalStatus = (auth?.user as { approvalStatus?: string } | undefined)
        ?.approvalStatus;
      const needsRegistration = (auth?.user as { needsRegistration?: boolean } | undefined)
        ?.needsRegistration;

      const publicPaths = [
        '/',
        '/login',
        '/register',
        '/pending',
        '/rejected',
        '/unauthorized',
      ];
      const isPublic =
        publicPaths.some((p) => path === p) ||
        path.startsWith('/api/auth') ||
        path === '/api/register' ||
        path === '/api/platform-stats' ||
        path === '/api/statistics' ||
        path === '/api/vacancies' ||
        path === '/api/map' ||
        path.startsWith('/api/cron');
      if (isPublic) return true;

      if (!isLoggedIn) return false;

      if (needsRegistration) {
        return path === '/register';
      }

      if (approvalStatus === 'pending') {
        return path === '/pending';
      }

      if (approvalStatus === 'rejected' || approvalStatus === 'suspended') {
        return path === '/rejected' || path === '/unauthorized';
      }

      if (path.startsWith('/api/admin')) {
        return role === 'super_admin';
      }

      const rolePrefix: [string, string][] = [
        ['/admin', 'super_admin'],
        ['/coordinator', 'coordinator'],
        ['/recruiter', 'recruiter'],
      ];

      for (const [prefix, required] of rolePrefix) {
        if (path.startsWith(prefix)) {
          return role === required;
        }
      }

      return true;
    },
  },
  pages: { signIn: '/login', error: '/login' },
};
