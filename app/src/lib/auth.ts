import NextAuth from 'next-auth';
import Google from 'next-auth/providers/google';
import Credentials from 'next-auth/providers/credentials';
import connectDB from '@/lib/db';
import { User } from '@/models/User';
import type { IUser } from '@/models/User';
import { authConfig } from '@/lib/auth.config';

const googleClientId =
  process.env.GOOGLE_CLIENT_ID || process.env.AUTH_GOOGLE_ID;
const googleClientSecret =
  process.env.GOOGLE_CLIENT_SECRET || process.env.AUTH_GOOGLE_SECRET;
const googleConfigured = !!googleClientId && !!googleClientSecret;

/** Local dev only — no password; uses seeded user email. Do not enable in production builds. */
const devCredentialsEnabled = process.env.NODE_ENV === 'development';

/**
 * Auth.js requires a secret to sign sessions. In production, set AUTH_SECRET (or NEXTAUTH_SECRET)
 * in Vercel/host env — e.g. `openssl rand -base64 32`.
 */
const authSecret =
  process.env.AUTH_SECRET ||
  process.env.NEXTAUTH_SECRET ||
  (process.env.NODE_ENV !== 'production'
    ? 'development-only-placeholder-secret-min-32-chars!!'
    : undefined);

const googleProviders = googleConfigured
  ? [
      Google({
        clientId: googleClientId!,
        clientSecret: googleClientSecret!,
      }),
    ]
  : [];

const devProviders = devCredentialsEnabled
  ? [
      Credentials({
        id: 'dev-credentials',
        name: 'Development',
        credentials: {
          email: { label: 'Email', type: 'email' },
        },
        async authorize(credentials) {
          const email = (credentials?.email as string)?.toLowerCase();
          if (!email) return null;
          await connectDB();
          const u = await User.findOne({ email });
          if (!u || u.approvalStatus !== 'approved') return null;
          return {
            id: u._id.toString(),
            name: u.name,
            email: u.email,
            role: u.role,
            approvalStatus: u.approvalStatus,
            institutionId: u.institutionId?.toString(),
            companyId: u.companyId?.toString(),
            image: u.profileImage ?? undefined,
          };
        },
      }),
    ]
  : [];

/**
 * Auth.js errors with "problem with the server configuration" if there are zero providers.
 * When Google isn't configured yet (e.g. fresh Vercel deploy), keep a no-op provider so
 * `/api/auth/session` returns 200 with no session instead of 500.
 */
const placeholderProviders =
  googleProviders.length === 0 && devProviders.length === 0
    ? [
        Credentials({
          id: 'oauth-not-configured',
          name: 'OAuthNotConfigured',
          credentials: {},
          authorize() {
            return null;
          },
        }),
      ]
    : [];

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  secret: authSecret,
  providers: [...googleProviders, ...devProviders, ...placeholderProviders],
  session: { strategy: 'jwt', maxAge: 30 * 24 * 60 * 60 },
  callbacks: {
    ...authConfig.callbacks,
    async jwt({ token, user, account, profile, trigger }) {
      // Credentials (dev)
      if (account?.provider === 'dev-credentials' && user) {
        token.needsRegistration = false;
        token.sub = user.id;
        token.role = (user as { role: IUser['role'] }).role;
        token.approvalStatus =
          (user as { approvalStatus?: IUser['approvalStatus'] }).approvalStatus ?? 'approved';
        token.institutionId = (user as { institutionId?: string }).institutionId;
        token.companyId = (user as { companyId?: string }).companyId;
        token.email = user.email ?? undefined;
        token.name = user.name ?? undefined;
        token.picture = user.image ?? undefined;
        return token;
      }

      if (account?.provider === 'google' && profile?.email) {
        try {
          await connectDB();
          const googleId = account.providerAccountId;
          const dbUser = await User.findOne({
            $or: [{ googleId }, { email: (profile.email as string).toLowerCase() }],
          });

          if (!dbUser) {
            token.needsRegistration = true;
            token.googleId = googleId;
            token.email = profile.email as string;
            token.name = profile.name as string;
            token.picture = profile.picture as string | undefined;
            token.sub = `pending:${googleId}`;
            delete token.role;
            delete token.approvalStatus;
            return token;
          }

          token.needsRegistration = false;
          token.sub = dbUser._id.toString();
          token.role = dbUser.role;
          token.approvalStatus = dbUser.approvalStatus;
          token.institutionId = dbUser.institutionId?.toString();
          token.companyId = dbUser.companyId?.toString();
          token.email = dbUser.email;
          token.name = dbUser.name;
          token.picture = dbUser.profileImage || (profile.picture as string | undefined);

          if (trigger === 'signIn' || trigger === 'update') {
            await User.findByIdAndUpdate(dbUser._id, { lastLoginAt: new Date() });
          }
        } catch (e) {
          console.error('JWT callback DB error:', e);
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = (token.sub as string) || '';
        session.user.needsRegistration = !!token.needsRegistration;
        if (token.role) {
          (session.user as { role: IUser['role'] }).role = token.role as IUser['role'];
        }
        if (token.approvalStatus) {
          (session.user as { approvalStatus: IUser['approvalStatus'] }).approvalStatus =
            token.approvalStatus as IUser['approvalStatus'];
        }
        session.user.institutionId = token.institutionId as string | undefined;
        session.user.companyId = token.companyId as string | undefined;
        if (token.picture) session.user.image = token.picture as string;
      }
      return session;
    },
  },
});
