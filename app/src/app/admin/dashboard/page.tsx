import connectDB from '@/lib/db';
import { User } from '@/models/User';
import { JobRequirement } from '@/models/JobRequirement';
import { Application } from '@/models/Application';

export default async function AdminDashboardPage() {
  await connectDB();
  const [pending, coordinators, recruiters, jobs, apps] = await Promise.all([
    User.countDocuments({ approvalStatus: 'pending' }),
    User.countDocuments({ role: 'coordinator', approvalStatus: 'approved' }),
    User.countDocuments({ role: 'recruiter', approvalStatus: 'approved' }),
    JobRequirement.countDocuments(),
    Application.countDocuments(),
  ]);

  const cards = [
    { label: 'Pending approvals', value: pending },
    { label: 'Coordinators', value: coordinators },
    { label: 'Recruiters', value: recruiters },
    { label: 'Job postings', value: jobs },
    { label: 'Applications', value: apps },
  ];

  return (
    <div>
      <h1 className="mb-8 text-2xl font-bold">Admin dashboard</h1>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map((c) => (
          <div key={c.label} className="card p-6">
            <div className="text-sm text-[var(--text-muted)]">{c.label}</div>
            <div className="mt-2 text-3xl font-bold text-sky-400">{c.value}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
