const mongoose = require('mongoose');

const lessonSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  videoUrl: String,
  videoDuration: Number, // in seconds
  order: { type: Number, required: true },
  resources: [{
    title: String,
    fileUrl: String,
    fileType: String
  }],
  isPreview: { type: Boolean, default: false }
});

const moduleSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  order: { type: Number, required: true },
  lessons: [lessonSchema]
});

const courseSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Course title is required'],
    trim: true,
    maxlength: [100, 'Title cannot exceed 100 characters']
  },
  slug: { type: String, unique: true },
  description: { type: String, required: [true, 'Description is required'] },
  shortDescription: { type: String, maxlength: 200 },
  thumbnail: { type: String, default: '' },
  instructor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  category: {
    type: String,
    required: true,
    enum: ['Web Development', 'Mobile Development', 'Data Science', 'Machine Learning',
      'DevOps', 'Cybersecurity', 'Database', 'Cloud Computing', 'Blockchain', 'Other']
  },
  level: {
    type: String,
    enum: ['Beginner', 'Intermediate', 'Advanced'],
    default: 'Beginner'
  },
  language: { type: String, default: 'English' },
  price: { type: Number, default: 0 },
  isFree: { type: Boolean, default: true },
  tags: [String],
  modules: [moduleSchema],
  enrolledStudents: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  totalEnrollments: { type: Number, default: 0 },
  ratings: [{
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    rating: { type: Number, min: 1, max: 5 },
    review: String,
    createdAt: { type: Date, default: Date.now }
  }],
  averageRating: { type: Number, default: 0 },
  totalRatings: { type: Number, default: 0 },
  isPublished: { type: Boolean, default: false },
  publishedAt: Date,
  requirements: [String],
  whatYouLearn: [String],
  totalDuration: { type: Number, default: 0 }, // total seconds
  totalLessons: { type: Number, default: 0 }
}, { timestamps: true });

// Create slug before save
courseSchema.pre('save', function (next) {
  if (this.isModified('title')) {
    this.slug = this.title.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-');
    this.slug += '-' + Date.now();
  }
  // Calculate totals
  let totalLessons = 0;
  let totalDuration = 0;
  this.modules.forEach(module => {
    module.lessons.forEach(lesson => {
      totalLessons++;
      totalDuration += lesson.videoDuration || 0;
    });
  });
  this.totalLessons = totalLessons;
  this.totalDuration = totalDuration;
  next();
});

module.exports = mongoose.model('Course', courseSchema);
