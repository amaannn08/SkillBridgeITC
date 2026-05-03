'use client';

import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { StatusBadge } from '@/components/shared/Badges';
import { Modal } from '@/components/shared/Modal';
import { formatDistanceToNow } from 'date-fns';

type Row = {
  _id: string;
  email: string;
  name: string;
  role: string;
  approvalStatus: string;
  createdAt: string;
  designation?: string;
  phone?: string;
  state?: string;
  institutionId?: { name?: string; type?: string; district?: string; aicteCode?: string } | null;
  companyId?: { name?: string; sector?: string; emailDomain?: string; website?: string } | null;
};

type TabType = 'pending' | 'approved' | 'rejected';

export default function ApprovalsPage() {
  const [tab, setTab] = useState<TabType>('pending');
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);
  const [counts, setCounts] = useState({ pending: 0, approved: 0, rejected: 0 });
  const [rejectTarget, setRejectTarget] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState('');
  const [acting, setActing] = useState<string | null>(null);

  function load(t: TabType) {
    setLoading(true);
    fetch(`/api/admin/approvals?status=${t}`)
      .then(r => r.json())
      .then(j => { if (j.success) setRows(j.data); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    load(tab);
    // Load counts for all tabs
    Promise.all(['pending', 'approved', 'rejected'].map(s =>
      fetch(`/api/admin/approvals?status=${s}`).then(r => r.json())
    )).then(([p, a, r]) => {
      setCounts({ pending: p.data?.length || 0, approved: a.data?.length || 0, rejected: r.data?.length || 0 });
    }).catch(() => {});
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function approve(id: string) {
    setActing(id);
    try {
      const res = await fetch(`/api/admin/approvals/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'approve' }),
      });
      if (!res.ok) throw new Error('Failed');
      toast.success('User approved and notified');
      setRows(r => r.filter(u => u._id !== id));
      setCounts(c => ({ ...c, pending: c.pending - 1, approved: c.approved + 1 }));
    } catch {
      toast.error('Failed to approve user');
    } finally {
      setActing(null);
    }
  }

  async function confirmReject() {
    if (!rejectTarget || !rejectReason.trim()) { toast.error('Reason is required'); return; }
    setActing(rejectTarget);
    try {
      const res = await fetch(`/api/admin/approvals/${rejectTarget}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'reject', rejectionReason: rejectReason }),
      });
      if (!res.ok) throw new Error('Failed');
      toast.success('Registration rejected');
      setRows(r => r.filter(u => u._id !== rejectTarget));
      setCounts(c => ({ ...c, pending: c.pending - 1, rejected: c.rejected + 1 }));
      setRejectTarget(null);
      setRejectReason('');
    } catch {
      toast.error('Failed to reject');
    } finally {
      setActing(null);
    }
  }

  const tabs: TabType[] = ['pending', 'approved', 'rejected'];

  return (
    <div className="fade-in">
      <div className="page-header">
        <h1 className="page-title">Approval Management</h1>
        <p className="page-subtitle">Review and approve registration requests from coordinators and recruiters</p>
      </div>

      {/* Tabs */}
      <div className="tabs" style={{ marginBottom: 28 }}>
        {tabs.map(t => (
          <button key={t} className={`tab ${tab === t ? 'active' : ''}`} onClick={() => { setTab(t); load(t); }}>
            {t === 'pending' ? '⏳' : t === 'approved' ? '✅' : '❌'} {t.charAt(0).toUpperCase() + t.slice(1)}
            <span className="tab-count">{counts[t]}</span>
          </button>
        ))}
      </div>

      {/* Cards */}
      {loading ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {[...Array(3)].map((_, i) => <div key={i} className="skeleton" style={{ height: 120, borderRadius: 16 }} />)}
        </div>
      ) : rows.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">{tab === 'pending' ? '✅' : '📭'}</div>
          <div className="empty-title">{tab === 'pending' ? 'All caught up!' : `No ${tab} registrations`}</div>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {rows.map(r => (
            <div key={r._id} className="card" style={{ padding: '20px 24px' }}>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16, alignItems: 'flex-start', justifyContent: 'space-between' }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8, flexWrap: 'wrap' }}>
                    <span style={{ fontWeight: 700, fontSize: '1.0625rem' }}>{r.name}</span>
                    <StatusBadge status={r.role} />
                    <StatusBadge status={r.approvalStatus} />
                  </div>
                  <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: 10 }}>{r.email}</div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '6px 20px', fontSize: '0.8125rem' }}>
                    {r.designation && <div><span style={{ color: 'var(--text-muted)' }}>Designation:</span> <span style={{ color: 'var(--text-secondary)' }}>{r.designation}</span></div>}
                    {r.phone && <div><span style={{ color: 'var(--text-muted)' }}>Phone:</span> <span style={{ color: 'var(--text-secondary)' }}>{r.phone}</span></div>}
                    {r.state && <div><span style={{ color: 'var(--text-muted)' }}>State:</span> <span style={{ color: 'var(--text-secondary)' }}>{r.state}</span></div>}
                    {r.institutionId?.name && <div><span style={{ color: 'var(--text-muted)' }}>Institution:</span> <span style={{ color: 'var(--text-secondary)' }}>{r.institutionId.name} ({r.institutionId.type})</span></div>}
                    {r.institutionId?.aicteCode && <div><span style={{ color: 'var(--text-muted)' }}>AICTE Code:</span> <span style={{ color: 'var(--text-secondary)' }}>{r.institutionId.aicteCode}</span></div>}
                    {r.companyId?.name && <div><span style={{ color: 'var(--text-muted)' }}>Company:</span> <span style={{ color: 'var(--text-secondary)' }}>{r.companyId.name}</span></div>}
                    {r.companyId?.sector && <div><span style={{ color: 'var(--text-muted)' }}>Sector:</span> <span style={{ color: 'var(--text-secondary)' }}>{r.companyId.sector}</span></div>}
                    {r.companyId?.emailDomain && <div><span style={{ color: 'var(--text-muted)' }}>Domain:</span> <span style={{ color: 'var(--text-secondary)' }}>{r.companyId.emailDomain}</span></div>}
                    <div><span style={{ color: 'var(--text-muted)' }}>Registered:</span> <span style={{ color: 'var(--text-secondary)' }}>{formatDistanceToNow(new Date(r.createdAt), { addSuffix: true })}</span></div>
                  </div>
                </div>

                {tab === 'pending' && (
                  <div style={{ display: 'flex', gap: 10, flexShrink: 0, alignSelf: 'center' }}>
                    <button
                      className="btn btn-success btn-sm"
                      onClick={() => approve(r._id)}
                      disabled={acting === r._id}
                    >
                      {acting === r._id ? '…' : '✓ Approve'}
                    </button>
                    <button
                      className="btn btn-secondary btn-sm"
                      style={{ borderColor: 'var(--danger)', color: 'var(--danger)' }}
                      onClick={() => { setRejectTarget(r._id); setRejectReason(''); }}
                      disabled={acting === r._id}
                    >
                      ✕ Reject
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Rejection Modal */}
      <Modal
        open={!!rejectTarget}
        onClose={() => { setRejectTarget(null); setRejectReason(''); }}
        title="Reject Registration"
        footer={
          <>
            <button className="btn btn-ghost" onClick={() => { setRejectTarget(null); setRejectReason(''); }}>Cancel</button>
            <button className="btn btn-danger" onClick={confirmReject} disabled={!rejectReason.trim() || !!acting}>
              {acting ? 'Rejecting…' : 'Confirm Rejection'}
            </button>
          </>
        }
      >
        <div className="alert alert-warning" style={{ marginBottom: 16 }}>
          <span>⚠️</span>
          <div>This will send an email to the user with your rejection reason.</div>
        </div>
        <div className="form-group">
          <label className="form-label">Rejection Reason <span className="required">*</span></label>
          <textarea
            className="form-textarea"
            rows={4}
            placeholder="e.g. Could not verify the institution's AICTE code. Please re-register with a valid code."
            value={rejectReason}
            onChange={e => setRejectReason(e.target.value)}
          />
          <span className="form-hint">This message will be included in the rejection email.</span>
        </div>
      </Modal>
    </div>
  );
}
