
import React from 'react';
import { useChat } from '../hooks/useChat';
import ChatWindow from './ChatWindow';
import MessageInput from './MessageInput';

const Chat: React.FC = () => {
  const { messages, isLoading, error, handleSendMessage, handleAction } = useChat();

  return (
    <div className="flex-1 flex flex-col bg-gray-50 dark:bg-gray-800/50 overflow-hidden" dir="rtl">
      <ChatWindow messages={messages} isLoading={isLoading} handleAction={handleAction} />
      {error && <div className="text-center text-red-500 text-sm p-2">{error}</div>}
      <div className="p-4 border-t border-gray-200 dark:border-gray-700">
        <MessageInput onSendMessage={handleSendMessage} disabled={isLoading} />
      </div>
    </div>
  );
};

export default Chat;
