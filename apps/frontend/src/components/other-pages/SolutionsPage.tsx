import { motion } from "framer-motion";
import { Zap, Shield, Globe, Cpu, BarChart, Rocket } from "lucide-react";

const solutions = [
  { title: "Smart Triage", icon: Cpu, desc: "AI-driven grievance categorization and priority assignment." },
  { title: "Transparent Tracking", icon: Globe, desc: "Blockchain-backed resolution history for citizen trust." },
  { title: "SLA Automation", icon: Zap, desc: "Automated escalation and monitoring of resolution timelines." },
  { title: "Predictive Analytics", icon: BarChart, desc: "Identify infrastructure failure patterns before they happen." },
  { title: "Security First", icon: Shield, desc: "Advanced data protection for sensitive citizen information." },
  { title: "Rapid Deployment", icon: Rocket, desc: "Set up your city's grid in less than 48 hours." }
];

const SolutionsPage = () => {
  return (
    <div className="pt-8 lg:pt-32 pb-24 px-6 max-w-7xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-16"
      >
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">Enterprise Solutions</h1>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
          Tailored tools to help public administrators manage urban challenges with precision and speed.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
        {solutions.map((solution, i) => (
          <motion.div
            key={solution.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: i * 0.1 }}
            className="p-8 rounded-3xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] transition-all group"
          >
            <div className="w-14 h-14 rounded-2xl bg-blue-600/10 border border-blue-600/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <solution.icon className="w-7 h-7 text-blue-500" />
            </div>
            <h3 className="text-xl font-bold mb-3">{solution.title}</h3>
            <p className="text-muted-foreground leading-relaxed">
              {solution.desc}
            </p>
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        className="p-12 rounded-[2.5rem] bg-gradient-to-br from-blue-600/20 to-transparent border border-blue-600/20 text-center"
      >
        <h2 className="text-3xl font-bold mb-4">Ready to implement enterprise solutions?</h2>
        <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
          Contact our specialist team to discuss custom deployment, API integration, and on-premise solutions for your city.
        </p>
        <a href="/contact" className="cta-button-primary">
          Contact Our Specialist Team
        </a>
      </motion.div>
    </div>
  );
};

export default SolutionsPage;
