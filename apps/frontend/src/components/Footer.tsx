"use client";
import React, { useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { Github, Twitter, Linkedin, Mail, Instagram } from "lucide-react";

export default function Footer() {
  const containerRef = useRef<HTMLDivElement>(null);
  // Mouse tracking for the spotlight effect
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const handleMouseMove = ({ clientX, clientY, currentTarget }: React.MouseEvent) => {
    const { left, top } = currentTarget.getBoundingClientRect();
    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
  };

  return (
    <footer 
      className="relative bg-black pt-24 pb-12 overflow-hidden border-t border-white/5"
    >
      {/* 1. TOP LINKS GRID */}
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-12 mb-20 relative z-10">
        <div className="col-span-2">
          <div className="flex items-center gap-4 mb-6">
            <img src="/logo.jpeg" className="w-10 h-10 object-contain" alt="GrievanceGrid Logo" />
            <span className="text-xl font-black text-white uppercase tracking-tighter">GrievanceGrid</span>
          </div>
          <p className="text-zinc-500 max-w-xs text-sm leading-relaxed mb-6 font-mono">
            Empowering public administrators to transform citizen complaints into actionable insights — making resolution faster, transparent, and more accountable.
          </p>
          <div className="flex gap-4">
            <FooterIcon icon={<Twitter className="w-4 h-4" />} />
            <FooterIcon icon={<Instagram className="w-4 h-4" />} />
            <FooterIcon icon={<Linkedin className="w-4 h-4" />} />
            <FooterIcon icon={<Github className="w-4 h-4" />} />
          </div>
        </div>

        <div className="space-y-4">
          <h4 className="text-xs font-mono text-zinc-300 uppercase tracking-[0.3em] mb-6">Product</h4>
          <FooterLink label="Features" />
          <FooterLink label="Pricing" />
          <FooterLink label="Integrations" />
          <FooterLink label="Changelog" />
        </div>

        <div className="space-y-4">
          <h4 className="text-xs font-mono text-zinc-300 uppercase tracking-[0.3em] mb-6">Company</h4>
          <FooterLink label="Documentation" />
          <FooterLink label="Privacy Policy" />
          <FooterLink label="Terms of Service" />
          <FooterLink label="Contact" />
        </div>
      </div>

      {/* 2. TRENDING BIG TEXT WITH CURSOR INTERACTIVITY */}
      <div 
        ref={containerRef}
        onMouseMove={handleMouseMove}
        className="relative w-full select-none px-4 mb-10 group cursor-none"
      >
        {/* Outline Layer (Static) */}
        <h2 
          className="text-[12vw] font-black leading-none text-center uppercase tracking-tighter opacity-10"
          style={{ WebkitTextStroke: "1px white", color: "transparent" }}
        >
          GrievanceGrid
        </h2>

        {/* Reveal Layer (Spotlight) */}
        <motion.h2 
          className="absolute inset-0 text-[12vw] font-black leading-none text-center uppercase tracking-tighter z-20 pointer-events-none"
          style={{ 
            color: "white",
            WebkitTextStroke: "1px white",
            clipPath: useTransform(
              [mouseX, mouseY],
              ([x, y]) => `circle(150px at ${x}px ${y}px)`
            )
          }}
        >
          GrievanceGrid
        </motion.h2>

        {/* Subtle Bottom Glow following the mouse */}
        <motion.div 
           className="absolute top-0 left-0 w-[400px] h-[400px] bg-blue-600/20 blur-[120px] rounded-full z-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity"
           style={{ 
             x: useSpring(useTransform(mouseX, (x) => x - 200), { stiffness: 100, damping: 30 }),
             y: useSpring(useTransform(mouseY, (y) => y - 200), { stiffness: 100, damping: 30 })
           }}
        />
      </div>

      {/* 3. COPYRIGHT BAR */}
      <div className="max-w-7xl mx-auto px-6 pt-12 mt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] font-mono text-zinc-600 uppercase tracking-[0.4em]">
        <span>© 2026 GrievanceGrid Infrastructure Pvt. Ltd.</span>
        <div className="flex gap-8">
        </div>
      </div>
    </footer>
  );
}

function FooterLink({ label }: { label: string }) {
  return (
    <a href="#" className="block text-sm text-zinc-500 hover:text-blue-500 transition-colors font-mono">
      {`> ${label}`}
    </a>
  );
}

function FooterIcon({ icon }: { icon: React.ReactNode }) {
  return (
    <div className="w-8 h-8 rounded-none border border-white/10 flex items-center justify-center text-zinc-500 hover:border-blue-500 hover:text-blue-500 transition-all cursor-pointer">
      {icon}
    </div>
  );
}
