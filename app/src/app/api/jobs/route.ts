import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { requireApprovedSession } from '@/lib/require-approved';
import connectDB from '@/lib/db';
import { JobRequirement } from '@/models/JobRequirement';
import { Institution } from '@/models/Institution';
import DOMPurify from 'isomorphic-dompurify';

export async function GET() {
  const session = await auth();
  const gate = await requireApprovedSession(session);
  if (gate.error) return gate.error;
  const user = gate.user!;

  await connectDB();

  if (user.role === 'recruiter') {
    const jobs = await JobRequirement.find({ companyId: user.companyId }).sort({ updatedAt: -1 }).lean();
    return NextResponse.json({ success: true, data: jobs });
  }

  if (user.role === 'super_admin') {
    const jobs = await JobRequirement.find({}).sort({ updatedAt: -1 }).limit(300).lean();
    return NextResponse.json({ success: true, data: jobs });
  }

  // coordinator
  const inst = await Institution.findById(user.institutionId);
  const state = inst?.state || user.state;
  if (!state) {
    return NextResponse.json({ success: true, data: [] });
  }

  const jobs = await JobRequirement.find({
    status: 'open',
    applicationDeadline: { $gte: new Date() },
    $or: [{ geographyScope: 'pan_india' }, { geographyScope: 'state', state }],
  })
    .populate('companyId')
    .sort({ createdAt: -1 })
    .lean();

  return NextResponse.json({ success: true, data: jobs });
}

export async function POST(req: NextRequest) {
  const session = await auth();
  const gate = await requireApprovedSession(session);
  if (gate.error) return gate.error;
  const user = gate.user!;
  if (user.role !== 'recruiter') {
    return NextResponse.json({ success: false, error: 'Insufficient permissions' }, { status: 403 });
  }

  const body = await req.json();
  const {
    title,
    description,
    location,
    state,
    geographyScope,
    slots,
    salaryMin,
    salaryMax,
    applicationDeadline,
    sector,
    skills,
    experienceLevel,
    status: statusIn,
  } = body;

  if (!title || !description || !Array.isArray(slots) || slots.length < 1) {
    return NextResponse.json({ success: false, error: 'Invalid job payload' }, { status: 422 });
  }

  const cleanDescription = DOMPurify.sanitize(String(description));

  await connectDB();
  const job = await JobRequirement.create({
    companyId: user.companyId!,
    postedBy: user._id,
    title,
    description: cleanDescription,
    location: location || state,
    state: state || 'India',
    geographyScope: geographyScope === 'pan_india' ? 'pan_india' : 'state',
    slots: slots.map((s: { qualification: string; branch?: string; seats: number }) => ({
      qualification: s.qualification,
      branch: s.branch || '',
      seats: Number(s.seats) || 0,
      filledSeats: 0,
    })),
    salaryMin: salaryMin != null ? Number(salaryMin) : undefined,
    salaryMax: salaryMax != null ? Number(salaryMax) : undefined,
    applicationDeadline: new Date(applicationDeadline),
    status: statusIn === 'draft' ? 'draft' : 'open',
    sector: sector || 'Other',
    skills: Array.isArray(skills) ? skills : [],
    experienceLevel: experienceLevel || 'fresher',
  });

  return NextResponse.json({ success: true, data: job }, { status: 201 });
}
