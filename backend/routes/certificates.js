const express = require('express');
const router = express.Router();
const { generateCertificate, getMyCertificates } = require('../controllers/certificateController');
const { protect } = require('../middleware/auth');

router.get('/', protect, getMyCertificates);
router.post('/generate/:courseId', protect, generateCertificate);

module.exports = router;
