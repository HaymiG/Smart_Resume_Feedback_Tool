import type { FileValidation } from '../types';

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB in bytes
const ALLOWED_MIME_TYPE = 'application/pdf';

export function validateFile(file: File): FileValidation {
  // Check file type
  if (file.type !== ALLOWED_MIME_TYPE) {
    return {
      isValid: false,
      error: 'Invalid file type. Only PDF files are allowed.',
    };
  }

  // Check file size
  if (file.size > MAX_FILE_SIZE) {
    return {
      isValid: false,
      error: 'File is too large. Max size is 5MB.',
    };
  }

  return { isValid: true };
}
