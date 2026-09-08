import { colors, typography } from '../styles/design-tokens';

interface AnalyzeButtonProps {
  onClick: () => void;
  disabled: boolean;
  isLoading: boolean;
}

export default function AnalyzeButton({ onClick, disabled, isLoading }: AnalyzeButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled || isLoading}
      className="w-full mt-4 px-6 py-3 rounded-lg font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
      style={{
        backgroundColor: disabled ? 'rgba(10, 10, 10, 0.1)' : colors.emerald,
        color: disabled ? colors. muted : '#ffffff',
        fontSize: typography.size.base,
        boxShadow: disabled ? 'none' : colors.shadow,
      }}
      onMouseEnter={(e) => {
        if (!disabled && !isLoading) {
          e.currentTarget.style.backgroundColor = '#0d6860';
        }
      }}
      onMouseLeave={(e) => {
        if (!disabled && !isLoading) {
          e.currentTarget.style.backgroundColor = colors.emerald;
        }
      }}
    >
      {isLoading ? (
        <span className="flex items-center justify-center gap-2">
          <div 
            className="w-4 h-4 border-2 border-t-transparent rounded-full animate-spin"
            style={{
              borderColor: '#ffffff',
              borderTopColor: 'transparent',
            }}
          />
          Analyzing...
        </span>
      ) : (
        'Analyze Resume'
      )}
    </button>
  );
}
