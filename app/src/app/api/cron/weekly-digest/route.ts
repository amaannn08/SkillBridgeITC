import { NextRequest, NextResponse } from 'next/server';

/** Hook for Vercel Cron — extend with coordinator digest emails. */
export async function GET(req: NextRequest) {
  const secret = req.headers.get('authorization')?.replace(/^Bearer\s+/i, '');
  if (process.env.CRON_SECRET && secret !== process.env.CRON_SECRET) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }
  return NextResponse.json({ success: true, data: { message: 'Weekly digest placeholder' } });
}
