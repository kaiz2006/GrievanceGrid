import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
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
        {/* Ambient Glows */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-[150px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-purple-500/5 rounded-full blur-[150px] pointer-events-none" />

        <div className="container mx-auto max-w-6xl">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-12">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <FileText className="w-5 h-5 text-blue-500" />
                <span className="text-xs font-bold text-blue-500 uppercase tracking-widest">My Grievances</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight">Track Your Reports</h1>
              <p className="text-muted-foreground mt-2">View and manage all your submitted grievances</p>
            </div>

            <Button className="h-14 px-8 bg-blue-600 hover:bg-blue-500" asChild>
              <Link to="/submit">
                <Plus className="w-5 h-5 mr-2" />
                Submit New Grievance
              </Link>
            </Button>
          </div>

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
          <div className="flex flex-col md:flex-row gap-4 mb-8">
            <div className="relative flex-grow">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                placeholder="Search by title or Grid ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 h-14 bg-white/[0.03] border-white/10 focus:border-blue-500/50 transition-all"
              />
            </div>
            <div className="flex gap-2">
              {["all", "IN_PROGRESS", "RESOLVED", "PENDING"].map((status) => (
                <Button
                  key={status}
                  variant={statusFilter === status ? "default" : "outline"}
                  onClick={() => setStatusFilter(status)}
                  className={`h-14 px-6 ${
                    statusFilter === status
                      ? "bg-blue-600"
                      : "border-white/10 bg-white/5 hover:bg-white/10"
                  }`}
                >
                  {status === "all" ? "All" : status.replace("_", " ")}
                </Button>
              ))}
            </div>
          </div>

          {/* Grievances List */}
          <div className="space-y-4">
            {filteredGrievances.length === 0 ? (
              <Card className="glass-card border-white/5 bg-white/[0.02] p-12 text-center">
                <FileText className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-2">No grievances found</h3>
                <p className="text-muted-foreground mb-6">You haven't submitted any grievances yet.</p>
                <Button asChild>
                  <Link to="/submit">Submit Your First Grievance</Link>
                </Button>
              </Card>
            ) : (
              filteredGrievances.map((grievance, i) => {
                const StatusIcon = getStatusIcon(grievance.status);
                return (
                  <motion.div
                    key={grievance.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                  >
                    <Card className="glass-card border-white/5 bg-white/[0.02] hover:bg-white/[0.04] transition-all group">
                      <CardContent className="p-6">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                          {/* Left: Info */}
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <Badge className={`${getStatusColor(grievance.status)}`}>
                                <StatusIcon className="w-3 h-3 mr-1" />
                                {grievance.status}
                              </Badge>
                              <span className="font-mono text-xs text-blue-500">{grievance.grid_id}</span>
                            </div>
                            <h3 className="text-lg font-bold group-hover:text-blue-400 transition-colors">{grievance.title}</h3>
                            <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{grievance.description}</p>
                            <div className="flex items-center gap-4 mt-3 text-xs text-muted-foreground">
                              <span className="flex items-center gap-1">
                                <MapPin className="w-3 h-3" />
                                {grievance.location}
                              </span>
                              <span className="flex items-center gap-1">
                                <Calendar className="w-3 h-3" />
                                {new Date(grievance.created_at).toLocaleDateString()}
                              </span>
                              <Badge variant="outline" className="text-[10px]">{grievance.category}</Badge>
                            </div>
                          </div>

                          {/* Right: Actions */}
                          <div className="flex items-center gap-3">
                            {grievance.can_feedback && (
                              <Button
                                variant="outline"
                                size="sm"
                                className="border-green-500/30 bg-green-500/10 text-green-500 hover:bg-green-500/20"
                                asChild
                              >
                                <Link to={`/feedback/${grievance.id}`}>
                                  <Star className="w-4 h-4 mr-1" />
                                  Rate
                                </Link>
                              </Button>
                            )}
                            {grievance.can_contest && (
                              <Button
                                variant="outline"
                                size="sm"
                                className="border-red-500/30 bg-red-500/10 text-red-500 hover:bg-red-500/20"
                                asChild
                              >
                                <Link to={`/contest/${grievance.id}`}>
                                  <RotateCcw className="w-4 h-4 mr-1" />
                                  Contest
                                </Link>
                              </Button>
                            )}
                            <Button variant="ghost" size="sm" className="text-blue-500" asChild>
                              <Link to={`/track/${grievance.grid_id}`}>
                                Track
                                <ArrowRight className="w-4 h-4 ml-1" />
                              </Link>
                            </Button>
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
