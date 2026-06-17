import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, MapPin, Menu, X } from 'lucide-react';

const NAV_STYLE = {
  background: 'rgba(8, 18, 38, 0.92)',
  backdropFilter: 'blur(20px)',
  WebkitBackdropFilter: 'blur(20px)',
  borderBottom: '1px solid rgba(255,255,255,0.07)',
};

export default function LandingNav() {
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav style={{ ...NAV_STYLE, position: 'sticky', top: 0, zIndex: 50 }}>
      <div className="px-5 lg:px-20 py-3 flex items-center justify-between">

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

        {/* Desktop right side */}
        <div className="hidden sm:flex items-center gap-2">
          <span style={{
            fontSize: 10, fontWeight: 700, letterSpacing: '0.1em',
            color: '#60a5fa', background: 'rgba(37,99,235,0.18)',
            padding: '3px 10px', borderRadius: 99, textTransform: 'uppercase',
            border: '1px solid rgba(37,99,235,0.25)',
          }}>Gov Portal</span>

          <button
            onClick={() => navigate('/login')}
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

        {/* Mobile hamburger */}
        <button className="sm:hidden" onClick={() => setMobileOpen(o => !o)}
          style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.8)', cursor: 'pointer', padding: 6 }}>
          {mobileOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile menu dropdown */}
      {mobileOpen && (
        <div style={{ background: 'rgba(8,18,38,0.98)', borderTop: '1px solid rgba(255,255,255,0.07)', padding: '16px 20px 20px', display: 'flex', flexDirection: 'column', gap: 10 }}>
          <button onClick={() => { navigate('/login'); setMobileOpen(false); }}
            style={{ color: 'rgba(255,255,255,0.75)', fontSize: 15, fontWeight: 500, padding: '11px 16px', borderRadius: 10, background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', cursor: 'pointer', textAlign: 'left' }}>
            Sign In to Portal
          </button>
          <button onClick={() => { navigate('/register'); setMobileOpen(false); }}
            style={{ background: 'linear-gradient(135deg, #F97316 0%, #EA580C 100%)', color: '#fff', fontSize: 15, fontWeight: 700, padding: '12px 16px', borderRadius: 10, border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, boxShadow: '0 4px 16px rgba(249,115,22,0.4)' }}>
            Register Now <ArrowRight size={15} />
          </button>
        </div>
      )}
    </nav>
  );
}
