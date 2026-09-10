import { colors, typography } from '../styles/design-tokens';

interface ResetButtonProps {
  onClick: () => void;
}

export default function ResetButton({ onClick }: ResetButtonProps) {
  return (
    <button
      onClick={onClick}
      className="w-full px-6 py-3 rounded-lg font-medium transition-all duration-150"
      style={{
        backgroundColor: 'transparent',
        border: `1px solid ${colors.border}`,
        color: colors.text,
        fontSize: typography.size.base,
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.backgroundColor = 'rgba(10, 10, 10, 0.04)';
        e.currentTarget.style.borderColor = colors.borderHover;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.backgroundColor = 'transparent';
        e.currentTarget.style.borderColor = colors.border;
      }}
    >
      Analyze another resume
    </button>
  );
}
