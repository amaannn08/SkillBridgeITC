import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import { JobRequirement } from '@/models/JobRequirement';
import { Application } from '@/models/Application';
import { User } from '@/models/User';
import { requireRole } from '@/lib/api-auth';

export async function GET() {
  const gate = await requireRole('super_admin');
  if (gate.error) return gate.error;

  await connectDB();

  const [
    jobsByStateRaw,
    jobsBySectorRaw,
    appsByStatus,
    userCounts,
    totalJobs,
    totalApps,
    companiesRaw,
  ] = await Promise.all([
    JobRequirement.aggregate([
      { $match: { status: { $in: ['open', 'filled', 'closed'] } } },
      { $group: { _id: '$state', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]),
    JobRequirement.aggregate([
      { $group: { _id: '$sector', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]),
    Application.aggregate([{ $group: { _id: '$status', count: { $sum: 1 } } }]),
    User.aggregate([
      { $match: { approvalStatus: 'approved' } },
      { $group: { _id: '$role', count: { $sum: 1 } } },
    ]),
    JobRequirement.countDocuments(),
    Application.countDocuments(),
    JobRequirement.aggregate([
      { $group: { _id: '$companyId', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 },
      {
        $lookup: {
          from: 'companies',
          localField: '_id',
          foreignField: '_id',
          as: 'company',
        },
      },
      { $unwind: { path: '$company', preserveNullAndEmptyArrays: true } },
    ]),
  ]);

  // Normalize for frontend
  const jobsByState = jobsByStateRaw.map((x: { _id: string; count: number }) => ({ state: x._id || 'Unknown', count: x.count }));
  const jobsBySector = jobsBySectorRaw.map((x: { _id: string; count: number }) => ({ sector: x._id || 'Other', count: x.count }));

  const statusMap: Record<string, number> = {};
  for (const row of appsByStatus as { _id: string; count: number }[]) statusMap[row._id] = row.count;
  const shortlisted = statusMap['shortlisting'] || 0;
  const selected = statusMap['closed'] || 0;

  const roleMap: Record<string, number> = {};
  for (const row of userCounts as { _id: string; count: number }[]) roleMap[row._id] = row.count;

  const topCompanies = companiesRaw.map((x: { company?: { name?: string }; count: number }) => ({
    name: x.company?.name || 'Unknown',
    jobs: x.count,
  }));

  const placementFunnel = [
    { name: 'Applications Submitted', value: totalApps, fill: '#2563EB' },
    { name: 'Under Review', value: (statusMap['under_review'] || 0) + shortlisted, fill: '#f97316' },
    { name: 'Shortlisted', value: shortlisted, fill: '#16A34A' },
    { name: 'Selected', value: selected, fill: '#10b981' },
  ];

  return NextResponse.json({
    success: true,
    data: {
      jobsByState,
      jobsBySector,
      placementFunnel,
      topCompanies,
      topInstitutions: [],
      totals: {
        jobs: totalJobs,
        apps: totalApps,
        shortlisted,
        selected,
        coordinators: roleMap['coordinator'] || 0,
        recruiters: roleMap['recruiter'] || 0,
      },
    },
  });
}
