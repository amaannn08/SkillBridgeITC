'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { signOut } from 'next-auth/react';
import { useState } from 'react';
import { NotificationBell } from '@/components/shared/NotificationBell';

interface NavItem { href: string; label: string; icon: string; badge?: number; }
interface SidebarProps {
  title: string;
  subtitle: string;
  accentColor: string;
  accentGradient: string;
  items: NavItem[];
  role: string;
  userImage?: string;
  userName?: string;
  userEmail?: string;
}

export default function Sidebar({ title, subtitle, accentColor, accentGradient, items, role, userImage, userName, userEmail }: SidebarProps) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const SidebarContent = () => (
    <aside style={{
      width: '260px', minHeight: '100vh', flexShrink: 0,
      background: 'var(--bg-surface)', borderRight: '1px solid var(--border)',
      display: 'flex', flexDirection: 'column', padding: '20px 14px',
      position: 'sticky', top: 0, height: '100vh', overflowY: 'auto',
    }}>
      {/* Brand */}
      <div style={{ marginBottom: '24px', paddingLeft: '4px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '36px', height: '36px', borderRadius: '10px',
              background: accentGradient, display: 'flex', alignItems: 'center',
              justifyContent: 'center', fontSize: '1rem', boxShadow: `0 4px 12px ${accentColor}40`,
            }}>⚡</div>
            <div>
              <div style={{ fontFamily: 'var(--font-plus-jakarta),sans-serif', fontWeight: 800, fontSize: '0.95rem', color: 'var(--text-primary)', lineHeight: 1 }}>
                SkillBridge
              </div>
              <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', fontWeight: 500 }}>Placement Portal</div>
            </div>
          </div>
          <NotificationBell />
        </div>

        {/* User pill */}
        <div style={{ padding: '10px 12px', background: 'var(--bg-card)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: '10px' }}>
          {userImage ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={userImage} alt="" style={{ width: 32, height: 32, borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }} />
          ) : (
            <div style={{ width: 32, height: 32, borderRadius: '50%', background: accentGradient, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.85rem', color: '#fff', flexShrink: 0 }}>
              {(userName || 'U')[0].toUpperCase()}
            </div>
          )}
          <div style={{ minWidth: 0 }}>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '1px' }}>{role}</div>
            <div style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {userName || title}
            </div>
            {userEmail && (
              <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {userEmail}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '2px' }}>
        <div style={{ fontSize: '0.68rem', fontWeight: 700, color: 'var(--text-muted)', letterSpacing: '0.08em', textTransform: 'uppercase', padding: '0 10px', marginBottom: '6px' }}>
          Menu
        </div>
        {items.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
          return (
            <Link key={item.href} href={item.href} className={`nav-link ${isActive ? 'active' : ''}`}>
              <span style={{ fontSize: '1rem', width: '20px', textAlign: 'center', flexShrink: 0 }}>{item.icon}</span>
              <span style={{ flex: 1 }}>{item.label}</span>
              {item.badge != null && item.badge > 0 && (
                <span className="nav-badge">{item.badge}</span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div style={{ marginTop: '16px', borderTop: '1px solid var(--border)', paddingTop: '16px' }}>
        <button
          onClick={() => signOut({ callbackUrl: '/login' })}
          className="btn btn-ghost"
          style={{ width: '100%', justifyContent: 'flex-start', fontSize: '0.8125rem', color: 'var(--text-muted)' }}
        >
          <span>🚪</span> Sign Out
        </button>
      </div>
    </aside>
  );

  return (
    <>
      {/* Mobile toggle */}
      <button
        className="btn btn-secondary btn-sm"
        onClick={() => setMobileOpen(o => !o)}
        style={{ position: 'fixed', top: 12, left: 12, zIndex: 900, display: 'none' }}
        aria-label="Open menu"
        id="mobile-menu-btn"
      >
        ☰
      </button>

      {/* Desktop sidebar */}
      <div className="sidebar-desktop" style={{ display: 'flex' }}>
        <SidebarContent />
      </div>

      {/* Mobile overlay sidebar */}
      {mobileOpen && (
        <>
          <div
            onClick={() => setMobileOpen(false)}
            style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 799 }}
          />
          <div style={{ position: 'fixed', inset: '0 auto 0 0', zIndex: 800 }}>
            <SidebarContent />
          </div>
        </>
      )}
    </>
  );
}
