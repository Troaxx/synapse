import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const BookingForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  
  const [formData, setFormData] = useState({
    subject: '',
    topic: '',
    date: '',
    time: '',
    duration: '60',
    location: '',
    notes: ''
  });

  const tutor = {
    name: "Sarah Chen",
    subject: "Python",
    image: "/assets/tutor1.png"
  };

  const subjects = [
    "CIT2C20 - Full Stack Web Dev",
    "CIT2C10 - Data Structures",
    "CIT2C30 - Database Systems",
    "CIT2C40 - Object-Oriented Programming"
  ];

  const timeSlots = [
    "9:00 AM", "10:00 AM", "11:00 AM", "12:00 PM",
    "1:00 PM", "2:00 PM", "3:00 PM", "4:00 PM", "5:00 PM", "6:00 PM"
  ];

  const locations = [
    "Library Level 5",
    "Library Level 3",
    "Online - Zoom",
    "Online - Teams",
    "Study Room 3A",
    "Study Room 4B",
    "Cafeteria Study Area"
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate('/bookings');
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const calculateEndTime = () => {
    if (!formData.time || !formData.duration) return '';
    const [time, period] = formData.time.split(' ');
    const [hours, minutes] = time.split(':');
    let hour = parseInt(hours);
    if (period === 'PM' && hour !== 12) hour += 12;
    if (period === 'AM' && hour === 12) hour = 0;
    
    const durationMinutes = parseInt(formData.duration);
    const endMinutes = hour * 60 + parseInt(minutes) + durationMinutes;
    const endHour = Math.floor(endMinutes / 60) % 24;
    const endMin = endMinutes % 60;
    const endPeriod = endHour >= 12 ? 'PM' : 'AM';
    const displayHour = endHour > 12 ? endHour - 12 : endHour === 0 ? 12 : endHour;
    
    return `${displayHour}:${endMin.toString().padStart(2, '0')} ${endPeriod}`;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <button 
          onClick={() => navigate(`/tutor/${id}`)}
          className="flex items-center text-blue-600 hover:text-blue-700 mb-6"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Profile
        </button>

        <h1 className="text-3xl font-bold text-gray-900 mb-8">Book a Session</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow p-6 mb-6">
              <div className="flex items-center gap-4 pb-6 border-b border-gray-200">
                <div className="w-16 h-16 bg-gray-300 rounded-full"></div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">{tutor.name}</h2>
                  <p className="text-gray-600">{tutor.subject}</p>
                </div>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Session Details</h2>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Subject / Module
                  </label>
                  <select
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Select a subject</option>
                    {subjects.map((subject, index) => (
                      <option key={index} value={subject}>{subject}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Topic / What do you need help with?
                  </label>
                  <textarea
                    name="topic"
                    value={formData.topic}
                    onChange={handleChange}
                    required
                    rows="4"
                    placeholder="E.g., Need help with React hooks and state management"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  ></textarea>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Date
                    </label>
                    <input
                      type="date"
                      name="date"
                      value={formData.date}
                      onChange={handleChange}
                      required
                      min={new Date().toISOString().split('T')[0]}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Time
                    </label>
                    <select
                      name="time"
                      value={formData.time}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">Select time</option>
                      {timeSlots.map((slot, index) => (
                        <option key={index} value={slot}>{slot}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Duration
                  </label>
                  <select
                    name="duration"
                    value={formData.duration}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="60">60 minutes</option>
                    <option value="90">90 minutes</option>
                    <option value="120">120 minutes</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Location
                  </label>
                  <select
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Select location</option>
                    {locations.map((location, index) => (
                      <option key={index} value={location}>{location}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Additional Notes (Optional)
                  </label>
                  <textarea
                    name="notes"
                    value={formData.notes}
                    onChange={handleChange}
                    rows="3"
                    placeholder="Any additional information for the tutor"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  ></textarea>
                </div>
              </div>

              <div className="flex gap-4 mt-8">
                <button
                  type="button"
                  onClick={() => navigate(`/tutor/${id}`)}
                  className="flex-1 bg-gray-200 text-gray-800 py-3 rounded-lg hover:bg-gray-300 transition-colors font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors font-semibold"
                >
                  Confirm Booking
                </button>
              </div>
            </form>
          </div>

          <div>
            <div className="bg-white rounded-lg shadow p-6 sticky top-4">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Booking Summary</h2>
              
              {formData.date && (
                <div className="mb-4 pb-4 border-b border-gray-200">
                  <p className="text-sm text-gray-600 mb-1">Date</p>
                  <p className="font-semibold text-gray-900">
                    {new Date(formData.date + 'T00:00:00').toLocaleDateString('en-US', { 
                      weekday: 'long', 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}
                  </p>
                </div>
              )}

              {formData.time && (
                <div className="mb-4 pb-4 border-b border-gray-200">
                  <p className="text-sm text-gray-600 mb-1">Time</p>
                  <p className="font-semibold text-gray-900">{formData.time}</p>
                </div>
              )}

              {formData.duration && (
                <div className="mb-4 pb-4 border-b border-gray-200">
                  <p className="text-sm text-gray-600 mb-1">Duration</p>
                  <p className="font-semibold text-gray-900">{formData.duration} minutes</p>
                </div>
              )}

              {formData.time && formData.duration && (
                <div className="mb-4 pb-4 border-b border-gray-200">
                  <p className="text-sm text-gray-600 mb-1">Estimated End Time</p>
                  <p className="font-semibold text-gray-900">{calculateEndTime()}</p>
                </div>
              )}

              {formData.location && (
                <div className="mb-4">
                  <p className="text-sm text-gray-600 mb-1">Location</p>
                  <p className="font-semibold text-gray-900">{formData.location}</p>
                </div>
              )}

              {!formData.date && !formData.time && (
                <p className="text-gray-500 text-center py-8">
                  Fill in the form to see your booking summary
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingForm;

