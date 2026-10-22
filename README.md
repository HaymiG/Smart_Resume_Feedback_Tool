<div align="center">

# Smart Resume Feedback Tool | AI-Powered Resume Analysis

**Developed an AI-powered application that analyzes uploaded resumes, identifies areas for improvement, and provides actionable feedback to help job seekers improve resume quality and alignment with job requirements.**

![CI/CD Pipeline](https://github.com/HaymiG/Smart_Resume_Feedback_Tool/actions/workflows/ci-cd.yml/badge.svg?branch=main)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.115+-009688.svg?style=flat&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com)
[![React 19](https://img.shields.io/badge/React-19.2+-61DAFB.svg?style=flat&logo=react&logoColor=black)](https://react.dev)
[![Vite](https://img.shields.io/badge/Vite-8.2+-646CFF.svg?style=flat&logo=vite&logoColor=white)](https://vitejs.dev)
[![Google Gemini](https://img.shields.io/badge/Google%20Gemini-Flash-4285F4.svg?style=flat&logo=google&logoColor=white)](https://ai.google.dev)
[![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-3ECF8E.svg?style=flat&logo=supabase&logoColor=white)](https://supabase.com)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-38B2AC.svg?style=flat&logo=tailwind-css&logoColor=white)](https://tailwindcss.com)
[![Docker](https://img.shields.io/badge/Docker-Ready-2496ED.svg?style=flat&logo=docker&logoColor=white)](https://docker.com)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat)](https://opensource.org/licenses/MIT)

[Features](#-key-capabilities) • [Live Architecture](#-system-architecture) • [Getting Started](#-getting-started) • [API Docs](#-rest-api-reference) • [Deployment](#-production-deployment) • [Modules](#-implemented-capabilities--system-modules)

</div>

---

## Table of Contents

- [ Why Smart Resume Coach?](#-why-smart-resume-coach)
- [ Key Capabilities](#-key-capabilities)
  - [1. AI Career Coach & Recruiter Insights](#1-ai-career-coach--recruiter-insights)
  - [2. Interactive STAR Bullet Rewriter Studio](#2-interactive-star-bullet-rewriter-studio)
  - [3. Interactive Missing Keywords Explorer](#3-interactive-missing-keywords-explorer)
  - [4. ATS Compatibility Simulator & Heuristics Matrix](#4-ats-compatibility-simulator--heuristics-matrix)
  - [5. Personal Analysis History & Score Timeline](#5-personal-analysis-history--score-timeline)
  - [6. Flexible Authentication (Clerk & Demo Workspaces)](#6-flexible-authentication-clerk--demo-workspaces)
  - [7. Dual-Database Resilience & Export](#7-dual-database-resilience--export)
- [ System Architecture](#-system-architecture)
- [ Monorepo Structure](#-monorepo-structure)
- [ Getting Started](#-getting-started)
  - [Prerequisites](#prerequisites)
  - [Backend Setup](#1-backend-setup)
  - [Frontend Setup](#2-frontend-setup)
  - [Docker & Docker Compose](#3-docker--docker-compose-quickstart)
- [ Environment Variables](#-environment-variables)
- [ REST API Reference](#-rest-api-reference)
- [ Testing & Quality Assurance](#-testing--quality-assurance)
- [ Production Deployment & CI/CD](#-production-deployment--cicd)
- [ Troubleshooting & FAQ](#-troubleshooting--faq)
- [ Implemented Capabilities & System Modules](#-implemented-capabilities--system-modules)
- [ License](#-license)

---

## Why Smart Resume Coach?

Most online resume scanners are frustrating black boxes. They output sterile scores like *"64/100"* without explaining *why* or giving candidates actionable phrases to improve.

**Smart Resume Coach bridges the gap between machine algorithms and human recruiters:**

| The Traditional Way | The Smart Resume Coach Way |
| :--- | :--- |
| Robotic, passive critique that hurts candidate confidence | **Empathetic AI Career Coach** sharing 1-on-1 career encouragement |
| Generic advice like *"Add more metrics"* | **Interactive STAR Rewriter** transforming weak bullets into quantified business wins |
| Flat list of missing keywords | **Interactive Keyword Explorer** with copyable, role-tailored bullet examples |
| Unclear ATS rejection reasons | **ATS Simulator** showing the exact points gained by fixing formatting or keywords |
| One-off static scans | **Personal History & Score Evolution Timeline** tracking improvement across iterations |

---

## Key Capabilities

### 1. AI Career Coach & Recruiter Insights
- **Conversational 1-on-1 Feedback**: The AI reviews your resume from the perspective of an executive tech recruiter with 12+ years of hiring experience.
- **"Listen to Coach" Speech Audio**: Uses the browser SpeechSynthesis API so you can listen to the AI coach read your personal career feedback aloud.
- **6-Second Recruiter Glance**: Simulates eye-tracking first impressions to show what recruiters notice in the critical first 6 seconds.
- **Priority Action Plan (Quick Wins)**: 3 high-impact adjustments you can make in under 15 minutes, with an interactive completion checklist.
- **Recognized Strengths**: Highlights what you already did well to celebrate your engineering achievements.

### 2. Interactive STAR Bullet Rewriter Studio
Transform passive task descriptions into recruiter-attracting, metric-driven achievements:

| Style | Weak Resume Bullet | Rewritten with STAR Method |
| :--- | :--- | :--- |
| **Metric-Driven** | *"Helped team with backend APIs."* | *"Architected and deployed 5+ RESTful microservices in Python/FastAPI, reducing API latency by 35% across 10k+ daily requests."* |
| **Technical Leadership** | *"Responsible for database performance."* | *"Spearheaded database query optimization and PostgreSQL indexing, achieving 99.9% uptime and eliminating checkout query bottlenecks."* |

- Supports target tracks: **Full Stack Engineer**, **Backend (Python/Go)**, **Frontend (React)**, **DevOps & Cloud**, **Data Science & ML**.
- 1-click copy to clipboard with instant animated feedback.

### 3. Interactive Missing Keywords Explorer
- High-priority keywords detected by Gemini are displayed as interactive chips.
- Clicking any keyword displays:
  - **Recruiter rationale**: Why ATS filters and engineering hiring managers look for this skill.
  - **Sample STAR bullet**: A complete, copyable bullet integrating the keyword naturally.
  - **Interactive Checkbox**: Mark keywords as integrated to track your edits in real time.

### 4. ATS Compatibility Simulator & Heuristics Matrix
- **Interactive "What-If" Score Booster**: Test how fixing ATS bottlenecks directly impacts your score:
  - `+10 pts`: Integrate 3+ high-priority missing technical keywords.
  - `+8 pts`: Quantify project outcomes with percentages and scale.
  - `+6 pts`: Clean non-standard Unicode characters and multi-column layouts.
  - `+4 pts`: Standardize section headings and contact details.
- Machine readability checklist: verifies text extraction, standard fonts, and ATS-friendly headers.

### 5. Personal Analysis History & Score Timeline
- **Score Evolution Timeline**: An interactive visual bar chart tracking score progression across all your resume versions.
- **Side-by-Side Version Comparison**: Compare any two resume scans side-by-side with color-coded score deltas (`+14 pts` on ATS, `+8 pts` on Keywords).
- Search past analyses by filename or keywords; filter by score tiers (*All*, *80+ Excellent*, *60–79 Moderate*, *<60 Needs Work*).
- Re-open full reports at any time or delete past records with confirmation.

### 6. Flexible Authentication (Clerk & Demo Workspaces)
- **Clerk Integration**: Seamlessly connect your live Clerk authentication by adding `VITE_CLERK_PUBLISHABLE_KEY` in `frontend/.env`.
- **Built-in Workspace Personas**: Includes instant demo accounts (*Haymanot Getachew*, *Jordan Taylor*, *Sarah Chen*) and custom email login for offline testing.
- **Authenticated API Headers**: User sessions automatically pass `X-User-Id` and `Authorization: Bearer <token>` to isolate and persist resumes per user.

### 7. Dual-Database Resilience & Export
- **Dual Persistence Architecture**: Saves to **Supabase (PostgreSQL)** when online; automatically falls back to an embedded **SQLite (`local_resumes.db`)** database and browser `localStorage` if offline or during testing.
- **Export Action Report**: 1-click export of your complete diagnostic audit and coach notes as a clean Markdown file (`.md`).
- **Theme Support**: Polished Dark and Light modes with system preference auto-detection.

---

## System Architecture

```
                          ┌───────────────────────────────────────┐
                          │         Client Layer (Vite + React)   │
                          │   • NavigationHeader & UserNav        │
                          │   • CoachPersonaCard & Audio Player   │
                          │   • STAR Bullet Rewriter Studio       │
                          │   • ATS Compatibility Simulator       │
                          │   • Score Evolution History Timeline  │
                          └───────────────────┬───────────────────┘
                                              │ Axios REST
                                              ▼
                          ┌───────────────────────────────────────┐
                          │        Backend API (FastAPI)          │
                          │   • /analyze       • /history         │
                          │   • /upload-resume • /rewrite-bullet  │
                          │   • /health        • CORS Middleware  │
                          └───────────┬───────────────┬───────────┘
                                      │               │
                          PDF Bytes   ▼               ▼ Structured Prompt
                          ┌────────────────┐   ┌────────────────────────┐
                          │  pdfminer.six  │   │   Google Gemini API    │
                          │ (PDF Parser)   │   │  (gemini-3.5-flash)    │
                          └────────────────┘   └────────────────────────┘
                                      │
                 ┌────────────────────┴────────────────────┐
                 │                                         │
        Online REST Client                        Offline Local Fallback
                 ▼                                         ▼
     ┌────────────────────────┐               ┌────────────────────────┐
     │  Supabase (Postgres)   │               │   SQLite Database      │
     │  public.resumes table  │               │   (local_resumes.db)   │
     └────────────────────────┘               └────────────────────────┘
```

---

## Monorepo Structure

```
.
├── .github/
│   └── workflows/
│       └── ci-cd.yml                # Automated GitHub Actions CI/CD pipeline
├── backend/
│   ├── app/
│   │   ├── main.py                  # FastAPI application & REST route definitions
│   │   ├── db.py                    # Dual Supabase + SQLite database repository
│   │   └── utils/
│   │       ├── parse_resume.py      # PDF text extraction via pdfminer.six
│   │       └── generate_feedback.py # Gemini multi-model fallback & coach prompt
│   ├── test_api.py                  # Pytest automated test suite
│   ├── test_feedback.py             # Standalone Gemini integration script
│   ├── requirements.txt             # Python production dependencies
│   ├── Dockerfile                   # Python 3.12 slim container build
│   ├── .env.example                 # Backend environment variable template
│   └── .env                         # Backend secrets (gitignored)
├── frontend/
│   ├── src/
│   │   ├── App.tsx                  # Main app coordinator with tab routing
│   │   ├── types.ts                 # TypeScript type definitions
│   │   ├── context/
│   │   │   ├── auth-types.ts        # Auth data models & demo personas
│   │   │   ├── AuthContext.tsx      # Dual Clerk + Demo AuthProvider
│   │   │   └── useAuth.ts           # Fast-refresh isolated useAuth hook
│   │   ├── components/
│   │   │   ├── NavigationHeader.tsx # Top navbar with tabs, theme toggle & UserNav
│   │   │   ├── UserNav.tsx          # User profile menu, avatar & sign-out
│   │   │   ├── AuthModal.tsx        # Sign-in modal with quick persona selector
│   │   │   ├── CoachPersonaCard.tsx # AI Career Coach note, voice player & glance
│   │   │   ├── BulletRewriter.tsx   # Interactive STAR bullet rewriter studio
│   │   │   ├── InteractiveKeywords.tsx # Missing keywords explorer with sample bullets
│   │   │   ├── ATSChecklist.tsx     # ATS heuristics simulator & score booster
│   │   │   ├── HistoryPage.tsx      # Score evolution timeline & version comparison
│   │   │   ├── Dropzone.tsx         # Drag-and-drop PDF uploader
│   │   │   ├── FileChip.tsx         # Uploaded file badge with remove action
│   │   │   ├── ScoreCard.tsx        # Animated SVG circular score indicator
│   │   │   ├── FeedbackDisplay.tsx  # Full audit display with confetti & export
│   │   │   ├── FeedbackSection.tsx  # Collapsible feedback critique cards
│   │   │   ├── LoadingState.tsx     # Multi-step recruiter simulation progress
│   │   │   ├── ErrorBanner.tsx      # Dismissible error notification banner
│   │   │   └── ResetButton.tsx      # Re-upload state reset button
│   │   ├── utils/
│   │   │   ├── api.ts               # Axios client with offline localStorage sync
│   │   │   └── validation.ts        # File size and PDF MIME type validation
│   │   └── styles/
│   │       └── design-tokens.ts     # Color system, spacing, and typography
│   ├── nginx.conf                   # Production Nginx reverse proxy with gzip
│   ├── Dockerfile                   # Multi-stage Docker build (Node 20 -> Nginx)
│   ├── vercel.json                  # Vercel SPA deployment configuration
│   ├── .env.example                 # Frontend environment variable template
│   └── package.json
├── docker-compose.yml               # Multi-container orchestration with health checks
├── render.yaml                      # Render.com Blueprint deployment specification
└── README.md
```

---

## Getting Started

### Prerequisites

- **Node.js**: v20 or higher
- **Python**: 3.10 or higher
- **Google Gemini API Key**: Free at [aistudio.google.com](https://aistudio.google.com)
- **Supabase Account** *(optional)*: Free at [supabase.com](https://supabase.com) (SQLite fallback activates automatically if Supabase is offline)

---

### 1. Backend Setup

```bash
cd backend

# Create virtual environment
python3 -m venv venv

# Activate virtual environment
source venv/bin/activate       # macOS / Linux
# venv\Scripts\activate        # Windows PowerShell

# Install dependencies
pip install -r requirements.txt
```

Create `backend/.env` (or copy from `.env.example`):

```bash
cp .env.example .env
```

Edit `backend/.env` with your keys:

```env
GEMINI_API_KEY=your_gemini_api_key_here
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your_supabase_anon_key_here
```

Start the FastAPI development server:

```bash
uvicorn app.main:app --reload --port 8000
```

- **Swagger API Docs**: `http://localhost:8000/docs`
- **Health Check**: `http://localhost:8000/health`

---

### 2. Frontend Setup

In a new terminal window:

```bash
cd frontend

# Install dependencies
npm install
```

Create `frontend/.env`:

```bash
cp .env.example .env
```

Start the Vite development server:

```bash
npm run dev
```

Visit **`http://localhost:5173`** in your browser.

---

### 3. Docker & Docker Compose Quickstart

Run both backend and frontend in containerized environments with automatic dependency ordering and health monitoring:

```bash
docker compose up --build
```

- **Frontend Application**: `http://localhost:5173`
- **Backend API**: `http://localhost:8000`

---

##  Environment Variables

### Backend (`backend/.env`)

| Variable | Description | Required? | Where to get it |
| :--- | :--- | :---: | :--- |
| `GEMINI_API_KEY` | Google Gemini AI API key | **Yes** | [Google AI Studio](https://aistudio.google.com) |
| `SUPABASE_URL` | Supabase project URL (`https://xyz.supabase.co`) | *Optional* | [Supabase Dashboard](https://supabase.com) |
| `SUPABASE_KEY` | Supabase anon public API key | *Optional* | [Supabase Dashboard](https://supabase.com) |

>  **Offline / Zero-Config Notice:** If `SUPABASE_URL` is omitted or network access is restricted, the backend automatically persists all analyses to an embedded SQLite database (`local_resumes.db`).

### Frontend (`frontend/.env`)

| Variable | Description | Required? | Where to get it |
| :--- | :--- | :---: | :--- |
| `VITE_API_URL` | FastAPI backend URL | **Yes** | Defaults to `http://localhost:8000` |
| `VITE_CLERK_PUBLISHABLE_KEY` | Clerk publishable key (`pk_test_...`) | *Optional* | [Clerk Dashboard](https://clerk.com) |

> **Demo Workspaces:** If `VITE_CLERK_PUBLISHABLE_KEY` is not provided, the frontend automatically activates the built-in demo workspace provider so you can test immediately without creating a Clerk account.

---

## REST API Reference

### 1. Health Probe
Check service status for load balancers and container orchestrators.

```bash
curl -X GET http://localhost:8000/health
```

**Response (`200 OK`):**
```json
{
  "status": "healthy",
  "service": "smart-resume-feedback-api",
  "version": "1.0.0"
}
```

---

### 2. Analyze Resume
Upload a PDF resume to trigger text extraction, Gemini scoring, recruiter coaching, and history storage.

```bash
curl -X POST http://localhost:8000/analyze \
  -H "X-User-Id: user_candidate_123" \
  -F "file=@/path/to/my_resume.pdf"
```

**Response (`200 OK`):**
```json
{
  "message": "Resume analyzed successfully",
  "id": "c8b417e0-91a5-485a-8b85-0ec353a8bf31",
  "filename": "my_resume.pdf",
  "user_id": "user_candidate_123",
  "created_at": "2026-10-22T19:30:00Z",
  "feedback": {
    "overall_score": 78,
    "formatting": {
      "score": 75,
      "feedback": "Clean layout with standard section headings; inconsistent bullet punctuation."
    },
    "keywords": {
      "score": 80,
      "feedback": "Strong Python fundamentals; add cloud deployment and database tooling.",
      "missing_suggestions": ["Docker", "Kubernetes", "CI/CD", "PostgreSQL"]
    },
    "ats_optimization": {
      "score": 78,
      "feedback": "Single-column format passes standard parsers. Ensure email is plain text."
    },
    "summary": "Solid full-stack developer profile with strong backend experience...",
    "coach_note": "Hey! Your backend microservice project grabbed my attention immediately...",
    "recruiter_glance": "In 6 seconds, a recruiter notices Python and Docker, but wants scale metrics.",
    "quick_wins": [
      {
        "title": "Quantify backend API traffic",
        "impact": "High",
        "how_to_fix": "Add requests/sec or percentage latency reduction to your bullets."
      }
    ],
    "strengths": [
      "Hands-on experience with modern web stacks",
      "Clear chronological career progression"
    ]
  }
}
```

---

### 3. Personal History
Retrieve past resume analysis reports for the authenticated user.

```bash
curl -X GET "http://localhost:8000/history?user_id=user_candidate_123&limit=20&offset=0"
```

**Response (`200 OK`):**
```json
{
  "user_id": "user_candidate_123",
  "total": 3,
  "items": [
    {
      "id": "c8b417e0-91a5-485a-8b85-0ec353a8bf31",
      "user_id": "user_candidate_123",
      "filename": "Resume_v2.pdf",
      "created_at": "2026-10-22T19:30:00Z",
      "feedback": { "overall_score": 85 }
    }
  ]
}
```

---

### 4. Delete Analysis Record
Delete a specific analysis record from history.

```bash
curl -X DELETE "http://localhost:8000/history/c8b417e0-91a5-485a-8b85-0ec353a8bf31"
```

**Response (`200 OK`):**
```json
{
  "message": "Analysis record deleted successfully",
  "id": "c8b417e0-91a5-485a-8b85-0ec353a8bf31"
}
```

---

### 5. STAR Bullet Point Rewriter
Transform any weak bullet point into high-impact STAR options.

```bash
curl -X POST http://localhost:8000/rewrite-bullet \
  -H "Content-Type: application/json" \
  -d '{
    "bullet": "Worked on python web application for orders",
    "target_role": "Full Stack Software Engineer"
  }'
```

**Response (`200 OK`):**
```json
{
  "original": "Worked on python web application for orders",
  "suggestions": [
    {
      "style": "Metric-Driven (Results focus)",
      "rewritten": "Architected order-processing services in Python/FastAPI handling 15,000+ daily orders, reducing checkout latency by 32%.",
      "why_it_works": "Quantifies scale and demonstrates direct business impact."
    },
    {
      "style": "Technical Leadership (Scope & Scale focus)",
      "rewritten": "Spearheaded end-to-end refactor of order fulfillment workflows, collaborating cross-functionally to achieve 99.9% uptime.",
      "why_it_works": "Highlights technical initiative, collaboration, and high availability."
    }
  ],
  "key_power_verbs": ["Architected", "Spearheaded", "Engineered"]
}
```

---

##  Testing & Quality Assurance

Run the automated backend test suite:

```bash
cd backend
pytest test_api.py -v
```

Run frontend linting and type checks:

```bash
cd frontend
npm run lint
npm run build
```

---

## Production Deployment & CI/CD

### 1. Render.com (1-Click Blueprint)
A [`render.yaml`](render.yaml) file is included at the repository root:
1. Push your repository to GitHub.
2. In the [Render Dashboard](https://dashboard.render.com), click **New +** → **Blueprint**.
3. Select your repository. Render automatically provisions:
   - **FastAPI Web Service**: Python 3.12 environment with automated `/health` probes.
   - **Vite Static Frontend**: Built with automated SPA routing rewrites.
4. Set the environment secrets (`GEMINI_API_KEY`, `SUPABASE_URL`, `SUPABASE_KEY`).

### 2. Vercel (Frontend SPA)
A [`frontend/vercel.json`](frontend/vercel.json) file is pre-configured with SPA rewrites and asset caching:
1. In [Vercel](https://vercel.com), click **Add New** → **Project** and select `frontend`.
2. Set `VITE_API_URL` to your production backend URL.
3. Deploy!

### 3. GitHub Actions CI/CD
The automated workflow ([`.github/workflows/ci-cd.yml`](.github/workflows/ci-cd.yml)) triggers on every push and pull request to `main`:
- **Frontend Job**: Node 20 environment, `npm ci`, ESLint, and Vite TypeScript compilation.
- **Backend Job**: Python 3.12 environment, dependency verification, and pytest suite.
- **Docker Validation Job**: Builds both backend and frontend Docker container images to guarantee production deployability.

---

##  Troubleshooting & FAQ

<details>
<summary><strong>Q: What if my resume is a scanned PDF (image-based)?</strong></summary>

The parser uses `pdfminer.six` to extract selectable text directly from the PDF stream. If your resume is an image or scan without selectable text, the backend returns a friendly `422 Unprocessable Entity` error: *"Resume text is empty — the PDF may be scanned or image-based."* Convert your resume to a text-based PDF using Word, Google Docs, or LaTeX.
</details>

<details>
<summary><strong>Q: What if I don't have a Supabase account or my network blocks IPv6?</strong></summary>

You don't need Supabase to use the tool! The backend implements an automatic dual-persistence repository: if Supabase credentials are not provided or if the database is unreachable, it automatically stores all records in a local SQLite database (`local_resumes.db`) and browser `localStorage`.
</details>

<details>
<summary><strong>Q: How do I hook up live Clerk authentication?</strong></summary>

1. Sign up for free at [clerk.com](https://clerk.com).
2. Create an application and copy your **Publishable Key** (`pk_test_...`).
3. Add `VITE_CLERK_PUBLISHABLE_KEY=pk_test_...` to `frontend/.env`.
4. Restart Vite (`npm run dev`). The app will automatically switch from demo personas to live Clerk authentication!
</details>

<details>
<summary><strong>Q: Which Gemini model does the backend use?</strong></summary>

The backend uses Google's latest `gemini-3.5-flash` model with automated fallback to `gemini-3.5-flash-lite` and `gemini-3.8-flash` if rate limits or high-demand spikes occur.
</details>

---

## Implemented Capabilities & System Modules

- [x] **In-Memory PDF Parsing (`pdfminer.six`)**: Fast byte-stream extraction without storing raw temporary files.
- [x] **Google Gemini AI Integration**: Multi-tier model fallback (`gemini-3.5-flash`, `gemini-3.5-flash-lite`, `gemini-3.8-flash`) with structured JSON extraction.
- [x] **Interactive Upload Interface**: Drag-and-drop validation, animated circular score indicators, and collapsible audit cards.
- [x] **User Authentication**: Clerk authentication ready (`@clerk/clerk-react`) + zero-config built-in demo profiles and session persistence.
- [x] **Personal Analysis History**: Dedicated history view, visual Score Evolution Timeline chart, and side-by-side resume comparison with delta tags.
- [x] **AI Career Coach**: Personalized strategy note with in-browser voice synthesis, 6-second glance, and priority quick wins.
- [x] **Interactive STAR Bullet Rewriter Studio**: Transforms passive task descriptions into metric-driven and leadership achievements.
- [x] **ATS Compatibility Simulator**: Interactive toggles demonstrating simulated score improvements before submitting.
- [x] **Production Deployment & CI/CD**: Automated GitHub Actions workflow, Docker Compose with health checks, Render Blueprint, and Vercel configuration.

---

## License

This project is licensed under the [MIT License](LICENSE).
