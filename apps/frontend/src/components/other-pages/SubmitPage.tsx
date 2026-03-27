import { useState, useRef } from "react";
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
import { mediaService } from "@/services/media.service";
import MapComponent from "../map/MapComponent";
import GrievanceSLA from "@/components/GrievanceSLA";


const steps = [
  { id: "location", title: "Location", icon: MapPin },
  { id: "details", title: "Description", icon: Type },
  { id: "category", title: "Category", icon: Grid },
  { id: "media", title: "Media", icon: Camera }
];

const categories = [
  { value: "ROADS", label: "Roads & Pavement" },
  { value: "WATER_SUPPLY", label: "Water Supply" },
  { value: "SANITATION", label: "Sanitation & Waste" },
  { value: "ELECTRICITY", label: "Electricity & Power" },
  { value: "PUBLIC_TRANSPORT", label: "Public Transport" },
  { value: "ENVIRONMENT", label: "Environment" },
  { value: "INFRASTRUCTURE", label: "Infrastructure" },
  { value: "BUILDING_VIOLATION", label: "Building Violation" },
  { value: "OTHER", label: "Other" }
];


const SubmitPage = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    location: { latitude: 28.6139, longitude: 77.2090, address: "" }
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isLocating, setIsLocating] = useState(false);
  const [locationType, setLocationType] = useState("current");
  const [locationError, setLocationError] = useState<string | null>(null);
  const [submittedData, setSubmittedData] = useState<any>(null);
  const [locationSelected, setLocationSelected] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [audioURL, setAudioURL] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      setLocationError("Geolocation is not supported by your browser.");
      return;
    }

    setIsLocating(true);
    setLocationError(null);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setFormData(prev => ({
          ...prev,
          location: { 
            ...prev.location, 
            latitude, 
            longitude, 
            address: `Current Location: ${latitude.toFixed(4)}, ${longitude.toFixed(4)}` 
          }
        }));
        setLocationSelected(true);
        setIsLocating(false);
      },
      (error) => {
        setIsLocating(false);
        switch (error.code) {
          case error.PERMISSION_DENIED:
            setLocationError("Location access denied. Please enable GPS and allow permissions.");
            break;
          case error.POSITION_UNAVAILABLE:
            setLocationError("Location information is unavailable.");
            break;
          case error.TIMEOUT:
            setLocationError("Request to get user location timed out.");
            break;
          default:
            setLocationError("An unknown error occurred.");
            break;
        }
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  const handleMapClick = (lat: number, lng: number) => {
    setFormData(prev => ({
      ...prev,
      location: { ...prev.location, latitude: lat, longitude: lng, address: `Selected: ${lat.toFixed(4)}, ${lng.toFixed(4)}` }
    }));
    setLocationSelected(true);
  };

  const isStepValid = () => {
    switch (currentStep) {
      case 0:
        return locationSelected;
      case 1:
        return formData.title.trim().length > 3 && formData.description.trim().length > 10;
      case 2:
        return formData.category !== "";
      case 3:
        return true; // Media is now optional for demo
      default:
        return false;
    }
  };

  const nextStep = () => {
    if (isStepValid()) {
      setCurrentStep(prev => Math.min(prev + 1, steps.length - 1));
    }
  };

  const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 0));

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const toggleRecording = () => {
    if (!isRecording) {
      setIsRecording(true);
      // Simulate recording
      setTimeout(() => {
        setIsRecording(false);
        setAudioURL("mock-audio-url");
      }, 3000);
    } else {
      setIsRecording(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isStepValid()) return;
    setIsSubmitting(true);
    
    try {
      let photoUrl = "";
      if (selectedFile) {
        const uploadRes = await mediaService.upload(selectedFile);
        photoUrl = uploadRes.url;
      }
      
      const payload = {
        title: formData.title,
        description: formData.description,
        category: formData.category,
        latitude: formData.location.latitude,
        longitude: formData.location.longitude,
        location_address: formData.location.address,
        before_photo_url: photoUrl
      };
      const response = await grievanceService.submit(payload);
      console.log("[SUBMIT SUCCESS]", response);
      
      // Auto-trigger simulation for the lifecycle
      try {
        await grievanceService.simulate(response.grid_id);
      } catch (simError) {
        console.warn("Auto-simulation trigger failed, but grievance was submitted:", simError);
      }
      
      setSubmittedData(response);


    } catch (error) {
      console.error("[SUBMIT ERROR]", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submittedData) {
    return (
      <div className="min-h-screen bg-background text-foreground flex flex-col items-center justify-center p-6">
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="glass-card max-w-xl w-full p-12 text-center border-white/5 bg-white/[0.01] space-y-8"
        >
          <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto shadow-[0_0_30px_rgba(34,197,94,0.3)]">
            <Check className="w-10 h-10 text-white" />
          </div>
          <div>
            <h2 className="text-3xl font-bold mb-3">Grievance Submitted Successfully</h2>
            <p className="text-muted-foreground">Your report has been logged in the City Command Center. Incident ID: <span className="text-blue-500 font-mono font-bold">{submittedData.grid_id}</span></p>
          </div>
          
          <div className="p-6 rounded-2xl bg-white/5 border border-white/10 text-left space-y-4">
            <div className="flex justify-between items-center text-sm">
              <span className="text-muted-foreground">Status</span>
              <Badge className="bg-blue-600/20 text-blue-500 border-blue-500/20">Initial Intake</Badge>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-muted-foreground">Priority</span>
              <Badge className="bg-amber-600/20 text-amber-500 border-amber-500/20">Awaiting AI Audit</Badge>
            </div>
          </div>

          <GrievanceSLA createdAt={submittedData.created_at || new Date().toISOString()} />

          <div className="flex flex-col gap-4">
            <Button 
              className="cta-button-primary h-14 w-full text-base bg-blue-600 hover:bg-blue-500"
              onClick={() => window.location.href = `/track/${submittedData.grid_id}`}
            >
              Track Status Now
              <ChevronRight className="ml-2 h-5 w-5" />
            </Button>
            <Button 
              variant="ghost" 
              className="h-14 w-full text-muted-foreground hover:text-foreground"
              onClick={() => window.location.href = '/'}
            >
              Back to Home
            </Button>
          </div>
        </motion.div>
      </div>
    );
  }

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
                      <Tabs defaultValue="current" className="w-full" onValueChange={(val) => {
                        setLocationType(val);
                        if (val === "current") handleGetLocation();
                      }}>
                        <TabsList className="grid grid-cols-2 bg-white/5 border border-white/10 h-14 p-1 rounded-2xl">
                          <TabsTrigger value="current" className="rounded-xl data-[state=active]:bg-blue-600 data-[state=active]:text-white data-[state=inactive]:bg-white/5 data-[state=inactive]:hover:bg-white/10 h-full transition-all">
                            Current Location
                          </TabsTrigger>
                          <TabsTrigger value="map" className="rounded-xl data-[state=active]:bg-blue-600 data-[state=active]:text-white data-[state=inactive]:bg-white/5 data-[state=inactive]:hover:bg-white/10 h-10 sm:h-full transition-all text-xs">
                            Choose on Map
                          </TabsTrigger>
                        </TabsList>
                      </Tabs>
                    </div>

                    <div className="rounded-3xl border border-white/10 overflow-hidden relative group shadow-2xl">
                      {isLocating && (
                        <div className="absolute inset-0 bg-black/40 backdrop-blur-sm z-[1001] flex flex-col items-center justify-center gap-4">
                          <Loader2 className="w-10 h-10 text-blue-500 animate-spin" />
                          <p className="text-white font-bold animate-pulse">Fetching GPS Location...</p>
                        </div>
                      )}
                      <MapComponent 
                        center={[formData.location.latitude, formData.location.longitude]} 
                        zoom={15}
                        markers={locationSelected ? [{ 
                          position: [formData.location.latitude, formData.location.longitude],
                          popupContent: "Grievance Location"
                        }] : []}
                        onMapClick={handleMapClick}
                        className="w-full h-[400px]"
                      />
                      <div className="absolute bottom-4 left-4 z-[1000] bg-black/60 backdrop-blur-md px-4 py-2 rounded-full border border-white/10">
                        <p className="text-xs font-mono text-blue-400">
                          {locationSelected ? `LAT: ${formData.location.latitude.toFixed(6)} | LNG: ${formData.location.longitude.toFixed(6)}` : "Please click on the map or use GPS to set location"}
                        </p>
                      </div>
                      {locationType === "current" && (
                        <button
                          type="button"
                          onClick={handleGetLocation}
                          className="absolute top-4 right-4 z-[1000] bg-blue-600 hover:bg-blue-500 text-white p-3 rounded-full shadow-lg border border-blue-400/30 group transition-all"
                        >
                          <MapPin className={`w-5 h-5 ${isLocating ? 'animate-bounce' : ''}`} />
                          <span className="absolute right-full mr-3 top-1/2 -translate-y-1/2 bg-black/80 backdrop-blur-md px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-widest whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                            Refresh GPS
                          </span>
                        </button>
                      )}
                    </div>
                    {locationError && (
                      <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-start gap-3">
                        <AlertTriangle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                        <p className="text-sm text-red-500 font-medium">{locationError}</p>
                      </div>
                    )}
                    {!locationSelected && !isLocating && (
                      <p className="text-xs text-red-500 font-medium">Please mark the location on the map or fetch GPS to continue.</p>
                    )}
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
                      <Label htmlFor="title" className="text-lg font-bold">Issue Title (Required)</Label>
                      <Input 
                        id="title" 
                        required
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        placeholder="e.g., Broken water pipe near main gate" 
                        className="h-14 bg-white/5 border-white/10 focus:border-blue-500/50"
                      />
                      {formData.title.length > 0 && formData.title.length <= 3 && (
                        <p className="text-[10px] text-red-500">Title must be at least 4 characters.</p>
                      )}
                    </div>
                    <div className="space-y-4">
                      <Label htmlFor="description" className="text-lg font-bold">Detailed Description (Required)</Label>
                      <Textarea 
                        id="description" 
                        required
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        placeholder="Please provide as much detail as possible to help us resolve the issue faster..." 
                        className="min-h-[200px] bg-white/5 border-white/10 focus:border-blue-500/50 resize-none"
                      />
                      <div className="flex justify-between items-center mt-1">
                        {formData.description.length > 0 && formData.description.length <= 10 ? (
                          <p className="text-[10px] text-red-500">Description must be at least 11 characters.</p>
                        ) : <div />}
                        <span className="text-xs text-muted-foreground/60 font-mono">{formData.description.length} / 500 characters</span>
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
                      <Label className="text-lg font-bold">Select Category (Required)</Label>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {categories.map((cat) => (
                          <div 
                            key={cat.value}
                            onClick={() => setFormData({ ...formData, category: cat.value })}
                            className={`p-6 rounded-2xl border transition-all flex flex-col items-center gap-3 group cursor-pointer ${
                              formData.category === cat.value 
                                ? "bg-blue-600/20 border-blue-500 shadow-[0_0_20px_rgba(37,99,235,0.15)]" 
                                : "bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20 shadow-lg"
                            }`}
                          >
                            <div className="w-12 h-12 rounded-xl bg-white/[0.05] flex items-center justify-center group-hover:scale-110 transition-transform">
                              <Grid className="w-6 h-6 text-muted-foreground group-hover:text-blue-500" />
                            </div>
                            <span className="text-sm font-bold tracking-wide uppercase">{cat.label}</span>
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
                        <input 
                          type="file" 
                          className="hidden" 
                          ref={fileInputRef} 
                          onChange={handleFileChange}
                          accept="image/*"
                        />
                        <div 
                          onClick={() => fileInputRef.current?.click()}
                          className="aspect-square rounded-3xl border-2 border-dashed border-white/10 flex flex-col items-center justify-center gap-4 hover:border-blue-500/50 transition-colors group cursor-pointer overflow-hidden relative"
                        >
                          {selectedFile ? (
                            <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/40 backdrop-blur-sm z-10 transition-opacity opacity-0 hover:opacity-100">
                               <p className="text-white font-bold">Change Photo</p>
                            </div>
                          ) : null}
                          
                          {selectedFile ? (
                              <img 
                                src={URL.createObjectURL(selectedFile)} 
                                alt="Preview" 
                                className="absolute inset-0 w-full h-full object-cover"
                              />
                          ) : (
                            <>
                              <div className="w-16 h-16 rounded-full bg-white/[0.05] flex items-center justify-center group-hover:scale-110 transition-all">
                                <Camera className="w-8 h-8 text-muted-foreground group-hover:text-blue-500" />
                              </div>
                              <div className="text-center">
                                <p className="font-bold">Add Photo</p>
                                <p className="text-xs text-muted-foreground mt-1">PNG, JPG up to 10MB</p>
                              </div>
                            </>
                          )}
                        </div>
                        {selectedFile && (
                          <div className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/10">
                            <span className="text-xs font-mono truncate max-w-[150px]">{selectedFile.name}</span>
                            <button type="button" onClick={() => setSelectedFile(null)} className="p-1 hover:text-red-500 transition-colors">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        )}
                      </div>

                      <div className="space-y-4">
                        <Label className="text-lg font-bold">Voice Report</Label>
                        <div className="aspect-square rounded-3xl border border-white/10 bg-white/[0.02] flex flex-col items-center justify-center gap-6 p-8">
                          <button
                            type="button"
                            onClick={toggleRecording}
                            className={`w-24 h-24 rounded-full flex items-center justify-center transition-all duration-500 relative ${
                              isRecording 
                                ? "bg-red-500 shadow-[0_0_30px_rgba(239,68,68,0.4)]" 
                                : audioURL 
                                  ? "bg-green-600 shadow-[0_0_30px_rgba(34,197,94,0.3)]"
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
                            {audioURL && !isRecording ? <Check className="w-10 h-10 text-white" /> : <Mic className="w-10 h-10 text-white" />}
                          </button>
                          <div className="text-center">
                            <p className="font-bold">
                              {isRecording ? "Recording..." : audioURL ? "Recording Saved" : "Tap to Record"}
                            </p>
                            <p className="text-xs text-muted-foreground mt-1">
                              {audioURL && !isRecording ? "Voice data successfully attached" : "Multi-language AI transcription"}
                            </p>
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

                          {audioURL && !isRecording && (
                            <button type="button" onClick={() => setAudioURL(null)} className="text-xs text-red-400 hover:text-red-300 font-bold uppercase tracking-wider">
                              Discard Voice Draft
                            </button>
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

                <div className="flex items-center gap-4">
                  {currentStep < steps.length - 1 ? (
                    <Button
                      key="continue-btn"
                      type="button"
                      onClick={nextStep}
                      disabled={!isStepValid()}
                      className={`h-14 px-12 text-base transition-all duration-300 ${
                        isStepValid() 
                          ? 'cta-button-primary bg-blue-600 hover:bg-blue-500 opacity-100 shadow-[0_0_20px_rgba(37,99,235,0.3)]' 
                          : 'bg-white/5 text-muted-foreground border border-white/10 opacity-50 cursor-not-allowed'
                      }`}
                    >
                      {currentStep === 0 && "Next: Details"}
                      {currentStep === 1 && "Next: Category"}
                      {currentStep === 2 && "Next: Media"}
                      <ChevronRight className="ml-2 h-5 w-5" />
                    </Button>
                  ) : (
                    <Button
                      key="submit-btn"
                      type="submit"
                      disabled={isSubmitting || !isStepValid()}
                      className="cta-button-primary h-14 px-12 text-base bg-blue-600 hover:bg-blue-500 shadow-[0_0_30px_rgba(37,99,235,0.4)] animate-in fade-in zoom-in duration-300"
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
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
};

export default SubmitPage;
