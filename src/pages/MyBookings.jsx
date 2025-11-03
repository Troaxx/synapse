import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const MyBookings = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('upcoming');

  const bookings = {
    upcoming: [
      {
        id: 1,
        tutor: "Sarah Chen",
        tutorImage: "/assets/tutor1.png",
        subject: "Python",
        topic: "Object-Oriented Programming",
        date: "Nov 4, 2025",
        time: "2:00 PM",
        duration: "60 min",
        location: "Library Level 5",
        status: "Confirmed",
        countdown: "Tomorrow at 2:00 PM"
      },
      {
        id: 2,
        tutor: "Marcus Tan",
        tutorImage: "/assets/tutor2.png",
        subject: "Web Development",
        topic: "React Hooks",
        date: "Nov 5, 2025",
        time: "3:30 PM",
        duration: "90 min",
        location: "Online - Zoom",
        status: "Confirmed",
        countdown: "In 2 days"
      },
      {
        id: 3,
        tutor: "Priya Kumar",
        tutorImage: "/assets/tutor3.png",
        subject: "Mathematics",
        topic: "Calculus Integration",
        date: "Nov 7, 2025",
        time: "10:00 AM",
        duration: "60 min",
        location: "Study Room 3A",
        status: "Confirmed",
        countdown: "In 4 days"
      }
    ],
    pending: [
      {
        id: 4,
        tutor: "David Lim",
        tutorImage: "/assets/tutor4.png",
        subject: "Database",
        topic: "SQL Queries",
        date: "Nov 6, 2025",
        time: "4:00 PM",
        duration: "60 min",
        location: "Library Level 3",
        status: "Pending",
        countdown: "In 3 days"
      }
    ],
    past: [
      {
        id: 5,
        tutor: "Sarah Chen",
        tutorImage: "/assets/tutor1.png",
        subject: "Python",
        topic: "Data Structures",
        date: "Oct 28, 2025",
        time: "2:00 PM",
        duration: "60 min",
        location: "Library Level 5",
        status: "Completed",
        reviewed: false
      },
      {
        id: 6,
        tutor: "Emily Wong",
        tutorImage: "/assets/tutor5.png",
        subject: "UI/UX Design",
        topic: "Figma Basics",
        date: "Oct 25, 2025",
        time: "3:00 PM",
        duration: "90 min",
        location: "Online - Zoom",
        status: "Completed",
        reviewed: true
      }
    ]
  };

  const currentBookings = bookings[activeTab];

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

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">My Bookings</h1>

        <div className="bg-white rounded-lg shadow mb-6">
          <div className="border-b border-gray-200">
            <nav className="flex -mb-px">
              <button
                onClick={() => setActiveTab('upcoming')}
                className={`py-4 px-8 text-center border-b-2 font-medium text-sm ${
                  activeTab === 'upcoming'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Upcoming ({bookings.upcoming.length})
              </button>
              <button
                onClick={() => setActiveTab('pending')}
                className={`py-4 px-8 text-center border-b-2 font-medium text-sm ${
                  activeTab === 'pending'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Pending ({bookings.pending.length})
              </button>
              <button
                onClick={() => setActiveTab('past')}
                className={`py-4 px-8 text-center border-b-2 font-medium text-sm ${
                  activeTab === 'past'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Past ({bookings.past.length})
              </button>
            </nav>
          </div>
        </div>

        {currentBookings.length > 0 ? (
          <div className="space-y-4">
            {currentBookings.map(booking => (
              <div key={booking.id} className="bg-white rounded-lg shadow hover:shadow-md transition-shadow p-6">
                <div className="flex flex-col md:flex-row gap-6">
                  <div className="flex items-start gap-4 flex-1">
                    <div className="w-16 h-16 bg-gray-300 rounded-full flex-shrink-0"></div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="text-xl font-bold text-gray-900">{booking.subject}</h3>
                          <p className="text-gray-600">with {booking.tutor}</p>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(booking.status)}`}>
                          {booking.status}
                        </span>
                      </div>
                      <p className="text-gray-700 mb-3">Topic: {booking.topic}</p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
                        <div className="flex items-center text-gray-600">
                          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          {booking.date} at {booking.time}
                        </div>
                        <div className="flex items-center text-gray-600">
                          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          {booking.duration}
                        </div>
                        <div className="flex items-center text-gray-600">
                          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                          {booking.location}
                        </div>
                        {booking.countdown && (
                          <div className="flex items-center text-blue-600 font-semibold">
                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            {booking.countdown}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex md:flex-col gap-2 md:w-40">
                    <button 
                      onClick={() => navigate(`/booking/${booking.id}`)}
                      className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm"
                    >
                      View Details
                    </button>
                    {activeTab === 'upcoming' && (
                      <>
                        <button className="flex-1 bg-gray-200 text-gray-800 py-2 px-4 rounded-lg hover:bg-gray-300 transition-colors font-medium text-sm">
                          Reschedule
                        </button>
                        <button className="flex-1 bg-red-100 text-red-700 py-2 px-4 rounded-lg hover:bg-red-200 transition-colors font-medium text-sm">
                          Cancel
                        </button>
                      </>
                    )}
                    {activeTab === 'past' && !booking.reviewed && (
                      <button className="flex-1 bg-yellow-100 text-yellow-800 py-2 px-4 rounded-lg hover:bg-yellow-200 transition-colors font-medium text-sm">
                        Leave Review
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No {activeTab} sessions</h3>
            <p className="text-gray-600 mb-6">You don't have any {activeTab} sessions at the moment.</p>
            <button 
              onClick={() => navigate('/find-tutors')}
              className="bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors font-semibold"
            >
              Find a Tutor
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyBookings;

