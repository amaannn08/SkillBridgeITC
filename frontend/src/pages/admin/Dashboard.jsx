import { useNavigate } from 'react-router-dom';
import {
  Users, Briefcase, CheckSquare, ClipboardList, TrendingUp,
  Building2, Clock, ChevronRight, AlertCircle, Activity,
  MapPin, ShieldCheck, ArrowUpRight,
} from 'lucide-react';
import StatsCard from '../../components/shared/StatsCard';
import { StatusBadge } from '../../components/shared/Badges';
import {
  MOCK_ANALYTICS, MOCK_USERS, MOCK_JOBS, MOCK_COMPANIES,
} from '../../data/mockData';
import { formatDistanceToNow } from 'date-fns';

const { summary } = MOCK_ANALYTICS;
const pendingUsers = MOCK_USERS.filter(u => u.approvalStatus === 'pending');

const RECENT_ACTIVITY = [
  { icon: '👤', text: 'Mohd. Irfan submitted a coordinator registration', time: '2024-02-03T08:30:00Z', type: 'registration' },
  { icon: '👤', text: 'Kavitha Rajan submitted a recruiter registration',  time: '2024-02-02T14:15:00Z', type: 'registration' },
  { icon: '💼', text: 'ITC Limited posted "Plant Operator Trainee"',       time: '2024-01-20T10:00:00Z', type: 'job' },
  { icon: '📨', text: 'Govt. ITI Kanpur applied to "Plant Operator Trainee"', time: '2024-01-25T14:00:00Z', type: 'application' },
  { icon: '✅', text: 'Dr. Ramesh Kumar approved as Coordinator',          time: '2024-01-10T09:00:00Z', type: 'approval' },
];

// Mock today's footfall
const FOOTFALL_TODAY = 247;
const FOOTFALL_WEEK  = 1438;

function QuickAction({ icon: Icon, label, desc, color, to, navigate }) {
  const colors = {
    orange: { bg: '#FFF7ED', border: '#FED7AA', icon: '#EA580C', text: '#9A3412' },
    blue:   { bg: '#EFF6FF', border: '#BFDBFE', icon: '#2563EB', text: '#1D4ED8' },
    green:  { bg: '#F0FDF4', border: '#BBF7D0', icon: '#16A34A', text: '#166534' },
    navy:   { bg: '#EFF6FF', border: '#BFDBFE', icon: '#1E3A5F', text: '#1E3A5F' },
  };
  const c = colors[color] || colors.blue;
  return (
    <button onClick={() => navigate(to)} style={{ textAlign: 'left', background: c.bg, border: `1px solid ${c.border}`, borderRadius: 14, padding: '14px 16px', cursor: 'pointer', transition: 'all 0.15s', display: 'flex', alignItems: 'center', gap: 12 }}
      onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.08)'; }}
      onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = ''; }}>
      <div style={{ width: 40, height: 40, borderRadius: 10, background: c.icon, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
        <Icon size={18} color="#fff" />
      </div>
      <div>
        <p style={{ fontSize: 13, fontWeight: 700, color: c.text }}>{label}</p>
        <p style={{ fontSize: 11, color: 'rgba(0,0,0,0.45)', marginTop: 1 }}>{desc}</p>
      </div>
      <ArrowUpRight size={15} style={{ marginLeft: 'auto', color: c.icon, opacity: 0.7 }} />
    </button>
  );
}

