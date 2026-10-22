import uuid
from typing import Optional
from fastapi import FastAPI, UploadFile, File, HTTPException, Header, Query
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from app.utils.parse_resume import parse_resume
from app.utils.generate_feedback import generate_feedback, rewrite_bullet
from app.db import (
    save_resume_analysis,
    list_user_history,
    get_resume_by_id,
    delete_resume_by_id,
)

app = FastAPI(
    title="Smart Resume Feedback Tool API",
    description="AI-powered resume analysis, ATS scoring, and recruiter coach assistance.",
    version="1.0.0",
)

# Allow local dev and production frontend origins
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://localhost:3000",
        "http://localhost:80",
        "http://127.0.0.1:5173",
        "*",  # Permissive for container and cloud deployment
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class BulletRewriteRequest(BaseModel):
    bullet: str
    target_role: Optional[str] = None


def extract_user_id(
    authorization: Optional[str] = None,
    x_user_id: Optional[str] = None,
    user_id_param: Optional[str] = None,
) -> str:
    """
    Extracts user_id from custom header, bearer token, or parameter.
    Defaults to 'guest-user' if not authenticated.
    """
    if x_user_id and x_user_id.strip():
        return x_user_id.strip()

    if user_id_param and user_id_param.strip():
        return user_id_param.strip()

    if authorization and authorization.startswith("Bearer "):
        token = authorization.replace("Bearer ", "").strip()
        # If token is formatted or user ID is embedded, use it or fallback to token slice
        if token and len(token) > 0 and token != "null":
            return f"user_{token[:16]}"

    return "guest-user"


@app.get("/health")
def health_check():
    """Service health probe for CI/CD, container orchestration, and load balancers."""
    return {
        "status": "healthy",
        "service": "smart-resume-feedback-api",
        "version": "1.0.0",
    }


@app.post("/upload-resume")
async def upload_resume(
    file: UploadFile = File(...),
    authorization: Optional[str] = Header(None),
    x_user_id: Optional[str] = Header(None),
):
    """
    Accepts a PDF resume, parses its text, and stores the initial record.
    """
    if file.content_type != "application/pdf" and not (file.filename and file.filename.lower().endswith(".pdf")):
        raise HTTPException(status_code=400, detail="Only PDF files are accepted")

    file_bytes = await file.read()
    try:
        raw_text = parse_resume(file_bytes)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to parse PDF: {str(e)}")

    user_id = extract_user_id(authorization, x_user_id)
    record_id = str(uuid.uuid4())

    save_resume_analysis(
        record_id=record_id,
        user_id=user_id,
        raw_text=raw_text,
        feedback=None,
        filename=file.filename or "resume.pdf",
    )

    return {
        "message": "Resume uploaded and parsed successfully",
        "id": record_id,
        "filename": file.filename or "resume.pdf",
        "text_preview": raw_text[:200],
    }


@app.post("/analyze")
async def analyze_resume(
    file: UploadFile = File(...),
    authorization: Optional[str] = Header(None),
    x_user_id: Optional[str] = Header(None),
    user_id: Optional[str] = Query(None),
):
    """
    Analyzes a PDF resume with Gemini AI, generates humanized coach feedback,
    and saves the analysis to the user's history.
    """
    if file.content_type != "application/pdf" and not (file.filename and file.filename.lower().endswith(".pdf")):
        raise HTTPException(status_code=400, detail="Only PDF files are accepted")

    file_bytes = await file.read()
    try:
        raw_text = parse_resume(file_bytes)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to parse PDF: {str(e)}")

    if not raw_text or not raw_text.strip():
        raise HTTPException(
            status_code=422,
            detail="Resume text is empty — the PDF may be scanned or image-based",
        )

    try:
        feedback = generate_feedback(raw_text)
    except ValueError as e:
        raise HTTPException(status_code=422, detail=str(e))
    except RuntimeError as e:
        raise HTTPException(
            status_code=502, detail=f"AI feedback generation failed: {str(e)}"
        )

    resolved_user_id = extract_user_id(authorization, x_user_id, user_id)
    record_id = str(uuid.uuid4())

    saved_record = save_resume_analysis(
        record_id=record_id,
        user_id=resolved_user_id,
        raw_text=raw_text,
        feedback=feedback,
        filename=file.filename or "resume.pdf",
    )

    return {
        "message": "Resume analyzed successfully",
        "id": record_id,
        "filename": file.filename or "resume.pdf",
        "user_id": resolved_user_id,
        "created_at": saved_record.get("created_at"),
        "feedback": feedback,
    }


@app.get("/history")
def get_history(
    user_id: Optional[str] = Query(None),
    authorization: Optional[str] = Header(None),
    x_user_id: Optional[str] = Header(None),
    limit: int = Query(50, ge=1, le=100),
    offset: int = Query(0, ge=0),
):
    """
    Returns personal analysis history for the authenticated user.
    """
    resolved_user_id = extract_user_id(authorization, x_user_id, user_id)
    history_items = list_user_history(user_id=resolved_user_id, limit=limit, offset=offset)

    return {
        "user_id": resolved_user_id,
        "total": len(history_items),
        "items": history_items,
    }


@app.get("/history/{resume_id}")
def get_history_detail(
    resume_id: str,
    user_id: Optional[str] = Query(None),
    authorization: Optional[str] = Header(None),
    x_user_id: Optional[str] = Header(None),
):
    """
    Retrieves a specific past resume analysis report.
    """
    resolved_user_id = extract_user_id(authorization, x_user_id, user_id)
    item = get_resume_by_id(resume_id, user_id=resolved_user_id)

    if not item:
        # Also try without user_id restriction if matching id exists
        item = get_resume_by_id(resume_id)

    if not item:
        raise HTTPException(status_code=404, detail="Analysis record not found")

    return item


@app.delete("/history/{resume_id}")
def delete_history_item(
    resume_id: str,
    user_id: Optional[str] = Query(None),
    authorization: Optional[str] = Header(None),
    x_user_id: Optional[str] = Header(None),
):
    """
    Deletes an analysis record from the user's history.
    """
    resolved_user_id = extract_user_id(authorization, x_user_id, user_id)
    deleted = delete_resume_by_id(resume_id, user_id=resolved_user_id)

    if not deleted:
        # Try deleting by id
        deleted = delete_resume_by_id(resume_id)

    if not deleted:
        raise HTTPException(status_code=404, detail="Record not found or already deleted")

    return {"message": "Analysis record deleted successfully", "id": resume_id}


@app.post("/rewrite-bullet")
def rewrite_bullet_endpoint(request: BulletRewriteRequest):
    """
    Interactive tool: Rewrites a candidate's bullet point into STAR format options.
    """
    if not request.bullet or not request.bullet.strip():
        raise HTTPException(status_code=400, detail="Bullet point text is required")

    result = rewrite_bullet(request.bullet, request.target_role or "")
    return result
