import { useNavigate } from 'react-router-dom';
import { Briefcase, Users, FileText, ChevronRight, CheckCircle, MapPin, Calendar } from 'lucide-react';
import StatsCard from '../../components/shared/StatsCard';
import { StatusBadge, SlotBadge } from '../../components/shared/Badges';
import { useApp } from '../../context/AppContext';
import { MOCK_BATCHES, MOCK_APPLICATIONS, MOCK_JOBS, MOCK_COMPANIES } from '../../data/mockData';

export default function CoordDashboard() {
  const navigate = useNavigate();
  const { currentUser } = useApp();

  const myBatches = MOCK_BATCHES.filter(b => b.coordinatorId === currentUser._id);
  const myApps = MOCK_APPLICATIONS.filter(a => a.coordinatorId === currentUser._id);
  const totalStudents = myBatches.reduce((s, b) => s + b.totalStudents, 0);
  const selectedCount = myApps.flatMap(a => a.studentStatuses).filter(s => s.status === 'selected').length;
  const shortlistedCount = myApps.flatMap(a => a.studentStatuses).filter(s => s.status === 'shortlisted').length;

  // Matching jobs: pan_india OR same state, open only, not already applied
  const appliedJobIds = new Set(myApps.map(a => a.jobRequirementId));
  const matchingJobs = MOCK_JOBS
    .filter(j => j.status === 'open' && (j.geographyScope === 'pan_india' || j.state === currentUser.state))
    .slice(0, 5);

  return (
    <div className="animate-fade-in">
      <div style={{ marginBottom: 28 }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
          <div>
            <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#F97316', background: '#FFF7ED', border: '1px solid #FED7AA', borderRadius: 99, padding: '3px 10px' }}>
              MESIC · Faculty Coordinator
            </span>
            <h1 className="page-title" style={{ marginTop: 8 }}>Welcome back, {currentUser.name.split(' ')[0]} 👋</h1>
            <p className="page-subtitle">Here's what's happening with your talent pool · Medak District</p>
          </div>
          <button onClick={() => navigate('/coordinator/batches')} className="btn btn-primary">
            + Create Batch
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8 stagger-children">
        <StatsCard icon={Users}       value={myBatches.filter(b => b.status === 'active').length} label="Active Batches"     color="blue"   delay={0}   />
        <StatsCard icon={Users}       value={totalStudents}     label="Total Students"     color="green"  delay={55}  />
        <StatsCard icon={FileText}    value={myApps.length}     label="Applications Sent"  color="orange" delay={110} />
        <StatsCard icon={CheckCircle} value={selectedCount}     label="Students Selected"  color="navy"   delay={165} />
      </div>

      <div className="grid lg:grid-cols-2 gap-6 mb-6">
        {/* My batches */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-gray-800 flex items-center gap-2"><Users size={17} className="text-blue-500" /> My Batches</h2>
            <button onClick={() => navigate('/coordinator/batches')} className="btn btn-ghost btn-sm text-blue-600">View All <ChevronRight size={14} /></button>
          </div>
          {myBatches.length === 0 ? (
            <div className="empty-state"><p className="empty-state-title">No batches yet</p></div>
          ) : (
            <div className="space-y-3">
              {myBatches.slice(0, 4).map(b => (
                <div key={b._id} onClick={() => navigate(`/coordinator/batches/${b._id}`)}
                  className="flex items-center gap-3 p-3 rounded-xl border border-gray-100 hover:border-blue-200 hover:bg-blue-50/40 cursor-pointer transition-all">
                  <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Users size={18} className="text-blue-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm text-gray-800 truncate">{b.name}</p>
                    <p className="text-xs text-gray-400">{b.totalStudents} students · {b.qualification} · {b.branch}</p>
                  </div>
                  <StatusBadge type="batch" status={b.status} />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent applications */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-gray-800 flex items-center gap-2"><FileText size={17} className="text-orange-500" /> Recent Applications</h2>
            <button onClick={() => navigate('/coordinator/applications')} className="btn btn-ghost btn-sm text-blue-600">View All <ChevronRight size={14} /></button>
          </div>
          {myApps.length === 0 ? (
            <div className="empty-state"><p className="empty-state-title">No applications yet</p></div>
          ) : (
            <div className="space-y-3">
              {myApps.map(app => {
                const job = MOCK_JOBS.find(j => j._id === app.jobRequirementId);
                const company = MOCK_COMPANIES.find(c => c._id === app.companyId);
                return (
                  <div key={app._id} className="flex items-center gap-3 p-3 rounded-xl border border-gray-100 hover:bg-gray-50 transition-all">
                    <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Briefcase size={18} className="text-orange-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sm text-gray-800 truncate">{job?.title}</p>
                      <p className="text-xs text-gray-400">{company?.name} · {app.studentStatuses.length} students</p>
                    </div>
                    <StatusBadge type="application" status={app.status} />
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Matching Jobs Widget */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-gray-800 flex items-center gap-2">
            <Briefcase size={17} className="text-green-500" /> Matching Job Requirements
            <span className="badge badge-green">{matchingJobs.length} new</span>
          </h2>
          <button onClick={() => navigate('/coordinator/jobs')} className="btn btn-ghost btn-sm text-blue-600">Browse All <ChevronRight size={14} /></button>
        </div>
        {matchingJobs.length === 0 ? (
          <div className="empty-state py-8"><p className="empty-state-title">No matching jobs right now</p></div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {matchingJobs.map(job => {
              const company = MOCK_COMPANIES.find(c => c._id === job.companyId);
              const alreadyApplied = appliedJobIds.has(job._id);
              return (
                <div key={job._id} onClick={() => navigate(`/coordinator/jobs/${job._id}`)}
                  className="p-4 rounded-xl border border-gray-100 hover:border-green-200 hover:bg-green-50/30 cursor-pointer transition-all">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <p className="font-semibold text-sm text-gray-800 leading-tight">{job.title}</p>
                    {alreadyApplied && <span className="badge badge-green flex-shrink-0">Applied</span>}
                  </div>
                  <p className="text-xs text-gray-500 mb-2">{company?.name}</p>
                  <SlotBadge slots={job.slots} />
                  <div className="flex items-center gap-3 mt-3 text-xs text-gray-400">
                    <span className="flex items-center gap-1"><MapPin size={11} />{job.state}</span>
                    <span className="flex items-center gap-1"><Calendar size={11} />{job.applicationDeadline}</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
