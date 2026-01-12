import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { recommendationAPI } from '../services/api';
import SparklesIcon from '../assets/icons/sparkles.svg';

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
          <img src={SparklesIcon} alt="AI" className="w-6 h-6 text-purple-600" style={{ filter: 'invert(37%) sepia(38%) saturate(7181%) hue-rotate(256deg) brightness(87%) contrast(102%)' }} />
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
          <img src={SparklesIcon} alt="AI" className="w-6 h-6 text-purple-600" style={{ filter: 'invert(37%) sepia(38%) saturate(7181%) hue-rotate(256deg) brightness(87%) contrast(102%)' }} />
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
            <img src={SparklesIcon} alt="AI" className="w-6 h-6 text-purple-600" style={{ filter: 'invert(37%) sepia(38%) saturate(7181%) hue-rotate(256deg) brightness(87%) contrast(102%)' }} />
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
          <div className="mb-6">
            <p className="text-sm text-gray-500 mb-2">Based on your learning history:</p>
            <div className="flex flex-wrap gap-2">
              {recommendations.preferences.subjects.length > 0 && (
                <span className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-semibold">
                  📚 {recommendations.preferences.subjects.join(', ')}
                </span>
              )}
              {recommendations.preferences.location !== 'Any' && (
                <span className="px-3 py-1 bg-green-50 text-green-700 rounded-full text-xs font-semibold">
                  📍 {recommendations.preferences.location}
                </span>
              )}
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recommendations?.recommendations?.map((tutor, index) => {
            // Function to extract reason for this specific tutor
            const getTutorReason = () => {
              if (!recommendations.reasoning) return null;
              const lines = recommendations.reasoning.split('\n');
              const reasonLine = lines.find(line =>
                line.toLowerCase().includes(tutor.name.toLowerCase()) &&
                (line.trim().startsWith('-') || line.trim().startsWith('*'))
              );
              return reasonLine ? reasonLine.replace(/^[-*]\s*(?:[^:]+:)?\s*/, '').trim() : null;
            };

            const reason = getTutorReason();

            return (
              <div
                key={tutor._id}
                className="group relative border border-gray-200 rounded-xl p-5 hover:shadow-xl hover:border-purple-300 transition-all duration-300 bg-white flex flex-col cursor-pointer"
                onClick={() => navigate(`/tutor/${tutor._id}`)}
              >
                {index === 0 && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-xs font-bold px-4 py-1.5 rounded-full shadow-md z-10 flex items-center gap-1">
                    <span className="text-yellow-300">★</span> Top Match
                  </div>
                )}

                <div className="flex items-center gap-4 mb-4">
                  <div className="w-14 h-14 bg-gray-100 rounded-full flex-shrink-0 overflow-hidden border border-gray-100">
                    {tutor.profilePhoto ? (
                      <img src={tutor.profilePhoto} alt={tutor.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400 font-bold bg-gray-50 text-xl">
                        {tutor.name?.charAt(0)}
                      </div>
                    )}
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 line-clamp-1">{tutor.name}</h3>
                    <p className="text-xs text-gray-500">{tutor.year} | {tutor.course}</p>
                    <div className="flex items-center mt-1">
                      <span className="text-yellow-400 text-sm">★</span>
                      <span className="text-xs font-bold text-gray-900 ml-1">{tutor.tutorProfile?.rating || 0}</span>
                      <span className="text-xs text-gray-400 ml-1">({tutor.tutorProfile?.reviewCount || 0})</span>
                    </div>
                  </div>
                </div>

                {/* AI Reason Section */}
                {reason && (
                  <div className="mb-4 bg-purple-50 p-3 rounded-lg border border-purple-100">
                    <ul className="space-y-1">
                      {reason.split('|').map((point, idx) => (
                        <li key={idx} className="flex items-start text-xs text-purple-800">
                          <span className="mr-2 mt-0.5 text-purple-600">•</span>
                          <span className="italic">{point.trim()}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="mt-auto">
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {tutor.tutorProfile?.subjects?.slice(0, 2).map((subject, idx) => (
                      <span key={idx} className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-[10px] font-medium truncate max-w-full">
                        {subject.name}
                      </span>
                    ))}
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/tutor/${tutor._id}`);
                    }}
                    className="w-full bg-white text-purple-600 border border-purple-200 py-2 rounded-lg hover:bg-purple-600 hover:text-white transition-colors text-sm font-semibold group-hover:border-purple-600"
                  >
                    View Profile
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {(!recommendations?.recommendations || recommendations.recommendations.length === 0) && (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl">🌱</span>
            </div>
            <h3 className="text-lg font-medium text-gray-900">Start your learning journey</h3>
            <p className="text-gray-500 mt-1 max-w-sm mx-auto">Complete a few sessions to verify your subjects, and we'll find the perfect tutors for you.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AIRecommendations;
