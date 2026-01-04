import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { sessionAPI } from '../services/api';
import UserProfileCard from '../components/UserProfileCard';

const MyBookings = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const initialTab = searchParams.get('tab') || 'confirmed';
  const [activeTab, setActiveTab] = useState(initialTab);
  const [allSessions, setAllSessions] = useState([]);
  const [displayedSessions, setDisplayedSessions] = useState([]);
  const [loading, setLoading] = useState(true);

  const isTutor = user?.isTutor;

  useEffect(() => {
    loadSessions();
  }, []); // Load once on mount

  useEffect(() => {
    filterSessions();
  }, [activeTab, allSessions]);

  const loadSessions = async () => {
    try {
      setLoading(true);
      // Fetch ALL sessions for the user (no filters)
      const response = await sessionAPI.getUserSessions({});
      setAllSessions(response.data);
    } catch (error) {
      console.error('Error loading sessions:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterSessions = () => {
    let filtered = [];
    if (activeTab === 'pending') {
      filtered = allSessions.filter(s => s.status === 'Pending');
    } else if (activeTab === 'confirmed') {
      filtered = allSessions.filter(s => s.status === 'Confirmed');
      filtered = filtered.sort((a, b) => new Date(a.date) - new Date(b.date));
    } else if (activeTab === 'past') {
      filtered = allSessions.filter(s => s.status === 'Completed' || s.status === 'Cancelled');
    }
    setDisplayedSessions(filtered);
  };

  const handleAcceptRequest = async (sessionId) => {
    try {
      await sessionAPI.updateSessionStatus(sessionId, { status: 'Confirmed' });
      loadSessions();
    } catch (error) {
      console.error('Error accepting request:', error);
      alert('Failed to accept request');
    }
  };

  const handleRejectRequest = async (sessionId) => {
    try {
      await sessionAPI.updateSessionStatus(sessionId, { status: 'Cancelled' });
      loadSessions();
    } catch (error) {
      console.error('Error rejecting request:', error);
      alert('Failed to reject request');
    }
  };

  const handleCompleteSession = async (sessionId) => {
    try {
      await sessionAPI.updateSessionStatus(sessionId, { status: 'Completed' });
      loadSessions();
    } catch (error) {
      console.error('Error completing session:', error);
      alert('Failed to complete session');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Confirmed':
        return 'bg-green-100 text-green-800';
      case 'Pending':
        return 'bg-orange-100 text-orange-800';
      case 'Completed':
        return 'bg-blue-100 text-blue-800';
      case 'Cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const pendingCount = allSessions.filter(s => s.status === 'Pending').length;
  const confirmedCount = allSessions.filter(s => s.status === 'Confirmed').length;
  const pastCount = allSessions.filter(s => s.status === 'Completed' || s.status === 'Cancelled').length;

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-600">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          {isTutor ? 'Requests' : 'My Bookings'}
        </h1>

        <div className="bg-white rounded-lg shadow mb-6">
          <div className="border-b border-gray-200">
            <nav className="flex -mb-px">
              {isTutor ? (
                <>
                  <button
                    onClick={() => setActiveTab('pending')}
                    className={`py-4 px-8 text-center border-b-2 font-medium text-sm ${activeTab === 'pending'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      }`}
                  >
                    Pending Requests ({pendingCount})
                  </button>
                  <button
                    onClick={() => setActiveTab('confirmed')}
                    className={`py-4 px-8 text-center border-b-2 font-medium text-sm ${activeTab === 'confirmed'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      }`}
                  >
                    Confirmed ({confirmedCount})
                  </button>
                  <button
                    onClick={() => setActiveTab('past')}
                    className={`py-4 px-8 text-center border-b-2 font-medium text-sm ${activeTab === 'past'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      }`}
                  >
                    Past ({pastCount})
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => setActiveTab('confirmed')}
                    className={`py-4 px-8 text-center border-b-2 font-medium text-sm ${activeTab === 'confirmed'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      }`}
                  >
                    Confirmed ({confirmedCount})
                  </button>
                  <button
                    onClick={() => setActiveTab('pending')}
                    className={`py-4 px-8 text-center border-b-2 font-medium text-sm ${activeTab === 'pending'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      }`}
                  >
                    Pending ({pendingCount})
                  </button>
                  <button
                    onClick={() => setActiveTab('past')}
                    className={`py-4 px-8 text-center border-b-2 font-medium text-sm ${activeTab === 'past'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      }`}
                  >
                    Past ({pastCount})
                  </button>
                </>
              )}
            </nav>
          </div>
        </div>

        {displayedSessions.length > 0 ? (
          <div className="space-y-4">
            {displayedSessions.map(session => {
              const currentUserId = user?._id || user?.id;
              // If I am the student, show the tutor. If I am the tutor, show the student.
              // Note: session.student and session.tutor are populated objects
              const isMeStudent = session.student._id === currentUserId || session.student === currentUserId;
              const otherPerson = isMeStudent ? session.tutor : session.student;
              const displayName = otherPerson?.name || 'Unknown';
              const displayRole = isMeStudent ? 'Tutor' : 'Student';

              return (
                <div key={session._id} className="bg-white rounded-lg shadow hover:shadow-md transition-shadow p-6">
                  <div className="flex flex-col md:flex-row gap-6">
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-4">
                        <h3 className="text-xl font-bold text-gray-900">{session.subject}</h3>
                        <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(session.status)}`}>
                          {session.status}
                        </span>
                      </div>

                      <div className="mb-4">
                        <UserProfileCard
                          user={otherPerson}
                          role={displayRole}
                          isClickable={isMeStudent} // Clickable if looking at a Tutor
                          targetUrl={`/tutor/${otherPerson?._id}`}
                        />
                      </div>

                      {session.topic && (
                        <p className="text-gray-700 mb-3">Topic: {session.topic}</p>
                      )}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
                        <div className="flex items-center text-gray-600">
                          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          {session.duration} min
                        </div>
                      </div>
                      {session.notes && (
                        <p className="text-sm text-gray-600 mt-2">Notes: {session.notes}</p>
                      )}
                    </div>

                    <div className="flex md:flex-col gap-2 md:w-48">
                      {/* Accept/Reject only if I am the TUTOR receiving a request */}
                      {!isMeStudent && activeTab === 'pending' && (
                        <>
                          <button
                            onClick={() => handleAcceptRequest(session._id)}
                            className="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors font-medium text-sm"
                          >
                            Accept
                          </button>
                          <button
                            onClick={() => handleRejectRequest(session._id)}
                            className="flex-1 bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition-colors font-medium text-sm"
                          >
                            Reject
                          </button>
                        </>
                      )}

                      {/* Mark Complete only if I am the TUTOR and session is Confirmed */}
                      {!isMeStudent && activeTab === 'confirmed' && session.status === 'Confirmed' && (
                        <button
                          onClick={() => handleCompleteSession(session._id)}
                          className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm"
                        >
                          Mark Complete
                        </button>
                      )}

                      {/* Cancel allowed if (I am Student AND (Pending OR Confirmed)) */}
                      {isMeStudent && (activeTab === 'confirmed' || activeTab === 'pending') && (
                        <>
                          <button
                            onClick={() => sessionAPI.cancelSession(session._id).then(() => loadSessions())}
                            className="flex-1 bg-red-100 text-red-700 py-2 px-4 rounded-lg hover:bg-red-200 transition-colors font-medium text-sm"
                          >
                            Cancel
                          </button>
                        </>
                      )}

                      {/* Review allowed if (I am Student AND Past AND Not Reviewed) */}
                      {isMeStudent && activeTab === 'past' && !session.review && (
                        <button
                          onClick={() => navigate(`/review/${session._id}`)}
                          className="flex-1 bg-yellow-100 text-yellow-800 py-2 px-4 rounded-lg hover:bg-yellow-200 transition-colors font-medium text-sm"
                        >
                          Leave Review
                        </button>
                      )}
                      <button
                        onClick={() => navigate(`/session/${session._id}`)}
                        className="flex-1 bg-gray-200 text-gray-800 py-2 px-4 rounded-lg hover:bg-gray-300 transition-colors font-medium text-sm"
                      >
                        View Details
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No {activeTab} {isTutor ? 'sessions' : 'bookings'}
            </h3>
            <p className="text-gray-600 mb-6">
              You don't have any {activeTab} {isTutor ? 'sessions' : 'bookings'} at the moment.
            </p>
            {!isTutor && (
              <button
                onClick={() => navigate('/find-tutors')}
                className="bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors font-semibold"
              >
                Find a Tutor
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyBookings;
