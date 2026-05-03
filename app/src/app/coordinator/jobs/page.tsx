'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { StatusBadge, SlotBadge } from '@/components/shared/Badges';
import { Modal } from '@/components/shared/Modal';
import { toast } from 'sonner';

interface Job {
  _id: string;
  title: string;
  description?: string;
  companyId?: { name?: string; sector?: string };
  location?: string;
  state?: string;
  geographyScope?: string;
  status?: string;
  applicationDeadline?: string;
  salaryMin?: number;
  salaryMax?: number;
  experienceLevel?: string;
  skills?: string[];
  slots?: Array<{ qualification: string; branch?: string; seats: number }>;
}

interface Batch {
  _id: string;
  name: string;
  qualification: string;
  status: string;
  totalStudents?: number;
}

interface AppliedSet { jobIds: Set<string>; }

export default function CoordinatorJobsPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [batches, setBatches] = useState<Batch[]>([]);
  const [applied, setApplied] = useState<AppliedSet>({ jobIds: new Set() });
  const [loading, setLoading] = useState(true);
  const [filterQual, setFilterQual] = useState('');
  const [filterSector, setFilterSector] = useState('');
  const [search, setSearch] = useState('');
  const [applyJob, setApplyJob] = useState<Job | null>(null);
  const [selectedBatch, setSelectedBatch] = useState('');
  const [coverNote, setCoverNote] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    Promise.all([
      fetch('/api/jobs').then(r => r.json()),
      fetch('/api/batches').then(r => r.json()),
      fetch('/api/applications').then(r => r.json()),
    ]).then(([j, b, a]) => {
      setJobs(j.success ? j.data : []);
      setBatches(b.success ? b.data.filter((x: Batch) => x.status === 'active') : []);
      if (a.success) {
        const ids = new Set<string>(a.data.map((app: { jobRequirementId?: { _id?: string } | string }) => {
          const jId = app.jobRequirementId;
          return typeof jId === 'string' ? jId : jId?._id || '';
        }));
        setApplied({ jobIds: ids });
      }
    }).catch(() => {}).finally(() => setLoading(false));
  }, []);

  async function submitApplication() {
    if (!applyJob || !selectedBatch) { toast.error('Select a batch'); return; }
    setSubmitting(true);
    try {
      const res = await fetch('/api/applications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ jobRequirementId: applyJob._id, talentPoolBatchId: selectedBatch, coverNote }),
      });
      const j = await res.json();
      if (!res.ok) throw new Error(j.error || 'Failed');
      toast.success('Application submitted!');
      setApplied(prev => ({ jobIds: new Set([...prev.jobIds, applyJob._id]) }));
      setApplyJob(null);
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Error');
    } finally {
      setSubmitting(false);
    }
  }

  const filtered = jobs.filter(j => {
    if (j.status !== 'open') return false;
    if (filterQual && !j.slots?.some(s => s.qualification === filterQual)) return false;
    if (filterSector && j.companyId?.sector !== filterSector) return false;
    if (search && !j.title.toLowerCase().includes(search.toLowerCase()) && !j.companyId?.name?.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="fade-in">
      <div className="page-header">
        <h1 className="page-title">Browse Job Requirements</h1>
        <p className="page-subtitle">Open jobs matching your institution&apos;s state and qualifications</p>
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 24, flexWrap: 'wrap' }}>
        <input className="form-input" style={{ maxWidth: 260 }} placeholder="🔍 Search jobs or companies…" value={search} onChange={e => setSearch(e.target.value)} />
        <select className="form-select" style={{ width: 'auto', minWidth: 140 }} value={filterQual} onChange={e => setFilterQual(e.target.value)}>
          <option value="">All Qualifications</option>
          {['ITI','Diploma','B.Tech','M.Tech','B.Sc','MBA','Other'].map(q => <option key={q} value={q}>{q}</option>)}
        </select>
      </div>

      {loading ? (
        <div className="grid-2" style={{ gap: 20 }}>
          {[...Array(4)].map((_, i) => <div key={i} className="skeleton" style={{ height: 200, borderRadius: 16 }} />)}
        </div>
      ) : filtered.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">🔍</div>
          <div className="empty-title">No jobs found</div>
          <div className="empty-desc">Try adjusting filters or check back later</div>
        </div>
      ) : (
        <div className="grid-2" style={{ gap: 20 }}>
          {filtered.map(job => {
            const isApplied = applied.jobIds.has(job._id);
            const daysLeft = job.applicationDeadline ? Math.ceil((new Date(job.applicationDeadline).getTime() - Date.now()) / 86400000) : null;
            return (
              <div key={job._id} className="card" style={{ padding: '20px', position: 'relative' }}>
                {isApplied && (
                  <div style={{ position: 'absolute', top: 14, right: 14 }}>
                    <span className="badge badge-green">✓ Applied</span>
                  </div>
                )}
                <div style={{ marginBottom: 10, paddingRight: isApplied ? 80 : 0 }}>
                  <div style={{ fontWeight: 700, fontSize: '1.0625rem', marginBottom: 4, color: 'var(--text-primary)' }}>{job.title}</div>
                  <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: 8 }}>
                    {job.companyId?.name || 'Company'} &nbsp;·&nbsp; {job.location || job.state || '—'}
                  </div>
                  <SlotBadge slots={job.slots || []} />
                </div>

                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 10, marginBottom: 14, fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  {job.geographyScope === 'pan_india' && <span className="badge badge-navy">Pan-India</span>}
                  {job.experienceLevel && <span className="badge badge-gray">{job.experienceLevel}</span>}
                  {job.salaryMin && <span>₹{job.salaryMin.toLocaleString('en-IN')} – ₹{(job.salaryMax || job.salaryMin).toLocaleString('en-IN')}/mo</span>}
                  {daysLeft !== null && (
                    <span style={{ color: daysLeft <= 3 ? 'var(--warning)' : 'var(--text-muted)' }}>
                      {daysLeft > 0 ? `${daysLeft}d left` : 'Deadline passed'}
                    </span>
                  )}
                </div>

                <div style={{ display: 'flex', gap: 10 }}>
                  <Link href={`/coordinator/jobs/${job._id}`} className="btn btn-secondary btn-sm" style={{ flex: 1, justifyContent: 'center' }}>
                    View Details
                  </Link>
                  {!isApplied && (
                    <button className="btn btn-primary btn-sm" style={{ flex: 1, justifyContent: 'center' }} onClick={() => { setApplyJob(job); setSelectedBatch(''); setCoverNote(''); }}>
                      Apply Now
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Apply Modal */}
      <Modal
        open={!!applyJob}
        onClose={() => setApplyJob(null)}
        title={`Apply to: ${applyJob?.title || ''}`}
        footer={
          <>
            <button className="btn btn-ghost" onClick={() => setApplyJob(null)}>Cancel</button>
            <button className="btn btn-primary" onClick={submitApplication} disabled={!selectedBatch || submitting}>
              {submitting ? 'Submitting…' : 'Submit Application'}
            </button>
          </>
        }
      >
        <div className="alert alert-info" style={{ marginBottom: 16 }}>
          <span>ℹ️</span>
          <div>{applyJob?.companyId?.name} &nbsp;·&nbsp; {applyJob?.location || applyJob?.state}</div>
        </div>
        <div className="form-group" style={{ marginBottom: 14 }}>
          <label className="form-label">Select Talent Pool Batch <span className="required">*</span></label>
          <select className="form-select" value={selectedBatch} onChange={e => setSelectedBatch(e.target.value)}>
            <option value="">— Choose an active batch —</option>
            {batches.map(b => (
              <option key={b._id} value={b._id}>{b.name} ({b.qualification} · {b.totalStudents || 0} students)</option>
            ))}
          </select>
          {batches.length === 0 && <span className="form-hint">No active batches. <a href="/coordinator/batches/new" style={{ color: 'var(--primary-light)' }}>Create one first.</a></span>}
        </div>
        <div className="form-group">
          <label className="form-label">Cover Note (optional)</label>
          <textarea className="form-textarea" rows={3} placeholder="Add a message to the recruiter…" value={coverNote} onChange={e => setCoverNote(e.target.value)} />
        </div>
      </Modal>
    </div>
  );
}
