import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import {
  FileText,
  Clock,
  CheckCircle2,
  AlertCircle,
  Search,
  Filter,
  ArrowRight,
  MapPin,
  Calendar,
  Star,
  MessageSquare,
  Plus,
  XCircle,
  RotateCcw
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { grievanceService } from "@/services/grievance.service";
import GrievanceSLA from "@/components/GrievanceSLA";

interface Grievance {
  id: string;
  grid_id: string;
  title: string;
  category: string;
  status: string;
  priority: string;
  description: string;
  location: string;
  created_at: string;
  resolved_at?: string;
  can_feedback: boolean;
  can_contest: boolean;
}

const MyGrievancesPage = () => {
  const [grievances, setGrievances] = useState<Grievance[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const result = await grievanceService.getMyGrievances();
      const mapped = ((result as any).grievances || (result as any).items || []).map((g: any) => ({
        id: g.id,
        grid_id: g.grid_id,
        title: g.title,
        category: g.category,
        status: g.status,
        priority: g.priority,
        description: g.description,
        location: g.location?.address || "Selected Location",
        created_at: g.created_at || new Date().toISOString(),
        can_feedback: g.status === "RESOLVED",
        can_contest: g.status === "RESOLVED"
      }));
      setGrievances(mapped);
      setLoading(false);
    };
    fetchData();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "RESOLVED":
        return "text-green-500 bg-green-500/10 border-green-500/20";
      case "IN_PROGRESS":
        return "text-blue-500 bg-blue-500/10 border-blue-500/20";
      case "PENDING":
        return "text-amber-500 bg-amber-500/10 border-amber-500/20";
      case "CONTESTED":
        return "text-red-500 bg-red-500/10 border-red-500/20";
      default:
        return "text-muted-foreground bg-white/5 border-white/10";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "RESOLVED":
        return CheckCircle2;
      case "IN_PROGRESS":
        return Clock;
      case "CONTESTED":
        return XCircle;
      default:
        return AlertCircle;
    }
  };

  const filteredGrievances = grievances.filter((g) => {
    const matchesSearch =
      g.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      g.grid_id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || g.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const stats = {
    total: grievances.length,
    active: grievances.filter((g) => g.status !== "RESOLVED").length,
    resolved: grievances.filter((g) => g.status === "RESOLVED").length,
    feedbackPending: grievances.filter((g) => g.can_feedback).length,
  };

    const navigate = useNavigate();
    const [quickTrackId, setQuickTrackId] = useState("");

    const handleQuickTrack = (e: React.FormEvent) => {
        e.preventDefault();
        if (quickTrackId.trim()) {
            navigate(`/track/${quickTrackId.trim()}`);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="text-center space-y-4">
                    <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto" />
                    <p className="text-muted-foreground font-mono uppercase tracking-widest text-xs">Loading Your Grievances...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background text-foreground flex flex-col">
            <main className="flex-grow pt-8 lg:pt-32 pb-12 px-6 relative overflow-hidden">
                {/* Background Grid & Glows */}
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] pointer-events-none" />
                <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-blue-500/10 rounded-full blur-[160px] pointer-events-none" />
                <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-emerald-500/10 rounded-full blur-[140px] pointer-events-none" />

                <div className="container mx-auto max-w-6xl relative z-10">
                    {/* Header */}
                    <div className="flex flex-col md:flex-row md:items-start justify-between gap-8 mb-16">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                        >
                            <div className="flex items-center gap-3 mb-4">
                                <div className="p-2 rounded-xl bg-blue-500/10 border border-blue-500/20 glow-citizen">
                                    <FileText className="w-5 h-5 text-blue-500" />
                                </div>
                                <span className="text-xs font-bold text-blue-500 uppercase tracking-widest">Citizen Command Center</span>
                            </div>
                            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tighter mb-4">
                                Hello, <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400 italic">Citizen</span>
                            </h1>
                            <p className="text-muted-foreground text-lg max-w-md leading-relaxed">
                                You have <span className="text-white font-bold">{stats.active} active reports</span> ensuring the integrity of our city grid.
                            </p>
                        </motion.div>

                        <div className="flex flex-col gap-4">
                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="p-6 rounded-3xl bg-white/[0.02] border border-white/5 glow-citizen px-8"
                            >
                                <p className="text-[10px] text-muted-foreground uppercase font-black tracking-[0.2em] mb-1">Community Impact</p>
                                <p className="text-3xl font-black text-emerald-400 font-mono tracking-tighter">
                                    +{stats.resolved * 12} <span className="text-xs uppercase ml-1 opacity-60">Citizen Credits</span>
                                </p>
                            </motion.div>
                            <Button className="h-14 px-8 bg-blue-600 hover:bg-blue-500 rounded-2xl shadow-[0_0_20px_rgba(59,130,246,0.3)] transition-all hover:scale-105 active:scale-95" asChild>
                                <Link to="/submit">
                                    <Plus className="w-5 h-5 mr-2" />
                                    Report New Failure
                                </Link>
                            </Button>
                        </div>
                    </div>

                    {/* Quick Track Card */}
                    <Card className="glass-card border-blue-500/20 bg-blue-500/5 mb-12 overflow-hidden relative">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl -mr-16 -mt-16" />
                        <CardContent className="p-8">
                            <div className="flex flex-col md:flex-row items-center gap-6">
                                <div className="flex-1 space-y-2">
                                    <h3 className="text-xl font-bold">Quick Track</h3>
                                    <p className="text-sm text-muted-foreground">Have a specific Grid ID? Enter it here to see live updates.</p>
                                </div>
                                <form onSubmit={handleQuickTrack} className="flex-1 w-full flex flex-col sm:flex-row gap-3">
                                    <Input
                                        placeholder="EX: GRI-2026-000102"
                                        value={quickTrackId}
                                        onChange={(e) => setQuickTrackId(e.target.value)}
                                        className="h-12 bg-white/5 border-white/10 font-mono"
                                    />
                                    <Button type="submit" className="h-12 px-8 bg-blue-600 hover:bg-blue-500 shrink-0">
                                        Track Now
                                        <ArrowRight className="w-4 h-4 ml-2" />
                                    </Button>
                                </form>
                            </div>
                        </CardContent>
                    </Card>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
            {[
              { label: "Total Reports", value: stats.total, icon: FileText, color: "text-blue-500" },
              { label: "Active", value: stats.active, icon: Clock, color: "text-amber-500" },
              { label: "Resolved", value: stats.resolved, icon: CheckCircle2, color: "text-green-500" },
              { label: "Feedback Pending", value: stats.feedbackPending, icon: Star, color: "text-purple-500" },
            ].map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="p-6 rounded-3xl bg-white/[0.02] border border-white/5"
              >
                <div className={`p-3 rounded-xl bg-white/5 w-fit mb-4 ${stat.color}`}>
                  <stat.icon className="w-5 h-5" />
                </div>
                <p className="text-muted-foreground text-xs font-bold uppercase tracking-widest">{stat.label}</p>
                <p className={`text-3xl font-bold tracking-tight ${stat.color}`}>{stat.value}</p>
              </motion.div>
            ))}
          </div>

          {/* Filters */}
          <div className="flex flex-col md:flex-row gap-6 mb-12">
            <div className="relative flex-grow group">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-blue-500 transition-colors" />
              <Input
                placeholder="Search by title, location or Grid ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-14 h-16 bg-white/[0.03] border-white/10 rounded-2xl focus:border-blue-500/50 transition-all text-lg shadow-inner"
              />
            </div>
            <div className="flex bg-white/[0.02] p-1.5 rounded-2xl border border-white/5 backdrop-blur-md">
              {["all", "IN_PROGRESS", "RESOLVED", "PENDING"].map((status) => (
                <button
                  key={status}
                  onClick={() => setStatusFilter(status)}
                  className={`px-6 py-3 rounded-xl text-xs font-bold uppercase tracking-widest transition-all ${
                    statusFilter === status
                      ? "bg-blue-600 text-white shadow-[0_0_15px_rgba(59,130,246,0.4)]"
                      : "text-muted-foreground hover:text-white hover:bg-white/5"
                  }`}
                >
                  {status === "all" ? "All" : status.replace("_", " ")}
                </button>
              ))}
            </div>
          </div>

          {/* Grievances List */}
          <div className="grid grid-cols-1 gap-6">
            {filteredGrievances.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="glass-premium p-20 text-center border-dashed border-white/10"
              >
                <div className="w-24 h-24 rounded-full bg-white/[0.02] flex items-center justify-center mx-auto mb-6 border border-white/5">
                  <FileText className="w-10 h-10 text-muted-foreground/40" />
                </div>
                <h3 className="text-2xl font-bold mb-3 italic">Grid History Empty</h3>
                <p className="text-muted-foreground mb-8 max-w-sm mx-auto">No reports matching your criteria were found in our intelligence network.</p>
                <Button asChild className="cta-button-primary h-14 px-10">
                  <Link to="/submit">Initialize New Report</Link>
                </Button>
              </motion.div>
            ) : (
              filteredGrievances.map((grievance, i) => {
                const StatusIcon = getStatusIcon(grievance.status);
                return (
                  <motion.div
                    key={grievance.id}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.08 }}
                    whileHover={{ y: -5 }}
                    className="relative"
                  >
                    <div className="absolute inset-0 bg-blue-500/5 blur-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
                    <Card className="glass-premium border-white/5 hover:bg-white/[0.04] transition-all overflow-hidden group">
                      <div className="absolute top-0 left-0 w-1.5 h-full bg-blue-500/40 group-hover:bg-blue-500 transition-colors shadow-[0_0_15px_rgba(59,130,246,0.5)]" />
                      <CardContent className="p-8">
                        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-10">
                          {/* Info Section */}
                          <div className="flex-1">
                            <div className="flex flex-wrap items-center gap-4 mb-6">
                              <Badge className={`px-4 py-1.5 text-[10px] font-black uppercase tracking-widest border ${getStatusColor(grievance.status)}`}>
                                <StatusIcon className="w-3.5 h-3.5 mr-2" />
                                {grievance.status.replace(/_/g, " ")}
                              </Badge>
                              <span className="font-mono text-xs text-blue-500 font-bold bg-blue-500/5 px-3 py-1 rounded-lg border border-blue-500/10 tracking-widest">
                                {grievance.grid_id}
                              </span>
                              <div className="flex items-center gap-2 text-[10px] font-bold text-muted-foreground uppercase bg-white/5 px-3 py-1 rounded-lg">
                                <Calendar className="w-3.5 h-3.5" />
                                {new Date(grievance.created_at).toLocaleDateString()}
                              </div>
                            </div>
                            
                            <h3 className="text-2xl lg:text-3xl font-black mb-4 group-hover:text-blue-400 transition-colors tracking-tight italic">
                              {grievance.title}
                            </h3>
                            
                            <p className="text-muted-foreground text-md leading-relaxed mb-6 line-clamp-2 italic opacity-80">
                              {grievance.description}
                            </p>

                            <div className="flex flex-wrap items-center gap-6 pt-6 border-t border-white/5">
                              <div className="flex items-center gap-2.5 text-xs font-bold text-foreground">
                                <div className="p-1.5 rounded-lg bg-blue-500/10">
                                  <MapPin className="w-4 h-4 text-blue-500" />
                                </div>
                                <span className="opacity-80 tracking-wide">{grievance.location}</span>
                              </div>
                              <div className="flex items-center gap-2.5 text-xs font-bold text-foreground">
                                <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-500">
                                  <Badge variant="outline" className="p-0 border-0 text-[10px] font-black uppercase tracking-widest leading-none bg-transparent">{grievance.category}</Badge>
                                </div>
                              </div>
                            </div>
                          </div>

                           {/* Action Hub */}
                          <div className="flex flex-col lg:w-72 gap-6 shrink-0">
                            {grievance.status !== "RESOLVED" && (
                              <GrievanceSLA createdAt={grievance.created_at} />
                            )}
                            
                            <div className="flex flex-row lg:flex-col items-center gap-4">
                              {grievance.can_feedback && (
                              <Button
                                variant="outline"
                                className="w-full h-14 px-8 border-emerald-500/30 bg-emerald-500/5 text-emerald-400 hover:bg-emerald-500 hover:text-white rounded-2xl font-black uppercase tracking-widest text-xs transition-all glow-crew"
                                asChild
                              >
                                <Link to={`/feedback/${grievance.id}`}>
                                  <Star className="w-4 h-4 mr-2" />
                                  Rate Quality
                                </Link>
                              </Button>
                            )}
                            {grievance.can_contest && (
                              <Button
                                variant="outline"
                                className="w-full h-14 px-8 border-red-500/30 bg-red-500/5 text-red-400 hover:bg-red-500 hover:text-white rounded-2xl font-black uppercase tracking-widest text-xs transition-all glow-auditor"
                                asChild
                              >
                                <Link to={`/contest/${grievance.id}`}>
                                  <RotateCcw className="w-4 h-4 mr-2" />
                                  Contest Result
                                </Link>
                              </Button>
                            )}
                            <Button 
                              variant="secondary" 
                              className="w-full h-14 px-8 bg-blue-500 text-white hover:bg-blue-600 rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl active:scale-95 transition-all flex items-center gap-3"
                              asChild
                            >
                              <Link to={`/track/${grievance.grid_id}`}>
                                Track Live
                                <ArrowRight className="w-4 h-4 animate-bounce-x" />
                              </Link>
                            </Button>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                      </Card>
                  </motion.div>
                );
              })
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default MyGrievancesPage;
