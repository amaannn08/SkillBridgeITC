import { Menu, ChevronDown, LogOut } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '../../context/AppContext';
import NotificationBell from './NotificationBell';

const dropdownVariants = {
  hidden:  { opacity: 0, y: -6, scale: 0.97 },
  visible: { opacity: 1, y: 0,  scale: 1,    transition: { duration: 0.18, ease: 'easeOut' } },
  exit:    { opacity: 0, y: -4, scale: 0.97, transition: { duration: 0.12 } },
};

const ROLE_LABELS = {
  super_admin: 'District Collector',
  coordinator: 'Coordinator',
  recruiter:   'Recruiter',
  student:     'Student',
};

export default function Header({ collapsed }) {
  const { currentUser, setSidebarOpen } = useApp();
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handler = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) setProfileOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const roleLabel = ROLE_LABELS[currentUser.role] || currentUser.role;

  return (
    <header className="h-14 bg-white border-b border-gray-100 flex items-center px-5 gap-3 sticky top-0 z-30"
      style={{ boxShadow: '0 1px 0 #F1F5F9' }}>

      {/* Mobile hamburger */}
      <button onClick={() => setSidebarOpen(true)}
        className="md:hidden p-2 rounded-lg hover:bg-gray-100 text-gray-500 transition-colors">
        <Menu size={19} />
      </button>

      <div className="flex-1" />

      <NotificationBell />

      {/* Profile dropdown */}
      <div className="relative" ref={profileRef}>
        <button onClick={() => setProfileOpen(o => !o)}
          className="flex items-center gap-2.5 hover:bg-gray-50 rounded-xl px-2.5 py-1.5 transition-colors">
          <img src={currentUser.profileImage} alt={currentUser.name} className="w-7 h-7 rounded-full flex-shrink-0" />
          <div className="hidden sm:block text-left">
            <p className="text-sm font-semibold text-gray-800 leading-tight">{currentUser.name.split(' ')[0]}</p>
            <p className="text-xs text-gray-400 leading-tight">{roleLabel}</p>
          </div>
          <ChevronDown size={13} className="text-gray-400 hidden sm:block" />
        </button>

        <AnimatePresence>
          {profileOpen && (
            <motion.div variants={dropdownVariants} initial="hidden" animate="visible" exit="exit"
              className="absolute right-0 top-full mt-2 w-56 bg-white rounded-2xl overflow-hidden"
              style={{ boxShadow: '0 8px 32px rgba(0,0,0,0.12), 0 0 0 1px rgba(0,0,0,0.06)', zIndex: 50 }}>

              {/* User info */}
              <div className="px-4 py-3 border-b border-gray-50">
                <p className="text-sm font-semibold text-gray-800">{currentUser.name}</p>
                <p className="text-xs text-gray-400 truncate mt-0.5">{currentUser.email}</p>
                <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.06em', color: '#C2410C', background: '#FFEDD5', padding: '2px 8px', borderRadius: 99, display: 'inline-block', marginTop: 6 }}>
                  {roleLabel}
                </span>
              </div>

              {/* Sign out */}
              <button onClick={() => navigate('/')}
                className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm font-medium text-red-500 hover:bg-red-50 transition-colors">
                <LogOut size={14} /> Sign Out
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
}

