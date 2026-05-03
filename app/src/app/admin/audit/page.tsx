'use client';

import { useEffect, useState } from 'react';
import { formatDistanceToNow } from 'date-fns';

interface AuditEntry {
  _id: string;
  action: string;
  meta?: { email?: string; note?: string };
  createdAt: string;
  adminId?: { name?: string; email?: string };
  targetUserId?: { name?: string; email?: string; role?: string };
}

const ACTION_ICONS: Record<string, string> = {
  approval_approve: '✅',
  approval_reject: '❌',
  user_suspend: '🔒',
  user_reinstate: '🔓',
  job_close: '📋',
};

const ACTION_LABELS: Record<string, string> = {
  approval_approve: 'Approved registration',
  approval_reject: 'Rejected registration',
  user_suspend: 'Suspended user',
  user_reinstate: 'Reinstated user',
  job_close: 'Closed job',
};

export default function AdminAuditPage() {
  const [logs, setLogs] = useState<AuditEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');

  useEffect(() => {
    fetch('/api/admin/audit')
      .then(r => r.json())
      .then(j => { if (j.success) setLogs(j.data); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const filtered = filter
    ? logs.filter(l => l.action.includes(filter) || l.targetUserId?.email?.includes(filter))
    : logs;

  return (
    <div className="fade-in">
      <div className="page-header">
        <h1 className="page-title">Audit Log</h1>
        <p className="page-subtitle">Complete history of admin actions on the platform</p>
      </div>

      <div style={{ marginBottom: 20 }}>
        <select className="form-select" style={{ width: 'auto', minWidth: 200 }} value={filter} onChange={e => setFilter(e.target.value)}>
          <option value="">All Actions</option>
          {Object.entries(ACTION_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
        </select>
      </div>

      {loading ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {[...Array(5)].map((_, i) => <div key={i} className="skeleton" style={{ height: 64, borderRadius: 12 }} />)}
        </div>
      ) : filtered.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">📋</div>
          <div className="empty-title">No audit entries</div>
        </div>
      ) : (
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <div className="table-wrapper" style={{ margin: 0 }}>
            <table>
              <thead>
                <tr>
                  <th>Action</th>
                  <th>Target User</th>
                  <th>Admin</th>
                  <th>Details</th>
                  <th>When</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(log => (
                  <tr key={log._id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <span style={{ fontSize: '1.1rem' }}>{ACTION_ICONS[log.action] || '⚙️'}</span>
                        <span style={{ fontWeight: 600, fontSize: '0.875rem' }}>
                          {ACTION_LABELS[log.action] || log.action}
                        </span>
                      </div>
                    </td>
                    <td>
                      <div style={{ fontWeight: 600, fontSize: '0.875rem' }}>{log.targetUserId?.name || '—'}</div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{log.targetUserId?.email || log.meta?.email || '—'}</div>
                    </td>
                    <td style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                      {log.adminId?.name || '—'}
                    </td>
                    <td style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                      {log.meta?.note || '—'}
                    </td>
                    <td style={{ fontSize: '0.78rem', color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>
                      {formatDistanceToNow(new Date(log.createdAt), { addSuffix: true })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
