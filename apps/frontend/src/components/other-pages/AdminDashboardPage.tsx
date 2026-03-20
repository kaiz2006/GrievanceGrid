import { motion } from "framer-motion";
import { 
  LayoutDashboard, 
  Users, 
  TrendingUp, 
  AlertTriangle, 
  Clock, 
  Globe, 
  ShieldCheck, 
  Briefcase,
  Search,
  Filter,
  BarChart3,
  Map as MapIcon,
  MessageSquare
} from "lucide-react";
import Shuffle from "../Shuffle";

const metrics = [
  { label: "New Grievances", value: "142", trend: "+12.5%", icon: TrendingUp, color: "text-blue-500 bg-blue-500/10" },
  { label: "In Resolution", value: "64", trend: "+5.2%", icon: Clock, color: "text-amber-500 bg-amber-500/10" },
  { label: "Resolved Today", value: "89", trend: "+18.3%", icon: ShieldCheck, color: "text-green-500 bg-green-500/10" },
  { label: "Average SLA", value: "4.2h", trend: "-1.5%", icon: Globe, color: "text-purple-500 bg-purple-500/10" },
];

const actionQueue = [
  { id: "GRV-1102", type: "Escalated", time: "12m ago", priority: "High", office: "Public Works" },
  { id: "GRV-1105", type: "SLA at Risk", time: "25m ago", priority: "Critical", office: "Sanitation" },
  { id: "GRV-1108", type: "New Report", time: "34m ago", priority: "Medium", office: "Traffic Control" },
];

