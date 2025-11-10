
import { ApiResponse, ChatMessage } from '../types';

// This is now the GeminiService, responsible for backend communication.
const API_URL = '/api/chat'; // This will correctly point to the Vercel serverless function.

export class GeminiService {
  private static async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    try {
      const response = await fetch(endpoint, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.error || `HTTP error! status: ${response.status}`
        );
      }

      return await response.json();
    } catch (error) {
      console.error('[API Service] Request failed:', error);
      throw error;
    }
  }

  private static messagesToHistory(messages: ChatMessage[]): Array<{
    role: 'user' | 'model';
    parts: Array<{ text: string }>;
  }> {
    return messages
      .filter(msg => msg.type !== 'loading' && msg.type !== 'error')
      .map(msg => {
        const role = msg.sender === 'user' ? 'user' : 'model';
        let contentText = '';
        if (typeof msg.content === 'string') {
            contentText = msg.content;
        } else if ('name' in msg.content) { // Product
            contentText = JSON.stringify(msg.content);
        } else if ('text' in msg.content) { // Confirmation
            contentText = JSON.stringify(msg.content);
        }
        
        return {
            role: role,
            parts: [{ text: contentText }],
        };
      });
  }

  private static async fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        const base64 = result.split(',')[1];
        resolve(base64);
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  static async sendMessage(
    message: string,
    history: ChatMessage[],
    imageFile?: File
  ): Promise<ApiResponse> {
    const historyFormatted = this.messagesToHistory(history);

    const bodyPayload: any = {
        history: historyFormatted,
        userMessage: message,
    };

    if (imageFile) {
        const base64Image = await this.fileToBase64(imageFile);
        bodyPayload.image = {
            mimeType: imageFile.type,
            data: base64Image,
        };
    }

    // This now makes a real call to our backend function
    const response = await this.request<ApiResponse>(API_URL, {
      method: 'POST',
      body: JSON.stringify(bodyPayload),
    });

    return response;
  }
}
