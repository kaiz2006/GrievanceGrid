import { motion } from "framer-motion";
import { 
  Compass, 
  Layers, 
  Activity, 
  Cpu, 
  Terminal, 
  ShieldCheck, 
  Clock, 
  Download, 
  Zap,
  Search,
  Bell,
  MoreVertical,
  Maximize2
} from "lucide-react";

const metrics = [
  { label: "Structural Delta", val: "0.024mm", percent: 12, color: "bg-emerald-500" },
  { label: "Thermal Gradient", val: "42.1°C", percent: 65, color: "bg-amber-500" },
  { label: "Signal Integrity", val: "99.8%", percent: 99, color: "bg-blue-500" },
  { label: "Verification ID", val: "#VER-9902-X", subtitle: "AUTO-GENERATED" },
];

const timeline = [
  { time: "14:02:11", title: "LiDAR Scan Init", desc: "Batch verification started", dotColor: "bg-amber-500" },
  { time: "14:05:45", title: "Delta Sync Success", desc: "Comparison mapped to grid", dotColor: "bg-blue-500" },
  { time: "14:12:00", title: "Report Compile", desc: "Pending finalize...", dotColor: "bg-white/20", faded: true },
];

const EngineeringPage = () => {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <main className="flex-grow pt-8 lg:pt-32 pb-12 px-6 relative">
        <div className="container mx-auto">
          {/* Telemetry Header */}
          <div className="bg-white/[0.02] border border-white/5 rounded-[2rem] p-8 flex flex-col md:flex-row justify-between items-center gap-8 mb-8 shadow-2xl relative overflow-hidden group">
             <div className="flex gap-12 relative z-10">
                <div>
                   <p className="text-[10px] uppercase tracking-widest text-blue-500 font-black mb-1">Coordinate Lat</p>
                   <p className="text-2xl font-mono font-black text-white tracking-widest italic">40.7128° N</p>
                </div>
                <div>
                   <p className="text-[10px] uppercase tracking-widest text-blue-500 font-black mb-1">Coordinate Long</p>
                   <p className="text-2xl font-mono font-black text-white tracking-widest italic">74.0060° W</p>
                </div>
                <div>
                   <p className="text-[10px] uppercase tracking-widest text-blue-500 font-black mb-1">Accuracy</p>
                   <p className="text-2xl font-mono font-black text-white tracking-widest italic">±0.42m</p>
                </div>
             </div>
             <div className="flex gap-4 relative z-10">
                <button className="px-6 py-2.5 bg-white/5 border border-white/10 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-white/10 transition-all">Export KML</button>
                <button className="px-6 py-2.5 bg-blue-600/10 border border-blue-500/20 text-blue-500 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-blue-600 hover:text-white transition-all">Re-Sync</button>
             </div>
             <div className="absolute top-0 right-0 p-8 opacity-5">
                <Compass className="w-24 h-24 text-blue-500 animate-spin-slow" />
             </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Main Viewport */}
            <div className="lg:col-span-8 flex flex-col gap-8">
              {/* Dual Comparison View */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-[550px]">
                 {/* Before View */}
                 <div className="relative rounded-[2.5rem] overflow-hidden border border-white/5 bg-black/40 group">
                    <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1581092160562-40aa08e78837?auto=format&fit=crop&q=80&w=600')] bg-cover opacity-20 grayscale group-hover:scale-105 transition-transform duration-1000" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                    <div className="absolute top-6 left-6 px-4 py-1.5 bg-white/5 backdrop-blur-md rounded-full border border-white/10">
                       <span className="text-[9px] font-black text-muted-foreground uppercase tracking-widest">Baseline: 08-OCT-23</span>
                    </div>
                    <div className="absolute bottom-6 left-8">
                       <h3 className="text-xl font-bold text-white tracking-tight">Pre-Installation Surface</h3>
                       <p className="text-xs text-muted-foreground font-medium mt-1">Scanning completed via LiDAR Drone Alpha</p>
                    </div>
                 </div>

                 {/* Current View */}
                 <div className="relative rounded-[2.5rem] overflow-hidden border border-blue-500/30 bg-black/40 group">
                    <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1581094281212-d1987adae50e?auto=format&fit=crop&q=80&w=600')] bg-cover opacity-60 contrast-125 group-hover:scale-105 transition-transform duration-1000" />
                    <div className="absolute inset-0 bg-gradient-to-t from-blue-900/40 via-transparent to-transparent" />
                    
                    {/* UI Overlay Pins */}
                    <motion.div 
                      animate={{ scale: [1, 1.2, 1] }} 
                      transition={{ duration: 2, repeat: Infinity }}
                      className="absolute top-1/3 left-1/2 w-6 h-6 -ml-3 bg-blue-500 border-4 border-background rounded-full shadow-[0_0_20px_#3b82f6] cursor-pointer" 
                    />

                    <div className="absolute top-6 left-6 px-4 py-1.5 bg-blue-600 rounded-full shadow-lg shadow-blue-600/20">
                       <span className="text-[9px] font-black text-white uppercase tracking-widest">Current Verification</span>
                    </div>
                    <div className="absolute bottom-6 left-8">
                       <h3 className="text-xl font-bold text-white tracking-tight">Verification Output</h3>
                       <p className="text-xs text-blue-500 font-bold mt-1">Real-time delta analysis: 98.4% congruence</p>
                    </div>
                 </div>
              </div>

              {/* Analysis Summary */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                 {metrics.map((m, i) => (
                   <div key={i} className="bg-white/[0.02] border border-white/5 rounded-3xl p-6 shadow-xl">
                      <p className="text-[10px] uppercase font-black tracking-widest text-blue-500 mb-2">{m.label}</p>
                      <p className={`font-mono font-black tracking-widest ${m.val.startsWith('#') ? 'text-blue-400 text-lg' : 'text-white text-2xl'}`}>{m.val}</p>
                      {m.percent !== undefined && (
                        <div className="mt-4 h-1 w-full bg-white/5 rounded-full overflow-hidden">
                          <motion.div initial={{ width: 0 }} animate={{ width: `${m.percent}%` }} className={`h-full ${m.color}`} />
                        </div>
                      )}
                      {m.subtitle && <p className="text-[9px] font-black opacity-30 uppercase mt-2">{m.subtitle}</p>}
                   </div>
                 ))}
              </div>
            </div>

            {/* AI Analysis Sidebar */}
            <div className="lg:col-span-4 flex flex-col gap-6">
               <section className="bg-white/[0.02] border border-white/5 rounded-[2.5rem] p-8 shadow-2xl flex flex-col gap-8">
                  <div className="flex items-center gap-3">
                     <Cpu className="w-5 h-5 text-blue-500" />
                     <h2 className="text-sm font-black uppercase tracking-widest">AI Analysis</h2>
                  </div>
                  
                  <div className="p-6 bg-blue-500/5 border-l-2 border-blue-500 rounded-r-2xl">
                     <p className="text-[11px] leading-relaxed text-muted-foreground font-medium italic">
                        <span className="text-blue-500 font-black not-italic uppercase tracking-widest block mb-1">Anomalies Detected:</span>
                        High thermal variance detected in Segment-B. Structural integrity remains within safety thresholds. Suggesting coolant verification.
                     </p>
                  </div>

                  <div className="space-y-4">
                     <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest opacity-40">
                        <span>AI Confidence</span>
                        <span className="text-blue-500">94.2%</span>
                     </div>
                     <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                        <motion.div initial={{ width: 0 }} animate={{ width: "94.2%" }} className="h-full bg-blue-600" />
                     </div>
                  </div>

                  <div className="flex-1 space-y-8 overflow-y-auto pr-2 custom-scrollbar min-h-[250px]">
                     <h3 className="text-[10px] font-black uppercase tracking-widest text-blue-500/50">Event Timeline</h3>
                     <div className="space-y-10 relative">
                        <div className="absolute left-2.5 top-0 bottom-0 w-[1px] bg-white/5" />
                        {timeline.map((item, i) => (
                          <div key={i} className={`relative pl-10 group ${item.faded ? 'opacity-30' : ''}`}>
                             <div className={`absolute left-0 top-1 w-5 h-5 bg-[#0a0a0a] border border-white/10 rounded-full flex items-center justify-center z-10 ${!item.faded ? 'border-blue-500/50 shadow-[0_0_10px_rgba(59,130,246,0.2)]' : ''}`}>
                                <div className={`w-1.5 h-1.5 rounded-full ${item.dotColor}`} />
                             </div>
                             <p className="text-[10px] font-mono font-black text-blue-500/60 mb-1">{item.time}</p>
                             <p className="text-sm font-bold text-white group-hover:text-blue-400 transition-colors uppercase tracking-tight">{item.title}</p>
                             <p className="text-[10px] text-muted-foreground font-medium">{item.desc}</p>
                          </div>
                        ))}
                     </div>
                  </div>

                  <button className="w-full py-4 mt-auto rounded-2xl bg-white/5 border border-white/10 text-[10px] font-black uppercase tracking-[0.3em] hover:bg-blue-600 hover:text-white transition-all shadow-xl shadow-blue-600/0 hover:shadow-blue-600/20">
                     Finalize Report
                  </button>
               </section>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default EngineeringPage;
