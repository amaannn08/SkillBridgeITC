'use client';

import { useState, FormEvent, useEffect } from 'react';
import { useSession, signIn } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { INDIAN_STATES_AND_UTS } from '@/lib/constants/states';
import { INDUSTRY_SECTORS } from '@/lib/constants/sectors';
import { toast } from 'sonner';
import { Suspense } from 'react';

type RegRole = 'coordinator' | 'recruiter';

export default function RegisterPage() {
  return (
    <Suspense fallback={<div style={{ display: 'flex', minHeight: '100vh', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>Loading…</div>}>
      <RegisterInner />
    </Suspense>
  );
}

function RegisterInner() {
  const router = useRouter();
  const params = useSearchParams();
  const { data: session, status } = useSession();
  const [role, setRole] = useState<RegRole | null>((params.get('role') as RegRole) || null);
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
    return <div style={{ display: 'flex', minHeight: '100vh', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>Loading…</div>;
  }

  if (!session?.user) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16, padding: 24, background: 'var(--bg-base)' }}>
        <div style={{ fontSize: '2.5rem' }}>🔐</div>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 700 }}>Sign in required</h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Please sign in with Google to continue registration.</p>
        <button type="button" className="btn btn-primary btn-lg" onClick={() => signIn('google', { callbackUrl: '/register' })}>
          Continue with Google
        </button>
        <Link href="/login" style={{ fontSize: '0.875rem', color: 'var(--primary-light)', textDecoration: 'none' }}>Back to Sign In</Link>
      </div>
    );
  }

  if (!session.user.needsRegistration) {
    return <div style={{ display: 'flex', minHeight: '100vh', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>Redirecting…</div>;
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
      if (!res.ok) throw new Error(j.error || 'Submission failed');
      toast.success('Registration submitted! Redirecting…');
      await signIn('google', { callbackUrl: '/pending' });
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Error submitting registration');
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
      if (!res.ok) throw new Error(j.error || 'Submission failed');
      toast.success('Registration submitted! Redirecting…');
      await signIn('google', { callbackUrl: '/pending' });
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Error submitting registration');
    } finally {
      setLoading(false);
    }
  }

  const step = role ? 2 : 1;

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24, background: 'radial-gradient(ellipse 70% 50% at 50% -10%, rgba(37,99,235,0.1) 0%, transparent 60%)' }}>
      <div style={{ width: '100%', maxWidth: 560 }} className="fade-in">
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <Link href="/" style={{ textDecoration: 'none' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
              <div style={{ width: 32, height: 32, borderRadius: 8, background: 'var(--grad-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.9rem' }}>⚡</div>
              <span style={{ fontFamily: 'var(--font-plus-jakarta),sans-serif', fontWeight: 800, fontSize: '1.1rem', color: 'var(--text-primary)' }}>SkillBridge</span>
            </div>
          </Link>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: 6 }}>Create your account</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Signed in as <strong style={{ color: 'var(--text-secondary)' }}>{session.user.email}</strong></p>
        </div>

        {/* Step indicator */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 0, marginBottom: 28, padding: '0 20px' }}>
          {['Choose Role', 'Fill Details'].map((s, i) => (
            <div key={s} style={{ flex: 1, display: 'flex', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
                <div style={{
                  width: 28, height: 28, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '0.78rem', fontWeight: 700,
                  background: i + 1 < step ? 'var(--success)' : i + 1 === step ? 'var(--primary-mid)' : 'var(--bg-muted)',
                  color: i + 1 <= step ? '#fff' : 'var(--text-muted)',
                  transition: 'all 0.3s',
                }}>
                  {i + 1 < step ? '✓' : i + 1}
                </div>
                <span style={{ fontSize: '0.78rem', fontWeight: 600, color: i + 1 === step ? 'var(--text-primary)' : 'var(--text-muted)' }}>{s}</span>
              </div>
              {i === 0 && <div style={{ flex: 1, height: 2, background: step > 1 ? 'var(--success)' : 'var(--border)', margin: '0 10px', transition: 'background 0.3s' }} />}
            </div>
          ))}
        </div>

        {/* Step 1: Role selection */}
        {!role && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {[
              { role: 'coordinator' as RegRole, icon: '🎓', title: 'Faculty Placement Coordinator', desc: 'Represent a government college, ITI, polytechnic, or engineering institution. Manage talent pool batches and apply to job requirements.' },
              { role: 'recruiter' as RegRole, icon: '🏢', title: 'Industry Recruiter', desc: 'Represent a company. Post job requirements, review talent pool applications, and manage student shortlisting.' },
            ].map((r) => (
              <button
                key={r.role}
                type="button"
                className="card"
                style={{ padding: '24px', textAlign: 'left', cursor: 'pointer', border: '2px solid var(--border)', background: 'var(--bg-card)', transition: 'all 0.2s', display: 'flex', gap: 18, alignItems: 'flex-start' }}
                onClick={() => setRole(r.role)}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--primary-mid)'; (e.currentTarget as HTMLElement).style.background = 'var(--bg-card-hover)'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--border)'; (e.currentTarget as HTMLElement).style.background = 'var(--bg-card)'; }}
              >
                <div style={{ fontSize: '2rem', flexShrink: 0, marginTop: 2 }}>{r.icon}</div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '1.0625rem', marginBottom: 6 }}>{r.title}</div>
                  <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>{r.desc}</div>
                </div>
                <div style={{ marginLeft: 'auto', color: 'var(--text-muted)', fontSize: '1.2rem', alignSelf: 'center', flexShrink: 0 }}>›</div>
              </button>
            ))}
          </div>
        )}

        {/* Step 2: Coordinator form */}
        {role === 'coordinator' && (
          <div className="card" style={{ padding: '28px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 24 }}>
              <button type="button" className="btn btn-ghost btn-sm" onClick={() => setRole(null)}>← Back</button>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontSize: '1.2rem' }}>🎓</span>
                <span style={{ fontWeight: 700 }}>Faculty Coordinator Details</span>
              </div>
            </div>
            <form onSubmit={submitCoordinator} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div className="grid-2" style={{ gap: 14 }}>
                <div className="form-group">
                  <label className="form-label">Full Name <span className="required">*</span></label>
                  <input name="fullName" required className="form-input" defaultValue={session.user.name || ''} placeholder="Dr. Ramesh Kumar" />
                </div>
                <div className="form-group">
                  <label className="form-label">Designation <span className="required">*</span></label>
                  <input name="designation" required className="form-input" placeholder="Training & Placement Officer" />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Institution Name <span className="required">*</span></label>
                <input name="institutionName" required className="form-input" placeholder="Government ITI, Hyderabad" />
              </div>
              <div className="grid-2" style={{ gap: 14 }}>
                <div className="form-group">
                  <label className="form-label">Institution Type <span className="required">*</span></label>
                  <select name="institutionType" required className="form-select">
                    <option value="ITI">ITI</option>
                    <option value="Polytechnic">Polytechnic</option>
                    <option value="Engineering College">Engineering College</option>
                    <option value="University">University</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">State <span className="required">*</span></label>
                  <select name="state" required className="form-select">
                    {INDIAN_STATES_AND_UTS.map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
              </div>
              <div className="grid-2" style={{ gap: 14 }}>
                <div className="form-group">
                  <label className="form-label">District <span className="required">*</span></label>
                  <input name="district" required className="form-input" placeholder="Medak" />
                </div>
                <div className="form-group">
                  <label className="form-label">AICTE / DTE Code <span className="required">*</span></label>
                  <input name="aicteCode" required className="form-input" placeholder="TS123456" />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Official Phone <span className="required">*</span></label>
                <input name="phone" required className="form-input" placeholder="+91 98765 43210" type="tel" />
              </div>
              <button type="submit" className="btn btn-primary" style={{ justifyContent: 'center', padding: '13px', marginTop: 4, fontSize: '0.9375rem' }} disabled={loading}>
                {loading ? 'Submitting…' : '✓ Submit for Admin Approval'}
              </button>
            </form>
          </div>
        )}

        {/* Step 2: Recruiter form */}
        {role === 'recruiter' && (
          <div className="card" style={{ padding: '28px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 24 }}>
              <button type="button" className="btn btn-ghost btn-sm" onClick={() => setRole(null)}>← Back</button>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontSize: '1.2rem' }}>🏢</span>
                <span style={{ fontWeight: 700 }}>Industry Recruiter Details</span>
              </div>
            </div>
            <form onSubmit={submitRecruiter} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div className="grid-2" style={{ gap: 14 }}>
                <div className="form-group">
                  <label className="form-label">Full Name <span className="required">*</span></label>
                  <input name="fullName" required className="form-input" defaultValue={session.user.name || ''} placeholder="Priya Sharma" />
                </div>
                <div className="form-group">
                  <label className="form-label">Designation <span className="required">*</span></label>
                  <input name="designation" required className="form-input" placeholder="HR Manager" />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Company Name <span className="required">*</span></label>
                <input name="companyName" required className="form-input" placeholder="ITC Limited" />
              </div>
              <div className="grid-2" style={{ gap: 14 }}>
                <div className="form-group">
                  <label className="form-label">Email Domain <span className="required">*</span></label>
                  <input name="companyEmailDomain" className="form-input" defaultValue={session.user.email?.split('@')[1] || ''} placeholder="itcltd.com" />
                  <span className="form-hint">Auto-filled from your Google account</span>
                </div>
                <div className="form-group">
                  <label className="form-label">Sector <span className="required">*</span></label>
                  <select name="sector" required className="form-select">
                    {INDUSTRY_SECTORS.map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Company Website</label>
                <input name="companyWebsite" className="form-input" placeholder="https://www.itcltd.com" type="url" />
              </div>
              <div className="form-group">
                <label className="form-label">Official Phone <span className="required">*</span></label>
                <input name="phone" required className="form-input" placeholder="+91 98765 43210" type="tel" />
              </div>
              <button type="submit" className="btn btn-primary" style={{ justifyContent: 'center', padding: '13px', marginTop: 4, fontSize: '0.9375rem' }} disabled={loading}>
                {loading ? 'Submitting…' : '✓ Submit for Admin Approval'}
              </button>
            </form>
          </div>
        )}

        <p style={{ textAlign: 'center', marginTop: 20, fontSize: '0.8rem', color: 'var(--text-muted)' }}>
          Already approved?{' '}
          <Link href="/login" style={{ color: 'var(--primary-light)', textDecoration: 'none', fontWeight: 600 }}>Sign In</Link>
        </p>
      </div>
    </div>
  );
}
