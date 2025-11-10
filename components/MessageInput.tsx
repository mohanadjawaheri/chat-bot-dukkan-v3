
import React, { useState, useRef } from 'react';
import { SendIcon, AttachmentIcon } from './icons';

interface MessageInputProps {
  onSendMessage: (text: string, image?: { mimeType: string; data: string }) => void;
  disabled: boolean;
}

const MessageInput: React.FC<MessageInputProps> = ({ onSendMessage, disabled }) => {
  const [text, setText] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (text.trim() && !disabled) {
      onSendMessage(text.trim());
      setText('');
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (loadEvent) => {
        const base64String = (loadEvent.target?.result as string).split(',')[1];
        if (base64String) {
          onSendMessage('', { mimeType: file.type, data: base64String });
        }
      };
      reader.readAsDataURL(file);
    }
    // Reset file input to allow selecting the same file again
    if(fileInputRef.current) {
        fileInputRef.current.value = '';
    }
  };

  const handleAttachmentClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <form onSubmit={handleSubmit} className="flex items-center space-x-2 space-x-reverse">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
        accept="image/*"
        disabled={disabled}
      />
      <button
        type="button"
        onClick={handleAttachmentClick}
        disabled={disabled}
        className="p-2 text-gray-500 dark:text-gray-400 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
        aria-label="Attach file"
      >
        <AttachmentIcon className="w-6 h-6" />
      </button>
      <div className="relative flex-grow">
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="اكتب رسالتك هنا..."
          disabled={disabled}
          className="w-full py-3 pl-4 pr-12 text-right bg-gray-100 dark:bg-gray-700 rounded-full focus:outline-none focus:ring-2 focus:ring-purple-500 dark:text-white transition-all"
          autoComplete="off"
        />
        <button
          type="submit"
          disabled={disabled || !text.trim()}
          className="absolute left-1 top-1/2 -translate-y-1/2 p-2.5 bg-purple-600 text-white rounded-full disabled:bg-gray-400 disabled:cursor-not-allowed hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-colors"
          aria-label="Send message"
        >
          <SendIcon className="w-5 h-5" />
        </button>
      </div>
    </form>
  );
};

export default MessageInput;
