import axios from 'axios';
import type {
  FeedbackResponse,
  HistoryItem,
  HistoryResponse,
  BulletRewriteResponse,
  AppUser,
} from '../types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
const LOCAL_HISTORY_STORAGE_KEY = 'smart_resume_feedback_history';

function getUserFriendlyError(status?: number, detail?: string): string {
  if (!status) {
    return 'Connection failed. Please check your internet or server connection.';
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

// Local storage history helpers for offline resilience
export function getLocalHistory(userId?: string): HistoryItem[] {
  try {
    const raw = localStorage.getItem(LOCAL_HISTORY_STORAGE_KEY);
    if (!raw) return [];
    const list: HistoryItem[] = JSON.parse(raw);
    if (!userId) return list;
    return list.filter((item) => !item.user_id || item.user_id === userId);
  } catch {
    return [];
  }
}

export function saveLocalHistoryItem(item: HistoryItem) {
  try {
    const existing = getLocalHistory();
    const updated = [item, ...existing.filter((i) => i.id !== item.id)];
    localStorage.setItem(LOCAL_HISTORY_STORAGE_KEY, JSON.stringify(updated.slice(0, 50)));
  } catch {
    // Ignore storage quota errors
  }
}

export function deleteLocalHistoryItem(id: string) {
  try {
    const existing = getLocalHistory();
    const updated = existing.filter((item) => item.id !== id);
    localStorage.setItem(LOCAL_HISTORY_STORAGE_KEY, JSON.stringify(updated));
  } catch {
    // Ignore
  }
}

export async function analyzeResume(
  file: File,
  user?: AppUser | null
): Promise<FeedbackResponse> {
  const formData = new FormData();
  formData.append('file', file);

  const headers: Record<string, string> = {
    'Content-Type': 'multipart/form-data',
  };

  if (user) {
    headers['X-User-Id'] = user.id;
    headers['Authorization'] = `Bearer ${user.id}`;
  }

  try {
    const response = await axios.post<{
      feedback: FeedbackResponse;
      id?: string;
      filename?: string;
      created_at?: string;
    }>(`${API_BASE_URL}/analyze`, formData, {
      headers,
      timeout: 45000,
    });

    const result = response.data.feedback;
    const historyItem: HistoryItem = {
      id: response.data.id || crypto.randomUUID(),
      user_id: user?.id || 'guest-user',
      filename: file.name,
      created_at: response.data.created_at || new Date().toISOString(),
      feedback: {
        ...result,
        id: response.data.id,
        filename: file.name,
        created_at: response.data.created_at || new Date().toISOString(),
      },
    };

    saveLocalHistoryItem(historyItem);
    return historyItem.feedback;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const status = error.response?.status;
      const detail = error.response?.data?.detail;
      throw new Error(getUserFriendlyError(status, detail), { cause: error });
    }

    throw new Error('Connection failed. Please check your internet.', { cause: error });
  }
}

export async function fetchUserHistory(user?: AppUser | null): Promise<HistoryItem[]> {
  const userId = user?.id || 'guest-user';
  try {
    const response = await axios.get<HistoryResponse>(`${API_BASE_URL}/history`, {
      params: { user_id: userId },
      headers: user ? { 'X-User-Id': user.id } : {},
      timeout: 10000,
    });

    if (response.data && Array.isArray(response.data.items) && response.data.items.length > 0) {
      // Sync with local storage
      response.data.items.forEach((item) => saveLocalHistoryItem(item));
      return response.data.items;
    }
  } catch (err) {
    console.warn('API history fetch failed, reading local cache:', err);
  }

  // Graceful fallback to local history
  return getLocalHistory(user?.id);
}

export async function deleteAnalysis(id: string, user?: AppUser | null): Promise<void> {
  deleteLocalHistoryItem(id);
  try {
    await axios.delete(`${API_BASE_URL}/history/${id}`, {
      params: user?.id ? { user_id: user.id } : {},
      headers: user ? { 'X-User-Id': user.id } : {},
      timeout: 10000,
    });
  } catch (err) {
    console.warn('Backend delete error (local copy deleted):', err);
  }
}

export async function rewriteResumeBullet(
  bullet: string,
  targetRole?: string
): Promise<BulletRewriteResponse> {
  try {
    const response = await axios.post<BulletRewriteResponse>(
      `${API_BASE_URL}/rewrite-bullet`,
      { bullet, target_role: targetRole },
      { timeout: 30000 }
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const detail = error.response?.data?.detail;
      throw new Error(getUserFriendlyError(error.response?.status, detail), { cause: error });
    }
    throw new Error('Failed to rewrite bullet point. Please try again.', { cause: error });
  }
}
