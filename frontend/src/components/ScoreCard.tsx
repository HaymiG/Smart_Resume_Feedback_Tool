import { typography } from '../styles/design-tokens';
import { useEffect, useRef, useState } from 'react';

interface ScoreCardProps {
  score: number;
}

function getScoreColor(score: number): string {
  if (score < 50) return 'var(--color-error)';
  if (score < 75) return 'var(--color-warning)';
  return 'var(--color-success)';
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
  const [animatedScore, setAnimatedScore] = useState(0);
  const [animatedProgress, setAnimatedProgress] = useState(0);
  const circleRef = useRef<SVGCircleElement>(null);

  // SVG circle configuration
  const size = 120;
  const strokeWidth = 8;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const targetProgress = (score / 100) * circumference;

  // Animate score number and circle on mount
  useEffect(() => {
    let scoreFrame: number;
    const startTime = Date.now();
    const duration = 1000; // 1 second

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Easing function (cubic-bezier(0.2, 0.8, 0.2, 1) equivalent)
      const eased = 1 - Math.pow(1 - progress, 3);

      setAnimatedScore(Math.round(score * eased));
      setAnimatedProgress(circumference - targetProgress * eased);

      if (progress < 1) {
        scoreFrame = requestAnimationFrame(animate);
      }
    };

    animate();
    return () => {
      if (scoreFrame) cancelAnimationFrame(scoreFrame);
    };
  }, [score, circumference, targetProgress]);

  return (
    <div
      className="surface-card interactive animate-scale-in stagger-2 flex flex-col items-center rounded-2xl p-7 text-center sm:p-8"
    >
      <div className="mb-3 inline-flex items-center gap-1.5 rounded-full border border-[var(--border-subtle)] bg-[var(--bg-surface-subtle)] px-3 py-1 text-xs font-medium uppercase tracking-wider text-[var(--text-tertiary)]">
        Overall score
      </div>

      <div className="relative" style={{ width: size, height: size }}>
        <svg className="transform -rotate-90" width={size} height={size}>
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="var(--border-subtle)"
            strokeWidth={strokeWidth}
            fill="none"
            strokeOpacity="0.3"
          />
          <circle
            ref={circleRef}
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={scoreColor}
            strokeWidth={strokeWidth}
            fill="none"
            strokeDasharray={circumference}
            strokeDashoffset={circumference - animatedProgress}
            strokeLinecap="round"
            style={{
              filter: 'drop-shadow(0 2px 8px rgba(0, 0, 0, 0.1))',
            }}
          />
        </svg>

        <div
          className="absolute inset-0 flex items-center justify-center"
          style={{
            fontSize: typography.size['4xl'],
            fontWeight: 600,
            color: 'var(--text-primary)',
            letterSpacing: typography.tracking.tighter,
            lineHeight: typography.lineHeight.tight,
            fontFamily: typography.heading,
          }}
        >
          {animatedScore}
        </div>
      </div>

      <div
        className="mt-5 inline-flex items-center rounded-full px-4 py-2 text-sm font-semibold"
        style={{
          backgroundColor: `${scoreColor}18`,
          color: scoreColor,
        }}
      >
        {verdict}
      </div>

      <p className="mt-3 text-center text-sm text-[var(--text-tertiary)]" style={{ fontFamily: typography.body }}>
        out of 100
      </p>
    </div>
  );
}