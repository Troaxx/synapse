import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { sessionAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

const SessionDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const [session, setSession] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadSession();
    }, [id]);

    const loadSession = async () => {
        try {
            setLoading(true);
            const response = await sessionAPI.getSessionById(id);
            setSession(response.data);
        } catch (error) {
            console.error('Error loading session:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-gray-600">Loading session details...</div>
            </div>
        );
    }

    if (!session) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-xl font-bold text-gray-900 mb-2">Session Not Found</h2>
                    <button
                        onClick={() => navigate('/bookings')}
                        className="text-blue-600 hover:text-blue-700 font-medium"
                    >
                        Back to Bookings
                    </button>
                </div>
            </div>
        );
    }

    const isTutor = user?.isTutor;
    const otherPerson = isTutor ? session.student : session.tutor;
    const displayName = otherPerson?.name || 'Unknown';

    // Display label logic
    const displayStatus = session.status === 'Cancelled' ? 'Rejected' : session.status;
    const statusColor =
        session.status === 'Confirmed' ? 'bg-green-100 text-green-800' :
            session.status === 'Pending' ? 'bg-orange-100 text-orange-800' :
                session.status === 'Completed' ? 'bg-blue-100 text-blue-800' :
                    'bg-red-100 text-red-800'; // Cancelled/Rejected

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <button
                    onClick={() => navigate('/bookings')}
                    className="flex items-center text-blue-600 hover:text-blue-700 mb-6"
                >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    Back to requests
                </button>

                <div className="bg-white rounded-lg shadow overflow-hidden">
                    <div className="p-6 border-b border-gray-200 flex justify-between items-start">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900 mb-2">Session Details</h1>
                            <p className="text-gray-600">ID: {session.sessionId || session._id}</p>
                        </div>
                        <span className={`px-4 py-2 rounded-full text-sm font-bold ${statusColor}`}>
                            {displayStatus}
                        </span>
                    </div>

                    <div className="p-6 space-y-8">
                        {/* Person Info */}
                        <div className="flex items-center gap-4">
                            <div className="w-16 h-16 bg-gray-300 rounded-full overflow-hidden">
                                {otherPerson?.profilePhoto ? (
                                    <img src={otherPerson.profilePhoto} alt={displayName} className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-white font-semibold bg-gray-400">
                                        {displayName.charAt(0)}
                                    </div>
                                )}
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900">{isTutor ? 'Student' : 'Tutor'}</h3>
                                <p className="text-gray-600">{displayName}</p>
                                {otherPerson?.email && <p className="text-sm text-gray-500">{otherPerson.email}</p>}
                            </div>
                        </div>

                        {/* Session Info */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-1">Subject</h3>
                                <p className="text-gray-900 font-medium">{session.subject}</p>
                            </div>

                            <div>
                                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-1">Duration</h3>
                                <p className="text-gray-900 font-medium">{session.duration} minutes</p>
                            </div>

                            <div className="md:col-span-2">
                                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-1">Topic</h3>
                                <p className="text-gray-900 font-medium">{session.topic}</p>
                            </div>

                            {session.notes && (
                                <div className="md:col-span-2">
                                    <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-1">Notes</h3>
                                    <p className="text-gray-700 bg-gray-50 p-4 rounded-lg">{session.notes}</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SessionDetails;
