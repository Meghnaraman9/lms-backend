# 🚀 LearnHub — AI-Powered LMS Platform

> Full-stack Learning Management System with AI features, coding judge, certificate generation, and more. Built for Sqrock IT Solutions Week 4 internship project.

---

## 📁 Project Structure

```
lms-project/
├── backend/          ← Node.js + Express + MongoDB API
└── frontend/         ← Next.js 14 + Tailwind CSS UI
```

---

## ⚡ Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 14, TypeScript, Tailwind CSS, Zustand, Framer Motion |
| Backend | Node.js, Express.js, MongoDB (Mongoose) |
| Auth | JWT + bcryptjs |
| AI | Google Gemini API |
| Code Execution | Judge0 API (RapidAPI) |
| Storage | Cloudinary |
| PDF | pdfkit |

---

## 🛠️ Local Setup

### Prerequisites
- Node.js 18+
- MongoDB Atlas account (free tier at mongodb.com)
- Google Gemini API key (free at aistudio.google.com)

---

### Backend Setup

```bash
cd backend
npm install
cp .env.example .env
# Fill in your .env values (see below)
npm run dev
```

#### Required `.env` values:
```
PORT=5000
MONGODB_URI=mongodb+srv://...   ← from MongoDB Atlas
JWT_SECRET=any_long_random_string
GEMINI_API_KEY=...              ← from Google AI Studio
CLOUDINARY_CLOUD_NAME=...       ← optional, for video/image uploads
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...
RAPIDAPI_KEY=...                ← optional, for code execution (judge0)
CLIENT_URL=http://localhost:3000
```

---

### Frontend Setup

```bash
cd frontend
npm install
cp .env.example .env.local
# Add:  NEXT_PUBLIC_API_URL=http://localhost:5000/api
npm run dev
```

Open http://localhost:3000

---

## 📦 Pages & Features

| Route | Description |
|---|---|
| `/` | Landing page |
| `/register` | Sign up (student or instructor) |
| `/login` | Login |
| `/dashboard` | Student dashboard with progress |
| `/courses` | Browse all courses |
| `/courses/[id]` | Course detail + video player |
| `/coding` | Coding challenges list |
| `/coding/[id]` | Monaco editor + test cases + AI hints |
| `/ai-chat` | AI doubt assistant (Gemini) |
| `/ai-quiz-gen` | AI quiz generator |
| `/leaderboard` | XP-based leaderboard |
| `/instructor` | Instructor dashboard + course management |

---

## 🌐 Deployment

### Option A — Render (Free, Recommended)

#### Deploy Backend:
1. Push code to GitHub
2. Go to render.com → New → Web Service
3. Connect your GitHub repo, set root directory to `backend`
4. Build command: `npm install`
5. Start command: `node server.js`
6. Add all environment variables from `.env`
7. Deploy → copy your backend URL (e.g., `https://lms-backend.onrender.com`)

#### Deploy Frontend:
1. Go to render.com → New → Static Site (or use Vercel below)
2. Root directory: `frontend`
3. Build command: `npm run build`
4. Set env: `NEXT_PUBLIC_API_URL=https://your-backend.onrender.com/api`

---

### Option B — Vercel (Frontend) + Render (Backend) ← BEST

#### Frontend on Vercel (easiest):
```bash
cd frontend
npx vercel --prod
# Set NEXT_PUBLIC_API_URL in Vercel dashboard → Settings → Environment Variables
```
Or go to vercel.com → Import Project → select frontend folder.

#### Backend on Render:
Same as Option A above.

---

### Option C — Railway (Full Stack, Simple)

1. Go to railway.app
2. New Project → Deploy from GitHub
3. Add both `backend` and `frontend` as separate services
4. Set environment variables per service
5. Railway auto-detects Node.js and deploys

---

## 🗄️ MongoDB Atlas Setup (Free)

1. Go to mongodb.com/atlas → Create free cluster
2. Database Access → Add user (username + password)
3. Network Access → Allow from anywhere (0.0.0.0/0)
4. Connect → Drivers → Copy connection string
5. Replace `<password>` with your DB user password
6. Paste as `MONGODB_URI` in your backend `.env`

---

## 🤖 Gemini AI Setup (Free)

1. Go to aistudio.google.com
2. Sign in with Google
3. Create API Key
4. Paste as `GEMINI_API_KEY` in backend `.env`

---

## ⚖️ Judge0 Code Execution Setup (Optional)

1. Go to rapidapi.com → search "Judge0 CE"
2. Subscribe to free tier (50 req/day)
3. Copy your RapidAPI key → paste as `RAPIDAPI_KEY` in `.env`

Without this, the `/coding/run` endpoint returns a fallback message. Submissions still work with simulated results.

---

## ☁️ Cloudinary Setup (Optional - for video/image uploads)

1. Go to cloudinary.com → Free account
2. Dashboard → copy Cloud Name, API Key, API Secret
3. Paste in `.env`

---

## 📤 Submission Checklist

- [x] GitHub Repository (push both `backend/` and `frontend/`)
- [ ] Screenshots of all pages
- [ ] Demo video (record with Loom or OBS)
- [ ] Deployment links (Vercel + Render)

---

## 🏗️ API Endpoints

```
POST   /api/auth/register         Register user
POST   /api/auth/login            Login
GET    /api/auth/me               Get current user
GET    /api/courses               List courses
POST   /api/courses               Create course (instructor)
POST   /api/courses/:id/enroll    Enroll in course
GET    /api/coding                List challenges
POST   /api/coding/:id/submit     Submit solution
POST   /api/coding/run            Run code (test)
POST   /api/quiz                  Create quiz
POST   /api/quiz/:id/submit       Submit quiz attempt
POST   /api/ai/doubt              AI doubt assistant
POST   /api/ai/code-review        AI code reviewer
POST   /api/ai/hint               AI coding hint
POST   /api/ai/generate-quiz      AI quiz generator
POST   /api/ai/study-plan         AI study planner
POST   /api/progress/:courseId/lesson/:lessonId  Mark lesson complete
POST   /api/certificates/generate/:courseId      Generate certificate PDF
GET    /api/users/leaderboard     XP leaderboard
```

---

## 💡 Tips

- Register as `instructor` role to access `/instructor` dashboard
- Complete 100% of a course to download your certificate PDF
- Solve coding challenges to earn XP and climb the leaderboard
- Use `/ai-chat` for doubt solving and `/ai-quiz-gen` for practice quizzes
