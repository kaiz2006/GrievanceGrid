import { Moon, ArrowRight, X } from "lucide-react";
import { motion } from "framer-motion";

const tashFeatures = [
  "Smart automation that saves time effortlessly",
  "Seamless onboarding with 120+ integrations",
  "Adaptive AI that learns your workflow",
  "24/7 reliable customer assistance",
  "Modern, intuitive, and user-friendly design",
  "Real-time data-driven recommendation",
  "Transparent, flexible, and value-driven plans",
  "Proven real results that drive growth",
];

const competitorFeatures = [
  "Manual workflows and repetitive tasks",
  "Complex setup and limited integrations",
  "Generic tools with no personalization",
  "Slow response and limited support",
  "Outdated interface and poor usability",
  "Reactive insights after decisions",
  "Hidden costs and unclear pricing",
  "Average productivity results",
];

const ComparisonSection = () => {
  return (
    <section className="py-24 relative">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <div className="section-badge mx-auto mb-6">
            <Moon className="w-4 h-4 text-primary" />
            <span>Compare</span>
          </div>
          <h2 className="section-heading mb-4">How Tash AI Stands Apart</h2>
          <p className="section-subtext">Discover how Tash AI delivers smarter, faster results.</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="glass-card p-8 border-primary/30"
          >
            <div className="flex items-center gap-2 mb-8">
              <Moon className="w-5 h-5 text-primary" />
              <span className="font-display font-bold text-foreground">Tash AI</span>
            </div>
            <div className="space-y-4">
              {tashFeatures.map((f, i) => (
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
              <Moon className="w-5 h-5 text-muted-foreground" />
              <span className="font-display font-bold text-muted-foreground">Competitors</span>
            </div>
            <div className="space-y-4">
              {competitorFeatures.map((f, i) => (
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
