import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import SettingsIcon from '../assets/icons/settings.svg';

const MyProfile = () => {
    const { user } = useAuth();
    const navigate = useNavigate();

    // We can use local state if we needed to fetch more data, but 'user' from context usually has the profile info.
    // However, specifically for 'subjectsNeed' etc, let's verify if they are on 'user'.
    // Looking at ProfileSettings.jsx, they are on 'user.subjectsNeedHelp' etc.

    // Helper to ensure lists
    const subjectsOffer = user?.tutorProfile?.subjects || [];

    useEffect(() => {
        document.title = 'Synapse - My Profile';
    }, []);

    // Note: ProfileSettings used 'user.subjectsCanTeach' for non-tutors?
    // Let's check ProfileSettings logic.
    // "setSubjectsOffer(user.subjectsCanTeach || []);"
    // But for tutors it used 'user.tutorProfile.subjects'.
    // Let's stick to simple logic: Check both or preference.
    // In ProfileSettings, the *preview* logic for tutors used `user.tutorProfile.subjects`.
    // The logic for non-tutors (subjectsCanTeach) seemed to be there but maybe unused if the specific "tutor toggle" logic replaced it.
    // Let's check the code I wrote for ProfileSettings preview.
    // It had: 
    /*
       {user?.isTutor && user?.tutorProfile?.subjects?.length > 0 && ( ... map subjects ... )}
    */
    // And also generic:
    /*
       {subjectsOffer.length > 0 && ( ... map subjectsOffer ... )}
    */
    // I will reproduce that logic.

    const subjectsCanTeach = user?.subjectsCanTeach || [];
    const subjectsNeedHelp = user?.subjectsNeedHelp || [];

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="bg-white rounded-lg shadow-sm p-8 relative">

                    {/* Header with Gear Icon */}
                    <div className="flex justify-between items-start mb-8">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
                            {user?.isTutor && (
                                <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded mt-2 inline-block">
                                    Tutor Account
                                </span>
                            )}
                        </div>
                        <button
                            onClick={() => navigate('/settings')}
                            className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors"
                            title="Profile Settings"
                        >
                            <img src={SettingsIcon} alt="Settings" className="w-6 h-6" />
                        </button>
                    </div>

                    <div className="flex flex-col md:flex-row items-center md:items-start gap-8 mb-10">
                        <div className="w-32 h-32 bg-gray-200 rounded-full overflow-hidden shadow-sm flex-shrink-0">
                            {user?.profilePhoto ? (
                                <img src={user.profilePhoto} alt="Profile" className="w-full h-full object-cover" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-gray-400 text-4xl font-bold">
                                    {user?.name?.charAt(0) || 'U'}
                                </div>
                            )}
                        </div>
                        <div className="text-center md:text-left flex-1">
                            <h2 className="text-2xl font-bold text-gray-900 mb-1">{user?.name || 'Your Name'}</h2>
                            <p className="text-gray-600 font-medium mb-3">{user?.year || 'Year ?'} | {user?.course || 'Course not set'}</p>
                            <p className="text-gray-500 mb-6 max-w-2xl">{user?.bio || 'No bio provided yet.'}</p>

                            {/* Tutor Subjects */}
                            {user?.isTutor && user?.tutorProfile?.subjects?.length > 0 && (
                                <div className="mb-4">
                                    <h3 className="text-sm font-semibold text-gray-700 mb-2">Subjects Can Teach:</h3>
                                    <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                                        {user.tutorProfile.subjects.map((s, i) => (
                                            <div key={i} className="px-3 py-1 bg-green-50 border border-green-200 text-green-800 rounded-full text-sm font-medium flex items-center gap-2">
                                                <span>{s.moduleCode}</span>
                                                <span className="bg-green-200 text-green-900 text-[10px] px-1.5 py-0.5 rounded font-bold">{s.grade}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Generic Subjects (if any) */}
                            {subjectsCanTeach.length > 0 && !user?.isTutor && (
                                <div className="mb-4">
                                    <h3 className="text-sm font-semibold text-gray-700 mb-2">Subjects Can Teach:</h3>
                                    <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                                        {subjectsCanTeach.map((s, i) => (
                                            <span key={i} className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-semibold">{s}</span>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Needs Help (if any) */}
                            {subjectsNeedHelp.length > 0 && (
                                <div className="mb-4">
                                    <h3 className="text-sm font-semibold text-gray-700 mb-2">Looking for Help In:</h3>
                                    <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                                        {subjectsNeedHelp.map((s, i) => (
                                            <span key={i} className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-semibold">{s}</span>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-8 border-t border-gray-100">
                        <div className="p-4 bg-gray-50 rounded-lg">
                            <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                                <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
                                Contact Info
                            </h4>
                            <div className="space-y-2 text-sm">
                                <p className="flex justify-between">
                                    <span className="text-gray-500">Email:</span>
                                    <span className="font-medium text-gray-900">{user?.email}</span>
                                </p>
                                <p className="flex justify-between">
                                    <span className="text-gray-500">Phone:</span>
                                    <span className="font-medium text-gray-900">{user?.phone || 'Not set'}</span>
                                </p>
                            </div>
                        </div>
                        <div className="p-4 bg-gray-50 rounded-lg">
                            <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                                <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 14l9-5-9-5-9 5 9 5z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 14l9-5-9-5-9 5 9 5z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z"></path></svg>
                                Academic Info
                            </h4>
                            <div className="space-y-2 text-sm">
                                <p className="flex justify-between">
                                    <span className="text-gray-500">Year:</span>
                                    <span className="font-medium text-gray-900">{user?.year}</span>
                                </p>
                                <p className="flex justify-between">
                                    <span className="text-gray-500">Course:</span>
                                    <span className="font-medium text-gray-900">{user?.course || 'Not set'}</span>
                                </p>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default MyProfile;
