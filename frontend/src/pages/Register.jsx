import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Building2, Briefcase, ChevronRight, ArrowLeft, CheckCircle } from 'lucide-react';
import { INDIAN_STATES, INSTITUTION_TYPES, SECTORS } from '../data/mockData';

export default function Register() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1); // 1=role, 2=form
  const [role, setRole] = useState(null);
  const [form, setForm] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitting(true);
    setTimeout(() => navigate('/pending'), 1200);
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Nav */}
      <nav className="hero-gradient px-6 py-4 flex items-center gap-3">
        <button onClick={() => navigate('/')} className="text-blue-300 hover:text-white">
          <ArrowLeft size={18} />
        </button>
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 bg-white/20 rounded-lg flex items-center justify-center font-bold text-white text-xs">SB</div>
          <span className="font-semibold text-white">SkillBridge</span>
        </div>
      </nav>

      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-lg">
          {/* Step dots */}
          <div className="flex items-center justify-center gap-2 mb-8">
            {[1,2].map(s => (
              <div key={s} className={`step-dot ${step >= s ? 'active' : ''} ${step > s ? 'done' : ''}`} />
            ))}
          </div>

          {step === 1 && (
            <div className="animate-fade-in">
              <h1 className="text-2xl font-bold text-center text-gray-900 mb-2" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                Create Your Account
              </h1>
              <p className="text-center text-gray-500 mb-8 text-sm">Select your role to continue registration</p>

              <div className="grid gap-4">
                {[
                  { key:'coordinator', icon: Building2, title:'I represent a Government College / ITI', desc:'Faculty placement coordinators managing student talent pools', color:'green' },
                  { key:'recruiter',   icon: Briefcase, title:'I represent a Company / Industry',        desc:'Industry recruiters posting job requirements',              color:'blue'  },
                ].map(opt => (
                  <button
                    key={opt.key}
                    onClick={() => { setRole(opt.key); setStep(2); }}
                    className={`card card-hover text-left flex items-center gap-4 p-5 transition-all border-2 ${role === opt.key ? 'border-blue-500' : 'border-transparent'}`}
                  >
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${opt.color === 'green' ? 'bg-green-100' : 'bg-blue-100'}`}>
                      <opt.icon size={22} className={opt.color === 'green' ? 'text-green-600' : 'text-blue-600'} />
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-gray-800">{opt.title}</p>
                      <p className="text-sm text-gray-500 mt-0.5">{opt.desc}</p>
                    </div>
                    <ChevronRight size={18} className="text-gray-400 flex-shrink-0" />
                  </button>
                ))}
              </div>

              <p className="text-center text-sm text-gray-500 mt-6">
                Already registered?{' '}
                <button onClick={() => navigate('/admin')} className="text-blue-600 font-medium hover:underline">Sign In</button>
              </p>
            </div>
          )}

          {step === 2 && (
            <div className="animate-fade-in">
              <button onClick={() => setStep(1)} className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 mb-6">
                <ArrowLeft size={15} /> Back
              </button>
              <h2 className="text-xl font-bold text-gray-900 mb-1" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                {role === 'coordinator' ? '🎓 Faculty Coordinator' : '🏭 Industry Recruiter'} Registration
              </h2>
              <p className="text-sm text-gray-500 mb-6">All fields are required unless marked optional.</p>

              <div className="card p-6">
                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Common fields */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="form-label">Full Name</label>
                      <input className="form-input" placeholder="As per Aadhaar" onChange={e => set('name', e.target.value)} required />
                    </div>
                    <div>
                      <label className="form-label">Designation</label>
                      <input className="form-input" placeholder="e.g. Placement Officer" onChange={e => set('designation', e.target.value)} required />
                    </div>
                  </div>
                  <div>
                    <label className="form-label">Official Phone Number</label>
                    <input className="form-input" type="tel" placeholder="+91 XXXXX XXXXX" onChange={e => set('phone', e.target.value)} required />
                  </div>

                  {role === 'coordinator' ? (
                    <>
                      <div>
                        <label className="form-label">Institution Name</label>
                        <input className="form-input" placeholder="e.g. Government ITI Kanpur" onChange={e => set('institution', e.target.value)} required />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="form-label">Institution Type</label>
                          <select className="form-input form-select" onChange={e => set('institutionType', e.target.value)} required>
                            <option value="">Select type</option>
                            {INSTITUTION_TYPES.map(t => <option key={t}>{t}</option>)}
                          </select>
                        </div>
                        <div>
                          <label className="form-label">State</label>
                          <select className="form-input form-select" onChange={e => set('state', e.target.value)} required>
                            <option value="">Select state</option>
                            {INDIAN_STATES.map(s => <option key={s}>{s}</option>)}
                          </select>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="form-label">District</label>
                          <input className="form-input" placeholder="e.g. Kanpur Nagar" onChange={e => set('district', e.target.value)} required />
                        </div>
                        <div>
                          <label className="form-label">AICTE / DTE Code</label>
                          <input className="form-input" placeholder="e.g. AICTE-UP-2341" onChange={e => set('aicteCode', e.target.value)} required />
                        </div>
                      </div>
                    </>
                  ) : (
                    <>
                      <div>
                        <label className="form-label">Company Name</label>
                        <input className="form-input" placeholder="e.g. ITC Limited" onChange={e => set('company', e.target.value)} required />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="form-label">Company Email Domain</label>
                          <input className="form-input" placeholder="e.g. itcltd.com" onChange={e => set('domain', e.target.value)} required />
                        </div>
                        <div>
                          <label className="form-label">Industry Sector</label>
                          <select className="form-input form-select" onChange={e => set('sector', e.target.value)} required>
                            <option value="">Select sector</option>
                            {SECTORS.map(s => <option key={s}>{s}</option>)}
                          </select>
                        </div>
                      </div>
                      <div>
                        <label className="form-label">Company Website <span className="text-gray-400 font-normal">(optional)</span></label>
                        <input className="form-input" type="url" placeholder="https://www.yourcompany.com" onChange={e => set('website', e.target.value)} />
                      </div>
                    </>
                  )}

                  <button
                    type="submit"
                    disabled={submitting}
                    className="btn btn-primary w-full mt-2"
                  >
                    {submitting ? (
                      <span className="flex items-center gap-2">
                        <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" className="opacity-25"/><path d="M4 12a8 8 0 018-8" stroke="currentColor" strokeWidth="4" className="opacity-75"/></svg>
                        Submitting...
                      </span>
                    ) : (
                      <><CheckCircle size={16} /> Submit Registration Request</>
                    )}
                  </button>
                </form>
              </div>

              <p className="text-xs text-center text-gray-400 mt-4">
                Your account will be reviewed by the Super Admin. You will receive an email notification upon approval.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
