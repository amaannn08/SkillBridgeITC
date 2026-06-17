import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Users, School, Factory, Award } from 'lucide-react';

const IMPACT_ITEMS = [
  { Icon: School,   value: '47+',  label: 'Institutions',     color: '#16A34A', bg: 'rgba(22,163,74,0.1)' },
  { Icon: Factory,  value: '120+', label: 'Industry Partners', color: '#2563EB', bg: 'rgba(37,99,235,0.1)' },
  { Icon: Users,    value: '3.2k', label: 'Students Placed',  color: '#F97316', bg: 'rgba(249,115,22,0.1)' },
  { Icon: Award,    value: '89%',  label: 'Placement Rate',   color: '#7C3AED', bg: 'rgba(124,58,237,0.1)' },
];

function FadeUp({ children, delay = 0 }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-50px' });
  return (
    <motion.div ref={ref}
      initial={{ opacity: 0, y: 24 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.55, delay, ease: [0.22, 1, 0.36, 1] }}>
      {children}
    </motion.div>
  );
}

export default function LandingImpact() {
  return (
    <section style={{ background: '#fff', padding: '96px 0' }}>
      <div className="max-w-5xl mx-auto px-6 lg:px-20">

        {/* Split layout */}
        <div className="grid lg:grid-cols-2 gap-16 items-center">

          {/* Left: Photo */}
          <FadeUp>
            <div style={{ position: 'relative' }}>
              <div style={{ borderRadius: 24, overflow: 'hidden', boxShadow: '0 24px 64px rgba(0,0,0,0.14)' }}>
                <img src="/students-portrait.png" alt="MESIC students"
                  style={{ width: '100%', height: 420, objectFit: 'cover', objectPosition: 'center top', display: 'block' }} />
              </div>
              {/* Floating badge */}
              <div className="float-badge" style={{
                position: 'absolute', bottom: -18, right: -18,
                background: 'linear-gradient(135deg, #F97316 0%, #EA580C 100%)',
                borderRadius: 16, padding: '16px 20px', textAlign: 'center',
                boxShadow: '0 12px 32px rgba(249,115,22,0.4)',
              }}>
                <p style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 900, fontSize: 26, color: '#fff', lineHeight: 1 }}>89%</p>
                <p style={{ fontSize: 10, fontWeight: 700, color: 'rgba(255,255,255,0.8)', letterSpacing: '0.06em', textTransform: 'uppercase', marginTop: 3 }}>Placement Rate</p>
              </div>
              {/* Second badge */}
              <div style={{
                position: 'absolute', top: 20, left: -16,
                background: '#fff', borderRadius: 12, padding: '10px 16px',
                boxShadow: '0 8px 24px rgba(0,0,0,0.12)', display: 'flex', alignItems: 'center', gap: 10,
              }}>
                <div style={{ width: 36, height: 36, borderRadius: 10, background: 'rgba(22,163,74,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Users size={18} style={{ color: '#16A34A' }} />
                </div>
                <div>
                  <p style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 800, fontSize: 18, color: '#0F172A', lineHeight: 1 }}>3,200+</p>
                  <p style={{ fontSize: 10, color: '#94A3B8', fontWeight: 600, letterSpacing: '0.04em', textTransform: 'uppercase', marginTop: 2 }}>Students Placed</p>
                </div>
              </div>
            </div>
          </FadeUp>

          {/* Right: Content */}
          <FadeUp delay={0.12}>
            <div>
              <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#F97316', marginBottom: 12, display: 'block' }}>
                District Impact
              </span>
              <h2 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 'clamp(1.75rem, 3vw, 2.4rem)', fontWeight: 800, color: '#0F172A', letterSpacing: '-0.03em', lineHeight: 1.15, marginBottom: 14 }}>
                Har Hunar Ko<br />
                <span style={{ color: '#F97316' }}>Uska Mauka</span>
              </h2>
              <p style={{ color: '#64748B', fontSize: 15, lineHeight: 1.7, marginBottom: 36 }}>
                MESIC is transforming how Medak district connects its skilled youth to local industry — creating a transparent, government-backed pipeline from campus to company.
              </p>

              {/* Stats grid */}
              <div className="grid grid-cols-2 gap-4">
                {IMPACT_ITEMS.map((item, i) => (
                  <div key={i} style={{ background: item.bg, borderRadius: 14, padding: '18px 20px', display: 'flex', alignItems: 'center', gap: 14 }}>
                    <div style={{ width: 40, height: 40, borderRadius: 11, background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
                      <item.Icon size={19} style={{ color: item.color }} />
                    </div>
                    <div>
                      <p style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 800, fontSize: 22, color: '#0F172A', lineHeight: 1 }}>{item.value}</p>
                      <p style={{ fontSize: 11, color: '#64748B', fontWeight: 500, marginTop: 3 }}>{item.label}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </FadeUp>
        </div>
      </div>
    </section>
  );
}
