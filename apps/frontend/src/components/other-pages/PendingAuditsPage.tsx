import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  Gavel,
  Clock,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Search,
  Filter,
  RefreshCw,
  ArrowRight,
  FileText,
  Camera,
  TrendingUp,
  Eye
} from "lucide-react";
import { auditService, AuditResult } from "@/services/audit.service";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const PendingAuditsPage = () => {
  const [audits, setAudits] = useState<AuditResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedAudit, setSelectedAudit] = useState<AuditResult | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const result = await auditService.getPendingAudits();
      setAudits(result);
      setLoading(false);
    };
    fetchData();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "AUDIT_QUEUED": return { bg: "bg-amber-500/10", text: "text-amber-500", border: "border-amber-500/20" };
      case "UNDER_REVIEW": return { bg: "bg-blue-500/10", text: "text-blue-500", border: "border-blue-500/20" };
      case "RESOLVED_VALID": return { bg: "bg-green-500/10", text: "text-green-500", border: "border-green-500/20" };
      case "RESOLVED_INVALID": return { bg: "bg-red-500/10", text: "text-red-500", border: "border-red-500/20" };
      default: return { bg: "bg-white/10", text: "text-muted-foreground", border: "border-white/10" };
    }
  };

  const getRiskColor = (score: number) => {
    if (score >= 0.7) return "text-red-500";
    if (score >= 0.4) return "text-amber-500";
    return "text-green-500";
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-4 border-amber-600 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-muted-foreground font-mono uppercase tracking-widest text-xs">Loading Pending Audits...</p>
        </div>
      </div>
    );
  }

  const queuedCount = audits.filter(a => a.status === "AUDIT_QUEUED").length;
  const underReviewCount = audits.filter(a => a.status === "UNDER_REVIEW").length;

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <main className="flex-grow pt-8 lg:pt-32 pb-12 px-6 relative overflow-hidden">
        {/* Ambient Glows */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-amber-500/5 rounded-full blur-[150px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-red-500/5 rounded-full blur-[150px] pointer-events-none" />

        <div className="container mx-auto">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-12">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <Gavel className="w-5 h-5 text-amber-500" />
                <span className="text-xs font-bold text-amber-500 uppercase tracking-widest">Contestation Audit Queue</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight">Pending Audits</h1>
              <p className="text-muted-foreground mt-2">AI-triggered audits requiring officer review</p>
            </div>

            <div className="flex gap-4">
              <Button variant="outline" className="h-12 px-6 border-white/10 bg-white/5">
                <Filter className="w-4 h-4 mr-2" />
                Filter
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
              { label: "Total Pending", value: audits.length.toString(), icon: Clock, color: "text-amber-500" },
              { label: "Queued", value: queuedCount.toString(), icon: FileText, color: "text-blue-500" },
              { label: "Under Review", value: underReviewCount.toString(), icon: Eye, color: "text-purple-500" },
              { label: "High Risk", value: audits.filter(a => a.risk_score >= 0.7).length.toString(), icon: AlertTriangle, color: "text-red-500" },
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
                </div>
                <h4 className="text-muted-foreground text-xs font-bold uppercase tracking-widest mb-1">{metric.label}</h4>
                <p className={`text-3xl font-bold tracking-tight ${metric.color}`}>{metric.value}</p>
              </motion.div>
            ))}
          </div>

          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Audit List */}
            <div className="lg:col-span-7">
              <Card className="glass-card border-white/5 bg-white/[0.02] overflow-hidden">
                <CardHeader className="border-b border-white/5">
                  <CardTitle className="text-lg font-bold flex items-center gap-3">
                    <Gavel className="w-5 h-5 text-amber-500" />
                    Audit Queue
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="divide-y divide-white/5">
                    {audits.map((audit, i) => {
                      const statusStyle = getStatusColor(audit.status);
                      return (
                        <motion.div
                          key={audit.audit_id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.05 }}
                          onClick={() => setSelectedAudit(audit)}
                          className={`p-6 hover:bg-white/[0.02] transition-all cursor-pointer ${selectedAudit?.audit_id === audit.audit_id ? "bg-white/[0.04]" : ""}`}
                        >
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-2">
                                <span className="font-mono text-xs text-blue-500">{audit.audit_id}</span>
                                <Badge className={`${statusStyle.bg} ${statusStyle.text} ${statusStyle.border}`}>
                                  {audit.status.replace(/_/g, " ")}
                                </Badge>
                              </div>
                              <p className="text-sm text-muted-foreground line-clamp-2">{audit.reason}</p>
                              <div className="flex items-center gap-4 mt-3 text-xs text-muted-foreground">
                                <span>Grievance: {audit.grievance_id}</span>
                                <span className="flex items-center gap-1">
                                  <Clock className="w-3 h-3" />
                                  {new Date(audit.processed_at).toLocaleTimeString()}
                                </span>
                              </div>
                            </div>

                            <div className="text-right">
                              <p className={`text-lg font-bold ${getRiskColor(audit.risk_score)}`}>
                                {(audit.risk_score * 100).toFixed(0)}%
                              </p>
                              <p className="text-[10px] text-muted-foreground">Risk Score</p>
                              {audit.evidence_photo && (
                                <div className="mt-2 flex items-center gap-1 text-[10px] text-blue-500">
                                  <Camera className="w-3 h-3" />
                                  Has Evidence
                                </div>
                              )}
                            </div>
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
              {/* Selected Audit Details */}
              {selectedAudit ? (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <Card className="glass-card border-white/5 bg-white/[0.02]">
                    <CardHeader className="border-b border-white/5">
                      <CardTitle className="text-lg font-bold">Audit Details</CardTitle>
                    </CardHeader>
                    <CardContent className="p-6 space-y-4">
                      <div className="p-4 rounded-2xl bg-red-500/5 border border-red-500/10">
                        <p className="text-[10px] text-red-500 uppercase tracking-widest mb-2">Contestation Reason</p>
                        <p className="text-sm">{selectedAudit.reason}</p>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="p-4 rounded-2xl bg-white/5">
                          <p className="text-[10px] text-muted-foreground uppercase tracking-widest mb-1">Risk Score</p>
                          <p className={`text-2xl font-bold ${getRiskColor(selectedAudit.risk_score)}`}>
                            {(selectedAudit.risk_score * 100).toFixed(0)}%
                          </p>
                        </div>
                        <div className="p-4 rounded-2xl bg-white/5">
                          <p className="text-[10px] text-muted-foreground uppercase tracking-widest mb-1">Evidence Severity</p>
                          <p className="text-2xl font-bold text-amber-500">
                            {selectedAudit.evidence_severity ? `${(selectedAudit.evidence_severity * 100).toFixed(0)}%` : "N/A"}
                          </p>
                        </div>
                      </div>

                      <div className="p-4 rounded-2xl bg-blue-500/5 border border-blue-500/10">
                        <p className="text-[10px] text-blue-500 uppercase tracking-widest mb-2 flex items-center gap-2">
                          <TrendingUp className="w-3 h-3" />
                          AI Recommendation
                        </p>
                        <p className="text-sm">{selectedAudit.recommendation}</p>
                      </div>

                      <div className="flex gap-3">
                        <Button className="flex-1 h-12 bg-green-600 hover:bg-green-500">
                          <CheckCircle2 className="w-4 h-4 mr-2" />
                          Validate
                        </Button>
                        <Button variant="outline" className="flex-1 h-12 border-red-500/30 bg-red-500/10 hover:bg-red-500/20 text-red-500">
                          <XCircle className="w-4 h-4 mr-2" />
                          Reject
                        </Button>
                      </div>

                      <Link to={`/admin/audits/${selectedAudit.audit_id}`}>
                        <Button variant="outline" className="w-full h-12 border-white/10 bg-white/5">
                          <Eye className="w-4 h-4 mr-2" />
                          Full Audit View
                        </Button>
                      </Link>
                    </CardContent>
                  </Card>
                </motion.div>
              ) : (
                <Card className="glass-card border-white/5 bg-white/[0.02] p-8 text-center">
                  <Gavel className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
                  <p className="text-muted-foreground">Select an audit to view details</p>
                </Card>
              )}

              {/* Quick Stats */}
              <Card className="glass-card border-white/5 bg-white/[0.02] p-6">
                <h4 className="text-sm font-bold uppercase tracking-widest mb-4">Audit Statistics</h4>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-muted-foreground">Avg Resolution Time</span>
                    <span className="text-sm font-bold">4.2 hours</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-muted-foreground">Validation Rate</span>
                    <span className="text-sm font-bold text-green-500">68%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-muted-foreground">Rejection Rate</span>
                    <span className="text-sm font-bold text-red-500">32%</span>
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

export default PendingAuditsPage;
