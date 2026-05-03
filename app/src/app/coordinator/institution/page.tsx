'use client';

import { useEffect, useState } from 'react';
import { toast } from 'sonner';

export default function InstitutionPage() {
  const [form, setForm] = useState({
    name: '',
    district: '',
    address: '',
    website: '',
  });

  useEffect(() => {
    fetch('/api/institution/me')
      .then((r) => r.json())
      .then((j) => {
        if (j.success && j.data) {
          setForm({
            name: j.data.name || '',
            district: j.data.district || '',
            address: j.data.address || '',
            website: j.data.website || '',
          });
        }
      });
  }, []);

  async function save(e: React.FormEvent) {
    e.preventDefault();
    const res = await fetch('/api/institution/me', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
    if (!res.ok) toast.error('Save failed');
    else toast.success('Saved');
  }

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold">Institution profile</h1>
      <form onSubmit={save} className="card flex max-w-lg flex-col gap-4 p-6">
        <input className="form-input" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Name" />
        <input
          className="form-input"
          value={form.district}
          onChange={(e) => setForm({ ...form, district: e.target.value })}
          placeholder="District"
        />
        <textarea
          className="form-input min-h-[80px]"
          value={form.address}
          onChange={(e) => setForm({ ...form, address: e.target.value })}
          placeholder="Address"
        />
        <input
          className="form-input"
          value={form.website}
          onChange={(e) => setForm({ ...form, website: e.target.value })}
          placeholder="Website"
        />
        <button type="submit" className="btn btn-primary w-fit justify-center px-6 py-2">
          Save
        </button>
      </form>
    </div>
  );
}
