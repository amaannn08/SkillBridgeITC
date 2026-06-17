import { NavLink, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  LayoutDashboard, CheckSquare, Users, Briefcase, BarChart3,
  Building2, FileText, Bell, ChevronLeft, ChevronRight,
  ClipboardList, Upload, X, User, MapPin, ShieldCheck, LogOut,
  Activity,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

const NAV = {
  super_admin: [
    { label: 'Dashboard',         icon: LayoutDashboard, to: '/admin'             },
    { label: 'District Map',      icon: MapPin,          to: '/admin/map'         },
    { label: 'Pending Approvals', icon: CheckSquare,     to: '/admin/approvals',  badge: true },
    { label: 'All Users',         icon: Users,           to: '/admin/users'       },
    { label: 'Job Requirements',  icon: Briefcase,       to: '/admin/jobs'        },
    { label: 'Analytics',         icon: BarChart3,       to: '/admin/analytics'   },
    { label: 'Footfall',          icon: Activity,        to: '/admin/footfall'    },
    { label: 'Audit Trail',       icon: ShieldCheck,     to: '/admin/audit'       },
  ],
  coordinator: [
    { label: 'Dashboard',           icon: LayoutDashboard, to: '/coordinator'                },
    { label: 'Browse Jobs',         icon: Briefcase,       to: '/coordinator/jobs'           },
    { label: 'My Applications',     icon: FileText,        to: '/coordinator/applications'   },
    { label: 'Talent Pool Batches', icon: Users,           to: '/coordinator/batches'        },
    { label: 'Institution Profile', icon: Building2,       to: '/coordinator/institution'    },
    { label: 'Notifications',       icon: Bell,            to: '/coordinator/notifications',  badge: true },
  ],
  recruiter: [
    { label: 'Dashboard',        icon: LayoutDashboard, to: '/recruiter'                  },
    { label: 'My Job Postings',  icon: Briefcase,       to: '/recruiter/jobs'             },
    { label: 'Post New Job',     icon: Upload,          to: '/recruiter/jobs/new'         },
    { label: 'Applications',     icon: ClipboardList,   to: '/recruiter/applications'     },
    { label: 'Company Profile',  icon: Building2,       to: '/recruiter/company'          },
    { label: 'Notifications',    icon: Bell,            to: '/recruiter/notifications',    badge: true },
  ],
  student: [
    { label: 'Dashboard',       icon: LayoutDashboard, to: '/student'                      },
    { label: 'Browse Jobs',     icon: Briefcase,       to: '/student/jobs'                 },
    { label: 'My Applications', icon: ClipboardList,   to: '/student/applications'         },
    { label: 'My Profile',      icon: User,            to: '/student/profile'              },
    { label: 'Notifications',   icon: Bell,            to: '/student/notifications', badge: true },
  ],
};

const ROLE_LABELS = {
  super_admin: 'District Collector',
  coordinator: 'Coordinator',
  recruiter:   'Recruiter',
  student:     'Student',
};

// MESIC saffron "M" logo
function MesicLogo({ collapsed }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
      <div style={{
        width: 34, height: 34, borderRadius: 9, flexShrink: 0,
        background: 'linear-gradient(135deg, #F97316 0%, #EA580C 100%)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontFamily: "'Plus Jakarta Sans', sans-serif",
        fontWeight: 900, color: '#fff', fontSize: 15,
        boxShadow: '0 4px 12px rgba(249,115,22,0.4)',
      }}>M</div>
      {!collapsed && (
        <div>
          <p style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 800, fontSize: 16, color: '#fff', letterSpacing: '-0.025em', lineHeight: 1 }}>MESIC</p>
          <p style={{ fontSize: 9, color: 'rgba(251,146,60,0.75)', fontWeight: 600, letterSpacing: '0.06em', marginTop: 2 }}>Medak District</p>
        </div>
      )}
    </div>
  );
}

