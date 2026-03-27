import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { 
  Plus, Search, Filter, Clock, CheckCircle2, AlertCircle, 
  MapPin, Calendar, ArrowRight, Bot, Sparkles 
} from "lucide-react";
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, 
  ResponsiveContainer, Area, PieChart, Pie, Cell, Legend 
} from 'recharts';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { grievanceService } from "@/services/grievance.service";
import { getEnhancedTrendData, getCategoryData } from "@/lib/chart-utils";

const DashboardPage = () => {
  const [grievances, setGrievances] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const activeStatuses = new Set(["PENDING", "PENDING_ASSIGNMENT", "PENDING_CLASSIFICATION", "ASSIGNED", "IN_PROGRESS", "ESCALATED", "CONTESTED"]);
  const resolvedStatuses = new Set(["RESOLVED", "CLOSED", "VERIFIED"]);

  const activeReports = grievances.filter((g) => activeStatuses.has(String(g.status || "").toUpperCase())).length;
  const resolvedCases = grievances.filter((g) => resolvedStatuses.has(String(g.status || "").toUpperCase())).length;
  const pendingReview = grievances.filter((g) => {
    const status = String(g.status || "").toUpperCase();
    return status === "PENDING" || status === "PENDING_ASSIGNMENT" || status === "PENDING_CLASSIFICATION";
  }).length;

  const getStatusColor = (status: string) => {
    switch (status?.toUpperCase()) {
      case "RESOLVED":
      case "CLOSED":
      case "VERIFIED":
        return "text-green-500 bg-green-500/10 border-green-500/20";
      case "IN_PROGRESS":
      case "ASSIGNED":
        return "text-blue-500 bg-blue-500/10 border-blue-500/20";
      case "PENDING":
      case "PENDING_ASSIGNMENT":
      case "PENDING_CLASSIFICATION":
        return "text-yellow-500 bg-yellow-500/10 border-yellow-500/20";
      case "ESCALATED":
      case "CONTESTED":
        return "text-red-500 bg-red-500/10 border-red-500/20";
      default:
        return "text-muted-foreground bg-white/5 border-white/10";
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("auth_token");
      if (!token) {
        window.location.href = "/login";
        return;
      }

      try {
        const response = await grievanceService.getMyGrievances() as any;
        const mapped = (response.grievances || response.items || []).map((g: any) => ({
          ...g,
          location: g.location?.address || g.location_address || "Location not provided",
          created_at: g.created_at || new Date().toISOString(),
          status: g.status || "PENDING"
        }));
        setGrievances(mapped);
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        if (message.includes("401")) {
          localStorage.removeItem("auth_token");
          localStorage.removeItem("refresh_token");
          window.location.href = "/login";
          return;
        }
        console.error("Failed to fetch grievances:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);


  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-muted-foreground font-mono uppercase tracking-widest text-xs">Syncing with Grid Dashboard...</p>
        </div>
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      
      <main className="flex-grow pt-8 lg:pt-32 pb-12 px-6">
        <div className="container mx-auto">
          {/* Header Section */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-12">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-2">Citizen Dashboard</h1>
              <p className="text-muted-foreground text-lg">Manage and track your reported grievances</p>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Button className="cta-button-primary h-14 px-8 text-base shadow-[0_0_20px_rgba(59,130,246,0.2)]" asChild>
                <a href="/submit">
                  <Plus className="mr-2 h-5 w-5" />
                  Report New Grievance
                </a>
              </Button>
            </motion.div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {[
              { label: "Active Reports", value: String(activeReports), icon: Clock, color: "text-blue-500" },
              { label: "Resolved Cases", value: String(resolvedCases), icon: CheckCircle2, color: "text-green-500" },
              { label: "Pending Review", value: String(pendingReview), icon: AlertCircle, color: "text-yellow-500" }
            ].map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="glass-card p-8 flex items-center justify-between border-white/5 bg-white/[0.02]"
              >
                <div>
                  <p className="text-sm text-muted-foreground font-medium mb-1">{stat.label}</p>
                  <p className="text-4xl font-bold tracking-tight">{stat.value}</p>
                </div>
                <div className={`w-14 h-14 rounded-2xl bg-white/[0.03] border border-white/5 flex items-center justify-center ${stat.color}`}>
                  <stat.icon className="w-7 h-7" />
                </div>
              </motion.div>
            ))}
          </div>

          {/* Grid Insights Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
            {/* Trend Chart */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="glass-card border-white/5 bg-white/[0.02] p-8"
            >
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h3 className="text-xl font-bold tracking-tight">Grid Activity Trend</h3>
                  <p className="text-sm text-muted-foreground mt-1">Grievance inflow over the last 7 days</p>
                </div>
                <div className="p-2 rounded-lg bg-blue-500/10 border border-blue-500/20">
                  <Bot className="w-5 h-5 text-blue-500" />
                </div>
              </div>
              
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={getEnhancedTrendData(grievances)}>
                    <defs>
                      <linearGradient id="lineColor" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                    <XAxis 
                      dataKey="date" 
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
                      contentStyle={{ backgroundColor: 'rgba(0, 0, 0, 0.8)', borderColor: 'rgba(255, 255, 255, 0.1)', borderRadius: '12px' }}
                      itemStyle={{ color: '#3b82f6' }}
                    />
                    <Area type="monotone" dataKey="count" stroke="#3b82f6" fillOpacity={1} fill="url(#lineColor)" />
                    <Line 
                      type="monotone" 
                      dataKey="count" 
                      stroke="#3b82f6" 
                      strokeWidth={3}
                      dot={{ r: 4, fill: '#3b82f6', strokeWidth: 2, stroke: '#000' }}
                      activeDot={{ r: 6, fill: '#3b82f6', strokeWidth: 0 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </motion.div>

            {/* Category Chart */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="glass-card border-white/5 bg-white/[0.02] p-8"
            >
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h3 className="text-xl font-bold tracking-tight">Issue Distribution</h3>
                  <p className="text-sm text-muted-foreground mt-1">Common report categories across the grid</p>
                </div>
                <div className="p-2 rounded-lg bg-green-500/10 border border-green-500/20">
                  <Sparkles className="w-5 h-5 text-green-500" />
                </div>
              </div>

              <div className="h-[300px] w-full flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={getCategoryData(grievances)}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={8}
                      dataKey="value"
                    >
                      {getCategoryData(grievances).map((_, index) => (
                        <Cell key={`cell-${index}`} fill={[ '#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6' ][index % 5]} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ backgroundColor: 'rgba(0, 0, 0, 0.8)', borderColor: 'rgba(255, 255, 255, 0.1)', borderRadius: '12px' }}
                    />
                    <Legend 
                      verticalAlign="bottom" 
                      height={36}
                      formatter={(value) => <span className="text-xs text-muted-foreground font-mono uppercase">{value}</span>}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </motion.div>
          </div>

          {/* Filters & Search */}
          <div className="flex flex-col md:flex-row gap-4 mb-8">
            <div className="relative flex-grow">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input 
                placeholder="Search by ID, title or location..." 
                className="pl-12 h-14 bg-white/[0.03] border-white/10 focus:border-blue-500/50 transition-all text-base"
              />
            </div>
            <Button variant="outline" className="h-14 px-6 border-white/10 bg-white/[0.03] hover:bg-white/[0.06] text-base">
              <Filter className="mr-2 h-5 w-5" />
              Filters
            </Button>
          </div>

          {/* Grievances List */}
          <div className="grid grid-cols-1 gap-6">
            {grievances.map((grievance, i) => (
              <motion.div
                key={grievance.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 + i * 0.1 }}
                whileHover={{ y: -4 }}
                className="group"
              >
                <Card className="glass-card border-white/5 bg-white/[0.01] hover:bg-white/[0.03] transition-all overflow-hidden">
                  <div className="absolute top-0 left-0 w-1 h-full bg-blue-500/40 group-hover:bg-blue-500 transition-colors" />
                  <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                    <div className="flex items-center gap-4">
                      <Badge className={`px-3 py-1 text-xs font-bold uppercase tracking-wider border ${getStatusColor(grievance.status)}`}>
                        {grievance.status ? grievance.status.replace(/_/g, " ") : "UNKNOWN"}
                      </Badge>
                      <span className="text-xs font-mono text-muted-foreground/60">{grievance.grid_id}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      {new Date(grievance.created_at).toLocaleDateString()}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-4 gap-8">
                      <div className="md:col-span-3">
                        <CardTitle className="text-2xl font-bold mb-3 group-hover:text-blue-400 transition-colors">
                          {grievance.title}
                        </CardTitle>
                        <p className="text-muted-foreground leading-relaxed">
                          {grievance.description}
                        </p>
                      </div>
                      <div className="flex flex-col justify-center space-y-3">
                        <div className="flex items-center gap-3 text-sm font-medium text-foreground">
                          <MapPin className="h-4 w-4 text-blue-500" />
                          {grievance.location_address || grievance.location || "Location not provided"}
                        </div>
                        <div className="flex items-center gap-3 text-sm text-muted-foreground">
                          <span className="w-2 h-2 rounded-full bg-blue-500/50" />
                          {grievance.category}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="pt-2 border-t border-white/5 flex justify-end">
                    <Button variant="ghost" className="text-blue-500 hover:text-blue-400 hover:bg-transparent p-0 flex items-center group/btn" asChild>
                      <a href={`/track/${grievance.grid_id}`}>
                        View Progress Tracking
                        <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
                      </a>
                    </Button>
                  </CardFooter>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </main>

    </div>
  );
};

export default DashboardPage;
