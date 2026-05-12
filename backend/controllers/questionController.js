const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const { Op } = require('sequelize');
const Question = sequelize.define('Question', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  description: {
    type: DataTypes.STRING,
    allowNull: false
  },
  category: {
    type: DataTypes.ENUM(
      'aptitude',
      'logical',
      'verbal',
      'data-structures',
      'algorithms',
      'database',
      'networking',
      'operating-systems',
      'oops',
      'coding'
    ),
    allowNull: false
  },
  subcategory: {
    type: DataTypes.STRING,
    defaultValue: ''
  },
  difficulty: {
    type: DataTypes.ENUM('easy', 'medium', 'hard'),
    defaultValue: 'medium'
  },
  type: {
    type: DataTypes.ENUM('mcq', 'coding', 'subjective'),
    defaultValue: 'mcq'
  },
  options: {
    type: DataTypes.JSON,
    defaultValue: []
  },
  correctAnswer: {
    type: DataTypes.STRING,
    defaultValue: ''
  },
  explanation: {
    type: DataTypes.STRING,
    defaultValue: ''
  },
  testCases: {
    type: DataTypes.JSON,
    defaultValue: []
  },
  points: {
    type: DataTypes.INTEGER,
    defaultValue: 10
  },
  timeLimit: {
    type: DataTypes.INTEGER,
    defaultValue: 300
  },
  companyTags: {
    type: DataTypes.JSON,
    defaultValue: []
  },
  createdBy: {
    type: DataTypes.INTEGER,
    defaultValue: null
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }
}, {
  timestamps: true,
  tableName: 'questions'
});

// @desc    Get all questions with filters
// @route   GET /api/questions
const getQuestions = async (req, res) => {
  try {
    const { category, difficulty, type, search, page = 1, limit = 20 } = req.query;

    const where = { isActive: true };

    if (category) where.category = category;
    if (difficulty) where.difficulty = difficulty;
    if (type) where.type = type;
    if (search) {
      where[Op.or] = [
        { title: { [Op.like]: `%${search}%` } },
        { description: { [Op.like]: `%${search}%` } }
      ];
    }

    const offset = (parseInt(page) - 1) * parseInt(limit);
    const { count, rows: questions } = await Question.findAndCountAll({
      where,
      offset,
      limit: parseInt(limit),
      order: [['createdAt', 'DESC']]
    });

    res.json({
      questions,
      total: count,
      page: parseInt(page),
      pages: Math.ceil(count / parseInt(limit))
    });
  } catch (error) {
    console.error('Get questions error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get single question
// @route   GET /api/questions/:id
const getQuestionById = async (req, res) => {
  try {
    const question = await Question.findByPk(req.params.id);

    if (!question) {
      return res.status(404).json({ message: 'Question not found' });
    }

    res.json(question);
  } catch (error) {
    console.error('Get question by ID error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Create new question (admin)
// @route   POST /api/questions
const createQuestion = async (req, res) => {
  try {
    const {
      title, description, category, subcategory, difficulty, type,
      options, correctAnswer, explanation, testCases, points, timeLimit, companyTags
    } = req.body;

    const question = await Question.create({
      title,
      description,
      category,
      subcategory,
      difficulty,
      type,
      options,
      correctAnswer,
      explanation,
      testCases,
      points,
      timeLimit,
      companyTags,
      createdBy: req.user.id
    });

    res.status(201).json(question);
  } catch (error) {
    console.error('Create question error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Update question (admin)
// @route   PUT /api/questions/:id
const updateQuestion = async (req, res) => {
  try {
    const question = await Question.findByPk(req.params.id);

    if (!question) {
      return res.status(404).json({ message: 'Question not found' });
    }

    const allowedFields = ['title', 'description', 'category', 'subcategory', 'difficulty',
      'type', 'options', 'correctAnswer', 'explanation', 'testCases', 'points',
      'timeLimit', 'companyTags', 'isActive'];

    allowedFields.forEach(field => {
      if (req.body[field] !== undefined) {
        question[field] = req.body[field];
      }
    });

    await question.save();
    res.json(question);
  } catch (error) {
    console.error('Update question error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Delete question (admin)
// @route   DELETE /api/questions/:id
const deleteQuestion = async (req, res) => {
  try {
    const question = await Question.findByPk(req.params.id);

    if (!question) {
      return res.status(404).json({ message: 'Question not found' });
    }

    question.isActive = false;
    await question.save();

    res.json({ message: 'Question deleted successfully' });
  } catch (error) {
    console.error('Delete question error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get questions by category
// @route   GET /api/questions/category/:category
const getQuestionsByCategory = async (req, res) => {
  try {
    const { category } = req.params;
    const { difficulty, page = 1, limit = 20 } = req.query;

    const where = { category, isActive: true };
    if (difficulty) where.difficulty = difficulty;

    const offset = (parseInt(page) - 1) * parseInt(limit);
    const { count, rows: questions } = await Question.findAndCountAll({
      where,
      offset,
      limit: parseInt(limit),
      order: [['difficulty', 'ASC'], ['createdAt', 'DESC']]
    });

    res.json({
      questions,
      total: count,
      page: parseInt(page),
      pages: Math.ceil(count / parseInt(limit))
    });
  } catch (error) {
    console.error('Get questions by category error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get random questions for practice/test
// @route   GET /api/questions/random
const getRandomQuestions = async (req, res) => {
  try {
    const { category, difficulty, count = 10 } = req.query;

    const where = { isActive: true };
    if (category) where.category = category;
    if (difficulty) where.difficulty = difficulty;

    const questions = await Question.findAll({
      where,
      order: sequelize.random(),
      limit: parseInt(count)
    });

    res.json(questions);
  } catch (error) {
    console.error('Get random questions error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get question statistics (admin)
// @route   GET /api/questions/stats
const getQuestionStats = async (req, res) => {
  try {
    const categories = await Question.findAll({
      where: { isActive: true },
      attributes: ['category', [sequelize.fn('COUNT', sequelize.col('id')), 'count']],
      group: ['category']
    });

    const total = await Question.count({ where: { isActive: true } });

    const byDifficulty = await Question.findAll({
      where: { isActive: true },
      attributes: ['difficulty', [sequelize.fn('COUNT', sequelize.col('id')), 'count']],
      group: ['difficulty']
    });

    res.json({
      total,
      byCategory: categories,
      byDifficulty
    });
  } catch (error) {
    console.error('Get question stats error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Bulk create questions (admin)
// @route   POST /api/questions/bulk
const bulkCreateQuestions = async (req, res) => {
  try {
    const { questions } = req.body;

    if (!Array.isArray(questions) || questions.length === 0) {
      return res.status(400).json({ message: 'Questions array is required' });
    }

    const questionsWithCreator = questions.map(q => ({
      ...q,
      createdBy: req.user.id
    }));

    const createdQuestions = await Question.bulkCreate(questionsWithCreator);
    res.status(201).json({
      message: `${createdQuestions.length} questions created successfully`,
      questions: createdQuestions
    });
  } catch (error) {
    console.error('Bulk create error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  getQuestions,
  getQuestionById,
  createQuestion,
  updateQuestion,
  deleteQuestion,
  getQuestionsByCategory,
  getRandomQuestions,
  getQuestionStats,
  bulkCreateQuestions
};