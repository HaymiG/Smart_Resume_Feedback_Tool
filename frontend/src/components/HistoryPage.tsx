import React, { useState, useEffect } from 'react';
import type { HistoryItem, FeedbackResponse } from '../types';
import { fetchUserHistory, deleteAnalysis } from '../utils/api';
import { useAuth } from '../context/useAuth';
import {
  Clock,
  Trash2,
  ExternalLink,
  Search,
  Filter,
  TrendingUp,
  FileText,
  Sparkles,
  GitCompare,
  X,
} from 'lucide-react';

interface HistoryPageProps {
  onSelectReport: (feedback: FeedbackResponse) => void;
  onNewAnalysis: () => void;
}

export const HistoryPage: React.FC<HistoryPageProps> = ({
  onSelectReport,
  onNewAnalysis,
}) => {
  const { user } = useAuth();
  const [items, setItems] = useState<HistoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedScoreFilter, setSelectedScoreFilter] = useState<'all' | 'high' | 'mid' | 'low'>('all');
  const [compareItems, setCompareItems] = useState<{ a: HistoryItem; b: HistoryItem } | null>(null);

  useEffect(() => {
    let isCancelled = false;
    fetchUserHistory(user)
      .then((data) => {
        if (!isCancelled) {
          setItems(data);
          setIsLoading(false);
        }
      })
      .catch((err) => {
        if (!isCancelled) {
          console.error('Failed to load history:', err);
          setIsLoading(false);
        }
      });

    return () => {
      isCancelled = true;
    };
  }, [user]);

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!window.confirm('Are you sure you want to delete this resume analysis record?')) {
      return;
    }
    await deleteAnalysis(id, user);
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  const filteredItems = items.filter((item) => {
    const matchesSearch =
      item.filename.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.feedback?.summary || '').toLowerCase().includes(searchQuery.toLowerCase());

    const score = item.feedback?.overall_score || 0;
    if (selectedScoreFilter === 'high') return matchesSearch && score >= 80;
    if (selectedScoreFilter === 'mid') return matchesSearch && score >= 60 && score < 80;
    if (selectedScoreFilter === 'low') return matchesSearch && score < 60;

    return matchesSearch;
  });

  const getScoreColor = (score: number) => {
    if (score < 60) return 'text-red-500 bg-red-500/10 border-red-500/20';
    if (score < 80) return 'text-amber-500 bg-amber-500/10 border-amber-500/20';
    return 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20';
  };

  return (
    <div className="mx-auto w-full max-w-6xl space-y-8 animate-fade-in">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-3 py-1 text-xs font-semibold text-indigo-500 mb-2">
            <Clock size={13} /> Personal Analysis History
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[var(--text-primary)]">
            Resume Score Progress & History
          </h1>
          <p className="text-xs sm:text-sm text-[var(--text-secondary)] mt-1">
            Track your resume iterations over time, compare versions, and see how your score improved.
          </p>
        </div>

        <button
          onClick={onNewAnalysis}
          className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 px-4 py-2.5 text-xs sm:text-sm font-semibold text-white shadow-md hover:from-indigo-600 hover:to-purple-700 transition-all cursor-pointer"
        >
          <Sparkles size={16} />
          <span>Upload New Resume</span>
        </button>
      </div>

      {/* Score Evolution Chart / Progression Bar */}
      {items.length > 1 && (
        <div className="surface-card rounded-3xl p-6 sm:p-7 border border-[var(--border-subtle)] bg-[var(--bg-surface)] shadow-md">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-500">
                <TrendingUp size={18} />
              </div>
              <div>
                <h3 className="text-sm sm:text-base font-bold text-[var(--text-primary)]">
                  Score Evolution Timeline
                </h3>
                <p className="text-xs text-[var(--text-tertiary)]">
                  Your progress across {items.length} iterations
                </p>
              </div>
            </div>

            <button
              onClick={() => {
                if (items.length >= 2) {
                  setCompareItems({ a: items[0], b: items[1] });
                }
              }}
              className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg border border-indigo-500/30 bg-indigo-500/10 text-indigo-500 hover:bg-indigo-500/20 transition-colors"
            >
              <GitCompare size={14} /> Compare Latest Two
            </button>
          </div>

          {/* Simple Timeline Graph */}
          <div className="flex items-end gap-3 sm:gap-4 h-28 pt-4 px-2 overflow-x-auto">
            {items
              .slice(0, 10)
              .reverse()
              .map((item, idx) => {
                const score = item.feedback?.overall_score || 0;
                const heightPercent = Math.max(15, score);
                const isLatest = idx === Math.min(items.length, 10) - 1;
                return (
                  <div
                    key={item.id}
                    className="flex-1 min-w-[50px] flex flex-col items-center gap-1.5 group cursor-pointer"
                    onClick={() => onSelectReport(item.feedback)}
                  >
                    <span className="text-[11px] font-bold text-[var(--text-primary)] group-hover:text-indigo-500 transition-colors">
                      {score}
                    </span>
                    <div className="w-full bg-[var(--bg-surface-subtle)] rounded-t-lg h-20 flex items-end p-1">
                      <div
                        style={{ height: `${heightPercent}%` }}
                        className={`w-full rounded-md transition-all ${
                          isLatest
                            ? 'bg-gradient-to-t from-indigo-500 to-purple-500 shadow-sm'
                            : 'bg-indigo-400/50 group-hover:bg-indigo-500'
                        }`}
                      />
                    </div>
                    <span className="text-[10px] text-[var(--text-tertiary)] truncate max-w-[60px]">
                      {new Date(item.created_at).toLocaleDateString(undefined, {
                        month: 'numeric',
                        day: 'numeric',
                      })}
                    </span>
                  </div>
                );
              })}
          </div>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search
            size={16}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--text-tertiary)]"
          />
          <input
            type="text"
            placeholder="Search resumes by filename or notes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] text-xs sm:text-sm text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          <Filter size={14} className="text-[var(--text-tertiary)] shrink-0 ml-1 mr-1" />
          {[
            { id: 'all' as const, label: 'All Scores' },
            { id: 'high' as const, label: 'Excellent (80+)' },
            { id: 'mid' as const, label: 'Moderate (60-79)' },
            { id: 'low' as const, label: 'Needs Work (<60)' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setSelectedScoreFilter(tab.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                selectedScoreFilter === tab.id
                  ? 'bg-indigo-500 text-white shadow-sm'
                  : 'bg-[var(--bg-surface)] border border-[var(--border-subtle)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Items List */}
      {isLoading ? (
        <div className="py-16 text-center text-xs text-[var(--text-tertiary)]">
          <div className="animate-spin inline-block w-8 h-8 border-3 border-indigo-500 border-t-transparent rounded-full mb-3" />
          <p>Loading personal resume history...</p>
        </div>
      ) : filteredItems.length === 0 ? (
        <div className="surface-card rounded-3xl p-12 text-center border border-[var(--border-subtle)] bg-[var(--bg-surface)] space-y-4">
          <div className="w-16 h-16 rounded-full bg-indigo-500/10 text-indigo-500 flex items-center justify-center mx-auto">
            <FileText size={32} />
          </div>
          <h3 className="text-lg font-bold text-[var(--text-primary)]">
            No analysis records found
          </h3>
          <p className="text-xs sm:text-sm text-[var(--text-tertiary)] max-w-sm mx-auto">
            {searchQuery
              ? 'No resumes matched your search query. Try clearing the search filter.'
              : 'Upload a resume PDF to run your first AI review and start tracking your score!'}
          </p>
          <button
            onClick={onNewAnalysis}
            className="inline-flex items-center gap-2 rounded-xl bg-indigo-500 px-5 py-2.5 text-xs sm:text-sm font-semibold text-white shadow hover:bg-indigo-600 transition-colors cursor-pointer"
          >
            Upload Resume Now
          </button>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredItems.map((item) => {
            const score = item.feedback?.overall_score || 0;
            const dateStr = new Date(item.created_at).toLocaleDateString(undefined, {
              year: 'numeric',
              month: 'short',
              day: 'numeric',
            });

            return (
              <div
                key={item.id}
                onClick={() => onSelectReport(item.feedback)}
                className="surface-card group relative flex flex-col justify-between rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-5 hover:border-indigo-400 hover:shadow-lg transition-all cursor-pointer"
              >
                <div>
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex items-center gap-2 min-w-0">
                      <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-500 shrink-0">
                        <FileText size={18} />
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-bold text-[var(--text-primary)] truncate group-hover:text-indigo-500 transition-colors">
                          {item.filename}
                        </p>
                        <p className="text-[11px] text-[var(--text-tertiary)] flex items-center gap-1 mt-0.5">
                          <Clock size={11} /> {dateStr}
                        </p>
                      </div>
                    </div>

                    <span
                      className={`text-xs font-bold px-2.5 py-1 rounded-full border ${getScoreColor(
                        score
                      )}`}
                    >
                      {score} / 100
                    </span>
                  </div>

                  <p className="text-xs text-[var(--text-secondary)] line-clamp-2 leading-relaxed">
                    {item.feedback?.summary || 'No summary available.'}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-[var(--border-subtle)] flex items-center justify-between">
                  <div className="flex items-center gap-2 text-[11px] text-[var(--text-tertiary)]">
                    <span>F: {item.feedback?.formatting?.score ?? '-'}</span>
                    <span>•</span>
                    <span>K: {item.feedback?.keywords?.score ?? '-'}</span>
                    <span>•</span>
                    <span>ATS: {item.feedback?.ats_optimization?.score ?? '-'}</span>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={(e) => handleDelete(item.id, e)}
                      className="p-1.5 rounded-lg text-[var(--text-tertiary)] hover:text-red-500 hover:bg-red-500/10 transition-colors"
                      title="Delete record"
                    >
                      <Trash2 size={14} />
                    </button>
                    <button
                      type="button"
                      className="p-1.5 rounded-lg text-indigo-500 hover:bg-indigo-500/10 transition-colors"
                      title="Open full report"
                    >
                      <ExternalLink size={14} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Side-by-side Compare Modal */}
      {compareItems && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="surface-card relative w-full max-w-3xl rounded-3xl p-6 sm:p-8 shadow-2xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] text-[var(--text-primary)] max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setCompareItems(null)}
              className="absolute top-5 right-5 p-2 rounded-full text-[var(--text-tertiary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface-subtle)] transition-colors"
            >
              <X size={20} />
            </button>

            <div className="flex items-center gap-3 mb-6">
              <div className="p-2.5 rounded-2xl bg-indigo-500/10 text-indigo-500">
                <GitCompare size={22} />
              </div>
              <div>
                <h3 className="text-lg font-bold">Resume Version Comparison</h3>
                <p className="text-xs text-[var(--text-tertiary)]">
                  Compare metrics and score improvements between two analyses
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 sm:gap-6">
              {/* Version A */}
              <div className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-surface-subtle)] p-4 sm:p-5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-500 bg-indigo-500/10 px-2 py-0.5 rounded-full">
                  Previous Version
                </span>
                <p className="text-sm font-bold text-[var(--text-primary)] mt-2 truncate">
                  {compareItems.b.filename}
                </p>
                <p className="text-2xl font-black text-[var(--text-primary)] mt-1">
                  {compareItems.b.feedback.overall_score}
                  <span className="text-xs text-[var(--text-tertiary)] font-normal"> / 100</span>
                </p>

                <div className="mt-4 space-y-2 text-xs">
                  <div className="flex justify-between py-1 border-b border-[var(--border-subtle)]">
                    <span className="text-[var(--text-secondary)]">Formatting:</span>
                    <span className="font-semibold">{compareItems.b.feedback.formatting.score}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-[var(--border-subtle)]">
                    <span className="text-[var(--text-secondary)]">Keywords:</span>
                    <span className="font-semibold">{compareItems.b.feedback.keywords.score}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-[var(--border-subtle)]">
                    <span className="text-[var(--text-secondary)]">ATS Score:</span>
                    <span className="font-semibold">
                      {compareItems.b.feedback.ats_optimization.score}
                    </span>
                  </div>
                </div>
              </div>

              {/* Version B */}
              <div className="rounded-2xl border border-indigo-500/40 bg-indigo-500/[0.05] p-4 sm:p-5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-full">
                  Latest Version
                </span>
                <p className="text-sm font-bold text-[var(--text-primary)] mt-2 truncate">
                  {compareItems.a.filename}
                </p>
                <div className="flex items-baseline gap-2 mt-1">
                  <p className="text-2xl font-black text-indigo-500">
                    {compareItems.a.feedback.overall_score}
                    <span className="text-xs text-[var(--text-tertiary)] font-normal"> / 100</span>
                  </p>
                  {compareItems.a.feedback.overall_score - compareItems.b.feedback.overall_score !== 0 && (
                    <span
                      className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                        compareItems.a.feedback.overall_score >=
                        compareItems.b.feedback.overall_score
                          ? 'bg-emerald-500/10 text-emerald-500'
                          : 'bg-red-500/10 text-red-500'
                      }`}
                    >
                      {compareItems.a.feedback.overall_score -
                        compareItems.b.feedback.overall_score >
                      0
                        ? `+${
                            compareItems.a.feedback.overall_score -
                            compareItems.b.feedback.overall_score
                          }`
                        : compareItems.a.feedback.overall_score -
                          compareItems.b.feedback.overall_score}{' '}
                      pts
                    </span>
                  )}
                </div>

                <div className="mt-4 space-y-2 text-xs">
                  <div className="flex justify-between py-1 border-b border-[var(--border-subtle)]">
                    <span className="text-[var(--text-secondary)]">Formatting:</span>
                    <span className="font-semibold">{compareItems.a.feedback.formatting.score}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-[var(--border-subtle)]">
                    <span className="text-[var(--text-secondary)]">Keywords:</span>
                    <span className="font-semibold">{compareItems.a.feedback.keywords.score}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-[var(--border-subtle)]">
                    <span className="text-[var(--text-secondary)]">ATS Score:</span>
                    <span className="font-semibold">
                      {compareItems.a.feedback.ats_optimization.score}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={() => {
                  onSelectReport(compareItems.a.feedback);
                  setCompareItems(null);
                }}
                className="px-5 py-2.5 rounded-xl font-semibold text-xs sm:text-sm text-white bg-indigo-500 hover:bg-indigo-600 transition-colors"
              >
                Open Latest Full Report →
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
