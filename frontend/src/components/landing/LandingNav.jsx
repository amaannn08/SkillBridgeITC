import { useNavigate } from 'react-router-dom';
import { ArrowRight, MapPin } from 'lucide-react';

const NAV_STYLE = {
  background: 'rgba(8, 18, 38, 0.92)',
  backdropFilter: 'blur(20px)',
  WebkitBackdropFilter: 'blur(20px)',
  borderBottom: '1px solid rgba(255,255,255,0.07)',
};

export default function LandingNav() {
  const navigate = useNavigate();

  return (
    <nav style={{ ...NAV_STYLE, position: 'sticky', top: 0, zIndex: 50 }}
      className="px-6 lg:px-20 py-3 flex items-center justify-between">

      {/* Brand */}
      <div className="flex items-center gap-3">
        <div style={{
          width: 38, height: 38, borderRadius: 10,
          background: 'linear-gradient(135deg, #F97316 0%, #EA580C 100%)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontWeight: 900, color: '#fff', fontSize: 13, letterSpacing: '-0.02em',
          flexShrink: 0, boxShadow: '0 4px 14px rgba(249,115,22,0.4)',
        }}>M</div>
        <div>
          <span style={{
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            fontWeight: 800, fontSize: 18, color: '#fff', letterSpacing: '-0.03em',
          }}>MESIC</span>
          <span style={{
            display: 'flex', alignItems: 'center', gap: 3,
            fontSize: 10, fontWeight: 500, color: 'rgba(251,146,60,0.85)',
            letterSpacing: '0.04em',
          }}>
            <MapPin size={9} /> Medak District Initiative
          </span>
        </div>
      </div>

      {/* Right side */}
      <div className="flex items-center gap-2">
        <span style={{
          fontSize: 10, fontWeight: 700, letterSpacing: '0.1em',
          color: '#60a5fa', background: 'rgba(37,99,235,0.18)',
          padding: '3px 10px', borderRadius: 99, textTransform: 'uppercase',
          border: '1px solid rgba(37,99,235,0.25)',
        }}>Gov Portal</span>

        <button
          onClick={() => navigate('/admin')}
          style={{
            color: 'rgba(255,255,255,0.6)', fontSize: 13, fontWeight: 500,
            padding: '7px 16px', borderRadius: 8, background: 'transparent',
            border: 'none', cursor: 'pointer', transition: 'color 0.15s',
          }}
          onMouseEnter={e => e.currentTarget.style.color = '#fff'}
          onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.6)'}
        >Sign In</button>

        <button
          onClick={() => navigate('/register')}
          style={{
            background: 'linear-gradient(135deg, #F97316 0%, #EA580C 100%)',
            color: '#fff', fontSize: 13, fontWeight: 700,
            padding: '8px 20px', borderRadius: 9, border: 'none',
            cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6,
            boxShadow: '0 4px 14px rgba(249,115,22,0.38)',
            transition: 'all 0.18s',
          }}
          onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.boxShadow = '0 6px 20px rgba(249,115,22,0.5)'; }}
          onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 14px rgba(249,115,22,0.38)'; }}
        >
          Register <ArrowRight size={13} />
        </button>
      </div>
    </nav>
  );
}
