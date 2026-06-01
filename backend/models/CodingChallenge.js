const mongoose = require('mongoose');

const testCaseSchema = new mongoose.Schema({
  input: { type: String, required: true },
  expectedOutput: { type: String, required: true },
  isHidden: { type: Boolean, default: false },
  explanation: String
});

const submissionSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  code: { type: String, required: true },
  language: { type: String, required: true },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'wrong_answer', 'time_limit_exceeded', 'runtime_error', 'compilation_error'],
    default: 'pending'
  },
  passedTestCases: { type: Number, default: 0 },
  totalTestCases: { type: Number, default: 0 },
  executionTime: Number,
  memoryUsed: Number,
  errorMessage: String,
  submittedAt: { type: Date, default: Date.now }
});

const codingChallengeSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  slug: { type: String, unique: true },
  description: { type: String, required: true },
  difficulty: {
    type: String,
    enum: ['Easy', 'Medium', 'Hard'],
    required: true
  },
  category: {
    type: String,
    enum: ['Arrays', 'Strings', 'Linked Lists', 'Trees', 'Dynamic Programming',
      'Sorting', 'Searching', 'Graph', 'Math', 'Other'],
    required: true
  },
  tags: [String],
  constraints: String,
  examples: [{
    input: String,
    output: String,
    explanation: String
  }],
  testCases: [testCaseSchema],
  starterCode: {
    javascript: { type: String, default: '// Write your solution here\nfunction solution(input) {\n  \n}' },
    python: { type: String, default: '# Write your solution here\ndef solution(input):\n    pass' },
    cpp: { type: String, default: '#include<bits/stdc++.h>\nusing namespace std;\n\nint main() {\n  // Write your solution here\n  return 0;\n}' },
    java: { type: String, default: 'public class Solution {\n  public static void main(String[] args) {\n    // Write your solution here\n  }\n}' }
  },
  submissions: [submissionSchema],
  totalSubmissions: { type: Number, default: 0 },
  acceptedSubmissions: { type: Number, default: 0 },
  hints: [String],
  solution: String, // for instructors only
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course' },
  xpReward: { type: Number, default: 50 },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

codingChallengeSchema.pre('save', function (next) {
  if (this.isModified('title') && !this.slug) {
    this.slug = this.title.toLowerCase().replace(/[^a-z0-9]/g, '-') + '-' + Date.now();
  }
  next();
});

module.exports = mongoose.model('CodingChallenge', codingChallengeSchema);
