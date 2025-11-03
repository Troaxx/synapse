const Module = require('../models/Module');
const User = require('../models/User');

exports.getAllModules = async (req, res) => {
  try {
    const { school } = req.query;

    let query = {};
    if (school && school !== 'all') {
      query.school = school;
    }

    const modules = await Module.find(query)
      .populate('tutors', 'name tutorProfile.rating tutorProfile.totalSessions')
      .sort({ moduleCode: 1 });

    res.json(modules);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.getModuleById = async (req, res) => {
  try {
    const module = await Module.findById(req.params.id)
      .populate('tutors', 'name email tutorProfile');

    if (!module) {
      return res.status(404).json({ message: 'Module not found' });
    }

    res.json(module);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.createModule = async (req, res) => {
  try {
    const { moduleCode, name, school, diploma, description } = req.body;

    const existingModule = await Module.findOne({ moduleCode });
    if (existingModule) {
      return res.status(400).json({ message: 'Module already exists' });
    }

    const module = new Module({
      moduleCode,
      name,
      school,
      diploma,
      description
    });

    await module.save();

    res.status(201).json({ message: 'Module created successfully', module });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.addTutorToModule = async (req, res) => {
  try {
    const { tutorId } = req.body;

    const module = await Module.findById(req.params.id);
    if (!module) {
      return res.status(404).json({ message: 'Module not found' });
    }

    const tutor = await User.findById(tutorId);
    if (!tutor || !tutor.isTutor) {
      return res.status(404).json({ message: 'Tutor not found' });
    }

    if (!module.tutors.includes(tutorId)) {
      module.tutors.push(tutorId);
      await module.save();
    }

    res.json({ message: 'Tutor added to module successfully', module });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

