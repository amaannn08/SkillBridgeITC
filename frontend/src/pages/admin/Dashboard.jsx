import { useNavigate } from 'react-router-dom';
import {
  Users, Briefcase, CheckSquare, ClipboardList, TrendingUp,
  Building2, Clock, ChevronRight, AlertCircle,
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
  { icon: '👤', text: 'Mohd. Irfan submitted a coordinator registration', time: '2024-02-03T08:30:00Z' },
  { icon: '👤', text: 'Kavitha Rajan submitted a recruiter registration', time: '2024-02-02T14:15:00Z' },
  { icon: '💼', text: 'ITC Limited posted "Plant Operator Trainee"', time: '2024-01-20T10:00:00Z' },
  { icon: '📨', text: 'Govt. ITI Kanpur applied to "Plant Operator Trainee"', time: '2024-01-25T14:00:00Z' },
  { icon: '✅', text: 'Dr. Ramesh Kumar approved as Coordinator', time: '2024-01-10T09:00:00Z' },
];

export default function AdminDashboard() {
  const navigate = useNavigate();

  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <h1 className="page-title">Government Dashboard — Medak District</h1>
        <p className="page-subtitle">Employment & placement overview · Telangana</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8 stagger-children">
        <StatsCard icon={AlertCircle}   value={summary.pendingApprovals}   label="Pending Approvals"      color="orange" trend="up" trendLabel="2 new today"       delay={0}   />
        <StatsCard icon={Building2}     value={summary.totalInstitutions}  label="Institutions"           color="green"  trend="up" trendLabel="+12 this month"    delay={60}  />
        <StatsCard icon={Users}         value={summary.totalCompanies}     label="Industry Partners"      color="blue"   trend="up" trendLabel="+5 this month"     delay={120} />
        <StatsCard icon={Briefcase}     value={summary.totalJobPostings}   label="Job Postings"           color="navy"   trend="up" trendLabel="+18 this month"    delay={180} />
        <StatsCard icon={ClipboardList} value={summary.totalApplications}  label="Total Applications"     color="purple" trend="up" trendLabel="+43 this week"     delay={240} />
        <StatsCard icon={TrendingUp}    value={summary.totalPlacements}    label="Placements Facilitated" color="green"  trend="up" trendLabel="+120 this month"   delay={300} />
        <StatsCard icon={Users}         value={summary.totalCoordinators}  label="Coordinators"           color="blue"                                              delay={360} />
        <StatsCard icon={Users}         value={summary.totalRecruiters}    label="Recruiters"             color="navy"                                              delay={420} />
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Pending Approvals Quick Panel */}
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
            <div className="py-8 text-center text-sm text-gray-400">No pending approvals</div>
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
                  <button onClick={() => navigate('/admin/approvals')} className="btn btn-sm btn-primary flex-shrink-0">
                    Review
                  </button>
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

      {/* Recent Jobs Table */}
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
                <th>Job Title</th>
                <th>Company</th>
                <th>Location</th>
                <th>Status</th>
                <th>Posted</th>
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
                    <td className="text-gray-400 text-xs">
                      {formatDistanceToNow(new Date(job.createdAt), { addSuffix: true })}
                    </td>
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
