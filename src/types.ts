
export type Sender = 'user' | 'bot';

export interface Product {
  name: string;
  price: string;
  imageUrl: string;
  description?: string;
  productId?: string;
}

export interface Action {
  label: string;
  payload: string;
}

export interface ConfirmationContent {
  text: string;
  actions: Action[];
}

export type MessageType = 
  | 'text' 
  | 'product' 
  | 'product_not_found' 
  | 'order_status' 
  | 'clarification' 
  | 'error' 
  | 'image_request' 
  | 'confirmation'
  | 'loading';

export interface ChatMessage {
  id: string;
  sender: Sender;
  type: MessageType;
  content: string | Product | ConfirmationContent;
  timestamp: string;
  imageUrl?: string;
}

export interface ApiResponse {
  text: string;
  type?: MessageType;
  product?: Product;
  confirmation?: ConfirmationContent;
  error?: string;
}

export interface UseChatReturn {
  messages: ChatMessage[];
  isLoading: boolean;
  error: string | null;
  handleSendMessage: (text: string, image?: File) => void;
  handleAction: (payload: string) => void;
  retryLastMessage: () => void;
}
