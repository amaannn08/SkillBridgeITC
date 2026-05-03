'use client';

import { useState, FormEvent, useEffect } from 'react';
import { useSession, signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { INDIAN_STATES_AND_UTS } from '@/lib/constants/states';
import { INDUSTRY_SECTORS } from '@/lib/constants/sectors';
import { toast } from 'sonner';

type RegRole = 'coordinator' | 'recruiter';

export default function RegisterPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [role, setRole] = useState<RegRole | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!session?.user) return;
    if (session.user.needsRegistration) return;
    const ap = session.user.approvalStatus;
    const r = session.user.role;
    if (ap === 'pending') router.replace('/pending');
    else if (ap === 'approved') {
      if (r === 'super_admin') router.replace('/admin/dashboard');
      else if (r === 'coordinator') router.replace('/coordinator/dashboard');
      else if (r === 'recruiter') router.replace('/recruiter/dashboard');
    } else if (ap === 'rejected' || ap === 'suspended') router.replace('/rejected');
  }, [session, router]);

  if (status === 'loading') {
    return <div className="flex min-h-screen items-center justify-center text-[var(--text-muted)]">Loading…</div>;
  }

  if (!session?.user) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 px-6">
        <p>Please sign in with Google first.</p>
        <button type="button" className="btn btn-primary" onClick={() => signIn('google', { callbackUrl: '/register' })}>
          Sign in with Google
        </button>
        <Link href="/login" className="text-sm text-[var(--primary-light)]">
          Back to login
        </Link>
      </div>
    );
  }

  if (!session.user.needsRegistration) {
    return (
      <div className="flex min-h-screen items-center justify-center text-[var(--text-muted)]">Redirecting…</div>
    );
  }

  async function submitCoordinator(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    setLoading(true);
    try {
      const res = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          role: 'coordinator',
          fullName: fd.get('fullName'),
          designation: fd.get('designation'),
          institutionName: fd.get('institutionName'),
          institutionType: fd.get('institutionType'),
          state: fd.get('state'),
          district: fd.get('district'),
          aicteCode: fd.get('aicteCode'),
          phone: fd.get('phone'),
        }),
      });
      const j = await res.json();
      if (!res.ok) throw new Error(j.error || 'Failed');
      toast.success('Registration submitted. Sign in again to refresh your session.');
      await signIn('google', { callbackUrl: '/pending' });
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Error');
    } finally {
      setLoading(false);
    }
  }

  async function submitRecruiter(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const domainFromEmail = session?.user?.email?.split('@')[1] || '';
    setLoading(true);
    try {
      const res = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          role: 'recruiter',
          fullName: fd.get('fullName'),
          designation: fd.get('designation'),
          companyName: fd.get('companyName'),
          companyEmailDomain: fd.get('companyEmailDomain') || domainFromEmail,
          companyWebsite: fd.get('companyWebsite') || '',
          sector: fd.get('sector'),
          phone: fd.get('phone'),
        }),
      });
      const j = await res.json();
      if (!res.ok) throw new Error(j.error || 'Failed');
      toast.success('Registration submitted. Sign in again to refresh your session.');
      await signIn('google', { callbackUrl: '/pending' });
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Error');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-lg px-6 py-16">
      <h1 className="mb-2 text-2xl font-bold">Complete registration</h1>
      <p className="mb-8 text-sm text-[var(--text-muted)]">Signed in as {session.user.email}</p>

      {!role && (
        <div className="grid gap-4">
          <button type="button" className="card p-6 text-left hover:border-[var(--primary)]" onClick={() => setRole('coordinator')}>
            <div className="font-semibold">I represent a Government College / ITI</div>
            <div className="mt-1 text-sm text-[var(--text-muted)]">Faculty placement coordinator</div>
          </button>
          <button type="button" className="card p-6 text-left hover:border-[var(--primary)]" onClick={() => setRole('recruiter')}>
            <div className="font-semibold">I represent a Company / Industry</div>
            <div className="mt-1 text-sm text-[var(--text-muted)]">Industry recruiter</div>
          </button>
        </div>
      )}

      {role === 'coordinator' && (
        <form onSubmit={submitCoordinator} className="flex flex-col gap-4">
          <button type="button" className="text-sm text-[var(--primary-light)]" onClick={() => setRole(null)}>
            ← Back
          </button>
          <input name="fullName" required placeholder="Full name" className="form-input" defaultValue={session.user.name || ''} />
          <input name="designation" required placeholder="Designation" className="form-input" />
          <input name="institutionName" required placeholder="Institution name" className="form-input" />
          <select name="institutionType" required className="form-input">
            <option value="ITI">ITI</option>
            <option value="Polytechnic">Polytechnic</option>
            <option value="Engineering College">Engineering College</option>
            <option value="University">University</option>
            <option value="Other">Other</option>
          </select>
          <select name="state" required className="form-input">
            {INDIAN_STATES_AND_UTS.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
          <input name="district" required placeholder="District" className="form-input" />
          <input name="aicteCode" required placeholder="AICTE / DTE code" className="form-input" />
          <input name="phone" required placeholder="Official phone" className="form-input" />
          <button type="submit" className="btn btn-primary mt-2 justify-center py-3" disabled={loading}>
            {loading ? 'Submitting…' : 'Submit for approval'}
          </button>
        </form>
      )}

      {role === 'recruiter' && (
        <form onSubmit={submitRecruiter} className="flex flex-col gap-4">
          <button type="button" className="text-sm text-[var(--primary-light)]" onClick={() => setRole(null)}>
            ← Back
          </button>
          <input name="fullName" required placeholder="Full name" className="form-input" defaultValue={session.user.name || ''} />
          <input name="designation" required placeholder="Designation" className="form-input" />
          <input name="companyName" required placeholder="Company name" className="form-input" />
          <input
            name="companyEmailDomain"
            placeholder="Email domain (e.g. itcltd.com)"
            className="form-input"
            defaultValue={session.user.email?.split('@')[1] || ''}
          />
          <input name="companyWebsite" placeholder="Company website (optional)" className="form-input" />
          <select name="sector" required className="form-input">
            {INDUSTRY_SECTORS.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
          <input name="phone" required placeholder="Official phone" className="form-input" />
          <button type="submit" className="btn btn-primary mt-2 justify-center py-3" disabled={loading}>
            {loading ? 'Submitting…' : 'Submit for approval'}
          </button>
        </form>
      )}

      <p className="mt-8 text-center text-sm text-[var(--text-muted)]">
        <Link href="/login">Back to login</Link>
      </p>
    </div>
  );
}
