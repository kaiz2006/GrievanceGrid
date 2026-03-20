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
  LayoutDashboard
} from "lucide-react";

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
      <main className="flex-grow pt-8 lg:pt-32 pb-32 px-6 relative">
        <div className="container mx-auto">
          {/* Header Stats */}
          <header className="flex flex-col md:flex-row justify-between items-end gap-8 mb-12">
            <div>
              <h1 className="text-4xl font-black text-blue-500 tracking-tighter mb-2 italic">FIELD COMMAND</h1>
              <p className="text-muted-foreground font-bold text-[10px] uppercase tracking-[0.3em] opacity-60">Regional Dispatch & SLA Monitoring</p>
            </div>
            <div className="flex gap-12">
              <div className="text-right">
                <p className="text-[10px] text-muted-foreground uppercase tracking-widest mb-1 font-bold">Active Units</p>
                <p className="text-2xl font-black text-white">42 / 50</p>
              </div>
              <div className="text-right">
                <p className="text-[10px] text-muted-foreground uppercase tracking-widest mb-1 font-bold">Critical SLAs</p>
                <p className="text-2xl font-black text-red-500">04</p>
              </div>
              <div className="text-right">
                <p className="text-[10px] text-muted-foreground uppercase tracking-widest mb-1 font-bold">Efficiency</p>
                <p className="text-2xl font-black text-emerald-500">98.2%</p>
              </div>
            </div>
          </header>

          {/* Assignment Grid */}
          <section className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12">
            {assignments.map((item, i) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className={`bg-white/[0.02] p-6 rounded-3xl border-l-4 ${item.statusColor} border border-white/5 hover:bg-white/[0.04] transition-all cursor-pointer group shadow-2xl overflow-hidden relative`}
              >
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <span className={`text-[9px] px-2.5 py-1 rounded-lg font-black uppercase tracking-tighter ${item.badgeColor}`}>
                      {item.type}
                    </span>
                    <h3 className="text-xl font-bold mt-3 group-hover:text-blue-400 transition-colors">{item.id}</h3>
                  </div>
                  <div className="text-right">
                    <p className="text-[9px] text-muted-foreground uppercase tracking-widest mb-1 font-bold font-mono">SLA Time</p>
                    <p className={`text-xl font-mono font-black ${item.type === 'Emergency' ? 'text-red-500 animate-pulse' : 'text-white'}`}>
                      {item.sla}
                    </p>
                  </div>
                </div>
                
                <div className="h-28 w-full bg-black/40 rounded-2xl mb-6 overflow-hidden relative border border-white/5">
                  <div 
                    className="absolute inset-0 bg-cover bg-center grayscale opacity-40 group-hover:grayscale-0 group-hover:opacity-60 transition-all duration-700"
                    style={{ backgroundImage: `url(${item.image})` }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                  <div className="absolute bottom-3 left-4 flex items-center gap-2 text-[9px] font-mono font-bold text-blue-500 tracking-tighter">
                    <MapPin className="w-3 h-3" />
                    LAT: {item.lat} / LONG: {item.long}
                  </div>
                </div>

                <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Users className="w-3.5 h-3.5 text-blue-500" />
                    <span>Unit: {item.unit}</span>
                  </div>
                  <button className="text-blue-500 hover:underline flex items-center gap-1">
                    View Details <ChevronRight className="w-3 h-3" />
                  </button>
                </div>
              </motion.div>
            ))}
          </section>

          {/* Data Table Section */}
          <section className="bg-white/[0.02] border border-white/5 rounded-[2.5rem] overflow-hidden shadow-2xl">
            <div className="px-8 py-6 border-b border-white/5 flex justify-between items-center bg-white/[0.01]">
              <h2 className="font-black text-blue-500 uppercase tracking-[0.2em] text-xs">Crew Dispatch Queue</h2>
              <div className="flex gap-3">
                <button className="bg-white/5 border border-white/10 text-[9px] font-black px-4 py-2 rounded-xl text-muted-foreground hover:text-white transition-all uppercase tracking-widest">
                  Export CSV
                </button>
                <button className="bg-white/5 border border-white/10 text-[9px] font-black px-4 py-2 rounded-xl text-muted-foreground hover:text-white transition-all uppercase tracking-widest">
                  Active Filters
                </button>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left font-sans">
                <thead className="bg-white/[0.01] text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/40">
                  <tr>
                    <th className="px-8 py-5">Crew ID</th>
                    <th className="px-8 py-5">Location</th>
                    <th className="px-8 py-5">Task Progress</th>
                    <th className="px-8 py-5">Status</th>
                    <th className="px-8 py-5">Last Contact</th>
                    <th className="px-8 py-5 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {dispatchQueue.map((c, i) => (
                    <tr key={i} className="hover:bg-white/[0.02] transition-colors cursor-pointer group">
                      <td className="px-8 py-6 font-bold text-white/80 group-hover:text-white">{c.id}</td>
                      <td className="px-8 py-6 text-xs text-muted-foreground font-medium">{c.location}</td>
                      <td className="px-8 py-6">
                        <div className="w-48 bg-white/5 h-1.5 rounded-full overflow-hidden">
                          <motion.div 
                            initial={{ width: 0 }} 
                            animate={{ width: `${c.progress}%` }} 
                            className={`h-full ${c.status === 'Delayed' ? 'bg-red-600' : c.status === 'On Site' ? 'bg-amber-500' : 'bg-blue-600'}`} 
                          />
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <span className={`flex items-center gap-2 text-[10px] font-black uppercase tracking-tighter ${c.statusColor}`}>
                          <span className={`h-1.5 w-1.5 rounded-full ${c.dotColor} animate-pulse shadow-[0_0_8px_currentColor]`} />
                          {c.status}
                        </span>
                      </td>
                      <td className="px-8 py-6 font-mono text-[10px] text-muted-foreground opacity-60 font-bold">{c.time}</td>
                      <td className="px-8 py-6 text-right">
                        <button className="p-2 rounded-xl hover:bg-white/5 text-muted-foreground hover:text-white transition-colors">
                          <MoreVertical className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </div>
      </main>

      {/* Floating Action Dock */}
      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 w-full max-w-2xl px-4">
        <div className="bg-black/40 backdrop-blur-2xl border border-white/10 rounded-3xl p-4 flex items-center justify-between shadow-[0_0_50px_rgba(0,0,0,0.5)]">
          <div className="flex items-center gap-8 px-6">
            <button className="flex flex-col items-center gap-1.5 group">
              <PlusCircle className="w-5 h-5 text-muted-foreground group-hover:text-blue-500 transition-colors" />
              <span className="text-[9px] uppercase font-black tracking-widest text-muted-foreground/50 group-hover:text-blue-500/50">Assign</span>
            </button>
            <div className="h-10 w-[1px] bg-white/5" />
            <button className="flex flex-col items-center gap-1.5 group">
              <MapIcon className="w-5 h-5 text-muted-foreground group-hover:text-emerald-500 transition-colors" />
              <span className="text-[9px] uppercase font-black tracking-widest text-muted-foreground/50 group-hover:text-emerald-500/50">Map</span>
            </button>
            <button className="flex flex-col items-center gap-1.5 group">
              <Users className="w-5 h-5 text-muted-foreground group-hover:text-amber-500 transition-colors" />
              <span className="text-[9px] uppercase font-black tracking-widest text-muted-foreground/50 group-hover:text-amber-500/50">Roster</span>
            </button>
            <button className="flex flex-col items-center gap-1.5 group">
              <History className="w-5 h-5 text-muted-foreground group-hover:text-blue-500 transition-colors" />
              <span className="text-[9px] uppercase font-black tracking-widest text-muted-foreground/50 group-hover:text-blue-500/50">Logs</span>
            </button>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <p className="text-[8px] text-muted-foreground font-black uppercase tracking-widest leading-none">Global Status</p>
              <p className="text-[10px] text-emerald-500 font-black tracking-tighter mt-1">NOMINAL</p>
            </div>
            <button className="bg-gradient-to-br from-blue-500 to-blue-700 text-white h-12 px-8 rounded-2xl font-black text-xs uppercase tracking-widest hover:brightness-110 shadow-lg shadow-blue-500/20 active:scale-95 transition-all flex items-center gap-3">
              <Zap className="w-4 h-4" /> 
              Quick Action
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DispatchPage;
