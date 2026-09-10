import ScoreCard from './ScoreCard';
import FeedbackSection from './FeedbackSection';
import ResetButton from './ResetButton';
import { colors, typography } from '../styles/design-tokens';
import type { FeedbackResponse, ScoreColor } from '../types';

interface FeedbackDisplayProps {
  feedback: FeedbackResponse;
  onReset: () => void;
}

function getScoreColor(score: number): ScoreColor {
  if (score < 50) return 'red';
  if (score < 75) return 'amber';
  return 'emerald';
}

export default function FeedbackDisplay({ feedback, onReset }: FeedbackDisplayProps) {
  return (
    <div 
      className="w-full mx-auto px-4 py-8"
      style={{
        maxWidth: '720px',
        backgroundColor: colors.background,
      }}
    >
      {/* Score Card */}
      <div className="mb-6">
        <ScoreCard score={feedback.overall_score} />
      </div>

      {/* Feedback Sections */}
      <div className="space-y-6">
        {/* Formatting Section */}
        <FeedbackSection
          title="Formatting Issues"
          icon="📝"
          feedback={feedback.formatting.feedback}
          scoreColor={getScoreColor(feedback.formatting.score)}
        />

        {/* Keywords Section */}
        <FeedbackSection
          title="Missing Keywords"
          icon="🔑"
          feedback={feedback.keywords.feedback}
          items={feedback.keywords.missing_suggestions}
          scoreColor={getScoreColor(feedback.keywords.score)}
        />

        {/* ATS Optimization Section */}
        <FeedbackSection
          title="ATS Tips"
          icon="🤖"
          feedback={feedback.ats_optimization.feedback}
          scoreColor={getScoreColor(feedback.ats_optimization.score)}
        />
      </div>

      {/* Summary Section */}
      {feedback.summary && (
        <div 
          className="mt-6 p-6 rounded-xl"
          style={{
            backgroundColor: 'rgba(15, 118, 110, 0.05)',
            border: `1px solid ${colors.border}`,
          }}
        >
          <h3 
            className="mb-2"
            style={{
              fontSize: typography.size.base,
              fontWeight: 600,
              color: colors.text,
            }}
          >
            Summary
          </h3>
          <p 
            style={{
              fontSize: typography.size.base,
              lineHeight: typography.lineHeight.relaxed,
              color: colors.text,
            }}
          >
            {feedback.summary}
          </p>
        </div>
      )}

      {/* Reset Button */}
      <div className="mt-8">
        <ResetButton onClick={onReset} />
      </div>
    </div>
  );
}
