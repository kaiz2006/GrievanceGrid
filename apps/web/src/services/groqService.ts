import { Groq } from "groq-sdk";

export interface AIResponse {
  message: string;
  action: "ask_more" | "lookup_status" | "none";
  gridId?: string;
}

const SYSTEM_PROMPT = `You are a powerful AI Assistant for the GrievanceGrid Admin Portal.
Your job is to assist administrators in monitoring, analyzing, and looking up grievance statuses.

CAPABILITIES:
1. Converse naturally about civic issues and administrative tasks.
2. If the user provides a Ticket ID (e.g., #TKT-8901 or #GRID-1234), you can offer to look up its status.
3. If you decide to look up a status, set the action to "lookup_status" and provide the "gridId".

Respond ONLY with a JSON object:
{
  "message": "Conversational reply",
  "action": "ask_more" | "lookup_status" | "none",
  "gridId": "The extracted ID, if applicable"
}
`;

export class GroqService {
  private client: Groq | null = null;

  constructor(apiKey: string) {
    if (apiKey) {
      this.client = new Groq({
        apiKey: apiKey,
        dangerouslyAllowBrowser: true, // Required for client-side use
      });
    }
  }

  async processQuery(prompt: string): Promise<AIResponse> {
    if (!this.client) {
      throw new Error("Groq API Key not configured.");
    }

    try {
      const completion = await this.client.chat.completions.create({
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: prompt },
        ],
        model: "llama-3.3-70b-versatile",
        temperature: 0.5,
        response_format: { type: "json_object" },
      });

      const content = completion.choices[0]?.message?.content || "{}";
      return JSON.parse(content) as AIResponse;
    } catch (error: any) {
      console.error("Groq Service Error:", error);
      throw error;
    }
  }
}
