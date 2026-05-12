const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const { Op, fn, col } = require('sequelize');
const Test = sequelize.define('Test', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  title: { type: DataTypes.STRING, allowNull: false },
  description: { type: DataTypes.STRING, defaultValue: '' },
  category: { type: DataTypes.ENUM('aptitude', 'technical', 'coding', 'full-length', 'custom'), allowNull: false },
  subcategory: { type: DataTypes.STRING, defaultValue: '' },
  duration: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 30 },
  totalQuestions: { type: DataTypes.INTEGER, defaultValue: 0 },
  totalMarks: { type: DataTypes.INTEGER, defaultValue: 0 },
  passingMarks: { type: DataTypes.INTEGER, defaultValue: 0 },
  questions: { type: DataTypes.JSON, defaultValue: [] },
  isRandomized: { type: DataTypes.BOOLEAN, defaultValue: false },
  showResults: { type: DataTypes.BOOLEAN, defaultValue: true },
  allowRetake: { type: DataTypes.BOOLEAN, defaultValue: false },
  maxAttempts: { type: DataTypes.INTEGER, defaultValue: 1 },
  scheduledFor: { type: DataTypes.DATE, defaultValue: null },
  validUntil: { type: DataTypes.DATE, defaultValue: null },
  isActive: { type: DataTypes.BOOLEAN, defaultValue: true },
  createdBy: { type: DataTypes.INTEGER, defaultValue: null }
}, { timestamps: true, tableName: 'tests' });

const TestResult = sequelize.define('TestResult', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  userId: { type: DataTypes.INTEGER, allowNull: false },
  testId: { type: DataTypes.INTEGER, allowNull: false },
  score: { type: DataTypes.INTEGER, defaultValue: 0 },
  totalQuestions: { type: DataTypes.INTEGER, defaultValue: 0 },
  correctAnswers: { type: DataTypes.INTEGER, defaultValue: 0 },
  wrongAnswers: { type: DataTypes.INTEGER, defaultValue: 0 },
  unattempted: { type: DataTypes.INTEGER, defaultValue: 0 },
  timeTaken: { type: DataTypes.INTEGER, defaultValue: 0 },
  answers: { type: DataTypes.JSON, defaultValue: [] },
  rank: { type: DataTypes.INTEGER, defaultValue: null },
  percentile: { type: DataTypes.INTEGER, defaultValue: null },
  completedAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
}, { timestamps: true, tableName: 'test_results' });

const Question = sequelize.define('Question', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  title: { type: DataTypes.STRING, allowNull: false },
  description: { type: DataTypes.STRING, allowNull: false },
  category: { type: DataTypes.STRING, allowNull: false },
  subcategory: { type: DataTypes.STRING, defaultValue: '' },
  difficulty: { type: DataTypes.STRING, defaultValue: 'medium' },
  type: { type: DataTypes.STRING, defaultValue: 'mcq' },
  options: { type: DataTypes.JSON, defaultValue: [] },
  correctAnswer: { type: DataTypes.STRING, defaultValue: '' },
  explanation: { type: DataTypes.STRING, defaultValue: '' },
  testCases: { type: DataTypes.JSON, defaultValue: [] },
  points: { type: DataTypes.INTEGER, defaultValue: 10 },
  timeLimit: { type: DataTypes.INTEGER, defaultValue: 300 },
  companyTags: { type: DataTypes.JSON, defaultValue: [] },
  createdBy: { type: DataTypes.INTEGER, defaultValue: null },
  isActive: { type: DataTypes.BOOLEAN, defaultValue: true }
}, { timestamps: true, tableName: 'questions' });

