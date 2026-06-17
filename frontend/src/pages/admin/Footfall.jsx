import { useState } from 'react';
import { motion } from 'framer-motion';
import { BarChart3, TrendingUp, Users, Download, Filter, Building2 } from 'lucide-react';

const DAILY_DATA = [
  { day: 'Mon', count: 312 }, { day: 'Tue', count: 285 }, { day: 'Wed', count: 347 },
  { day: 'Thu', count: 298 }, { day: 'Fri', count: 421 }, { day: 'Sat', count: 189 }, { day: 'Sun', count: 94 },
];

const INSTITUTION_DATA = [
  { name: 'Govt. ITI Medak',            type: 'ITI',         today: 68, week: 412, month: 1820 },
  { name: 'Govt. Polytechnic Siddipet', type: 'Polytechnic', today: 54, week: 338, month: 1420 },
  { name: 'Sri Venkateswara ITI',        type: 'ITI',         today: 47, week: 290, month: 1180 },
  { name: 'Pragathi Polytechnic',        type: 'Polytechnic', today: 39, week: 224, month: 980  },
  { name: 'Medak Engineering College',   type: 'Engineering', today: 31, week: 198, month: 840  },
  { name: 'Govt. ITI Narsapur',          type: 'ITI',         today: 28, week: 176, month: 760  },
];

const TYPE_COLORS = {
  ITI:         { bg: '#FFF7ED', text: '#C2410C', border: '#FED7AA' },
  Polytechnic: { bg: '#EFF6FF', text: '#1D4ED8', border: '#BFDBFE' },
  Engineering: { bg: '#F0FDF4', text: '#166534', border: '#BBF7D0' },
};

const MAX_COUNT = Math.max(...DAILY_DATA.map(d => d.count));

export default function Footfall() {
  const [range, setRange] = useState('week');
  const totalToday = INSTITUTION_DATA.reduce((s, i) => s + i.today, 0);
  const totalWeek  = INSTITUTION_DATA.reduce((s, i) => s + i.week,  0);
  const totalMonth = INSTITUTION_DATA.reduce((s, i) => s + i.month, 0);

  return (
    <div className="animate-fade-in">
      <div style={{ marginBottom: 28, display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12, alignItems: 'flex-start' }}>
        <div>
          <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#F97316', background: '#FFF7ED', border: '1px solid #FED7AA', borderRadius: 99, padding: '3px 10px' }}>
            District Collector Portal
          </span>
          <h1 className="page-title" style={{ marginTop: 8 }}>Student Footfall Tracker</h1>
          <p className="page-subtitle">Daily student visit counts across Medak district institutions</p>
        </div>
        <button style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, fontWeight: 600, color: '#F97316', background: '#FFF7ED', border: '1px solid #FED7AA', borderRadius: 10, padding: '8px 14px', cursor: 'pointer' }}>
          <Download size={14} /> Export CSV
        </button>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {[
          { label: "Today's Footfall", value: totalToday, icon: Users,     color: '#F97316', bg: '#FFF7ED', border: '#FED7AA', live: true },
          { label: 'This Week',        value: totalWeek.toLocaleString(),  icon: TrendingUp, color: '#2563EB', bg: '#EFF6FF', border: '#BFDBFE' },
          { label: 'This Month',       value: totalMonth.toLocaleString(), icon: BarChart3,  color: '#16A34A', bg: '#F0FDF4', border: '#BBF7D0' },
        ].map((s, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
            style={{ background: s.bg, border: `1px solid ${s.border}`, borderRadius: 16, padding: '18px 20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
              <div style={{ width: 34, height: 34, borderRadius: 9, background: s.color, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <s.icon size={17} color="#fff" />
              </div>
              {s.live && (
                <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 10, fontWeight: 700, color: '#16A34A', background: '#F0FDF4', border: '1px solid #BBF7D0', borderRadius: 99, padding: '2px 8px' }}>
                  <span style={{ width: 5, height: 5, borderRadius: '50%', background: '#22c55e', display: 'inline-block' }} /> LIVE
                </span>
              )}
            </div>
            <p style={{ fontSize: 28, fontWeight: 900, color: s.color, lineHeight: 1 }}>{s.value}</p>
            <p style={{ fontSize: 12, color: 'rgba(0,0,0,0.45)', marginTop: 4 }}>{s.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Bar chart */}
      <div className="card mb-6">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
          <h2 className="font-semibold text-gray-800 flex items-center gap-2">
            <BarChart3 size={17} className="text-blue-500" /> Weekly Visit Trend
          </h2>
          <div style={{ display: 'flex', gap: 4 }}>
            {['week', 'month'].map(r => (
              <button key={r} onClick={() => setRange(r)}
                style={{ fontSize: 12, fontWeight: 600, padding: '5px 12px', borderRadius: 8, border: 'none', cursor: 'pointer', background: range === r ? '#0F2444' : '#F1F5F9', color: range === r ? '#fff' : '#64748B', transition: 'all 0.15s' }}>
                {r === 'week' ? 'This Week' : 'This Month'}
              </button>
            ))}
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: 8, height: 160, padding: '0 8px' }}>
          {DAILY_DATA.map((d, i) => {
            const pct = (d.count / MAX_COUNT) * 100;
            const isToday = i === 4;
            return (
              <div key={d.day} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
                <motion.div
                  initial={{ height: 0 }} animate={{ height: `${pct}%` }}
                  transition={{ delay: i * 0.06, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                  style={{ width: '100%', borderRadius: '6px 6px 0 0', background: isToday ? 'linear-gradient(180deg,#F97316,#EA580C)' : 'linear-gradient(180deg,#3B82F6,#2563EB)', boxShadow: isToday ? '0 4px 12px rgba(249,115,22,0.35)' : 'none', minHeight: 4 }} />
                <p style={{ fontSize: 11, color: isToday ? '#F97316' : '#94A3B8', fontWeight: isToday ? 700 : 500 }}>{d.day}</p>
                <p style={{ fontSize: 11, fontWeight: 600, color: '#475569' }}>{d.count}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Institution table */}
      <div className="card">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
          <h2 className="font-semibold text-gray-800 flex items-center gap-2">
            <Building2 size={17} className="text-green-500" /> Institution-wise Breakdown
          </h2>
          <button style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, fontWeight: 600, color: '#64748B', background: '#F1F5F9', border: 'none', borderRadius: 8, padding: '6px 12px', cursor: 'pointer' }}>
            <Filter size={13} /> Filter
          </button>
        </div>
        <div className="table-wrapper">
          <table>
            <thead><tr><th>Institution</th><th>Type</th><th>Today</th><th>This Week</th><th>This Month</th></tr></thead>
            <tbody>
              {INSTITUTION_DATA.map((inst, i) => {
                const tc = TYPE_COLORS[inst.type] || TYPE_COLORS['ITI'];
                return (
                  <tr key={i}>
                    <td className="font-medium text-gray-800">{inst.name}</td>
                    <td><span style={{ fontSize: 11, fontWeight: 700, background: tc.bg, color: tc.text, border: `1px solid ${tc.border}`, borderRadius: 99, padding: '2px 9px' }}>{inst.type}</span></td>
                    <td><span style={{ fontWeight: 700, color: '#F97316' }}>{inst.today}</span></td>
                    <td className="text-gray-600">{inst.week}</td>
                    <td className="text-gray-600">{inst.month.toLocaleString()}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
