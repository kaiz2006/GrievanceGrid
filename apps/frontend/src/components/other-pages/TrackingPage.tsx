import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useParams } from "react-router-dom";
import { 
  CheckCircle2, 
  Clock, 
  MapPin, 
  Phone, 
  MessageSquare, 
  AlertCircle,
  ChevronRight,
  TrendingUp,
  ShieldCheck,
  ArrowUpRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { grievanceService } from "@/services/grievance.service";

const TrackingPage = () => {
  const { grid_id } = useParams();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (grid_id) {
        const result = await grievanceService.getTrack(grid_id);
        setData(result);
        setLoading(false);
      }
    };
    fetchData();
  }, [grid_id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-muted-foreground font-mono uppercase tracking-widest text-xs">Accessing Grid Node...</p>
        </div>
      </div>
    );
  }

  const timelineEvents = data.timeline;
  const slaProgress = 65; // Mock progress

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      
      <main className="flex-grow pt-32 pb-12 px-6 relative overflow-hidden">
        {/* Ambient Glows */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[150px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-[150px] pointer-events-none" />

        <div className="container mx-auto">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-12">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <Badge className="bg-blue-600 hover:bg-blue-500 text-white px-3 py-1 text-xs font-bold tracking-widest uppercase">
                  ACTIVE CASE
                </Badge>
                <span className="text-muted-foreground font-mono text-sm">{grid_id || "GRV-9901"}</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight">Tracking Resolution</h1>
            </div>
            
            <div className="flex items-center gap-4">
              <Button variant="outline" className="h-14 px-8 border-white/10 bg-white/[0.03] hover:bg-white/[0.06]">
                <MessageSquare className="mr-2 h-5 w-5" />
                Contact Support
              </Button>
              <Button className="cta-button-primary h-14 px-8 shadow-[0_0_20px_rgba(59,130,246,0.3)]">
                Escalate Ticket
                <AlertCircle className="ml-2 h-5 w-5" />
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Timeline Column */}
            <div className="lg:col-span-8">
              <div className="glass-card p-8 md:p-12 border-white/5 bg-white/[0.02]">
                <h3 className="text-2xl font-bold mb-10 flex items-center gap-3">
                  <TrendingUp className="text-blue-500" />
                  Status Timeline
                </h3>

                <div className="relative space-y-0">
                  <div className="absolute left-[27px] top-2 bottom-2 w-0.5 bg-white/5" />
                  
                  {timelineEvents.map((event, i) => (
                    <motion.div
                      key={event.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.1 }}
                      className="relative pl-20 pb-12 last:pb-0"
                    >
                      {/* Node Icon */}
                      <div className={`absolute left-0 top-0 w-14 h-14 rounded-2xl flex items-center justify-center border-2 z-10 transition-all duration-500 ${
                        event.status === "completed" 
                          ? "bg-green-500/10 border-green-500/20 text-green-500" 
                          : event.status === "current"
                          ? "bg-blue-600 border-blue-600 text-white shadow-[0_0_15px_rgba(37,99,235,0.4)]"
                          : "bg-background border-white/10 text-muted-foreground/30"
                      }`}>
                        {event.status === "completed" ? (
                          <CheckCircle2 className="w-7 h-7" />
                        ) : event.status === "current" ? (
                          <Clock className="w-7 h-7 animate-pulse" />
                        ) : (
                          <div className="w-3 h-3 rounded-full bg-current" />
                        )}
                      </div>

                      {/* Content */}
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <h4 className={`text-xl font-bold ${event.status === "pending" ? "text-muted-foreground/40" : "text-foreground"}`}>
                            {event.title}
                          </h4>
                          <span className="text-sm font-mono text-muted-foreground/60">{event.date}</span>
                        </div>
                        <p className={`text-base leading-relaxed ${event.status === "pending" ? "text-muted-foreground/20" : "text-muted-foreground"}`}>
                          {event.description}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>

            {/* Sidebar Column */}
            <div className="lg:col-span-4 space-y-8">
              {/* SLA Card */}
              <Card className="glass-card border-white/5 bg-white/[0.02] overflow-hidden">
                <CardHeader className="pb-4">
                  <CardTitle className="text-lg font-bold uppercase tracking-widest text-blue-500 flex items-center justify-between">
                    SLA Countdown
                    <Clock className="h-5 w-5" />
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="text-center py-4">
                    <p className="text-5xl font-bold tracking-tighter mb-2">08:42:15</p>
                    <p className="text-sm text-muted-foreground font-medium uppercase tracking-[0.2em]">Estimated Resolution Time</p>
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between text-xs font-bold uppercase tracking-widest">
                      <span className="text-muted-foreground">Progress</span>
                      <span className="text-blue-500">65%</span>
                    </div>
                    <Progress value={slaProgress} className="h-3 bg-white/5" />
                  </div>
                  <p className="text-xs text-muted-foreground/60 leading-relaxed italic">
                    Resolution guaranteed within 24 hours as per City Council SLA Protocol V2.1.
                  </p>
                </CardContent>
              </Card>

              {/* Assignment Card */}
              <Card className="glass-card border-white/5 bg-white/[0.02] overflow-hidden group">
                <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                  <ArrowUpRight className="h-5 w-5 text-blue-500" />
                </div>
                <CardHeader>
                  <CardTitle className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Assigned Team</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-2xl bg-white/[0.05] border border-white/10 flex items-center justify-center overflow-hidden">
                      <img 
                        src="https://api.dicebear.com/7.x/avataaars/svg?seed=Rajesh" 
                        alt="Officer" 
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <h4 className="font-bold text-lg">Rajesh Kumar</h4>
                      <p className="text-sm text-muted-foreground">Lead Technical Officer</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <Button variant="outline" className="h-12 border-white/10 bg-white/[0.03] hover:bg-white/[0.06]">
                      <Phone className="mr-2 h-4 w-4 text-blue-500" />
                      Call
                    </Button>
                    <Button variant="outline" className="h-12 border-white/10 bg-white/[0.03] hover:bg-white/[0.06]">
                      <MapPin className="mr-2 h-4 w-4 text-blue-500" />
                      Live Map
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Security Badge */}
              <div className="p-6 rounded-3xl bg-blue-500/5 border border-blue-500/10 flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-blue-500/10 flex items-center justify-center shrink-0 border border-blue-500/20">
                  <ShieldCheck className="w-6 h-6 text-blue-500" />
                </div>
                <p className="text-xs text-blue-500/80 leading-relaxed font-medium">
                  Resolution updates are cryptographically signed and stored on the city ledger for full transparency.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

    </div>
  );
};

export default TrackingPage;
