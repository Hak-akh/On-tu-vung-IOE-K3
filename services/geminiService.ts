
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export async function getAIHint(word: string, vietnamese: string): Promise<string> {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Provide a very short, simple English sentence example for the word "${word}" which means "${vietnamese}". The sentence should be easy for a child learning English. Use underscores to hide the word "${word}" in the sentence. Example for "apple": "I eat a red _____."`,
      config: {
        temperature: 0.7,
        maxOutputTokens: 50,
      }
    });
    return response.text?.trim() || "No hint available.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Keep trying! You can do it!";
  }
}