export default function AdminDashboard() {
  const navigate = useNavigate();

  return (
    <div className="animate-fade-in">
      {/* Page header */}
      <div style={{ marginBottom: 28 }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
              <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#F97316', background: '#FFF7ED', border: '1px solid #FED7AA', borderRadius: 99, padding: '3px 10px' }}>
                District Collector Portal
              </span>
            </div>
            <h1 className="page-title">Medak District — MESIC Dashboard</h1>
            <p className="page-subtitle">Employment, Skill &amp; Industry Connect · Telangana</p>
          </div>

          {/* Footfall live badge */}
          <div style={{ background: 'linear-gradient(135deg, #0F2444 0%, #1E3A5F 100%)', borderRadius: 16, padding: '14px 20px', minWidth: 160, boxShadow: '0 4px 20px rgba(15,36,68,0.15)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
              <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#22c55e', boxShadow: '0 0 6px #22c55e', display: 'inline-block' }} />
              <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'rgba(251,146,60,0.8)' }}>Today's Footfall</span>
            </div>
            <p style={{ fontSize: 28, fontWeight: 900, color: '#fff', lineHeight: 1 }}>{FOOTFALL_TODAY}</p>
            <p style={{ fontSize: 11, color: 'rgba(148,163,184,1)', marginTop: 3 }}>students · {FOOTFALL_WEEK.toLocaleString()} this week</p>
            <button onClick={() => navigate('/admin/footfall')} style={{ fontSize: 11, fontWeight: 600, color: '#F97316', background: 'none', border: 'none', cursor: 'pointer', padding: 0, marginTop: 6, display: 'flex', alignItems: 'center', gap: 4 }}>
              View Footfall <ChevronRight size={12} />
            </button>
          </div>
        </div>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6 stagger-children">
        <StatsCard icon={AlertCircle}   value={summary.pendingApprovals}   label="Pending Approvals"      color="orange" trend="up" trendLabel="2 new today"     delay={0}   />
        <StatsCard icon={Building2}     value={summary.totalInstitutions}  label="Institutions"           color="green"  trend="up" trendLabel="+12 this month"  delay={60}  />
        <StatsCard icon={Users}         value={summary.totalCompanies}     label="Industry Partners"      color="blue"   trend="up" trendLabel="+5 this month"   delay={120} />
        <StatsCard icon={Briefcase}     value={summary.totalJobPostings}   label="Job Postings"           color="navy"   trend="up" trendLabel="+18 this month"  delay={180} />
        <StatsCard icon={ClipboardList} value={summary.totalApplications}  label="Total Applications"     color="purple" trend="up" trendLabel="+43 this week"   delay={240} />
        <StatsCard icon={TrendingUp}    value={summary.totalPlacements}    label="Placements Facilitated" color="green"  trend="up" trendLabel="+120 this month" delay={300} />
        <StatsCard icon={Users}         value={summary.totalCoordinators}  label="Coordinators"           color="blue"                                            delay={360} />
        <StatsCard icon={Users}         value={summary.totalRecruiters}    label="Recruiters"             color="navy"                                            delay={420} />
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        <QuickAction icon={CheckSquare} label="Approvals"    desc={`${pendingUsers.length} pending`}  color="orange" to="/admin/approvals"  navigate={navigate} />
        <QuickAction icon={MapPin}      label="HOD Map"      desc="District institutions"              color="blue"   to="/admin/map"        navigate={navigate} />
        <QuickAction icon={Activity}    label="Footfall"     desc="Student visit tracker"              color="green"  to="/admin/footfall"   navigate={navigate} />
        <QuickAction icon={ShieldCheck} label="Audit Trail"  desc="Activity log"                      color="navy"   to="/admin/audit"      navigate={navigate} />
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Pending Approvals */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-gray-800 flex items-center gap-2">
              <CheckSquare size={17} className="text-orange-500" /> Pending Approvals
              {pendingUsers.length > 0 && <span className="badge badge-orange">{pendingUsers.length}</span>}
            </h2>
            <button onClick={() => navigate('/admin/approvals')} className="btn btn-ghost btn-sm text-blue-600">
              View All <ChevronRight size={14} />
            </button>
          </div>
          {pendingUsers.length === 0 ? (
            <div className="py-8 text-center text-sm text-gray-400">No pending approvals 🎉</div>
          ) : (
            <div className="space-y-3">
              {pendingUsers.map(u => (
                <div key={u._id} className="flex items-center gap-3 p-3 bg-orange-50 rounded-xl border border-orange-100">
                  <img src={u.profileImage} alt={u.name} className="w-9 h-9 rounded-full flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm text-gray-800 truncate">{u.name}</p>
                    <p className="text-xs text-gray-500 truncate mb-1">{u.email}</p>
                    <StatusBadge type="role" status={u.role} />
                  </div>
                  <button onClick={() => navigate('/admin/approvals')} className="btn btn-sm btn-primary flex-shrink-0">Review</button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Activity */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-gray-800 flex items-center gap-2">
              <Clock size={17} className="text-blue-500" /> Recent Activity
            </h2>
          </div>
          <div className="space-y-1">
            {RECENT_ACTIVITY.map((a, i) => (
              <div key={i} className="flex items-start gap-3 py-2.5 border-b border-gray-50 last:border-0">
                <span className="text-lg flex-shrink-0">{a.icon}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-700">{a.text}</p>
                  <p className="text-xs text-gray-400 mt-0.5">
                    {formatDistanceToNow(new Date(a.time), { addSuffix: true })}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Jobs */}
      <div className="card mt-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-gray-800 flex items-center gap-2">
            <Briefcase size={17} className="text-blue-500" /> Recent Job Requirements
          </h2>
          <button onClick={() => navigate('/admin/jobs')} className="btn btn-ghost btn-sm text-blue-600">
            View All <ChevronRight size={14} />
          </button>
        </div>
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Job Title</th><th>Company</th><th>Location</th><th>Status</th><th>Posted</th>
              </tr>
            </thead>
            <tbody>
              {MOCK_JOBS.slice(0, 4).map(job => {
                const company = MOCK_COMPANIES.find(c => c._id === job.companyId);
                return (
                  <tr key={job._id}>
                    <td className="font-medium text-gray-800">{job.title}</td>
                    <td className="text-gray-600">{company?.name}</td>
                    <td className="text-gray-500">{job.location}, {job.state}</td>
                    <td><StatusBadge type="job" status={job.status} /></td>
                    <td className="text-gray-400 text-xs">{formatDistanceToNow(new Date(job.createdAt), { addSuffix: true })}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
