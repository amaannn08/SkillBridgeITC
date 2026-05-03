import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import { JobRequirement } from '@/models/JobRequirement';
import { Application } from '@/models/Application';
import { User } from '@/models/User';

/**
 * Public statistics endpoint — for landing page counters and admin overview.
 */
export async function GET() {
  try {
    await connectDB();

    const [
      openJobs,
      totalApplications,
      coordinators,
      recruiters,
      jobsByState,
      jobsBySector,
    ] = await Promise.all([
      JobRequirement.countDocuments({ status: 'open' }),
      Application.countDocuments(),
      User.countDocuments({ role: 'coordinator', approvalStatus: 'approved' }),
      User.countDocuments({ role: 'recruiter', approvalStatus: 'approved' }),
      JobRequirement.aggregate([
        { $match: { status: 'open' } },
        { $group: { _id: '$state', count: { $sum: 1 }, totalSeats: { $sum: { $sum: '$slots.seats' } } } },
        { $sort: { count: -1 } },
        { $limit: 20 },
      ]),
      JobRequirement.aggregate([
        { $group: { _id: '$sector', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 10 },
      ]),
    ]);

    return NextResponse.json({
      success: true,
      data: {
        openJobs,
        totalApplications,
        coordinators,
        recruiters,
        jobsByState: jobsByState.map((x: { _id: string; count: number; totalSeats: number }) => ({
          state: x._id || 'Unknown',
          count: x.count,
          totalSeats: x.totalSeats,
        })),
        jobsBySector: jobsBySector.map((x: { _id: string; count: number }) => ({
          sector: x._id || 'Other',
          count: x.count,
        })),
      },
    });
  } catch {
    return NextResponse.json({
      success: true,
      data: { openJobs: 0, totalApplications: 0, coordinators: 0, recruiters: 0, jobsByState: [], jobsBySector: [] },
    });
  }
}
