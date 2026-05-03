import Link from 'next/link';

export default function UnauthorizedPage() {
  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 24,
      background: 'var(--bg-base)',
    }}>
      <div className="fade-in" style={{ maxWidth: 480, width: '100%', textAlign: 'center' }}>
        <div style={{ fontSize: '4rem', marginBottom: 20 }}>🔒</div>
        <h1 style={{
          fontFamily: 'var(--font-plus-jakarta),sans-serif',
          fontSize: '1.75rem',
          fontWeight: 800,
          marginBottom: 12,
        }}>
          Access Denied
        </h1>
        <p style={{ color: 'var(--text-muted)', marginBottom: 36, lineHeight: 1.7, fontSize: '0.9375rem' }}>
          You don&apos;t have permission to view this page. This area is restricted to a specific role.
        </p>

        <div className="card" style={{ padding: '20px 24px', marginBottom: 28, textAlign: 'left' }}>
          <div style={{ fontWeight: 700, marginBottom: 12, fontSize: '0.9rem' }}>You may have landed here because:</div>
          <ul style={{ paddingLeft: 18, lineHeight: 2.1, color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
            <li>You accessed a URL meant for a different role</li>
            <li>Your session expired — try signing out and back in</li>
            <li>Your account was suspended</li>
          </ul>
        </div>

        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link href="/" className="btn btn-primary">Go to Home</Link>
          <Link href="/login" className="btn btn-secondary">Sign In Again</Link>
        </div>
      </div>
    </div>
  );
}
