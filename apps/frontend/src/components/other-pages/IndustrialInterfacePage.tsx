import { motion } from "framer-motion";
import { 
  Settings, 
  Activity, 
  Zap, 
  ShieldCheck, 
  Terminal, 
  Cpu, 
  Layers, 
  Database,
  Search,
  ChevronRight,
  TrendingUp,
  AlertTriangle,
  MoveHorizontal,
  Box
} from "lucide-react";

const processFlow = [
  { step: "Intake", status: "Complete", color: "bg-emerald-500" },
  { step: "Analysis", status: "Active", color: "bg-blue-500", pulse: true },
  { step: "Strategy", status: "Queue", color: "bg-white/10" },
  { step: "Resolution", status: "Queue", color: "bg-white/10" },
];

const directives = [
  { id: "DIR-8812", type: "Security Lock", node: "NODE-VX9", time: "2m ago" },
  { id: "DIR-8809", type: "Ledger Audit", node: "HUB-04", time: "14m ago" },
  { id: "DIR-8794", type: "Signal Re-sync", node: "GATE-01", time: "42m ago" },
];

const IndustrialInterfacePage = () => {
  return (
    <div className="min-h-screen bg-background text-muted-foreground flex flex-col">
      <main className="flex-grow pt-8 lg:pt-32 pb-12 px-6 relative overflow-hidden">
        {/* Decorative Macro-Grid */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none" 
          style={{ backgroundImage: "linear-gradient(rgba(37, 99, 235, 0.2) 1px, transparent 1px), linear-gradient(90deg, rgba(37, 99, 235, 0.2) 1px, transparent 1px)", backgroundSize: "160px 160px" }} 
        />

        <div className="container mx-auto relative z-10">
          {/* Header Section */}
          <section className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8 mb-16">
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <Box className="w-5 h-5 text-blue-500" />
                <span className="text-[10px] font-bold uppercase tracking-widest text-blue-500/80">Precision Observatory v4.2</span>
              </div>
              <h1 className="text-5xl font-bold tracking-tighter text-foreground uppercase">Industrial Interface</h1>
            </div>
            
            <div className="flex gap-12 bg-white/[0.03] p-8 rounded-[2rem] border-b border-white/5 shadow-2xl">
               <div className="text-right">
                  <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground opacity-40 mb-1">Operational Status</p>
                  <p className="text-2xl font-black text-red-500 tracking-tighter">CRITICAL</p>
               </div>
               <div className="w-[1px] bg-white/5 h-10" />
               <div className="text-right">
                  <p className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground opacity-40 mb-1">Active Nodes</p>
                  <p className="text-2xl font-bold text-white tracking-tighter">1,204</p>
               </div>
            </div>
          </section>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Left Content Area */}
            <div className="lg:col-span-8 flex flex-col gap-6">
              
              {/* Process Flow Visualization */}
              <div className="bg-white/[0.03] rounded-[2.5rem] p-10 shadow-2xl relative overflow-hidden group">
                 <div className="flex justify-between items-center mb-12">
                    <h3 className="text-sm font-bold uppercase tracking-widest text-foreground">Process Flow Architecture</h3>
                    <Activity className="w-5 h-5 text-blue-500 animate-pulse" />
                 </div>
                 
                 <div className="flex items-center justify-between relative px-4">
                    {/* Connection Line */}
                    <div className="absolute left-10 right-10 top-1/2 -translate-y-1/2 h-[1px] bg-white/5" />
                    
                    {processFlow.map((p, i) => (
                      <div key={i} className="relative z-10 flex flex-col items-center gap-4">
                         <div className={`w-14 h-14 rounded-2xl flex items-center justify-center border transition-all duration-500 shadow-xl ${
                           p.status === 'Active' ? 'bg-white/[0.05] border-blue-500 shadow-blue-500/10' : 'bg-background border-white/5'
                         }`}>
                            <div className={`w-3 h-3 rounded-full ${p.color} ${p.pulse ? 'animate-pulse shadow-[0_0_10px_#3b82f6]' : ''}`} />
                         </div>
                         <div className="text-center">
                            <p className="text-xs font-bold uppercase tracking-widest text-white/80">{p.step}</p>
                            <span className="text-[9px] font-bold text-muted-foreground/40 uppercase tracking-tighter">{p.status}</span>
                         </div>
                      </div>
                    ))}
                 </div>
              </div>

              {/* Directives & Analytics Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Directives Log */}
                 <div className="bg-white/[0.03] rounded-[2.5rem] p-8 shadow-2xl flex flex-col">
                    <div className="flex justify-between items-center mb-8">
                       <h3 className="text-[10px] font-bold uppercase tracking-wider text-foreground">Directives Log</h3>
                       <Database className="w-4 h-4 text-blue-500/50" />
                    </div>
                    <div className="space-y-6 flex-1">
                       {directives.map((d, i) => (
                         <div key={i} className="flex justify-between items-center group cursor-pointer hover:translate-x-1 transition-transform">
                            <div className="flex gap-4 items-center">
                               <div className="w-1.5 h-1.5 rounded-full bg-blue-500/40 group-hover:bg-blue-500" />
                               <div>
                                  <p className="text-xs font-bold text-white/80">{d.id} • {d.type}</p>
                                  <span className="text-[9px] font-black text-muted-foreground opacity-30 uppercase tracking-widest">{d.node}</span>
                               </div>
                            </div>
                            <span className="text-[9px] font-mono opacity-20">{d.time}</span>
                         </div>
                       ))}
                    </div>
                    <button className="mt-8 pt-8 border-t border-white/5 text-[9px] font-black uppercase tracking-[0.4em] text-blue-500 hover:text-white transition-colors w-full text-left">
                       Open Global Audit Stream
                    </button>
                 </div>

                 {/* Node Status Summary */}
                 <div className="bg-white/[0.03] rounded-[2.5rem] p-8 shadow-2xl flex flex-col gap-8">
                    <div className="flex justify-between items-center">
                       <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-foreground">Node Distribution</h3>
                       <MoveHorizontal className="w-4 h-4 text-blue-500/50" />
                    </div>
                    <div className="space-y-6">
                       {[
                         { label: "Core Sync", val: 99.2, color: "bg-emerald-500" },
                         { label: "Edge Response", val: 84.5, color: "bg-blue-500" },
                         { label: "Audit Integrity", val: 92.1, color: "bg-blue-500" },
                       ].map((m) => (
                         <div key={m.label} className="space-y-2">
                            <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest opacity-40">
                               <span>{m.label}</span>
                               <span>{m.val}%</span>
                            </div>
                            <div className="h-1 w-full bg-background rounded-full overflow-hidden">
                               <motion.div initial={{ width: 0 }} animate={{ width: `${m.val}%` }} className={`h-full ${m.color}`} />
                            </div>
                         </div>
                       ))}
                    </div>
                    <div className="mt-auto p-4 bg-white/[0.05] rounded-2xl border border-white/5 flex items-center justify-between">
                       <div className="flex items-center gap-3">
                          <ShieldCheck className="w-4 h-4 text-emerald-500" />
                          <span className="text-[10px] font-black uppercase tracking-widest text-emerald-500/80">Security Mesh Active</span>
                       </div>
                       <ChevronRight className="w-4 h-4 text-muted-foreground/30" />
                    </div>
                 </div>
              </div>
            </div>

            {/* Right Sidebar: Controls & Terminal */}
            <div className="lg:col-span-4 flex flex-col gap-6">
              
              {/* Tactical Action Panel */}
              <div className="bg-white/[0.05] rounded-[2.5rem] p-8 border-b-2 border-blue-500/20 shadow-[0_0_40px_rgba(37,99,235,0.05)] flex flex-col gap-8 relative overflow-hidden group">
                 <div className="space-y-2 relative z-10">
                    <h3 className="text-sm font-bold uppercase tracking-widest text-foreground">Command Suite</h3>
                    <p className="text-[11px] text-muted-foreground opacity-60 leading-relaxed">System awaiting manual override for high-priority resolution directive.</p>
                 </div>
                 
                 <div className="space-y-3 relative z-10">
                    <button className="w-full h-14 bg-gradient-to-br from-blue-400 to-blue-600 text-white rounded-2xl font-bold text-xs uppercase tracking-wider shadow-xl shadow-blue-500/10 hover:scale-[1.02] active:scale-[0.98] transition-all">
                       Deploy Directive
                    </button>
                    <button className="w-full h-14 bg-white/5 border border-white/10 text-white rounded-2xl font-bold text-xs uppercase tracking-wider hover:bg-white/10 transition-all">
                       Initiate Audit
                    </button>
                    <button className="w-full h-14 bg-white/5 border border-white/10 text-white rounded-2xl font-bold text-xs uppercase tracking-wider hover:bg-white/10 transition-all">
                       System Sync
                    </button>
                 </div>
                 <div className="absolute -bottom-6 -right-6 opacity-5 group-hover:opacity-10 transition-opacity">
                    <Zap className="w-32 h-32 text-blue-500" />
                 </div>
              </div>

              {/* System Terminal Overlay */}
              <div className="bg-background/80 backdrop-blur-xl border border-white/5 rounded-[2rem] p-6 font-mono text-[10px] flex flex-col gap-4 shadow-2xl">
                 <div className="flex justify-between items-center opacity-40">
                    <div className="flex items-center gap-2">
                       <Terminal className="w-3 h-3" />
                       <span className="font-bold">SYSTEM_LOG</span>
                    </div>
                    <span className="font-bold">v4.2.0-STABLE</span>
                 </div>
                 <div className="space-y-2 text-muted-foreground/50 overflow-y-auto max-h-[150px] custom-scrollbar">
                    <p>&gt; Polling region us-east-01...</p>
                    <p>&gt; Node sync: 99.2% congruence.</p>
                    <p className="text-emerald-500/60 font-bold">&gt; Delta analysis verified. No anomalies.</p>
                    <p>&gt; Conflict mapping initialized.</p>
                    <p className="text-red-500/60 font-bold">&gt; !! ALERT: Directive queue full.</p>
                    <p className="animate-pulse">&gt; _</p>
                 </div>
                 <div className="pt-4 border-t border-white/5">
                    <div className="flex justify-between text-[8px] font-black uppercase tracking-widest italic opacity-30">
                       <span>Encrypting local stream...</span>
                       <span>OK</span>
                    </div>
                 </div>
              </div>

               {/* Mini Hud Stats */}
              <div className="grid grid-cols-2 gap-4">
                 <div className="bg-white/[0.03] p-6 rounded-3xl border border-white/5">
                    <span className="text-[10px] font-bold opacity-30 uppercase tracking-widest block mb-2">Priority</span>
                    <div className="flex items-end gap-2">
                       <span className="text-3xl font-bold text-red-500 uppercase">04</span>
                       <AlertTriangle className="w-3 h-3 mb-1 text-red-500" />
                    </div>
                 </div>
                 <div className="bg-white/[0.03] p-6 rounded-3xl border border-white/5">
                    <span className="text-[10px] font-bold opacity-30 uppercase tracking-widest block mb-2">Directives</span>
                    <div className="flex items-end gap-2">
                       <span className="text-3xl font-bold text-blue-500 uppercase">12</span>
                       <TrendingUp className="w-3 h-3 mb-1 text-blue-500" />
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

export default IndustrialInterfacePage;
