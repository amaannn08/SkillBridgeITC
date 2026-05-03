import connectDB from '@/lib/db';
import { User } from '@/models/User';
import { JobRequirement } from '@/models/JobRequirement';
import { Application } from '@/models/Application';
import Link from 'next/link';
import { StatsCard } from '@/components/shared/StatsCard';
import { StatusBadge } from '@/components/shared/Badges';

export default async function AdminDashboardPage() {
  let pending = 0, coordinators = 0, recruiters = 0, jobs = 0, appCount = 0;
  let pendingUsers: Array<{ _id: string; name: string; email: string; role: string; createdAt: Date }> = [];

  try {
    await connectDB();
    [pending, coordinators, recruiters, jobs, appCount] = await Promise.all([
      User.countDocuments({ approvalStatus: 'pending' }),
      User.countDocuments({ role: 'coordinator', approvalStatus: 'approved' }),
      User.countDocuments({ role: 'recruiter', approvalStatus: 'approved' }),
      JobRequirement.countDocuments(),
      Application.countDocuments(),
    ]);
    pendingUsers = await User.find({ approvalStatus: 'pending' }).sort({ createdAt: -1 }).limit(5).select('name email role createdAt').lean();
  } catch {
    /* DB unavailable */
  }

  return (
    <div className="fade-in">
      <div className="page-header" style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
        <div>
          <h1 className="page-title">Admin Dashboard</h1>
          <p className="page-subtitle">Platform-wide overview and management</p>
        </div>
        {pending > 0 && (
          <Link href="/admin/approvals" className="btn btn-primary">
            ⏳ {pending} Pending Approval{pending !== 1 ? 's' : ''}
          </Link>
        )}
      </div>

      {/* Stats */}
      <div className="grid-4" style={{ marginBottom: 32 }}>
        <Link href="/admin/approvals" style={{ textDecoration: 'none' }}>
          <StatsCard icon="⏳" label="Pending Approvals" value={pending} accent={pending > 0 ? 'orange' : 'blue'} />
        </Link>
        <Link href="/admin/users" style={{ textDecoration: 'none' }}>
          <StatsCard icon="🎓" label="Coordinators" value={coordinators} accent="blue" />
        </Link>
        <Link href="/admin/users" style={{ textDecoration: 'none' }}>
          <StatsCard icon="🏢" label="Recruiters" value={recruiters} accent="blue" />
        </Link>
        <StatsCard icon="📋" label="Job Postings" value={jobs} accent="green" />
      </div>

      <div className="grid-2" style={{ gap: 24 }}>
        {/* Pending users quick action */}
        <div className="card-flat" style={{ padding: '20px 24px' }}>
          <div className="section-header">
            <span className="section-title">Pending Approvals</span>
            <Link href="/admin/approvals" style={{ fontSize: '0.8rem', color: 'var(--primary-light)', textDecoration: 'none' }}>Manage all →</Link>
          </div>
          {pendingUsers.length === 0 ? (
            <div className="empty-state" style={{ padding: '28px 0' }}>
              <div className="empty-icon">✅</div>
              <div className="empty-title">All caught up!</div>
              <div className="empty-desc">No pending registration requests</div>
            </div>
          ) : (
            pendingUsers.map((u) => (
              <div key={u._id.toString()} className="activity-item">
                <div className="activity-dot warning" />
                <div style={{ flex: 1 }}>
                  <div className="activity-text" style={{ color: 'var(--text-primary)', fontWeight: 600 }}>{u.name}</div>
                  <div className="activity-text">{u.email}</div>
                  <div style={{ display: 'flex', gap: 6, marginTop: 4 }}>
                    <StatusBadge status={u.role} />
                    <span className="activity-time">{new Date(u.createdAt).toLocaleDateString('en-IN')}</span>
                  </div>
                </div>
                <Link href="/admin/approvals" className="btn btn-sm btn-primary">Review</Link>
              </div>
            ))
          )}
        </div>

        {/* Quick stats summary */}
        <div className="card-flat" style={{ padding: '20px 24px' }}>
          <div className="section-header">
            <span className="section-title">Platform Summary</span>
          </div>
          {[
            { label: 'Total Job Postings', value: jobs, icon: '📋' },
            { label: 'Total Applications', value: appCount, icon: '📥' },
            { label: 'Active Coordinators', value: coordinators, icon: '🎓' },
            { label: 'Active Recruiters', value: recruiters, icon: '🏢' },
          ].map((s) => (
            <div key={s.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: '1px solid var(--border)' }}>
              <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: 8 }}>
                <span>{s.icon}</span> {s.label}
              </span>
              <span style={{ fontWeight: 700, fontSize: '1.1rem', color: 'var(--text-primary)' }}>{s.value}</span>
            </div>
          ))}
          <div style={{ marginTop: 16 }}>
            <Link href="/admin/analytics" className="btn btn-secondary btn-sm">📈 View Analytics</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
