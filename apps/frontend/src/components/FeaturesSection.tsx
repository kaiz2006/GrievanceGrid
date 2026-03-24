import { motion } from "framer-motion";
import { Moon, Layers, Workflow, Brain, BarChart3 } from "lucide-react";

const features = [
  {
    icon: Layers,
    title: "Fast, scalable, and tailored solutions",
    description: "Analyze deadlines and context to reorder intelligently.",
  },
  {
    icon: Workflow,
    title: "Workflow Automation",
    description: "Trigger actions based on task completion, time, or team activity.",
  },
  {
    icon: Brain,
    title: "AI Planning Assistant",
    description: "Suggests assignees, sets reminders, and flags blockers.",
  },
  {
    icon: BarChart3,
    title: "Smart Analytics Dashboard",
    description: "Analyze deadlines and context to reorder intelligently.",
  },
];

const FeaturesSection = () => {
  return (
    <section className="py-24 relative" id="features">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <div className="section-badge mx-auto mb-6">
            <Moon className="w-4 h-4 text-primary" />
            <span>Our Features</span>
          </div>
          <h2 className="section-heading mb-4">Your Productivity, Reinvented with AI</h2>
          <p className="section-subtext">
            Task AI Management was founded by a team of productivity hackers.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {features.map((feature, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="glass-card p-8 group hover:border-primary/30 transition-colors"
            >
              <div className="feature-icon mb-5">
                <feature.icon className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-display font-semibold text-foreground mb-2">
                {feature.title}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
