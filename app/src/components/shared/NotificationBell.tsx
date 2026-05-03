'use client';

import { useEffect, useRef, useState } from 'react';
import { formatDistanceToNow } from 'date-fns';

interface Notif {
  _id: string;
  message: string;
  link?: string;
  read: boolean;
  createdAt: string;
}

export function NotificationBell() {
  const [open, setOpen] = useState(false);
  const [notifs, setNotifs] = useState<Notif[]>([]);
  const [unread, setUnread] = useState(0);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch('/api/notifications')
      .then((r) => r.json())
      .then((j) => {
        if (j.success) {
          setNotifs(j.data.slice(0, 5));
          setUnread(j.data.filter((n: Notif) => !n.read).length);
        }
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  async function markAll() {
    await fetch('/api/notifications/read-all', { method: 'PATCH' });
    setNotifs((prev) => prev.map((n) => ({ ...n, read: true })));
    setUnread(0);
  }

  return (
    <div ref={ref} style={{ position: 'relative' }}>
      <button
        className="btn-icon btn-ghost"
        onClick={() => setOpen((o) => !o)}
        aria-label="Notifications"
        style={{ position: 'relative', fontSize: '1.1rem' }}
      >
        🔔
        {unread > 0 && (
          <span
            style={{
              position: 'absolute', top: -3, right: -3,
              background: 'var(--danger)', color: '#fff',
              borderRadius: '100px', fontSize: '0.6rem',
              fontWeight: 700, padding: '1px 5px', minWidth: '16px',
              textAlign: 'center', lineHeight: '16px',
            }}
          >
            {unread > 9 ? '9+' : unread}
          </span>
        )}
      </button>

      {open && (
        <div className="notif-dropdown">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', borderBottom: '1px solid var(--border)' }}>
            <span style={{ fontWeight: 700, fontSize: '0.875rem' }}>Notifications</span>
            {unread > 0 && (
              <button onClick={markAll} style={{ fontSize: '0.75rem', color: 'var(--primary-light)', background: 'none', border: 'none', cursor: 'pointer' }}>
                Mark all read
              </button>
            )}
          </div>
          {notifs.length === 0 ? (
            <div style={{ padding: '24px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.875rem' }}>
              No notifications yet
            </div>
          ) : (
            notifs.map((n) => (
              <div key={n._id} className={`notif-item ${!n.read ? 'unread' : ''}`}>
                <div className="notif-msg">{n.message}</div>
                <div className="notif-time">
                  {formatDistanceToNow(new Date(n.createdAt), { addSuffix: true })}
                </div>
              </div>
            ))
          )}
          <div style={{ padding: '10px 16px', textAlign: 'center', borderTop: '1px solid var(--border)' }}>
            <a href="#" style={{ fontSize: '0.8rem', color: 'var(--primary-light)', textDecoration: 'none' }}>View all</a>
          </div>
        </div>
      )}
    </div>
  );
}
