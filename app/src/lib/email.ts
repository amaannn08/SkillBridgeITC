/**
 * Email abstraction — wire Resend when RESEND_API_KEY is set.
 */

export async function sendEmail(params: {
  to: string;
  subject: string;
  html: string;
}): Promise<{ ok: boolean; error?: string }> {
  const key = process.env.RESEND_API_KEY;
  if (!key) {
    if (process.env.NODE_ENV === 'development') {
      console.info('[email:stub]', params.to, params.subject);
    }
    return { ok: true };
  }
  try {
    const { Resend } = await import('resend');
    const resend = new Resend(key);
    const from = process.env.EMAIL_FROM || 'SkillBridge <onboarding@resend.dev>';
    const { error } = await resend.emails.send({
      from,
      to: params.to,
      subject: params.subject,
      html: params.html,
    });
    if (error) return { ok: false, error: error.message };
    return { ok: true };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : 'send failed' };
  }
}
