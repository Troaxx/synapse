const express = require('express');
const router = express.Router();
const tutorController = require('../controllers/tutorController');
const auth = require('../middleware/auth');

router.get('/', tutorController.getAllTutors);
router.get('/recommended', auth, tutorController.getRecommendedTutors);
router.get('/:id', tutorController.getTutorById);
router.put('/profile', auth, tutorController.updateTutorProfile);

module.exports = router;

