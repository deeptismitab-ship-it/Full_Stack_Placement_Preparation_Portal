const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

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

module.exports = Question;