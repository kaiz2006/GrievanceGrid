import { motion } from "framer-motion";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Cell
} from "recharts";
import { 
  Gavel, 
  Timer, 
  ShieldCheck, 
  Activity, 
  Search, 
  Bell, 
  HelpCircle,
  TrendingUp,
  AlertCircle,
  CheckCircle2,
  Terminal,
  Zap
} from "lucide-react";

const chartData = [
  { name: "Mon", value: 32 },
  { name: "Tue", value: 48 },
  { name: "Wed", value: 60 },
  { name: "Thu", value: 40 },
  { name: "Fri", value: 36 },
  { name: "Sat", value: 24 },
  { name: "Sun", value: 20 },
];

const directives = [
  { id: "GRID-AX-9920", status: "CRITICAL", custodian: "Jonathan Doe", priority: 3, time: "2h ago" },
  { id: "GRID-AX-8841", status: "REVIEW", custodian: "Sarah Chen", priority: 2, time: "4h ago" },
  { id: "GRID-AX-7752", status: "REVIEW", custodian: "B. Marcus", priority: 1, time: "12h ago" },
];

const feedItems = [
  { icon: CheckCircle2, text: "System validated case GRID-AX-91", time: "Just now", color: "text-emerald-500" },
  { icon: Gavel, text: "Directive issued by Oversight", time: "24m ago", color: "text-blue-500" },
  { icon: AlertCircle, text: "Escalation detected in Dept. B", time: "1h ago", color: "text-red-500" },
];

