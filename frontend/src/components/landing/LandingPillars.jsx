import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { CheckCircle } from 'lucide-react';

const PILLARS = [
  { label: 'Auditable',     desc: 'Every action logged' },
  { label: 'District-First', desc: 'Medak geography scoped' },
  { label: 'Structured',    desc: 'Batch & slot system' },
  { label: 'Real-Time',     desc: 'Live status updates' },
];

export default function LandingPillars() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-40px' });

  return (
    <section style={{ background: '#fff', borderBottom: '1px solid #E2E8F0' }}>
      <motion.div ref={ref}
        initial={{ opacity: 0, y: 12 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.45, ease: 'easeOut' }}
        className="max-w-5xl mx-auto px-6 lg:px-20 py-5 flex flex-wrap justify-center gap-0">
        {PILLARS.map((p, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 9, padding: '9px 28px', borderRight: i < PILLARS.length - 1 ? '1px solid #E2E8F0' : 'none' }}>
            <CheckCircle size={14} style={{ color: '#F97316', flexShrink: 0 }} />
            <span style={{ fontSize: 13, fontWeight: 700, color: '#0F172A' }}>{p.label}</span>
            <span style={{ fontSize: 12, color: '#94A3B8' }}>{p.desc}</span>
          </div>
        ))}
      </motion.div>
    </section>
  );
}
