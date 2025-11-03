import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const TutorProfile = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [showAllReviews, setShowAllReviews] = useState(false);

  const tutor = {
    id: 1,
    name: "Sarah Chen",
    rating: 4.9,
    reviewCount: 87,
    year: "Year 2",
    course: "Diploma in IT",
    memberSince: "Jan 2024",
    badges: ["Top Tutor", "Subject Expert"],
    about: "Hi! I'm Sarah, a Year 2 IT student passionate about programming and helping others succeed. I specialize in Python and Java, and I love breaking down complex concepts into easy-to-understand explanations. I've been tutoring for over a year and have helped dozens of students improve their grades and confidence in coding.",
    subjects: [
      { name: "Python", grade: "A", sessions: 25 },
      { name: "Java", grade: "A", sessions: 15 },
      { name: "Data Structures", grade: "A", sessions: 8 }
    ],
    stats: {
      totalSessions: 88,
      hoursTaught: 132,
      responseRate: 95,
      replyTime: "< 2 hours"
    },
    availability: [
      { day: "Monday", slots: ["2:00 PM", "3:00 PM", "4:00 PM"] },
      { day: "Tuesday", slots: ["10:00 AM", "2:00 PM"] },
      { day: "Wednesday", slots: ["2:00 PM", "3:00 PM", "4:00 PM", "5:00 PM"] },
      { day: "Thursday", slots: ["3:00 PM", "4:00 PM"] },
      { day: "Friday", slots: ["2:00 PM", "3:00 PM"] }
    ],
    reviews: [
      { id: 1, name: "Alex Tan", rating: 5, date: "Oct 28, 2025", comment: "Sarah is an amazing tutor! She explained Python concepts so clearly and was very patient with my questions. Highly recommend!" },
      { id: 2, name: "Jessica Lim", rating: 5, date: "Oct 25, 2025", comment: "Very knowledgeable and helpful. Sarah helped me ace my Data Structures exam. Thank you!" },
      { id: 3, name: "Ryan Wong", rating: 4, date: "Oct 20, 2025", comment: "Great tutor, very responsive and prepared for our sessions. Would book again." },
      { id: 4, name: "Michelle Koh", rating: 5, date: "Oct 15, 2025", comment: "Sarah is patient and explains things in a way that's easy to understand. Definitely booking more sessions!" },
      { id: 5, name: "Daniel Lee", rating: 5, date: "Oct 10, 2025", comment: "Excellent tutor! Helped me understand Java OOP concepts that I was struggling with." }
    ]
  };

  const displayedReviews = showAllReviews ? tutor.reviews : tutor.reviews.slice(0, 3);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <button 
          onClick={() => navigate('/find-tutors')}
          className="flex items-center text-blue-600 hover:text-blue-700 mb-6"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Search
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-lg shadow p-8">
              <div className="flex flex-col md:flex-row items-center md:items-start gap-6 mb-6">
                <div className="w-32 h-32 bg-gray-300 rounded-full flex-shrink-0"></div>
                <div className="flex-1 text-center md:text-left">
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">{tutor.name}</h1>
                  <p className="text-gray-600 mb-3">{tutor.year} | {tutor.course}</p>
                  <div className="flex items-center justify-center md:justify-start mb-3">
                    <span className="text-yellow-500 text-xl">★★★★★</span>
                    <span className="ml-2 font-bold text-xl text-gray-900">{tutor.rating}</span>
                    <span className="ml-2 text-gray-600">({tutor.reviewCount} reviews)</span>
                  </div>
                  <div className="flex flex-wrap gap-2 justify-center md:justify-start mb-3">
                    {tutor.badges.map((badge, index) => (
                      <span key={index} className="px-4 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm font-semibold">
                        {badge}
                      </span>
                    ))}
                  </div>
                  <p className="text-sm text-gray-500">Member since: {tutor.memberSince}</p>
                </div>
              </div>

              <div className="border-t border-gray-200 pt-6">
                <h2 className="text-xl font-bold text-gray-900 mb-3">About</h2>
                <p className="text-gray-700 leading-relaxed">{tutor.about}</p>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Subjects & Expertise</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {tutor.subjects.map((subject, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4">
                    <h3 className="font-bold text-gray-900 mb-2">{subject.name}</h3>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm text-gray-600">Grade Achieved</span>
                      <span className="font-semibold text-green-600">{subject.grade}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Sessions</span>
                      <span className="font-semibold text-gray-900">{subject.sessions}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Session Statistics</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <p className="text-3xl font-bold text-blue-600">{tutor.stats.totalSessions}</p>
                  <p className="text-sm text-gray-600 mt-1">Total Sessions</p>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <p className="text-3xl font-bold text-green-600">{tutor.stats.hoursTaught}</p>
                  <p className="text-sm text-gray-600 mt-1">Hours Taught</p>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <p className="text-3xl font-bold text-purple-600">{tutor.stats.responseRate}%</p>
                  <p className="text-sm text-gray-600 mt-1">Response Rate</p>
                </div>
                <div className="text-center p-4 bg-orange-50 rounded-lg">
                  <p className="text-xl font-bold text-orange-600">{tutor.stats.replyTime}</p>
                  <p className="text-sm text-gray-600 mt-1">Reply Time</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Recent Reviews</h2>
              <div className="space-y-4">
                {displayedReviews.map(review => (
                  <div key={review.id} className="border-b border-gray-200 pb-4 last:border-b-0">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="font-semibold text-gray-900">{review.name}</h3>
                        <div className="flex items-center mt-1">
                          <span className="text-yellow-500">{"★".repeat(review.rating)}</span>
                          <span className="ml-2 text-sm text-gray-500">{review.date}</span>
                        </div>
                      </div>
                    </div>
                    <p className="text-gray-700">{review.comment}</p>
                  </div>
                ))}
              </div>
              {!showAllReviews && tutor.reviews.length > 3 && (
                <button 
                  onClick={() => setShowAllReviews(true)}
                  className="w-full mt-4 bg-gray-100 hover:bg-gray-200 text-gray-800 py-2 rounded-lg transition-colors font-medium"
                >
                  Load More Reviews
                </button>
              )}
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow p-6 sticky top-4">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Availability</h2>
              <div className="space-y-3">
                {tutor.availability.map((day, index) => (
                  <div key={index} className="border-b border-gray-200 pb-3 last:border-b-0">
                    <h3 className="font-semibold text-gray-900 mb-2">{day.day}</h3>
                    <div className="flex flex-wrap gap-2">
                      {day.slots.map((slot, slotIndex) => (
                        <span key={slotIndex} className="px-3 py-1 bg-green-100 text-green-700 rounded text-sm">
                          {slot}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 space-y-3">
                <button 
                  onClick={() => navigate(`/booking/${tutor.id}`)}
                  className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors font-semibold"
                >
                  Book Session
                </button>
                <button 
                  onClick={() => navigate('/messages')}
                  className="w-full bg-gray-200 text-gray-800 py-3 rounded-lg hover:bg-gray-300 transition-colors font-semibold"
                >
                  Message Tutor
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TutorProfile;

