import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useParams } from "react-router-dom";
import {
  Gavel,
  AlertTriangle,
  FileText,
  Camera,
  Clock,
  CheckCircle2,
  XCircle,
  ArrowLeft,
  User,
  ShieldCheck,
  TrendingUp,
  MessageSquare,
  Send
} from "lucide-react";
import { auditService, AuditResult } from "@/services/audit.service";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const ContestationAuditPage = () => {
  const { audit_id } = useParams();
  const [audit, setAudit] = useState<AuditResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [reviewNotes, setReviewNotes] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const result = await auditService.getAuditResult(audit_id || "audit_001");
      setAudit(result);
      setLoading(false);
    };
    fetchData();
  }, [audit_id]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "AUDIT_QUEUED": return "bg-amber-500/10 text-amber-500 border-amber-500/20";
      case "UNDER_REVIEW": return "bg-blue-500/10 text-blue-500 border-blue-500/20";
      case "RESOLVED_VALID": return "bg-green-500/10 text-green-500 border-green-500/20";
      case "RESOLVED_INVALID": return "bg-red-500/10 text-red-500 border-red-500/20";
      default: return "bg-white/10 text-muted-foreground";
    }
  };

  const getRiskLevel = (score: number) => {
    if (score >= 0.7) return { label: "High Risk", color: "text-red-500" };
    if (score >= 0.4) return { label: "Medium Risk", color: "text-amber-500" };
    return { label: "Low Risk", color: "text-green-500" };
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-4 border-amber-600 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-muted-foreground font-mono uppercase tracking-widest text-xs">Loading Audit Data...</p>
        </div>
      </div>
    );
  }

  if (!audit) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <XCircle className="w-12 h-12 text-red-500 mx-auto" />
          <p className="text-muted-foreground">Audit not found</p>
        </div>
      </div>
    );
  }

  const riskLevel = getRiskLevel(audit.risk_score);

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <main className="flex-grow pt-8 lg:pt-32 pb-12 px-6 relative overflow-hidden">
        {/* Ambient Glows */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-amber-500/5 rounded-full blur-[150px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-red-500/5 rounded-full blur-[150px] pointer-events-none" />

        <div className="container mx-auto max-w-5xl">
          {/* Header */}
          <div className="flex items-center gap-6 mb-12">
            <Button variant="ghost" size="icon" className="h-14 w-14 rounded-2xl border border-white/10">
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <Gavel className="w-5 h-5 text-amber-500" />
                <span className="text-xs font-bold text-amber-500 uppercase tracking-widest">AI Audit Investigation</span>
              </div>
              <h1 className="text-3xl md:text-4xl font-bold tracking-tight">Contestation Review</h1>
            </div>
            <Badge className={`${getStatusColor(audit.status)} px-4 py-2 text-xs font-bold uppercase tracking-widest`}>
              {audit.status.replace(/_/g, " ")}
            </Badge>
          </div>

          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left Column - Details */}
            <div className="lg:col-span-8 space-y-8">
              {/* Audit Info */}
              <Card className="glass-card border-white/5 bg-white/[0.02]">
                <CardHeader className="pb-4">
                  <CardTitle className="text-lg font-bold flex items-center gap-3">
                    <FileText className="w-5 h-5 text-blue-500" />
                    Contestation Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 rounded-2xl bg-white/5">
                      <p className="text-[10px] text-muted-foreground uppercase tracking-widest mb-1">Audit ID</p>
                      <p className="font-mono text-sm">{audit.audit_id}</p>
                    </div>
                    <div className="p-4 rounded-2xl bg-white/5">
                      <p className="text-[10px] text-muted-foreground uppercase tracking-widest mb-1">Grievance ID</p>
                      <p className="font-mono text-sm">{audit.grievance_id}</p>
                    </div>
                  </div>

                  <div className="p-6 rounded-2xl bg-red-500/5 border border-red-500/10">
                    <p className="text-[10px] text-red-500 uppercase tracking-widest mb-2 flex items-center gap-2">
                      <AlertTriangle className="w-3 h-3" />
                      Contestation Reason
                    </p>
                    <p className="text-sm leading-relaxed">{audit.reason}</p>
                  </div>

                  {/* Evidence Photo */}
                  {audit.evidence_photo && (
                    <div>
                      <p className="text-[10px] text-muted-foreground uppercase tracking-widest mb-3 flex items-center gap-2">
                        <Camera className="w-3 h-3" />
                        Evidence Photo
                      </p>
                      <div className="aspect-video rounded-2xl bg-white/5 border border-white/10 overflow-hidden relative">
                        <img
                          src={audit.evidence_photo}
                          alt="Evidence"
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1515162816999-a0ca1fa02d4b?q=80&w=800";
                          }}
                        />
                        <div className="absolute bottom-4 left-4 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-lg">
                          <p className="text-[10px] font-bold text-white uppercase tracking-widest">Citizen Evidence</p>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* AI Analysis */}
              <Card className="glass-card border-white/5 bg-white/[0.02]">
                <CardHeader className="pb-4">
                  <CardTitle className="text-lg font-bold flex items-center gap-3">
                    <TrendingUp className="w-5 h-5 text-purple-500" />
                    AI Analysis Results
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Risk Score */}
                  <div className="p-6 rounded-2xl bg-white/5">
                    <div className="flex items-center justify-between mb-4">
                      <p className="text-[10px] text-muted-foreground uppercase tracking-widest">Risk Assessment Score</p>
                      <span className={`text-lg font-bold ${riskLevel.color}`}>
                        {(audit.risk_score * 100).toFixed(0)}% - {riskLevel.label}
                      </span>
                    </div>
                    <div className="h-3 w-full bg-white/5 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${audit.risk_score * 100}%` }}
                        className={`h-full ${audit.risk_score >= 0.7 ? "bg-red-500" : audit.risk_score >= 0.4 ? "bg-amber-500" : "bg-green-500"}`}
                      />
                    </div>
                  </div>

                  {/* Evidence Severity */}
                  {audit.evidence_severity !== null && (
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-4 rounded-2xl bg-white/5">
                        <p className="text-[10px] text-muted-foreground uppercase tracking-widest mb-2">Evidence Severity</p>
                        <p className="text-2xl font-bold text-amber-500">
                          {(audit.evidence_severity * 100).toFixed(0)}%
                        </p>
                      </div>
                      <div className="p-4 rounded-2xl bg-white/5">
                        <p className="text-[10px] text-muted-foreground uppercase tracking-widest mb-2">Processed At</p>
                        <p className="text-sm font-medium">
                          {new Date(audit.processed_at).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* AI Recommendation */}
                  <div className="p-6 rounded-2xl bg-blue-500/5 border border-blue-500/10">
                    <p className="text-[10px] text-blue-500 uppercase tracking-widest mb-3 flex items-center gap-2">
                      <ShieldCheck className="w-3 h-3" />
                      AI Recommendation
                    </p>
                    <p className="text-sm leading-relaxed">{audit.recommendation}</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right Column - Actions */}
            <div className="lg:col-span-4 space-y-6">
              {/* Status Card */}
              <Card className="glass-card border-white/5 bg-white/[0.02]">
                <CardHeader className="pb-4">
                  <CardTitle className="text-sm font-bold uppercase tracking-widest">Audit Status</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-3 p-4 rounded-2xl bg-white/5">
                    <Clock className="w-5 h-5 text-amber-500" />
                    <div>
                      <p className="text-xs font-bold uppercase tracking-widest">Current Status</p>
                      <p className="text-sm text-muted-foreground">{audit.status.replace(/_/g, " ")}</p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    {["SUBMITTED", "AUDIT_QUEUED", "UNDER_REVIEW", "RESOLVED"].map((status, i) => (
                      <div key={status} className="flex items-center gap-3">
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                          audit.status === status ? "bg-amber-500" : 
                          ["AUDIT_QUEUED", "UNDER_REVIEW", "RESOLVED"].indexOf(audit.status) > i ? "bg-green-500" : "bg-white/10"
                        }`}>
                          {["AUDIT_QUEUED", "UNDER_REVIEW", "RESOLVED"].indexOf(audit.status) > i ? (
                            <CheckCircle2 className="w-3 h-3 text-white" />
                          ) : audit.status === status ? (
                            <Clock className="w-3 h-3 text-white animate-pulse" />
                          ) : (
                            <div className="w-2 h-2 rounded-full bg-white/30" />
                          )}
                        </div>
                        <span className={`text-xs font-bold uppercase tracking-widest ${
                          audit.status === status ? "text-foreground" : "text-muted-foreground"
                        }`}>
                          {status.replace(/_/g, " ")}
                        </span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Review Notes */}
              <Card className="glass-card border-white/5 bg-white/[0.02]">
                <CardHeader className="pb-4">
                  <CardTitle className="text-sm font-bold uppercase tracking-widest">Review Notes</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <textarea
                    value={reviewNotes}
                    onChange={(e) => setReviewNotes(e.target.value)}
                    placeholder="Add your review notes..."
                    className="w-full h-32 bg-white/5 border border-white/10 rounded-2xl p-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all resize-none"
                  />
                </CardContent>
              </Card>

              {/* Action Buttons */}
              <div className="space-y-3">
                <Button className="w-full h-14 bg-green-600 hover:bg-green-500 text-white">
                  <CheckCircle2 className="w-4 h-4 mr-2" />
                  Validate Contestation
                </Button>
                <Button variant="outline" className="w-full h-14 border-red-500/30 bg-red-500/10 hover:bg-red-500/20 text-red-500">
                  <XCircle className="w-4 h-4 mr-2" />
                  Reject Contestation
                </Button>
                <Button variant="outline" className="w-full h-14 border-white/10 bg-white/5">
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Request More Info
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ContestationAuditPage;
