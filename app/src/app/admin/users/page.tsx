'use client';

import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { StatusBadge } from '@/components/shared/Badges';
import { Modal } from '@/components/shared/Modal';

type User = {
  _id: string;
  name: string;
  email: string;
  role: string;
  approvalStatus: string;
  phone?: string;
  state?: string;
  createdAt: string;
  lastLoginAt?: string;
};

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState({ role: '', status: '' });
  const [suspendTarget, setSuspendTarget] = useState<User | null>(null);
  const [acting, setActing] = useState<string | null>(null);

  function load() {
    setLoading(true);
    const params = new URLSearchParams();
    if (filter.role) params.set('role', filter.role);
    if (filter.status) params.set('approvalStatus', filter.status);
    fetch(`/api/admin/users?${params}`)
      .then(r => r.json())
      .then(j => { if (j.success) setUsers(j.data); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }

  useEffect(() => { load(); }, [filter]); // eslint-disable-line react-hooks/exhaustive-deps

  async function toggleSuspend(u: User) {
    setActing(u._id);
    const action = u.approvalStatus === 'suspended' ? 'reinstate' : 'suspend';
    try {
      const res = await fetch(`/api/admin/users/${u._id}/suspend`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action }),
      });
      if (!res.ok) throw new Error();
      toast.success(action === 'suspend' ? 'User suspended' : 'User reinstated');
      setUsers(prev => prev.map(x => x._id === u._id ? { ...x, approvalStatus: action === 'suspend' ? 'suspended' : 'approved' } : x));
    } catch {
      toast.error('Action failed');
    } finally {
      setActing(null);
      setSuspendTarget(null);
    }
  }

  return (
    <div className="fade-in">
      <div className="page-header">
        <h1 className="page-title">User Management</h1>
        <p className="page-subtitle">View and manage all platform users</p>
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 24, flexWrap: 'wrap' }}>
        <select className="form-select" style={{ width: 'auto', minWidth: 160 }} value={filter.role} onChange={e => setFilter(f => ({ ...f, role: e.target.value }))}>
          <option value="">All Roles</option>
          <option value="coordinator">Coordinator</option>
          <option value="recruiter">Recruiter</option>
          <option value="super_admin">Super Admin</option>
        </select>
        <select className="form-select" style={{ width: 'auto', minWidth: 160 }} value={filter.status} onChange={e => setFilter(f => ({ ...f, status: e.target.value }))}>
          <option value="">All Statuses</option>
          <option value="approved">Approved</option>
          <option value="pending">Pending</option>
          <option value="rejected">Rejected</option>
          <option value="suspended">Suspended</option>
        </select>
      </div>

      {/* Table */}
      {loading ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {[...Array(5)].map((_, i) => <div key={i} className="skeleton" style={{ height: 52, borderRadius: 8 }} />)}
        </div>
      ) : (
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>User</th>
                <th>Role</th>
                <th>Status</th>
                <th>State</th>
                <th>Registered</th>
                <th>Last Login</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.length === 0 ? (
                <tr><td colSpan={7} style={{ textAlign: 'center', padding: 40, color: 'var(--text-muted)' }}>No users found</td></tr>
              ) : users.map(u => (
                <tr key={u._id}>
                  <td>
                    <div className="td-primary">{u.name}</div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{u.email}</div>
                  </td>
                  <td><StatusBadge status={u.role} /></td>
                  <td><StatusBadge status={u.approvalStatus} /></td>
                  <td>{u.state || '—'}</td>
                  <td style={{ fontSize: '0.8rem' }}>{new Date(u.createdAt).toLocaleDateString('en-IN')}</td>
                  <td style={{ fontSize: '0.8rem' }}>{u.lastLoginAt ? new Date(u.lastLoginAt).toLocaleDateString('en-IN') : '—'}</td>
                  <td>
                    {u.role !== 'super_admin' && (
                      <button
                        className={`btn btn-sm ${u.approvalStatus === 'suspended' ? 'btn-success' : 'btn-secondary'}`}
                        style={{ fontSize: '0.78rem' }}
                        onClick={() => setSuspendTarget(u)}
                        disabled={acting === u._id}
                      >
                        {u.approvalStatus === 'suspended' ? 'Reinstate' : 'Suspend'}
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Modal
        open={!!suspendTarget}
        onClose={() => setSuspendTarget(null)}
        title={suspendTarget?.approvalStatus === 'suspended' ? 'Reinstate User' : 'Suspend User'}
        footer={
          <>
            <button className="btn btn-ghost" onClick={() => setSuspendTarget(null)}>Cancel</button>
            <button
              className={`btn ${suspendTarget?.approvalStatus === 'suspended' ? 'btn-success' : 'btn-danger'}`}
              onClick={() => suspendTarget && toggleSuspend(suspendTarget)}
              disabled={!!acting}
            >
              {acting ? '…' : suspendTarget?.approvalStatus === 'suspended' ? 'Reinstate' : 'Suspend'}
            </button>
          </>
        }
      >
        <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6 }}>
          {suspendTarget?.approvalStatus === 'suspended'
            ? `Reinstate ${suspendTarget?.name}? They will regain full access to the platform.`
            : `Suspend ${suspendTarget?.name}? They will lose access immediately but their data will be preserved.`
          }
        </p>
      </Modal>
    </div>
  );
}
