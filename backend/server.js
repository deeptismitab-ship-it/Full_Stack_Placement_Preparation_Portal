const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/questions', require('./routes/questions'));
app.use('/api/tests', require('./routes/tests'));
app.use('/api/companies', require('./routes/companies'));
app.use('/api/progress', require('./routes/progress'));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Placement Portal API is running with SQLite' });
});

// Default route
app.get('/', (req, res) => {
  res.json({ 
    message: 'Welcome to Placement Preparation Portal API',
    version: '1.0.0',
    database: 'SQLite',
    endpoints: [
      '/api/auth',
      '/api/questions',
      '/api/tests',
      '/api/companies',
      '/api/progress'
    ]
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ 
    message: 'Server Error', 
    error: process.env.NODE_ENV === 'development' ? err.message : undefined 
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// Start server after database connection
const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    // Initialize database
    const db = require('./config/db');
    await db.connectDB();
    
    // Start Express server
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
      console.log(`API available at http://localhost:${PORT}/api`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();