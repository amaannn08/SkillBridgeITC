import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { requireApprovedSession } from '@/lib/require-approved';
import connectDB from '@/lib/db';
import { Application } from '@/models/Application';
import mongoose from 'mongoose';

const FeedbackSchema = new mongoose.Schema({
  applicationId: { type: mongoose.Schema.Types.ObjectId, ref: 'Application', required: true },
  coordinatorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  companyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Company', required: true },
  rating: { type: Number, min: 1, max: 5, required: true },
  communicationRating: { type: Number, min: 1, max: 5 },
  processRating: { type: Number, min: 1, max: 5 },
  comment: { type: String, maxlength: 1000 },
  wouldRecommend: { type: Boolean },
  createdAt: { type: Date, default: Date.now },
}, { collection: 'feedback' });

const Feedback = mongoose.models.Feedback || mongoose.model('Feedback', FeedbackSchema);

export async function POST(req: NextRequest) {
  const session = await auth();
  const gate = await requireApprovedSession(session);
  if (gate.error) return gate.error;
  const user = gate.user!;
  if (user.role !== 'coordinator') {
    return NextResponse.json({ success: false, error: 'Only coordinators can submit feedback' }, { status: 403 });
  }

  const body = await req.json();
  const { applicationId, rating, communicationRating, processRating, comment, wouldRecommend } = body;

  if (!applicationId || !rating || rating < 1 || rating > 5) {
    return NextResponse.json({ success: false, error: 'applicationId and rating (1-5) required' }, { status: 422 });
  }

  await connectDB();
  const app = await Application.findById(applicationId);
  if (!app || String(app.coordinatorId) !== String(user._id)) {
    return NextResponse.json({ success: false, error: 'Application not found or forbidden' }, { status: 403 });
  }

  // Check not already submitted
  const existing = await Feedback.findOne({ applicationId, coordinatorId: user._id });
  if (existing) {
    return NextResponse.json({ success: false, error: 'Feedback already submitted for this application' }, { status: 409 });
  }

  const fb = await Feedback.create({
    applicationId,
    coordinatorId: user._id,
    companyId: app.companyId,
    rating,
    communicationRating,
    processRating,
    comment,
    wouldRecommend,
  });

  return NextResponse.json({ success: true, data: fb }, { status: 201 });
}

export async function GET(req: NextRequest) {
  const session = await auth();
  const gate = await requireApprovedSession(session);
  if (gate.error) return gate.error;
  const user = gate.user!;

  await connectDB();

  const appId = req.nextUrl.searchParams.get('applicationId');
  if (user.role === 'coordinator') {
    const filter: Record<string, unknown> = { coordinatorId: user._id };
    if (appId) filter.applicationId = appId;
    const fb = await Feedback.find(filter).sort({ createdAt: -1 }).lean();
    return NextResponse.json({ success: true, data: fb });
  }

  if (user.role === 'recruiter' && user.companyId) {
    const fb = await Feedback.find({ companyId: user.companyId }).sort({ createdAt: -1 }).lean();
    return NextResponse.json({ success: true, data: fb });
  }

  if (user.role === 'super_admin') {
    const fb = await Feedback.find({}).limit(200).sort({ createdAt: -1 }).lean();
    return NextResponse.json({ success: true, data: fb });
  }

  return NextResponse.json({ success: false, error: 'Forbidden' }, { status: 403 });
}
