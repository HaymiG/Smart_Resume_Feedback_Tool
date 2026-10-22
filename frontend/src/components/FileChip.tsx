import { typography } from '../styles/design-tokens';

interface FileChipProps {
  file: File;
  onRemove: () => void;
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default function FileChip({ file, onRemove }: FileChipProps) {
  return (
    <div className="surface-card interactive animate-fade-up stagger-1 flex items-center justify-between gap-3 rounded-xl px-4 py-4 focus-within:ring-2 focus-within:ring-[var(--color-primary)] focus-within:ring-offset-2 focus-within:ring-offset-[var(--bg-surface)]">
      <div className="flex min-w-0 flex-1 items-center gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[var(--color-primary-subtle)] text-lg" aria-hidden="true">
          📎
        </div>

        <div className="min-w-0 flex-1">
          <p
            className="truncate text-sm font-semibold text-[var(--text-primary)]"
            style={{ fontFamily: typography.body }}
          >
            {file.name}
          </p>
          <p className="mt-1 text-xs text-[var(--text-tertiary)]" style={{ fontFamily: typography.body }}>
            {formatFileSize(file.size)}
          </p>
        </div>
      </div>

      <button
        onClick={onRemove}
        className="btn-ghost flex h-9 w-9 items-center justify-center rounded-full text-lg transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] focus-visible:ring-offset-2"
        aria-label={`Remove ${file.name}`}
        style={{ fontSize: '1.25rem', lineHeight: 1 }}
      >
        <span aria-hidden="true">×</span>
      </button>
    </div>
  );
}