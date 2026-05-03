import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import { JobRequirement } from '@/models/JobRequirement';

/**
 * Geographic job distribution — returns job counts grouped by state with lat/lng centroids.
 * Used by the admin analytics map view.
 */

const STATE_COORDS: Record<string, [number, number]> = {
  'Andhra Pradesh': [15.9129, 79.74],
  'Arunachal Pradesh': [27.1, 93.6],
  'Assam': [26.2, 92.9],
  'Bihar': [25.09, 85.31],
  'Chhattisgarh': [21.27, 81.87],
  'Goa': [15.29, 74.12],
  'Gujarat': [22.25, 71.19],
  'Haryana': [29.05, 76.09],
  'Himachal Pradesh': [31.10, 77.17],
  'Jharkhand': [23.61, 85.27],
  'Karnataka': [15.31, 75.71],
  'Kerala': [10.85, 76.27],
  'Madhya Pradesh': [22.97, 78.65],
  'Maharashtra': [19.75, 75.71],
  'Manipur': [24.66, 93.9],
  'Meghalaya': [25.46, 91.36],
  'Mizoram': [23.16, 92.93],
  'Nagaland': [26.15, 94.56],
  'Odisha': [20.94, 84.8],
  'Punjab': [31.14, 75.34],
  'Rajasthan': [27.02, 74.21],
  'Sikkim': [27.53, 88.51],
  'Tamil Nadu': [11.12, 78.65],
  'Telangana': [17.12, 79.01],
  'Tripura': [23.94, 91.98],
  'Uttar Pradesh': [26.84, 80.94],
  'Uttarakhand': [30.06, 79.54],
  'West Bengal': [22.98, 87.85],
  'Delhi': [28.63, 77.21],
  'Jammu & Kashmir': [33.77, 76.57],
  'Ladakh': [34.15, 77.57],
};

export async function GET(req: NextRequest) {
  const type = req.nextUrl.searchParams.get('type') || 'jobs';

  try {
    await connectDB();

    const grouped = await JobRequirement.aggregate([
      { $match: { status: 'open' } },
      {
        $group: {
          _id: '$state',
          jobCount: { $sum: 1 },
          totalSeats: { $sum: { $sum: '$slots.seats' } },
        },
      },
      { $sort: { jobCount: -1 } },
    ]);

    const features = grouped
      .map((g: { _id: string; jobCount: number; totalSeats: number }) => {
        const coords = STATE_COORDS[g._id];
        if (!coords) return null;
        return {
          state: g._id,
          jobCount: g.jobCount,
          totalSeats: g.totalSeats,
          lat: coords[0],
          lng: coords[1],
        };
      })
      .filter(Boolean);

    return NextResponse.json({ success: true, data: features });
  } catch {
    return NextResponse.json({ success: false, error: 'Failed to fetch map data' }, { status: 500 });
  }
}
