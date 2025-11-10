
import React from 'react';
import Chat from './components/Chat';

const App: React.FC = () => {
  return (
    <div className="bg-gray-100 dark:bg-gray-900 w-full h-screen flex items-center justify-center p-4">
      <div className="w-full h-full max-w-2xl mx-auto flex flex-col bg-white dark:bg-gray-800 shadow-2xl rounded-2xl overflow-hidden">
        <header className="bg-purple-600 dark:bg-purple-700 text-white p-4 flex items-center justify-between shadow-md">
          <div>
            <h1 className="text-xl font-bold">علي - مساعد دُكّان الذكي</h1>
            <p className="text-sm opacity-80">متصل الآن</p>
          </div>
          <div className="relative">
            <div className="w-12 h-12 bg-white/30 rounded-full flex items-center justify-center text-2xl font-bold">
              ع
            </div>
            <span className="absolute bottom-0 right-0 block h-3 w-3 rounded-full bg-green-400 ring-2 ring-purple-600 dark:ring-purple-700"></span>
          </div>
        </header>
        <Chat />
      </div>
    </div>
  );
};

export default App;
