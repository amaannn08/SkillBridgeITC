import { NextRequest, NextResponse } from 'next/server';
import Papa from 'papaparse';
import { auth } from '@/lib/auth';
import { requireApprovedSession } from '@/lib/require-approved';
import connectDB from '@/lib/db';
import { TalentPoolBatch } from '@/models/TalentPoolBatch';

export async function POST(
  req: NextRequest,
  ctx: { params: Promise<{ batchId: string }> }
) {
  const session = await auth();
  const gate = await requireApprovedSession(session);
  if (gate.error) return gate.error;
  const user = gate.user!;
  const { batchId } = await ctx.params;

  // Accept both raw CSV text and multipart FormData
  const contentType = req.headers.get('content-type') || '';
  let csvText: string;

  if (contentType.includes('multipart/form-data')) {
    const form = await req.formData();
    const file = form.get('file') as File | null;
    if (!file) {
      return NextResponse.json({ success: false, error: 'No CSV file uploaded' }, { status: 422 });
    }
    csvText = await file.text();
  } else {
    csvText = await req.text();
  }

  await connectDB();
  const batch = await TalentPoolBatch.findById(batchId);
  if (!batch || String(batch.coordinatorId) !== String(user._id)) {
    return NextResponse.json({ success: false, error: 'Forbidden' }, { status: 403 });
  }

  const parsed = Papa.parse<Record<string, string>>(csvText, { header: true, skipEmptyLines: true });
  const errors: string[] = [];
  let added = 0;
  for (const row of parsed.data) {
    const name = row['Name']?.trim();
    const roll = row['Roll Number']?.trim();
    if (!name || !roll) {
      errors.push(`Row ${added + errors.length + 1}: missing Name or Roll Number`);
      continue;
    }
    batch.students.push({
      name,
      rollNumber: roll,
      dob: row['DOB (DD/MM/YYYY)'] ? new Date(row['DOB (DD/MM/YYYY)'].split('/').reverse().join('-')) : undefined,
      cgpa: row['CGPA'] ? Number(row['CGPA']) : undefined,
      gender: (row['Gender'] as 'Male' | 'Female' | 'Other') || undefined,
      skills: row['Skills'] ? row['Skills'].split(';').map((s) => s.trim()).filter(Boolean) : [],
      phone: row['Phone'] || undefined,
      email: row['Email'] || undefined,
      address: row['Address'] || undefined,
      languagesKnown: row['Languages Known']
        ? row['Languages Known'].split(';').map((s) => s.trim()).filter(Boolean)
        : [],
      certifications: row['Certifications']
        ? row['Certifications'].split(';').map((s) => s.trim()).filter(Boolean)
        : [],
    });
    added++;
    if (added >= 500) break;
  }

  await batch.save();
  return NextResponse.json({ success: true, data: { inserted: added, errors } });
}
