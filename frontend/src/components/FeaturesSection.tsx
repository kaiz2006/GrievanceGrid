"use client";

/* ─────────────────────────────────────────────
   FeaturesSection — professional grid rewrite
   No external card component, no messy overrides
───────────────────────────────────────────────── */

import React from "react";
import SpotlightCard from "./SpotlightCard";

interface Feature {
  icon: React.ReactNode;
  title: string;
  description: string;
  accent: string; /* hex colour for icon bg tint + border on hover */
}

const features: Feature[] = [
  {
    icon: (
      <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
    title: "Smart Routing",
    description:
      "AI-powered keyword categorisation instantly routes complaints to the correct department with priority tagging and zero manual intervention.",
    accent: "#3b82f6",
  },
  {
    icon: (
      <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
      </svg>
    ),
    title: "Real-Time Tracking",
    description:
      "Citizens follow their complaint lifecycle end-to-end with live status updates, push notifications, and a unique Grid ID.",
    accent: "#06b6d4",
  },
  {
    icon: (
      <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    title: "SLA Engine",
    description:
      "Configurable SLA timers with automated escalation chains ensure every grievance is acknowledged, assigned, and resolved on schedule.",
    accent: "#ef4444",
  },
  {
    icon: (
      <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
    title: "Geo-Mapping",
    description:
      "Interactive heatmaps surface complaint density by district, enabling administrators to deploy resources at crisis zones proactively.",
    accent: "#f59e0b",
  },
  {
    icon: (
      <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ),
    title: "Command Center",
    description:
      "A mission-control dashboard with live KPIs, cross-department analytics, SLA breach alerts, and exportable governance reports.",
    accent: "#10b981",
  },
  {
    icon: (
      <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
    title: "Smart Assignment",
    description:
      "Workload-aware officer assignment surfaces AI-suggested routing and offers drag-and-drop task management for field supervisors.",
    accent: "#8b5cf6",
  },
];

export default function FeaturesSection() {
  return (
    <section
      id="features"
      className="features-dot-grid relative overflow-hidden"
      style={{ zIndex: 10, padding: "80px 0 100px" }}
    >
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 32px" }}>

        {/* ── Section header ── */}
        <div style={{ textAlign: "center", marginBottom: 52 }}>
          <span
            style={{
              display: "inline-block",
              fontSize: "0.75rem",
              fontWeight: 700,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: "#60a5fa",
              marginBottom: 18,
            }}
          >
            Platform Features
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
            Built for Intelligent Governance
          </h2>
        </div>

        {/* ── Feature grid ── */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
            gap: 20,
          }}
        >
          {features.map((feature, i) => (
            <FeatureCard key={i} feature={feature} />
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── Individual card — separate component for clean hover state ── */
function FeatureCard({ feature }: { feature: Feature }) {
  return (
    <SpotlightCard
      className="group"
      spotlightColor={`${feature.accent}20`}
      style={{
        background: "rgba(15, 23, 42, 0.7)",
        border: "1px solid rgba(255, 255, 255, 0.07)",
        borderRadius: 20,
        padding: "28px 28px",
        display: "flex",
        flexDirection: "column",
        gap: 14,
        cursor: "default",
        transition: "border-color 0.3s ease, transform 0.3s ease, box-shadow 0.3s ease",
        backdropFilter: "blur(24px)",
      }}
      onMouseEnter={(e) => {
        const el = e.currentTarget as HTMLElement;
        el.style.borderColor = `${feature.accent}55`;
        el.style.transform = "translateY(-4px)";
        el.style.boxShadow = `0 20px 60px rgba(0,0,0,0.3), 0 0 0 1px ${feature.accent}22`;
      }}
      onMouseLeave={(e) => {
        const el = e.currentTarget as HTMLElement;
        el.style.borderColor = "rgba(255, 255, 255, 0.07)";
        el.style.transform = "translateY(0)";
        el.style.boxShadow = "none";
      }}
    >
      {/* Icon */}
      <div
        style={{
          width: 44,
          height: 44,
          borderRadius: 12,
          background: `${feature.accent}18`,
          border: `1px solid ${feature.accent}30`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: feature.accent,
          flexShrink: 0,
        }}
      >
        {feature.icon}
      </div>

      {/* Text */}
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        <h3
          style={{
            fontSize: "1.1rem",
            fontWeight: 700,
            color: "#f1f5f9",
            margin: 0,
          }}
        >
          {feature.title}
        </h3>
        <p
          style={{
            fontSize: "0.9rem",
            lineHeight: 1.7,
            color: "rgba(255,255,255,0.5)",
            margin: 0,
          }}
        >
          {feature.description}
        </p>
      </div>

      {/* Bottom accent line */}
      <div
        style={{
          marginTop: "auto",
          height: 1,
          background: `linear-gradient(to right, ${feature.accent}60, transparent)`,
          borderRadius: 9999,
          opacity: 0,
          transition: "opacity 0.3s ease",
        }}
        className="card-accent-line relative z-10"
      />
    </SpotlightCard>
  );
}
