
import { useState, useCallback, useEffect, useRef } from 'react';
import { ChatMessage, UseChatReturn, ApiResponse } from '@/types';
import { GeminiService } from '@/services/geminiService';

export const useChat = (): UseChatReturn => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  
  const lastUserMessageForRetry = useRef<{ text: string; image?: File } | null>(null);

  useEffect(() => {
    const welcomeMessage: ChatMessage = {
      id: 'welcome-1',
      sender: 'bot',
      type: 'text',
      content: 'أهلاً بيك في دُكّان! آني علي، مساعدك الذكي. شلون أقدر أخدمك اليوم؟ 🌸',
      timestamp: new Date().toISOString(),
    };
    setMessages([welcomeMessage]);
  }, []);

  useEffect(() => {
    const lastMessage = messages[messages.length - 1];
    
    if (lastMessage?.sender === 'user' && !isLoading) {
      const send = async () => {
        setIsLoading(true);
        setError(null);

        const userMessageContent = lastMessage.content as string;
        const historyForAPI = messages.slice(0, -1);
        
        const imageFile = lastUserMessageForRetry.current?.text === userMessageContent 
            ? lastUserMessageForRetry.current?.image 
            : undefined;

        try {
          const response = await GeminiService.sendMessage(userMessageContent, historyForAPI, imageFile);
          
          const botMessage: Omit<ChatMessage, 'id' | 'timestamp'> = 
            (response.type === 'product' && response.product) ? { sender: 'bot', type: 'product', content: response.product } :
            (response.type === 'confirmation' && response.confirmation) ? { sender: 'bot', type: 'confirmation', content: response.confirmation } :
            { sender: 'bot', type: 'text', content: response.text };

          setMessages(prev => [...prev, { ...botMessage, id: `bot-${Date.now()}`, timestamp: new Date().toISOString() }]);

        } catch (err: any) {
          console.error('[useChat] Error:', err);
          const errorMessage = err.message?.includes('fetch') || err.message?.includes('HTTP')
            ? 'عذراً، واجهتني مشكلة بالاتصال. خلي نتأكد من التفاصيل وراجعينلك 🙏'
            : 'عذراً، حدث خطأ ما. الرجاء المحاولة مرة أخرى.';
          
          setError(errorMessage);
          setMessages(prev => [...prev, { id: `bot-err-${Date.now()}`, sender: 'bot', type: 'error', content: errorMessage, timestamp: new Date().toISOString() }]);
        } finally {
          setIsLoading(false);
        }
      };

      send();
    }
  }, [messages, isLoading]);

  const handleSendMessage = useCallback((text: string, image?: File) => {
    if (isLoading) return;

    const userMessageContent = text || (image ? 'ممكن تشوفلي هذا المنتج؟' : '');
    if (!userMessageContent.trim() && !image) return;

    lastUserMessageForRetry.current = { text: userMessageContent, image };

    setMessages(prev => [
      ...prev,
      {
        id: `user-${Date.now()}`,
        sender: 'user',
        type: 'text',
        content: userMessageContent,
        timestamp: new Date().toISOString(),
        ...(image && { imageUrl: URL.createObjectURL(image) }),
      },
    ]);
  }, [isLoading]);

  const handleAction = useCallback((payload: string) => {
    if (payload) {
      handleSendMessage(payload);
    }
  }, [handleSendMessage]);

  const retryLastMessage = useCallback(() => {
    if (lastUserMessageForRetry.current) {
      const { text, image } = lastUserMessageForRetry.current;
      
      setMessages(prev => {
        const lastUserIndex = prev.map(m => m.sender).lastIndexOf('user');
        return lastUserIndex !== -1 ? prev.slice(0, lastUserIndex) : prev;
      });

      handleSendMessage(text, image);
    }
  }, [handleSendMessage]);

  return {
    messages,
    isLoading,
    error,
    handleSendMessage,
    handleAction,
    retryLastMessage,
  };
};
