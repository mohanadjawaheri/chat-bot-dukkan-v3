
import { GoogleGenAI, Type } from '@google/genai';
import type { VercelRequest, VercelResponse } from '@vercel/node';

// Initialize the Gemini client
// IMPORTANT: Set the GEMINI_API_KEY environment variable in your deployment platform (Vercel).
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '', vertexai: true });

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
    type: { type: Type.STRING, enum: ['text', 'product', 'product_not_found', 'order_status', 'clarification', 'confirmation'] },
    text: { type: Type.STRING, description: "The primary text response from the bot." },
    product: {
      type: Type.OBJECT,
      nullable: true,
      properties: {
        name: { type: Type.STRING },
        price: { type: Type.STRING },
        imageUrl: { type: Type.STRING },
        description: { type: Type.STRING },
      },
    },
    confirmation: {
        type: Type.OBJECT,
        nullable: true,
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
    }
  },
};


export default async function handler(req: VercelRequest, res: VercelResponse) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const { history, userMessage, image } = req.body;

    const contents = [...(history || [])];
    
    const userParts = [];
    if (userMessage) {
        userParts.push({ text: userMessage });
    }
    if (image) {
        userParts.push({ inlineData: { mimeType: image.mimeType, data: image.data } });
    }

    if (userParts.length > 0) {
        contents.push({ role: 'user', parts: userParts });
    }

    const result = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: contents,
        config: {
            systemInstruction: systemInstruction,
            responseMimeType: 'application/json',
            responseSchema: responseSchema,
        }
    });

    const botResponseText = result.text;
    
    // FIX: Check if botResponseText is a valid string before parsing
    if (botResponseText) {
      try {
          const parsedResponse = JSON.parse(botResponseText);
          return res.status(200).json(parsedResponse);
      } catch (e) {
          // If parsing fails, send it as a plain text response
          return res.status(200).json({ type: 'text', text: botResponseText });
      }
    } else {
      // Handle cases where the model returns no text (e.g., blocked response)
      throw new Error("The AI model returned an empty response.");
    }

  } catch (error: any) {
    console.error('Error in /api/chat:', error);
    res.status(500).json({ error: 'Internal Server Error', details: error.message });
  }
}
