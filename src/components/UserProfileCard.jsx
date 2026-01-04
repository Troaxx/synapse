import React from 'react';
import { useNavigate } from 'react-router-dom';

const UserProfileCard = ({
    user,
    role,
    subtext, // Optional extra text (e.g. email or "Physics Tutor")
    isClickable = false,
    targetUrl, // URL to navigate to if clickable
    className = ''
}) => {
    const navigate = useNavigate();

    const handleClick = () => {
        if (isClickable && targetUrl) {
            navigate(targetUrl);
        }
    };

    if (!user) return null;

    return (
        <div
            className={`flex items-center gap-4 ${isClickable ? 'cursor-pointer hover:bg-gray-50 p-2 rounded-lg transition-colors -ml-2' : ''} ${className}`}
            onClick={handleClick}
        >
            <div className="w-16 h-16 bg-gray-300 rounded-full overflow-hidden flex-shrink-0">
                {user.profilePhoto ? (
                    <img src={user.profilePhoto} alt={user.name} className="w-full h-full object-cover" />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-white font-semibold bg-gray-400 text-xl">
                        {user.name?.charAt(0)}
                    </div>
                )}
            </div>
            <div>
                {role && <h3 className="text-lg font-semibold text-gray-900">{role}</h3>}
                <p className={`text-gray-900 ${role ? '' : 'font-semibold text-lg'}`}>{user.name || 'Unknown'}</p>
                {(user.email || subtext) && (
                    <p className="text-sm text-gray-500">{subtext || user.email}</p>
                )}
            </div>
        </div>
    );
};

export default UserProfileCard;
