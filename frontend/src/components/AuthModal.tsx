import React, { useState } from 'react';
import { useAuth } from '../context/useAuth';
import { DEMO_PROFILES } from '../context/auth-types';
import { X, Sparkles, User, Mail, ShieldCheck, CheckCircle2 } from 'lucide-react';

export const AuthModal: React.FC = () => {
  const { isAuthModalOpen, closeAuthModal, login, user } = useAuth();
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [activeTab, setActiveTab] = useState<'quick' | 'custom'>('quick');

  if (!isAuthModalOpen) return null;

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    login(email, name);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div
        className="surface-card relative w-full max-w-lg rounded-3xl p-6 sm:p-8 shadow-2xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] text-[var(--text-primary)]"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={closeAuthModal}
          className="absolute top-5 right-5 p-2 rounded-full text-[var(--text-tertiary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface-subtle)] transition-colors"
          aria-label="Close modal"
        >
          <X size={20} />
        </button>

        <div className="flex items-center gap-3 mb-5">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-white shadow-md">
            <Sparkles size={24} />
          </div>
          <div>
            <h2 className="text-xl font-bold">Personal Career Workspace</h2>
            <p className="text-xs text-[var(--text-tertiary)]">
              Sign in to sync your resume history, track score improvements, and unlock ATS coaching.
            </p>
          </div>
        </div>

        {/* Tab switcher */}
        <div className="flex rounded-xl bg-[var(--bg-surface-subtle)] p-1 mb-6 border border-[var(--border-subtle)]">
          <button
            type="button"
            onClick={() => setActiveTab('quick')}
            className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all ${
              activeTab === 'quick'
                ? 'bg-[var(--bg-surface)] shadow text-[var(--text-primary)]'
                : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
            }`}
          >
            Quick 1-Click Profiles
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('custom')}
            className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all ${
              activeTab === 'custom'
                ? 'bg-[var(--bg-surface)] shadow text-[var(--text-primary)]'
                : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
            }`}
          >
            Enter Custom Email
          </button>
        </div>

        {activeTab === 'quick' ? (
          <div className="space-y-3">
            <p className="text-xs font-medium text-[var(--text-secondary)] mb-2">
              Select a persona to test the interactive experience:
            </p>
            {DEMO_PROFILES.map((profile) => {
              const isCurrent = user?.id === profile.id;
              return (
                <button
                  key={profile.id}
                  onClick={() => {
                    login(profile.email, profile.name, profile.role);
                  }}
                  className={`w-full flex items-center justify-between p-3.5 rounded-2xl border transition-all text-left ${
                    isCurrent
                      ? 'border-indigo-500 bg-indigo-500/10'
                      : 'border-[var(--border-subtle)] bg-[var(--bg-surface-subtle)] hover:border-indigo-400 hover:bg-[var(--bg-surface-subtle)]/80'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={profile.avatarUrl}
                      alt={profile.name}
                      className="w-10 h-10 rounded-full object-cover border border-[var(--border-subtle)]"
                    />
                    <div>
                      <p className="text-sm font-semibold text-[var(--text-primary)]">
                        {profile.name}
                      </p>
                      <p className="text-xs text-[var(--text-tertiary)]">{profile.role}</p>
                    </div>
                  </div>
                  {isCurrent ? (
                    <span className="flex items-center gap-1 text-xs font-semibold text-indigo-500 bg-indigo-500/10 px-2.5 py-1 rounded-full">
                      <CheckCircle2 size={14} /> Active
                    </span>
                  ) : (
                    <span className="text-xs font-medium text-[var(--text-secondary)]">Select →</span>
                  )}
                </button>
              );
            })}
          </div>
        ) : (
          <form onSubmit={handleCustomSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1.5">
                Full Name
              </label>
              <div className="relative">
                <User
                  size={16}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--text-tertiary)]"
                />
                <input
                  type="text"
                  placeholder="e.g. Jane Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface-subtle)] text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <Mail
                  size={16}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--text-tertiary)]"
                />
                <input
                  type="email"
                  required
                  placeholder="e.g. candidate@domain.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface-subtle)] text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 px-4 rounded-xl font-semibold text-white bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 shadow-md transition-all text-sm mt-2"
            >
              Sign In to Resume Workspace
            </button>
          </form>
        )}

        <div className="mt-6 pt-4 border-t border-[var(--border-subtle)] flex items-center justify-between text-xs text-[var(--text-tertiary)]">
          <span className="flex items-center gap-1.5">
            <ShieldCheck size={14} className="text-emerald-500" />
            Clerk & Supabase Auth Ready
          </span>
          <button
            type="button"
            onClick={closeAuthModal}
            className="hover:text-[var(--text-primary)] underline"
          >
            Continue as Guest
          </button>
        </div>
      </div>
    </div>
  );
};
