import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import AIRecommendations from '../components/AIRecommendations';
import TutorDashboard from './TutorDashboard';
import { sessionAPI } from '../services/api';

const Dashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [viewMode, setViewMode] = useState('student');
  const [sessionsCompleted, setSessionsCompleted] = useState(0);
  const [upcomingSessions, setUpcomingSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  
  if (!user) {
    return null;
  }

  const isTutor = user.isTutor;
  const canBeTutor = isTutor;

  useEffect(() => {
    if (!canBeTutor) {
      setViewMode('student');
    }
  }, [canBeTutor]);

  if (canBeTutor && viewMode === 'tutor') {
    return (
      <div>
        <div className="mb-4 flex justify-end gap-2">
          <button
            onClick={() => setViewMode('student')}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
          >
            Switch to Student View
          </button>
        </div>
        <TutorDashboard />
      </div>
    );
  }

  const studentName = user?.name?.split(' ')[0] || "Student";

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      
      const [sessionsResponse, upcomingResponse] = await Promise.all([
        sessionAPI.getUserSessions({ type: 'past' }),
        sessionAPI.getUserSessions({ type: 'upcoming' })
      ]);

      const completedSessions = sessionsResponse.data.filter(s => s.status === 'Completed');
      setSessionsCompleted(completedSessions.length);
      
      setUpcomingSessions(upcomingResponse.data.slice(0, 2).map(session => ({
        id: session._id,
        tutor: session.tutor?.name || 'Unknown',
        subject: session.subject,
        date: new Date(session.date).toLocaleDateString(),
        time: session.time,
        location: session.location
      })));
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Hello {studentName}</h1>
            <p className="text-gray-600 mt-1">Welcome back to your learning dashboard</p>
          </div>
          {canBeTutor && (
            <button
              onClick={() => setViewMode('tutor')}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium"
            >
              Switch to Tutor View
            </button>
          )}
        </div>

        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Sessions Completed</h3>
          <p className="text-4xl font-bold text-blue-600">{loading ? '...' : sessionsCompleted}</p>
        </div>

        <div className="mb-6">
          <AIRecommendations />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-900">Upcoming Sessions</h2>
                <button 
                  onClick={() => navigate('/bookings')}
                  className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                >
                  View All
                </button>
              </div>
              <div className="space-y-3">
                {loading ? (
                  <div className="text-center py-4 text-gray-500">Loading sessions...</div>
                ) : upcomingSessions.length > 0 ? (
                  upcomingSessions.map(session => (
                    <div key={session.id} className="border border-gray-200 rounded-lg p-4">
                      <h3 className="font-semibold text-gray-900">{session.subject}</h3>
                      <p className="text-sm text-gray-600 mt-1">with {session.tutor}</p>
                      <div className="mt-3 space-y-1">
                        <p className="text-sm text-gray-700">{session.date} at {session.time}</p>
                        <p className="text-sm text-gray-500">{session.location}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-4 text-gray-500">No upcoming sessions</div>
                )}
              </div>
            </div>

            <button 
              onClick={() => navigate('/find-tutors')}
              className="w-full bg-blue-600 text-white py-4 rounded-lg hover:bg-blue-700 transition-colors font-semibold text-lg shadow-lg"
            >
              Find a Tutor
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

