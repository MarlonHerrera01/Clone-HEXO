import { GoogleGenerativeAI } from '@google/generative-ai';

export async function generateTextWithIA(topic: string): Promise<string> {
  try {
    const GENERATIVE_MODEL = 'gemini-1.5-flash';
    const API_KEY = '';

    const genAI = new GoogleGenerativeAI(API_KEY);
    const model = genAI.getGenerativeModel({ model: GENERATIVE_MODEL });

    const prompt = `Genera una descripción de dos párrafo sobre ${topic}. Evita frases introductorias y utiliza un lenguaje objetivo.`;

    const serverResult = await model.generateContent(prompt);
    const responseInText = serverResult.response.text();

    return responseInText;
  } catch (error) {
    console.error(error);
  }
}
