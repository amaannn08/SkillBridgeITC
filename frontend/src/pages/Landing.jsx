import { useNavigate } from 'react-router-dom';
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { ArrowRight, ArrowUpRight, CheckCircle } from 'lucide-react';
import { MOCK_ANALYTICS } from '../data/mockData';

const { summary } = MOCK_ANALYTICS;

const NAV_BG = {
  background: 'rgba(10, 22, 40, 0.94)',
  backdropFilter: 'blur(16px)',
  WebkitBackdropFilter: 'blur(16px)',
  borderBottom: '1px solid rgba(255,255,255,0.06)',
};

const HERO_BG = {
  background: 'linear-gradient(160deg, #060d1a 0%, #0c1e38 35%, #0f2d56 65%, #1a3f7a 100%)',
};

const STATS = [
  { value: summary.totalInstitutions.toLocaleString('en-IN'), label: 'Institutions' },
  { value: summary.totalCompanies.toLocaleString('en-IN'),    label: 'Industry Partners' },
  { value: summary.totalPlacements.toLocaleString('en-IN'),   label: 'Placements' },
  { value: summary.totalJobPostings.toLocaleString('en-IN'),  label: 'Active Jobs' },
];

const PROCESS = [
  {
    step: '01', role: 'Industry Recruiter',
    color: '#2563EB', bg: 'rgba(37,99,235,0.08)', border: 'rgba(37,99,235,0.2)',
    items: ['Register & get verified by Super Admin','Post job requirements with qualification slots','Review incoming talent pool applications','Shortlist & select students in-portal'],
  },
  {
    step: '02', role: 'Faculty Coordinator',
    color: '#16A34A', bg: 'rgba(22,163,74,0.08)', border: 'rgba(22,163,74,0.2)',
    items: ['Register & get approved by Super Admin','Set up your institution profile','Build talent pool batches with student data','Browse & apply to matching job requirements'],
  },
  {
    step: '03', role: 'Student',
    color: '#7C3AED', bg: 'rgba(124,58,237,0.08)', border: 'rgba(124,58,237,0.2)',
    items: ['Access portal via your coordinator','Build your placement profile','Track application status in real time','Get notified on shortlisting & selection'],
  },
];

const PILLARS = [
  { label: 'Auditable', desc: 'Every action logged with full trail' },
  { label: 'State-Scoped', desc: 'Geography-aware job matching' },
  { label: 'Structured', desc: 'Standardised batch & slot system' },
  { label: 'Real-Time', desc: 'Live status updates end-to-end' },
];

