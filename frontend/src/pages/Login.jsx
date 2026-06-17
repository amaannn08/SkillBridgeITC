import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Eye, EyeOff, ArrowRight, MapPin, AlertCircle } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { MOCK_USERS } from '../data/mockData';

// Mock credentials mapped to user IDs
const CREDENTIALS = [
  { email: 'admin@mesic.gov.in',       password: 'admin123',  userId: MOCK_USERS.find(u => u.role === 'super_admin')?._id,  label: 'Collector / Admin',    role: 'super_admin'  },
  { email: 'coordinator@mesic.gov.in', password: 'coord123',  userId: MOCK_USERS.find(u => u.role === 'coordinator')?._id,  label: 'Faculty Coordinator',  role: 'coordinator'  },
  { email: 'recruiter@itcltd.com',     password: 'rec123',    userId: MOCK_USERS.find(u => u.role === 'recruiter')?._id,    label: 'Industry Recruiter',   role: 'recruiter'    },
  { email: 'student@mesic.gov.in',     password: 'student123',userId: MOCK_USERS.find(u => u.role === 'student')?._id,      label: 'Student',              role: 'student'      },
];

const ROLE_ROUTES = {
  super_admin: '/admin',
  coordinator: '/coordinator',
  recruiter:   '/recruiter',
  student:     '/student',
};

