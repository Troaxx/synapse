const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    unique: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  phone: {
    type: String
  },
  year: {
    type: String,
    enum: ['Year 1', 'Year 2', 'Year 3']
  },
  course: {
    type: String
  },
  bio: {
    type: String
  },
  profilePhoto: {
    type: String,
    default: ''
  },
  role: {
    type: String,
    enum: ['student', 'tutor', 'admin'],
    default: 'student'
  },
  isTutor: {
    type: Boolean,
    default: false
  },
  tutorProfile: {
    rating: {
      type: Number,
      default: 0
    },
    reviewCount: {
      type: Number,
      default: 0
    },
    totalSessions: {
      type: Number,
      default: 0
    },
    hoursTaught: {
      type: Number,
      default: 0
    },
    responseRate: {
      type: Number,
      default: 0
    },
    replyTime: {
      type: String,
      default: '< 24 hours'
    },
    subjects: [{
      name: String,
      grade: String,
      sessions: {
        type: Number,
        default: 0
      }
    }],
    badges: [{
      type: String,
      enum: ['Top Tutor', 'Subject Expert', 'Quick Responder', 'Highly Rated']
    }],
    availability: [{
      day: {
        type: String,
        enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
      },
      slots: [String]
    }]
  },
  subjectsNeedHelp: [{
    type: String
  }],
  subjectsCanTeach: [{
    type: String
  }],
  notifications: {
    emailBookings: {
      type: Boolean,
      default: true
    },
    emailMessages: {
      type: Boolean,
      default: true
    },
    emailReminders: {
      type: Boolean,
      default: true
    },
    pushBookings: {
      type: Boolean,
      default: true
    },
    pushMessages: {
      type: Boolean,
      default: false
    },
    pushReminders: {
      type: Boolean,
      default: true
    }
  },
  memberSince: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('User', userSchema);

