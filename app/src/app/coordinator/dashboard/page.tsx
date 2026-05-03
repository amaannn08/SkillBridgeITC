'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { StatsCard } from '@/components/shared/StatsCard';
import { StatusBadge } from '@/components/shared/Badges';
import { formatDistanceToNow } from 'date-fns';

interface DashData {
  batches: number;
  apps: number;
  shortlisted: number;
  selected: number;
  recentApps: Array<{ _id: string; status: string; submittedAt: string; jobRequirementId?: { title?: string }; talentPoolBatchId?: { name?: string } }>;
  matchingJobs: Array<{ _id: string; title: string; companyId?: { name?: string }; applicationDeadline?: string; slots?: Array<{ qualification: string; seats: number }> }>;
}

export default function CoordinatorDashboardPage() {
  const [data, setData] = useState<DashData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch('/api/batches').then(r => r.json()),
      fetch('/api/applications').then(r => r.json()),
      fetch('/api/jobs').then(r => r.json()),
    ]).then(([b, a, j]) => {
      const apps: DashData['recentApps'] = a.success ? a.data : [];
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const shortlisted = (apps as any[]).reduce((acc: number, app: { studentStatuses?: Array<{ status: string }> }) => {
        return acc + (app.studentStatuses?.filter((s) => s.status === 'shortlisted').length || 0);
      }, 0);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const selected = (apps as any[]).reduce((acc: number, app: { studentStatuses?: Array<{ status: string }> }) => {
        return acc + (app.studentStatuses?.filter((s) => s.status === 'selected').length || 0);
      }, 0);
      setData({
        batches: b.success ? b.data.length : 0,
        apps: apps.length,
        shortlisted,
        selected,
        recentApps: apps.slice(0, 5),
        matchingJobs: j.success ? j.data.slice(0, 5) : [],
      });
    }).catch(() => setData({ batches: 0, apps: 0, shortlisted: 0, selected: 0, recentApps: [], matchingJobs: [] }))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="fade-in">
      <div className="page-header">
        <h1 className="page-title">Coordinator Dashboard</h1>
        <p className="page-subtitle">Manage your talent pool batches and job applications</p>
      </div>

      {/* Stats */}
      <div className="grid-4" style={{ marginBottom: 32 }}>
        <StatsCard icon="👥" label="Active Batches" value={data?.batches ?? 0} accent="blue" loading={loading} />
        <StatsCard icon="📋" label="Applications Submitted" value={data?.apps ?? 0} accent="orange" loading={loading} />
        <StatsCard icon="✅" label="Students Shortlisted" value={data?.shortlisted ?? 0} accent="green" loading={loading} />
        <StatsCard icon="🎉" label="Students Selected" value={data?.selected ?? 0} accent="green" loading={loading} />
      </div>

      <div className="grid-2" style={{ gap: 24 }}>
        {/* Recent Activity */}
        <div className="card-flat" style={{ padding: '20px 24px' }}>
          <div className="section-header">
            <span className="section-title">Recent Applications</span>
            <Link href="/coordinator/applications" style={{ fontSize: '0.8rem', color: 'var(--primary-light)', textDecoration: 'none' }}>View all →</Link>
          </div>
          {loading ? (
            [...Array(3)].map((_, i) => <div key={i} className="skeleton" style={{ height: 56, marginBottom: 8, borderRadius: 8 }} />)
          ) : data?.recentApps.length === 0 ? (
            <div className="empty-state" style={{ padding: '32px 0' }}>
              <div className="empty-icon">📭</div>
              <div className="empty-title">No applications yet</div>
              <div className="empty-desc">Browse jobs and apply with a talent batch</div>
            </div>
          ) : (
            data?.recentApps.map((app) => (
              <div key={app._id} className="activity-item">
                <div className={`activity-dot ${app.status === 'shortlisting' ? 'success' : app.status === 'closed' ? 'danger' : ''}`} />
                <div>
                  <div className="activity-text" style={{ color: 'var(--text-primary)', fontWeight: 500 }}>
                    {app.jobRequirementId?.title || 'Job Application'}
                  </div>
                  <div className="activity-text" style={{ fontSize: '0.78rem' }}>
                    Batch: {app.talentPoolBatchId?.name || '—'} &nbsp;·&nbsp; <StatusBadge status={app.status} />
                  </div>
                  <div className="activity-time">{formatDistanceToNow(new Date(app.submittedAt), { addSuffix: true })}</div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Matching Jobs */}
        <div className="card-flat" style={{ padding: '20px 24px' }}>
          <div className="section-header">
            <span className="section-title">Matching Job Requirements</span>
            <Link href="/coordinator/jobs" style={{ fontSize: '0.8rem', color: 'var(--primary-light)', textDecoration: 'none' }}>Browse all →</Link>
          </div>
          {loading ? (
            [...Array(3)].map((_, i) => <div key={i} className="skeleton" style={{ height: 72, marginBottom: 8, borderRadius: 8 }} />)
          ) : data?.matchingJobs.length === 0 ? (
            <div className="empty-state" style={{ padding: '32px 0' }}>
              <div className="empty-icon">🔍</div>
              <div className="empty-title">No open jobs available</div>
              <div className="empty-desc">Check back soon for new requirements</div>
            </div>
          ) : (
            data?.matchingJobs.map((job) => (
              <Link key={job._id} href={`/coordinator/jobs/${job._id}`} style={{ textDecoration: 'none' }}>
                <div className="activity-item" style={{ cursor: 'pointer' }}>
                  <div className="activity-dot" />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div className="activity-text" style={{ color: 'var(--text-primary)', fontWeight: 600 }}>{job.title}</div>
                    <div className="activity-text">{job.companyId?.name || 'Company'}</div>
                    {job.applicationDeadline && (
                      <div className="activity-time">Deadline: {new Date(job.applicationDeadline).toLocaleDateString('en-IN')}</div>
                    )}
                  </div>
                  <span style={{ fontSize: '0.8rem', color: 'var(--primary-light)' }}>Apply →</span>
                </div>
              </Link>
            ))
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="card-flat" style={{ padding: '20px 24px', marginTop: 24 }}>
        <div className="section-title" style={{ marginBottom: 16 }}>Quick Actions</div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
          <Link href="/coordinator/batches/new" className="btn btn-primary btn-sm">➕ Create Batch</Link>
          <Link href="/coordinator/jobs" className="btn btn-secondary btn-sm">🔍 Browse Jobs</Link>
          <Link href="/coordinator/applications" className="btn btn-secondary btn-sm">📋 View Applications</Link>
          <Link href="/coordinator/institution" className="btn btn-secondary btn-sm">🏛️ Edit Institution</Link>
        </div>
      </div>
    </div>
  );
}
