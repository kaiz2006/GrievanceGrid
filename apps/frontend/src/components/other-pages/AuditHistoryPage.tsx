import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useParams, Link } from "react-router-dom";
import {
  History,
  Clock,
  User,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Zap,
  ChevronLeft,
  Terminal,
  ShieldCheck,
  Cpu,
  Activity
} from "lucide-react";
import { auditService, AuditEvent } from "@/services/audit.service";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const AuditHistoryPage = () => {
  const { grievance_id } = useParams();
  const [events, setEvents] = useState<AuditEvent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      // DEMO MODE: Detailed audit trail for demonstration
      await new Promise(resolve => setTimeout(resolve, 700));
      
      const demoEvents: AuditEvent[] = [
        {
          id: "ev_1",
          grievance_id: grievance_id || "GRI-2026-1234",
          event_type: "RESOLVED",
          old_status: "IN_PROGRESS",
          new_status: "RESOLVED",
          description: "Final verification complete. Engineering team confirmed structural stability and safety compliance.",
          actor_name: "Senior Auditor Sharma",
          created_at: new Date(Date.now() - 3600000 * 2).toISOString()
        },
        {
          id: "ev_2",
          grievance_id: grievance_id || "GRI-2026-1234",
          event_type: "IN_PROGRESS",
          old_status: "ROUTED",
          new_status: "IN_PROGRESS",
          description: "Dispatch team arrived on site. Commencing structural scanning and reinforcement.",
          actor_name: "Field Officer Kamal",
          created_at: new Date(Date.now() - 3600000 * 12).toISOString()
        },
        {
          id: "ev_3",
          grievance_id: grievance_id || "GRI-2026-1234",
          event_type: "ROUTED",
          old_status: "AI_PROCESSED",
          new_status: "ROUTED",
          description: "Automatically routed to Department of Bridge Engineering based on geo-spatial severity.",
          actor_name: "GrievanceGrid AI Core",
          created_at: new Date(Date.now() - 3600000 * 14).toISOString()
        },
        {
          id: "ev_4",
          grievance_id: grievance_id || "GRI-2026-1234",
          event_type: "AI_PROCESSED",
          old_status: "CREATED",
          new_status: "AI_PROCESSED",
          description: "NLP Analysis: Critical structural risk identified. Sentiment: Urgent. Priority set to CRITICAL.",
          actor_name: "GrievanceGrid AI Core",
          created_at: new Date(Date.now() - 3600000 * 15).toISOString()
        },
        {
          id: "ev_5",
          grievance_id: grievance_id || "GRI-2026-1234",
          event_type: "CREATED",
          old_status: null,
          new_status: "CREATED",
          description: "Grievance submitted via Citizen Mobile App with high-res photo evidence.",
          actor_name: "Anonymous Citizen",
          created_at: new Date(Date.now() - 3600000 * 16).toISOString()
        }
      ];
      
      setEvents(demoEvents);
      setLoading(false);
    };
    fetchData();
  }, [grievance_id]);

  const getEventIcon = (eventType: string) => {
    switch (eventType) {
      case "CREATED": return CheckCircle2;
      case "AI_PROCESSED": return Cpu;
      case "ROUTED": return Zap;
      case "IN_PROGRESS": return Activity;
      case "CONTESTED": return AlertCircle;
      case "RESOLVED": return ShieldCheck;
      default: return History;
    }
  };

  const getEventColor = (eventType: string) => {
    switch (eventType) {
      case "CREATED": return "bg-blue-500/10 text-blue-500 border-blue-500/20";
      case "AI_PROCESSED": return "bg-purple-500/10 text-purple-500 border-purple-500/20";
      case "ROUTED": return "bg-amber-500/10 text-amber-500 border-amber-500/20";
      case "IN_PROGRESS": return "bg-cyan-500/10 text-cyan-500 border-cyan-500/20";
      case "CONTESTED": return "bg-red-500/10 text-red-500 border-red-500/20";
      case "RESOLVED": return "bg-green-500/10 text-green-500 border-green-500/20";
      default: return "bg-white/10 text-muted-foreground border-white/10";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-muted-foreground font-mono uppercase tracking-widest text-xs">Loading Audit Trail...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <main className="flex-grow pt-8 lg:pt-32 pb-12 px-6 relative overflow-hidden">
        {/* Ambient Glows */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-[150px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-purple-500/5 rounded-full blur-[150px] pointer-events-none" />

        <div className="container mx-auto max-w-4xl">
          {/* Header */}
          <div className="flex items-center gap-6 mb-12">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <History className="w-5 h-5 text-blue-500" />
                <span className="text-xs font-bold text-blue-500 uppercase tracking-widest">Immutable Audit Trail</span>
              </div>
              <h1 className="text-3xl md:text-4xl font-bold tracking-tight">Grievance Audit History</h1>
            </div>
            <Badge className="px-4 py-2 bg-blue-500/10 text-blue-500 border-blue-500/20">
              {events.length} Events
            </Badge>
          </div>

          {/* Grievance ID Card */}
          <Card className="glass-card border-white/5 bg-white/[0.02] mb-8">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[10px] text-muted-foreground uppercase tracking-widest mb-1">Grievance ID</p>
                  <p className="font-mono text-lg font-bold text-blue-500">{grievance_id}</p>
                </div>
                <div className="flex gap-4">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-green-500">
                      {events.filter(e => e.event_type === "RESOLVED").length}
                    </p>
                    <p className="text-[10px] text-muted-foreground uppercase">Resolved</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-red-500">
                      {events.filter(e => e.event_type === "CONTESTED").length}
                    </p>
                    <p className="text-[10px] text-muted-foreground uppercase">Contested</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Timeline */}
          <div className="relative">
            {/* Vertical Line */}
            <div className="absolute left-7 top-0 bottom-0 w-0.5 bg-white/5" />

            <div className="space-y-6">
              {events.map((event, i) => {
                const IconComponent = getEventIcon(event.event_type);
                return (
                  <motion.div
                    key={event.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="relative pl-20"
                  >
                    {/* Timeline Node */}
                    <div className={`absolute left-0 w-14 h-14 rounded-2xl flex items-center justify-center border ${getEventColor(event.event_type)}`}>
                      <IconComponent className="w-6 h-6" />
                    </div>

                    {/* Event Card */}
                    <Card className="glass-card border-white/5 bg-white/[0.02]">
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <div className="flex items-center gap-3 mb-1">
                              <h4 className="font-bold">{event.event_type.replace(/_/g, " ")}</h4>
                              {event.old_status && event.new_status && (
                                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                  <Badge variant="outline" className="text-[10px]">{event.old_status}</Badge>
                                  <ArrowRight className="w-3 h-3" />
                                  <Badge variant="outline" className="text-[10px]">{event.new_status}</Badge>
                                </div>
                              )}
                            </div>
                            <p className="text-sm text-muted-foreground">{event.description}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-xs text-muted-foreground flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {new Date(event.created_at).toLocaleTimeString()}
                            </p>
                            <p className="text-[10px] text-muted-foreground/60">
                              {new Date(event.created_at).toLocaleDateString()}
                            </p>
                          </div>
                        </div>

                        {/* Actor */}
                        <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5">
                          <div className="w-8 h-8 rounded-full bg-blue-500/10 flex items-center justify-center">
                            <User className="w-4 h-4 text-blue-500" />
                          </div>
                          <div>
                            <p className="text-xs font-bold">{event.actor_name}</p>
                            <p className="text-[10px] text-muted-foreground">Actor</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* Terminal View */}
          <Card className="glass-card border-white/5 bg-black/40 mt-8">
            <CardHeader className="border-b border-white/5">
              <CardTitle className="text-sm font-bold flex items-center gap-3">
                <Terminal className="w-4 h-4 text-green-500" />
                Raw Audit Log
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 font-mono text-xs text-muted-foreground">
              <div className="space-y-2">
                {events.map((event) => (
                  <div key={event.id} className="flex gap-4">
                    <span className="text-blue-500/60">{new Date(event.created_at).toISOString()}</span>
                    <span className="text-amber-500/60">[{event.event_type}]</span>
                    <span>{event.description}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default AuditHistoryPage;
