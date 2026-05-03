import { useNavigate } from 'react-router-dom';
import { Briefcase, ClipboardList, CheckCircle, Bell, ChevronRight, MapPin, Calendar, TrendingUp } from 'lucide-react';
import StatsCard from '../../components/shared/StatsCard';
import { StatusBadge, SlotBadge } from '../../components/shared/Badges';
import { useApp } from '../../context/AppContext';
import { MOCK_BATCHES, MOCK_APPLICATIONS, MOCK_JOBS, MOCK_COMPANIES, MOCK_INSTITUTIONS } from '../../data/mockData';

export default function StudentDashboard() {
  const navigate = useNavigate();
  const { currentUser, notifications } = useApp();

  // Find this student's data in their batch
  const myBatch = MOCK_BATCHES.find(b => b._id === currentUser.batchId);
  const myStudentData = myBatch?.students.find(s => s._id === currentUser._id);
  const institution = MOCK_INSTITUTIONS.find(i => i._id === currentUser.institutionId);

  // Applications where this student appears
  const myApps = MOCK_APPLICATIONS.filter(a =>
    a.talentPoolBatchId === currentUser.batchId &&
    a.studentStatuses.some(ss => ss.studentId === currentUser._id)
  );

  const myStatuses = myApps.map(app => {
    const ss = app.studentStatuses.find(s => s.studentId === currentUser._id);
    const job = MOCK_JOBS.find(j => j._id === app.jobRequirementId);
    const company = MOCK_COMPANIES.find(c => c._id === app.companyId);
    return { ...ss, job, company, appId: app._id };
  });

  const selectedCount = myStatuses.filter(s => s.status === 'selected').length;
  const shortlistedCount = myStatuses.filter(s => s.status === 'shortlisted').length;
  const unread = notifications.filter(n => !n.read).length;

  // Jobs open for this batch's qualification
  const openJobs = MOCK_JOBS.filter(j =>
    j.status === 'open' &&
    j.slots.some(sl => sl.qualification === myBatch?.qualification)
  ).slice(0, 3);

  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <h1 className="page-title">Welcome, {currentUser.name.split(' ')[0]} 👋</h1>
        <p className="page-subtitle">
          {myBatch?.name} · {institution?.name}
        </p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8 stagger-children">
        <StatsCard icon={ClipboardList} value={myApps.length}      label="Applications"       color="blue"   delay={0}   />
        <StatsCard icon={TrendingUp}    value={shortlistedCount}   label="Shortlisted"        color="orange" delay={55}  />
        <StatsCard icon={CheckCircle}   value={selectedCount}      label="Selected"           color="green"  delay={110} />
        <StatsCard icon={Bell}          value={unread}             label="Unread Alerts"      color="purple" delay={165} />
      </div>

      <div className="grid lg:grid-cols-2 gap-6 mb-6">
        {/* Application status */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-gray-800 flex items-center gap-2">
              <ClipboardList size={17} className="text-blue-500" /> My Application Status
            </h2>
            <button onClick={() => navigate('/student/applications')} className="btn btn-ghost btn-sm text-blue-600">
              View All <ChevronRight size={14} />
            </button>
          </div>
          {myStatuses.length === 0 ? (
            <div className="empty-state py-8">
              <p className="empty-state-title">No applications yet</p>
              <p className="empty-state-desc">Your coordinator will apply on your behalf</p>
            </div>
          ) : (
            <div className="space-y-3">
              {myStatuses.map((s, i) => (
                <div key={i} className="flex items-center gap-3 p-3 rounded-xl border border-gray-100 hover:bg-gray-50 transition-all">
                  <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Briefcase size={18} className="text-blue-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm text-gray-800 truncate">{s.job?.title}</p>
                    <p className="text-xs text-gray-400">{s.company?.name}</p>
                  </div>
                  <StatusBadge type="student" status={s.status} />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Profile snapshot */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-gray-800">My Profile</h2>
            <button onClick={() => navigate('/student/profile')} className="btn btn-ghost btn-sm text-blue-600">
              Edit <ChevronRight size={14} />
            </button>
          </div>
          {myStudentData ? (
            <div className="space-y-3">
              <div className="flex items-center gap-4 pb-4 border-b border-gray-100">
                <img src={currentUser.profileImage} alt={currentUser.name} className="w-14 h-14 rounded-full" />
                <div>
                  <p className="font-bold text-gray-900">{myStudentData.name}</p>
                  <p className="text-sm text-gray-500">{myBatch?.qualification} · {myBatch?.branch}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{myStudentData.rollNumber}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-blue-50 rounded-xl p-3 text-center">
                  <p className="text-2xl font-bold text-blue-700">{myStudentData.cgpa}</p>
                  <p className="text-xs text-blue-500 mt-0.5">CGPA</p>
                </div>
                <div className="bg-green-50 rounded-xl p-3 text-center">
                  <p className="text-2xl font-bold text-green-700">{myStudentData.skills?.length || 0}</p>
                  <p className="text-xs text-green-500 mt-0.5">Skills Listed</p>
                </div>
              </div>
              <div className="flex flex-wrap gap-1.5 pt-1">
                {(myStudentData.skills || []).map(s => <span key={s} className="badge badge-gray">{s}</span>)}
              </div>
            </div>
          ) : (
            <div className="empty-state py-6">
              <p className="empty-state-title">Profile not set up</p>
              <button onClick={() => navigate('/student/profile')} className="btn btn-primary btn-sm mt-3">Set Up Profile</button>
            </div>
          )}
        </div>
      </div>

      {/* Open opportunities */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-gray-800 flex items-center gap-2">
            <Briefcase size={17} className="text-green-500" /> Open Opportunities for Your Batch
          </h2>
          <button onClick={() => navigate('/student/jobs')} className="btn btn-ghost btn-sm text-blue-600">
            Browse All <ChevronRight size={14} />
          </button>
        </div>
        {openJobs.length === 0 ? (
          <div className="empty-state py-8">
            <p className="empty-state-title">No open jobs right now</p>
            <p className="empty-state-desc">Check back soon — your coordinator is actively applying</p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-3 gap-4">
            {openJobs.map(job => {
              const company = MOCK_COMPANIES.find(c => c._id === job.companyId);
              const applied = myApps.some(a => a.jobRequirementId === job._id);
              return (
                <div key={job._id} onClick={() => navigate('/student/jobs')}
                  className="p-4 rounded-xl border border-gray-100 hover:border-blue-200 hover:bg-blue-50/30 cursor-pointer transition-all">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <p className="font-semibold text-sm text-gray-800 leading-tight">{job.title}</p>
                    {applied && <span className="badge badge-green flex-shrink-0">Applied</span>}
                  </div>
                  <p className="text-xs text-gray-500 mb-3">{company?.name}</p>
                  <SlotBadge slots={job.slots} />
                  <div className="flex items-center gap-3 mt-3 text-xs text-gray-400">
                    <span className="flex items-center gap-1"><MapPin size={11} />{job.location}</span>
                    <span className="flex items-center gap-1"><Calendar size={11} />{job.applicationDeadline}</span>
                  </div>
                  <p className="text-sm font-semibold text-gray-700 mt-2">
                    ₹{job.salaryMin.toLocaleString('en-IN')}–{job.salaryMax.toLocaleString('en-IN')}/mo
                  </p>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
