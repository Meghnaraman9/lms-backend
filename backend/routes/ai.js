const express = require('express');
const router = express.Router();
const { askDoubt, reviewCode, getCodingHint, generateQuiz, generateStudyPlan, interviewPrep } = require('../controllers/aiController');
const { protect } = require('../middleware/auth');

router.post('/doubt', protect, askDoubt);
router.post('/code-review', protect, reviewCode);
router.post('/hint', protect, getCodingHint);
router.post('/generate-quiz', protect, generateQuiz);
router.post('/study-plan', protect, generateStudyPlan);
router.post('/interview-prep', protect, interviewPrep);

module.exports = router;
