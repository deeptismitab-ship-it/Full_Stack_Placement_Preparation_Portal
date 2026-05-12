const express = require('express');
const router = express.Router();
const {
  getQuestions, getQuestionById, createQuestion, updateQuestion,
  deleteQuestion, getQuestionsByCategory, getRandomQuestions,
  getQuestionStats, bulkCreateQuestions
} = require('../controllers/questionController');
const { protect, admin } = require('../middleware/auth');

router.get('/', getQuestions);
router.get('/random', getRandomQuestions);
router.get('/stats', protect, getQuestionStats);
router.get('/category/:category', getQuestionsByCategory);
router.get('/:id', getQuestionById);
router.post('/', protect, admin, createQuestion);
router.post('/bulk', protect, admin, bulkCreateQuestions);
router.put('/:id', protect, admin, updateQuestion);
router.delete('/:id', protect, admin, deleteQuestion);

module.exports = router;