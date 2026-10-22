# app/db.py
import os
import sqlite3
import json
from datetime import datetime, timezone
from typing import Optional, List, Dict, Any
from dotenv import load_dotenv

load_dotenv()

SUPABASE_URL = os.environ.get("SUPABASE_URL")
SUPABASE_KEY = os.environ.get("SUPABASE_KEY")

# Initialize Supabase client if possible
supabase = None
if SUPABASE_URL and SUPABASE_KEY and "supabase.co" in SUPABASE_URL:
    try:
        from supabase import create_client, Client
        supabase = create_client(SUPABASE_URL, SUPABASE_KEY)
    except Exception as e:
        print(f"Warning: Supabase client initialization failed: {e}")
        supabase = None

# SQLite fallback database file
DB_PATH = os.path.join(os.path.dirname(__file__), "..", "local_resumes.db")


def init_sqlite():
    """Initializes local SQLite database with required resumes schema."""
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS resumes (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL,
        filename TEXT,
        raw_text TEXT,
        feedback TEXT,
        created_at TEXT NOT NULL
    )
    """)
    conn.commit()
    conn.close()


init_sqlite()


def save_resume_analysis(
    record_id: str,
    user_id: str,
    raw_text: str,
    feedback: Optional[Dict[str, Any]],
    filename: Optional[str] = "resume.pdf"
) -> Dict[str, Any]:
    """
    Saves an analyzed resume to Supabase or SQLite fallback.
    """
    created_at = datetime.now(timezone.utc).isoformat()
    record = {
        "id": record_id,
        "user_id": user_id or "guest-user",
        "filename": filename or "resume.pdf",
        "raw_text": raw_text,
        "feedback": feedback,
        "created_at": created_at,
    }

    # 1. Try Supabase
    if supabase is not None:
        try:
            supabase.table("resumes").insert(record).execute()
            return record
        except Exception as e:
            print(f"Supabase insert failed, falling back to SQLite: {e}")

    # 2. SQLite fallback
    try:
        conn = sqlite3.connect(DB_PATH)
        cursor = conn.cursor()
        cursor.execute(
            """
            INSERT OR REPLACE INTO resumes (id, user_id, filename, raw_text, feedback, created_at)
            VALUES (?, ?, ?, ?, ?, ?)
            """,
            (
                record["id"],
                record["user_id"],
                record["filename"],
                record["raw_text"],
                json.dumps(record["feedback"]) if record["feedback"] else None,
                record["created_at"],
            ),
        )
        conn.commit()
        conn.close()
    except Exception as e:
        print(f"SQLite insert failed: {e}")

    return record


def list_user_history(user_id: str, limit: int = 50, offset: int = 0) -> List[Dict[str, Any]]:
    """
    Retrieves analysis history for a specific user.
    """
    results: List[Dict[str, Any]] = []

    # 1. Try Supabase
    if supabase is not None:
        try:
            query = (
                supabase.table("resumes")
                .select("id, user_id, filename, feedback, created_at")
                .eq("user_id", user_id)
                .order("created_at", desc=True)
                .range(offset, offset + limit - 1)
            )
            res = query.execute()
            if res.data:
                return res.data
        except Exception as e:
            print(f"Supabase list failed, querying SQLite fallback: {e}")

    # 2. SQLite fallback
    try:
        conn = sqlite3.connect(DB_PATH)
        conn.row_factory = sqlite3.Row
        cursor = conn.cursor()
        cursor.execute(
            """
            SELECT id, user_id, filename, feedback, created_at
            FROM resumes
            WHERE user_id = ?
            ORDER BY created_at DESC
            LIMIT ? OFFSET ?
            """,
            (user_id, limit, offset),
        )
        rows = cursor.fetchall()
        for row in rows:
            raw_fb = row["feedback"]
            parsed_fb = json.loads(raw_fb) if raw_fb else None
            results.append({
                "id": row["id"],
                "user_id": row["user_id"],
                "filename": row["filename"] or "resume.pdf",
                "feedback": parsed_fb,
                "created_at": row["created_at"]
            })
        conn.close()
    except Exception as e:
        print(f"SQLite list failed: {e}")

    return results


def get_resume_by_id(record_id: str, user_id: Optional[str] = None) -> Optional[Dict[str, Any]]:
    """
    Retrieves a single resume analysis by its UUID.
    """
    # 1. Try Supabase
    if supabase is not None:
        try:
            query = supabase.table("resumes").select("*").eq("id", record_id)
            if user_id:
                query = query.eq("user_id", user_id)
            res = query.execute()
            if res.data and len(res.data) > 0:
                return res.data[0]
        except Exception as e:
            print(f"Supabase get failed, querying SQLite: {e}")

    # 2. SQLite fallback
    try:
        conn = sqlite3.connect(DB_PATH)
        conn.row_factory = sqlite3.Row
        cursor = conn.cursor()
        if user_id:
            cursor.execute(
                "SELECT * FROM resumes WHERE id = ? AND user_id = ?",
                (record_id, user_id),
            )
        else:
            cursor.execute("SELECT * FROM resumes WHERE id = ?", (record_id,))
        row = cursor.fetchone()
        conn.close()
        if row:
            raw_fb = row["feedback"]
            parsed_fb = json.loads(raw_fb) if raw_fb else None
            return {
                "id": row["id"],
                "user_id": row["user_id"],
                "filename": row["filename"] or "resume.pdf",
                "raw_text": row["raw_text"],
                "feedback": parsed_fb,
                "created_at": row["created_at"]
            }
    except Exception as e:
        print(f"SQLite get failed: {e}")

    return None


def delete_resume_by_id(record_id: str, user_id: Optional[str] = None) -> bool:
    """
    Deletes a single resume analysis.
    """
    deleted = False

    # 1. Try Supabase
    if supabase is not None:
        try:
            query = supabase.table("resumes").delete().eq("id", record_id)
            if user_id:
                query = query.eq("user_id", user_id)
            query.execute()
            deleted = True
        except Exception as e:
            print(f"Supabase delete failed: {e}")

    # 2. SQLite delete
    try:
        conn = sqlite3.connect(DB_PATH)
        cursor = conn.cursor()
        if user_id:
            cursor.execute("DELETE FROM resumes WHERE id = ? AND user_id = ?", (record_id, user_id))
        else:
            cursor.execute("DELETE FROM resumes WHERE id = ?", (record_id,))
        conn.commit()
        if cursor.rowcount > 0:
            deleted = True
        conn.close()
    except Exception as e:
        print(f"SQLite delete failed: {e}")

    return deleted
