import os
import json
from google import genai
from google.genai import types
from dotenv import load_dotenv

load_dotenv()

client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))

# Models prioritized by availability and speed
MODELS = ["gemini-3.5-flash", "gemini-3.5-flash-lite", "gemini-3.8-flash"]

PROMPT_TEMPLATE = """You are an empathetic senior tech recruiter and executive career coach with 12+ years of hiring experience.
You review resumes not just as an ATS algorithm, but as a caring human mentor who wants to help candidates stand out and land dream interviews.

Analyze the following resume text and return structured feedback as a JSON object with EXACTLY this structure:

{{
    "overall_score": <integer 0-100>,
    "formatting": {{
        "score": <integer 0-100>,
        "feedback": "<2-3 sentence assessment of sections, bullet points, readability, and visual hierarchy>"
    }},
    "keywords": {{
        "score": <integer 0-100>,
        "feedback": "<2-3 sentence assessment of hard technical skills, domain tools, and strong active verbs used>",
        "missing_suggestions": ["<keyword1>", "<keyword2>", "<keyword3>", "<keyword4>"]
    }},
    "ats_optimization": {{
        "score": <integer 0-100>,
        "feedback": "<2-3 sentence assessment of ATS machine-readability — check contact info, tables, multi-column blocks, standard headings>"
    }},
    "summary": "<3-4 sentence overall summary of the candidate's profile and top priority to improve>",
    "coach_note": "<A warm, conversational 3-4 sentence message from the AI Career Coach speaking directly to the candidate in second person ('you'). Acknowledge their strengths, be encouraging, and share one insider recruiter tip>",
    "recruiter_glance": "<A realistic 6-second recruiter first impression: what immediately catches the eye within 6 seconds of scanning>",
    "quick_wins": [
        {{
            "title": "<Short action title, e.g. 'Quantify microservice project metrics'>",
            "impact": "High",
            "how_to_fix": "<1-2 sentence actionable instruction on how to fix this right away>"
        }},
        {{
            "title": "<Action title, e.g. 'Add missing cloud & testing skills'>",
            "impact": "High",
            "how_to_fix": "<1-2 sentence actionable instruction>"
        }},
        {{
            "title": "<Action title, e.g. 'Standardize date formatting'>",
            "impact": "Medium",
            "how_to_fix": "<1-2 sentence actionable instruction>"
        }}
    ],
    "strengths": [
        "<Key candidate strength 1>",
        "<Key candidate strength 2>",
        "<Key candidate strength 3>"
    ]
}}

Resume text:
{resume_text}

Return ONLY the valid JSON object. No markdown, no code fences, no extra text."""


def generate_feedback(resume_text: str) -> dict:
    """
    Sends resume text to Gemini with automated fallback across compatible models.
    Returns structured feedback as a dictionary.
    """
    if not resume_text or not resume_text.strip():
        raise ValueError("Resume text is empty — cannot generate feedback.")

    prompt = PROMPT_TEMPLATE.format(resume_text=resume_text)
    last_error = None

    for model_name in MODELS:
        try:
            response = client.models.generate_content(
                model=model_name,
                contents=prompt,
                config=types.GenerateContentConfig(
                    response_mime_type="application/json",
                    temperature=0.3,
                ),
            )
            raw_text = response.text.strip()
            # Clean possible markdown wrapping if any
            if raw_text.startswith("```json"):
                raw_text = raw_text[7:]
            if raw_text.startswith("```"):
                raw_text = raw_text[3:]
            if raw_text.endswith("```"):
                raw_text = raw_text[:-3]
            raw_text = raw_text.strip()

            feedback = json.loads(raw_text)
            return feedback
        except Exception as e:
            last_error = e
            continue

    raise RuntimeError(f"All Gemini models failed: {last_error}")


def rewrite_bullet(bullet: str, target_role: str = "") -> dict:
    """
    Interactive tool: Takes a single weak bullet point from a user's resume
    and transforms it into high-impact STAR (Situation, Task, Action, Result) bullets.
    """
    if not bullet or not bullet.strip():
        raise ValueError("Bullet text cannot be empty.")

    role_ctx = f" for a {target_role} position" if target_role else ""
    prompt = f"""You are a professional resume writer and recruiter coach.
Rewrite the following weak resume bullet point{role_ctx} into two distinct, high-impact options using the STAR method (Situation, Task, Action, Result) with strong action verbs and quantified placeholders.

Weak bullet:
"{bullet}"

Return a JSON object with this EXACT structure:
{{
    "original": "{bullet}",
    "suggestions": [
        {{
            "style": "Metric-Driven (Results focus)",
            "rewritten": "<Action-oriented rewrite highlighting percentages, performance or business outcome>",
            "why_it_works": "<Short 1-sentence explanation of what makes this compelling to recruiters>"
        }},
        {{
            "style": "Technical Leadership (Scope & Scale focus)",
            "rewritten": "<Action-oriented rewrite highlighting architecture, collaboration, or technical mastery>",
            "why_it_works": "<Short 1-sentence explanation of what makes this compelling to recruiters>"
        }}
    ],
    "key_power_verbs": ["<verb1>", "<verb2>", "<verb3>"]
}}

Return ONLY valid JSON. No markdown code blocks."""

    for model_name in MODELS:
        try:
            response = client.models.generate_content(
                model=model_name,
                contents=prompt,
                config=types.GenerateContentConfig(
                    response_mime_type="application/json",
                    temperature=0.4,
                ),
            )
            raw_text = response.text.strip()
            if raw_text.startswith("```json"):
                raw_text = raw_text[7:]
            if raw_text.startswith("```"):
                raw_text = raw_text[3:]
            if raw_text.endswith("```"):
                raw_text = raw_text[:-3]
            return json.loads(raw_text.strip())
        except Exception:
            continue

    # Fallback template if Gemini is unavailable
    return {
        "original": bullet,
        "suggestions": [
            {
                "style": "Metric-Driven",
                "rewritten": f"Engineered and deployed scalable solutions for {bullet.lower().rstrip('.')}, achieving a 25% increase in operational efficiency.",
                "why_it_works": "Frames the task with a strong action verb and quantified outcome."
            },
            {
                "style": "Technical Leadership",
                "rewritten": f"Spearheaded core development of {bullet.lower().rstrip('.')}, collaborating cross-functionally to deliver high-availability systems on schedule.",
                "why_it_works": "Highlights initiative, teamwork, and reliable execution."
            }
        ],
        "key_power_verbs": ["Engineered", "Spearheaded", "Optimized"]
    }
