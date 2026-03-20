import { motion } from "framer-motion";
import { MessagesSquare, Share2, Navigation, Archive, ShieldCheck } from "lucide-react";

const features = [
  {
    icon: MessagesSquare,
    title: "Centralized Intake",
    description: "Capture grievances from multiple channels—web, mobile, and SMS—into a single, unified grid.",
  },
  {
    icon: Share2,
    title: "Automated Routing",
    description: "AI-driven logic ensures every complaint is instantly routed to the correct department and officer.",
  },
  {
    icon: Navigation,
    title: "Geo-Analytics",
    description: "Visualize grievance clusters on interactive maps to identify and address systemic local issues.",
  },
  {
    icon: Archive,
    title: "Resolution Tracking",
    description: "Monitor every step of the resolution process with real-time status updates and audit trails.",
  },
];

const FeaturesSection = () => {
  return (
    <section className="py-24 relative overflow-hidden" id="features">
      {/* Background Video */}
      <div className="absolute inset-0 z-0">
        <video
          autoPlay
          muted
          loop
          playsInline
          className="w-full h-full object-cover opacity-60 brightness-[0.4]"
        >
          <source src="/bg3.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-b from-background via-transparent to-background" />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center mb-16">
          <div className="section-badge mx-auto mb-6">
            <ShieldCheck className="w-4 h-4 text-primary" />
            <span>Core Capabilities</span>
          </div>
          <h2 className="section-heading mb-4">Accountability through Automation</h2>
          <p className="section-subtext">
            GrievanceGrid empowers public administrators with the tools to respond faster and more effectively.
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
