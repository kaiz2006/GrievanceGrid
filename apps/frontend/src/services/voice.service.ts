// Mock Voice Service for GrievanceGrid
// Following API SPEC Section 2
export const voiceService = {
  processVoice: async (formData: FormData) => {
    console.log(`[API CALL]: POST /voice/process`, formData);
    await new Promise((resolve) => setTimeout(resolve, 600));
    return {
      grid_id: `GRI-VOICE-${Math.floor(Math.random() * 1000000).toString().padStart(6, '0')}`,
      transcribed_text: "Assumed transcription: Pothole problem on main road.",
      detected_category: "ROADS",
      ai_priority: "HIGH",
      status: "CREATED"
    };
  }
};
