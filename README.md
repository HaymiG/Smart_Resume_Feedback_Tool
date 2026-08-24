# Smart Resume Feedback Tool

Upload a resume, get instant AI-powered feedback on formatting, keywords, and ATS (Applicant Tracking System) optimization.

## Overview

This is a full-stack application that parses an uploaded PDF resume, sends the extracted text to an LLM for analysis, and returns structured, actionable feedback — a formatting review, missing keyword suggestions, ATS compatibility tips, and an overall score.

## Tech Stack

| Layer      | Technology                                  |
|------------|----------------------------------------------|
| Frontend   | Vite + React (TypeScript), Tailwind CSS, react-dropzone |
| Backend    | FastAPI (Python)                            |
| AI         | Google Gemini API (`gemini-3.6-flash`, via `google-genai` SDK, JSON mode) |
| Database   | Supabase (Postgres) via `supabase-py` client |
| Parsing    | pdfminer.six                                 |
| Auth       | NextAuth.js or Clerk (Phase 5)              |
| Deployment | Vercel (frontend) · Railway/Render (backend)|

> **Note:** Direct Postgres connections (e.g. SQLAlchemy) aren't used in this project — the dev network doesn't support IPv6, which direct Postgres connections require. All database access goes through the `supabase-py` REST client instead.

## Project Structure

```
.
├── frontend/          # Vite + React app (TypeScript)
│   ├── src/
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── .env
│   └── package.json
├── backend/           # FastAPI app
│   ├── app/
│   │   ├── main.py            # FastAPI app, routes: /upload-resume, /analyze
│   │   ├── db.py              # Supabase client
│   │   └── utils/
│   │       ├── parse_resume.py       # parse_resume()
│   │       └── generate_feedback.py  # generate_feedback()
│   ├── test_feedback.py       # standalone test for generate_feedback()
│   ├── requirements.txt
│   └── .env
├── .gitignore          # root-level, covers both frontend/ and backend/
└── README.md
```

## Features

- **Drag-and-drop resume upload** — PDF only, max 5MB, with client-side validation
- **Automatic text extraction** from PDF via `pdfminer.six`
- **AI-generated feedback**, returned as structured JSON:
  - Formatting issues (sections, bullet points, structure)
  - Missing keywords (technical skills, action verbs)
  - ATS optimization tips (tables, headers/footers, clean structure)
  - Overall score out of 100
- **Persistent history** — past analyses stored per user and viewable later
- **Simple auth** — email/password via NextAuth.js or Clerk

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
pip install fastapi uvicorn python-multipart pdfminer.six google-genai supabase python-dotenv
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
npm create vite@latest . -- --template react-ts
npm install
npm install axios react-dropzone
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
| POST   | `/analyze`        | Sends stored resume text to Gemini, stores and returns feedback JSON |

Example response from `/analyze`:

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

<!-- ## Roadmap

- [x] Phase 1 — Setup & architecture
- [x] Phase 2 — PDF parsing & database
- [x] Phase 3 — Gemini integration
- [ ] Phase 4 — Upload UI & results page
- [ ] Phase 5 — Auth, history, deployment -->

<!-- ## Deployment

- **Frontend:** [Vercel](https://vercel.com) or [Netlify](https://netlify.com)
- **Backend:** [Railway](https://railway.app) or [Render](https://render.com)
- Add `GEMINI_API_KEY`, `SUPABASE_URL`, and `SUPABASE_KEY` as environment variables on your deployment platform. -->
