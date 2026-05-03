import Sidebar from '@/components/Sidebar';

const nav = [
  { href: '/coordinator/dashboard', label: 'Dashboard', icon: '📊' },
  { href: '/coordinator/jobs', label: 'Browse jobs', icon: '🔍' },
  { href: '/coordinator/applications', label: 'My applications', icon: '📋' },
  { href: '/coordinator/batches', label: 'Talent batches', icon: '👥' },
  { href: '/coordinator/institution', label: 'Institution', icon: '🏛️' },
];

export default function CoordinatorLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <Sidebar title="Coordinator" subtitle="Institution" accentColor="#2563EB" role="coordinator" items={nav} />
      <main style={{ flex: 1, padding: '24px', overflow: 'auto' }}>{children}</main>
    </div>
  );
}
