import { GoogleGenerativeAI } from "@google/generative-ai";

const MOCK_DELAY = 2000;

export interface AIResponse {
  message: string;
  action: "ask_more" | "submit";
  report?: {
    title: string;
    description: string;
    category: string;
    latitude?: number;
    longitude?: number;
    location_address?: string;
  };
}

const SYSTEM_PROMPT = `You are a helpful AI assistant for the GrievanceGrid citizen portal. Your job is to help citizens report civic issues (like broken streetlights, water supply problems, bad roads, etc.) effectively.

When a user speaks to you:
1. Try to understand the problem.
2. If the user provides enough details (what the issue is, roughly where it is, and what category it belongs to), you should formulate a formal grievance report and decide to "submit" it.
3. If the user's report is too vague (e.g., "hi", "it's broken"), ask them for more details, or suggest they upload a photo or share location. Your action should be "ask_more".

Categories available: "ROADS", "WATER_SUPPLY", "SANITATION", "ELECTRICITY", "PUBLIC_TRANSPORT", "ENVIRONMENT", "INFRASTRUCTURE", "BUILDING_VIOLATION", "OTHER".

You MUST respond ONLY with a valid JSON object matching this schema, completely unformatted (no markdown backticks around the JSON):
{
  "message": "Your conversational, friendly reply to the user.",
  "action": "ask_more" | "submit",
  "report": {
    "title": "A short, formal title for the grievance (only if action is 'submit')",
    "description": "A detailed, formal description of the issue (only if action is 'submit')",
    "category": "ONE_OF_THE_CATEGORIES (only if action is 'submit')"
  }
}
`;

export const aiService = {
  async processGrievanceContext(prompt: string, imageBase64?: string): Promise<AIResponse> {
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
    
    if (apiKey) {
      try {
        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ 
          model: "gemini-3-flash",
          generationConfig: {
            responseMimeType: "application/json",
          }
        });
        
        const fullPrompt = `${SYSTEM_PROMPT}\n\nUser Input: ${prompt}`;
        const parts: any[] = [{ text: fullPrompt }];
        
        if (imageBase64) {
          const [mimeInfo, base64Data] = imageBase64.split(',');
          const mimeType = mimeInfo.replace('data:', '').replace(';base64', '');
          parts.push({
            inlineData: { data: base64Data, mimeType }
          });
        }
        
        const result = await model.generateContent(parts);
        const textResp = result.response.text();
        
        // Try to parse the raw text as JSON, cleaning up potential markdown formatting
        const cleanedText = textResp.replace(/```(json)?/gi, "").replace(/```/g, "").trim();
        return JSON.parse(cleanedText) as AIResponse;
      } catch (error: any) {
        console.error("AI API Error:", error);
        return {
          message: `I encountered an error communicating with my neural net: ${error.message || "Unknown error"}.`,
          action: "ask_more"
        };
      }
    } else {
      // Sophisticated Mock Behavior if no API key is present
      return new Promise<AIResponse>((resolve) => {
        setTimeout(() => {
          if (prompt.length < 15 && !imageBase64) {
             resolve({
               message: "Could you please provide a few more details about what happened or where this is exactly? A photo usually helps!",
               action: "ask_more"
             });
          } else {
             // Artificial Intelligence Mocking
             let category = "OTHER";
             const lowerPrompt = prompt.toLowerCase();
             if (lowerPrompt.includes("water") || lowerPrompt.includes("pipe")) category = "WATER_SUPPLY";
             else if (lowerPrompt.includes("light") || lowerPrompt.includes("power") || lowerPrompt.includes("wire")) category = "ELECTRICITY";
             else if (lowerPrompt.includes("road") || lowerPrompt.includes("pothole")) category = "ROADS";
             else if (lowerPrompt.includes("trash") || lowerPrompt.includes("garbage")) category = "SANITATION";

             const titleContent = prompt.split(" ").slice(0, 6).join(" ") + "...";
             
             resolve({
               message: `Based on your input, I have compiled a formal grievance report under the ${category} category. I am processing the submission now.`,
               action: "submit",
               report: {
                 title: `Issue: ${titleContent.charAt(0).toUpperCase() + titleContent.slice(1)}`,
                 description: prompt + (imageBase64 ? " [Visual evidence provided and analyzed]" : ""),
                 category: category
               }
             });
          }
        }, MOCK_DELAY);
      });
    }
  }
};
