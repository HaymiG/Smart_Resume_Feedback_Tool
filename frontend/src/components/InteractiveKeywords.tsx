import React, { useState } from 'react';
import { Copy, Check, Sparkles, CheckCircle2 } from 'lucide-react';

interface InteractiveKeywordsProps {
  keywords: string[];
  onOpenRewriterWithSample?: (sample: string) => void;
}

export const InteractiveKeywords: React.FC<InteractiveKeywordsProps> = ({
  keywords,
  onOpenRewriterWithSample,
}) => {
  const [selectedKeyword, setSelectedKeyword] = useState<string | null>(
    keywords.length > 0 ? keywords[0] : null
  );
  const [copied, setCopied] = useState(false);
  const [completedKeywords, setCompletedKeywords] = useState<Record<string, boolean>>({});

  if (!keywords || keywords.length === 0) return null;

  const currentKeyword = selectedKeyword || keywords[0];

  const getExampleBullet = (kw: string) => {
    return `Architected and deployed robust microservices integrating ${kw}, optimizing performance by 30% and accelerating sprint release cycles.`;
  };

  const handleCopyBullet = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const toggleCompleted = (kw: string) => {
    setCompletedKeywords((prev) => ({ ...prev, [kw]: !prev[kw] }));
  };

  return (
    <div className="surface-card rounded-2xl p-5 sm:p-6 border border-[var(--border-subtle)] bg-[var(--bg-surface)] space-y-4">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
        <div>
          <h4 className="text-sm font-bold text-[var(--text-primary)] flex items-center gap-2">
            <Sparkles size={16} className="text-indigo-500" />
            Interactive Keyword Explorer & Tailoring
          </h4>
          <p className="text-xs text-[var(--text-tertiary)]">
            Click any missing keyword to view recruiter impact and bullet point phrasing:
          </p>
        </div>
        <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-500">
          {Object.values(completedKeywords).filter(Boolean).length} of {keywords.length} Integrated
        </span>
      </div>

      {/* Interactive Keyword Chips */}
      <div className="flex flex-wrap gap-2 pt-1">
        {keywords.map((kw) => {
          const isSelected = selectedKeyword === kw;
          const isDone = !!completedKeywords[kw];
          return (
            <button
              key={kw}
              type="button"
              onClick={() => setSelectedKeyword(kw)}
              className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold border transition-all cursor-pointer ${
                isSelected
                  ? 'border-indigo-500 bg-indigo-500/15 text-indigo-500 shadow-sm'
                  : isDone
                  ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-500 line-through'
                  : 'border-[var(--border-subtle)] bg-[var(--bg-surface-subtle)] text-[var(--text-secondary)] hover:border-indigo-400'
              }`}
            >
              {isDone && <CheckCircle2 size={13} />}
              <span>{kw}</span>
            </button>
          );
        })}
      </div>

      {/* Detail Card for currently selected keyword */}
      {currentKeyword && (
        <div className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-surface-subtle)] p-4 sm:p-5 mt-2 animate-fade-in space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-indigo-500 bg-indigo-500/10 px-2.5 py-0.5 rounded-md">
                Keyword Focus
              </span>
              <span className="text-sm font-bold text-[var(--text-primary)]">
                {currentKeyword}
              </span>
            </div>

            <button
              type="button"
              onClick={() => toggleCompleted(currentKeyword)}
              className={`inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-lg border transition-colors cursor-pointer ${
                completedKeywords[currentKeyword]
                  ? 'bg-emerald-500/15 text-emerald-500 border-emerald-500/30'
                  : 'bg-[var(--bg-surface)] text-[var(--text-secondary)] border-[var(--border-subtle)] hover:text-emerald-500'
              }`}
            >
              <CheckCircle2 size={14} />
              <span>
                {completedKeywords[currentKeyword] ? 'Marked as Added' : 'Mark as Added'}
              </span>
            </button>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-[var(--text-tertiary)] mb-1">
              Sample STAR bullet point to add to your resume:
            </p>
            <div className="flex items-start justify-between gap-3 p-3 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-subtle)]">
              <p className="text-xs sm:text-sm font-medium text-[var(--text-primary)] leading-relaxed">
                • {getExampleBullet(currentKeyword)}
              </p>
              <button
                type="button"
                onClick={() => handleCopyBullet(getExampleBullet(currentKeyword))}
                className="shrink-0 p-1.5 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-surface-subtle)] text-[var(--text-secondary)] hover:text-indigo-500 transition-colors"
                title="Copy bullet example"
              >
                {copied ? <Check size={14} className="text-emerald-500" /> : <Copy size={14} />}
              </button>
            </div>
          </div>

          {onOpenRewriterWithSample && (
            <div className="flex justify-end pt-1">
              <button
                type="button"
                onClick={() => onOpenRewriterWithSample(getExampleBullet(currentKeyword))}
                className="text-xs font-semibold text-indigo-500 hover:text-indigo-600 transition-colors"
              >
                Customize this bullet in STAR Rewriter →
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
