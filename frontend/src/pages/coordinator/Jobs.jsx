import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, MapPin, Calendar, Users, ChevronRight, IndianRupee } from 'lucide-react';
import { StatusBadge, SlotBadge } from '../../components/shared/Badges';
import { useApp } from '../../context/AppContext';
import { MOCK_JOBS, MOCK_COMPANIES } from '../../data/mockData';

export default function CoordJobs() {
  const navigate = useNavigate();
  const { currentUser } = useApp();
  const [search, setSearch] = useState('');
  const [sectorFilter, setSectorFilter] = useState('all');

  const sectors = [...new Set(MOCK_JOBS.map(j => j.sector))];

  const filtered = MOCK_JOBS.filter(j => {
    if (j.status === 'draft') return false;
    const matchSector = sectorFilter === 'all' || j.sector === sectorFilter;
    const matchSearch = j.title.toLowerCase().includes(search.toLowerCase()) ||
      j.location.toLowerCase().includes(search.toLowerCase());
    // Show pan_india or matching state
    const matchGeo = j.geographyScope === 'pan_india' || j.state === currentUser.state;
    return matchSector && matchSearch && matchGeo;
  });

  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <h1 className="page-title">Browse Job Requirements</h1>
        <p className="page-subtitle">Find opportunities matching your talent pool</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="search-wrap flex-1">
          <Search size={15} className="search-icon" />
          <input className="form-input" placeholder="Search jobs or locations…" value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <select className="form-input form-select w-full sm:w-44" value={sectorFilter} onChange={e => setSectorFilter(e.target.value)}>
          <option value="all">All Sectors</option>
          {sectors.map(s => <option key={s}>{s}</option>)}
        </select>
      </div>

      <div className="space-y-4">
        {filtered.map(job => {
          const company = MOCK_COMPANIES.find(c => c._id === job.companyId);
          return (
            <div key={job._id} onClick={() => navigate(`/coordinator/jobs/${job._id}`)}
              className="card card-interactive">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-1">
                    <h3 className="font-bold text-gray-900">{job.title}</h3>
                    <StatusBadge type="job" status={job.status} />
                    {job.geographyScope === 'pan_india' && <span className="badge badge-purple">Pan India</span>}
                  </div>
                  <p className="text-sm text-gray-500 mb-3">{company?.name} · {job.sector}</p>
                  <SlotBadge slots={job.slots} />
                  <div className="flex flex-wrap gap-4 mt-3 text-xs text-gray-500">
                    <span className="flex items-center gap-1"><MapPin size={12} />{job.location}, {job.state}</span>
                    <span className="flex items-center gap-1"><Calendar size={12} />Deadline: {job.applicationDeadline}</span>
                  </div>
                </div>
                <div className="flex items-center gap-3 flex-shrink-0">
                  <div className="text-right">
                    <p className="text-base font-bold text-gray-900">₹{job.salaryMin.toLocaleString('en-IN')}–{job.salaryMax.toLocaleString('en-IN')}</p>
                    <p className="text-xs text-gray-400">per month</p>
                  </div>
                  <ChevronRight size={18} className="text-gray-400" />
                </div>
              </div>
            </div>
          );
        })}
        {filtered.length === 0 && (
          <div className="card empty-state">
            <div className="empty-state-icon">🔍</div>
            <p className="empty-state-title">No matching jobs found</p>
            <p className="empty-state-desc">Try adjusting your filters or check back later</p>
          </div>
        )}
      </div>
    </div>
  );
}
