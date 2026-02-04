import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { sessionAPI } from '../services/api';

const LeaveReview = () => {
    const { sessionId } = useParams();
    const navigate = useNavigate();
    const [session, setSession] = useState(null);
    const [loading, setLoading] = useState(true);
    const [rating, setRating] = useState(0);
    const [hoverRating, setHoverRating] = useState(0);
    const [comment, setComment] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        loadSession();
    }, [sessionId]);

    const loadSession = async () => {
        try {
            const res = await sessionAPI.getSessionById(sessionId);
            setSession(res.data);
        } catch (err) {
            console.error(err);
            setError('Failed to load session details.');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (rating === 0) {
            alert('Please select a rating.');
            return;
        }

        setSubmitting(true);
        try {
            await sessionAPI.addReview(sessionId, { rating, comment });
            navigate('/bookings?tab=past');
        } catch (err) {
            console.error(err);
            alert('Failed to submit review');
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) return <div className="flex justify-center items-center h-screen bg-gray-50">Loading...</div>;
    if (!session) return <div className="p-8 text-center">Session not found</div>;

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 flex justify-center items-center">
            <div className="max-w-xl w-full bg-white rounded-2xl shadow-xl overflow-hidden">
                <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-8 text-white text-center">
                    <h2 className="text-3xl font-bold mb-2">How was your session?</h2>
                    <p className="text-blue-100">Review your learning experience with {session.tutor?.name || 'your tutor'}</p>
                </div>

                <div className="p-8">
                    <div className="mb-8 p-4 bg-gray-50 rounded-lg border border-gray-100">
                        <h3 className="font-semibold text-gray-900 mb-1">{session.subject}</h3>
                        {session.topic && <p className="text-sm text-gray-600 mb-1">Topic: {session.topic}</p>}
                        <p className="text-xs text-gray-500">{session.duration} min</p>
                    </div>

                    <form onSubmit={handleSubmit}>
                        <div className="mb-8 text-center">
                            <label className="block text-sm font-medium text-gray-700 mb-4">Rate your experience</label>
                            <div className="flex justify-center gap-2">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <button
                                        key={star}
                                        type="button"
                                        className="focus:outline-none transition-transform hover:scale-110"
                                        onMouseEnter={() => setHoverRating(star)}
                                        onMouseLeave={() => setHoverRating(0)}
                                        onClick={() => setRating(star)}
                                    >
                                        <svg
                                            className={`w-10 h-10 ${star <= (hoverRating || rating)
                                                    ? 'text-yellow-400 fill-current'
                                                    : 'text-gray-300 fill-current'
                                                }`}
                                            viewBox="0 0 24 24"
                                        >
                                            <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                                        </svg>
                                    </button>
                                ))}
                            </div>
                            <p className="mt-2 text-sm text-gray-500 font-medium">
                                {rating === 1 && 'Poor'}
                                {rating === 2 && 'Fair'}
                                {rating === 3 && 'Good'}
                                {rating === 4 && 'Very Good'}
                                {rating === 5 && 'Excellent!'}
                            </p>
                        </div>

                        <div className="mb-6">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Additional Comments (Optional)
                            </label>
                            <textarea
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                                rows="4"
                                placeholder="Share more details about your session..."
                            ></textarea>
                        </div>

                        <div className="flex gap-3">
                            <button
                                type="button"
                                onClick={() => navigate('/bookings?tab=past')}
                                className="flex-1 px-4 py-3 border border-gray-300 shadow-sm text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={submitting}
                                className="flex-1 px-4 py-3 border border-transparent shadow-sm text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-70 disabled:cursor-not-allowed"
                            >
                                {submitting ? 'Submitting...' : 'Submit Review'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default LeaveReview;
