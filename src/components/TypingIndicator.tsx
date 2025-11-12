
import React from 'react';
import { BotIcon } from '@/components/icons';

export const TypingIndicator: React.FC = () => (
  <div className="flex items-end">
    <BotIcon className="w-8 h-8 order-1" />
    <div className="flex items-center space-x-1.5 space-x-reverse mx-2 order-2">
      <div className="px-4 py-3 rounded-lg inline-block bg-gray-200 dark:bg-gray-700">
        <div className="flex items-center justify-center space-x-1 space-x-reverse">
          <span className="w-2 h-2 bg-gray-500 dark:bg-gray-400 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
          <span className="w-2 h-2 bg-gray-500 dark:bg-gray-400 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
          <span className="w-2 h-2 bg-gray-500 dark:bg-gray-400 rounded-full animate-bounce"></span>
        </div>
      </div>
    </div>
  </div>
);
