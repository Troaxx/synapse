const aiRecommendationService = require('../services/aiRecommendationService');

exports.getPersonalizedTutors = async (req, res) => {
  try {
    const recommendations = await aiRecommendationService.getPersonalizedRecommendations(
      req.user.userId
    );

    res.json({
      success: true,
      data: recommendations
    });
  } catch (error) {
    console.error('Error getting personalized recommendations:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get recommendations',
      error: error.message
    });
  }
};

exports.getSubjectSuggestions = async (req, res) => {
  try {
    const suggestions = await aiRecommendationService.getSubjectRecommendations(
      req.user.userId
    );

    res.json({
      success: true,
      data: suggestions
    });
  } catch (error) {
    console.error('Error getting subject suggestions:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get subject suggestions',
      error: error.message
    });
  }
};

exports.getRecommendationInsights = async (req, res) => {
  try {
    const Session = require('../models/Session');
    const User = require('../models/User');

    const user = await User.findById(req.user.userId);
    const recentSessions = await Session.find({
      student: req.user.userId,
      status: 'Completed'
    })
      .populate('tutor', 'name')
      .sort({ date: -1 })
      .limit(10);

    const subjectFrequency = {};
    recentSessions.forEach(session => {
      subjectFrequency[session.subject] = (subjectFrequency[session.subject] || 0) + 1;
    });

    const insights = {
      totalSessions: recentSessions.length,
      mostStudiedSubject: Object.entries(subjectFrequency)
        .sort((a, b) => b[1] - a[1])[0]?.[0] || 'None',
      recentSubjects: [...new Set(recentSessions.slice(0, 5).map(s => s.subject))],
      favoriteTime: recentSessions[0]?.time || 'Not available',
      learningStreak: recentSessions.length > 0 ? 'Active learner' : 'Getting started'
    };

    res.json({
      success: true,
      data: insights
    });
  } catch (error) {
    console.error('Error getting recommendation insights:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get insights',
      error: error.message
    });
  }
};

