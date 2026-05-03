'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function BatchesPage() {
  const [rows, setRows] = useState<Record<string, unknown>[]>([]);

  useEffect(() => {
    fetch('/api/batches')
      .then((r) => r.json())
      .then((j) => j.success && setRows(j.data));
  }, []);

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Talent pool batches</h1>
        <Link href="/coordinator/batches/new" className="btn btn-primary py-2 text-sm">
          New batch
        </Link>
      </div>
      <div className="flex flex-col gap-3">
        {rows.map((b: Record<string, unknown>) => (
          <div key={String(b._id)} className="card p-4">
            <div className="font-semibold">{String(b.name)}</div>
            <div className="text-sm text-[var(--text-muted)]">
              {String(b.qualification)} · {String(b.branch)} · {String(b.status)} · {Number(b.totalStudents || 0)} students
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