export default function Sidebar({ collapsed, setCollapsed }) {
  const { currentUser, unreadCount, sidebarOpen, setSidebarOpen } = useApp();
  const navigate = useNavigate();
  const navItems = NAV[currentUser.role] || [];
  const roleLabel = ROLE_LABELS[currentUser.role] || currentUser.role;

  return (
    <>
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div className="mobile-overlay md:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      <aside className={`sidebar ${collapsed ? 'sidebar-collapsed' : ''} ${sidebarOpen ? 'open' : ''}`}>
        {/* Logo */}
        <div style={{ padding: '16px 16px 14px', borderBottom: '1px solid rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <MesicLogo collapsed={collapsed} />
          <button onClick={() => setSidebarOpen(false)} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.5)', cursor: 'pointer' }} className="md:hidden">
            <X size={18} />
          </button>
        </div>

        {/* Role badge */}
        {!collapsed && (
          <div style={{ padding: '8px 12px 4px' }}>
            <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'rgba(251,146,60,0.8)', background: 'rgba(249,115,22,0.12)', border: '1px solid rgba(249,115,22,0.2)', borderRadius: 99, padding: '3px 10px' }}>
              {roleLabel}
            </span>
          </div>
        )}

        {/* Nav */}
        <nav className="flex-1 px-2 py-3 overflow-y-auto" style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={['/admin', '/coordinator', '/recruiter', '/student'].includes(item.to)}
              onClick={() => setSidebarOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 relative group ${
                  isActive
                    ? 'bg-white/15 text-white'
                    : 'text-blue-200/70 hover:bg-white/8 hover:text-white'
                }`
              }
              style={({ isActive }) => isActive ? { borderLeft: '3px solid #F97316', paddingLeft: 9 } : { borderLeft: '3px solid transparent', paddingLeft: 9 }}
            >
              {({ isActive }) => (
                <>
                  {isActive && (
                    <motion.div layoutId="sidebar-active"
                      className="absolute inset-0 rounded-xl"
                      style={{ background: 'rgba(255,255,255,0.12)' }}
                      transition={{ type: 'spring', stiffness: 400, damping: 35 }} />
                  )}
                  <item.icon size={17} className="flex-shrink-0 relative z-10" />
                  {!collapsed && <span className="truncate relative z-10">{item.label}</span>}
                  {item.badge && unreadCount > 0 && (
                    <span className={`${collapsed ? 'absolute top-1 right-1' : 'ml-auto'} relative z-10 bg-red-500 text-white text-xs font-bold rounded-full min-w-[17px] h-[17px] flex items-center justify-center px-1`}>
                      {unreadCount}
                    </span>
                  )}
                  {collapsed && (
                    <div className="absolute left-full ml-3 px-2.5 py-1.5 bg-gray-900 text-white text-xs rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50 shadow-lg">
                      {item.label}
                    </div>
                  )}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Collapse toggle (desktop) */}
        <button onClick={() => setCollapsed(c => !c)}
          className="hidden md:flex items-center justify-center mx-3 mb-2 py-2 text-blue-300 hover:text-white hover:bg-white/10 rounded-lg transition-colors text-sm gap-2">
          {collapsed ? <ChevronRight size={16} /> : <><ChevronLeft size={16} /><span>Collapse</span></>}
        </button>

        {/* User footer + sign out */}
        <div style={{ padding: '10px 12px 14px', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: collapsed ? 0 : 8 }}>
            <img src={currentUser.profileImage} alt={currentUser.name} style={{ width: 30, height: 30, borderRadius: '50%', flexShrink: 0, border: '2px solid rgba(249,115,22,0.4)' }} />
            {!collapsed && (
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ color: '#fff', fontSize: 12, fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{currentUser.name}</p>
                <p style={{ color: 'rgba(148,163,184,1)', fontSize: 11 }}>{currentUser.email.split('@')[0]}</p>
              </div>
            )}
          </div>
          {!collapsed && (
            <button onClick={() => navigate('/login')}
              style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 6, color: 'rgba(248,113,113,0.85)', fontSize: 12, fontWeight: 600, background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.15)', borderRadius: 8, padding: '6px 10px', cursor: 'pointer', transition: 'background 0.15s' }}
              onMouseEnter={e => e.currentTarget.style.background = 'rgba(239,68,68,0.15)'}
              onMouseLeave={e => e.currentTarget.style.background = 'rgba(239,68,68,0.08)'}>
              <LogOut size={13} /> Sign Out
            </button>
          )}
        </div>
      </aside>
    </>
  );
}
