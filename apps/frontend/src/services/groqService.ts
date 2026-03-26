import { Groq } from "groq-sdk";

export interface AIResponse {
  message: string;
  action: "ask_more" | "lookup_status" | "list_recent" | "get_summary" | "none";
  gridId?: string;
}

const SYSTEM_PROMPT = `You are a powerful AI Assistant for the GrievanceGrid Admin Portal (v10.0).
Your job is to assist administrators in monitoring, analyzing, and looking up grievance statuses.

CAPABILITIES:
1. Converse naturally about civic issues and administrative tasks.
2. If the user provides a Ticket ID (e.g., #GRID-1234), you can look up its status. ACTION: "lookup_status"
3. If the user asks for "recent issues", "all grievances", "show cases", or "list nodes", use list_recent. ACTION: "list_recent"
4. If the user asks for a "report", "today's summary", "dashboard stats", or "city health", use get_summary. ACTION: "get_summary"

IMPORTANT: You are an agentic core. Actually trigger the actions in your JSON response to get real-time data.

Respond ONLY with a JSON object:
{
  "message": "Conversational reply (e.g. 'Harvesting latest grid data...')",
  "action": "ask_more" | "lookup_status" | "list_recent" | "get_summary" | "none",
  "gridId": "The extracted ID, if applicable"
}
`;

export class GroqService {
  private client: Groq | null = null;

  constructor(apiKey: string) {
    if (apiKey) {
      this.client = new Groq({
        apiKey: apiKey,
        dangerouslyAllowBrowser: true,
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
