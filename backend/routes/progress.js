const express = require('express');
const router = express.Router();
const {
  getUserProgress, updateProgress, getOverallStats, getWeeklyActivity,
  updateStreak, getCategoryProgress
} = require('../controllers/progressController');
const { protect } = require('../middleware/auth');

router.get('/', protect, getUserProgress);
router.post('/', protect, updateProgress);
router.get('/stats', protect, getOverallStats);
router.get('/weekly', protect, getWeeklyActivity);
router.post('/streak', protect, updateStreak);
router.get('/:category', protect, getCategoryProgress);

module.exports = router;