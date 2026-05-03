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

  const [jobsByState, appsByStatus, userCounts] = await Promise.all([
    JobRequirement.aggregate([
      { $match: { status: { $in: ['open', 'filled', 'closed'] } } },
      { $group: { _id: '$state', count: { $sum: 1 } } },
    ]),
    Application.aggregate([{ $group: { _id: '$status', count: { $sum: 1 } } }]),
    User.aggregate([{ $group: { _id: '$role', count: { $sum: 1 } } }]),
  ]);

  return NextResponse.json({
    success: true,
    data: {
      jobsByState,
      applicationsByStatus: appsByStatus,
      usersByRole: userCounts,
    },
  });
}
