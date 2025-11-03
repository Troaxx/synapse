const Session = require('../models/Session');
const User = require('../models/User');

const generateSessionId = () => {
  return 'S' + Date.now().toString().slice(-4) + Math.random().toString(36).substr(2, 4).toUpperCase();
};

exports.createSession = async (req, res) => {
  try {
    const { tutorId, subject, moduleCode, topic, date, time, duration, location, notes } = req.body;

    const tutor = await User.findById(tutorId);
    if (!tutor || !tutor.isTutor) {
      return res.status(404).json({ message: 'Tutor not found' });
    }

    const sessionId = generateSessionId();

    const session = new Session({
      sessionId,
      student: req.user.userId,
      tutor: tutorId,
      subject,
      moduleCode,
      topic,
      date,
      time,
      duration,
      location,
      notes,
      createdBy: req.user.userId
    });

    await session.save();

    await session.populate('student', 'name email');
    await session.populate('tutor', 'name email');

    res.status(201).json({
      message: 'Session booking created successfully',
      session
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.getUserSessions = async (req, res) => {
  try {
    const { status, type } = req.query;

    let query = {
      $or: [
        { student: req.user.userId },
        { tutor: req.user.userId }
      ]
    };

    if (status) {
      query.status = status;
    }

    if (type === 'upcoming') {
      query.date = { $gte: new Date() };
      query.status = { $in: ['Pending', 'Confirmed'] };
    } else if (type === 'past') {
      query.status = 'Completed';
    }

    const sessions = await Session.find(query)
      .populate('student', 'name email profilePhoto')
      .populate('tutor', 'name email profilePhoto tutorProfile.rating')
      .sort({ date: type === 'past' ? -1 : 1 });

    res.json(sessions);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.getSessionById = async (req, res) => {
  try {
    const session = await Session.findById(req.params.id)
      .populate('student', 'name email phone profilePhoto')
      .populate('tutor', 'name email phone profilePhoto tutorProfile');

    if (!session) {
      return res.status(404).json({ message: 'Session not found' });
    }

    if (session.student._id.toString() !== req.user.userId && 
        session.tutor._id.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'Access denied' });
    }

    res.json(session);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.updateSessionStatus = async (req, res) => {
  try {
    const { status, sessionNotes } = req.body;

    const session = await Session.findById(req.params.id);
    if (!session) {
      return res.status(404).json({ message: 'Session not found' });
    }

    if (session.tutor.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'Only the tutor can update session status' });
    }

    session.status = status;
    if (sessionNotes) {
      session.sessionNotes = sessionNotes;
    }

    if (status === 'Completed') {
      const tutor = await User.findById(session.tutor);
      tutor.tutorProfile.totalSessions += 1;
      tutor.tutorProfile.hoursTaught += session.duration / 60;
      await tutor.save();
    }

    await session.save();

    res.json({ message: 'Session updated successfully', session });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.addReview = async (req, res) => {
  try {
    const { rating, comment } = req.body;

    const session = await Session.findById(req.params.id);
    if (!session) {
      return res.status(404).json({ message: 'Session not found' });
    }

    if (session.student.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'Only the student can review' });
    }

    if (session.status !== 'Completed') {
      return res.status(400).json({ message: 'Can only review completed sessions' });
    }

    session.review = {
      rating,
      comment,
      reviewedAt: new Date()
    };

    await session.save();

    const tutor = await User.findById(session.tutor);
    const allReviews = await Session.find({
      tutor: session.tutor,
      'review.rating': { $exists: true }
    });

    const totalRating = allReviews.reduce((sum, s) => sum + s.review.rating, 0);
    tutor.tutorProfile.rating = (totalRating / allReviews.length).toFixed(1);
    tutor.tutorProfile.reviewCount = allReviews.length;

    await tutor.save();

    res.json({ message: 'Review added successfully', session });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.cancelSession = async (req, res) => {
  try {
    const session = await Session.findById(req.params.id);
    if (!session) {
      return res.status(404).json({ message: 'Session not found' });
    }

    if (session.student.toString() !== req.user.userId && 
        session.tutor.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'Access denied' });
    }

    session.status = 'Cancelled';
    await session.save();

    res.json({ message: 'Session cancelled successfully', session });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

