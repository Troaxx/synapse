import React from 'react';
import { Link, useLocation } from 'react-router-dom';

import DashboardIcon from '../assets/icons/dashboard.svg';
import PersonSearchIcon from '../assets/icons/user-plus.svg';
import BookOnlineIcon from '../assets/icons/bookmark.svg';
import HistoryIcon from '../assets/icons/history.svg';
import DashboardIconAdmin from '../assets/icons/dashboard.svg'; // Assuming same icon for now, adjust if needed

// NavItem Component
const NavItem = ({ to, icon, text, badge }) => {
    const location = useLocation();
    // Active state logic: check if pathname starts with the 'to' path (ignoring query params)
    const isActive = location.pathname === to.split('?')[0];

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
            {badge > 0 && (
                <span className="ml-auto bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                    {badge}
                </span>
            )}
        </Link>
    );
};

const Sidebar = ({ user, pendingCount }) => {
    return (
        <aside className="w-52 flex flex-col bg-white">
            <div className="p-6 flex items-center gap-2">
                <img src="/synapse_logo.png" alt="Synapse Logo" className="h-10" />
            </div>

            <nav className="px-4 space-y-1 flex-1">
                {user?.isAdmin ? (
                    <NavItem to="/admin" icon={DashboardIconAdmin} text="Admin Panel" />
                ) : (
                    <>
                        <NavItem to="/" icon={DashboardIcon} text="Dashboard" />
                        <NavItem to="/find-tutors" icon={PersonSearchIcon} text="Find Tutors" />
                        <NavItem
                            to="/bookings?tab=confirmed"
                            icon={BookOnlineIcon}
                            text={user?.isTutor ? 'Requests' : 'My Bookings'}
                            badge={pendingCount}
                        />
                        <NavItem to="/history" icon={HistoryIcon} text="History" />
                    </>
                )}
            </nav>
        </aside>
    );
};

export default Sidebar;
