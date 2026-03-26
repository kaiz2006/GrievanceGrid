import { motion } from "framer-motion";
import { 
  Globe, 
  Activity, 
  LayoutDashboard, 
  ShieldAlert, 
  Terminal, 
  Cpu, 
  Users, 
  Zap, 
  TrendingUp, 
  TrendingDown, 
  MoveHorizontal,
  Layers,
  Filter,
  Camera,
  Search,
  AlertCircle,
  Bot,
  Sparkles
} from "lucide-react";
import { Link } from "react-router-dom";
import MapComponent from "../map/MapComponent";

const auditStream = [
  { module: "SYSTEM", msg: "Anomalous directive detected in Sector 7G. Initiating sentiment purge sequence.", time: "14:02:41", color: "text-blue-500" },
  { module: "AUDIT", msg: "Conflict resolution #4412 finalized. Efficiency +12.4% vs prev quarter.", time: "14:02:12", color: "text-blue-500" },
  { module: "ALERT", msg: "Protocol violation in Directive 88-Alpha. Human intervention bypassed.", time: "13:58:04", color: "text-red-500" },
  { module: "LOG", msg: "Institutional stability index remains steady at 98.4%. No threats.", time: "13:55:29", color: "text-white/40" },
];

const bentoScores = [
  { label: "NORTH AMER", value: "0.12", trend: TrendingDown, color: "text-blue-500" },
  { label: "EURO ZONE", value: "8.94", trend: TrendingUp, color: "text-red-500", highlight: true },
  { label: "APAC RIM", value: "3.41", trend: MoveHorizontal, color: "text-blue-500" },
  { label: "GLOBAL AGG", value: "1.04", trend: Activity, color: "text-white" },
];

