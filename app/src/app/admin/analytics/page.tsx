'use client';

import { useEffect, useState } from 'react';

export default function AnalyticsPage() {
  const [data, setData] = useState<Record<string, unknown> | null>(null);

  useEffect(() => {
    fetch('/api/admin/analytics')
      .then((r) => r.json())
      .then((j) => j.success && setData(j.data));
  }, []);

  if (!data) return <p className="text-[var(--text-muted)]">Loading…</p>;

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold">Platform analytics</h1>
      <pre className="card overflow-auto p-4 text-xs">{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
}
