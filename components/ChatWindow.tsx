
import React, { useEffect, useRef } from 'react';
import { ChatMessage } from '../types';
import Message from './Message';
import { TypingIndicator } from './TypingIndicator';

interface ChatWindowProps {
  messages: ChatMessage[];
  isLoading: boolean;
  handleAction: (payload: string) => void;
}

const ChatWindow: React.FC<ChatWindowProps> = ({ messages, isLoading, handleAction }) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  return (
    <div className="flex-1 p-4 sm:p-6 overflow-y-auto scrollbar-thin">
      <div className="flex flex-col space-y-4">
        {messages.map((msg) => (
          <Message key={msg.id} message={msg} handleAction={handleAction} />
        ))}
        {isLoading && <TypingIndicator />}
        <div ref={messagesEndRef} />
      </div>
    </div>
  );
};

export default ChatWindow;
