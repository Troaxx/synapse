import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { sessionAPI } from '../services/api';

const SessionHistory = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [selectedSession, setSelectedSession] = useState(null);
  const [rating, setRating] = useState(0);
  const [reviewText, setReviewText] = useState('');
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSessions();
  }, []);

  const loadSessions = async () => {
    try {
      setLoading(true);
      const response = await sessionAPI.getUserSessions({ type: 'past' });
      const isTutor = user?.isTutor;
      const userId = user?._id || user?.id;
      
      const filteredSessions = response.data
        .filter(s => {
          if (isTutor) {
            return (s.tutor?._id === userId || s.tutor === userId);
          } else {
            return (s.student?._id === userId || s.student === userId);
          }
        })
        .map(session => ({
          id: session._id,
          tutor: isTutor ? session.student?.name : session.tutor?.name,
          tutorId: isTutor ? (session.student?._id || session.student) : (session.tutor?._id || session.tutor),
          tutorImage: isTutor ? session.student?.profilePhoto : session.tutor?.profilePhoto,
          subject: session.subject,
          topic: session.topic,
          date: new Date(session.date).toLocaleDateString(),
          time: session.time,
          duration: `${session.duration} min`,
          location: session.location,
          status: session.status,
          reviewed: !!session.review,
          rating: session.review?.rating,
          review: session.review?.comment,
          notes: session.sessionNotes
        }));
      
      setSessions(filteredSessions);
    } catch (error) {
      console.error('Error loading sessions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLeaveReview = (session) => {
    setSelectedSession(session);
    setShowReviewModal(true);
    setRating(0);
    setReviewText('');
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!selectedSession || !rating || !reviewText) return;
    
    try {
      await sessionAPI.addReview(selectedSession.id, { rating, comment: reviewText });
      setShowReviewModal(false);
      setSelectedSession(null);
      await loadSessions();
    } catch (error) {
      console.error('Error submitting review:', error);
      alert('Failed to submit review');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Session History</h1>
          <div className="text-gray-600">
            <span className="font-semibold">{loading ? '...' : sessions.length}</span> total sessions
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-sm text-gray-600 mb-2">Total Sessions</h3>
            <p className="text-3xl font-bold text-blue-600">{loading ? '...' : sessions.length}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-sm text-gray-600 mb-2">Total Hours</h3>
            <p className="text-3xl font-bold text-green-600">
              {loading ? '...' : Math.round(sessions.reduce((acc, s) => acc + parseInt(s.duration || 0), 0) / 60 * 10) / 10}
            </p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-sm text-gray-600 mb-2">Reviews Given</h3>
            <p className="text-3xl font-bold text-purple-600">
              {loading ? '...' : sessions.filter(s => s.reviewed).length}
            </p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-sm text-gray-600 mb-2">Pending Reviews</h3>
            <p className="text-3xl font-bold text-orange-600">
              {loading ? '...' : sessions.filter(s => !s.reviewed).length}
            </p>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12 text-gray-500">Loading session history...</div>
        ) : sessions.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <p className="text-gray-500">No completed sessions yet</p>
          </div>
        ) : (
          <div className="space-y-4">
            {sessions.map(session => (
            <div key={session.id} className="bg-white rounded-lg shadow p-6">
              <div className="flex flex-col lg:flex-row gap-6">
                <div className="flex-1">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="w-16 h-16 bg-gray-300 rounded-full flex-shrink-0"></div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="text-xl font-bold text-gray-900">{session.subject}</h3>
                          <p className="text-gray-600">with {session.tutor}</p>
                        </div>
                        <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-semibold">
                          {session.status}
                        </span>
                      </div>
                      <p className="text-gray-700 mb-3">Topic: {session.topic}</p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
                        <div className="flex items-center text-gray-600">
                          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          {session.date} at {session.time}
                        </div>
                        <div className="flex items-center text-gray-600">
                          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          {session.duration}
                        </div>
                        <div className="flex items-center text-gray-600">
                          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                          {session.location}
                        </div>
                      </div>
                    </div>
                  </div>

                  {session.notes && (
                    <div className="bg-gray-50 rounded-lg p-4 mb-4">
                      <h4 className="font-semibold text-gray-900 mb-2">Session Notes</h4>
                      <p className="text-gray-700 text-sm">{session.notes}</p>
                    </div>
                  )}

                  {session.reviewed && (
                    <div className="bg-blue-50 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold text-gray-900">Your Review</h4>
                        <div className="flex items-center">
                          <span className="text-yellow-500">{"★".repeat(session.rating)}</span>
                        </div>
                      </div>
                      <p className="text-gray-700 text-sm">{session.review}</p>
                    </div>
                  )}
                </div>

                <div className="flex lg:flex-col gap-2 lg:w-40">
                  {!session.reviewed ? (
                    <button
                      onClick={() => handleLeaveReview(session)}
                      className="flex-1 bg-yellow-500 text-white py-2 px-4 rounded-lg hover:bg-yellow-600 transition-colors font-medium text-sm"
                    >
                      Leave Review
                    </button>
                  ) : (
                    <button
                      className="flex-1 bg-gray-100 text-gray-500 py-2 px-4 rounded-lg cursor-not-allowed font-medium text-sm"
                      disabled
                    >
                      Reviewed
                    </button>
                  )}
                  {!user?.isTutor && session.tutorId && (
                    <button
                      onClick={() => navigate(`/tutor/${session.tutorId}`)}
                      className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm"
                    >
                      View Tutor
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
          </div>
        )}
      </div>

      {showReviewModal && selectedSession && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Leave a Review</h2>
            <p className="text-gray-600 mb-4">
              How was your session with {selectedSession?.tutor}?
            </p>
            <form onSubmit={handleSubmitReview}>
              <div className="mb-4">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Rating
                </label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map(star => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      className={`text-3xl ${star <= rating ? 'text-yellow-500' : 'text-gray-300'}`}
                    >
                      ★
                    </button>
                  ))}
                </div>
              </div>
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Your Review
                </label>
                <textarea
                  value={reviewText}
                  onChange={(e) => setReviewText(e.target.value)}
                  required
                  rows="4"
                  placeholder="Share your experience..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                ></textarea>
              </div>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowReviewModal(false)}
                  className="flex-1 bg-gray-200 text-gray-800 py-3 rounded-lg hover:bg-gray-300 transition-colors font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors font-semibold"
                >
                  Submit Review
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default SessionHistory;

