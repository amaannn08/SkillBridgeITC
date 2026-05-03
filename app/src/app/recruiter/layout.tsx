import Sidebar from '@/components/Sidebar';

const nav = [
  { href: '/recruiter/dashboard', label: 'Dashboard', icon: '📊' },
  { href: '/recruiter/jobs', label: 'Job requirements', icon: '📋' },
  { href: '/recruiter/jobs/new', label: 'Post job', icon: '➕' },
];

export default function RecruiterLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <Sidebar title="Recruiter" subtitle="Company" accentColor="#6366f1" role="recruiter" items={nav} />
      <main style={{ flex: 1, padding: '24px', overflow: 'auto' }}>{children}</main>
    </div>
  );
}
