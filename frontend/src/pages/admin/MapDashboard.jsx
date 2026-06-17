import { useState } from 'react';
import { MapPin, Building2, GraduationCap, Briefcase, Users, Info } from 'lucide-react';
import { MEDAK_LOCATIONS, MOCK_COMPANIES, MOCK_INSTITUTIONS, MOCK_JOBS } from '../../data/mockData';

// Medak district approximate bounding box for SVG projection
// lat: 17.5 – 18.2, lng: 77.5 – 78.5
const MAP_W = 700, MAP_H = 480;
const LAT_MIN = 17.45, LAT_MAX = 18.20;
const LNG_MIN = 77.45, LNG_MAX = 78.60;

function project(lat, lng) {
  const x = ((lng - LNG_MIN) / (LNG_MAX - LNG_MIN)) * MAP_W;
  const y = ((LAT_MAX - lat) / (LAT_MAX - LAT_MIN)) * MAP_H;
  return { x, y };
}

const LEGEND = [
  { color: '#2563EB', label: 'ITI / College', icon: GraduationCap },
  { color: '#16A34A', label: 'Factory / Company', icon: Building2 },
];

const SECTOR_COLORS = {
  'FMCG': '#2563EB',
  'Food Processing': '#16A34A',
  'Manufacturing': '#EA580C',
  'Chemical': '#7C3AED',
};

