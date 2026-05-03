'use client';

import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

export default function JobApplicationsPage() {
  const { jobId } = useParams<{ jobId: string }>();
  const [apps, setApps] = useState<Record<string, unknown>[]>([]);

  useEffect(() => {
    fetch('/api/applications')
      .then((r) => r.json())
      .then((j) => {
        if (j.success) {
          const filtered = j.data.filter(
            (a: Record<string, unknown>) =>
              a.jobRequirementId &&
              (typeof a.jobRequirementId === 'string'
                ? a.jobRequirementId === jobId
                : String((a.jobRequirementId as { _id?: string })._id) === jobId)
          );
          setApps(filtered);
        }
      });
  }, [jobId]);

  async function updateStatus(appId: string, studentId: string, status: string) {
    const res = await fetch(`/api/applications/${appId}/students/${studentId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
    if (!res.ok) toast.error('Update failed');
    else toast.success('Updated');
  }

  async function downloadZip(appId: string) {
    window.open(`/api/applications/${appId}/download?filter=all`, '_blank');
  }

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold">Applications</h1>
      <div className="flex flex-col gap-6">
        {apps.map((app: Record<string, unknown>) => {
          const batch = app.talentPoolBatchId as Record<string, unknown> | undefined;
          const statuses = (app.studentStatuses as Record<string, unknown>[]) || [];
          return (
            <div key={String(app._id)} className="card p-4">
              <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
                <div className="font-semibold">{batch ? String(batch.name) : 'Batch'}</div>
                <button type="button" className="btn btn-secondary btn-sm py-1 text-xs" onClick={() => downloadZip(String(app._id))}>
                  Download resumes ZIP
                </button>
              </div>
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="text-[var(--text-muted)]">
                    <th className="pb-2">Student</th>
                    <th className="pb-2">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {statuses.map((s) => (
                    <tr key={String(s.studentId)} className="border-t border-[var(--border)]">
                      <td className="py-2 font-mono text-xs">{String(s.studentId)}</td>
                      <td className="py-2">
                        <select
                          className="form-input py-1 text-sm"
                          defaultValue={String(s.status)}
                          onChange={(e) => updateStatus(String(app._id), String(s.studentId), e.target.value)}
                        >
                          {['applied', 'shortlisted', 'rejected', 'selected', 'on_hold'].map((x) => (
                            <option key={x} value={x}>
                              {x}
                            </option>
                          ))}
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          );
        })}
      </div>
    </div>
  );
}
