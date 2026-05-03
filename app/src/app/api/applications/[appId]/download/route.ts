import { NextRequest, NextResponse } from 'next/server';
import { PassThrough } from 'stream';
import archiver from 'archiver';
import { auth } from '@/lib/auth';
import { requireApprovedSession } from '@/lib/require-approved';
import connectDB from '@/lib/db';
import { Application } from '@/models/Application';
import { TalentPoolBatch } from '@/models/TalentPoolBatch';
import { JobRequirement } from '@/models/JobRequirement';
import { getResumeBuffer } from '@/lib/storage';

export async function GET(
  req: NextRequest,
  ctx: { params: Promise<{ appId: string }> }
) {
  const session = await auth();
  const gate = await requireApprovedSession(session);
  if (gate.error) return gate.error;
  const user = gate.user!;
  if (user.role !== 'recruiter') {
    return NextResponse.json({ success: false, error: 'Forbidden' }, { status: 403 });
  }

  const { appId } = await ctx.params;
  const filter = req.nextUrl.searchParams.get('filter') || 'all';

  await connectDB();
  const app = await Application.findById(appId);
  if (!app || String(app.companyId) !== String(user.companyId)) {
    return NextResponse.json({ success: false, error: 'Forbidden' }, { status: 403 });
  }

  const batch = await TalentPoolBatch.findById(app.talentPoolBatchId);
  const job = await JobRequirement.findById(app.jobRequirementId);
  if (!batch || !job) {
    return NextResponse.json({ success: false, error: 'Invalid application' }, { status: 400 });
  }

  const archive = archiver('zip', { zlib: { level: 6 } });
  const pass = new PassThrough();
  const chunks: Buffer[] = [];
  pass.on('data', (c: Buffer) => chunks.push(c));

  const zipReady = new Promise<Buffer>((resolve, reject) => {
    pass.on('end', () => resolve(Buffer.concat(chunks)));
    pass.on('error', reject);
    archive.on('error', reject);
  });

  archive.pipe(pass);

  for (const row of app.studentStatuses) {
    if (filter === 'shortlisted' && row.status !== 'shortlisted' && row.status !== 'selected') {
      continue;
    }
    const st = batch.students.id(row.studentId);
    if (!st?.resumeUrl) continue;
    const buf = await getResumeBuffer(st.resumeUrl);
    if (!buf) continue;
    const fname = `${st.rollNumber}_${String(st.name).replace(/\s+/g, '_')}.pdf`;
    archive.append(buf, { name: fname });
  }

  await archive.finalize();
  const zipBuffer = await zipReady;

  const filename = `resumes_${String(job.title).replace(/\s+/g, '_')}_${Date.now()}.zip`;
  return new NextResponse(new Uint8Array(zipBuffer), {
    headers: {
      'Content-Type': 'application/zip',
      'Content-Disposition': `attachment; filename="${filename}"`,
    },
  });
}
