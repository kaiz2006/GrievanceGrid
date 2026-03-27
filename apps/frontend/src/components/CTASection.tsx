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
          className="glass-card p-12 md:p-24 text-center relative overflow-hidden rounded-[3rem] border-white/5"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-transparent" />
          <div className="relative z-10">
            <h2 className="section-heading mb-4 max-w-2xl mx-auto">
              Ready to Modernize Your Public Service?
            </h2>
            <p className="section-subtext mb-10">
              Join the growing list of cities using GrievanceGrid to improve transparency and efficiency.
            </p>
            <a href="/contact" className="cta-button-white group">
              CONTACT OUR TEAM NOW
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default CTASection;
