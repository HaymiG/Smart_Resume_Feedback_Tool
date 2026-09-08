import { colors, typography } from '../styles/design-tokens';
import type { ScoreColor } from '../types';

interface FeedbackSectionProps {
  title: string;
  icon: string;
  feedback: string;
  items?: string[];
  scoreColor?: ScoreColor;
}

function getColorForScore(scoreColor?: ScoreColor): string {
  if (scoreColor === 'red') return colors.red;
  if (scoreColor === 'amber') return colors.amber;
  if (scoreColor === 'emerald') return colors.emerald;
  return colors.muted;
}

export default function FeedbackSection({ 
  title, 
  icon, 
  feedback, 
  items,
  scoreColor 
}: FeedbackSectionProps) {
  const dotColor = getColorForScore(scoreColor);

  return (
    <div 
      className="p-6 bg-[#FAFAF8] rounded-xl"
      style={{ 
        boxShadow: colors.shadowLight,
        border: `1px solid ${colors.border}`,
      }}
    >
      {/* Header with icon and title */}
      <div className="flex items-center gap-2 mb-4">
        <span style={{ fontSize: typography.size.lg }}>{icon}</span>
        <h3 
          style={{
            fontSize: typography.size.lg,
            fontWeight: 600,
            color: colors.text,
          }}
        >
          {title}
        </h3>
      </div>

      {/* Feedback text */}
      <p 
        style={{
          fontSize: typography.size.base,
          lineHeight: typography.lineHeight.relaxed,
          color: colors.text,
          marginBottom: items && items.length > 0 ? '16px' : '0',
        }}
      >
        {feedback}
      </p>

      {/* Optional items list */}
      {items && items.length > 0 && (
        <ul className="space-y-3">
          {items.map((item, index) => (
            <li key={index} className="flex items-start gap-3">
              {/* Colored dot indicator */}
              <div 
                className="mt-2 flex-shrink-0"
                style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  backgroundColor: dotColor,
                }}
              />
              {/* Item text */}
              <span 
                style={{
                  fontSize: typography.size.base,
                  lineHeight: typography.lineHeight.normal,
                  color: colors.text,
                  flex: 1,
                }}
              >
                {item}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
