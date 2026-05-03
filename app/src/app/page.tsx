import Link from 'next/link';
import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { HomeStats } from '@/components/HomeStats';

export default async function HomePage() {
  const session = await auth();
  if (session?.user?.needsRegistration) redirect('/register');
  if (session?.user?.approvalStatus === 'pending') redirect('/pending');
  if (session?.user?.approvalStatus === 'rejected' || session?.user?.approvalStatus === 'suspended') redirect('/rejected');
  if (session?.user?.approvalStatus === 'approved' && session.user.role) {
    if (session.user.role === 'super_admin') redirect('/admin/dashboard');
    if (session.user.role === 'coordinator') redirect('/coordinator/dashboard');
    if (session.user.role === 'recruiter') redirect('/recruiter/dashboard');
  }

  return (
    <main style={{ minHeight: '100vh', background: 'var(--bg-base)' }}>
      {/* Nav */}
      <nav style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 32px', borderBottom: '1px solid var(--border)', background: 'rgba(13,17,23,0.9)', backdropFilter: 'blur(12px)', position: 'sticky', top: 0, zIndex: 100 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ width: 32, height: 32, borderRadius: 8, background: 'var(--grad-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.9rem' }}>⚡</div>
          <span style={{ fontFamily: 'var(--font-plus-jakarta),sans-serif', fontWeight: 800, fontSize: '1.1rem', color: 'var(--text-primary)' }}>SkillBridge</span>
          <span className="badge badge-navy" style={{ marginLeft: 4 }}>Government Portal</span>
        </div>
        <div style={{ display: 'flex', gap: 12 }}>
          <Link href="/login" className="btn btn-ghost btn-sm">Sign In</Link>
          <Link href="/register" className="btn btn-primary btn-sm">Register</Link>
        </div>
      </nav>

      {/* Hero */}
      <section style={{ padding: '80px 32px 60px', textAlign: 'center', background: 'radial-gradient(ellipse 80% 60% at 50% -10%, rgba(37,99,235,0.15) 0%, transparent 70%)' }}>
        <div className="fade-in" style={{ maxWidth: 700, margin: '0 auto' }}>
          <div className="badge badge-blue" style={{ marginBottom: 20, fontSize: '0.8rem', padding: '5px 14px' }}>
            🇮🇳 &nbsp;Government Placement Coordination Platform
          </div>
          <h1 style={{ fontFamily: 'var(--font-plus-jakarta),sans-serif', fontSize: 'clamp(2.5rem,5vw,3.75rem)', fontWeight: 900, lineHeight: 1.1, marginBottom: 24, background: 'linear-gradient(135deg,#f1f5f9 0%,#60a5fa 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            Connecting Institutions<br />with Industry
          </h1>
          <p style={{ fontSize: '1.125rem', color: 'var(--text-secondary)', maxWidth: 560, margin: '0 auto 40px', lineHeight: 1.7 }}>
            SkillBridge digitises the placement coordination pipeline between government ITI, polytechnic & engineering colleges and industry recruiters — structured, auditable, and state-scoped.
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 14, justifyContent: 'center' }}>
            <Link href="/register?role=coordinator" className="btn btn-primary btn-lg">
              🎓 &nbsp;Register as Coordinator
            </Link>
            <Link href="/register?role=recruiter" className="btn btn-secondary btn-lg">
              🏢 &nbsp;Register as Recruiter
            </Link>
          </div>
        </div>

        <HomeStats />
      </section>

      {/* Features */}
      <section style={{ padding: '60px 32px', maxWidth: 1100, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <h2 style={{ fontSize: '1.875rem', fontWeight: 800, marginBottom: 12 }}>Built for Government-Grade Workflows</h2>
          <p style={{ color: 'var(--text-muted)', maxWidth: 480, margin: '0 auto' }}>Every feature designed around the real needs of faculty coordinators and industry HR teams.</p>
        </div>
        <div className="grid-3" style={{ gap: 24 }}>
          {[
            { icon: '🗂️', title: 'Structured Talent Pools', desc: 'Coordinators create organised batches of students with structured data — qualification, CGPA, branch, resumes — all in one place.' },
            { icon: '🎯', title: 'State-Scoped Job Visibility', desc: 'Job requirements are automatically visible to coordinators in the matching state, or pan-India if the recruiter chooses.' },
            { icon: '📊', title: 'Real-time Status Tracking', desc: 'Recruiters shortlist, reject, or select students directly in the portal. Coordinators receive instant notifications on every change.' },
            { icon: '🔒', title: 'Admin Approval Workflow', desc: 'Every user — coordinator or recruiter — must be verified by the Super Admin before accessing the platform.' },
            { icon: '📄', title: 'Bulk Resume Downloads', desc: 'Recruiters can download all resumes for an application batch as a ZIP file with a single click.' },
            { icon: '📈', title: 'Platform Analytics', desc: 'Government administrators get a real-time view of placements across all states, sectors, and qualification levels.' },
          ].map((f) => (
            <div key={f.title} className="card" style={{ padding: '24px' }}>
              <div style={{ fontSize: '1.75rem', marginBottom: 14 }}>{f.icon}</div>
              <div style={{ fontWeight: 700, marginBottom: 8, fontSize: '1rem' }}>{f.title}</div>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: '60px 32px', textAlign: 'center', background: 'linear-gradient(135deg, rgba(30,58,95,0.3) 0%, rgba(37,99,235,0.15) 100%)', borderTop: '1px solid var(--border)' }}>
        <h2 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: 12 }}>Ready to modernise placement coordination?</h2>
        <p style={{ color: 'var(--text-muted)', marginBottom: 32 }}>Join institutions and companies already using SkillBridge.</p>
        <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link href="/register" className="btn btn-primary btn-lg">Get Started</Link>
          <Link href="/login" className="btn btn-secondary btn-lg">Sign In →</Link>
        </div>
      </section>

      <footer style={{ textAlign: 'center', padding: '24px', color: 'var(--text-muted)', fontSize: '0.8rem', borderTop: '1px solid var(--border)' }}>
        SkillBridge — Government Placement Coordination Portal &nbsp;·&nbsp; Built for India
      </footer>
    </main>
  );
}
