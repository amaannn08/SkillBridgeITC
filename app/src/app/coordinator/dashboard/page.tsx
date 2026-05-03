'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function CoordinatorDashboardPage() {
  const [counts, setCounts] = useState({ batches: 0, apps: 0 });

  useEffect(() => {
    Promise.all([fetch('/api/batches'), fetch('/api/applications')])
      .then(async ([b, a]) => [await b.json(), await a.json()])
      .then(([bj, aj]) => {
        setCounts({
          batches: bj.success ? bj.data.length : 0,
          apps: aj.success ? aj.data.length : 0,
        });
      });
  }, []);

  return (
    <div>
      <h1 className="mb-8 text-2xl font-bold">Coordinator dashboard</h1>
      <div className="mb-8 grid gap-4 sm:grid-cols-2">
        <div className="card p-6">
          <div className="text-sm text-[var(--text-muted)]">Talent pool batches</div>
          <div className="mt-2 text-3xl font-bold">{counts.batches}</div>
        </div>
        <div className="card p-6">
          <div className="text-sm text-[var(--text-muted)]">Applications submitted</div>
          <div className="mt-2 text-3xl font-bold">{counts.apps}</div>
        </div>
      </div>
      <Link href="/coordinator/jobs" className="text-[#2563EB] font-semibold">
        Browse job requirements →
      </Link>
    </div>
  );
}
