const express = require('express');
const router = express.Router();
const moduleController = require('../controllers/moduleController');
const auth = require('../middleware/auth');

router.get('/', moduleController.getAllModules);
router.get('/:id', moduleController.getModuleById);
router.post('/', auth, moduleController.createModule);
router.post('/:id/tutors', auth, moduleController.addTutorToModule);

module.exports = router;

