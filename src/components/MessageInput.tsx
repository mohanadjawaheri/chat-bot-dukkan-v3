
import React, { useState, useRef } from 'react';
import { SendIcon, AttachmentIcon } from '@/components/icons';

interface MessageInputProps {
  onSendMessage: (text: string, image?: File) => void;
  disabled: boolean;
}

const MessageInput: React.FC<MessageInputProps> = ({ onSendMessage, disabled }) => {
  const [text, setText] = useState('');
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if ((text.trim() || imagePreview) && !disabled) {
      const file = fileInputRef.current?.files?.[0];
      onSendMessage(text.trim(), file || undefined);
      setText('');
      setImagePreview(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleAttachmentClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 flex-shrink-0">
      {imagePreview && (
        <div className="mb-2 relative inline-block">
          <img
            src={imagePreview}
            alt="Preview"
            className="rounded-lg h-24 w-24 object-cover"
          />
          <button
            onClick={() => {
              setImagePreview(null);
              if (fileInputRef.current) fileInputRef.current.value = '';
            }}
            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full h-6 w-6 flex items-center justify-center text-xs hover:bg-red-600"
            aria-label="Remove image"
          >
            ×
          </button>
        </div>
      )}
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
          className="p-2 text-gray-500 dark:text-gray-400 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-colors"
          aria-label="Attach image"
        >
          <AttachmentIcon className="w-6 h-6" />
        </button>
        <div className="relative flex-grow">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSubmit(e);
              }
            }}
            placeholder="اكتب رسالتك هنا..."
            disabled={disabled}
            className="w-full py-3 pl-4 pr-12 text-right bg-gray-100 dark:bg-gray-700 rounded-full focus:outline-none focus:ring-2 focus:ring-purple-500 dark:text-white transition-all resize-none leading-tight"
            rows={1}
            style={{ minHeight: '48px', maxHeight: '120px' }}
          />
          <button
            type="submit"
            disabled={disabled || (!text.trim() && !imagePreview)}
            className="absolute left-1 top-1/2 -translate-y-1/2 p-2.5 bg-purple-600 text-white rounded-full disabled:bg-gray-400 disabled:cursor-not-allowed hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-colors"
            aria-label="Send message"
          >
            <SendIcon className="w-5 h-5" />
          </button>
        </div>
      </form>
    </div>
  );
};

export default MessageInput;
