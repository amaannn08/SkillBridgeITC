'use client';

import { useRouter } from 'next/navigation';
import { useState, FormEvent } from 'react';
import { toast } from 'sonner';

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
          passingYear: fd.get('passingYear'),
          status: fd.get('status') || 'draft',
        }),
      });
      const j = await res.json();
      if (!res.ok) throw new Error(j.error || 'Failed');
      toast.success('Batch created');
      router.push('/coordinator/batches');
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Error');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold">Create batch</h1>
      <form onSubmit={submit} className="card flex max-w-lg flex-col gap-4 p-6">
        <input name="name" required className="form-input" placeholder="Batch name" />
        <input name="qualification" required className="form-input" placeholder="Qualification (e.g. ITI)" />
        <input name="branch" required className="form-input" placeholder="Branch / trade" />
        <input name="passingYear" required type="number" className="form-input" placeholder="Passing year" />
        <select name="status" className="form-input">
          <option value="draft">Draft</option>
          <option value="active">Active</option>
        </select>
        <button type="submit" className="btn btn-primary justify-center py-2" disabled={loading}>
          {loading ? 'Saving…' : 'Save'}
        </button>
      </form>
    </div>
  );
}
