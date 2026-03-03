"use client";

import { useEffect, useRef } from "react";

export default function CTASection() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const loadGSAP = async () => {
      const gsapModule = await import("gsap");
      const gsap = gsapModule.default;
      const { ScrollTrigger } = await import("gsap/ScrollTrigger");
      gsap.registerPlugin(ScrollTrigger);

      const ctx = gsap.context(() => {
        gsap.from(".cta-content", {
          scrollTrigger: { trigger: ".cta-content", start: "top 80%" },
          opacity: 0,
          y: 50,
          scale: 0.95,
          duration: 1,
          ease: "power3.out",
        });
      }, sectionRef);

      return () => ctx.revert();
    };

    loadGSAP();
  }, []);

  return (
    <section ref={sectionRef} className="section-padding relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] rounded-full bg-accent/8 blur-[150px]" />
      </div>

      <div className="container-custom relative z-10">
        <div className="cta-content glass-card p-12 sm:p-16 text-center max-w-4xl mx-auto relative overflow-hidden">
          {/* Corner accents */}
          <div className="absolute top-0 left-0 w-24 h-24 border-t border-l border-accent/20 rounded-tl-2xl" />
          <div className="absolute bottom-0 right-0 w-24 h-24 border-b border-r border-accent/20 rounded-br-2xl" />

          <span className="inline-block text-sm font-semibold text-accent-light tracking-wider uppercase mb-4">
            Ready to Transform?
          </span>
          <h2 className="text-3xl sm:text-5xl font-bold gradient-text mb-6 leading-tight">
            Start Building a Better
            <br />
            Public Service Today
          </h2>
          <p className="text-lg text-text-secondary max-w-xl mx-auto mb-10">
            Join the movement to modernize governance. Deploy GrievanceGrid and
            give citizens the transparency they deserve.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <a
              href="#"
              className="group relative inline-flex items-center gap-3 gradient-btn text-white font-semibold px-12 py-5 rounded-2xl text-lg glow-pulse overflow-hidden"
            >
              {/* Shimmer effect */}
              <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
              </div>
              
              <span className="relative z-10 flex items-center gap-3">
                {/* Icon container */}
                <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center group-hover:rotate-12 transition-transform duration-300">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                
                Get Started Free
                
                {/* Arrow */}
                <svg
                  className="w-5 h-5 transition-all duration-300 group-hover:translate-x-1 group-hover:scale-110"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 7l5 5m0 0l-5 5m5-5H6"
                  />
                </svg>
              </span>
              
              {/* Enhanced glow */}
              <div className="absolute -inset-2 bg-gradient-to-r from-accent/30 to-accent-light/30 rounded-2xl blur-2xl opacity-0 group-hover:opacity-70 transition-opacity duration-500" />
            </a>
            
            <a
              href="#contact"
              className="group relative inline-flex items-center gap-2 text-text-secondary hover:text-text-primary font-medium text-lg transition-all duration-300 px-6 py-3 rounded-xl hover:bg-white/5 border border-transparent hover:border-white/10"
            >
              Contact Sales
              <svg
                className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
