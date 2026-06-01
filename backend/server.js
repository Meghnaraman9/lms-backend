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
// Temporary seed route - remove after seeding
app.get('/api/run-seed', async (req, res) => {
  try {
    const User = require('./models/User');
    const Course = require('./models/Course');
    const CodingChallenge = require('./models/CodingChallenge');

    await User.deleteMany({});
    await Course.deleteMany({});
    await CodingChallenge.deleteMany({});

    const instructor = await User.create({
      name: 'Rahul Sharma', email: 'instructor@learnhub.com',
      password: 'password123', role: 'instructor',
      bio: 'Senior Full Stack Developer with 8 years of experience.', xp: 5000
    });
    await User.create({ name: 'Admin User', email: 'admin@learnhub.com', password: 'admin123', role: 'admin', xp: 9999 });
    await User.create({ name: 'Meghana', email: 'student@learnhub.com', password: 'student123', role: 'student', xp: 150 });

    const courses = await Course.create([
      { title: 'Complete React.js Developer Course', slug: 'react-course-1', description: 'Master React.js from scratch.', shortDescription: 'Master React.js with hooks, Redux, and real projects.', thumbnail: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=640&q=80', instructor: instructor._id, category: 'Web Development', level: 'Beginner', isFree: true, tags: ['react','javascript'], isPublished: true, publishedAt: new Date(), totalEnrollments: 1240, averageRating: 4.8, totalRatings: 320 },
      { title: 'Node.js & Express Backend Development', slug: 'nodejs-course-1', description: 'Build REST APIs with Node.js.', shortDescription: 'Build REST APIs with Node.js, Express, and MongoDB.', thumbnail: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=640&q=80', instructor: instructor._id, category: 'Web Development', level: 'Intermediate', isFree: true, tags: ['nodejs','express'], isPublished: true, publishedAt: new Date(), totalEnrollments: 890, averageRating: 4.7, totalRatings: 210 },
      { title: 'Python for Data Science & ML', slug: 'python-course-1', description: 'Learn Python for data science.', shortDescription: 'Python, NumPy, Pandas, and ML with Scikit-learn.', thumbnail: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=640&q=80', instructor: instructor._id, category: 'Data Science', level: 'Beginner', isFree: true, tags: ['python','ml'], isPublished: true, publishedAt: new Date(), totalEnrollments: 2100, averageRating: 4.9, totalRatings: 540 },
      { title: 'Full Stack Web Development Bootcamp', slug: 'fullstack-course-1', description: 'Complete full stack course.', shortDescription: 'HTML to full stack — the complete developer bootcamp.', thumbnail: 'https://images.unsplash.com/photo-1593720213428-28a5b9e94613?w=640&q=80', instructor: instructor._id, category: 'Web Development', level: 'Beginner', isFree: false, price: 999, tags: ['html','css','javascript'], isPublished: true, publishedAt: new Date(), totalEnrollments: 3400, averageRating: 4.8, totalRatings: 890 },
      { title: 'Data Structures & Algorithms in JavaScript', slug: 'dsa-course-1', description: 'Master DSA with JavaScript.', shortDescription: 'Crack coding interviews with DSA in JavaScript.', thumbnail: 'https://images.unsplash.com/photo-1509228468518-180dd4864904?w=640&q=80', instructor: instructor._id, category: 'Web Development', level: 'Intermediate', isFree: true, tags: ['dsa','algorithms'], isPublished: true, publishedAt: new Date(), totalEnrollments: 1780, averageRating: 4.9, totalRatings: 430 },
    ]);

    await User.findByIdAndUpdate(instructor._id, { createdCourses: courses.map(c => c._id) });

    res.json({ success: true, message: `✅ Seeded! ${courses.length} courses and 3 users created.` });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

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
