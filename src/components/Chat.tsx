
import React from 'react';
import { useChat } from '@/hooks/useChat';
import ChatWindow from '@/components/ChatWindow';
import MessageInput from '@/components/MessageInput';

const Chat: React.FC = () => {
  const { messages, isLoading, error, handleSendMessage, handleAction, retryLastMessage } = useChat();

  return (
    <div className="flex-1 flex flex-col bg-gray-50 dark:bg-gray-800/50 overflow-hidden" dir="rtl">
      <ChatWindow messages={messages} isLoading={isLoading} handleAction={handleAction} retryLastMessage={retryLastMessage} />
      <MessageInput onSendMessage={handleSendMessage} disabled={isLoading} />
    </div>
  );
};

export default Chat;
