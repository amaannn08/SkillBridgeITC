import { createContext, useContext, useState, useEffect } from 'react';
import { MOCK_USERS, MOCK_NOTIFICATIONS } from '../data/mockData';

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(MOCK_USERS[0]); // default: admin
  const [notifications, setNotifications] = useState(MOCK_NOTIFICATIONS[MOCK_USERS[0]._id] || []);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Switch role/user (dev tool)
  const switchUser = (userId) => {
    const user = MOCK_USERS.find(u => u._id === userId);
    if (user) {
      setCurrentUser(user);
      setNotifications(MOCK_NOTIFICATIONS[user._id] || []);
    }
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  const markNotifRead = (notifId) => {
    setNotifications(prev => prev.map(n => n._id === notifId ? { ...n, read: true } : n));
  };

  const markAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  return (
    <AppContext.Provider value={{
      currentUser, switchUser,
      notifications, unreadCount, markNotifRead, markAllRead,
      sidebarOpen, setSidebarOpen,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be inside AppProvider');
  return ctx;
};
