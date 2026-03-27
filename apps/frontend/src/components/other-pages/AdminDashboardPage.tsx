import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { 
  Users, TrendingUp, Settings, FileText, Database, ShieldCheck, 
  Search, Filter, BarChart3, Map as MapIcon, RefreshCw, 
  ArrowRight, Globe, Clock, Activity, Target
} from "lucide-react";
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, 
  ResponsiveContainer, PieChart, Pie, Cell, Legend,
  BarChart, Bar, ComposedChart, RadialBarChart, RadialBar
} from "recharts";
import { Link } from "react-router-dom";
import { adminService } from "@/services/admin.service";
import { grievanceService } from "@/services/grievance.service";
import MapComponent from "../map/MapComponent";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getRadialSectorData, getSLAPercentageData, getAdminTrendData } from "@/lib/chart-utils";
import { toast } from "sonner";

// Generate sector load heatmap data
const generateSectorHeatmapData = () => {
  const gridSize = 8;
  const data = [];
  
  for (let i = 0; i < gridSize; i++) {
    for (let j = 0; j < gridSize; j++) {
      // Create realistic load patterns with hotspots
      let load = Math.random() * 0.4; // Base random load
      
      // Add load hotspots (busy sectors)
      const centerX1 = 1, centerY1 = 2;
      const centerX2 = 6, centerY2 = 5;
      const centerX3 = 3, centerY3 = 6;
      
      const dist1 = Math.sqrt(Math.pow(i - centerX1, 2) + Math.pow(j - centerY1, 2));
      const dist2 = Math.sqrt(Math.pow(i - centerX2, 2) + Math.pow(j - centerY2, 2));
      const dist3 = Math.sqrt(Math.pow(i - centerX3, 2) + Math.pow(j - centerY3, 2));
      
      load += Math.exp(-dist1 / 1.5) * 0.6; // Hotspot 1
      load += Math.exp(-dist2 / 2) * 0.4; // Hotspot 2  
      load += Math.exp(-dist3 / 1.8) * 0.5; // Hotspot 3
      
      load = Math.min(load, 1); // Cap at 1
      
      data.push({
        x: i,
        y: j,
        load: load,
        status: load > 0.8 ? 'Overloaded' : load > 0.6 ? 'High' : load > 0.4 ? 'Medium' : 'Low',
        grievances: Math.floor(load * 50) + Math.floor(Math.random() * 10)
      });
    }
  }
  
  return data;
};

const sectorHeatmapData = generateSectorHeatmapData();

