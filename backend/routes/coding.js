// routes/coding.js
const express = require('express');
const router = express.Router();
const { getChallenges, getChallenge, createChallenge, submitSolution, runCode } = require('../controllers/codingController');
const { protect, authorize } = require('../middleware/auth');

router.get('/', getChallenges);
router.post('/run', protect, runCode);
router.get('/:id', getChallenge);
router.post('/', protect, authorize('instructor', 'admin'), createChallenge);
router.post('/:id/submit', protect, submitSolution);

module.exports = router;
