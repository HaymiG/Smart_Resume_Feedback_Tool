import { useEffect } from 'react';
import confetti from 'canvas-confetti';
import ScoreCard from './ScoreCard';
import FeedbackSection from './FeedbackSection';
import ResetButton from './ResetButton';
import { CoachPersonaCard } from './CoachPersonaCard';
import { InteractiveKeywords } from './InteractiveKeywords';
import { ATSChecklist } from './ATSChecklist';
import { typography } from '../styles/design-tokens';
import type { FeedbackResponse, ScoreColor } from '../types';
import { Download, PenTool, CheckCircle2 } from 'lucide-react';

interface FeedbackDisplayProps {
  feedback: FeedbackResponse;
  onReset: () => void;
  onOpenRewriter?: (sample?: string) => void;
}

function getScoreColor(score: number): ScoreColor {
  if (score < 50) return 'red';
  if (score < 75) return 'amber';
  return 'emerald';
}

function getVerdict(score: number): string {
  if (score < 50) return 'Needs Improvement';
  if (score < 75) return 'Good Progress';
  if (score < 90) return 'Strong Resume';
  return 'Excellent Resume';
}

function getVerdictColor(score: number): string {
  if (score < 50) return 'var(--color-error)';
  if (score < 75) return 'var(--color-warning)';
  return 'var(--color-success)';
}

