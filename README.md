# Smart Resume Feedback Tool

Upload a resume, get instant AI-powered feedback on formatting, keywords, and ATS (Applicant Tracking System) optimization.

## Overview

This is a full-stack application that parses an uploaded PDF resume, sends the extracted text to Google Gemini for analysis, and returns structured, actionable feedback — a formatting review, missing keyword suggestions, ATS compatibility tips, and an overall score.

## Tech Stack

| Layer      | Technology                                      |
|------------|--------------------------------------------------|
| Frontend   | Vite + React (TypeScript), Tailwind CSS, react-dropzone, Axios |
| Backend    | FastAPI (Python)                                |
| AI         | Google Gemini API (`gemini-3.6-flash`, via `google-genai` SDK, JSON mode) |
| Database   | Supabase (Postgres) via `supabase-py` client    |
| Parsing    | pdfminer.six                                     |
| Auth       | Placeholder (`test-user`) — ready for NextAuth.js or Clerk integration |

> **Note:** Direct Postgres connections (e.g. SQLAlchemy) aren't used in this project — the dev network doesn't support IPv6, which direct Postgres connections require. All database access goes through the `supabase-py` REST client instead.

## Project Structure

```
.
├── frontend/          # Vite + React app (TypeScript)
│   ├── src/
│   │   ├── App.tsx                    # Main app with state machine (idle → analyzing → success/error)
│   │   ├── main.tsx                   # Entry point
│   │   ├── types.ts                   # TypeScript types for API responses
│   │   ├── utils/
│   │   │   ├── api.ts                 # API client (analyzeResume)
│   │   │   └── validation.ts          # File validation utilities
│   │   ├── components/
│   │   │   ├── Dropzone.tsx           # Drag-and-drop file upload with validation
│   │   │   ├── FileChip.tsx           # Selected file display with remove action
│   │   │   ├── AnalyzeButton.tsx      # Primary action button with loading state
│   │   │   ├── ErrorBanner.tsx        # Error display with dismiss
│   │   │   ├── LoadingState.tsx       # Animated loading spinner
│   │   │   ├── FeedbackDisplay.tsx    # Results container with ScoreCard + FeedbackSection
│   │   │   ├── FeedbackSection.tsx    # Expandable feedback sections (Formatting, Keywords, ATS)
│   │   │   ├── ScoreCard.tsx          # Visual score display with progress ring
│   │   │   └── ResetButton.tsx        # Reset to upload state
│   │   └── styles/
│   │       └── design-tokens.ts       # Design tokens (colors, spacing, typography)
│   ├── .env                           # VITE_API_URL
│   └── package.json
├── backend/           # FastAPI app
│   ├── app/
│   │   ├── main.py                    # FastAPI app, routes: /upload-resume, /analyze
│   │   ├── db.py                      # Supabase client initialization
│   │   └── utils/
│   │       ├── parse_resume.py        # parse_resume() — PDF text extraction via pdfminer.six
│   │       └── generate_feedback.py   # generate_feedback() — Gemini API call with structured prompt
│   ├── test_feedback.py               # Standalone test for generate_feedback()
│   ├── requirements.txt
│   └── .env
├── .gitignore          # Root-level, covers both frontend/ and backend/
└── README.md
```

## Features

- **Drag-and-drop resume upload** — PDF only, max 5MB, with client-side validation (file type + size)
- **Automatic text extraction** from PDF via `pdfminer.six`
- **AI-generated feedback**, returned as structured JSON:
  - **Formatting** — sections, bullet points, structure consistency (score + feedback)
  - **Keywords** — technical skills, action verbs, missing suggestions (score + feedback + array)
  - **ATS Optimization** — tables, headers/footers, clean structure (score + feedback)
  - **Overall Score** — weighted score out of 100 with summary
- **Persistent history** — past analyses stored per user in Supabase (currently `test-user` placeholder)
- **Theme support** — Light/dark mode with system preference detection and localStorage persistence
- **Responsive design** — Mobile-first, works on all screen sizes
- **Accessible UI** — Semantic HTML, ARIA labels, focus management, reduced motion support

