import { useEffect, useState } from 'react';
import Dropzone from './components/Dropzone';
import FileChip from './components/FileChip';
import AnalyzeButton from './components/AnalyzeButton';
import ErrorBanner from './components/ErrorBanner';
import LoadingState from './components/LoadingState';
import FeedbackDisplay from './components/FeedbackDisplay';
import { NavigationHeader } from './components/NavigationHeader';
import { HistoryPage } from './components/HistoryPage';
import { BulletRewriter } from './components/BulletRewriter';
import { AuthModal } from './components/AuthModal';
import { AuthProvider } from './context/AuthContext';
import { useAuth } from './context/useAuth';
import { analyzeResume, getLocalHistory } from './utils/api';
import { typography } from './styles/design-tokens';
import type { AppState, FeedbackResponse, NavigationTab } from './types';
import {
  Sparkles,
  Zap,
  Target,
  FileCheck2,
  TrendingUp,
  Cpu,
} from 'lucide-react';
import './index.css';

const highlights = [
  'PDF only (max 5MB)',
  'ATS machine scanner',
  'AI Recruiter Coach',
  'STAR bullet rewriter',
];

function MainApp() {
  const { user } = useAuth();
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    const savedTheme = localStorage.getItem('resume-feedback-theme');
    if (savedTheme === 'light' || savedTheme === 'dark') {
      return savedTheme;
    }
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  });

  const [currentTab, setCurrentTab] = useState<NavigationTab>('analyze');
  const [state, setState] = useState<AppState>('idle');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [feedback, setFeedback] = useState<FeedbackResponse | null>(null);
  const [error, setError] = useState<string>('');
  const [targetRole, setTargetRole] = useState<string>('Full Stack Software Engineer');
  const [rewriterInitialBullet, setRewriterInitialBullet] = useState<string>('');
  const historyCount = getLocalHistory(user?.id).length;

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem('resume-feedback-theme', theme);
  }, [theme]);

  const handleFileSelect = (file: File) => {
    setSelectedFile(file);
    setError('');
  };

  const handleFileRemove = () => {
    setSelectedFile(null);
    setError('');
  };

  const handleAnalyze = async () => {
    if (!selectedFile) return;

    setState('analyzing');
    setError('');

    try {
      const result = await analyzeResume(selectedFile, user);
      setFeedback(result);
      setState('success');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Analysis failed. Please try again.');
      setState('error');
    }
  };

  const handleReset = () => {
    setState('idle');
    setSelectedFile(null);
    setFeedback(null);
    setError('');
  };

  const handleError = (errorMessage: string) => {
    setError(errorMessage);
    if (errorMessage) {
      setState('error');
    }
  };

  const handleErrorDismiss = () => {
    setError('');
    if (state === 'error') {
      setState('idle');
    }
  };

  const handleOpenRewriterWithSample = (sample?: string) => {
    if (sample) {
      setRewriterInitialBullet(sample);
    }
    setCurrentTab('rewriter');
  };

  const handleSelectReportFromHistory = (report: FeedbackResponse) => {
    setFeedback(report);
    setState('success');
    setCurrentTab('analyze');
  };

  const toggleTheme = () => {
    setTheme((currentTheme) => (currentTheme === 'dark' ? 'light' : 'dark'));
  };

  const isBusy = state === 'analyzing';

  return (
    <div className="app-shell min-h-screen w-full flex flex-col bg-[var(--bg-primary)]">
      {/* Top Navbar */}
      <NavigationHeader
        currentTab={currentTab}
        onTabChange={setCurrentTab}
        theme={theme}
        onToggleTheme={toggleTheme}
        historyCount={historyCount}
      />

      {/* Global Auth Modal */}
      <AuthModal />

      {/* Main Content Area */}
      <main className="mx-auto flex w-full max-w-7xl flex-1 flex-col px-4 py-6 sm:px-6 lg:px-8">
        {/* TAB 1: REVIEWER */}
        {currentTab === 'analyze' && (
          <>
            {isBusy ? (
              <div className="relative z-10 flex min-h-[70vh] w-full flex-col justify-center">
                <LoadingState />
              </div>
            ) : state === 'success' && feedback ? (
              <FeedbackDisplay
                feedback={feedback}
                onReset={handleReset}
                onOpenRewriter={handleOpenRewriterWithSample}
              />
            ) : (
              <div className="space-y-8 animate-fade-in">
                {/* Hero section */}
                <section className="space-y-4">
                  <div className="flex flex-wrap items-center gap-2">
                    <div className="inline-flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-3.5 py-1 text-xs font-semibold text-indigo-500">
                      <span className="relative flex h-2 w-2 rounded-full bg-emerald-500" />
                      AI Senior Recruiter & ATS Career Coach
                    </div>
                  </div>

                  <div className="max-w-4xl">
                    <h1
                      className="text-3xl font-extrabold tracking-tight text-[var(--text-primary)] sm:text-4xl lg:text-5xl"
                      style={{
                        fontFamily: typography.heading,
                        letterSpacing: typography.tracking.tighter,
                        lineHeight: typography.lineHeight.tight,
                      }}
                    >
                      Smart Resume Feedback <span className="text-indigo-500">& Coaching</span>
                    </h1>
                    <p
                      className="mt-3 max-w-3xl text-sm sm:text-base leading-relaxed text-[var(--text-secondary)]"
                      style={{ fontFamily: typography.body }}
                    >
                      Upload your PDF resume to receive a complete 360° audit: ATS parsing heuristics,
                      recruiter eye-tracking, missing keywords, and 1-click STAR bullet improvements.
                    </p>
                  </div>

                  {/* Highlights badges */}
                  <div className="flex flex-wrap gap-2 pt-1">
                    {highlights.map((highlight, index) => (
                      <span
                        key={highlight}
                        className={`inline-flex items-center gap-1.5 rounded-full border border-[var(--border-subtle)] bg-[var(--bg-surface)] px-3.5 py-1.5 text-xs font-semibold text-[var(--text-primary)] animate-fade-up stagger-${
                          index + 1
                        }`}
                      >
                        {highlight}
                      </span>
                    ))}
                  </div>
                </section>

                {/* 2-Column Upload and Context Area */}
                <div className="grid gap-6 lg:grid-cols-[minmax(0,1.2fr)_minmax(300px,0.8fr)] lg:items-start">
                  {/* Upload Card */}
                  <section className="surface-card rounded-3xl p-6 sm:p-8 border border-[var(--border-subtle)] bg-[var(--bg-surface)] shadow-md space-y-5">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-[var(--border-subtle)] pb-4">
                      <div>
                        <p className="text-xs font-bold uppercase tracking-wider text-[var(--text-tertiary)]">
                          Step 1: Select Resume File
                        </p>
                        <h2 className="text-lg sm:text-xl font-bold text-[var(--text-primary)]">
                          Upload your PDF resume
                        </h2>
                      </div>

                      {/* Optional Target Role Selector */}
                      <div className="flex items-center gap-2">
                        <Target size={15} className="text-indigo-500" />
                        <select
                          value={targetRole}
                          onChange={(e) => setTargetRole(e.target.value)}
                          className="rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface-subtle)] px-2.5 py-1 text-xs font-semibold text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-indigo-500"
                          title="Target career track for tailored keyword analysis"
                        >
                          <option value="Full Stack Software Engineer">Full Stack Engineer</option>
                          <option value="Backend Developer (Python/Go)">Backend Developer</option>
                          <option value="Frontend Developer (React)">Frontend Developer</option>
                          <option value="DevOps & Cloud Engineer">DevOps Engineer</option>
                          <option value="Data Scientist / ML">Data Scientist / ML</option>
                        </select>
                      </div>
                    </div>

                    {!selectedFile ? (
                      <Dropzone onFileSelect={handleFileSelect} onError={handleError} />
                    ) : (
                      <div className="space-y-4">
                        <FileChip file={selectedFile} onRemove={handleFileRemove} />
                        <AnalyzeButton
                          onClick={handleAnalyze}
                          disabled={!selectedFile}
                          isLoading={isBusy}
                        />
                      </div>
                    )}

                    {error && <ErrorBanner message={error} onDismiss={handleErrorDismiss} />}
                  </section>

                  {/* Sidebar: What Coach Alex Evaluates */}
                  <aside className="surface-card rounded-3xl p-6 sm:p-7 border border-[var(--border-subtle)] bg-[var(--bg-surface)] shadow-md space-y-4 lg:sticky lg:top-20">
                    <div className="flex items-center gap-2.5 pb-2 border-b border-[var(--border-subtle)]">
                      <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-500">
                        <Sparkles size={18} />
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-[var(--text-primary)]">
                          What the AI Coach Reviews
                        </h3>
                        <p className="text-[11px] text-[var(--text-tertiary)]">
                          Human empathy meets ATS algorithms
                        </p>
                      </div>
                    </div>

                    <div className="space-y-3">
                      {[
                        {
                          icon: <FileCheck2 size={16} className="text-emerald-500" />,
                          title: '6-Second Recruiter Glance',
                          description:
                            'Simulates how an executive recruiter scans your layout, titles, and dates.',
                        },
                        {
                          icon: <Cpu size={16} className="text-indigo-500" />,
                          title: 'Machine ATS Parsing Score',
                          description:
                            'Verifies that applicant tracking systems like Workday or Greenhouse parse your text without breaks.',
                        },
                        {
                          icon: <Zap size={16} className="text-amber-500" />,
                          title: 'STAR Impact Playground',
                          description:
                            'Get instant rewrites for weak bullets using metrics, power verbs, and business outcomes.',
                        },
                        {
                          icon: <TrendingUp size={16} className="text-purple-500" />,
                          title: 'Score Progression Timeline',
                          description:
                            'Saved automatically to your history so you can track improvements across every version.',
                        },
                      ].map((card, i) => (
                        <div
                          key={i}
                          className="p-3.5 rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-surface-subtle)] flex items-start gap-3"
                        >
                          <div className="mt-0.5 shrink-0">{card.icon}</div>
                          <div>
                            <p className="text-xs font-bold text-[var(--text-primary)]">
                              {card.title}
                            </p>
                            <p className="text-[11px] text-[var(--text-secondary)] mt-0.5 leading-relaxed">
                              {card.description}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </aside>
                </div>
              </div>
            )}
          </>
        )}

        {/* TAB 2: MY HISTORY */}
        {currentTab === 'history' && (
          <HistoryPage
            onSelectReport={handleSelectReportFromHistory}
            onNewAnalysis={() => {
              handleReset();
              setCurrentTab('analyze');
            }}
          />
        )}

        {/* TAB 3: STAR BULLET REWRITER */}
        {currentTab === 'rewriter' && (
          <div className="mx-auto w-full max-w-4xl space-y-6 animate-fade-in">
            <div className="text-center max-w-xl mx-auto space-y-2 mb-6">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-[var(--text-primary)]">
                AI Resume Bullet Studio
              </h1>
              <p className="text-xs sm:text-sm text-[var(--text-secondary)]">
                Transform passive duties into punchy achievements using the proven STAR framework
                (Situation, Task, Action, Result).
              </p>
            </div>
            <BulletRewriter initialBullet={rewriterInitialBullet} />
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="mt-auto border-t border-[var(--border-subtle)] bg-[var(--bg-surface)] py-5 text-center text-xs text-[var(--text-tertiary)]">
        <div className="mx-auto flex max-w-7xl flex-col sm:flex-row items-center justify-between gap-3 px-4">
          <p>© 2026 Smart Resume Feedback Tool • Powered by Google Gemini & Supabase</p>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setCurrentTab('analyze')}
              className="hover:text-[var(--text-primary)] cursor-pointer"
            >
              Reviewer
            </button>
            <button
              onClick={() => setCurrentTab('history')}
              className="hover:text-[var(--text-primary)] cursor-pointer"
            >
              My History
            </button>
            <button
              onClick={() => setCurrentTab('rewriter')}
              className="hover:text-[var(--text-primary)] cursor-pointer"
            >
              STAR Rewriter
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <MainApp />
    </AuthProvider>
  );
}
