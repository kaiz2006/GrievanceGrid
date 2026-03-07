"use client";

/* ─────────────────────────────────────────────
   HowItWorks — clean professional rewrite
   No GSAP, no external dependencies
───────────────────────────────────────────────── */

import React from "react";
import SpotlightCard from "./SpotlightCard";

interface Step {
  number: string;
  title: string;
  description: string;
  accent: string;
  icon: React.ReactNode;
}

const steps: Step[] = [
  {
    number: "01",
    title: "Citizen Reports",
    description:
      "Citizens submit grievances through a simple interface with category selection, location tagging, and photo evidence. A unique Grid ID is generated instantly.",
    accent: "#06b6d4",
    icon: (
      <svg width="22" height="22" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
      </svg>
    ),
  },
  {
    number: "02",
    title: "AI Routes Intelligently",
    description:
      "The routing engine categorises complaints using AI, maps them to the correct department, assigns priority, and enforces SLA timelines automatically.",
    accent: "#3b82f6",
    icon: (
      <svg width="22" height="22" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
      </svg>
    ),
  },
  {
    number: "03",
    title: "Officer Takes Action",
    description:
      "Assigned officers see a prioritised task queue with SLA countdown timers, status controls, note-taking, and resolution proof upload.",
    accent: "#f59e0b",
    icon: (
      <svg width="22" height="22" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
      </svg>
    ),
  },
  {
    number: "04",
    title: "Resolution Tracked",
    description:
      "Complete lifecycle tracking from submission to closure. Citizens rate the outcome and all data flows into the command center for governance insights.",
    accent: "#10b981",
    icon: (
      <svg width="22" height="22" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
];

export default function HowItWorks() {
  return (
    <section
      id="how-it-works"
      className="relative overflow-hidden"
      style={{
        zIndex: 10,
        backgroundColor: "var(--bg-primary)",
        backgroundImage: "radial-gradient(rgba(255, 255, 255, 0.05) 1px, transparent 1px)",
        backgroundSize: "32px 32px",
        padding: "80px 0 100px",
      }}
    >
      {/* ── Ambient background glow ── */}
      <div 
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "100%",
          maxWidth: "1000px",
          height: "100%",
          maxHeight: "600px",
          background: "radial-gradient(ellipse, rgba(59, 130, 246, 0.08) 0%, transparent 60%)",
          pointerEvents: "none",
        }}
      />
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
            How It Works
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
            From Complaint to Resolution
          </h2>
        </div>

        {/* ── Steps grid ── */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
            gap: 20,
          }}
        >
          {steps.map((step, i) => (
            <StepCard key={i} step={step} isLast={i === steps.length - 1} />
          ))}
        </div>
      </div>
    </section>
  );
}

function StepCard({ step, isLast }: { step: Step; isLast: boolean }) {
  return (
    <SpotlightCard
      className="group"
      spotlightColor={`${step.accent}20`}
      style={{
        background: "rgba(15, 23, 42, 0.7)",
        border: "1px solid rgba(255, 255, 255, 0.07)",
        borderRadius: 20,
        padding: "32px 28px",
        display: "flex",
        flexDirection: "column",
        gap: 18,
        position: "relative",
        backdropFilter: "blur(24px)",
        transition: "border-color 0.3s ease, transform 0.3s ease, box-shadow 0.3s ease",
      }}
      onMouseEnter={(e) => {
        const el = e.currentTarget as HTMLElement;
        el.style.borderColor = `${step.accent}55`;
        el.style.transform = "translateY(-4px)";
        el.style.boxShadow = `0 20px 60px rgba(0,0,0,0.3), 0 0 0 1px ${step.accent}22`;
      }}
      onMouseLeave={(e) => {
        const el = e.currentTarget as HTMLElement;
        el.style.borderColor = "rgba(255, 255, 255, 0.07)";
        el.style.transform = "translateY(0)";
        el.style.boxShadow = "none";
      }}
    >
      {/* Step number + icon row */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        {/* Icon */}
        <div
          style={{
            width: 44,
            height: 44,
            borderRadius: 12,
            background: `${step.accent}18`,
            border: `1px solid ${step.accent}30`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: step.accent,
          }}
        >
          {step.icon}
        </div>

        {/* Step number */}
        <span
          style={{
            fontSize: "2rem",
            fontWeight: 800,
            color: `${step.accent}30`,
            lineHeight: 1,
            fontVariantNumeric: "tabular-nums",
          }}
        >
          {step.number}
        </span>
      </div>

      {/* Text */}
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        <h3
          style={{
            fontSize: "1.05rem",
            fontWeight: 700,
            color: "#f1f5f9",
            margin: 0,
          }}
        >
          {step.title}
        </h3>
        <p
          style={{
            fontSize: "0.875rem",
            lineHeight: 1.7,
            color: "rgba(255,255,255,0.5)",
            margin: 0,
          }}
        >
          {step.description}
        </p>
      </div>

      {/* Bottom accent line */}
      <div
        style={{
          height: 1,
          background: `linear-gradient(to right, ${step.accent}60, transparent)`,
          borderRadius: 9999,
          marginTop: "auto",
        }}
        className="relative z-10"
      />
    </SpotlightCard>
  );
}
