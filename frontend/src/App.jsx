import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AppProvider, useApp } from './context/AppContext';
import PublicLayout from './layouts/PublicLayout';
import AuthLayout from './layouts/AuthLayout';

// Public pages
import Landing from './pages/Landing';
import Register from './pages/Register';
import Pending from './pages/Pending';
import Login from './pages/Login';

// Admin pages
import AdminDashboard from './pages/admin/Dashboard';
import AdminApprovals from './pages/admin/Approvals';
import AdminUsers from './pages/admin/Users';
import AdminAnalytics from './pages/admin/Analytics';
import AdminJobs from './pages/admin/Jobs';
import AdminMapDashboard from './pages/admin/MapDashboard';
import AdminAuditTrail from './pages/admin/AuditTrail';

// Coordinator pages
import CoordDashboard from './pages/coordinator/Dashboard';
import CoordBatches from './pages/coordinator/Batches';
import CoordBatchDetail from './pages/coordinator/BatchDetail';
import CoordJobs from './pages/coordinator/Jobs';
import CoordJobDetail from './pages/coordinator/JobDetail';
import CoordApplications from './pages/coordinator/Applications';
import CoordInstitution from './pages/coordinator/Institution';

// Recruiter pages
import RecruiterDashboard from './pages/recruiter/Dashboard';
import RecruiterJobs from './pages/recruiter/Jobs';
import RecruiterPostJob from './pages/recruiter/PostJob';
import RecruiterApplications from './pages/recruiter/Applications';
import RecruiterJobApplications from './pages/recruiter/JobApplications';
import RecruiterCompany from './pages/recruiter/Company';
import NotificationsPage from './pages/Notifications';

// Student pages
import StudentDashboard from './pages/student/Dashboard';
import StudentJobs from './pages/student/Jobs';
import StudentApplications from './pages/student/Applications';
import StudentProfile from './pages/student/Profile';

function RoleRedirect() {
  const { currentUser } = useApp();
  const routes = { super_admin: '/admin', coordinator: '/coordinator', recruiter: '/recruiter', student: '/student' };
  return <Navigate to={routes[currentUser.role] || '/admin'} replace />;
}

function AppRoutes() {
  return (
    <Routes>
      {/* Public */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/pending" element={<Pending />} />
      </Route>

      {/* Admin */}
      <Route element={<AuthLayout />}>
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/approvals" element={<AdminApprovals />} />
        <Route path="/admin/users" element={<AdminUsers />} />
        <Route path="/admin/jobs" element={<AdminJobs />} />
        <Route path="/admin/analytics" element={<AdminAnalytics />} />
        <Route path="/admin/map" element={<AdminMapDashboard />} />
        <Route path="/admin/audit" element={<AdminAuditTrail />} />
      </Route>

      {/* Coordinator */}
      <Route element={<AuthLayout />}>
        <Route path="/coordinator" element={<CoordDashboard />} />
        <Route path="/coordinator/batches" element={<CoordBatches />} />
        <Route path="/coordinator/batches/:batchId" element={<CoordBatchDetail />} />
        <Route path="/coordinator/jobs" element={<CoordJobs />} />
        <Route path="/coordinator/jobs/:jobId" element={<CoordJobDetail />} />
        <Route path="/coordinator/applications" element={<CoordApplications />} />
        <Route path="/coordinator/institution" element={<CoordInstitution />} />
        <Route path="/coordinator/notifications" element={<NotificationsPage />} />
      </Route>

      {/* Recruiter */}
      <Route element={<AuthLayout />}>
        <Route path="/recruiter" element={<RecruiterDashboard />} />
        <Route path="/recruiter/jobs" element={<RecruiterJobs />} />
        <Route path="/recruiter/jobs/new" element={<RecruiterPostJob />} />
        <Route path="/recruiter/jobs/:jobId/applications" element={<RecruiterJobApplications />} />
        <Route path="/recruiter/applications" element={<RecruiterApplications />} />
        <Route path="/recruiter/company" element={<RecruiterCompany />} />
        <Route path="/recruiter/notifications" element={<NotificationsPage />} />
      </Route>

      {/* Student */}
      <Route element={<AuthLayout />}>
        <Route path="/student" element={<StudentDashboard />} />
        <Route path="/student/jobs" element={<StudentJobs />} />
        <Route path="/student/applications" element={<StudentApplications />} />
        <Route path="/student/profile" element={<StudentProfile />} />
        <Route path="/student/notifications" element={<NotificationsPage />} />
      </Route>

      <Route path="/dashboard" element={<RoleRedirect />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppProvider>
        <AppRoutes />
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3500,
            style: { fontFamily: 'Inter, sans-serif', fontSize: '0.875rem', borderRadius: '10px' },
          }}
        />
      </AppProvider>
    </BrowserRouter>
  );
}
