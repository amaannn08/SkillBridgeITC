import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import { User } from '@/models/User';
import { Application } from '@/models/Application';
import { JobRequirement } from '@/models/JobRequirement';
import { sendEmail } from '@/lib/email';

/** Vercel Cron — runs every Monday 08:00 IST. Protected by CRON_SECRET. */
export async function GET(req: NextRequest) {
  const secret = req.headers.get('authorization')?.replace(/^Bearer\s+/i, '');
  if (process.env.CRON_SECRET && secret !== process.env.CRON_SECRET) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  try {
    await connectDB();

    const since = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

    const [newApps, openJobs, coordinators] = await Promise.all([
      Application.countDocuments({ submittedAt: { $gte: since } }),
      JobRequirement.countDocuments({ status: 'open' }),
      User.find({ role: 'coordinator', approvalStatus: 'approved' }).select('email name').lean(),
    ]);

    // Send digest to all coordinators
    let emailsSent = 0;
    for (const coord of coordinators) {
      const result = await sendEmail({
        to: coord.email,
        subject: '[SkillBridge] Weekly Platform Digest',
        html: `
          <div style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:24px">
            <h2 style="color:#1E3A5F">SkillBridge Weekly Digest</h2>
            <p>Hi ${coord.name || 'Coordinator'},</p>
            <p>Here's what happened on SkillBridge this week:</p>
            <table style="width:100%;border-collapse:collapse;margin:20px 0">
              <tr>
                <td style="padding:12px;border:1px solid #e2e8f0;background:#f8fafc">📋 Open Job Requirements</td>
                <td style="padding:12px;border:1px solid #e2e8f0;font-weight:700;color:#2563EB">${openJobs}</td>
              </tr>
              <tr>
                <td style="padding:12px;border:1px solid #e2e8f0;background:#f8fafc">📥 New Applications (7 days)</td>
                <td style="padding:12px;border:1px solid #e2e8f0;font-weight:700;color:#16A34A">${newApps}</td>
              </tr>
            </table>
            <p>
              <a href="${process.env.NEXTAUTH_URL || 'https://skillbridge.gov.in'}/coordinator/jobs" 
                 style="background:#2563EB;color:#fff;padding:12px 24px;border-radius:8px;text-decoration:none;display:inline-block">
                Browse Open Jobs →
              </a>
            </p>
            <hr style="margin:24px 0;border:none;border-top:1px solid #e2e8f0">
            <p style="font-size:12px;color:#64748b">
              You're receiving this because you're a registered coordinator on SkillBridge ITC Platform.
            </p>
          </div>
        `,
      });
      if (result.ok) emailsSent++;
    }

    return NextResponse.json({
      success: true,
      data: { emailsSent, coordinatorsTotal: coordinators.length, openJobs, newApps },
    });
  } catch (err) {
    return NextResponse.json({
      success: false,
      error: err instanceof Error ? err.message : 'Cron failed',
    }, { status: 500 });
  }
}
