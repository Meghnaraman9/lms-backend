const axios = require('axios');

const callGemini = async (prompt) => {
  const response = await axios.post(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${process.env.GEMINI_API_KEY}`,
    {
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: { temperature: 0.7, maxOutputTokens: 1024 }
    }
  );
  return response.data.candidates[0].content.parts[0].text;
};

// @desc    AI Doubt Assistant
// @route   POST /api/ai/doubt
exports.askDoubt = async (req, res) => {
  try {
    const { question, context, language } = req.body;
    if (!question) return res.status(400).json({ success: false, message: 'Question is required.' });

    const prompt = `You are an expert programming tutor for an LMS platform. 
A student has this question${context ? ` in the context of "${context}"` : ''}${language ? ` (language: ${language})` : ''}:

"${question}"

Provide a clear, concise, helpful answer. If it's a coding doubt, include a code example. Format your response in markdown.`;

    const answer = await callGemini(prompt);
    res.json({ success: true, answer });
  } catch (err) {
    res.status(500).json({ success: false, message: 'AI service error: ' + err.message });
  }
};

// @desc    AI Code Review
// @route   POST /api/ai/code-review
exports.reviewCode = async (req, res) => {
  try {
    const { code, language, problemDescription } = req.body;
    if (!code) return res.status(400).json({ success: false, message: 'Code is required.' });

    const prompt = `You are an expert code reviewer. Review this ${language || 'code'} solution${problemDescription ? ` for: "${problemDescription}"` : ''}.

\`\`\`${language || ''}
${code}
\`\`\`

Provide:
1. **Overall Assessment** (correct/incorrect/partially correct)
2. **Strengths** of the solution
3. **Issues Found** (bugs, edge cases, performance)
4. **Improved Solution** (if needed)
5. **Time & Space Complexity**
6. **Learning Tips**

Format in clear markdown.`;

    const review = await callGemini(prompt);
    res.json({ success: true, review });
  } catch (err) {
    res.status(500).json({ success: false, message: 'AI service error: ' + err.message });
  }
};

// @desc    AI Coding Hint
// @route   POST /api/ai/hint
exports.getCodingHint = async (req, res) => {
  try {
    const { problemTitle, problemDescription, userCode, language, hintLevel = 1 } = req.body;

    const prompt = `You are a coding mentor. A student is working on this problem:

**Problem:** ${problemTitle}
**Description:** ${problemDescription}

${userCode ? `**Their current code:**
\`\`\`${language}
${userCode}
\`\`\`` : ''}

Provide a **Level ${hintLevel} hint** (1=subtle hint, 2=approach hint, 3=detailed hint).
Do NOT give away the full solution. Guide them to think in the right direction.`;

    const hint = await callGemini(prompt);
    res.json({ success: true, hint });
  } catch (err) {
    res.status(500).json({ success: false, message: 'AI service error: ' + err.message });
  }
};

// @desc    AI Quiz Generator
// @route   POST /api/ai/generate-quiz
exports.generateQuiz = async (req, res) => {
  try {
    const { topic, difficulty, count = 5 } = req.body;
    if (!topic) return res.status(400).json({ success: false, message: 'Topic is required.' });

    const prompt = `Generate ${count} multiple choice questions about "${topic}" at ${difficulty || 'intermediate'} level.

Return ONLY valid JSON in this exact format:
{
  "questions": [
    {
      "question": "Question text here?",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correctAnswer": 0,
      "explanation": "Why this is correct"
    }
  ]
}

correctAnswer is the INDEX (0-3) of the correct option.`;

    const raw = await callGemini(prompt);
    // Extract JSON from response
    const jsonMatch = raw.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error('Could not parse AI response');
    const parsed = JSON.parse(jsonMatch[0]);
    res.json({ success: true, ...parsed });
  } catch (err) {
    res.status(500).json({ success: false, message: 'AI service error: ' + err.message });
  }
};

// @desc    AI Study Plan
// @route   POST /api/ai/study-plan
exports.generateStudyPlan = async (req, res) => {
  try {
    const { goal, currentLevel, availableHoursPerWeek, timeframeWeeks } = req.body;

    const prompt = `Create a personalized study plan for:
- **Goal:** ${goal}
- **Current Level:** ${currentLevel || 'Beginner'}
- **Available Time:** ${availableHoursPerWeek || 10} hours/week
- **Timeframe:** ${timeframeWeeks || 8} weeks

Provide a week-by-week study plan with:
1. Topics to cover each week
2. Recommended resources
3. Projects/exercises
4. Milestones to track progress

Format in clear markdown with week headers.`;

    const plan = await callGemini(prompt);
    res.json({ success: true, plan });
  } catch (err) {
    res.status(500).json({ success: false, message: 'AI service error: ' + err.message });
  }
};

// @desc    AI Interview Prep
// @route   POST /api/ai/interview-prep
exports.interviewPrep = async (req, res) => {
  try {
    const { topic, role, difficulty } = req.body;

    const prompt = `You are a senior software engineer conducting a mock interview.
Generate 5 interview questions for:
- **Role:** ${role || 'Software Developer'}
- **Topic:** ${topic}
- **Difficulty:** ${difficulty || 'Medium'}

For each question provide:
1. The question
2. Key points the answer should cover
3. Example answer

Format in markdown.`;

    const prep = await callGemini(prompt);
    res.json({ success: true, prep });
  } catch (err) {
    res.status(500).json({ success: false, message: 'AI service error: ' + err.message });
  }
};
