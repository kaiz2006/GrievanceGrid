import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { 
  Gavel, 
  Terminal, 
  CheckCircle2, 
  AlertCircle, 
  ChevronRight, 
  TrendingUp, 
  Activity, 
  Search, 
  Filter, 
  Download,
  ShieldCheck,
  Cpu
} from "lucide-react";
import Shuffle from "../Shuffle";

const auditLogs = [
  { id: "#TX-9921-A", cluster: "Billing Dispute", path: ["GATE_01", "CORE_PRI", "FIN_RESOLVER"], confidence: 0.992, status: "Verified" },
  { id: "#TX-9918-B", cluster: "Schema Validation", path: ["GATE_04", "SYS_DEBUG"], confidence: 0.874, status: "Manual Review" },
  { id: "#TX-9915-C", cluster: "Tier Upgrade", path: ["GATE_01", "SALES_AUTH"], confidence: 0.999, status: "Verified" },
  { id: "#TX-9914-F", cluster: "GDPR Erasure", path: ["GATE_01", "PRIVACY_ENGINE"], confidence: 0.642, status: "Flagged" },
  { id: "#TX-9910-K", cluster: "Account Recovery", path: ["GATE_01", "AUTH_GATE"], confidence: 0.995, status: "Verified" },
];

const AIAuditPage = () => {
  const [selectedTrace, setSelectedTrace] = useState(auditLogs[0]);

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <main className="flex-grow pt-8 lg:pt-32 pb-12 px-6 relative">
        <div className="container mx-auto">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-12">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <Gavel className="w-5 h-5 text-blue-500" />
                <span className="text-xs font-bold text-blue-500 uppercase tracking-widest">Institutional Audit Suite</span>
              </div>
              <h1 className="text-4xl font-bold tracking-tight">AI Routing & Logic Audit</h1>
            </div>
            
            <div className="flex gap-4">
              <div className="relative group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input 
                  type="text" 
                  placeholder="Audit lookup / Trace ID..."
                  className="bg-white/5 border border-white/10 rounded-2xl py-3 pl-12 pr-6 text-sm w-64 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all font-medium"
                />
              </div>
              <button className="p-3 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 transition-colors">
                <Filter className="w-5 h-5 text-muted-foreground" />
              </button>
            </div>
          </div>

          {/* Metrics Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {[
              { label: "Success Rate", value: "98.4%", icon: ShieldCheck, color: "text-green-500", trend: "+0.2%" },
              { label: "Latency (P99)", value: "142ms", icon: Activity, color: "text-blue-500", trend: "-12ms" },
              { label: "Routing Drift", value: "0.02%", icon: Cpu, color: "text-purple-500", trend: "Stable" },
              { label: "Active Queries", value: "1,204", icon: TrendingUp, color: "text-amber-500", trend: "+14%" },
            ].map((metric, i) => (
              <motion.div
                key={metric.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="p-6 rounded-3xl bg-white/[0.02] border border-white/5 relative group"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className={`p-2 rounded-lg bg-white/5 ${metric.color}`}>
                    <metric.icon className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-bold text-muted-foreground opacity-50 uppercase tracking-widest">{metric.trend}</span>
                </div>
                <h4 className="text-muted-foreground text-[10px] font-bold uppercase tracking-widest mb-1">{metric.label}</h4>
                <p className="text-2xl font-bold">{metric.value}</p>
              </motion.div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Audit Table */}
            <div className="lg:col-span-8 flex flex-col gap-6">
              <div className="rounded-[2rem] bg-white/[0.02] border border-white/5 overflow-hidden">
                <div className="p-6 border-b border-white/5 flex justify-between items-center">
                  <h3 className="font-bold text-lg">System Audit Log</h3>
                  <button className="px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-white/10 transition-all flex items-center gap-2">
                    <Download className="w-3 h-3" />
                    Export
                  </button>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="bg-white/[0.01] border-b border-white/5">
                        <th className="p-6 text-[10px] uppercase tracking-widest text-muted-foreground font-bold font-mono">Trace ID</th>
                        <th className="p-6 text-[10px] uppercase tracking-widest text-muted-foreground font-bold">Intent Cluster</th>
                        <th className="p-6 text-[10px] uppercase tracking-widest text-muted-foreground font-bold">Node Path</th>
                        <th className="p-6 text-[10px] uppercase tracking-widest text-muted-foreground font-bold text-right">Confidence</th>
                        <th className="p-6 text-[10px] uppercase tracking-widest text-muted-foreground font-bold">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {auditLogs.map((log) => (
                        <tr 
                          key={log.id} 
                          onClick={() => setSelectedTrace(log)}
                          className={`hover:bg-white/[0.03] transition-colors cursor-pointer group ${selectedTrace.id === log.id ? "bg-white/[0.04]" : ""}`}
                        >
                          <td className="p-6 font-mono text-xs text-blue-400">{log.id}</td>
                          <td className="p-6">
                            <span className="text-sm font-bold block">{log.cluster}</span>
                            <span className="text-[9px] text-muted-foreground/50 uppercase tracking-tighter">v4.2 Router</span>
                          </td>
                          <td className="p-6">
                            <div className="flex items-center gap-2 text-[10px] font-bold text-muted-foreground/60">
                              {log.path.map((node, idx) => (
                                <span key={idx} className="flex items-center gap-2">
                                  <span className={idx === log.path.length-1 ? "text-blue-500" : ""}>{node}</span>
                                  {idx < log.path.length - 1 && <ChevronRight className="w-3 h-3" />}
                                </span>
                              ))}
                            </div>
                          </td>
                          <td className="p-6 text-right font-mono text-xs text-blue-500 font-bold">{log.confidence}</td>
                          <td className="p-6">
                            <span className={`text-[9px] font-black px-2 py-1 rounded border uppercase tracking-tighter ${
                              log.status === "Verified" ? "bg-green-500/10 text-green-500 border-green-500/20" : 
                              log.status === "Manual Review" ? "bg-amber-500/10 text-amber-500 border-amber-500/20" :
                              "bg-red-500/10 text-red-500 border-red-500/20"
                            }`}>
                              {log.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Decision Logic Terminal */}
            <div className="lg:col-span-4">
              <div className="rounded-[2rem] bg-black/40 border border-white/5 h-full flex flex-col overflow-hidden backdrop-blur-xl">
                <div className="p-6 border-b border-white/5 flex items-center justify-between bg-white/[0.02]">
                  <div className="flex items-center gap-3">
                    <Terminal className="w-4 h-4 text-blue-500" />
                    <h3 className="text-xs font-bold uppercase tracking-widest">Decision Logic</h3>
                  </div>
                  <span className="px-2 py-0.5 bg-blue-500/10 text-blue-500 text-[8px] font-black rounded uppercase">Live_Debug</span>
                </div>
                <div className="flex-1 p-6 font-mono text-[11px] leading-relaxed text-muted-foreground overflow-y-auto">
                  <div className="mb-6">
                    <p className="text-blue-500 opacity-50">// TRACE_INIT: {selectedTrace.id}</p>
                    <p className="text-emerald-500">[2024-03-24 14:02:11] Incoming payload validation...</p>
                    <p className="text-emerald-500">[OK] Checksum verified: 0x82f..11</p>
                  </div>

                  <div className="mb-6 pl-4 border-l border-white/10">
                    <p className="text-white">Analyzing Intent: "{selectedTrace.cluster}"</p>
                    <p className="text-amber-400 mt-1">Detected Entities:</p>
                    <ul className="list-none pl-4 space-y-1">
                      <li>- Action: DISPUTE</li>
                      <li>- Target: FINANCIAL_GRID</li>
                      <li>- Confidence: {selectedTrace.confidence}</li>
                    </ul>
                  </div>

                  <div className="mb-6">
                    <p className="text-white">Logic Branching:</p>
                    <p className="text-blue-400 mt-1">IF (intent == DISPUTE && sector == FINANCIAL)</p>
                    <p className="pl-4 text-emerald-500">ROUTE TO FIN_RESOLVER (high_priority)</p>
                    <p className="text-blue-400 mt-1">ELSE</p>
                    <p className="pl-4 opacity-50">FALLBACK TO GEN_SUPPORT</p>
                  </div>

                  <div className="mb-6 animate-pulse">
                    <p className="text-amber-400">Calculating Path Efficiency...</p>
                    <p className="text-white">Node_Load [FIN_RESOLVER]: 12%</p>
                    <p className="text-emerald-500">Path optimized. Executing routing...</p>
                  </div>

                  <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
                    <p className="text-[10px] text-amber-500 font-bold mb-2">RAW_JSON_OBJECT</p>
                    <pre className="text-[9px] opacity-40">
                      {JSON.stringify({
                        trace: selectedTrace.id.replace("#", ""),
                        meta: {
                          cluster: "mumbai-west-01",
                          router_v: "4.2.0"
                        },
                        flags: selectedTrace.confidence > 0.9 ? ["high_conf"] : ["low_conf", "review_req"]
                      }, null, 2)}
                    </pre>
                  </div>
                </div>
                <div className="p-6 border-t border-white/5 bg-white/[0.01]">
                  <button className="w-full py-4 rounded-2xl bg-blue-600 text-white text-xs font-bold uppercase tracking-[0.2em] shadow-lg shadow-blue-600/20 hover:scale-[1.02] active:scale-[0.98] transition-all">
                    Inject Test Vector
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AIAuditPage;
