import { BarChart3, TrendingUp, Users, Building2, Briefcase, Award, Target, Flame } from 'lucide-react';
import StatsCard from '../../components/shared/StatsCard';
import { MOCK_ANALYTICS } from '../../data/mockData';

const { summary, placementRatio, jobsByDistrict, jobsBySector, byQualification, funnelData, sectorHeatmap, topCompanies, topInstitutions } = MOCK_ANALYTICS;

function BarRow({ label, value, max, color = '#2563EB', suffix = '' }) {
  const pct = Math.round((value / max) * 100);
  return (
    <div className="flex items-center gap-3">
      <span className="text-sm text-gray-600 w-32 truncate flex-shrink-0">{label}</span>
      <div className="flex-1 progress-bar">
        <div className="progress-fill" style={{ width: `${pct}%`, background: color }} />
      </div>
      <span className="text-sm font-semibold text-gray-700 w-12 text-right">{value}{suffix}</span>
    </div>
  );
}

function FunnelRow({ stage, value, max, index }) {
  const pct = Math.round((value / max) * 100);
  const colors = ['#2563EB','#3B82F6','#F59E0B','#10B981','#16A34A'];
  return (
    <div className="flex items-center gap-3">
      <span className="text-sm text-gray-600 w-44 flex-shrink-0">{stage}</span>
      <div className="flex-1 progress-bar">
        <div className="progress-fill" style={{ width: `${pct}%`, background: colors[index] || '#2563EB' }} />
      </div>
      <span className="text-sm font-bold text-gray-800 w-12 text-right">{value.toLocaleString('en-IN')}</span>
    </div>
  );
}

