const mongoose = require('mongoose');

const moduleSchema = new mongoose.Schema({
  moduleCode: {
    type: String,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true
  },
  school: {
    type: String,
    required: true
  },
  diploma: {
    type: String,
    required: true
  },
  year: {
    type: Number
  },
  semester: {
    type: Number
  },
  description: {
    type: String
  },
  tutors: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }]
}, {
  timestamps: true
});

module.exports = mongoose.model('Module', moduleSchema);

