import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { sessionAPI } from '../services/api';

const TutorDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [stats, setStats] = useState({
    pendingRequests: 0,
    upcomingSessions: 0,
    completedSessions: 0,
    totalHours: 0
  });
  const [upcomingSessions, setUpcomingSessions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const [sessionsResponse] = await Promise.all([
        sessionAPI.getUserSessions({ type: 'upcoming' })
      ]);

      const allSessions = await sessionAPI.getUserSessions();
      const userId = user?._id || user?.id;
      const pendingCount = allSessions.data.filter(s => s.status === 'Pending' && (s.tutor._id === userId || s.tutor === userId)).length;
      const upcomingCount = sessionsResponse.data.filter(s => s.status === 'Confirmed' && (s.tutor._id === userId || s.tutor === userId)).length;
      const completedSessions = allSessions.data.filter(s => s.status === 'Completed' && (s.tutor._id === userId || s.tutor === userId));
      const totalHours = completedSessions.reduce((sum, s) => sum + (s.duration || 0) / 60, 0);

      setStats({
        pendingRequests: pendingCount,
        upcomingSessions: upcomingCount,
        completedSessions: completedSessions.length,
        totalHours: Math.round(totalHours * 10) / 10
      });

      setUpcomingSessions(sessionsResponse.data.filter(s => (s.tutor._id === userId || s.tutor === userId)).slice(0, 3));
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const tutorName = user?.name?.split(' ')[0] || "Tutor";

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
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Hello {tutorName}</h1>
          <p className="text-gray-600 mt-1">Welcome to your tutoring dashboard</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Pending Requests</h3>
            <p className="text-4xl font-bold text-orange-600">{stats.pendingRequests}</p>
            <p className="text-sm text-gray-500 mt-2">Awaiting your response</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Upcoming Sessions</h3>
            <p className="text-4xl font-bold text-blue-600">{stats.upcomingSessions}</p>
            <p className="text-sm text-gray-500 mt-2">Confirmed sessions</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Completed</h3>
            <p className="text-4xl font-bold text-green-600">{stats.completedSessions}</p>
            <p className="text-sm text-gray-500 mt-2">Total sessions</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Hours Taught</h3>
            <p className="text-4xl font-bold text-purple-600">{stats.totalHours}</p>
            <p className="text-sm text-gray-500 mt-2">Total teaching time</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-900">Upcoming Sessions</h2>
                <button 
                  onClick={() => navigate('/bookings')}
                  className="text-blue-600 hover:text-blue-700 font-medium"
                >
                  View All
                </button>
              </div>
              {upcomingSessions.length > 0 ? (
                <div className="space-y-4">
                  {upcomingSessions.map(session => (
                    <div key={session._id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900">{session.subject}</h3>
                          <p className="text-sm text-gray-600 mt-1">with {session.student.name}</p>
                          <div className="mt-2 space-y-1 text-sm text-gray-700">
                            <p>{new Date(session.date).toLocaleDateString()} at {session.time}</p>
                            <p>{session.location}</p>
                          </div>
                        </div>
                        <span className="px-3 py-1 rounded-full text-sm font-semibold bg-green-100 text-green-800">
                          {session.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <p>No upcoming sessions</p>
                </div>
              )}
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h2>
              <div className="grid grid-cols-2 gap-4">
                <button 
                  onClick={() => navigate('/bookings?tab=pending')}
                  className="bg-orange-600 text-white py-4 rounded-lg hover:bg-orange-700 transition-colors font-semibold"
                >
                  Review Requests
                </button>
                <button 
                  onClick={() => navigate('/schedule')}
                  className="bg-blue-600 text-white py-4 rounded-lg hover:bg-blue-700 transition-colors font-semibold"
                >
                  View Schedule
                </button>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            {stats.pendingRequests > 0 && (
              <div className="bg-orange-50 border border-orange-200 rounded-lg p-6">
                <h3 className="text-lg font-bold text-orange-900 mb-2">Action Required</h3>
                <p className="text-orange-700 mb-4">
                  You have {stats.pendingRequests} pending session {stats.pendingRequests === 1 ? 'request' : 'requests'} waiting for your response.
                </p>
                <button 
                  onClick={() => navigate('/bookings?tab=pending')}
                  className="w-full bg-orange-600 text-white py-2 rounded-lg hover:bg-orange-700 transition-colors font-medium"
                >
                  Review Requests
                </button>
              </div>
            )}

            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Your Profile</h2>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-600">Rating</p>
                  <p className="text-2xl font-bold text-yellow-600">
                    {user?.tutorProfile?.rating || '0.0'}
                    <span className="text-lg text-gray-500">/5.0</span>
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Total Sessions</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {user?.tutorProfile?.totalSessions || 0}
                  </p>
                </div>
                <button 
                  onClick={() => navigate('/settings')}
                  className="w-full bg-gray-100 text-gray-800 py-2 rounded-lg hover:bg-gray-200 transition-colors font-medium"
                >
                  Edit Profile
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TutorDashboard;

