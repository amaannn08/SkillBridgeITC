import connectDB from '@/lib/db';
import { Institution } from '@/models/Institution';
import { Company } from '@/models/Company';
import { Application } from '@/models/Application';

export async function HomeStats() {
  let totalInstitutions = 0;
  let totalCompanies = 0;
  let placementsFacilitated = 0;
  try {
    await connectDB();
    const [i, c, p] = await Promise.all([
      Institution.countDocuments(),
      Company.countDocuments(),
      Application.countDocuments({ status: { $in: ['shortlisting', 'closed'] } }),
    ]);
    totalInstitutions = i;
    totalCompanies = c;
    placementsFacilitated = p;
  } catch {
    /* DB unavailable — show zeros */
  }

  return (
    <div className="mx-auto mt-16 flex max-w-2xl flex-wrap justify-center gap-10 border-t border-[var(--border)] pt-12">
      {[
        { value: totalInstitutions, label: 'Institutions' },
        { value: totalCompanies, label: 'Companies' },
        { value: placementsFacilitated, label: 'Placements tracked' },
      ].map((x) => (
        <div key={x.label} className="text-center">
          <div className="text-2xl font-extrabold text-sky-400">{x.value}</div>
          <div className="text-xs text-[var(--text-muted)]">{x.label}</div>
        </div>
      ))}
    </div>
  );
}
