import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation, Navigate } from 'react-router-dom';
import './App.css';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import TutorDashboard from './pages/TutorDashboard';
import FindTutors from './pages/FindTutors';
import TutorProfile from './pages/TutorProfile';
import BookingForm from './pages/BookingForm';
import MyBookings from './pages/MyBookings';
import SessionHistory from './pages/SessionHistory';
import ProfileSettings from './pages/ProfileSettings';
import SubjectBrowse from './pages/SubjectBrowse';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';

import BellIcon from './assets/icons/bell.svg';
import DashboardIcon from './assets/icons/dashboard.svg';
import PersonSearchIcon from './assets/icons/user-plus.svg';
import BookOnlineIcon from './assets/icons/bookmark.svg';
import SettingsIcon from './assets/icons/settings.svg';
import SearchIcon from './assets/icons/search.svg';
import HistoryIcon from './assets/icons/history.svg';
import MenuBookIcon from './assets/icons/book-open.svg';
import LogoutIcon from './assets/icons/logout.svg';

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

  const isAuthPage = location.pathname === '/login' || location.pathname === '/register' || location.pathname === '/forgot-password' || location.pathname.startsWith('/reset-password');

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
    <div className="flex h-screen" style={{ backgroundColor: '#f9fafb' }}>
      <aside className="w-52 flex flex-col" style={{ backgroundColor: 'white' }}>
        <div className="p-6 flex items-center gap-2">
          <img src="/synapse_logo.png" alt="Synapse Logo" className="h-10" />
        </div>

        <nav className="px-4 space-y-1 flex-1">
          <NavItem to="/" icon={DashboardIcon} text="Dashboard" />
          <NavItem to="/find-tutors" icon={PersonSearchIcon} text="Find Tutors" />
          <NavItem to="/bookings" icon={BookOnlineIcon} text={user?.isTutor ? 'My Sessions' : 'My Bookings'} />
          <NavItem to="/history" icon={HistoryIcon} text="History" />
          <NavItem to="/subjects" icon={MenuBookIcon} text="Subjects" />
          <NavItem to="/settings" icon={SettingsIcon} text="Settings" />
        </nav>

        <div className="px-4 pb-4">
          <button
            onClick={logout}
            className="w-full px-4 py-3 flex items-center gap-3 rounded-lg cursor-pointer transition-colors hover:bg-gray-50 text-red-600"
          >
            <img src={LogoutIcon} alt="logout" className="w-5 h-5" style={{ filter: 'invert(27%) sepia(85%) saturate(3015%) hue-rotate(345deg) brightness(85%) contrast(106%)' }} />
            <span className="text-sm">Logout</span>
          </button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="h-16 flex items-center justify-between px-6 border-b" style={{ backgroundColor: 'white', borderColor: '#e5e7eb' }}>
          <div className="flex-1 flex items-center justify-center px-6" style={{ maxWidth: '560px' }}>
            <div className="w-full relative">
              <img src={SearchIcon} alt="search" className="absolute left-3 w-5 h-5 opacity-40" style={{ top: '50%', transform: 'translateY(-50%)' }} />
              <input
                type="text"
                placeholder="Search"
                className="w-full rounded-lg px-9 py-2 outline-none text-sm border"
                style={{ color: '#374151', borderColor: '#e5e7eb' }}
              />
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button className="p-2 text-gray-400 hover:text-gray-500 relative">
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full"></span>
              <img src={BellIcon} alt="notifications" className="w-6 h-6" />
            </button>
            <Link to="/settings" className="flex items-center gap-2.5 cursor-pointer hover:opacity-80 transition-opacity">
              <div className="w-9 h-9 rounded-full overflow-hidden bg-gray-300">
                {user?.profilePhoto ? (
                  <img src={user.profilePhoto} alt={user.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-white font-semibold">
                    {user?.name?.charAt(0)}
                  </div>
                )}
              </div>
              <span className="text-gray-900 text-sm font-medium">{user?.name}</span>
              <span className="text-gray-500" style={{ fontSize: '10px' }}>▼</span>
            </Link>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto">
          <Routes>
            <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/find-tutors" element={<ProtectedRoute><FindTutors /></ProtectedRoute>} />
            <Route path="/tutor/:id" element={<ProtectedRoute><TutorProfile /></ProtectedRoute>} />
            <Route path="/subjects" element={<ProtectedRoute><SubjectBrowse /></ProtectedRoute>} />
            <Route path="/booking/:id" element={<ProtectedRoute><BookingForm /></ProtectedRoute>} />
            <Route path="/bookings" element={<ProtectedRoute><MyBookings /></ProtectedRoute>} />
            <Route path="/history" element={<ProtectedRoute><SessionHistory /></ProtectedRoute>} />
            <Route path="/settings" element={<ProtectedRoute><ProfileSettings /></ProtectedRoute>} />
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

function NavItem({ to, icon, text }) {
  const location = useLocation();
  const isActive = location.pathname === to;

  return (
    <Link
      to={to}
      className="px-4 py-3 flex items-center gap-3 rounded-lg cursor-pointer transition-colors hover:bg-gray-50"
      style={{
        backgroundColor: isActive ? '#1e40af' : 'transparent',
        color: isActive ? 'white' : '#6b7280'
      }}
    >
      <img
        src={icon}
        alt={text}
        className="w-5 h-5 transition-all"
        style={{
          filter: isActive ? 'invert(100%) brightness(200%)' : 'grayscale(100%) opacity(0.6)',
        }}
      />
      <span className="text-sm">{text}</span>
    </Link>
  );
}

export default App;
