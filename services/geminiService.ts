
import { GoogleGenAI, Type } from "@google/genai";

export async function verifyQuote(content: string) {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Você é um curador da plataforma JurassicDreams. Analise se esta frase é original, profunda ou uma gíria criativa: "${content}". 
      Responda estritamente em JSON.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            score: { type: Type.NUMBER, description: "Nota de 0 a 100 para a qualidade" },
            reason: { type: Type.STRING, description: "Motivo curto da nota" },
            status: { type: Type.BOOLEAN, description: "True se merece o selo de verificado" }
          },
          required: ["score", "reason", "status"]
        }
      }
    });

    return JSON.parse(response.text || '{"status": false, "score": 0, "reason": "Erro"}');
  } catch (error) {
    console.error("Erro ao verificar frase:", error);
    return { status: false, score: 0, reason: "Offline" };
  }
}

export async function generateIdea() {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: "Gere uma frase curta e impactante para uma rede social chamada JurassicDreams. Pode ser um desabafo, uma gíria moderna ou um pensamento profundo sobre a vida. Seja autêntico e direto.",
    });
    return response.text;
  } catch (error) {
    console.error("Erro ao gerar ideia:", error);
    return "O rugido da alma é o que nos mantém vivos.";
  }
}
