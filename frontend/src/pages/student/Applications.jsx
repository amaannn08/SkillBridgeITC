import { Briefcase, Building2, Calendar, ChevronDown, ChevronUp } from 'lucide-react';
import { useState } from 'react';
import { StatusBadge } from '../../components/shared/Badges';
import { useApp } from '../../context/AppContext';
import { MOCK_APPLICATIONS, MOCK_JOBS, MOCK_COMPANIES, MOCK_BATCHES } from '../../data/mockData';

const STATUS_INFO = {
  applied:     { color: 'bg-blue-50 border-blue-100',   label: 'Applied',     desc: 'Your application has been submitted and is awaiting review.' },
  shortlisted: { color: 'bg-yellow-50 border-yellow-100', label: 'Shortlisted', desc: 'Great news! The recruiter has shortlisted you for further evaluation.' },
  on_hold:     { color: 'bg-purple-50 border-purple-100', label: 'On Hold',     desc: 'Your application is on hold. The recruiter may revisit it.' },
  rejected:    { color: 'bg-red-50 border-red-100',     label: 'Rejected',    desc: 'Unfortunately, you were not selected for this role.' },
  selected:    { color: 'bg-green-50 border-green-100', label: 'Selected 🎉', desc: 'Congratulations! You have been selected for this position.' },
};

export default function StudentApplications() {
  const { currentUser } = useApp();
  const [expanded, setExpanded] = useState(null);

  const myBatch = MOCK_BATCHES.find(b => b._id === currentUser.batchId);

  const myApps = MOCK_APPLICATIONS
    .filter(a => a.talentPoolBatchId === currentUser.batchId)
    .map(app => {
      const ss = app.studentStatuses.find(s => s.studentId === currentUser._id);
      const job = MOCK_JOBS.find(j => j._id === app.jobRequirementId);
      const company = MOCK_COMPANIES.find(c => c._id === app.companyId);
      return { ...app, myStatus: ss, job, company };
    })
    .filter(a => a.myStatus); // only apps where this student appears

  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <h1 className="page-title">My Applications</h1>
        <p className="page-subtitle">Track your placement application status in real time</p>
      </div>

      {myApps.length === 0 ? (
        <div className="card empty-state">
          <div className="empty-state-icon">📋</div>
          <p className="empty-state-title">No applications yet</p>
          <p className="empty-state-desc">Your coordinator will apply on your behalf once a matching job is found</p>
        </div>
      ) : (
        <div className="space-y-4">
          {myApps.map(app => {
            const info = STATUS_INFO[app.myStatus?.status] || STATUS_INFO.applied;
            const isOpen = expanded === app._id;
            return (
              <div key={app._id} className={`card border ${info.color}`}>
                {/* Header row */}
                <div
                  className="flex items-center gap-4 cursor-pointer"
                  onClick={() => setExpanded(isOpen ? null : app._id)}
                >
                  <div className="w-12 h-12 bg-white rounded-xl border border-gray-100 flex items-center justify-center flex-shrink-0 shadow-sm">
                    <Briefcase size={20} className="text-blue-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-0.5">
                      <h3 className="font-bold text-gray-900">{app.job?.title}</h3>
                      <StatusBadge type="student" status={app.myStatus?.status} />
                    </div>
                    <p className="text-sm text-gray-500">{app.company?.name} · {app.job?.location}, {app.job?.state}</p>
                  </div>
                  <div className="flex items-center gap-3 flex-shrink-0">
                    <div className="text-right hidden sm:block">
                      <p className="text-xs text-gray-400">Submitted</p>
                      <p className="text-sm font-medium text-gray-600">{app.submittedAt}</p>
                    </div>
                    {isOpen ? <ChevronUp size={18} className="text-gray-400" /> : <ChevronDown size={18} className="text-gray-400" />}
                  </div>
                </div>

                {/* Expanded detail */}
                {isOpen && (
                  <div className="mt-5 pt-5 border-t border-white/60 animate-fade-in space-y-4">
                    {/* Status banner */}
                    <div className="bg-white rounded-xl p-4 border border-gray-100">
                      <p className="text-sm font-semibold text-gray-800 mb-1">{info.label}</p>
                      <p className="text-sm text-gray-500">{info.desc}</p>
                      {app.myStatus?.recruiterNote && (
                        <div className="mt-3 bg-gray-50 rounded-lg p-3">
                          <p className="text-xs font-semibold text-gray-500 mb-1">Recruiter Note</p>
                          <p className="text-sm text-gray-700 italic">"{app.myStatus.recruiterNote}"</p>
                        </div>
                      )}
                    </div>

                    {/* Job details */}
                    <div className="grid sm:grid-cols-3 gap-3">
                      <div className="bg-white rounded-xl p-3 border border-gray-100">
                        <p className="text-xs text-gray-400 mb-1">Salary Range</p>
                        <p className="font-semibold text-gray-800 text-sm">₹{app.job?.salaryMin?.toLocaleString('en-IN')}–{app.job?.salaryMax?.toLocaleString('en-IN')}/mo</p>
                      </div>
                      <div className="bg-white rounded-xl p-3 border border-gray-100">
                        <p className="text-xs text-gray-400 mb-1">Experience Level</p>
                        <p className="font-semibold text-gray-800 text-sm">{app.job?.experienceLevel}</p>
                      </div>
                      <div className="bg-white rounded-xl p-3 border border-gray-100">
                        <p className="text-xs text-gray-400 mb-1">Application Deadline</p>
                        <p className="font-semibold text-gray-800 text-sm">{app.job?.applicationDeadline}</p>
                      </div>
                    </div>

                    {/* Skills required */}
                    <div>
                      <p className="text-xs font-semibold text-gray-500 mb-2">Required Skills</p>
                      <div className="flex flex-wrap gap-1.5">
                        {(app.job?.skills || []).map(s => <span key={s} className="badge badge-blue">{s}</span>)}
                      </div>
                    </div>

                    <p className="text-xs text-gray-400">Last updated: {app.myStatus?.updatedAt}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
