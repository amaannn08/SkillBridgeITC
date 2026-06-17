import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Building2, Briefcase, GraduationCap } from 'lucide-react';

const ROLE_PILLS = [
  { icon: Building2, label: 'Coordinator', color: '#16A34A', bg: 'rgba(22,163,74,0.18)', border: 'rgba(22,163,74,0.3)' },
  { icon: Briefcase,  label: 'Recruiter',  color: '#60a5fa', bg: 'rgba(96,165,250,0.18)', border: 'rgba(96,165,250,0.3)' },
  { icon: GraduationCap, label: 'Student', color: '#FB923C', bg: 'rgba(251,146,60,0.18)', border: 'rgba(251,146,60,0.3)' },
];

export default function LandingHero({ stats }) {
  const navigate = useNavigate();

  return (
    <section style={{ position: 'relative', minHeight: '92vh', display: 'flex', alignItems: 'center', overflow: 'hidden' }}>

      {/* Background photo */}
      <div style={{
        position: 'absolute', inset: 0,
        backgroundImage: 'url(/hero-students.png)',
        backgroundSize: 'cover', backgroundPosition: 'center 30%',
        backgroundRepeat: 'no-repeat',
      }} />

      {/* Dark gradient overlay */}
      <div className="hero-photo-overlay" />

      {/* Decorative orbs */}
      <div style={{ position: 'absolute', top: '10%', right: '5%', width: 480, height: 480, borderRadius: '50%', background: 'radial-gradient(circle, rgba(249,115,22,0.12) 0%, transparent 70%)', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', bottom: '5%', left: '2%', width: 320, height: 320, borderRadius: '50%', background: 'radial-gradient(circle, rgba(37,99,235,0.14) 0%, transparent 70%)', pointerEvents: 'none' }} />

// Content
      <div className="relative max-w-5xl mx-auto px-6 lg:px-20 py-24 w-full">

        {/* District badge */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
          style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(249,115,22,0.15)', border: '1px solid rgba(249,115,22,0.35)', borderRadius: 99, padding: '6px 18px', marginBottom: 28 }}>
          <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#F97316', display: 'inline-block', boxShadow: '0 0 8px #F97316' }} />
          <span style={{ color: '#FB923C', fontSize: 12, fontWeight: 600, letterSpacing: '0.06em' }}>
            MEDAK DISTRICT EMPLOYMENT, SKILL &amp; INDUSTRY CONNECT
          </span>
        </motion.div>

        {/* Main headline */}
        <motion.h1 initial={{ opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.65, delay: 0.12, ease: [0.22, 1, 0.36, 1] }}
          style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 'clamp(2.4rem, 5.5vw, 4rem)', fontWeight: 800, color: '#fff', lineHeight: 1.08, letterSpacing: '-0.035em', marginBottom: 22 }}>
          Local Talent for<br />
          <span style={{ color: '#F97316' }}>Local Industry</span>
        </motion.h1>

        {/* Sub taglines */}
        <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.22 }}
          style={{ color: 'rgba(186,215,255,0.82)', fontSize: 'clamp(1rem, 2vw, 1.125rem)', lineHeight: 1.72, maxWidth: 520, marginBottom: 36 }}>
          Connecting government ITIs, polytechnics &amp; engineering colleges of Medak district with industry recruiters — structured, auditable &amp; transparent.
        </motion.p>

        {/* Role pills */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.3 }}
          style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 36 }}>
          {ROLE_PILLS.map((r, i) => (
            <span key={i} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: r.bg, border: `1px solid ${r.border}`, borderRadius: 99, padding: '6px 14px', color: r.color, fontSize: 12, fontWeight: 600 }}>
              <r.icon size={13} /> {r.label}
            </span>
          ))}
        </motion.div>

        {/* CTA buttons */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.38 }}
          className="hero-cta-row" style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          <button onClick={() => navigate('/register')}
            style={{ background: 'linear-gradient(135deg, #F97316 0%, #EA580C 100%)', color: '#fff', fontWeight: 700, fontSize: 15, padding: '13px 30px', borderRadius: 11, border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8, boxShadow: '0 0 0 1px rgba(249,115,22,0.5), 0 8px 28px rgba(249,115,22,0.38)', transition: 'all 0.18s' }}
            onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 12px 36px rgba(249,115,22,0.48)'; }}
            onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 8px 28px rgba(249,115,22,0.38)'; }}>
            Get Started <ArrowRight size={16} />
          </button>
          <button onClick={() => navigate('/login')}
            style={{ background: 'rgba(255,255,255,0.08)', color: '#fff', fontWeight: 600, fontSize: 15, padding: '13px 30px', borderRadius: 11, cursor: 'pointer', border: '1px solid rgba(255,255,255,0.18)', display: 'flex', alignItems: 'center', gap: 8, transition: 'background 0.18s' }}
            onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.14)'}
            onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.08)'}>
            Sign In to Portal
          </button>
        </motion.div>

        {/* Stats row */}
        {stats && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.5 }}
            className="hero-stats-row" style={{ display: 'flex', marginTop: 60, flexWrap: 'wrap', gap: 0, borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: 32 }}>
            {stats.map((s, i) => (
              <div key={i} style={{ padding: '0 28px', borderRight: i < stats.length - 1 ? '1px solid rgba(255,255,255,0.1)' : 'none', textAlign: 'center', minWidth: 100 }}>
                <p style={{ color: '#fff', fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 'clamp(1.5rem, 3vw, 2rem)', fontWeight: 800, letterSpacing: '-0.03em', lineHeight: 1 }}>{s.value}</p>
                <p style={{ color: 'rgba(251,146,60,0.7)', fontSize: 10, fontWeight: 700, marginTop: 6, letterSpacing: '0.08em', textTransform: 'uppercase' }}>{s.label}</p>
              </div>
            ))}
          </motion.div>
        )}
      </div>
    </section>
  );
}
