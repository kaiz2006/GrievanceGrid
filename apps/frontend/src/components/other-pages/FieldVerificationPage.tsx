import { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  Camera,
  MapPin,
  CheckCircle2,
  AlertCircle,
  ArrowLeft,
  Upload,
  X,
  Send,
  Loader2,
  ShieldCheck,
  Crosshair,
  FileText,
  Clock
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { grievanceService } from "@/services/grievance.service";

const FieldVerificationPage = () => {
  const { grievanceId } = useParams();
  const navigate = useNavigate();
  const [grievance, setGrievance] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [afterPhoto, setAfterPhoto] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [locationError, setLocationError] = useState<string>("");
  const [notes, setNotes] = useState("");
  const [verified, setVerified] = useState(false);
  const [verificationResult, setVerificationResult] = useState<any>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!grievanceId) return;
      setLoading(true);
      const result = await grievanceService.getDetail(grievanceId);
      setGrievance(result);
      setLoading(false);
    };
    fetchData();

    // Get current location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude });
          setLocationError("");
        },
        (err) => {
          setLocationError("Location access required for verification. Please enable GPS.");
        },
        { enableHighAccuracy: true }
      );
    } else {
      setLocationError("Geolocation not supported by your browser.");
    }
  }, [grievanceId]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setAfterPhoto(file);
      const reader = new FileReader();
      reader.onloadend = () => setPhotoPreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async () => {
    if (!grievanceId || !afterPhoto || !location) return;

    setSubmitting(true);
    try {
      const result = await grievanceService.submitVerification(
        grievanceId,
        afterPhoto,
        { latitude: location.lat, longitude: location.lng },
        notes
      );
      setVerificationResult(result);
      setVerified(true);
    } catch (error) {
      console.error("Verification failed:", error);
    }
    setSubmitting(false);
  };

  const calculateDistance = () => {
    if (!location || !grievance?.location) return null;
    
    // Simple Haversine distance calculation
    const R = 6371e3; // Earth's radius in meters
    const φ1 = location.lat * Math.PI / 180;
    const φ2 = grievance.location.latitude * Math.PI / 180;
    const Δφ = (grievance.location.latitude - location.lat) * Math.PI / 180;
    const Δλ = (grievance.location.longitude - location.lng) * Math.PI / 180;

    const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
              Math.cos(φ1) * Math.cos(φ2) *
              Math.sin(Δλ/2) * Math.sin(Δλ/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    const distance = R * c;

    return Math.round(distance);
  };

  const distance = calculateDistance();
  const isWithinRange = distance !== null && distance <= 50;

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-muted-foreground font-mono uppercase tracking-widest text-xs">Loading...</p>
        </div>
      </div>
    );
  }

  if (verified && verificationResult) {
    return (
      <div className="min-h-screen bg-background text-foreground flex flex-col">
        <main className="flex-grow pt-8 lg:pt-32 pb-12 px-6">
          <div className="container mx-auto max-w-2xl">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="text-center py-16"
            >
              <div className={`w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 ${
                verificationResult.is_valid ? "bg-green-500/10" : "bg-red-500/10"
              }`}>
                {verificationResult.is_valid ? (
                  <CheckCircle2 className="w-12 h-12 text-green-500" />
                ) : (
                  <AlertCircle className="w-12 h-12 text-red-500" />
                )}
              </div>
              <h1 className="text-3xl font-bold mb-4">
                {verificationResult.is_valid ? "Verification Successful!" : "Verification Failed"}
              </h1>
              <p className="text-muted-foreground mb-6">{verificationResult.message}</p>
              
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 mb-8">
                <p className="text-xs text-muted-foreground uppercase tracking-widest mb-1">Distance from Incident</p>
                <p className="font-mono text-lg">{verificationResult.distance_from_incident}</p>
              </div>

              <div className="flex gap-4 justify-center">
                <Button asChild>
                  <Link to="/admin/dashboard">Back to Dashboard</Link>
                </Button>
                <Button variant="outline" asChild>
                  <Link to="/admin/dispatch">View Dispatch</Link>
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
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-green-500/5 rounded-full blur-[150px] pointer-events-none" />

        <div className="container mx-auto max-w-4xl">
          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <Button variant="ghost" size="icon" className="h-10 w-10" asChild>
              <Link to="/admin/dispatch">
                <ArrowLeft className="w-5 h-5" />
              </Link>
            </Button>
            <div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-green-500" />
                <h1 className="text-3xl font-bold tracking-tight">Field Verification</h1>
              </div>
              <p className="text-muted-foreground">Two-factor verification with geo-tagged photo</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left: Grievance Info */}
            <div className="space-y-6">
              <Card className="glass-card border-white/5 bg-white/[0.02]">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <FileText className="w-5 h-5 text-blue-500" />
                    Grievance Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="font-mono text-sm text-blue-500">{grievance?.grid_id}</span>
                    <Badge className="bg-blue-500/10 text-blue-500 border-blue-500/20">
                      <Clock className="w-3 h-3 mr-1" />
                      {grievance?.status}
                    </Badge>
                  </div>
                  <h3 className="text-lg font-bold">{grievance?.title}</h3>
                  <p className="text-sm text-muted-foreground">{grievance?.description}</p>
                  
                  <div className="p-4 rounded-2xl bg-amber-500/5 border border-amber-500/10">
                    <p className="text-xs text-amber-500 uppercase tracking-widest mb-2 flex items-center gap-2">
                      <MapPin className="w-3 h-3" />
                      Original Location
                    </p>
                    <p className="text-sm">{grievance?.location?.address || "Sector 14 Flyover"}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Lat: {grievance?.location?.latitude?.toFixed(4)}, 
                      Lng: {grievance?.location?.longitude?.toFixed(4)}
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Location Status */}
              <Card className={`glass-card border-white/5 ${locationError ? "bg-red-500/5 border-red-500/20" : "bg-white/[0.02]"}`}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <Crosshair className={`w-5 h-5 ${locationError ? "text-red-500" : "text-green-500"}`} />
                    Current Location
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {locationError ? (
                    <div className="flex items-start gap-3 text-red-500">
                      <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                      <p className="text-sm">{locationError}</p>
                    </div>
                  ) : location ? (
                    <div className="space-y-2">
                      <p className="text-sm">
                        <span className="text-muted-foreground">Latitude:</span> {location.lat.toFixed(6)}
                      </p>
                      <p className="text-sm">
                        <span className="text-muted-foreground">Longitude:</span> {location.lng.toFixed(6)}
                      </p>
                      {distance !== null && (
                        <div className={`mt-4 p-3 rounded-xl ${isWithinRange ? "bg-green-500/10" : "bg-amber-500/10"}`}>
                          <p className="text-sm">
                            Distance from incident: <span className="font-bold">{distance}m</span>
                          </p>
                          {!isWithinRange && (
                            <p className="text-xs text-amber-500 mt-1">
                              ⚠️ You are {distance - 50}m outside the 50m verification radius
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">Acquiring location...</p>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Right: Verification Form */}
            <div>
              <Card className="glass-card border-white/5 bg-white/[0.02]">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <Camera className="w-5 h-5 text-purple-500" />
                    Submit Verification
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Photo Upload */}
                  <div>
                    <label className="text-sm font-medium mb-3 block">After Photo *</label>
                    <input
                      type="file"
                      ref={fileInputRef}
                      accept="image/*"
                      capture="environment"
                      onChange={handleFileSelect}
                      className="hidden"
                    />
                    
                    {photoPreview ? (
                      <div className="relative rounded-2xl overflow-hidden">
                        <img src={photoPreview} alt="Preview" className="w-full h-64 object-cover" />
                        <button
                          onClick={() => { setAfterPhoto(null); setPhotoPreview(null); }}
                          className="absolute top-2 right-2 w-8 h-8 rounded-full bg-red-500/80 flex items-center justify-center hover:bg-red-500 transition-colors"
                        >
                          <X className="w-4 h-4 text-white" />
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => fileInputRef.current?.click()}
                        className="w-full h-64 rounded-2xl border-2 border-dashed border-white/10 hover:border-white/20 transition-colors flex flex-col items-center justify-center gap-4"
                      >
                        <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center">
                          <Camera className="w-8 h-8 text-muted-foreground" />
                        </div>
                        <div className="text-center">
                          <p className="text-sm font-medium">Take or Upload Photo</p>
                          <p className="text-xs text-muted-foreground mt-1">Capture the resolved issue</p>
                        </div>
                      </button>
                    )}
                  </div>

                  {/* Notes */}
                  <div>
                    <label className="text-sm font-medium mb-2 block flex items-center gap-2">
                      <FileText className="w-4 h-4 text-muted-foreground" />
                      Resolution Notes
                    </label>
                    <Textarea
                      placeholder="Describe what was done to resolve the issue..."
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      className="bg-white/5 border-white/10 min-h-[100px] resize-none"
                    />
                  </div>

                  {/* Submit Button */}
                  <Button
                    className="w-full h-14 bg-green-600 hover:bg-green-500"
                    disabled={!afterPhoto || !location || submitting || !isWithinRange}
                    onClick={handleSubmit}
                  >
                    {submitting ? (
                      <>
                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                        Verifying...
                      </>
                    ) : (
                      <>
                        <Send className="w-5 h-5 mr-2" />
                        Submit Verification
                      </>
                    )}
                  </Button>

                  {!afterPhoto && (
                    <p className="text-xs text-amber-500 text-center flex items-center justify-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      Please capture an after photo
                    </p>
                  )}
                  
                  {!isWithinRange && distance !== null && (
                    <p className="text-xs text-red-500 text-center flex items-center justify-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      Must be within 50m of incident location
                    </p>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default FieldVerificationPage;
