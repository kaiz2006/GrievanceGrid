"use client";

import { useEffect, useRef, useState } from "react";

const stats = [
  { value: "10K+", label: "Complaints Resolved" },
  { value: "<30s", label: "Auto-Assign Time" },
  { value: "90%+", label: "SLA Compliance" },
];

// Approximation of a rounded-rect perimeter
function roundedRectPerimeter(w: number, h: number, r: number) {
  return 2 * (w - 2 * r) + 2 * (h - 2 * r) + 2 * Math.PI * r;
}

const DOT_LEN = 18;   // visible arc length in SVG units
const RADIUS = 15;    // border-radius in px (matches CSS)
const DURATION = 2.4; // seconds per full lap

function StatCard({
  value,
  label,
  delay,
}: {
  value: string;
  label: string;
  delay: number;
}) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [perimeter, setPerimeter] = useState(0);
  const [size, setSize] = useState({ w: 0, h: 0 });

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;

    const measure = () => {
      const { width, height } = el.getBoundingClientRect();
      setSize({ w: width, h: height });
      setPerimeter(roundedRectPerimeter(width, height, RADIUS));
    };

    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const { w, h } = size;

  return (
    <div ref={wrapRef} className="stat-card-glow flex-1 w-full">
      {/* SVG border dot — rendered only after dimensions are known */}
      {perimeter > 0 && (
        <svg
          className="stat-card-border-svg"
          viewBox={`0 0 ${w} ${h}`}
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Dim static border */}
          <rect
            className="border-track"
            x={0.75}
            y={0.75}
            width={w - 1.5}
            height={h - 1.5}
            rx={RADIUS}
          />

          {/* Bright running dot */}
          <rect
            className="border-dot"
            x={0.75}
            y={0.75}
            width={w - 1.5}
            height={h - 1.5}
            rx={RADIUS}
            strokeDasharray={`${DOT_LEN} ${perimeter - DOT_LEN}`}
            strokeDashoffset={perimeter}
            style={{
              animation: `runDot ${DURATION}s linear ${delay}s infinite`,
            }}
          />
        </svg>
      )}

      {/* Card content */}
      <div className="stat-card-inner flex flex-col items-center px-6 py-7 hover:bg-black/50 transition-colors duration-300">
        <div className="text-4xl sm:text-5xl font-serif text-white mb-2 drop-shadow-md">
          {value}
        </div>
        <div className="text-sm sm:text-base text-white/70 font-medium tracking-wide uppercase">
          {label}
        </div>
      </div>
    </div>
  );
}

export default function HeroSection() {
  return (
    <>
      {/* ── Fixed video layer — stays pinned behind everything ── */}
      <div
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 0,
          pointerEvents: "none",
        }}
      >
        <video
          autoPlay
          muted
          loop
          playsInline
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            opacity: 0.82,
          }}
        >
          <source src="/Background.mp4" type="video/mp4" />
        </video>
        {/* Dark overlay for text readability */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "rgba(0,0,0,0.42)",
          }}
        />
      </div>

      {/* ── Hero section — scrolls normally over the fixed video ── */}
      <section
        className="relative flex flex-col items-center justify-center"
        style={{ minHeight: "100vh", zIndex: 10, paddingTop: 64 }}
      >
        {/* Content block */}
        <div className="w-full max-w-7xl mx-auto flex flex-col items-center text-center px-6">
          {/* Title */}
          <h1 className="italic font-serif text-5xl sm:text-6xl lg:text-7xl xl:text-8xl leading-[1.05] tracking-tight mb-6 max-w-5xl text-white drop-shadow-lg">
            Transforming Public Service
            <br />
            One Grievance at a Time
          </h1>

          {/* Subtitle */}
          <p className="text-lg sm:text-xl text-white/90 max-w-2xl mb-16 leading-relaxed font-light drop-shadow-md">
            An intelligent command center that captures, routes, and resolves
            citizen complaints with real-time transparency and AI-powered
            automation
          </p>

          {/* Removed CTA from here, moved to Navbar */}

          {/* Stat tabs */}
          <div className="w-full max-w-5xl mt-12 pb-24">
            <div className="flex flex-col sm:flex-row items-center justify-center gap-5 sm:gap-7">
              {stats.map((stat, i) => (
                <StatCard
                  key={i}
                  value={stat.value}
                  label={stat.label}
                  delay={i * (DURATION / stats.length)}
                />
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
