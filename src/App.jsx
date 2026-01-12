import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import './App.css';
import { AuthProvider, useAuth } from './context/AuthContext';
import { sessionAPI, notificationAPI } from './services/api';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import FindTutors from './pages/FindTutors';
import TutorProfile from './pages/TutorProfile';
import BookingForm from './pages/BookingForm';
import MyBookings from './pages/MyBookings';
import SessionDetails from './pages/SessionDetails';
import SessionHistory from './pages/SessionHistory';
import ProfileSettings from './pages/ProfileSettings';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import AdminDashboard from './pages/AdminDashboard';
import LeaveReview from './pages/LeaveReview';
import NotFound from './pages/NotFound';
import Sidebar from './components/Sidebar';
import Header from './components/Header';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  return user ? children : <Navigate to="/login" />;
};

function AppContent() {
  const { user, logout } = useAuth();
  const location = useLocation();

  // Notification State
  const [notifications, setNotifications] = React.useState([]);
  const [unreadCount, setUnreadCount] = React.useState(0);
  const [showNotifications, setShowNotifications] = React.useState(false);
  const [pendingCount, setPendingCount] = React.useState(0);

  const isAuthPage = location.pathname === '/login' || location.pathname === '/register' || location.pathname === '/forgot-password' || location.pathname.startsWith('/reset-password');

  React.useEffect(() => {
    if (user && !isAuthPage) {
      fetchNotifications();
      fetchPendingCount();
      // Optional: Poll every 30s
      const interval = setInterval(() => {
        fetchNotifications();
        fetchPendingCount();
      }, 30000);
      return () => clearInterval(interval);
    }
  }, [user, isAuthPage]);

  const fetchNotifications = async () => {
    try {
      const res = await notificationAPI.getNotifications();
      setNotifications(res.data);
      setUnreadCount(res.data.filter(n => !n.read).length);
    } catch (error) {
      console.error("Failed to fetch notifications", error);
    }
  };

  const fetchPendingCount = async () => {
    try {
      const res = await sessionAPI.getUserSessions({});
      const count = res.data.filter(s => s.status === 'Pending').length;
      setPendingCount(count);
    } catch (error) {
      console.error("Failed to fetch pending count", error);
    }
  };

  const handleMarkAsRead = async (id) => {
    try {
      await notificationAPI.markAsRead(id);
      fetchNotifications(); // Refresh
      setShowNotifications(false);
    } catch (error) {
      console.error("Failed to mark read", error);
    }
  };

  const toggleNotifications = () => {
    setShowNotifications(!showNotifications);
  };

  if (isAuthPage) {
    return (
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
      </Routes>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar user={user} pendingCount={pendingCount} />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Header
          user={user}
          unreadCount={unreadCount}
          showNotifications={showNotifications}
          notifications={notifications}
          toggleNotifications={toggleNotifications}
          fetchNotifications={fetchNotifications}
          handleMarkAsRead={handleMarkAsRead}
          logout={logout}
        />

        <main className="flex-1 overflow-y-auto">
          <Routes>
            <Route path="/" element={user?.isAdmin ? <Navigate to="/admin" /> : <ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/find-tutors" element={<ProtectedRoute><FindTutors /></ProtectedRoute>} />
            <Route path="/tutor/:id" element={<ProtectedRoute><TutorProfile /></ProtectedRoute>} />
            <Route path="/booking/:id" element={<ProtectedRoute><BookingForm /></ProtectedRoute>} />
            <Route path="/bookings" element={<ProtectedRoute><MyBookings /></ProtectedRoute>} />
            <Route path="/session/:id" element={<ProtectedRoute><SessionDetails /></ProtectedRoute>} />
            <Route path="/history" element={<ProtectedRoute><SessionHistory /></ProtectedRoute>} />
            <Route path="/review/:sessionId" element={<ProtectedRoute><LeaveReview /></ProtectedRoute>} />
            <Route path="/admin" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
            <Route path="/settings" element={<ProtectedRoute><ProfileSettings /></ProtectedRoute>} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
}

export default App;
