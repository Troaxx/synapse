import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const FindTutors = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');
  const [selectedRating, setSelectedRating] = useState('');
  const [selectedAvailability, setSelectedAvailability] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');
  const [sortBy, setSortBy] = useState('rating');

  const tutors = [
    { id: 1, name: "Sarah Chen", year: "Year 2", course: "Diploma in IT", rating: 4.9, reviews: 87, sessions: 48, responseRate: 95, subjects: ["Python", "Java", "Data Structures"], badges: ["Top Tutor", "Subject Expert"], image: "/assets/tutor1.png" },
    { id: 2, name: "Marcus Tan", year: "Year 3", course: "Diploma in IT", rating: 4.8, reviews: 62, sessions: 62, responseRate: 92, subjects: ["Web Dev", "React", "JavaScript"], badges: ["Top Tutor"], image: "/assets/tutor2.png" },
    { id: 3, name: "Priya Kumar", year: "Year 2", course: "Diploma in IT", rating: 5.0, reviews: 35, sessions: 35, responseRate: 98, subjects: ["Math", "Statistics"], badges: ["Subject Expert"], image: "/assets/tutor3.png" },
    { id: 4, name: "David Lim", year: "Year 3", course: "Diploma in IT", rating: 4.7, reviews: 54, sessions: 71, responseRate: 90, subjects: ["Database", "SQL", "MongoDB"], badges: ["Top Tutor"], image: "/assets/tutor4.png" },
    { id: 5, name: "Emily Wong", year: "Year 2", course: "Diploma in IT", rating: 4.9, reviews: 43, sessions: 56, responseRate: 96, subjects: ["UI/UX", "Design", "Figma"], badges: ["Subject Expert"], image: "/assets/tutor5.png" },
    { id: 6, name: "Ryan Ng", year: "Year 3", course: "Diploma in IT", rating: 4.6, reviews: 29, sessions: 38, responseRate: 88, subjects: ["Networking", "Security"], badges: [], image: "/assets/tutor6.png" }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Find Tutors</h1>
          <div className="relative">
            <input
              type="text"
              placeholder="Search by subject or module code"
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
              
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 mb-2">Subject</label>
                <select 
                  value={selectedSubject}
                  onChange={(e) => setSelectedSubject(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">All Subjects</option>
                  <option value="programming">Programming</option>
                  <option value="math">Mathematics</option>
                  <option value="webdev">Web Development</option>
                  <option value="database">Database</option>
                  <option value="design">UI/UX Design</option>
                  <option value="networking">Networking</option>
                </select>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 mb-2">Rating</label>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input type="radio" name="rating" value="5" onChange={(e) => setSelectedRating(e.target.value)} className="mr-2" />
                    <span className="text-sm text-gray-700">5 stars</span>
                  </label>
                  <label className="flex items-center">
                    <input type="radio" name="rating" value="4" onChange={(e) => setSelectedRating(e.target.value)} className="mr-2" />
                    <span className="text-sm text-gray-700">4+ stars</span>
                  </label>
                  <label className="flex items-center">
                    <input type="radio" name="rating" value="3" onChange={(e) => setSelectedRating(e.target.value)} className="mr-2" />
                    <span className="text-sm text-gray-700">3+ stars</span>
                  </label>
                </div>
              </div>

              <div className="mb-6">
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
              </div>

              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 mb-2">Module Code</label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                  <option value="">Select Module</option>
                  <option value="CIT2C20">CIT2C20 - Full Stack Web Dev</option>
                  <option value="CIT2C10">CIT2C10 - Data Structures</option>
                  <option value="CIT2C30">CIT2C30 - Database Systems</option>
                </select>
              </div>

              <button className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 py-2 rounded-lg transition-colors font-medium">
                Clear Filters
              </button>
            </div>
          </div>

          <div className="flex-1">
            <div className="flex justify-between items-center mb-4">
              <p className="text-gray-700 font-medium">{tutors.length} tutors found</p>
              <select 
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="rating">Sort by: Rating</option>
                <option value="availability">Sort by: Availability</option>
                <option value="mostBooked">Sort by: Most Booked</option>
              </select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {tutors.map(tutor => (
                <div key={tutor.id} className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow p-6">
                  <div className="flex flex-col items-center mb-4">
                    <div className="w-20 h-20 bg-gray-300 rounded-full mb-3"></div>
                    <h3 className="font-bold text-lg text-gray-900 text-center">{tutor.name}</h3>
                    <p className="text-sm text-gray-600">{tutor.year} | {tutor.course}</p>
                  </div>

                  <div className="flex items-center justify-center mb-3">
                    <span className="text-yellow-500 text-lg">★★★★★</span>
                    <span className="ml-2 font-semibold text-gray-900">{tutor.rating}</span>
                    <span className="ml-1 text-sm text-gray-500">({tutor.reviews} reviews)</span>
                  </div>

                  <div className="flex flex-wrap gap-2 justify-center mb-4">
                    {tutor.subjects.map((subject, index) => (
                      <span key={index} className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                        {subject}
                      </span>
                    ))}
                  </div>

                  {tutor.badges.length > 0 && (
                    <div className="flex flex-wrap gap-2 justify-center mb-4">
                      {tutor.badges.map((badge, index) => (
                        <span key={index} className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-semibold">
                          {badge}
                        </span>
                      ))}
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-2 mb-4 text-center">
                    <div>
                      <p className="text-sm text-gray-500">Sessions</p>
                      <p className="font-semibold text-gray-900">{tutor.sessions}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Response Rate</p>
                      <p className="font-semibold text-gray-900">{tutor.responseRate}%</p>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button 
                      onClick={() => navigate(`/tutor/${tutor.id}`)}
                      className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                    >
                      View Profile
                    </button>
                    <button 
                      onClick={() => navigate(`/booking/${tutor.id}`)}
                      className="flex-1 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition-colors font-medium"
                    >
                      Quick Book
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FindTutors;

