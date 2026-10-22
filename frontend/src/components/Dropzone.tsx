import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import type { FileRejection } from 'react-dropzone';
import { typography } from '../styles/design-tokens';

const MAX_SIZE = 5 * 1024 * 1024; // 5MB

interface DropzoneProps {
  onFileSelect: (file: File) => void;
  onError: (error: string) => void;
}

export default function Dropzone({ onFileSelect, onError }: DropzoneProps) {
  const onDrop = useCallback(
    (acceptedFiles: File[], rejectedFiles: FileRejection[]) => {
      onError(''); // Clear any previous errors

      if (rejectedFiles.length > 0) {
        const reason = rejectedFiles[0].errors[0]?.code;
        if (reason === 'file-invalid-type') {
          onError('Invalid file type. Only PDF files are allowed.');
        } else if (reason === 'file-too-large') {
          onError('File is too large. Max size is 5MB.');
        } else {
          onError('File was rejected. Please try another.');
        }
        return;
      }

      const file = acceptedFiles[0];
      if (file) {
        onFileSelect(file);
      }
    },
    [onFileSelect, onError]
  );

  const { getRootProps, getInputProps, isDragActive, isFocused, open } = useDropzone({
    onDrop,
    accept: { 'application/pdf': ['.pdf'] },
    maxSize: MAX_SIZE,
    multiple: false,
  });

  return (
    <div
      {...getRootProps()}
      aria-label="Upload resume PDF"
      role="button"
      tabIndex={0}
      className="surface-card interactive relative flex flex-col items-center justify-center rounded-2xl border-2 border-dashed p-7 text-center transition-all duration-200 sm:p-10"
      style={{
        borderColor: isDragActive ? 'var(--color-primary)' : isFocused ? 'var(--border-focus)' : 'var(--border-subtle)',
        background: isDragActive
          ? 'var(--color-primary-subtle)'
          : isFocused
          ? 'linear-gradient(180deg, var(--bg-surface), var(--color-primary-subtle))'
          : 'linear-gradient(180deg, var(--bg-surface), var(--bg-surface-subtle))',
        boxShadow: isDragActive || isFocused ? 'var(--shadow-lg)' : 'var(--shadow-md)',
      }}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          open();
        }
      }}
    >
      <input {...getInputProps()} />

      <div className="mb-5 flex items-center justify-center">
        <div className={`flex h-16 w-16 items-center justify-center rounded-2xl bg-[var(--color-primary-subtle)] text-3xl shadow-sm transition-transform duration-300 ${
          isDragActive ? 'scale-110 rotate-3' : ''
        }`}>
          📄
        </div>
      </div>

      <div className="max-w-lg">
        <p
          className="text-lg font-semibold text-[var(--text-primary)] sm:text-xl"
          style={{
            fontFamily: typography.heading,
            letterSpacing: typography.tracking.tight,
            lineHeight: typography.lineHeight.snug,
          }}
        >
          {isDragActive ? 'Drop the PDF here' : 'Drag and drop your resume, or click to browse'}
        </p>

        <p
          className="mx-auto mt-3 max-w-md text-sm leading-6 text-[var(--text-secondary)] sm:text-base"
          style={{ fontFamily: typography.body, lineHeight: typography.lineHeight.relaxed }}
        >
          We keep the flow simple: upload a PDF, review the score, and expand the sections that need attention.
        </p>
      </div>

      <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
        {['PDF only', 'Max 5MB', 'Click or drag'].map((label) => (
          <span
            key={label}
            className="inline-flex items-center gap-1.5 rounded-full border border-[var(--border-subtle)] bg-[var(--bg-surface)] px-3 py-1 text-xs font-medium uppercase tracking-wider text-[var(--text-tertiary)] shadow-sm"
          >
            {label}
          </span>
        ))}
      </div>

      {isFocused && !isDragActive && (
        <div className="absolute inset-0 rounded-2xl ring-2 ring-[var(--color-primary)] ring-offset-2 ring-offset-[var(--bg-surface)] pointer-events-none" aria-hidden="true" />
      )}
    </div>
  );
}