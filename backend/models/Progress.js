const mongoose = require('mongoose');

const progressSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
  completedLessons: [{ type: String }], // lesson IDs
  completedModules: [{ type: String }], // module IDs
  lastAccessedLesson: String,
  lastAccessedAt: { type: Date, default: Date.now },
  progressPercentage: { type: Number, default: 0 },
  timeSpent: { type: Number, default: 0 }, // in seconds
  quizScores: [{
    quiz: { type: mongoose.Schema.Types.ObjectId, ref: 'Quiz' },
    bestScore: Number,
    attempts: Number
  }],
  isCompleted: { type: Boolean, default: false },
  completedAt: Date,
  certificateIssued: { type: Boolean, default: false }
}, { timestamps: true });

progressSchema.index({ user: 1, course: 1 }, { unique: true });

module.exports = mongoose.model('Progress', progressSchema);
