'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { StatsCard } from '@/components/shared/StatsCard';
import { StatusBadge, SlotBadge } from '@/components/shared/Badges';

interface Job {
  _id: string;
  title: string;
  status: string;
  applicationDeadline?: string;
  slots?: Array<{ qualification: string; branch?: string; seats: number; filledSeats?: number }>;
  location?: string;
  state?: string;
}
interface RecentApp {
  _id: string;
  status: string;
  submittedAt: string;
  coordinatorId?: { name?: string };
  talentPoolBatchId?: { name?: string; institution?: { name?: string } };
  jobRequirementId?: { title?: string };
}

export default function RecruiterDashboardPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [apps, setApps] = useState<RecentApp[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch('/api/jobs').then(r => r.json()),
      fetch('/api/applications').then(r => r.json()),
    ]).then(([j, a]) => {
      setJobs(j.success ? j.data : []);
      setApps(a.success ? a.data : []);
    }).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const openJobs = jobs.filter(j => j.status === 'open').length;
  const totalApps = apps.length;
  const shortlisted = apps.reduce((acc, app: { studentStatuses?: Array<{status:string}> } & RecentApp) => acc + (app.studentStatuses?.filter(s => s.status === 'shortlisted').length || 0), 0);
  const selected = apps.reduce((acc, app: { studentStatuses?: Array<{status:string}> } & RecentApp) => acc + (app.studentStatuses?.filter(s => s.status === 'selected').length || 0), 0);
  const recentApps = apps.slice(0, 5);
  const activeJobs = jobs.filter(j => j.status === 'open').slice(0, 5);

  return (
    <div className="fade-in">
      <div className="page-header" style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
        <div>
          <h1 className="page-title">Recruiter Dashboard</h1>
          <p className="page-subtitle">Manage your job requirements and applications</p>
        </div>
        <Link href="/recruiter/jobs/new" className="btn btn-primary">➕ Post Job</Link>
      </div>

      <div className="grid-4" style={{ marginBottom: 32 }}>
        <StatsCard icon="📋" label="Open Job Requirements" value={openJobs} accent="blue" loading={loading} />
        <StatsCard icon="📥" label="Applications Received" value={totalApps} accent="orange" loading={loading} />
        <StatsCard icon="✅" label="Students Shortlisted" value={shortlisted} accent="green" loading={loading} />
        <StatsCard icon="🎉" label="Students Selected" value={selected} accent="green" loading={loading} />
      </div>

      <div className="grid-2" style={{ gap: 24 }}>
        {/* Active Jobs */}
        <div className="card-flat" style={{ padding: '20px 24px' }}>
          <div className="section-header">
            <span className="section-title">Active Job Requirements</span>
            <Link href="/recruiter/jobs" style={{ fontSize: '0.8rem', color: 'var(--primary-light)', textDecoration: 'none' }}>View all →</Link>
          </div>
          {loading ? (
            [...Array(3)].map((_, i) => <div key={i} className="skeleton" style={{ height: 72, marginBottom: 8, borderRadius: 8 }} />)
          ) : activeJobs.length === 0 ? (
            <div className="empty-state" style={{ padding: '32px 0' }}>
              <div className="empty-icon">📝</div>
              <div className="empty-title">No open jobs</div>
              <div className="empty-desc"><Link href="/recruiter/jobs/new" style={{ color: 'var(--primary-light)' }}>Post your first job requirement</Link></div>
            </div>
          ) : (
            activeJobs.map((job) => (
              <div key={job._id} className="activity-item">
                <div className="activity-dot" />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div className="activity-text" style={{ color: 'var(--text-primary)', fontWeight: 600, marginBottom: 4 }}>{job.title}</div>
                  <SlotBadge slots={job.slots || []} />
                  {job.applicationDeadline && (
                    <div className="activity-time" style={{ marginTop: 4 }}>
                      Deadline: {new Date(job.applicationDeadline).toLocaleDateString('en-IN')}
                    </div>
                  )}
                </div>
                <Link href={`/recruiter/jobs/${job._id}/applications`} style={{ fontSize: '0.8rem', color: 'var(--primary-light)', textDecoration: 'none', flexShrink: 0 }}>
                  Apps →
                </Link>
              </div>
            ))
          )}
        </div>

        {/* Recent Applications */}
        <div className="card-flat" style={{ padding: '20px 24px' }}>
          <div className="section-header">
            <span className="section-title">Recent Applications</span>
          </div>
          {loading ? (
            [...Array(3)].map((_, i) => <div key={i} className="skeleton" style={{ height: 56, marginBottom: 8, borderRadius: 8 }} />)
          ) : recentApps.length === 0 ? (
            <div className="empty-state" style={{ padding: '32px 0' }}>
              <div className="empty-icon">📭</div>
              <div className="empty-title">No applications yet</div>
            </div>
          ) : (
            recentApps.map((app) => (
              <div key={app._id} className="activity-item">
                <div className={`activity-dot ${app.status === 'shortlisting' ? 'success' : ''}`} />
                <div>
                  <div className="activity-text" style={{ color: 'var(--text-primary)', fontWeight: 500 }}>
                    {app.jobRequirementId?.title || 'Application'}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 4 }}>
                    <StatusBadge status={app.status} />
                    <span className="activity-time">{new Date(app.submittedAt).toLocaleDateString('en-IN')}</span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
