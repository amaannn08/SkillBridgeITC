import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import Sidebar from '@/components/Sidebar';

const nav = [
  { href: '/recruiter/dashboard', label: 'Dashboard', icon: '📊' },
  { href: '/recruiter/jobs', label: 'Job Requirements', icon: '📋' },
  { href: '/recruiter/jobs/new', label: 'Post New Job', icon: '➕' },
  { href: '/recruiter/company', label: 'Company Profile', icon: '🏭' },
];

export default async function RecruiterLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session?.user) redirect('/login');
  if (session.user.approvalStatus !== 'approved') redirect('/pending');
  if (session.user.role !== 'recruiter') redirect('/unauthorized');

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <Sidebar
        title={session.user.name || 'Recruiter'}
        subtitle={session.user.email || ''}
        accentColor="#6366f1"
        accentGradient="linear-gradient(135deg,#6366f1,#4f46e5)"
        role="recruiter"
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
