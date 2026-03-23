import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  RefreshCw,
  Play,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Clock,
  User,
  MapPin,
  FileText,
  ChevronRight,
  Loader2,
  Filter,
  Search,
  ExternalLink,
  ShieldCheck
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { grievanceService } from "@/services/grievance.service";
import { adminService } from "@/services/admin.service";

const statusOptions = [
  { value: "ACKNOWLEDGED", label: "Acknowledged", icon: User, color: "blue" },
  { value: "IN_PROGRESS", label: "In Progress", icon: Play, color: "amber" },
  { value: "ON_HOLD", label: "On Hold", icon: Clock, color: "orange" },
  { value: "RESOLVED", label: "Resolved", icon: CheckCircle2, color: "green" },
  { value: "REJECTED", label: "Rejected", icon: XCircle, color: "red" },
];

const OfficerWorkflowPage = () => {
  const [grievances, setGrievances] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedGrievance, setSelectedGrievance] = useState<any>(null);
  const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false);
  const [newStatus, setNewStatus] = useState("");
  const [statusNotes, setStatusNotes] = useState("");
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    fetchGrievances();
  }, []);

  const fetchGrievances = async () => {
    setLoading(true);
    try {
      // Get grievances assigned to current officer
      const result = await grievanceService.getMyGrievances();
      setGrievances((result as any).grievances || (result as any).items || []);
    } catch (error) {
      console.error("Failed to fetch grievances:", error);
    }
    setLoading(false);
  };

  const handleStatusUpdate = async () => {
    if (!selectedGrievance || !newStatus) return;

    setUpdating(true);
    try {
      await grievanceService.updateStatus(selectedGrievance.id, newStatus as any, statusNotes);
      
      // Update local state
      setGrievances(prev => prev.map(g => 
        g.id === selectedGrievance.id 
          ? { ...g, status: newStatus, status_notes: statusNotes }
          : g
      ));
      
      setIsUpdateDialogOpen(false);
      setSelectedGrievance(null);
      setNewStatus("");
      setStatusNotes("");
    } catch (error) {
      console.error("Status update failed:", error);
    }
    setUpdating(false);
  };

  const filteredGrievances = grievances.filter(g => {
    const matchesSearch = 
      g.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      g.grid_id?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || g.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    const statusConfig: Record<string, { class: string; icon: any }> = {
      CREATED: { class: "bg-blue-500/10 text-blue-500 border-blue-500/20", icon: Clock },
      ACKNOWLEDGED: { class: "bg-indigo-500/10 text-indigo-500 border-indigo-500/20", icon: User },
      IN_PROGRESS: { class: "bg-amber-500/10 text-amber-500 border-amber-500/20", icon: Play },
      ON_HOLD: { class: "bg-orange-500/10 text-orange-500 border-orange-500/20", icon: AlertTriangle },
      RESOLVED: { class: "bg-green-500/10 text-green-500 border-green-500/20", icon: CheckCircle2 },
      REJECTED: { class: "bg-red-500/10 text-red-500 border-red-500/20", icon: XCircle },
    };
    const config = statusConfig[status] || statusConfig.CREATED;
    const Icon = config.icon;
    return (
      <Badge className={`${config.class} border`}>
        <Icon className="w-3 h-3 mr-1" />
        {status}
      </Badge>
    );
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <main className="flex-grow pt-8 lg:pt-32 pb-12 px-6 relative overflow-hidden">
        {/* Ambient Glow */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-[150px] pointer-events-none" />

        <div className="container mx-auto max-w-6xl">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Officer Workflow</h1>
              <p className="text-muted-foreground">Manage and update grievance statuses</p>
            </div>
            <Button variant="outline" onClick={fetchGrievances} className="gap-2">
              <RefreshCw className="w-4 h-4" />
              Refresh
            </Button>
          </div>

          {/* Filters */}
          <div className="flex flex-col md:flex-row gap-4 mb-8">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search by ID or title..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-white/5 border-white/10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[200px] bg-white/5 border-white/10">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                {statusOptions.map(opt => (
                  <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Grievances List */}
          {loading ? (
            <div className="text-center py-16">
              <Loader2 className="w-8 h-8 animate-spin mx-auto text-blue-500 mb-4" />
              <p className="text-muted-foreground">Loading grievances...</p>
            </div>
          ) : filteredGrievances.length === 0 ? (
            <div className="text-center py-16 glass-card rounded-3xl border border-white/5">
              <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-4">
                <FileText className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-medium mb-2">No grievances found</h3>
              <p className="text-muted-foreground text-sm">
                {searchQuery || statusFilter !== "all" 
                  ? "Try adjusting your filters" 
                  : "You have no assigned grievances"}
              </p>
            </div>
          ) : (
            <div className="grid gap-4">
              {filteredGrievances.map((grievance, index) => (
                <motion.div
                  key={grievance.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Card className="glass-card border-white/5 bg-white/[0.02] hover:bg-white/[0.04] transition-colors">
                    <CardContent className="p-6">
                      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <span className="font-mono text-sm text-blue-500">{grievance.grid_id}</span>
                            {getStatusBadge(grievance.status)}
                            {grievance.priority && (
                              <Badge className={`${
                                grievance.priority === "CRITICAL" 
                                  ? "bg-red-500/10 text-red-500" 
                                  : grievance.priority === "HIGH"
                                  ? "bg-orange-500/10 text-orange-500"
                                  : "bg-blue-500/10 text-blue-500"
                              } border-0 text-xs`}>
                                {grievance.priority}
                              </Badge>
                            )}
                          </div>
                          <h3 className="text-lg font-bold mb-1">{grievance.title}</h3>
                          <p className="text-sm text-muted-foreground line-clamp-1">{grievance.description}</p>
                          
                          <div className="flex flex-wrap items-center gap-4 mt-3 text-xs text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <MapPin className="w-3 h-3" />
                              {grievance.location?.address || "Location available"}
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {new Date(grievance.created_at).toLocaleDateString()}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="gap-2"
                            onClick={() => {
                              setSelectedGrievance(grievance);
                              setNewStatus(grievance.status);
                              setIsUpdateDialogOpen(true);
                            }}
                          >
                            <RefreshCw className="w-4 h-4" />
                            Update Status
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="gap-2"
                            asChild
                          >
                            <Link to={`/verify/${grievance.id}`}>
                              <ShieldCheck className="w-4 h-4" />
                              Verify
                            </Link>
                          </Button>
                          <Button variant="ghost" size="icon" className="h-9 w-9" asChild>
                            <Link to={`/grievance/${grievance.id}`}>
                              <ExternalLink className="w-4 h-4" />
                            </Link>
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Status Update Dialog */}
      <Dialog open={isUpdateDialogOpen} onOpenChange={setIsUpdateDialogOpen}>
        <DialogContent className="glass-card border-white/10 bg-[#0a0a0a]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3">
              <RefreshCw className="w-5 h-5 text-blue-500" />
              Update Status
            </DialogTitle>
            <DialogDescription>
              Update the status for {selectedGrievance?.grid_id}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div>
              <label className="text-sm font-medium mb-2 block">New Status</label>
              <Select value={newStatus} onValueChange={setNewStatus}>
                <SelectTrigger className="bg-white/5 border-white/10">
                  <SelectValue placeholder="Select new status" />
                </SelectTrigger>
                <SelectContent>
                  {statusOptions.map(opt => (
                    <SelectItem key={opt.value} value={opt.value}>
                      <div className="flex items-center gap-2">
                        <opt.icon className="w-4 h-4" />
                        {opt.label}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Notes (Optional)</label>
              <Textarea
                placeholder="Add notes about this status change..."
                value={statusNotes}
                onChange={(e) => setStatusNotes(e.target.value)}
                className="bg-white/5 border-white/10 min-h-[100px] resize-none"
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsUpdateDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleStatusUpdate} 
              disabled={!newStatus || newStatus === selectedGrievance?.status || updating}
              className="gap-2"
            >
              {updating && <Loader2 className="w-4 h-4 animate-spin" />}
              Update Status
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default OfficerWorkflowPage;
