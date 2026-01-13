const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const MODULES = require('../constants/modules');

const generateUserId = () => {
  return 'U' + Date.now().toString().slice(-4) + Math.random().toString(36).substr(2, 4).toUpperCase();
};

exports.register = async (req, res) => {
  try {
    const { email, password, name, phone, year, course, tutorSubjects, admissionNumber, isTutor } = req.body;

    // Robustly handle isTutor boolean (in case it comes as string "false" or "true")
    const isTutorBool = isTutor === true || isTutor === 'true';

    console.log(`[Register] Attempting registration for ${email}. isTutor=${isTutor} (parsed: ${isTutorBool})`);

    const existingUser = await User.findOne({
      $or: [{ email }, { admissionNumber }]
    });

    if (existingUser) {
      return res.status(400).json({ message: 'User with this email or Admission Number already exists' });
    }

    const adminNoRegex = /^\d{7}[A-Z]$/;
    if (!adminNoRegex.test(admissionNumber)) {
      return res.status(400).json({ message: 'Invalid Admission Number format' });
    }

    const emailRegex = /^\d{7}[a-zA-Z]@student\.tp\.edu\.sg$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: 'Email must be a valid TP student email (e.g. 2404908B@student.tp.edu.sg)' });
    }

    const emailPrefix = email.split('@')[0].toUpperCase();
    if (emailPrefix !== admissionNumber) {
      return res.status(400).json({ message: 'Email must match Admission Number' });
    }

    if (isTutorBool) {
      if (!tutorSubjects || !Array.isArray(tutorSubjects) || tutorSubjects.length !== 3) {
        return res.status(400).json({ message: 'Exactly 3 subjects are required for tutors' });
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
      admissionNumber,
      isTutor: isTutorBool,
      tutorProfile: isTutorBool ? {
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
      } : undefined
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
        phone: user.phone,
        year: user.year,
        course: user.course,
        admissionNumber: user.admissionNumber,
        bio: user.bio,
        profilePhoto: user.profilePhoto,
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

    console.log('[Login] Attempting login for:', email);

    const user = await User.findOne({ email });
    if (!user) {
      console.log('[Login] User not found:', email);
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    console.log('[Login] User found:', user.email, '| isAdmin:', user.isAdmin);

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      console.log('[Login] Password mismatch for:', email);
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    console.log('[Login] Password valid, generating token...');

    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    console.log('[Login] Success for:', email);

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        userId: user.userId,
        name: user.name,
        email: user.email,
        phone: user.phone,
        year: user.year,
        course: user.course,
        admissionNumber: user.admissionNumber,
        bio: user.bio,
        profilePhoto: user.profilePhoto,
        isTutor: user.isTutor,
        isAdmin: user.isAdmin
      }
    });
  } catch (error) {
    console.error('[Login] Error:', error.message);
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

const crypto = require('crypto');
const nodemailer = require('nodemailer');

exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Generate token
    const token = crypto.randomBytes(20).toString('hex');

    // Set token and expiry on user (1 hour)
    user.resetPasswordToken = token;
    user.resetPasswordExpires = Date.now() + 3600000;
    await user.save();

    // Create transporter
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    const resetUrl = `http://localhost:5173/reset-password/${token}`;

    if (!process.env.EMAIL_USER) {
      console.log(`[DEV] Reset Password Link: ${resetUrl}`);
      return res.json({ message: 'Reset link generated (check server console)', token });
    }

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: user.email,
      subject: 'Password Reset Request',
      text: `You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n` +
        `Please click on the following link, or paste this into your browser to complete the process:\n\n` +
        `${resetUrl}\n\n` +
        `If you did not request this, please ignore this email and your password will remain unchanged.\n`
    };

    await transporter.sendMail(mailOptions);
    res.json({ message: 'Email sent' });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({ message: 'Password reset token is invalid or has expired' });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(password, 10);
    user.password = hashedPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;

    await user.save();

    res.json({ message: 'Password has been updated' });

  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.deleteAccount = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.user.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json({ message: 'Account deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

