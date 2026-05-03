'use client';

import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import Link from 'next/link';

const QUALIFICATIONS = ['ITI', 'Diploma', 'B.Tech', 'M.Tech', 'B.Sc', 'MBA', 'Other'];

export default function NewBatchPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    setLoading(true);
    try {
      const res = await fetch('/api/batches', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: fd.get('name'),
          qualification: fd.get('qualification'),
          branch: fd.get('branch'),
          passingYear: Number(fd.get('passingYear')),
        }),
      });
      const j = await res.json();
      if (!res.ok) throw new Error(j.error || 'Failed');
      toast.success('Batch created! Now add students.');
      router.push(`/coordinator/batches/${j.data._id}`);
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Error creating batch');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fade-in">
      <button className="btn btn-ghost btn-sm" style={{ marginBottom: 20 }} onClick={() => router.back()}>← Back</button>
      <div className="page-header">
        <h1 className="page-title">Create New Batch</h1>
        <p className="page-subtitle">Define the batch details — you&apos;ll add students in the next step</p>
      </div>

      <div className="card" style={{ maxWidth: 560, padding: '28px' }}>
        <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          <div className="form-group">
            <label className="form-label">Batch Name <span className="required">*</span></label>
            <input name="name" required className="form-input" placeholder="e.g. Electrical ITI Passout 2024" />
            <span className="form-hint">A descriptive name to identify this batch</span>
          </div>

          <div className="grid-2" style={{ gap: 14 }}>
            <div className="form-group">
              <label className="form-label">Qualification <span className="required">*</span></label>
              <select name="qualification" required className="form-select">
                <option value="">— Select —</option>
                {QUALIFICATIONS.map(q => <option key={q} value={q}>{q}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Passing Year <span className="required">*</span></label>
              <input name="passingYear" required type="number" className="form-input" min={2020} max={2030} defaultValue={new Date().getFullYear()} />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Branch / Trade / Specialisation <span className="required">*</span></label>
            <input name="branch" required className="form-input" placeholder="e.g. Electrical, Mechanical, Computer Science" />
          </div>

          <div className="alert alert-info">
            <span>💡</span>
            <div>After creating the batch, you&apos;ll be taken to add students individually or via CSV bulk upload.</div>
          </div>

          <div style={{ display: 'flex', gap: 12, marginTop: 4 }}>
            <Link href="/coordinator/batches" className="btn btn-ghost" style={{ flex: 1, justifyContent: 'center' }}>Cancel</Link>
            <button type="submit" className="btn btn-primary" style={{ flex: 2, justifyContent: 'center' }} disabled={loading}>
              {loading ? 'Creating…' : 'Create Batch & Add Students →'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
