const PDFDocument = require('pdfkit');
const User = require('../models/User');
const Course = require('../models/Course');
const Progress = require('../models/Progress');
const { v4: uuidv4 } = require('crypto');

// @desc    Generate certificate
// @route   POST /api/certificates/generate/:courseId
exports.generateCertificate = async (req, res) => {
  try {
    const { courseId } = req.params;

    // Check if course is completed
    const progress = await Progress.findOne({ user: req.user.id, course: courseId });
    if (!progress || progress.progressPercentage < 100) {
      return res.status(400).json({ success: false, message: 'Complete the course to get a certificate.' });
    }

    const user = await User.findById(req.user.id);
    const course = await Course.findById(courseId).populate('instructor', 'name');

    // Check if already issued
    const existingCert = user.certificates.find(c => c.course.toString() === courseId);
    if (existingCert) {
      return res.json({ success: true, certificateId: existingCert.certificateId, message: 'Certificate already issued.' });
    }

    const certificateId = 'LMS-' + Date.now().toString(36).toUpperCase();
    const issueDate = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

    // Create PDF
    const doc = new PDFDocument({
      layout: 'landscape',
      size: 'A4',
      margins: { top: 50, bottom: 50, left: 72, right: 72 }
    });

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="certificate-${certificateId}.pdf"`);
    doc.pipe(res);

    // Background gradient effect
    doc.rect(0, 0, doc.page.width, doc.page.height).fill('#0f172a');

    // Border design
    doc.rect(20, 20, doc.page.width - 40, doc.page.height - 40)
      .lineWidth(3).stroke('#6366f1');
    doc.rect(30, 30, doc.page.width - 60, doc.page.height - 60)
      .lineWidth(1).stroke('#818cf8');

    // Header
    doc.fontSize(14).fillColor('#818cf8').font('Helvetica')
      .text('SQROCK IT SOLUTIONS', 0, 60, { align: 'center', characterSpacing: 8 });

    doc.fontSize(40).fillColor('#f1f5f9').font('Helvetica-Bold')
      .text('Certificate of Completion', 0, 90, { align: 'center' });

    doc.fontSize(14).fillColor('#94a3b8').font('Helvetica')
      .text('This is to certify that', 0, 155, { align: 'center' });

    // Student name
    doc.fontSize(36).fillColor('#6366f1').font('Helvetica-Bold')
      .text(user.name, 0, 180, { align: 'center' });

    doc.moveTo(200, 225).lineTo(doc.page.width - 200, 225)
      .lineWidth(1).stroke('#6366f1');

    doc.fontSize(14).fillColor('#94a3b8').font('Helvetica')
      .text('has successfully completed the course', 0, 235, { align: 'center' });

    // Course title
    doc.fontSize(24).fillColor('#f1f5f9').font('Helvetica-Bold')
      .text(course.title, 0, 260, { align: 'center' });

    // Details
    doc.fontSize(12).fillColor('#94a3b8').font('Helvetica')
      .text(`Instructor: ${course.instructor.name}   |   Issue Date: ${issueDate}   |   Certificate ID: ${certificateId}`,
        0, 320, { align: 'center' });

    // Badge/seal
    doc.circle(doc.page.width / 2, 370, 35).fillAndStroke('#6366f1', '#818cf8');
    doc.fontSize(10).fillColor('#f1f5f9').font('Helvetica-Bold')
      .text('VERIFIED', doc.page.width / 2 - 30, 363, { width: 60, align: 'center' });

    doc.end();

    // Save certificate record
    user.certificates.push({ course: courseId, certificateId });
    await user.save();

    progress.certificateIssued = true;
    await progress.save();

  } catch (err) {
    if (!res.headersSent) {
      res.status(500).json({ success: false, message: err.message });
    }
  }
};

// @desc    Get user's certificates
// @route   GET /api/certificates
exports.getMyCertificates = async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .populate('certificates.course', 'title thumbnail instructor');
    res.json({ success: true, certificates: user.certificates });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
