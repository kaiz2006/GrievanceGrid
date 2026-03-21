import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  AlertTriangle,
  Clock,
  TrendingUp,
  Search,
  Filter,
  RefreshCw,
  MapPin,
  ArrowUpRight,
  AlertCircle,
  CheckCircle2,
  XCircle,
  ChevronRight,
  Zap
} from "lucide-react";
import { slaService, SLABreachItem } from "@/services/sla.service";
import MapComponent from "../map/MapComponent";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

const SLABreachPage = () => {
  const [breaches, setBreaches] = useState<SLABreachItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedBreach, setSelectedBreach] = useState<SLABreachItem | null>(null);
  const [filterPriority, setFilterPriority] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const result = await slaService.getSLABreaches();
      setBreaches(result.items);
      setLoading(false);
    };
    fetchData();
  }, []);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "CRITICAL": return { bg: "bg-red-500/10", text: "text-red-500", border: "border-red-500/20" };
      case "HIGH": return { bg: "bg-amber-500/10", text: "text-amber-500", border: "border-amber-500/20" };
      case "MEDIUM": return { bg: "bg-blue-500/10", text: "text-blue-500", border: "border-blue-500/20" };
      default: return { bg: "bg-white/10", text: "text-muted-foreground", border: "border-white/10" };
    }
  };

  const getEscalationLevel = (level: number) => {
    const levels = [];
    for (let i = 0; i < 3; i++) {
      levels.push(
        <div
          key={i}
          className={`w-2 h-2 rounded-full ${i < level ? "bg-red-500" : "bg-white/10"}`}
        />
      );
    }
    return levels;
  };

  const getTimeOverdue = (deadline: string) => {
    const diff = Date.now() - new Date(deadline).getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    if (hours > 0) return `${hours}h ${minutes}m overdue`;
    return `${minutes}m overdue`;
  };

  const filteredBreaches = filterPriority
    ? breaches.filter(b => b.priority === filterPriority)
    : breaches;

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-4 border-red-600 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-muted-foreground font-mono uppercase tracking-widest text-xs">Loading SLA Breaches...</p>
        </div>
      </div>
    );
  }

  const criticalCount = breaches.filter(b => b.priority === "CRITICAL").length;
  const escalatedCount = breaches.filter(b => b.status === "ESCALATED").length;

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <main className="flex-grow pt-8 lg:pt-32 pb-12 px-6 relative overflow-hidden">
        {/* Ambient Glows */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-red-500/5 rounded-full blur-[150px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-amber-500/5 rounded-full blur-[150px] pointer-events-none" />

        <div className="container mx-auto">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-12">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <AlertTriangle className="w-5 h-5 text-red-500" />
                <span className="text-xs font-bold text-red-500 uppercase tracking-widest">SLA Enforcement System</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight">SLA Breach Monitor</h1>
              <p className="text-muted-foreground mt-2">Real-time tracking of service level agreement violations</p>
            </div>

            <div className="flex gap-4">
              <Button
                variant="outline"
                onClick={() => setFilterPriority(filterPriority ? null : "CRITICAL")}
                className={`h-12 px-6 border-white/10 ${filterPriority ? "bg-red-600/20 border-red-500/30 text-red-500" : "bg-white/5"}`}
              >
                <Filter className="w-4 h-4 mr-2" />
                {filterPriority ? "Clear Filter" : "Critical Only"}
              </Button>
            </div>
          </div>

          {/* Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
            {[
              { label: "Total Breaches", value: breaches.length.toString(), icon: AlertCircle, color: "text-red-500", trend: "Active" },
              { label: "Critical Priority", value: criticalCount.toString(), icon: Zap, color: "text-amber-500", trend: "Immediate" },
              { label: "Escalated", value: escalatedCount.toString(), icon: ArrowUpRight, color: "text-purple-500", trend: "To seniors" },
              { label: "Avg Overdue", value: "2.4h", icon: Clock, color: "text-blue-500", trend: "Response time" },
            ].map((metric, i) => (
              <motion.div
                key={metric.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="p-8 rounded-3xl bg-white/[0.02] border border-white/5 relative overflow-hidden group"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className={`p-3 rounded-xl bg-white/5 ${metric.color}`}>
                    <metric.icon className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{metric.trend}</span>
                </div>
                <h4 className="text-muted-foreground text-xs font-bold uppercase tracking-widest mb-1">{metric.label}</h4>
                <p className={`text-3xl font-bold tracking-tight ${metric.color}`}>{metric.value}</p>
              </motion.div>
            ))}
          </div>

          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Breach List */}
            <div className="lg:col-span-7">
              <Card className="glass-card border-white/5 bg-white/[0.02] overflow-hidden">
                <CardHeader className="border-b border-white/5">
                  <CardTitle className="text-lg font-bold flex items-center gap-3">
                    <Clock className="w-5 h-5 text-red-500" />
                    Active Breaches
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="divide-y divide-white/5">
                    {filteredBreaches.map((breach, i) => {
                      const priorityStyle = getPriorityColor(breach.priority);
                      return (
                        <motion.div
                          key={breach.sla_id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.05 }}
                          onClick={() => setSelectedBreach(breach)}
                          className={`p-6 hover:bg-white/[0.02] transition-all cursor-pointer ${selectedBreach?.sla_id === breach.sla_id ? "bg-white/[0.04]" : ""}`}
                        >
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-2">
                                <span className="font-mono text-xs text-blue-500">{breach.grid_id}</span>
                                <Badge className={`${priorityStyle.bg} ${priorityStyle.text} ${priorityStyle.border}`}>
                                  {breach.priority}
                                </Badge>
                                {breach.status === "ESCALATED" && (
                                  <Badge className="bg-purple-500/10 text-purple-500 border-purple-500/20">
                                    <ArrowUpRight className="w-3 h-3 mr-1" />
                                    Escalated
                                  </Badge>
                                )}
                              </div>
                              <h4 className="font-bold mb-1">{breach.title}</h4>
                              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                                <span className="flex items-center gap-1">
                                  <MapPin className="w-3 h-3" />
                                  {breach.location_address}
                                </span>
                              </div>
                            </div>

                            <div className="text-right">
                              <p className="text-xs text-red-500 font-bold">{getTimeOverdue(breach.deadline_at)}</p>
                              <div className="flex items-center gap-1 mt-2 justify-end">
                                <span className="text-[10px] text-muted-foreground mr-1">Esc Lvl:</span>
                                {getEscalationLevel(breach.escalation_level)}
                              </div>
                            </div>
                          </div>

                          {/* Progress Bar showing time elapsed */}
                          <div className="mt-4">
                            <div className="flex justify-between text-[10px] text-muted-foreground mb-1">
                              <span>{breach.sla_type} SLA</span>
                              <span className="text-red-500">Breached</span>
                            </div>
                            <Progress value={100} className="h-1.5 bg-white/5 [&>div]:bg-red-500" />
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right Column */}
            <div className="lg:col-span-5 space-y-6">
              {/* Map */}
              <Card className="glass-card border-white/5 bg-white/[0.02] overflow-hidden">
                <CardHeader className="border-b border-white/5">
                  <CardTitle className="text-lg font-bold flex items-center gap-3">
                    <MapPin className="w-5 h-5 text-blue-500" />
                    Breach Locations
                  </CardTitle>
                </CardHeader>
                <div className="h-[250px]">
                  <MapComponent
                    center={[28.6139, 77.2090]}
                    zoom={12}
                    markers={breaches.slice(0, 5).map(b => ({
                      position: [28.6 + Math.random() * 0.05, 77.2 + Math.random() * 0.05],
                      popupContent: `${b.grid_id}: ${b.priority}`
                    }))}
                    className="w-full h-full"
                  />
                </div>
              </Card>

              {/* Selected Breach Details */}
              {selectedBreach && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <Card className="glass-card border-white/5 bg-white/[0.02]">
                    <CardHeader className="border-b border-white/5">
                      <CardTitle className="text-lg font-bold">Breach Details</CardTitle>
                    </CardHeader>
                    <CardContent className="p-6 space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="p-4 rounded-2xl bg-white/5">
                          <p className="text-[10px] text-muted-foreground uppercase tracking-widest mb-1">SLA Type</p>
                          <p className="text-sm font-bold">{selectedBreach.sla_type}</p>
                        </div>
                        <div className="p-4 rounded-2xl bg-white/5">
                          <p className="text-[10px] text-muted-foreground uppercase tracking-widest mb-1">Escalation</p>
                          <div className="flex items-center gap-1">
                            {getEscalationLevel(selectedBreach.escalation_level)}
                            <span className="text-sm font-bold ml-2">Level {selectedBreach.escalation_level}</span>
                          </div>
                        </div>
                      </div>

                      <div className="p-4 rounded-2xl bg-red-500/5 border border-red-500/10">
                        <p className="text-[10px] text-red-500 uppercase tracking-widest mb-1">Deadline</p>
                        <p className="text-sm font-bold">
                          {new Date(selectedBreach.deadline_at).toLocaleString()}
                        </p>
                        <p className="text-xs text-red-400 mt-1">{getTimeOverdue(selectedBreach.deadline_at)}</p>
                      </div>

                      <div className="flex gap-3">
                        <Button className="flex-1 h-12 bg-red-600 hover:bg-red-500">
                          <ArrowUpRight className="w-4 h-4 mr-2" />
                          Escalate
                        </Button>
                        <Button variant="outline" className="flex-1 h-12 border-white/10 bg-white/5">
                          <ChevronRight className="w-4 h-4 mr-2" />
                          View Grievance
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )}

              {/* Quick Stats */}
              <Card className="glass-card border-white/5 bg-white/[0.02] p-6">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-sm font-bold uppercase tracking-widest">SLA Compliance</h4>
                  <TrendingUp className="w-4 h-4 text-green-500" />
                </div>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-muted-foreground">Response SLA</span>
                      <span className="text-green-500 font-bold">94.5%</span>
                    </div>
                    <Progress value={94.5} className="h-2 bg-white/5 [&>div]:bg-green-500" />
                  </div>
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-muted-foreground">Resolution SLA</span>
                      <span className="text-amber-500 font-bold">87.2%</span>
                    </div>
                    <Progress value={87.2} className="h-2 bg-white/5 [&>div]:bg-amber-500" />
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default SLABreachPage;