const TransparencyPage = () => {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <main className="flex-grow pt-8 lg:pt-32 pb-12 px-6 relative">
        <div className="container mx-auto space-y-12">
          {/* Hero Metrics */}
          <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { label: "Active Litigation", value: "142", trend: "+12.4%", icon: Gavel, color: "border-blue-500/50" },
              { label: "Avg Processing Time", value: "4.2d", trend: "-0.8d", icon: Timer, color: "border-amber-500/50" },
              { label: "Transparency Index", value: "98.2%", trend: "STABLE", icon: ShieldCheck, color: "border-emerald-500/50" },
            ].map((metric, i) => (
              <motion.div
                key={metric.label}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.1 }}
                className={`bg-white/[0.02] p-8 rounded-[2rem] border-l-4 ${metric.color} relative overflow-hidden group`}
              >
                <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                  <metric.icon className="w-24 h-24" />
                </div>
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground mb-2">{metric.label}</p>
                <div className="flex items-baseline gap-3">
                  <h2 className="text-4xl font-bold tracking-tighter">{metric.value}</h2>
                  <span className="text-xs font-bold text-blue-500">{metric.trend}</span>
                </div>
                <p className="text-[10px] text-muted-foreground mt-4 font-medium italic opacity-50">Institutional target compliant</p>
              </motion.div>
            ))}
          </section>

          {/* Main Layout Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Chart & Table Area */}
            <div className="lg:col-span-8 space-y-8">
              {/* Chart */}
              <div className="bg-white/[0.02] p-8 rounded-[2.5rem] border border-white/5 relative overflow-hidden">
                <div className="flex justify-between items-end mb-10 relative z-10">
                  <div>
                    <h3 className="text-xl font-bold tracking-tight">Grievance Flow Architecture</h3>
                    <p className="text-sm text-muted-foreground opacity-70">Volume distribution by department</p>
                  </div>
                  <div className="flex gap-2">
                    <span className="px-3 py-1 bg-white/5 rounded text-[10px] font-bold tracking-widest uppercase">7 Days</span>
                    <span className="px-3 py-1 bg-blue-500/10 text-blue-500 border border-blue-500/20 rounded text-[10px] font-bold tracking-widest uppercase">30 Days</span>
                  </div>
                </div>
                
                <div className="h-64 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                      <XAxis 
                        dataKey="name" 
                        axisLine={false} 
                        tickLine={false} 
                        tick={{ fill: '#ffffff40', fontSize: 10, fontWeight: 'bold' }}
                        dy={10}
                      />
                      <Tooltip 
                        cursor={{ fill: '#ffffff05' }}
                        contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid #ffffff10', borderRadius: '12px' }}
                      />
                      <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                        {chartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={index === 2 ? '#3b82f6' : '#ffffff10'} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Table */}
              <div className="bg-white/[0.02] rounded-[2.5rem] border border-white/5 overflow-hidden">
                <div className="px-8 py-6 border-b border-white/5 flex justify-between items-center">
                  <h3 className="text-sm font-black uppercase tracking-widest">Critical Directives</h3>
                  <button className="text-xs text-blue-500 font-bold hover:underline">View All</button>
                </div>
                <table className="w-full text-left">
                  <thead className="bg-white/[0.01] text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">
                    <tr>
                      <th className="px-8 py-4">Case Identifier</th>
                      <th className="px-8 py-4">Status</th>
                      <th className="px-8 py-4">Custodian</th>
                      <th className="px-8 py-4 text-right">Priority</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {directives.map((item) => (
                      <tr key={item.id} className="hover:bg-white/[0.02] transition-colors cursor-pointer group">
                        <td className="px-8 py-6">
                          <div className="flex flex-col">
                            <span className="text-sm font-bold">{item.id}</span>
                            <span className="text-[10px] text-muted-foreground opacity-60">Submitted {item.time}</span>
                          </div>
                        </td>
                        <td className="px-8 py-6">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                            item.status === 'CRITICAL' ? 'bg-red-500/10 text-red-500' : 'bg-white/5 text-muted-foreground'
                          }`}>
                            {item.status}
                          </span>
                        </td>
                        <td className="px-8 py-6">
                          <div className="flex items-center gap-2">
                            <div className="w-5 h-5 rounded-full bg-blue-500/10 flex items-center justify-center">
                              <span className="text-[8px] font-bold text-blue-500">{item.custodian.split(' ').map(n=>n[0]).join('')}</span>
                            </div>
                            <span className="text-xs font-medium">{item.custodian}</span>
                          </div>
                        </td>
                        <td className="px-8 py-6 text-right">
                          <div className="flex justify-end gap-1">
                            {[...Array(3)].map((_, i) => (
                              <div key={i} className={`w-1.5 h-1.5 rounded-full ${i < item.priority ? "bg-blue-500" : "bg-white/10"}`} />
                            ))}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Sidebar Actions */}
            <div className="lg:col-span-4 space-y-8">
              {/* Tactical Action Card */}
              <div className="bg-white/[0.04] rounded-[2.5rem] p-8 border border-white/5 shadow-2xl relative overflow-hidden">
                <div className="flex items-center gap-4 mb-6 relative z-10">
                  <div className="bg-blue-500/10 p-3 rounded-2xl">
                    <Activity className="w-5 h-5 text-blue-500" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold">Predictive Logic</h4>
                    <p className="text-[10px] text-muted-foreground uppercase tracking-widest">Next-Gen Audit</p>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed mb-8 relative z-10">
                  Algorithm suggests <span className="text-blue-500 font-bold">4 high-priority</span> audits based on current grievance patterns. Review required within 24 hours.
                </p>
                <button className="w-full bg-blue-600 text-white py-4 rounded-2xl text-xs font-bold uppercase tracking-widest shadow-lg shadow-blue-600/20 hover:scale-[1.02] active:scale-[0.98] transition-all relative z-10">
                  Launch Audit Suite
                </button>
                <div className="absolute -bottom-4 -right-4 opacity-5">
                  <Zap className="w-32 h-32 text-blue-500" />
                </div>
              </div>

              {/* Activity Log */}
              <div className="bg-white/[0.02] rounded-[2.5rem] p-8 border border-white/5">
                <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-8 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse shadow-[0_0_8px_#3b82f6]"></span>
                  Live Grid Feed
                </h4>
                <div className="space-y-8 relative">
                   {feedItems.map((item, idx) => (
                     <div key={idx} className="flex gap-4 relative">
                        {idx < feedItems.length - 1 && <div className="w-[1px] h-full bg-white/5 absolute left-[15px] top-8" />}
                        <div className="w-8 h-8 rounded-full bg-white/5 border border-white/5 flex items-center justify-center shrink-0 z-10">
                          <item.icon className={`w-3 h-3 ${item.color}`} />
                        </div>
                        <div className="pb-2">
                          <p className="text-xs font-medium">{item.text}</p>
                          <span className="text-[10px] text-muted-foreground opacity-50">{item.time}</span>
                        </div>
                     </div>
                   ))}
                </div>
              </div>

              {/* Terminal */}
              <div className="bg-black/40 rounded-[2rem] p-6 border border-white/5 font-mono text-[10px] backdrop-blur-xl">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-blue-500">NODE_STATUS: ONLINE</span>
                  <span className="text-muted-foreground opacity-40">v2.4.1</span>
                </div>
                <div className="space-y-1 text-muted-foreground/60">
                  <p>&gt; Initializing security layer...</p>
                  <p>&gt; Latency: 42ms</p>
                  <p>&gt; CPU Load: 12%</p>
                  <p>&gt; Grid mesh synchronized.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default TransparencyPage;
