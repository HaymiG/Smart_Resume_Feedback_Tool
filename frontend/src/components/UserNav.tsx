import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../context/useAuth';
import { User, LogOut, ChevronDown, Sparkles } from 'lucide-react';

export const UserNav: React.FC = () => {
  const { user, isSignedIn, logout, openAuthModal } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (!isSignedIn || !user) {
    return (
      <button
        onClick={openAuthModal}
        className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 px-4 py-2 text-xs sm:text-sm font-semibold text-white shadow-md hover:from-indigo-600 hover:to-purple-700 transition-all cursor-pointer"
      >
        <User size={16} />
        <span>Sign In</span>
      </button>
    );
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex items-center gap-2.5 rounded-full border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-1.5 pr-3 text-left hover:border-indigo-500 transition-all cursor-pointer"
        aria-label="User profile menu"
      >
        {user.avatarUrl ? (
          <img
            src={user.avatarUrl}
            alt={user.name}
            className="w-7 h-7 rounded-full object-cover border border-[var(--border-subtle)]"
          />
        ) : (
          <div className="w-7 h-7 rounded-full bg-indigo-500/10 text-indigo-500 flex items-center justify-center font-bold text-xs">
            {user.name.charAt(0)}
          </div>
        )}
        <div className="hidden sm:block text-left">
          <p className="text-xs font-semibold text-[var(--text-primary)] leading-none truncate max-w-[120px]">
            {user.name}
          </p>
          <p className="text-[10px] text-[var(--text-tertiary)] leading-none mt-0.5 truncate max-w-[120px]">
            {user.role || 'Member'}
          </p>
        </div>
        <ChevronDown size={14} className="text-[var(--text-tertiary)]" />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-2 shadow-xl z-50 animate-scale-in">
          <div className="p-3 border-b border-[var(--border-subtle)]">
            <p className="text-sm font-bold text-[var(--text-primary)]">{user.name}</p>
            <p className="text-xs text-[var(--text-tertiary)] truncate">{user.email}</p>
            {user.role && (
              <span className="inline-block mt-1.5 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-indigo-500/10 text-indigo-500">
                {user.role}
              </span>
            )}
          </div>

          <div className="py-1">
            <button
              onClick={() => {
                setIsOpen(false);
                openAuthModal();
              }}
              className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface-subtle)] rounded-xl transition-colors text-left"
            >
              <Sparkles size={14} className="text-indigo-500" />
              Switch Profile / Manage Auth
            </button>
            <button
              onClick={() => {
                setIsOpen(false);
                logout();
              }}
              className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-red-500 hover:bg-red-500/10 rounded-xl transition-colors text-left"
            >
              <LogOut size={14} />
              Sign Out
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
