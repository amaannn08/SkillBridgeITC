import fs from 'fs/promises';
import path from 'path';

function uploadBase() {
  return path.join(process.cwd(), 'uploads', 'resumes');
}

/** Logical key: `{institutionId}/{batchId}/{filename}` — never expose raw paths to clients */
export async function saveResumePdf(params: {
  institutionId: string;
  batchId: string;
  studentId: string;
  buffer: Buffer;
}): Promise<{ storageKey: string }> {
  const segment = `${params.institutionId}/${params.batchId}`;
  const dir = path.join(uploadBase(), segment);
  await fs.mkdir(dir, { recursive: true });
  const filename = `${params.studentId}_${Date.now()}.pdf`;
  const full = path.join(dir, filename);
  await fs.writeFile(full, params.buffer);
  return { storageKey: `${segment}/${filename}` };
}

export async function getResumeBuffer(storageKey: string): Promise<Buffer | null> {
  try {
    const full = path.join(uploadBase(), storageKey.replace(/^\/+/, ''));
    return await fs.readFile(full);
  } catch {
    return null;
  }
}