export default function FeedbackDisplay({
  feedback,
  onReset,
  onOpenRewriter,
}: FeedbackDisplayProps) {
  const verdict = getVerdict(feedback.overall_score);
  const verdictColor = getVerdictColor(feedback.overall_score);

  // Trigger celebratory confetti if score is strong (80+)
  useEffect(() => {
    if (feedback.overall_score >= 80) {
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#6366f1', '#a855f7', '#10b981', '#f59e0b'],
        });
      } catch {
        // Ignore in testing environments
      }
    }
  }, [feedback.overall_score]);

  // Export comprehensive report as Markdown
  const handleExportReport = () => {
    const report = `# Smart Resume Feedback Report
Date: ${new Date().toLocaleDateString()}
Overall Score: ${feedback.overall_score} / 100 (${verdict})

## Score Breakdown
- Formatting: ${feedback.formatting.score} / 100
- Keywords: ${feedback.keywords.score} / 100
- ATS Optimization: ${feedback.ats_optimization.score} / 100

## AI Career Coach Note
${feedback.coach_note || feedback.summary}

## 6-Second Recruiter Glance
${feedback.recruiter_glance || 'Clean candidate profile with solid foundations.'}

## Detailed Feedback
### Formatting
${feedback.formatting.feedback}

### Missing Keywords
${(feedback.keywords.missing_suggestions || []).map((k) => `- ${k}`).join('\n')}
${feedback.keywords.feedback}

### ATS Optimization
${feedback.ats_optimization.feedback}

## Summary
${feedback.summary}
`;

    const blob = new Blob([report], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `resume-feedback-report-${feedback.overall_score}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="mx-auto w-full max-w-5xl space-y-6 px-0 py-0 animate-fade-in">
      {/* Top Banner Card */}
      <div className="surface-card animate-fade-up stagger-1 rounded-3xl p-6 sm:p-8 lg:p-10 border border-[var(--border-subtle)] bg-[var(--bg-surface)] shadow-xl">
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:items-center">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                <CheckCircle2 size={13} /> Analysis Complete
              </span>
              {feedback.filename && (
                <span className="text-xs text-[var(--text-tertiary)] truncate max-w-[200px]">
                  {feedback.filename}
                </span>
              )}
            </div>

            <h1
              className="text-2xl font-bold tracking-tight text-[var(--text-primary)] sm:text-3xl lg:text-4xl"
              style={{
                fontFamily: typography.heading,
                letterSpacing: typography.tracking.tighter,
                lineHeight: typography.lineHeight.tight,
              }}
            >
              Your resume scored <span className="text-indigo-500 font-extrabold">{feedback.overall_score}</span> out of 100.
            </h1>

            <p
              className="max-w-2xl text-sm sm:text-base leading-relaxed text-[var(--text-secondary)]"
              style={{ fontFamily: typography.body }}
            >
              We paired technical ATS parsing with recruiter eye-tracking. Review your breakdown,
              listen to the AI Career Coach, and use the interactive tools below to boost your score.
            </p>

            <div className="flex flex-wrap gap-2.5 pt-2">
              {[
                { label: 'Formatting', score: feedback.formatting.score },
                { label: 'Keywords', score: feedback.keywords.score },
                { label: 'ATS Ready', score: feedback.ats_optimization.score },
              ].map((item) => {
                const color = getVerdictColor(item.score);
                return (
                  <span
                    key={item.label}
                    className="inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs sm:text-sm font-semibold"
                    style={{
                      backgroundColor: `${color}18`,
                      color: color,
                      borderColor: `${color}40`,
                    }}
                  >
                    {item.label}: {item.score}
                  </span>
                );
              })}
            </div>

            {/* Quick Action Toolbar */}
            <div className="flex flex-wrap items-center gap-3 pt-3">
              <button
                type="button"
                onClick={handleExportReport}
                className="inline-flex items-center gap-2 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface-subtle)] px-4 py-2 text-xs font-semibold text-[var(--text-primary)] hover:border-indigo-400 hover:text-indigo-500 transition-colors cursor-pointer"
              >
                <Download size={14} />
                <span>Export Report (Markdown)</span>
              </button>

              {onOpenRewriter && (
                <button
                  type="button"
                  onClick={() => onOpenRewriter()}
                  className="inline-flex items-center gap-2 rounded-xl bg-indigo-500/10 border border-indigo-500/30 px-4 py-2 text-xs font-semibold text-indigo-500 hover:bg-indigo-500/20 transition-colors cursor-pointer"
                >
                  <PenTool size={14} />
                  <span>Open STAR Rewriter</span>
                </button>
              )}
            </div>
          </div>

          <ScoreCard score={feedback.overall_score} />
        </div>
      </div>

      {/* Human AI Coach Persona Card */}
      <CoachPersonaCard
        coachNote={feedback.coach_note}
        recruiterGlance={feedback.recruiter_glance}
        quickWins={feedback.quick_wins}
        strengths={feedback.strengths}
      />

      {/* Interactive Keyword Explorer */}
      {feedback.keywords.missing_suggestions && feedback.keywords.missing_suggestions.length > 0 && (
        <InteractiveKeywords
          keywords={feedback.keywords.missing_suggestions}
          onOpenRewriterWithSample={onOpenRewriter}
        />
      )}

      {/* ATS Simulator & Heuristics Matrix */}
      <ATSChecklist initialScore={feedback.ats_optimization.score} />

      {/* Deep-Dive Expandable Sections */}
      <div className="space-y-4">
        <FeedbackSection
          title="Formatting & Structural Assessment"
          icon="📝"
          feedback={feedback.formatting.feedback}
          scoreColor={getScoreColor(feedback.formatting.score)}
          defaultOpen
        />

        <FeedbackSection
          title="Keywords & Hard Technical Skills"
          icon="🔑"
          feedback={feedback.keywords.feedback}
          items={feedback.keywords.missing_suggestions}
          scoreColor={getScoreColor(feedback.keywords.score)}
          defaultOpen
        />

        <FeedbackSection
          title="ATS Optimization & Machine Readability"
          icon="🤖"
          feedback={feedback.ats_optimization.feedback}
          scoreColor={getScoreColor(feedback.ats_optimization.score)}
          defaultOpen={false}
        />
      </div>

      {/* Executive Summary */}
      {feedback.summary && (
        <div
          className="surface-card rounded-3xl p-6 sm:p-7 relative overflow-hidden border border-indigo-500/30 bg-gradient-to-r from-indigo-500/[0.08] to-purple-500/[0.05]"
        >
          <div className="relative flex items-start gap-3.5">
            <div
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl"
              style={{ backgroundColor: `${verdictColor}20` }}
            >
              <span style={{ color: verdictColor }} aria-hidden="true">
                💡
              </span>
            </div>
            <div className="flex-1">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--text-tertiary)]">
                Recruiter Verdict & Executive Summary
              </h3>
              <p className="mt-2 text-sm sm:text-base leading-relaxed text-[var(--text-primary)] font-medium">
                {feedback.summary}
              </p>
              <div
                className="mt-3 inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-bold"
                style={{ backgroundColor: `${verdictColor}18`, color: verdictColor }}
              >
                {verdict}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Footer Reset Navigation */}
      <div className="pt-4 flex items-center justify-between">
        <ResetButton onClick={onReset} />
        {onOpenRewriter && (
          <button
            type="button"
            onClick={() => onOpenRewriter()}
            className="text-xs font-semibold text-indigo-500 hover:text-indigo-600 transition-colors"
          >
            Practice Bullet Rewriting →
          </button>
        )}
      </div>
    </div>
  );
}
