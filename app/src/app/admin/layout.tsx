import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import Sidebar from '@/components/Sidebar';

const nav = [
  { href: '/admin/dashboard', label: 'Dashboard', icon: '📊' },
  { href: '/admin/approvals', label: 'Pending Approvals', icon: '⏳' },
  { href: '/admin/users', label: 'All Users', icon: '👤' },
  { href: '/admin/analytics', label: 'Analytics', icon: '📈' },
  { href: '/admin/audit', label: 'Audit Log', icon: '🔍' },
];

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session?.user) redirect('/login');
  if (session.user.approvalStatus !== 'approved') redirect('/pending');
  if (session.user.role !== 'super_admin') redirect('/unauthorized');

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <Sidebar
        title={session.user.name || 'Admin'}
        subtitle={session.user.email || ''}
        accentColor="#10b981"
        accentGradient="linear-gradient(135deg,#10b981,#059669)"
        role="super_admin"
        items={nav}
        userImage={session.user.image || undefined}
        userName={session.user.name || undefined}
        userEmail={session.user.email || undefined}
      />
      <main style={{ flex: 1, padding: '28px 32px', overflow: 'auto', minHeight: '100vh', background: 'var(--bg-base)' }}>
        {children}
      </main>
    </div>
  );
}
