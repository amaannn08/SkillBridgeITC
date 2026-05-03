import Link from 'next/link';
import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { HomeStats } from '@/components/HomeStats';

export default async function HomePage() {
  const session = await auth();
  if (session?.user?.needsRegistration) redirect('/register');
  if (session?.user?.approvalStatus === 'pending') redirect('/pending');
  if (session?.user?.approvalStatus === 'rejected' || session?.user?.approvalStatus === 'suspended') {
    redirect('/rejected');
  }
  if (session?.user?.approvalStatus === 'approved' && session.user.role) {
    if (session.user.role === 'super_admin') redirect('/admin/dashboard');
    if (session.user.role === 'coordinator') redirect('/coordinator/dashboard');
    if (session.user.role === 'recruiter') redirect('/recruiter/dashboard');
  }

  return (
    <main className="min-h-screen" style={{ background: 'var(--bg-base)' }}>
      <section className="px-6 py-20 text-center">
        <p className="badge badge-blue mx-auto mb-4 inline-block">Government placement coordination</p>
        <h1 className="mb-4 text-4xl font-extrabold tracking-tight text-sky-400 md:text-5xl">SkillBridge</h1>
        <p className="mx-auto mb-10 max-w-xl text-lg text-[var(--text-secondary)]">
          Connect government ITI, polytechnic, and engineering institutions with industry recruiters—structured batches,
          auditable applications, and state-scoped job visibility.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Link href="/register" className="btn btn-primary btn-lg">
            Register as coordinator
          </Link>
          <Link href="/register" className="btn btn-secondary btn-lg">
            Register as recruiter
          </Link>
          <Link href="/login" className="btn btn-secondary btn-lg">
            Login
          </Link>
        </div>
        <HomeStats />
      </section>
    </main>
  );
}
