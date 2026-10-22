import { useState, useEffect } from 'react';
import { typography } from '../styles/design-tokens';

const statusMessages = [
  "Reading your resume…",
  "Scoring formatting…",
  "Checking keywords…",
  "Optimizing for ATS…",
  "Almost done…"
];

const steps = [
  { label: 'Upload scanned', description: 'PDF parsed & text extracted' },
  { label: 'AI analysis', description: 'Formatting, keywords & ATS reviewed' },
  { label: 'Generating feedback', description: 'Structured insights prepared' },
];

export default function LoadingState() {
  const [messageIndex, setMessageIndex] = useState(0);
  const [progress, setProgress] = useState(0);

  // Derive active step directly from progress
  const activeStep = progress < 30 ? 0 : progress < 70 ? 1 : 2;

  // Animate progress bar
  useEffect(() => {
    let frame: number;
    const startTime = Date.now();
    const duration = 15000; // 15 seconds max

    const animateProgress = () => {
      const elapsed = Date.now() - startTime;
      const p = Math.min((elapsed / duration) * 90, 90); // Cap at 90% until done
      setProgress(p);
      frame = requestAnimationFrame(animateProgress);
    };

    animateProgress();
    return () => cancelAnimationFrame(frame);
  }, []);

  // Cycle status messages
  useEffect(() => {
    const interval = setInterval(() => {
      setMessageIndex((prev) => (prev + 1) % statusMessages.length);
    }, 2500);

    return () => clearInterval(interval);
  }, []);



  return (
    <div className="surface-card mx-auto flex w-full max-w-xl flex-col items-center rounded-3xl p-8 text-center sm:p-10">
      {/* Progress ring */}
      <div className="relative" style={{ width: 100, height: 100 }}>
        <svg className="transform -rotate-90" width={100} height={100}>
          <circle
            cx={50}
            cy={50}
            r={42}
            stroke="var(--border-subtle)"
            strokeWidth={6}
            fill="none"
            strokeOpacity="0.3"
          />
          <circle
            cx={50}
            cy={50}
            r={42}
            stroke="var(--color-primary)"
            strokeWidth={6}
            fill="none"
            strokeDasharray={2 * Math.PI * 42}
            strokeDashoffset={2 * Math.PI * 42 * (1 - progress / 100)}
            strokeLinecap="round"
            style={{
              transition: 'stroke-dashoffset 500ms ease-out',
              filter: 'drop-shadow(0 2px 8px rgba(13, 148, 136, 0.3))',
            }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span
            className="text-2xl font-bold text-[var(--text-primary)]"
            style={{ fontFamily: typography.heading }}
          >
            {Math.round(progress)}%
          </span>
        </div>
      </div>

      <h2
        className="mt-6 text-2xl font-semibold text-[var(--text-primary)]"
        style={{
          fontFamily: typography.heading,
          letterSpacing: typography.tracking.tight,
          lineHeight: typography.lineHeight.snug,
        }}
      >
        Analyzing your resume
      </h2>

      <p
        className="mt-3 text-sm leading-6 text-[var(--text-secondary)] sm:text-base min-h-[1.5em]"
        style={{ fontFamily: typography.body, lineHeight: typography.lineHeight.relaxed }}
      >
        {statusMessages[messageIndex]}
      </p>

      {/* Progress bar */}
      <div className="mt-6 w-full h-2 bg-[var(--bg-surface-subtle)] rounded-full overflow-hidden" role="progressbar" aria-valuenow={Math.round(progress)} aria-valuemin={0} aria-valuemax={100}>
        <div
          className="h-full bg-[var(--color-primary)] rounded-full transition-all duration-500 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Step indicators */}
      <div className="mt-8 grid w-full gap-3 sm:grid-cols-3">
        {steps.map((step, index) => (
          <div
            key={step.label}
            className={`relative rounded-xl border px-3 py-4 text-left text-sm transition-all duration-400 ${
              index < activeStep
                ? 'border-[var(--color-success)] bg-[var(--color-success-subtle)]'
                : index === activeStep
                ? 'border-[var(--color-primary)] bg-[var(--color-primary-subtle)] ring-2 ring-[var(--color-primary-subtle)]'
                : 'border-[var(--border-subtle)] bg-[var(--bg-surface-subtle)]'
            }`}
          >
            <div className="mb-2 flex items-center gap-2">
              <span
                className={`h-2.5 w-2.5 rounded-full transition-all duration-300 ${
                  index < activeStep
                    ? 'bg-[var(--color-success)]'
                    : index === activeStep
                    ? 'bg-[var(--color-primary)] animate-pulse'
                    : 'bg-[var(--border-subtle)]'
                }`}
              />
              <span className="text-xs uppercase tracking-wider text-[var(--text-tertiary)]">
                Step {index + 1}
              </span>
            </div>
            <p className="font-medium text-[var(--text-primary)]">{step.label}</p>
            <p className="mt-1 text-xs text-[var(--text-tertiary)]">{step.description}</p>
            {index < steps.length - 1 && (
              <div
                className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 h-12 w-px bg-gradient-to-b from-[var(--color-primary)] to-transparent opacity-30"
                aria-hidden="true"
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}