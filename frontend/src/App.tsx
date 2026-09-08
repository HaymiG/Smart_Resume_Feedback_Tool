import { useState } from 'react';
import Dropzone from './components/Dropzone';
import FileChip from './components/FileChip';
import AnalyzeButton from './components/AnalyzeButton';
import ErrorBanner from './components/ErrorBanner';
import LoadingState from './components/LoadingState';
import FeedbackDisplay from './components/FeedbackDisplay';
import { analyzeResume } from './utils/api';
import { colors, typography } from './styles/design-tokens';
import type { AppState, FeedbackResponse } from './types';
import './index.css';

function App() {
  const [state, setState] = useState<AppState>('idle');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [feedback, setFeedback] = useState<FeedbackResponse | null>(null);
  const [error, setError] = useState<string>('');

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
      const result = await analyzeResume(selectedFile);
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

  // Render based on state
  if (state === 'analyzing') {
    return (
      <div 
        className="min-h-screen flex flex-col items-center justify-center p-6"
        style={{ backgroundColor: colors.background }}
      >
        <LoadingState />
      </div>
    );
  }

  if (state === 'success' && feedback) {
    return (
      <div 
        className="min-h-screen p-6"
        style={{ backgroundColor: colors.background }}
      >
        <FeedbackDisplay feedback={feedback} onReset={handleReset} />
      </div>
    );
  }

  // Idle, uploading, or error state
  return (
    <div 
      className="min-h-screen flex flex-col items-center justify-center p-6"
      style={{ backgroundColor: colors.background }}
    >
      <h1 
        className="mb-8 text-center"
        style={{
          fontSize: typography.size['2xl'],
          fontWeight: 600,
          color: colors.text,
          letterSpacing: typography.tracking.tighter,
        }}
      >
        Smart Resume Feedback Tool
      </h1>

      <div className="w-full max-w-xl">
        {!selectedFile ? (
          <Dropzone onFileSelect={handleFileSelect} onError={handleError} />
        ) : (
          <>
            <FileChip file={selectedFile} onRemove={handleFileRemove} />
            <AnalyzeButton
              onClick={handleAnalyze}
              disabled={!selectedFile}
              isLoading={state === 'analyzing'}
            />
          </>
        )}

        {error && <ErrorBanner message={error} />}
      </div>
    </div>
  );
}

export default App;
