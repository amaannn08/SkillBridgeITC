import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

export default function LandingCTA() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });
  const navigate = useNavigate();

  return (
    <section style={{ padding: '0 24px 96px' }}>
      <motion.div ref={ref}
        initial={{ opacity: 0, y: 32 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="max-w-3xl mx-auto"
        style={{
          background: 'linear-gradient(135deg, #0c1e38 0%, #0f2d56 50%, #1a3f7a 100%)',
          borderRadius: 24, padding: '56px 48px', textAlign: 'center',
          boxShadow: '0 28px 72px rgba(10,22,40,0.22)',
          position: 'relative', overflow: 'hidden',
          border: '1px solid rgba(255,255,255,0.07)',
        }}>
        <div style={{ position: 'absolute', top: -60, right: -60, width: 240, height: 240, borderRadius: '50%', background: 'radial-gradient(circle, rgba(249,115,22,0.2) 0%, transparent 70%)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: -40, left: -40, width: 180, height: 180, borderRadius: '50%', background: 'radial-gradient(circle, rgba(37,99,235,0.2) 0%, transparent 70%)', pointerEvents: 'none' }} />

        <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#F97316', marginBottom: 14, display: 'block' }}>Ready to get started?</span>
        <h2 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 'clamp(1.5rem, 3vw, 2.25rem)', fontWeight: 800, color: '#fff', letterSpacing: '-0.03em', lineHeight: 1.2, marginBottom: 14 }}>
          Connecting Campus to Company,<br />One District at a Time
        </h2>
        <p style={{ color: 'rgba(191,219,254,0.7)', fontSize: 15, lineHeight: 1.65, maxWidth: 400, margin: '0 auto 36px' }}>
          Join 47+ institutions and 120 industry partners already placing Medak's talent with local employers.
        </p>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
          <button onClick={() => navigate('/register')}
            style={{ background: 'linear-gradient(135deg, #F97316 0%, #EA580C 100%)', color: '#fff', fontWeight: 700, fontSize: 15, padding: '13px 30px', borderRadius: 11, border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8, boxShadow: '0 4px 18px rgba(249,115,22,0.4)', transition: 'all 0.18s' }}
            onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; }}
            onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; }}>
            Register Now <ArrowRight size={15} />
          </button>
          <button onClick={() => navigate('/admin')}
            style={{ background: 'rgba(255,255,255,0.08)', color: '#fff', fontWeight: 600, fontSize: 15, padding: '13px 30px', borderRadius: 11, cursor: 'pointer', border: '1px solid rgba(255,255,255,0.16)', transition: 'background 0.15s' }}
            onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.14)'}
            onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.08)'}>
            Sign In
          </button>
        </div>
      </motion.div>
    </section>
  );
}
