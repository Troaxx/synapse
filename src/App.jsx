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
import SessionDetails from './pages/SessionDetails';
import SessionHistory from './pages/SessionHistory';
import ProfileSettings from './pages/ProfileSettings';
import SubjectBrowse from './pages/SubjectBrowse';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import AdminDashboard from './pages/AdminDashboard';

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
    <div className="flex h-screen bg-gray-50">
      <aside className="w-52 flex flex-col bg-white">
        <div className="p-6 flex items-center gap-2">
          <img src="/synapse_logo.png" alt="Synapse Logo" className="h-10" />
        </div>

        <nav className="px-4 space-y-1 flex-1">
          {user?.isAdmin ? (
            <NavItem to="/admin" icon={DashboardIcon} text="Admin Panel" />
          ) : (
            <>
              <NavItem to="/" icon={DashboardIcon} text="Dashboard" />
              <NavItem to="/find-tutors" icon={PersonSearchIcon} text="Find Tutors" />
              <NavItem to="/bookings" icon={BookOnlineIcon} text={user?.isTutor ? 'Requests' : 'My Bookings'} />
              <NavItem to="/history" icon={HistoryIcon} text="History" />
            </>
          )}
        </nav>
      </aside>

      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="h-16 flex items-center justify-between px-6 border-b bg-white border-gray-200">
          <div className="flex-1 flex items-center justify-center px-6 max-w-[560px]">
            <div className="w-full relative">
              <img src={SearchIcon} alt="search" className="absolute left-3 w-5 h-5 opacity-40 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search"
                className="w-full rounded-lg px-9 py-2 outline-none text-sm border text-gray-700 border-gray-200"
              />
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button className="p-2 text-gray-400 hover:text-gray-500 relative">
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full"></span>
              <img src={BellIcon} alt="notifications" className="w-6 h-6" />
            </button>

            <div className="relative group">
              <button className="flex items-center gap-2.5 cursor-pointer hover:opacity-80 transition-opacity focus:outline-none">
                <div className="w-9 h-9 rounded-full overflow-hidden bg-gray-300">
                  {user?.profilePhoto ? (
                    <img src={user.profilePhoto} alt={user.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-white font-semibold transform bg-blue-500">
                      {user?.name?.charAt(0)}
                    </div>
                  )}
                </div>
                <span className="text-gray-900 text-sm font-medium">{user?.name}</span>
                <span className="text-gray-500 text-[10px]">▼</span>
              </button>

              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 ring-1 ring-black ring-opacity-5">
                <Link to="/settings" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                  Profile Settings
                </Link>
                <div className="border-t border-gray-100"></div>
                <button
                  onClick={logout}
                  className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 flex items-center gap-2"
                >
                  <img src={LogoutIcon} alt="logout" className="w-4 h-4" />
                  Logout
                </button>
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto">
          <Routes>
            <Route path="/" element={user?.isAdmin ? <Navigate to="/admin" /> : <ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/find-tutors" element={<ProtectedRoute><FindTutors /></ProtectedRoute>} />
            <Route path="/tutor/:id" element={<ProtectedRoute><TutorProfile /></ProtectedRoute>} />
            <Route path="/subjects" element={<ProtectedRoute><SubjectBrowse /></ProtectedRoute>} />
            <Route path="/booking/:id" element={<ProtectedRoute><BookingForm /></ProtectedRoute>} />
            <Route path="/bookings" element={<ProtectedRoute><MyBookings /></ProtectedRoute>} />
            <Route path="/session/:id" element={<ProtectedRoute><SessionDetails /></ProtectedRoute>} />
            <Route path="/history" element={<ProtectedRoute><SessionHistory /></ProtectedRoute>} />
            <Route path="/admin" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
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
      className={`px-4 py-3 flex items-center gap-3 rounded-lg cursor-pointer transition-colors ${isActive ? 'bg-blue-800 text-white hover:bg-blue-900' : 'text-gray-500 hover:bg-gray-50'
        }`}
    >
      <img
        src={icon}
        alt={text}
        className={`w-5 h-5 transition-all ${isActive ? 'invert brightness-200' : 'grayscale opacity-60'
          }`}
      />
      <span className="text-sm">{text}</span>
    </Link>
  );
}

export default App;
