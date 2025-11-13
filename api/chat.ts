import { GoogleGenerativeAI } from '@google/generative-ai';
import { VercelRequest, VercelResponse } from '@vercel/node';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

const systemInstruction = 'You are a helpful assistant for Dukkan.';
const responseSchema = { type: 'object', properties: { text: { type: 'string' } } };

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Set CORS headers - must be set before any response
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS, GET');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
  res.setHeader('Access-Control-Max-Age', '86400');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const { history, userMessage, image } = req.body;
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    const contents = [...(history || [])];
    const userParts: any[] = [];
    
    if (userMessage) {
      userParts.push({ text: userMessage });
    }
    if (image) {
      userParts.push({ inlineData: { mimeType: image.mimeType, data: image.data } });
    }

    if (userParts.length > 0) {
      contents.push({ role: 'user', parts: userParts });
    }

    const result = await model.generateContent(contents);
    const botResponseText = result.response.text();

    if (botResponseText) {
      try {
        const parsedResponse = JSON.parse(botResponseText);
        return res.status(200).json(parsedResponse);
      } catch (e) {
        return res.status(200).json({ type: 'text', text: botResponseText });
      }
    } else {
      throw new Error("The AI model returned an empty response.");
    }

  } catch (error: any) {
    console.error('Error in /api/chat:', error);
    return res.status(500).json({ error: 'Internal Server Error', details: error.message });
  }
}