## Prerequisites

- Node.js 18+
- Python 3.10+
- A Supabase project (free tier) — [supabase.com](https://supabase.com)
- A Google Gemini API key (free) — [aistudio.google.com](https://aistudio.google.com)

## Getting Started

### 1. Clone and set up the monorepo

```bash
git clone https://github.com/HaymiG/Smart_Resume_Feedback_Tool.git
cd Smart_Resume_Feedback_Tool
```

### 2. Backend setup

```bash
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
```

Create `backend/.env`:

```
GEMINI_API_KEY=your-gemini-key
SUPABASE_URL=https://your-project-ref.supabase.co
SUPABASE_KEY=your-publishable-key
```

Create the `resumes` table in Supabase (SQL Editor):

```sql
create table resumes (
  id uuid primary key default gen_random_uuid(),
  user_id text,
  raw_text text,
  feedback jsonb,
  created_at timestamp with time zone default now()
);

grant usage on schema public to anon;
grant select, insert, update, delete on public.resumes to anon;
```

Start the backend:

```bash
uvicorn app.main:app --reload
```

Runs at `http://localhost:8000`. Interactive API docs at `http://localhost:8000/docs`.

### 3. Frontend setup

```bash
cd frontend
npm install
```

Create `frontend/.env`:

```
VITE_API_URL=http://localhost:8000
```

Start the frontend:

```bash
npm run dev
```

Visit `http://localhost:5173`.

## API Endpoints

| Method | Endpoint          | Description                              |
|--------|-------------------|-------------------------------------------|
| POST   | `/upload-resume`  | Accepts a PDF, extracts and stores text  |
| POST   | `/analyze`        | Sends resume text to Gemini, stores and returns feedback JSON |

### Example Response from `/analyze`

```json
{
  "message": "Resume analyzed successfully",
  "id": "830c7150-7c45-4d15-a141-273a4f541e69",
  "feedback": {
    "overall_score": 78,
    "formatting": {
      "score": 72,
      "feedback": "Clear section headings, but formatting artifacts and inconsistent bullet punctuation reduce readability."
    },
    "keywords": {
      "score": 84,
      "feedback": "Strong technical keywords and action verbs; could add more modern tooling terms.",
      "missing_suggestions": ["AWS", "CI/CD", "Unit Testing"]
    },
    "ats_optimization": {
      "score": 76,
      "feedback": "Plain-text layout is largely ATS-friendly, but non-standard separators could confuse parsers."
    },
    "summary": "A strong entry-level resume with solid technical foundations; cleaning up formatting artifacts and standardizing bullet structure would improve it most."
  }
}
```

## Development

### Running Tests

```bash
# Backend
cd backend
python test_feedback.py

# Frontend (when tests are added)
cd frontend
npm test
```

### Linting & Formatting

```bash
# Frontend
cd frontend
npm run lint
```

<!-- ## Deployment

- **Frontend:** [Vercel](https://vercel.com) or [Netlify](https://netlify.com)
  - Build command: `npm run build`
  - Output directory: `dist`
  - Environment variable: `VITE_API_URL=https://your-backend-url`
- **Backend:** [Railway](https://railway.app) or [Render](https://render.com)
  - Start command: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
  - Environment variables: `GEMINI_API_KEY`, `SUPABASE_URL`, `SUPABASE_KEY`

Add all environment variables on your deployment platform. -->

## Roadmap

- [x] Phase 1 — Setup & architecture
- [x] Phase 2 — PDF parsing & database
- [x] Phase 3 — Gemini integration
- [x] Phase 4 — Upload UI & results page
- [ ] Phase 5 — Auth, history, deployment
  - [ ] User authentication (NextAuth.js or Clerk)
  - [ ] Personal analysis history page
  - [ ] Production deployment with CI/CD

## License

MIT