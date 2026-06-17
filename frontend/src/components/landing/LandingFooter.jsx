import { MapPin, Phone, Mail } from 'lucide-react';

export default function LandingFooter() {
  return (
    <footer style={{ background: '#060d1a', borderTop: '1px solid rgba(255,255,255,0.06)', padding: '40px 24px 28px' }}>
      <div className="max-w-5xl mx-auto">

        {/* Top row */}
        <div className="grid sm:grid-cols-3 gap-10 pb-8" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>

          {/* Brand */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
              <div style={{ width: 36, height: 36, borderRadius: 9, background: 'linear-gradient(135deg, #F97316 0%, #EA580C 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, color: '#fff', fontSize: 13 }}>M</div>
              <div>
                <p style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 800, fontSize: 17, color: '#fff', letterSpacing: '-0.02em' }}>MESIC</p>
                <p style={{ fontSize: 9, color: 'rgba(251,146,60,0.7)', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase' }}>Medak District Initiative</p>
              </div>
            </div>
            <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.35)', lineHeight: 1.7 }}>
              Medak District Employment, Skill &amp; Industry Connect — local talent for local industry.
            </p>
          </div>

          {/* Links */}
          <div>
            <p style={{ fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.5)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 14 }}>Platform</p>
            {['Register as Coordinator', 'Register as Recruiter', 'Sign In to Portal', 'District Map'].map(l => (
              <p key={l} style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', marginBottom: 8, cursor: 'pointer', transition: 'color 0.15s' }}
                onMouseEnter={e => e.currentTarget.style.color = 'rgba(255,255,255,0.8)'}
                onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.4)'}>{l}</p>
            ))}
          </div>

          {/* Contact */}
          <div>
            <p style={{ fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.5)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 14 }}>Contact</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {[
                { Icon: MapPin, text: 'District Collectorate, Sangareddy, Medak, Telangana' },
                { Icon: Phone, text: '+91 8455 2-XXXXX' },
                { Icon: Mail,  text: 'mesic@medak.gov.in' },
              ].map(({ Icon, text }, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
                  <Icon size={13} style={{ color: '#F97316', flexShrink: 0, marginTop: 2 }} />
                  <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.35)', lineHeight: 1.5 }}>{text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom row */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-6">
          <p style={{ color: 'rgba(255,255,255,0.22)', fontSize: 11 }}>
            © 2025 MESIC — Medak District Collectorate, Govt. of Telangana
          </p>
          <p style={{ color: 'rgba(255,255,255,0.2)', fontSize: 11 }}>
            Ministry of Skill Development &amp; Entrepreneurship · v1.0
          </p>
        </div>
      </div>
    </footer>
  );
}
