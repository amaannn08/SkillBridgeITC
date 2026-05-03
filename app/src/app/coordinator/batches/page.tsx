'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { StatusBadge } from '@/components/shared/Badges';
import { toast } from 'sonner';
import { Modal } from '@/components/shared/Modal';

interface Batch {
  _id: string;
  name: string;
  qualification: string;
  branch: string;
  passingYear: number;
  status: string;
  totalStudents: number;
}

export default function BatchesPage() {
  const [batches, setBatches] = useState<Batch[]>([]);
  const [loading, setLoading] = useState(true);
  const [activateTarget, setActivateTarget] = useState<Batch | null>(null);
  const [acting, setActing] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/batches')
      .then(r => r.json())
      .then(j => { if (j.success) setBatches(j.data); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  async function activateBatch(batch: Batch) {
    setActing(batch._id);
    try {
      const res = await fetch(`/api/batches/${batch._id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'active' }),
      });
      if (!res.ok) throw new Error();
      toast.success('Batch activated!');
      setBatches(prev => prev.map(b => b._id === batch._id ? { ...b, status: 'active' } : b));
    } catch {
      toast.error('Failed to activate batch');
    } finally {
      setActing(null);
      setActivateTarget(null);
    }
  }

  const byStatus = (s: string) => batches.filter(b => b.status === s);

  return (
    <div className="fade-in">
      <div className="page-header" style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
        <div>
          <h1 className="page-title">Talent Pool Batches</h1>
          <p className="page-subtitle">Manage your student batches and activate them for job applications</p>
        </div>
        <Link href="/coordinator/batches/new" className="btn btn-primary">➕ New Batch</Link>
      </div>

      {loading ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {[...Array(3)].map((_, i) => <div key={i} className="skeleton" style={{ height: 100, borderRadius: 16 }} />)}
        </div>
      ) : batches.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">👥</div>
          <div className="empty-title">No batches yet</div>
          <div className="empty-desc">Create your first talent pool batch to start applying to jobs</div>
          <Link href="/coordinator/batches/new" className="btn btn-primary" style={{ marginTop: 16, display: 'inline-flex' }}>Create First Batch</Link>
        </div>
      ) : (
        <>
          {['active', 'draft', 'archived'].map(status => {
            const items = byStatus(status);
            if (items.length === 0) return null;
            return (
              <div key={status} style={{ marginBottom: 28 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
                  <StatusBadge status={status} />
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{items.length} batch{items.length !== 1 ? 'es' : ''}</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {items.map(b => (
                    <div key={b._id} className="card" style={{ padding: '18px 22px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
                      <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
                        <div style={{ width: 44, height: 44, borderRadius: 12, background: b.status === 'active' ? 'var(--success-muted)' : 'var(--bg-muted)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.3rem', flexShrink: 0 }}>
                          {b.status === 'active' ? '✅' : b.status === 'draft' ? '📝' : '📦'}
                        </div>
                        <div>
                          <div style={{ fontWeight: 700, fontSize: '1.0625rem', marginBottom: 4 }}>{b.name}</div>
                          <div style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                            <span className="badge badge-blue">{b.qualification}</span>
                            {b.branch && <span style={{ color: 'var(--text-secondary)' }}>{b.branch}</span>}
                            <span>Passing {b.passingYear}</span>
                            <span>{b.totalStudents || 0} students</span>
                          </div>
                        </div>
                      </div>
                      <div style={{ display: 'flex', gap: 10, flexShrink: 0 }}>
                        <Link href={`/coordinator/batches/${b._id}`} className="btn btn-secondary btn-sm">
                          View / Edit
                        </Link>
                        {b.status === 'draft' && (
                          <button className="btn btn-success btn-sm" onClick={() => setActivateTarget(b)} disabled={acting === b._id}>
                            {acting === b._id ? '…' : 'Activate'}
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </>
      )}

      <Modal
        open={!!activateTarget}
        onClose={() => setActivateTarget(null)}
        title="Activate Batch"
        footer={
          <>
            <button className="btn btn-ghost" onClick={() => setActivateTarget(null)}>Cancel</button>
            <button className="btn btn-success" onClick={() => activateTarget && activateBatch(activateTarget)} disabled={!!acting}>
              {acting ? '…' : 'Activate Batch'}
            </button>
          </>
        }
      >
        <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6 }}>
          Activate <strong>{activateTarget?.name}</strong>? Once active, this batch can be submitted to job requirements.
        </p>
      </Modal>
    </div>
  );
}
