'use client';

import { Suspense, useState } from 'react';
import { signIn } from 'next-auth/react';
import Link from 'next/link';

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="flex min-h-screen items-center justify-center text-[var(--text-muted)]">Loading…</div>}>
      <LoginInner />
    </Suspense>
  );
}

function LoginInner() {
  const [email, setEmail] = useState('');
  const devAuth = process.env.NODE_ENV === 'development';

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-6" style={{ background: 'var(--bg-base)' }}>
      <div className="glass fade-in w-full max-w-md rounded-[var(--radius-xl)] p-10">
        <h1 className="mb-2 text-center font-[family-name:var(--font)] text-2xl font-bold">SkillBridge</h1>
        <p className="mb-8 text-center text-sm text-[var(--text-muted)]">Sign in with Google (required for production)</p>

        <button
          type="button"
          className="btn btn-primary mb-6 w-full justify-center py-3"
          onClick={() => signIn('google', { callbackUrl: '/' })}
        >
          Continue with Google
        </button>

        {devAuth && (
          <form
            className="border-t border-[var(--border)] pt-6"
            onSubmit={(e) => {
              e.preventDefault();
              signIn('dev-credentials', { email, callbackUrl: '/', redirect: true });
            }}
          >
            <p className="mb-3 text-xs text-[var(--text-muted)]">Dev only — seed admin then enter email</p>
            <input
              className="form-input mb-3 w-full"
              placeholder="admin@skillbridge.gov.in"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
            />
            <button type="submit" className="btn btn-secondary w-full justify-center py-2 text-sm">
              Dev sign-in (no password)
            </button>
          </form>
        )}

        <p className="mt-8 text-center text-sm text-[var(--text-muted)]">
          Need an account?{' '}
          <Link href="/register" className="font-semibold text-[var(--primary-light)]">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}
