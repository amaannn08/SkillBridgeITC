import { useState } from 'react';
import { Search, MapPin, Calendar, Users } from 'lucide-react';
import { StatusBadge, SlotBadge } from '../../components/shared/Badges';
import { MOCK_JOBS, MOCK_COMPANIES } from '../../data/mockData';
import { formatDistanceToNow } from 'date-fns';

export default function AdminJobs() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const filtered = MOCK_JOBS.filter(j => {
    const matchStatus = statusFilter === 'all' || j.status === statusFilter;
    const company = MOCK_COMPANIES.find(c => c._id === j.companyId);
    const matchSearch = j.title.toLowerCase().includes(search.toLowerCase()) ||
      (company?.name || '').toLowerCase().includes(search.toLowerCase());
    return matchStatus && matchSearch;
  });

  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <h1 className="page-title">Job Requirements</h1>
        <p className="page-subtitle">All job postings across the platform</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="search-wrap flex-1">
          <Search size={15} className="search-icon" />
          <input className="form-input" placeholder="Search jobs or companies…" value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <select className="form-input form-select w-full sm:w-44" value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
          <option value="all">All Statuses</option>
          <option value="open">Open</option>
          <option value="filled">Filled</option>
          <option value="closed">Closed</option>
          <option value="draft">Draft</option>
        </select>
      </div>

      <div className="space-y-4">
        {filtered.map(job => {
          const company = MOCK_COMPANIES.find(c => c._id === job.companyId);
          const totalSeats = job.slots.reduce((s, sl) => s + sl.seats, 0);
          const filledSeats = job.slots.reduce((s, sl) => s + sl.filledSeats, 0);
          return (
            <div key={job._id} className="card card-hover">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-bold text-gray-900">{job.title}</h3>
                    <StatusBadge type="job" status={job.status} />
                  </div>
                  <p className="text-sm text-gray-500 mb-3">{company?.name} · {job.sector}</p>
                  <SlotBadge slots={job.slots} />
                  <div className="flex flex-wrap gap-4 mt-3 text-xs text-gray-500">
                    <span className="flex items-center gap-1"><MapPin size={12} />{job.location}, {job.state}</span>
                    <span className="flex items-center gap-1"><Users size={12} />{filledSeats}/{totalSeats} seats filled</span>
                    <span className="flex items-center gap-1"><Calendar size={12} />Deadline: {job.applicationDeadline}</span>
                  </div>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-lg font-bold text-gray-900">₹{job.salaryMin.toLocaleString('en-IN')}</p>
                  <p className="text-xs text-gray-400">to ₹{job.salaryMax.toLocaleString('en-IN')}/mo</p>
                  <p className="text-xs text-gray-400 mt-2">{formatDistanceToNow(new Date(job.createdAt), { addSuffix: true })}</p>
                </div>
              </div>
            </div>
          );
        })}
        {filtered.length === 0 && (
          <div className="card empty-state">
            <div className="empty-state-icon">💼</div>
            <p className="empty-state-title">No jobs found</p>
          </div>
        )}
      </div>
    </div>
  );
}
