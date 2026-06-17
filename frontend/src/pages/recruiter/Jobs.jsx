import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, MapPin, Users, Calendar, ChevronRight, XCircle } from 'lucide-react';
import { StatusBadge, SlotBadge } from '../../components/shared/Badges';
import { useApp } from '../../context/AppContext';
import { MOCK_JOBS, MOCK_APPLICATIONS } from '../../data/mockData';
import { formatDistanceToNow } from 'date-fns';
import toast from 'react-hot-toast';

export default function RecruiterJobs() {
  const navigate = useNavigate();
  const { currentUser } = useApp();
  const [jobs, setJobs] = useState(MOCK_JOBS.filter(j => j.postedBy === currentUser._id));
  const [closeConfirm, setCloseConfirm] = useState(null);
  const [activeTab, setActiveTab] = useState('open');

  const tabs = ['open', 'draft', 'filled', 'closed'];
  const filtered = jobs.filter(j => j.status === activeTab);

  const closeJob = (jobId) => {
    setJobs(prev => prev.map(j => j._id === jobId ? { ...j, status: 'closed' } : j));
    setCloseConfirm(null);
    toast.success('Job requirement closed');
  };

  return (
    <div className="animate-fade-in">
      <div className="page-header flex flex-col sm:flex-row sm:items-start justify-between gap-3">
        <div>
          <h1 className="page-title">My Job Postings</h1>
          <p className="page-subtitle">{jobs.length} total postings</p>
        </div>
        <button onClick={() => navigate('/recruiter/jobs/new')} className="btn btn-primary flex-shrink-0">
          <Plus size={16} /> Post New Job
        </button>
      </div>

      <div className="tab-bar mb-6">
        {tabs.map(t => (
          <button key={t} onClick={() => setActiveTab(t)} className={`tab-item ${activeTab === t ? 'active' : ''}`}>
            {t.charAt(0).toUpperCase() + t.slice(1)}
            <span className={`ml-1.5 px-1.5 py-0.5 rounded-full text-xs font-bold ${activeTab === t ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-500'}`}>
              {jobs.filter(j => j.status === t).length}
            </span>
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="card empty-state">
          <div className="empty-state-icon">💼</div>
          <p className="empty-state-title">No {activeTab} jobs</p>
          {activeTab === 'open' && <button onClick={() => navigate('/recruiter/jobs/new')} className="btn btn-primary mt-4"><Plus size={15} /> Post Your First Job</button>}
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map(job => {
            const appCount = MOCK_APPLICATIONS.filter(a => a.jobRequirementId === job._id).length;
            const totalSeats = job.slots.reduce((s, sl) => s + sl.seats, 0);
            const filledSeats = job.slots.reduce((s, sl) => s + sl.filledSeats, 0);
            return (
              <div key={job._id} className="card card-hover">
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-bold text-gray-900">{job.title}</h3>
                      <StatusBadge type="job" status={job.status} />
                    </div>
                    <SlotBadge slots={job.slots} />
                    <div className="flex flex-wrap gap-4 mt-3 text-xs text-gray-500">
                      <span className="flex items-center gap-1"><MapPin size={12} />{job.location}, {job.state}</span>
                      <span className="flex items-center gap-1"><Users size={12} />{filledSeats}/{totalSeats} seats</span>
                      <span className="flex items-center gap-1"><Calendar size={12} />Deadline: {job.applicationDeadline}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 flex-shrink-0">
                    <div className="text-center px-4 py-2 bg-blue-50 rounded-xl">
                      <p className="text-xl font-bold text-blue-700">{appCount}</p>
                      <p className="text-xs text-blue-500">Applications</p>
                    </div>
                    <div className="flex flex-col gap-2">
                      <button onClick={() => navigate(`/recruiter/jobs/${job._id}/applications`)} className="btn btn-primary btn-sm">
                        Review <ChevronRight size={14} />
                      </button>
                      {job.status === 'open' && (
                        <button onClick={() => setCloseConfirm(job)} className="btn btn-outline btn-sm text-red-500 border-red-200 hover:bg-red-50">
                          <XCircle size={13} /> Close
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {closeConfirm && (
        <div className="modal-overlay" onClick={() => setCloseConfirm(null)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Close Job Requirement?</h3>
            <p className="text-sm text-gray-500 mb-2">You are about to close:</p>
            <div className="bg-gray-50 rounded-xl p-3 mb-5">
              <p className="font-semibold text-gray-800">{closeConfirm.title}</p>
              <p className="text-sm text-gray-500">{closeConfirm.location}, {closeConfirm.state}</p>
            </div>
            <p className="text-sm text-orange-600 mb-5">No new applications will be accepted. All coordinators who applied will be notified.</p>
            <div className="flex gap-3">
              <button onClick={() => setCloseConfirm(null)} className="btn btn-outline flex-1">Cancel</button>
              <button onClick={() => closeJob(closeConfirm._id)} className="btn btn-danger flex-1"><XCircle size={15} /> Close Job</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
