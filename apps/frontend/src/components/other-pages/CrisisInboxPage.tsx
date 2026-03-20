import { motion } from "framer-motion";
import { 
  AlertTriangle, 
  Map as MapIcon, 
  ShieldAlert, 
  MessageSquare, 
  Image as ImageIcon, 
  ExternalLink, 
  Zap, 
  Bell, 
  Activity, 
  ShieldCheck,
  ChevronRight,
  Send,
  Gavel
} from "lucide-react";
import MapComponent from "../map/MapComponent";

const dispatches = [
  { type: "Rapid Response", text: "Unit 7 deployed to West Sector failure point.", time: "14:02:11", status: "In-Progress", color: "text-red-500" },
  { type: "Maintenance", text: "Sewerage blockage escalated to Dept Head.", time: "13:58:45", status: "Assigned", color: "text-blue-500" },
  { type: "System Update", text: "Weekly Audit Log exported to Oversight.", time: "13:45:00", status: "Complete", color: "text-muted-foreground" },
  { type: "Priority Breached", text: "Case #8902 exceeded 24h response window.", time: "13:10:22", status: "Critical", color: "text-red-500 font-bold" },
];

const CrisisInboxPage = () => {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <main className="flex-grow pt-8 lg:pt-32 pb-12 px-6 relative">
        <div className="container mx-auto">
          {/* Header Section */}
          <section className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 mb-12">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <AlertTriangle className="w-5 h-5 text-red-500" />
                <span className="text-xs font-bold text-red-500 uppercase tracking-widest">Department Head Level • Terminal 04-A</span>
              </div>
              <h1 className="text-4xl font-bold tracking-tight">Escalation Crisis Inbox</h1>
            </div>
            
            <div className="flex flex-wrap gap-4">
              <div className="bg-white/[0.02] border border-white/5 p-4 rounded-2xl flex flex-col items-end min-w-[120px]">
                <span className="text-red-500 text-2xl font-black">14</span>
                <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">SLA Breaches</span>
              </div>
              <div className="bg-white/[0.02] border border-white/5 p-4 rounded-2xl flex flex-col items-end min-w-[120px]">
                <span className="text-blue-500 text-2xl font-black">03</span>
                <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">Critical Priority</span>
              </div>
              <button className="bg-blue-600 text-white px-6 rounded-2xl flex items-center gap-3 shadow-lg shadow-blue-600/20 active:scale-95 transition-all">
                <MapIcon className="w-5 h-5" />
                <span className="text-xs font-bold uppercase tracking-[0.2em]">Command Map</span>
              </button>
            </div>
          </section>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Critical Cards Column */}
            <div className="lg:col-span-8 space-y-8">
              {/* Critical Card 1 */}
              <motion.div 
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white/[0.02] rounded-[2.5rem] border border-white/5 overflow-hidden shadow-2xl relative"
              >
                <div className="h-1 bg-red-600 w-full" />
                <div className="p-8">
                  <div className="flex justify-between items-start mb-8">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 bg-red-600/10 rounded-2xl flex items-center justify-center text-red-500 border border-red-500/20">
                        <ShieldAlert className="w-8 h-8" />
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold tracking-tight">Emergency Infrastructure Failure</h3>
                        <p className="text-xs text-red-500 font-bold uppercase tracking-widest mt-1">Case #GR-8921 • Breached 42m ago</p>
                      </div>
                    </div>
                    <div className="bg-white/5 px-4 py-1.5 rounded-xl border border-white/10 text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                      Level 5 Escalation
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-4">
                    {/* Citizen Feedback */}
                    <div className="space-y-4">
                      <div className="flex items-center gap-2">
                         <MessageSquare className="w-4 h-4 text-blue-500" />
                         <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Citizen Feedback</span>
                      </div>
                      <blockquote className="bg-white/[0.02] p-6 rounded-[2rem] border-l-4 border-blue-500/50 italic text-muted-foreground text-sm leading-relaxed">
                        "Third time this month the main pump has failed. No one is responding. This is a complete failure of public trust. We need a direct response now."
                      </blockquote>
                      <div className="flex items-center gap-3">
                         <div className="w-8 h-8 rounded-full bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-[10px] font-bold text-blue-500">EV</div>
                         <span className="text-xs font-bold">Elena Vance • <span className="text-blue-500 opacity-60">Verified Resident</span></span>
                      </div>
                    </div>

                    {/* Evidence Section */}
                    <div className="space-y-4">
                      <div className="flex items-center gap-2">
                         <ImageIcon className="w-4 h-4 text-blue-500" />
                         <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Original Evidence</span>
                      </div>
                      <div className="relative group rounded-[2.5rem] overflow-hidden h-40 border border-white/5 bg-black/40">
                         <div className="absolute inset-0 flex items-center justify-center opacity-40 group-hover:opacity-100 transition-opacity">
                            <span className="text-xs font-bold uppercase tracking-widest text-blue-500">Loading High-Res Exhibit...</span>
                         </div>
                         <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex items-end p-4">
                            <div className="flex justify-between w-full items-center">
                               <span className="text-[10px] font-bold text-white uppercase tracking-widest">IMG_0923.RAW • 4.2MB</span>
                               <ExternalLink className="w-3 h-3 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                            </div>
                         </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-12 pt-8 border-t border-white/5 flex flex-wrap gap-4 items-center">
                    <button className="bg-red-600 text-white px-8 py-3 rounded-2xl text-xs font-bold uppercase tracking-widest shadow-lg shadow-red-600/20 hover:scale-[1.02] active:scale-[0.98] transition-all">
                      Deploy Immediate Dispatch
                    </button>
                    <button className="bg-white/5 border border-white/10 px-8 py-3 rounded-2xl text-xs font-bold uppercase tracking-widest hover:bg-white/10 transition-all">
                      Executive Oversight
                    </button>
                    <div className="ml-auto flex gap-4 text-muted-foreground">
                       <button className="hover:text-blue-500 transition-colors uppercase text-[10px] font-bold tracking-widest">Legal Archive</button>
                       <button className="hover:text-blue-500 transition-colors uppercase text-[10px] font-bold tracking-widest">Share Trace</button>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Critical Card 2 */}
              <div className="bg-white/[0.02] rounded-[2.5rem] border border-white/5 p-8 relative opacity-90 backdrop-blur-sm grayscale-[0.3] hover:grayscale-0 transition-all group">
                 <div className="h-1 bg-blue-500 absolute top-0 left-0 right-0 group-hover:bg-blue-400" />
                 <div className="flex justify-between items-start mb-6">
                    <div className="flex gap-4 items-center">
                       <div className="w-12 h-12 bg-blue-500/10 rounded-2xl flex items-center justify-center text-blue-500">
                          <ShieldCheck className="w-6 h-6" />
                       </div>
                       <div>
                          <h3 className="text-xl font-bold">Public Safety Protocol Violation</h3>
                          <p className="text-xs text-blue-500 font-bold uppercase tracking-widest mt-1">Case #GR-9104 • SLA Deadline in 14m</p>
                       </div>
                    </div>
                 </div>
                 <div className="p-6 bg-white/[0.01] rounded-2xl border-l-4 border-blue-500/30">
                    <p className="text-sm text-muted-foreground leading-relaxed">System-generated alert: Unauthorized access detected at District 9 Utility Hub. Security team responded but supervisor signature is missing for lockdown confirmation.</p>
                 </div>
                 <div className="mt-8 flex gap-4">
                    <button className="bg-blue-600/10 border border-blue-500/20 text-blue-500 px-8 py-3 rounded-2x text-xs font-bold uppercase tracking-widest hover:bg-blue-600 hover:text-white transition-all">
                      Authorize Lockdown
                    </button>
                    <button className="px-8 py-3 rounded-2xl text-xs font-bold uppercase tracking-widest text-muted-foreground hover:bg-white/5 transition-all">
                      Review Access Log
                    </button>
                 </div>
              </div>
            </div>

            {/* Right Feed Column */}
            <div className="lg:col-span-4 space-y-8">
              {/* Mini Map */}
              <div className="bg-white/[0.02] border border-white/5 rounded-[2.5rem] p-6 shadow-2xl">
                <div className="flex justify-between items-center mb-6 px-2">
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-500">Live Dispatch Map</span>
                  <div className="flex gap-2 items-center">
                    <div className="w-2 h-2 rounded-full bg-red-600 animate-pulse shadow-[0_0_8px_#dc2626]" />
                    <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest">3 Active Zones</span>
                  </div>
                </div>
                <div className="h-56 rounded-[2rem] overflow-hidden bg-black/40 relative border border-white/5">
                   <MapComponent 
                      center={[41.8781, -87.6298]}
                      zoom={12}
                      markers={[{ position: [41.8781, -87.6298], popupContent: "Crisis Zone Alpha" }]}
                      className="w-full h-full grayscale opacity-20 contrast-[1.2]"
                   />
                </div>
              </div>

              {/* Dispatch Feed */}
              <div className="bg-white/[0.02] border border-white/5 rounded-[2.5rem] flex flex-col shadow-2xl overflow-hidden min-h-[500px]">
                <div className="p-8 border-b border-white/5 bg-white/[0.02]">
                  <h3 className="text-sm font-black uppercase tracking-[0.2em] text-blue-500">Emergency Dispatches</h3>
                </div>
                <div className="p-4 space-y-2 overflow-y-auto">
                   {dispatches.map((d, i) => (
                     <div key={i} className="p-5 rounded-2xl bg-white/[0.02] hover:bg-white/[0.04] border border-transparent hover:border-white/5 transition-all group cursor-pointer">
                        <div className="flex justify-between items-start mb-2">
                           <span className={`text-[9px] font-black uppercase tracking-widest ${d.color}`}>{d.type}</span>
                           <span className="text-[9px] font-mono font-bold text-muted-foreground opacity-30">{d.time}</span>
                        </div>
                        <p className="text-xs text-muted-foreground font-medium group-hover:text-foreground transition-colors leading-relaxed">{d.text}</p>
                        {d.type === "Rapid Response" && (
                          <div className="mt-4 h-1 bg-white/5 rounded-full overflow-hidden">
                             <motion.div initial={{ width: 0 }} animate={{ width: "75%" }} className="h-full bg-red-600" />
                          </div>
                        )}
                     </div>
                   ))}
                </div>
                <div className="p-8 mt-auto border-t border-white/5 bg-white/[0.01]">
                   <button className="w-full py-4 border border-white/5 text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground hover:border-blue-500/50 hover:text-blue-500 transition-all rounded-2xl bg-white/[0.02]">
                     View Full Operational Logs
                   </button>
                </div>
              </div>

              {/* Security Status Terminal */}
              <div className="bg-black/40 rounded-[2rem] p-6 border border-white/5 font-mono text-[10px] backdrop-blur-xl opacity-60">
                 <div className="flex items-center justify-between mb-2">
                    <span className="text-blue-500 font-bold">SYSLOG_DAEMON: ACTIVE</span>
                    <span className="text-muted-foreground opacity-30 uppercase font-bold tracking-widest">Ver 4.1</span>
                 </div>
                 <p className="opacity-40">&gt; Polling grid nodes...</p>
                 <p className="opacity-40">&gt; 12 alerts suppressed.</p>
                 <p className="text-blue-500 font-bold">&gt; Terminal lockdown: DISABLED</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default CrisisInboxPage;
