import { useState } from 'react';
import { Edit2, Save, X, Plus, Trash2, GraduationCap, Phone, Mail, MapPin, Award, Languages } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { MOCK_BATCHES, MOCK_INSTITUTIONS } from '../../data/mockData';
import toast from 'react-hot-toast';

export default function StudentProfile() {
  const { currentUser } = useApp();
  const myBatch = MOCK_BATCHES.find(b => b._id === currentUser.batchId);
  const institution = MOCK_INSTITUTIONS.find(i => i._id === currentUser.institutionId);
  const studentData = myBatch?.students.find(s => s._id === currentUser._id);

  const [editing, setEditing] = useState(false);
  const [profile, setProfile] = useState({
    phone: studentData?.phone || '',
    email: studentData?.email || '',
    address: studentData?.address || '',
    cgpa: studentData?.cgpa || '',
    skills: studentData?.skills || [],
    certifications: studentData?.certifications || [],
    languagesKnown: studentData?.languagesKnown || [],
    about: studentData?.about || '',
  });
  const [newSkill, setNewSkill] = useState('');
  const [newCert, setNewCert] = useState('');
  const [newLang, setNewLang] = useState('');

  const save = () => {
    toast.success('Profile updated successfully');
    setEditing(false);
  };

  const addTag = (field, value, setter) => {
    if (!value.trim()) return;
    setProfile(p => ({ ...p, [field]: [...p[field], value.trim()] }));
    setter('');
  };

  const removeTag = (field, idx) => {
    setProfile(p => ({ ...p, [field]: p[field].filter((_, i) => i !== idx) }));
  };

  if (!studentData) return (
    <div className="card empty-state mt-8">
      <div className="empty-state-icon">👤</div>
      <p className="empty-state-title">Profile not found</p>
      <p className="empty-state-desc">Your student record hasn't been set up yet. Contact your coordinator.</p>
    </div>
  );

  return (
    <div className="animate-fade-in">
      <div className="page-header flex items-start justify-between">
        <div>
          <h1 className="page-title">My Profile</h1>
          <p className="page-subtitle">Your placement profile visible to recruiters</p>
        </div>
        {!editing
          ? <button onClick={() => setEditing(true)} className="btn btn-outline btn-sm"><Edit2 size={14} /> Edit Profile</button>
          : <div className="flex gap-2">
              <button onClick={() => setEditing(false)} className="btn btn-outline btn-sm"><X size={14} /> Cancel</button>
              <button onClick={save} className="btn btn-primary btn-sm"><Save size={14} /> Save Changes</button>
            </div>
        }
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left — identity */}
        <div className="space-y-5">
          {/* Avatar card */}
          <div className="card text-center">
            <img src={currentUser.profileImage} alt={currentUser.name}
              className="w-20 h-20 rounded-full mx-auto mb-3 ring-4 ring-blue-100" />
            <h2 className="text-lg font-bold text-gray-900">{studentData.name}</h2>
            <p className="text-sm text-gray-500 mt-0.5">{myBatch?.qualification} · {myBatch?.branch}</p>
            <p className="text-xs text-gray-400 mt-1 font-mono">{studentData.rollNumber}</p>
            <div className="flex justify-center gap-2 mt-3">
              <span className="badge badge-blue">{myBatch?.passingYear} Batch</span>
              <span className="badge badge-green">Active</span>
            </div>
          </div>

          {/* Institution */}
          <div className="card card-sm">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Institution</p>
            <div className="flex items-start gap-3">
              <GraduationCap size={18} className="text-blue-500 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-sm text-gray-800">{institution?.name}</p>
                <p className="text-xs text-gray-400">{institution?.type} · {institution?.district}, {institution?.state}</p>
                <p className="text-xs text-gray-400 font-mono mt-0.5">{institution?.aicteCode}</p>
              </div>
            </div>
          </div>

          {/* CGPA */}
          <div className="card card-sm">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Academic Performance</p>
            {editing ? (
              <div>
                <label className="form-label form-label-sm">CGPA / Percentage</label>
                <input className="form-input" type="number" step="0.1" min="0" max="10"
                  value={profile.cgpa} onChange={e => setProfile(p => ({ ...p, cgpa: e.target.value }))} />
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <div className="w-14 h-14 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                  <span className="text-lg font-bold text-blue-700">{profile.cgpa}</span>
                </div>
                <div>
                  <p className="font-semibold text-gray-800">CGPA</p>
                  <p className="text-xs text-gray-400">Out of 10</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right — details */}
        <div className="lg:col-span-2 space-y-5">
          {/* Contact */}
          <div className="card">
            <h3 className="font-bold text-gray-800 mb-4">Contact Information</h3>
            <div className="grid sm:grid-cols-2 gap-4">
              {[
                { label: 'Phone', key: 'phone', icon: Phone, type: 'tel' },
                { label: 'Email', key: 'email', icon: Mail, type: 'email' },
              ].map(f => (
                <div key={f.key}>
                  <label className="form-label flex items-center gap-1.5"><f.icon size={13} className="text-gray-400" />{f.label}</label>
                  {editing
                    ? <input className="form-input" type={f.type} value={profile[f.key]}
                        onChange={e => setProfile(p => ({ ...p, [f.key]: e.target.value }))} />
                    : <p className="text-sm font-medium text-gray-800 py-2">{profile[f.key] || '—'}</p>
                  }
                </div>
              ))}
              <div className="sm:col-span-2">
                <label className="form-label flex items-center gap-1.5"><MapPin size={13} className="text-gray-400" />Home Address</label>
                {editing
                  ? <input className="form-input" value={profile.address}
                      onChange={e => setProfile(p => ({ ...p, address: e.target.value }))} />
                  : <p className="text-sm font-medium text-gray-800 py-2">{profile.address || '—'}</p>
                }
              </div>
            </div>
          </div>

          {/* About */}
          <div className="card">
            <h3 className="font-bold text-gray-800 mb-4">About Me</h3>
            {editing
              ? <textarea className="form-input form-textarea" placeholder="Write a short bio for recruiters…"
                  value={profile.about} onChange={e => setProfile(p => ({ ...p, about: e.target.value }))} />
              : <p className="text-sm text-gray-600 leading-relaxed">{profile.about || <span className="text-gray-400 italic">No bio added yet</span>}</p>
            }
          </div>

          {/* Skills */}
          <div className="card">
            <h3 className="font-bold text-gray-800 mb-4">Skills</h3>
            <div className="flex flex-wrap gap-2 mb-3">
              {profile.skills.map((s, i) => (
                <span key={i} className="badge badge-blue flex items-center gap-1.5">
                  {s}
                  {editing && <button onClick={() => removeTag('skills', i)} className="hover:text-red-500"><X size={11} /></button>}
                </span>
              ))}
              {profile.skills.length === 0 && !editing && <p className="text-sm text-gray-400 italic">No skills added</p>}
            </div>
            {editing && (
              <div className="flex gap-2">
                <input className="form-input flex-1" placeholder="Add a skill…" value={newSkill}
                  onChange={e => setNewSkill(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && addTag('skills', newSkill, setNewSkill)} />
                <button onClick={() => addTag('skills', newSkill, setNewSkill)} className="btn btn-outline btn-sm"><Plus size={14} /></button>
              </div>
            )}
          </div>

          {/* Certifications */}
          <div className="card">
            <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2"><Award size={16} className="text-orange-500" /> Certifications</h3>
            <div className="flex flex-wrap gap-2 mb-3">
              {profile.certifications.map((c, i) => (
                <span key={i} className="badge badge-orange flex items-center gap-1.5">
                  {c}
                  {editing && <button onClick={() => removeTag('certifications', i)} className="hover:text-red-500"><X size={11} /></button>}
                </span>
              ))}
              {profile.certifications.length === 0 && !editing && <p className="text-sm text-gray-400 italic">No certifications added</p>}
            </div>
            {editing && (
              <div className="flex gap-2">
                <input className="form-input flex-1" placeholder="e.g. NSDC Electrician L3…" value={newCert}
                  onChange={e => setNewCert(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && addTag('certifications', newCert, setNewCert)} />
                <button onClick={() => addTag('certifications', newCert, setNewCert)} className="btn btn-outline btn-sm"><Plus size={14} /></button>
              </div>
            )}
          </div>

          {/* Languages */}
          <div className="card">
            <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2"><Languages size={16} className="text-purple-500" /> Languages Known</h3>
            <div className="flex flex-wrap gap-2 mb-3">
              {profile.languagesKnown.map((l, i) => (
                <span key={i} className="badge badge-purple flex items-center gap-1.5">
                  {l}
                  {editing && <button onClick={() => removeTag('languagesKnown', i)} className="hover:text-red-500"><X size={11} /></button>}
                </span>
              ))}
              {profile.languagesKnown.length === 0 && !editing && <p className="text-sm text-gray-400 italic">No languages added</p>}
            </div>
            {editing && (
              <div className="flex gap-2">
                <input className="form-input flex-1" placeholder="e.g. Hindi, English…" value={newLang}
                  onChange={e => setNewLang(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && addTag('languagesKnown', newLang, setNewLang)} />
                <button onClick={() => addTag('languagesKnown', newLang, setNewLang)} className="btn btn-outline btn-sm"><Plus size={14} /></button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
