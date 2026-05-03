import Link from 'next/link';
import { auth } from '@/lib/auth';

export default async function RejectedPage() {
  const session = await auth();
  const reason = (session?.user as { rejectionReason?: string })?.rejectionReason;

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24, background: 'var(--bg-base)' }}>
      <div className="fade-in" style={{ maxWidth: 520, width: '100%', textAlign: 'center' }}>
        <div style={{ fontSize: '3.5rem', marginBottom: 20 }}>🚫</div>
        <h1 style={{ fontFamily: 'var(--font-plus-jakarta),sans-serif', fontSize: '1.75rem', fontWeight: 800, marginBottom: 12 }}>
          Access Not Granted
        </h1>
        <p style={{ color: 'var(--text-muted)', marginBottom: 28, lineHeight: 1.7 }}>
          {session?.user?.approvalStatus === 'suspended'
            ? 'Your account has been suspended by the platform administrator. Please contact support if you believe this is an error.'
            : 'Your registration request was not approved. Please review the reason below and contact support if needed.'
          }
        </p>

        {reason && (
          <div className="alert alert-danger" style={{ textAlign: 'left', marginBottom: 24 }}>
            <span>ℹ️</span>
            <div>
              <strong style={{ display: 'block', marginBottom: 4 }}>Reason provided by Admin:</strong>
              {reason}
            </div>
          </div>
        )}

        <div className="card" style={{ padding: '20px', marginBottom: 24, textAlign: 'left' }}>
          <div style={{ fontWeight: 700, marginBottom: 12 }}>What can you do?</div>
          <ul style={{ paddingLeft: 18, lineHeight: 2, color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
            <li>Review the rejection reason above carefully</li>
            <li>Correct any errors and re-register with accurate information</li>
            <li>Contact <a href="mailto:support@skillbridge.gov.in" style={{ color: 'var(--primary-light)' }}>support@skillbridge.gov.in</a> for assistance</li>
          </ul>
        </div>

        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link href="/register" className="btn btn-primary">Re-register</Link>
          <Link href="/login" className="btn btn-secondary">Back to Sign In</Link>
        </div>
      </div>
    </div>
  );
}
