const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const auth = require('../middleware/auth');
const adminAuth = require('../middleware/adminAuth');

// All routes require auth AND admin
router.use(auth);
router.use(adminAuth);

router.get('/reports', adminController.getAllReports);
router.put('/reports/:reportId/dismiss', adminController.dismissReport);
router.put('/reports/:reportId/resolve', adminController.resolveReport);

router.get('/users', adminController.getAllUsers);
router.put('/users/:userId', adminController.updateUserProfile);

module.exports = router;
