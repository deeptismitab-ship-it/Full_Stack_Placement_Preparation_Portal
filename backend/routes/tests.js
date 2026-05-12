const express = require('express');
const router = express.Router();
const {
  getTests, getTestById, createTest, updateTest, deleteTest,
  submitTest, getUserTestResults, getResultDetails,
  getTestLeaderboard, generateTest
} = require('../controllers/testController');
const { protect, admin } = require('../middleware/auth');

router.get('/', getTests);
router.get('/results', protect, getUserTestResults);
router.get('/results/:id', protect, getResultDetails);
router.get('/:id', getTestById);
router.get('/:id/leaderboard', getTestLeaderboard);
router.post('/generate', protect, admin, generateTest);
router.post('/:id/submit', protect, submitTest);
router.post('/', protect, admin, createTest);
router.put('/:id', protect, admin, updateTest);
router.delete('/:id', protect, admin, deleteTest);

module.exports = router;