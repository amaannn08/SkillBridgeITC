import Link from 'next/link';
import { auth } from '@/lib/auth';
import connectDB from '@/lib/db';
import { User } from '@/models/User';

export default async function RejectedPage() {
  const session = await auth();
  let reason: string | undefined;
  if (session?.user?.email) {
    await connectDB();
    const u = await User.findOne({ email: session.user.email.toLowerCase() }).lean();
    reason = u?.rejectionReason;
  }

  return (
    <div className="mx-auto max-w-md px-6 py-24 text-center">
      <h1 className="mb-4 text-2xl font-bold">Account not active</h1>
      <p className="mb-4 text-[var(--text-secondary)]">
        Your account is rejected or suspended. {reason ? `Note: ${reason}` : 'Contact the platform administrator.'}
      </p>
      <Link href="/login" className="text-sm font-semibold text-[#2563EB]">
        Back to sign in
      </Link>
    </div>
  );
}
