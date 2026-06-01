const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

process.on('uncaughtException', (err) => {
  console.error('UNCAUGHT EXCEPTION:', err);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('UNHANDLED REJECTION at:', promise, 'reason:', reason);
  process.exit(1);
});

const app = express();

// Security middleware
app.use(helmet());
app.use(morgan('dev'));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: 'Too many requests from this IP, please try again later.'
});
app.use('/api/', limiter);

// CORS
app.use(cors({
  origin: function(origin, callback) {
    const allowed = [
      process.env.CLIENT_URL,
      'http://localhost:3000'
    ];
    // Allow any vercel.app subdomain
    if (!origin || allowed.includes(origin) || origin.endsWith('.vercel.app')) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Routes
console.log('Loading auth route...');
app.use('/api/auth', require('./routes/auth'));
console.log('Loading courses route...');
app.use('/api/courses', require('./routes/courses'));
console.log('Loading users route...');
app.use('/api/users', require('./routes/users'));
console.log('Loading coding route...');
app.use('/api/coding', require('./routes/coding'));
console.log('Loading quiz route...');
app.use('/api/quiz', require('./routes/quiz'));
console.log('Loading ai route...');
app.use('/api/ai', require('./routes/ai'));
console.log('Loading certificates route...');
app.use('/api/certificates', require('./routes/certificates'));
console.log('Loading progress route...');
app.use('/api/progress', require('./routes/progress'));
console.log('✅ All routes loaded successfully');

// Health check
app.get('/api/health', (req, res) => res.json({ status: 'OK', message: 'LMS API Running' }));

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error'
  });
});

// Connect to MongoDB and start server
mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('✅ MongoDB Connected');
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
  })
  .catch(err => {
    console.error('❌ MongoDB connection error:', err);
    process.exit(1);
  });

module.exports = app;
