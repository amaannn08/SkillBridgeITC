'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function CoordinatorJobsPage() {
  const [jobs, setJobs] = useState<Record<string, unknown>[]>([]);

  useEffect(() => {
    fetch('/api/jobs')
      .then((r) => r.json())
      .then((j) => j.success && setJobs(j.data));
  }, []);

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold">Open job requirements</h1>
      <div className="grid gap-4 md:grid-cols-2">
        {jobs.map((job: Record<string, unknown>) => (
          <Link key={String(job._id)} href={`/coordinator/jobs/${job._id}`} className="card block p-5 hover:border-[#2563EB]">
            <div className="font-semibold">{String(job.title)}</div>
            <div className="mt-1 text-sm text-[var(--text-muted)]">{String(job.location)}</div>
            <div className="mt-2 text-xs text-[var(--text-muted)]">
              Deadline: {job.applicationDeadline ? new Date(String(job.applicationDeadline)).toLocaleDateString() : '—'}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
