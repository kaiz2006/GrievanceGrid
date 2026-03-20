import { motion } from "framer-motion";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  Cell 
} from "recharts";
import { 
  ShieldAlert, 
  Globe, 
  FileText, 
  Activity, 
  Search, 
  Download, 
  AlertTriangle, 
  ShieldCheck,
  ChevronRight,
  TrendingDown,
  Database,
  Lock
} from "lucide-react";
import MapComponent from "../map/MapComponent";

const riskData = [
  { name: "Low", value: 340, color: "#22c55e" },
  { name: "Medium", value: 120, color: "#eab308" },
  { name: "High", value: 42, color: "#f97316" },
  { name: "Extreme", value: 12, color: "#dc2626" },
];

const highRiskCases = [
  { id: "FRD-9901", score: 98.4, status: "UNDER_AUDIT", dept: "Finance", delta: "$124k" },
  { id: "FRD-9882", score: 92.1, status: "FLAGGED", dept: "Public Works", delta: "$18k" },
  { id: "FRD-9875", score: 88.5, status: "RESOLVING", dept: "Sanitation", delta: "$5k" },
  { id: "FRD-9810", score: 45.2, status: "MONITORING", dept: "Traffic", delta: "$2k" },
];

const auditLog = [
  { msg: "Node 04-B: Verification signature matched.", time: "2m ago", type: "OK" },
  { msg: "Integrity check: 44D8-22F1-A89E verified.", time: "14m ago", type: "OK" },
  { msg: "Anomaly detected in Sector 7-G ledger.", time: "24m ago", type: "ALERT" },
  { msg: "System-wide sync complete (v4.2.0).", time: "1h ago", type: "INFO" },
];

