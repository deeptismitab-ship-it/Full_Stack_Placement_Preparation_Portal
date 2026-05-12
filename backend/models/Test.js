const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Test = sequelize.define('Test', {
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
    defaultValue: ''
  },
  category: {
    type: DataTypes.ENUM('aptitude', 'technical', 'coding', 'full-length', 'custom'),
    allowNull: false
  },
  subcategory: {
    type: DataTypes.STRING,
    defaultValue: ''
  },
  duration: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 30
  },
  totalQuestions: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  totalMarks: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  passingMarks: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  questions: {
    type: DataTypes.JSON,
    defaultValue: []
  },
  isRandomized: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  showResults: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  allowRetake: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  maxAttempts: {
    type: DataTypes.INTEGER,
    defaultValue: 1
  },
  scheduledFor: {
    type: DataTypes.DATE,
    defaultValue: null
  },
  validUntil: {
    type: DataTypes.DATE,
    defaultValue: null
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  createdBy: {
    type: DataTypes.INTEGER,
    defaultValue: null
  }
}, {
  timestamps: true,
  tableName: 'tests'
});

module.exports = Test;