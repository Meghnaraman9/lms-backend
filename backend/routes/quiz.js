const express = require('express');
const router = express.Router();
const { getCourseQuizzes, getQuiz, createQuiz, submitQuiz, getQuizAnalytics } = require('../controllers/quizController');
const { protect, authorize } = require('../middleware/auth');

router.get('/course/:courseId', protect, getCourseQuizzes);
router.get('/:id', protect, getQuiz);
router.post('/', protect, authorize('instructor', 'admin'), createQuiz);
router.post('/:id/submit', protect, submitQuiz);
router.get('/:id/analytics', protect, authorize('instructor', 'admin'), getQuizAnalytics);

module.exports = router;
