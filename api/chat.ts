export const config = {
  runtime: 'nodejs18.x',
};

import { GoogleGenAI, Chat } from '@google/genai';

const SYSTEM_INSTRUCTION = `... (نفس النص الطويل بدون تغيير) ...`;

export default async (req: Request): Promise<Response> => {
  // ✅ CORS Handling
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      },
    });
  }

  // ✅ Ensure CORS headers are always present
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Content-Type': 'application/json',
  };

  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method Not Allowed' }), {
      status: 405,
      headers: corsHeaders,
    });
  }

  try {
    const { history, userMessage } = await req.json();
    const API_KEY = process.env.API_KEY;

    if (!API_KEY) {
      throw new Error('API_KEY environment variable not set on the server.');
    }

    const ai = new GoogleGenAI({ apiKey: API_KEY, vertexai: true });

    const chat: Chat = ai.chats.create({
      model: 'gemini-2.5-flash',
      config: { systemInstruction: SYSTEM_INSTRUCTION },
      history: history || [],
    });

    const response = await chat.sendMessage({ message: userMessage });

    return new Response(JSON.stringify({ text: response.text }), {
      status: 200,
      headers: corsHeaders,
    });

  } catch (error) {
    console.error('Error in serverless function:', error);
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
      status: 500,
      headers: corsHeaders,
    });
  }
};
