// Type definitions for the Smart Resume Feedback Tool

export interface QuickWin {
  title: string;
  impact: 'High' | 'Medium' | 'Low';
  how_to_fix: string;
}

export interface FeedbackResponse {
  overall_score: number;
  formatting: {
    score: number;
    feedback: string;
  };
  keywords: {
    score: number;
    feedback: string;
    missing_suggestions: string[];
  };
  ats_optimization: {
    score: number;
    feedback: string;
  };
  summary: string;
  coach_note?: string;
  recruiter_glance?: string;
  quick_wins?: QuickWin[];
  strengths?: string[];
  id?: string;
  filename?: string;
  created_at?: string;
}

export interface HistoryItem {
  id: string;
  user_id: string;
  filename: string;
  created_at: string;
  feedback: FeedbackResponse;
  raw_text?: string;
}

export interface HistoryResponse {
  user_id: string;
  total: number;
  items: HistoryItem[];
}

export interface BulletRewriteSuggestion {
  style: string;
  rewritten: string;
  why_it_works: string;
}

export interface BulletRewriteResponse {
  original: string;
  suggestions: BulletRewriteSuggestion[];
  key_power_verbs: string[];
}

export interface AppUser {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  role?: string;
  authProvider: 'clerk' | 'demo';
}

export type AppState = 'idle' | 'uploading' | 'analyzing' | 'success' | 'error';
export type NavigationTab = 'analyze' | 'history' | 'rewriter';

export interface AppData {
  state: AppState;
  selectedFile: File | null;
  feedback: FeedbackResponse | null;
  error: string | null;
}

export interface FileValidation {
  isValid: boolean;
  error?: string;
}

export type ScoreColor = 'red' | 'amber' | 'emerald';
