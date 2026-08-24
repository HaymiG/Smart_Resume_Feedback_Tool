import os
import json
from google import genai
from google.genai import types
from dotenv import load_dotenv

load_dotenv()

client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))

PROMPT_TEMPLATE = """You are an expert resume reviewer and ATS (Applicant Tracking System) specialist.

Analyze the following resume text and return feedback as a JSON object with EXACTLY this structure:

{{
    "overall_score": <integer 0-100>,
    "formatting": {{
        "score": <integer 0-100>,
        "feedback": "<2-3 sentence assessment of sections, bullet points, structure>"
    }},
    "keywords": {{
        "score": <integer 0-100>,
        "feedback": "<2-3 sentence assessment of technical skills and action verbs used>",
        "missing_suggestions": ["<keyword1>", "<keyword2>", "<keyword3>"]
    }},
    "ats_optimization": {{
        "score": <integer 0-100>,
        "feedback": "<2-3 sentence assessment of ATS-friendliness — flag tables, headers/footers, unusual formatting>"
    }},
    "summary": "<3-4 sentence overall summary with the single most important improvement to make>"
}}

Resume text:
{resume_text}

Return ONLY the JSON object. No markdown, no code fences, no extra text."""


def generate_feedback(resume_text: str) -> dict:
    """
    Sends resume text to Gemini and returns structured feedback as a dict.
    Raises RuntimeError if the API call fails or returns invalid JSON.
    """
    if not resume_text or not resume_text.strip():
        raise ValueError("Resume text is empty — cannot generate feedback.")

    prompt = PROMPT_TEMPLATE.format(resume_text=resume_text)

    try:
        response = client.models.generate_content(
            model="gemini-3.6-flash",
            contents=prompt,
            config=types.GenerateContentConfig(
                response_mime_type="application/json",
                temperature=0.3,
            ),
        )
    except Exception as e:
        raise RuntimeError(f"Gemini API call failed: {e}")

    try:
        feedback = json.loads(response.text)
    except (json.JSONDecodeError, AttributeError) as e:
        raise RuntimeError(f"Gemini returned invalid JSON: {e}")

    return feedback