function HeatCell({ sector, intensity }) {
  const alpha = intensity / 100;
  return (
    <div className="flex items-center gap-3 p-3 rounded-xl" style={{ background: `rgba(234,88,12,${alpha * 0.15})`, border: `1px solid rgba(234,88,12,${alpha * 0.3})` }}>
      <div style={{ width: 32, height: 32, borderRadius: 8, background: `rgba(234,88,12,${alpha * 0.8})`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Flame size={16} style={{ color: '#fff' }} />
      </div>
      <div className="flex-1">
        <p className="text-sm font-semibold text-gray-800">{sector}</p>
        <div className="progress-bar mt-1" style={{ height: 4 }}>
          <div className="progress-fill" style={{ width: `${intensity}%`, background: `rgba(234,88,12,${0.4 + alpha * 0.6})` }} />
        </div>
      </div>
      <span className="text-sm font-bold" style={{ color: `rgba(194,65,12,${0.5 + alpha * 0.5})` }}>{intensity}%</span>
    </div>
  );
}

export default function AdminAnalytics() {
  const maxDistrict = Math.max(...jobsByDistrict.map(s => s.count));
  const maxSector = Math.max(...jobsBySector.map(s => s.count));
  const maxFunnel = funnelData[0].value;
  const maxQualApplicants = Math.max(...byQualification.map(q => q.applicants));

  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <h1 className="page-title">Government Analytics Dashboard</h1>
        <p className="page-subtitle">Medak District — Employment & Placement Statistics</p>
      </div>

      {/* Summary stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8 stagger-children">
        <StatsCard icon={Building2}  value={summary.totalInstitutions}  label="Institutions"           color="green"  delay={0}   />
        <StatsCard icon={Users}      value={summary.totalCompanies}     label="Industry Partners"      color="blue"   delay={55}  />
        <StatsCard icon={Briefcase}  value={summary.totalJobPostings}   label="Job Postings"           color="navy"   delay={110} />
        <StatsCard icon={Award}      value={summary.totalPlacements}    label="Students Placed"        color="orange" delay={165} />
      </div>

      {/* Placement Ratio — hero card */}
      <div className="card mb-6" style={{ background: 'linear-gradient(135deg, #0c1e38 0%, #1a3f7a 100%)', border: 'none' }}>
        <div className="flex flex-col sm:flex-row items-center gap-6">
          <div className="flex-1">
            <p className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: '#60a5fa' }}>Placement Ratio</p>
            <div className="flex items-end gap-3 mb-3">
              <span style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 52, fontWeight: 800, color: '#fff', lineHeight: 1 }}>{placementRatio.ratio}%</span>
              <span style={{ color: '#93c5fd', fontSize: 15, marginBottom: 8 }}>conversion rate</span>
            </div>
            <div className="progress-bar" style={{ height: 8, background: 'rgba(255,255,255,0.15)' }}>
              <div className="progress-fill" style={{ width: `${placementRatio.ratio}%`, background: 'linear-gradient(90deg, #60a5fa, #34d399)' }} />
            </div>
          </div>
          <div className="flex gap-6 flex-shrink-0">
            <div className="text-center">
              <p style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 32, fontWeight: 800, color: '#fff', lineHeight: 1 }}>{placementRatio.applicants}</p>
              <p style={{ color: '#93c5fd', fontSize: 12, marginTop: 4 }}>Total Applicants</p>
            </div>
            <div style={{ width: 1, background: 'rgba(255,255,255,0.1)' }} />
            <div className="text-center">
              <p style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 32, fontWeight: 800, color: '#34d399', lineHeight: 1 }}>{placementRatio.hired}</p>
              <p style={{ color: '#93c5fd', fontSize: 12, marginTop: 4 }}>Total Hired</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6 mb-6">
        {/* Demographic breakdown by qualification */}
        <div className="card">
          <h2 className="font-bold text-gray-800 mb-5 flex items-center gap-2"><Users size={17} className="text-blue-500" /> Demographic Breakdown</h2>
          <div className="space-y-4">
            {byQualification.map(q => {
              const ratio = Math.round((q.hired / q.applicants) * 100);
              return (
                <div key={q.qualification}>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-sm font-semibold text-gray-700">{q.qualification}</span>
                    <div className="flex items-center gap-3">
                      <span className="text-xs text-gray-400">{q.applicants} applied</span>
                      <span className="badge badge-green">{q.hired} hired</span>
                      <span className="text-xs font-bold text-blue-600">{ratio}%</span>
                    </div>
                  </div>
                  <div className="progress-bar">
                    <div className="progress-fill bg-blue-500" style={{ width: `${(q.applicants / maxQualApplicants) * 100}%` }} />
                  </div>
                  <div className="progress-bar mt-1" style={{ height: 4 }}>
                    <div className="progress-fill bg-green-500" style={{ width: `${(q.hired / maxQualApplicants) * 100}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
          <div className="flex gap-4 mt-4 pt-4 border-t border-gray-100">
            <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-sm bg-blue-500" /><span className="text-xs text-gray-500">Applicants</span></div>
            <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-sm bg-green-500" /><span className="text-xs text-gray-500">Hired</span></div>
          </div>
        </div>

        {/* Sector heatmap */}
        <div className="card">
          <h2 className="font-bold text-gray-800 mb-5 flex items-center gap-2"><Flame size={17} className="text-orange-500" /> Sector Hiring Heatmap</h2>
          <div className="space-y-3">
            {sectorHeatmap.map(s => <HeatCell key={s.sector} sector={s.sector} intensity={s.intensity} />)}
          </div>
        </div>
      </div>

      {/* Placement funnel */}
      <div className="card mb-6">
        <h2 className="font-bold text-gray-800 mb-5 flex items-center gap-2"><TrendingUp size={17} className="text-green-500" /> Application Funnel</h2>
        <div className="space-y-4">
          {funnelData.map((f, i) => <FunnelRow key={f.stage} stage={f.stage} value={f.value} max={maxFunnel} index={i} />)}
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6 mb-6">
        {/* Jobs by district */}
        <div className="card">
          <h2 className="font-bold text-gray-800 mb-5 flex items-center gap-2"><BarChart3 size={17} className="text-blue-500" /> Jobs by District</h2>
          <div className="space-y-3">
            {jobsByDistrict.map(s => <BarRow key={s.district} label={s.district} value={s.count} max={maxDistrict} color="#2563EB" />)}
          </div>
        </div>

        {/* Jobs by sector */}
        <div className="card">
          <h2 className="font-bold text-gray-800 mb-5 flex items-center gap-2"><BarChart3 size={17} className="text-indigo-500" /> Jobs by Sector</h2>
          <div className="space-y-3">
            {jobsBySector.map(s => <BarRow key={s.sector} label={s.sector} value={s.count} max={maxSector} color="#6366F1" />)}
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Top companies */}
        <div className="card">
          <h2 className="font-bold text-gray-800 mb-4">Top Companies</h2>
          <div className="space-y-3">
            {topCompanies.map((c, i) => (
              <div key={c.name} className="flex items-center gap-3">
                <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 text-xs font-bold flex items-center justify-center flex-shrink-0">{i+1}</span>
                <span className="flex-1 text-sm text-gray-700">{c.name}</span>
                <span className="badge badge-blue">{c.jobs} jobs</span>
                <span className="badge badge-green">{c.hired} hired</span>
              </div>
            ))}
          </div>
        </div>

        {/* Top institutions */}
        <div className="card">
          <h2 className="font-bold text-gray-800 mb-4">Top Institutions</h2>
          <div className="space-y-3">
            {topInstitutions.map((inst, i) => (
              <div key={inst.name} className="flex items-center gap-3">
                <span className="w-6 h-6 rounded-full bg-green-100 text-green-700 text-xs font-bold flex items-center justify-center flex-shrink-0">{i+1}</span>
                <span className="flex-1 text-sm text-gray-700">{inst.name}</span>
                <span className="badge badge-blue">{inst.applications} apps</span>
                <span className="badge badge-green">{inst.placed} placed</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
