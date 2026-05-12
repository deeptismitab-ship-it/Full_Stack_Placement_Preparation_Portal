const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const TestResult = sequelize.define('TestResult', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  testId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  score: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  totalQuestions: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  correctAnswers: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  wrongAnswers: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  unattempted: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  timeTaken: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  answers: {
    type: DataTypes.JSON,
    defaultValue: []
  },
  rank: {
    type: DataTypes.INTEGER,
    defaultValue: null
  },
  percentile: {
    type: DataTypes.INTEGER,
    defaultValue: null
  },
  completedAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  timestamps: true,
  tableName: 'test_results'
});

module.exports = TestResult;