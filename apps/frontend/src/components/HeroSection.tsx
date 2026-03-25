import { ArrowRight, Play, Cpu } from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
      {/* Background Video */}
      <div className="absolute inset-0 z-0">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover opacity-60"
        >
          <source src="/bg1.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/40 to-black z-1" />
      </div>

      <div className="relative z-10 container mx-auto px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >

          <h1 className="text-5xl md:text-7xl lg:text-8xl font-display font-black text-white mb-8 leading-[1.05] tracking-tighter max-w-5xl mx-auto">
            The AI Operating System for <span className="text-white italic">Civic Infrastructure.</span>
          </h1>
          
          <p className="text-lg md:text-xl text-white/70 mb-12 max-w-3xl mx-auto leading-relaxed font-medium">
            Automate the intake, triage, and resolution of public grievances 
            with sub-second precision using the Grid-Core neural architecture.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <Link to="/login" className="bg-white text-black font-bold px-10 py-5 rounded-full hover:bg-white/90 transition-all text-sm tracking-widest uppercase">
              Initialize Grid
            </Link>
            <a href="#impact" className="border border-white/20 text-white font-bold px-10 py-5 rounded-full hover:bg-white/5 transition-all text-sm tracking-widest uppercase flex items-center gap-3">
              <Play className="w-4 h-4 fill-white" />
              System Walkthrough
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
