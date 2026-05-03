import { BarChart3, TrendingUp, Users, Building2, Briefcase, Award } from 'lucide-react';
import StatsCard from '../../components/shared/StatsCard';
import { MOCK_ANALYTICS } from '../../data/mockData';

const { summary, jobsByState, jobsBySector, funnelData, registrationsPerMonth, topCompanies, topInstitutions } = MOCK_ANALYTICS;

function BarRow({ label, value, max, color = 'bg-blue-500' }) {
  const pct = Math.round((value / max) * 100);
  return (
    <div className="flex items-center gap-3">
      <span className="text-sm text-gray-600 w-36 truncate flex-shrink-0">{label}</span>
      <div className="flex-1 progress-bar">
        <div className={`progress-fill ${color}`} style={{ width: `${pct}%` }} />
      </div>
      <span className="text-sm font-semibold text-gray-700 w-8 text-right">{value}</span>
    </div>
  );
}

function FunnelRow({ stage, value, max }) {
  const pct = Math.round((value / max) * 100);
  return (
    <div className="flex items-center gap-3">
      <span className="text-sm text-gray-600 w-44 flex-shrink-0">{stage}</span>
      <div className="flex-1 progress-bar">
        <div className="progress-fill bg-gradient-to-r from-blue-500 to-indigo-600" style={{ width: `${pct}%` }} />
      </div>
      <span className="text-sm font-bold text-gray-800 w-16 text-right">{value.toLocaleString('en-IN')}</span>
    </div>
  );
}

export default function AdminAnalytics() {
  const maxState = Math.max(...jobsByState.map(s => s.count));
  const maxSector = Math.max(...jobsBySector.map(s => s.count));
  const maxFunnel = funnelData[0].value;

  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <h1 className="page-title">Platform Analytics</h1>
        <p className="page-subtitle">Aggregated insights across all users and activity</p>
      </div>

      {/* Summary stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8 stagger-children">
        <StatsCard icon={Building2}  value={summary.totalInstitutions}  label="Institutions"           color="green"  delay={0}   />
        <StatsCard icon={Users}      value={summary.totalCompanies}     label="Industry Partners"      color="blue"   delay={55}  />
        <StatsCard icon={Briefcase}  value={summary.totalJobPostings}   label="Job Postings"           color="navy"   delay={110} />
        <StatsCard icon={Award}      value={summary.totalPlacements}    label="Placements Facilitated" color="orange" delay={165} />
        <StatsCard icon={Users}      value={summary.totalCoordinators}  label="Coordinators"           color="purple" delay={220} />
        <StatsCard icon={Users}      value={summary.totalRecruiters}    label="Recruiters"             color="blue"   delay={275} />
        <StatsCard icon={TrendingUp} value={summary.totalApplications}  label="Total Applications"     color="green"  delay={330} />
        <StatsCard icon={BarChart3}  value={summary.pendingApprovals}   label="Pending Approvals"      color="orange" delay={385} />
      </div>

      <div className="grid lg:grid-cols-2 gap-6 mb-6">
        {/* Jobs by state */}
        <div className="card">
          <h2 className="font-bold text-gray-800 mb-5 flex items-center gap-2"><BarChart3 size={17} className="text-blue-500" /> Jobs by State</h2>
          <div className="space-y-3">
            {jobsByState.map(s => <BarRow key={s.state} label={s.state} value={s.count} max={maxState} color="bg-blue-500" />)}
          </div>
        </div>

        {/* Jobs by sector */}
        <div className="card">
          <h2 className="font-bold text-gray-800 mb-5 flex items-center gap-2"><BarChart3 size={17} className="text-indigo-500" /> Jobs by Sector</h2>
          <div className="space-y-3">
            {jobsBySector.map(s => <BarRow key={s.sector} label={s.sector} value={s.count} max={maxSector} color="bg-indigo-500" />)}
          </div>
        </div>
      </div>

      {/* Placement funnel */}
      <div className="card mb-6">
        <h2 className="font-bold text-gray-800 mb-5 flex items-center gap-2"><TrendingUp size={17} className="text-green-500" /> Placement Funnel</h2>
        <div className="space-y-4">
          {funnelData.map(f => <FunnelRow key={f.stage} stage={f.stage} value={f.value} max={maxFunnel} />)}
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Top companies */}
        <div className="card">
          <h2 className="font-bold text-gray-800 mb-4">Top Companies by Job Postings</h2>
          <div className="space-y-3">
            {topCompanies.map((c, i) => (
              <div key={c.name} className="flex items-center gap-3">
                <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 text-xs font-bold flex items-center justify-center flex-shrink-0">{i+1}</span>
                <span className="flex-1 text-sm text-gray-700">{c.name}</span>
                <span className="badge badge-blue">{c.jobs} jobs</span>
              </div>
            ))}
          </div>
        </div>

        {/* Top institutions */}
        <div className="card">
          <h2 className="font-bold text-gray-800 mb-4">Top Institutions by Applications</h2>
          <div className="space-y-3">
            {topInstitutions.map((inst, i) => (
              <div key={inst.name} className="flex items-center gap-3">
                <span className="w-6 h-6 rounded-full bg-green-100 text-green-700 text-xs font-bold flex items-center justify-center flex-shrink-0">{i+1}</span>
                <span className="flex-1 text-sm text-gray-700">{inst.name}</span>
                <span className="badge badge-green">{inst.applications} apps</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
