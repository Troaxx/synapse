const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const MODULES = require('../constants/modules');

const generateUserId = () => {
  return 'U' + Date.now().toString().slice(-4) + Math.random().toString(36).substr(2, 4).toUpperCase();
};

exports.register = async (req, res) => {
  try {
    const { email, password, name, phone, year, course, tutorSubjects } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    if (!tutorSubjects || !Array.isArray(tutorSubjects) || tutorSubjects.length !== 3) {
      return res.status(400).json({ message: 'Exactly 3 subjects are required' });
    }

    for (const subject of tutorSubjects) {
      if (!subject.moduleCode || !subject.name || !subject.grade) {
        return res.status(400).json({ message: 'Each subject must have moduleCode, name, and grade' });
      }

      const validModule = MODULES.find(m => m.moduleCode === subject.moduleCode && m.name === subject.name);
      if (!validModule) {
        return res.status(400).json({ message: `Invalid module: ${subject.moduleCode} - ${subject.name}` });
      }
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const userId = generateUserId();

    const user = new User({
      userId,
      email,
      password: hashedPassword,
      name,
      phone,
      year,
      course,
      isTutor: true,
      tutorProfile: {
        subjects: tutorSubjects.map(s => ({
          moduleCode: s.moduleCode,
          name: s.name,
          grade: s.grade,
          sessions: 0
        })),
        rating: 0,
        reviewCount: 0,
        totalSessions: 0,
        hoursTaught: 0,
        responseRate: 0,
        replyTime: '< 24 hours',
        badges: [],
        availability: []
      }
    });

    await user.save();

    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: {
        id: user._id,
        userId: user.userId,
        name: user.name,
        email: user.email,
        isTutor: user.isTutor
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        userId: user.userId,
        name: user.name,
        email: user.email,
        isTutor: user.isTutor
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const updates = req.body;
    delete updates.password;
    delete updates.email;

    const user = await User.findByIdAndUpdate(
      req.user.userId,
      updates,
      { new: true, runValidators: true }
    ).select('-password');

    res.json({ message: 'Profile updated successfully', user });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

