'use client';

import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { INDIAN_STATES_AND_UTS } from '@/lib/constants/states';

export default function NewJobPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const slots = [
      {
        qualification: fd.get('slot1q'),
        branch: fd.get('slot1b') || '',
        seats: Number(fd.get('slot1n')),
      },
    ];
    setLoading(true);
    try {
      const res = await fetch('/api/jobs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: fd.get('title'),
          description: fd.get('description'),
          location: fd.get('location'),
          state: fd.get('state'),
          geographyScope: fd.get('geographyScope'),
          slots,
          salaryMin: fd.get('salaryMin') ? Number(fd.get('salaryMin')) : undefined,
          salaryMax: fd.get('salaryMax') ? Number(fd.get('salaryMax')) : undefined,
          applicationDeadline: fd.get('applicationDeadline'),
          sector: fd.get('sector'),
          skills: String(fd.get('skills') || '')
            .split(',')
            .map((s) => s.trim())
            .filter(Boolean),
          experienceLevel: fd.get('experienceLevel'),
          status: 'open',
        }),
      });
      const j = await res.json();
      if (!res.ok) throw new Error(j.error || 'Failed');
      toast.success('Job saved');
      router.push('/recruiter/jobs');
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Error');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold">Post job requirement</h1>
      <form onSubmit={submit} className="card flex max-w-2xl flex-col gap-4 p-6">
        <input name="title" required className="form-input" placeholder="Job title" />
        <textarea name="description" required className="form-input min-h-[120px]" placeholder="Description (markdown supported)" />
        <input name="location" required className="form-input" placeholder="Work location" />
        <select name="state" required className="form-input">
          {INDIAN_STATES_AND_UTS.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
        <select name="geographyScope" className="form-input">
          <option value="state">This state only</option>
          <option value="pan_india">Pan-India</option>
        </select>
        <div className="rounded border border-[var(--border)] p-4">
          <div className="mb-2 text-sm font-medium">Qualification slot 1</div>
          <input name="slot1q" required className="form-input mb-2" placeholder="Qualification" />
          <input name="slot1b" className="form-input mb-2" placeholder="Branch" />
          <input name="slot1n" required type="number" min={1} className="form-input" placeholder="Seats" />
        </div>
        <input name="sector" required className="form-input" placeholder="Sector" />
        <div className="flex gap-4">
          <input name="salaryMin" type="number" className="form-input" placeholder="Salary min (INR)" />
          <input name="salaryMax" type="number" className="form-input" placeholder="Salary max (INR)" />
        </div>
        <input name="skills" className="form-input" placeholder="Skills (comma-separated)" />
        <select name="experienceLevel" className="form-input">
          <option value="fresher">Fresher</option>
          <option value="0-2yr">0–2 years</option>
          <option value="2-5yr">2–5 years</option>
        </select>
        <input name="applicationDeadline" required type="datetime-local" className="form-input" />
        <button type="submit" className="btn btn-primary justify-center py-2" disabled={loading}>
          Publish job
        </button>
      </form>
    </div>
  );
}
