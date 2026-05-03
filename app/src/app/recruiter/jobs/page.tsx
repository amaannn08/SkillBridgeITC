'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function RecruiterJobsPage() {
  const [jobs, setJobs] = useState<Record<string, unknown>[]>([]);

  useEffect(() => {
    fetch('/api/jobs')
      .then((r) => r.json())
      .then((j) => j.success && setJobs(j.data));
  }, []);

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Job requirements</h1>
        <Link href="/recruiter/jobs/new" className="btn btn-primary py-2 text-sm">
          Post new
        </Link>
      </div>
      <div className="flex flex-col gap-3">
        {jobs.map((job: Record<string, unknown>) => (
          <div key={String(job._id)} className="card flex flex-wrap items-center justify-between gap-3 p-4">
            <div>
              <div className="font-semibold">{String(job.title)}</div>
              <div className="text-sm text-[var(--text-muted)]">
                {String(job.status)} · deadline{' '}
                {job.applicationDeadline ? new Date(String(job.applicationDeadline)).toLocaleDateString() : '—'}
              </div>
            </div>
            <Link href={`/recruiter/jobs/${job._id}/applications`} className="text-sm font-semibold text-[#2563EB]">
              Applications →
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
