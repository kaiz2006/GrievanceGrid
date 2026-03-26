import { motion } from "framer-motion";
import { 
  Bot, 
  User, 
  Zap, 
  Briefcase, 
  Cpu, 
  Send,
  CheckCircle2,
  Wrench,
  Navigation2,
  Activity
} from "lucide-react";

interface FlowStepProps {
  id: number;
  label: string;
  icon: any;
  isActive: boolean;
  isCompleted: boolean;
  description: string;
}

const FlowStep = ({ label, icon: Icon, isActive, isCompleted, description }: FlowStepProps) => (
  <div className="flex flex-col items-center gap-4 relative z-10 w-full group">
    <motion.div 
      initial={false}
      animate={{ 
        scale: isActive ? 1.1 : 1,
        borderColor: isActive ? "rgba(59, 130, 246, 0.5)" : isCompleted ? "rgba(34, 197, 94, 0.3)" : "rgba(255, 255, 255, 0.05)"
      }}
      className={`w-16 h-16 rounded-2xl flex items-center justify-center border-2 transition-colors duration-500 bg-black/40 backdrop-blur-md relative ${
        isActive ? "shadow-[0_0_30px_rgba(59,130,246,0.3)] ring-1 ring-blue-500/50" : ""
      }`}
    >
      <Icon className={`w-8 h-8 transition-colors duration-500 ${
        isActive ? "text-blue-500" : isCompleted ? "text-green-500" : "text-muted-foreground/30"
      }`} />
      
      {isActive && (
        <motion.div 
          className="absolute inset-0 rounded-2xl border-2 border-blue-500"
          animate={{ scale: [1, 1.2], opacity: [0.5, 0] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
        />
      )}
    </motion.div>
    
    <div className="text-center space-y-1">
      <h4 className={`text-xs font-black tracking-widest uppercase transition-colors ${
        isActive ? "text-blue-400" : isCompleted ? "text-green-500" : "text-muted-foreground/40"
      }`}>
        {label}
      </h4>
      <p className="text-[10px] text-muted-foreground/40 font-medium max-w-[120px] leading-tight">
        {description}
      </p>
    </div>
  </div>
);

const AIAssignmentFlow = ({ currentStatus = "" }: { currentStatus?: string }) => {
  // Mapping currentStatus to a 5-step index
  const getStepIndex = (status: string) => {
    const s = status.toUpperCase();
    if (s === "PENDING") return 0;
    if (s === "AI_ANALYSIS" || s === "ACKNOWLEDGED") return 1;
    if (s === "ASSIGNED") return 2;
    if (s === "IN_PROGRESS") return 3;
    if (s === "RESOLVED" || s === "COMPLETED") return 4;
    return 1; // Default to AI analysis if we are tracking
  };

  const activeIndex = getStepIndex(currentStatus);

  const steps = [
    { label: "Intake", icon: User, description: "Grievance signal received." },
    { label: "Analysis", icon: Bot, description: "AI determines category & risk." },
    { label: "Dispatch", icon: Zap, description: "AI routes to optimal crew." },
    { label: "Fixing", icon: Wrench, description: "Crew performing site repairs." },
    { label: "Verified", icon: CheckCircle2, description: "Resolution locked in ledger." }
  ];

  const getAILog = (index: number) => {
    switch (index) {
      case 0: return "Awaiting signal intake from the Grid...";
      case 1: return "AI Brain scanning media context & prioritizing...";
      case 2: return "Optimizing route for Lead Technical Officer...";
      case 3: return "Live telemetry: Hardware remediation in progress...";
      case 4: return "Case closed. All grid parameters restored.";
      default: return "Monitoring operational integrity...";
    }
  };

  return (
    <div className="glass-card p-10 border-white/5 bg-white/[0.01] overflow-hidden relative">
      {/* Background Brain Grid */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none">
        <svg className="w-full h-full" viewBox="0 0 800 200">
           <path d="M0 100 Q 200 50 400 100 T 800 100" fill="none" stroke="currentColor" strokeWidth="1" />
           <path d="M0 100 Q 200 150 400 100 T 800 100" fill="none" stroke="currentColor" strokeWidth="1" />
        </svg>
      </div>

      <div className="flex items-center justify-between mb-12">
        <div className="flex items-center gap-3">
          <Cpu className="text-blue-500 w-5 h-5" />
          <h3 className="text-sm font-black uppercase tracking-[0.25em]">Operational Flow</h3>
        </div>
        <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
            <span className="text-[9px] font-bold text-blue-500/60 uppercase tracking-widest">Live Orchestration</span>
        </div>
      </div>

      <div className="flex items-start justify-between relative px-4">
        {/* Dynamic Connection Line */}
        <div className="absolute left-[8%] right-[8%] top-8 h-[2px] bg-white/5">
           <motion.div 
             className="h-full bg-gradient-to-r from-blue-600 via-blue-400 to-emerald-400"
             initial={{ width: "0%" }}
             animate={{ width: `${(activeIndex / (steps.length - 1)) * 100}%` }}
             transition={{ duration: 1.5, ease: "easeInOut" }}
           />
           {/* Moving Packet */}
           <motion.div 
             className="absolute top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-white shadow-[0_0_10px_white]"
             animate={{ 
               left: ["0%", "100%"],
               opacity: [0, 1, 0]
             }}
             transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
             style={{ left: "-10px" }}
           />
        </div>

        {steps.map((step, i) => (
          <FlowStep 
            key={i}
            id={i}
            label={step.label}
            icon={step.icon}
            isActive={i === activeIndex}
            isCompleted={i < activeIndex}
            description={step.description}
          />
        ))}
      </div>
      
      {/* AI Log Footer */}
      <div className="mt-12 flex items-center justify-between pt-6 border-t border-white/5 relative z-10">
        <div className="space-y-1">
            <p className="text-[9px] font-black uppercase text-blue-500/60 tracking-widest flex items-center gap-2">
                <Activity className="w-3 h-3 animate-pulse" />
                Current AI Operation
            </p>
            <p className="text-[11px] font-bold text-foreground italic flex items-center gap-2">
                <Send className="w-3 h-3 text-blue-500 rotate-[-45deg]" />
                {getAILog(activeIndex)}
            </p>
        </div>
        <div className="flex -space-x-2">
            {[...Array(3)].map((_, i) => (
                <div key={i} className="w-6 h-6 rounded-full border border-black bg-white/5 backdrop-blur-sm flex items-center justify-center overflow-hidden">
                    <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=Crew${i+activeIndex}`} alt="Crew" className="w-full h-full object-cover opacity-60" />
                </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default AIAssignmentFlow;
