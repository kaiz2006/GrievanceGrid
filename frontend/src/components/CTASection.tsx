"use client";

/* ─────────────────────────────────────────────
   CTASection — clean professional rewrite
   No GSAP
───────────────────────────────────────────────── */

export default function CTASection() {
  return (
    <section
      id="cta"
      className="relative overflow-hidden"
      style={{
        zIndex: 10,
        background: "var(--bg-primary)",
        padding: "120px 0 140px",
      }}
    >
      <div style={{ maxWidth: 880, margin: "0 auto", padding: "0 32px" }}>
        <div
          style={{
            background: "rgba(15, 23, 42, 0.7)",
            border: "1px solid rgba(255, 255, 255, 0.07)",
            borderRadius: 24,
            padding: "80px 40px",
            textAlign: "center",
            position: "relative",
            backdropFilter: "blur(24px)",
            overflow: "hidden",
            boxShadow: "0 24px 80px rgba(0,0,0,0.5)",
          }}
        >
          {/* Subtle background glow inside the card */}
          <div
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: "80%",
              height: "80%",
              background: "radial-gradient(ellipse, rgba(59,130,246,0.15) 0%, transparent 70%)",
              pointerEvents: "none",
            }}
          />

          {/* Corner accents (top-left & bottom-right) */}
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: 80,
              height: 80,
              borderTop: "1px solid rgba(59,130,246,0.3)",
              borderLeft: "1px solid rgba(59,130,246,0.3)",
              borderTopLeftRadius: 24,
            }}
          />
          <div
            style={{
              position: "absolute",
              bottom: 0,
              right: 0,
              width: 80,
              height: 80,
              borderBottom: "1px solid rgba(59,130,246,0.3)",
              borderRight: "1px solid rgba(59,130,246,0.3)",
              borderBottomRightRadius: 24,
            }}
          />

          {/* ── Content ── */}
          <div style={{ position: "relative", zIndex: 1 }}>
            <span
              style={{
                display: "inline-block",
                fontSize: "0.75rem",
                fontWeight: 700,
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                color: "#60a5fa",
                marginBottom: 20,
              }}
            >
              Ready to Transform?
            </span>
            
            <h2
              style={{
                fontSize: "clamp(2rem, 5vw, 3.5rem)",
                fontWeight: 800,
                lineHeight: 1.1,
                color: "#f8fafc",
                margin: 0,
                marginBottom: 24,
              }}
            >
              Start Building a Better<br />Public Service Today
            </h2>
            
            <p
              style={{
                fontSize: "1.125rem",
                lineHeight: 1.6,
                color: "rgba(255,255,255,0.6)",
                maxWidth: 480,
                margin: "0 auto 48px",
              }}
            >
              Join the movement to modernize governance. Deploy GrievanceGrid and
              give citizens the transparency they deserve.
            </p>

            {/* ── Buttons ── */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 20,
                flexWrap: "wrap",
              }}
            >
              <a href="#" className="hero-launch-btn">
                <span className="btn-shimmer" aria-hidden="true" />
                <span
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: "50%",
                    background: "#10b981",
                    boxShadow: "0 0 8px #10b981",
                    flexShrink: 0,
                  }}
                />
                <span style={{ position: "relative", zIndex: 1 }}>Get Started Free</span>
                <svg
                  width="16"
                  height="16"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  style={{ flexShrink: 0, position: "relative", zIndex: 1 }}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </a>

              <a
                href="#contact"
                className="group relative"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 8,
                  fontSize: "1rem",
                  fontWeight: 500,
                  color: "rgba(255,255,255,0.7)",
                  textDecoration: "none",
                  padding: "16px 24px",
                  borderRadius: 16,
                  transition: "all 0.2s ease",
                  border: "1px solid transparent",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.color = "#fff";
                  (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.05)";
                  (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.1)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.7)";
                  (e.currentTarget as HTMLElement).style.background = "transparent";
                  (e.currentTarget as HTMLElement).style.borderColor = "transparent";
                }}
              >
                Contact Sales
                <svg
                  width="16"
                  height="16"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  style={{ transition: "transform 0.2s ease" }}
                  className="group-hover:translate-x-1"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
