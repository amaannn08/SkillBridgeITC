'use client';

import { useEffect, useState, useRef, FormEvent } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { StatusBadge } from '@/components/shared/Badges';
import { Modal } from '@/components/shared/Modal';
import { toast } from 'sonner';

interface Student {
  _id: string;
  name: string;
  rollNumber: string;
  cgpa?: number;
  gender?: string;
  skills?: string[];
  phone?: string;
  email?: string;
  resumeUrl?: string;
  resumeOriginalName?: string;
}

interface Batch {
  _id: string;
  name: string;
  qualification: string;
  branch: string;
  passingYear: number;
  status: string;
  totalStudents: number;
  students: Student[];
}

export default function BatchDetailPage() {
  const { batchId } = useParams<{ batchId: string }>();
  const router = useRouter();
  const [batch, setBatch] = useState<Batch | null>(null);
  const [loading, setLoading] = useState(true);
  const [addOpen, setAddOpen] = useState(false);
  const [adding, setAdding] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Student | null>(null);
  const [uploadingFor, setUploadingFor] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const resumeStudentRef = useRef<string | null>(null);
  const csvRef = useRef<HTMLInputElement>(null);
  const [csvUploading, setCsvUploading] = useState(false);

  function load() {
    fetch(`/api/batches/${batchId}`)
      .then(r => r.json())
      .then(j => { if (j.success) setBatch(j.data); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }

  useEffect(() => { load(); }, [batchId]); // eslint-disable-line react-hooks/exhaustive-deps

  async function addStudent(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    setAdding(true);
    try {
      const res = await fetch(`/api/batches/${batchId}/students`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: fd.get('name'),
          rollNumber: fd.get('rollNumber'),
          dob: fd.get('dob'),
          gender: fd.get('gender'),
          cgpa: fd.get('cgpa') ? Number(fd.get('cgpa')) : undefined,
          phone: fd.get('phone'),
          email: fd.get('email'),
          skills: String(fd.get('skills') || '').split(',').map(s => s.trim()).filter(Boolean),
        }),
      });
      const j = await res.json();
      if (!res.ok) throw new Error(j.error || 'Failed');
      toast.success('Student added');
      setAddOpen(false);
      load();
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Error');
    } finally {
      setAdding(false);
    }
  }

  async function deleteStudent() {
    if (!deleteTarget) return;
    try {
      await fetch(`/api/batches/${batchId}/students/${deleteTarget._id}`, { method: 'DELETE' });
      toast.success('Student removed');
      setBatch(b => b ? { ...b, students: b.students.filter(s => s._id !== deleteTarget._id), totalStudents: b.totalStudents - 1 } : b);
    } catch {
      toast.error('Failed to remove student');
    } finally {
      setDeleteTarget(null);
    }
  }

  async function uploadResume(studentId: string, file: File) {
    setUploadingFor(studentId);
    try {
      const fd = new FormData();
      fd.append('file', file);
      fd.append('studentId', studentId);
      const res = await fetch(`/api/batches/${batchId}/resume`, { method: 'POST', body: fd });
      if (!res.ok) throw new Error('Upload failed');
      toast.success('Resume uploaded');
      load();
    } catch {
      toast.error('Resume upload failed');
    } finally {
      setUploadingFor(null);
    }
  }

  async function uploadCSV(file: File) {
    setCsvUploading(true);
    try {
      const fd = new FormData();
      fd.append('file', file);
      const res = await fetch(`/api/batches/${batchId}/students/bulk`, { method: 'POST', body: fd });
      const j = await res.json();
      if (!res.ok) throw new Error(j.error || 'Upload failed');
      toast.success(`${j.data?.inserted || 'Students'} added from CSV`);
      load();
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'CSV upload failed');
    } finally {
      setCsvUploading(false);
    }
  }

  if (loading) return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      <div className="skeleton" style={{ height: 100, borderRadius: 16 }} />
      <div className="skeleton" style={{ height: 300, borderRadius: 16 }} />
    </div>
  );

  if (!batch) return <div className="empty-state"><div className="empty-icon">🔍</div><div className="empty-title">Batch not found</div></div>;

  return (
    <div className="fade-in">
      <button className="btn btn-ghost btn-sm" style={{ marginBottom: 20 }} onClick={() => router.back()}>← Back to Batches</button>

      {/* Header */}
      <div className="card" style={{ padding: '22px 26px', marginBottom: 22, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
            <h1 style={{ fontSize: '1.4rem', fontWeight: 800 }}>{batch.name}</h1>
            <StatusBadge status={batch.status} />
          </div>
          <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)', display: 'flex', gap: 16, flexWrap: 'wrap' }}>
            <span className="badge badge-blue">{batch.qualification}</span>
            <span>{batch.branch}</span>
            <span>Passing {batch.passingYear}</span>
            <span><strong style={{ color: 'var(--text-primary)' }}>{batch.students.length}</strong> students</span>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          <button className="btn btn-secondary btn-sm" onClick={() => csvRef.current?.click()} disabled={csvUploading}>
            {csvUploading ? '…Uploading' : '📤 Bulk CSV'}
          </button>
          <input ref={csvRef} type="file" accept=".csv" style={{ display: 'none' }} onChange={e => { if (e.target.files?.[0]) uploadCSV(e.target.files[0]); }} />
          <button className="btn btn-primary btn-sm" onClick={() => setAddOpen(true)}>➕ Add Student</button>
        </div>
      </div>

      {/* Students table */}
      {batch.students.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">👤</div>
          <div className="empty-title">No students yet</div>
          <div className="empty-desc">Add students manually or upload a CSV file</div>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', marginTop: 16 }}>
            <button className="btn btn-secondary btn-sm" onClick={() => csvRef.current?.click()}>📤 Upload CSV</button>
            <button className="btn btn-primary btn-sm" onClick={() => setAddOpen(true)}>➕ Add Student</button>
          </div>
        </div>
      ) : (
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>#</th>
                <th>Name</th>
                <th>Roll No.</th>
                <th>CGPA</th>
                <th>Gender</th>
                <th>Skills</th>
                <th>Resume</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {batch.students.map((s, idx) => (
                <tr key={s._id}>
                  <td style={{ color: 'var(--text-muted)', fontWeight: 500 }}>{idx + 1}</td>
                  <td>
                    <div className="td-primary">{s.name}</div>
                    {s.email && <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{s.email}</div>}
                  </td>
                  <td style={{ fontFamily: 'monospace' }}>{s.rollNumber}</td>
                  <td><strong style={{ color: 'var(--text-primary)' }}>{s.cgpa ?? '—'}</strong></td>
                  <td>{s.gender || '—'}</td>
                  <td>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                      {s.skills?.slice(0, 3).map(sk => <span key={sk} className="chip" style={{ fontSize: '0.7rem' }}>{sk}</span>)}
                      {(s.skills?.length || 0) > 3 && <span className="chip" style={{ fontSize: '0.7rem' }}>+{(s.skills?.length || 0) - 3}</span>}
                    </div>
                  </td>
                  <td>
                    {s.resumeUrl ? (
                      <span className="badge badge-green">✓ Uploaded</span>
                    ) : (
                      <button
                        className="btn btn-ghost btn-sm"
                        style={{ fontSize: '0.78rem', padding: '4px 10px' }}
                        disabled={uploadingFor === s._id}
                        onClick={() => { resumeStudentRef.current = s._id; fileInputRef.current?.click(); }}
                      >
                        {uploadingFor === s._id ? '…' : '📎 Upload'}
                      </button>
                    )}
                  </td>
                  <td>
                    <button className="btn btn-ghost btn-sm" style={{ color: 'var(--danger)', fontSize: '0.78rem' }} onClick={() => setDeleteTarget(s)}>
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Hidden resume file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".pdf"
        style={{ display: 'none' }}
        onChange={e => {
          if (e.target.files?.[0] && resumeStudentRef.current) {
            uploadResume(resumeStudentRef.current, e.target.files[0]);
          }
        }}
      />

      {/* Add Student Modal */}
      <Modal open={addOpen} onClose={() => setAddOpen(false)} title="Add Student" size="lg"
        footer={<>
          <button className="btn btn-ghost" onClick={() => setAddOpen(false)}>Cancel</button>
          <button type="submit" form="add-student-form" className="btn btn-primary" disabled={adding}>
            {adding ? 'Adding…' : 'Add Student'}
          </button>
        </>}
      >
        <form id="add-student-form" onSubmit={addStudent} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div className="grid-2" style={{ gap: 12 }}>
            <div className="form-group">
              <label className="form-label">Full Name <span className="required">*</span></label>
              <input name="name" required className="form-input" placeholder="Ravi Kumar" />
            </div>
            <div className="form-group">
              <label className="form-label">Roll Number <span className="required">*</span></label>
              <input name="rollNumber" required className="form-input" placeholder="ITI-2024-001" />
            </div>
          </div>
          <div className="grid-2" style={{ gap: 12 }}>
            <div className="form-group">
              <label className="form-label">Date of Birth <span className="required">*</span></label>
              <input name="dob" required type="date" className="form-input" />
            </div>
            <div className="form-group">
              <label className="form-label">Gender <span className="required">*</span></label>
              <select name="gender" required className="form-select">
                <option value="">— Select —</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>
          <div className="grid-2" style={{ gap: 12 }}>
            <div className="form-group">
              <label className="form-label">CGPA / Percentage</label>
              <input name="cgpa" type="number" step="0.01" min="0" max="10" className="form-input" placeholder="8.5" />
            </div>
            <div className="form-group">
              <label className="form-label">Phone</label>
              <input name="phone" type="tel" className="form-input" placeholder="+91 98765 43210" />
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Personal Email</label>
            <input name="email" type="email" className="form-input" placeholder="ravi@example.com" />
          </div>
          <div className="form-group">
            <label className="form-label">Skills</label>
            <input name="skills" className="form-input" placeholder="Welding, Electrical, CNC (comma-separated)" />
          </div>
        </form>
      </Modal>

      {/* Delete Confirm Modal */}
      <Modal open={!!deleteTarget} onClose={() => setDeleteTarget(null)} title="Remove Student"
        footer={<>
          <button className="btn btn-ghost" onClick={() => setDeleteTarget(null)}>Cancel</button>
          <button className="btn btn-danger" onClick={deleteStudent}>Remove</button>
        </>}
      >
        <p style={{ color: 'var(--text-secondary)' }}>Remove <strong>{deleteTarget?.name}</strong> from this batch? This cannot be undone.</p>
      </Modal>
    </div>
  );
}
