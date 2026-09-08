import { colors, typography } from '../styles/design-tokens';

interface ErrorBannerProps {
  message: string;
}

export default function ErrorBanner({ message }: ErrorBannerProps) {
  if (!message) return null;

  return (
    <div 
      className="flex items-start gap-3 p-4 mt-4 rounded-xl"
      style={{
        backgroundColor: colors.errorBg,
      }}
    >
      {/* Warning icon */}
      <span 
        style={{
          fontSize: typography.size.lg,
          flexShrink: 0,
        }}
      >
        ⚠️
      </span>
      
      {/* Error message */}
      <p 
        style={{
          fontSize: typography.size.sm,
          lineHeight: typography.lineHeight.normal,
          color: colors.errorText,
          flex: 1,
        }}
      >
        {message}
      </p>
    </div>
  );
}
