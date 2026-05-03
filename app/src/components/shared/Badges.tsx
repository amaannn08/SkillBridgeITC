'use client';

interface Slot {
  qualification: string;
  branch?: string;
  seats: number;
}

const QUAL_COLORS: Record<string, string> = {
  ITI: 'badge-blue',
  Diploma: 'badge-purple',
  'B.Tech': 'badge-green',
  'M.Tech': 'badge-orange',
  'B.Sc': 'badge-yellow',
  MBA: 'badge-navy',
  Other: 'badge-gray',
};

export function SlotBadge({ slots }: { slots: Slot[] }) {
  if (!slots?.length) return null;
  return (
    <div className="slot-row">
      {slots.map((s, i) => (
        <span key={i} className={`badge ${QUAL_COLORS[s.qualification] || 'badge-gray'}`}>
          {s.seats} {s.qualification}{s.branch ? ` (${s.branch})` : ''}
        </span>
      ))}
    </div>
  );
}

type StatusVariant =
  | 'pending' | 'approved' | 'rejected' | 'suspended'
  | 'submitted' | 'under_review' | 'shortlisting' | 'closed'
  | 'draft' | 'open' | 'filled'
  | 'applied' | 'shortlisted' | 'on_hold' | 'selected'
  | 'active' | 'archived';

const STATUS_MAP: Record<StatusVariant, { cls: string; label: string }> = {
  pending:      { cls: 'badge-yellow',  label: 'Pending' },
  approved:     { cls: 'badge-green',   label: 'Approved' },
  rejected:     { cls: 'badge-red',     label: 'Rejected' },
  suspended:    { cls: 'badge-gray',    label: 'Suspended' },
  submitted:    { cls: 'badge-blue',    label: 'Submitted' },
  under_review: { cls: 'badge-yellow',  label: 'Under Review' },
  shortlisting: { cls: 'badge-orange',  label: 'Shortlisting' },
  closed:       { cls: 'badge-gray',    label: 'Closed' },
  draft:        { cls: 'badge-gray',    label: 'Draft' },
  open:         { cls: 'badge-green',   label: 'Open' },
  filled:       { cls: 'badge-navy',    label: 'Filled' },
  applied:      { cls: 'badge-blue',    label: 'Applied' },
  shortlisted:  { cls: 'badge-green',   label: 'Shortlisted' },
  on_hold:      { cls: 'badge-yellow',  label: 'On Hold' },
  selected:     { cls: 'badge-navy',    label: 'Selected' },
  active:       { cls: 'badge-green',   label: 'Active' },
  archived:     { cls: 'badge-gray',    label: 'Archived' },
};

export function StatusBadge({ status }: { status: string }) {
  const cfg = STATUS_MAP[status as StatusVariant] ?? { cls: 'badge-gray', label: status };
  return <span className={`badge ${cfg.cls}`}>{cfg.label}</span>;
}
