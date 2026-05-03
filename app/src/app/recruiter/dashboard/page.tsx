'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function RecruiterDashboardPage() {
  const [jobs, setJobs] = useState(0);
  const [apps, setApps] = useState(0);

  useEffect(() => {
    Promise.all([fetch('/api/jobs'), fetch('/api/applications')])
      .then(async ([j, a]) => [await j.json(), await a.json()])
      .then(([jj, aj]) => {
        setJobs(jj.success ? jj.data.length : 0);
        setApps(aj.success ? aj.data.length : 0);
      });
  }, []);

  return (
    <div>
      <h1 className="mb-8 text-2xl font-bold">Recruiter dashboard</h1>
      <div className="mb-8 grid gap-4 sm:grid-cols-2">
        <div className="card p-6">
          <div className="text-sm text-[var(--text-muted)]">My job postings</div>
          <div className="mt-2 text-3xl font-bold">{jobs}</div>
        </div>
        <div className="card p-6">
          <div className="text-sm text-[var(--text-muted)]">Applications received</div>
          <div className="mt-2 text-3xl font-bold">{apps}</div>
        </div>
      </div>
      <Link href="/recruiter/jobs/new" className="btn btn-primary inline-flex py-2">
        Post job requirement
      </Link>
    </div>
  );
}
