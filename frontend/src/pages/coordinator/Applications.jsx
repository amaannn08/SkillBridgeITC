import { useState } from 'react';
import { Briefcase, Trash2 } from 'lucide-react';
import { StatusBadge } from '../../components/shared/Badges';
import { useApp } from '../../context/AppContext';
import { MOCK_APPLICATIONS, MOCK_JOBS, MOCK_COMPANIES, MOCK_BATCHES } from '../../data/mockData';
import toast from 'react-hot-toast';

export default function CoordApplications() {
  const { currentUser } = useApp();
  const [apps, setApps] = useState(MOCK_APPLICATIONS.filter(a => a.coordinatorId === currentUser._id));
  const [withdrawConfirm, setWithdrawConfirm] = useState(null);

  const withdraw = (appId) => {
    setApps(prev => prev.filter(a => a._id !== appId));
    setWithdrawConfirm(null);
    toast.success('Application withdrawn');
  };

  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <h1 className="page-title">My Applications</h1>
        <p className="page-subtitle">Track the status of all your submitted applications</p>
      </div>

      {apps.length === 0 ? (
        <div className="card empty-state">
          <div className="empty-state-icon">📋</div>
          <p className="empty-state-title">No applications yet</p>
          <p className="empty-state-desc">Browse jobs and apply with your talent pool batches</p>
        </div>
      ) : (
        <div className="space-y-5">
          {apps.map(app => {
            const job = MOCK_JOBS.find(j => j._id === app.jobRequirementId);
            const company = MOCK_COMPANIES.find(c => c._id === app.companyId);
            const batch = MOCK_BATCHES.find(b => b._id === app.talentPoolBatchId);
            const canWithdraw = app.status === 'submitted' && job?.status === 'open';
            return (
              <div key={app._id} className="card">
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <h3 className="font-bold text-gray-900">{job?.title}</h3>
                      <StatusBadge type="application" status={app.status} />
                    </div>
                    <p className="text-sm text-gray-500">{company?.name} · Batch: {batch?.name}</p>
                    <p className="text-xs text-gray-400 mt-1">Submitted: {app.submittedAt}</p>
                  </div>
                  {canWithdraw && (
                    <button onClick={() => setWithdrawConfirm(app._id)} className="btn btn-outline btn-sm text-red-500 border-red-200 hover:bg-red-50 flex-shrink-0">
                      <Trash2 size={13} /> Withdraw
                    </button>
                  )}
                </div>

                {app.coverNote && (
                  <div className="bg-blue-50 rounded-xl p-3 mb-4 text-sm text-blue-800 italic">
                    "{app.coverNote}"
                  </div>
                )}

                <div className="table-wrapper">
                  <table className="mobile-card-table">
                    <thead>
                      <tr>
                        <th>Student</th>
                        <th>Status</th>
                        <th>Recruiter Note</th>
                        <th>Updated</th>
                      </tr>
                    </thead>
                    <tbody>
                      {app.studentStatuses.map(ss => {
                        const student = batch?.students.find(s => s._id === ss.studentId);
                        return (
                          <tr key={ss.studentId}>
                            <td className="font-medium text-gray-800">{student?.name || ss.studentId}</td>
                            <td data-label="Status"><StatusBadge type="student" status={ss.status} /></td>
                            <td data-label="Note" className="text-sm text-gray-500">{ss.recruiterNote || '—'}</td>
                            <td data-label="Updated" className="text-xs text-gray-400">{ss.updatedAt}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {withdrawConfirm && (
        <div className="modal-overlay" onClick={() => setWithdrawConfirm(null)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Withdraw Application?</h3>
            <p className="text-sm text-gray-500 mb-6">This will remove your application. The recruiter will be notified. This cannot be undone.</p>
            <div className="flex gap-3">
              <button onClick={() => setWithdrawConfirm(null)} className="btn btn-outline flex-1">Cancel</button>
              <button onClick={() => withdraw(withdrawConfirm)} className="btn btn-danger flex-1">Yes, Withdraw</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
