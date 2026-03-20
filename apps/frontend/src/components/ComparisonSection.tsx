import { ShieldCheck, ArrowRight, X } from "lucide-react";
import { motion } from "framer-motion";

const gridFeatures = [
  "Automated intelligent routing of complaints",
  "Real-time status tracking for citizens",
  "Centralized dashboard for administrators",
  "SLA monitoring and automatic escalation",
  "Geo-analytics for location-based reporting",
  "Highly secure and compliant data storage",
  "Transparent audit trails for every action",
  "Multi-channel intake (Web, Mobile, SMS)",
];

const traditionalFeatures = [
  "Manual routing leading to delays",
  "Lack of visibility for citizens",
  "Fragmented data across departments",
  "Frequent SLA breaches without alerts",
  "Reactive reporting based on manual logs",
  "Legacy systems with security gaps",
  "Unclear paper trails and accountability",
  "Limited or singular intake channels",
];

const ComparisonSection = () => {
  return (
    <section className="py-24 relative overflow-hidden">
      {/* Background Video */}
      <div className="absolute inset-0 z-0">
        <video
          autoPlay
          muted
          loop
          playsInline
          className="w-full h-full object-cover opacity-60 brightness-[0.4]"
        >
          <source src="/bg6.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-b from-background via-transparent to-background" />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center mb-16">
          <div className="section-badge mx-auto mb-6">
            <ShieldCheck className="w-4 h-4 text-primary" />
            <span>Comparison</span>
          </div>
          <h2 className="section-heading mb-4">GrievanceGrid vs. Traditional Methods</h2>
          <p className="section-subtext">Modernizing public service through accountability and technology.</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="glass-card p-8 border-primary/30"
          >
            <div className="flex items-center gap-2 mb-8">
              <ShieldCheck className="w-5 h-5 text-primary" />
              <span className="font-display font-bold text-foreground">GrievanceGrid</span>
            </div>
            <div className="space-y-4">
              {gridFeatures.map((f, i) => (
                <div key={i} className="flex items-start gap-3">
                  <ArrowRight className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-foreground">{f}</span>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="glass-card p-8"
          >
            <div className="flex items-center gap-2 mb-8">
              <ShieldCheck className="w-5 h-5 text-muted-foreground" />
              <span className="font-display font-bold text-muted-foreground">Traditional Systems</span>
            </div>
            <div className="space-y-4">
              {traditionalFeatures.map((f, i) => (
                <div key={i} className="flex items-start gap-3">
                  <X className="w-4 h-4 text-destructive/60 mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-muted-foreground">{f}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default ComparisonSection;
