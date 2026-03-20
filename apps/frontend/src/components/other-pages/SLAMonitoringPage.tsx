import { motion } from "framer-motion";
import { Activity, Clock, AlertTriangle, CheckCircle2, TrendingUp, BarChart3 } from "lucide-react";

const SLAMonitoringPage = () => {
  return (
    <div className="pt-8 lg:pt-32 pb-24 px-6 max-w-7xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6"
      >
        <div>
          <h1 className="text-4xl font-bold tracking-tight mb-4">SLA Monitoring</h1>
          <p className="text-muted-foreground text-lg">Real-time performance metrics across all city services.</p>
        </div>
        <div className="flex gap-4">
          <div className="px-6 py-3 rounded-2xl bg-white/5 border border-white/10 flex items-center gap-2">
            <Activity className="w-4 h-4 text-green-500" />
            <span className="text-sm font-bold uppercase tracking-widest text-green-500">System Healthy</span>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        {[
          { label: "Avg. Response Time", value: "2.4h", icon: Clock, color: "text-blue-500" },
          { label: "SLA Compliance", value: "98.2%", icon: CheckCircle2, color: "text-green-500" },
          { label: "Critical Escalations", value: "14", icon: AlertTriangle, color: "text-amber-500" },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="p-8 rounded-3xl bg-white/[0.02] border border-white/5"
          >
            <div className="flex justify-between items-start mb-4">
              <div className={`p-3 rounded-xl bg-white/5 ${stat.color}`}>
                <stat.icon className="w-5 h-5" />
              </div>
              <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Live</span>
            </div>
            <h4 className="text-muted-foreground text-sm font-bold uppercase tracking-widest mb-1">{stat.label}</h4>
            <div className="flex items-end gap-3">
              <span className="text-4xl font-bold">{stat.value}</span>
              <span className="text-xs text-green-500 font-bold mb-1.5">+2.4%</span>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="glass-card p-8 border-white/5 bg-white/[0.01]">
        <div className="flex items-center gap-4 mb-8">
          <TrendingUp className="w-6 h-6 text-blue-500" />
          <h3 className="text-2xl font-bold">Resolution Trends</h3>
        </div>
        <div className="h-64 w-full bg-white/[0.02] rounded-2xl border border-dashed border-white/10 flex items-center justify-center">
          <div className="flex flex-col items-center gap-3">
            <BarChart3 className="w-10 h-10 text-muted-foreground/40" />
            <p className="text-muted-foreground italic">Interactive Chart Placeholder</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SLAMonitoringPage;
