// Voice Service for GrievanceGrid
// Following API SPEC Section 2 - Voice Processing
import { apiClient, mockDelay } from "./api.client";

export interface VoiceProcessResult {
  grid_id: string;
  transcribed_text: string;
  detected_category: string;
  ai_priority: string;
  status: string;
  language: string;
  confidence: number;
  fallback_used: boolean;
}

export interface VoiceResultDetail {
  grievance_id: string;
  audio_url: string;
  transcription: string;
  summary: string;
  ai_category: string;
  ai_priority: string;
  fallback_used: boolean;
  voice_response_text: string;
  voice_response_audio_url: string;
  processed_at: string;
}

const generateGridId = () => `GRI-VOICE-${Math.floor(Math.random() * 1000000).toString().padStart(6, '0')}`;

export const voiceService = {
  // POST /voice/process - Process voice grievance
  processVoice: async (formData: FormData): Promise<VoiceProcessResult> => {
    return apiClient.post("/voice/process", { formData: "multipart/form-data" }, async () => {
      await mockDelay(600);
      return {
        grid_id: generateGridId(),
        transcribed_text: "मुख्य सड़क पर बड़ा गड्ढा है। पिछले हफ्ते से पानी भरा हुआ है।",
        detected_category: "ROADS",
        ai_priority: "HIGH",
        status: "CREATED",
        language: "hi",
        confidence: 0.92,
        fallback_used: false
      };
    });
  },

  // GET /voice/result/{grievance_id} - Get voice grievance result
  getResult: async (grievanceId: string): Promise<VoiceResultDetail> => {
    return apiClient.get(`/voice/result/${grievanceId}`, async () => {
      await mockDelay(400);
      return {
        grievance_id: grievanceId,
        audio_url: "/audio/sample.mp3",
        transcription: "मुख्य सड़क पर बड़ा गड्ढा है। पिछले हफ्ते से पानी भरा हुआ है।",
        summary: "Large pothole on main road with water accumulation causing traffic issues.",
        ai_category: "ROADS",
        ai_priority: "HIGH",
        fallback_used: false,
        voice_response_text: "Your grievance has been received. Your tracking ID is " + grievanceId,
        voice_response_audio_url: "/audio/response.mp3",
        processed_at: new Date().toISOString()
      };
    });
  },

  // GET /voice/languages - Get supported languages
  getSupportedLanguages: async (): Promise<{ code: string; name: string }[]> => {
    return apiClient.get("/voice/languages", async () => {
      await mockDelay(200);
      return [
        { code: "hi", name: "Hindi" },
        { code: "ta", name: "Tamil" },
        { code: "te", name: "Telugu" },
        { code: "bn", name: "Bengali" },
        { code: "mr", name: "Marathi" },
        { code: "gu", name: "Gujarati" },
        { code: "kn", name: "Kannada" },
        { code: "ml", name: "Malayalam" },
        { code: "pa", name: "Punjabi" },
        { code: "en", name: "English" }
      ];
    });
  },

  // POST /voice/tts - Text to speech conversion
  textToSpeech: async (text: string, language: string = "hi"): Promise<{ audio_url: string }> => {
    return apiClient.post("/voice/tts", { text, language }, async () => {
      await mockDelay(500);
      return {
        audio_url: "/audio/tts_response.mp3"
      };
    });
  }
};
