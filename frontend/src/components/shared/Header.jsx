import { Menu, ChevronDown, LogOut } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '../../context/AppContext';
import NotificationBell from './NotificationBell';
import { MOCK_USERS } from '../../data/mockData';

const dropdownVariants = {
  hidden:  { opacity: 0, y: -6, scale: 0.97 },
  visible: { opacity: 1, y: 0,  scale: 1,    transition: { duration: 0.18, ease: 'easeOut' } },
  exit:    { opacity: 0, y: -4, scale: 0.97, transition: { duration: 0.12 } },
};

export default function Header({ collapsed }) {
  const { currentUser, switchUser, setSidebarOpen } = useApp();
  const [profileOpen, setProfileOpen] = useState(false);
  const [roleSwitchOpen, setRoleSwitchOpen] = useState(false);
  const profileRef = useRef(null);
  const roleRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handler = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) setProfileOpen(false);
      if (roleRef.current && !roleRef.current.contains(e.target)) setRoleSwitchOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const roleRoutes = { super_admin: '/admin', coordinator: '/coordinator', recruiter: '/recruiter', student: '/student' };

  const handleSwitch = (userId) => {
    const user = MOCK_USERS.find(u => u._id === userId);
    switchUser(userId);
    setRoleSwitchOpen(false);
    navigate(roleRoutes[user.role] || '/');
  };

  const approvedUsers = MOCK_USERS.filter(u => u.approvalStatus === 'approved');

  return (
    <header className="h-14 bg-white border-b border-gray-100 flex items-center px-5 gap-3 sticky top-0 z-30"
      style={{ boxShadow: '0 1px 0 #F1F5F9' }}>

      <button onClick={() => setSidebarOpen(true)}
        className="md:hidden p-2 rounded-lg hover:bg-gray-100 text-gray-500 transition-colors">
        <Menu size={19} />
      </button>

      <div className="flex-1" />

      {/* Role switcher */}
      <div className="relative" ref={roleRef}>
        <button onClick={() => setRoleSwitchOpen(o => !o)}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors"
          style={{ background: '#FEF3C7', color: '#92400E', border: '1px solid #FDE68A' }}>
          <span className="hidden sm:inline">Switch Role</span>
          <ChevronDown size={12} />
        </button>
        <AnimatePresence>
          {roleSwitchOpen && (
            <motion.div variants={dropdownVariants} initial="hidden" animate="visible" exit="exit"
              className="absolute right-0 top-full mt-2 w-64 bg-white rounded-2xl overflow-hidden"
              style={{ boxShadow: '0 8px 32px rgba(0,0,0,0.12), 0 0 0 1px rgba(0,0,0,0.06)', zIndex: 50 }}>
              <div className="px-4 py-2.5 border-b border-gray-50">
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest">Demo Accounts</p>
              </div>
              {approvedUsers.map(u => (
                <button key={u._id} onClick={() => handleSwitch(u._id)}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors"
                  style={{ background: currentUser._id === u._id ? '#EFF6FF' : 'transparent' }}
                  onMouseEnter={e => { if (currentUser._id !== u._id) e.currentTarget.style.background = '#F8FAFC'; }}
                  onMouseLeave={e => { if (currentUser._id !== u._id) e.currentTarget.style.background = 'transparent'; }}>
                  <img src={u.profileImage} alt={u.name} className="w-7 h-7 rounded-full flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-800 truncate">{u.name}</p>
                    <p className="text-xs text-gray-400 capitalize">{u.role.replace('_', ' ')}</p>
                  </div>
                  {currentUser._id === u._id && <div className="w-1.5 h-1.5 rounded-full bg-blue-500 flex-shrink-0" />}
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <NotificationBell />

      {/* Profile */}
      <div className="relative" ref={profileRef}>
        <button onClick={() => setProfileOpen(o => !o)}
          className="flex items-center gap-2.5 hover:bg-gray-50 rounded-xl px-2.5 py-1.5 transition-colors">
          <img src={currentUser.profileImage} alt={currentUser.name} className="w-7 h-7 rounded-full flex-shrink-0" />
          <div className="hidden sm:block text-left">
            <p className="text-sm font-semibold text-gray-800 leading-tight">{currentUser.name.split(' ')[0]}</p>
            <p className="text-xs text-gray-400 capitalize leading-tight">{currentUser.role.replace('_', ' ')}</p>
          </div>
          <ChevronDown size={13} className="text-gray-400 hidden sm:block" />
        </button>
        <AnimatePresence>
          {profileOpen && (
            <motion.div variants={dropdownVariants} initial="hidden" animate="visible" exit="exit"
              className="absolute right-0 top-full mt-2 w-52 bg-white rounded-2xl overflow-hidden"
              style={{ boxShadow: '0 8px 32px rgba(0,0,0,0.12), 0 0 0 1px rgba(0,0,0,0.06)', zIndex: 50 }}>
              <div className="px-4 py-3 border-b border-gray-50">
                <p className="text-sm font-semibold text-gray-800">{currentUser.name}</p>
                <p className="text-xs text-gray-400 truncate mt-0.5">{currentUser.email}</p>
              </div>
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
