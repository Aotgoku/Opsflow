const express = require('express');
const router = express.Router();
const { breakdownTask } = require('../controllers/aiController');
const { protect } = require('../middleware/authMiddleware');

// Only logged-in users can use AI
router.post('/breakdown', protect, breakdownTask);

module.exports = router;
