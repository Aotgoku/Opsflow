const express = require('express');
const router = express.Router();
const { getMe, updateProfile, getTeamMembers } = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');

router.get('/me', protect, getMe);
router.put('/me', protect, updateProfile);
router.get('/team', protect, getTeamMembers);

module.exports = router;
