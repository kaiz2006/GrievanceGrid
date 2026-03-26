import { motion } from "framer-motion";
import { 
  Users, 
  MapPin, 
  Clock, 
  ChevronRight, 
  CheckCircle2, 
  AlertTriangle, 
  MoreVertical, 
  PlusCircle, 
  Map as MapIcon, 
  History, 
  Zap,
  TrendingUp,
  LayoutDashboard,
  ShieldAlert,
  Search,
  Filter
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const assignments = [
  { 
    id: "Grid Failure #8821", 
    type: "Emergency", 
    sla: "04:12:09", 
    unit: "Echo-9", 
    lat: 41.8781, 
    long: 87.6298, 
    statusColor: "border-red-600",
    badgeColor: "bg-red-600/10 text-red-500",
    image: "https://images.unsplash.com/photo-1544006659-f0b21884cb1d?auto=format&fit=crop&q=80&w=400"
  },
  { 
    id: "Substation Audit", 
    type: "Maintenance", 
    sla: "12:45:00", 
    unit: "Sierra-4", 
    lat: 37.7749, 
    long: 122.4194, 
    statusColor: "border-blue-500",
    badgeColor: "bg-blue-600/10 text-blue-500",
    image: "https://images.unsplash.com/photo-1573166364524-d9dbfd8bbf83?auto=format&fit=crop&q=80&w=400"
  },
  { 
    id: "Relay Calibration", 
    type: "Routine", 
    sla: "28:10:44", 
    unit: "Tango-1", 
    lat: 47.6062, 
    long: 122.3321, 
    statusColor: "border-white/20",
    badgeColor: "bg-white/5 text-muted-foreground",
    image: "https://images.unsplash.com/photo-1581094794329-c8112a89af12?auto=format&fit=crop&q=80&w=400"
  },
];

const dispatchQueue = [
  { id: "UNIT-882 (Foxtrot)", location: "Zone A-12 (North Sector)", progress: 75, status: "En Route", statusColor: "text-emerald-500", dotColor: "bg-emerald-500", time: "2m ago" },
  { id: "UNIT-901 (Kilo)", location: "Station 09 (Downtown)", progress: 40, status: "On Site", statusColor: "text-blue-500", dotColor: "bg-blue-500", time: "Active Now" },
  { id: "UNIT-445 (Romeo)", location: "External Terminal 4", progress: 95, status: "Delayed", statusColor: "text-red-500", dotColor: "bg-red-500", time: "15m ago" },
];

const DispatchPage = () => {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <main className="flex-grow pt-12 lg:pt-32 pb-32 px-6 relative overflow-hidden">
        {/* Background Glows */}
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] pointer-events-none" />
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-emerald-500/10 rounded-full blur-[160px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-blue-500/10 rounded-full blur-[140px] pointer-events-none" />

        <div className="container mx-auto max-w-7xl relative z-10">
          {/* Dispatch Header */}
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-8 mb-16">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 glow-crew">
                  <ShieldAlert className="w-5 h-5 text-emerald-500" />
                </div>
                <span className="text-xs font-bold text-emerald-500 uppercase tracking-widest">Field Command Center</span>
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-7xl font-black tracking-tighter mb-4 italic text-white flex flex-col leading-[0.8]">
                 <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-blue-400">OPERATIONAL</span>
                 <span>GRID</span>
              </h1>
              <p className="text-muted-foreground text-lg max-w-md leading-relaxed opacity-80 italic">
                Currently coordinating <span className="text-emerald-400 font-bold">42 active units</span>. 
                Average response time is <span className="text-white font-bold">12m 42s</span>.
              </p>
            </motion.div>
            
            <div className="flex flex-col gap-4">
                <div className="flex gap-4">
                    <div className="text-right p-6 rounded-3xl bg-white/[0.02] border border-white/5 backdrop-blur-md">
                        <p className="text-[10px] text-muted-foreground uppercase font-black tracking-[0.2em] mb-1">Active SLAs</p>
                        <p className="text-3xl font-black text-red-500 font-mono tracking-tighter italic shadow-[0_0_15px_rgba(239,68,68,0.3)]">04</p>
                    </div>
                    <div className="text-right p-6 rounded-3xl bg-white/[0.02] border border-white/5 backdrop-blur-md">
                        <p className="text-[10px] text-muted-foreground uppercase font-black tracking-[0.2em] mb-1">Grid Efficiency</p>
                        <p className="text-3xl font-black text-emerald-400 font-mono tracking-tighter italic">98.2%</p>
                    </div>
                </div>
            </div>
          </div>

          {/* Assignment Grid */}
          <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {assignments.map((item, i) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className={`group relative p-8 rounded-[2.5rem] bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] transition-all cursor-pointer backdrop-blur-md overflow-hidden glow-crew`}
              >
                <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-all duration-700">
                    <Zap className="w-24 h-24" />
                </div>

                <div className="flex justify-between items-start mb-8 relative z-10">
                  <div>
                    <Badge variant="outline" className={`text-[9px] font-black uppercase tracking-widest ${item.badgeColor} border-none p-0`}>
                      {item.type}
                    </Badge>
                    <h3 className="text-2xl font-black italic mt-3 text-white tracking-tighter leading-tight group-hover:text-emerald-400 transition-colors uppercase">{item.id}</h3>
                  </div>
                  <div className="text-right">
                    <p className="text-[9px] text-muted-foreground uppercase tracking-[0.2em] mb-2 font-black opacity-60">SLA Timer</p>
                    <p className={`text-xl font-mono font-black italic ${item.type === 'Emergency' ? 'text-red-500 animate-pulse' : 'text-white'}`}>
                      {item.sla}
                    </p>
                  </div>
                </div>
                
                <div className="h-40 w-full rounded-2xl mb-8 overflow-hidden relative border border-white/5 bg-black/40">
                  <div 
                    className="absolute inset-0 bg-cover bg-center grayscale-0 group-hover:scale-110 transition-all duration-1000"
                    style={{ backgroundImage: `url(${item.image})` }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
                  <div className="absolute bottom-4 left-5 flex items-center gap-2 text-[9px] font-black font-mono text-emerald-400 tracking-widest bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/5">
                    <MapPin className="w-3 h-3" />
                    COORDS: {item.lat} / {item.long}
                  </div>
                </div>

                <div className="flex justify-between items-center relative z-10">
                  <div className="flex items-center gap-2">
                    <div className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                        <Users className="w-4 h-4 text-emerald-500" />
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Unit: <span className="text-white">{item.unit}</span></span>
                  </div>
                  <Button variant="ghost" className="text-emerald-500 group-hover:bg-emerald-500/10 text-[10px] font-black uppercase tracking-widest px-0">
                    DEPLOY <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              </motion.div>
            ))}
          </section>

          {/* Dispatch Queue Table */}
          <Card className="glass-premium border-white/5 bg-white/[0.01] overflow-hidden rounded-[3rem]">
            <CardHeader className="px-10 py-10 border-b border-white/5 flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-2xl font-black italic text-white flex items-center gap-3">
                  <Zap className="w-6 h-6 text-emerald-500" />
                  CREW PIPELINE
                </CardTitle>
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.3em] mt-2 opacity-60">Real-time unit allocation & deployment telemetry</p>
              </div>
              <div className="flex gap-4">
                  <div className="relative group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-emerald-500 transition-colors" />
                    <input 
                      type="text" 
                      placeholder="Search units..."
                      className="bg-white/5 border border-white/10 rounded-2xl py-3 pl-12 pr-6 text-[10px] font-black uppercase tracking-widest focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all w-48"
                    />
                  </div>
                  <Button variant="outline" className="h-12 border-white/5 bg-white/5 text-[10px] font-black uppercase tracking-widest hover:bg-white/10">
                    <Filter className="w-4 h-4 mr-2" /> Filters
                  </Button>
              </div>
            </CardHeader>
            <CardContent className="p-0 overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-white/[0.02] text-[9px] font-black uppercase tracking-[0.3em] text-muted-foreground">
                  <tr>
                    <th className="px-10 py-6">Operational Unit</th>
                    <th className="px-10 py-6">Sector Coordinates</th>
                    <th className="px-10 py-6">Deployment Progress</th>
                    <th className="px-10 py-6">Status Telemetry</th>
                    <th className="px-10 py-6">Uptime</th>
                    <th className="px-10 py-6 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {dispatchQueue.map((c, i) => (
                    <tr key={i} className="hover:bg-white/[0.02] transition-colors cursor-pointer group">
                      <td className="px-10 py-8">
                        <div className="flex items-center gap-3">
                            <span className="text-sm font-black italic text-white group-hover:text-emerald-400 transition-colors">{c.id}</span>
                        </div>
                      </td>
                      <td className="px-10 py-8 text-[10px] text-muted-foreground font-black uppercase tracking-widest">{c.location}</td>
                      <td className="px-10 py-8">
                        <div className="flex flex-col gap-2">
                            <div className="w-48 bg-white/5 h-1.5 rounded-full overflow-hidden p-0.5">
                                <motion.div 
                                    initial={{ width: 0 }} 
                                    animate={{ width: `${c.progress}%` }} 
                                    className={`h-full rounded-full transition-all duration-1000 ${c.status === 'Delayed' ? 'bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)]' : c.status === 'On Site' ? 'bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.5)]' : 'bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]'}`} 
                                />
                            </div>
                            <span className="text-[8px] font-black text-muted-foreground self-end">{c.progress}%</span>
                        </div>
                      </td>
                      <td className="px-10 py-8">
                        <Badge variant="outline" className={`flex items-center gap-2 text-[8px] font-black uppercase tracking-widest ${c.statusColor} border-none bg-white/5 px-3 py-1.5 rounded-lg`}>
                          <span className={`h-1.5 w-1.5 rounded-full ${c.dotColor} animate-pulse shadow-[0_0_8px_currentColor]`} />
                          {c.status}
                        </Badge>
                      </td>
                      <td className="px-10 py-8 font-mono text-[9px] text-muted-foreground/60 font-black uppercase tracking-widest">{c.time}</td>
                      <td className="px-10 py-8 text-right">
                        <Button variant="ghost" size="icon" className="group-hover:bg-emerald-500/10 text-muted-foreground group-hover:text-emerald-500">
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardContent>
          </Card>
        </div>
      </main>

      {/* Dispatch Action Dock */}
      <div className="fixed bottom-12 left-1/2 -translate-x-1/2 z-50 w-full max-w-3xl px-6">
        <motion.div 
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="bg-[#0a0a0a]/80 backdrop-blur-3xl border border-white/10 rounded-[2.5rem] p-5 flex items-center justify-between shadow-[0_30px_60px_-15px_rgba(0,0,0,0.8)]"
        >
          <div className="flex items-center gap-8 px-6">
            <button className="flex flex-col items-center gap-2 group">
              <PlusCircle className="w-6 h-6 text-muted-foreground group-hover:text-emerald-400 transition-all group-active:scale-90" />
              <span className="text-[8px] uppercase font-black tracking-[0.2em] text-muted-foreground/40 group-hover:text-emerald-400/60">Dispatch</span>
            </button>
            <div className="h-10 w-[1px] bg-white/5" />
            <button className="flex flex-col items-center gap-2 group">
              <MapIcon className="w-6 h-6 text-muted-foreground group-hover:text-blue-400 transition-all group-active:scale-90" />
              <span className="text-[8px] uppercase font-black tracking-[0.2em] text-muted-foreground/40 group-hover:text-blue-400/60">Live Map</span>
            </button>
            <button className="flex flex-col items-center gap-2 group">
              <Users className="w-6 h-6 text-muted-foreground group-hover:text-amber-400 transition-all group-active:scale-90" />
              <span className="text-[8px] uppercase font-black tracking-[0.2em] text-muted-foreground/40 group-hover:text-amber-400/60">Units</span>
            </button>
            <button className="flex flex-col items-center gap-2 group">
              <History className="w-6 h-6 text-muted-foreground group-hover:text-blue-500 transition-all group-active:scale-90" />
              <span className="text-[8px] uppercase font-black tracking-[0.2em] text-muted-foreground/40 group-hover:text-blue-500/60">Audit</span>
            </button>
          </div>
          <div className="flex items-center gap-6">
            <div className="text-right hidden sm:block">
              <p className="text-[8px] text-muted-foreground font-black uppercase tracking-[0.2em] leading-none mb-1 opacity-40">System Mesh</p>
              <p className="text-[10px] text-emerald-500 font-black tracking-widest flex items-center gap-2 justify-end">
                  <span className="h-1.5 w-1.5 bg-emerald-500 rounded-full animate-ping" />
                  NOMINAL
              </p>
            </div>
            <button className="bg-gradient-to-br from-emerald-500 to-emerald-700 text-black h-14 px-10 rounded-[1.5rem] font-black text-[10px] uppercase tracking-[0.2em] hover:brightness-125 shadow-lg shadow-emerald-500/20 active:scale-95 transition-all flex items-center gap-3">
              <Zap className="w-4 h-4 fill-current" /> 
              Emergency Protocol
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default DispatchPage;
