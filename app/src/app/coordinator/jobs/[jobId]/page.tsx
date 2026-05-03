'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { SlotBadge, StatusBadge } from '@/components/shared/Badges';
import { Modal } from '@/components/shared/Modal';
import { toast } from 'sonner';

interface Job {
  _id: string;
  title: string;
  description?: string;
  companyId?: { name?: string; sector?: string; website?: string };
  location?: string;
  state?: string;
  geographyScope?: string;
  status?: string;
  applicationDeadline?: string;
  salaryMin?: number;
  salaryMax?: number;
  experienceLevel?: string;
  skills?: string[];
  slots?: Array<{ qualification: string; branch?: string; seats: number; filledSeats?: number }>;
}

interface Batch { _id: string; name: string; qualification: string; status: string; totalStudents?: number; }

export default function JobDetailPage() {
  const { jobId } = useParams<{ jobId: string }>();
  const router = useRouter();
  const [job, setJob] = useState<Job | null>(null);
  const [batches, setBatches] = useState<Batch[]>([]);
  const [isApplied, setIsApplied] = useState(false);
  const [loading, setLoading] = useState(true);
  const [applyOpen, setApplyOpen] = useState(false);
  const [selectedBatch, setSelectedBatch] = useState('');
  const [coverNote, setCoverNote] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    Promise.all([
      fetch(`/api/jobs/${jobId}`).then(r => r.json()),
      fetch('/api/batches').then(r => r.json()),
      fetch('/api/applications').then(r => r.json()),
    ]).then(([j, b, a]) => {
      if (j.success) setJob(j.data);
      setBatches(b.success ? b.data.filter((x: Batch) => x.status === 'active') : []);
      if (a.success) {
        const alreadyApplied = a.data.some((app: { jobRequirementId?: { _id?: string } | string }) => {
          const id = app.jobRequirementId;
          return (typeof id === 'string' ? id : id?._id) === jobId;
        });
        setIsApplied(alreadyApplied);
      }
    }).catch(() => {}).finally(() => setLoading(false));
  }, [jobId]);

  async function submitApplication() {
    if (!selectedBatch) { toast.error('Select a batch'); return; }
    setSubmitting(true);
    try {
      const res = await fetch('/api/applications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ jobRequirementId: jobId, talentPoolBatchId: selectedBatch, coverNote }),
      });
      const j = await res.json();
      if (!res.ok) throw new Error(j.error || 'Failed');
      toast.success('Application submitted!');
      setIsApplied(true);
      setApplyOpen(false);
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Error');
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {[200, 120, 80].map(h => <div key={h} className="skeleton" style={{ height: h, borderRadius: 16 }} />)}
    </div>
  );

  if (!job) return (
    <div className="empty-state">
      <div className="empty-icon">🔍</div>
      <div className="empty-title">Job not found</div>
      <button className="btn btn-secondary btn-sm" style={{ margin: '12px auto', display: 'flex' }} onClick={() => router.back()}>← Go Back</button>
    </div>
  );

  return (
    <div className="fade-in">
      <button className="btn btn-ghost btn-sm" style={{ marginBottom: 20 }} onClick={() => router.back()}>← Back to Jobs</button>

      {/* Header */}
      <div className="card" style={{ padding: '28px', marginBottom: 20 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 16 }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8, flexWrap: 'wrap' }}>
              <h1 style={{ fontSize: '1.5rem', fontWeight: 800 }}>{job.title}</h1>
              {job.status && <StatusBadge status={job.status} />}
              {job.geographyScope === 'pan_india' && <span className="badge badge-navy">Pan-India</span>}
            </div>
            <div style={{ color: 'var(--text-muted)', marginBottom: 12 }}>
              <strong style={{ color: 'var(--text-secondary)' }}>{job.companyId?.name || 'Company'}</strong>
              {job.companyId?.sector && ` · ${job.companyId.sector}`}
              {job.location && ` · ${job.location}`}
              {job.state && `, ${job.state}`}
            </div>
            <SlotBadge slots={job.slots || []} />
          </div>
          <div style={{ textAlign: 'right', flexShrink: 0 }}>
            {job.salaryMin && (
              <div style={{ fontWeight: 700, fontSize: '1.1rem', color: 'var(--success)', marginBottom: 6 }}>
                ₹{job.salaryMin.toLocaleString('en-IN')} – ₹{(job.salaryMax || job.salaryMin).toLocaleString('en-IN')}/mo
              </div>
            )}
            {job.applicationDeadline && (
              <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                Deadline: <strong>{new Date(job.applicationDeadline).toLocaleDateString('en-IN')}</strong>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="grid-2" style={{ gap: 20, alignItems: 'start' }}>
        {/* Description */}
        <div className="card" style={{ padding: '24px' }}>
          <div style={{ fontWeight: 700, marginBottom: 14 }}>Job Description</div>
          <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.8, whiteSpace: 'pre-wrap' }}>
            {job.description || 'No description provided.'}
          </div>
          {job.skills && job.skills.length > 0 && (
            <div style={{ marginTop: 20 }}>
              <div style={{ fontWeight: 600, marginBottom: 10, fontSize: '0.875rem', color: 'var(--text-muted)' }}>Required Skills</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {job.skills.map(s => <span key={s} className="chip">{s}</span>)}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar info */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* Qualification Slots */}
          <div className="card" style={{ padding: '24px' }}>
            <div style={{ fontWeight: 700, marginBottom: 14 }}>Qualification Requirements</div>
            {(job.slots || []).map((s, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid var(--border)' }}>
                <div>
                  <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{s.qualification}</div>
                  {s.branch && <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{s.branch}</div>}
                </div>
                <div style={{ fontWeight: 700, color: 'var(--primary-light)' }}>{s.seats} seats</div>
              </div>
            ))}
          </div>

          {/* Company info */}
          <div className="card" style={{ padding: '24px' }}>
            <div style={{ fontWeight: 700, marginBottom: 14 }}>Company</div>
            <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
              <div style={{ marginBottom: 6 }}><strong>{job.companyId?.name}</strong></div>
              {job.companyId?.sector && <div style={{ color: 'var(--text-muted)' }}>Sector: {job.companyId.sector}</div>}
              {job.experienceLevel && <div style={{ color: 'var(--text-muted)' }}>Experience: {job.experienceLevel}</div>}
            </div>
          </div>

          {/* Apply */}
          {isApplied ? (
            <div className="alert alert-success">
              <span>✅</span>
              <div>You have already applied to this job requirement.</div>
            </div>
          ) : job.status === 'open' ? (
            <button className="btn btn-primary btn-lg" style={{ width: '100%', justifyContent: 'center' }} onClick={() => setApplyOpen(true)}>
              Apply with Talent Pool →
            </button>
          ) : (
            <div className="alert alert-warning"><span>⚠️</span><div>This job is no longer accepting applications.</div></div>
          )}
        </div>
      </div>

      {/* Apply Modal */}
      <Modal
        open={applyOpen}
        onClose={() => setApplyOpen(false)}
        title="Apply to Job Requirement"
        footer={
          <>
            <button className="btn btn-ghost" onClick={() => setApplyOpen(false)}>Cancel</button>
            <button className="btn btn-primary" onClick={submitApplication} disabled={!selectedBatch || submitting}>
              {submitting ? 'Submitting…' : 'Confirm & Submit'}
            </button>
          </>
        }
      >
        <div className="form-group" style={{ marginBottom: 14 }}>
          <label className="form-label">Select Batch <span className="required">*</span></label>
          <select className="form-select" value={selectedBatch} onChange={e => setSelectedBatch(e.target.value)}>
            <option value="">— Choose an active batch —</option>
            {batches.map(b => (
              <option key={b._id} value={b._id}>{b.name} ({b.qualification} · {b.totalStudents || 0} students)</option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label className="form-label">Cover Note</label>
          <textarea className="form-textarea" rows={3} value={coverNote} onChange={e => setCoverNote(e.target.value)} placeholder="Optional message to the recruiter…" />
        </div>
      </Modal>
    </div>
  );
}
