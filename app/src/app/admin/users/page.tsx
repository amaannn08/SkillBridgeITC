'use client';

import { useEffect, useState } from 'react';
import { toast } from 'sonner';

export default function UsersPage() {
  const [rows, setRows] = useState<Record<string, unknown>[]>([]);

  useEffect(() => {
    let cancelled = false;
    fetch('/api/admin/users')
      .then((r) => r.json())
      .then((j) => {
        if (!cancelled && j.success) setRows(j.data);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  async function toggleSuspend(id: string, suspend: boolean) {
    const res = await fetch(`/api/admin/users/${id}/suspend`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ suspend }),
    });
    if (!res.ok) toast.error('Failed');
    else {
      toast.success(suspend ? 'Suspended' : 'Reinstated');
      window.location.reload();
    }
  }

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold">Users</h1>
      <div className="flex flex-col gap-2">
        {rows.map((r: Record<string, unknown>) => {
          const id = String(r._id);
          const email = String(r.email);
          const role = String(r.role);
          const status = String(r.approvalStatus);
          return (
            <div key={id} className="card flex flex-wrap items-center justify-between gap-3 p-4">
              <div>
                <span className="font-medium">{email}</span>
                <span className="ml-3 text-sm text-[var(--text-muted)]">
                  {role} · {status}
                </span>
              </div>
              {role !== 'super_admin' && status !== 'pending' && (
                <button
                  type="button"
                  className="btn btn-secondary btn-sm py-1 text-xs"
                  onClick={() => toggleSuspend(id, status !== 'suspended')}
                >
                  {status === 'suspended' ? 'Reinstate' : 'Suspend'}
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
