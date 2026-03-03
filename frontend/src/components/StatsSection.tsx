"use client";

import { useEffect, useRef, useState } from "react";

const stats = [
  {
    value: 10000,
    suffix: "+",
    label: "Complaints Resolved",
    description: "And counting",
  },
  {
    value: 30,
    prefix: "<",
    suffix: "s",
    label: "Auto-Assign Time",
    description: "Average routing speed",
  },
  {
    value: 90,
    suffix: "%+",
    label: "SLA Compliance",
    description: "On-time resolution rate",
  },
  {
    value: 50,
    suffix: "+",
    label: "Departments",
    description: "Connected and active",
  },
];

function AnimatedCounter({
  target,
  prefix,
  suffix,
  triggered,
}: {
  target: number;
  prefix?: string;
  suffix?: string;
  triggered: boolean;
}) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!triggered) return;

    let start = 0;
    const duration = 2000;
    const startTime = Date.now();

    const step = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      start = Math.floor(eased * target);
      setCount(start);
      if (progress < 1) {
        requestAnimationFrame(step);
      }
    };

    requestAnimationFrame(step);
  }, [target, triggered]);

  return (
    <span className="stat-number">
      {prefix}
      {count.toLocaleString()}
      {suffix}
    </span>
  );
}

export default function StatsSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [triggered, setTriggered] = useState(false);

  useEffect(() => {
    const loadGSAP = async () => {
      const gsapModule = await import("gsap");
      const gsap = gsapModule.default;
      const { ScrollTrigger } = await import("gsap/ScrollTrigger");
      gsap.registerPlugin(ScrollTrigger);

      const ctx = gsap.context(() => {
        ScrollTrigger.create({
          trigger: sectionRef.current,
          start: "top 70%",
          onEnter: () => setTriggered(true),
        });

        gsap.from(".stats-header", {
          scrollTrigger: { trigger: ".stats-header", start: "top 85%" },
          opacity: 0,
          y: 30,
          duration: 0.8,
          ease: "power3.out",
        });
      }, sectionRef);

      return () => ctx.revert();
    };

    loadGSAP();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="stats"
      className="section-padding relative overflow-hidden"
    >
      {/* Background glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/4 w-80 h-80 rounded-full bg-accent/5 blur-[100px]" />
        <div className="absolute top-1/3 right-1/4 w-60 h-60 rounded-full bg-resolved/5 blur-[80px]" />
      </div>

      <div className="container-custom relative z-10">
        {/* Header */}
<div className="stats-header mb-16 flex flex-col items-center text-center">
  <span className="inline-block text-sm font-semibold text-accent-light tracking-wider uppercase mb-4">
    Impact Metrics
  </span>

  <h2 className="text-4xl sm:text-5xl font-bold gradient-text">
    Real Results, Real Impact
  </h2>

  <p className="mt-6 text-lg text-text-secondary max-w-2xl">
    The numbers that define our mission to transform public service
    delivery.
  </p>
</div>

        {/* Stats Grid */}
        <div className="stats-grid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, i) => (
            <div key={i} className="stat-item glass-card p-8 text-center group">
              <div className="text-4xl sm:text-5xl font-bold text-text-primary mb-2 tracking-tight">
                <AnimatedCounter
                  target={stat.value}
                  prefix={stat.prefix}
                  suffix={stat.suffix}
                  triggered={triggered}
                />
              </div>
              <div className="text-lg font-semibold text-text-primary mb-1">
                {stat.label}
              </div>
              <div className="text-sm text-text-muted">{stat.description}</div>

              {/* Bottom accent line */}
              <div className="mt-6 h-1 w-12 mx-auto rounded-full bg-accent/30 group-hover:w-full group-hover:bg-accent-light/50 transition-all duration-700" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
