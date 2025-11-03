import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import AIRecommendations from '../components/AIRecommendations';

const Dashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const studentName = user?.name?.split(' ')[0] || "Student";

  const recommendedTutors = [
    { id: 1, name: "Sarah Chen", subject: "Python", rating: 4.9, sessions: 48, image: "/assets/tutor1.png" },
    { id: 2, name: "Marcus Tan", subject: "Web Dev", rating: 4.8, sessions: 62, image: "/assets/tutor2.png" },
    { id: 3, name: "Priya Kumar", subject: "Math", rating: 5.0, sessions: 35, image: "/assets/tutor3.png" }
  ];

  const upcomingSessions = [
    { id: 1, tutor: "Sarah Chen", subject: "Python", date: "Nov 4, 2025", time: "2:00 PM", location: "Library Level 5" },
    { id: 2, tutor: "Marcus Tan", subject: "React Hooks", date: "Nov 5, 2025", time: "3:30 PM", location: "Online - Zoom" }
  ];

  const quickStats = {
    sessionsCompleted: 12,
    hoursLearned: 18,
    activeTutors: 3
  };

  const subjects = ["Programming", "Web Development", "Mathematics", "Database", "UI/UX Design", "Networking"];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Hello {studentName}</h1>
          <p className="text-gray-600 mt-1">Welcome back to your learning dashboard</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Sessions Completed</h3>
            <p className="text-4xl font-bold text-blue-600">{quickStats.sessionsCompleted}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Hours Learned</h3>
            <p className="text-4xl font-bold text-green-600">{quickStats.hoursLearned}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Active Tutors</h3>
            <p className="text-4xl font-bold text-purple-600">{quickStats.activeTutors}</p>
          </div>
        </div>

        <div className="mb-6">
          <AIRecommendations />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-900">Quick Access Tutors</h2>
                <button 
                  onClick={() => navigate('/find-tutors')}
                  className="text-blue-600 hover:text-blue-700 font-medium"
                >
                  View All
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {recommendedTutors.map(tutor => (
                  <div key={tutor.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer">
                    <div className="w-16 h-16 bg-gray-300 rounded-full mx-auto mb-3"></div>
                    <h3 className="font-semibold text-center text-gray-900">{tutor.name}</h3>
                    <p className="text-sm text-gray-600 text-center">{tutor.subject}</p>
                    <div className="flex items-center justify-center mt-2">
                      <span className="text-yellow-500">★</span>
                      <span className="text-sm font-medium ml-1">{tutor.rating}</span>
                    </div>
                    <p className="text-xs text-gray-500 text-center mt-1">{tutor.sessions} sessions</p>
                    <button 
                      onClick={() => navigate(`/tutor/${tutor.id}`)}
                      className="w-full mt-3 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm"
                    >
                      View Profile
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Access to Subjects</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {subjects.map((subject, index) => (
                  <button
                    key={index}
                    onClick={() => navigate('/find-tutors')}
                    className="bg-gray-100 hover:bg-gray-200 text-gray-800 py-3 px-4 rounded-lg transition-colors text-sm font-medium"
                  >
                    {subject}
                  </button>
                ))}
              </div>
            </div>
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
                {upcomingSessions.map(session => (
                  <div key={session.id} className="border border-gray-200 rounded-lg p-4">
                    <h3 className="font-semibold text-gray-900">{session.subject}</h3>
                    <p className="text-sm text-gray-600 mt-1">with {session.tutor}</p>
                    <div className="mt-3 space-y-1">
                      <p className="text-sm text-gray-700">{session.date} at {session.time}</p>
                      <p className="text-sm text-gray-500">{session.location}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Calendar</h2>
              <div className="border border-gray-200 rounded-lg p-4">
                <div className="text-center mb-4">
                  <h3 className="font-semibold text-gray-900">November 2025</h3>
                </div>
                <div className="grid grid-cols-7 gap-2 text-center text-sm">
                  <div className="text-gray-600 font-medium">Sun</div>
                  <div className="text-gray-600 font-medium">Mon</div>
                  <div className="text-gray-600 font-medium">Tue</div>
                  <div className="text-gray-600 font-medium">Wed</div>
                  <div className="text-gray-600 font-medium">Thu</div>
                  <div className="text-gray-600 font-medium">Fri</div>
                  <div className="text-gray-600 font-medium">Sat</div>
                  {[...Array(30)].map((_, i) => (
                    <div 
                      key={i} 
                      className={`py-2 rounded ${i === 3 || i === 4 ? 'bg-blue-100 text-blue-700 font-semibold' : 'text-gray-700 hover:bg-gray-100'}`}
                    >
                      {i + 1}
                    </div>
                  ))}
                </div>
              </div>
              <button 
                onClick={() => navigate('/schedule')}
                className="w-full mt-4 bg-gray-100 hover:bg-gray-200 text-gray-800 py-2 rounded-lg transition-colors text-sm font-medium"
              >
                View Full Calendar
              </button>
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

