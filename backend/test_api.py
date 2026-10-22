import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_health_check():
    response = client.get("/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"
    assert "version" in data

def test_history_empty_or_list():
    response = client.get("/history?user_id=test_ci_user")
    assert response.status_code == 200
    data = response.json()
    assert "items" in data
    assert "total" in data
    assert data["user_id"] == "test_ci_user"

def test_bullet_rewrite():
    response = client.post("/rewrite-bullet", json={"bullet": "Worked on python web app"})
    assert response.status_code == 200
    data = response.json()
    assert "suggestions" in data
    assert len(data["suggestions"]) > 0

def test_upload_invalid_file_type():
    response = client.post(
        "/upload-resume",
        files={"file": ("test.txt", b"plain text", "text/plain")}
    )
    assert response.status_code == 400
