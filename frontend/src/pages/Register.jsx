import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Building2, Briefcase, GraduationCap, ArrowLeft, CheckCircle,
  ArrowRight, MapPin, ChevronRight,
} from 'lucide-react';
import { INDIAN_STATES, INSTITUTION_TYPES, SECTORS } from '../data/mockData';

const ROLES = [
  {
    key:   'coordinator',
    icon:  Building2,
    emoji: '🎓',
    title: 'Faculty Coordinator',
    desc:  'Government ITI, Polytechnic, or Engineering College placement officer managing student talent pools',
    color: '#16A34A',
    bg:    'linear-gradient(135deg, #14532D 0%, #166534 100%)',
    accent:'#22c55e',
    tag:   'Institution',
  },
  {
    key:   'recruiter',
    icon:  Briefcase,
    emoji: '🏭',
    title: 'Industry Recruiter',
    desc:  'Company HR or hiring manager posting job requirements and discovering local skilled talent',
    color: '#2563EB',
    bg:    'linear-gradient(135deg, #1E3A8A 0%, #1D4ED8 100%)',
    accent:'#60a5fa',
    tag:   'Industry',
  },
  {
    key:   'student',
    icon:  GraduationCap,
    emoji: '👨‍🎓',
    title: 'Student',
    desc:  'ITI or polytechnic student looking for placement opportunities in Medak district industries',
    color: '#9333EA',
    bg:    'linear-gradient(135deg, #581C87 0%, #7E22CE 100%)',
    accent:'#c084fc',
    tag:   'Student',
  },
];

const STEPS = ['Choose Role', 'Your Details', 'Confirmation'];

function StepIndicator({ step }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0, marginBottom: 36 }}>
      {STEPS.map((label, i) => {
        const num = i + 1;
        const done = step > num;
        const active = step === num;
        return (
          <div key={i} style={{ display: 'flex', alignItems: 'center' }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
              <div style={{
                width: 32, height: 32, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontWeight: 700, fontSize: 13, transition: 'all 0.2s',
                background: done ? '#F97316' : active ? '#0F2444' : '#E2E8F0',
                color: done || active ? '#fff' : '#94A3B8',
                boxShadow: active ? '0 0 0 4px rgba(15,36,68,0.15)' : done ? '0 0 0 4px rgba(249,115,22,0.15)' : 'none',
              }}>
                {done ? <CheckCircle size={14} /> : num}
              </div>
              <span style={{ fontSize: 10, fontWeight: 600, color: active ? '#0F2444' : done ? '#F97316' : '#94A3B8', whiteSpace: 'nowrap' }}>{label}</span>
            </div>
            {i < STEPS.length - 1 && (
              <div style={{ width: 60, height: 2, background: step > num + 1 ? '#F97316' : step > num ? '#0F2444' : '#E2E8F0', margin: '0 8px', marginBottom: 20, transition: 'background 0.3s' }} />
            )}
          </div>
        );
      })}
    </div>
  );
}

