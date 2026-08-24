from app.utils.generate_feedback import generate_feedback

sample_resume = """
Haymanot Getachew
CSE student at ASTU

EXPERIENCE
ETTA solution
- Built fullstack web applications using odoo-17
- Collaborated with team on microservices architecture

SKILLS
Python, JavaScript, SQL, Git, Docker

EDUCATION
BS Computer Science and Engineering, ASTU
"""

if __name__ == "__main__":
    print("Sending resume to Gemini...")
    try:
        feedback = generate_feedback(sample_resume)
        print("\n SUCCESS\n")
        import json
        print(json.dumps(feedback, indent=2))
    except Exception as e:
        print(f"\n FAILED: {e}")