export default function Login() {
  const navigate = useNavigate();
  const { switchUser } = useApp();

  const [email, setEmail]         = useState('');
  const [password, setPassword]   = useState('');
  const [showPass, setShowPass]   = useState(false);
  const [error, setError]         = useState('');
  const [loading, setLoading]     = useState(false);

  const handleLogin = (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    setTimeout(() => {
      const match = CREDENTIALS.find(
        c => c.email.toLowerCase() === email.toLowerCase().trim() && c.password === password
      );

      if (!match || !match.userId) {
        setError('Invalid email or password. Check the demo credentials below.');
        setLoading(false);
        return;
      }

      switchUser(match.userId);
      navigate(ROLE_ROUTES[match.role]);
    }, 800);
  };

  const quickFill = (cred) => {
    setEmail(cred.email);
    setPassword(cred.password);
    setError('');
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', fontFamily: 'Inter, sans-serif' }}>

      {/* ── Left panel — branding ── */}
      <div style={{
        flex: '0 0 45%', position: 'relative', overflow: 'hidden',
        background: 'linear-gradient(160deg, #060d1a 0%, #0c1e38 40%, #0f2d56 70%, #1a3f7a 100%)',
        display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
        padding: '48px 52px',
      }} className="hidden lg:flex">

        {/* Background image overlay */}
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'url(/hero-students.png)', backgroundSize: 'cover', backgroundPosition: 'center', opacity: 0.18 }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(160deg, rgba(6,13,26,0.95) 0%, rgba(15,36,68,0.85) 60%, rgba(26,63,122,0.7) 100%)' }} />

        {/* Orbs */}
        <div style={{ position: 'absolute', top: '15%', right: '-10%', width: 380, height: 380, borderRadius: '50%', background: 'radial-gradient(circle, rgba(249,115,22,0.15) 0%, transparent 70%)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: '10%', left: '-5%', width: 280, height: 280, borderRadius: '50%', background: 'radial-gradient(circle, rgba(37,99,235,0.18) 0%, transparent 70%)', pointerEvents: 'none' }} />

        {/* Logo */}
        <div style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 42, height: 42, borderRadius: 12, background: 'linear-gradient(135deg, #F97316 0%, #EA580C 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, color: '#fff', fontSize: 16, boxShadow: '0 4px 16px rgba(249,115,22,0.4)' }}>M</div>
          <div>
            <p style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 800, fontSize: 20, color: '#fff', letterSpacing: '-0.03em', lineHeight: 1 }}>MESIC</p>
            <p style={{ fontSize: 10, color: 'rgba(251,146,60,0.75)', fontWeight: 600, letterSpacing: '0.06em', display: 'flex', alignItems: 'center', gap: 4 }}>
              <MapPin size={9} /> Medak District Initiative
            </p>
          </div>
        </div>

        {/* Center text */}
        <div style={{ position: 'relative' }}>
          <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#F97316', marginBottom: 14 }}>District Portal</p>
          <h2 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 'clamp(1.8rem, 2.5vw, 2.6rem)', fontWeight: 800, color: '#fff', letterSpacing: '-0.035em', lineHeight: 1.12, marginBottom: 16 }}>
            Local Talent for<br /><span style={{ color: '#F97316' }}>Local Industry</span>
          </h2>
          <p style={{ color: 'rgba(186,215,255,0.65)', fontSize: 14, lineHeight: 1.7, maxWidth: 340 }}>
            Medak District Employment, Skill & Industry Connect — a government-backed placement portal for ITIs, polytechnics, and industry.
          </p>
        </div>

        {/* Bottom badge */}
        <div style={{ position: 'relative', display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 99, padding: '8px 16px', width: 'fit-content' }}>
          <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#22c55e', boxShadow: '0 0 8px #22c55e', display: 'inline-block' }} />
          <span style={{ color: 'rgba(255,255,255,0.55)', fontSize: 12, fontWeight: 500 }}>Secure Government Portal · v1.0</span>
        </div>
      </div>

      {/* ── Right panel — form ── */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#F8FAFC', padding: '40px 24px' }}>
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          style={{ width: '100%', maxWidth: 420 }}>

          {/* Mobile logo */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 36 }} className="lg:hidden">
            <div style={{ width: 36, height: 36, borderRadius: 10, background: 'linear-gradient(135deg, #F97316 0%, #EA580C 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, color: '#fff', fontSize: 14 }}>M</div>
            <span style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 800, fontSize: 18, color: '#0F172A' }}>MESIC</span>
          </div>

          <h1 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 800, fontSize: 26, color: '#0F172A', letterSpacing: '-0.03em', marginBottom: 6 }}>Welcome back</h1>
          <p style={{ color: '#64748B', fontSize: 14, marginBottom: 32 }}>Sign in to your MESIC portal account</p>

          {/* Form */}
          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>

            <div>
              <label className="form-label">Email Address</label>
              <input
                className="form-input"
                type="email"
                placeholder="you@mesic.gov.in"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                autoComplete="email"
              />
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                <label className="form-label" style={{ marginBottom: '0 !important' }}>Password</label>
              </div>
              <div style={{ position: 'relative' }}>
                <input
                  className="form-input"
                  type={showPass ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                  style={{ paddingRight: 44 }}
                />
                <button type="button" onClick={() => setShowPass(v => !v)}
                  style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#94A3B8', padding: 4 }}>
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Error */}
            {error && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: 10, padding: '10px 14px' }}>
                <AlertCircle size={15} style={{ color: '#DC2626', flexShrink: 0 }} />
                <span style={{ fontSize: 13, color: '#B91C1C' }}>{error}</span>
              </div>
            )}

            <button type="submit" disabled={loading}
              style={{ background: loading ? '#94A3B8' : 'linear-gradient(135deg, #F97316 0%, #EA580C 100%)', color: '#fff', fontWeight: 700, fontSize: 15, padding: '13px 0', borderRadius: 10, border: 'none', cursor: loading ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, transition: 'all 0.18s', boxShadow: loading ? 'none' : '0 4px 16px rgba(249,115,22,0.35)' }}>
              {loading ? (
                <><svg className="animate-spin" width="16" height="16" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" opacity=".25"/><path d="M4 12a8 8 0 018-8" stroke="currentColor" strokeWidth="4" opacity=".75"/></svg> Signing in...</>
              ) : (
                <>Sign In <ArrowRight size={15} /></>
              )}
            </button>
          </form>

          {/* Demo credentials */}
          <div style={{ marginTop: 32, background: '#fff', border: '1px solid #E2E8F0', borderRadius: 14, padding: '16px 18px' }}>
            <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#94A3B8', marginBottom: 12 }}>Demo Credentials — click to fill</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {CREDENTIALS.map((c, i) => (
                <button key={i} type="button" onClick={() => quickFill(c)}
                  style={{ textAlign: 'left', background: 'transparent', border: '1px solid #F1F5F9', borderRadius: 9, padding: '9px 12px', cursor: 'pointer', transition: 'all 0.15s', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                  onMouseEnter={e => { e.currentTarget.style.background = '#F8FAFC'; e.currentTarget.style.borderColor = '#E2E8F0'; }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderColor = '#F1F5F9'; }}>
                  <div>
                    <p style={{ fontSize: 12, fontWeight: 600, color: '#0F172A' }}>{c.label}</p>
                    <p style={{ fontSize: 11, color: '#94A3B8', marginTop: 1 }}>{c.email}</p>
                  </div>
                  <span style={{ fontSize: 11, color: '#CBD5E1', fontFamily: 'monospace' }}>{c.password}</span>
                </button>
              ))}
            </div>
          </div>

          <p style={{ textAlign: 'center', fontSize: 13, color: '#94A3B8', marginTop: 24 }}>
            New here?{' '}
            <button onClick={() => navigate('/register')} style={{ color: '#F97316', fontWeight: 600, background: 'none', border: 'none', cursor: 'pointer', fontSize: 13 }}>Register your institution</button>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
