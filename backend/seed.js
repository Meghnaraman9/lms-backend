require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const Course = require('./models/Course');
const CodingChallenge = require('./models/CodingChallenge');

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({});
    await Course.deleteMany({});
    await CodingChallenge.deleteMany({});
    console.log('🗑️  Cleared existing data');

    // Create instructor + admin users
    const instructor = await User.create({
      name: 'Rahul Sharma',
      email: 'instructor@learnhub.com',
      password: 'password123',
      role: 'instructor',
      bio: 'Senior Full Stack Developer with 8 years of experience.',
      xp: 5000
    });

    const admin = await User.create({
      name: 'Admin User',
      email: 'admin@learnhub.com',
      password: 'admin123',
      role: 'admin',
      xp: 9999
    });

    const student = await User.create({
      name: 'Meghana',
      email: 'student@learnhub.com',
      password: 'student123',
      role: 'student',
      xp: 150
    });

    console.log('👤 Users created');

    // Create courses
    const courses = await Course.create([
      {
        title: 'Complete React.js Developer Course',
        slug: 'complete-react-js-developer-course-' + Date.now(),
        description: 'Master React.js from scratch to advanced concepts. Learn hooks, context API, Redux, and build real-world projects including a full e-commerce app.',
        shortDescription: 'Master React.js with hooks, Redux, and real projects.',
        thumbnail: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=640&q=80',
        instructor: instructor._id,
        category: 'Web Development',
        level: 'Beginner',
        isFree: true,
        tags: ['react', 'javascript', 'frontend', 'hooks'],
        isPublished: true,
        publishedAt: new Date(),
        totalEnrollments: 1240,
        averageRating: 4.8,
        totalRatings: 320,
        requirements: ['Basic HTML/CSS knowledge', 'Basic JavaScript'],
        whatYouLearn: [
          'Build modern React applications',
          'Understand hooks (useState, useEffect, useContext)',
          'State management with Redux Toolkit',
          'React Router for navigation',
          'Connect React to REST APIs',
          'Deploy React apps to production'
        ],
        modules: [
          {
            title: 'Getting Started with React',
            order: 1,
            lessons: [
              { title: 'What is React and why use it?', order: 1, videoDuration: 600, isPreview: true, description: 'Introduction to React and its ecosystem' },
              { title: 'Setting up your development environment', order: 2, videoDuration: 480, isPreview: true },
              { title: 'Your first React component', order: 3, videoDuration: 720 },
              { title: 'JSX deep dive', order: 4, videoDuration: 900 },
            ]
          },
          {
            title: 'React Hooks',
            order: 2,
            lessons: [
              { title: 'useState hook explained', order: 1, videoDuration: 840 },
              { title: 'useEffect and side effects', order: 2, videoDuration: 960 },
              { title: 'useContext for global state', order: 3, videoDuration: 780 },
              { title: 'Custom hooks', order: 4, videoDuration: 1020 },
            ]
          },
          {
            title: 'Redux Toolkit',
            order: 3,
            lessons: [
              { title: 'Why Redux? When to use it', order: 1, videoDuration: 600 },
              { title: 'Setting up Redux Toolkit', order: 2, videoDuration: 720 },
              { title: 'Slices and reducers', order: 3, videoDuration: 900 },
              { title: 'Async thunks with createAsyncThunk', order: 4, videoDuration: 1080 },
            ]
          }
        ]
      },
      {
        title: 'Node.js & Express Backend Development',
        slug: 'nodejs-express-backend-development-' + Date.now(),
        description: 'Build powerful REST APIs with Node.js and Express. Cover authentication, databases, file uploads, and deployment. Build a complete backend from scratch.',
        shortDescription: 'Build REST APIs with Node.js, Express, and MongoDB.',
        thumbnail: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=640&q=80',
        instructor: instructor._id,
        category: 'Web Development',
        level: 'Intermediate',
        isFree: true,
        tags: ['nodejs', 'express', 'backend', 'api', 'mongodb'],
        isPublished: true,
        publishedAt: new Date(),
        totalEnrollments: 890,
        averageRating: 4.7,
        totalRatings: 210,
        requirements: ['JavaScript fundamentals', 'Basic understanding of HTTP'],
        whatYouLearn: [
          'Build RESTful APIs with Express.js',
          'MongoDB with Mongoose ODM',
          'JWT Authentication and authorization',
          'File uploads with Multer',
          'Error handling best practices',
          'Deploy to Render/Railway'
        ],
        modules: [
          {
            title: 'Node.js Fundamentals',
            order: 1,
            lessons: [
              { title: 'Node.js architecture and event loop', order: 1, videoDuration: 780, isPreview: true },
              { title: 'Modules and npm', order: 2, videoDuration: 600 },
              { title: 'File system and streams', order: 3, videoDuration: 840 },
            ]
          },
          {
            title: 'Express.js',
            order: 2,
            lessons: [
              { title: 'Setting up Express server', order: 1, videoDuration: 540, isPreview: true },
              { title: 'Routing and middleware', order: 2, videoDuration: 720 },
              { title: 'Request and response handling', order: 3, videoDuration: 660 },
              { title: 'Error handling middleware', order: 4, videoDuration: 600 },
            ]
          },
          {
            title: 'Database with MongoDB',
            order: 3,
            lessons: [
              { title: 'MongoDB basics and Atlas setup', order: 1, videoDuration: 720 },
              { title: 'Mongoose models and schemas', order: 2, videoDuration: 900 },
              { title: 'CRUD operations', order: 3, videoDuration: 840 },
              { title: 'Relationships and population', order: 4, videoDuration: 960 },
            ]
          }
        ]
      },
      {
        title: 'Python for Data Science & Machine Learning',
        slug: 'python-data-science-ml-' + Date.now(),
        description: 'Learn Python from basics to data science. Master NumPy, Pandas, Matplotlib, and Scikit-learn. Build real ML models including classification, regression, and clustering.',
        shortDescription: 'Python, NumPy, Pandas, and ML with Scikit-learn.',
        thumbnail: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=640&q=80',
        instructor: instructor._id,
        category: 'Data Science',
        level: 'Beginner',
        isFree: true,
        tags: ['python', 'data science', 'machine learning', 'pandas', 'numpy'],
        isPublished: true,
        publishedAt: new Date(),
        totalEnrollments: 2100,
        averageRating: 4.9,
        totalRatings: 540,
        requirements: ['No prior experience needed', 'A computer with internet'],
        whatYouLearn: [
          'Python fundamentals from scratch',
          'Data manipulation with Pandas',
          'Numerical computing with NumPy',
          'Data visualization with Matplotlib',
          'Machine learning with Scikit-learn',
          'Build and evaluate ML models'
        ],
        modules: [
          {
            title: 'Python Basics',
            order: 1,
            lessons: [
              { title: 'Variables, data types, and operators', order: 1, videoDuration: 720, isPreview: true },
              { title: 'Control flow: if/else, loops', order: 2, videoDuration: 660 },
              { title: 'Functions and modules', order: 3, videoDuration: 780 },
              { title: 'Lists, tuples, dicts, sets', order: 4, videoDuration: 900 },
            ]
          },
          {
            title: 'NumPy & Pandas',
            order: 2,
            lessons: [
              { title: 'NumPy arrays and operations', order: 1, videoDuration: 840, isPreview: true },
              { title: 'Pandas DataFrames', order: 2, videoDuration: 960 },
              { title: 'Data cleaning and preprocessing', order: 3, videoDuration: 1020 },
              { title: 'Exploratory data analysis', order: 4, videoDuration: 1080 },
            ]
          },
          {
            title: 'Machine Learning',
            order: 3,
            lessons: [
              { title: 'What is machine learning?', order: 1, videoDuration: 600 },
              { title: 'Linear regression', order: 2, videoDuration: 900 },
              { title: 'Classification with decision trees', order: 3, videoDuration: 960 },
              { title: 'Model evaluation and validation', order: 4, videoDuration: 840 },
            ]
          }
        ]
      },
      {
        title: 'Full Stack Web Development Bootcamp',
        slug: 'full-stack-web-development-bootcamp-' + Date.now(),
        description: 'The complete full stack web development course. HTML, CSS, JavaScript, React, Node.js, MongoDB — everything you need to become a full stack developer and get hired.',
        shortDescription: 'HTML to full stack — the complete developer bootcamp.',
        thumbnail: 'https://images.unsplash.com/photo-1593720213428-28a5b9e94613?w=640&q=80',
        instructor: instructor._id,
        category: 'Web Development',
        level: 'Beginner',
        isFree: false,
        price: 999,
        tags: ['html', 'css', 'javascript', 'react', 'nodejs', 'fullstack'],
        isPublished: true,
        publishedAt: new Date(),
        totalEnrollments: 3400,
        averageRating: 4.8,
        totalRatings: 890,
        requirements: ['Absolutely no experience needed', 'A computer and internet connection'],
        whatYouLearn: [
          'HTML5 and CSS3 from scratch',
          'JavaScript ES6+ modern syntax',
          'React.js for frontend',
          'Node.js + Express for backend',
          'MongoDB database',
          'Deploy your apps live'
        ],
        modules: [
          {
            title: 'HTML & CSS Fundamentals',
            order: 1,
            lessons: [
              { title: 'HTML structure and elements', order: 1, videoDuration: 900, isPreview: true },
              { title: 'CSS styling and selectors', order: 2, videoDuration: 840, isPreview: true },
              { title: 'Flexbox and Grid layout', order: 3, videoDuration: 1080 },
              { title: 'Responsive design', order: 4, videoDuration: 960 },
            ]
          },
          {
            title: 'JavaScript',
            order: 2,
            lessons: [
              { title: 'Variables, functions, and scope', order: 1, videoDuration: 780 },
              { title: 'DOM manipulation', order: 2, videoDuration: 900 },
              { title: 'Async JS: callbacks, promises, async/await', order: 3, videoDuration: 1020 },
              { title: 'Fetch API and REST calls', order: 4, videoDuration: 840 },
            ]
          }
        ]
      },
      {
        title: 'DevOps & Cloud with AWS',
        slug: 'devops-cloud-aws-' + Date.now(),
        description: 'Learn DevOps practices and AWS cloud. Master Docker, Kubernetes, CI/CD pipelines, and deploy applications to AWS. Prepare for AWS Solutions Architect certification.',
        shortDescription: 'Docker, Kubernetes, CI/CD, and AWS deployment.',
        thumbnail: 'https://images.unsplash.com/photo-1667372393119-3d4c48d07fc9?w=640&q=80',
        instructor: instructor._id,
        category: 'DevOps',
        level: 'Advanced',
        isFree: false,
        price: 1499,
        tags: ['devops', 'aws', 'docker', 'kubernetes', 'cicd'],
        isPublished: true,
        publishedAt: new Date(),
        totalEnrollments: 560,
        averageRating: 4.6,
        totalRatings: 120,
        requirements: ['Basic Linux command line', 'Some programming experience'],
        whatYouLearn: [
          'Linux fundamentals for DevOps',
          'Docker containers and images',
          'Kubernetes orchestration',
          'CI/CD with GitHub Actions',
          'AWS EC2, S3, RDS, Lambda',
          'Infrastructure as Code with Terraform'
        ],
        modules: [
          {
            title: 'Docker',
            order: 1,
            lessons: [
              { title: 'What is containerization?', order: 1, videoDuration: 600, isPreview: true },
              { title: 'Docker images and containers', order: 2, videoDuration: 840 },
              { title: 'Docker Compose', order: 3, videoDuration: 960 },
            ]
          },
          {
            title: 'AWS Core Services',
            order: 2,
            lessons: [
              { title: 'AWS IAM and security', order: 1, videoDuration: 720, isPreview: true },
              { title: 'EC2 and Auto Scaling', order: 2, videoDuration: 900 },
              { title: 'S3 and CloudFront', order: 3, videoDuration: 780 },
              { title: 'RDS and DynamoDB', order: 4, videoDuration: 840 },
            ]
          }
        ]
      },
      {
        title: 'Data Structures & Algorithms in JavaScript',
        slug: 'dsa-javascript-' + Date.now(),
        description: 'Master data structures and algorithms with JavaScript. Arrays, linked lists, trees, graphs, dynamic programming — everything you need to crack coding interviews at top companies.',
        shortDescription: 'Crack coding interviews with DSA in JavaScript.',
        thumbnail: 'https://images.unsplash.com/photo-1509228468518-180dd4864904?w=640&q=80',
        instructor: instructor._id,
        category: 'Web Development',
        level: 'Intermediate',
        isFree: true,
        tags: ['dsa', 'algorithms', 'javascript', 'interview prep'],
        isPublished: true,
        publishedAt: new Date(),
        totalEnrollments: 1780,
        averageRating: 4.9,
        totalRatings: 430,
        requirements: ['JavaScript basics', 'Basic programming knowledge'],
        whatYouLearn: [
          'Big O notation and complexity analysis',
          'Arrays, strings, and hash maps',
          'Linked lists, stacks, and queues',
          'Trees and graph algorithms',
          'Dynamic programming patterns',
          'Sorting and searching algorithms'
        ],
        modules: [
          {
            title: 'Complexity Analysis',
            order: 1,
            lessons: [
              { title: 'Big O notation explained', order: 1, videoDuration: 720, isPreview: true },
              { title: 'Time vs space complexity', order: 2, videoDuration: 600, isPreview: true },
              { title: 'Analyzing your code', order: 3, videoDuration: 660 },
            ]
          },
          {
            title: 'Arrays & Strings',
            order: 2,
            lessons: [
              { title: 'Array operations and tricks', order: 1, videoDuration: 840 },
              { title: 'Two pointer technique', order: 2, videoDuration: 780 },
              { title: 'Sliding window pattern', order: 3, videoDuration: 900 },
              { title: 'String manipulation problems', order: 4, videoDuration: 720 },
            ]
          },
          {
            title: 'Trees & Graphs',
            order: 3,
            lessons: [
              { title: 'Binary trees and traversals', order: 1, videoDuration: 960 },
              { title: 'BFS and DFS', order: 2, videoDuration: 900 },
              { title: 'Graph representation', order: 3, videoDuration: 840 },
              { title: 'Shortest path algorithms', order: 4, videoDuration: 1080 },
            ]
          }
        ]
      }
    ]);

    console.log(`📚 ${courses.length} courses created`);

    // Update instructor's createdCourses
    await User.findByIdAndUpdate(instructor._id, {
      createdCourses: courses.map(c => c._id)
    });

    // Create coding challenges
    const challenges = await CodingChallenge.create([
      {
        title: 'Two Sum',
        slug: 'two-sum-' + Date.now(),
        description: `Given an array of integers \`nums\` and an integer \`target\`, return the indices of the two numbers that add up to \`target\`.\n\nYou may assume that each input would have exactly one solution, and you may not use the same element twice.\n\n**Constraints:**\n- 2 <= nums.length <= 10^4\n- -10^9 <= nums[i] <= 10^9`,
        difficulty: 'Easy',
        category: 'Arrays',
        tags: ['array', 'hash map'],
        examples: [
          { input: 'nums = [2,7,11,15], target = 9', output: '[0,1]', explanation: 'nums[0] + nums[1] = 2 + 7 = 9' },
          { input: 'nums = [3,2,4], target = 6', output: '[1,2]', explanation: 'nums[1] + nums[2] = 2 + 4 = 6' }
        ],
        testCases: [
          { input: '[2,7,11,15]\n9', expectedOutput: '[0,1]' },
          { input: '[3,2,4]\n6', expectedOutput: '[1,2]' },
          { input: '[3,3]\n6', expectedOutput: '[0,1]', isHidden: true },
        ],
        hints: ['Try using a hash map to store values you\'ve seen', 'For each number, check if target - number exists in your map'],
        xpReward: 50,
        isActive: true,
        createdBy: instructor._id
      },
      {
        title: 'Reverse a String',
        slug: 'reverse-string-' + Date.now(),
        description: `Write a function that reverses a string. The input string is given as an array of characters \`s\`.\n\nYou must do this by modifying the input array in-place with O(1) extra memory.\n\n**Constraints:**\n- 1 <= s.length <= 10^5\n- s[i] is a printable ASCII character`,
        difficulty: 'Easy',
        category: 'Strings',
        tags: ['string', 'two pointers'],
        examples: [
          { input: 's = ["h","e","l","l","o"]', output: '["o","l","l","e","h"]' },
          { input: 's = ["H","a","n","n","a","h"]', output: '["h","a","n","n","a","H"]' }
        ],
        testCases: [
          { input: 'hello', expectedOutput: 'olleh' },
          { input: 'Hannah', expectedOutput: 'hannaH' },
          { input: 'abcde', expectedOutput: 'edcba', isHidden: true },
          { input: 'a', expectedOutput: 'a', isHidden: true },
        ],
        hints: ['Use two pointers from both ends', 'Swap characters moving towards the center'],
        xpReward: 30,
        isActive: true,
        createdBy: instructor._id
      },
      {
        title: 'Valid Parentheses',
        slug: 'valid-parentheses-' + Date.now(),
        description: `Given a string \`s\` containing just the characters \`(\`, \`)\`, \`{\`, \`}\`, \`[\` and \`]\`, determine if the input string is valid.\n\nAn input string is valid if:\n1. Open brackets must be closed by the same type of brackets.\n2. Open brackets must be closed in the correct order.\n3. Every close bracket has a corresponding open bracket of the same type.\n\n**Constraints:**\n- 1 <= s.length <= 10^4`,
        difficulty: 'Easy',
        category: 'Strings',
        tags: ['stack', 'string'],
        examples: [
          { input: 's = "()"', output: 'true' },
          { input: 's = "()[]{}"', output: 'true' },
          { input: 's = "(]"', output: 'false' }
        ],
        testCases: [
          { input: '()', expectedOutput: 'true' },
          { input: '()[]{} ', expectedOutput: 'true' },
          { input: '(]', expectedOutput: 'false' },
          { input: '{[]}', expectedOutput: 'true', isHidden: true },
        ],
        hints: ['Use a stack data structure', 'Push opening brackets, pop and check closing brackets'],
        xpReward: 50,
        isActive: true,
        createdBy: instructor._id
      },
      {
        title: 'Maximum Subarray',
        slug: 'maximum-subarray-' + Date.now(),
        description: `Given an integer array \`nums\`, find the subarray with the largest sum, and return its sum.\n\n**Constraints:**\n- 1 <= nums.length <= 10^5\n- -10^4 <= nums[i] <= 10^4\n\n**Follow up:** If you have figured out the O(n) solution, try coding another solution using the divide and conquer approach, which is more subtle.`,
        difficulty: 'Medium',
        category: 'Dynamic Programming',
        tags: ['array', 'dynamic programming', 'divide and conquer'],
        examples: [
          { input: 'nums = [-2,1,-3,4,-1,2,1,-5,4]', output: '6', explanation: 'The subarray [4,-1,2,1] has the largest sum 6.' },
          { input: 'nums = [1]', output: '1' },
          { input: 'nums = [5,4,-1,7,8]', output: '23' }
        ],
        testCases: [
          { input: '-2 1 -3 4 -1 2 1 -5 4', expectedOutput: '6' },
          { input: '1', expectedOutput: '1' },
          { input: '5 4 -1 7 8', expectedOutput: '23', isHidden: true },
        ],
        hints: ['Think about Kadane\'s algorithm', 'At each position, decide: extend the current subarray or start fresh?'],
        xpReward: 100,
        isActive: true,
        createdBy: instructor._id
      },
      {
        title: 'Fibonacci Number',
        slug: 'fibonacci-number-' + Date.now(),
        description: `The Fibonacci numbers, commonly denoted \`F(n)\` form a sequence, called the Fibonacci sequence, such that each number is the sum of the two preceding ones, starting from 0 and 1.\n\nGiven \`n\`, calculate \`F(n)\`.\n\n**Constraints:**\n- 0 <= n <= 30`,
        difficulty: 'Easy',
        category: 'Dynamic Programming',
        tags: ['math', 'dynamic programming', 'recursion'],
        examples: [
          { input: 'n = 2', output: '1', explanation: 'F(2) = F(1) + F(0) = 1 + 0 = 1' },
          { input: 'n = 3', output: '2', explanation: 'F(3) = F(2) + F(1) = 1 + 1 = 2' },
          { input: 'n = 4', output: '3' }
        ],
        testCases: [
          { input: '2', expectedOutput: '1' },
          { input: '3', expectedOutput: '2' },
          { input: '10', expectedOutput: '55', isHidden: true },
        ],
        hints: ['Try recursion first, then optimize', 'Can you solve it iteratively with O(1) space?'],
        xpReward: 30,
        isActive: true,
        createdBy: instructor._id
      },
      {
        title: 'Binary Search',
        slug: 'binary-search-' + Date.now(),
        description: `Given an array of integers \`nums\` which is sorted in ascending order, and an integer \`target\`, write a function to search \`target\` in \`nums\`. If \`target\` exists, return its index. Otherwise, return -1.\n\nYou must write an algorithm with O(log n) runtime complexity.\n\n**Constraints:**\n- 1 <= nums.length <= 10^4\n- All integers in nums are unique`,
        difficulty: 'Easy',
        category: 'Searching',
        tags: ['array', 'binary search'],
        examples: [
          { input: 'nums = [-1,0,3,5,9,12], target = 9', output: '4', explanation: '9 exists in nums and its index is 4' },
          { input: 'nums = [-1,0,3,5,9,12], target = 2', output: '-1', explanation: '2 does not exist in nums so return -1' }
        ],
        testCases: [
          { input: '-1 0 3 5 9 12\n9', expectedOutput: '4' },
          { input: '-1 0 3 5 9 12\n2', expectedOutput: '-1' },
          { input: '5\n5', expectedOutput: '0', isHidden: true },
        ],
        hints: ['Maintain left and right pointers', 'Compare middle element with target and eliminate half the array'],
        xpReward: 50,
        isActive: true,
        createdBy: instructor._id
      },
      {
        title: 'Climbing Stairs',
        slug: 'climbing-stairs-' + Date.now(),
        description: `You are climbing a staircase. It takes \`n\` steps to reach the top.\n\nEach time you can either climb 1 or 2 steps. In how many distinct ways can you climb to the top?\n\n**Constraints:**\n- 1 <= n <= 45`,
        difficulty: 'Easy',
        category: 'Dynamic Programming',
        tags: ['math', 'dynamic programming', 'memoization'],
        examples: [
          { input: 'n = 2', output: '2', explanation: '1+1 or 2. Two ways.' },
          { input: 'n = 3', output: '3', explanation: '1+1+1, 1+2, or 2+1. Three ways.' }
        ],
        testCases: [
          { input: '2', expectedOutput: '2' },
          { input: '3', expectedOutput: '3' },
          { input: '10', expectedOutput: '89', isHidden: true },
        ],
        hints: ['Notice the pattern — it\'s similar to Fibonacci!', 'f(n) = f(n-1) + f(n-2)'],
        xpReward: 50,
        isActive: true,
        createdBy: instructor._id
      },
      {
        title: 'Merge Two Sorted Lists',
        slug: 'merge-sorted-lists-' + Date.now(),
        description: `You are given the heads of two sorted linked lists \`list1\` and \`list2\`.\n\nMerge the two lists into one sorted list. The list should be made by splicing together the nodes of the first two lists.\n\nReturn the head of the merged linked list.\n\n**Constraints:**\n- The number of nodes in both lists is in the range [0, 50]\n- -100 <= Node.val <= 100`,
        difficulty: 'Easy',
        category: 'Linked Lists',
        tags: ['linked list', 'recursion'],
        examples: [
          { input: 'list1 = [1,2,4], list2 = [1,3,4]', output: '[1,1,2,3,4,4]' },
          { input: 'list1 = [], list2 = []', output: '[]' }
        ],
        testCases: [
          { input: '1 2 4\n1 3 4', expectedOutput: '1 1 2 3 4 4' },
          { input: '1 2\n3 4', expectedOutput: '1 2 3 4', isHidden: true },
        ],
        hints: ['Use a dummy head node', 'Compare values from both lists and append the smaller one'],
        xpReward: 50,
        isActive: true,
        createdBy: instructor._id
      },
      {
        title: 'Longest Common Subsequence',
        slug: 'longest-common-subsequence-' + Date.now(),
        description: `Given two strings \`text1\` and \`text2\`, return the length of their longest common subsequence. If there is no common subsequence, return 0.\n\nA subsequence of a string is a new string generated from the original string with some characters (can be none) deleted without changing the relative order of the remaining characters.\n\n**Constraints:**\n- 1 <= text1.length, text2.length <= 1000`,
        difficulty: 'Medium',
        category: 'Dynamic Programming',
        tags: ['string', 'dynamic programming'],
        examples: [
          { input: 'text1 = "abcde", text2 = "ace"', output: '3', explanation: 'LCS is "ace", length 3' },
          { input: 'text1 = "abc", text2 = "abc"', output: '3' },
          { input: 'text1 = "abc", text2 = "def"', output: '0' }
        ],
        testCases: [
          { input: 'abcde\nace', expectedOutput: '3' },
          { input: 'abc\nabc', expectedOutput: '3' },
          { input: 'abc\ndef', expectedOutput: '0', isHidden: true },
        ],
        hints: ['Think about a 2D DP table', 'If characters match, dp[i][j] = dp[i-1][j-1] + 1'],
        xpReward: 100,
        isActive: true,
        createdBy: instructor._id
      },
      {
        title: 'Number of Islands',
        slug: 'number-of-islands-' + Date.now(),
        description: `Given an m x n 2D binary grid \`grid\` which represents a map of '1's (land) and '0's (water), return the number of islands.\n\nAn island is surrounded by water and is formed by connecting adjacent lands horizontally or vertically.\n\n**Constraints:**\n- m == grid.length\n- n == grid[i].length\n- 1 <= m, n <= 300`,
        difficulty: 'Medium',
        category: 'Graph',
        tags: ['graph', 'bfs', 'dfs', 'matrix'],
        examples: [
          { input: 'grid = [["1","1","1","1","0"],["1","1","0","1","0"],["1","1","0","0","0"],["0","0","0","0","0"]]', output: '1' },
          { input: 'grid = [["1","1","0","0","0"],["1","1","0","0","0"],["0","0","1","0","0"],["0","0","0","1","1"]]', output: '3' }
        ],
        testCases: [
          { input: '11110\n11010\n11000\n00000', expectedOutput: '1' },
          { input: '11000\n11000\n00100\n00011', expectedOutput: '3' },
        ],
        hints: ['Use DFS or BFS to explore connected land cells', 'Mark visited cells to avoid counting them twice'],
        xpReward: 100,
        isActive: true,
        createdBy: instructor._id
      }
    ]);

    console.log(`💻 ${challenges.length} coding challenges created`);

    console.log('\n✅ Database seeded successfully!\n');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('🔑 Login credentials:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('👨‍🏫 Instructor: instructor@learnhub.com / password123');
    console.log('👨‍💼 Admin:      admin@learnhub.com / admin123');
    console.log('👩‍🎓 Student:    student@learnhub.com / student123');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    process.exit(0);
  } catch (err) {
    console.error('❌ Seed error:', err.message);
    process.exit(1);
  }
};

seed();
