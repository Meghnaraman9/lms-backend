const CodingChallenge = require('../models/CodingChallenge');
const User = require('../models/User');
const axios = require('axios');

const LANGUAGE_IDS = {
  javascript: 63,
  python: 71,
  cpp: 54,
  java: 62
};

// Run code using Judge0 (free tier: judge0.com)
const runCodeOnJudge0 = async (code, languageId, stdin) => {
  try {
    // Using public Judge0 instance
    const submitRes = await axios.post('https://judge0-ce.p.rapidapi.com/submissions', {
      source_code: Buffer.from(code).toString('base64'),
      language_id: languageId,
      stdin: Buffer.from(stdin || '').toString('base64'),
      base64_encoded: true,
      wait: true
    }, {
      headers: {
        'X-RapidAPI-Key': process.env.RAPIDAPI_KEY || 'your-rapidapi-key',
        'X-RapidAPI-Host': 'judge0-ce.p.rapidapi.com',
        'Content-Type': 'application/json'
      }
    });
    return submitRes.data;
  } catch (err) {
    // Fallback: simulate execution for development
    return { status: { description: 'Simulated' }, stdout: '', stderr: 'Code execution service not configured' };
  }
};

// @desc    Get all coding challenges
// @route   GET /api/coding
exports.getChallenges = async (req, res) => {
  try {
    const { difficulty, category, search, page = 1, limit = 20 } = req.query;
    const query = { isActive: true };
    if (difficulty) query.difficulty = difficulty;
    if (category) query.category = category;
    if (search) query.title = { $regex: search, $options: 'i' };

    const challenges = await CodingChallenge.find(query)
      .select('-testCases -solution -submissions')
      .sort('difficulty createdAt')
      .skip((page - 1) * limit)
      .limit(Number(limit));

    const total = await CodingChallenge.countDocuments(query);
    res.json({ success: true, challenges, total });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc    Get single challenge
// @route   GET /api/coding/:id
exports.getChallenge = async (req, res) => {
  try {
    const challenge = await CodingChallenge.findById(req.params.id)
      .select('-solution -testCases.isHidden');
    if (!challenge) return res.status(404).json({ success: false, message: 'Challenge not found.' });
    res.json({ success: true, challenge });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc    Create challenge
// @route   POST /api/coding
exports.createChallenge = async (req, res) => {
  try {
    req.body.createdBy = req.user.id;
    const challenge = await CodingChallenge.create(req.body);
    res.status(201).json({ success: true, challenge });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc    Submit solution
// @route   POST /api/coding/:id/submit
exports.submitSolution = async (req, res) => {
  try {
    const { code, language } = req.body;
    const challenge = await CodingChallenge.findById(req.params.id);
    if (!challenge) return res.status(404).json({ success: false, message: 'Challenge not found.' });

    const langId = LANGUAGE_IDS[language];
    if (!langId) return res.status(400).json({ success: false, message: 'Unsupported language.' });

    const visibleTestCases = challenge.testCases.filter(tc => !tc.isHidden);
    let passedCount = 0;
    const results = [];

    for (const tc of visibleTestCases) {
      const result = await runCodeOnJudge0(code, langId, tc.input);
      const output = result.stdout ? Buffer.from(result.stdout, 'base64').toString().trim() : '';
      const passed = output === tc.expectedOutput.trim();
      if (passed) passedCount++;
      results.push({
        input: tc.input,
        expectedOutput: tc.expectedOutput,
        actualOutput: output,
        passed,
        error: result.stderr ? Buffer.from(result.stderr, 'base64').toString() : null,
        status: result.status?.description
      });
    }

    const allPassed = passedCount === visibleTestCases.length;
    const submission = {
      user: req.user.id,
      code,
      language,
      status: allPassed ? 'accepted' : 'wrong_answer',
      passedTestCases: passedCount,
      totalTestCases: visibleTestCases.length
    };

    challenge.submissions.push(submission);
    challenge.totalSubmissions += 1;
    if (allPassed) challenge.acceptedSubmissions += 1;
    await challenge.save();

    // Award XP if accepted
    if (allPassed) {
      await User.findByIdAndUpdate(req.user.id, { $inc: { xp: challenge.xpReward } });
    }

    res.json({
      success: true,
      status: submission.status,
      passedTestCases: passedCount,
      totalTestCases: visibleTestCases.length,
      results
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc    Run code (test without submit)
// @route   POST /api/coding/run
exports.runCode = async (req, res) => {
  try {
    const { code, language, input } = req.body;
    const langId = LANGUAGE_IDS[language];
    if (!langId) return res.status(400).json({ success: false, message: 'Unsupported language.' });

    const result = await runCodeOnJudge0(code, langId, input);
    res.json({
      success: true,
      output: result.stdout ? Buffer.from(result.stdout, 'base64').toString() : '',
      error: result.stderr ? Buffer.from(result.stderr, 'base64').toString() : '',
      status: result.status?.description
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
