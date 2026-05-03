'use client';

import { useEffect, useState } from 'react';
import { toast } from 'sonner';

type Row = {
  _id: string;
  email: string;
  name: string;
  role: string;
  approvalStatus: string;
  createdAt: string;
};

export default function ApprovalsPage() {
  const [tab, setTab] = useState<'pending' | 'approved' | 'rejected'>('pending');
  const [rows, setRows] = useState<Row[]>([]);

  useEffect(() => {
    let cancelled = false;
    fetch(`/api/admin/approvals?status=${tab}`)
      .then((r) => r.json())
      .then((j) => {
        if (!cancelled && j.success) setRows(j.data);
      });
    return () => {
      cancelled = true;
    };
  }, [tab]);

  async function approve(id: string) {
    const res = await fetch(`/api/admin/approvals/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'approve' }),
    });
    if (!res.ok) toast.error('Failed');
    else {
      toast.success('Approved');
      window.location.reload();
    }
  }

  async function reject(id: string) {
    const reason = prompt('Rejection reason (required):');
    if (!reason) return;
    const res = await fetch(`/api/admin/approvals/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'reject', rejectionReason: reason }),
    });
    if (!res.ok) toast.error('Failed');
    else {
      toast.success('Rejected');
      window.location.reload();
    }
  }

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold">Approvals</h1>
      <div className="mb-6 flex gap-2">
        {(['pending', 'approved', 'rejected'] as const).map((t) => (
          <button
            key={t}
            type="button"
            className={`rounded-lg px-4 py-2 text-sm font-medium ${tab === t ? 'bg-[#1E3A5F] text-white' : 'bg-[var(--bg-card)]'}`}
            onClick={() => setTab(t)}
          >
            {t}
          </button>
        ))}
      </div>
      <div className="flex flex-col gap-3">
        {rows.map((r) => (
          <div key={r._id} className="card flex flex-wrap items-center justify-between gap-4 p-4">
            <div>
              <div className="font-semibold">{r.name}</div>
              <div className="text-sm text-[var(--text-muted)]">
                {r.email} · {r.role}
              </div>
            </div>
            {tab === 'pending' && (
              <div className="flex gap-2">
                <button type="button" className="btn btn-primary btn-sm py-1 text-sm" onClick={() => approve(r._id)}>
                  Approve
                </button>
                <button type="button" className="btn btn-secondary btn-sm py-1 text-sm" onClick={() => reject(r._id)}>
                  Reject
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
