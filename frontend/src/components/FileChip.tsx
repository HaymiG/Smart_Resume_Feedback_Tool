import { colors, typography } from '../styles/design-tokens';

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
    <div 
      className="flex items-center justify-between gap-3 px-4 py-3 mt-4 rounded-lg transition-colors duration-150"
      style={{
        backgroundColor: 'rgba(10, 10, 10, 0.04)',
        border: `1px solid ${colors.border}`,
      }}
    >
      {/* File info */}
      <div className="flex-1 min-w-0">
        <p 
          className="truncate"
          style={{
            fontSize: typography.size.sm,
            color: colors.text,
            fontWeight: 500,
          }}
        >
          {file.name}
        </p>
        <p 
          style={{
            fontSize: typography.size.xs,
            color: colors.muted,
          }}
        >
          {formatFileSize(file.size)}
        </p>
      </div>

      {/* Remove button */}
      <button
        onClick={onRemove}
        className="flex items-center justify-center w-6 h-6 rounded-full transition-colors duration-150 hover:bg-[rgba(10,10,10,0.08)]"
        style={{
          color: colors.muted,
          fontSize: typography.size.lg,
        }}
        aria-label="Remove file"
      >
        ×
      </button>
    </div>
  );
}
