import { useState } from 'react';
import { Search, MapPin, Calendar, IndianRupee, ChevronRight, X } from 'lucide-react';
import { StatusBadge, SlotBadge } from '../../components/shared/Badges';
import { useApp } from '../../context/AppContext';
import { MOCK_JOBS, MOCK_COMPANIES, MOCK_BATCHES, MOCK_APPLICATIONS } from '../../data/mockData';

export default function StudentJobs() {
  const { currentUser } = useApp();
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState(null);

  const myBatch = MOCK_BATCHES.find(b => b._id === currentUser.batchId);

  // Jobs open and matching this student's qualification
  const jobs = MOCK_JOBS.filter(j => {
    if (j.status !== 'open') return false;
    const matchesQual = j.slots.some(sl => sl.qualification === myBatch?.qualification);
    const matchesSearch = j.title.toLowerCase().includes(search.toLowerCase()) ||
      MOCK_COMPANIES.find(c => c._id === j.companyId)?.name.toLowerCase().includes(search.toLowerCase());
    return matchesQual && matchesSearch;
  });

  // Check if already applied via batch
  const appliedJobIds = new Set(
    MOCK_APPLICATIONS
      .filter(a => a.talentPoolBatchId === currentUser.batchId)
      .map(a => a.jobRequirementId)
  );

  const selectedJob = selected ? MOCK_JOBS.find(j => j._id === selected) : null;
  const selectedCompany = selectedJob ? MOCK_COMPANIES.find(c => c._id === selectedJob.companyId) : null;

  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <h1 className="page-title">Browse Job Opportunities</h1>
        <p className="page-subtitle">
          Showing jobs matching your qualification: <span className="font-semibold text-blue-600">{myBatch?.qualification} · {myBatch?.branch}</span>
        </p>
      </div>

      <div className="search-wrap mb-6 max-w-md">
        <Search size={15} className="search-icon" />
        <input className="form-input" placeholder="Search by job title or company…"
          value={search} onChange={e => setSearch(e.target.value)} />
      </div>

      <div className="grid lg:grid-cols-5 gap-6">
        {/* Job list */}
        <div className="lg:col-span-2 space-y-3">
          {jobs.length === 0 ? (
            <div className="card empty-state">
              <div className="empty-state-icon">🔍</div>
              <p className="empty-state-title">No matching jobs</p>
              <p className="empty-state-desc">Check back later for new openings</p>
            </div>
          ) : jobs.map(job => {
            const company = MOCK_COMPANIES.find(c => c._id === job.companyId);
            const applied = appliedJobIds.has(job._id);
            return (
              <div key={job._id}
                onClick={() => setSelected(job._id)}
                className={`card card-sm card-interactive ${selected === job._id ? 'border-blue-400 ring-2 ring-blue-100' : ''}`}>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <h3 className="font-bold text-gray-900 text-sm leading-tight">{job.title}</h3>
                  {applied
                    ? <span className="badge badge-green flex-shrink-0">Applied</span>
                    : <span className="badge badge-blue flex-shrink-0">Open</span>
                  }
                </div>
                <p className="text-xs text-gray-500 mb-2">{company?.name} · {job.sector}</p>
                <div className="flex items-center gap-3 text-xs text-gray-400">
                  <span className="flex items-center gap-1"><MapPin size={11} />{job.location}</span>
                  <span className="flex items-center gap-1"><Calendar size={11} />{job.applicationDeadline}</span>
                </div>
                <p className="text-sm font-semibold text-gray-700 mt-2">
                  ₹{job.salaryMin.toLocaleString('en-IN')} – ₹{job.salaryMax.toLocaleString('en-IN')}/mo
                </p>
              </div>
            );
          })}
        </div>

        {/* Detail panel */}
        <div className="lg:col-span-3">
          {!selectedJob ? (
            <div className="card empty-state min-h-64 flex flex-col items-center justify-center">
              <div className="empty-state-icon">💼</div>
              <p className="empty-state-title">Select a job to view details</p>
            </div>
          ) : (
            <div className="card animate-fade-in">
              <div className="flex items-start justify-between gap-4 mb-5">
                <div>
                  <h2 className="text-xl font-bold text-gray-900 mb-1">{selectedJob.title}</h2>
                  <p className="text-gray-500">{selectedCompany?.name} · {selectedJob.sector}</p>
                  <div className="flex flex-wrap gap-2 mt-3">
                    <StatusBadge type="job" status={selectedJob.status} />
                    {selectedJob.geographyScope === 'pan_india' && <span className="badge badge-purple">Pan India</span>}
                    {appliedJobIds.has(selectedJob._id) && <span className="badge badge-green">✓ Your batch applied</span>}
                  </div>
                </div>
                <button onClick={() => setSelected(null)} className="btn btn-ghost btn-icon text-gray-400">
                  <X size={18} />
                </button>
              </div>

              <div className="grid sm:grid-cols-3 gap-3 mb-5">
                <div className="bg-gray-50 rounded-xl p-3 text-center">
                  <p className="text-xs text-gray-400 mb-1">Salary</p>
                  <p className="font-bold text-gray-800 text-sm">₹{selectedJob.salaryMin.toLocaleString('en-IN')}–{selectedJob.salaryMax.toLocaleString('en-IN')}</p>
                  <p className="text-xs text-gray-400">per month</p>
                </div>
                <div className="bg-gray-50 rounded-xl p-3 text-center">
                  <p className="text-xs text-gray-400 mb-1">Location</p>
                  <p className="font-bold text-gray-800 text-sm">{selectedJob.location}</p>
                  <p className="text-xs text-gray-400">{selectedJob.state}</p>
                </div>
                <div className="bg-gray-50 rounded-xl p-3 text-center">
                  <p className="text-xs text-gray-400 mb-1">Deadline</p>
                  <p className="font-bold text-gray-800 text-sm">{selectedJob.applicationDeadline}</p>
                  <p className="text-xs text-gray-400">Apply by</p>
                </div>
              </div>

              <div className="mb-5">
                <p className="text-sm font-semibold text-gray-700 mb-2">Qualification Slots</p>
                <SlotBadge slots={selectedJob.slots} />
              </div>

              <div className="mb-5">
                <p className="text-sm font-semibold text-gray-700 mb-2">Required Skills</p>
                <div className="flex flex-wrap gap-2">
                  {selectedJob.skills.map(s => <span key={s} className="badge badge-blue">{s}</span>)}
                </div>
              </div>

              <div className="mb-5">
                <p className="text-sm font-semibold text-gray-700 mb-2">Job Description</p>
                <div className="text-sm text-gray-600 leading-relaxed bg-gray-50 rounded-xl p-4 whitespace-pre-line">
                  {selectedJob.description.replace(/##\s/g, '').replace(/\n-/g, '\n•')}
                </div>
              </div>

              {appliedJobIds.has(selectedJob._id) ? (
                <div className="bg-green-50 border border-green-100 rounded-xl p-4 text-center">
                  <p className="text-sm font-semibold text-green-700">✓ Your batch has applied to this job</p>
                  <p className="text-xs text-green-600 mt-1">Your coordinator submitted your batch. Check Applications for your status.</p>
                </div>
              ) : (
                <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 text-center">
                  <p className="text-sm font-semibold text-blue-700">Applications are submitted by your coordinator</p>
                  <p className="text-xs text-blue-600 mt-1">Contact your placement coordinator to apply for this opportunity.</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
