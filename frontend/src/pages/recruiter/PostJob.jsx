import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, Trash2, Save } from 'lucide-react';
import { INDIAN_STATES, SECTORS, QUALIFICATIONS, EXPERIENCE_LEVELS } from '../../data/mockData';
import toast from 'react-hot-toast';

const emptySlot = { qualification: '', branch: '', seats: '' };

export default function RecruiterPostJob() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: '', location: '', state: '', sector: '', experienceLevel: '',
    salaryMin: '', salaryMax: '', applicationDeadline: '', geographyScope: 'state',
    description: '', skills: '',
  });
  const [slots, setSlots] = useState([{ ...emptySlot }]);
  const [saving, setSaving] = useState(false);

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));
  const setSlot = (i, k, v) => setSlots(s => s.map((sl, idx) => idx === i ? { ...sl, [k]: v } : sl));
  const addSlot = () => setSlots(s => [...s, { ...emptySlot }]);
  const removeSlot = (i) => setSlots(s => s.filter((_, idx) => idx !== i));

  const handleSubmit = (e) => {
    e.preventDefault();
    setSaving(true);
    setTimeout(() => {
      toast.success('Job posted successfully!');
      navigate('/recruiter/jobs');
    }, 1000);
  };

  return (
    <div className="animate-fade-in">
      <button onClick={() => navigate('/recruiter/jobs')} className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 mb-6 transition-colors">
        <ArrowLeft size={16} /> Back to Jobs
      </button>

      <div className="page-header">
        <h1 className="page-title">Post a New Job Requirement</h1>
        <p className="page-subtitle">Fill in the details to attract the right talent</p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-5">
            {/* Basic info */}
            <div className="card">
              <h2 className="font-bold text-gray-800 mb-5">Basic Information</h2>
              <div className="space-y-4">
                <div>
                  <label className="form-label">Job Title <span className="text-red-500">*</span></label>
                  <input className="form-input" placeholder="e.g. Plant Operator Trainee" value={form.title} onChange={e => set('title', e.target.value)} required />
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="form-label">Sector <span className="text-red-500">*</span></label>
                    <select className="form-input form-select" value={form.sector} onChange={e => set('sector', e.target.value)} required>
                      <option value="">Select sector</option>
                      {SECTORS.map(s => <option key={s}>{s}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="form-label">Experience Level <span className="text-red-500">*</span></label>
                    <select className="form-input form-select" value={form.experienceLevel} onChange={e => set('experienceLevel', e.target.value)} required>
                      <option value="">Select level</option>
                      {EXPERIENCE_LEVELS.map(l => <option key={l}>{l}</option>)}
                    </select>
                  </div>
                </div>
                <div>
                  <label className="form-label">Job Description <span className="text-red-500">*</span></label>
                  <textarea className="form-input form-textarea" style={{ minHeight: 140 }} placeholder="Describe the role, responsibilities, and perks…"
                    value={form.description} onChange={e => set('description', e.target.value)} required />
                </div>
                <div>
                  <label className="form-label">Required Skills <span className="form-hint inline">(comma-separated)</span></label>
                  <input className="form-input" placeholder="e.g. Machine Operation, Quality Control" value={form.skills} onChange={e => set('skills', e.target.value)} />
                </div>
              </div>
            </div>

            {/* Location */}
            <div className="card">
              <h2 className="font-bold text-gray-800 mb-5">Location & Scope</h2>
              <div className="grid sm:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="form-label">City / Location <span className="text-red-500">*</span></label>
                  <input className="form-input" placeholder="e.g. Munger" value={form.location} onChange={e => set('location', e.target.value)} required />
                </div>
                <div>
                  <label className="form-label">State <span className="text-red-500">*</span></label>
                  <select className="form-input form-select" value={form.state} onChange={e => set('state', e.target.value)} required>
                    <option value="">Select state</option>
                    {INDIAN_STATES.map(s => <option key={s}>{s}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label className="form-label">Geography Scope</label>
                <div className="flex gap-3 mt-1">
                  {[['state','State Only'],['pan_india','Pan India']].map(([val, label]) => (
                    <label key={val} className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border-2 cursor-pointer transition-all ${form.geographyScope === val ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'}`}>
                      <input type="radio" name="geo" value={val} checked={form.geographyScope === val} onChange={() => set('geographyScope', val)} className="hidden" />
                      <span className="text-sm font-medium">{label}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            {/* Qualification slots */}
            <div className="card">
              <div className="flex items-center justify-between mb-5">
                <h2 className="font-bold text-gray-800">Qualification Slots</h2>
                <button type="button" onClick={addSlot} className="btn btn-outline btn-sm"><Plus size={14} /> Add Slot</button>
              </div>
              <div className="space-y-4">
                {slots.map((sl, i) => (
                  <div key={i} className="grid grid-cols-3 gap-3 p-4 bg-gray-50 rounded-xl relative">
                    <div>
                      <label className="form-label form-label-sm">Qualification</label>
                      <select className="form-input form-select" value={sl.qualification} onChange={e => setSlot(i, 'qualification', e.target.value)}>
                        <option value="">Select</option>
                        {QUALIFICATIONS.map(q => <option key={q}>{q}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="form-label form-label-sm">Branch / Stream</label>
                      <input className="form-input" placeholder="e.g. Electrician" value={sl.branch} onChange={e => setSlot(i, 'branch', e.target.value)} />
                    </div>
                    <div>
                      <label className="form-label form-label-sm">Seats</label>
                      <input className="form-input" type="number" min="1" placeholder="e.g. 40" value={sl.seats} onChange={e => setSlot(i, 'seats', e.target.value)} />
                    </div>
                    {slots.length > 1 && (
                      <button type="button" onClick={() => removeSlot(i)} className="absolute top-3 right-3 text-gray-400 hover:text-red-500 transition-colors">
                        <Trash2 size={14} />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-5">
            <div className="card">
              <h2 className="font-bold text-gray-800 mb-4">Salary & Deadline</h2>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="form-label form-label-sm">Min Salary (₹)</label>
                    <input className="form-input" type="number" placeholder="12000" value={form.salaryMin} onChange={e => set('salaryMin', e.target.value)} />
                  </div>
                  <div>
                    <label className="form-label form-label-sm">Max Salary (₹)</label>
                    <input className="form-input" type="number" placeholder="18000" value={form.salaryMax} onChange={e => set('salaryMax', e.target.value)} />
                  </div>
                </div>
                <div>
                  <label className="form-label">Application Deadline <span className="text-red-500">*</span></label>
                  <input className="form-input" type="date" value={form.applicationDeadline} onChange={e => set('applicationDeadline', e.target.value)} required />
                </div>
              </div>
            </div>

            <div className="card bg-blue-50 border-blue-100">
              <p className="text-sm text-blue-700 leading-relaxed">
                Your job will be visible to coordinators matching the selected geography scope after posting.
              </p>
            </div>

            <button type="submit" disabled={saving} className="btn btn-primary w-full btn-lg">
              {saving ? (
                <span className="flex items-center gap-2"><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Publishing…</span>
              ) : (
                <><Save size={16} /> Publish Job</>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