const FraudDetectionPage = () => {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <main className="flex-grow pt-8 lg:pt-32 pb-12 px-6 relative">
        <div className="container mx-auto">
          {/* Header */}
          <section className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 mb-12">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <ShieldAlert className="w-5 h-5 text-red-500" />
                <span className="text-xs font-bold text-red-500 uppercase tracking-widest">Institutional Intelligence Layer</span>
              </div>
              <h1 className="text-4xl font-bold tracking-tight">Fraud & Anomaly Detection</h1>
            </div>
            <div className="flex gap-4">
              <div className="relative group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input 
                  type="text" 
                  placeholder="Scan Ledger / Case ID..."
                  className="bg-white/5 border border-white/10 rounded-2xl py-3 pl-12 pr-6 text-sm w-64 focus:outline-none focus:ring-2 focus:ring-red-500/20 transition-all font-medium"
                />
              </div>
              <button className="p-3 bg-red-600/10 border border-red-500/20 rounded-2xl hover:bg-red-600/20 transition-colors">
                 <Lock className="w-5 h-5 text-red-500" />
              </button>
            </div>
          </section>

          {/* Metrics Row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {[
              { label: "High-Prob Fraud", value: "124", color: "text-red-500", icon: AlertTriangle, desc: "Cases requiring direct audit" },
              { label: "Contested Cases", value: "42", color: "text-amber-500", icon: FileText, desc: "Resolution pending review" },
              { label: "Verified Delta", value: "$4.2M", color: "text-blue-500", icon: Activity, desc: "Anomalous volume detected" },
            ].map((metric, i) => (
              <motion.div
                key={metric.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="bg-white/[0.02] border border-white/5 rounded-[2.5rem] p-8 shadow-2xl relative overflow-hidden group"
              >
                <div className="flex justify-between items-start mb-6">
                   <div className={`p-4 rounded-2xl bg-white/5 ${metric.color}`}>
                      <metric.icon className="w-6 h-6" />
                   </div>
                   <span className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground opacity-30 group-hover:opacity-100 transition-opacity">Real-Time</span>
                </div>
                <h4 className="text-[10px] uppercase tracking-widest text-muted-foreground mb-1 font-bold">{metric.label}</h4>
                <p className={`text-4xl font-black tracking-tighter mb-2 ${metric.color}`}>{metric.value}</p>
                <p className="text-[11px] text-muted-foreground italic font-medium opacity-60">{metric.desc}</p>
              </motion.div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Main Content Area */}
            <div className="lg:col-span-8 flex flex-col gap-8">
              {/* Risk Distribution Chart */}
              <div className="bg-white/[0.02] border border-white/5 rounded-[2.5rem] p-8 shadow-2xl">
                <div className="flex justify-between items-center mb-10">
                   <div>
                      <h3 className="text-xl font-bold">Severity Distribution</h3>
                      <p className="text-xs text-muted-foreground font-medium opacity-50 uppercase tracking-widest">Case Load Anomaly Map</p>
                   </div>
                   <button className="bg-white/5 border border-white/10 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-white/10 transition-all">Export Report</button>
                </div>
                <div className="h-64 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={riskData}>
                      <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#ffffff40', fontSize: 10, fontWeight: 'bold'}} dy={10} />
                      <Bar dataKey="value" radius={[8, 8, 8, 8]}>
                        {riskData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} fillOpacity={0.8} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* High-Risk List */}
              <div className="bg-white/[0.02] border border-white/5 rounded-[2.5rem] overflow-hidden shadow-2xl">
                <div className="p-8 border-b border-white/5 flex justify-between items-center">
                   <h3 className="text-sm font-black uppercase tracking-widest">High-Risk Case List</h3>
                   <span className="p-1 px-3 bg-red-500/10 text-red-500 text-[9px] font-black rounded-full uppercase">Priority One</span>
                </div>
                <div className="overflow-x-auto">
                   <table className="w-full text-left font-sans">
                      <thead className="bg-white/[0.01] text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/40">
                         <tr>
                            <th className="px-8 py-5">Case ID</th>
                            <th className="px-8 py-5 text-center">Score</th>
                            <th className="px-8 py-5">Department</th>
                            <th className="px-8 py-5 text-right">Delta</th>
                            <th className="px-8 py-5">Status</th>
                         </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5">
                         {highRiskCases.map((c) => (
                           <tr key={c.id} className="hover:bg-red-500/[0.03] transition-colors cursor-pointer group">
                              <td className="px-8 py-6">
                                 <span className="text-sm font-bold font-mono text-red-500 group-hover:text-red-400">{c.id}</span>
                              </td>
                              <td className="px-8 py-6">
                                 <div className="flex flex-col items-center gap-1">
                                    <span className="text-xs font-black font-mono">{c.score}%</span>
                                    <div className="w-16 h-1 bg-white/5 rounded-full overflow-hidden">
                                       <div className="h-full bg-red-600" style={{ width: `${c.score}%` }} />
                                    </div>
                                 </div>
                              </td>
                              <td className="px-8 py-6">
                                 <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">{c.dept}</span>
                              </td>
                              <td className="px-8 py-6 text-right font-mono text-xs font-bold opacity-60">{c.delta}</td>
                              <td className="px-8 py-6">
                                 <span className={`text-[9px] font-black px-2.5 py-1 rounded-full uppercase tracking-tighter shadow-sm ${
                                   c.status === "UNDER_AUDIT" ? "bg-red-600 text-white shadow-red-600/20" : "bg-white/5 text-muted-foreground"
                                 }`}>
                                   {c.status}
                                 </span>
                              </td>
                           </tr>
                         ))}
                      </tbody>
                   </table>
                </div>
                <div className="p-8 border-t border-white/5 bg-white/[0.01]">
                   <button className="w-full py-4 text-[10px] font-black uppercase tracking-[0.4em] text-muted-foreground hover:text-red-500 transition-colors">Load Extended Risk Archive</button>
                </div>
              </div>
            </div>

            {/* Sidebar Column */}
            <div className="lg:col-span-4 space-y-8">
              {/* Risk Hotspots Map */}
              <div className="bg-white/[0.02] border border-white/5 rounded-[2.5rem] p-6 shadow-2xl">
                 <div className="flex justify-between items-center mb-6">
                    <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-red-500">Global Hotspots</h4>
                    <Globe className="w-4 h-4 text-red-500" />
                 </div>
                 <div className="h-64 rounded-[2rem] overflow-hidden bg-black/40 border border-white/5 relative">
                    <MapComponent 
                       center={[37.7749, -122.4194]}
                       zoom={3}
                       markers={[{ position: [37.7749, -122.4194], popupContent: "Risk Level: Extreme" }]}
                       className="w-full h-full grayscale opacity-30 contrast-125"
                    />
                    <div className="absolute inset-0 bg-red-600/5 animate-pulse pointer-events-none" />
                 </div>
              </div>

              {/* System Audit Log */}
              <div className="bg-white/[0.02] border border-white/5 rounded-[2.5rem] p-8 shadow-2xl flex flex-col min-h-[400px]">
                 <div className="flex justify-between items-center mb-8">
                    <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground opacity-50">System Audit Log</h4>
                    <Database className="w-4 h-4 text-muted-foreground opacity-50" />
                 </div>
                 <div className="flex-1 space-y-8 font-mono text-[10px]">
                    {auditLog.map((log, i) => (
                      <div key={i} className="flex gap-4 relative">
                         {i < auditLog.length - 1 && <div className="absolute left-[3px] top-4 bottom-[-20px] w-[1px] bg-white/5" />}
                         <div className={`w-1.5 h-1.5 rounded-full mt-1 shrink-0 ${log.type === 'ALERT' ? "bg-red-500 shadow-[0_0_8px_#ef4444]" : "bg-emerald-500"}`} />
                         <div className="space-y-1">
                            <p className={`font-bold ${log.type === 'ALERT' ? "text-red-500" : "text-muted-foreground"}`}>{log.msg}</p>
                            <span className="text-[9px] opacity-30 uppercase tracking-widest">{log.time}</span>
                         </div>
                      </div>
                    ))}
                 </div>
                 <div className="mt-8 p-6 rounded-[2rem] bg-red-600/5 border border-red-500/10 backdrop-blur-md">
                    <p className="text-[10px] font-black uppercase tracking-widest text-red-500 mb-2">Integrity Lock</p>
                    <p className="text-[11px] text-muted-foreground leading-relaxed italic opacity-70">Log is hash-verified against secondary chain. External tampering detected: 0.00%</p>
                 </div>
              </div>

              {/* Quick Actions */}
              <div className="bg-black/40 rounded-[2rem] p-4 border border-white/5 flex flex-col gap-2">
                 <button className="w-full py-4 rounded-xl bg-white/5 border border-white/10 text-[10px] font-bold uppercase tracking-widest hover:bg-white/10 transition-all flex items-center justify-center gap-3">
                    <Download className="w-3 h-3" />
                    Archive Case
                 </button>
                 <button className="w-full py-4 rounded-xl bg-red-600 text-white text-[10px] font-black uppercase tracking-[0.2em] shadow-lg shadow-red-600/20 hover:scale-[1.02] active:scale-[0.98] transition-all">
                    Initiate Audit
                 </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default FraudDetectionPage;