export default function MapDashboard() {
  const [hovered, setHovered] = useState(null);
  const [filter, setFilter] = useState('all'); // all | college | factory

  const totalVacancies = MEDAK_LOCATIONS.filter(l => l.type === 'factory').reduce((s, l) => s + l.vacancies, 0);
  const totalStudents = MEDAK_LOCATIONS.filter(l => l.type === 'college').reduce((s, l) => s + l.students, 0);

  const visible = MEDAK_LOCATIONS.filter(l => filter === 'all' || l.type === filter);

  return (
    <div className="animate-fade-in">
      <div className="page-header flex flex-col sm:flex-row sm:items-start justify-between gap-3">
        <div>
          <h1 className="page-title flex items-center gap-2">
            <MapPin size={22} className="text-blue-500" /> Medak District — Interactive Map
          </h1>
          <p className="page-subtitle">Colleges, ITIs, and food factories across Medak &amp; Sangareddy districts</p>
        </div>
        <div className="flex gap-2 flex-wrap">
          {['all','college','factory'].map(f => (
            <button key={f} onClick={() => setFilter(f)}
              className={`btn btn-sm flex-shrink-0 ${filter === f ? 'btn-primary' : 'btn-outline'}`}>
              {f === 'all' ? 'All' : f === 'college' ? 'Colleges' : 'Factories'}
            </button>
          ))}
        </div>
      </div>

      {/* Quick stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Total Vacancies', value: totalVacancies, color: '#2563EB', bg: '#EFF6FF' },
          { label: 'Students Available', value: totalStudents, color: '#16A34A', bg: '#F0FDF4' },
          { label: 'Active Factories', value: MEDAK_LOCATIONS.filter(l => l.type === 'factory').length, color: '#EA580C', bg: '#FFF7ED' },
          { label: 'Institutions', value: MEDAK_LOCATIONS.filter(l => l.type === 'college').length, color: '#7C3AED', bg: '#FAF5FF' },
        ].map((s, i) => (
          <div key={i} className="card card-sm" style={{ borderColor: s.color + '33' }}>
            <p className="text-xs font-semibold uppercase tracking-wider mb-1" style={{ color: s.color }}>{s.label}</p>
            <p style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 28, fontWeight: 800, color: '#0F172A', lineHeight: 1 }}>{s.value}</p>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* SVG Map */}
        <div className="lg:col-span-2 card" style={{ padding: 0, overflow: 'hidden' }}>
          <div style={{ background: '#EFF6FF', padding: '16px 20px', borderBottom: '1px solid #DBEAFE' }}>
            <div className="flex items-center justify-between">
              <p className="font-semibold text-gray-800 text-sm">Medak District, Telangana</p>
              <div className="flex items-center gap-4">
                {LEGEND.map(l => (
                  <div key={l.label} className="flex items-center gap-1.5">
                    <div style={{ width: 10, height: 10, borderRadius: '50%', background: l.color }} />
                    <span className="text-xs text-gray-500">{l.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div style={{ position: 'relative', background: '#F0F9FF' }}>
            <svg viewBox={`0 0 ${MAP_W} ${MAP_H}`} style={{ width: '100%', height: 'auto', display: 'block' }}>
              {/* District background */}
              <rect width={MAP_W} height={MAP_H} fill="#E0F2FE" />
              {/* Grid lines */}
              {[...Array(8)].map((_, i) => (
                <line key={`v${i}`} x1={(i+1)*MAP_W/8} y1={0} x2={(i+1)*MAP_W/8} y2={MAP_H} stroke="rgba(255,255,255,0.5)" strokeWidth={1} />
              ))}
              {[...Array(6)].map((_, i) => (
                <line key={`h${i}`} x1={0} y1={(i+1)*MAP_H/6} x2={MAP_W} y2={(i+1)*MAP_H/6} stroke="rgba(255,255,255,0.5)" strokeWidth={1} />
              ))}

              {/* District label */}
              <text x={MAP_W/2} y={MAP_H - 16} textAnchor="middle" fill="rgba(30,58,95,0.3)" fontSize={11} fontWeight={600} letterSpacing={2}>MEDAK DISTRICT · TELANGANA</text>

              {/* Locations */}
              {visible.map(loc => {
                const { x, y } = project(loc.lat, loc.lng);
                const isCollege = loc.type === 'college';
                const isHovered = hovered?.id === loc.id;
                const color = isCollege ? '#2563EB' : (SECTOR_COLORS[loc.sector] || '#16A34A');
                const size = isCollege
                  ? 6 + (loc.students / 50)
                  : 6 + (loc.vacancies / 8);

                return (
                  <g key={loc.id} style={{ cursor: 'pointer' }}
                    onMouseEnter={() => setHovered(loc)}
                    onMouseLeave={() => setHovered(null)}>
                    {/* Pulse ring */}
                    {isHovered && (
                      <circle cx={x} cy={y} r={size + 8} fill={color} opacity={0.15} />
                    )}
                    {/* Outer ring */}
                    <circle cx={x} cy={y} r={size + 3} fill={color} opacity={0.2} />
                    {/* Main dot */}
                    <circle cx={x} cy={y} r={size} fill={color} stroke="#fff" strokeWidth={2} />
                    {/* Label */}
                    <text x={x} y={y - size - 6} textAnchor="middle" fill={color} fontSize={9} fontWeight={700}>
                      {loc.name.split(' ').slice(-1)[0]}
                    </text>
                  </g>
                );
              })}
            </svg>

            {/* Tooltip */}
            {hovered && (
              <div style={{
                position: 'absolute', bottom: 16, left: 16,
                background: '#fff', borderRadius: 12, padding: '12px 16px',
                boxShadow: '0 8px 24px rgba(0,0,0,0.12)', border: '1px solid #E2E8F0',
                maxWidth: 240, zIndex: 10,
              }}>
                <p className="font-bold text-gray-900 text-sm mb-1">{hovered.name}</p>
                {hovered.type === 'college' ? (
                  <>
                    <p className="text-xs text-gray-500">{hovered.district} · {hovered.qualification}</p>
                    <p className="text-xs font-semibold text-blue-600 mt-1">{hovered.students} students enrolled</p>
                  </>
                ) : (
                  <>
                    <p className="text-xs text-gray-500">{hovered.sector}</p>
                    <p className="text-xs font-semibold text-green-600 mt-1">{hovered.vacancies} open vacancies</p>
                  </>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Side panel */}
        <div className="space-y-4">
          {/* Factories list */}
          <div className="card">
            <h3 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
              <Building2 size={16} className="text-green-500" /> Active Factories
            </h3>
            <div className="space-y-2">
              {MEDAK_LOCATIONS.filter(l => l.type === 'factory').map(f => (
                <div key={f.id} className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-gray-50 transition-colors cursor-pointer"
                  onMouseEnter={() => setHovered(f)} onMouseLeave={() => setHovered(null)}
                  style={{ background: hovered?.id === f.id ? '#F0FDF4' : 'transparent' }}>
                  <div style={{ width: 8, height: 8, borderRadius: '50%', background: SECTOR_COLORS[f.sector] || '#16A34A', flexShrink: 0 }} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-800 truncate">{f.name}</p>
                    <p className="text-xs text-gray-400">{f.sector}</p>
                  </div>
                  <span className="badge badge-green text-xs">{f.vacancies} open</span>
                </div>
              ))}
            </div>
          </div>

          {/* Colleges list */}
          <div className="card">
            <h3 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
              <GraduationCap size={16} className="text-blue-500" /> Institutions
            </h3>
            <div className="space-y-2">
              {MEDAK_LOCATIONS.filter(l => l.type === 'college').map(c => (
                <div key={c.id} className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-gray-50 transition-colors cursor-pointer"
                  onMouseEnter={() => setHovered(c)} onMouseLeave={() => setHovered(null)}
                  style={{ background: hovered?.id === c.id ? '#EFF6FF' : 'transparent' }}>
                  <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#2563EB', flexShrink: 0 }} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-800 truncate">{c.name}</p>
                    <p className="text-xs text-gray-400">{c.district} · {c.qualification}</p>
                  </div>
                  <span className="badge badge-blue text-xs">{c.students}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
