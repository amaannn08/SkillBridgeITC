// Status badge for applications, students, users, jobs
const APPLICATION_STATUS = {
  submitted:    { label: 'Submitted',    cls: 'badge-blue'   },
  under_review: { label: 'Under Review', cls: 'badge-yellow' },
  shortlisting: { label: 'Shortlisting', cls: 'badge-orange' },
  closed:       { label: 'Closed',       cls: 'badge-gray'   },
};

const STUDENT_STATUS = {
  applied:     { label: 'Applied',     cls: 'badge-blue'   },
  shortlisted: { label: 'Shortlisted', cls: 'badge-yellow' },
  on_hold:     { label: 'On Hold',     cls: 'badge-purple' },
  rejected:    { label: 'Rejected',    cls: 'badge-red'    },
  selected:    { label: 'Selected',    cls: 'badge-green'  },
};

const JOB_STATUS = {
  draft:  { label: 'Draft',  cls: 'badge-gray'   },
  open:   { label: 'Open',   cls: 'badge-green'  },
  closed: { label: 'Closed', cls: 'badge-red'    },
  filled: { label: 'Filled', cls: 'badge-navy'   },
};

const USER_STATUS = {
  approved:  { label: 'Approved',  cls: 'badge-green'  },
  pending:   { label: 'Pending',   cls: 'badge-orange' },
  rejected:  { label: 'Rejected',  cls: 'badge-red'    },
  suspended: { label: 'Suspended', cls: 'badge-gray'   },
};

const BATCH_STATUS = {
  draft:    { label: 'Draft',    cls: 'badge-gray'   },
  active:   { label: 'Active',   cls: 'badge-green'  },
  archived: { label: 'Archived', cls: 'badge-purple' },
};

const ROLE = {
  super_admin: { label: 'Super Admin', cls: 'badge-navy'   },
  coordinator: { label: 'Coordinator', cls: 'badge-green'  },
  recruiter:   { label: 'Recruiter',   cls: 'badge-blue'   },
};

export function StatusBadge({ type = 'application', status }) {
  const maps = { application: APPLICATION_STATUS, student: STUDENT_STATUS, job: JOB_STATUS, user: USER_STATUS, batch: BATCH_STATUS, role: ROLE };
  const map = maps[type] || {};
  const item = map[status] || { label: status, cls: 'badge-gray' };
  return <span className={`badge ${item.cls}`}>{item.label}</span>;
}

// Slot badge: '80 ITI · 40 ITI (Electrician)'
export function SlotBadge({ slots }) {
  if (!slots || slots.length === 0) return null;
  const QUAL_COLORS = {
    'ITI':    'badge-orange',
    'Diploma':'badge-blue',
    'B.Tech': 'badge-navy',
    'M.Tech': 'badge-purple',
    'B.Sc':   'badge-green',
    'MBA':    'badge-yellow',
    'Other':  'badge-gray',
  };
  return (
    <div className="flex flex-wrap gap-1.5">
      {slots.map((s, i) => (
        <span key={i} className={`badge ${QUAL_COLORS[s.qualification] || 'badge-gray'}`}>
          {s.seats} {s.qualification}{s.branch ? ` · ${s.branch}` : ''}
        </span>
      ))}
    </div>
  );
}
