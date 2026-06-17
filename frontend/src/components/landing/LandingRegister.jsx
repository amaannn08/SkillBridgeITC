import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Building2, Briefcase, GraduationCap, ArrowRight, ChevronRight } from 'lucide-react';

const REGISTER_OPTIONS = [
  {
    key: 'coordinator',
    Icon: Building2,
    title: 'Faculty Coordinator',
    titleHi: 'शिक्षण समन्वयक',
    desc: 'Register your government ITI, polytechnic, or engineering college and connect your students to industry.',
    color: '#16A34A',
    bg: 'linear-gradient(135deg, rgba(22,163,74,0.08) 0%, rgba(22,163,74,0.04) 100%)',
    border: 'rgba(22,163,74,0.22)',
    iconBg: 'rgba(22,163,74,0.13)',
    badge: 'Institution',
    badgeColor: '#15803D',
    badgeBg: '#DCFCE7',
  },
  {
    key: 'recruiter',
    Icon: Briefcase,
    title: 'Industry Recruiter',
    titleHi: 'उद्योग भर्ती',
    desc: 'Post job requirements, review talent pools, bulk upload student files and hire from Medak district.',
    color: '#2563EB',
    bg: 'linear-gradient(135deg, rgba(37,99,235,0.08) 0%, rgba(37,99,235,0.04) 100%)',
    border: 'rgba(37,99,235,0.22)',
    iconBg: 'rgba(37,99,235,0.13)',
    badge: 'Company',
    badgeColor: '#1D4ED8',
    badgeBg: '#DBEAFE',
  },
  {
    key: 'student',
    Icon: GraduationCap,
    title: 'Student',
    titleHi: 'छात्र',
    desc: 'Access the portal via your coordinator. Build your placement profile and track application status.',
    color: '#F97316',
    bg: 'linear-gradient(135deg, rgba(249,115,22,0.08) 0%, rgba(249,115,22,0.04) 100%)',
    border: 'rgba(249,115,22,0.22)',
    iconBg: 'rgba(249,115,22,0.13)',
    badge: 'Via Coordinator',
    badgeColor: '#C2410C',
    badgeBg: '#FFEDD5',
  },
];

function FadeUp({ children, delay = 0 }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-50px' });
  return (
    <motion.div ref={ref}
      initial={{ opacity: 0, y: 28 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.55, delay, ease: [0.22, 1, 0.36, 1] }}>
      {children}
    </motion.div>
  );
}

export default function LandingRegister() {
  const navigate = useNavigate();

  return (
    <section style={{ background: 'linear-gradient(180deg, #0a1628 0%, #0f2444 100%)', padding: '96px 0', position: 'relative', overflow: 'hidden' }}>

      {/* Decorative orbs */}
      <div style={{ position: 'absolute', top: '-10%', right: '-5%', width: 500, height: 500, borderRadius: '50%', background: 'radial-gradient(circle, rgba(249,115,22,0.1) 0%, transparent 70%)', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', bottom: '-10%', left: '-5%', width: 400, height: 400, borderRadius: '50%', background: 'radial-gradient(circle, rgba(37,99,235,0.12) 0%, transparent 70%)', pointerEvents: 'none' }} />

      <div className="relative max-w-5xl mx-auto px-6 lg:px-20">

        <FadeUp>
          <div style={{ marginBottom: 56, textAlign: 'center' }}>
            <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#F97316', marginBottom: 10, display: 'block' }}>
              One Platform, Three Roles
            </span>
            <h2 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 'clamp(1.75rem, 3vw, 2.5rem)', fontWeight: 800, color: '#fff', letterSpacing: '-0.03em', lineHeight: 1.15, marginBottom: 10 }}>
              Register as who you are
            </h2>
            <p style={{ color: 'rgba(186,215,255,0.7)', fontSize: 16, maxWidth: 420, lineHeight: 1.65, margin: '0 auto' }}>
              Select your role below — each has a dedicated, purpose-built workflow.
            </p>
          </div>
        </FadeUp>

        <div className="grid md:grid-cols-3 gap-5">
          {REGISTER_OPTIONS.map((opt, i) => (
            <FadeUp key={opt.key} delay={i * 0.1}>
              <button
                onClick={() => navigate('/register')}
                style={{ width: '100%', textAlign: 'left', background: 'rgba(255,255,255,0.04)', border: `1.5px solid ${opt.border}`, borderRadius: 20, padding: 28, cursor: 'pointer', transition: 'all 0.22s', display: 'block' }}
                onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.08)'; e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = `0 20px 48px rgba(0,0,0,0.3)`; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}>

                {/* Icon + badge row */}
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 18 }}>
                  <div style={{ width: 52, height: 52, borderRadius: 14, background: opt.iconBg, border: `1px solid ${opt.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <opt.Icon size={24} style={{ color: opt.color }} />
                  </div>
                  <span style={{ fontSize: 10, fontWeight: 700, color: opt.badgeColor, background: opt.badgeBg, padding: '4px 10px', borderRadius: 99, letterSpacing: '0.04em' }}>
                    {opt.badge}
                  </span>
                </div>

                {/* Title */}
                <p style={{ fontSize: 9, fontWeight: 600, color: opt.color, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 4 }}>{opt.titleHi}</p>
                <h3 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 17, fontWeight: 800, color: '#fff', letterSpacing: '-0.025em', marginBottom: 10 }}>{opt.title}</h3>

                {/* Desc */}
                <p style={{ fontSize: 13, color: 'rgba(186,215,255,0.65)', lineHeight: 1.65, marginBottom: 20 }}>{opt.desc}</p>

                {/* CTA */}
                <span style={{ display: 'flex', alignItems: 'center', gap: 6, color: opt.color, fontSize: 13, fontWeight: 700 }}>
                  Register as {opt.title} <ChevronRight size={15} />
                </span>
              </button>
            </FadeUp>
          ))}
        </div>

        {/* Already registered */}
        <FadeUp delay={0.35}>
          <p style={{ textAlign: 'center', color: 'rgba(186,215,255,0.5)', fontSize: 13, marginTop: 36 }}>
            Already registered?{' '}
            <button onClick={() => navigate('/login')}
              style={{ color: '#60a5fa', fontWeight: 600, background: 'none', border: 'none', cursor: 'pointer', fontSize: 13 }}>
              Sign In to Portal <ArrowRight size={12} style={{ display: 'inline', verticalAlign: 'middle' }} />
            </button>
          </p>
        </FadeUp>
      </div>
    </section>
  );
}
