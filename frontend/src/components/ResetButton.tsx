import { typography } from '../styles/design-tokens';

interface ResetButtonProps {
  onClick: () => void;
}

export default function ResetButton({ onClick }: ResetButtonProps) {
  return (
    <button
      onClick={onClick}
      className="btn-secondary group w-full inline-flex items-center justify-center gap-2 rounded-xl px-6 py-4 text-base font-semibold transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg-surface)]"
      style={{
        fontSize: typography.size.base,
        fontFamily: typography.body,
        letterSpacing: typography.tracking.wide,
      }}
    >
      <span>Analyze another resume</span>
      <span className="transition-transform duration-150 group-hover:translate-x-0.5" aria-hidden="true">↺</span>
    </button>
  );
}