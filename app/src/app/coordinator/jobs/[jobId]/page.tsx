'use client';

import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState, FormEvent } from 'react';
import { toast } from 'sonner';

export default function CoordinatorJobDetailPage() {
  const { jobId } = useParams<{ jobId: string }>();
  const router = useRouter();
  const [job, setJob] = useState<Record<string, unknown> | null>(null);
  const [batches, setBatches] = useState<{ _id: string; name: string; status: string }[]>([]);

  useEffect(() => {
    if (!jobId) return;
    fetch(`/api/jobs/${jobId}`)
      .then((r) => r.json())
      .then((j) => j.success && setJob(j.data));
    fetch('/api/batches')
      .then((r) => r.json())
      .then((j) => j.success && setBatches(j.data.filter((b: { status: string }) => b.status === 'active')));
  }, [jobId]);

  async function apply(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const batchId = fd.get('batchId') as string;
    const coverNote = fd.get('coverNote') as string;
    const res = await fetch('/api/applications', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ jobRequirementId: jobId, talentPoolBatchId: batchId, coverNote }),
    });
    const j = await res.json();
    if (!res.ok) {
      toast.error(j.error || 'Failed');
      return;
    }
    toast.success('Application submitted');
    router.push('/coordinator/applications');
  }

  if (!job) return <p className="text-[var(--text-muted)]">Loading…</p>;

  return (
    <div>
      <h1 className="mb-4 text-2xl font-bold">{String(job.title)}</h1>
      <div className="card mb-8 max-w-3xl whitespace-pre-wrap p-6 text-sm">{String(job.description)}</div>

      <h2 className="mb-4 text-lg font-semibold">Apply with talent pool</h2>
      <form onSubmit={apply} className="card flex max-w-lg flex-col gap-4 p-6">
        <select name="batchId" required className="form-input">
          <option value="">Select active batch</option>
          {batches.map((b) => (
            <option key={b._id} value={b._id}>
              {b.name}
            </option>
          ))}
        </select>
        <textarea name="coverNote" className="form-input min-h-[80px]" placeholder="Cover note (optional)" />
        <button type="submit" className="btn btn-primary justify-center py-2">
          Submit application
        </button>
      </form>
    </div>
  );
}
