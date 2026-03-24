import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

const CTASection = () => {
  return (
    <section className="py-24 relative">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="glass-card p-12 md:p-20 text-center relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent" />
          <div className="relative z-10">
            <h2 className="section-heading mb-4 max-w-2xl mx-auto">
              Ready to Transform Your Workflow?
            </h2>
            <p className="section-subtext mb-10">
              Join thousands of teams already using Infranex to boost productivity and ship faster.
            </p>
            <a href="#pricing" className="cta-button-primary group">
              GET STARTED NOW
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default CTASection;
