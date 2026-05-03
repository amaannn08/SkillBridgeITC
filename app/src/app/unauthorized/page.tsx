import Link from 'next/link';

export default function UnauthorizedPage() {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-base)', flexDirection: 'column', gap: '16px', textAlign: 'center', padding: '24px' }}>
      <div style={{ fontSize: '4rem' }}>🔒</div>
      <h1 style={{ fontSize: '2rem' }}>Access Denied</h1>
      <p style={{ color: 'var(--text-muted)', maxWidth: '400px' }}>
        You do not have permission to view this page. Please log in with an authorized account.
      </p>
      <Link href="/login" className="btn btn-primary" style={{ marginTop: '8px' }}>← Back to Login</Link>
    </div>
  );
}
