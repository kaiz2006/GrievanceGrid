import { motion } from "framer-motion";
import { ShieldCheck, ArrowRight } from "lucide-react";

const stats = [
  { value: "50k+", label: "Complaints Resolved" },
  { value: "12h", label: "Avg. Response Time" },
  { value: "100%", label: "Data Security" },
];

const StatsSection = () => {
  return (
    <section className="py-24 relative">
      <div className="container mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <div className="w-16 h-16 rounded-2xl bg-muted border border-border flex items-center justify-center mb-6">
              <ShieldCheck className="w-6 h-6 text-primary" />
            </div>
            <p className="text-muted-foreground text-lg leading-relaxed mb-8">
              GrievanceGrid is built by experts in public administration and data security, 
              ensuring every citizen voice is heard and every issue is resolved with transparency.
            </p>
            <a href="#solutions" className="cta-button group">
              VIEW IMPACT DASHBOARD
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </a>
          </div>

          <div className="grid grid-cols-3 gap-6">
            {stats.map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className="glass-card p-6 text-center"
              >
                <div className="text-3xl md:text-4xl font-display font-bold text-foreground mb-2">
                  {stat.value}
                </div>
                <div className="text-xs text-muted-foreground tracking-wider uppercase">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default StatsSection;
