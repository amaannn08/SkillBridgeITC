import { NavLink, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  LayoutDashboard, CheckSquare, Users, Briefcase, BarChart3,
  Building2, FileText, Bell, ChevronLeft, ChevronRight,
  ClipboardList, Upload, X, User, MapPin, ShieldCheck,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

const NAV = {
  super_admin: [
    { label: 'Dashboard',         icon: LayoutDashboard, to: '/admin'            },
    { label: 'District Map',      icon: MapPin,          to: '/admin/map'        },
    { label: 'Pending Approvals', icon: CheckSquare,     to: '/admin/approvals', badge: true },
    { label: 'All Users',         icon: Users,           to: '/admin/users'      },
    { label: 'Job Requirements',  icon: Briefcase,       to: '/admin/jobs'       },
    { label: 'Analytics',         icon: BarChart3,       to: '/admin/analytics'  },
    { label: 'Audit Trail',       icon: ShieldCheck,     to: '/admin/audit'      },
  ],
  coordinator: [
    { label: 'Dashboard',          icon: LayoutDashboard, to: '/coordinator'               },
    { label: 'Browse Jobs',        icon: Briefcase,       to: '/coordinator/jobs'          },
    { label: 'My Applications',    icon: FileText,        to: '/coordinator/applications'  },
    { label: 'Talent Pool Batches',icon: Users,           to: '/coordinator/batches'       },
    { label: 'Institution Profile',icon: Building2,       to: '/coordinator/institution'   },
    { label: 'Notifications',      icon: Bell,            to: '/coordinator/notifications', badge: true },
  ],
  recruiter: [
    { label: 'Dashboard',          icon: LayoutDashboard, to: '/recruiter'                  },
    { label: 'My Job Postings',    icon: Briefcase,       to: '/recruiter/jobs'             },
    { label: 'Post New Job',       icon: Upload,          to: '/recruiter/jobs/new'         },
    { label: 'Applications',       icon: ClipboardList,   to: '/recruiter/applications'     },
    { label: 'Company Profile',    icon: Building2,       to: '/recruiter/company'          },
    { label: 'Notifications',      icon: Bell,            to: '/recruiter/notifications',    badge: true },
  ],
  student: [
    { label: 'Dashboard',       icon: LayoutDashboard, to: '/student'                    },
    { label: 'Browse Jobs',     icon: Briefcase,       to: '/student/jobs'               },
    { label: 'My Applications', icon: ClipboardList,   to: '/student/applications'       },
    { label: 'My Profile',      icon: User,            to: '/student/profile'            },
    { label: 'Notifications',   icon: Bell,            to: '/student/notifications', badge: true },
  ],
};

const ROLE_LABELS = {
  super_admin: 'Super Admin',
  coordinator: 'Coordinator',
  recruiter: 'Recruiter',
  student: 'Student',
};

export default function Sidebar({ collapsed, setCollapsed }) {
  const { currentUser, unreadCount, sidebarOpen, setSidebarOpen } = useApp();
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
        <div className="flex items-center gap-3 px-4 py-4 border-b border-white/10">
          {collapsed
            ? <img src="/logo.png" alt="SkillBridge" style={{ width: 36, height: 36, objectFit: 'contain', flexShrink: 0 }} />
            : <img src="/logo.png" alt="SkillBridge" style={{ height: 36, maxWidth: 160, objectFit: 'contain', flexShrink: 0 }} />
          }
          {!collapsed && (
            <p className="text-blue-300 text-xs animate-fade-in">{roleLabel} Portal</p>
          )}
          <button
            onClick={() => setSidebarOpen(false)}
            className="ml-auto text-white/60 hover:text-white md:hidden"
          >
            <X size={18} />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-2 py-4 overflow-y-auto" style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {navItems.map((item, idx) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/admin' || item.to === '/coordinator' || item.to === '/recruiter' || item.to === '/student'}
              onClick={() => setSidebarOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 relative group ${
                  isActive ? 'bg-white/15 text-white' : 'text-blue-200/80 hover:bg-white/8 hover:text-white'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  {isActive && (
                    <motion.div layoutId="sidebar-active"
                      className="absolute inset-0 rounded-xl"
                      style={{ background: 'rgba(255,255,255,0.15)' }}
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

        {/* Collapse toggle (desktop only) */}
        <button
          onClick={() => setCollapsed(c => !c)}
          className="hidden md:flex items-center justify-center mx-3 mb-3 py-2 text-blue-300 hover:text-white hover:bg-white/10 rounded-lg transition-colors text-sm gap-2"
        >
          {collapsed ? <ChevronRight size={16} /> : <><ChevronLeft size={16} /><span>Collapse</span></>}
        </button>

        {/* User footer */}
        <div className="px-3 pb-4 border-t border-white/10 pt-3">
          <div className="flex items-center gap-2">
            <img src={currentUser.profileImage} alt={currentUser.name} className="w-8 h-8 rounded-full flex-shrink-0" />
            {!collapsed && (
              <div className="flex-1 min-w-0 animate-fade-in">
                <p className="text-white text-xs font-semibold truncate">{currentUser.name}</p>
                <p className="text-blue-300 text-xs truncate">{currentUser.email}</p>
              </div>
            )}
          </div>
        </div>
      </aside>
    </>
  );
}
