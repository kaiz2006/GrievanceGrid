import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { 
  Users, 
  TrendingUp, 
  Settings,
  FileText,
  Database,
  ShieldCheck,
  Search,
  Filter,
  BarChart3,
  Map as MapIcon,
  RefreshCw,
  ArrowRight,
  Globe,
  Clock
} from "lucide-react";
import { Link } from "react-router-dom";
import { adminService } from "@/services/admin.service";
import MapComponent from "../map/MapComponent";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const AdminDashboardPage = () => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const result = await adminService.getDashboard();
      setData(result);
      setLoading(false);
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-muted-foreground font-mono uppercase tracking-widest text-xs">Authenticating Command Node...</p>
        </div>
      </div>
    );
  }

  const metrics = [
    { label: "New Grievances", value: (data?.summary?.total_grievances || 0).toString(), trend: "+12.5%", icon: TrendingUp, color: "text-blue-500 bg-blue-500/10" },
    { label: "In Resolution", value: (data?.summary?.pending || 0).toString(), trend: "+5.2%", icon: Clock, color: "text-amber-500 bg-amber-500/10" },
    { label: "Resolved Today", value: (data?.summary?.resolved || 0).toString(), trend: "+18.3%", icon: ShieldCheck, color: "text-green-500 bg-green-500/10" },
    { label: "Average SLA", value: (data?.summary?.avg_resolution_hours || 0).toString() + "h", trend: "-1.5%", icon: Globe, color: "text-purple-500 bg-purple-500/10" },
  ];
  // Derive stats from fetched data
  const stats = {
    users: (data?.summary?.total_users || 1240).toString(),
    grievances: (data?.summary?.total_grievances || 842).toString(),
    infrastructure: (data?.summary?.total_infrastructure_assets || 156).toString(),
    grids: (data?.summary?.total_network_nodes || 42).toString(),
  };

  const actionQueue = [
    { id: "GRV-1102", type: "Escalated", time: "12m ago", priority: "High", office: "Public Works" },
    { id: "GRV-1105", type: "SLA at Risk", time: "25m ago", priority: "Critical", office: "Sanitation" },
    { id: "GRV-1108", type: "New Report", time: "34m ago", priority: "Medium", office: "Traffic Control" },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <main className="flex-grow pt-12 lg:pt-32 pb-12 px-6 relative overflow-hidden">
        {/* Background Glows */}
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] pointer-events-none" />
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-amber-500/10 rounded-full blur-[160px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-red-500/10 rounded-full blur-[140px] pointer-events-none" />

        <div className="container mx-auto max-w-7xl relative z-10">
          {/* Admin Header */}
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-8 mb-16">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/20 glow-admin">
                  <Settings className="w-5 h-5 text-amber-500" />
                </div>
                <span className="text-xs font-bold text-amber-500 uppercase tracking-widest">Architect Command</span>
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tighter mb-4 italic text-white">
                City <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-red-400">Intelligence</span>
              </h1>
              <p className="text-muted-foreground text-lg max-w-md leading-relaxed opacity-80 italic">
                System integrity is at <span className="text-amber-400 font-bold">98.4%</span>. 
                Monitoring <span className="text-white font-bold">{stats.users} active citizens</span> across all sectors.
              </p>
            </motion.div>
            
            <div className="flex flex-col gap-4">
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="p-6 rounded-3xl bg-white/[0.02] border border-white/5 glow-admin px-8 backdrop-blur-md"
              >
                <p className="text-[10px] text-muted-foreground uppercase font-black tracking-[0.2em] mb-1">Network Health</p>
                <p className="text-3xl font-black text-amber-400 font-mono tracking-tighter italic">
                  ALPHA-9 <span className="text-xs uppercase ml-1 opacity-60">Status Normal</span>
                </p>
              </motion.div>
            </div>
          </div>

          {/* Global Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {[
              { label: "Active Citizens", value: stats.users, icon: Users, color: "text-amber-400", glow: "glow-admin", trend: "+2" },
              { label: "Grid Failures", value: stats.grievances, icon: FileText, color: "text-red-400", glow: "glow-auditor", trend: "-12%" },
              { label: "Infra Assets", value: stats.infrastructure, icon: Database, color: "text-blue-400", glow: "glow-citizen", trend: "Stable" },
              { label: "Network Nodes", value: stats.grids, icon: ShieldCheck, color: "text-emerald-400", glow: "glow-crew", trend: "+4" },
            ].map((metric, i) => (
              <motion.div
                key={metric.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className={`p-8 rounded-[2rem] bg-white/[0.02] border border-white/5 relative overflow-hidden group hover:bg-white/[0.04] transition-all ${metric.glow} backdrop-blur-md`}
              >
                <div className={`p-4 rounded-2xl w-fit mb-6 bg-white/5 ${metric.color}`}>
                  <metric.icon className="w-6 h-6" />
                </div>
                <div className="flex justify-between items-end">
                  <div>
                    <h4 className="text-muted-foreground text-[10px] font-black uppercase tracking-[0.2em] mb-1">{metric.label}</h4>
                    <p className="text-4xl font-black tracking-tighter italic text-white">{metric.value}</p>
                  </div>
                  <span className="text-[10px] font-black text-emerald-400 opacity-60 mb-2">{metric.trend}</span>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Main Content Area */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <Card className="glass-premium border-white/5 bg-white/[0.01] min-h-[600px] overflow-hidden group">
                <CardHeader className="flex flex-row items-center justify-between border-b border-white/5 px-8 pt-8 pb-6">
                  <div>
                    <CardTitle className="text-2xl font-black italic tracking-tight text-white flex items-center gap-3">
                      <MapIcon className="w-6 h-6 text-amber-500" />
                      Incident Topology
                    </CardTitle>
                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mt-1 opacity-60">Real-time grid failures</p>
                  </div>
                  <div className="flex gap-2">
                     <span className="flex items-center gap-2 px-3 py-1 bg-red-500/10 text-red-500 rounded-lg border border-red-500/20 text-[9px] font-black uppercase tracking-widest">Critical</span>
                     <span className="flex items-center gap-2 px-3 py-1 bg-amber-500/10 text-amber-500 rounded-lg border border-amber-500/20 text-[9px] font-black uppercase tracking-widest">Elevated</span>
                  </div>
                </CardHeader>
                <CardContent className="p-0 h-[500px] relative">
                  <div className="absolute inset-0 grayscale contrast-125 opacity-40 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-700 bg-[#050505]">
                    <MapComponent 
                      center={[19.0760, 72.8777]} 
                      zoom={12}
                      markers={[
                        { position: [19.0760, 72.8777], popupContent: "Critical: Pothole (GRV-1105)" },
                        { position: [19.0860, 72.8877], popupContent: "Elevated: Power Outage (GRV-1102)" },
                        { position: [19.0660, 72.8677], popupContent: "New: Water Leak (GRV-1108)" },
                      ]}
                      className="w-full h-full"
                    />
                  </div>
                  <div className="absolute bottom-8 left-8 right-8 p-6 rounded-2xl bg-[#0a0a0a]/80 backdrop-blur-xl border border-white/5 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
                        <span className="font-black uppercase text-[10px] tracking-widest text-emerald-400">Live Grid Feed Connected</span>
                    </div>
                    <button className="text-[10px] font-black text-amber-500 uppercase tracking-widest border-b border-amber-500/30 hover:border-amber-500 transition-all">Audit Sector 7</button>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="flex flex-col gap-8">
              <Card className="glass-premium border-white/5 bg-white/[0.01]">
                <CardHeader className="px-8 pt-8 pb-4">
                  <CardTitle className="text-xl font-black italic flex items-center gap-3 text-white">
                    <TrendingUp className="w-5 h-5 text-amber-500" />
                    Priority Pipeline
                  </CardTitle>
                </CardHeader>
                <CardContent className="px-8 pb-8 space-y-4">
                  {actionQueue.map((item) => (
                    <div key={item.id} className="p-5 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-amber-500/30 transition-all cursor-pointer group">
                      <div className="flex justify-between items-start mb-3">
                        <span className="text-[10px] font-black text-amber-500 uppercase tracking-[0.2em]">{item.id}</span>
                        <span className={`text-[8px] font-black uppercase px-2 py-0.5 rounded ${item.priority === 'Critical' ? 'bg-red-500/20 text-red-500' : 'bg-white/10 text-muted-foreground'}`}>
                          {item.priority}
                        </span>
                      </div>
                      <h5 className="font-black italic text-lg text-white group-hover:text-amber-400 transition-colors tracking-tight">{item.type}</h5>
                      <div className="flex justify-between items-center text-[9px] text-muted-foreground font-black uppercase tracking-widest mt-4">
                        <span>{item.office}</span>
                        <span>{item.time}</span>
                      </div>
                    </div>
                  ))}
                  <Button className="w-full h-14 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-500 font-black uppercase tracking-[0.2em] hover:bg-amber-500 hover:text-black transition-all text-[10px]">
                    System-wide Audit
                  </Button>
                </CardContent>
              </Card>

              <Card className="glass-premium border-white/5 bg-white/[0.01]">
                <CardHeader className="px-8 pt-8 pb-4">
                  <CardTitle className="text-xl font-black italic flex items-center gap-3 text-white">
                    <BarChart3 className="w-5 h-5 text-blue-500" />
                    Sector Analysis
                  </CardTitle>
                </CardHeader>
                <CardContent className="px-8 pb-10 space-y-6">
                  {[
                    { label: "Infrastructure", val: 45, color: "from-amber-400 to-red-400" },
                    { label: "Environment", val: 32, color: "from-blue-400 to-emerald-400" },
                    { label: "Public Safety", val: 23, color: "from-indigo-400 to-blue-400" },
                  ].map((cat) => (
                    <div key={cat.label} className="space-y-2">
                      <div className="flex justify-between text-[9px] font-black text-muted-foreground uppercase tracking-[0.2em]">
                        <span>{cat.label}</span>
                        <span className="text-white">{cat.val}%</span>
                      </div>
                      <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden p-0.5">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: `${cat.val}%` }}
                          className={`h-full bg-gradient-to-r ${cat.color} rounded-full shadow-[0_0_10px_rgba(245,158,11,0.3)]`}
                        />
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboardPage;
