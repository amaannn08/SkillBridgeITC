import Sidebar from '@/components/Sidebar';

const nav = [
  { href: '/admin/dashboard', label: 'Dashboard', icon: '📊' },
  { href: '/admin/approvals', label: 'Approvals', icon: '✅' },
  { href: '/admin/users', label: 'Users', icon: '👥' },
  { href: '/admin/analytics', label: 'Analytics', icon: '📈' },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <Sidebar title="Super Admin" subtitle="SkillBridge" accentColor="#1E3A5F" role="super_admin" items={nav} />
      <main style={{ flex: 1, padding: '24px', overflow: 'auto' }}>{children}</main>
    </div>
  );
}
