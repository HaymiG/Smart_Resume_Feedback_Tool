import React, { useState } from 'react';
import { rewriteResumeBullet } from '../utils/api';
import type { BulletRewriteResponse } from '../types';
import { Sparkles, Copy, Check, ArrowRight, Lightbulb, Zap } from 'lucide-react';

interface BulletRewriterProps {
  initialBullet?: string;
  onApplyBullet?: (newBullet: string) => void;
}

const SAMPLE_BULLETS = [
  'Helped team build backend APIs with Python and Docker',
  'Responsible for fixing bugs and improving database speed',
  'Worked on the frontend user interface and design system',
  'Tested application features and wrote documentation',
];

export const BulletRewriter: React.FC<BulletRewriterProps> = ({
  initialBullet = '',
}) => {
  const [bullet, setBullet] = useState(initialBullet);
  const [targetRole, setTargetRole] = useState('Full Stack Software Engineer');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<BulletRewriteResponse | null>(null);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [error, setError] = useState<string>('');

  const handleRewrite = async (textToRewrite?: string) => {
    const text = textToRewrite !== undefined ? textToRewrite : bullet;
    if (!text.trim()) {
      setError('Please enter a bullet point to rewrite.');
      return;
    }

    setError('');
    setIsLoading(true);
    try {
      const data = await rewriteResumeBullet(text, targetRole);
      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Rewrite failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="surface-card rounded-3xl p-6 sm:p-8 border border-[var(--border-subtle)] bg-[var(--bg-surface)] shadow-lg space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-[var(--border-subtle)] pb-5">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 to-indigo-600 flex items-center justify-center text-white shadow-md">
            <Zap size={24} />
          </div>
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-[var(--text-primary)]">
              Interactive STAR Bullet Rewriter
            </h2>
            <p className="text-xs text-[var(--text-tertiary)]">
              Turn passive task descriptions into recruiter-attracting, metric-driven achievements.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <label className="text-xs font-medium text-[var(--text-secondary)] whitespace-nowrap">
            Target Role:
          </label>
          <select
            value={targetRole}
            onChange={(e) => setTargetRole(e.target.value)}
            className="rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface-subtle)] px-3 py-1.5 text-xs font-semibold text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="Full Stack Software Engineer">Full Stack Software Engineer</option>
            <option value="Backend Developer (Python/Go)">Backend Developer</option>
            <option value="Frontend Developer (React/Next)">Frontend Developer</option>
            <option value="DevOps & Cloud Engineer">DevOps & Cloud Engineer</option>
            <option value="Data Engineer / Scientist">Data Engineer / Scientist</option>
          </select>
        </div>
      </div>

      {/* Input area */}
      <div className="space-y-3">
        <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--text-tertiary)]">
          Paste a bullet point from your resume:
        </label>
        <div className="relative">
          <textarea
            rows={3}
            value={bullet}
            onChange={(e) => setBullet(e.target.value)}
            placeholder="e.g. Built fullstack web applications using Odoo-17 and helped team with microservices..."
            className="w-full rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-surface-subtle)] p-4 text-sm text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all placeholder:text-[var(--text-tertiary)]"
          />
        </div>

        {/* Quick sample chips */}
        <div className="flex flex-wrap items-center gap-2 pt-1">
          <span className="text-xs text-[var(--text-tertiary)] flex items-center gap-1">
            <Lightbulb size={13} /> Try an example:
          </span>
          {SAMPLE_BULLETS.map((sample, i) => (
            <button
              key={i}
              type="button"
              onClick={() => {
                setBullet(sample);
                handleRewrite(sample);
              }}
              className="text-xs px-2.5 py-1 rounded-full border border-[var(--border-subtle)] bg-[var(--bg-surface-subtle)] text-[var(--text-secondary)] hover:text-indigo-500 hover:border-indigo-400 transition-colors"
            >
              "{sample.slice(0, 32)}..."
            </button>
          ))}
        </div>

        {error && (
          <p className="text-xs font-medium text-red-500 bg-red-500/10 p-2.5 rounded-xl border border-red-500/20">
            {error}
          </p>
        )}

        <div className="flex justify-end pt-2">
          <button
            type="button"
            onClick={() => handleRewrite()}
            disabled={isLoading || !bullet.trim()}
            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 px-5 py-2.5 text-sm font-semibold text-white shadow-md hover:from-indigo-600 hover:to-purple-700 disabled:opacity-50 transition-all cursor-pointer"
          >
            <Sparkles size={16} />
            <span>{isLoading ? 'Crafting STAR Rewrite...' : 'Transform with STAR Method'}</span>
          </button>
        </div>
      </div>

      {/* Rewritten Results */}
      {result && (
        <div className="mt-6 space-y-4 pt-6 border-t border-[var(--border-subtle)] animate-fade-up">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-[var(--text-primary)] flex items-center gap-2">
              <Sparkles size={16} className="text-amber-500" />
              High-Impact Recruiter-Approved Options
            </h3>
            {result.key_power_verbs && (
              <div className="hidden sm:flex items-center gap-1.5 text-xs text-[var(--text-tertiary)]">
                <span>Power Verbs:</span>
                {result.key_power_verbs.map((verb, idx) => (
                  <span
                    key={idx}
                    className="font-semibold text-indigo-500 bg-indigo-500/10 px-2 py-0.5 rounded-md"
                  >
                    {verb}
                  </span>
                ))}
              </div>
            )}
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {result.suggestions.map((suggestion, idx) => (
              <div
                key={idx}
                className="relative flex flex-col justify-between rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-surface-subtle)] p-5 hover:border-indigo-400 transition-all shadow-sm group"
              >
                <div>
                  <div className="flex items-center justify-between mb-2.5">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-500 bg-indigo-500/10 px-2.5 py-0.5 rounded-full">
                      {suggestion.style}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleCopy(suggestion.rewritten, idx)}
                      className="inline-flex items-center gap-1 text-xs font-semibold text-[var(--text-tertiary)] hover:text-indigo-500 transition-colors p-1"
                      title="Copy rewritten bullet to clipboard"
                    >
                      {copiedIndex === idx ? (
                        <>
                          <Check size={14} className="text-emerald-500" />
                          <span className="text-emerald-500">Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy size={14} />
                          <span>Copy</span>
                        </>
                      )}
                    </button>
                  </div>

                  <p className="text-sm font-medium leading-relaxed text-[var(--text-primary)]">
                    • {suggestion.rewritten}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-[var(--border-subtle)] flex items-start gap-1.5 text-[11px] text-[var(--text-tertiary)]">
                  <ArrowRight size={13} className="text-indigo-500 shrink-0 mt-0.5" />
                  <span>{suggestion.why_it_works}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
