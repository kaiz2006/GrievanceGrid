import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  MapPin, 
  Type, 
  Grid, 
  Camera, 
  Mic, 
  ChevronRight, 
  ChevronLeft, 
  Check, 
  AlertTriangle,
  Send,
  Loader2,
  Trash2,
  Play
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

import { grievanceService } from "@/services/grievance.service";
import { voiceService } from "@/services/voice.service";
import MapComponent from "../map/MapComponent";

const steps = [
  { id: "location", title: "Location", icon: MapPin },
  { id: "details", title: "Description", icon: Type },
  { id: "category", title: "Category", icon: Grid },
  { id: "media", title: "Media", icon: Camera }
];

const categories = [
  "Infrastructure",
  "Utilities",
  "Sanitation",
  "Environment",
  "Safety",
  "Other"
];

const SubmitPage = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [locationType, setLocationType] = useState("current");
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    location: { latitude: 28.6139, longitude: 77.2090, address: "" }
  });

  const handleMapClick = (lat: number, lng: number) => {
    setFormData(prev => ({
      ...prev,
      location: { ...prev.location, latitude: lat, longitude: lng, address: `Selected: ${lat.toFixed(4)}, ${lng.toFixed(4)}` }
    }));
  };

  const nextStep = () => setCurrentStep(prev => Math.min(prev + 1, steps.length - 1));
  const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 0));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // If there was a voice recording, we would normally append it to a FormData
      // For this mock, we'll just log the call
      const response = await grievanceService.submit(formData);
      console.log("[SUBMIT SUCCESS]", response);
      
      // Navigate to tracking
      window.location.href = `/track/${response.grid_id}`;
    } catch (error) {
      console.error("[SUBMIT ERROR]", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      
      <main className="flex-grow pt-8 lg:pt-32 pb-24 px-6 relative overflow-hidden">
        {/* Decorative Grid */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />

        <div className="container max-w-4xl mx-auto relative z-10">
          <div className="text-center mb-12">
            <motion.h1 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl md:text-5xl font-bold tracking-tight mb-4 bg-gradient-to-r from-foreground to-foreground/40 bg-clip-text text-transparent"
            >
              Report a Grievance
            </motion.h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Our AI-powered intake system will route your report to the appropriate department within 10 minutes.
            </p>
          </div>

          {/* Stepper */}
          <div className="flex items-center justify-between mb-16 relative px-4">
            <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-white/5 -translate-y-1/2 z-0" />
            {steps.map((step, i) => (
              <div key={step.id} className="relative z-10 flex flex-col items-center gap-3">
                <motion.div
                  className={`w-12 h-12 rounded-2xl flex items-center justify-center border-2 transition-all duration-500 ${
                    i <= currentStep 
                      ? "bg-blue-600 border-blue-600 shadow-[0_0_20px_rgba(37,99,235,0.3)]" 
                      : "bg-background border-white/10"
                  }`}
                  animate={{ scale: i === currentStep ? 1.1 : 1 }}
                >
                  <step.icon className={`w-6 h-6 ${i <= currentStep ? "text-white" : "text-muted-foreground"}`} />
                </motion.div>
                <span className={`text-[9px] md:text-xs font-bold uppercase tracking-wider md:tracking-widest ${i <= currentStep ? "text-foreground" : "text-muted-foreground"}`}>
                  <span className="md:hidden">{step.title.slice(0, 4)}.</span>
                  <span className="hidden md:inline">{step.title}</span>
                </span>
              </div>
            ))}
          </div>

          {/* Form Content */}
          <div className="glass-card p-8 md:p-12 border-white/5 bg-white/[0.01]">
            <form onSubmit={handleSubmit}>
              <AnimatePresence mode="wait">
                {currentStep === 0 && (
                  <motion.div
                    key="step-0"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-8"
                  >
                    <div className="space-y-4">
                      <Label className="text-lg font-bold">Where is the issue located?</Label>
                      <Tabs defaultValue="current" className="w-full" onValueChange={setLocationType}>
                        <TabsList className="flex flex-col sm:grid sm:grid-cols-3 bg-white/5 border border-white/10 h-auto sm:h-14 p-1 rounded-2xl gap-1 sm:gap-0">
                          <TabsTrigger value="current" className="rounded-xl data-[state=active]:bg-blue-600 data-[state=active]:text-white data-[state=inactive]:bg-white/5 data-[state=inactive]:hover:bg-white/10 h-10 sm:h-full transition-all text-xs">
                            Current Location
                          </TabsTrigger>
                          <TabsTrigger value="map" className="rounded-xl data-[state=active]:bg-blue-600 data-[state=active]:text-white data-[state=inactive]:bg-white/5 data-[state=inactive]:hover:bg-white/10 h-10 sm:h-full transition-all text-xs">
                            Choose on Map
                          </TabsTrigger>
                          <TabsTrigger value="address" className="rounded-xl data-[state=active]:bg-blue-600 data-[state=active]:text-white data-[state=inactive]:bg-white/5 data-[state=inactive]:hover:bg-white/10 h-10 sm:h-full transition-all text-xs">
                            Enter Address
                          </TabsTrigger>
                        </TabsList>
                      </Tabs>
                    </div>

                    <div className="rounded-3xl border border-white/10 overflow-hidden relative group shadow-2xl">
                      <MapComponent 
                        center={[formData.location.latitude, formData.location.longitude]} 
                        zoom={15}
                        markers={[{ 
                          position: [formData.location.latitude, formData.location.longitude],
                          popupContent: "Grievance Location"
                        }]}
                        onMapClick={handleMapClick}
                        className="w-full h-[400px]"
                      />
                      <div className="absolute bottom-4 left-4 z-[1000] bg-black/60 backdrop-blur-md px-4 py-2 rounded-full border border-white/10">
                        <p className="text-xs font-mono text-blue-400">
                          LAT: {formData.location.latitude.toFixed(6)} | LNG: {formData.location.longitude.toFixed(6)}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                )}

                {currentStep === 1 && (
                  <motion.div
                    key="step-1"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-6"
                  >
                    <div className="space-y-4">
                      <Label htmlFor="title" className="text-lg font-bold">Issue Title</Label>
                      <Input 
                        id="title" 
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        placeholder="e.g., Broken water pipe near main gate" 
                        className="h-14 bg-white/5 border-white/10 focus:border-blue-500/50"
                      />
                    </div>
                    <div className="space-y-4">
                      <Label htmlFor="description" className="text-lg font-bold">Detailed Description</Label>
                      <Textarea 
                        id="description" 
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        placeholder="Please provide as much detail as possible to help us resolve the issue faster..." 
                        className="min-h-[200px] bg-white/5 border-white/10 focus:border-blue-500/50 resize-none"
                      />
                      <div className="flex justify-end">
                        <span className="text-xs text-muted-foreground/60 font-mono">0 / 500 characters</span>
                      </div>
                    </div>
                  </motion.div>
                )}

                {currentStep === 2 && (
                  <motion.div
                    key="step-2"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-8"
                  >
                    <div className="space-y-4">
                      <Label className="text-lg font-bold">Select Category</Label>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {categories.map((cat) => (
                          <div 
                            key={cat}
                            onClick={() => setFormData({ ...formData, category: cat })}
                            className={`p-6 rounded-2xl border transition-all flex flex-col items-center gap-3 group cursor-pointer ${
                              formData.category === cat 
                                ? "bg-blue-600/20 border-blue-500 shadow-[0_0_20px_rgba(37,99,235,0.15)]" 
                                : "bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20 shadow-lg"
                            }`}
                          >
                            <div className="w-12 h-12 rounded-xl bg-white/[0.05] flex items-center justify-center group-hover:scale-110 transition-transform">
                              <Grid className="w-6 h-6 text-muted-foreground group-hover:text-blue-500" />
                            </div>
                            <span className="text-sm font-bold tracking-wide uppercase">{cat}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div className="p-6 rounded-2xl bg-yellow-500/5 border border-yellow-500/10 flex items-start gap-4">
                      <AlertTriangle className="w-6 h-6 text-yellow-500 shrink-0" />
                      <p className="text-sm text-yellow-500/80 leading-relaxed font-medium">
                        Selecting the correct category helps in faster routing. AI will verify this selection based on your description.
                      </p>
                    </div>
                  </motion.div>
                )}

                {currentStep === 3 && (
                  <motion.div
                    key="step-3"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-8"
                  >
                    <div className="grid md:grid-cols-2 gap-8">
                      <div className="space-y-4">
                        <Label className="text-lg font-bold">Upload Photos</Label>
                        <div className="aspect-square rounded-3xl border-2 border-dashed border-white/10 flex flex-col items-center justify-center gap-4 hover:border-blue-500/50 transition-colors group cursor-pointer">
                          <div className="w-16 h-16 rounded-full bg-white/[0.05] flex items-center justify-center group-hover:scale-110 transition-all">
                            <Camera className="w-8 h-8 text-muted-foreground group-hover:text-blue-500" />
                          </div>
                          <div className="text-center">
                            <p className="font-bold">Add Photo</p>
                            <p className="text-xs text-muted-foreground mt-1">PNG, JPG up to 10MB</p>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <Label className="text-lg font-bold">Voice Report</Label>
                        <div className="aspect-square rounded-3xl border border-white/10 bg-white/[0.02] flex flex-col items-center justify-center gap-6 p-8">
                          <button
                            type="button"
                            onClick={() => setIsRecording(!isRecording)}
                            className={`w-24 h-24 rounded-full flex items-center justify-center transition-all duration-500 relative ${
                              isRecording 
                                ? "bg-red-500 shadow-[0_0_30px_rgba(239,68,68,0.4)]" 
                                : "bg-blue-600 shadow-[0_0_30px_rgba(37,99,235,0.3)]"
                            }`}
                          >
                            {isRecording && (
                              <motion.div 
                                className="absolute inset-0 rounded-full border-4 border-red-500"
                                animate={{ scale: [1, 1.5], opacity: [0.5, 0] }}
                                transition={{ repeat: Infinity, duration: 1.5 }}
                              />
                            )}
                            <Mic className="w-10 h-10 text-white" />
                          </button>
                          <div className="text-center">
                            <p className="font-bold">{isRecording ? "Recording..." : "Hold to Record"}</p>
                            <p className="text-xs text-muted-foreground mt-1">Multi-language AI transcription</p>
                          </div>
                          
                          {isRecording && (
                            <div className="w-full h-8 flex items-end justify-center gap-1">
                              {[...Array(12)].map((_, i) => (
                                <motion.div
                                  key={i}
                                  className="w-1 bg-red-500 rounded-full"
                                  animate={{ height: ["20%", "80%", "30%"] }}
                                  transition={{ repeat: Infinity, duration: 0.5 + Math.random(), delay: i * 0.05 }}
                                />
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Navigation Buttons */}
              <div className="mt-12 flex items-center justify-between pt-8 border-t border-white/5">
                <Button
                  type="button"
                  onClick={prevStep}
                  disabled={currentStep === 0 || isSubmitting}
                  variant="ghost"
                  className="h-14 px-8 text-base text-muted-foreground hover:text-foreground"
                >
                  <ChevronLeft className="mr-2 h-5 w-5" />
                  Back
                </Button>

                {currentStep < steps.length - 1 ? (
                  <Button
                    type="button"
                    onClick={nextStep}
                    className="cta-button-primary h-14 px-12 text-base"
                  >
                    Continue
                    <ChevronRight className="ml-2 h-5 w-5" />
                  </Button>
                ) : (
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="cta-button-primary h-14 px-12 text-base bg-blue-600 hover:bg-blue-500"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      <>
                        Submit Report
                        <Send className="ml-2 h-5 w-5" />
                      </>
                    )}
                  </Button>
                )}
              </div>
            </form>
          </div>
        </div>
      </main>

      
    </div>
  );
};

export default SubmitPage;
