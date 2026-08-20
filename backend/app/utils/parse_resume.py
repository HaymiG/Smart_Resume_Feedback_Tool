from pdfminer.high_level import extract_text
from io import BytesIO


def parse_resume(file_bytes: bytes) -> str:
    """
    Takes raw PDF bytes and returns extracted, cleaned text.
    """
    # pdfminer needs a file-like object, not raw bytes directly
    pdf_stream = BytesIO(file_bytes)
    
    raw_text = extract_text(pdf_stream)
    
    # Basic cleanup: collapse excessive blank lines/whitespace
    cleaned_text = "\n".join(
        line.strip() for line in raw_text.splitlines() if line.strip()
    )
    
    return cleaned_text