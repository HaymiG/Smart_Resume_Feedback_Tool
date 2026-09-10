import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import type { FileRejection } from 'react-dropzone';
import { colors, typography } from '../styles/design-tokens';

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

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'application/pdf': ['.pdf'] },
    maxSize: MAX_SIZE,
    multiple: false,
  });

  return (
    <div
      {...getRootProps()}
      className="flex flex-col items-center justify-center p-12 rounded-xl cursor-pointer transition-all duration-200"
      style={{
        border: isDragActive 
          ? `2px solid ${colors.emerald}` 
          : `2px dashed ${colors.border}`,
        backgroundColor: isDragActive ? 'rgba(15, 118, 110, 0.05)' : colors.background,
      }}
    >
      <input {...getInputProps()} />
      
      {/* Upload icon */}
      <div 
        className="mb-4"
        style={{
          fontSize: '48px',
        }}
      >
        📄
      </div>

      {/* Main text */}
      <p 
        style={{
          fontSize: typography.size.base,
          color: colors.text,
          textAlign: 'center',
          marginBottom: '8px',
        }}
      >
        {isDragActive
          ? 'Drop the PDF here...'
          : 'Drag & drop your resume, or click to browse'}
      </p>

      {/* Subtext */}
      <p 
        style={{
          fontSize: typography.size.sm,
          color: colors.muted,
          textAlign: 'center',
        }}
      >
        PDF only, max 5MB
      </p>
    </div>
  );
}
