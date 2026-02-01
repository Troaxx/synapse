import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { MODULES } from '../constants/modules';

const GRADES = ['Z / Distinction', 'A', 'B+', 'B'];

const ProfileSettings = () => {
  const { user, updateProfile, loadUserProfile, deleteAccount } = useAuth();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    phone: '',
    year: 'Year 1',
    course: '',
    bio: '',
    profilePhoto: '',
    isTutor: false
  });

  const [tutorSubjects, setTutorSubjects] = useState([
    { moduleCode: '', name: '', grade: '' },
    { moduleCode: '', name: '', grade: '' },
    { moduleCode: '', name: '', grade: '' }
  ]);

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmNewPassword: ''
  });

  useEffect(() => {
    if (user) {
      setProfileData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        year: user.year || 'Year 1',
        course: user.course || '',
        bio: user.bio || '',
        profilePhoto: user.profilePhoto || '',
        isTutor: user.isTutor || false
      });

      if (user.tutorProfile?.subjects && user.tutorProfile.subjects.length > 0) {
        const loadedSubjects = [...user.tutorProfile.subjects];
        while (loadedSubjects.length < 3) {
          loadedSubjects.push({ moduleCode: '', name: '', grade: '' });
        }
        setTutorSubjects(loadedSubjects.slice(0, 3));
      } else {
        setTutorSubjects([
          { moduleCode: '', name: '', grade: '' },
          { moduleCode: '', name: '', grade: '' },
          { moduleCode: '', name: '', grade: '' }
        ]);
      }
    }
    document.title = 'Synapse - Settings';
  }, [user]);

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        setMessage({ type: 'error', text: 'File size must be less than 2MB' });
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileData(prev => ({
          ...prev,
          profilePhoto: reader.result
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleProfileChange = (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setProfileData({
      ...profileData,
      [e.target.name]: value
    });
  };

  const handlePasswordChange = (e) => {
    setPasswordData({
      ...passwordData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubjectChange = (index, field, value) => {
    const updatedSubjects = [...tutorSubjects];
    if (field === 'moduleCode') {
      const selectedModule = MODULES.find(m => m.moduleCode === value);
      if (selectedModule) {
        updatedSubjects[index] = {
          moduleCode: selectedModule.moduleCode,
          name: selectedModule.name,
          grade: updatedSubjects[index].grade
        };
      }
    } else {
      updatedSubjects[index][field] = value;
    }
    setTutorSubjects(updatedSubjects);
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    if (profileData.isTutor) {
      const filledSubjects = tutorSubjects.filter(s => s.moduleCode && s.name && s.grade);
      if (filledSubjects.length !== 3) {
        setMessage({ type: 'error', text: 'Please select exactly 3 subjects and their grades to be a tutor.' });
        setLoading(false);
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
      }
      const uniqueModules = new Set(filledSubjects.map(s => s.moduleCode));
      if (uniqueModules.size !== 3) {
        setMessage({ type: 'error', text: 'Please select 3 different subjects.' });
        setLoading(false);
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
      }
    }

    try {
      if (passwordData.newPassword || passwordData.currentPassword || passwordData.confirmNewPassword) {
        if (!passwordData.currentPassword) {
           setMessage({ type: 'error', text: 'Current password is required to set a new password.' });
           setLoading(false);
           return;
        }
        if (!passwordData.newPassword) {
           setMessage({ type: 'error', text: 'New password is required.' });
           setLoading(false);
           return;
        }
        if (passwordData.newPassword !== passwordData.confirmNewPassword) {
           setMessage({ type: 'error', text: 'New passwords do not match.' });
           setLoading(false);
           return;
        }
      }

      const updatePayload = {
        ...profileData,
        ...passwordData,
        tutorProfile: {
          ...(user.tutorProfile || {}),
          subjects: profileData.isTutor ? tutorSubjects : []
        }
      };

      const result = await updateProfile(updatePayload);
      if (result.success) {
        setMessage({ type: 'success', text: 'Profile updated successfully!' });
        setPasswordData({ currentPassword: '', newPassword: '', confirmNewPassword: '' });
        window.scrollTo({ top: 0, behavior: 'smooth' });
        await loadUserProfile();
      } else {
        console.error('Update failed:', result.message);
        setMessage({ type: 'error', text: result.message || 'Failed to update profile' });
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'An error occurred while updating profile' });
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    setLoading(true);
    const result = await deleteAccount();
    if (!result.success) {
      setMessage({ type: 'error', text: result.message || 'Failed to delete account' });
      setLoading(false);
      setShowDeleteConfirm(false);
    }
    // If success, AuthContext handles logout/redirect (or we should redirect here?)
    // AuthContext `deleteAccount` calls `logout` which clears state. 
    // Usually ProfileSettings is protected, so clearing user state triggers redirect to login via ProtectedRoute.
  };

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Profile Settings</h1>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow p-4 sticky top-6">
              <nav className="space-y-2">
                <button
                  onClick={() => scrollToSection('profile-section')}
                  className="w-full text-left px-4 py-3 rounded-lg font-medium text-gray-700 hover:bg-gray-100 transition-colors"
                >
                  Profile Settings
                </button>

                <button
                  onClick={() => scrollToSection('account-section')}
                  className="w-full text-left px-4 py-3 rounded-lg font-medium text-gray-700 hover:bg-gray-100 transition-colors"
                >
                  Account Settings
                </button>
              </nav>
            </div>
          </div>

          <div className="lg:col-span-3 space-y-8">
            {/* Top message removed */}

            <div id="settings-form-container">
              <form id="settings-form" onSubmit={handleSaveProfile}>
                <div id="profile-section" className="bg-white rounded-lg shadow p-6 scroll-mt-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Profile Settings</h2>
                <div className="mb-6">
                  <div className="flex items-center gap-6 mb-6">
                    <div className="w-24 h-24 bg-gray-300 rounded-full overflow-hidden">
                      {profileData.profilePhoto ? (
                        <img
                          src={profileData.profilePhoto}
                          alt="Profile"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-500 text-2xl font-bold">
                          {profileData.name.charAt(0)}
                        </div>
                      )}
                    </div>
                    <div>
                      <input
                        type="file"
                        id="photo-upload"
                        accept="image/*"
                        className="hidden"
                        onChange={handlePhotoChange}
                      />
                      <button
                        type="button"
                        onClick={() => document.getElementById('photo-upload').click()}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                      >
                        Change Photo
                      </button>
                      <p className="text-sm text-gray-500 mt-2">JPG, PNG or GIF. Max size 2MB.</p>
                      {message.type === 'error' && message.text.includes('File') && (
                        <p className="text-sm text-red-600 mt-1">{message.text}</p>
                      )}
                    </div>
                  </div>
                  
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Full Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={profileData.name}
                      onChange={handleProfileChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={profileData.email}
                      disabled
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-500 cursor-not-allowed"
                    />
                    <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={profileData.phone}
                      onChange={handleProfileChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Year of Study
                    </label>
                    <select
                      name="year"
                      value={profileData.year}
                      onChange={handleProfileChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="Year 1">Year 1</option>
                      <option value="Year 2">Year 2</option>
                      <option value="Year 3">Year 3</option>
                    </select>
                  </div>
                </div>

                <div className="mb-6">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Course
                  </label>
                  <input
                    type="text"
                    name="course"
                    value={profileData.course}
                    onChange={handleProfileChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div className="mb-6">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Bio
                  </label>
                  <textarea
                    name="bio"
                    value={profileData.bio}
                    onChange={handleProfileChange}
                    rows="4"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  ></textarea>
                </div>

                {/* Tutor Settings */}
                <div className="bg-blue-50 rounded-lg p-6 mb-6 border border-blue-100">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-bold text-gray-900">Tutor Availability</h3>
                      <p className="text-sm text-gray-600">Toggle this to allow students to book you as a tutor.</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        name="isTutor"
                        checked={profileData.isTutor}
                        onChange={handleProfileChange}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus: ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>

                  {profileData.isTutor && (
                    <div className="animate-fadeIn">
                      <div className="h-px bg-blue-200 my-4"></div>
                      <label className="block text-sm font-bold text-gray-900 mb-3">
                        Subjects You Teach (Select 3)
                      </label>
                      <div className="space-y-4">
                        {tutorSubjects.map((subject, index) => {
                          const availableModules = MODULES.filter(m => {
                            const usedModules = tutorSubjects
                              .filter((_, i) => i !== index)
                              .map(s => s.moduleCode);
                            return !usedModules.includes(m.moduleCode) || m.moduleCode === subject.moduleCode;
                          });

                          return (
                            <div key={index} className="p-4 bg-white rounded border border-blue-200 shadow-sm">
                              <div className="flex justify-between items-center mb-2">
                                <span className="text-xs font-semibold text-blue-600 uppercase tracking-wide">Subject {index + 1}</span>
                              </div>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                <div>
                                  <label className="block text-xs text-gray-500 mb-1">Module</label>
                                  <select
                                    value={subject.moduleCode}
                                    onChange={(e) => handleSubjectChange(index, 'moduleCode', e.target.value)}
                                    className="w-full px-3 py-2 border border-blue-300 rounded-md text-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                                    required
                                  >
                                    <option value="">Select module</option>
                                    {availableModules.map(module => (
                                      <option key={module.moduleCode} value={module.moduleCode}>
                                        {module.moduleCode} - {module.name}
                                      </option>
                                    ))}
                                  </select>
                                </div>
                                <div>
                                  <label className="block text-xs text-gray-500 mb-1">Grade Achieved</label>
                                  <select
                                    value={subject.grade}
                                    onChange={(e) => handleSubjectChange(index, 'grade', e.target.value)}
                                    className="w-full px-3 py-2 border border-blue-300 rounded-md text-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                                    required
                                  >
                                    <option value="">Select grade</option>
                                    {GRADES.map(grade => (
                                      <option key={grade} value={grade}>{grade}</option>
                                    ))}
                                  </select>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>


                {/* Middle message removed */}
                </div>



            <div id="account-section" className="bg-white rounded-lg shadow p-6 scroll-mt-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Account Settings</h2>

              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Change Password</h3>
                <div className="space-y-4 mb-6">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Current Password
                      </label>
                      <input
                        type="password"
                        name="currentPassword"
                        value={passwordData.currentPassword}
                        onChange={handlePasswordChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        New Password
                      </label>
                      <input
                        type="password"
                        name="newPassword"
                        value={passwordData.newPassword}
                        onChange={handlePasswordChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Confirm New Password
                      </label>
                      <input
                        type="password"
                        name="confirmNewPassword"
                        value={passwordData.confirmNewPassword}
                        onChange={handlePasswordChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>


              </div>

              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Privacy Settings</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900">Profile Visibility</p>
                      <p className="text-sm text-gray-600">Make your profile visible to other students</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" defaultChecked className="sr-only peer" />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>

                </div>
              </div>

              <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                <h3 className="text-xl font-bold text-red-900 mb-2">Danger Zone</h3>
                <p className="text-red-700 mb-4">
                  Once you delete your account, there is no going back. Please be certain.
                </p>
                {!showDeleteConfirm ? (
                  <button
                    onClick={() => setShowDeleteConfirm(true)}
                    className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-colors font-semibold"
                  >
                    Delete Account
                  </button>
                ) : (
                  <div className="bg-white p-4 rounded-lg border border-red-200 mt-2">
                    <p className="font-semibold text-red-800 mb-3">Are you sure? This action cannot be undone.</p>
                    <div className="flex gap-4">
                      <button
                        onClick={handleDeleteAccount}
                        disabled={loading}
                        className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors font-semibold text-sm"
                      >
                        {loading ? 'Deleting...' : 'Yes, Delete My Account'}
                      </button>
                      <button
                        onClick={() => setShowDeleteConfirm(false)}
                        disabled={loading}
                        className="bg-gray-200 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors font-semibold text-sm"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Singular Save Button */}
            <div className="sticky bottom-6 bg-white rounded-lg shadow p-4 flex justify-between items-center border-t border-gray-100 z-10">
              <div className="text-sm text-gray-500">
                {message.text && (
                  <span className={`${message.type === 'success' ? 'text-green-600' : 'text-red-600'}`}>
                    {message.text}
                  </span>
                )}
              </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors font-semibold shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileSettings;

