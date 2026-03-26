import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  Mic,
  StopCircle,
  Volume2,
  MapPin,
  ArrowRight,
  CheckCircle2,
  Loader2,
  Languages,
  AlertCircle,
  Play,
  Pause
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { voiceService } from "@/services/voice.service";

const VoiceSubmitPage = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [language, setLanguage] = useState("hi");
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [isLocating, setIsLocating] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const languages = [
    { code: "hi", name: "Hindi" },
    { code: "ta", name: "Tamil" },
    { code: "te", name: "Telugu" },
    { code: "bn", name: "Bengali" },
    { code: "mr", name: "Marathi" },
    { code: "gu", name: "Gujarati" },
    { code: "kn", name: "Kannada" },
    { code: "ml", name: "Malayalam" },
    { code: "pa", name: "Punjabi" },
    { code: "en", name: "English" },
  ];

  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      setLocationError("Geolocation not supported");
      return;
    }

    setIsLocating(true);
    setLocationError(null);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        setIsLocating(false);
      },
      (err) => {
        setIsLocating(false);
        setLocationError("Location access denied. Please enable GPS.");
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      const chunks: BlobPart[] = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunks.push(e.data);
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunks, { type: "audio/wav" });
        setAudioBlob(blob);
      };

      mediaRecorderRef.current = mediaRecorder;
      mediaRecorder.start();
      setIsRecording(true);

      // Start timer
      timerRef.current = setInterval(() => {
        setRecordingTime((prev) => prev + 1);
      }, 1000);

      // Get location if not already available
      if (!location) {
        handleGetLocation();
      }
    } catch (err) {
      console.error("Error accessing microphone:", err);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
      setIsRecording(false);
      if (timerRef.current) clearInterval(timerRef.current);
    }
  };

  const submitVoice = async () => {
    if (!audioBlob) return;
    
    setProcessing(true);
    const formData = new FormData();
    formData.append("audio", audioBlob, "recording.wav");
    formData.append("language", language);
    if (location) {
      formData.append("latitude", location.lat.toString());
      formData.append("longitude", location.lng.toString());
    }

    const response = await voiceService.processVoice(formData);
    setResult(response);
    setProcessing(false);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  if (result) {
    return (
      <div className="min-h-screen bg-background text-foreground flex flex-col">
        <main className="flex-grow pt-8 lg:pt-32 pb-12 px-6">
          <div className="container mx-auto max-w-2xl">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="text-center py-12"
            >
              <div className="w-24 h-24 rounded-full bg-green-500/10 flex items-center justify-center mx-auto mb-6 shadow-[0_0_40px_rgba(34,197,94,0.2)]">
                <CheckCircle2 className="w-12 h-12 text-green-500" />
              </div>
              <h1 className="text-3xl font-bold mb-2">Voice Grievance Submitted!</h1>
              <p className="text-muted-foreground mb-8">Your grievance has been processed by AI</p>

              <Card className="glass-card border-white/5 bg-white/[0.02] mb-6">
                <CardContent className="p-6 space-y-4">
                  <div className="p-4 rounded-2xl bg-blue-500/5 border border-blue-500/10">
                    <p className="text-xs text-blue-500 uppercase tracking-widest mb-1">Your Tracking ID</p>
                    <p className="font-mono text-2xl font-bold text-blue-500">{result.grid_id}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 rounded-2xl bg-white/5">
                      <p className="text-xs text-muted-foreground uppercase tracking-widest mb-1">Category</p>
                      <Badge className="bg-amber-500/10 text-amber-500 border-amber-500/20">
                        {result.detected_category}
                      </Badge>
                    </div>
                    <div className="p-4 rounded-2xl bg-white/5">
                      <p className="text-xs text-muted-foreground uppercase tracking-widest mb-1">Priority</p>
                      <p className={`text-lg font-bold ${result.ai_priority === "HIGH" ? "text-red-500" : "text-blue-500"}`}>
                        {result.ai_priority}
                      </p>
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl bg-white/5">
                    <p className="text-xs text-muted-foreground uppercase tracking-widest mb-2">Transcription</p>
                    <p className="text-sm">{result.transcribed_text}</p>
                  </div>
                </CardContent>
              </Card>

              <div className="flex gap-4 justify-center">
                <Button asChild>
                  <Link to={`/track/${result.grid_id}`}>Track Status</Link>
                </Button>
                <Button variant="outline" asChild>
                  <Link to="/">Go Home</Link>
                </Button>
              </div>
            </motion.div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <main className="flex-grow pt-8 lg:pt-32 pb-12 px-6 relative overflow-hidden">
        {/* Ambient Glow */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-purple-500/5 rounded-full blur-[150px] pointer-events-none" />

        <div className="container mx-auto max-w-2xl">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/10 border border-purple-500/20 mb-4">
              <Volume2 className="w-4 h-4 text-purple-500" />
              <span className="text-xs font-bold text-purple-500 uppercase tracking-widest">Voice-to-Grid</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">Submit via Voice</h1>
            <p className="text-muted-foreground text-lg">Speak in your preferred language. No typing needed.</p>
          </div>

          {/* Language Selection */}
          {!isRecording && !audioBlob && (
            <Card className="glass-card border-white/5 bg-white/[0.02] mb-8">
              <CardContent className="p-6">
                <label className="flex items-center gap-2 text-sm font-medium mb-4">
                  <Languages className="w-4 h-4 text-muted-foreground" />
                  Select Your Language
                </label>
                <div className="grid grid-cols-3 md:grid-cols-5 gap-2">
                  {languages.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => setLanguage(lang.code)}
                      className={`p-3 rounded-xl text-sm font-medium transition-all ${
                        language === lang.code
                          ? "bg-purple-600 text-white"
                          : "bg-white/5 hover:bg-white/10 text-muted-foreground"
                      }`}
                    >
                      {lang.name}
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Recording Interface */}
          <div className="flex flex-col items-center">
            {!audioBlob ? (
              <>
                {/* Record Button */}
                <motion.button
                  onClick={isRecording ? stopRecording : startRecording}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`relative w-32 h-32 rounded-full flex items-center justify-center transition-all ${
                    isRecording
                      ? "bg-red-500/20 border-4 border-red-500 shadow-[0_0_60px_rgba(239,68,68,0.4)]"
                      : "bg-purple-600 border-4 border-purple-500 shadow-[0_0_60px_rgba(147,51,234,0.4)]"
                  }`}
                >
                  {isRecording ? (
                    <StopCircle className="w-12 h-12 text-red-500" />
                  ) : (
                    <Mic className="w-12 h-12 text-white" />
                  )}
                  
                  {/* Recording Ripple Effect */}
                  {isRecording && (
                    <>
                      <motion.div
                        className="absolute inset-0 rounded-full border-4 border-red-500"
                        animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                      />
                      <motion.div
                        className="absolute inset-0 rounded-full border-4 border-red-500"
                        animate={{ scale: [1, 1.8, 1], opacity: [0.3, 0, 0.3] }}
                        transition={{ duration: 1.5, repeat: Infinity, delay: 0.3 }}
                      />
                    </>
                  )}
                </motion.button>

                {/* Recording Status */}
                <div className="mt-8 text-center">
                  {isRecording ? (
                    <>
                      <p className="text-2xl font-bold text-red-500">{formatTime(recordingTime)}</p>
                      <p className="text-sm text-muted-foreground mt-2">Tap to stop recording</p>
                    </>
                  ) : (
                    <>
                      <p className="text-xl font-bold">Tap to Record</p>
                      <p className="text-sm text-muted-foreground mt-2">Maximum 2 minutes</p>
                    </>
                  )}
                </div>

                {/* Location Status */}
                <div className="mt-6 flex flex-col items-center gap-3">
                  {location ? (
                    <div className="flex items-center gap-2 bg-green-500/10 border border-green-500/20 px-4 py-2 rounded-full text-xs text-green-500 font-bold uppercase tracking-widest">
                      <MapPin className="w-3.5 h-3.5" />
                      GPS Locked: {location.lat.toFixed(4)}, {location.lng.toFixed(4)}
                      <button 
                        onClick={handleGetLocation} 
                        className="ml-2 hover:bg-green-500/20 p-1 rounded-full transition-colors"
                        disabled={isLocating}
                      >
                        <Loader2 className={`w-3 h-3 ${isLocating ? 'animate-spin' : ''}`} />
                      </button>
                    </div>
                  ) : locationError ? (
                    <div className="flex flex-col items-center gap-2">
                       <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/20 px-4 py-2 rounded-full text-xs text-red-500 font-bold uppercase tracking-widest">
                        <AlertCircle className="w-3.5 h-3.5" />
                        {locationError}
                      </div>
                      <Button variant="ghost" size="sm" onClick={handleGetLocation} className="text-purple-500 hover:text-purple-400">
                        Retry Location Access
                      </Button>
                    </div>
                  ) : (
                    <button 
                      onClick={handleGetLocation}
                      disabled={isLocating}
                      className="flex items-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 px-4 py-2 rounded-full text-xs text-muted-foreground transition-all"
                    >
                      <MapPin className={`w-3.5 h-3.5 ${isLocating ? 'animate-bounce' : ''}`} />
                      {isLocating ? "Acquiring GPS..." : "Capturing Location..."}
                    </button>
                  )}
                </div>
              </>
            ) : (
              /* Playback Interface */
              <Card className="glass-card border-white/5 bg-white/[0.02] w-full max-w-md">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4 mb-6">
                    <Button
                      size="icon"
                      className="h-14 w-14 rounded-full bg-purple-600 hover:bg-purple-500"
                      onClick={() => setIsPlaying(!isPlaying)}
                    >
                      {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6 ml-1" />}
                    </Button>
                    <div className="flex-1">
                      <p className="font-medium">Your Recording</p>
                      <p className="text-sm text-muted-foreground">{formatTime(recordingTime)}</p>
                    </div>
                    <Button variant="ghost" size="sm" onClick={() => { setAudioBlob(null); setRecordingTime(0); }}>
                      Re-record
                    </Button>
                  </div>

                  <Button
                    className="w-full h-14 bg-purple-600 hover:bg-purple-500"
                    disabled={processing}
                    onClick={submitVoice}
                  >
                    {processing ? (
                      <>
                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                        Processing with AI...
                      </>
                    ) : (
                      <>
                        Submit Grievance
                        <ArrowRight className="w-5 h-5 ml-2" />
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Help Text */}
          {!isRecording && !audioBlob && (
            <div className="mt-12 p-6 rounded-2xl bg-white/5 border border-white/10">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-purple-500 shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-bold mb-2">How it works</h3>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Speak clearly in your chosen language</li>
                    <li>• Mention the location and type of issue</li>
                    <li>• AI will transcribe and categorize automatically</li>
                    <li>• You'll receive a tracking ID instantly</li>
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default VoiceSubmitPage;