// @desc    Get all tests
const getTests = async (req, res) => {
  try {
    const { category, page = 1, limit = 10 } = req.query;
    const where = { isActive: true };
    if (category) where.category = category;

    const offset = (parseInt(page) - 1) * parseInt(limit);
    const { count, rows: tests } = await Test.findAndCountAll({
      where, offset, limit: parseInt(limit),
      order: [['createdAt', 'DESC']]
    });

    res.json({ tests, total: count, page: parseInt(page), pages: Math.ceil(count / parseInt(limit)) });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get single test with questions
const getTestById = async (req, res) => {
  try {
    const test = await Test.findByPk(req.params.id);
    if (!test) return res.status(404).json({ message: 'Test not found' });
    res.json(test);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Create new test (admin)
const createTest = async (req, res) => {
  try {
    const { title, description, category, subcategory, duration, questions, isRandomized, showResults, allowRetake, maxAttempts, scheduledFor, validUntil } = req.body;

    let totalQuestions = questions ? questions.length : 0;
    let totalMarks = questions ? questions.reduce((sum, q) => sum + (q.marks || 1), 0) : 0;

    const test = await Test.create({
      title, description, category, subcategory, duration,
      questions, isRandomized, showResults, allowRetake, maxAttempts,
      scheduledFor, validUntil, totalQuestions, totalMarks,
      passingMarks: Math.floor(totalMarks * 0.4),
      createdBy: req.user.id
    });

    res.status(201).json(test);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Update test (admin)
const updateTest = async (req, res) => {
  try {
    const test = await Test.findByPk(req.params.id);
    if (!test) return res.status(404).json({ message: 'Test not found' });

    const allowedFields = ['title', 'description', 'category', 'subcategory', 'duration', 'questions', 'isRandomized', 'showResults', 'allowRetake', 'maxAttempts', 'scheduledFor', 'validUntil', 'isActive'];
    allowedFields.forEach(field => {
      if (req.body[field] !== undefined) test[field] = req.body[field];
    });

    if (req.body.questions) {
      test.totalQuestions = req.body.questions.length;
      test.totalMarks = req.body.questions.reduce((sum, q) => sum + (q.marks || 1), 0);
      test.passingMarks = Math.floor(test.totalMarks * 0.4);
    }

    await test.save();
    res.json(test);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Delete test (admin)
const deleteTest = async (req, res) => {
  try {
    const test = await Test.findByPk(req.params.id);
    if (!test) return res.status(404).json({ message: 'Test not found' });
    test.isActive = false;
    await test.save();
    res.json({ message: 'Test deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Submit test
const submitTest = async (req, res) => {
  try {
    const { answers, timeTaken } = req.body;
    const testId = req.params.id;

    const test = await Test.findByPk(testId);
    if (!test) return res.status(404).json({ message: 'Test not found' });

    let testQuestions = test.questions || [];
    if (typeof testQuestions === 'string') testQuestions = JSON.parse(testQuestions);

    let correctAnswers = 0, wrongAnswers = 0, unattempted = 0, totalScore = 0;
    const questionIds = testQuestions.map(q => q.questionId || q.question?._id || q.question);
    const questions = await Question.findAll({ where: { id: { [Op.in]: questionIds } } });

    const evaluatedAnswers = testQuestions.map((tq, index) => {
      const questionId = tq.questionId || tq.question?._id || tq.question;
      const question = questions.find(q => q.id === questionId);
      const userAnswer = answers[index] || '';

      if (!userAnswer) { unattempted++; return { question: questionId, userAnswer: '', correctAnswer: question?.correctAnswer || '', isCorrect: false }; }

      let isCorrect = false;
      if (question?.type === 'mcq') {
        isCorrect = question.options?.some(opt => opt.option === userAnswer && opt.isCorrect);
      } else {
        isCorrect = userAnswer.toLowerCase().trim() === (question?.correctAnswer || '').toLowerCase().trim();
      }

      if (isCorrect) { correctAnswers++; totalScore += tq.marks || 1; } else { wrongAnswers++; }

      return { question: questionId, userAnswer, correctAnswer: question?.correctAnswer || '', isCorrect };
    });

    const testResult = await TestResult.create({
      userId: req.user.id, testId: parseInt(testId), score: totalScore,
      totalQuestions: testQuestions.length, correctAnswers, wrongAnswers, unattempted,
      timeTaken: timeTaken || 0, answers: evaluatedAnswers
    });

    const betterScores = await TestResult.count({ where: { testId: parseInt(testId), score: { [Op.gt]: totalScore } } });
    testResult.rank = betterScores + 1;
    const totalAttempts = await TestResult.count({ where: { testId: parseInt(testId) } });
    testResult.percentile = Math.round(((totalAttempts - betterScores) / totalAttempts) * 100);
    await testResult.save();

    if (!test.showResults) {
      return res.json({ message: 'Test submitted successfully', resultId: testResult.id, totalQuestions: testQuestions.length, score: totalScore, totalMarks: test.totalMarks });
    }

    res.json({ _id: testResult.id, test: test._id, score: totalScore, totalQuestions: testQuestions.length, correctAnswers, wrongAnswers, unattempted, timeTaken, rank: testResult.rank, percentile: testResult.percentile, passed: totalScore >= test.passingMarks });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get user test results
const getUserTestResults = async (req, res) => {
  try {
    const results = await TestResult.findAll({
      where: { userId: req.user.id },
      include: [{ model: Test, as: 'test', attributes: ['title', 'category', 'duration'] }],
      order: [['createdAt', 'DESC']]
    });
    res.json(results);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get result details
const getResultDetails = async (req, res) => {
  try {
    const result = await TestResult.findByPk(req.params.id);
    if (!result) return res.status(404).json({ message: 'Result not found' });
    if (result.userId !== req.user.id && req.user.role !== 'admin') return res.status(403).json({ message: 'Not authorized' });

    const test = await Test.findByPk(result.testId);
    res.json({ ...result.toJSON(), test, user: { id: result.userId } });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get leaderboard
const getTestLeaderboard = async (req, res) => {
  try {
    const leaderboard = await TestResult.findAll({
      where: { testId: parseInt(req.params.id) },
      order: [['score', 'DESC'], ['timeTaken', 'ASC']],
      limit: 50
    });
    res.json(leaderboard);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Generate test
const generateTest = async (req, res) => {
  try {
    const { title, category, questionCount, difficulty, duration } = req.body;
    const where = { isActive: true };
    if (category) where.category = category;
    if (difficulty) where.difficulty = difficulty;

    const questions = await Question.findAll({ where, order: sequelize.random(), limit: questionCount || 10 });
    if (questions.length === 0) return res.status(400).json({ message: 'No questions found' });

    const testQuestions = questions.map(q => ({ questionId: q.id, marks: 1 }));
    const test = await Test.create({
      title, category: category || 'custom', duration: duration || 30,
      questions: testQuestions, totalQuestions: questions.length, totalMarks: questions.length,
      passingMarks: Math.floor(questions.length * 0.4), createdBy: req.user.id
    });

    res.status(201).json(test);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = { getTests, getTestById, createTest, updateTest, deleteTest, submitTest, getUserTestResults, getResultDetails, getTestLeaderboard, generateTest };