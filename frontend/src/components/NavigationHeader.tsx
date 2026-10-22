import React from 'react';
import type { NavigationTab } from '../types';
import { UserNav } from './UserNav';
import { FileText, Clock, PenTool, Sun, Moon, Sparkles } from 'lucide-react';

interface NavigationHeaderProps {
  currentTab: NavigationTab;
  onTabChange: (tab: NavigationTab) => void;
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
  historyCount?: number;
}

export const NavigationHeader: React.FC<NavigationHeaderProps> = ({
  currentTab,
  onTabChange,
  theme,
  onToggleTheme,
  historyCount = 0,
}) => {
  const isDark = theme === 'dark';

  return (
    <header className="w-full border-b border-[var(--border-subtle)] bg-[var(--bg-surface)]/80 backdrop-blur-md sticky top-0 z-40 transition-colors">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-3 sm:px-6 lg:px-8">
        {/* Brand / Logo */}
        <div
          onClick={() => onTabChange('analyze')}
          className="flex items-center gap-2.5 cursor-pointer group"
        >
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center text-white shadow-md shadow-indigo-500/20 group-hover:scale-105 transition-transform">
            <Sparkles size={18} />
          </div>
          <div>
            <span className="text-base font-bold tracking-tight text-[var(--text-primary)]">
              Smart Resume <span className="text-indigo-500">Coach</span>
            </span>
            <span className="hidden md:inline-block ml-2 text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-500 border border-indigo-500/20">
              AI + Recruiter Insights
            </span>
          </div>
        </div>

        {/* Central Navigation Tabs */}
        <nav className="flex items-center gap-1 p-1 rounded-2xl bg-[var(--bg-surface-subtle)] border border-[var(--border-subtle)]">
          <button
            type="button"
            onClick={() => onTabChange('analyze')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
              currentTab === 'analyze'
                ? 'bg-[var(--bg-surface)] text-[var(--text-primary)] shadow-sm'
                : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
            }`}
          >
            <FileText size={15} />
            <span>Reviewer</span>
          </button>

          <button
            type="button"
            onClick={() => onTabChange('history')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
              currentTab === 'history'
                ? 'bg-[var(--bg-surface)] text-[var(--text-primary)] shadow-sm'
                : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
            }`}
          >
            <Clock size={15} />
            <span>My History</span>
            {historyCount > 0 && (
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-indigo-500/20 text-[10px] font-bold text-indigo-500">
                {historyCount}
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={() => onTabChange('rewriter')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
              currentTab === 'rewriter'
                ? 'bg-[var(--bg-surface)] text-[var(--text-primary)] shadow-sm'
                : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
            }`}
          >
            <PenTool size={15} />
            <span className="hidden sm:inline">STAR Rewriter</span>
            <span className="sm:hidden">Rewriter</span>
          </button>
        </nav>

        {/* Right actions: Theme + UserNav */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onToggleTheme}
            className="p-2 rounded-full border border-[var(--border-subtle)] bg-[var(--bg-surface)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-indigo-400 transition-colors cursor-pointer"
            aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
          >
            {isDark ? <Sun size={17} className="text-amber-400" /> : <Moon size={17} />}
          </button>

          <UserNav />
        </div>
      </div>
    </header>
  );
};