const AdminDashboardPage = () => {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <main className="flex-grow pt-32 pb-12 px-6 relative">
        <div className="container mx-auto">
          {/* Dashboard Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-12">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <LayoutDashboard className="w-5 h-5 text-blue-500" />
                <span className="text-xs font-bold text-blue-500 uppercase tracking-widest">Admin Command Center</span>
              </div>
              <h1 className="text-4xl font-bold tracking-tight">City Intelligence Dashboard</h1>
            </div>
            
            <div className="flex gap-4">
              <div className="relative group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-blue-500 transition-colors" />
                <input 
                  type="text" 
                  placeholder="Query ticket ID or location..."
                  className="bg-white/5 border border-white/10 rounded-2xl py-3 pl-12 pr-6 text-sm w-64 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all font-medium"
                />
              </div>
              <button className="p-3 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 transition-colors">
                <Filter className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Metrics Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {metrics.map((metric, i) => (
              <motion.div
                key={metric.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="p-8 rounded-3xl bg-white/[0.02] border border-white/5 relative overflow-hidden group"
              >
                <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                  <metric.icon className="w-16 h-16" />
                </div>
                <div className="flex justify-between items-start mb-4">
                  <div className={`p-3 rounded-xl ${metric.color}`}>
                    <metric.icon className="w-5 h-5" />
                  </div>
                  <span className={`text-xs font-bold ${metric.trend.startsWith('+') ? 'text-green-500' : 'text-blue-500'}`}>
                    {metric.trend}
                  </span>
                </div>
                <h4 className="text-muted-foreground text-xs font-bold uppercase tracking-widest mb-1">{metric.label}</h4>
                <p className="text-3xl font-bold tracking-tight">{metric.value}</p>
              </motion.div>
            ))}
          </div>

          {/* Main Content Area */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Live Heatmap Placeholder */}
            <div className="lg:col-span-2 p-8 rounded-[2.5rem] bg-white/[0.02] border border-white/5 relative overflow-hidden min-h-[500px]">
              <div className="flex items-center justify-between mb-8 relative z-10">
                <div className="flex items-center gap-3">
                  <MapIcon className="w-5 h-5 text-blue-500" />
                  <h3 className="text-xl font-bold">Incident Heatmap</h3>
                </div>
                <div className="flex gap-2 text-[10px] font-bold uppercase tracking-widest">
                  <span className="flex items-center gap-2 px-3 py-1 bg-red-500/20 text-red-500 rounded-full border border-red-500/20">Critical</span>
                  <span className="flex items-center gap-2 px-3 py-1 bg-amber-500/20 text-amber-500 rounded-full border border-amber-500/20">Elevated</span>
                </div>
              </div>
              
              {/* Map UI Elements */}
              <div className="absolute inset-0 bg-[#0a0a0a] flex items-center justify-center">
                <div className="w-full h-full opacity-20 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px]" />
                {/* Random heatmap dots */}
                <div className="absolute top-1/4 left-1/3 w-32 h-32 bg-red-500/20 rounded-full blur-3xl animate-pulse" />
                <div className="absolute bottom-1/3 right-1/4 w-48 h-48 bg-blue-500/10 rounded-full blur-3xl" />
                <div className="absolute top-1/2 left-1/2 w-40 h-40 bg-amber-500/20 rounded-full blur-3xl animate-pulse" />
                
                <div className="relative z-10 flex flex-col items-center gap-4">
                  <Globe className="w-12 h-12 text-muted-foreground/30 animate-spin-slow" />
                  <p className="text-muted-foreground text-sm font-medium tracking-wide italic">Rendering City Vector Map Alpha...</p>
                </div>
              </div>
            </div>

            {/* Action Queue */}
            <div className="flex flex-col gap-6">
              <div className="p-8 rounded-[2.5rem] bg-white/[0.02] border border-white/5 h-full">
                <div className="flex items-center gap-3 mb-8">
                  <TrendingUp className="w-5 h-5 text-blue-500" />
                  <h3 className="text-xl font-bold">Action Queue</h3>
                </div>
                <div className="space-y-6">
                  {actionQueue.map((item) => (
                    <div key={item.id} className="p-5 rounded-2xl bg-white/5 border border-white/5 hover:border-blue-500/30 transition-all cursor-pointer group">
                      <div className="flex justify-between items-start mb-3">
                        <span className="text-xs font-bold text-blue-500">{item.id}</span>
                        <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${item.priority === 'Critical' ? 'bg-red-500/20 text-red-500' : 'bg-white/10 text-muted-foreground'}`}>
                          {item.priority}
                        </span>
                      </div>
                      <h5 className="font-bold mb-1 group-hover:text-blue-400 transition-colors">{item.type}</h5>
                      <div className="flex justify-between items-center text-[10px] text-muted-foreground font-bold uppercase tracking-widest">
                        <span>{item.office}</span>
                        <span>{item.time}</span>
                      </div>
                    </div>
                  ))}
                </div>
                <button className="w-full mt-8 py-4 px-6 rounded-2xl bg-blue-600/10 border border-blue-600/20 text-blue-500 text-sm font-bold uppercase tracking-[0.2em] hover:bg-blue-600 text-white transition-all">
                  View Full Queue
                </button>
              </div>

              {/* Category Distribution Placeholder */}
              <div className="p-8 rounded-[2.5rem] bg-white/[0.02] border border-white/5">
                <div className="flex items-center gap-3 mb-6">
                  <BarChart3 className="w-5 h-5 text-blue-500" />
                  <h3 className="text-xl font-bold">Category Distribution</h3>
                </div>
                <div className="space-y-4">
                  {[
                    { label: "Infrastructure", val: 45 },
                    { label: "Sanitation", val: 32 },
                    { label: "Public Safety", val: 23 },
                  ].map((cat) => (
                    <div key={cat.label} className="space-y-2">
                      <div className="flex justify-between text-xs font-bold text-muted-foreground uppercase tracking-widest">
                        <span>{cat.label}</span>
                        <span>{cat.val}%</span>
                      </div>
                      <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: `${cat.val}%` }}
                          className="h-full bg-blue-600 shadow-[0_0_10px_rgba(37,99,235,0.4)]"
                        />
                      </div>
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

export default AdminDashboardPage;
