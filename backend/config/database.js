const { Sequelize } = require('sequelize');
require('dotenv').config();

// Check if we're in production (Vercel) or development
const isProduction = process.env.NODE_ENV === 'production';

let sequelize;

if (isProduction && process.env.POSTGRES_URL) {
  // Use PostgreSQL on Vercel
  sequelize = new Sequelize(process.env.POSTGRES_URL, {
    dialect: 'postgres',
    logging: false,
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    },
    dialectOptions: {
      ssl: {
        rejectUnauthorized: false
      }
    }
  });
} else {
  // Use SQLite for local development
  sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: process.env.DB_STORAGE || './database.sqlite',
    logging: false,
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  });
}

module.exports = sequelize;