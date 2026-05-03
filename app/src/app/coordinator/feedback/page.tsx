'use client';

import { useEffect, useState, FormEvent } from 'react';
import { StatusBadge } from '@/components/shared/Badges';
import { Modal } from '@/components/shared/Modal';
import { toast } from 'sonner';
import { formatDistanceToNow } from 'date-fns';

interface Application {
  _id: string;
  status: string;
  submittedAt: string;
  jobRequirementId?: { title?: string };
  companyId?: { name?: string };
}

interface Feedback {
  _id: string;
  applicationId: string;
  rating: number;
  communicationRating?: number;
  processRating?: number;
  comment?: string;
  wouldRecommend?: boolean;
  createdAt: string;
}

function StarRating({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  const [hover, setHover] = useState(0);
  return (
    <div style={{ display: 'flex', gap: 4 }}>
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => onChange(star)}
          onMouseEnter={() => setHover(star)}
          onMouseLeave={() => setHover(0)}
          style={{
            background: 'none', border: 'none', cursor: 'pointer',
            fontSize: '1.5rem', lineHeight: 1,
            color: star <= (hover || value) ? '#fbbf24' : 'var(--border-light)',
            transition: 'color 0.15s',
          }}
        >
          ★
        </button>
      ))}
    </div>
  );
}

export default function CoordinatorFeedbackPage() {
  const [apps, setApps] = useState<Application[]>([]);
  const [feedbacks, setFeedbacks] = useState<Record<string, Feedback>>({});
  const [loading, setLoading] = useState(true);
  const [activeApp, setActiveApp] = useState<Application | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Form state
  const [rating, setRating] = useState(0);
  const [commRating, setCommRating] = useState(0);
  const [processRating, setProcessRating] = useState(0);
  const [comment, setComment] = useState('');
  const [wouldRecommend, setWouldRecommend] = useState<boolean | null>(null);

  useEffect(() => {
    Promise.all([
      fetch('/api/applications').then(r => r.json()),
      fetch('/api/feedback').then(r => r.json()),
    ]).then(([a, f]) => {
      // Only show closed/completed applications
      const closedApps = (a.success ? a.data : []).filter(
        (app: Application) => ['shortlisting', 'closed'].includes(app.status)
      );
      setApps(closedApps);
      // Map existing feedbacks by applicationId
      if (f.success) {
        const map: Record<string, Feedback> = {};
        for (const fb of f.data as Feedback[]) map[fb.applicationId] = fb;
        setFeedbacks(map);
      }
    }).catch(() => {}).finally(() => setLoading(false));
  }, []);

  function openModal(app: Application) {
    setActiveApp(app);
    setRating(0); setCommRating(0); setProcessRating(0);
    setComment(''); setWouldRecommend(null);
  }

  async function submitFeedback(e: FormEvent) {
    e.preventDefault();
    if (!activeApp || rating < 1) { toast.error('Please select an overall rating'); return; }
    setSubmitting(true);
    try {
      const res = await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          applicationId: activeApp._id,
          rating,
          communicationRating: commRating || undefined,
          processRating: processRating || undefined,
          comment: comment.trim() || undefined,
          wouldRecommend: wouldRecommend !== null ? wouldRecommend : undefined,
        }),
      });
      const j = await res.json();
      if (!res.ok) throw new Error(j.error || 'Failed');
      toast.success('Feedback submitted! Thank you.');
      setFeedbacks(prev => ({ ...prev, [activeApp._id]: j.data }));
      setActiveApp(null);
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Error');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="fade-in">
      <div className="page-header">
        <h1 className="page-title">Placement Feedback</h1>
        <p className="page-subtitle">Rate your experience with recruiters after application review</p>
      </div>

      {loading ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {[...Array(3)].map((_, i) => <div key={i} className="skeleton" style={{ height: 80, borderRadius: 16 }} />)}
        </div>
      ) : apps.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">💬</div>
          <div className="empty-title">No applications to review yet</div>
          <div className="empty-desc">Feedback becomes available after your applications are reviewed by recruiters</div>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {apps.map(app => {
            const fb = feedbacks[app._id];
            return (
              <div key={app._id} className="card" style={{ padding: '18px 22px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
                <div>
                  <div style={{ fontWeight: 700, marginBottom: 6 }}>{app.jobRequirementId?.title || 'Job Application'}</div>
                  <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
                    <StatusBadge status={app.status} />
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                      {formatDistanceToNow(new Date(app.submittedAt), { addSuffix: true })}
                    </span>
                    {fb && (
                      <span style={{ fontSize: '0.875rem', color: '#fbbf24' }}>
                        {'★'.repeat(fb.rating)}{'☆'.repeat(5 - fb.rating)} Feedback submitted
                      </span>
                    )}
                  </div>
                </div>
                <div>
                  {fb ? (
                    <span className="badge badge-green">✓ Done</span>
                  ) : (
                    <button className="btn btn-primary btn-sm" onClick={() => openModal(app)}>
                      💬 Give Feedback
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Feedback Modal */}
      <Modal
        open={!!activeApp}
        onClose={() => setActiveApp(null)}
        title={`Feedback: ${activeApp?.jobRequirementId?.title || 'Application'}`}
        size="md"
        footer={
          <>
            <button className="btn btn-ghost" type="button" onClick={() => setActiveApp(null)}>Cancel</button>
            <button className="btn btn-primary" type="submit" form="feedback-form" disabled={submitting || rating < 1}>
              {submitting ? 'Submitting…' : 'Submit Feedback'}
            </button>
          </>
        }
      >
        <form id="feedback-form" onSubmit={submitFeedback} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          <div className="form-group">
            <label className="form-label">Overall Experience <span className="required">*</span></label>
            <StarRating value={rating} onChange={setRating} />
          </div>
          <div className="grid-2" style={{ gap: 14 }}>
            <div className="form-group">
              <label className="form-label">Communication</label>
              <StarRating value={commRating} onChange={setCommRating} />
            </div>
            <div className="form-group">
              <label className="form-label">Process</label>
              <StarRating value={processRating} onChange={setProcessRating} />
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Comments (optional)</label>
            <textarea
              className="form-textarea"
              rows={3}
              placeholder="Share your experience with this recruiter…"
              value={comment}
              onChange={e => setComment(e.target.value)}
              maxLength={1000}
            />
          </div>
          <div className="form-group">
            <label className="form-label">Would you apply to this company again?</label>
            <div style={{ display: 'flex', gap: 10 }}>
              {[true, false].map(val => (
                <button
                  key={String(val)}
                  type="button"
                  className={`btn btn-sm ${wouldRecommend === val ? 'btn-primary' : 'btn-secondary'}`}
                  onClick={() => setWouldRecommend(val)}
                >
                  {val ? '👍 Yes' : '👎 No'}
                </button>
              ))}
            </div>
          </div>
        </form>
      </Modal>
    </div>
  );
}
