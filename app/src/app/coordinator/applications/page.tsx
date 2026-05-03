'use client';

import { useEffect, useState } from 'react';
import { StatusBadge } from '@/components/shared/Badges';
import { toast } from 'sonner';

interface Application {
  _id: string;
  status: string;
  submittedAt: string;
  coverNote?: string;
  jobRequirementId?: { _id?: string; title?: string; companyId?: { name?: string } };
  talentPoolBatchId?: { _id?: string; name?: string; qualification?: string };
  studentStatuses?: Array<{ studentId?: string; status: string; recruiterNote?: string; updatedAt?: string; name?: string }>;
}

export default function CoordinatorApplicationsPage() {
  const [apps, setApps] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [withdrawTarget, setWithdrawTarget] = useState<string | null>(null);
  const [withdrawing, setWithdrawing] = useState(false);

  useEffect(() => {
    fetch('/api/applications')
      .then(r => r.json())
      .then(j => { if (j.success) setApps(j.data); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  async function withdraw(id: string) {
    setWithdrawing(true);
    try {
      const res = await fetch(`/api/applications/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed');
      toast.success('Application withdrawn');
      setApps(prev => prev.filter(a => a._id !== id));
      setWithdrawTarget(null);
    } catch {
      toast.error('Could not withdraw application');
    } finally {
      setWithdrawing(false);
    }
  }

  return (
    <div className="fade-in">
      <div className="page-header">
        <h1 className="page-title">My Applications</h1>
        <p className="page-subtitle">Track all your talent pool batch applications</p>
      </div>

      {loading ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {[...Array(3)].map((_, i) => <div key={i} className="skeleton" style={{ height: 90, borderRadius: 16 }} />)}
        </div>
      ) : apps.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">📭</div>
          <div className="empty-title">No applications yet</div>
          <div className="empty-desc">Browse open job requirements and apply with a talent batch</div>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {apps.map(app => (
            <div key={app._id} className="card" style={{ padding: '18px 22px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 14 }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 700, fontSize: '1.0625rem', marginBottom: 6, color: 'var(--text-primary)' }}>
                    {app.jobRequirementId?.title || 'Job Application'}
                  </div>
                  <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: 8 }}>
                    {app.jobRequirementId?.companyId?.name || 'Company'}
                    {app.talentPoolBatchId?.name && ` · Batch: ${app.talentPoolBatchId.name}`}
                  </div>
                  <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
                    <StatusBadge status={app.status} />
                    <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                      Submitted {new Date(app.submittedAt).toLocaleDateString('en-IN')}
                    </span>
                    {app.studentStatuses && (
                      <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                        {app.studentStatuses.filter(s => s.status === 'shortlisted').length} shortlisted ·{' '}
                        {app.studentStatuses.filter(s => s.status === 'selected').length} selected
                      </span>
                    )}
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 10, flexShrink: 0 }}>
                  <button
                    className="btn btn-secondary btn-sm"
                    onClick={() => setExpanded(expanded === app._id ? null : app._id)}
                  >
                    {expanded === app._id ? 'Collapse' : 'View Students'}
                  </button>
                  {app.status === 'submitted' && (
                    <button
                      className="btn btn-ghost btn-sm"
                      style={{ color: 'var(--danger)', borderColor: 'var(--danger)' }}
                      onClick={() => setWithdrawTarget(app._id)}
                    >
                      Withdraw
                    </button>
                  )}
                </div>
              </div>

              {/* Student breakdown */}
              {expanded === app._id && app.studentStatuses && app.studentStatuses.length > 0 && (
                <div style={{ marginTop: 16, borderTop: '1px solid var(--border)', paddingTop: 16 }}>
                  <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: 10, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                    Student Statuses (set by recruiter)
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {app.studentStatuses.map((ss, i) => (
                      <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 12px', background: 'var(--bg-surface)', borderRadius: 8 }}>
                        <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>{ss.name || `Student ${i + 1}`}</span>
                        <StatusBadge status={ss.status} />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Withdraw confirm */}
      {withdrawTarget && (
        <div className="modal-backdrop" onClick={() => setWithdrawTarget(null)}>
          <div className="modal-box" style={{ maxWidth: 420 }} onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <span className="modal-title">Withdraw Application</span>
              <button className="modal-close" onClick={() => setWithdrawTarget(null)}>✕</button>
            </div>
            <p style={{ color: 'var(--text-secondary)', marginBottom: 20 }}>
              Are you sure you want to withdraw this application? This action cannot be undone.
            </p>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
              <button className="btn btn-ghost" onClick={() => setWithdrawTarget(null)}>Cancel</button>
              <button className="btn btn-danger" onClick={() => withdraw(withdrawTarget)} disabled={withdrawing}>
                {withdrawing ? '…' : 'Withdraw'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
