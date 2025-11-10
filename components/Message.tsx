
import React from 'react';
import { ChatMessage, Product, ConfirmationContent } from '../types';
import { BotIcon } from './icons';
import ProductCard from './ProductCard';

interface MessageProps {
  message: ChatMessage;
  handleAction: (payload: string) => void;
}

const Message: React.FC<MessageProps> = ({ message, handleAction }) => {
  const isUser = message.sender === 'user';

  const renderContent = () => {
    if (message.type === 'product') {
      return <ProductCard product={message.content as Product} handleAction={handleAction} />;
    }
    if (message.type === 'confirmation') {
        const content = message.content as ConfirmationContent;
        return (
            <div className="space-y-3">
                <p className="text-sm sm:text-base">{content.text}</p>
                <div className="flex flex-col sm:flex-row gap-2 pt-2">
                    {content.actions.map((action, index) => (
                        <button
                            key={index}
                            onClick={() => handleAction(action.payload)}
                            className="w-full sm:w-auto text-sm font-bold py-2 px-4 rounded-lg transition-colors duration-300 bg-purple-600 text-white hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
                        >
                            {action.label}
                        </button>
                    ))}
                </div>
            </div>
        );
    }
    return <p className="text-sm sm:text-base">{message.content as string}</p>;
  };

  if (isUser) {
    return (
      <div className="flex items-end justify-start">
        <div className="flex flex-col space-y-1 text-base max-w-xs mx-2 order-2 items-start">
          <div>
            <span className="px-4 py-2 rounded-lg inline-block rounded-br-none bg-purple-600 text-white">
              {renderContent()}
            </span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-end">
      <BotIcon className="w-8 h-8 order-1" />
      <div className="flex flex-col space-y-1 text-base max-w-xs mx-2 order-2 items-start">
        <div>
          <div className={`px-4 py-2 rounded-lg inline-block rounded-bl-none ${message.type === 'product' ? 'p-0 bg-transparent' : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200'}`}>
            {renderContent()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Message;
