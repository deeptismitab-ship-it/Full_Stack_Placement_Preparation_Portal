const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Progress = sequelize.define('Progress', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  category: {
    type: DataTypes.STRING,
    allowNull: false
  },
  questionsAttempted: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  questionsCorrect: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  totalScore: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  averageTime: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  lastAttempted: {
    type: DataTypes.DATE,
    defaultValue: null
  },
  completedTopics: {
    type: DataTypes.JSON,
    defaultValue: []
  },
  streakDays: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  totalTimeSpent: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  history: {
    type: DataTypes.JSON,
    defaultValue: []
  }
}, {
  timestamps: true,
  tableName: 'progress'
});

module.exports = Progress;