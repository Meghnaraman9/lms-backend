const Quiz = require('../models/Quiz');
const User = require('../models/User');
const Progress = require('../models/Progress');

// @desc    Get quizzes for a course
// @route   GET /api/quiz/course/:courseId
exports.getCourseQuizzes = async (req, res) => {
  try {
    const quizzes = await Quiz.find({ course: req.params.courseId, isActive: true })
      .select('-questions.correctAnswer -questions.explanation');
    res.json({ success: true, quizzes });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc    Get quiz for attempt
// @route   GET /api/quiz/:id
exports.getQuiz = async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id).select('-questions.correctAnswer');
    if (!quiz) return res.status(404).json({ success: false, message: 'Quiz not found.' });

    // Check attempt limits
    const userAttempts = quiz.attempts.filter(a => a.user.toString() === req.user.id).length;
    if (quiz.maxAttempts > 0 && userAttempts >= quiz.maxAttempts) {
      return res.status(400).json({ success: false, message: `Maximum ${quiz.maxAttempts} attempts reached.` });
    }
    res.json({ success: true, quiz, attemptsMade: userAttempts });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc    Create quiz
// @route   POST /api/quiz
exports.createQuiz = async (req, res) => {
  try {
    req.body.createdBy = req.user.id;
    const quiz = await Quiz.create(req.body);
    res.status(201).json({ success: true, quiz });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc    Submit quiz attempt
// @route   POST /api/quiz/:id/submit
exports.submitQuiz = async (req, res) => {
  try {
    const { answers, timeTaken } = req.body;
    const quiz = await Quiz.findById(req.params.id);
    if (!quiz) return res.status(404).json({ success: false, message: 'Quiz not found.' });

    // Check attempt limits
    const userAttempts = quiz.attempts.filter(a => a.user.toString() === req.user.id).length;
    if (quiz.maxAttempts > 0 && userAttempts >= quiz.maxAttempts) {
      return res.status(400).json({ success: false, message: 'Maximum attempts reached.' });
    }

    // Calculate score
    let score = 0;
    const totalPoints = quiz.questions.reduce((acc, q) => acc + q.points, 0);
    const resultDetails = [];

    quiz.questions.forEach((question, index) => {
      const userAnswer = answers.find(a => a.questionIndex === index);
      const isCorrect = userAnswer && userAnswer.selectedOption === question.correctAnswer;
      if (isCorrect) score += question.points;
      resultDetails.push({
        question: question.question,
        isCorrect,
        correctAnswer: question.correctAnswer,
        userAnswer: userAnswer?.selectedOption,
        explanation: question.explanation
      });
    });

    const percentage = Math.round((score / totalPoints) * 100);
    const passed = percentage >= quiz.passingScore;

    const attempt = {
      user: req.user.id,
      answers,
      score,
      totalPoints,
      percentage,
      passed,
      timeTaken
    };
    quiz.attempts.push(attempt);
    await quiz.save();

    // Award XP if passed
    if (passed) {
      await User.findByIdAndUpdate(req.user.id, { $inc: { xp: quiz.xpReward } });
    }

    res.json({
      success: true,
      score,
      totalPoints,
      percentage,
      passed,
      passingScore: quiz.passingScore,
      resultDetails: quiz.showAnswers ? resultDetails : [],
      message: passed ? '🎉 Congratulations! You passed!' : `You need ${quiz.passingScore}% to pass. Keep trying!`
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc    Get quiz results/analytics (instructor)
// @route   GET /api/quiz/:id/analytics
exports.getQuizAnalytics = async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id).populate('attempts.user', 'name email');
    if (!quiz) return res.status(404).json({ success: false, message: 'Quiz not found.' });
    if (quiz.createdBy.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized.' });
    }

    const totalAttempts = quiz.attempts.length;
    const passed = quiz.attempts.filter(a => a.passed).length;
    const avgScore = totalAttempts > 0
      ? quiz.attempts.reduce((acc, a) => acc + a.percentage, 0) / totalAttempts
      : 0;

    res.json({
      success: true,
      analytics: {
        totalAttempts,
        passRate: totalAttempts > 0 ? Math.round((passed / totalAttempts) * 100) : 0,
        averageScore: Math.round(avgScore),
        attempts: quiz.attempts
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
