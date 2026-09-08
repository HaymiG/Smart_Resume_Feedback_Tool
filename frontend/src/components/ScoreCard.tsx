import { colors, typography } from '../styles/design-tokens';

interface ScoreCardProps {
  score: number;
}

function getScoreColor(score: number): string {
  if (score < 50) return colors.red;
  if (score < 75) return colors.amber;
  return colors.emerald;
}

function getVerdict(score: number): string {
  if (score < 50) return 'Needs Improvement';
  if (score < 75) return 'Good Progress';
  if (score < 90) return 'Strong Resume';
  return 'Excellent Resume';
}

export default function ScoreCard({ score }: ScoreCardProps) {
  const scoreColor = getScoreColor(score);
  const verdict = getVerdict(score);
  
  // SVG circle configuration
  const size = 120;
  const strokeWidth = 8;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = (score / 100) * circumference;
  const dashOffset = circumference - progress;

  return (
    <div 
      className="flex flex-col items-center p-8 bg-[#FAFAF8] rounded-xl"
      style={{ boxShadow: colors.shadow }}
    >
      {/* Circular Progress Ring */}
      <div className="relative" style={{ width: size, height: size }}>
        {/* Background circle */}
        <svg className="transform -rotate-90" width={size} height={size}>
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="rgba(10, 10, 10, 0.08)"
            strokeWidth={strokeWidth}
            fill="none"
          />
          {/* Progress circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={scoreColor}
            strokeWidth={strokeWidth}
            fill="none"
            strokeDasharray={circumference}
            strokeDashoffset={dashOffset}
            strokeLinecap="round"
            style={{ 
              transition: 'stroke-dashoffset 0.5s ease',
            }}
          />
        </svg>
        
        {/* Score number centered in ring */}
        <div 
          className="absolute inset-0 flex items-center justify-center"
          style={{
            fontSize: typography.size['4xl'],
            fontWeight: 600,
            color: colors.text,
            letterSpacing: typography.tracking.tighter,
          }}
        >
          {score}
        </div>
      </div>

      {/* Verdict text */}
      <p 
        className="mt-4 text-center"
        style={{
          fontSize: typography.size.base,
          color: colors.muted,
        }}
      >
        {verdict}
      </p>
      
      <p 
        className="mt-1 text-center"
        style={{
          fontSize: typography.size.sm,
          color: colors.muted,
        }}
      >
        out of 100
      </p>
    </div>
  );
}
