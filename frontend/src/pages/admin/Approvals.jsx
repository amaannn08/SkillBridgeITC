import { useState } from 'react';
import { CheckCircle, XCircle, Eye, User, Building2, Briefcase, Clock, Search } from 'lucide-react';
import { StatusBadge } from '../../components/shared/Badges';
import { MOCK_USERS, MOCK_INSTITUTIONS, MOCK_COMPANIES } from '../../data/mockData';
import { formatDistanceToNow } from 'date-fns';
import toast from 'react-hot-toast';

export default function AdminApprovals() {
  const [users, setUsers] = useState(MOCK_USERS);
  const [filter, setFilter] = useState('pending');
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState(null);
  const [rejectReason, setRejectReason] = useState('');
  const [showRejectModal, setShowRejectModal] = useState(null);

  const filtered = users.filter(u => {
    const matchStatus = filter === 'all' ? true : u.approvalStatus === filter;
    const matchSearch = u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase());
    return matchStatus && matchSearch;
  });

  const approve = (userId) => {
    setUsers(prev => prev.map(u => u._id === userId ? { ...u, approvalStatus: 'approved' } : u));
    setSelected(null);
    toast.success('User approved successfully');
  };

  const reject = (userId) => {
    setUsers(prev => prev.map(u => u._id === userId ? { ...u, approvalStatus: 'rejected', rejectionReason: rejectReason } : u));
    setShowRejectModal(null);
    setRejectReason('');
    setSelected(null);
    toast.error('User registration rejected');
  };

  const counts = {
    all: users.length,
    pending: users.filter(u => u.approvalStatus === 'pending').length,
    approved: users.filter(u => u.approvalStatus === 'approved').length,
    rejected: users.filter(u => u.approvalStatus === 'rejected').length,
  };

  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <h1 className="page-title">Pending Approvals</h1>
        <p className="page-subtitle">Review and manage registration requests</p>
      </div>

      {/* Filter tabs + search */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div className="tab-bar mb-0 border-0 gap-1">
          {[['pending','Pending'],['approved','Approved'],['rejected','Rejected'],['all','All']].map(([val, label]) => (
            <button key={val} onClick={() => setFilter(val)}
              className={`tab-item ${filter === val ? 'active' : ''}`}>
              {label}
              <span className={`ml-1.5 px-1.5 py-0.5 rounded-full text-xs font-bold ${filter === val ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-500'}`}>
                {counts[val]}
              </span>
            </button>
          ))}
        </div>
        <div className="search-wrap w-full sm:w-64">
          <Search size={15} className="search-icon" />
          <input className="form-input" placeholder="Search by name or email…" value={search} onChange={e => setSearch(e.target.value)} />
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* List */}
        <div className="lg:col-span-1 space-y-3">
          {filtered.length === 0 && (
            <div className="card empty-state">
              <div className="empty-state-icon">📭</div>
              <p className="empty-state-title">No registrations found</p>
            </div>
          )}
          {filtered.map(u => (
            <div key={u._id}
              onClick={() => setSelected(u)}
              className={`card card-sm card-interactive flex items-center gap-3 ${selected?._id === u._id ? 'border-blue-400 ring-2 ring-blue-100' : ''}`}>
              <img src={u.profileImage} alt={u.name} className="w-10 h-10 rounded-full flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm text-gray-800 truncate">{u.name}</p>
                <p className="text-xs text-gray-400 truncate">{u.email}</p>
                <div className="flex items-center gap-2 mt-1.5">
                  <StatusBadge type="role" status={u.role} />
                  <StatusBadge type="user" status={u.approvalStatus} />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Detail panel */}
        <div className="lg:col-span-2">
          {!selected ? (
            <div className="card empty-state h-full flex flex-col items-center justify-center min-h-64">
              <Eye size={32} className="text-gray-300 mb-3" />
              <p className="empty-state-title">Select a registration to review</p>
              <p className="empty-state-desc">Click any item on the left to see details</p>
            </div>
          ) : (
            <div className="card animate-fade-in">
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center gap-4">
                  <img src={selected.profileImage} alt={selected.name} className="w-14 h-14 rounded-full" />
                  <div>
                    <h2 className="text-lg font-bold text-gray-900">{selected.name}</h2>
                    <p className="text-sm text-gray-500">{selected.email}</p>
                    <div className="flex gap-2 mt-2">
                      <StatusBadge type="role" status={selected.role} />
                      <StatusBadge type="user" status={selected.approvalStatus} />
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4 mb-6">
                {[
                  { label: 'Designation', value: selected.designation || '—' },
                  { label: 'State', value: selected.state || '—' },
                  { label: 'Institution ID', value: selected.institutionId || '—' },
                  { label: 'Company ID', value: selected.companyId || '—' },
                ].map(f => (
                  <div key={f.label} className="bg-gray-50 rounded-xl p-3">
                    <p className="text-xs text-gray-400 font-medium mb-1">{f.label}</p>
                    <p className="text-sm font-semibold text-gray-700">{f.value}</p>
                  </div>
                ))}
              </div>

              {selected.rejectionReason && (
                <div className="bg-red-50 border border-red-100 rounded-xl p-4 mb-6">
                  <p className="text-xs font-semibold text-red-600 mb-1">Rejection Reason</p>
                  <p className="text-sm text-red-700">{selected.rejectionReason}</p>
                </div>
              )}

              {selected.approvalStatus === 'pending' && (
                <div className="flex gap-3">
                  <button onClick={() => approve(selected._id)} className="btn btn-success flex-1">
                    <CheckCircle size={16} /> Approve
                  </button>
                  <button onClick={() => setShowRejectModal(selected)} className="btn btn-danger flex-1">
                    <XCircle size={16} /> Reject
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Reject modal */}
      {showRejectModal && (
        <div className="modal-overlay" onClick={() => setShowRejectModal(null)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <h3 className="text-lg font-bold text-gray-900 mb-1">Reject Registration</h3>
            <p className="text-sm text-gray-500 mb-5">Provide a reason so the applicant understands why they were rejected.</p>
            <label className="form-label">Rejection Reason <span className="text-red-500">*</span></label>
            <textarea className="form-input form-textarea mb-5" placeholder="e.g. AICTE code does not match records…"
              value={rejectReason} onChange={e => setRejectReason(e.target.value)} />
            <div className="flex gap-3">
              <button onClick={() => setShowRejectModal(null)} className="btn btn-outline flex-1">Cancel</button>
              <button onClick={() => reject(showRejectModal._id)} disabled={!rejectReason.trim()} className="btn btn-danger flex-1">
                Confirm Rejection
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
