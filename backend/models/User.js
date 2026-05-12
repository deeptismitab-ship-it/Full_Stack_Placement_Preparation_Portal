const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const bcrypt = require('bcryptjs');

const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  },
  role: {
    type: DataTypes.ENUM('student', 'admin'),
    defaultValue: 'student'
  },
  phone: {
    type: DataTypes.STRING,
    defaultValue: ''
  },
  college: {
    type: DataTypes.STRING,
    defaultValue: ''
  },
  branch: {
    type: DataTypes.STRING,
    defaultValue: ''
  },
  year: {
    type: DataTypes.INTEGER,
    defaultValue: 2024
  },
  skills: {
    type: DataTypes.JSON,
    defaultValue: []
  },
  bookmarkedQuestions: {
    type: DataTypes.JSON,
    defaultValue: []
  },
  bookmarkedCompanies: {
    type: DataTypes.JSON,
    defaultValue: []
  },
  avatar: {
    type: DataTypes.STRING,
    defaultValue: ''
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }
}, {
  timestamps: true,
  tableName: 'users',
  hooks: {
    beforeCreate: async (user) => {
      if (user.password) {
        user.password = await bcrypt.hash(user.password, 10);
      }
    },
    beforeUpdate: async (user) => {
      if (user.changed('password')) {
        user.password = await bcrypt.hash(user.password, 10);
      }
    }
  }
});

User.prototype.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = User;