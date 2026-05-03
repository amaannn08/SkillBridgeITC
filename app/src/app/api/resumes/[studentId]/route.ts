import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import { auth } from '@/lib/auth';
import connectDB from '@/lib/db';
import { TalentPoolBatch } from '@/models/TalentPoolBatch';
import { Application } from '@/models/Application';
import { User } from '@/models/User';
import { getResumeBuffer } from '@/lib/storage';

export async function GET(
  _req: Request,
  ctx: { params: Promise<{ studentId: string }> }
) {
  const session = await auth();
  if (!session?.user?.email) {
    return NextResponse.json({ success: false, error: 'Authentication required' }, { status: 401 });
  }
  const { studentId } = await ctx.params;
  await connectDB();
  const user = await User.findOne({ email: session.user.email.toLowerCase() });
  if (!user) return NextResponse.json({ success: false, error: 'Forbidden' }, { status: 403 });

  const sid = new mongoose.Types.ObjectId(studentId);
  const batch = await TalentPoolBatch.findOne({ 'students._id': sid });
  if (!batch) return NextResponse.json({ success: false, error: 'Not found' }, { status: 404 });

  const sub = batch.students.id(sid);
  if (!sub?.resumeUrl) return NextResponse.json({ success: false, error: 'No resume' }, { status: 404 });

  let allowed = false;
  if (user.role === 'coordinator' && String(batch.coordinatorId) === String(user._id)) {
    allowed = true;
  }
  if (user.role === 'recruiter') {
    const app = await Application.findOne({
      talentPoolBatchId: batch._id,
      companyId: user.companyId,
    });
    if (app) allowed = true;
  }
  if (user.role === 'super_admin') allowed = true;

  if (!allowed) return NextResponse.json({ success: false, error: 'Forbidden' }, { status: 403 });

  const buf = await getResumeBuffer(sub.resumeUrl);
  if (!buf) return NextResponse.json({ success: false, error: 'File missing' }, { status: 404 });

  return new NextResponse(new Uint8Array(buf), {
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `inline; filename="${sub.resumeOriginalName || 'resume.pdf'}"`,
    },
  });
}
