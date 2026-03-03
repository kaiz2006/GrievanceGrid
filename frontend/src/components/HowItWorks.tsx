"use client";

import { useEffect, useRef } from "react";

const steps = [
  {
    number: "01",
    title: "Citizen Reports",
    description:
      "Citizens submit grievances through a simple interface with category selection, location tagging, and photo evidence. A unique Grid ID is generated instantly.",
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
      </svg>
    ),
    color: "#06B6D4",
  },
  {
    number: "02",
    title: "AI Routes Intelligently",
    description:
      "The routing engine automatically categorizes complaints using AI, maps them to the correct department, assigns priority, and enforces SLA timelines.",
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
      </svg>
    ),
    color: "#1E40AF",
  },
  {
    number: "03",
    title: "Officer Takes Action",
    description:
      "Assigned officers see a clear task queue with SLA countdown timers, priority badges, and can update status, add notes, and upload resolution proof.",
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
      </svg>
    ),
    color: "#F59E0B",
  },
  {
    number: "04",
    title: "Resolution Tracked",
    description:
      "Complete lifecycle tracking from submission to resolution. Citizens rate the outcome, and all data feeds into the command center for governance insights.",
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    color: "#10B981",
  },
];

export default function HowItWorks() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let ctx: any;

    const loadAnimations = async () => {
      try {
        const gsapModule = await import("gsap");
        const gsap = gsapModule.default;
        const { ScrollTrigger } = await import("gsap/ScrollTrigger");
        gsap.registerPlugin(ScrollTrigger);

        if (!sectionRef.current) return;

        ctx = gsap.context(() => {
          gsap.from(".hiw-header", {
            scrollTrigger: {
              trigger: ".hiw-header",
              start: "top 85%",
            },
            opacity: 0,
            y: 40,
            duration: 0.8,
            ease: "power3.out",
          });

          gsap.from(".hiw-step", {
            scrollTrigger: {
              trigger: ".hiw-steps",
              start: "top 75%",
            },
            opacity: 0,
            x: -60,
            duration: 0.8,
            stagger: 0.2,
            ease: "power3.out",
          });

          gsap.from(".hiw-progress", {
            scrollTrigger: {
              trigger: ".hiw-steps",
              start: "top 75%",
              end: "bottom 40%",
              scrub: 1,
            },
            scaleY: 0,
            transformOrigin: "top",
          });
        }, sectionRef.current);
      } catch (error) {
        console.error("GSAP Animation error:", error);
      }
    };

    loadAnimations();
    return () => {
      if (ctx) ctx.revert();
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      id="how-it-works"
      className="section-padding relative overflow-hidden"
    >
      <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-accent/5 blur-[150px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-80 h-80 rounded-full bg-new-status/5 blur-[120px] pointer-events-none" />

      <div className="container-custom relative z-10">
        <div className="hiw-header text-center mb-20">
          <div className="inline-flex items-center gap-2 bg-accent/10 backdrop-blur-sm border border-accent/20 px-4 py-2 rounded-full mb-6">
            <div className="w-2 h-2 rounded-full bg-accent animate-pulse" />
            <span className="text-sm font-semibold text-accent-light tracking-wider uppercase">
              How It Works
            </span>
          </div>

          <div className="max-w-3xl mx-auto">
            <h2 className="text-4xl sm:text-5xl font-bold gradient-text mb-12">
              From Complaint to Resolution
            </h2>
            <p className="text-lg text-white/80 leading-relaxed">
              A seamless 4-step workflow that transforms how public service
              grievances are handled with intelligence and efficiency.
            </p>
          </div>
        </div>

        <div className="hiw-steps relative max-w-5xl mx-auto flex justify-center px-4 md:px-0">
          <div className="relative w-full">
            <div className="hidden md:block absolute left-0 top-0 bottom-0 w-[1px] bg-bg-tertiary/30">
              <div className="hiw-progress absolute inset-0 bg-gradient-to-b from-accent-light/30 via-accent/20 to-resolved/30" />
            </div>

            <div className="space-y-12 pl-10 md:pl-16">
              {steps.map((step, i) => (
                <div key={i} className="hiw-step flex gap-6 items-start group py-8">
                  <div className="hidden md:flex flex-col items-center flex-shrink-0 relative z-10">
                    <div
                      className="w-16 h-16 rounded-2xl flex items-center justify-center transition-all duration-500 group-hover:scale-110 group-hover:rotate-6 shadow-lg relative z-10"
                      style={{
                        background: `linear-gradient(135deg, ${step.color}20, ${step.color}10), #0f172a`,
                        border: `2px solid ${step.color}40`,
                        color: step.color,
                        boxShadow: `0 8px 32px ${step.color}25`,
                      }}
                    >
                      <div className="transform transition-transform duration-300 group-hover:scale-110">
                        {step.icon}
                      </div>
                    </div>
                    <div className="mt-3 text-xs font-bold tracking-widest uppercase opacity-60" style={{ color: step.color }}>
                      {step.number}
                    </div>
                  </div>

                  <div className="glass-card p-8 flex-1 group-hover:border-white/20 transition-all duration-500 group-hover:shadow-2xl relative overflow-hidden">
                    <div 
                      className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                      style={{
                        background: `linear-gradient(135deg, ${step.color}05, transparent)`,
                      }}
                    />
                    
                    <div className="relative z-10">
                      <div className="flex items-center gap-4 mb-4">
                        <div
                          className="md:hidden w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 shadow-md z-10"
                          style={{
                            background: `linear-gradient(135deg, ${step.color}20, ${step.color}10), #0f172a`,
                            color: step.color,
                            border: `1px solid ${step.color}30`,
                          }}
                        >
                          {step.icon}
                        </div>
                        <div>
                          <span
                            className="text-xs font-bold tracking-widest uppercase mb-2 inline-block"
                            style={{ color: step.color }}
                          >
                            Step {step.number}
                          </span>
                          <h3 className="text-2xl font-bold text-text-primary group-hover:text-white transition-colors duration-300">
                            {step.title}
                          </h3>
                        </div>
                      </div>
                      <p className="text-text-secondary leading-relaxed group-hover:text-text-primary/90 transition-colors duration-300">
                        {step.description}
                      </p>
                      
                      <div className="mt-4 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: step.color }} />
                        <span className="text-xs font-medium" style={{ color: step.color }}>
                          Click to learn more
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
