import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import Sidebar from '@/components/Sidebar';

const nav = [
  { href: '/coordinator/dashboard', label: 'Dashboard', icon: '📊' },
  { href: '/coordinator/jobs', label: 'Browse Jobs', icon: '🔍' },
  { href: '/coordinator/applications', label: 'My Applications', icon: '📋' },
  { href: '/coordinator/batches', label: 'Talent Batches', icon: '👥' },
  { href: '/coordinator/institution', label: 'Institution Profile', icon: '🏛️' },
];

export default async function CoordinatorLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session?.user) redirect('/login');
  if (session.user.approvalStatus !== 'approved') redirect('/pending');
  if (session.user.role !== 'coordinator') redirect('/unauthorized');

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <Sidebar
        title={session.user.name || 'Coordinator'}
        subtitle={session.user.email || ''}
        accentColor="#2563EB"
        accentGradient="linear-gradient(135deg,#2563EB,#1E3A5F)"
        role="coordinator"
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
