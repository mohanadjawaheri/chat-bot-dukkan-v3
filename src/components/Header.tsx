
import React from 'react';
import { BotIcon } from '@/components/icons';

const Header: React.FC = () => {
  return (
    <header className="bg-purple-600 dark:bg-purple-700 text-white p-4 flex items-center justify-between shadow-md flex-shrink-0">
      <div>
        <h1 className="text-xl font-bold">علي - مساعد دُكّان الذكي</h1>
        <p className="text-sm opacity-80">متصل الآن</p>
      </div>
      <div className="relative">
        <BotIcon className="w-12 h-12" />
        <span className="absolute bottom-0 right-0 block h-3 w-3 rounded-full bg-green-400 ring-2 ring-purple-600 dark:ring-purple-700"></span>
      </div>
    </header>
  );
};

export default Header;