const MissionControlPage = () => {
  return (
    <div className="h-screen w-full bg-background text-foreground overflow-hidden relative">
      {/* HUD Background Grid & Scanline */}
      <div className="absolute inset-0 z-0 opacity-10 pointer-events-none" 
        style={{ backgroundImage: "linear-gradient(rgba(37, 99, 235, 0.2) 1px, transparent 1px), linear-gradient(90deg, rgba(37, 99, 235, 0.2) 1px, transparent 1px)", backgroundSize: "40px 40px" }} 
      />
      <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-blue-500/20 to-transparent z-50 pointer-events-none animate-scanline" />

      {/* Main Layout */}
      <div className="absolute inset-0 flex flex-col pt-24 pb-6 px-6">
        
        {/* Full Screen Map Layer */}
        <div className="absolute inset-0 z-0 opacity-40 mix-blend-screen grayscale">
           <MapComponent 
              center={[20, 0]}
              zoom={2}
              className="w-full h-full"
           />
        </div>

        <div className="container mx-auto h-full flex flex-col relative z-10">
          
          {/* Header Bar */}
          <div className="flex justify-between items-center mb-8">
            <div className="space-y-1">
              <div className="flex items-center gap-3">
                <Globe className="w-5 h-5 text-blue-500 animate-pulse" />
                <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-blue-500/80">Global Strategic HUD</span>
              </div>
              <h1 className="text-3xl font-bold tracking-tighter uppercase">Mission Control Center</h1>
            </div>

            <div className="flex items-center gap-6">
               <div className="flex flex-col items-end opacity-60 font-mono text-[9px] tracking-widest text-blue-500">
                  <span>MISSION CLOCK: 14:03:00</span>
                  <span>LOCAL TERMINAL: US-EAST-01</span>
               </div>
               <div className="h-10 w-[1px] bg-white/5" />
               <div className="flex gap-4">
                  <button className="p-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
                     <Search className="w-4 h-4 text-blue-500" />
                  </button>
                  <Link to="/admin/ai-assistant" className="px-6 py-2 bg-gradient-to-br from-blue-400 to-blue-600 text-white text-[10px] font-bold uppercase tracking-widest rounded-xl shadow-lg shadow-blue-500/20 active:scale-95 transition-all">
                     AI Assistant
                  </Link>
                  <button className="px-6 py-2 bg-white/5 border border-white/10 text-white/40 text-[10px] font-bold uppercase tracking-widest rounded-xl hover:bg-white/10 transition-all">
                     Issue Directive
                  </button>
               </div>
            </div>
          </div>

          <div className="flex-1 grid grid-cols-1 md:grid-cols-4 lg:grid-cols-12 gap-6 overflow-hidden">
            
            {/* Left Column: Streams & Metrics */}
            <div className="lg:col-span-3 flex flex-col gap-6 overflow-hidden">
              <section className="flex-1 bg-black/60 backdrop-blur-xl border border-white/5 rounded-[2rem] p-6 flex flex-col overflow-hidden">
                <div className="flex justify-between items-center mb-6">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-blue-500/80">AI Audit Stream</span>
                  <div className="w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_8px_#3b82f6]" />
                </div>
                <div className="flex-1 space-y-6 overflow-y-auto pr-2 custom-scrollbar">
                  {auditStream.map((log, i) => (
                    <div key={i} className="space-y-2 group cursor-pointer">
                      <div className="flex justify-between items-center font-mono text-[8px] opacity-40 group-hover:opacity-100 transition-opacity">
                        <span className={log.color}>{log.module}</span>
                        <span>{log.time}</span>
                      </div>
                      <p className="text-[11px] leading-relaxed group-hover:text-white transition-colors">{log.msg}</p>
                    </div>
                  ))}
                </div>
              </section>

              <section className="bg-black/60 backdrop-blur-xl border border-white/5 rounded-[2rem] p-6 h-48 shrink-0">
                <span className="text-[10px] font-bold uppercase tracking-widest text-blue-500/80 mb-6 block">Resource Allocation</span>
                <div className="space-y-4">
                  {[
                    { label: "Compute Power", val: 88, color: "bg-blue-600" },
                    { label: "Personnel Readiness", val: 42, color: "bg-blue-500" },
                    { label: "Conflict Suppression", val: 64, color: "bg-red-600" },
                  ].map((m) => (
                    <div key={m.label} className="space-y-1.5">
                      <div className="flex justify-between text-[9px] font-bold uppercase tracking-widest opacity-40">
                        <span>{m.label}</span>
                        <span>{m.val}%</span>
                      </div>
                      <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                        <motion.div initial={{ width: 0 }} animate={{ width: `${m.val}%` }} className={`h-full ${m.color}`} />
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            </div>

            {/* Sub-HUD Center: (Transparent mostly) */}
            <div className="lg:col-span-6 relative pointer-events-none">
               {/* Pulsing Hotspots Layer (Absolute positioned) */}
               <div className="absolute top-[30%] left-[45%] group pointer-events-auto cursor-pointer">
                 <div className="absolute inset-0 bg-blue-500/20 rounded-full animate-ping" />
                 <div className="w-3 h-3 bg-blue-500 rounded-full shadow-[0_0_10px_#3b82f6]" />
                  <div className="absolute top-6 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-black/80 px-3 py-1.5 rounded-xl text-[9px] font-bold tracking-widest text-blue-500 whitespace-nowrap">
                   SECTOR 7G: CRITICAL (9.4)
                  </div>
               </div>

               <div className="absolute top-[55%] left-[62%] group pointer-events-auto cursor-pointer">
                 <div className="absolute inset-0 bg-red-500/20 rounded-full animate-ping" />
                 <div className="w-3 h-3 bg-red-500 rounded-full shadow-[0_0_10px_#ef4444]" />
                 <div className="absolute top-6 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-black/80 px-3 py-1.5 rounded-xl text-[9px] font-black tracking-widest text-red-500 whitespace-nowrap">
                   SECTOR 12B: BREACH (0.8)
                 </div>
               </div>

               {/* Bottom Bento Overlay */}
               <div className="absolute bottom-0 left-0 right-0 grid grid-cols-4 gap-4 pointer-events-auto pb-4">
                  {bentoScores.map((score, i) => (
                    <div key={i} className={`bg-black/80 backdrop-blur-md border border-white/5 p-4 rounded-2xl flex flex-col justify-center ${score.highlight ? "border-t-2 border-t-red-500/50" : ""}`}>
                       <span className="text-[8px] font-bold tracking-widest text-white/30 uppercase mb-1">{score.label}</span>
                       <div className="flex items-end gap-2">
                          <span className={`text-2xl font-bold ${score.color}`}>{score.value}</span>
                          <score.trend className={`w-3 h-3 mb-1 ${score.color}`} />
                       </div>
                    </div>
                  ))}
               </div>
            </div>

            {/* Right Column: Visual Deck */}
            <div className="lg:col-span-3 flex flex-col gap-6">
               <section className="bg-black/60 backdrop-blur-xl border border-white/5 rounded-[2rem] p-6 flex-1 flex flex-col overflow-hidden">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-blue-500/80 mb-6 block">Target Feed</span>
                  <div className="aspect-video bg-black rounded-2xl overflow-hidden border border-white/10 mb-6 relative group">
                     {/* Cam overlay placeholder */}
                     <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&q=80&w=400')] bg-cover grayscale contrast-125 opacity-30" />
                     <div className="absolute top-3 left-3 flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-red-600 animate-pulse" />
                        <span className="text-[8px] font-black font-mono text-red-500">LIVE CAM 04-A</span>
                     </div>
                  </div>
                  <div className="space-y-6 flex-1">
                     <div className="space-y-1">
                        <span className="text-[9px] font-bold text-white/30 uppercase tracking-widest">Identified Subject</span>
                        <p className="text-sm font-black text-white/80 uppercase">Citizen ID: #9901-X</p>
                     </div>
                     <div className="space-y-2">
                        <div className="flex justify-between text-[9px] font-bold uppercase tracking-widest opacity-40">
                           <span>Probability Rating</span>
                           <span className="text-red-500">78.2%</span>
                        </div>
                        <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                           <motion.div initial={{ width: 0 }} animate={{ width: "78.2%" }} className="h-full bg-red-600" />
                        </div>
                     </div>
                  </div>
                  <div className="mt-auto grid grid-cols-2 gap-3 pt-6 border-t border-white/5">
                     <button className="py-3 bg-white/5 border border-white/10 rounded-xl flex items-center justify-center gap-2 hover:bg-white/10 transition-colors">
                        <Layers className="w-3 h-3 text-blue-500" />
                        <span className="text-[8px] font-bold tracking-widest">LAYER</span>
                     </button>
                     <button className="py-3 bg-white/5 border border-white/10 rounded-xl flex items-center justify-center gap-2 hover:bg-white/10 transition-colors">
                        <Filter className="w-3 h-3 text-blue-500" />
                        <span className="text-[8px] font-bold tracking-widest">FILTER</span>
                     </button>
                  </div>
               </section>

               {/* Tactical Accent */}
               <div className="bg-blue-600/5 border border-blue-600/20 p-6 rounded-[2rem] space-y-3 relative overflow-hidden group">
                  <div className="flex items-center gap-3 relative z-10">
                     <Zap className="w-4 h-4 text-blue-500" />
                     <span className="text-[10px] font-bold uppercase tracking-widest">Security Link</span>
                  </div>
                  <p className="text-[10px] text-white/50 leading-relaxed relative z-10">
                     Neural uplink established. Cross-referencing citizen metadata with global resolution patterns...
                  </p>
                  <div className="absolute -bottom-6 -right-6 opacity-5 group-hover:opacity-10 transition-opacity">
                     <AlertCircle className="w-24 h-24 text-blue-500" />
                  </div>
               </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default MissionControlPage;
