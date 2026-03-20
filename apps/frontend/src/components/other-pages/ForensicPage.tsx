import { motion } from "framer-motion";
import { 
  ShieldAlert, 
  MapPin, 
  History, 
  Lock, 
  FileSearch, 
  Image as ImageIcon, 
  Download, 
  ChevronRight,
  Gavel,
  ShieldCheck,
  Globe,
  Database,
  FileText
} from "lucide-react";
import MapComponent from "../map/MapComponent";

const timelineEvents = [
  { 
    title: "Complaint Lodged", 
    time: "Oct 14, 2023 • 09:12 AM", 
    description: "Initial discrepancy flagged by automated reconciliation engine. Alert triggered on ledger 0x77FA. Disparity detected: $124,500.22.",
    icon: ShieldAlert,
    tags: ["RAW_LOG_ENTRY", "ENCRYPTED_SIG"]
  },
  { 
    title: "Case Routing", 
    time: "Oct 14, 2023 • 11:45 AM", 
    description: "Assigned to Forensics Division (FD-7). Metadata headers attached and audit trail initiated. Verification of routing nodes completed.",
    icon: Globe,
    avatars: ["JD", "SC"]
  },
  { 
    title: "Resolution Pending", 
    time: "Oct 15, 2023 • PENDING", 
    description: "Awaiting final validation from Executive Oversight. Estimated TTR: 48 Hours.",
    icon: History,
    faded: true
  },
];

