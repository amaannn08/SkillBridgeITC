import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, Plus, ChevronRight, Search, Archive } from 'lucide-react';
import { StatusBadge } from '../../components/shared/Badges';
import { useApp } from '../../context/AppContext';
import { MOCK_BATCHES, QUALIFICATIONS } from '../../data/mockData';
import toast from 'react-hot-toast';

const CURRENT_YEAR = new Date().getFullYear();

export default function CoordBatches() {
  const navigate = useNavigate();
  const { currentUser } = useApp();
  const [search, setSearch] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [batches, setBatches] = useState(MOCK_BATCHES.filter(b => b.coordinatorId === currentUser._id));
  const [form, setForm] = useState({ name: '', qualification: '', branch: '', passingYear: CURRENT_YEAR });
  const [saving, setSaving] = useState(false);

  const filtered = batches.filter(b => b.name.toLowerCase().includes(search.toLowerCase()));

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleCreate = (e) => {
    e.preventDefault();
    setSaving(true);
    setTimeout(() => {
      const newBatch = {
        _id: `batch_${Date.now()}`,
        institutionId: currentUser.institutionId,
        coordinatorId: currentUser._id,
        name: form.name,
        qualification: form.qualification,
        branch: form.branch,
        passingYear: Number(form.passingYear),
        totalStudents: 0,
        students: [],
        status: 'draft',
      };
      setBatches(prev => [...prev, newBatch]);
      setShowCreateModal(false);
      setForm({ name: '', qualification: '', branch: '', passingYear: CURRENT_YEAR });
      setSaving(false);
      toast.success('Batch created! Now add students.');
      navigate(`/coordinator/batches/${newBatch._id}`);
    }, 600);
  };

  return (
    <div className="animate-fade-in">
      <div className="page-header flex items-start justify-between">
        <div>
          <h1 className="page-title">Talent Pool Batches</h1>
          <p className="page-subtitle">Manage your student batches and talent pools</p>
        </div>
        <button onClick={() => setShowCreateModal(true)} className="btn btn-primary">
          <Plus size={16} /> New Batch
        </button>
      </div>

      <div className="search-wrap mb-6 max-w-sm">
        <Search size={15} className="search-icon" />
        <input className="form-input" placeholder="Search batches…" value={search} onChange={e => setSearch(e.target.value)} />
      </div>

      {filtered.length === 0 ? (
        <div className="card empty-state">
          <div className="empty-state-icon">👥</div>
          <p className="empty-state-title">No batches found</p>
          <p className="empty-state-desc">Create your first talent pool batch to get started</p>
          <button onClick={() => setShowCreateModal(true)} className="btn btn-primary mt-4"><Plus size={15} /> Create Batch</button>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map(b => (
            <div key={b._id} onClick={() => navigate(`/coordinator/batches/${b._id}`)} className="card card-interactive">
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                  <Users size={22} className="text-blue-600" />
                </div>
                <StatusBadge type="batch" status={b.status} />
              </div>
              <h3 className="font-bold text-gray-900 mb-1">{b.name}</h3>
              <p className="text-sm text-gray-500 mb-4">{b.qualification} · {b.branch} · {b.passingYear}</p>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-sm text-gray-600">
                  <Users size={14} className="text-gray-400" />
                  <span className="font-semibold">{b.totalStudents}</span> students
                </div>
                <ChevronRight size={16} className="text-gray-400" />
              </div>
            </div>
          ))}
        </div>
      )}

      {showCreateModal && (
        <div className="modal-overlay" onClick={() => setShowCreateModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <h3 className="text-lg font-bold text-gray-900 mb-1">Create New Batch</h3>
            <p className="text-sm text-gray-500 mb-5">Define the batch details. You'll add students after creation.</p>
            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="form-label">Batch Name <span className="text-red-500">*</span></label>
                <input className="form-input" placeholder="e.g. Electrical ITI Passout 2024"
                  value={form.name} onChange={e => set('name', e.target.value)} required />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="form-label">Qualification <span className="text-red-500">*</span></label>
                  <select className="form-input form-select" value={form.qualification} onChange={e => set('qualification', e.target.value)} required>
                    <option value="">Select…</option>
                    {QUALIFICATIONS.map(q => <option key={q}>{q}</option>)}
                  </select>
                </div>
                <div>
                  <label className="form-label">Passing Year <span className="text-red-500">*</span></label>
                  <input className="form-input" type="number" min={2020} max={CURRENT_YEAR + 2}
                    value={form.passingYear} onChange={e => set('passingYear', e.target.value)} required />
                </div>
              </div>
              <div>
                <label className="form-label">Branch / Trade / Specialisation <span className="text-red-500">*</span></label>
                <input className="form-input" placeholder="e.g. Electrician, Mechanical, Computer Science"
                  value={form.branch} onChange={e => set('branch', e.target.value)} required />
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowCreateModal(false)} className="btn btn-outline flex-1">Cancel</button>
                <button type="submit" disabled={saving} className="btn btn-primary flex-1">
                  {saving ? <span className="flex items-center gap-2"><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Creating…</span> : 'Create & Add Students'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
