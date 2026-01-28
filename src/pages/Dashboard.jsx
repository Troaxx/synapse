import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import AIRecommendations from '../components/AIRecommendations';
import { sessionAPI } from '../services/api';
import UserProfileCard from '../components/UserProfileCard';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell
} from 'recharts';
import { BookOpen, Clock, Calendar, CheckCircle } from 'lucide-react';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

const Dashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [sessionsCompleted, setSessionsCompleted] = useState(0);
  const [upcomingSessions, setUpcomingSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [subjectData, setSubjectData] = useState([]);

  if (!user) {
    return null;
  }

  const isTutor = user.isTutor;
  const displayName = user?.name?.split(' ')[0] || "User";

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

      // Process data for charts
      const subjects = {};
      completedSessions.forEach(session => {
        subjects[session.subject] = (subjects[session.subject] || 0) + 1;
      });

      const chartData = Object.entries(subjects).map(([name, value]) => ({
        name,
        value
      }));
      setSubjectData(chartData);

      // Filter upcoming sessions logic
      const currentUserId = user?._id || user?.id;
      setUpcomingSessions(upcomingResponse.data.slice(0, 2).map(session => {
        // Determine if current user is the student in this session
        const studentId = session.student?._id || session.student;
        const isMeStudent = studentId === currentUserId;
        // Show tutor if I'm the student, show student if I'm the tutor
        const otherPerson = isMeStudent ? session.tutor : session.student;

        return {
          id: session._id,
          otherPerson,
          isMeStudent,
          subject: session.subject,
          date: new Date(session.date).toLocaleDateString(),
          time: session.time,
          location: session.location
        };
      }));
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      <div className="max-w-[98%] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Hello {displayName} 👋</h1>
            <p className="text-gray-600 mt-1">Welcome back to your {isTutor ? 'tutoring' : 'learning'} dashboard</p>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 flex items-center">
            <div className="p-3 bg-blue-50 rounded-lg">
              {/* Using simple text fallback if icons fail, but using lucide icons as imported */}
              <span className="text-2xl">✅</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Sessions Completed</p>
              <h3 className="text-2xl font-bold text-gray-900">{loading ? '...' : sessionsCompleted}</h3>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 flex items-center">
            <div className="p-3 bg-purple-50 rounded-lg">
              <span className="text-2xl">📅</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Upcoming Sessions</p>
              <h3 className="text-2xl font-bold text-gray-900">{loading ? '...' : upcomingSessions.length}</h3>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 flex items-center">
            <div className="p-3 bg-green-50 rounded-lg">
              <span className="text-2xl">📚</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Subjects Explored</p>
              <h3 className="text-2xl font-bold text-gray-900">{loading ? '...' : subjectData.length}</h3>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 flex items-center">
            <div className="p-3 bg-orange-50 rounded-lg">
              <span className="text-2xl">⭐</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Rating</p>
              <h3 className="text-2xl font-bold text-gray-900">--</h3>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 mb-8">
          {/* Main Content Area */}
          <div className="lg:col-span-3 space-y-8">
            {/* Charts Section */}
            {!loading && subjectData.length > 0 && (
              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                <h3 className="text-lg font-bold text-gray-900 mb-6">Learning Activity by Subject</h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={subjectData}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                      <XAxis dataKey="name" />
                      <YAxis allowDecimals={false} />
                      <Tooltip
                        contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                        cursor={{ fill: '#F3F4F6' }}
                      />
                      <Bar dataKey="value" fill="#4F46E5" radius={[4, 4, 0, 0]} barSize={40} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            )}

          </div>

          {/* Sidebar Area */}
          <div className="lg:col-span-2 space-y-8">
            {/* Upcoming Sessions */}
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Upcoming Sessions</h2>
                <button
                  onClick={() => navigate('/bookings')}
                  className="text-blue-600 hover:text-blue-700 text-lg font-medium hover:underline"
                >
                  View All
                </button>
              </div>

              <div className="space-y-4">
                {loading ? (
                  <div className="text-center py-4 text-gray-500">Loading...</div>
                ) : upcomingSessions.length > 0 ? (
                  upcomingSessions.map(session => (
                    <div key={session.id} className="border border-gray-100 rounded-lg p-6 hover:bg-gray-50 transition-colors">
                      <div className="flex justify-between items-start mb-4">
                        <h3 className="text-xl font-bold text-gray-900 line-clamp-1">{session.subject}</h3>
                        <span className="text-sm font-medium px-3 py-1 bg-blue-50 text-blue-700 rounded-full">Confirmed</span>
                      </div>

                      <div className="mb-4">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center text-lg font-bold text-gray-600">
                            {session.otherPerson?.name?.charAt(0) || '?'}
                          </div>
                          <div>
                            <p className="text-lg font-medium text-gray-900">{session.otherPerson?.name}</p>
                            <p className="text-sm text-gray-500">{session.isMeStudent ? 'Tutor' : 'Student'}</p>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-2 pt-4 border-t border-gray-50">
                        {session.location && (
                          <div className="flex items-center text-sm text-gray-600">
                            <span className="mr-2 text-lg">📍</span>
                            {session.location}
                          </div>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-12 bg-gray-50 rounded-lg border border-dashed border-gray-200">
                    <p className="text-gray-500 mb-6 text-lg">No upcoming sessions</p>
                    {!isTutor && (
                      <button
                        onClick={() => navigate('/find-tutors')}
                        className="text-base bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium shadow-sm"
                      >
                        Find a Tutor
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* AI Recommendations - Full Width Section */}
        {!isTutor && (
          <div className="mb-8">
            <AIRecommendations />
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
