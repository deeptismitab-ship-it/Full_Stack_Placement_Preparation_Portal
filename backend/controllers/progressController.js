const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Progress = sequelize.define('Progress', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  userId: { type: DataTypes.INTEGER, allowNull: false },
  category: { type: DataTypes.STRING, allowNull: false },
  questionsAttempted: { type: DataTypes.INTEGER, defaultValue: 0 },
  questionsCorrect: { type: DataTypes.INTEGER, defaultValue: 0 },
  totalScore: { type: DataTypes.INTEGER, defaultValue: 0 },
  averageTime: { type: DataTypes.INTEGER, defaultValue: 0 },
  lastAttempted: { type: DataTypes.DATE, defaultValue: null },
  completedTopics: { type: DataTypes.JSON, defaultValue: [] },
  streakDays: { type: DataTypes.INTEGER, defaultValue: 0 },
  totalTimeSpent: { type: DataTypes.INTEGER, defaultValue: 0 },
  history: { type: DataTypes.JSON, defaultValue: [] }
}, { timestamps: true, tableName: 'progress' });

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

// @desc    Get user progress
const getUserProgress = async (req, res) => {
  try {
    const progress = await Progress.findAll({ where: { userId: req.user.id }, order: [['category', 'ASC']] });
    res.json(progress);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Update progress
const updateProgress = async (req, res) => {
  try {
    const { category, questionsAttempted, questionsCorrect, timeSpent } = req.body;

    let progress = await Progress.findOne({ where: { userId: req.user.id, category } });

    if (!progress) {
      progress = await Progress.create({
        userId: req.user.id, category, questionsAttempted, questionsCorrect,
        totalScore: questionsCorrect * 10, averageTime: timeSpent || 0,
        lastAttempted: new Date(), totalTimeSpent: timeSpent || 0
      });
    } else {
      progress.questionsAttempted += questionsAttempted;
      progress.questionsCorrect += questionsCorrect;
      progress.totalScore += questionsCorrect * 10;
      progress.totalTimeSpent += timeSpent || 0;
      progress.lastAttempted = new Date();
      progress.averageTime = Math.round((progress.averageTime + (timeSpent || 0)) / 2);

      let history = progress.history || [];
      if (typeof history === 'string') history = JSON.parse(history);
      history.push({ date: new Date(), questionsAttempted, score: questionsCorrect, timeSpent: timeSpent || 0 });
      if (history.length > 30) history = history.slice(-30);
      progress.history = history;
    }

    await progress.save();
    res.json(progress);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get overall stats
const getOverallStats = async (req, res) => {
  try {
    const progress = await Progress.findAll({ where: { userId: req.user.id } });
    const testResults = await TestResult.findAll({ where: { userId: req.user.id } });

    let totalQuestionsAttempted = 0, totalCorrect = 0, totalTimeSpent = 0;
    progress.forEach(p => { totalQuestionsAttempted += p.questionsAttempted; totalCorrect += p.questionsCorrect; totalTimeSpent += p.totalTimeSpent; });

    const overallAccuracy = totalQuestionsAttempted > 0 ? Math.round((totalCorrect / totalQuestionsAttempted) * 100) : 0;
    const totalTestsTaken = testResults.length;
    const averageTestScore = totalTestsTaken > 0 ? Math.round(testResults.reduce((sum, r) => sum + (r.score / r.totalQuestions) * 100, 0) / totalTestsTaken) : 0;
    const bestTestScore = totalTestsTaken > 0 ? Math.max(...testResults.map(r => (r.score / r.totalQuestions) * 100)) : 0;

    const categoryStats = progress.map(p => ({
      category: p.category, attempted: p.questionsAttempted, correct: p.questionsCorrect,
      accuracy: p.questionsAttempted > 0 ? Math.round((p.questionsCorrect / p.questionsAttempted) * 100) : 0, timeSpent: p.totalTimeSpent
    }));

    res.json({
      overall: { totalQuestionsAttempted, totalCorrect, overallAccuracy, totalTimeSpent, totalTestsTaken, averageTestScore: Math.round(averageTestScore), bestTestScore: Math.round(bestTestScore) },
      byCategory: categoryStats
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get weekly activity
const getWeeklyActivity = async (req, res) => {
  try {
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

    const progress = await Progress.findAll({ where: { userId: req.user.id } });

    const dailyStats = {};
    for (let i = 0; i < 7; i++) {
      const date = new Date(); date.setDate(date.getDate() - i);
      const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
      dailyStats[dayName] = { questionsAttempted: 0, questionsCorrect: 0, timeSpent: 0 };
    }

    progress.forEach(p => {
      let history = p.history || [];
      if (typeof history === 'string') history = JSON.parse(history);
      history.forEach(h => {
        if (new Date(h.date) >= oneWeekAgo) {
          const dayName = new Date(h.date).toLocaleDateString('en-US', { weekday: 'short' });
          if (dailyStats[dayName]) {
            dailyStats[dayName].questionsAttempted += h.questionsAttempted || 0;
            dailyStats[dayName].questionsCorrect += h.score || 0;
            dailyStats[dayName].timeSpent += h.timeSpent || 0;
          }
        }
      });
    });

    res.json(dailyStats);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Update streak
const updateStreak = async (req, res) => {
  try {
    const { category } = req.body;
    const progress = await Progress.findOne({ where: { userId: req.user.id, category } });
    if (!progress) return res.status(404).json({ message: 'Progress not found' });

    const lastDate = new Date(progress.lastAttempted);
    const today = new Date();
    lastDate.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);

    const diffDays = Math.floor((today - lastDate) / (1000 * 60 * 60 * 24));
    if (diffDays === 1) progress.streakDays += 1;
    else if (diffDays > 1) progress.streakDays = 1;

    await progress.save();
    res.json({ streakDays: progress.streakDays });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get category progress details
const getCategoryProgress = async (req, res) => {
  try {
    const progress = await Progress.findOne({ where: { userId: req.user.id, category: req.params.category } });
    if (!progress) return res.status(404).json({ message: 'Progress not found' });

    let history = progress.history || [];
    if (typeof history === 'string') history = JSON.parse(history);
    const recentHistory = history.slice(-10);

    res.json({ ...progress.toJSON(), recentHistory });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = { getUserProgress, updateProgress, getOverallStats, getWeeklyActivity, updateStreak, getCategoryProgress };