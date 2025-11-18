import { GoogleGenAI } from "@google/genai";

export const generateMarketingTip = async (
  businessName: string,
  challenge: string,
  score: number
): Promise<string> => {
  // Fallback if no key is present to prevent app crash in demo
  if (!process.env.API_KEY) {
    return "Focus on consistent branding to build trust with your audience.";
  }

  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    const prompt = `
      You are a senior marketing strategist.
      A business owner named "${businessName}" just played a game testing their marketing skills.
      They scored ${score} ROI points.
      Their current biggest real-world challenge is: "${challenge}".
      
      Generate a single, punchy, encouraging, and actionable 1-sentence marketing tip specifically for their challenge.
      Do not include quotes.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    return response.text || "Consistent effort is the key to marketing success!";
  } catch (error) {
    console.error("Gemini generation error:", error);
    return "Optimize your funnel to convert more leads into customers.";
  }
};
