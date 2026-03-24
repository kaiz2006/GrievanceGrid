import { motion } from "framer-motion";
import { Moon, Zap, Mic, Settings } from "lucide-react";

const steps = [
  {
    icon: Zap,
    title: "AI-Powered Prioritization",
    description: "Our engine ranks tasks by urgency & importance.",
  },
  {
    icon: Mic,
    title: "Capture Tasks Instantly",
    description: "Add tasks via voice, email, or integrations.",
  },
  {
    icon: Settings,
    title: "Seamless Automation",
    description: "We ready to handle them for you.",
  },
];

const HowItWorks = () => {
  return (
    <section className="py-24 relative" id="about-us">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <div className="section-badge mx-auto mb-6">
            <Moon className="w-4 h-4 text-primary" />
            <span>How It Works</span>
          </div>
          <h2 className="section-heading mb-4">Where complexity meets clarity</h2>
          <p className="section-subtext">
            Analyze deadlines, effort, and context to reorder intelligently.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {steps.map((step, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
              className="glass-card p-8 text-center group hover:border-primary/30 transition-colors"
            >
              <div className="feature-icon mx-auto mb-6">
                <step.icon className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-display font-semibold text-foreground mb-3">
                {step.title}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {step.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
