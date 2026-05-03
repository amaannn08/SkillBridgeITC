import { useState } from 'react';
import { Search, MapPin, Calendar, X, Navigation } from 'lucide-react';
import { StatusBadge, SlotBadge } from '../../components/shared/Badges';
import { useApp } from '../../context/AppContext';
import { MOCK_JOBS, MOCK_COMPANIES, MOCK_BATCHES, MOCK_APPLICATIONS, MOCK_INSTITUTIONS } from '../../data/mockData';

// Haversine distance in km
function distanceKm(lat1, lng1, lat2, lng2) {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a = Math.sin(dLat/2)**2 + Math.cos(lat1*Math.PI/180) * Math.cos(lat2*Math.PI/180) * Math.sin(dLng/2)**2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
}

export default function StudentJobs() {
  const { currentUser } = useApp();
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState(null);
  const [proximity, setProximity] = useState('all'); // all | nearest_college | nearest_home

  const myBatch = MOCK_BATCHES.find(b => b._id === currentUser.batchId);
  const myInstitution = MOCK_INSTITUTIONS.find(i => i._id === currentUser.institutionId);

  // Jobs open and matching this student's qualification
  let jobs = MOCK_JOBS.filter(j => {
    if (j.status !== 'open') return false;
    const matchesQual = j.slots.some(sl => sl.qualification === myBatch?.qualification);
    const matchesSearch = j.title.toLowerCase().includes(search.toLowerCase()) ||
      MOCK_COMPANIES.find(c => c._id === j.companyId)?.name.toLowerCase().includes(search.toLowerCase());
    return matchesQual && matchesSearch;
  });

  // Sort by proximity if selected
  if (proximity !== 'all' && myInstitution) {
    const refLat = myInstitution.lat;
    const refLng = myInstitution.lng;
    jobs = [...jobs].sort((a, b) => {
      const compA = MOCK_COMPANIES.find(c => c._id === a.companyId);
      const compB = MOCK_COMPANIES.find(c => c._id === b.companyId);
      if (!compA?.lat || !compB?.lat) return 0;
      const dA = distanceKm(refLat, refLng, compA.lat, compA.lng);
      const dB = distanceKm(refLat, refLng, compB.lat, compB.lng);
      return dA - dB;
    });
  }

  const appliedJobIds = new Set(
    MOCK_APPLICATIONS.filter(a => a.talentPoolBatchId === currentUser.batchId).map(a => a.jobRequirementId)
  );

  const selectedJob = selected ? MOCK_JOBS.find(j => j._id === selected) : null;
  const selectedCompany = selectedJob ? MOCK_COMPANIES.find(c => c._id === selectedJob.companyId) : null;

  const getDistance = (job) => {
    const company = MOCK_COMPANIES.find(c => c._id === job.companyId);
    if (!company?.lat || !myInstitution?.lat) return null;
    return Math.round(distanceKm(myInstitution.lat, myInstitution.lng, company.lat, company.lng));
  };

  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <h1 className="page-title">Browse Job Opportunities</h1>
        <p className="page-subtitle">
          Showing jobs for: <span className="font-semibold text-blue-600">{myBatch?.qualification} · {myBatch?.branch}</span>
        </p>
      </div>

      {/* Search + proximity filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="search-wrap flex-1">
          <Search size={15} className="search-icon" />
          <input className="form-input" placeholder="Search by job title or company…"
            value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <div className="flex gap-2">
          {[
            { key: 'all', label: 'All Jobs' },
            { key: 'nearest_college', label: 'Nearest to College' },
          ].map(opt => (
            <button key={opt.key} onClick={() => setProximity(opt.key)}
              className={`btn btn-sm flex items-center gap-1.5 ${proximity === opt.key ? 'btn-primary' : 'btn-outline'}`}>
              {opt.key !== 'all' && <Navigation size={12} />}
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {proximity !== 'all' && myInstitution && (
        <div className="flex items-center gap-2 mb-4 px-3 py-2 bg-blue-50 rounded-xl border border-blue-100 text-sm text-blue-700">
          <Navigation size={14} />
          Sorted by distance from <strong>{myInstitution.name}</strong>
        </div>
      )}

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
            const dist = getDistance(job);
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
                  {dist !== null && (
                    <span className="flex items-center gap-1 text-blue-500 font-medium">
                      <Navigation size={11} />{dist} km away
                    </span>
                  )}
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
                    {appliedJobIds.has(selectedJob._id) && <span className="badge badge-green">✓ Your batch applied</span>}
                    {(() => { const d = getDistance(selectedJob); return d !== null ? <span className="badge badge-blue"><Navigation size={10} /> {d} km from college</span> : null; })()}
                  </div>
                </div>
                <button onClick={() => setSelected(null)} className="btn btn-ghost btn-icon text-gray-400"><X size={18} /></button>
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
                  <p className="text-xs text-green-600 mt-1">Check Applications tab for your individual status.</p>
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
