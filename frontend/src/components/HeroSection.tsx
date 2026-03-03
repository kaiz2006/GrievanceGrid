import { useEffect, useRef } from "react";

const stats = [
  { value: "10K+", label: "Complaints Resolved", icon: "✓" },
  { value: "<30s", label: "Auto-Assign Time", icon: "⚡" },
  { value: "90%+", label: "SLA Compliance", icon: "📊" },
];

export default function HeroSection() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const loadGSAP = async () => {
      const gsapModule = await import("gsap");
      const gsap = gsapModule.default;
      const { ScrollTrigger } = await import("gsap/ScrollTrigger");
      gsap.registerPlugin(ScrollTrigger);

      const ctx = gsap.context(() => {
        // Animate hero content
        gsap.from(".hero-badge", {
          opacity: 0,
          y: 20,
          duration: 0.8,
          delay: 0.2,
          ease: "power3.out",
        });

        gsap.from(".hero-title", {
          opacity: 0,
          y: 40,
          duration: 1,
          delay: 0.4,
          ease: "power3.out",
        });

        gsap.from(".hero-subtitle", {
          opacity: 0,
          y: 30,
          duration: 0.8,
          delay: 0.6,
          ease: "power3.out",
        });

        gsap.from(".hero-cta", {
          opacity: 0,
          y: 20,
          duration: 0.8,
          delay: 0.8,
          ease: "power3.out",
        });

        gsap.from(".hero-stat", {
          opacity: 0,
          y: 30,
          scale: 0.9,
          duration: 0.6,
          stagger: 0.15,
          delay: 1,
          ease: "back.out(1.7)",
        });
      }, sectionRef);

      return () => ctx.revert();
    };

    loadGSAP();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative min-h-[110vh] flex flex-col items-center justify-start pt-32 sm:pt-40 overflow-hidden"
    >
      {/* Video Background with Mask Fade */}
      <div className="absolute inset-0 z-0 bg-mask-bottom pointer-events-none">
        <video
          autoPlay
          muted
          loop
          playsInline
          className="w-full h-full object-cover opacity-80"
        >
          <source src="/Background.mp4" type="video/mp4" />
        </video>
        {/* Dark overlay to ensure text readability */}
        <div className="absolute inset-0 bg-black/40" />
      </div>

      {/* Hero Content aligned to top-center */}
      <div 
        className="relative z-10 w-full max-w-7xl mx-auto flex flex-col items-center text-center px-6"
        style={{ marginTop: "200px" }}
      >
        {/* Badge */}
        <div className="hero-badge inline-flex items-center gap-2 bg-black/50 backdrop-blur-xl border border-white/20 px-6 py-3.5 rounded-full mb-8 group hover:bg-black/60 hover:border-white/30 transition-all duration-500 cursor-pointer shadow-lg">
          <span className="w-3 h-3 rounded-full bg-resolved animate-pulse shadow-lg shadow-resolved/50" />
          <span className="text-sm font-semibold text-white tracking-wide">
            Powering Smart Governance
          </span>
          <svg className="w-4 h-4 text-white/80 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
          </svg>
        </div>

        {/* Title using Serif font */}
        <h1 className="hero-title font-serif text-5xl sm:text-6xl lg:text-7xl xl:text-8xl leading-[1.05] tracking-tight mb-6 max-w-5xl text-white drop-shadow-lg">
          Transforming Public Service.<br />
          One Grievance at a Time.
        </h1>

        {/* Subtitle */}
        <p className="hero-subtitle text-lg sm:text-xl text-white/90 max-w-2xl mb-12 leading-relaxed font-light drop-shadow-md">
          An intelligent command center that captures, routes, and resolves
          citizen complaints with real-time transparency and AI-powered
          automation.
        </p>

        {/* CTA (Enhanced Command Center Button) */}
        <div className="hero-cta flex justify-center mb-24">
          <a
            href="#"
            className="group relative inline-flex items-center gap-3 bg-gradient-to-r from-white/10 to-white/5 hover:from-white/20 hover:to-white/10 backdrop-blur-md border border-white/20 text-white font-semibold px-10 py-5 rounded-full transition-all duration-500 overflow-hidden"
          >
            {/* Animated background gradient */}
            <div className="absolute inset-0 bg-gradient-to-r from-accent/20 to-accent-light/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            
            {/* Shimmer effect */}
            <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
            </div>
            
            <span className="relative z-10 flex items-center gap-3">
              {/* Icon with rotation */}
              <div className="w-5 h-5 rounded-full bg-resolved/20 flex items-center justify-center group-hover:rotate-180 transition-transform duration-500">
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10 2a8 8 0 100 16 8 8 0 000-16zM8 7a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1zm1 4a1 1 0 100 2v3a1 1 0 11-2 0v-3a1 1 0 011-1z"/>
                </svg>
              </div>
              
              Launch Command Center
              
              {/* Arrow with slide animation */}
              <svg
                className="w-5 h-5 transition-all duration-300 group-hover:translate-x-2 group-hover:scale-110"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </span>
            
            {/* Subtle glow on hover */}
            <div className="absolute -inset-1 bg-gradient-to-r from-accent/20 to-accent-light/20 rounded-full blur-xl opacity-0 group-hover:opacity-50 transition-opacity duration-500" />
          </a>
        </div>

        {/* Stats pushed further down over the fading background */}
        <div className="w-full max-w-5xl mt-auto pb-20">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8">
            {stats.map((stat, i) => (
              <div
                key={i}
                className="hero-stat flex-1 flex flex-col items-center p-6 rounded-2xl bg-black/20 backdrop-blur-sm border border-white/5 hover:bg-black/40 transition-colors"
              >
                <div className="text-4xl sm:text-5xl font-serif text-white mb-2 drop-shadow-md">
                  {stat.value}
                </div>
                <div className="text-sm sm:text-base text-text-primary/80 font-medium tracking-wide">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
