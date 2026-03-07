"use client";

/* ─────────────────────────────────────────────
   StatsSection — clean professional rewrite
   No GSAP, native IntersectionObserver
───────────────────────────────────────────────── */

import { useEffect, useRef, useState } from "react";

interface Stat {
  value: number;
  prefix?: string;
  suffix?: string;
  label: string;
  description: string;
  accent: string;
}

const stats: Stat[] = [
  {
    value: 10000,
    suffix: "+",
    label: "Complaints Resolved",
    description: "And counting",
    accent: "#06b6d4",
  },
  {
    value: 30,
    prefix: "<",
    suffix: "s",
    label: "Auto-Assign Time",
    description: "Average routing speed",
    accent: "#3b82f6",
  },
  {
    value: 90,
    suffix: "%+",
    label: "SLA Compliance",
    description: "On-time resolution rate",
    accent: "#10b981",
  },
  {
    value: 50,
    suffix: "+",
    label: "Departments",
    description: "Connected and active",
    accent: "#f59e0b",
  },
];

export default function StatsSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [triggered, setTriggered] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTriggered(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="stats"
      className="relative overflow-hidden"
      style={{
        zIndex: 10,
        background: "var(--bg-primary)",
        padding: "80px 0 100px",
      }}
    >
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 32px" }}>
        
        {/* ── Section header ── */}
        <div style={{ textAlign: "center", marginBottom: 64 }}>
          <span
            style={{
              display: "inline-block",
              fontSize: "0.75rem",
              fontWeight: 700,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: "#60a5fa",
              marginBottom: 16,
            }}
          >
            Impact Metrics
          </span>
          <h2
            style={{
              fontSize: "clamp(1.75rem, 4vw, 2.75rem)",
              fontWeight: 800,
              lineHeight: 1.1,
              color: "#f8fafc",
              margin: 0,
            }}
          >
            Real Results, Real Impact
          </h2>
          <p
            style={{
              marginTop: 20,
              fontSize: "1.1rem",
              color: "rgba(255,255,255,0.6)",
              maxWidth: 600,
              margin: "20px auto 0",
            }}
          >
            The numbers that define our mission to transform public service delivery.
          </p>
        </div>

        {/* ── Stats grid ── */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
            gap: 20,
          }}
        >
          {stats.map((stat, i) => (
            <StatCard key={i} stat={stat} triggered={triggered} />
          ))}
        </div>
      </div>
    </section>
  );
}

function StatCard({ stat, triggered }: { stat: Stat; triggered: boolean }) {
  return (
    <div
      style={{
        background: "rgba(15, 23, 42, 0.7)",
        border: "1px solid rgba(255, 255, 255, 0.07)",
        borderRadius: 20,
        padding: "36px 28px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        textAlign: "center",
        gap: 16,
        backdropFilter: "blur(24px)",
        transition: "border-color 0.3s ease, transform 0.3s ease, box-shadow 0.3s ease",
      }}
      onMouseEnter={(e) => {
        const el = e.currentTarget as HTMLElement;
        el.style.borderColor = `${stat.accent}55`;
        el.style.transform = "translateY(-4px)";
        el.style.boxShadow = `0 20px 60px rgba(0,0,0,0.3), 0 0 0 1px ${stat.accent}22`;
      }}
      onMouseLeave={(e) => {
        const el = e.currentTarget as HTMLElement;
        el.style.borderColor = "rgba(255, 255, 255, 0.07)";
        el.style.transform = "translateY(0)";
        el.style.boxShadow = "none";
      }}
    >
      {/* Number sequence */}
      <div
        style={{
          fontSize: "clamp(2.5rem, 6vw, 3.5rem)",
          fontWeight: 800,
          color: stat.accent,
          lineHeight: 1,
          fontVariantNumeric: "tabular-nums",
          letterSpacing: "-0.02em",
        }}
      >
        <AnimatedCounter
          target={stat.value}
          prefix={stat.prefix}
          suffix={stat.suffix}
          triggered={triggered}
        />
      </div>

      {/* Text block */}
      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        <h3
          style={{
            fontSize: "1.05rem",
            fontWeight: 700,
            color: "#f1f5f9",
            margin: 0,
          }}
        >
          {stat.label}
        </h3>
        <p
          style={{
            fontSize: "0.875rem",
            lineHeight: 1.6,
            color: "rgba(255,255,255,0.5)",
            margin: 0,
          }}
        >
          {stat.description}
        </p>
      </div>
    </div>
  );
}

function AnimatedCounter({
  target,
  prefix = "",
  suffix = "",
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
    <>
      {prefix}
      {count.toLocaleString()}
      {suffix}
    </>
  );
}
