import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { tutorAPI } from '../services/api';
import ContactTutorButton from '../components/ContactTutorButton';

const TutorProfile = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [showAllReviews, setShowAllReviews] = useState(false);
  const [tutor, setTutor] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTutorData();
  }, [id]);

  const loadTutorData = async () => {
    try {
      setLoading(true);
      const response = await tutorAPI.getTutorById(id); // This object contains { name: "...", email: "...", ... }
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
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-900">Reviews ({reviews.length})</h2>
              </div>

              {reviews.length > 0 ? (
                <div className="space-y-6">
                  {displayedReviews.map((session, index) => (
                    <div key={index} className="border-b border-gray-100 last:border-0 pb-6 last:pb-0">
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex items-center">
                          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold mr-3">
                            {session.student?.name?.charAt(0) || 'A'}
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900">{session.student?.name || 'Anonymous'}</p>
                            <p className="text-xs text-gray-500">
                              {session.review?.reviewedAt
                                ? new Date(session.review.reviewedAt).toLocaleDateString()
                                : 'Recent'}
                            </p>
                          </div>
                        </div>
                        <div className="flex text-yellow-400">
                          {[...Array(5)].map((_, i) => (
                            <span key={i} className={i < (session.review?.rating || 0) ? "text-yellow-400" : "text-gray-300"}>★</span>
                          ))}
                        </div>
                      </div>
                      <p className="text-gray-600 mt-2">{session.review?.comment || 'No comment provided'}</p>
                    </div>
                  ))}

                  {reviews.length > 3 && (
                    <button
                      onClick={() => setShowAllReviews(!showAllReviews)}
                      className="w-full py-2 text-blue-600 font-medium hover:bg-blue-50 rounded-lg transition-colors border border-blue-200"
                    >
                      {showAllReviews ? 'Show Less' : `Show All ${reviews.length} Reviews`}
                    </button>
                  )}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <p>No reviews yet</p>
                </div>
              )}
            </div>

            <div className="bg-white rounded-lg shadow p-6 sticky top-4">
              <div className="space-y-3">
                <button
                  onClick={() => navigate(`/booking/${tutor._id || tutor.id}`)}
                  className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors font-semibold"
                >
                  Book Session
                </button>
                <ContactTutorButton tutor={tutor} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TutorProfile;

