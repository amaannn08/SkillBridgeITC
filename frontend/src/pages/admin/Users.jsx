import { useState } from 'react';
import { Search, ShieldOff, ShieldCheck } from 'lucide-react';
import { StatusBadge } from '../../components/shared/Badges';
import { MOCK_USERS } from '../../data/mockData';
import toast from 'react-hot-toast';

export default function AdminUsers() {
  const [users, setUsers] = useState(MOCK_USERS);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  const filtered = users.filter(u => {
    const matchRole = roleFilter === 'all' || u.role === roleFilter;
    const matchStatus = statusFilter === 'all' || u.approvalStatus === statusFilter;
    const matchSearch = u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase());
    return matchRole && matchStatus && matchSearch;
  });

  const toggleSuspend = (userId) => {
    setUsers(prev => prev.map(u => {
      if (u._id !== userId) return u;
      const next = u.approvalStatus === 'suspended' ? 'approved' : 'suspended';
      toast.success(`User ${next === 'suspended' ? 'suspended' : 'reinstated'}`);
      return { ...u, approvalStatus: next };
    }));
  };

  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <h1 className="page-title">All Users</h1>
        <p className="page-subtitle">{users.length} registered users on the platform</p>
      </div>

      <div className="card">
        <div className="flex flex-col sm:flex-row gap-3 mb-5">
          <div className="search-wrap flex-1">
            <Search size={15} className="search-icon" />
            <input className="form-input" placeholder="Search users…" value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <select className="form-input form-select w-full sm:w-44" value={roleFilter} onChange={e => setRoleFilter(e.target.value)}>
            <option value="all">All Roles</option>
            <option value="super_admin">Super Admin</option>
            <option value="coordinator">Coordinator</option>
            <option value="recruiter">Recruiter</option>
          </select>
          <select className="form-input form-select w-full sm:w-44" value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
            <option value="all">All Statuses</option>
            <option value="approved">Approved</option>
            <option value="pending">Pending</option>
            <option value="rejected">Rejected</option>
            <option value="suspended">Suspended</option>
          </select>
        </div>

        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>User</th>
                <th>Role</th>
                <th>Status</th>
                <th>State / Company</th>
                <th>Designation</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(u => (
                <tr key={u._id}>
                  <td>
                    <div className="flex items-center gap-3">
                      <img src={u.profileImage} alt={u.name} className="w-8 h-8 rounded-full flex-shrink-0" />
                      <div>
                        <p className="font-semibold text-gray-800 text-sm">{u.name}</p>
                        <p className="text-xs text-gray-400">{u.email}</p>
                      </div>
                    </div>
                  </td>
                  <td><StatusBadge type="role" status={u.role} /></td>
                  <td><StatusBadge type="user" status={u.approvalStatus} /></td>
                  <td className="text-sm text-gray-600">{u.state || u.companyId || '—'}</td>
                  <td className="text-sm text-gray-500">{u.designation || '—'}</td>
                  <td>
                    {u.role !== 'super_admin' && (u.approvalStatus === 'approved' || u.approvalStatus === 'suspended') && (
                      <button
                        onClick={() => toggleSuspend(u._id)}
                        className={`btn btn-sm ${u.approvalStatus === 'suspended' ? 'btn-success' : 'btn-outline text-orange-500 border-orange-200 hover:bg-orange-50'}`}
                      >
                        {u.approvalStatus === 'suspended'
                          ? <><ShieldCheck size={13} /> Reinstate</>
                          : <><ShieldOff size={13} /> Suspend</>
                        }
                      </button>
                    )}
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={6} className="text-center py-12 text-gray-400">No users match your filters</td></tr>
              )}
            </tbody>
          </table>
        </div>
        <p className="text-xs text-gray-400 mt-3">{filtered.length} of {users.length} users shown</p>
      </div>
    </div>
  );
}
