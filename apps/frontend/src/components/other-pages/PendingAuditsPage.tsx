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
  Eye,
  ShieldCheck,
  Zap
} from "lucide-react";
import { auditService, AuditResult } from "@/services/audit.service";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

const PendingAuditsPage = () => {
  const [audits, setAudits] = useState<AuditResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedAudit, setSelectedAudit] = useState<AuditResult | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const result = await auditService.getPendingAudits();
        setAudits(result);
      } catch (error) {
        console.error("Failed to fetch audits", error);
      }
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
          <div className="w-12 h-12 border-4 border-amber-600 border-t-transparent rounded-full animate-spin mx-auto glow-auditor" />
          <p className="text-muted-foreground font-mono uppercase tracking-widest text-xs">Accessing Secure Audit Vault...</p>
        </div>
      </div>
    );
  }

  const queuedCount = audits.filter(a => a.status === "AUDIT_QUEUED").length;
  const underReviewCount = audits.filter(a => a.status === "UNDER_REVIEW").length;

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <main className="flex-grow pt-12 lg:pt-32 pb-32 px-6 relative overflow-hidden">
        {/* Background Glows */}
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] pointer-events-none" />
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-red-500/10 rounded-full blur-[160px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-amber-500/10 rounded-full blur-[140px] pointer-events-none" />

        <div className="container mx-auto max-w-7xl relative z-10">
          {/* Auditor Header */}
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-8 mb-16">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
            >
                <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 rounded-xl bg-red-500/10 border border-red-500/20 glow-auditor">
                        <Gavel className="w-5 h-5 text-red-500" />
                    </div>
                    <span className="text-xs font-bold text-red-500 uppercase tracking-widest">Supreme Audit Command</span>
                </div>
                <h1 className="text-4xl md:text-5xl lg:text-7xl font-black tracking-tighter mb-4 italic text-white flex flex-col leading-[0.8]">
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-amber-400">INTEGRITY</span>
                    <span>WATCH</span>
                </h1>
                <p className="text-muted-foreground text-lg max-w-md leading-relaxed opacity-80 italic">
                    AI Watchdog detected <span className="text-red-400 font-bold">{audits.filter(a => a.risk_score >= 0.7).length} high-risk anomalies</span>. 
                    System accountability is currently <span className="text-white font-bold">ALPHA-PRIORITY</span>.
                </p>
            </motion.div>
            
            <div className="flex flex-col gap-4">
                <div className="flex gap-4">
                    <div className="text-right p-6 rounded-3xl bg-white/[0.02] border border-white/5 backdrop-blur-md glow-auditor px-8">
                        <p className="text-[10px] text-muted-foreground uppercase font-black tracking-[0.2em] mb-1 text-center">System Trust</p>
                        <p className="text-4xl font-black text-red-400 font-mono tracking-tighter italic">94.8%</p>
                    </div>
                    <Button onClick={() => window.location.reload()} className="h-full bg-red-600/10 border border-red-500/20 text-red-500 font-black uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all px-8 rounded-3xl">
                        <RefreshCw className="w-5 h-5 mr-3" /> Sync Vault
                    </Button>
                </div>
            </div>
          </div>

          {/* Metrics Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {[
              { label: "Total Pending", value: audits.length.toString(), icon: Clock, color: "text-amber-500", trend: "Critical" },
              { label: "In Review", value: underReviewCount.toString(), icon: Eye, color: "text-blue-500", trend: "+2" },
              { label: "AI Flagged", value: queuedCount.toString(), icon: Zap, color: "text-purple-500", trend: "Anomalous" },
              { label: "High Risk", value: audits.filter(a => a.risk_score >= 0.7).length.toString(), icon: AlertTriangle, color: "text-red-500", trend: "EV-9" },
            ].map((metric, i) => (
              <motion.div
                key={metric.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="p-8 rounded-[2rem] bg-white/[0.02] border border-white/5 relative overflow-hidden group hover:bg-white/[0.04] transition-all backdrop-blur-md glow-auditor"
              >
                <div className={`p-4 rounded-2xl w-fit mb-6 bg-white/5 ${metric.color}`}>
                  <metric.icon className="w-6 h-6" />
                </div>
                <div className="flex justify-between items-end">
                  <div>
                    <h4 className="text-muted-foreground text-[10px] font-black uppercase tracking-[0.2em] mb-1">{metric.label}</h4>
                    <p className={`text-4xl font-black tracking-tighter italic text-white`}>{metric.value}</p>
                  </div>
                  <span className={`text-[10px] font-black opacity-60 mb-2 ${metric.color}`}>{metric.trend}</span>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Main Area */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Audit Pipeline */}
            <div className="lg:col-span-2">
                <Card className="glass-premium border-white/5 bg-white/[0.01] rounded-[3rem] overflow-hidden">
                    <CardHeader className="px-10 py-10 border-b border-white/5 bg-white/[0.02]">
                        <CardTitle className="text-2xl font-black italic text-white flex items-center gap-3">
                            <ShieldCheck className="w-6 h-6 text-red-500" />
                            VAULT PIPELINE
                        </CardTitle>
                        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.3em] mt-2 opacity-60">Cross-verifying citizen claims vs. officer resolution data</p>
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
                                        className={`p-10 hover:bg-white/[0.02] transition-all cursor-pointer relative group ${selectedAudit?.audit_id === audit.audit_id ? "bg-white/[0.04]" : ""}`}
                                    >
                                        <div className="flex items-start justify-between gap-8">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-4 mb-4">
                                                    <span className="font-mono text-[10px] font-black text-red-500 uppercase tracking-widest bg-red-500/10 px-3 py-1 rounded-lg">#{audit.audit_id}</span>
                                                    <Badge className={`${statusStyle.bg} ${statusStyle.text} border-none text-[8px] font-black uppercase tracking-widest px-3 py-1 rounded-lg`}>
                                                        {audit.status.replace(/_/g, " ")}
                                                    </Badge>
                                                </div>
                                                <p className="text-lg font-black italic text-white group-hover:text-red-400 transition-colors tracking-tight line-clamp-1 uppercase underline decoration-red-500/30 decoration-2 underline-offset-8 mb-4">{audit.reason}</p>
                                                <div className="flex items-center gap-6 mt-6">
                                                    <div className="flex flex-col">
                                                        <span className="text-[8px] font-black text-muted-foreground uppercase tracking-widest opacity-40">Target Grievance</span>
                                                        <span className="text-[10px] font-black text-blue-400 uppercase tracking-widest">{audit.grievance_id}</span>
                                                    </div>
                                                    <div className="flex flex-col">
                                                        <span className="text-[8px] font-black text-muted-foreground uppercase tracking-widest opacity-40">Detection Time</span>
                                                        <span className="text-[10px] font-black text-white/60 uppercase tracking-widest">{new Date(audit.processed_at).toLocaleTimeString()}</span>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="text-right flex flex-col items-end">
                                                <div className="mb-4">
                                                    <p className={`text-4xl font-black italic tracking-tighter ${getRiskColor(audit.risk_score)}`}>
                                                        {(audit.risk_score * 100).toFixed(0)}%
                                                    </p>
                                                    <p className="text-[9px] font-black text-muted-foreground uppercase tracking-widest opacity-40">AI Risk Index</p>
                                                </div>
                                                {audit.evidence_photo && (
                                                    <div className="p-2 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-500">
                                                        <Camera className="w-4 h-4" />
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

            {/* Assessment Panel */}
            <div className="space-y-8">
                {selectedAudit ? (
                    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
                        <Card className="glass-premium border-white/5 bg-white/[0.01] rounded-[2.5rem] overflow-hidden">
                            <CardHeader className="px-8 pt-8 pb-4">
                                <CardTitle className="text-xl font-black italic flex items-center gap-3 text-white">
                                    <TrendingUp className="w-5 h-5 text-red-500" />
                                    Risk Assessment
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="px-8 pb-8 space-y-6">
                                <div className="p-6 rounded-2xl bg-[#0a0a0a] border border-white/5 shadow-inner">
                                    <p className="text-[9px] font-black text-red-500 uppercase tracking-widest mb-3 italic">System Analysis</p>
                                    <p className="text-sm font-bold leading-relaxed text-white opacity-80">{selectedAudit.reason}</p>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/5 backdrop-blur-md flex flex-col items-center">
                                        <p className="text-[8px] font-black text-muted-foreground uppercase tracking-[0.2em] mb-2">Integrity Score</p>
                                        <p className={`text-3xl font-black italic ${getRiskColor(selectedAudit.risk_score)} tracking-tighter`}>
                                            {(selectedAudit.risk_score * 100).toFixed(0)}%
                                        </p>
                                    </div>
                                    <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/5 backdrop-blur-md flex flex-col items-center">
                                        <p className="text-[8px] font-black text-muted-foreground uppercase tracking-[0.2em] mb-2">Evidence Power</p>
                                        <p className="text-3xl font-black italic text-amber-500 tracking-tighter">
                                            {selectedAudit.evidence_severity ? `${(selectedAudit.evidence_severity * 100).toFixed(0)}%` : "N/A"}
                                        </p>
                                    </div>
                                </div>

                                <div className="p-6 rounded-2xl bg-blue-500/5 border border-blue-500/10">
                                    <p className="text-[9px] font-black text-blue-500 uppercase tracking-widest mb-3 flex items-center gap-2 italic">
                                        <Zap className="w-4 h-4 fill-current" />
                                        Heuristic Recommendation
                                    </p>
                                    <p className="text-sm font-bold italic text-white/90 leading-relaxed capitalize">" {selectedAudit.recommendation} "</p>
                                </div>

                                <div className="flex flex-col gap-3 pt-4">
                                    <Button className="h-14 rounded-2xl bg-emerald-500 text-black font-black uppercase tracking-[0.2em] hover:brightness-110 transition-all text-[10px]">
                                        <CheckCircle2 className="w-4 h-4 mr-3" /> Validate Resolution
                                    </Button>
                                    <Button variant="outline" className="h-14 rounded-2xl border-red-500/20 bg-red-500/10 hover:bg-red-500/20 text-red-500 font-black uppercase tracking-[0.2em] transition-all text-[10px]">
                                        <XCircle className="w-4 h-4 mr-3" /> Flag Void
                                    </Button>
                                    <Link to={`/admin/audits/${selectedAudit.audit_id}`} className="w-full">
                                        <Button variant="ghost" className="w-full h-12 text-muted-foreground hover:text-white text-[9px] font-black uppercase tracking-[0.3em]">
                                            Open Full Audit Log <ArrowRight className="w-4 h-4 ml-2" />
                                        </Button>
                                    </Link>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                ) : (
                    <Card className="glass-premium border-white/5 bg-white/[0.01] rounded-[2.5rem] p-12 text-center border-dashed">
                        <Gavel className="w-16 h-16 text-muted-foreground/10 mx-auto mb-6" />
                        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground/40">Select Audit Protocol to Begin Verification</p>
                    </Card>
                )}

                {/* Audit Trends */}
                <Card className="glass-premium border-white/5 bg-white/[0.01] rounded-[2.5rem] p-8">
                    <h4 className="text-[10px] font-black uppercase tracking-[0.3em] mb-6 text-white italic">Anomaly Statistics</h4>
                    <div className="space-y-6">
                        {[
                            { label: "Internal Audit Speed", val: "4.2h", color: "text-blue-400" },
                            { label: "Citizen Trust Index", val: "88%", color: "text-emerald-400" },
                            { label: "Recidivism Prevention", val: "92%", color: "text-amber-400" },
                        ].map((stat) => (
                            <div key={stat.label} className="flex justify-between items-center border-b border-white/5 pb-4">
                                <span className="text-[9px] font-black text-muted-foreground uppercase tracking-widest opacity-60">{stat.label}</span>
                                <span className={`text-lg font-black italic tracking-tighter ${stat.color}`}>{stat.val}</span>
                            </div>
                        ))}
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
