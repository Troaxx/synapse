import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { sessionAPI, reportAPI } from '../services/api';

const SessionHistory = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [selectedSession, setSelectedSession] = useState(null);
  const [rating, setRating] = useState(0);
  const [reviewText, setReviewText] = useState('');

  // Report State
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportReason, setReportReason] = useState('Inappropriate Behavior');
  const [reportDetails, setReportDetails] = useState('');
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
          notes: session.sessionNotes,
          reported: session.reported,
          reportStatus: session.reportStatus
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

  const handleReport = (session) => {
    setSelectedSession(session);
    setShowReportModal(true);
    setReportReason('Inappropriate Behavior');
    setReportDetails('');
  };

  const handleSubmitReport = async (e) => {
    e.preventDefault();
    if (!selectedSession || !reportReason || !reportDetails) return;

    try {
      await reportAPI.createReport({
        reportedUserId: selectedSession.tutorId,
        sessionId: selectedSession.id,
        reason: reportReason,
        details: reportDetails
      });
      alert('Report submitted successfully. Your report is anonymous.');
      setShowReportModal(false);
      setReportReason('');
      setReportDetails('');
    } catch (error) {
      console.error('Error reporting:', error);
      alert('Failed to submit report');
    }
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
      alert(error.response?.data?.message || 'Failed to submit review');
    }
  };

  // Helper to calculate stats
  const validSessions = sessions.filter(s => s.status !== 'Cancelled');
  const completedSessions = validSessions.filter(s => s.status === 'Completed');
  const totalHours = completedSessions.reduce((acc, curr) => acc + (parseInt(curr.duration || 0)), 0) / 60;

  const stats = {
    totalSessions: validSessions.length,
    totalHours: Math.round(totalHours * 10) / 10
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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 rounded-full text-blue-600 mr-4">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <p className="text-sm text-gray-600 font-medium">Total Sessions</p>
                <p className="text-2xl font-bold text-gray-900">{loading ? '...' : stats.totalSessions}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-3 bg-green-100 rounded-full text-green-600 mr-4">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <p className="text-sm text-gray-600 font-medium">Total Hours</p>
                <p className="text-2xl font-bold text-gray-900">
                  {loading ? '...' : stats.totalHours}
                </p>
              </div>
            </div>
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
                            <p className="text-gray-600">
                              {user?.isTutor
                                ? `You tutored ${session.tutor}`
                                : `Tutored by ${session.tutor}`}
                            </p>
                          </div>
                          <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-semibold">
                            {session.status}
                          </span>
                        </div>
                        <p className="text-gray-700 mb-3">Topic: {session.topic}</p>
                        <div className="flex items-center text-gray-600 text-sm">
                          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          {session.duration}
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
                          <h4 className="font-semibold text-gray-900">
                            {user.isTutor ? `${session.tutor}'s Review` : 'Your Review'}
                          </h4>
                          <div className="flex items-center">
                            <span className="text-yellow-500">{"★".repeat(session.rating)}</span>
                          </div>
                        </div>
                        <p className="text-gray-700 text-sm">{session.review}</p>
                      </div>
                    )}
                  </div>

                  <div className="flex lg:flex-col gap-2 lg:w-40">
                    {!user?.isTutor && (
                      !session.reviewed ? (
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
                      )
                    )}

                    {session.reported ? (
                      <button
                        disabled
                        className="flex-1 bg-gray-100 text-gray-500 py-2 px-4 rounded-lg font-medium cursor-not-allowed border border-gray-200 text-sm"
                      >
                        Report under Review
                      </button>
                    ) : (
                      <button
                        onClick={() => handleReport(session)}
                        className="flex-1 bg-red-100 text-red-700 py-2 px-4 rounded-lg hover:bg-red-200 transition-colors font-medium text-sm"
                      >
                        Report
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
      {showReportModal && selectedSession && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h2 className="text-2xl font-bold text-red-600 mb-2">Report Incident</h2>
            <p className="text-gray-500 text-sm mb-4">
              Your report is anonymous and will be reviewed by administrators. ({user?.isTutor
                ? `Reporting Student: ${selectedSession.tutor}`
                : `Reporting Tutor: ${selectedSession.tutor}`})
            </p>

            <form onSubmit={handleSubmitReport}>
              <div className="mb-4">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Reason for Report
                </label>
                <select
                  value={reportReason}
                  onChange={(e) => setReportReason(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                >
                  <option value="Inappropriate Behavior">Inappropriate Behavior</option>
                  <option value="Spam or Harassment">Spam or Harassment</option>
                  <option value="Did Not Attend">Did Not Attend</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Incident Details
                </label>
                <textarea
                  value={reportDetails}
                  onChange={(e) => setReportDetails(e.target.value)}
                  required
                  rows="4"
                  placeholder="Please describe what happened..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                ></textarea>
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowReportModal(false)}
                  className="flex-1 bg-gray-200 text-gray-800 py-3 rounded-lg hover:bg-gray-300 transition-colors font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-red-600 text-white py-3 rounded-lg hover:bg-red-700 transition-colors font-semibold"
                >
                  Submit Report
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

