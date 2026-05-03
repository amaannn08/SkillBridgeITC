import { useState } from 'react';
import { Briefcase, ChevronDown, ChevronUp, CheckCircle, Clock, Search, FileText, Star } from 'lucide-react';
import { StatusBadge } from '../../components/shared/Badges';
import { useApp } from '../../context/AppContext';
import { MOCK_APPLICATIONS, MOCK_JOBS, MOCK_COMPANIES, MOCK_BATCHES } from '../../data/mockData';

// Timeline stages in order
const TIMELINE_STAGES = [
  { key: 'applied',    label: 'Received',           icon: FileText },
  { key: 'shortlisted', label: 'Under Review',       icon: Search },
  { key: 'on_hold',    label: 'Interview Scheduled', icon: Clock },
  { key: 'selected',   label: 'Hired',               icon: Star },
];

// Map student status to timeline progress index
const STATUS_TO_STEP = {
  applied:     0,
  shortlisted: 1,
  on_hold:     2,
  selected:    3,
  rejected:    -1,
};

const STATUS_INFO = {
  applied:     { color: 'bg-blue-50 border-blue-100',     label: 'Application Received',    desc: 'Your application has been submitted and is awaiting review.' },
  shortlisted: { color: 'bg-yellow-50 border-yellow-100', label: 'Under Review',            desc: 'The recruiter has shortlisted you for further evaluation.' },
  on_hold:     { color: 'bg-purple-50 border-purple-100', label: 'Interview Scheduled',     desc: 'An interview has been scheduled. Check with your coordinator for details.' },
  rejected:    { color: 'bg-red-50 border-red-100',       label: 'Not Selected',            desc: 'Unfortunately, you were not selected for this role.' },
  selected:    { color: 'bg-green-50 border-green-100',   label: 'Hired 🎉',               desc: 'Congratulations! You have been selected for this position.' },
};

function StatusTimeline({ status }) {
  if (status === 'rejected') {
    return (
      <div className="flex items-center gap-2 p-3 bg-red-50 rounded-xl border border-red-100">
        <div className="w-6 h-6 rounded-full bg-red-500 flex items-center justify-center flex-shrink-0">
          <span style={{ color: '#fff', fontSize: 12, fontWeight: 700 }}>✕</span>
        </div>
        <span className="text-sm font-semibold text-red-700">Application Not Selected</span>
      </div>
    );
  }

  const currentStep = STATUS_TO_STEP[status] ?? 0;

  return (
    <div className="flex items-center gap-0">
      {TIMELINE_STAGES.map((stage, i) => {
        const done = i < currentStep;
        const active = i === currentStep;
        const Icon = stage.icon;
        return (
          <div key={stage.key} className="flex items-center flex-1">
            <div className="flex flex-col items-center flex-shrink-0">
              <div style={{
                width: 32, height: 32, borderRadius: '50%',
                background: done ? '#16A34A' : active ? '#2563EB' : '#E2E8F0',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                border: active ? '2px solid #93C5FD' : 'none',
                transition: 'all 0.3s',
              }}>
                {done
                  ? <CheckCircle size={16} style={{ color: '#fff' }} />
                  : <Icon size={14} style={{ color: active ? '#fff' : '#94A3B8' }} />
                }
              </div>
              <p style={{ fontSize: 10, fontWeight: active ? 700 : 500, color: active ? '#2563EB' : done ? '#16A34A' : '#94A3B8', marginTop: 4, textAlign: 'center', whiteSpace: 'nowrap' }}>
                {stage.label}
              </p>
            </div>
            {i < TIMELINE_STAGES.length - 1 && (
              <div style={{ flex: 1, height: 2, background: done ? '#16A34A' : '#E2E8F0', margin: '0 4px', marginBottom: 18, transition: 'background 0.3s' }} />
            )}
          </div>
        );
      })}
    </div>
  );
}

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
    .filter(a => a.myStatus);

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
                {/* Header */}
                <div className="flex items-center gap-4 cursor-pointer" onClick={() => setExpanded(isOpen ? null : app._id)}>
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

                {/* Expanded */}
                {isOpen && (
                  <div className="mt-5 pt-5 border-t border-white/60 animate-fade-in space-y-5">
                    {/* Timeline */}
                    <div className="bg-white rounded-xl p-4 border border-gray-100">
                      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">Application Progress</p>
                      <StatusTimeline status={app.myStatus?.status} />
                    </div>

                    {/* Status info */}
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
                        <p className="text-xs text-gray-400 mb-1">Deadline</p>
                        <p className="font-semibold text-gray-800 text-sm">{app.job?.applicationDeadline}</p>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-1.5">
                      {(app.job?.skills || []).map(s => <span key={s} className="badge badge-blue">{s}</span>)}
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
