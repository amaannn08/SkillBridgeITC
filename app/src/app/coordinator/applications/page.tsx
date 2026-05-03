'use client';

import { useEffect, useState } from 'react';

export default function CoordinatorApplicationsPage() {
  const [rows, setRows] = useState<Record<string, unknown>[]>([]);

  useEffect(() => {
    fetch('/api/applications')
      .then((r) => r.json())
      .then((j) => j.success && setRows(j.data));
  }, []);

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold">My applications</h1>
      <div className="flex flex-col gap-4">
        {rows.map((a: Record<string, unknown>) => {
          const job = a.jobRequirementId as Record<string, unknown> | undefined;
          const batch = a.talentPoolBatchId as Record<string, unknown> | undefined;
          return (
            <div key={String(a._id)} className="card p-4">
              <div className="font-semibold">{job ? String(job.title) : 'Job'}</div>
              <div className="text-sm text-[var(--text-muted)]">
                Batch: {batch ? String(batch.name) : '—'} · Status: {String(a.status)}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
