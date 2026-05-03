import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import { Institution } from '@/models/Institution';
import { Company } from '@/models/Company';
import { Application } from '@/models/Application';

export async function GET() {
  try {
    await connectDB();
    const [institutions, companies, applications] = await Promise.all([
      Institution.countDocuments(),
      Company.countDocuments(),
      Application.countDocuments({ status: { $in: ['shortlisting', 'closed'] } }),
    ]);
    return NextResponse.json({
      success: true,
      data: {
        totalInstitutions: institutions,
        totalCompanies: companies,
        placementsFacilitated: applications,
      },
    });
  } catch {
    return NextResponse.json({
      success: true,
      data: { totalInstitutions: 0, totalCompanies: 0, placementsFacilitated: 0 },
    });
  }
}
