'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { StatusBadge } from '@/components/shared/Badges';
import { toast } from 'sonner';

const STUDENT_STATUSES = ['applied', 'shortlisted', 'on_hold', 'rejected', 'selected'];

interface StudentStatus {
  studentId: string;
  status: string;
  recruiterNote?: string;
  updatedAt?: string;
  name?: string;
  rollNumber?: string;
  cgpa?: number;
  skills?: string[];
  resumeUrl?: string;
}

interface Application {
  _id: string;
  status: string;
  submittedAt: string;
  coverNote?: string;
  coordinatorId?: { name?: string; email?: string };
  talentPoolBatchId?: {
    name?: string;
    qualification?: string;
    institutionId?: { name?: string; state?: string };
  };
  studentStatuses: StudentStatus[];
}

interface Job {
  _id: string;
  title: string;
}

export default function JobApplicationsPage() {
  const { jobId } = useParams<{ jobId: string }>();
  const [job, setJob] = useState<Job | null>(null);
  const [apps, setApps] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [updating, setUpdating] = useState<string | null>(null);
  const [downloading, setDownloading] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([
      fetch(`/api/jobs/${jobId}`).then(r => r.json()),
      fetch(`/api/applications?jobId=${jobId}`).then(r => r.json()),
    ]).then(([j, a]) => {
      if (j.success) setJob(j.data);
      if (a.success) setApps(a.data);
    }).catch(() => {}).finally(() => setLoading(false));
  }, [jobId]);

  async function updateStudent(appId: string, studentId: string, status: string) {
    const key = `${appId}:${studentId}`;
    setUpdating(key);
    try {
      const res = await fetch(`/api/applications/${appId}/students/${studentId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) throw new Error();
      toast.success('Status updated');
      setApps(prev => prev.map(app => {
        if (app._id !== appId) return app;
        return { ...app, studentStatuses: app.studentStatuses.map(s => s.studentId === studentId ? { ...s, status } : s) };
      }));
    } catch {
      toast.error('Failed to update status');
    } finally {
      setUpdating(null);
    }
  }

  async function downloadZIP(appId: string, filter: 'all' | 'shortlisted') {
    setDownloading(`${appId}:${filter}`);
    try {
      const res = await fetch(`/api/applications/${appId}/download?filter=${filter}`);
      const j = await res.json();
      if (!res.ok || !j.url) throw new Error(j.error || 'No download URL');
      window.open(j.url, '_blank');
    } catch {
      toast.error('Download failed');
    } finally {
      setDownloading(null);
    }
  }

  return (
    <div className="fade-in">
      <div className="page-header">
        <h1 className="page-title">{job?.title || 'Applications'}</h1>
        <p className="page-subtitle">Review talent pool applications and update student statuses</p>
      </div>

      {loading ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {[...Array(2)].map((_, i) => <div key={i} className="skeleton" style={{ height: 140, borderRadius: 16 }} />)}
        </div>
      ) : apps.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">📭</div>
          <div className="empty-title">No applications yet</div>
          <div className="empty-desc">Applications from coordinators will appear here</div>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {apps.map(app => (
            <div key={app._id} className="card" style={{ padding: '20px 24px' }}>
              {/* App header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 16, marginBottom: 14 }}>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '1.0625rem', marginBottom: 6 }}>
                    {app.talentPoolBatchId?.institutionId?.name || 'Institution'}
                  </div>
                  <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: 8 }}>
                    Coordinator: {app.coordinatorId?.name || '—'}
                    {app.talentPoolBatchId?.institutionId?.state && ` · ${app.talentPoolBatchId.institutionId.state}`}
                  </div>
                  <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
                    <StatusBadge status={app.status} />
                    <span className="badge badge-blue">{app.talentPoolBatchId?.qualification || 'Unknown'}</span>
                    <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                      {app.studentStatuses.length} students · Submitted {new Date(app.submittedAt).toLocaleDateString('en-IN')}
                    </span>
                  </div>
                  {app.coverNote && (
                    <div style={{ marginTop: 10, padding: '10px 14px', background: 'var(--bg-surface)', borderRadius: 8, fontSize: '0.8125rem', color: 'var(--text-secondary)', fontStyle: 'italic' }}>
                      &ldquo;{app.coverNote}&rdquo;
                    </div>
                  )}
                </div>
                <div style={{ display: 'flex', gap: 10, flexShrink: 0, flexWrap: 'wrap' }}>
                  <button
                    className="btn btn-secondary btn-sm"
                    onClick={() => downloadZIP(app._id, 'shortlisted')}
                    disabled={downloading === `${app._id}:shortlisted`}
                  >
                    {downloading === `${app._id}:shortlisted` ? '…' : '📥 Shortlisted ZIPs'}
                  </button>
                  <button
                    className="btn btn-secondary btn-sm"
                    onClick={() => downloadZIP(app._id, 'all')}
                    disabled={downloading === `${app._id}:all`}
                  >
                    {downloading === `${app._id}:all` ? '…' : '📦 All Resumes'}
                  </button>
                  <button
                    className="btn btn-primary btn-sm"
                    onClick={() => setExpanded(expanded === app._id ? null : app._id)}
                  >
                    {expanded === app._id ? 'Collapse ▲' : 'Review Students ▼'}
                  </button>
                </div>
              </div>

              {/* Student table */}
              {expanded === app._id && (
                <div style={{ borderTop: '1px solid var(--border)', paddingTop: 16 }}>
                  <div className="table-wrapper">
                    <table>
                      <thead>
                        <tr>
                          <th>Student</th>
                          <th>Roll No.</th>
                          <th>CGPA</th>
                          <th>Skills</th>
                          <th>Resume</th>
                          <th>Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {app.studentStatuses.map((ss) => {
                          const key = `${app._id}:${ss.studentId}`;
                          return (
                            <tr key={ss.studentId}>
                              <td className="td-primary">{ss.name || 'Student'}</td>
                              <td style={{ fontFamily: 'monospace', fontSize: '0.8rem' }}>{ss.rollNumber || '—'}</td>
                              <td><strong style={{ color: 'var(--text-primary)' }}>{ss.cgpa ?? '—'}</strong></td>
                              <td>
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                                  {ss.skills?.slice(0, 2).map(s => <span key={s} className="chip" style={{ fontSize: '0.7rem' }}>{s}</span>)}
                                </div>
                              </td>
                              <td>
                                {ss.resumeUrl ? (
                                  <a href={`/api/resumes/${ss.studentId}`} target="_blank" rel="noreferrer" className="btn btn-ghost btn-sm" style={{ fontSize: '0.78rem', padding: '3px 10px' }}>
                                    📄 View
                                  </a>
                                ) : '—'}
                              </td>
                              <td>
                                <select
                                  className="form-select"
                                  style={{ fontSize: '0.8rem', padding: '5px 10px', width: 'auto', minWidth: 130 }}
                                  value={ss.status}
                                  disabled={updating === key}
                                  onChange={e => updateStudent(app._id, ss.studentId, e.target.value)}
                                >
                                  {STUDENT_STATUSES.map(s => <option key={s} value={s}>{s.replace('_', ' ')}</option>)}
                                </select>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
