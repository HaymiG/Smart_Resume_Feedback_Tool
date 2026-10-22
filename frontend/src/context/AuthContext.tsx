import React, { useState, useEffect } from 'react';
import { ClerkProvider, useUser, useClerk } from '@clerk/clerk-react';
import type { AppUser } from '../types';
import { USER_STORAGE_KEY, DEMO_PROFILES } from './auth-types';
import { AuthContext } from './useAuth';

const CLERK_PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;
const isClerkConfigured =
  typeof CLERK_PUBLISHABLE_KEY === 'string' &&
  CLERK_PUBLISHABLE_KEY.startsWith('pk_') &&
  !CLERK_PUBLISHABLE_KEY.includes('your_') &&
  CLERK_PUBLISHABLE_KEY.length > 20;

function ClerkAuthBridge({ children }: { children: React.ReactNode }) {
  const { user: clerkUser, isSignedIn } = useUser();
  const { signOut, openSignIn } = useClerk();

  const user: AppUser | null = isSignedIn && clerkUser
    ? {
        id: clerkUser.id,
        name: clerkUser.fullName || clerkUser.firstName || 'Candidate',
        email: clerkUser.primaryEmailAddress?.emailAddress || '',
        avatarUrl: clerkUser.imageUrl,
        role: 'Candidate (Clerk)',
        authProvider: 'clerk',
      }
    : null;

  return (
    <AuthContext.Provider
      value={{
        user,
        isSignedIn: !!isSignedIn,
        login: () => openSignIn(),
        logout: () => signOut(),
        isAuthModalOpen: false,
        openAuthModal: () => openSignIn(),
        closeAuthModal: () => {},
        authProvider: 'clerk',
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

function DemoAuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AppUser | null>(() => {
    try {
      const saved = localStorage.getItem(USER_STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {
      // Ignore
    }
    return {
      ...DEMO_PROFILES[0],
      authProvider: 'demo',
    };
  });

  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  useEffect(() => {
    if (user) {
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(USER_STORAGE_KEY);
    }
  }, [user]);

  const login = (email: string, name?: string, role?: string) => {
    const formattedName = name || email.split('@')[0];
    const newUser: AppUser = {
      id: `user_${email.replace(/[^a-zA-Z0-9]/g, '_')}`,
      email,
      name: formattedName.charAt(0).toUpperCase() + formattedName.slice(1),
      role: role || 'Candidate',
      authProvider: 'demo',
      avatarUrl: `https://api.dicebear.com/7.x/bottts/svg?seed=${email}`,
    };
    setUser(newUser);
    setIsAuthModalOpen(false);
  };

  const logout = () => {
    setUser(null);
  };

  const openAuthModal = () => setIsAuthModalOpen(true);
  const closeAuthModal = () => setIsAuthModalOpen(false);

  return (
    <AuthContext.Provider
      value={{
        user,
        isSignedIn: !!user,
        login,
        logout,
        isAuthModalOpen,
        openAuthModal,
        closeAuthModal,
        authProvider: 'demo',
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  if (isClerkConfigured && CLERK_PUBLISHABLE_KEY) {
    return (
      <ClerkProvider publishableKey={CLERK_PUBLISHABLE_KEY}>
        <ClerkAuthBridge>{children}</ClerkAuthBridge>
      </ClerkProvider>
    );
  }

  return <DemoAuthProvider>{children}</DemoAuthProvider>;
}
