import { useState } from 'react';
import { Building2, MapPin, Globe, Edit2, Save, X } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { MOCK_INSTITUTIONS } from '../../data/mockData';
import toast from 'react-hot-toast';

export default function CoordInstitution() {
  const { currentUser } = useApp();
  const inst = MOCK_INSTITUTIONS.find(i => i._id === currentUser.institutionId);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState(inst || {});

  if (!inst) return (
    <div className="animate-fade-in">
      <div className="page-header">
        <h1 className="page-title">Institution Profile</h1>
      </div>
      <div className="card empty-state">
        <div className="empty-state-icon">🏫</div>
        <p className="empty-state-title">No institution linked</p>
        <p className="empty-state-desc">Your account is not yet linked to an institution. Contact the admin.</p>
      </div>
    </div>
  );

  const save = () => {
    toast.success('Institution profile updated');
    setEditing(false);
  };

  return (
    <div className="animate-fade-in">
      <div className="page-header flex items-start justify-between">
        <div>
          <h1 className="page-title">Institution Profile</h1>
          <p className="page-subtitle">Manage your institution's information</p>
        </div>
        {!editing
          ? <button onClick={() => setEditing(true)} className="btn btn-outline btn-sm"><Edit2 size={14} /> Edit</button>
          : <div className="flex gap-2">
              <button onClick={() => setEditing(false)} className="btn btn-outline btn-sm"><X size={14} /> Cancel</button>
              <button onClick={save} className="btn btn-primary btn-sm"><Save size={14} /> Save</button>
            </div>
        }
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 card">
          <div className="flex items-center gap-4 mb-6 pb-5 border-b border-gray-100">
            <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center flex-shrink-0">
              <Building2 size={28} className="text-green-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">{inst.name}</h2>
              <p className="text-sm text-gray-500">{inst.type}</p>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-5">
            {[
              { label: 'Institution Name', key: 'name' },
              { label: 'Type', key: 'type' },
              { label: 'AICTE / DTE Code', key: 'aicteCode' },
              { label: 'State', key: 'state' },
              { label: 'District', key: 'district' },
              { label: 'Website', key: 'website' },
            ].map(f => (
              <div key={f.key}>
                <label className="form-label">{f.label}</label>
                {editing
                  ? <input className="form-input" value={form[f.key] || ''} onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))} />
                  : <p className="text-sm font-medium text-gray-800 py-2">{inst[f.key] || '—'}</p>
                }
              </div>
            ))}
            <div className="sm:col-span-2">
              <label className="form-label">Address</label>
              {editing
                ? <input className="form-input" value={form.address || ''} onChange={e => setForm(p => ({ ...p, address: e.target.value }))} />
                : <p className="text-sm font-medium text-gray-800 py-2">{inst.address}</p>
              }
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="card card-sm">
            <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider mb-3">Quick Info</p>
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <MapPin size={14} className="text-gray-400" /> {inst.district}, {inst.state}
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Globe size={14} className="text-gray-400" />
                <a href={inst.website} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline truncate">{inst.website}</a>
              </div>
            </div>
          </div>
          <div className="card card-sm bg-green-50 border-green-100">
            <p className="text-xs font-semibold text-green-700 mb-1">AICTE Code</p>
            <p className="text-lg font-bold text-green-800 font-mono">{inst.aicteCode}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
