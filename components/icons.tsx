
import React from 'react';

export const SendIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
    aria-hidden="true"
  >
    <path d="M3.478 2.405a.75.75 0 00-.926.94l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.405z" />
  </svg>
);

export const AttachmentIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
    aria-hidden="true"
  >
    <path
      fillRule="evenodd"
      d="M18.97 3.659a2.25 2.25 0 00-3.182 0l-10.5 10.5a.75.75 0 001.06 1.06l10.5-10.5a.75.75 0 011.06 0q.465.465.465 1.061t-.465 1.061l-7.5 7.5a2.25 2.25 0 01-3.182-3.182l5.25-5.25a.75.75 0 00-1.06-1.06l-5.25 5.25a3.75 3.75 0 005.303 5.303l7.5-7.5a2.25 2.25 0 00-3.182-3.182z"
      clipRule="evenodd"
    />
  </svg>
);

export const BotIcon: React.FC<{ className?: string }> = ({ className }) => (
    <div className={`flex items-center justify-center bg-purple-500 text-white rounded-full ${className}`}>
        <span className="font-bold text-lg">ع</span>
    </div>
);
