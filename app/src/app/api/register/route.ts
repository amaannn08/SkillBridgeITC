import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import connectDB from '@/lib/db';
import { User } from '@/models/User';
import { Institution } from '@/models/Institution';
import { Company } from '@/models/Company';
import { registerBodySchema } from '@/lib/validators/register';
import { notifySuperAdmins } from '@/lib/notify';
import { sendEmail } from '@/lib/email';

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      return NextResponse.json({ success: false, error: 'Authentication required' }, { status: 401 });
    }

    if (!session.user.needsRegistration) {
      const u = await User.findOne({ email: session.user.email.toLowerCase() });
      if (u?.approvalStatus === 'approved') {
        return NextResponse.json({ success: false, error: 'Already registered' }, { status: 409 });
      }
    }

    const raw = await req.json();
    const parsed = registerBodySchema.safeParse(raw);
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: 'Validation failed', errors: parsed.error.flatten() },
        { status: 422 }
      );
    }

    const body = parsed.data;
    await connectDB();

    const email = session.user.email.toLowerCase();
    const googleIdFromSession = session.user.id?.startsWith('pending:')
      ? session.user.id.slice('pending:'.length)
      : undefined;

    let institutionId = undefined as unknown as undefined | import('mongoose').Types.ObjectId;
    let companyId = undefined as unknown as undefined | import('mongoose').Types.ObjectId;

    if (body.role === 'coordinator') {
      const inst = await Institution.create({
        name: body.institutionName,
        type: body.institutionType,
        aicteCode: body.aicteCode,
        state: body.state,
        district: body.district,
      });
      institutionId = inst._id;
    } else {
      const domain = body.companyEmailDomain.replace(/^@/, '').toLowerCase();
      let comp = await Company.findOne({ emailDomain: domain });
      if (!comp) {
        comp = await Company.create({
          name: body.companyName,
          emailDomain: domain,
          website: body.companyWebsite || undefined,
          sector: body.sector,
        });
      }
      companyId = comp._id;
    }

    let user = await User.findOne({ email });
    const payload = {
      googleId: googleIdFromSession ?? user?.googleId,
      email,
      name: body.fullName,
      profileImage: session.user.image || undefined,
      role: body.role as 'coordinator' | 'recruiter',
      approvalStatus: 'pending' as const,
      institutionId,
      companyId,
      phone: body.phone,
      designation: body.designation,
      state: body.role === 'coordinator' ? body.state : undefined,
    };

    if (user) {
      Object.assign(user, payload);
      await user.save();
    } else {
      user = await User.create(payload);
    }

    if (institutionId && user._id) {
      await Institution.findByIdAndUpdate(institutionId, { coordinatorId: user._id });
    }

    await notifySuperAdmins({
      type: 'registration_pending',
      message: `New ${body.role} registration: ${body.fullName} (${email})`,
      link: '/admin/approvals',
    });

    const adminEmail = process.env.ADMIN_EMAIL;
    if (adminEmail) {
      await sendEmail({
        to: adminEmail,
        subject: '[SkillBridge] New registration pending approval',
        html: `<p>${body.fullName} (${body.role}) registered.</p>`,
      });
    }

    return NextResponse.json({ success: true, data: { message: 'Registration submitted' } });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Server error';
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}
