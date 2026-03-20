import { motion } from "framer-motion";
import { Users, Timer, Smile, CheckSquare } from "lucide-react";

const ImpactPage = () => {
  return (
    <div className="pt-32 pb-24 px-6 max-w-7xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-16"
      >
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">Real-World Impact</h1>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
          Measuring the difference GrievanceGrid makes in communities across the globe.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="p-12 rounded-[3rem] bg-blue-600/5 border border-blue-600/10"
        >
          <Timer className="w-12 h-12 text-blue-500 mb-6" />
          <h3 className="text-3xl font-bold mb-4">40% Faster Resolution</h3>
          <p className="text-muted-foreground text-lg leading-relaxed">
            By automating triage and routing, we reduce the average time to start work on a grievance by 40%.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="p-12 rounded-[3rem] bg-green-600/5 border border-green-600/10"
        >
          <Smile className="text-green-500 w-12 h-12 mb-6" />
          <h3 className="text-3xl font-bold mb-4">85% Citizen Satisfaction</h3>
          <p className="text-muted-foreground text-lg leading-relaxed">
            Real-time tracking and transparent communication leads to significantly higher trust in public administration.
          </p>
        </motion.div>
      </div>

      <div className="glass-card p-12 text-center border-white/5 bg-white/[0.01]">
        <CheckSquare className="w-16 h-16 text-blue-500 mx-auto mb-8" />
        <h2 className="text-4xl font-bold mb-4">1.2 Million Grievances Resolved</h2>
        <p className="text-muted-foreground text-lg">
          Join the hundreds of cities already using GrievanceGrid to improve public service.
        </p>
      </div>
    </div>
  );
};

export default ImpactPage;
