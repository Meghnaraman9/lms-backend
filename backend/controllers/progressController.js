const Progress = require('../models/Progress');
const Course = require('../models/Course');
const User = require('../models/User');

// @desc    Get user's progress for a course
// @route   GET /api/progress/:courseId
exports.getCourseProgress = async (req, res) => {
  try {
    const progress = await Progress.findOne({ user: req.user.id, course: req.params.courseId });
    if (!progress) return res.status(404).json({ success: false, message: 'Not enrolled in this course.' });
    res.json({ success: true, progress });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc    Mark lesson as complete
// @route   POST /api/progress/:courseId/lesson/:lessonId
exports.markLessonComplete = async (req, res) => {
  try {
    const { courseId, lessonId } = req.params;
    const course = await Course.findById(courseId);
    if (!course) return res.status(404).json({ success: false, message: 'Course not found.' });

    let progress = await Progress.findOne({ user: req.user.id, course: courseId });
    if (!progress) return res.status(404).json({ success: false, message: 'Not enrolled in this course.' });

    if (!progress.completedLessons.includes(lessonId)) {
      progress.completedLessons.push(lessonId);
    }

    progress.lastAccessedLesson = lessonId;
    progress.lastAccessedAt = new Date();

    // Calculate percentage
    const totalLessons = course.totalLessons || 1;
    progress.progressPercentage = Math.round((progress.completedLessons.length / totalLessons) * 100);

    if (progress.progressPercentage >= 100) {
      progress.isCompleted = true;
      progress.completedAt = new Date();
      // Award XP
      await User.findByIdAndUpdate(req.user.id, { $inc: { xp: 200 } });
    }

    await progress.save();

    // Also update user's enrolledCourses progress
    await User.updateOne(
      { _id: req.user.id, 'enrolledCourses.course': courseId },
      { $set: { 'enrolledCourses.$.progress': progress.progressPercentage } }
    );

    res.json({ success: true, progress });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc    Get all user's progress (dashboard)
// @route   GET /api/progress
exports.getAllProgress = async (req, res) => {
  try {
    const progresses = await Progress.find({ user: req.user.id })
      .populate('course', 'title thumbnail totalLessons instructor');
    res.json({ success: true, progresses });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc    Get analytics (instructor)
// @route   GET /api/progress/analytics/:courseId
exports.getCourseAnalytics = async (req, res) => {
  try {
    const course = await Course.findById(req.params.courseId);
    if (!course) return res.status(404).json({ success: false, message: 'Course not found.' });
    if (course.instructor.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized.' });
    }

    const progresses = await Progress.find({ course: req.params.courseId })
      .populate('user', 'name email');

    const completed = progresses.filter(p => p.isCompleted).length;
    const avgProgress = progresses.length > 0
      ? progresses.reduce((acc, p) => acc + p.progressPercentage, 0) / progresses.length
      : 0;

    res.json({
      success: true,
      analytics: {
        totalStudents: progresses.length,
        completedStudents: completed,
        completionRate: progresses.length > 0 ? Math.round((completed / progresses.length) * 100) : 0,
        averageProgress: Math.round(avgProgress),
        students: progresses
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
