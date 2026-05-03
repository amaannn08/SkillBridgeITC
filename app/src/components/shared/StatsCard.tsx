'use client';

interface StatsCardProps {
  icon: string;
  label: string;
  value: number | string;
  accent?: 'blue' | 'green' | 'orange' | 'red';
  trend?: { value: string; up: boolean };
  loading?: boolean;
}

export function StatsCard({ icon, label, value, accent = 'blue', trend, loading }: StatsCardProps) {
  const iconBg: Record<string, string> = {
    blue: 'rgba(37,99,235,0.15)',
    green: 'rgba(22,163,74,0.15)',
    orange: 'rgba(234,88,12,0.15)',
    red: 'rgba(220,38,38,0.15)',
  };
  const iconColor: Record<string, string> = {
    blue: '#60a5fa',
    green: '#4ade80',
    orange: '#fb923c',
    red: '#f87171',
  };

  return (
    <div className={`stat-card accent-${accent}`}>
      <div className="stat-icon" style={{ background: iconBg[accent], color: iconColor[accent] }}>
        {icon}
      </div>
      {loading ? (
        <>
          <div className="skeleton" style={{ height: '2.25rem', width: '60%', marginBottom: '6px', borderRadius: '6px' }} />
          <div className="skeleton" style={{ height: '0.75rem', width: '80%', borderRadius: '4px' }} />
        </>
      ) : (
        <>
          <div className="stat-value" style={{ color: iconColor[accent] }}>{value}</div>
          <div className="stat-label">{label}</div>
          {trend && (
            <div style={{ marginTop: '8px', fontSize: '0.75rem', color: trend.up ? '#4ade80' : '#f87171', fontWeight: 600 }}>
              {trend.up ? '↑' : '↓'} {trend.value}
            </div>
          )}
        </>
      )}
    </div>
  );
}
