import React from 'react';
import './App.css';
import Home from './pages/home';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PersonSearchIcon from '@mui/icons-material/PersonSearch';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import BookOnlineIcon from '@mui/icons-material/BookOnline';
import SettingsIcon from '@mui/icons-material/Settings';
import NotificationsIcon from '@mui/icons-material/Notifications';
import SearchIcon from '@mui/icons-material/Search';

function App() {
  return (
    <div className="flex h-screen" style={{ backgroundColor: '#f9fafb' }}>
      {/* Sidebar */}
      <aside className="w-52 flex flex-col" style={{ backgroundColor: 'white' }}>
        {/* Logo Section */}
        <div className="p-6 flex items-center gap-2">
          <img src="/synapse_logo.png" alt="Synapse Logo" className="h-10" />
        </div>
        
        <nav className="px-4 space-y-1 flex-1">
          <div className="px-4 py-3 flex items-center gap-3 rounded-lg font-medium" style={{ backgroundColor: '#1e40af', color: 'white' }}>
            <DashboardIcon style={{ fontSize: '20px' }} />
            <span className="text-sm">Dashboard</span>
          </div>
          <NavItem icon={<PersonSearchIcon />} text="Find Tutors" />
          <NavItem icon={<CalendarMonthIcon />} text="Schedule" />
          <NavItem icon={<BookOnlineIcon />} text="My Bookings" />
          <NavItem icon={<SettingsIcon />} text="Settings" />
        </nav>
      </aside>

      {/* Main content area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="h-16 flex items-center justify-between px-6 border-b" style={{ backgroundColor: 'white', borderColor: '#e5e7eb' }}>
          <div className="flex-1 flex items-center justify-center px-6" style={{ maxWidth: '560px' }}>
            <div className="w-full relative">
              <SearchIcon className="absolute left-3" style={{ top: '50%', transform: 'translateY(-50%)', color: '#9ca3af', fontSize: '18px' }} />
              <input 
                type="text" 
                placeholder="Search" 
                className="w-full rounded-lg px-9 py-2 outline-none text-sm border" 
                style={{ color: '#374151', borderColor: '#e5e7eb' }}
              />
            </div>
          </div>

          <div className="flex items-center gap-4">
            <NotificationsIcon style={{ color: '#6b7280', fontSize: '22px', cursor: 'pointer' }} />
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-full overflow-hidden">
                <img src="/assets/dylans-face.png" alt="Daniella" className="w-full h-full object-cover" />
              </div>
              <span className="text-gray-900 text-sm font-medium">Daniella</span>
              <span className="text-gray-500" style={{ fontSize: '10px' }}>▼</span>
            </div>
          </div>
        </header>

        {/* Content */}
        <Home />
      </div>
    </div>
  );
}

function NavItem({ icon, text }) {
  return (
    <div className="px-4 py-3 flex items-center gap-3 rounded-lg cursor-pointer transition-colors hover:bg-gray-50" style={{ color: '#6b7280' }}>
      <span style={{ fontSize: '20px' }}>{icon}</span>
      <span className="text-sm">{text}</span>
    </div>
  );
}

export default App;