function FadeUp({ children, delay = 0, className = '' }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });
  return (
    <motion.div ref={ref} className={className}
      initial={{ opacity: 0, y: 28 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.55, delay, ease: [0.22, 1, 0.36, 1] }}>
      {children}
    </motion.div>
  );
}

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div style={{ background: '#F8FAFC', fontFamily: 'Inter, sans-serif' }}>

      {/* ── Sticky Nav ── */}
      <nav style={{ ...NAV_BG, position: 'sticky', top: 0, zIndex: 50 }}
        className="px-6 lg:px-16 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div style={{ width: 32, height: 32, borderRadius: 8, background: 'linear-gradient(135deg, #2563EB, #1d4ed8)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 13, color: '#fff', letterSpacing: '-0.5px', flexShrink: 0 }}>SB</div>
          <span style={{ color: '#fff', fontWeight: 700, fontSize: 15, letterSpacing: '-0.3px' }}>SkillBridge</span>
          <span style={{ marginLeft: 4, fontSize: 10, fontWeight: 600, letterSpacing: '0.08em', color: '#60a5fa', background: 'rgba(37,99,235,0.18)', padding: '2px 8px', borderRadius: 99, textTransform: 'uppercase' }}>Gov Portal</span>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => navigate('/admin')}
            style={{ color: 'rgba(255,255,255,0.6)', fontSize: 14, fontWeight: 500, padding: '7px 16px', borderRadius: 8, background: 'transparent', border: 'none', cursor: 'pointer', transition: 'color 0.15s' }}
            onMouseEnter={e => e.currentTarget.style.color = '#fff'}
            onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.6)'}>
            Sign In
          </button>
          <button onClick={() => navigate('/register')}
            style={{ background: '#2563EB', color: '#fff', fontSize: 14, fontWeight: 600, padding: '7px 18px', borderRadius: 8, border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, transition: 'background 0.15s' }}
            onMouseEnter={e => e.currentTarget.style.background = '#1d4ed8'}
            onMouseLeave={e => e.currentTarget.style.background = '#2563EB'}>
            Get Started <ArrowRight size={14} />
          </button>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section style={{ ...HERO_BG, position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, opacity: 0.035, backgroundImage: 'linear-gradient(rgba(255,255,255,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.6) 1px, transparent 1px)', backgroundSize: '48px 48px', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', top: '-20%', right: '-8%', width: 560, height: 560, borderRadius: '50%', background: 'radial-gradient(circle, rgba(37,99,235,0.2) 0%, transparent 70%)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: '-15%', left: '-5%', width: 380, height: 380, borderRadius: '50%', background: 'radial-gradient(circle, rgba(99,102,241,0.14) 0%, transparent 70%)', pointerEvents: 'none' }} />

        <div className="relative max-w-5xl mx-auto px-6 lg:px-16 pt-24 pb-28 text-center">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
            style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(37,99,235,0.15)', border: '1px solid rgba(37,99,235,0.3)', borderRadius: 99, padding: '6px 16px', marginBottom: 28 }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#60a5fa', display: 'inline-block' }} />
            <span style={{ color: '#93c5fd', fontSize: 13, fontWeight: 500 }}>Ministry of Skill Development & Entrepreneurship</span>
          </motion.div>

          <motion.h1 initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            style={{ color: '#fff', fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 'clamp(2.2rem, 5vw, 3.75rem)', fontWeight: 800, lineHeight: 1.1, letterSpacing: '-0.03em', marginBottom: 20 }}>
            India's Placement<br />
            <span style={{ color: '#60a5fa' }}>Coordination</span> Platform
          </motion.h1>

          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }}
            style={{ color: 'rgba(191,219,254,0.85)', fontSize: 17, lineHeight: 1.7, maxWidth: 540, margin: '0 auto 36px' }}>
            Connecting government ITIs, polytechnics, and engineering colleges with industry recruiters — structured, auditable, and state-scoped.
          </motion.p>

          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.3 }}
            style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <button onClick={() => navigate('/register')}
              style={{ background: '#2563EB', color: '#fff', fontWeight: 700, fontSize: 15, padding: '13px 28px', borderRadius: 10, border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8, boxShadow: '0 0 0 1px rgba(37,99,235,0.5), 0 8px 24px rgba(37,99,235,0.35)', transition: 'all 0.18s' }}
              onMouseEnter={e => { e.currentTarget.style.background = '#1d4ed8'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
              onMouseLeave={e => { e.currentTarget.style.background = '#2563EB'; e.currentTarget.style.transform = 'translateY(0)'; }}>
              Register as Coordinator <ArrowRight size={16} />
            </button>
            <button onClick={() => navigate('/register')}
              style={{ background: 'rgba(255,255,255,0.07)', color: '#fff', fontWeight: 600, fontSize: 15, padding: '13px 28px', borderRadius: 10, cursor: 'pointer', border: '1px solid rgba(255,255,255,0.18)', display: 'flex', alignItems: 'center', gap: 8, transition: 'background 0.18s' }}
              onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.13)'}
              onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.07)'}>
              Register as Recruiter
            </button>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.45 }}
            style={{ display: 'flex', justifyContent: 'center', marginTop: 56, flexWrap: 'wrap' }}>
            {STATS.map((s, i) => (
              <div key={i} style={{ padding: '0 28px', borderRight: i < STATS.length - 1 ? '1px solid rgba(255,255,255,0.1)' : 'none', textAlign: 'center' }}>
                <p style={{ color: '#fff', fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 28, fontWeight: 800, letterSpacing: '-0.03em', lineHeight: 1 }}>{s.value}</p>
                <p style={{ color: 'rgba(147,197,253,0.65)', fontSize: 11, fontWeight: 600, marginTop: 6, letterSpacing: '0.06em', textTransform: 'uppercase' }}>{s.label}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── Pillars strip ── */}
      <section style={{ background: '#fff', borderBottom: '1px solid #E2E8F0' }}>
        <div className="max-w-5xl mx-auto px-6 lg:px-16 py-5 flex flex-wrap justify-center">
          {PILLARS.map((p, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 9, padding: '8px 24px', borderRight: i < PILLARS.length - 1 ? '1px solid #E2E8F0' : 'none' }}>
              <CheckCircle size={14} style={{ color: '#2563EB', flexShrink: 0 }} />
              <span style={{ fontSize: 13, fontWeight: 700, color: '#0F172A' }}>{p.label}</span>
              <span style={{ fontSize: 12, color: '#94A3B8' }}>{p.desc}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ── How it works ── */}
      <section style={{ background: '#F8FAFC', padding: '96px 0' }}>
        <div className="max-w-5xl mx-auto px-6 lg:px-16">
          <FadeUp>
            <div style={{ marginBottom: 52 }}>
              <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#2563EB', marginBottom: 12 }}>How It Works</p>
              <h2 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 'clamp(1.75rem, 3vw, 2.5rem)', fontWeight: 800, color: '#0F172A', letterSpacing: '-0.03em', lineHeight: 1.15 }}>Three roles. One platform.</h2>
              <p style={{ color: '#64748B', fontSize: 16, marginTop: 10, maxWidth: 460, lineHeight: 1.65 }}>Each stakeholder has a dedicated workflow — no overlap, no confusion.</p>
            </div>
          </FadeUp>

          <div className="grid md:grid-cols-3 gap-5">
            {PROCESS.map((p, i) => (
              <FadeUp key={i} delay={i * 0.1}>
                <div style={{ background: '#fff', border: `1px solid ${p.border}`, borderRadius: 16, padding: 28, height: '100%', transition: 'box-shadow 0.2s, transform 0.2s' }}
                  onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 12px 40px rgba(0,0,0,0.08)'; e.currentTarget.style.transform = 'translateY(-3px)'; }}
                  onMouseLeave={e => { e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.transform = 'translateY(0)'; }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 }}>
                    <span style={{ fontSize: 11, fontWeight: 800, letterSpacing: '0.1em', color: p.color, background: p.bg, padding: '4px 10px', borderRadius: 6 }}>STEP {p.step}</span>
                    <ArrowUpRight size={15} style={{ color: p.color, opacity: 0.5 }} />
                  </div>
                  <h3 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 16, fontWeight: 700, color: '#0F172A', marginBottom: 16, letterSpacing: '-0.02em' }}>{p.role}</h3>
                  <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 10 }}>
                    {p.items.map((item, j) => (
                      <li key={j} style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                        <span style={{ width: 18, height: 18, borderRadius: '50%', background: p.bg, border: `1px solid ${p.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 700, color: p.color, flexShrink: 0, marginTop: 1 }}>{j + 1}</span>
                        <span style={{ fontSize: 13, color: '#475569', lineHeight: 1.55 }}>{item}</span>
                      </li>
                    ))}
                  </ul>
                  <button onClick={() => navigate('/register')}
                    style={{ marginTop: 22, width: '100%', padding: '10px 0', background: p.bg, border: `1px solid ${p.border}`, borderRadius: 8, color: p.color, fontSize: 13, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, transition: 'opacity 0.15s' }}
                    onMouseEnter={e => e.currentTarget.style.opacity = '0.7'}
                    onMouseLeave={e => e.currentTarget.style.opacity = '1'}>
                    Get Started <ArrowRight size={13} />
                  </button>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA Banner ── */}
      <FadeUp>
        <section style={{ padding: '0 24px 96px' }}>
          <div className="max-w-3xl mx-auto" style={{ background: 'linear-gradient(135deg, #0c1e38 0%, #1a3f7a 100%)', borderRadius: 20, padding: '56px 48px', textAlign: 'center', boxShadow: '0 24px 64px rgba(10,22,40,0.18)', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: -60, right: -60, width: 240, height: 240, borderRadius: '50%', background: 'radial-gradient(circle, rgba(37,99,235,0.25) 0%, transparent 70%)', pointerEvents: 'none' }} />
            <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#60a5fa', marginBottom: 14 }}>Ready to get started?</p>
            <h2 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 'clamp(1.5rem, 3vw, 2.25rem)', fontWeight: 800, color: '#fff', letterSpacing: '-0.03em', lineHeight: 1.2, marginBottom: 14 }}>Digitise your placement process today</h2>
            <p style={{ color: 'rgba(191,219,254,0.7)', fontSize: 15, lineHeight: 1.65, marginBottom: 32, maxWidth: 420, margin: '0 auto 32px' }}>
              Join 847+ institutions and 312 industry partners already on the platform.
            </p>
            <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
              <button onClick={() => navigate('/register')}
                style={{ background: '#2563EB', color: '#fff', fontWeight: 700, fontSize: 15, padding: '12px 28px', borderRadius: 10, border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8, boxShadow: '0 4px 16px rgba(37,99,235,0.4)', transition: 'all 0.18s' }}
                onMouseEnter={e => { e.currentTarget.style.background = '#1d4ed8'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
                onMouseLeave={e => { e.currentTarget.style.background = '#2563EB'; e.currentTarget.style.transform = 'translateY(0)'; }}>
                Register Now <ArrowRight size={15} />
              </button>
              <button onClick={() => navigate('/admin')}
                style={{ background: 'rgba(255,255,255,0.08)', color: '#fff', fontWeight: 600, fontSize: 15, padding: '12px 28px', borderRadius: 10, cursor: 'pointer', border: '1px solid rgba(255,255,255,0.15)', transition: 'background 0.15s' }}
                onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.14)'}
                onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.08)'}>
                Sign In
              </button>
            </div>
          </div>
        </section>
      </FadeUp>

      {/* ── Footer ── */}
      <footer style={{ background: '#0a1628', borderTop: '1px solid rgba(255,255,255,0.06)', padding: '28px 24px' }}>
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 28, height: 28, borderRadius: 7, background: 'linear-gradient(135deg, #2563EB, #1d4ed8)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 11, color: '#fff' }}>SB</div>
            <span style={{ color: 'rgba(255,255,255,0.75)', fontWeight: 600, fontSize: 14 }}>SkillBridge</span>
          </div>
          <p style={{ color: 'rgba(255,255,255,0.28)', fontSize: 12, textAlign: 'center' }}>
            © 2024 Ministry of Skill Development & Entrepreneurship, Government of India · v1.0 MVP
          </p>
        </div>
      </footer>
    </div>
  );
}
