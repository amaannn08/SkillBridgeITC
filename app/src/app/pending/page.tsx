import Link from 'next/link';

export default function PendingPage() {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24, background: 'var(--bg-base)' }}>
      <div className="fade-in" style={{ maxWidth: 520, width: '100%', textAlign: 'center' }}>
        <div style={{ fontSize: '3.5rem', marginBottom: 20 }}>⏳</div>
        <h1 style={{ fontFamily: 'var(--font-plus-jakarta),sans-serif', fontSize: '1.75rem', fontWeight: 800, marginBottom: 12 }}>
          Registration Under Review
        </h1>
        <p style={{ color: 'var(--text-muted)', marginBottom: 40, lineHeight: 1.7, fontSize: '0.9375rem' }}>
          Your registration has been submitted successfully. A Super Admin will review your details and activate your account. You&apos;ll receive an email once approved.
        </p>

        {/* Timeline */}
        <div className="card" style={{ padding: '28px 20px', marginBottom: 32 }}>
          <div className="timeline">
            {[
              { label: 'Registered', step: 'completed' },
              { label: 'Under Review', step: 'active' },
              { label: 'Approved', step: '' },
              { label: 'Access Granted', step: '' },
            ].map((s, i) => (
              <div key={i} className={`timeline-step ${s.step}`}>
                <div className="timeline-dot">
                  {s.step === 'completed' ? '✓' : i + 1}
                </div>
                <div className="timeline-label">{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="alert alert-info" style={{ textAlign: 'left', marginBottom: 28 }}>
          <span style={{ fontSize: '1.1rem' }}>ℹ️</span>
          <div>Check your email for updates. Approvals typically happen within 1–2 business days.</div>
        </div>

        <Link href="/login" style={{ color: 'var(--primary-light)', fontWeight: 600, textDecoration: 'none', fontSize: '0.9rem' }}>
          ← Back to Sign In
        </Link>
      </div>
    </div>
  );
}
