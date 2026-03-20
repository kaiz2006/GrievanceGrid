import os
import uuid
import logging
from typing import Dict, Any

logger = logging.getLogger(__name__)

try:
    import whisper
    HAS_WHISPER = True
except ImportError:
    HAS_WHISPER = False
    logger.warning("openai-whisper not installed. Falling back to stub.")

try:
    from gtts import gTTS
    HAS_GTTS = True
except ImportError:
    HAS_GTTS = False
    logger.warning("gTTS not installed. Text-to-Speech will be skipped.")

class VoiceProcessor:
    def __init__(self):
        self.use_gpu = os.getenv("USE_GPU", "true").lower() == "true"
        self.device = "cuda" if self.use_gpu else "cpu"
        self.model = None
        self.tts_output_dir = os.getenv("TTS_OUTPUT_DIR", "/app/models/audio_out")
        os.makedirs(self.tts_output_dir, exist_ok=True)
        
        if HAS_WHISPER:
            try:
                logger.info(f"Loading Whisper model on {self.device}...")
                self.model = whisper.load_model("base", device=self.device)
            except Exception as e:
                logger.error(f"Failed to load Whisper: {e}")

    def transcribe(self, audio_path_or_url: str) -> Dict[str, Any]:
        """Transcribe an audio file using Whisper."""
        if self.model and os.path.exists(audio_path_or_url):
            try:
                # In a full flow we would use pydub here to normalize audio
                # e.g: AudioSegment.from_file(...).normalize().export(temp_wav)
                
                result = self.model.transcribe(audio_path_or_url)
                transcript = result.get("text", "").strip()
                
                # Mock a Grid ID generation and TTS response
                grid_id = f"GRD-{str(uuid.uuid4())[:8].upper()}"
                response_msg = f"Your grievance has been received. Your Grid ID is {grid_id}. We are assigning a team."
                tts_info = self._generate_tts(response_msg)
                
                return {
                    "transcription": transcript,
                    "summary": f"Voice grievance: {transcript[:50]}...",
                    "response_message": response_msg,
                    "tts_audio_path": tts_info
                }
            except Exception as e:
                logger.error(f"Whisper transcription failed: {e}")
                
        # Fallback stub
        logger.warning(f"Returning stub transcription for {audio_path_or_url}")
        return {
            "transcription": "Transcription unavailable due to missing audio file or model.",
            "summary": "Voice note received.",
            "response_message": "System couldn't process voice. Grid ID XXXXXX.",
            "tts_audio_path": None
        }
        
    def _generate_tts(self, text: str, lang: str = "en") -> str:
        """Generate a synthesized voice file as the bot's response."""
        if not HAS_GTTS:
            return None
        try:
            tts = gTTS(text=text, lang=lang, slow=False)
            filename = f"response_{uuid.uuid4().hex[:8]}.mp3"
            filepath = os.path.join(self.tts_output_dir, filename)
            tts.save(filepath)
            return filepath
        except Exception as e:
            logger.error(f"TTS generation failed: {e}")
            return None

voice_processor = VoiceProcessor()
