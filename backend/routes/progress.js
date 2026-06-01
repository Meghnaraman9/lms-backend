const express = require('express');
const router = express.Router();
const { getCourseProgress, markLessonComplete, getAllProgress, getCourseAnalytics } = require('../controllers/progressController');
const { protect, authorize } = require('../middleware/auth');

router.get('/', protect, getAllProgress);
router.get('/:courseId', protect, getCourseProgress);
router.post('/:courseId/lesson/:lessonId', protect, markLessonComplete);
router.get('/analytics/:courseId', protect, authorize('instructor', 'admin'), getCourseAnalytics);

module.exports = router;
