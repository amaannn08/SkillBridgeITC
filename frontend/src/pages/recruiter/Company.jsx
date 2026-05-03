import { useState } from 'react';
import { Building2, Globe, MapPin, Edit2, Save, X } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { MOCK_COMPANIES, SECTORS } from '../../data/mockData';
import toast from 'react-hot-toast';

export default function RecruiterCompany() {
  const { currentUser } = useApp();
  const company = MOCK_COMPANIES.find(c => c._id === currentUser.companyId);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState(company || {});

  if (!company) return (
    <div className="animate-fade-in">
      <div className="page-header"><h1 className="page-title">Company Profile</h1></div>
      <div className="card empty-state">
        <div className="empty-state-icon">🏢</div>
        <p className="empty-state-title">No company linked</p>
        <p className="empty-state-desc">Your account is not yet linked to a company. Contact the admin.</p>
      </div>
    </div>
  );

  const save = () => { toast.success('Company profile updated'); setEditing(false); };

  return (
    <div className="animate-fade-in">
      <div className="page-header flex items-start justify-between">
        <div>
          <h1 className="page-title">Company Profile</h1>
          <p className="page-subtitle">Manage your company's information</p>
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
            <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center flex-shrink-0">
              <Building2 size={28} className="text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">{company.name}</h2>
              <p className="text-sm text-gray-500">{company.sector}</p>
              <span className="badge badge-green mt-1">Verified ✓</span>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-5">
            {[
              { label: 'Company Name', key: 'name' },
              { label: 'Industry Sector', key: 'sector', type: 'select' },
              { label: 'Email Domain', key: 'emailDomain' },
              { label: 'Website', key: 'website' },
            ].map(f => (
              <div key={f.key}>
                <label className="form-label">{f.label}</label>
                {editing
                  ? f.type === 'select'
                    ? <select className="form-input form-select" value={form[f.key] || ''} onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))}>
                        {SECTORS.map(s => <option key={s}>{s}</option>)}
                      </select>
                    : <input className="form-input" value={form[f.key] || ''} onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))} />
                  : <p className="text-sm font-medium text-gray-800 py-2">{company[f.key] || '—'}</p>
                }
              </div>
            ))}
            <div className="sm:col-span-2">
              <label className="form-label">Registered Address</label>
              {editing
                ? <input className="form-input" value={form.address || ''} onChange={e => setForm(p => ({ ...p, address: e.target.value }))} />
                : <p className="text-sm font-medium text-gray-800 py-2">{company.address}</p>
              }
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="card card-sm">
            <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider mb-3">Quick Info</p>
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Globe size={14} className="text-gray-400" />
                <a href={company.website} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline truncate">{company.website}</a>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <MapPin size={14} className="text-gray-400" />
                <span className="truncate">{company.address.split(',').slice(-1)[0].trim()}</span>
              </div>
            </div>
          </div>
          <div className="card card-sm bg-green-50 border-green-100">
            <p className="text-xs font-semibold text-green-700 mb-1">Verified Since</p>
            <p className="text-base font-bold text-green-800">{company.verifiedAt}</p>
          </div>
          <div className="card card-sm bg-blue-50 border-blue-100">
            <p className="text-xs font-semibold text-blue-700 mb-1">Email Domain</p>
            <p className="text-base font-bold text-blue-800 font-mono">@{company.emailDomain}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