const AdminDashboardPage = () => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [grievances, setGrievances] = useState<any[]>([]);

  const handleReseedData = () => {
    try {
      // Clear existing data
      localStorage.removeItem('grievance_grid_demo_db');
      
      // Show success message
      toast.success('Database cleared! Refresh the page to re-seed with new data.');
      
      // Auto-refresh after 2 seconds
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    } catch (error) {
      toast.error('Failed to re-seed data. Please try manually clearing localStorage.');
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [dashboardData, grievancesData] = await Promise.all([
          adminService.getDashboard(),
          grievanceService.getOfficerGrievances()
        ]);
        setData(dashboardData);
        setGrievances(grievancesData.items || []);
        setLoading(false);
      } catch (error) {
        console.error('Failed to fetch data:', error);
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-4 border-amber-600 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-muted-foreground font-mono uppercase tracking-widest text-xs">Authenticating Command Node...</p>
        </div>
      </div>
    );
  }

  const stats = {
    users: (data?.summary?.total_users || 1240).toString(),
    grievances: (data?.summary?.total_grievances || 842).toString(),
    infrastructure: (data?.summary?.total_infrastructure_assets || 156).toString(),
    grids: (data?.summary?.total_network_nodes || 42).toString(),
  };

  const normalizePercent = (value: unknown): number | null => {
    const numeric = typeof value === "number" ? value : Number(value);
    if (!Number.isFinite(numeric)) return null;
    if (numeric > 0 && numeric <= 1) return numeric * 100;
    return Math.min(100, Math.max(0, numeric));
  };

  const totalGrievances = data?.summary?.total_grievances ?? 0;
  const resolvedGrievances = data?.summary?.resolved ?? 0;
  const fallbackResolutionCompliance =
    totalGrievances > 0 ? (resolvedGrievances / totalGrievances) * 100 : 0;
  const apiResolutionCompliance = normalizePercent(data?.sla_compliance?.resolution_sla_met);
  const resolutionCompliance =
    apiResolutionCompliance !== null && apiResolutionCompliance > 0
      ? apiResolutionCompliance
      : fallbackResolutionCompliance;
  const resolutionBreaches = Math.max(0, 100 - resolutionCompliance);

  const actionQueue = [
    { id: "GRV-1102", type: "Escalated", time: "12m ago", priority: "High", office: "Public Works" },
    { id: "GRV-1105", type: "SLA at Risk", time: "25m ago", priority: "Critical", office: "Sanitation" },
    { id: "GRV-1108", type: "New Report", time: "34m ago", priority: "Medium", office: "Traffic Control" },
  ];

  // Convert grievances to map markers
  const grievanceMarkers = grievances
    .filter(g => g.location && g.location.latitude && g.location.longitude)
    .map(g => ({
      position: [g.location.latitude, g.location.longitude] as [number, number],
      popupContent: `${g.priority}: ${g.title} (${g.grid_id})`,
      iconColor: g.priority === 'CRITICAL' ? 'red' : g.priority === 'HIGH' ? 'orange' : 'black'
    }));

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <main className="flex-grow pt-12 lg:pt-32 pb-12 px-6 relative overflow-hidden">
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
            
            {/* Admin Actions */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex flex-col gap-4"
            >
              <Button
                onClick={handleReseedData}
                variant="outline"
                className="bg-red-500/10 border-red-500/20 text-red-400 hover:bg-red-500/20 hover:text-red-300 transition-all"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Re-seed Database
              </Button>
              <p className="text-xs text-muted-foreground text-center">
                Clear and refresh mock data
              </p>
            </motion.div>
          </div>

          {/* New Analytics Hero Section */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
            {/* Resolution Trend */}
            <Card className="lg:col-span-2 glass-premium border-white/5 bg-white/[0.01] p-8">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h3 className="text-xl font-bold tracking-tight text-white italic">Global Performance Flux</h3>
                  <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mt-1">24-hour grievance lifecycle tracking</p>
                </div>
                <Activity className="w-5 h-5 text-amber-500" />
              </div>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={getAdminTrendData()}>
                    <defs>
                      <linearGradient id="reportsGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#fbbf24" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#fbbf24" stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="resolvedGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                    <XAxis 
                      dataKey="time" 
                      stroke="#ffffff20" 
                      fontSize={11} 
                      tickLine={false}
                      axisLine={false}
                    />
                    <YAxis 
                      stroke="#ffffff20" 
                      fontSize={11} 
                      tickLine={false}
                      axisLine={false}
                    />
                    <Tooltip 
                      contentStyle={{ backgroundColor: 'rgba(10, 10, 10, 0.9)', borderColor: 'rgba(251, 191, 36, 0.2)', borderRadius: '12px' }}
                    />
                    <Area type="monotone" dataKey="reports" stroke="#fbbf24" fillOpacity={1} fill="url(#reportsGrad)" />
                    <Area type="monotone" dataKey="resolved" stroke="#3b82f6" fillOpacity={1} fill="url(#resolvedGrad)" />
                    <Legend verticalAlign="top" align="right" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </Card>

            {/* SLA Donut */}
            <Card className="glass-premium border-white/5 bg-white/[0.01] p-8 flex flex-col">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h3 className="text-xl font-bold tracking-tight text-white italic">SLA Security</h3>
                  <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mt-1">Resolution compliance rate</p>
                </div>
                <Target className="w-5 h-5 text-emerald-500" />
              </div>
              <div className="flex-grow flex items-center justify-center">
                <ResponsiveContainer width="100%" height={260}>
                  <PieChart>
                    <Pie
                      data={getSLAPercentageData({ resolution_sla_met: resolutionCompliance })}
                      cx="50%"
                      cy="50%"
                      innerRadius={70}
                      outerRadius={100}
                      paddingAngle={10}
                      dataKey="value"
                    >
                      {getSLAPercentageData({ resolution_sla_met: resolutionCompliance }).map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} stroke="rgba(255,255,255,0.05)" />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ backgroundColor: 'rgba(10, 10, 10, 0.9)', borderRadius: '12px', border: 'none' }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
                <div className="text-center">
                  <p className="text-2xl font-black text-emerald-400 italic">{resolutionCompliance.toFixed(1)}%</p>
                  <p className="text-[8px] font-black text-muted-foreground uppercase tracking-widest">Compliance</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-black text-red-500 italic">{resolutionBreaches.toFixed(1)}%</p>
                  <p className="text-[8px] font-black text-muted-foreground uppercase tracking-widest">Breaches</p>
                </div>
            </Card>
          </div>

          {/* Global Metrics Cards */}
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
              <Card className="glass-premium border-white/5 bg-white/[0.01] min-h-[600px] overflow-hidden group relative">
                <CardHeader className="flex flex-row items-center justify-between border-b border-white/5 px-8 pt-8 pb-6 bg-[#0a0a0a]/40 backdrop-blur-xl z-20 sticky top-0">
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
                      useGps={true}
                      showUserLocation={true}
                      markers={grievanceMarkers}
                      zoom={14}
                      className="w-full h-full"
                    />
                  </div>
                  <div className="absolute bottom-8 left-8 right-8 p-6 rounded-2xl bg-[#0a0a0a]/80 backdrop-blur-xl border border-white/5 flex items-center justify-between z-20">
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

              {/* Sector Load Analysis - Transformed with Radial Chart */}
              <Card className="glass-premium border-white/5 bg-white/[0.01]">
                <CardHeader className="px-8 pt-8 pb-4">
                  <CardTitle className="text-xl font-black italic flex items-center gap-3 text-white">
                    <BarChart3 className="w-5 h-5 text-blue-500" />
                    Sector Load Analysis
                  </CardTitle>
                </CardHeader>
                <CardContent className="px-8 pb-10">
                  <div className="h-[250px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <RadialBarChart 
                        innerRadius="30%" 
                        outerRadius="100%" 
                        data={getRadialSectorData(data?.by_category)} 
                        startAngle={180} 
                        endAngle={0}
                      >
                        <RadialBar
                          label={{ fill: '#fff', position: 'insideStart', fontSize: '8px' }}
                          background
                          dataKey="value"
                        />
                        <Legend 
                          iconSize={10} 
                          layout="vertical" 
                          verticalAlign="middle" 
                          align="right" 
                          formatter={(value) => <span className="text-[8px] font-black text-muted-foreground uppercase">{value}</span>}
                        />
                        <Tooltip />
                      </RadialBarChart>
                    </ResponsiveContainer>
                  </div>
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
