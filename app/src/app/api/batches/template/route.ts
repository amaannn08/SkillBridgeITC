import { NextResponse } from 'next/server';

const CSV = `Name,Roll Number,DOB (DD/MM/YYYY),Gender,CGPA,Skills (semicolon-separated),Phone,Email,Address,Languages Known (semicolon-separated),Certifications (semicolon-separated)
`;

export async function GET() {
  return new NextResponse(CSV, {
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': 'attachment; filename="batch-students-template.csv"',
    },
  });
}
