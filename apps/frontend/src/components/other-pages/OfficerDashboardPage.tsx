import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  LayoutDashboard, Clock, CheckCircle2, AlertTriangle, Play,
  ArrowRight, RefreshCw, ShieldCheck, TrendingUp, Briefcase,
  Search, ChevronRight, Filter, MapPin, Calendar, Layers, Activity,
  BarChart3
} from "lucide-react";
import { 
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend,
  BarChart, Bar, XAxis, YAxis, CartesianGrid
} from "recharts";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { grievanceService } from "@/services/grievance.service";
import { analyticsService } from "@/services/analytics.service";
import GrievanceSLA from "@/components/GrievanceSLA";
import { DashboardAnalytics } from "@/types/analytics";
import { getOfficerTaskData, getCategoryData } from "@/lib/chart-utils";

const OfficerDashboardPage = () => {
  const [grievances, setGrievances] = useState<any[]>([]);
  const [analytics, setAnalytics] = useState<DashboardAnalytics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [grievanceResult, analyticsResult] = await Promise.all([
          grievanceService.getMyGrievances(),
          analyticsService.getDashboard()
        ]);
        
        console.log('🔍 Dashboard Debug - Grievance Result:', grievanceResult);
        console.log('🔍 Dashboard Debug - Analytics Result:', analyticsResult);
        
        const grievancesData = (grievanceResult as any).grievances || (grievanceResult as any).items || grievanceResult || [];
        console.log('🔍 Dashboard Debug - Parsed Grievances:', grievancesData);
        
        setGrievances(grievancesData);
        setAnalytics(analyticsResult);
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const stats = {
    myTotal: grievances.length,
    myPending: grievances.filter(g => ["PENDING", "ACKNOWLEDGED", "ASSIGNED"].includes(g?.status?.toUpperCase())).length,
    systemTotal: analytics?.summary.total_grievances || 0,
    systemEscalated: analytics?.summary.escalated || 0,
    infraRisks: analytics?.predictive_alerts.length || 0,
    resolvedRate: analytics?.sla_compliance.resolution_sla_met || 0,
  };

  const getStatusColor = (status: string) => {
    switch (status?.toUpperCase()) {
      case "RESOLVED":
      case "CLOSED":
      case "VERIFIED":
        return "text-green-500 bg-green-500/10 border-green-500/20";
      case "IN_PROGRESS":
        return "text-blue-500 bg-blue-500/10 border-blue-500/20";
      case "PENDING":
      case "ASSIGNED":
      case "ACKNOWLEDGED":
        return "text-amber-500 bg-amber-500/10 border-amber-500/20";
      case "CRITICAL":
      case "ESCALATED":
        return "text-red-500 bg-red-500/10 border-red-500/20";
      default:
        return "text-muted-foreground bg-white/5 border-white/10";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-muted-foreground font-mono uppercase tracking-widest text-xs">Syncing Officer Records...</p>
        </div>
      </div>
    );
  }

    return (
        <div className="min-h-screen bg-background text-foreground flex flex-col">
            <main className="flex-grow pt-12 lg:pt-32 pb-12 px-6 relative overflow-hidden">


                <div className="container mx-auto max-w-7xl relative z-10">
                    {/* Dashboard Header */}
                    <div className="flex flex-col md:flex-row md:items-start justify-between gap-8 mb-16">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                        >
                            <div className="flex items-center gap-3 mb-4">
                                <div className="p-2 rounded-xl bg-indigo-500/10 border border-indigo-500/20 glow-officer">
                                    <ShieldCheck className="w-5 h-5 text-indigo-400" />
                                </div>
                                <span className="text-xs font-bold text-indigo-400 uppercase tracking-widest">Departmental Command</span>
                            </div>
                            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tighter mb-4 italic">
                                Operational <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-blue-400">Intelligence</span>
                            </h1>
                            <p className="text-muted-foreground text-lg max-w-md leading-relaxed opacity-80">
                                Global system status is <span className="text-emerald-400 font-bold uppercase tracking-widest">Nominal</span>. 
                                Reviewing <span className="text-white font-bold">{stats.myPending} pending assignments</span>.
                            </p>
                        </motion.div>
                        
                        <div className="flex gap-4">
                            <Button asChild className="h-14 px-8 bg-indigo-600 hover:bg-indigo-500 rounded-2xl shadow-[0_0_20px_rgba(99,102,241,0.3)] transition-all hover:scale-105 active:scale-95">
                                <Link to="/officer/workflow">
                                    <Play className="mr-2 h-4 w-4" />
                                    Launch Workflow
                                </Link>
                            </Button>
                        </div>
                    </div>
    
                    {/* Analytics Section */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
                        <Card className="glass-premium border-white/5 bg-white/[0.01] glow-officer">
                            <CardHeader>
                                <CardTitle className="text-xl font-black flex items-center gap-3 italic">
                                    <PieChart className="w-5 h-5 text-indigo-400" />
                                    Task Distribution
                                </CardTitle>
                                <CardDescription className="text-[10px] uppercase tracking-widest font-bold opacity-60">
                                    Status breakdown of your assignments
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="h-[300px]">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={getOfficerTaskData(grievances)}
                                            cx="50%"
                                            cy="50%"
                                            innerRadius={60}
                                            outerRadius={80}
                                            paddingAngle={5}
                                            dataKey="value"
                                        >
                                            {getOfficerTaskData(grievances).map((entry: any, index: number) => (
                                                <Cell key={`cell-${index}`} fill={['#6366f1', '#3b82f6', '#10b981', '#f59e0b', '#ef4444'][index % 5]} />
                                            ))}
                                        </Pie>
                                        <Tooltip 
                                            contentStyle={{ backgroundColor: '#000', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }}
                                            itemStyle={{ color: '#fff' }}
                                        />
                                        <Legend verticalAlign="bottom" height={36}/>
                                    </PieChart>
                                </ResponsiveContainer>
                            </CardContent>
                        </Card>

                        <Card className="glass-premium border-white/5 bg-white/[0.01] glow-citizen">
                            <CardHeader>
                                <CardTitle className="text-xl font-black flex items-center gap-3 italic">
                                    <BarChart3 className="w-5 h-5 text-blue-400" />
                                    Category Breakdown
                                </CardTitle>
                                <CardDescription className="text-[10px] uppercase tracking-widest font-bold opacity-60">
                                    Workload by grievance category
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="h-[300px]">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={getCategoryData(grievances).slice(0, 5)}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                                        <XAxis 
                                            dataKey="name" 
                                            axisLine={false} 
                                            tickLine={false} 
                                            tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 10 }}
                                        />
                                        <YAxis 
                                            axisLine={false} 
                                            tickLine={false} 
                                            tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 10 }}
                                        />
                                        <Tooltip 
                                          cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                                          contentStyle={{ backgroundColor: '#000', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }}
                                        />
                                        <Bar dataKey="value" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={30} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Metrics Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
                        {[
                            { label: "Current Load", value: stats.myTotal, icon: Briefcase, color: "text-indigo-400", glow: "glow-officer" },
                            { label: "Action Required", value: stats.myPending, icon: Clock, color: "text-amber-400", glow: "glow-auditor" },
                            { label: "Grid Fidelity", value: `${Math.round(stats.resolvedRate)}%`, icon: Layers, color: "text-blue-400", glow: "glow-citizen" },
                            { label: "SLA Breaches", value: stats.systemEscalated, icon:AlertTriangle, color: "text-red-400", glow: "glow-auditor" },
                        ].map((metric, i) => (
                            <motion.div
                                key={metric.label}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.1 }}
                                className={`p-8 rounded-[2rem] bg-white/[0.02] border border-white/5 relative overflow-hidden group hover:bg-white/[0.04] transition-all ${metric.glow}`}
                            >
                                <div className={`p-4 rounded-2xl w-fit mb-6 bg-white/5 ${metric.color}`}>
                                    <metric.icon className="w-6 h-6" />
                                </div>
                                <h4 className="text-muted-foreground text-[10px] font-black uppercase tracking-[0.2em] mb-1">{metric.label}</h4>
                                <p className="text-4xl font-black tracking-tighter italic">{metric.value}</p>
                            </motion.div>
                        ))}
                    </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Quick Actions & Status */}
            <div className="lg:col-span-1 flex flex-col gap-8">
              <Card className="glass-premium border-white/5 bg-white/[0.01] glow-officer">
                <CardHeader className="pb-4">
                  <CardTitle className="text-xl font-black flex items-center gap-3 italic">
                    <Activity className="w-5 h-5 text-indigo-400" />
                    Rapid Response
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button variant="outline" className="w-full justify-between h-16 bg-white/[0.02] border-white/10 hover:bg-white/[0.05] rounded-2xl group transition-all hover:scale-[1.02]" asChild>
                    <Link to="/officer/workflow">
                      <div className="flex items-center gap-4">
                        <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400 group-hover:bg-indigo-500 group-hover:text-white transition-colors">
                            <RefreshCw className="w-5 h-5" />
                        </div>
                        <span className="font-black uppercase text-[10px] tracking-[0.2em]">Update Grid Status</span>
                      </div>
                      <ChevronRight className="w-4 h-4 opacity-40 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                    </Link>
                  </Button>
                  <Button variant="outline" className="w-full justify-between h-16 bg-white/[0.02] border-white/10 hover:bg-white/[0.05] rounded-2xl group transition-all hover:scale-[1.02]" asChild>
                    <Link to="/officer/field-verification">
                      <div className="flex items-center gap-4">
                        <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 group-hover:bg-emerald-500 group-hover:text-white transition-colors">
                            <ShieldCheck className="w-5 h-5" />
                        </div>
                        <span className="font-black uppercase text-[10px] tracking-[0.2em]">Deploy Verifiers</span>
                      </div>
                      <ChevronRight className="w-4 h-4 opacity-40 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                    </Link>
                  </Button>
                  {stats.infraRisks > 0 && (
                    <Button variant="outline" className="w-full justify-between h-16 bg-red-500/5 border-red-500/20 hover:bg-red-500/10 rounded-2xl group transition-all hover:scale-[1.02]" asChild>
                      <Link to="/officer/infrastructure">
                        <div className="flex items-center gap-4">
                          <div className="p-2 rounded-lg bg-red-500/10 text-red-500 group-hover:bg-red-500 group-hover:text-white transition-colors">
                             <AlertTriangle className="w-5 h-5" />
                          </div>
                          <span className="font-black uppercase text-[10px] tracking-[0.2em] text-red-500">Asset Risks ({stats.infraRisks})</span>
                        </div>
                        <ChevronRight className="w-4 h-4 text-red-500" />
                      </Link>
                    </Button>
                  )}
                </CardContent>
              </Card>

              <Card className="glass-premium border-white/5 bg-white/[0.01]">
                <CardHeader className="pb-4">
                  <CardTitle className="text-xl font-black flex items-center gap-3 italic">
                    <TrendingUp className="w-5 h-5 text-amber-400" />
                    KPI Metrics
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-8 p-8">
                  <div className="space-y-3">
                    <div className="flex justify-between text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">
                      <span>Resolution SLA</span>
                      <span className="text-white">{Math.round(stats.resolvedRate)}%</span>
                    </div>
                    <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden p-0.5">
                      <div 
                        className="h-full bg-gradient-to-r from-indigo-500 to-blue-500 rounded-full transition-all duration-1000 shadow-[0_0_10px_rgba(99,102,241,0.5)]" 
                        style={{ width: `${stats.resolvedRate}%` }} 
                      />
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">
                      <span>Response Compliance</span>
                      <span className="text-white">{Math.round(analytics?.sla_compliance.response_sla_met || 0)}%</span>
                    </div>
                    <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden p-0.5">
                      <div 
                        className="h-full bg-gradient-to-r from-emerald-500 to-blue-500 rounded-full transition-all duration-1000 shadow-[0_0_10px_rgba(16,185,129,0.5)]" 
                        style={{ width: `${analytics?.sla_compliance.response_sla_met || 0}%` }} 
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Recent Tasks */}
            <div className="lg:col-span-2">
              <Card className="glass-premium border-white/5 bg-white/[0.01] h-full overflow-hidden">
                <CardHeader className="flex flex-row items-center justify-between border-b border-white/5 px-8 py-8 lg:py-10">
                  <div>
                    <CardTitle className="text-3xl font-black italic tracking-tight">Active Assignments</CardTitle>
                    <CardDescription className="font-bold text-[10px] uppercase tracking-widest mt-1 opacity-60">Priority queue for your sector</CardDescription>
                  </div>
                  <Button variant="ghost" className="text-indigo-400 font-bold uppercase text-[10px] tracking-widest flex items-center gap-2 hover:bg-transparent hover:text-white transition-colors" asChild>
                    <Link to="/officer/workflow">
                      View full stack <ArrowRight className="w-4 h-4" />
                    </Link>
                  </Button>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="grid grid-cols-1">
                    {grievances.slice(0, 6).map((g, i) => (
                      <Link 
                        key={g.id} 
                        to={`/grievance/${g.id}`}
                        className="flex items-center justify-between px-10 py-8 hover:bg-white/[0.03] transition-all group border-b border-white/5 last:border-0"
                      >
                        <div className="flex-1">
                          <div className="flex items-center gap-4 mb-3">
                            <span className="font-mono text-[10px] text-indigo-400 font-bold bg-indigo-500/5 px-2.5 py-1 rounded border border-indigo-500/10 tracking-widest">{g.grid_id}</span>
                            <Badge className={`px-2.5 py-0.5 text-[9px] font-black uppercase tracking-tighter border-0 rounded-md ${getStatusColor(g.status)}`}>
                              {g.status?.replace(/_/g, " ")}
                            </Badge>
                          </div>
                          <h4 className="text-xl font-bold group-hover:text-indigo-400 transition-colors italic tracking-tight">{g.title}</h4>
                          <div className="flex items-center gap-6 mt-4 opacity-60">
                            <div className="flex items-center gap-2 text-[9px] font-bold uppercase tracking-widest">
                                <Calendar className="w-3.5 h-3.5 text-indigo-400" />
                                {new Date(g.created_at).toLocaleDateString()}
                            </div>
                            <div className="flex items-center gap-2 text-[9px] font-bold uppercase tracking-widest">
                                <MapPin className="w-3.5 h-3.5 text-blue-400" />
                                {g.location?.address || "Grid Location Set"}
                            </div>
                          </div>
                        </div>
                        <div className="flex flex-col items-end gap-3 shrink-0">
                            {g.status !== "RESOLVED" && g.created_at && (
                              <div className="w-56 scale-90 origin-right">
                                <GrievanceSLA createdAt={g.created_at} />
                              </div>
                            )}
                            <div className="flex items-center gap-4">
                                <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-2 text-[9px] font-black uppercase tracking-widest text-indigo-400 mr-4">
                                    Open Record
                                </div>
                                <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-indigo-400 group-hover:translate-x-1 transition-all" />
                            </div>
                        </div>
                      </Link>
                    ))}
                    {grievances.length === 0 && (
                      <div className="px-8 py-24 text-center">
                        <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-6">
                            <Briefcase className="w-8 h-8 text-muted-foreground/30" />
                        </div>
                        <p className="text-muted-foreground font-black uppercase text-[10px] tracking-widest opacity-40 italic">Sector queue clear. No active assignments.</p>
                      </div>
                    )}
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

export default OfficerDashboardPage;
