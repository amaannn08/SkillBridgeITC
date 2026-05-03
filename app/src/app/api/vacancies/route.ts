import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import { JobRequirement } from '@/models/JobRequirement';

/**
 * Public endpoint — returns open jobs for a given state (or all pan-India jobs).
 * Used by the public landing page map/vacancy widget.
 */
export async function GET(req: NextRequest) {
  const state = req.nextUrl.searchParams.get('state');
  const qualification = req.nextUrl.searchParams.get('qualification');
  const sector = req.nextUrl.searchParams.get('sector');
  const limit = Math.min(Number(req.nextUrl.searchParams.get('limit') || '50'), 200);

  try {
    await connectDB();

    const filter: Record<string, unknown> = {
      status: 'open',
      applicationDeadline: { $gte: new Date() },
    };

    if (state) {
      filter.$or = [{ geographyScope: 'pan_india' }, { geographyScope: 'state', state }];
    }

    if (qualification) {
      filter['slots.qualification'] = qualification;
    }

    if (sector) {
      filter.sector = sector;
    }

    const jobs = await JobRequirement.find(filter)
      .populate('companyId', 'name sector')
      .select('title location state geographyScope slots applicationDeadline sector salaryMin salaryMax')
      .sort({ createdAt: -1 })
      .limit(limit)
      .lean();

    return NextResponse.json({ success: true, data: jobs, count: jobs.length });
  } catch {
    return NextResponse.json({ success: false, error: 'Failed to fetch vacancies' }, { status: 500 });
  }
}
