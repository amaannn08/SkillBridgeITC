import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { motion } from 'framer-motion';

export default function StatsCard({ icon: Icon, value, label, trend, trendLabel, color = 'blue', delay = 0 }) {
  const colors = {
    blue:   { bg: '#EFF6FF', icon: '#2563EB', border: '#DBEAFE' },
    green:  { bg: '#F0FDF4', icon: '#16A34A', border: '#DCFCE7' },
    orange: { bg: '#FFF7ED', icon: '#EA580C', border: '#FFEDD5' },
    red:    { bg: '#FEF2F2', icon: '#DC2626', border: '#FEE2E2' },
    navy:   { bg: '#EEF2FF', icon: '#4338CA', border: '#E0E7FF' },
    purple: { bg: '#FAF5FF', icon: '#7C3AED', border: '#F3E8FF' },
  };

  const c = colors[color] || colors.blue;
  const TrendIcon = trend === 'up' ? TrendingUp : trend === 'down' ? TrendingDown : Minus;
  const trendColor = trend === 'up' ? '#16A34A' : trend === 'down' ? '#DC2626' : '#94A3B8';

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay: delay / 1000, ease: [0.22, 1, 0.36, 1] }}
      className="card"
      style={{ border: `1px solid ${c.border}`, background: '#fff' }}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <p className="text-xs font-semibold text-gray-400 mb-2 truncate uppercase tracking-wider">{label}</p>
          <p style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: '1.875rem', fontWeight: 800, color: '#0F172A', lineHeight: 1, letterSpacing: '-0.03em' }}>
            {typeof value === 'number' ? value.toLocaleString('en-IN') : value}
          </p>
          {trendLabel && (
            <div className="flex items-center gap-1 mt-2.5" style={{ color: trendColor }}>
              <TrendIcon size={12} />
              <span style={{ fontSize: 12, fontWeight: 600 }}>{trendLabel}</span>
            </div>
          )}
        </div>
        <div style={{ width: 44, height: 44, borderRadius: 12, background: c.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          {Icon && <Icon size={20} style={{ color: c.icon }} />}
        </div>
      </div>
    </motion.div>
  );
}
