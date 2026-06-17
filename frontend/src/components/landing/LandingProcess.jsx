import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { ArrowRight, ShieldCheck, Building2, Briefcase } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ROLES = [
  {
    step: '01', Icon: ShieldCheck, role: 'District Collector',
    subtitle: 'Super Admin',
    color: '#2563EB', bg: 'rgba(37,99,235,0.07)', border: 'rgba(37,99,235,0.18)',
    iconBg: 'rgba(37,99,235,0.12)',
    items: [
      'Oversee all registrations & approvals',
      'Monitor district-level footfall & placements',
      'Map institutions to HOD coordinators',
      'Generate audit trail reports',
    ],
  },
  {
    step: '02', Icon: Building2, role: 'Faculty Coordinator',
    subtitle: 'Institution',
    color: '#16A34A', bg: 'rgba(22,163,74,0.07)', border: 'rgba(22,163,74,0.18)',
    iconBg: 'rgba(22,163,74,0.12)',
    items: [
      'Register & get approved by Collector',
      'Set up institution profile & branches',
      'Build talent pool batches with student data',
      'Apply to matching job requirements',
    ],
  },
  {
    step: '03', Icon: Briefcase, role: 'Industry Recruiter',
    subtitle: 'Company',
    color: '#F97316', bg: 'rgba(249,115,22,0.07)', border: 'rgba(249,115,22,0.18)',
    iconBg: 'rgba(249,115,22,0.12)',
    items: [
      'Register & get verified by Collector',
      'Post job requirements with qualification slots',
      'Review talent pool & shortlist candidates',
      'Bulk upload student files & select talent',
    ],
  },
];

function FadeUp({ children, delay = 0 }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });
  return (
    <motion.div ref={ref}
      initial={{ opacity: 0, y: 28 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.55, delay, ease: [0.22, 1, 0.36, 1] }}>
      {children}
    </motion.div>
  );
}

export default function LandingProcess() {
  const navigate = useNavigate();

  return (
    <section style={{ background: '#F8FAFC', padding: '96px 0' }}>
      <div className="max-w-5xl mx-auto px-6 lg:px-20">

        <FadeUp>
          <div style={{ marginBottom: 56 }}>
            <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#F97316', marginBottom: 10, display: 'block' }}>
              How It Works
            </span>
            <h2 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 'clamp(1.75rem, 3vw, 2.5rem)', fontWeight: 800, color: '#0F172A', letterSpacing: '-0.03em', lineHeight: 1.15, marginBottom: 10 }}>
              Three roles. One platform.
            </h2>
            <p style={{ color: '#64748B', fontSize: 16, maxWidth: 460, lineHeight: 1.65 }}>
              From Collector to Coordinator to Recruiter — each stakeholder has a focused, purpose-built workflow.
            </p>
          </div>
        </FadeUp>

        <div className="grid md:grid-cols-3 gap-5">
          {ROLES.map((r, i) => (
            <FadeUp key={i} delay={i * 0.1}>
              <div style={{ background: '#fff', border: `1.5px solid ${r.border}`, borderRadius: 18, padding: 28, height: '100%', transition: 'box-shadow 0.22s, transform 0.22s' }}
                onMouseEnter={e => { e.currentTarget.style.boxShadow = `0 16px 48px rgba(0,0,0,0.1)`; e.currentTarget.style.transform = 'translateY(-4px)'; }}
                onMouseLeave={e => { e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.transform = 'translateY(0)'; }}>

                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
                  <div style={{ width: 46, height: 46, borderRadius: 13, background: r.iconBg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <r.Icon size={22} style={{ color: r.color }} />
                  </div>
                  <div>
                    <p style={{ fontSize: 10, fontWeight: 800, letterSpacing: '0.1em', color: r.color, background: r.bg, padding: '2px 8px', borderRadius: 5, display: 'inline-block', marginBottom: 3 }}>STEP {r.step}</p>
                    <h3 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 15, fontWeight: 700, color: '#0F172A', letterSpacing: '-0.02em', lineHeight: 1.2 }}>{r.role}</h3>
                    <p style={{ fontSize: 11, color: '#94A3B8', fontWeight: 500 }}>{r.subtitle}</p>
                  </div>
                </div>

                <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 20px', display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {r.items.map((item, j) => (
                    <li key={j} style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                      <span style={{ width: 18, height: 18, borderRadius: '50%', background: r.bg, border: `1px solid ${r.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 9, fontWeight: 800, color: r.color, flexShrink: 0, marginTop: 2 }}>{j + 1}</span>
                      <span style={{ fontSize: 13, color: '#475569', lineHeight: 1.55 }}>{item}</span>
                    </li>
                  ))}
                </ul>

                <button onClick={() => navigate('/register')}
                  style={{ width: '100%', padding: '10px 0', background: r.bg, border: `1.5px solid ${r.border}`, borderRadius: 9, color: r.color, fontSize: 13, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, transition: 'opacity 0.15s' }}
                  onMouseEnter={e => e.currentTarget.style.opacity = '0.72'}
                  onMouseLeave={e => e.currentTarget.style.opacity = '1'}>
                  Get Started <ArrowRight size={13} />
                </button>
              </div>
            </FadeUp>
          ))}
        </div>
      </div>
    </section>
  );
}
