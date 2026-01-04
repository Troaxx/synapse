import React from 'react';
import { Link } from 'react-router-dom';

import BellIcon from '../assets/icons/bell.svg';
import SearchIcon from '../assets/icons/search.svg';
import LogoutIcon from '../assets/icons/logout.svg';

const Header = ({
    user,
    unreadCount,
    showNotifications,
    notifications,
    toggleNotifications,
    fetchNotifications,
    handleMarkAsRead,
    logout
}) => {
    return (
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
                <div className="relative">
                    <button
                        onClick={toggleNotifications}
                        className="p-2 text-gray-400 hover:text-gray-500 relative focus:outline-none"
                    >
                        {unreadCount > 0 && (
                            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full"></span>
                        )}
                        <img src={BellIcon} alt="notifications" className="w-6 h-6" />
                    </button>

                    {/* Notification Dropdown */}
                    {showNotifications && (
                        <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-xl py-2 z-50 ring-1 ring-black ring-opacity-5 max-h-96 overflow-y-auto">
                            <div className="px-4 py-2 border-b border-gray-100 flex justify-between items-center">
                                <h3 className="font-semibold text-gray-900">Notifications</h3>
                                <button onClick={fetchNotifications} className="text-xs text-blue-600 hover:text-blue-800">Refresh</button>
                            </div>
                            {notifications.length === 0 ? (
                                <div className="px-4 py-8 text-center text-gray-500 text-sm">
                                    No notifications
                                </div>
                            ) : (
                                <div>
                                    {notifications.map(notification => (
                                        <div
                                            key={notification._id}
                                            className={`px-4 py-3 hover:bg-gray-50 border-b border-gray-50 last:border-b-0 cursor-pointer ${!notification.read ? 'bg-blue-50' : ''}`}
                                            onClick={() => handleMarkAsRead(notification._id)}
                                        >
                                            <div className="flex justify-between items-start">
                                                <p className={`text-sm ${!notification.read ? 'font-semibold text-gray-900' : 'text-gray-700'}`}>
                                                    {notification.title}
                                                </p>
                                                <span className="text-xs text-gray-400 whitespace-nowrap ml-2">
                                                    {new Date(notification.createdAt).toLocaleDateString()}
                                                </span>
                                            </div>
                                            <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                                                {notification.message}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}
                </div>

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
    );
};

export default Header;
