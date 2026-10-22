import { typography } from '../styles/design-tokens';

interface ErrorBannerProps {
  message: string;
  onDismiss?: () => void;
}

export default function ErrorBanner({ message, onDismiss }: ErrorBannerProps) {
  if (!message) return null;

  return (
    <div
      className="animate-fade-up stagger-1 flex items-start gap-3 rounded-xl border bg-[var(--color-error-subtle)] p-4"
      style={{
        borderColor: 'rgba(220, 38, 38, 0.15)',
      }}
      role="alert"
      aria-live="polite"
    >
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[rgba(220,38,38,0.12)] text-sm" aria-hidden="true">
        ⚠️
      </div>

      <div className="flex-1 min-w-0">
        <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--color-error-text)' }}>
          Something went wrong
        </p>
        <p
          className="mt-1 text-sm leading-6"
          style={{
            fontFamily: typography.body,
            lineHeight: typography.lineHeight.normal,
            color: 'var(--color-error-text)',
          }}
        >
          {message}
        </p>
      </div>

      {onDismiss && (
        <button
          onClick={onDismiss}
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-[var(--color-error-text)] hover:bg-[rgba(220,38,38,0.08)] transition-colors duration-150"
          aria-label="Dismiss error"
        >
          <span aria-hidden="true">×</span>
        </button>
      )}
    </div>
  );
}