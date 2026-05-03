import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, MapPin, Calendar, Users, Send, Building2 } from 'lucide-react';
import { StatusBadge, SlotBadge } from '../../components/shared/Badges';
import { useApp } from '../../context/AppContext';
import { MOCK_JOBS, MOCK_COMPANIES, MOCK_BATCHES } from '../../data/mockData';
import toast from 'react-hot-toast';

export default function CoordJobDetail() {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useApp();
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [selectedBatch, setSelectedBatch] = useState('');
  const [coverNote, setCoverNote] = useState('');

  const job = MOCK_JOBS.find(j => j._id === jobId);
  const company = job ? MOCK_COMPANIES.find(c => c._id === job.companyId) : null;
  const myBatches = MOCK_BATCHES.filter(b => b.coordinatorId === currentUser._id && b.status === 'active' && b.totalStudents > 0);

  if (!job) return (
    <div className="card empty-state mt-8">
      <p className="empty-state-title">Job not found</p>
      <button onClick={() => navigate('/coordinator/jobs')} className="btn btn-outline mt-4">Go Back</button>
    </div>
  );

  const handleApply = () => {
    if (!selectedBatch) return;
    toast.success('Application submitted successfully!');
    setShowApplyModal(false);
  };

  return (
    <div className="animate-fade-in">
      <button onClick={() => navigate('/coordinator/jobs')} className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 mb-6 transition-colors">
        <ArrowLeft size={16} /> Back to Jobs
      </button>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-5">
          <div className="card">
            <div className="flex items-start justify-between gap-4 mb-4">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <h1 className="text-2xl font-bold text-gray-900">{job.title}</h1>
                  <StatusBadge type="job" status={job.status} />
                </div>
                <p className="text-gray-500">{company?.name} · {job.sector}</p>
              </div>
              <button onClick={() => setShowApplyModal(true)} className="btn btn-primary flex-shrink-0">
                <Send size={15} /> Apply Now
              </button>
            </div>
            <div className="flex flex-wrap gap-4 text-sm text-gray-500 mb-5">
              <span className="flex items-center gap-1.5"><MapPin size={14} />{job.location}, {job.state}</span>
              <span className="flex items-center gap-1.5"><Calendar size={14} />Deadline: {job.applicationDeadline}</span>
              <span className="flex items-center gap-1.5"><Users size={14} />{job.experienceLevel}</span>
            </div>
            <div className="bg-gray-50 rounded-xl p-4 mb-4">
              <p className="text-sm font-semibold text-gray-600 mb-1">Salary Range</p>
              <p className="text-xl font-bold text-gray-900">₹{job.salaryMin.toLocaleString('en-IN')} – ₹{job.salaryMax.toLocaleString('en-IN')} <span className="text-sm font-normal text-gray-400">/ month</span></p>
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-700 mb-2">Required Qualifications</p>
              <SlotBadge slots={job.slots} />
            </div>
          </div>

          <div className="card">
            <h2 className="font-bold text-gray-800 mb-3">Job Description</h2>
            <div className="text-sm text-gray-600 leading-relaxed whitespace-pre-line">{job.description.replace(/##\s/g, '').replace(/\n-/g, '\n•')}</div>
          </div>
        </div>

        <div className="space-y-5">
          <div className="card">
            <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2"><Building2 size={16} className="text-blue-500" /> Company</h3>
            <p className="font-bold text-gray-900">{company?.name}</p>
            <p className="text-sm text-gray-500 mt-1">{company?.sector}</p>
            <p className="text-xs text-gray-400 mt-2">{company?.address}</p>
          </div>
          <div className="card">
            <h3 className="font-semibold text-gray-800 mb-3">Required Skills</h3>
            <div className="flex flex-wrap gap-2">
              {job.skills.map(s => <span key={s} className="badge badge-blue">{s}</span>)}
            </div>
          </div>
        </div>
      </div>

      {showApplyModal && (
        <div className="modal-overlay" onClick={() => setShowApplyModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <h3 className="text-lg font-bold text-gray-900 mb-1">Apply to {job.title}</h3>
            <p className="text-sm text-gray-500 mb-5">Select a batch and add a cover note for the recruiter.</p>
            <label className="form-label">Select Batch <span className="text-red-500">*</span></label>
            <select className="form-input form-select mb-4" value={selectedBatch} onChange={e => setSelectedBatch(e.target.value)}>
              <option value="">Choose a batch…</option>
              {myBatches.map(b => <option key={b._id} value={b._id}>{b.name} ({b.totalStudents} students)</option>)}
            </select>
            <label className="form-label">Cover Note</label>
            <textarea className="form-input form-textarea mb-5" placeholder="Briefly describe why this batch is a good fit…"
              value={coverNote} onChange={e => setCoverNote(e.target.value)} />
            <div className="flex gap-3">
              <button onClick={() => setShowApplyModal(false)} className="btn btn-outline flex-1">Cancel</button>
              <button onClick={handleApply} disabled={!selectedBatch} className="btn btn-primary flex-1">
                <Send size={15} /> Submit Application
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
