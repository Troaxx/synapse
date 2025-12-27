import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { MODULES } from '../constants/modules';

const GRADES = ['Z / Distinction  ', 'A', 'B+', 'B'];

const Register = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    admissionNumber: '',
    year: 'Year 1',
    course: '',
    isNotTutor: false, // NEW STATE
    tutorSubjects: [
      { moduleCode: '', name: '', grade: '' },
      { moduleCode: '', name: '', grade: '' },
      { moduleCode: '', name: '', grade: '' }
    ]
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;

    // If year changes, check if course is still valid
    if (e.target.name === 'year') {
      if (value !== 'Year 1' && formData.course === 'Diploma in Common ICT') {
        setFormData({
          ...formData,
          year: value,
          course: '' // Reset course if it was Common ICT and year changed to Y2/Y3
        });
        return;
      }
    }

    setFormData({
      ...formData,
      [e.target.name]: value
    });
  };

  const handleSubjectChange = (index, field, value) => {
    const updatedSubjects = [...formData.tutorSubjects];

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

    setFormData({
      ...formData,
      tutorSubjects: updatedSubjects
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const emailRegex = /^\d{7}[a-zA-Z]@student\.tp\.edu\.sg$/;
    if (!emailRegex.test(formData.email)) {
      setError('Email must follow format: Admission Number + @student.tp.edu.sg (e.g. 2404908B@student.tp.edu.sg)');
      return;
    }

    const adminNoRegex = /^\d{7}[A-Z]$/;
    if (!adminNoRegex.test(formData.admissionNumber)) {
      setError('Admission Number must follow format: 7 digits followed by a letter (e.g. 2404908B)');
      return;
    }

    // Check if Email matches Admission Number
    const emailPrefix = formData.email.split('@')[0].toUpperCase();
    if (emailPrefix !== formData.admissionNumber) {
      setError('Email must match your Admission Number');
      return;
    }

    if (!formData.isNotTutor) {
      const emptySubjects = formData.tutorSubjects.filter(s => !s.moduleCode || !s.name || !s.grade);
      if (emptySubjects.length > 0) {
        setError('Please select all 3 subjects and their grades');
        return;
      }

      const uniqueModules = new Set(formData.tutorSubjects.map(s => s.moduleCode));
      if (uniqueModules.size !== 3) {
        setError('Please select 3 different subjects');
        return;
      }
    }

    setLoading(true);

    const { confirmPassword, isNotTutor, ...registerData } = formData;
    const payload = { ...registerData, isTutor: !isNotTutor };

    const result = await register(payload);

    if (result.success) {
      navigate('/');
    } else {
      setError(result.message);
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl w-full space-y-8">
        <div>
          <img src="/synapse_logo.png" alt="Synapse Logo" className="mx-auto h-20 w-auto" />
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Create your account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Or{' '}
            <Link to="/login" className="font-medium text-blue-600 hover:text-blue-500">
              sign in to existing account
            </Link>
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="rounded-md bg-red-50 p-4">
              <div className="text-sm text-red-800">{error}</div>
            </div>
          )}
          <div className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Full Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                required
                className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="John Doe"
                value={formData.name}
                onChange={handleChange}
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="2404908B@student.tp.edu.sg"
                value={formData.email}
                onChange={handleChange}
              />
            </div>

            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                Phone Number
              </label>
              <input
                id="phone"
                name="phone"
                type="tel"
                className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="+65 9123 4567"
                value={formData.phone}
                onChange={handleChange}
              />
            </div>

            <div>
              <label htmlFor="admissionNumber" className="block text-sm font-medium text-gray-700">
                Admission Number
              </label>
              <input
                id="admissionNumber"
                name="admissionNumber"
                type="text"
                required
                className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm uppercase"
                placeholder="2404908B"
                value={formData.admissionNumber}
                onChange={(e) => handleChange({ ...e, target: { ...e.target, name: e.target.name, value: e.target.value.toUpperCase() } })}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="year" className="block text-sm font-medium text-gray-700">
                  Year of Study
                </label>
                <select
                  id="year"
                  name="year"
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 bg-white rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  value={formData.year}
                  onChange={handleChange}
                >
                  <option>Year 1</option>
                  <option>Year 2</option>
                  <option>Year 3</option>
                </select>
              </div>

              <div>
                <label htmlFor="course" className="block text-sm font-medium text-gray-700">
                  Course
                </label>
                <select
                  id="course"
                  name="course"
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 bg-white rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  value={formData.course}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select course</option>
                  {formData.year === 'Year 1' && (
                    <option value="Diploma in Common ICT">Diploma in Common ICT</option>
                  )}
                  <option value="Diploma in Information Technology">Diploma in Information Technology</option>
                  <option value="Diploma in Big Data & Analytics">Diploma in Big Data & Analytics</option>
                  <option value="Diploma in Cybersecurity and Digital Forensics">Diploma in Cybersecurity and Digital Forensics</option>
                  <option value="Diploma in Applied Artificial Intelligence">Diploma in Applied Artificial Intelligence</option>
                  <option value="Diploma in Immersive Media & Game Development">Diploma in Immersive Media & Game Development</option>
                </select>
              </div>
            </div>

            <div className="flex items-start bg-blue-50 p-4 rounded-md">
              <div className="flex items-center h-5">
                <input
                  id="isNotTutor"
                  name="isNotTutor"
                  type="checkbox"
                  checked={formData.isNotTutor}
                  onChange={handleChange}
                  className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                />
              </div>
              <div className="ml-3 text-sm">
                <label htmlFor="isNotTutor" className="font-medium text-gray-700">I am not interested in tutoring</label>
                <p className="text-gray-500">You can change this later in your profile settings.</p>
              </div>
            </div>

            {!formData.isNotTutor && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Subjects You Can Tutor (Select 3)
                </label>
                {formData.tutorSubjects.map((subject, index) => {
                  const availableModules = MODULES.filter(m => {
                    const usedModules = formData.tutorSubjects
                      .filter((_, i) => i !== index)
                      .map(s => s.moduleCode);
                    return !usedModules.includes(m.moduleCode) || m.moduleCode === subject.moduleCode;
                  });

                  return (
                    <div key={index} className="mb-4 p-4 border border-gray-300 rounded-lg bg-gray-50">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Subject {index + 1}
                      </label>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs text-gray-600 mb-1">Module</label>
                          <select
                            value={subject.moduleCode}
                            onChange={(e) => handleSubjectChange(index, 'moduleCode', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 bg-white rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
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
                          <label className="block text-xs text-gray-600 mb-1">Grade</label>
                          <select
                            value={subject.grade}
                            onChange={(e) => handleSubjectChange(index, 'grade', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 bg-white rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
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
            )}

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                required
                className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
              />
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                autoComplete="new-password"
                required
                className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="Confirm Password"
                value={formData.confirmPassword}
                onChange={handleChange}
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
              {loading ? 'Creating account...' : 'Create account'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;

