import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { tutorAPI } from '../services/api';
import ModuleFilter from '../components/ModuleFilter';
import { useAuth } from '../context/AuthContext';

const FindTutors = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedModuleCode, setSelectedModuleCode] = useState('');
  const [selectedRating, setSelectedRating] = useState('');
  const [selectedAvailability, setSelectedAvailability] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');
  const [sortBy, setSortBy] = useState('rating');
  const [tutors, setTutors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTutors();
  }, [selectedModuleCode, selectedRating, sortBy]);

  const loadTutors = async () => {
    try {
      setLoading(true);
      const params = {};
      if (selectedModuleCode) params.moduleCode = selectedModuleCode;
      if (selectedRating) params.rating = selectedRating;
      if (sortBy) params.sortBy = sortBy;

      console.log('Loading tutors with params:', params);
      const response = await tutorAPI.getAllTutors(params);

      // Filter out the current user
      const allTutors = response.data || [];
      const currentUserId = user?._id || user?.id;
      const otherTutors = allTutors.filter(t =>
        t._id !== currentUserId && t.id !== currentUserId
      );

      setTutors(otherTutors);
    } catch (error) {
      console.error('Error loading tutors:', error);
      setTutors([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredTutors = tutors.filter(tutor => {
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      const matchesName = tutor.name?.toLowerCase().includes(query);
      const matchesSubject = tutor.tutorProfile?.subjects?.some(s =>
        s.name?.toLowerCase().includes(query)
      );
      return matchesName || matchesSubject;
    }
    return true;
  });

  const handleClearFilters = () => {
    setSelectedModuleCode('');
    setSelectedRating('');
    setSelectedAvailability('');
    setSelectedLocation('');
    setSearchQuery('');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Find Tutors</h1>
          <div className="relative">
            <input
              type="text"
              placeholder="Search by tutor name or module code"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-3 pl-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <svg className="absolute left-4 top-3.5 h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          <div className="lg:w-64 flex-shrink-0">
            <div className="bg-white rounded-lg shadow p-6 sticky top-4">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Filters</h2>

              <ModuleFilter
                selectedModuleCode={selectedModuleCode}
                onModuleChange={setSelectedModuleCode}
                className="mb-6"
              />

              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 mb-2">Rating</label>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input type="radio" name="rating" value="" checked={selectedRating === ''} onChange={(e) => setSelectedRating('')} className="mr-2" />
                    <span className="text-sm text-gray-700">All Ratings</span>
                  </label>
                  <label className="flex items-center">
                    <input type="radio" name="rating" value="5" checked={selectedRating === '5'} onChange={(e) => setSelectedRating(e.target.value)} className="mr-2" />
                    <span className="text-sm text-gray-700">5 stars</span>
                  </label>
                  <label className="flex items-center">
                    <input type="radio" name="rating" value="4" checked={selectedRating === '4'} onChange={(e) => setSelectedRating(e.target.value)} className="mr-2" />
                    <span className="text-sm text-gray-700">4+ stars</span>
                  </label>
                  <label className="flex items-center">
                    <input type="radio" name="rating" value="3" checked={selectedRating === '3'} onChange={(e) => setSelectedRating(e.target.value)} className="mr-2" />
                    <span className="text-sm text-gray-700">3+ stars</span>
                  </label>
                </div>
              </div>

              {/* <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 mb-2">Availability</label>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input type="checkbox" className="mr-2" />
                    <span className="text-sm text-gray-700">Available now</span>
                  </label>
                  <label className="flex items-center">
                    <input type="checkbox" className="mr-2" />
                    <span className="text-sm text-gray-700">Today</span>
                  </label>
                  <label className="flex items-center">
                    <input type="checkbox" className="mr-2" />
                    <span className="text-sm text-gray-700">This week</span>
                  </label>
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 mb-2">Location</label>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input type="checkbox" className="mr-2" />
                    <span className="text-sm text-gray-700">On Campus</span>
                  </label>
                  <label className="flex items-center">
                    <input type="checkbox" className="mr-2" />
                    <span className="text-sm text-gray-700">Online</span>
                  </label>
                  <label className="flex items-center">
                    <input type="checkbox" className="mr-2" />
                    <span className="text-sm text-gray-700">Library</span>
                  </label>
                </div>
              </div> */}

              <button
                onClick={handleClearFilters}
                className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 py-2 rounded-lg transition-colors font-medium"
              >
                Clear Filters
              </button>
            </div>
          </div>

          <div className="flex-1">
            <div className="flex justify-between items-center mb-4">
              <p className="text-gray-700 font-medium">{loading ? 'Loading...' : `${filteredTutors.length} tutors found`}</p>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="rating">Sort by: Rating</option>
                <option value="mostBooked">Sort by: Most Booked</option>
              </select>
            </div>

            {loading ? (
              <div className="text-center py-12 text-gray-500">Loading tutors...</div>
            ) : filteredTutors.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredTutors.map(tutor => (
                  <div key={tutor._id} className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow p-6">
                    <div className="flex flex-col items-center mb-6">
                      <div className="w-20 h-20 bg-gray-300 rounded-full mb-4 overflow-hidden">
                        {tutor.profilePhoto ? (
                          <img src={tutor.profilePhoto} alt={tutor.name} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-white font-semibold bg-gray-400">
                            {tutor.name?.charAt(0)}
                          </div>
                        )}
                      </div>
                      <h3 className="font-bold text-lg text-gray-900 text-center mb-1">{tutor.name}</h3>
                      <p className="text-sm text-gray-600 mb-4">{tutor.year} | {tutor.course}</p>
                    </div>

                    <div className="flex items-center justify-center mb-4">
                      <span className="text-yellow-500 text-lg">★</span>
                      <span className="ml-2 font-semibold text-gray-900">{tutor.tutorProfile?.rating || 0}</span>
                      <span className="ml-1 text-sm text-gray-500">({tutor.tutorProfile?.reviewCount || 0} reviews)</span>
                    </div>

                    <div className="flex flex-wrap gap-2 justify-center mb-4">
                      {tutor.tutorProfile?.subjects?.slice(0, 3).map((subject, index) => (
                        <span key={index} className="px-3 py-1.5 bg-blue-100 text-blue-700 rounded-lg text-xs font-medium whitespace-normal break-words max-w-full">
                          {subject.moduleCode ? `${subject.moduleCode} - ${subject.name}` : subject.name}
                        </span>
                      ))}
                    </div>

                    {tutor.tutorProfile?.badges && tutor.tutorProfile.badges.length > 0 && (
                      <div className="flex flex-wrap gap-2 justify-center mb-4">
                        {tutor.tutorProfile.badges.slice(0, 2).map((badge, index) => (
                          <span key={index} className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-semibold">
                            {badge}
                          </span>
                        ))}
                      </div>
                    )}

                    <div className="flex gap-2">
                      <button
                        onClick={() => navigate(`/tutor/${tutor._id}`)}
                        className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                      >
                        View Profile
                      </button>
                      <button
                        onClick={() => navigate(`/booking/${tutor._id}`)}
                        className="flex-1 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition-colors font-medium"
                      >
                        Quick Book
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 text-gray-500">No tutors found</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FindTutors;

