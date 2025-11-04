import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { moduleAPI } from '../services/api';
import ModuleFilter from '../components/ModuleFilter';

const SubjectBrowse = () => {
  const navigate = useNavigate();
  const [selectedModuleCode, setSelectedModuleCode] = useState('');
  const [modules, setModules] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadModules();
  }, []);

  const loadModules = async () => {
    try {
      setLoading(true);
      const response = await moduleAPI.getAllModules();
      const modulesData = response.data || [];
      
      const formattedModules = modulesData.map(module => ({
        code: module.moduleCode,
        name: module.name,
        school: module.school,
        diploma: module.diploma,
        tutorCount: module.tutors?.length || 0,
        tutors: module.tutors?.slice(0, 3).map(tutor => ({
          id: tutor._id || tutor,
          name: tutor.name || 'Unknown',
          rating: tutor.tutorProfile?.rating || 0,
          sessions: tutor.tutorProfile?.totalSessions || 0
        })) || []
      }));
      
      setModules(formattedModules);
    } catch (error) {
      console.error('Error loading modules:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredModules = selectedModuleCode 
    ? modules.filter(m => m.code === selectedModuleCode)
    : modules;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Browse by Module</h1>
          <p className="text-gray-600">Find tutors for your specific TP modules</p>
        </div>

        <div className="mb-6">
          <ModuleFilter
            selectedModuleCode={selectedModuleCode}
            onModuleChange={setSelectedModuleCode}
            label="Filter by Module"
            className="w-full md:w-64"
          />
        </div>

        {loading ? (
          <div className="text-center py-12 text-gray-500">Loading modules...</div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {filteredModules.map(module => (
            <div key={module.code} className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow p-6">
              <div className="flex flex-col lg:flex-row justify-between gap-6">
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-lg font-mono font-semibold text-sm">
                          {module.code}
                        </span>
                        <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-lg text-sm">
                          {module.tutorCount} tutors available
                        </span>
                      </div>
                      <h2 className="text-2xl font-bold text-gray-900 mb-2">{module.name}</h2>
                      <p className="text-gray-600">{module.school} | {module.diploma}</p>
                    </div>
                  </div>

                  {module.tutors.length > 0 && (
                    <div className="mt-4">
                      <h3 className="text-sm font-semibold text-gray-700 mb-3">Featured Tutors</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                        {module.tutors.map(tutor => (
                          <div
                            key={tutor.id}
                            onClick={() => navigate(`/tutor/${tutor.id}`)}
                            className="border border-gray-200 rounded-lg p-3 hover:bg-gray-50 cursor-pointer transition-colors"
                          >
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-gray-300 rounded-full flex-shrink-0"></div>
                              <div className="flex-1 min-w-0">
                                <h4 className="font-semibold text-gray-900 truncate">{tutor.name}</h4>
                                <div className="flex items-center text-sm">
                                  <span className="text-yellow-500">★</span>
                                  <span className="ml-1 text-gray-700">{tutor.rating}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex lg:flex-col gap-2 lg:w-48">
                  <button
                    onClick={() => navigate('/find-tutors')}
                    className="flex-1 bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors font-semibold"
                  >
                    View All Tutors
                  </button>
                  <button
                    onClick={() => navigate('/find-tutors')}
                    className="flex-1 bg-gray-200 text-gray-800 py-3 px-4 rounded-lg hover:bg-gray-300 transition-colors font-semibold"
                  >
                    Find Tutor
                  </button>
                </div>
              </div>
            </div>
          ))}
          </div>
        )}

        {filteredModules.length === 0 && (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No modules found</h3>
            <p className="text-gray-600">Try selecting a different module</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SubjectBrowse;

