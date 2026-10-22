import React, { useState } from 'react';
import { CheckCircle2, AlertTriangle, ShieldCheck, TrendingUp, Sliders } from 'lucide-react';

interface ATSChecklistProps {
  initialScore: number;
}

export const ATSChecklist: React.FC<ATSChecklistProps> = ({ initialScore }) => {
  const [fixedFormatting, setFixedFormatting] = useState(false);
  const [addedKeywords, setAddedKeywords] = useState(false);
  const [quantifiedMetrics, setQuantifiedMetrics] = useState(false);
  const [standardizedHeaders, setStandardizedHeaders] = useState(false);

  // Calculate simulated score
  let boost = 0;
  if (fixedFormatting) boost += 6;
  if (addedKeywords) boost += 10;
  if (quantifiedMetrics) boost += 8;
  if (standardizedHeaders) boost += 4;

  const simulatedScore = Math.min(100, initialScore + boost);

  return (
    <div className="surface-card rounded-2xl p-5 sm:p-6 border border-[var(--border-subtle)] bg-[var(--bg-surface)] space-y-5">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-[var(--border-subtle)] pb-4">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-500">
            <ShieldCheck size={20} />
          </div>
          <div>
            <h4 className="text-sm sm:text-base font-bold text-[var(--text-primary)]">
              ATS Compatibility Simulator & Checklist
            </h4>
            <p className="text-xs text-[var(--text-tertiary)]">
              Test how fixing ATS bottlenecks directly boosts your score.
            </p>
          </div>
        </div>

        {/* Score comparison pill */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[var(--bg-surface-subtle)] border border-[var(--border-subtle)]">
          <span className="text-xs text-[var(--text-tertiary)]">Current:</span>
          <span className="text-xs font-bold text-[var(--text-primary)]">{initialScore}</span>
          <span className="text-xs text-[var(--text-tertiary)]">→</span>
          <span className="text-xs font-bold text-emerald-500 flex items-center gap-1">
            <TrendingUp size={13} /> {simulatedScore}
          </span>
          {boost > 0 && (
            <span className="text-[10px] font-bold text-emerald-500 bg-emerald-500/10 px-1.5 py-0.5 rounded-full">
              +{boost} pts
            </span>
          )}
        </div>
      </div>

      {/* Simulator Toggles */}
      <div className="space-y-3">
        <p className="text-xs font-semibold uppercase tracking-wider text-[var(--text-tertiary)] flex items-center gap-1.5">
          <Sliders size={13} /> Interactive Optimization Toggles:
        </p>

        <label className="flex items-center justify-between p-3 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface-subtle)] hover:border-indigo-400 transition-colors cursor-pointer">
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={addedKeywords}
              onChange={(e) => setAddedKeywords(e.target.checked)}
              className="h-4 w-4 rounded text-indigo-600 focus:ring-indigo-500 cursor-pointer"
            />
            <div>
              <p className="text-xs sm:text-sm font-semibold text-[var(--text-primary)]">
                Integrate 3+ Missing High-Priority Keywords
              </p>
              <p className="text-[11px] text-[var(--text-tertiary)]">
                Directly matches ATS role criteria queries
              </p>
            </div>
          </div>
          <span className="text-xs font-bold text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-full">
            +10 pts
          </span>
        </label>

        <label className="flex items-center justify-between p-3 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface-subtle)] hover:border-indigo-400 transition-colors cursor-pointer">
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={quantifiedMetrics}
              onChange={(e) => setQuantifiedMetrics(e.target.checked)}
              className="h-4 w-4 rounded text-indigo-600 focus:ring-indigo-500 cursor-pointer"
            />
            <div>
              <p className="text-xs sm:text-sm font-semibold text-[var(--text-primary)]">
                Quantify Project Outcomes (Percentages, Latency, Scale)
              </p>
              <p className="text-[11px] text-[var(--text-tertiary)]">
                STAR-format bullet rewrites pass heuristic scoring
              </p>
            </div>
          </div>
          <span className="text-xs font-bold text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-full">
            +8 pts
          </span>
        </label>

        <label className="flex items-center justify-between p-3 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface-subtle)] hover:border-indigo-400 transition-colors cursor-pointer">
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={fixedFormatting}
              onChange={(e) => setFixedFormatting(e.target.checked)}
              className="h-4 w-4 rounded text-indigo-600 focus:ring-indigo-500 cursor-pointer"
            />
            <div>
              <p className="text-xs sm:text-sm font-semibold text-[var(--text-primary)]">
                Clean Non-Standard Characters & Multi-Column Layout
              </p>
              <p className="text-[11px] text-[var(--text-tertiary)]">
                Eliminates text flow parser breaks in Workday/Taleo
              </p>
            </div>
          </div>
          <span className="text-xs font-bold text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-full">
            +6 pts
          </span>
        </label>

        <label className="flex items-center justify-between p-3 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface-subtle)] hover:border-indigo-400 transition-colors cursor-pointer">
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={standardizedHeaders}
              onChange={(e) => setStandardizedHeaders(e.target.checked)}
              className="h-4 w-4 rounded text-indigo-600 focus:ring-indigo-500 cursor-pointer"
            />
            <div>
              <p className="text-xs sm:text-sm font-semibold text-[var(--text-primary)]">
                Standardize Section Names & Contact Info Placement
              </p>
              <p className="text-[11px] text-[var(--text-tertiary)]">
                Ensures Work Experience and Education are properly tagged
              </p>
            </div>
          </div>
          <span className="text-xs font-bold text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-full">
            +4 pts
          </span>
        </label>
      </div>

      {/* Static Checklist audit info */}
      <div className="pt-3 border-t border-[var(--border-subtle)] grid grid-cols-2 gap-2 text-[11px]">
        <div className="flex items-center gap-1.5 text-emerald-500 font-medium">
          <CheckCircle2 size={13} /> PDF text-extractable
        </div>
        <div className="flex items-center gap-1.5 text-emerald-500 font-medium">
          <CheckCircle2 size={13} /> No complex graphics
        </div>
        <div className="flex items-center gap-1.5 text-amber-500 font-medium">
          <AlertTriangle size={13} /> Check contact links
        </div>
        <div className="flex items-center gap-1.5 text-emerald-500 font-medium">
          <CheckCircle2 size={13} /> Standard UTF-8 fonts
        </div>
      </div>
    </div>
  );
};
