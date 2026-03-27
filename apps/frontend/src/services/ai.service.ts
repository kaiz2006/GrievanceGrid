import { GoogleGenerativeAI } from "@google/generative-ai";

const MOCK_DELAY = 1500;

export interface DraftReport {
  title: string;
  description: string;
  category: string;
  location_address?: string;
  latitude?: number;
  longitude?: number;
  severity?: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
}

export interface AIResponse {
  message: string;
  action: "ask_more" | "draft";
  report?: DraftReport;
}

const SYSTEM_PROMPT = `You are GrievanceGrid AI — a highly intelligent civic assistant embedded inside the GrievanceGrid citizen portal. Your purpose is to help citizens of India file formal, well-structured civic grievance complaints against municipal failures.

## YOUR PERSONALITY
- Professional, empathetic, and action-oriented
- Speak in clear, simple English
- Be concise — no unnecessary filler phrases
- Always guide the citizen to produce an accurate and complete complaint

## YOUR WORKFLOW
Gather information through natural conversation. You need AT LEAST:
1. **What** is the problem (type, severity, impact)
2. **Where** is it located (area, landmark, address)
3. **How long** has it been there or when was it noticed (optional but helpful)

Once you have enough details (at least what + where), produce a formal draft.

**CRITICAL**: NEVER auto-submit. ALWAYS produce a draft for user approval first (action: "draft").

If the user's message is too vague (e.g., "hi", "help", "there's an issue"), ask 1-2 focused questions.

## DRAFT FORMAT
When you have enough info, create a formal civic complaint using this language style:
- Title: Short, action-oriented (e.g., "Severe Pothole on MG Road Near City Mall")
- Description: Start with "The undersigned citizen reports a civic issue requiring immediate attention." Then: issue details, exact location, observed duration, impact on public, requested action.
- Pick the most accurate category from: ROADS, WATER_SUPPLY, SANITATION, ELECTRICITY, PUBLIC_TRANSPORT, ENVIRONMENT, INFRASTRUCTURE, BUILDING_VIOLATION, OTHER

## SEVERITY LEVELS
- LOW: Minor inconvenience, no immediate danger
- MEDIUM: Disrupts daily life, needs attention within a week  
- HIGH: Significant disruption or safety risk, needs attention within 48 hours
- CRITICAL: Immediate danger to public safety

## RESPONSE FORMAT
Always respond with ONLY valid JSON (no markdown, no backticks):
{
  "message": "Your conversational reply to the user (be helpful and natural)",
  "action": "ask_more" | "draft",
  "report": {
    "title": "Formal short title (only when action is draft)",
    "description": "Full formal civic complaint text (only when action is draft)",
    "category": "CATEGORY_NAME (only when action is draft)",
    "severity": "LOW|MEDIUM|HIGH|CRITICAL (only when action is draft)"
  }
}

## IMPORTANT RULES
- Never guess critical details — ask if unsure about location
- When action is "draft", your message field should say something like "I've drafted your complaint. Please review it below before submitting."
- If user sends an image, analyze what the civic issue appears to be from the image and incorporate it
- If user wants to change something about the draft, incorporate their feedback and produce a NEW draft (action: "draft" again)
`;

// Smart keyword → category mapping
const detectCategory = (text: string): string => {
  const t = text.toLowerCase();
  if (t.match(/\b(road|pothole|crack|highway|street|pavement|footpath|speed bump)\b/)) return "ROADS";
  if (t.match(/\b(water|pipe|leakage|supply|tap|drain|flood|sewage|sewer)\b/)) return "WATER_SUPPLY";
  if (t.match(/\b(garbage|trash|waste|littering|dustbin|sanitation|hygiene|smell)\b/)) return "SANITATION";
  if (t.match(/\b(light|electricity|power|streetlight|wire|transformer|outage|blackout)\b/)) return "ELECTRICITY";
  if (t.match(/\b(bus|metro|auto|transport|traffic|signal|road sign)\b/)) return "PUBLIC_TRANSPORT";
  if (t.match(/\b(tree|pollution|noise|air|smoke|environment|park|garden)\b/)) return "ENVIRONMENT";
  if (t.match(/\b(building|construction|encroachment|illegal|structure)\b/)) return "BUILDING_VIOLATION";
  if (t.match(/\b(bridge|boundary wall|wall|infrastructure|public property)\b/)) return "INFRASTRUCTURE";
  return "OTHER";
};

