'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { signOut } from 'next-auth/react';

interface NavItem { href: string; label: string; icon: string; }

interface SidebarProps {
  title: string;
  subtitle: string;
  accentColor: string;
  items: NavItem[];
  role: string;
}

export default function Sidebar({ title, subtitle, accentColor, items, role }: SidebarProps) {
  const pathname = usePathname();

  return (
    <aside style={{
      width: '260px', minHeight: '100vh', flexShrink: 0,
      background: 'var(--bg-surface)', borderRight: '1px solid var(--border)',
      display: 'flex', flexDirection: 'column', padding: '24px 16px',
      position: 'sticky', top: 0, height: '100vh', overflowY: 'auto',
    }}>
      {/* Logo / Title */}
      <div style={{ marginBottom: '32px', paddingLeft: '8px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
          <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: accentColor, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1rem' }}>
            ⚡
          </div>
          <div>
            <div
              style={{
                fontFamily: 'var(--font-plus-jakarta), ui-sans-serif, sans-serif',
                fontWeight: 800,
                fontSize: '1rem',
                color: 'var(--text-primary)',
                lineHeight: 1,
              }}
            >
              SkillBridge
            </div>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 500 }}>Placement Portal</div>
          </div>
        </div>
        <div style={{ marginTop: '12px', padding: '8px 12px', background: 'var(--bg-card)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)' }}>
          <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginBottom: '2px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{role}</div>
          <div style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-primary)' }}>{title}</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{subtitle}</div>
        </div>
      </div>

      {/* Nav items */}
      <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '4px' }}>
        {items.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`nav-link ${pathname === item.href || pathname.startsWith(item.href + '/') ? 'active' : ''}`}
          >
            <span style={{ fontSize: '1rem' }}>{item.icon}</span>
            {item.label}
          </Link>
        ))}
      </nav>

      {/* Sign out */}
      <button
        onClick={() => signOut({ callbackUrl: '/login' })}
        className="btn btn-secondary"
        style={{ width: '100%', justifyContent: 'center', marginTop: '16px', fontSize: '0.8125rem' }}
      >
        🚪 Sign Out
      </button>
    </aside>
  );
}