export default function Register() {
  const navigate = useNavigate();
  const [step, setStep]           = useState(1);
  const [role, setRole]           = useState(null);
  const [form, setForm]           = useState({});
  const [submitting, setSubmitting] = useState(false);

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitting(true);
    setTimeout(() => navigate('/pending'), 1200);
  };

  const selectedRole = ROLES.find(r => r.key === role);

  return (
    <div style={{ minHeight: '100vh', background: '#F8FAFC', fontFamily: 'Inter, sans-serif' }}>

      {/* Nav */}
      <nav style={{ background: 'linear-gradient(135deg, #060d1a 0%, #0F2444 100%)', padding: '14px 24px', display: 'flex', alignItems: 'center', gap: 12 }}>
        <button onClick={() => navigate('/')} style={{ background: 'none', border: 'none', color: 'rgba(148,163,184,1)', cursor: 'pointer', display: 'flex', padding: 4, borderRadius: 6 }}>
          <ArrowLeft size={18} />
        </button>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ width: 30, height: 30, borderRadius: 8, background: 'linear-gradient(135deg, #F97316, #EA580C)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, color: '#fff', fontSize: 13 }}>M</div>
          <div>
            <p style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 800, fontSize: 15, color: '#fff', lineHeight: 1 }}>MESIC</p>
            <p style={{ fontSize: 9, color: 'rgba(251,146,60,0.7)', fontWeight: 600, letterSpacing: '0.06em', display: 'flex', alignItems: 'center', gap: 3 }}>
              <MapPin size={8} /> Medak District Portal
            </p>
          </div>
        </div>
      </nav>

      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'center', padding: '48px 24px', minHeight: 'calc(100vh - 58px)' }}>
        <div style={{ width: '100%', maxWidth: step === 1 ? 820 : 520 }}>
          <StepIndicator step={step} />

          <AnimatePresence mode="wait">

            {/* ── Step 1: Role selector ── */}
            {step === 1 && (
              <motion.div key="step1" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }} transition={{ duration: 0.3 }}>
                <div style={{ textAlign: 'center', marginBottom: 32 }}>
                  <h1 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 800, fontSize: 28, color: '#0F172A', letterSpacing: '-0.03em', marginBottom: 8 }}>
                    Join MESIC Platform
                  </h1>
                  <p style={{ color: '#64748B', fontSize: 15 }}>Select your role to begin registration</p>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
                  {ROLES.map((opt, i) => (
                    <motion.button
                      key={opt.key}
                      initial={{ opacity: 0, y: 24 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.08 }}
                      onClick={() => { setRole(opt.key); setStep(2); }}
                      style={{
                        textAlign: 'left', cursor: 'pointer', border: 'none', padding: 0,
                        borderRadius: 20, overflow: 'hidden',
                        boxShadow: '0 4px 24px rgba(0,0,0,0.1)',
                        transition: 'transform 0.2s, box-shadow 0.2s',
                      }}
                      onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 12px 36px rgba(0,0,0,0.18)'; }}
                      onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = '0 4px 24px rgba(0,0,0,0.1)'; }}
                    >
                      {/* Card top — gradient */}
                      <div style={{ background: opt.bg, padding: '28px 24px 20px', position: 'relative', overflow: 'hidden' }}>
                        {/* Orb */}
                        <div style={{ position: 'absolute', top: -20, right: -20, width: 100, height: 100, borderRadius: '50%', background: `radial-gradient(circle, ${opt.accent}30 0%, transparent 70%)`, pointerEvents: 'none' }} />
                        <div style={{ width: 52, height: 52, borderRadius: 14, background: 'rgba(255,255,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 14, backdropFilter: 'blur(4px)' }}>
                          <opt.icon size={26} color="#fff" />
                        </div>
                        <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', background: 'rgba(255,255,255,0.15)', color: opt.accent, borderRadius: 99, padding: '3px 10px', border: `1px solid ${opt.accent}40` }}>
                          {opt.tag}
                        </span>
                        <h3 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 800, fontSize: 18, color: '#fff', marginTop: 10, lineHeight: 1.1, marginBottom: 8 }}>{opt.title}</h3>
                      </div>

                      {/* Card bottom — description */}
                      <div style={{ background: '#fff', padding: '16px 24px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
                        <p style={{ fontSize: 13, color: '#475569', lineHeight: 1.5, flex: 1 }}>{opt.desc}</p>
                        <div style={{ width: 32, height: 32, borderRadius: 8, background: '#F1F5F9', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                          <ChevronRight size={16} color={opt.color} />
                        </div>
                      </div>
                    </motion.button>
                  ))}
                </div>

                <p style={{ textAlign: 'center', fontSize: 13, color: '#94A3B8', marginTop: 28 }}>
                  Already registered?{' '}
                  <button onClick={() => navigate('/login')} style={{ color: '#F97316', fontWeight: 600, background: 'none', border: 'none', cursor: 'pointer', fontSize: 13 }}>Sign In</button>
                </p>
              </motion.div>
            )}

            {/* ── Step 2: Form ── */}
            {step === 2 && (
              <motion.div key="step2" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }} transition={{ duration: 0.3 }}>
                <button onClick={() => setStep(1)} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: '#64748B', background: 'none', border: 'none', cursor: 'pointer', marginBottom: 20, fontWeight: 500 }}>
                  <ArrowLeft size={14} /> Back to role selection
                </button>

                {/* Role badge */}
                {selectedRole && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20, background: '#fff', border: '1px solid #E2E8F0', borderRadius: 14, padding: '12px 16px' }}>
                    <div style={{ width: 38, height: 38, borderRadius: 10, background: selectedRole.bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <selectedRole.icon size={18} color="#fff" />
                    </div>
                    <div>
                      <p style={{ fontWeight: 700, fontSize: 14, color: '#0F172A' }}>{selectedRole.title} Registration</p>
                      <p style={{ fontSize: 12, color: '#94A3B8' }}>Fill in your details · Medak District</p>
                    </div>
                  </div>
                )}

                <div style={{ background: '#fff', border: '1px solid #E2E8F0', borderRadius: 20, padding: '28px 28px' }}>
                  <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

                    {/* Common fields */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                      <div>
                        <label className="form-label">Full Name</label>
                        <input className="form-input" placeholder="As per Aadhaar" onChange={e => set('name', e.target.value)} required />
                      </div>
                      <div>
                        <label className="form-label">Designation</label>
                        <input className="form-input" placeholder="e.g. Placement Officer" onChange={e => set('designation', e.target.value)} required />
                      </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                      <div>
                        <label className="form-label">Official Email</label>
                        <input className="form-input" type="email" placeholder="you@institution.gov.in" onChange={e => set('email', e.target.value)} required />
                      </div>
                      <div>
                        <label className="form-label">Phone Number</label>
                        <input className="form-input" type="tel" placeholder="+91 XXXXX XXXXX" onChange={e => set('phone', e.target.value)} required />
                      </div>
                    </div>

                    {/* Coordinator-specific */}
                    {role === 'coordinator' && (
                      <>
                        <div>
                          <label className="form-label">Institution Name</label>
                          <input className="form-input" placeholder="e.g. Govt. ITI Medak" onChange={e => set('institution', e.target.value)} required />
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                          <div>
                            <label className="form-label">Institution Type</label>
                            <select className="form-input form-select" onChange={e => set('institutionType', e.target.value)} required>
                              <option value="">Select type</option>
                              {INSTITUTION_TYPES.map(t => <option key={t}>{t}</option>)}
                            </select>
                          </div>
                          <div>
                            <label className="form-label">District</label>
                            <input className="form-input" placeholder="e.g. Medak" defaultValue="Medak" onChange={e => set('district', e.target.value)} required />
                          </div>
                        </div>
                        <div>
                          <label className="form-label">AICTE / DTE Code</label>
                          <input className="form-input" placeholder="e.g. AICTE-TG-2341" onChange={e => set('aicteCode', e.target.value)} required />
                        </div>
                      </>
                    )}

                    {/* Recruiter-specific */}
                    {role === 'recruiter' && (
                      <>
                        <div>
                          <label className="form-label">Company Name</label>
                          <input className="form-input" placeholder="e.g. ITC Limited" onChange={e => set('company', e.target.value)} required />
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
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
                          <label className="form-label">Company Website <span style={{ color: '#94A3B8', fontWeight: 400 }}>(optional)</span></label>
                          <input className="form-input" type="url" placeholder="https://www.yourcompany.com" onChange={e => set('website', e.target.value)} />
                        </div>
                      </>
                    )}

                    {/* Student-specific */}
                    {role === 'student' && (
                      <>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                          <div>
                            <label className="form-label">Roll Number</label>
                            <input className="form-input" placeholder="e.g. ITI-2024-001" onChange={e => set('roll', e.target.value)} required />
                          </div>
                          <div>
                            <label className="form-label">Trade / Branch</label>
                            <input className="form-input" placeholder="e.g. Electrician, Fitter" onChange={e => set('branch', e.target.value)} required />
                          </div>
                        </div>
                        <div>
                          <label className="form-label">Institution Name</label>
                          <input className="form-input" placeholder="e.g. Govt. ITI Medak" onChange={e => set('institution', e.target.value)} required />
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                          <div>
                            <label className="form-label">Qualification</label>
                            <select className="form-input form-select" onChange={e => set('qualification', e.target.value)} required>
                              <option value="">Select</option>
                              {['ITI', 'Diploma', 'B.Tech', 'B.Sc'].map(q => <option key={q}>{q}</option>)}
                            </select>
                          </div>
                          <div>
                            <label className="form-label">Passing Year</label>
                            <select className="form-input form-select" onChange={e => set('year', e.target.value)} required>
                              <option value="">Select year</option>
                              {[2025, 2024, 2023, 2022].map(y => <option key={y}>{y}</option>)}
                            </select>
                          </div>
                        </div>
                      </>
                    )}

                    <button type="submit" disabled={submitting}
                      style={{ background: submitting ? '#94A3B8' : 'linear-gradient(135deg, #F97316 0%, #EA580C 100%)', color: '#fff', fontWeight: 700, fontSize: 15, padding: '13px 0', borderRadius: 12, border: 'none', cursor: submitting ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginTop: 4, boxShadow: submitting ? 'none' : '0 4px 16px rgba(249,115,22,0.35)', transition: 'all 0.18s' }}>
                      {submitting ? (
                        <><svg className="animate-spin" width="16" height="16" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" opacity=".25"/><path d="M4 12a8 8 0 018-8" stroke="currentColor" strokeWidth="4" opacity=".75"/></svg> Submitting...</>
                      ) : (
                        <>Submit Registration <ArrowRight size={15} /></>
                      )}
                    </button>
                  </form>
                </div>

                <p style={{ textAlign: 'center', fontSize: 12, color: '#94A3B8', marginTop: 16 }}>
                  Your request will be reviewed by the District Collector office. You will receive an email upon approval.
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
