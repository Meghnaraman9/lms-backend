const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  question: { type: String, required: true },
  options: [{ type: String, required: true }],
  correctAnswer: { type: Number, required: true }, // index of correct option
  explanation: String,
  points: { type: Number, default: 1 }
});

const quizAttemptSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  answers: [{ questionIndex: Number, selectedOption: Number }],
  score: { type: Number, default: 0 },
  totalPoints: { type: Number, default: 0 },
  percentage: { type: Number, default: 0 },
  passed: { type: Boolean, default: false },
  timeTaken: Number, // in seconds
  submittedAt: { type: Date, default: Date.now }
});

const quizSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course' },
  module: String,
  questions: [questionSchema],
  timeLimit: { type: Number, default: 30 }, // in minutes, 0 = no limit
  passingScore: { type: Number, default: 70 }, // percentage
  maxAttempts: { type: Number, default: 3 }, // 0 = unlimited
  isRandomized: { type: Boolean, default: false },
  showAnswers: { type: Boolean, default: true },
  attempts: [quizAttemptSchema],
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  isActive: { type: Boolean, default: true },
  xpReward: { type: Number, default: 30 }
}, { timestamps: true });

module.exports = mongoose.model('Quiz', quizSchema);
