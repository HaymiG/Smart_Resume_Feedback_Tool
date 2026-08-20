from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi import FastAPI, UploadFile, File, HTTPException
from app.utils.parse_resume import parse_resume
from app.db import supabase
import uuid

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # Vite's default port
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/upload-resume")
async def upload_resume(file: UploadFile = File(...)):
    # 1. Basic validation — only accept PDFs
    if file.content_type != "application/pdf":
        raise HTTPException(status_code=400, detail="Only PDF files are accepted")

    # 2. Read the raw bytes from the uploaded file
    file_bytes = await file.read()

    # 3. Extract text using your existing utility function
    try:
        raw_text = parse_resume(file_bytes)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to parse PDF: {str(e)}")

    # 4. Insert into Supabase
    new_row = {
        "id": str(uuid.uuid4()),
        "user_id": "test-user",  # placeholder until we add real auth
        "raw_text": raw_text,
        "feedback": None,
    }

    result = supabase.table("resumes").insert(new_row).execute()

    return {
        "message": "Resume uploaded and parsed successfully",
        "id": new_row["id"],
        "text_preview": raw_text[:200]  # just first 200 chars so the response isn't huge
    }