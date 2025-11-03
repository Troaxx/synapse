const express = require('express');
const router = express.Router();
const recommendationController = require('../controllers/recommendationController');
const auth = require('../middleware/auth');

router.get('/tutors', auth, recommendationController.getPersonalizedTutors);
router.get('/subjects', auth, recommendationController.getSubjectSuggestions);
router.get('/insights', auth, recommendationController.getRecommendationInsights);

module.exports = router;

