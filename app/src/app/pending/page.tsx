import Link from 'next/link';

export default function PendingPage() {
  return (
    <div className="mx-auto max-w-md px-6 py-24 text-center">
      <h1 className="mb-4 text-2xl font-bold">Registration under review</h1>
      <p className="mb-6 text-[var(--text-secondary)]">
        Your registration is under review. You will receive an email when a Super Admin approves your account.
      </p>
      <Link href="/login" className="text-sm font-semibold text-[#2563EB]">
        Back to sign in
      </Link>
    </div>
  );
}
