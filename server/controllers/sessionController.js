const Session = require('../models/Session');
const User = require('../models/User');
const Notification = require('../models/Notification');
const Report = require('../models/Report');

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

    // Notification for Tutor
    await Notification.create({
      user: tutorId,
      title: 'New Booking Request',
      message: `${session.student.name} requested a session for ${subject}`,
      type: 'info'
    });

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

    // Check for reports for each session
    const sessionsWithReportStatus = await Promise.all(sessions.map(async (session) => {
      const report = await Report.findOne({ session: session._id, reporter: req.user.userId });
      const sessionObj = session.toObject();
      if (report) {
        sessionObj.reportStatus = report.status;
        sessionObj.reported = true;
      }
      return sessionObj;
    }));

    res.json(sessionsWithReportStatus);
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

    const session = await Session.findById(req.params.id)
      .populate('student', 'name')
      .populate('tutor', 'name');

    if (!session) {
      return res.status(404).json({ message: 'Session not found' });
    }

    // Allow student to cancel if pending or confirmed
    if (status === 'Cancelled' && session.student._id.toString() === req.user.userId) {
      // authorized
    } else if (session.tutor._id.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'Only the tutor can update session status' });
    }

    session.status = status;
    if (sessionNotes) {
      session.sessionNotes = sessionNotes;
    }

    if (status === 'Completed') {
      const tutor = await User.findById(session.tutor._id); // Access _id because populated
      if (tutor) {
        tutor.tutorProfile.totalSessions += 1;
        tutor.tutorProfile.hoursTaught += session.duration / 60;
        await tutor.save();
      }

      // Notify Student
      await Notification.create({
        user: session.student._id,
        title: 'Session Completed',
        message: `${session.subject} session marked as completed.`,
        type: 'success'
      });
    } else if (status === 'Confirmed') {
      // Notify Student
      await Notification.create({
        user: session.student._id,
        title: 'Request Accepted',
        message: `Your session for ${session.subject} has been accepted.`,
        type: 'success'
      });
    } else if (status === 'Cancelled') {
      // Notify the OTHER party
      const notifyUserId = session.student._id.toString() === req.user.userId
        ? session.tutor._id
        : session.student._id;

      await Notification.create({
        user: notifyUserId,
        title: 'Session Cancelled',
        message: `Your session for ${session.subject} has been cancelled.`,
        type: 'warning'
      });
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

    if (!tutor.tutorProfile) {
      tutor.tutorProfile = {
        rating: 0,
        reviewCount: 0,
        totalSessions: 0,
        hoursTaught: 0,
        responseRate: 0,
        subjects: [],
        badges: [],
        availability: []
      };
    }

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
    const session = await Session.findById(req.params.id)
      .populate('student', 'name')
      .populate('tutor', 'name');

    if (!session) {
      return res.status(404).json({ message: 'Session not found' });
    }

    if (session.student._id.toString() !== req.user.userId &&
      session.tutor._id.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'Access denied' });
    }

    session.status = 'Cancelled';
    await session.save();

    // Notify the OTHER party
    const notifyUserId = session.student._id.toString() === req.user.userId
      ? session.tutor._id
      : session.student._id;

    await Notification.create({
      user: notifyUserId,
      title: 'Session Cancelled',
      message: `Your session for ${session.subject} has been cancelled.`,
      type: 'warning'
    });

    res.json({ message: 'Session cancelled successfully', session });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

