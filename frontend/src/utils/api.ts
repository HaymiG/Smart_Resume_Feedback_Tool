import axios from 'axios';
import type { FeedbackResponse } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

function getUserFriendlyError(status?: number, detail?: string): string {
  if (!status) {
    return 'Connection failed. Please check your internet.';
  }

  switch (status) {
    case 400:
      return detail || 'Invalid file type. Only PDF files are allowed.';
    case 413:
      return 'File is too large. Max size is 5MB.';
    case 422:
      return detail || 'Resume text is empty — the PDF may be scanned or image-based.';
    case 500:
    case 502:
      return 'Analysis failed. Please try again later.';
    default:
      return detail || 'Something went wrong. Please try again.';
  }
}

export async function analyzeResume(file: File): Promise<FeedbackResponse> {
  const formData = new FormData();
  formData.append('file', file);

  try {
    const response = await axios.post<{ feedback: FeedbackResponse }>(
      `${API_BASE_URL}/analyze`,
      formData,
      {
        headers: { 'Content-Type': 'multipart/form-data' },
        timeout: 30000, // 30 second timeout
      }
    );

    return response.data.feedback;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const status = error.response?.status;
      const detail = error.response?.data?.detail;
      throw new Error(getUserFriendlyError(status, detail));
    }

    throw new Error('Connection failed. Please check your internet.');
  }
}
