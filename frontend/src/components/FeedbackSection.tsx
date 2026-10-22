import { useState, useRef, useEffect } from 'react';
import { typography } from '../styles/design-tokens';
import type { ScoreColor } from '../types';

interface FeedbackSectionProps {
  title: string;
  icon: string;
  feedback: string;
  items?: string[];
  scoreColor?: ScoreColor;
  defaultOpen?: boolean;
}

function getColorForScore(scoreColor?: ScoreColor): string {
  if (scoreColor === 'red') return 'var(--color-error)';
  if (scoreColor === 'amber') return 'var(--color-warning)';
  if (scoreColor === 'emerald') return 'var(--color-success)';
  return 'var(--text-tertiary)';
}

export default function FeedbackSection({
  title,
  icon,
  feedback,
  items,
  scoreColor,
  defaultOpen = true,
}: FeedbackSectionProps) {
  const dotColor = getColorForScore(scoreColor);
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const contentRef = useRef<HTMLDivElement>(null);
  const [contentHeight, setContentHeight] = useState(0);

  // Measure content height for smooth animation
  useEffect(() => {
    if (contentRef.current && isOpen) {
      setContentHeight(contentRef.current.scrollHeight);
    } else {
      setContentHeight(0);
    }
  }, [isOpen, items, feedback]);

  return (
    <section className="surface-card interactive animate-fade-up rounded-xl p-5 sm:p-6">
      <button
        type="button"
        className="flex w-full items-center justify-between gap-4 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg-surface)] rounded-lg -ml-2 -mt-2 mb-2 pl-2 pt-2"
        onClick={() => setIsOpen((current) => !current)}
        aria-expanded={isOpen}
      >
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--color-primary-subtle)] text-lg shrink-0">
            {icon}
          </span>
          <div className="min-w-0">
            <h3
              className="text-lg font-semibold text-[var(--text-primary)] sm:text-xl truncate"
              style={{
                fontSize: typography.size.lg,
                fontWeight: 600,
                fontFamily: typography.heading,
                lineHeight: typography.lineHeight.snug,
              }}
            >
              {title}
            </h3>
            <p className="mt-1 text-sm text-[var(--text-tertiary)] truncate" style={{ fontFamily: typography.body }}>
              {items && items.length > 0 ? 'Includes supporting suggestions' : 'Short-form guidance at a glance'}
            </p>
          </div>
        </div>

        <span
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-[var(--border-subtle)] bg-[var(--bg-surface)] text-base text-[var(--text-tertiary)] transition-transform duration-300 ease-out"
          style={{ transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}
          aria-hidden="true"
        >
          ▾
        </span>
      </button>

      <div
        className="overflow-hidden transition-all duration-400 ease-out"
        style={{ maxHeight: isOpen ? contentHeight : 0, opacity: isOpen ? 1 : 0 }}
      >
        <div
          ref={contentRef}
          className="animate-fade-up"
          style={{ animationDelay: '80ms' }}
        >
          <p
            className="text-base leading-7 text-[var(--text-primary)]"
            style={{
              fontSize: typography.size.base,
              lineHeight: typography.lineHeight.relaxed,
              fontFamily: typography.body,
              marginBottom: items && items.length > 0 ? '16px' : '0',
            }}
          >
            {feedback}
          </p>

          {items && items.length > 0 && (
            <ul className="space-y-3" role="list">
              {items.map((item, index) => (
                <li
                  key={index}
                  className="flex items-start gap-3 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface-subtle)] px-4 py-3 animate-fade-up transition-all duration-200 hover:border-[var(--border-default)] hover:shadow-sm"
                  style={{ animationDelay: `${100 + index * 40}ms` }}
                >
                  <div
                    className="mt-1.5 flex-shrink-0"
                    style={{
                      width: '10px',
                      height: '10px',
                      borderRadius: '50%',
                      backgroundColor: dotColor,
                      boxShadow: `0 0 0 6px ${dotColor}20`,
                    }}
                    aria-hidden="true"
                  />
                  <span
                    className="text-sm leading-6 sm:text-base"
                    style={{
                      fontSize: typography.size.base,
                      lineHeight: typography.lineHeight.normal,
                      color: 'var(--text-primary)',
                      flex: 1,
                      fontFamily: typography.body,
                    }}
                  >
                    {item}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </section>
  );
}