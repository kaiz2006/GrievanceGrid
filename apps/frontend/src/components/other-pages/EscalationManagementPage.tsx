import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  AlertTriangle,
  ArrowUpRight,
  Clock,
  User,
  MessageSquare,
  CheckCircle2,
  XCircle,
  Search,
  Filter,
  RefreshCw,
  TrendingUp,
  AlertCircle,
  Bell,
  Send
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface EscalationItem {
  id: string;
  grievance_id: string;
  grid_id: string;
  title: string;
  status: string;
  priority: string;
  escalation_level: number;
  escalated_at: string;
  reason: string;
  assigned_department: string;
  assigned_officer: string | null;
  citizen_name: string;
  days_open: number;
}

const EscalationManagementPage = () => {
  const [escalations, setEscalations] = useState<EscalationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedEscalation, setSelectedEscalation] = useState<EscalationItem | null>(null);
  const [statusFilter, setStatusFilter] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      // Simulating API call
      await new Promise((resolve) => setTimeout(resolve, 400));
      setEscalations([
        {
          id: "esc_001",
          grievance_id: "grievance_101",
          grid_id: "GRI-2026-000101",
          title: "Major water pipeline leak causing flooding",
          status: "ESCALATED",
          priority: "CRITICAL",
          escalation_level: 3,
          escalated_at: new Date(Date.now() - 3600000).toISOString(),
          reason: "SLA breach - No response within 4 hours",
          assigned_department: "Water Department",
          assigned_officer: null,
          citizen_name: "Rajesh Kumar",
          days_open: 2
        },
        {
          id: "esc_002",
          grievance_id: "grievance_102",
          grid_id: "GRI-2026-000102",
          title: "Power outage affecting hospital area",
          status: "IN_PROGRESS",
          priority: "CRITICAL",
          escalation_level: 2,
          escalated_at: new Date(Date.now() - 7200000).toISOString(),
          reason: "Citizen contestation - Unsatisfactory resolution",
          assigned_department: "Electricity Board",
          assigned_officer: "Amit Singh",
          citizen_name: "Priya Sharma",
          days_open: 1
        },
        {
          id: "esc_003",
          grievance_id: "grievance_103",
          grid_id: "GRI-2026-000103",
          title: "Road cave-in on main highway",
          status: "ESCALATED",
          priority: "CRITICAL",
          escalation_level: 3,
          escalated_at: new Date(Date.now() - 1800000).toISOString(),
          reason: "Safety hazard - Immediate attention required",
          assigned_department: "PWD",
          assigned_officer: null,
          citizen_name: "Vikram Patel",
          days_open: 0
        },
        {
          id: "esc_004",
          grievance_id: "grievance_104",
          grid_id: "GRI-2026-000104",
          title: "Contested resolution - Pothole repair",
          status: "CONTESTED",
          priority: "HIGH",
          escalation_level: 1,
          escalated_at: new Date(Date.now() - 5400000).toISOString(),
          reason: "Citizen reports incomplete repair",
          assigned_department: "PWD",
          assigned_officer: "Suresh Verma",
          citizen_name: "Anita Desai",
          days_open: 3
        }
      ]);
      setLoading(false);
    };
    fetchData();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "ESCALATED": return { bg: "bg-red-500/10", text: "text-red-500", border: "border-red-500/20" };
      case "CONTESTED": return { bg: "bg-amber-500/10", text: "text-amber-500", border: "border-amber-500/20" };
      case "IN_PROGRESS": return { bg: "bg-blue-500/10", text: "text-blue-500", border: "border-blue-500/20" };
      default: return { bg: "bg-white/10", text: "text-muted-foreground", border: "border-white/10" };
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "CRITICAL": return "text-red-500";
      case "HIGH": return "text-amber-500";
      default: return "text-blue-500";
    }
  };

  const getEscalationDots = (level: number) => {
    return [...Array(3)].map((_, i) => (
      <div
        key={i}
        className={`w-2.5 h-2.5 rounded-full ${i < level ? "bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]" : "bg-white/10"}`}
      />
    ));
  };

  const filteredEscalations = statusFilter
    ? escalations.filter(e => e.status === statusFilter)
    : escalations;

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-4 border-red-600 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-muted-foreground font-mono uppercase tracking-widest text-xs">Loading Escalations...</p>
        </div>
      </div>
    );
  }

  const criticalCount = escalations.filter(e => e.priority === "CRITICAL").length;
  const unassignedCount = escalations.filter(e => !e.assigned_officer).length;

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <main className="flex-grow pt-8 lg:pt-32 pb-12 px-6 relative overflow-hidden">
        {/* Ambient Glows */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-red-500/5 rounded-full blur-[150px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-purple-500/5 rounded-full blur-[150px] pointer-events-none" />

        <div className="container mx-auto">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-12">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <Bell className="w-5 h-5 text-red-500 animate-pulse" />
                <span className="text-xs font-bold text-red-500 uppercase tracking-widest">Priority Action Queue</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight">Escalation Management</h1>
              <p className="text-muted-foreground mt-2">Handle escalated grievances and contestations requiring immediate attention</p>
            </div>

            <div className="flex gap-4">
              <Button
                variant="outline"
                onClick={() => setStatusFilter(statusFilter ? null : "ESCALATED")}
                className={`h-12 px-6 border-white/10 ${statusFilter === "ESCALATED" ? "bg-red-600/20 border-red-500/30 text-red-500" : "bg-white/5"}`}
              >
                <Filter className="w-4 h-4 mr-2" />
                {statusFilter ? "Clear Filter" : "Escalated Only"}
              </Button>
              <Button className="h-12 px-6 bg-blue-600 hover:bg-blue-500">
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh
              </Button>
            </div>
          </div>

          {/* Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
            {[
              { label: "Total Escalations", value: escalations.length.toString(), icon: ArrowUpRight, color: "text-red-500", trend: "Active" },
              { label: "Critical Priority", value: criticalCount.toString(), icon: AlertTriangle, color: "text-amber-500", trend: "Urgent" },
              { label: "Unassigned", value: unassignedCount.toString(), icon: User, color: "text-purple-500", trend: "Need action" },
              { label: "Contested", value: escalations.filter(e => e.status === "CONTESTED").length.toString(), icon: MessageSquare, color: "text-blue-500", trend: "Under review" },
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
            {/* Escalation List */}
            <div className="lg:col-span-7">
              <Card className="glass-card border-white/5 bg-white/[0.02] overflow-hidden">
                <CardHeader className="border-b border-white/5">
                  <CardTitle className="text-lg font-bold flex items-center gap-3">
                    <AlertCircle className="w-5 h-5 text-red-500" />
                    Active Escalations
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="divide-y divide-white/5">
                    {filteredEscalations.map((escalation, i) => {
                      const statusStyle = getStatusColor(escalation.status);
                      return (
                        <motion.div
                          key={escalation.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.05 }}
                          onClick={() => setSelectedEscalation(escalation)}
                          className={`p-6 hover:bg-white/[0.02] transition-all cursor-pointer ${selectedEscalation?.id === escalation.id ? "bg-white/[0.04]" : ""}`}
                        >
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-2">
                                <span className="font-mono text-xs text-blue-500">{escalation.grid_id}</span>
                                <Badge className={`${statusStyle.bg} ${statusStyle.text} ${statusStyle.border}`}>
                                  {escalation.status}
                                </Badge>
                                <span className={`text-xs font-bold ${getPriorityColor(escalation.priority)}`}>
                                  {escalation.priority}
                                </span>
                              </div>
                              <h4 className="font-bold mb-2">{escalation.title}</h4>
                              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                                <span className="flex items-center gap-1">
                                  <User className="w-3 h-3" />
                                  {escalation.citizen_name}
                                </span>
                                <span className="flex items-center gap-1">
                                  <Clock className="w-3 h-3" />
                                  {escalation.days_open} days open
                                </span>
                              </div>
                            </div>

                            <div className="text-right">
                              <div className="flex items-center gap-1 mb-2 justify-end">
                                {getEscalationDots(escalation.escalation_level)}
                              </div>
                              <p className="text-[10px] text-muted-foreground">Level {escalation.escalation_level}</p>
                              {!escalation.assigned_officer && (
                                <Badge className="mt-2 bg-purple-500/10 text-purple-500 border-purple-500/20 text-[10px]">
                                  Unassigned
                                </Badge>
                              )}
                            </div>
                          </div>

                          {/* Reason */}
                          <div className="mt-4 p-3 rounded-xl bg-red-500/5 border border-red-500/10">
                            <p className="text-xs text-red-400">
                              <span className="font-bold">Reason:</span> {escalation.reason}
                            </p>
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
              {/* Selected Escalation Details */}
              {selectedEscalation ? (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <Card className="glass-card border-white/5 bg-white/[0.02]">
                    <CardHeader className="border-b border-white/5">
                      <CardTitle className="text-lg font-bold flex items-center justify-between">
                        <span>Escalation Details</span>
                        <div className="flex items-center gap-1">
                          {getEscalationDots(selectedEscalation.escalation_level)}
                        </div>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-6 space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="p-4 rounded-2xl bg-white/5">
                          <p className="text-[10px] text-muted-foreground uppercase tracking-widest mb-1">Department</p>
                          <p className="text-sm font-bold">{selectedEscalation.assigned_department}</p>
                        </div>
                        <div className="p-4 rounded-2xl bg-white/5">
                          <p className="text-[10px] text-muted-foreground uppercase tracking-widest mb-1">Assigned Officer</p>
                          <p className="text-sm font-bold">{selectedEscalation.assigned_officer || "Unassigned"}</p>
                        </div>
                      </div>

                      <div className="p-4 rounded-2xl bg-red-500/5 border border-red-500/10">
                        <p className="text-[10px] text-red-500 uppercase tracking-widest mb-2">Escalation Reason</p>
                        <p className="text-sm">{selectedEscalation.reason}</p>
                      </div>

                      <div className="p-4 rounded-2xl bg-white/5">
                        <p className="text-[10px] text-muted-foreground uppercase tracking-widest mb-2">Escalated At</p>
                        <p className="text-sm font-bold">
                          {new Date(selectedEscalation.escalated_at).toLocaleString()}
                        </p>
                      </div>

                      <div className="flex gap-3">
                        <Button className="flex-1 h-12 bg-green-600 hover:bg-green-500">
                          <CheckCircle2 className="w-4 h-4 mr-2" />
                          Resolve
                        </Button>
                        <Button variant="outline" className="flex-1 h-12 border-red-500/30 bg-red-500/10 hover:bg-red-500/20 text-red-500">
                          <ArrowUpRight className="w-4 h-4 mr-2" />
                          Escalate Up
                        </Button>
                      </div>

                      <Link to={`/admin/grievances/${selectedEscalation.grievance_id}`}>
                        <Button variant="outline" className="w-full h-12 border-white/10 bg-white/5">
                          View Full Grievance
                        </Button>
                      </Link>
                    </CardContent>
                  </Card>
                </motion.div>
              ) : (
                <Card className="glass-card border-white/5 bg-white/[0.02] p-8 text-center">
                  <AlertCircle className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
                  <p className="text-muted-foreground">Select an escalation to view details</p>
                </Card>
              )}

              {/* Quick Actions */}
              <Card className="glass-card border-white/5 bg-white/[0.02] p-6">
                <h4 className="text-sm font-bold uppercase tracking-widest mb-4">Quick Actions</h4>
                <div className="space-y-3">
                  <Button variant="outline" className="w-full h-12 justify-start border-white/10 bg-white/5">
                    <Send className="w-4 h-4 mr-3 text-blue-500" />
                    Send Bulk Notifications
                  </Button>
                  <Button variant="outline" className="w-full h-12 justify-start border-white/10 bg-white/5">
                    <User className="w-4 h-4 mr-3 text-purple-500" />
                    Auto-Assign Officers
                  </Button>
                  <Button variant="outline" className="w-full h-12 justify-start border-white/10 bg-white/5">
                    <TrendingUp className="w-4 h-4 mr-3 text-green-500" />
                    Generate Report
                  </Button>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default EscalationManagementPage;
