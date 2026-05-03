import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight, Search } from 'lucide-react';
import { StatusBadge } from '../../components/shared/Badges';
import { useApp } from '../../context/AppContext';
import { MOCK_APPLICATIONS, MOCK_JOBS, MOCK_BATCHES } from '../../data/mockData';

export default function RecruiterApplications() {
  const navigate = useNavigate();
  const { currentUser } = useApp();
  const [search, setSearch] = useState('');

  const myApps = MOCK_APPLICATIONS.filter(a => a.companyId === currentUser.companyId);
  const filtered = myApps.filter(a => {
    const job = MOCK_JOBS.find(j => j._id === a.jobRequirementId);
    return (job?.title || '').toLowerCase().includes(search.toLowerCase());
  });

  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <h1 className="page-title">All Applications</h1>
        <p className="page-subtitle">{myApps.length} total applications across all jobs</p>
      </div>

      <div className="search-wrap mb-6 max-w-sm">
        <Search size={15} className="search-icon" />
        <input className="form-input" placeholder="Search by job title…" value={search} onChange={e => setSearch(e.target.value)} />
      </div>

      {filtered.length === 0 ? (
        <div className="card empty-state">
          <div className="empty-state-icon">📭</div>
          <p className="empty-state-title">No applications found</p>
        </div>
      ) : (
        <div className="card">
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Job</th>
                  <th>Batch</th>
                  <th>Students</th>
                  <th>Status</th>
                  <th>Submitted</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(app => {
                  const job = MOCK_JOBS.find(j => j._id === app.jobRequirementId);
                  const batch = MOCK_BATCHES.find(b => b._id === app.talentPoolBatchId);
                  const selected = app.studentStatuses.filter(s => s.status === 'selected').length;
                  return (
                    <tr key={app._id}>
                      <td className="font-semibold text-gray-800">{job?.title}</td>
                      <td className="text-sm text-gray-600">{batch?.name}</td>
                      <td>
                        <span className="text-sm font-semibold text-gray-800">{app.studentStatuses.length}</span>
                        {selected > 0 && <span className="ml-2 badge badge-green">{selected} selected</span>}
                      </td>
                      <td><StatusBadge type="application" status={app.status} /></td>
                      <td className="text-sm text-gray-400">{app.submittedAt}</td>
                      <td>
                        <button onClick={() => navigate(`/recruiter/jobs/${app.jobRequirementId}/applications`)}
                          className="btn btn-ghost btn-sm text-blue-600">
                          Review <ChevronRight size={14} />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