const ForensicPage = () => {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <main className="flex-grow pt-8 lg:pt-32 pb-12 px-6 relative">
        <div className="container mx-auto">
          {/* Top Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-12">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <FileSearch className="w-5 h-5 text-blue-500" />
                <span className="text-xs font-bold text-blue-500 uppercase tracking-widest uppercase">Evidence File #8842-X</span>
              </div>
              <h1 className="text-4xl font-bold tracking-tight">Forensic Investigation</h1>
            </div>
            
            <div className="flex items-center gap-4 bg-white/[0.02] border border-white/5 p-4 rounded-2xl">
              <div className="text-right">
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1">Audit Hash</p>
                <code className="text-xs text-blue-500 font-mono font-bold uppercase">44D8-22F1-A89E</code>
              </div>
              <div className="h-8 w-[1px] bg-white/10 mx-2" />
              <div className="px-3 py-1 bg-blue-500/10 text-blue-500 text-[10px] font-black rounded-full uppercase">Active Probe</div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left Content: Evidence & Timeline */}
            <div className="lg:col-span-8 space-y-12">
              {/* Case Summary Card */}
              <div className="bg-white/[0.02] rounded-[2.5rem] p-8 border-l-4 border-blue-600 shadow-2xl relative overflow-hidden group">
                 <div className="flex justify-between items-start mb-8">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-blue-500 mb-2 block">Case Classification: Level 4 Investigation</span>
                      <h2 className="text-3xl font-bold tracking-tight">Financial Discrepancy: Sector 7-G</h2>
                    </div>
                 </div>
                 <div className="grid grid-cols-3 gap-8 border-t border-white/5 pt-8">
                    <div>
                      <p className="text-[10px] uppercase tracking-widest text-muted-foreground opacity-50 mb-1">Reporting Agent</p>
                      <p className="font-bold">Investigator S. Thorne</p>
                    </div>
                    <div>
                      <p className="text-[10px] uppercase tracking-widest text-muted-foreground opacity-50 mb-1">Filing Date</p>
                      <p className="font-bold">Oct 14, 2023</p>
                    </div>
                    <div>
                      <p className="text-[10px] uppercase tracking-widest text-muted-foreground opacity-50 mb-1">Status Duration</p>
                      <p className="font-bold">14 Days / 6 Hours</p>
                    </div>
                 </div>
              </div>

              {/* Chain of Custody Timeline */}
              <div className="space-y-8">
                <h3 className="text-xs font-bold uppercase tracking-[0.3em] text-muted-foreground opacity-50 ml-4">Audit Chain of Custody</h3>
                <div className="space-y-12 relative px-4">
                  {/* Vertical Line */}
                  <div className="absolute left-10 top-2 bottom-0 w-[2px] bg-white/5" />
                  
                  {timelineEvents.map((event, idx) => (
                    <motion.div 
                      key={idx}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.2 }}
                      className={`relative flex gap-12 group ${event.faded ? "opacity-40" : ""}`}
                    >
                      <div className="shrink-0 relative z-10">
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center border transition-all duration-500 shadow-2xl ${
                          idx === 0 ? "bg-blue-600 border-blue-500 shadow-blue-600/20" : "bg-white/5 border-white/10"
                        }`}>
                          <event.icon className={`w-5 h-5 ${idx === 0 ? "text-white" : "text-muted-foreground"}`} />
                        </div>
                      </div>
                      <div className={`flex-1 p-8 rounded-[2rem] border transition-all bg-white/[0.02] border-white/5 group-hover:border-blue-500/20 ${event.faded ? "border-dashed" : ""}`}>
                        <div className="flex justify-between items-center mb-4">
                          <h4 className="text-xl font-bold">{event.title}</h4>
                          <span className="text-[10px] font-mono text-muted-foreground opacity-50 font-bold uppercase tracking-widest">{event.time}</span>
                        </div>
                        <p className="text-muted-foreground leading-relaxed text-sm mb-6">{event.description}</p>
                        
                        {event.tags && (
                          <div className="flex gap-2">
                             {event.tags.map(tag => (
                               <span key={tag} className="text-[10px] font-bold px-3 py-1 bg-white/5 border border-white/10 rounded-lg text-blue-500 tracking-widest uppercase">
                                 {tag}
                               </span>
                             ))}
                          </div>
                        )}

                        {event.avatars && (
                          <div className="flex -space-x-3 items-center">
                             {event.avatars.map((av, i) => (
                               <div key={i} className="w-8 h-8 rounded-full border-2 border-background bg-blue-600/20 flex items-center justify-center text-[10px] font-bold text-blue-500">
                                 {av}
                               </div>
                             ))}
                             <div className="w-8 h-8 rounded-full border-2 border-background bg-white/5 flex items-center justify-center text-[10px] font-bold text-muted-foreground">
                               +2
                             </div>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Sidebar: Map & Integrity */}
            <div className="lg:col-span-4 space-y-8">
              {/* Geolocation Section */}
              <div className="rounded-[2.5rem] overflow-hidden bg-white/[0.02] border border-white/5 shadow-2xl">
                <div className="p-6 border-b border-white/5 flex justify-between items-center bg-white/[0.01]">
                   <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground opacity-50">Origin Geolocation</span>
                   <MapPin className="w-4 h-4 text-blue-500" />
                </div>
                <div className="h-64 relative bg-[#0a0a0a]">
                   <MapComponent 
                      center={[52.52, 13.405]}
                      zoom={14}
                      markers={[{ position: [52.52, 13.405], popupContent: "Origin Node VX9" }]}
                      className="w-full h-full grayscale opacity-40 contrast-125"
                   />
                   <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-md border border-white/10 px-3 py-1.5 rounded-xl font-mono text-[10px] text-blue-500 font-bold tracking-widest">
                     52.5200° N, 13.4050° E
                   </div>
                </div>
                <div className="p-8 space-y-6">
                   <div className="flex justify-between items-center text-xs">
                     <span className="text-muted-foreground opacity-50 font-bold uppercase">Source Node</span>
                     <span className="font-mono text-blue-500 font-bold tracking-widest lowercase">NODE-VX9</span>
                   </div>
                   <div className="flex justify-between items-center text-xs">
                     <span className="text-muted-foreground opacity-50 font-bold uppercase">Access Point</span>
                     <span className="font-mono text-blue-500 font-bold tracking-widest lowercase">VPN_TUNNEL_04</span>
                   </div>
                   <button className="w-full py-4 mt-2 rounded-2xl bg-white/5 border border-white/10 text-[10px] font-black uppercase tracking-widest hover:bg-blue-600 hover:text-white transition-all shadow-xl shadow-blue-600/0 hover:shadow-blue-600/20">
                     Open Full Trace
                   </button>
                </div>
              </div>

              {/* Security Integrity Card */}
              <div className="rounded-[2.5rem] bg-white/[0.02] border border-white/5 p-8 shadow-2xl space-y-8">
                 <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground opacity-50">Security Integrity</h3>
                 <div className="space-y-6">
                    <div className="space-y-2">
                       <div className="flex justify-between text-xs font-bold py-1 uppercase tracking-widest">
                          <span className="text-blue-500">Verification Score</span>
                          <span>98.2%</span>
                       </div>
                       <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                          <motion.div initial={{ width: 0 }} animate={{ width: "98.2%" }} className="h-full bg-blue-600" />
                       </div>
                    </div>
                    <div className="space-y-2">
                       <div className="flex justify-between text-xs font-bold py-1 uppercase tracking-widest">
                          <span className="text-emerald-500">Data Authenticity</span>
                          <span>84.0%</span>
                       </div>
                       <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                          <motion.div initial={{ width: 0 }} animate={{ width: "84.0%" }} className="h-full bg-emerald-500" />
                       </div>
                    </div>
                 </div>

                 {/* Immutability Lock */}
                 <div className="p-6 rounded-[2rem] bg-blue-500/5 border border-blue-500/10 flex flex-col gap-3 relative overflow-hidden group">
                    <div className="flex items-center gap-3 relative z-10">
                       <Lock className="w-4 h-4 text-blue-500" />
                       <span className="text-[10px] font-black uppercase tracking-widest">Immutability Lock</span>
                    </div>
                    <p className="text-[11px] text-muted-foreground leading-relaxed relative z-10 opacity-70">
                       This file is anchored to the private blockchain. Any alterations to timeline nodes will trigger an immediate system-wide audit alert.
                    </p>
                    <div className="absolute -bottom-4 -right-4 opacity-5 group-hover:opacity-10 transition-opacity">
                       <ShieldCheck className="w-24 h-24 text-blue-500" />
                    </div>
                 </div>
              </div>

              {/* Digital Exhibits List */}
              <div className="space-y-4">
                 <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground opacity-50 ml-4">Digital Exhibits</h3>
                 <div className="space-y-3">
                    {[
                      { icon: Database, label: "ledger_export_v2.csv", type: "DATASTREAM" },
                      { icon: ImageIcon, label: "surveillance_cam_B4.mp4", type: "RAW_VISUAL" },
                    ].map((ex) => (
                      <div key={ex.label} className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 flex items-center justify-between group cursor-pointer hover:bg-white/[0.04] transition-all">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center shrink-0 border border-white/5">
                            <ex.icon className="w-4 h-4 text-blue-500 group-hover:scale-110 transition-transform" />
                          </div>
                          <div>
                            <p className="text-xs font-bold">{ex.label}</p>
                            <span className="text-[9px] text-muted-foreground font-black tracking-tighter uppercase">{ex.type}</span>
                          </div>
                        </div>
                        <Download className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-all cursor-pointer" />
                      </div>
                    ))}
                 </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ForensicPage;
