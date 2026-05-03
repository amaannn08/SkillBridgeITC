import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Users, Download, CheckSquare, XCircle } from 'lucide-react';
import { StatusBadge } from '../../components/shared/Badges';
import { MOCK_JOBS, MOCK_APPLICATIONS, MOCK_BATCHES } from '../../data/mockData';
import toast from 'react-hot-toast';

const STUDENT_ACTIONS = ['applied', 'shortlisted', 'on_hold', 'rejected', 'selected'];

export default function RecruiterJobApplications() {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const job = MOCK_JOBS.find(j => j._id === jobId);
  const [apps, setApps] = useState(MOCK_APPLICATIONS.filter(a => a.jobRequirementId === jobId));
  const [selected, setSelected] = useState({}); // { [appId_studentId]: bool }

  if (!job) return (
    <div className="card empty-state mt-8">
      <p className="empty-state-title">Job not found</p>
      <button onClick={() => navigate('/recruiter/jobs')} className="btn btn-outline mt-4">Go Back</button>
    </div>
  );

  const updateStudentStatus = (appId, studentId, newStatus) => {
    setApps(prev => prev.map(a => a._id === appId
      ? { ...a, studentStatuses: a.studentStatuses.map(ss => ss.studentId === studentId ? { ...ss, status: newStatus, updatedAt: new Date().toISOString().split('T')[0] } : ss) }
      : a
    ));
    toast.success(`Status → ${newStatus}`);
  };

  const toggleSelect = (appId, studentId) => {
    const key = `${appId}_${studentId}`;
    setSelected(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const getSelectedPairs = () =>
    Object.entries(selected).filter(([, v]) => v).map(([k]) => {
      const [appId, studentId] = k.split('_');
      return { appId, studentId };
    });

  const bulkUpdate = (newStatus) => {
    const pairs = getSelectedPairs();
    if (pairs.length === 0) { toast.error('Select students first'); return; }
    setApps(prev => prev.map(a => ({
      ...a,
      studentStatuses: a.studentStatuses.map(ss => {
        const match = pairs.find(p => p.appId === a._id && p.studentId === ss.studentId);
        return match ? { ...ss, status: newStatus, updatedAt: new Date().toISOString().split('T')[0] } : ss;
      }),
    })));
    setSelected({});
    toast.success(`${pairs.length} students marked as ${newStatus}`);
  };

  const handleDownload = (filter = 'all') => {
    toast.success(`Preparing ${filter === 'all' ? 'all' : 'shortlisted'} resumes ZIP… (demo)`);
  };

  const selectedCount = getSelectedPairs().length;

  return (
    <div className="animate-fade-in">
      <button onClick={() => navigate('/recruiter/jobs')} className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 mb-6 transition-colors">
        <ArrowLeft size={16} /> Back to Jobs
      </button>

      <div className="page-header flex items-start justify-between">
        <div>
          <h1 className="page-title">{job.title}</h1>
          <p className="page-subtitle">{apps.length} application{apps.length !== 1 ? 's' : ''} received</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => handleDownload('shortlisted')} className="btn btn-outline btn-sm">
            <Download size={14} /> Shortlisted ZIPs
          </button>
          <button onClick={() => handleDownload('all')} className="btn btn-outline btn-sm">
            <Download size={14} /> All Resumes
          </button>
        </div>
      </div>

      {/* Bulk action bar */}
      {selectedCount > 0 && (
        <div className="card card-sm bg-blue-50 border-blue-200 flex items-center gap-4 mb-5 animate-fade-in">
          <span className="text-sm font-semibold text-blue-700">{selectedCount} student{selectedCount !== 1 ? 's' : ''} selected</span>
          <div className="flex gap-2 ml-auto">
            <button onClick={() => bulkUpdate('shortlisted')} className="btn btn-success btn-sm"><CheckSquare size={13} /> Shortlist All</button>
            <button onClick={() => bulkUpdate('rejected')} className="btn btn-danger btn-sm"><XCircle size={13} /> Reject All</button>
            <button onClick={() => setSelected({})} className="btn btn-ghost btn-sm">Clear</button>
          </div>
        </div>
      )}

      {apps.length === 0 ? (
        <div className="card empty-state">
          <div className="empty-state-icon">📭</div>
          <p className="empty-state-title">No applications yet</p>
          <p className="empty-state-desc">Coordinators will apply once they find a matching batch</p>
        </div>
      ) : (
        <div className="space-y-5">
          {apps.map(app => {
            const batch = MOCK_BATCHES.find(b => b._id === app.talentPoolBatchId);
            return (
              <div key={app._id} className="card">
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <h3 className="font-bold text-gray-900 flex items-center gap-2">
                        <Users size={16} className="text-blue-500" /> {batch?.name || 'Unknown Batch'}
                      </h3>
                      <StatusBadge type="application" status={app.status} />
                    </div>
                    <p className="text-sm text-gray-500">{batch?.qualification} · {batch?.branch} · {app.studentStatuses.length} students</p>
                    {app.coverNote && (
                      <p className="text-sm text-gray-600 italic mt-2 bg-gray-50 rounded-lg px-3 py-2">"{app.coverNote}"</p>
                    )}
                  </div>
                  <p className="text-xs text-gray-400 flex-shrink-0">Submitted: {app.submittedAt}</p>
                </div>

                <div className="table-wrapper">
                  <table>
                    <thead>
                      <tr>
                        <th className="w-8"><input type="checkbox" className="rounded"
                          onChange={e => {
                            const updates = {};
                            app.studentStatuses.forEach(ss => { updates[`${app._id}_${ss.studentId}`] = e.target.checked; });
                            setSelected(prev => ({ ...prev, ...updates }));
                          }} /></th>
                        <th>Student</th>
                        <th>CGPA</th>
                        <th>Skills</th>
                        <th>Status</th>
                        <th>Update</th>
                      </tr>
                    </thead>
                    <tbody>
                      {app.studentStatuses.map(ss => {
                        const student = batch?.students.find(s => s._id === ss.studentId);
                        const key = `${app._id}_${ss.studentId}`;
                        return (
                          <tr key={ss.studentId} className={selected[key] ? 'bg-blue-50/50' : ''}>
                            <td>
                              <input type="checkbox" className="rounded" checked={!!selected[key]}
                                onChange={() => toggleSelect(app._id, ss.studentId)} />
                            </td>
                            <td>
                              <p className="font-semibold text-sm text-gray-800">{student?.name || ss.studentId}</p>
                              <p className="text-xs text-gray-400">{student?.gender} · {student?.address}</p>
                            </td>
                            <td>
                              <span className={`font-bold text-sm ${(student?.cgpa || 0) >= 8.5 ? 'text-green-600' : 'text-blue-600'}`}>
                                {student?.cgpa || '—'}
                              </span>
                            </td>
                            <td>
                              <div className="flex flex-wrap gap-1">
                                {(student?.skills || []).slice(0, 2).map(s => <span key={s} className="badge badge-gray">{s}</span>)}
                              </div>
                            </td>
                            <td><StatusBadge type="student" status={ss.status} /></td>
                            <td>
                              <select className="form-input form-select py-1.5 text-xs w-36"
                                value={ss.status}
                                onChange={e => updateStudentStatus(app._id, ss.studentId, e.target.value)}>
                                {STUDENT_ACTIONS.map(a => <option key={a} value={a}>{a.charAt(0).toUpperCase() + a.slice(1).replace('_', ' ')}</option>)}
                              </select>
                            </td>
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
    </div>
  );
}
