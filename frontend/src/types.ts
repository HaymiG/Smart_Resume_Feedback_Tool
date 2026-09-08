// Type definitions for the Smart Resume Feedback Tool

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
}

export type AppState = 'idle' | 'uploading' | 'analyzing' | 'success' | 'error';

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
