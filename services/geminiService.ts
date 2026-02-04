
import { GoogleGenAI, Type, FunctionDeclaration } from "@google/genai";

// MCP-style Tool Definitions
const getZakatCalculation: FunctionDeclaration = {
  name: 'calculateZakat',
  parameters: {
    type: Type.OBJECT,
    description: 'Calculates Zakat (2.5%) based on the total value of assets.',
    properties: {
      totalAssets: {
        type: Type.NUMBER,
        description: 'The total value of liquid assets (cash, gold, business stock) in local currency.',
      },
    },
    required: ['totalAssets'],
  },
};

const getSpiritualTips: FunctionDeclaration = {
  name: 'getSpiritualTips',
  parameters: {
    type: Type.OBJECT,
    description: 'Provides spiritual or health tips based on Islamic principles.',
    properties: {
      category: {
        type: Type.STRING,
        description: 'Category of tip: spiritual, health, nutrition, or productivity.',
      },
    },
    required: ['category'],
  },
};

export const chatWithAI = async (message: string, history: { role: 'user' | 'model', text: string }[]) => {
  // Production Best Practice: Create a fresh instance right before making an API call 
  // to ensure it always uses the most up-to-date API key (e.g. from key selection dialog)
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  try {
    const model = ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: [
        ...history.map(h => ({ role: h.role, parts: [{ text: h.text }] })),
        { role: 'user', parts: [{ text: message }] }
      ],
      config: {
        systemInstruction: `You are Nur, a specialized Islamic AI assistant. 
        You help users with religious questions (Fiqh, Hadith, Quran), daily spiritual life, Zakat, and ethical guidance. 
        Be respectful, compassionate, and informative. Always provide references from major Islamic sources when possible. 
        Your purpose is to help Muslims grow in their Deen. Use a warm, encouraging tone.`,
        tools: [{ functionDeclarations: [getZakatCalculation, getSpiritualTips] }],
      }
    });

    const response = await model;
    
    // Handle Function Calls (MCP Logic)
    if (response.functionCalls && response.functionCalls.length > 0) {
      const fc = response.functionCalls[0];
      if (fc.name === 'calculateZakat') {
        const amount = (fc.args as any).totalAssets * 0.025;
        return `Based on a total asset value of ${ (fc.args as any).totalAssets }, your Zakat (2.5%) would be approximately ${amount.toFixed(2)}. Please consult a local scholar for precise rulings regarding specific asset types like business stock or jewelry.`;
      }
      if (fc.name === 'getSpiritualTips') {
        const category = (fc.args as any).category;
        const tips: Record<string, string> = {
          spiritual: "Try to maintain constant Dhikr (remembrance of Allah) throughout your day. 'SubhanAllah' and 'Alhamdulillah' carry great weight.",
          health: "The Prophet (PBUH) recommended filling the stomach with one-third food, one-third water, and leaving one-third for air.",
          nutrition: "Dates and honey are prophetic superfoods mentioned in the Sunnah for their immense health benefits.",
          productivity: "Try the 'Barakah' method: Start your work right after Fajr. The morning hours are blessed for this Ummah."
        };
        return tips[category] || "Focus on consistency (Istiqamah) in your daily prayers and character.";
      }
    }

    return response.text || "I'm sorry, I couldn't process that. How can I assist you with your Deen today?";
  } catch (err: any) {
    if (err.message && err.message.includes("Requested entity was not found")) {
      // Logic for key selection reset could go here if needed as per instructions
      return "There was an issue with your professional AI key. Please go to Settings to reconnect your professional access.";
    }
    throw err;
  }
};
