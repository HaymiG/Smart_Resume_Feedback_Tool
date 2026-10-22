import type { AppUser } from '../types';

export interface AuthContextType {
  user: AppUser | null;
  isSignedIn: boolean;
  login: (email: string, name?: string, role?: string) => void;
  logout: () => void;
  isAuthModalOpen: boolean;
  openAuthModal: () => void;
  closeAuthModal: () => void;
  authProvider: 'clerk' | 'demo';
}

export const USER_STORAGE_KEY = 'smart_resume_user';

export const DEMO_PROFILES: Omit<AppUser, 'authProvider'>[] = [
  {
    id: 'user_haymanot_cse',
    name: 'Haymanot Getachew',
    email: 'haymanot@astu.edu',
    role: 'Full Stack Engineer (ASTU)',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  },
  {
    id: 'user_jordan_backend',
    name: 'Jordan Taylor',
    email: 'jordan.candidate@dev.io',
    role: 'Backend Engineer',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
  },
  {
    id: 'user_sarah_design',
    name: 'Sarah Chen',
    email: 'sarah.chen@tech.dev',
    role: 'Product & Frontend Engineer',
    avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
  },
];
