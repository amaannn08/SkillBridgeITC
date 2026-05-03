'use client';

import { useEffect, useState, FormEvent } from 'react';
import { toast } from 'sonner';

interface Company {
  _id: string;
  name: string;
  sector: string;
  website?: string;
  address?: string;
  cin?: string;
  gstNumber?: string;
  verifiedAt?: string;
}

export default function RecruiterCompanyPage() {
  const [company, setCompany] = useState<Company | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch('/api/company/me')
      .then(r => r.json())
      .then(j => { if (j.success) setCompany(j.data); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  async function save(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    setSaving(true);
    try {
      const res = await fetch('/api/company/me', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          website: fd.get('website'),
          address: fd.get('address'),
        }),
      });
      const j = await res.json();
      if (!res.ok) throw new Error(j.error || 'Failed');
      toast.success('Company profile updated');
      if (j.success) setCompany(j.data);
      setEditing(false);
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Error');
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <div className="skeleton" style={{ height: 280, borderRadius: 16 }} />;

  if (!company) return (
    <div className="empty-state">
      <div className="empty-icon">🏭</div>
      <div className="empty-title">Company profile not found</div>
      <div className="empty-desc">Contact support if your company profile is missing.</div>
    </div>
  );

  return (
    <div className="fade-in">
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h1 className="page-title">Company Profile</h1>
          <p className="page-subtitle">Your company details as registered on SkillBridge</p>
        </div>
        {!editing && <button className="btn btn-secondary btn-sm" onClick={() => setEditing(true)}>✏️ Edit</button>}
      </div>

      <div className="card" style={{ padding: '28px', maxWidth: 680 }}>
        <div className="alert alert-info" style={{ marginBottom: 24 }}>
          <span>ℹ️</span>
          <div>Company name, sector, CIN, and GST number are verified and locked. Contact support to request changes.</div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '16px 24px', marginBottom: 24 }}>
          {[
            { label: 'Company Name', value: company.name },
            { label: 'Sector / Industry', value: company.sector },
            { label: 'CIN', value: company.cin || '—' },
            { label: 'GST Number', value: company.gstNumber || '—' },
            { label: 'Verified', value: company.verifiedAt ? `✅ ${new Date(company.verifiedAt).toLocaleDateString('en-IN')}` : '⏳ Pending' },
          ].map(f => (
            <div key={f.label}>
              <div style={{ fontSize: '0.72rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: 4, textTransform: 'uppercase', letterSpacing: '0.04em' }}>{f.label}</div>
              <div style={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: '0.9rem' }}>{f.value}</div>
            </div>
          ))}
        </div>

        <div style={{ borderTop: '1px solid var(--border)', paddingTop: 20 }}>
          <div style={{ fontWeight: 700, marginBottom: 16 }}>Editable Details</div>
          {editing ? (
            <form onSubmit={save} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div className="form-group">
                <label className="form-label">Company Website</label>
                <input name="website" type="url" className="form-input" defaultValue={company.website || ''} placeholder="https://www.company.com" />
              </div>
              <div className="form-group">
                <label className="form-label">Registered Address</label>
                <textarea name="address" className="form-textarea" rows={3} defaultValue={company.address || ''} placeholder="Full registered address..." />
              </div>
              <div style={{ display: 'flex', gap: 12 }}>
                <button type="button" className="btn btn-ghost" onClick={() => setEditing(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={saving}>{saving ? 'Saving…' : 'Save Changes'}</button>
              </div>
            </form>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '16px 24px' }}>
              {[
                { label: 'Website', value: company.website ? <a href={company.website} target="_blank" rel="noreferrer" style={{ color: 'var(--primary-light)' }}>{company.website}</a> : '—' },
                { label: 'Address', value: company.address || '—' },
              ].map(f => (
                <div key={f.label}>
                  <div style={{ fontSize: '0.72rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: 4, textTransform: 'uppercase', letterSpacing: '0.04em' }}>{f.label}</div>
                  <div style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>{f.value}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
