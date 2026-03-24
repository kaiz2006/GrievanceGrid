import { ArrowRight, Moon } from "lucide-react";
import { motion } from "framer-motion";
import heroBg from "@/assets/hero-bg.jpg";

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
      <div
        className="absolute inset-0 bg-cover bg-center opacity-40"
        style={{ backgroundImage: `url(${heroBg})` }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-background/30 to-background" />

      <div className="relative z-10 container mx-auto px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex flex-col items-center gap-6"
        >
          <div className="section-badge">
            <Moon className="w-4 h-4 text-primary" />
            <span>Smarter Task Management</span>
          </div>

          <h1 className="text-4xl md:text-6xl lg:text-7xl font-display font-bold text-foreground leading-tight max-w-4xl">
            Smarter by design.{" "}
            <br />
            Simplified by AI.
          </h1>

          <p className="text-muted-foreground text-base md:text-lg max-w-xl">
            Automate your workflows, prioritize, and focus on what truly matters.
          </p>

          <a href="#pricing" className="cta-button group mt-4">
            GET STARTED NOW
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </a>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
