import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useParams } from "react-router-dom";
import {
  Mic,
  FileText,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Volume2,
  Play,
  Pause,
  ArrowLeft,
  Clock,
  Tag,
  MessageSquare,
  Share2
} from "lucide-react";
import { voiceService } from "@/services/voice.service";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface VoiceResult {
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

const VoiceResultPage = () => {
  const { grievance_id } = useParams();
  const [result, setResult] = useState<VoiceResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      // Simulating voice result fetch
      await new Promise((resolve) => setTimeout(resolve, 500));
      setResult({
        grievance_id: grievance_id || "grievance_voice_001",
        audio_url: "/audio/sample.mp3",
        transcription: "मुख्य सड़क पर बड़ा गड्ढा है। पिछले हफ्ते से पानी भरा हुआ है और ट्रैफिक में परेशानी हो रही है। कृपया जल्द से जल्द इसकी मरम्मत करें।",
        summary: "Large pothole on main road with water accumulation causing traffic issues. Resident requests urgent repair.",
        ai_category: "ROADS",
        ai_priority: "HIGH",
        fallback_used: false,
        voice_response_text: "Your grievance has been received. Your tracking ID is GRI-2026-VOICE.",
        voice_response_audio_url: "/audio/response.mp3",
        processed_at: new Date().toISOString()
      });
      setLoading(false);
    };
    fetchData();
  }, [grievance_id]);

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      ROADS: "bg-amber-500/10 text-amber-500 border-amber-500/20",
      WATER_SUPPLY: "bg-blue-500/10 text-blue-500 border-blue-500/20",
      ELECTRICITY: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
      SANITATION: "bg-green-500/10 text-green-500 border-green-500/20",
      OTHER: "bg-white/10 text-muted-foreground border-white/10"
    };
    return colors[category] || colors.OTHER;
  };

  const getPriorityColor = (priority: string) => {
    const colors: Record<string, string> = {
      CRITICAL: "text-red-500",
      HIGH: "text-amber-500",
      MEDIUM: "text-blue-500",
      LOW: "text-green-500"
    };
    return colors[priority] || colors.MEDIUM;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-blue-500/10 flex items-center justify-center mx-auto">
            <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
          </div>
          <p className="text-muted-foreground font-mono uppercase tracking-widest text-xs">Processing Voice Data...</p>
        </div>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto" />
          <p className="text-muted-foreground">Voice grievance not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <main className="flex-grow pt-8 lg:pt-32 pb-12 px-6 relative overflow-hidden">
        {/* Ambient Glows */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-[150px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-purple-500/5 rounded-full blur-[150px] pointer-events-none" />

        <div className="container mx-auto max-w-4xl">
          {/* Header */}
          <div className="flex items-center gap-6 mb-12">
            <Button variant="ghost" size="icon" className="h-14 w-14 rounded-2xl border border-white/10">
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <Mic className="w-5 h-5 text-blue-500" />
                <span className="text-xs font-bold text-blue-500 uppercase tracking-widest">Voice-to-Grid Processing</span>
              </div>
              <h1 className="text-3xl md:text-4xl font-bold tracking-tight">Voice Grievance Result</h1>
            </div>
            <Badge className="bg-green-500/10 text-green-500 border-green-500/20 px-4 py-2">
              <CheckCircle2 className="w-3 h-3 mr-2" />
              Processed
            </Badge>
          </div>

          {/* Success Animation */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="text-center mb-12"
          >
            <div className="w-24 h-24 rounded-full bg-green-500/10 flex items-center justify-center mx-auto mb-6 shadow-[0_0_40px_rgba(34,197,94,0.2)]">
              <CheckCircle2 className="w-12 h-12 text-green-500" />
            </div>
            <h2 className="text-2xl font-bold mb-2">Voice Grievance Processed</h2>
            <p className="text-muted-foreground">Your voice report has been transcribed and categorized by AI</p>
          </motion.div>

          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Audio Player */}
            <Card className="glass-card border-white/5 bg-white/[0.02]">
              <CardHeader>
                <CardTitle className="text-lg font-bold flex items-center gap-3">
                  <Volume2 className="w-5 h-5 text-blue-500" />
                  Original Recording
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
                  <div className="flex items-center gap-4">
                    <Button
                      size="icon"
                      className="h-14 w-14 rounded-full bg-blue-600 hover:bg-blue-500"
                      onClick={() => setIsPlaying(!isPlaying)}
                    >
                      {isPlaying ? (
                        <Pause className="w-6 h-6" />
                      ) : (
                        <Play className="w-6 h-6 ml-1" />
                      )}
                    </Button>
                    <div className="flex-1">
                      <div className="h-12 bg-white/5 rounded-xl overflow-hidden relative">
                        <motion.div
                          className="absolute inset-y-0 left-0 bg-blue-600/30"
                          animate={{ width: isPlaying ? "100%" : "0%" }}
                          transition={{ duration: isPlaying ? 5 : 0.3 }}
                        />
                        <div className="absolute inset-0 flex items-center justify-center gap-1">
                          {[...Array(40)].map((_, i) => (
                            <div
                              key={i}
                              className={`w-1 bg-blue-500/50 rounded-full ${isPlaying ? "animate-pulse" : ""}`}
                              style={{
                                height: `${Math.random() * 30 + 10}px`,
                                animationDelay: `${i * 0.05}s`
                              }}
                            />
                          ))}
                        </div>
                      </div>
                      <div className="flex justify-between mt-2 text-[10px] text-muted-foreground font-mono">
                        <span>00:00</span>
                        <span>00:12</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Clock className="w-3 h-3" />
                  <span>Processed at {new Date(result.processed_at).toLocaleString()}</span>
                </div>
              </CardContent>
            </Card>

            {/* AI Response */}
            <Card className="glass-card border-white/5 bg-white/[0.02]">
              <CardHeader>
                <CardTitle className="text-lg font-bold flex items-center gap-3">
                  <MessageSquare className="w-5 h-5 text-green-500" />
                  AI Voice Response
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="p-6 rounded-2xl bg-green-500/5 border border-green-500/10">
                  <p className="text-sm leading-relaxed mb-4">{result.voice_response_text}</p>
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-green-500/30 bg-green-500/10 hover:bg-green-500/20 text-green-500"
                  >
                    <Volume2 className="w-3 h-3 mr-2" />
                    Play Response
                  </Button>
                </div>

                <div className="p-4 rounded-2xl bg-white/5">
                  <p className="text-[10px] text-muted-foreground uppercase tracking-widest mb-2">Your Tracking ID</p>
                  <p className="font-mono text-lg font-bold text-blue-500">GRI-2026-VOICE</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Transcription */}
          <Card className="glass-card border-white/5 bg-white/[0.02] mt-8">
            <CardHeader>
              <CardTitle className="text-lg font-bold flex items-center gap-3">
                <FileText className="w-5 h-5 text-amber-500" />
                Transcription & Analysis
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Original Transcription */}
                <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
                  <p className="text-[10px] text-muted-foreground uppercase tracking-widest mb-3 flex items-center gap-2">
                    <Mic className="w-3 h-3" />
                    Original (Hindi)
                  </p>
                  <p className="text-sm leading-relaxed font-medium">{result.transcription}</p>
                </div>

                {/* English Summary */}
                <div className="p-6 rounded-2xl bg-blue-500/5 border border-blue-500/10">
                  <p className="text-[10px] text-blue-500 uppercase tracking-widest mb-3 flex items-center gap-2">
                    <FileText className="w-3 h-3" />
                    AI Summary (English)
                  </p>
                  <p className="text-sm leading-relaxed">{result.summary}</p>
                </div>
              </div>

              {/* Classification */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="p-4 rounded-2xl bg-white/5 text-center">
                  <p className="text-[10px] text-muted-foreground uppercase tracking-widest mb-2">Category</p>
                  <Badge className={getCategoryColor(result.ai_category)}>
                    <Tag className="w-3 h-3 mr-1" />
                    {result.ai_category}
                  </Badge>
                </div>
                <div className="p-4 rounded-2xl bg-white/5 text-center">
                  <p className="text-[10px] text-muted-foreground uppercase tracking-widest mb-2">Priority</p>
                  <p className={`text-xl font-bold ${getPriorityColor(result.ai_priority)}`}>
                    {result.ai_priority}
                  </p>
                </div>
                <div className="p-4 rounded-2xl bg-white/5 text-center">
                  <p className="text-[10px] text-muted-foreground uppercase tracking-widest mb-2">Language</p>
                  <p className="text-sm font-bold">Hindi (hi)</p>
                </div>
                <div className="p-4 rounded-2xl bg-white/5 text-center">
                  <p className="text-[10px] text-muted-foreground uppercase tracking-widest mb-2">Status</p>
                  <p className="text-sm font-bold text-green-500">Created</p>
                </div>
              </div>

              {/* Fallback Warning */}
              {result.fallback_used && (
                <div className="p-4 rounded-2xl bg-amber-500/5 border border-amber-500/10 flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-bold text-amber-500">Manual Review Required</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      The AI transcription confidence was low. A manual review has been queued.
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex gap-4 mt-8">
            <Button className="flex-1 h-14 bg-blue-600 hover:bg-blue-500">
              <Share2 className="w-4 h-4 mr-2" />
              Track This Grievance
            </Button>
            <Button variant="outline" className="h-14 px-8 border-white/10 bg-white/5">
              Submit Another
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default VoiceResultPage;
