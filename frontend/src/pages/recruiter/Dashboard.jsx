import { useNavigate } from 'react-router-dom';
import { Briefcase, Users, ClipboardList, ChevronRight, Plus, TrendingUp } from 'lucide-react';
import StatsCard from '../../components/shared/StatsCard';
import { StatusBadge } from '../../components/shared/Badges';
import { useApp } from '../../context/AppContext';
import { MOCK_JOBS, MOCK_APPLICATIONS, MOCK_COMPANIES } from '../../data/mockData';

export default function RecruiterDashboard() {
  const navigate = useNavigate();
  const { currentUser } = useApp();

  const myJobs = MOCK_JOBS.filter(j => j.postedBy === currentUser._id);
  const myApps = MOCK_APPLICATIONS.filter(a => a.companyId === currentUser.companyId);
  const totalApplicants = myApps.flatMap(a => a.studentStatuses).length;
  const selectedCount = myApps.flatMap(a => a.studentStatuses).filter(s => s.status === 'selected').length;
  const company = MOCK_COMPANIES.find(c => c._id === currentUser.companyId);

  return (
    <div className="animate-fade-in">
      <div className="page-header flex items-start justify-between">
        <div>
          <h1 className="page-title">Welcome back, {currentUser.name.split(' ')[0]} 👋</h1>
          <p className="page-subtitle">{company?.name} · Recruiter Dashboard</p>
        </div>
        <button onClick={() => navigate('/recruiter/jobs/new')} className="btn btn-primary">
          <Plus size={16} /> Post New Job
        </button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8 stagger-children">
        <StatsCard icon={Briefcase}    value={myJobs.filter(j => j.status === 'open').length}  label="Active Jobs"        color="blue"   delay={0}   />
        <StatsCard icon={ClipboardList}value={myApps.length}                                   label="Applications"       color="orange" delay={55}  />
        <StatsCard icon={Users}        value={totalApplicants}                                 label="Total Applicants"   color="purple" delay={110} />
        <StatsCard icon={TrendingUp}   value={selectedCount}                                   label="Students Selected"  color="green"  delay={165} />
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-gray-800 flex items-center gap-2"><Briefcase size={17} className="text-blue-500" /> My Job Postings</h2>
            <button onClick={() => navigate('/recruiter/jobs')} className="btn btn-ghost btn-sm text-blue-600">View All <ChevronRight size={14} /></button>
          </div>
          {myJobs.length === 0 ? (
            <div className="empty-state"><p className="empty-state-title">No jobs posted yet</p></div>
          ) : (
            <div className="space-y-3">
              {myJobs.map(job => {
                const appCount = MOCK_APPLICATIONS.filter(a => a.jobRequirementId === job._id).length;
                return (
                  <div key={job._id} onClick={() => navigate(`/recruiter/jobs/${job._id}/applications`)}
                    className="flex items-center gap-3 p-3 rounded-xl border border-gray-100 hover:border-blue-200 hover:bg-blue-50/40 cursor-pointer transition-all">
                    <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Briefcase size={18} className="text-blue-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sm text-gray-800 truncate">{job.title}</p>
                      <p className="text-xs text-gray-400">{job.location} · {appCount} application{appCount !== 1 ? 's' : ''}</p>
                    </div>
                    <StatusBadge type="job" status={job.status} />
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-gray-800 flex items-center gap-2"><ClipboardList size={17} className="text-orange-500" /> Recent Applications</h2>
            <button onClick={() => navigate('/recruiter/applications')} className="btn btn-ghost btn-sm text-blue-600">View All <ChevronRight size={14} /></button>
          </div>
          {myApps.length === 0 ? (
            <div className="empty-state"><p className="empty-state-title">No applications yet</p></div>
          ) : (
            <div className="space-y-3">
              {myApps.map(app => {
                const job = MOCK_JOBS.find(j => j._id === app.jobRequirementId);
                return (
                  <div key={app._id} className="flex items-center gap-3 p-3 rounded-xl border border-gray-100 hover:bg-gray-50 transition-all">
                    <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center flex-shrink-0">
                      <ClipboardList size={18} className="text-orange-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sm text-gray-800 truncate">{job?.title}</p>
                      <p className="text-xs text-gray-400">{app.studentStatuses.length} students · {app.submittedAt}</p>
                    </div>
                    <StatusBadge type="application" status={app.status} />
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
