import React, { useState } from 'react';
import type { QuickWin } from '../types';
import { Volume2, VolumeX, Eye, Sparkles, CheckCircle2, ArrowRight } from 'lucide-react';

interface CoachPersonaCardProps {
  coachNote?: string;
  recruiterGlance?: string;
  quickWins?: QuickWin[];
  strengths?: string[];
  candidateName?: string;
}

export const CoachPersonaCard: React.FC<CoachPersonaCardProps> = ({
  coachNote,
  recruiterGlance,
  quickWins,
  strengths,
}) => {
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [completedWins, setCompletedWins] = useState<Record<number, boolean>>({});

  const handleToggleVoice = () => {
    if (!('speechSynthesis' in window)) {
      alert('Text-to-speech is not supported in this browser.');
      return;
    }

    if (isPlayingAudio) {
      window.speechSynthesis.cancel();
      setIsPlayingAudio(false);
      return;
    }

    if (!coachNote) return;

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(coachNote);
    utterance.rate = 1.0;
    utterance.pitch = 1.05;

    // Pick a natural English voice if available
    const voices = window.speechSynthesis.getVoices();
    const naturalVoice = voices.find(
      (v) =>
        v.lang.startsWith('en') &&
        (v.name.includes('Natural') || v.name.includes('Google') || v.name.includes('Samantha'))
    );
    if (naturalVoice) utterance.voice = naturalVoice;

    utterance.onend = () => setIsPlayingAudio(false);
    utterance.onerror = () => setIsPlayingAudio(false);

    setIsPlayingAudio(true);
    window.speechSynthesis.speak(utterance);
  };

  const toggleWin = (index: number) => {
    setCompletedWins((prev) => ({ ...prev, [index]: !prev[index] }));
  };

  return (
    <div className="space-y-6">
      {/* Coach Note Card */}
      {coachNote && (
        <div className="surface-card relative overflow-hidden rounded-3xl p-6 sm:p-8 border border-indigo-500/30 bg-gradient-to-br from-indigo-500/[0.07] via-[var(--bg-surface)] to-purple-500/[0.05] shadow-lg">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
            <div className="flex items-center gap-3.5">
              <div className="relative">
                <img
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"
                  alt="AI Career Coach"
                  className="w-13 h-13 sm:w-14 sm:h-14 rounded-2xl object-cover border-2 border-indigo-500 shadow-md"
                />
                <span className="absolute -bottom-1 -right-1 flex h-4 w-4">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-4 w-4 bg-emerald-500 border-2 border-white dark:border-gray-900"></span>
                </span>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base sm:text-lg font-bold text-[var(--text-primary)]">
                    AI Career Coach
                  </h3>
                  <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-indigo-500/15 text-indigo-500">
                    Senior Tech Recruiter Insights
                  </span>
                </div>
                <p className="text-xs text-[var(--text-secondary)]">
                  Personal 1-on-1 Feedback & Strategy Note
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={handleToggleVoice}
              className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold border transition-all cursor-pointer ${
                isPlayingAudio
                  ? 'bg-indigo-500 text-white border-indigo-500 shadow-md animate-pulse'
                  : 'bg-[var(--bg-surface)] border-[var(--border-subtle)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-indigo-400'
              }`}
              title="Listen to the coach read this feedback note"
            >
              {isPlayingAudio ? (
                <>
                  <VolumeX size={15} />
                  <span>Pause Voice</span>
                </>
              ) : (
                <>
                  <Volume2 size={15} className="text-indigo-500" />
                  <span>Listen to Coach</span>
                </>
              )}
            </button>
          </div>

          <div className="relative rounded-2xl bg-[var(--bg-surface)]/70 backdrop-blur-sm border border-[var(--border-subtle)] p-5 mt-2">
            <p className="text-sm sm:text-base leading-relaxed text-[var(--text-primary)] font-medium">
              "{coachNote}"
            </p>
          </div>
        </div>
      )}

      {/* 2-Column Grid: 6-Second Glance + Strengths */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* 6-Second Recruiter Glance */}
        {recruiterGlance && (
          <div className="surface-card rounded-2xl p-5 sm:p-6 border border-[var(--border-subtle)] bg-[var(--bg-surface)] flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 text-amber-500 mb-3">
                <div className="p-2 rounded-xl bg-amber-500/10">
                  <Eye size={18} />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-[var(--text-primary)]">
                    The 6-Second Recruiter Glance
                  </h4>
                  <p className="text-[11px] text-[var(--text-tertiary)]">
                    Simulated first impression eye-tracking
                  </p>
                </div>
              </div>
              <p className="text-sm leading-relaxed text-[var(--text-secondary)]">
                {recruiterGlance}
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-[var(--border-subtle)] text-[11px] text-[var(--text-tertiary)] flex items-center justify-between">
              <span>Recruiters spend an average of 6 to 7.4 seconds on initial screens.</span>
            </div>
          </div>
        )}

        {/* Detected Strengths */}
        {strengths && strengths.length > 0 && (
          <div className="surface-card rounded-2xl p-5 sm:p-6 border border-[var(--border-subtle)] bg-[var(--bg-surface)]">
            <div className="flex items-center gap-2 text-emerald-500 mb-3">
              <div className="p-2 rounded-xl bg-emerald-500/10">
                <Sparkles size={18} />
              </div>
              <div>
                <h4 className="text-sm font-bold text-[var(--text-primary)]">
                  Top Standout Strengths
                </h4>
                <p className="text-[11px] text-[var(--text-tertiary)]">
                  What gives you a competitive advantage
                </p>
              </div>
            </div>
            <ul className="space-y-2.5">
              {strengths.map((strength, idx) => (
                <li
                  key={idx}
                  className="flex items-start gap-2.5 text-xs sm:text-sm text-[var(--text-secondary)]"
                >
                  <CheckCircle2
                    size={16}
                    className="text-emerald-500 shrink-0 mt-0.5"
                  />
                  <span>{strength}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Quick Wins (Do This Today) Interactive Checklist */}
      {quickWins && quickWins.length > 0 && (
        <div className="surface-card rounded-2xl p-5 sm:p-6 border border-[var(--border-subtle)] bg-[var(--bg-surface)]">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h4 className="text-sm sm:text-base font-bold text-[var(--text-primary)]">
                Priority Action Plan (Quick Wins)
              </h4>
              <p className="text-xs text-[var(--text-tertiary)]">
                Complete these 3 high-impact adjustments to immediately boost your interview callbacks.
              </p>
            </div>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-indigo-500/10 text-indigo-500">
              {Object.values(completedWins).filter(Boolean).length} of {quickWins.length} Fixed
            </span>
          </div>

          <div className="space-y-3">
            {quickWins.map((win, idx) => {
              const isChecked = !!completedWins[idx];
              return (
                <div
                  key={idx}
                  onClick={() => toggleWin(idx)}
                  className={`p-4 rounded-xl border transition-all cursor-pointer ${
                    isChecked
                      ? 'border-emerald-500/30 bg-emerald-500/[0.06] opacity-75'
                      : 'border-[var(--border-subtle)] bg-[var(--bg-surface-subtle)] hover:border-indigo-400'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3">
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => {}}
                        className="mt-1 h-4 w-4 rounded text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                      />
                      <div>
                        <div className="flex items-center gap-2">
                          <p
                            className={`text-sm font-semibold ${
                              isChecked
                                ? 'line-through text-[var(--text-tertiary)]'
                                : 'text-[var(--text-primary)]'
                            }`}
                          >
                            {win.title}
                          </p>
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                              win.impact === 'High'
                                ? 'bg-red-500/10 text-red-500 border border-red-500/20'
                                : 'bg-amber-500/10 text-amber-500 border border-amber-500/20'
                            }`}
                          >
                            {win.impact} Impact
                          </span>
                        </div>
                        <p className="text-xs text-[var(--text-secondary)] mt-1 leading-relaxed">
                          {win.how_to_fix}
                        </p>
                      </div>
                    </div>
                    <ArrowRight
                      size={16}
                      className="text-[var(--text-tertiary)] shrink-0 mt-1"
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
