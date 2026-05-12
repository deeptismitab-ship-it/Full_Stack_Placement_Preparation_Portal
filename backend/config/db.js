const { Sequelize, DataTypes } = require('sequelize');
const bcrypt = require('bcryptjs');
const sequelize = require('./database');
require('dotenv').config();

// Re-export sequelize
module.exports = sequelize;

// Create User model
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

// Connect to database
const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log('SQLite Connected Successfully!');
    
    await sequelize.sync({ alter: true });
    console.log('Database tables synchronized');
    
    // Seed admin user
    const adminExists = await User.findOne({ where: { email: 'admin@placementportal.com' } });
    
    if (!adminExists) {
      await User.create({
        name: 'Admin User',
        email: 'admin@placementportal.com',
        password: 'admin123',
        role: 'admin',
        phone: '+91 9876543210',
        college: 'Placement Portal Institute',
        branch: 'Computer Science',
        year: 2024
      });
      console.log('Admin user created: admin@placementportal.com / admin123');
    } else {
      console.log('Admin user already exists');
    }
    
    return sequelize;
  } catch (error) {
    console.error('Database Connection Error:', error.message);
    process.exit(1);
  }
};

module.exports.connectDB = connectDB;
module.exports.User = User;