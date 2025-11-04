import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { recommendationAPI } from '../services/api';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';

const AIRecommendations = () => {
  const navigate = useNavigate();
  const [recommendations, setRecommendations] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadRecommendations();
  }, []);

  const loadRecommendations = async () => {
    try {
      setLoading(true);
      const recsResponse = await recommendationAPI.getPersonalizedTutors();

      setRecommendations(recsResponse.data.data);
      setError(null);
    } catch (err) {
      console.error('Error loading recommendations:', err);
      setError('Unable to load AI recommendations');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center gap-2 mb-4">
          <AutoAwesomeIcon className="text-purple-600" />
          <h2 className="text-xl font-bold text-gray-900">AI-Powered Recommendations</h2>
        </div>
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Analyzing your learning patterns...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center gap-2 mb-4">
          <AutoAwesomeIcon className="text-purple-600" />
          <h2 className="text-xl font-bold text-gray-900">AI-Powered Recommendations</h2>
        </div>
        <div className="text-center py-8 text-gray-600">
          <p>{error}</p>
          <button 
            onClick={loadRecommendations}
            className="mt-4 text-blue-600 hover:text-blue-700 font-medium"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <AutoAwesomeIcon className="text-purple-600" />
            <h2 className="text-xl font-bold text-gray-900">Personalized Tutor Recommendations</h2>
          </div>
          <button 
            onClick={loadRecommendations}
            className="text-sm text-blue-600 hover:text-blue-700 font-medium"
          >
            Refresh
          </button>
        </div>

        {recommendations?.preferences && (
          <div className="mb-4 p-4 bg-blue-50 rounded-lg">
            <p className="text-sm font-medium text-gray-700 mb-2">Based on your preferences:</p>
            <div className="flex flex-wrap gap-2">
              {recommendations.preferences.subjects.length > 0 && (
                <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
                  Subjects: {recommendations.preferences.subjects.join(', ')}
                </span>
              )}
              {recommendations.preferences.location !== 'Any' && (
                <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm">
                  Location: {recommendations.preferences.location}
                </span>
              )}
              {recommendations.preferences.timeSlot !== 'Any' && (
                <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm">
                  Time: {recommendations.preferences.timeSlot}
                </span>
              )}
            </div>
          </div>
        )}

        {recommendations?.reasoning && (
          <div className="mb-4 p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-700 whitespace-pre-line">
              {recommendations.reasoning.split('REASONING:')[1]?.trim() || recommendations.reasoning}
            </p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {recommendations?.recommendations?.map((tutor, index) => (
            <div 
              key={tutor._id}
              className="border-2 border-purple-200 rounded-lg p-4 hover:shadow-lg transition-all cursor-pointer relative"
              onClick={() => navigate(`/tutor/${tutor._id}`)}
            >
              {index === 0 && (
                <div className="absolute -top-2 -right-2 bg-purple-600 text-white text-xs font-bold px-2 py-1 rounded-full">
                  Top Pick
                </div>
              )}
              <div className="w-16 h-16 bg-gray-300 rounded-full mx-auto mb-3"></div>
              <h3 className="font-semibold text-center text-gray-900 mb-1">{tutor.name}</h3>
              <p className="text-sm text-gray-600 text-center mb-2">{tutor.year}</p>
              
              {tutor.tutorProfile && (
                <>
                  <div className="flex items-center justify-center mb-2">
                    <span className="text-yellow-500">★</span>
                    <span className="text-sm font-medium ml-1">{tutor.tutorProfile.rating}</span>
                    <span className="text-xs text-gray-500 ml-1">
                      ({tutor.tutorProfile.reviewCount} reviews)
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-1 justify-center mb-3">
                    {tutor.tutorProfile.subjects?.slice(0, 2).map((subject, idx) => (
                      <span key={idx} className="px-2 py-1.5 bg-purple-100 text-purple-700 rounded-lg text-xs whitespace-normal break-words">
                        {subject.moduleCode ? `${subject.moduleCode} - ${subject.name}` : subject.name}
                      </span>
                    ))}
                  </div>

                  {tutor.tutorProfile.badges?.length > 0 && (
                    <div className="flex flex-wrap gap-1 justify-center mb-3">
                      {tutor.tutorProfile.badges.slice(0, 2).map((badge, idx) => (
                        <span key={idx} className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-semibold">
                          {badge}
                        </span>
                      ))}
                    </div>
                  )}
                </>
              )}

              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  navigate(`/tutor/${tutor._id}`);
                }}
                className="w-full mt-3 bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700 transition-colors text-sm font-medium"
              >
                View Profile
              </button>
            </div>
          ))}
        </div>

        {(!recommendations?.recommendations || recommendations.recommendations.length === 0) && (
          <div className="text-center py-8 text-gray-600">
            <p>Complete a few sessions to get personalized recommendations!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AIRecommendations;

