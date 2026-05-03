'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { StatusBadge, SlotBadge } from '@/components/shared/Badges';
import { toast } from 'sonner';
import { Modal } from '@/components/shared/Modal';

interface Job {
  _id: string;
  title: string;
  status: string;
  applicationDeadline?: string;
  location?: string;
  state?: string;
  slots?: Array<{ qualification: string; branch?: string; seats: number; filledSeats?: number }>;
  createdAt?: string;
}

export default function RecruiterJobsPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<'open' | 'draft' | 'closed' | 'filled'>('open');
  const [closeTarget, setCloseTarget] = useState<Job | null>(null);
  const [closing, setClosing] = useState(false);

  useEffect(() => {
    fetch('/api/jobs')
      .then(r => r.json())
      .then(j => { if (j.success) setJobs(j.data); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  async function closeJob(job: Job) {
    setClosing(true);
    try {
      const res = await fetch(`/api/jobs/${job._id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'closed' }),
      });
      if (!res.ok) throw new Error();
      toast.success('Job closed');
      setJobs(prev => prev.map(j => j._id === job._id ? { ...j, status: 'closed' } : j));
    } catch {
      toast.error('Failed to close job');
    } finally {
      setClosing(false);
      setCloseTarget(null);
    }
  }

  const filtered = jobs.filter(j => j.status === tab);
  const counts = { open: jobs.filter(j => j.status === 'open').length, draft: jobs.filter(j => j.status === 'draft').length, closed: jobs.filter(j => j.status === 'closed').length, filled: jobs.filter(j => j.status === 'filled').length };

  return (
    <div className="fade-in">
      <div className="page-header" style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
        <div>
          <h1 className="page-title">Job Requirements</h1>
          <p className="page-subtitle">Manage your posted job requirements</p>
        </div>
        <Link href="/recruiter/jobs/new" className="btn btn-primary">➕ Post New Job</Link>
      </div>

      <div className="tabs" style={{ marginBottom: 24 }}>
        {(['open', 'draft', 'closed', 'filled'] as const).map(t => (
          <button key={t} className={`tab ${tab === t ? 'active' : ''}`} onClick={() => setTab(t)}>
            {t === 'open' ? '🟢' : t === 'draft' ? '📝' : t === 'closed' ? '🔴' : '✅'} {t.charAt(0).toUpperCase() + t.slice(1)}
            <span className="tab-count">{counts[t]}</span>
          </button>
        ))}
      </div>

      {loading ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {[...Array(3)].map((_, i) => <div key={i} className="skeleton" style={{ height: 110, borderRadius: 16 }} />)}
        </div>
      ) : filtered.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">📋</div>
          <div className="empty-title">No {tab} jobs</div>
          {tab === 'open' && <Link href="/recruiter/jobs/new" className="btn btn-primary" style={{ marginTop: 16, display: 'inline-flex' }}>Post Your First Job</Link>}
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {filtered.map(job => {
            const totalSeats = job.slots?.reduce((a, s) => a + s.seats, 0) || 0;
            const filledSeats = job.slots?.reduce((a, s) => a + (s.filledSeats || 0), 0) || 0;
            const pct = totalSeats ? Math.round((filledSeats / totalSeats) * 100) : 0;
            const daysLeft = job.applicationDeadline ? Math.ceil((new Date(job.applicationDeadline).getTime() - Date.now()) / 86400000) : null;

            return (
              <div key={job._id} className="card" style={{ padding: '20px 24px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 16 }}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8, flexWrap: 'wrap' }}>
                      <span style={{ fontWeight: 700, fontSize: '1.0625rem' }}>{job.title}</span>
                      <StatusBadge status={job.status} />
                      {daysLeft !== null && daysLeft <= 3 && daysLeft > 0 && <span className="badge badge-orange">⚠️ {daysLeft}d left</span>}
                    </div>
                    <div style={{ marginBottom: 10 }}><SlotBadge slots={job.slots || []} /></div>
                    {totalSeats > 0 && (
                      <div style={{ maxWidth: 300 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: 4 }}>
                          <span>Seats filled</span><span>{filledSeats}/{totalSeats}</span>
                        </div>
                        <div className="progress-bar">
                          <div className="progress-fill" style={{ width: `${pct}%` }} />
                        </div>
                      </div>
                    )}
                    {job.applicationDeadline && (
                      <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: 8 }}>
                        Deadline: {new Date(job.applicationDeadline).toLocaleDateString('en-IN')}
                        {job.location && ` · ${job.location}`}
                      </div>
                    )}
                  </div>
                  <div style={{ display: 'flex', gap: 10, flexShrink: 0, flexWrap: 'wrap' }}>
                    <Link href={`/recruiter/jobs/${job._id}/applications`} className="btn btn-primary btn-sm">
                      Applications
                    </Link>
                    {(job.status === 'open' || job.status === 'draft') && (
                      <button className="btn btn-secondary btn-sm" style={{ color: 'var(--danger)', borderColor: 'var(--danger)' }} onClick={() => setCloseTarget(job)}>
                        Close
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <Modal
        open={!!closeTarget}
        onClose={() => setCloseTarget(null)}
        title="Close Job Requirement"
        footer={
          <>
            <button className="btn btn-ghost" onClick={() => setCloseTarget(null)}>Cancel</button>
            <button className="btn btn-danger" onClick={() => closeTarget && closeJob(closeTarget)} disabled={closing}>
              {closing ? '…' : 'Close Job'}
            </button>
          </>
        }
      >
        <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6 }}>
          Close <strong>{closeTarget?.title}</strong>? No new applications will be accepted. This cannot be undone.
        </p>
      </Modal>
    </div>
  );
}
