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
    <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 40, maxWidth: 640, margin: '48px auto 0', paddingTop: 40, borderTop: '1px solid var(--border)' }}>
      {[
        { value: totalInstitutions, label: 'Institutions' },
        { value: totalCompanies, label: 'Companies' },
        { value: placementsFacilitated, label: 'Placements Tracked' },
      ].map((x) => (
        <div key={x.label} style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '2.25rem', fontWeight: 800, color: '#60a5fa', fontFamily: 'var(--font-plus-jakarta),sans-serif' }}>
            {x.value.toLocaleString('en-IN')}
          </div>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: 4, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            {x.label}
          </div>
        </div>
      ))}
    </div>
  );
}
