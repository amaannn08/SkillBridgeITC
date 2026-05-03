import { Bell, CheckCheck, X } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { formatDistanceToNow } from 'date-fns';

const TYPE_ICON = {
  new_registration: '📋',
  student_status_updated: '✅',
  new_application: '📨',
  new_job_posted: '💼',
  deadline_approaching: '⏰',
  account_suspended: '🚫',
};

const TYPE_COLOR = {
  new_registration: 'bg-blue-50 border-blue-100',
  student_status_updated: 'bg-green-50 border-green-100',
  new_application: 'bg-orange-50 border-orange-100',
  new_job_posted: 'bg-purple-50 border-purple-100',
  deadline_approaching: 'bg-red-50 border-red-100',
};

export default function NotificationsPage() {
  const { notifications, unreadCount, markNotifRead, markAllRead } = useApp();

  const unread = notifications.filter(n => !n.read);
  const read = notifications.filter(n => n.read);

  return (
    <div className="animate-fade-in max-w-2xl">
      <div className="page-header flex items-start justify-between">
        <div>
          <h1 className="page-title flex items-center gap-3">
            <Bell size={24} className="text-blue-500" />
            Notifications
            {unreadCount > 0 && (
              <span className="badge badge-red">{unreadCount} new</span>
            )}
          </h1>
          <p className="page-subtitle">Stay updated on platform activity</p>
        </div>
        {unreadCount > 0 && (
          <button onClick={markAllRead} className="btn btn-outline btn-sm flex items-center gap-2">
            <CheckCheck size={14} /> Mark all read
          </button>
        )}
      </div>

      {notifications.length === 0 ? (
        <div className="card empty-state">
          <div className="empty-state-icon">🔔</div>
          <p className="empty-state-title">No notifications yet</p>
          <p className="empty-state-desc">You'll see updates about registrations, applications, and more here</p>
        </div>
      ) : (
        <div className="space-y-6">
          {unread.length > 0 && (
            <div>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3 px-1">New</p>
              <div className="space-y-2">
                {unread.map(n => (
                  <div
                    key={n._id}
                    onClick={() => markNotifRead(n._id)}
                    className={`card card-sm card-interactive flex items-start gap-4 border ${TYPE_COLOR[n.type] || 'bg-blue-50 border-blue-100'}`}
                  >
                    <span className="text-2xl flex-shrink-0 mt-0.5">{TYPE_ICON[n.type] || '🔔'}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-800 leading-snug">{n.message}</p>
                      <p className="text-xs text-gray-400 mt-1.5">
                        {formatDistanceToNow(new Date(n.createdAt), { addSuffix: true })}
                      </p>
                    </div>
                    <div className="w-2.5 h-2.5 rounded-full bg-blue-500 flex-shrink-0 mt-1.5" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {read.length > 0 && (
            <div>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3 px-1">Earlier</p>
              <div className="space-y-2">
                {read.map(n => (
                  <div key={n._id} className="card card-sm flex items-start gap-4 opacity-70">
                    <span className="text-2xl flex-shrink-0 mt-0.5">{TYPE_ICON[n.type] || '🔔'}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-gray-600 leading-snug">{n.message}</p>
                      <p className="text-xs text-gray-400 mt-1.5">
                        {formatDistanceToNow(new Date(n.createdAt), { addSuffix: true })}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
