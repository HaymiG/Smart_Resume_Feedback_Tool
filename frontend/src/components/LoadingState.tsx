import { useState, useEffect } from 'react';
import { colors, typography } from '../styles/design-tokens';

const statusMessages = [
  "Reading your resume…",
  "Scoring formatting…",
  "Almost done…"
];

export default function LoadingState() {
  const [messageIndex, setMessageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setMessageIndex((prev) => (prev + 1) % statusMessages.length);
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center p-12">
      {/* Spinner */}
      <div 
        className="w-12 h-12 border-4 border-t-transparent rounded-full animate-spin mb-4"
        style={{
          borderColor: colors.emerald,
          borderTopColor: 'transparent',
        }}
      />
      
      {/* Status message */}
      <p 
        style={{
          fontSize: typography.size.base,
          color: colors.text,
          textAlign: 'center',
        }}
      >
        {statusMessages[messageIndex]}
      </p>
    </div>
  );
}
