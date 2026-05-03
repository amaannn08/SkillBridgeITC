'use client';

import { useEffect, useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import Link from 'next/link';
import { INDIAN_STATES_AND_UTS } from '@/lib/constants/states';
import { INDUSTRY_SECTORS } from '@/lib/constants/sectors';

interface Slot { qualification: string; branch: string; seats: string; }

const QUALIFICATIONS = ['ITI', 'Diploma', 'B.Tech', 'M.Tech', 'B.Sc', 'MBA', 'Other'];

export default function NewJobPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [slots, setSlots] = useState<Slot[]>([{ qualification: 'ITI', branch: '', seats: '1' }]);
  const [skills, setSkills] = useState<string[]>([]);
  const [skillInput, setSkillInput] = useState('');

  function addSlot() {
    if (slots.length >= 10) { toast.error('Maximum 10 slots allowed'); return; }
    setSlots(s => [...s, { qualification: 'ITI', branch: '', seats: '1' }]);
  }
  function removeSlot(i: number) {
    if (slots.length <= 1) return;
    setSlots(s => s.filter((_, idx) => idx !== i));
  }
  function updateSlot(i: number, field: keyof Slot, val: string) {
    setSlots(s => s.map((slot, idx) => idx === i ? { ...slot, [field]: val } : slot));
  }
  function addSkill(e: React.KeyboardEvent<HTMLInputElement>) {
    if ((e.key === 'Enter' || e.key === ',') && skillInput.trim()) {
      e.preventDefault();
      const s = skillInput.trim().replace(/,$/, '');
      if (s && !skills.includes(s)) setSkills(prev => [...prev, s]);
      setSkillInput('');
    }
  }
  function removeSkill(s: string) { setSkills(prev => prev.filter(x => x !== s)); }

  async function submit(e: FormEvent<HTMLFormElement>, status: 'draft' | 'open') {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const parsedSlots = slots.map(s => ({ qualification: s.qualification, branch: s.branch, seats: Number(s.seats), filledSeats: 0 }));
    setLoading(true);
    try {
      const res = await fetch('/api/jobs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: fd.get('title'),
          description: fd.get('description'),
          location: fd.get('location'),
          state: fd.get('state'),
          geographyScope: fd.get('geographyScope'),
          slots: parsedSlots,
          salaryMin: fd.get('salaryMin') ? Number(fd.get('salaryMin')) : undefined,
          salaryMax: fd.get('salaryMax') ? Number(fd.get('salaryMax')) : undefined,
          applicationDeadline: fd.get('applicationDeadline'),
          sector: fd.get('sector'),
          skills,
          experienceLevel: fd.get('experienceLevel'),
          status,
        }),
      });
      const j = await res.json();
      if (!res.ok) throw new Error(j.error || 'Failed');
      toast.success(status === 'open' ? 'Job published!' : 'Saved as draft');
      router.push('/recruiter/jobs');
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Error');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fade-in">
      <button className="btn btn-ghost btn-sm" style={{ marginBottom: 20 }} onClick={() => router.back()}>← Back</button>
      <div className="page-header">
        <h1 className="page-title">Post Job Requirement</h1>
        <p className="page-subtitle">Define the role and qualification requirements for this posting</p>
      </div>

      <form id="job-form" onSubmit={e => submit(e, 'open')} style={{ maxWidth: 760 }}>
        <div className="card" style={{ padding: '24px', marginBottom: 20 }}>
          <div style={{ fontWeight: 700, marginBottom: 16, color: 'var(--text-muted)', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Basic Details</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div className="form-group">
              <label className="form-label">Job Title <span className="required">*</span></label>
              <input name="title" required className="form-input" placeholder="Plant Operator Trainee" />
            </div>
            <div className="form-group">
              <label className="form-label">Job Description <span className="required">*</span></label>
              <textarea name="description" required className="form-textarea" rows={5} placeholder="Describe the role, responsibilities, and requirements. Markdown supported." style={{ minHeight: 120 }} />
            </div>
            <div className="grid-2" style={{ gap: 14 }}>
              <div className="form-group">
                <label className="form-label">Sector <span className="required">*</span></label>
                <select name="sector" required className="form-select">
                  {INDUSTRY_SECTORS.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Experience Level</label>
                <select name="experienceLevel" className="form-select">
                  <option value="fresher">Fresher</option>
                  <option value="0-2yr">0–2 Years</option>
                  <option value="2-5yr">2–5 Years</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        <div className="card" style={{ padding: '24px', marginBottom: 20 }}>
          <div style={{ fontWeight: 700, marginBottom: 16, color: 'var(--text-muted)', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Location & Scope</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div className="grid-2" style={{ gap: 14 }}>
              <div className="form-group">
                <label className="form-label">Work Location (City) <span className="required">*</span></label>
                <input name="location" required className="form-input" placeholder="Hyderabad" />
              </div>
              <div className="form-group">
                <label className="form-label">State <span className="required">*</span></label>
                <select name="state" required className="form-select">
                  {INDIAN_STATES_AND_UTS.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Geography Scope</label>
              <select name="geographyScope" className="form-select">
                <option value="state">This state only</option>
                <option value="pan_india">Pan-India (all states)</option>
              </select>
              <span className="form-hint">Determines which coordinators can see this posting</span>
            </div>
          </div>
        </div>

        <div className="card" style={{ padding: '24px', marginBottom: 20 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <div style={{ fontWeight: 700, color: 'var(--text-muted)', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Qualification Slots</div>
            <button type="button" className="btn btn-secondary btn-sm" onClick={addSlot} disabled={slots.length >= 10}>
              ➕ Add Slot
            </button>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {slots.map((slot, i) => (
              <div key={i} style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', padding: '14px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                  <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)' }}>Slot {i + 1}</span>
                  {slots.length > 1 && (
                    <button type="button" className="btn btn-ghost btn-sm" style={{ color: 'var(--danger)', padding: '2px 8px', fontSize: '0.78rem' }} onClick={() => removeSlot(i)}>
                      Remove
                    </button>
                  )}
                </div>
                <div className="grid-3" style={{ gap: 12 }}>
                  <div className="form-group">
                    <label className="form-label">Qualification <span className="required">*</span></label>
                    <select className="form-select" value={slot.qualification} onChange={e => updateSlot(i, 'qualification', e.target.value)}>
                      {QUALIFICATIONS.map(q => <option key={q} value={q}>{q}</option>)}
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Branch / Specialisation</label>
                    <input className="form-input" placeholder="e.g. Electrical" value={slot.branch} onChange={e => updateSlot(i, 'branch', e.target.value)} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Seats <span className="required">*</span></label>
                    <input type="number" min="1" className="form-input" value={slot.seats} onChange={e => updateSlot(i, 'seats', e.target.value)} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="card" style={{ padding: '24px', marginBottom: 20 }}>
          <div style={{ fontWeight: 700, marginBottom: 16, color: 'var(--text-muted)', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Compensation & Skills</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div className="grid-2" style={{ gap: 14 }}>
              <div className="form-group">
                <label className="form-label">Salary Min (₹/month)</label>
                <input name="salaryMin" type="number" className="form-input" placeholder="15000" />
              </div>
              <div className="form-group">
                <label className="form-label">Salary Max (₹/month)</label>
                <input name="salaryMax" type="number" className="form-input" placeholder="25000" />
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Required Skills</label>
              <div className="chip-input-wrap">
                {skills.map(s => (
                  <span key={s} className="chip">{s} <button type="button" onClick={() => removeSkill(s)}>×</button></span>
                ))}
                <input
                  value={skillInput}
                  onChange={e => setSkillInput(e.target.value)}
                  onKeyDown={addSkill}
                  placeholder={skills.length === 0 ? 'Type skill and press Enter…' : ''}
                />
              </div>
              <span className="form-hint">Press Enter or comma to add a skill</span>
            </div>
            <div className="form-group">
              <label className="form-label">Application Deadline <span className="required">*</span></label>
              <input name="applicationDeadline" required type="datetime-local" className="form-input" />
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: 12 }}>
          <Link href="/recruiter/jobs" className="btn btn-ghost" style={{ flex: 1, justifyContent: 'center' }}>Cancel</Link>
          <button type="button" className="btn btn-secondary" style={{ flex: 1, justifyContent: 'center' }} disabled={loading}
            onClick={e => submit(e as unknown as FormEvent<HTMLFormElement>, 'draft')}>
            Save Draft
          </button>
          <button type="submit" className="btn btn-primary" style={{ flex: 2, justifyContent: 'center' }} disabled={loading}>
            {loading ? 'Publishing…' : '🚀 Publish Job'}
          </button>
        </div>
      </form>
    </div>
  );
}
