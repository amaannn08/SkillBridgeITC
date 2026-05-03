'use client';

import { Suspense, useState } from 'react';
import { signIn } from 'next-auth/react';
import Link from 'next/link';

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="flex min-h-screen items-center justify-center" style={{ color: 'var(--text-muted)' }}>Loading…</div>}>
      <LoginInner />
    </Suspense>
  );
}

function LoginInner() {
  const [email, setEmail] = useState('');
  const [signingIn, setSigningIn] = useState(false);
  const devAuth = process.env.NODE_ENV === 'development';

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px', background: 'radial-gradient(ellipse 80% 60% at 50% -10%, rgba(37,99,235,0.12) 0%, transparent 60%)' }}>
      <div className="glass fade-in" style={{ width: '100%', maxWidth: 420, borderRadius: 'var(--radius-xl)', padding: '40px 36px' }}>
        {/* Brand */}
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{ width: 48, height: 48, borderRadius: 14, background: 'var(--grad-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.3rem', margin: '0 auto 14px', boxShadow: 'var(--shadow-glow)' }}>⚡</div>
          <h1 style={{ fontFamily: 'var(--font-plus-jakarta),sans-serif', fontSize: '1.5rem', fontWeight: 800, marginBottom: 6 }}>SkillBridge</h1>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>Government Placement Coordination Portal</p>
        </div>

        <button
          type="button"
          className="btn btn-primary"
          style={{ width: '100%', justifyContent: 'center', padding: '13px', fontSize: '0.9375rem', marginBottom: 16 }}
          onClick={() => { setSigningIn(true); signIn('google', { callbackUrl: '/api/auth/redirect' }); }}
          disabled={signingIn}
        >
          {signingIn ? <span className="spin" style={{ display: 'inline-block', fontSize: '0.9rem' }}>⟳</span> : ''}
          <svg width="18" height="18" viewBox="0 0 48 48" fill="none" style={{ flexShrink: 0 }}>
            <path d="M44.5 20H24v8.5h11.8C34.7 33.9 30.1 37 24 37c-7.2 0-13-5.8-13-13s5.8-13 13-13c3.1 0 5.9 1.1 8.1 2.9l6.4-6.4C34.6 5.1 29.6 3 24 3 12.4 3 3 12.4 3 24s9.4 21 21 21c10.5 0 20-7.6 20-21 0-1.4-.1-2.7-.5-4z" fill="#fff" opacity=".9"/>
          </svg>
          Continue with Google
        </button>

        {devAuth && (
          <div style={{ borderTop: '1px solid var(--border)', paddingTop: 20, marginTop: 4 }}>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: 12, textAlign: 'center', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              🛠 1-Click Demo Logins
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <button 
                type="button" 
                className="btn btn-secondary" 
                style={{ width: '100%', justifyContent: 'center' }}
                onClick={() => signIn('dev-credentials', { email: 'admin@test.com', callbackUrl: '/api/auth/redirect', redirect: true })}
              >
                🔐 Login as Super Admin
              </button>
              <button 
                type="button" 
                className="btn btn-secondary" 
                style={{ width: '100%', justifyContent: 'center' }}
                onClick={() => signIn('dev-credentials', { email: 'req@test.com', callbackUrl: '/api/auth/redirect', redirect: true })}
              >
                🏢 Login as Recruiter
              </button>
              <button 
                type="button" 
                className="btn btn-secondary" 
                style={{ width: '100%', justifyContent: 'center' }}
                onClick={() => signIn('dev-credentials', { email: 'coord@test.com', callbackUrl: '/api/auth/redirect', redirect: true })}
              >
                🏛️ Login as Coordinator
              </button>
            </div>
          </div>
        )}

        <p style={{ textAlign: 'center', marginTop: 28, fontSize: '0.875rem', color: 'var(--text-muted)' }}>
          Don&apos;t have an account?{' '}
          <Link href="/register" style={{ color: 'var(--primary-light)', fontWeight: 600, textDecoration: 'none' }}>Register here</Link>
        </p>
      </div>
    </div>
  );
}
