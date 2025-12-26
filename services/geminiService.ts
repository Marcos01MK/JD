
import { GoogleGenAI } from "@google/genai";

export async function verifyQuote(content: string) {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Analise se esta frase é original, profunda ou criativa o suficiente para ganhar um selo de verificado: "${content}". Responda em JSON com os campos: "score" (0 a 100), "reason" (string curta) e "status" (boolean: true se for boa).`,
      config: {
        responseMimeType: "application/json"
      }
    });

    return JSON.parse(response.text);
  } catch (error) {
    console.error("Erro ao verificar frase:", error);
    return { status: false, score: 0, reason: "Erro na análise." };
  }
}
