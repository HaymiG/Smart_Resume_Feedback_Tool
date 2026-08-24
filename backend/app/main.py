from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi import FastAPI, UploadFile, File, HTTPException
from app.utils.parse_resume import parse_resume
from app.db import supabase
import uuid
from app.utils.generate_feedback import generate_feedback

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
    
@app.post("/analyze")
async def analyze_resume(resume_id: str):
    # 1. Fetch the resume row from Supabase
    result = supabase.table("resumes").select("*").eq("id", resume_id).execute()

    if not result.data:
        raise HTTPException(status_code=404, detail="Resume not found")

    resume_row = result.data[0]
    raw_text = resume_row.get("raw_text")

    # 2. Guard against empty resumes (e.g. scanned/image-only PDFs)
    if not raw_text or not raw_text.strip():
        raise HTTPException(
            status_code=422,
            detail="Resume text is empty — the PDF may be scanned or image-based"
        )

    # 3. Call Gemini for feedback
    try:
        feedback = generate_feedback(raw_text)
    except ValueError as e:
        raise HTTPException(status_code=422, detail=str(e))
    except RuntimeError as e:
        raise HTTPException(status_code=502, detail=f"AI feedback generation failed: {str(e)}")

    # 4. Store feedback back in Supabase
    update_result = (
        supabase.table("resumes")
        .update({"feedback": feedback})
        .eq("id", resume_id)
        .execute()
    )

    if not update_result.data:
        raise HTTPException(status_code=500, detail="Failed to save feedback to database")

    return {
        "message": "Resume analyzed successfully",
        "id": resume_id,
        "feedback": feedback
    }