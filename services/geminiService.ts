
import { GoogleGenAI, Chat, GenerateContentResponse, Type, Modality } from '@google/genai';
import { GeminiResponse } from '../types';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  throw new Error("API_KEY environment variable not set.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY, vertexai: true });

const systemInstruction = `Your name is Ali. You are the official smart assistant for the Dukkan e-commerce platform.
You must speak in a natural, friendly, and respectful Iraqi Arabic dialect.
- Respond to greetings simply: السلام عليكم -> عليكم السلام, مرحبا -> مرحبا, اهلاً -> اهلاً بيكم.
- Be concise. Use emojis sparingly.
- If the user types in English, understand it but always respond in Iraqi Arabic.
- Your goal is to help users find products, place orders, and track their orders.
- Always respond with a valid JSON object. Do not add markdown formatting like \`\`\`json.

ORDER PLACEMENT FLOW:
1. When a user expresses intent to order a product (e.g., "I want to order this product"), you must start collecting their information sequentially.
2. Ask for ONE piece of information at a time: Full Name, Governorate/City, Detailed Address, Phone Number.
3. After collecting all four pieces of information, summarize them for the user and ask for confirmation using a 'confirmation' type message. The confirmation message must include two actions: one with the label "✅ تثبيت الطلب" and payload "نعم، ثبت الطلب", and another with the label "❌ إلغاء" and payload "لا، ألغِ الطلب".

OTHER FLOWS:
- When a user asks for a product, respond with a 'product' type.
- If you cannot find the product, respond with a 'product_not_found' type.
- When a user wants to track an order, ask for their phone number. Then, respond with an 'order_status' type.
- For general questions (shipping, payment), provide a short, helpful answer with a 'text' type.
- If you don't understand, respond with a 'clarification' type.
- When an image is provided, analyze it and try to identify a product.
`;

const responseSchema = {
  type: Type.OBJECT,
  properties: {
    type: { type: Type.STRING, enum: ['text', 'product', 'product_not_found', 'order_status', 'clarification', 'image_request', 'confirmation'] },
    product: {
      type: Type.OBJECT,
      properties: {
        name: { type: Type.STRING },
        price: { type: Type.STRING },
        imageUrl: { type: Type.STRING },
      },
      nullable: true,
    },
    message: { type: Type.STRING, nullable: true },
    status: { type: Type.STRING, nullable: true },
    confirmation: {
        type: Type.OBJECT,
        properties: {
            text: { type: Type.STRING },
            actions: {
                type: Type.ARRAY,
                items: {
                    type: Type.OBJECT,
                    properties: {
                        label: { type: Type.STRING },
                        payload: { type: Type.STRING }
                    }
                }
            }
        },
        nullable: true
    }
  },
};

export function createChatSession(): Chat {
  return ai.chats.create({
    model: 'gemini-2.5-flash',
    config: {
      systemInstruction: systemInstruction,
      responseMimeType: 'application/json',
      responseSchema: responseSchema,
    },
  });
}

export async function sendMessage(chat: Chat, message: string): Promise<GeminiResponse> {
  try {
    const response: GenerateContentResponse = await chat.sendMessage({ message });
    const jsonText = response.text.trim();
    // Handle potential markdown backticks
    const cleanedJsonText = jsonText.replace(/^```json\s*|```$/g, '');
    return JSON.parse(cleanedJsonText) as GeminiResponse;
  } catch (error) {
    console.error("Error sending message to Gemini:", error);
    return { type: 'error', message: 'عذراً، حدث خطأ ما. حاول مرة أخرى.' };
  }
}

export async function analyzeImageWithText(base64Image: string, mimeType: string, prompt: string): Promise<GeminiResponse> {
    try {
        const imagePart = {
            inlineData: {
                data: base64Image,
                mimeType: mimeType,
            },
        };
        const textPart = { text: prompt };

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: { role: 'user', parts: [imagePart, textPart] },
            config: {
                systemInstruction: systemInstruction,
                responseMimeType: 'application/json',
                responseSchema: responseSchema,
            },
        });
        
        const jsonText = response.text.trim();
        const cleanedJsonText = jsonText.replace(/^```json\s*|```$/g, '');
        return JSON.parse(cleanedJsonText) as GeminiResponse;

    } catch (error) {
        console.error("Error analyzing image with Gemini:", error);
        return { type: 'error', message: 'عذراً، لم أتمكن من تحليل الصورة. حاول مرة أخرى.' };
    }
}
