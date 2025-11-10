
import { Chat } from '@google/genai';

export type Sender = 'user' | 'bot';

export interface Product {
  name: string;
  price: string;
  imageUrl: string;
}

export interface Action {
  label: string;
  payload: string;
}

export interface ConfirmationContent {
  text: string;
  actions: Action[];
}

export type MessageType = 'text' | 'product' | 'product_not_found' | 'order_status' | 'clarification' | 'error' | 'image_request' | 'confirmation';

export interface ChatMessage {
  id: string;
  sender: Sender;
  type: MessageType;
  content: string | Product | ConfirmationContent;
  timestamp: string;
}

export interface GeminiResponse {
    type: MessageType;
    product?: Product;
    message?: string;
    status?: string;
    confirmation?: ConfirmationContent;
}

export interface UseChatReturn {
  messages: ChatMessage[];
  isLoading: boolean;
  error: string | null;
  chatSession: Chat | null;
  handleSendMessage: (text: string, image?: { mimeType: string; data: string }) => Promise<void>;
  handleAction: (payload: string) => void;
}
