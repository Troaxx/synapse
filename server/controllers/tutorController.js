const User = require('../models/User');
const Session = require('../models/Session');
const Module = require('../models/Module');

exports.getAllTutors = async (req, res) => {
  try {
    const { subject, rating, availability, location, moduleCode, sortBy } = req.query;

    console.log('getAllTutors query params:', { subject, rating, availability, location, moduleCode, sortBy });

    let query = { isTutor: true };

    if (subject) {
      query['tutorProfile.subjects.name'] = { $regex: subject, $options: 'i' };
    }

    if (rating) {
      query['tutorProfile.rating'] = { $gte: parseFloat(rating) };
    }

    if (moduleCode) {
      const module = await Module.findOne({ moduleCode });
      console.log('Found module:', module ? module.name : 'not found');
      
      if (module) {
        const tutorIds = module.tutors || [];
        
        console.log('Module tutors array length:', tutorIds.length);
        console.log('Module name:', module.name);
        
        if (tutorIds.length > 0) {
          query.$or = [
            { _id: { $in: tutorIds } },
            { 'tutorProfile.subjects.moduleCode': moduleCode },
            { 'tutorProfile.subjects.name': { $regex: module.name, $options: 'i' } }
          ];
        } else {
          query.$or = [
            { 'tutorProfile.subjects.moduleCode': moduleCode },
            { 'tutorProfile.subjects.name': { $regex: module.name, $options: 'i' } }
          ];
        }
      } else {
        query.$or = [
          { 'tutorProfile.subjects.moduleCode': moduleCode },
          { 'tutorProfile.subjects.name': { $regex: moduleCode, $options: 'i' } }
        ];
      }
    }

    console.log('Final query:', JSON.stringify(query, null, 2));

    let sortOptions = {};
    if (sortBy === 'rating') {
      sortOptions = { 'tutorProfile.rating': -1 };
    } else if (sortBy === 'mostBooked') {
      sortOptions = { 'tutorProfile.totalSessions': -1 };
    }

    const tutors = await User.find(query)
      .select('-password')
      .sort(sortOptions);

    console.log('Found tutors:', tutors.length);
    res.json(tutors);
  } catch (error) {
    console.error('Error in getAllTutors:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.getTutorById = async (req, res) => {
  try {
    const tutor = await User.findById(req.params.id).select('-password');
    
    if (!tutor || !tutor.isTutor) {
      return res.status(404).json({ message: 'Tutor not found' });
    }

    const reviews = await Session.find({
      tutor: req.params.id,
      status: 'Completed',
      'review.rating': { $exists: true }
    })
      .populate('student', 'name')
      .select('review createdAt')
      .sort({ 'review.reviewedAt': -1 })
      .limit(10);

    res.json({ tutor, reviews });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.getRecommendedTutors = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    
    let query = { isTutor: true };
    
    if (user.subjectsNeedHelp && user.subjectsNeedHelp.length > 0) {
      query['tutorProfile.subjects.name'] = { 
        $in: user.subjectsNeedHelp.map(s => new RegExp(s, 'i'))
      };
    }

    const tutors = await User.find(query)
      .select('-password')
      .sort({ 'tutorProfile.rating': -1 })
      .limit(3);

    res.json(tutors);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.updateTutorProfile = async (req, res) => {
  try {
    const { subjects, availability, bio } = req.body;

    const updates = {
      isTutor: true,
      bio,
      'tutorProfile.subjects': subjects,
      'tutorProfile.availability': availability
    };

    const user = await User.findByIdAndUpdate(
      req.user.userId,
      updates,
      { new: true, runValidators: true }
    ).select('-password');

    res.json({ message: 'Tutor profile updated successfully', user });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

