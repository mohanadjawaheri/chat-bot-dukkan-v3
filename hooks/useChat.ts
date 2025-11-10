
import { useState, useEffect, useCallback } from 'react';
import { Chat } from '@google/genai';
import { ChatMessage, UseChatReturn, GeminiResponse, ConfirmationContent } from '../types';
import { createChatSession, sendMessage, analyzeImageWithText } from '../services/geminiService';

export const useChat = (): UseChatReturn => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [chatSession, setChatSession] = useState<Chat | null>(null);

  useEffect(() => {
    const initializeChat = () => {
      try {
        const session = createChatSession();
        setChatSession(session);
        const welcomeMessage: ChatMessage = {
          id: 'welcome-1',
          sender: 'bot',
          type: 'text',
          content: 'أهلاً بيك في دُكّان! آني علي، مساعدك الذكي. شلون أقدر أخدمك اليوم؟ 🌸',
          timestamp: new Date().toISOString(),
        };
        setMessages([welcomeMessage]);
      } catch (e) {
        console.error("Failed to initialize chat session:", e);
        setError("فشل تهيئة المحادثة. يرجى تحديث الصفحة.");
      }
    };
    initializeChat();
  }, []);

  const addMessage = (message: Omit<ChatMessage, 'id' | 'timestamp'>) => {
    setMessages(prev => [
      ...prev,
      { ...message, id: Date.now().toString(), timestamp: new Date().toISOString() },
    ]);
  };

  const processBotResponse = (response: GeminiResponse) => {
    if (response.type === 'product' && response.product) {
      addMessage({ sender: 'bot', type: 'product', content: response.product });
    } else if (response.type === 'product_not_found' && response.message) {
      addMessage({ sender: 'bot', type: 'text', content: response.message });
    } else if (response.type === 'order_status' && response.status) {
      addMessage({ sender: 'bot', type: 'text', content: response.status });
    } else if (response.type === 'clarification' && response.message) {
      addMessage({ sender: 'bot', type: 'text', content: response.message });
    } else if (response.type === 'text' && response.message) {
      addMessage({ sender: 'bot', type: 'text', content: response.message });
    } else if (response.type === 'confirmation' && response.confirmation) {
      addMessage({ sender: 'bot', type: 'confirmation', content: response.confirmation });
    } else if (response.type === 'error' && response.message) {
      addMessage({ sender: 'bot', type: 'error', content: response.message });
    } else {
       addMessage({ sender: 'bot', type: 'error', content: "عذراً، ما فهمت رد السيرفر. ممكن تجرب مرة ثانية؟" });
    }
  };

  const handleSendMessage = useCallback(async (text: string, image?: { mimeType: string; data: string }) => {
    if (isLoading) return;

    setIsLoading(true);
    setError(null);

    const userMessageContent = image ? "ممكن تشوفلي هذا المنتج؟" : text;
    addMessage({ sender: 'user', type: 'text', content: userMessageContent });
    
    // Simulate bot thinking delay
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));

    try {
      let botResponse: GeminiResponse;
      if (image) {
        const prompt = "حلل هذه الصورة وابحث عن المنتج المطابق في قاعدة بيانات دُكّان. " + text;
        botResponse = await analyzeImageWithText(image.data, image.mimeType, prompt);
      } else {
        if (!chatSession) {
          throw new Error("Chat session is not initialized.");
        }
        botResponse = await sendMessage(chatSession, text);
      }
      processBotResponse(botResponse);
    } catch (e: any) {
      console.error("Error in handleSendMessage:", e);
      const errorMessage = "عذراً، واجهتني مشكلة بالاتصال. خلي نتأكد من التفاصيل وراجعينلك 🙏";
      setError(errorMessage);
      addMessage({ sender: 'bot', type: 'error', content: errorMessage });
    } finally {
      setIsLoading(false);
    }
  }, [isLoading, chatSession]);

  const handleAction = useCallback((payload: string) => {
    if (payload) {
      handleSendMessage(payload);
    }
  }, [handleSendMessage]);

  return { messages, isLoading, error, chatSession, handleSendMessage, handleAction };
};
