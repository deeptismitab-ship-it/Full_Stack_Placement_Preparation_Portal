const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Company = sequelize.define('Company', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  logo: {
    type: DataTypes.STRING,
    defaultValue: ''
  },
  description: {
    type: DataTypes.STRING,
    defaultValue: ''
  },
  website: {
    type: DataTypes.STRING,
    defaultValue: ''
  },
  industry: {
    type: DataTypes.STRING,
    defaultValue: ''
  },
  headquarters: {
    type: DataTypes.STRING,
    defaultValue: ''
  },
  hiringStatus: {
    type: DataTypes.ENUM('active', 'upcoming', 'completed', 'not-hiring'),
    defaultValue: 'upcoming'
  },
  eligibilityCriteria: {
    type: DataTypes.JSON,
    defaultValue: {}
  },
  recruitmentProcess: {
    type: DataTypes.JSON,
    defaultValue: []
  },
  interviewExperiences: {
    type: DataTypes.JSON,
    defaultValue: []
  },
  previousPapers: {
    type: DataTypes.JSON,
    defaultValue: []
  },
  faqs: {
    type: DataTypes.JSON,
    defaultValue: []
  },
  createdBy: {
    type: DataTypes.INTEGER,
    defaultValue: null
  }
}, {
  timestamps: true,
  tableName: 'companies'
});

module.exports = Company;