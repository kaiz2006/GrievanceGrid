import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useParams, Link } from "react-router-dom";
import { 
  MapPin, 
  User, 
  Clock, 
  ShieldCheck, 
  CheckCircle2, 
  Navigation,
  ChevronLeft,
  ChevronRight,
  Camera,
  Loader2,
  Map as MapIcon
} from "lucide-react";
import { Label } from "@/components/ui/label";
import { grievanceService } from "@/services/grievance.service";
import MapComponent from "../map/MapComponent";
import { calculateDistance } from "@/utils/geo.utils";
import { toast } from "sonner";

const GrievanceDetailPage = () => {
  const { id } = useParams();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [currentPhoto, setCurrentPhoto] = useState(0);
  const [gpsVerifying, setGpsVerifying] = useState(false);
  const [gpsVerified, setGpsVerified] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      if (id) {
        try {
          const result = await grievanceService.getDetail(id);
          setData(result);
        } catch (error) {
          console.error("Failed to fetch grievance details", error);
        } finally {
          setLoading(false);
        }
      }
    };
    fetchData();
  }, [id]);

  const handleCapturePhoto = () => {
    setGpsVerifying(true);
    toast.info("Verifying device coordinates...");
    
    setTimeout(() => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const distance = calculateDistance(
              position.coords.latitude,
              position.coords.longitude,
              data.location.latitude,
              data.location.longitude
            );
            
            console.log(`[GPS CHECK] Distance from site: ${distance.toFixed(2)}m`);
            
            if (distance <= 150) { // 150m radius for demo
              setGpsVerified(true);
              toast.success("GPS Verified: You are at the resolution site.");
            } else {
              toast.error(`Verification Failed: You are ${distance.toFixed(0)}m away from the site.`);
            }
            setGpsVerifying(false);
          },
          (error) => {
            console.error(error);
            setGpsVerified(true); 
            toast.warning("GPS blocked. Bypassing for demo purposes.");
            setGpsVerifying(false);
          }
        );
      } else {
        toast.error("Geolocation is not supported by this browser.");
        setGpsVerifying(false);
      }
    }, 1500);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-muted-foreground font-mono uppercase tracking-widest text-xs">Accessing Investigation Node...</p>
        </div>
      </div>
    );
  }

  if (!data) return <div>Grievance not found.</div>;

  const mockGrievance = {
    id: data.grid_id,
    reporter: { name: "John Doe", rating: "4.8", reports: 12 },
    location: { address: data.location.address, coords: `${data.location.latitude}, ${data.location.longitude}` },
    details: {
      category: data.category,
      subCategory: "Pothole Repair",
      submittedAt: "Mar 19, 2024 • 02:45 PM",
      description: data.description,
      status: data.status,
      slaRemaining: "02:14:45",
    },
    evidence: [
      "https://images.unsplash.com/photo-1515162816999-a0ca1fa02d4b?q=80&w=2070",
      "https://images.unsplash.com/photo-1599423300746-b62533397364?q=80&w=2070"
    ]
  };

  return (
    <div className="min-h-screen bg-background text-white flex flex-col">
      <main className="flex-grow pt-8 lg:pt-32 pb-12 px-6 relative overflow-hidden">
        <div className="container mx-auto">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-12">
            <div className="flex items-center gap-6">
              <Link to="/admin/dashboard" className="p-4 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
                <ChevronLeft className="w-5 h-5 text-muted-foreground" />
              </Link>
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-xs font-black text-blue-500 uppercase tracking-[0.2em]">{id || mockGrievance.id}</span>
                  <span className="px-2 py-0.5 rounded bg-blue-600/20 text-blue-400 text-[10px] font-bold uppercase border border-blue-600/30">
                    High Priority
                  </span>
                </div>
                <h1 className="text-4xl font-bold tracking-tight">Grievance Investigation</h1>
              </div>
            </div>

            <div className="flex gap-4">
              <button className="px-8 py-4 rounded-2xl bg-white/5 border border-white/10 text-sm font-bold uppercase tracking-widest hover:bg-white/10 transition-colors">
                Transfer Case
              </button>
              <button className="px-8 py-4 rounded-2xl bg-blue-600 text-white shadow-[0_0_30px_rgba(37,99,235,0.4)] text-sm font-bold uppercase tracking-widest hover:scale-105 active:scale-95 transition-all">
                Assign to Team
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Left Column: Evidence & Map */}
            <div className="lg:col-span-2 space-y-8">
              {/* Evidence Carousel */}
              <div className="relative aspect-[16/10] rounded-[3rem] overflow-hidden bg-white/5 border border-white/5 group">
                <AnimatePresence mode="wait">
                  <motion.img 
                    key={currentPhoto}
                    src={mockGrievance.evidence[currentPhoto]} 
                    className="w-full h-full object-cover"
                    initial={{ opacity: 0, scale: 1.1 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.7 }}
                  />
                </AnimatePresence>
                
                {/* Carousel Controls */}
                <div className="absolute inset-x-0 bottom-0 p-8 flex justify-between items-center bg-gradient-to-t from-black/80 to-transparent">
                  <span className="text-xs font-bold text-white uppercase tracking-widest">
                    Evidence Image 0{currentPhoto + 1} / 0{mockGrievance.evidence.length}
                  </span>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => setCurrentPhoto(prev => (prev > 0 ? prev - 1 : mockGrievance.evidence.length - 1))}
                      className="p-3 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/20 transition-colors"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => setCurrentPhoto(prev => (prev < mockGrievance.evidence.length - 1 ? prev + 1 : 0))}
                      className="p-3 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/20 transition-colors"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Location & Map */}
              <div className="p-8 rounded-[2.5rem] bg-card border border-border flex flex-col md:flex-row gap-8 items-center shadow-2xl">
                <div className="flex-1 w-full">
                  <div className="flex items-center gap-3 mb-4">
                    <MapPin className="w-5 h-5 text-blue-500" />
                    <h3 className="text-xl font-bold">Scene Location</h3>
                  </div>
                  <p className="text-muted-foreground mb-1 font-medium">{mockGrievance.location.address}</p>
                  <p className="text-xs font-bold text-blue-500 tracking-widest uppercase mb-6">{mockGrievance.location.coords}</p>
                  <button className="flex items-center gap-3 px-6 py-3 bg-white/5 border border-white/10 rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-white/10 transition-colors">
                    <Navigation className="w-4 h-4 text-blue-500" />
                    Open GPS Navigation
                  </button>
                </div>
                <div className="w-full md:w-64 aspect-square rounded-[2rem] bg-black border border-white/10 overflow-hidden relative group">
                   <MapComponent 
                      center={[data.location.latitude, data.location.longitude]} 
                      zoom={16}
                      markers={[{ position: [data.location.latitude, data.location.longitude], popupContent: "Grievance Site" }]}
                      className="w-full h-full"
                   />
                </div>
              </div>
            </div>

            {/* Right Column: Info & Action */}
            <div className="space-y-8">
              {/* Reporter Info */}
              <div className="p-8 rounded-[2.5rem] bg-card border border-border shadow-lg">
                <div className="flex items-center gap-3 mb-6">
                  <User className="w-5 h-5 text-blue-500" />
                  <h3 className="text-xl font-bold">Reporter Profile</h3>
                </div>
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 rounded-full bg-blue-600/20 border border-blue-600/20 flex items-center justify-center font-bold text-blue-500">
                    JD
                  </div>
                  <div>
                    <p className="font-bold">{mockGrievance.reporter.name}</p>
                    <p className="text-[10px] uppercase font-bold text-muted-foreground/60 tracking-widest">Verified Resident</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div className="p-3 rounded-2xl bg-white/5 border border-white/5">
                    <p className="text-[10px] font-bold text-muted-foreground uppercase mb-1">Reputation</p>
                    <p className="font-black text-blue-500 tracking-tighter">{mockGrievance.reporter.rating} ★</p>
                  </div>
                  <div className="p-3 rounded-2xl bg-white/5 border border-white/5">
                    <p className="text-[10px] font-bold text-muted-foreground uppercase mb-1">Reports</p>
                    <p className="font-black text-blue-500 tracking-tighter">{mockGrievance.reporter.reports}</p>
                  </div>
                </div>
              </div>

              {/* Resolution Hub */}
              <div className="p-8 rounded-[2.5rem] bg-card border border-border shadow-[0_20px_60px_rgba(0,0,0,0.5)] border-blue-500/10">
                <div className="flex items-center gap-3 mb-8">
                  <ShieldCheck className="w-5 h-5 text-blue-500" />
                  <h3 className="text-xl font-bold">Officer Hub</h3>
                </div>
                
                <div className="space-y-6">
                  <div className="space-y-3">
                    <Label className="text-[10px] font-black uppercase text-muted-foreground/60 tracking-[0.2em] ml-1">Resolution Status</Label>
                    <div className="p-4 rounded-2xl bg-blue-600 text-white font-bold flex items-center gap-3">
                      <Clock className="w-5 h-5" />
                      <span>SLA: {mockGrievance.details.slaRemaining}</span>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <Label className="text-[10px] font-black uppercase text-muted-foreground/60 tracking-[0.2em] ml-1">Investigation Notes</Label>
                    <textarea 
                      placeholder="Add investigation details, required materials, or team notes..." 
                      className="w-full h-32 bg-white/5 border border-white/10 rounded-2xl p-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all font-medium resize-none"
                    />
                  </div>

                  <div className="flex flex-col gap-3">
                    <button 
                      onClick={handleCapturePhoto}
                      disabled={gpsVerifying || gpsVerified}
                      className={`w-full flex items-center justify-center gap-3 px-6 py-4 border rounded-2xl text-xs font-bold uppercase tracking-widest transition-all ${
                        gpsVerified 
                          ? "bg-green-600/20 border-green-500 text-green-500" 
                          : "bg-white/5 border-white/10 hover:bg-white/10 text-white"
                      }`}
                    >
                      {gpsVerifying ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin text-white" />
                          Verifying GPS...
                        </>
                      ) : gpsVerified ? (
                        <>
                          <CheckCircle2 className="w-4 h-4 text-green-500" />
                          Photo Captured (GPS Valid)
                        </>
                      ) : (
                        <>
                          <Camera className="w-4 h-4 text-blue-500" />
                          Capture After-Resolution Photo
                        </>
                      )}
                    </button>
                    <button 
                      disabled={!gpsVerified}
                      className={`w-full py-4 rounded-2xl text-xs font-bold uppercase tracking-widest transition-all ${
                        gpsVerified 
                          ? "bg-blue-600 text-white hover:scale-105" 
                          : "bg-white/[0.05] border border-white/5 text-muted-foreground/40"
                      }`}
                    >
                      Confirm Resolution
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default GrievanceDetailPage;
