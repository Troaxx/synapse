import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { tutorAPI } from '../services/api';
import MSTeamsDialog from '../components/MSTeamsDialog';

const TutorProfile = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [showAllReviews, setShowAllReviews] = useState(false);
  const [tutor, setTutor] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showMSTeamsDialog, setShowMSTeamsDialog] = useState(false);

  useEffect(() => {
    loadTutorData();
  }, [id]);

  const loadTutorData = async () => {
    try {
      setLoading(true);
      const response = await tutorAPI.getTutorById(id);
      setTutor(response.data.tutor);
      setReviews(response.data.reviews || []);
    } catch (error) {
      console.error('Error loading tutor data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-600">Loading tutor profile...</div>
      </div>
    );
  }

  if (!tutor) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-600">Tutor not found</div>
      </div>
    );
  }

  const displayedReviews = showAllReviews ? reviews : reviews.slice(0, 3);

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
                <div className="w-32 h-32 bg-gray-300 rounded-full flex-shrink-0 overflow-hidden">
                  {tutor.profilePhoto ? (
                    <img src={tutor.profilePhoto} alt={tutor.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-white font-semibold bg-gray-400 text-4xl">
                      {tutor.name?.charAt(0)}
                    </div>
                  )}
                </div>
                <div className="flex-1 text-center md:text-left">
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">{tutor.name}</h1>
                  <p className="text-gray-600 mb-3">{tutor.year} | {tutor.course}</p>
                  <div className="flex items-center justify-center md:justify-start mb-3">
                    <span className="text-yellow-500 text-xl">★</span>
                    <span className="ml-2 font-bold text-xl text-gray-900">{tutor.tutorProfile?.rating || 0}</span>
                    <span className="ml-2 text-gray-600">({tutor.tutorProfile?.reviewCount || 0} reviews)</span>
                  </div>
                  <div className="flex flex-wrap gap-2 justify-center md:justify-start mb-3">
                    {tutor.tutorProfile?.badges?.map((badge, index) => (
                      <span key={index} className="px-4 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm font-semibold">
                        {badge}
                      </span>
                    ))}
                  </div>
                  <p className="text-sm text-gray-500">Member since: {new Date(tutor.memberSince).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}</p>
                </div>
              </div>

              <div className="border-t border-gray-200 pt-6">
                <h2 className="text-xl font-bold text-gray-900 mb-3">About</h2>
                <p className="text-gray-700 leading-relaxed">{tutor.bio || 'No bio available'}</p>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Subjects</h2>
              {tutor.tutorProfile?.subjects && tutor.tutorProfile.subjects.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {tutor.tutorProfile.subjects.slice(0, 3).map((subject, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-4">
                      <h3 className="font-bold text-gray-900 mb-1">{subject.moduleCode || ''} {subject.moduleCode && subject.name ? '-' : ''} {subject.name}</h3>
                      <div className="flex justify-between items-center mt-2">
                        <span className="text-sm text-gray-600">Grade Achieved</span>
                        <span className="font-semibold text-green-600">{subject.grade || 'N/A'}</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">No subjects listed</p>
              )}
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Response Rate/Statistics</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <p className="text-3xl font-bold text-purple-600">{tutor.tutorProfile?.responseRate || 0}%</p>
                  <p className="text-sm text-gray-600 mt-1">Response Rate</p>
                </div>
                <div className="text-center p-4 bg-orange-50 rounded-lg">
                  <p className="text-xl font-bold text-orange-600">{tutor.tutorProfile?.replyTime || '< 24 hours'}</p>
                  <p className="text-sm text-gray-600 mt-1">Reply Time</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Recent Reviews</h2>
              {reviews.length > 0 ? (
                <>
                  <div className="space-y-4">
                    {displayedReviews.map(review => (
                      <div key={review._id || review.id} className="border-b border-gray-200 pb-4 last:border-b-0">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h3 className="font-semibold text-gray-900">{review.student?.name || 'Anonymous'}</h3>
                            <div className="flex items-center mt-1">
                              <span className="text-yellow-500">{"★".repeat(review.review?.rating || 0)}</span>
                              <span className="ml-2 text-sm text-gray-500">
                                {review.review?.reviewedAt ? new Date(review.review.reviewedAt).toLocaleDateString() : 'N/A'}
                              </span>
                            </div>
                          </div>
                        </div>
                        <p className="text-gray-700">{review.review?.comment || 'No comment'}</p>
                      </div>
                    ))}
                  </div>
                  {!showAllReviews && reviews.length > 3 && (
                    <button 
                      onClick={() => setShowAllReviews(true)}
                      className="w-full mt-4 bg-gray-100 hover:bg-gray-200 text-gray-800 py-2 rounded-lg transition-colors font-medium"
                    >
                      Load More Reviews
                    </button>
                  )}
                </>
              ) : (
                <p className="text-gray-500">No reviews yet</p>
              )}
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow p-6 sticky top-4">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Availability</h2>
              {tutor.tutorProfile?.availability && tutor.tutorProfile.availability.length > 0 ? (
                <div className="space-y-3">
                  {tutor.tutorProfile.availability.map((day, index) => (
                    <div key={index} className="border-b border-gray-200 pb-3 last:border-b-0">
                      <h3 className="font-semibold text-gray-900 mb-2">{day.day}</h3>
                      <div className="flex flex-wrap gap-2">
                        {day.slots?.map((slot, slotIndex) => (
                          <span key={slotIndex} className="px-3 py-1 bg-green-100 text-green-700 rounded text-sm">
                            {slot}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">Availability not set</p>
              )}

              <div className="mt-6 space-y-3">
                <button 
                  onClick={() => navigate(`/booking/${tutor._id || tutor.id}`)}
                  className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors font-semibold"
                >
                  Book Session
                </button>
                <button 
                  onClick={() => setShowMSTeamsDialog(true)}
                  className="w-full bg-gray-200 text-gray-800 py-3 rounded-lg hover:bg-gray-300 transition-colors font-semibold"
                >
                  Message Tutor
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <MSTeamsDialog 
        isOpen={showMSTeamsDialog}
        onClose={() => setShowMSTeamsDialog(false)}
        tutorName={tutor?.name}
      />
    </div>
  );
};

export default TutorProfile;

