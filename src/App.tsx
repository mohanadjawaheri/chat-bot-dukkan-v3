
import React from 'react';
import Chat from '@/components/Chat';
import Header from '@/components/Header';

const App: React.FC = () => {
  return (
    <div className="bg-gray-100 dark:bg-gray-900 w-full h-screen flex items-center justify-center p-4">
      <div className="w-full h-full max-w-2xl mx-auto flex flex-col bg-white dark:bg-gray-800 shadow-2xl rounded-2xl overflow-hidden">
        <Header />
        <Chat />
      </div>
    </div>
  );
};

export default App;
