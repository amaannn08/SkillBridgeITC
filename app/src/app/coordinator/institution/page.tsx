'use client';

import { useEffect, useState, FormEvent } from 'react';
import { toast } from 'sonner';
import { INDIAN_STATES_AND_UTS } from '@/lib/constants/states';

interface Institution {
  _id: string;
  name: string;
  type: string;
  aicteCode: string;
  state: string;
  district: string;
  address?: string;
  website?: string;
}

export default function InstitutionPage() {
  const [inst, setInst] = useState<Institution | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    fetch('/api/institution/me')
      .then(r => r.json())
      .then(j => { if (j.success) setInst(j.data); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  async function save(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!inst) return;
    const fd = new FormData(e.currentTarget);
    setSaving(true);
    try {
      const res = await fetch('/api/institution/me', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          address: fd.get('address'),
          website: fd.get('website'),
        }),
      });
      if (!res.ok) throw new Error('Failed');
      toast.success('Institution profile updated');
      setEditing(false);
      const j = await res.json();
      if (j.success) setInst(j.data);
    } catch {
      toast.error('Failed to update');
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <div className="skeleton" style={{ height: 300, borderRadius: 16 }} />;

  if (!inst) return (
    <div className="empty-state">
      <div className="empty-icon">🏛️</div>
      <div className="empty-title">Institution not found</div>
      <div className="empty-desc">Contact support if your institution profile is missing.</div>
    </div>
  );

  return (
    <div className="fade-in">
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h1 className="page-title">Institution Profile</h1>
          <p className="page-subtitle">Your institution details as registered on SkillBridge</p>
        </div>
        {!editing && <button className="btn btn-secondary btn-sm" onClick={() => setEditing(true)}>✏️ Edit</button>}
      </div>

      <div className="card" style={{ padding: '28px', maxWidth: 680 }}>
        {/* Non-editable fields */}
        <div className="alert alert-info" style={{ marginBottom: 24 }}>
          <span>ℹ️</span>
          <div>Institution type, state, district, and AICTE code cannot be changed after admin approval. Contact support if a correction is needed.</div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '16px 24px', marginBottom: 24 }}>
          {[
            { label: 'Institution Name', value: inst.name },
            { label: 'Type', value: inst.type },
            { label: 'AICTE / DTE Code', value: inst.aicteCode },
            { label: 'State', value: inst.state },
            { label: 'District', value: inst.district },
          ].map(f => (
            <div key={f.label}>
              <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: 4, textTransform: 'uppercase', letterSpacing: '0.04em' }}>{f.label}</div>
              <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{f.value}</div>
            </div>
          ))}
        </div>

        <div style={{ borderTop: '1px solid var(--border)', paddingTop: 20 }}>
          <div style={{ fontWeight: 700, marginBottom: 16 }}>Editable Details</div>
          {editing ? (
            <form onSubmit={save} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div className="form-group">
                <label className="form-label">Full Address</label>
                <textarea name="address" className="form-textarea" rows={3} defaultValue={inst.address || ''} placeholder="Plot No. 1, Government ITI Campus, Hyderabad - 500001" />
              </div>
              <div className="form-group">
                <label className="form-label">Website</label>
                <input name="website" type="url" className="form-input" defaultValue={inst.website || ''} placeholder="https://www.institution.edu.in" />
              </div>
              <div style={{ display: 'flex', gap: 12 }}>
                <button type="button" className="btn btn-ghost" onClick={() => setEditing(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={saving}>{saving ? 'Saving…' : 'Save Changes'}</button>
              </div>
            </form>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '16px 24px' }}>
              {[
                { label: 'Address', value: inst.address || '—' },
                { label: 'Website', value: inst.website || '—' },
              ].map(f => (
                <div key={f.label}>
                  <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: 4, textTransform: 'uppercase', letterSpacing: '0.04em' }}>{f.label}</div>
                  <div style={{ color: 'var(--text-secondary)' }}>{f.value}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
