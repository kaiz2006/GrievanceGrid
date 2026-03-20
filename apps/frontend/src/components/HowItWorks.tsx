import { motion } from "framer-motion";
import { UserPlus, Settings2, CheckCircle2, Shield } from "lucide-react";

const steps = [
  {
    icon: UserPlus,
    title: "Unified Submission",
    description: "Citizens submit grievances via a user-friendly portal with geo-tagging support.",
  },
  {
    icon: Settings2,
    title: "Intelligent Routing",
    description: "The system automatically assigns tasks based on department, location, and urgency.",
  },
  {
    icon: CheckCircle2,
    title: "Real-Time Tracking",
    description: "Track progress from intake to resolution with automated SMS notifications.",
  },
];

const HowItWorks = () => {
  return (
    <section className="py-24 relative overflow-hidden" id="about-us">
      {/* Background Video */}
      <div className="absolute inset-0 z-0">
        <video
          autoPlay
          muted
          loop
          playsInline
          className="w-full h-full object-cover opacity-60 grayscale brightness-[0.4]"
        >
          <source src="/bg2.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-b from-background via-transparent to-background" />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center mb-16">
          <div className="section-badge mx-auto mb-6">
            <Shield className="w-4 h-4 text-primary" />
            <span>The Process</span>
          </div>
          <h2 className="section-heading mb-4">From Grievance to Resolution</h2>
          <p className="section-subtext">
            A transparent workflow designed to bridge the gap between citizens and administration.
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
