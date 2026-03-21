import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Activity, Clock, AlertTriangle, CheckCircle2, TrendingUp, BarChart3, RefreshCw, Filter } from "lucide-react";
import { slaService, SLABreachItem } from "@/services/sla.service";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

const SLAMonitoringPage = () => {
  const [breaches, setBreaches] = useState<SLABreachItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const result = await slaService.getSLABreaches();
      setBreaches(result.items);
      setLoading(false);
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-muted-foreground font-mono uppercase tracking-widest text-xs">Loading SLA Data...</p>
        </div>
      </div>
    );
  }

  const criticalBreaches = breaches.filter(b => b.priority === "CRITICAL");

  return (
    <div className="pt-8 lg:pt-32 pb-24 px-6 max-w-7xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6"
      >
        <div>
          <div className="flex items-center gap-3 mb-2">
            <Clock className="w-5 h-5 text-blue-500" />
            <span className="text-xs font-bold text-blue-500 uppercase tracking-widest">Service Level Agreement Monitor</span>
          </div>
          <h1 className="text-4xl font-bold tracking-tight mb-4">SLA Monitoring</h1>
          <p className="text-muted-foreground text-lg">Real-time performance metrics across all city services.</p>
        </div>
        <div className="flex gap-4">
          <div className="px-6 py-3 rounded-2xl bg-white/5 border border-white/10 flex items-center gap-2">
            <Activity className="w-4 h-4 text-green-500" />
            <span className="text-sm font-bold uppercase tracking-widest text-green-500">System Healthy</span>
          </div>
          <Button variant="outline" className="h-12 px-6 border-white/10 bg-white/5">
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
        {[
          { label: "Avg. Response Time", value: "2.4h", icon: Clock, color: "text-blue-500", trend: "+12%" },
          { label: "SLA Compliance", value: "98.2%", icon: CheckCircle2, color: "text-green-500", trend: "+2.4%" },
          { label: "Critical Breaches", value: criticalBreaches.length.toString(), icon: AlertTriangle, color: "text-red-500", trend: "Active" },
          { label: "Active Timers", value: "156", icon: Activity, color: "text-purple-500", trend: "Running" },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="p-8 rounded-3xl bg-white/[0.02] border border-white/5"
          >
            <div className="flex justify-between items-start mb-4">
              <div className={`p-3 rounded-xl bg-white/5 ${stat.color}`}>
                <stat.icon className="w-5 h-5" />
              </div>
              <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Live</span>
            </div>
            <h4 className="text-muted-foreground text-sm font-bold uppercase tracking-widest mb-1">{stat.label}</h4>
            <div className="flex items-end gap-3">
              <span className="text-4xl font-bold">{stat.value}</span>
              <span className="text-xs text-green-500 font-bold mb-1.5">{stat.trend}</span>
            </div>
          </motion.div>
        ))}
      </div>

      {/* SLA Compliance Progress */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
        <Card className="glass-card border-white/5 bg-white/[0.01]">
          <CardHeader>
            <CardTitle className="text-lg font-bold flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 text-green-500" />
              Response SLA
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Compliance Rate</span>
              <span className="text-2xl font-bold text-green-500">94.5%</span>
            </div>
            <Progress value={94.5} className="h-3 bg-white/5" />
            <div className="grid grid-cols-3 gap-4 text-center pt-4">
              <div>
                <p className="text-xl font-bold">1,245</p>
                <p className="text-xs text-muted-foreground">Met</p>
              </div>
              <div>
                <p className="text-xl font-bold text-amber-500">72</p>
                <p className="text-xs text-muted-foreground">At Risk</p>
              </div>
              <div>
                <p className="text-xl font-bold text-red-500">8</p>
                <p className="text-xs text-muted-foreground">Breached</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card border-white/5 bg-white/[0.01]">
          <CardHeader>
            <CardTitle className="text-lg font-bold flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 text-blue-500" />
              Resolution SLA
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Compliance Rate</span>
              <span className="text-2xl font-bold text-amber-500">87.2%</span>
            </div>
            <Progress value={87.2} className="h-3 bg-white/5" />
            <div className="grid grid-cols-3 gap-4 text-center pt-4">
              <div>
                <p className="text-xl font-bold">1,089</p>
                <p className="text-xs text-muted-foreground">Met</p>
              </div>
              <div>
                <p className="text-xl font-bold text-amber-500">142</p>
                <p className="text-xs text-muted-foreground">At Risk</p>
              </div>
              <div>
                <p className="text-xl font-bold text-red-500">94</p>
                <p className="text-xs text-muted-foreground">Breached</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Breaches */}
      <Card className="glass-card p-8 border-white/5 bg-white/[0.01]">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <TrendingUp className="w-6 h-6 text-blue-500" />
            <h3 className="text-2xl font-bold">Recent SLA Breaches</h3>
          </div>
          <Button variant="outline" size="sm" className="border-white/10 bg-white/5">
            <Filter className="w-4 h-4 mr-2" />
            Filter
          </Button>
        </div>

        <div className="space-y-4">
          {breaches.slice(0, 5).map((breach, i) => (
            <motion.div
              key={breach.sla_id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              className="p-4 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-between"
            >
              <div className="flex items-center gap-4">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                  breach.priority === "CRITICAL" ? "bg-red-500/10" : breach.priority === "HIGH" ? "bg-amber-500/10" : "bg-blue-500/10"
                }`}>
                  <AlertTriangle className={`w-5 h-5 ${
                    breach.priority === "CRITICAL" ? "text-red-500" : breach.priority === "HIGH" ? "text-amber-500" : "text-blue-500"
                  }`} />
                </div>
                <div>
                  <p className="font-mono text-xs text-blue-500">{breach.grid_id}</p>
                  <p className="font-bold text-sm">{breach.title}</p>
                  <p className="text-xs text-muted-foreground">{breach.location_address}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <Badge className={`${
                  breach.priority === "CRITICAL" ? "bg-red-500/10 text-red-500 border-red-500/20" : 
                  breach.priority === "HIGH" ? "bg-amber-500/10 text-amber-500 border-amber-500/20" : 
                  "bg-blue-500/10 text-blue-500 border-blue-500/20"
                }`}>
                  {breach.priority}
                </Badge>
                <div className="text-right">
                  <p className="text-xs text-muted-foreground">{breach.sla_type}</p>
                  <p className="text-xs text-red-500 font-bold">Level {breach.escalation_level}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default SLAMonitoringPage;
