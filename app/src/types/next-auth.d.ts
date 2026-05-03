import type { DefaultSession } from 'next-auth';
import type { UserRole, ApprovalStatus } from '@/models/User';

declare module 'next-auth' {
  interface Session {
    user: DefaultSession['user'] & {
      id: string;
      role?: UserRole;
      approvalStatus?: ApprovalStatus;
      institutionId?: string;
      companyId?: string;
      needsRegistration?: boolean;
    };
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    role?: UserRole;
    approvalStatus?: ApprovalStatus;
    institutionId?: string;
    companyId?: string;
    needsRegistration?: boolean;
    googleId?: string;
    picture?: string;
  }
}
