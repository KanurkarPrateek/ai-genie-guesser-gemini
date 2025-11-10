import { GoogleGenAI, Type } from "@google/genai";
import { HistoryItem, GeminiResponse } from '../types';

if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable is not set.");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const responseSchema = {
  type: Type.OBJECT,
  properties: {
    action: {
      type: Type.STRING,
      enum: ['ask', 'guess'],
      description: 'The action to perform: ask a new question or make a final guess.'
    },
    payload: {
      type: Type.STRING,
      description: 'The content of the question or the name of the guessed entity.'
    },
    confidence: {
      type: Type.NUMBER,
      description: 'A percentage (0-100) of how confident the AI is in its top guess.'
    },
    topGuess: {
      type: Type.STRING,
      description: 'The current most likely candidate the AI is considering.'
    },
    reasoning: {
      type: Type.STRING,
      description: 'A brief, user-facing explanation of the AI\'s thought process.'
    }
  },
  required: ['action', 'payload', 'confidence', 'topGuess', 'reasoning']
};

const getSystemInstruction = (category: string) => `
You are an AI Genie playing a guessing game like Akinator. Your goal is to guess what the user is thinking of.
The user has selected the category: "${category}".

Your task is to analyze the history of questions and answers, and then decide on the next best action. Your response MUST be a JSON object matching the provided schema.

Here are the rules:
1.  **Analyze History**: Review the conversation history to narrow down the possibilities.
2.  **Decide Action**:
    *   If confidence is low or there are many possibilities, choose the 'ask' action. Formulate a new, effective yes/no/maybe question that will help eliminate the most candidates. Do not repeat questions.
    *   If confidence is high (e.g., > 85%) and you have a strong candidate, choose the 'guess' action. The 'payload' should be the name of the entity you are guessing.
3.  **Update Confidence**: Calculate a confidence score from 0 to 100 for your current \`topGuess\`.
4.  **Provide Reasoning**: Briefly explain your thought process in the 'reasoning' field. For example, "The user confirmed it's a superhero who can fly, which points towards Superman, but I need to rule out others."
5.  **JSON Output**: You MUST only respond with a valid JSON object that adheres to the schema. Do not output any other text or markdown.
`;


export const getAiResponse = async (history: HistoryItem[], category: string): Promise<GeminiResponse> => {
  const model = 'gemini-2.5-flash';
  const systemInstruction = getSystemInstruction(category);

  const userPrompt = `
  Conversation History:
  ${history.map(h => `- Q: ${h.question}\n  - A: ${h.answer || '(pending)'}`).join('\n')}

  Based on this history, determine your next action (ask or guess).
  `;

  try {
    const response = await ai.models.generateContent({
      model: model,
      contents: userPrompt,
      config: {
        systemInstruction: systemInstruction,
        responseMimeType: "application/json",
        responseSchema: responseSchema,
        temperature: 0.7,
      },
    });

    const jsonText = response.text.trim();
    // Gemini can sometimes wrap the JSON in markdown backticks
    const cleanedJsonText = jsonText.replace(/^```json\n?/, '').replace(/\n?```$/, '');
    const parsedResponse = JSON.parse(cleanedJsonText) as GeminiResponse;
    return parsedResponse;
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    // Provide a fallback response to keep the game going
    return {
        action: 'ask',
        payload: 'Is it famous in real life?',
        confidence: 10,
        topGuess: 'Something',
        reasoning: 'An error occurred, so I am asking a general question to recover.'
    };
  }
};