const detectSeverity = (text: string): "LOW" | "MEDIUM" | "HIGH" | "CRITICAL" => {
  const t = text.toLowerCase();
  if (t.match(/\b(danger|accident|emergency|critical|urgent|immediate|life|death|serious|major)\b/)) return "CRITICAL";
  if (t.match(/\b(bad|bad|broken|severe|large|big|significant|weeks|month)\b/)) return "HIGH";
  if (t.match(/\b(minor|small|little|slight|occasional)\b/)) return "LOW";
  return "MEDIUM";
};

export const aiService = {
  async processGrievanceContext(
    prompt: string,
    imageBase64?: string,
    previousMessages?: { role: string; text: string }[]
  ): Promise<AIResponse> {
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

    if (apiKey) {
      try {
        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ 
          model: "gemini-1.5-flash",
        });

        // Build full prompt with conversation history
        let historyContext = "";
        if (previousMessages && previousMessages.length > 0) {
          historyContext = "\n\n## CONVERSATION HISTORY\n" +
            previousMessages.slice(-6).map(m => `${m.role === "user" ? "Citizen" : "AI"}: ${m.text}`).join("\n");
        }

        const fullPrompt = `${SYSTEM_PROMPT}${historyContext}\n\nCitizen's latest message: ${prompt}`;
        const parts: any[] = [{ text: fullPrompt }];

        if (imageBase64) {
          const [mimeInfo, base64Data] = imageBase64.split(',');
          const mimeType = mimeInfo.replace('data:', '').replace(';base64', '');
          parts.push({ inlineData: { data: base64Data, mimeType } });
        }

        const result = await model.generateContent(parts);
        const textResp = result.response.text();

        const cleanedText = textResp.replace(/```(json)?/gi, "").replace(/```/g, "").trim();
        const parsed = JSON.parse(cleanedText) as AIResponse;

        // Ensure action is valid
        if (!["ask_more", "draft"].includes(parsed.action)) {
          parsed.action = "draft";
        }

        return parsed;
      } catch (error: any) {
        console.error("AI API Error (falling back to mock):", error);
        // Fall back to smart mock on any API failure
        return aiService._mockResponse(prompt, imageBase64);
      }
    } else {
      return aiService._mockResponse(prompt, imageBase64);
    }
  },

  // Smart mock — used as fallback when API key missing or API call fails
  _mockResponse(prompt: string, imageBase64?: string): Promise<AIResponse> {
    return new Promise<AIResponse>((resolve) => {
        setTimeout(() => {
          const wordCount = prompt.trim().split(/\s+/).length;

          if (wordCount < 5 && !imageBase64) {
            resolve({
              message: "I'd love to help you file a complaint! Could you tell me:\n1. What's the issue?\n2. Where is it located?",
              action: "ask_more"
            });
            return;
          }

          if (wordCount < 10 && !imageBase64) {
            resolve({
              message: "Got it! To create an accurate report, could you also tell me the exact location or a nearby landmark?",
              action: "ask_more"
            });
            return;
          }

          const category = detectCategory(prompt);
          const severity = detectSeverity(prompt);
          const location = prompt.match(/\b(near|at|on|in|beside|opposite|outside)\s+([A-Za-z\s]{3,30})/i)?.[0] || "the reported area";

          const titleWords = prompt.split(" ").slice(0, 8).join(" ");
          const title = `${category === "ROADS" ? "Damaged Road Surface" : category === "WATER_SUPPLY" ? "Water Supply Disruption" : category === "ELECTRICITY" ? "Street Light / Power Failure" : category === "SANITATION" ? "Sanitation Issue" : "Civic Infrastructure Issue"} at ${location}`;

          resolve({
            message: "I've drafted your formal complaint based on the details provided. Please review it below before submitting.",
            action: "draft",
            report: {
              title: title,
              description: `The undersigned citizen reports a civic issue requiring immediate attention from the concerned municipal department.\n\nIssue Details: ${prompt}\n\nThe problem has been observed at ${location} and its current state poses a ${severity === "CRITICAL" || severity === "HIGH" ? "significant safety risk" : "notable inconvenience"} to the general public.\n\nThe citizen respectfully requests that the relevant department inspect the site and undertake the necessary remediation work at the earliest opportunity.\n\n[Report generated via GrievanceGrid AI Assistant]`,
              category: category,
              severity: severity,
              location_address: location
            }
          });
        }, MOCK_DELAY);
      });
  }
};
