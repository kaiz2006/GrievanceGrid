import { motion } from "framer-motion";
import { Moon, ArrowRight } from "lucide-react";

const stats = [
  { value: "$25M+", label: "Performance Snapshot" },
  { value: "250+", label: "Digital Reach" },
  { value: "98%", label: "Client Trust" },
];

const StatsSection = () => {
  return (
    <section className="py-24 relative">
      <div className="container mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <div className="w-16 h-16 rounded-2xl bg-muted border border-border flex items-center justify-center mb-6">
              <Moon className="w-6 h-6 text-primary" />
            </div>
            <p className="text-muted-foreground text-lg leading-relaxed mb-8">
              Our team of data scientists, engineers, and creatives craft tailored AI solutions that solve real-world challenges across industries.
            </p>
            <a href="#features" className="cta-button group">
              LEARN MORE
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
