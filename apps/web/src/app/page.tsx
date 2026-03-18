import Navigation from "../components/Navigation";

export default function LandingPage() {
  return (
    <main
      className="min-h-screen font-display antialiased"
      style={{ background: "var(--background)", color: "var(--text)" }}
    >
      <Navigation />

      {/* ── HERO ─────────────────────────────────────────── */}
      <section className="relative mx-auto max-w-7xl px-6 py-24 lg:grid lg:grid-cols-2 lg:items-center lg:gap-16">
        <div className="space-y-8">
          <div className="space-y-6">
            <span
              className="inline-block rounded-full border px-3 py-1 text-xs font-semibold"
              style={{
                background: "rgba(56, 29, 42, 0.1)",
                borderColor: "rgba(56, 29, 42, 0.2)",
                color: "var(--text-secondary)",
              }}
            >
              AI-POWERED GOVERNANCE
            </span>
            <h1
              className="text-5xl font-bold leading-[1.1] tracking-tight md:text-6xl"
              style={{ color: "var(--text)" }}
            >
              Transforming Public <span style={{ color: "var(--amber)" }}>Grievance</span>
            </h1>
            <p
              className="max-w-xl text-lg font-medium leading-relaxed"
              style={{ color: "var(--text-secondary)" }}
            >
              AI-powered transparency for every citizen. From systemic issues to
              individual redressal, we bring clarity and accountability.
            </p>
          </div>

          <div className="flex flex-wrap gap-4 pt-2">
            <a
              href="/submit"
              className="dark-btn bg-primary text-white px-7 py-3 text-sm font-semibold flex items-center gap-2 hover:opacity-90 transition-all"
            >
              Get Started <span className="material-symbols-outlined text-sm">arrow_forward</span>
            </a>
            <a
              href="#impact"
              className="dark-btn bg-transparent text-text border border-border px-7 py-3 text-sm font-semibold hover:bg-surface transition-all"
            >
              View Impact
            </a>
          </div>
        </div>

        <div className="relative">
          <div className="dark-card bg-surface aspect-square flex items-center justify-center p-2 overflow-hidden border border-border">
            <div className="w-full h-full rounded-md relative overflow-hidden bg-card/50">
              <img 
                alt="Abstract high-end 3D visualization" 
                className="object-cover w-full h-full mix-blend-lighten opacity-40" 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBAadhTk4Ekp2dffPUIgO51ckM0z1T1tbtyvsyo1yzXTJrPMOXHycE5u4D8YrtznxIGowI7foiukKuctrrjhQB-kBXxr7uS3k3jmNinF13RzfRWkToBkkiQU4nv9opJ9jwkvvVbjzIh5lXP2Ao9C23qUgBJ9-8fyoxQYCsRo0sUMjrAvWaT2PFbeF7fXQj3ivLVmnoNXLATGaazCV3pfImYOgrdAIDUDWCT_oUFu0gkjcOq9VqT5rNzMH_hNxrHFcHvXpaYm0UGQzI_"
              />
              <div 
                className="absolute bottom-6 left-6 right-6 bg-surface/90 backdrop-blur-md border border-border p-4 rounded-md shadow-lg"
              >
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-sm text-text">Live Feed: New Delhi Central</span>
                  <span className="flex items-center gap-2 bg-sage/10 text-sage px-2 py-1 rounded-full font-semibold text-xs border border-sage/20">
                    <span className="w-1.5 h-1.5 bg-sage rounded-full animate-pulse"></span> ACTIVE
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── TICKER ───────────────────────────────────────── */}
      <div
        className="ticker-wrap border-y py-5"
        style={{
          background: "var(--surface)",
          borderColor: "var(--border-subtle)",
        }}
      >
        <div className="ticker-content flex items-center gap-16 text-sm font-semibold">
          {[
            { icon: "verified", col: "var(--amber)", text: "12,450 Resolved" },
            { icon: "timer", col: "var(--sage)", text: "30s Response" },
            { icon: "group", col: "var(--text-muted)", text: "1.2M Citizens" },
            { icon: "location_on", col: "var(--amber)", text: "500+ Cities" },
            { icon: "verified", col: "var(--amber)", text: "12,450 Resolved" },
            { icon: "timer", col: "var(--sage)", text: "30s Response" },
            { icon: "group", col: "var(--text-muted)", text: "1.2M Citizens" },
            { icon: "location_on", col: "var(--amber)", text: "500+ Cities" },
          ].map((item, i) => (
            <span
              key={i}
              className="flex items-center gap-2"
              style={{ color: "var(--text)" }}
            >
              <span
                className="material-symbols-outlined"
                style={{ color: item.col }}
              >
                {item.icon}
              </span>
              {item.text}
            </span>
          ))}
        </div>
      </div>

      {/* ── BENTO GRID ──────────────────────────────────── */}
      <section className="mx-auto max-w-7xl px-6 py-24" id="impact">
        <div className="mb-16 text-center">
          <h2
            className="text-3xl font-bold tracking-tight"
            style={{ color: "var(--text)" }}
          >
            The Bento Grid System
          </h2>
          <p className="mt-4 font-medium" style={{ color: "var(--text-secondary)" }}>
            Intelligent modules driving public redressal.
          </p>
        </div>

        <div className="grid auto-rows-auto grid-cols-1 gap-6 md:grid-cols-4 md:grid-rows-2 md:h-[600px]">
          {/* Large hero bento — Geospatial AI */}
          <div
            className="group relative overflow-hidden rounded-md border md:col-span-2 md:row-span-2"
            style={{
              background: "linear-gradient(135deg, #1a0d15 0%, #2c1520 50%, #381d2a 100%)",
              borderColor: "var(--border)",
            }}
          >
            {/* Background globe icon */}
            <div
              className="absolute -bottom-20 -right-20 transform opacity-5 transition-transform duration-700 group-hover:rotate-12 group-hover:opacity-8"
            >
              <span className="material-symbols-outlined text-[300px] text-white">
                public
              </span>
            </div>
            {/* Grid overlay */}
            <div
              className="absolute inset-0 opacity-40"
              style={{
                backgroundImage:
                  "linear-gradient(rgba(255,165,82,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(255,165,82,0.06) 1px, transparent 1px)",
                backgroundSize: "24px 24px",
              }}
            />
            <div className="relative z-10 flex h-full flex-col justify-between p-10">
              <div>
                <div
                  className="mb-6 flex h-12 w-12 items-center justify-center rounded-md backdrop-blur-sm"
                  style={{ background: "rgba(255,255,255,0.08)" }}
                >
                  <span
                    className="material-symbols-outlined text-2xl"
                    style={{ color: "var(--amber)" }}
                  >
                    map
                  </span>
                </div>
                <h3 className="mb-4 text-3xl font-bold leading-tight tracking-tight text-white">
                  Geospatial AI Analytics
                </h3>
                <p className="max-w-sm text-base font-medium leading-relaxed text-white/70">
                  Every grievance is mapped with precision. Our AI identifies
                  patterns and clusters to solve systemic issues before they
                  escalate.
                </p>
              </div>
              <div>
                <button
                  className="dark-btn rounded-md px-6 py-2.5 text-sm font-semibold"
                  style={{
                    background: "rgba(255,255,255,0.12)",
                    color: "white",
                    border: "1px solid rgba(255,255,255,0.15)",
                  }}
                >
                  Explore Map
                </button>
              </div>
            </div>
          </div>

          {/* Intelligent Intake */}
          <div
            className="group dark-card flex flex-col justify-between p-8"
          >
            <div>
              <span
                className="material-symbols-outlined mb-4 text-2xl"
                style={{ color: "var(--sage)" }}
              >
                mic
              </span>
              <h4
                className="mb-2 text-lg font-bold"
                style={{ color: "var(--text)" }}
              >
                Intelligent Intake
              </h4>
              <p className="text-sm font-medium" style={{ color: "var(--text-secondary)" }}>
                Multimodal voice & image processing.
              </p>
            </div>
            <div
              className="mt-4 flex items-center justify-between pt-4 transition-transform group-hover:translate-x-1"
            >
              <span
                className="text-xs font-semibold"
                style={{ color: "var(--amber)" }}
              >
                Learn More
              </span>
              <span
                className="material-symbols-outlined text-sm"
                style={{ color: "var(--amber)" }}
              >
                arrow_outward
              </span>
            </div>
          </div>

          {/* AI Routing */}
          <div
            className="group flex flex-col justify-between rounded-md border p-8 transition-all duration-300 hover:-translate-y-0.5"
            style={{
              background: "rgba(255,165,82,0.04)",
              borderColor: "rgba(255,165,82,0.15)",
            }}
          >
            <div>
              <span
                className="material-symbols-outlined mb-4 text-2xl"
                style={{ color: "var(--amber)" }}
              >
                bolt
              </span>
              <h4
                className="mb-2 text-lg font-bold"
                style={{ color: "var(--text)" }}
              >
                AI Routing
              </h4>
              <p className="text-sm font-medium" style={{ color: "var(--text-secondary)" }}>
                30s automated department assignment.
              </p>
            </div>
            <div
              className="mt-4 flex items-center justify-between pt-4 transition-transform group-hover:translate-x-1"
              style={{ color: "var(--amber)" }}
            >
              <span className="text-xs font-semibold">Optimize</span>
              <span className="material-symbols-outlined text-sm">speed</span>
            </div>
          </div>

          {/* Live Tracking */}
          <div
            className="group dark-card flex flex-col justify-between p-8"
          >
            <div>
              <span
                className="material-symbols-outlined mb-4 text-2xl"
                style={{ color: "var(--text-muted)" }}
              >
                timeline
              </span>
              <h4
                className="mb-2 text-lg font-bold"
                style={{ color: "var(--text)" }}
              >
                Live Tracking
              </h4>
              <p className="text-sm font-medium" style={{ color: "var(--text-secondary)" }}>
                Real-time progress visualization.
              </p>
            </div>
            <div
              className="mt-4 flex items-center justify-between pt-4 transition-transform group-hover:translate-x-1"
              style={{ color: "var(--text-secondary)" }}
            >
              <span className="text-xs font-semibold">Dashboard</span>
              <span className="material-symbols-outlined text-sm">visibility</span>
            </div>
          </div>

          {/* Verifiable Finality */}
          <div
            className="group flex flex-col justify-between rounded-md border p-8 transition-all duration-300 hover:-translate-y-0.5"
            style={{
              background: "rgba(196,214,176,0.04)",
              borderColor: "rgba(196,214,176,0.15)",
            }}
          >
            <div>
              <span
                className="material-symbols-outlined mb-4 text-2xl"
                style={{ color: "var(--sage)" }}
              >
                verified_user
              </span>
              <h4
                className="mb-2 text-lg font-bold"
                style={{ color: "var(--text)" }}
              >
                Verifiable Finality
              </h4>
              <p className="text-sm font-medium" style={{ color: "var(--text-secondary)" }}>
                Geo-tagged proof of resolution.
              </p>
            </div>
            <div
              className="mt-4 flex items-center justify-between pt-4 transition-transform group-hover:translate-x-1"
              style={{ color: "var(--sage)" }}
            >
              <span className="text-xs font-semibold">Verify</span>
              <span className="material-symbols-outlined text-sm">checklist_rtl</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── ADVANCED MODULES ─────────────────────────────── */}
      <section
        className="mx-auto my-10 max-w-7xl rounded-md border px-6 py-20"
        style={{ background: "var(--surface)", borderColor: "var(--border-subtle)" }}
      >
        <div className="flex flex-col items-center gap-16 md:flex-row">
          <div className="md:w-1/3">
            <h2
              className="mb-4 text-3xl font-bold leading-tight tracking-tight"
              style={{ color: "var(--text)" }}
            >
              Advanced Governance Modules
            </h2>
            <p
              className="font-medium leading-relaxed"
              style={{ color: "var(--text-secondary)" }}
            >
              Scaling transparency across every touchpoint of public service
              through deep integration.
            </p>
          </div>
          <div className="grid grid-cols-1 gap-6 md:w-2/3 md:grid-cols-2">
            <div className="dark-card p-8" style={{ background: "var(--card)" }}>
              <h5
                className="mb-3 flex items-center gap-2 text-lg font-bold"
                style={{ color: "var(--text)" }}
              >
                <span
                  className="material-symbols-outlined"
                  style={{ color: "var(--amber)" }}
                >
                  policy
                </span>{" "}
                SLA Enforcement
              </h5>
              <p className="text-sm font-medium leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                Automated escalation of delayed grievances to higher authorities
                after 72 hours of inactivity.
              </p>
            </div>
            <div className="dark-card p-8" style={{ background: "var(--card)" }}>
              <h5
                className="mb-3 flex items-center gap-2 text-lg font-bold"
                style={{ color: "var(--text)" }}
              >
                <span
                  className="material-symbols-outlined"
                  style={{ color: "var(--sage)" }}
                >
                  translate
                </span>{" "}
                Multimodal STT
              </h5>
              <p className="text-sm font-medium leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                Speech-to-text processing for 22 official languages with
                dialect-aware sentiment analysis.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── LIVE STREAM ──────────────────────────────────── */}
      <section className="mx-auto max-w-7xl px-6 py-20">
        <div
          className="overflow-hidden rounded-md border shadow-sm"
          style={{ background: "var(--card)", borderColor: "var(--border)" }}
        >
          {/* Window chrome */}
          <div
            className="flex items-center justify-between border-b p-5"
            style={{
              background: "var(--elevated)",
              borderColor: "var(--border-subtle)",
            }}
          >
            <div className="flex gap-2">
              <div className="h-2.5 w-2.5 rounded-full bg-red-500/60" />
              <div className="h-2.5 w-2.5 rounded-full bg-yellow-500/60" />
              <div className="h-2.5 w-2.5 rounded-full bg-green-500/60" />
            </div>
            <h3
              className="flex items-center gap-2 text-sm font-semibold"
              style={{ color: "var(--text)" }}
            >
              <span className="h-2 w-2 animate-pulse rounded-full bg-green-400" />
              Live Public Redressal Stream
            </h3>
            <div
              className="font-mono text-xs"
              style={{ color: "var(--text-muted)" }}
            >
              NODE-01
            </div>
          </div>

          {/* Stream cards */}
          <div className="relative overflow-hidden p-8">
            <div className="stream-mask flex gap-6">
              {[
                { id: "#GRV-88219", excerpt: '"Sanitation blockage reported near Ward 12..."', time: "2m ago" },
                { id: "#GRV-88224", excerpt: '"Faulty street light grid restoration..."', time: "5m ago" },
                { id: "#GRV-88231", excerpt: '"Unauthorized commercial noise complaint..."', time: "8m ago" },
                { id: "#GRV-88235", excerpt: '"Public water hydrant leak identified..."', time: "12m ago" },
                { id: "#GRV-88219", excerpt: '"Sanitation blockage reported near Ward 12..."', time: "2m ago" },
                { id: "#GRV-88224", excerpt: '"Faulty street light grid restoration..."', time: "5m ago" },
              ].map((card, i) => (
                <div
                  key={i}
                  className="dark-card min-w-[320px] space-y-4 p-6"
                  style={{ background: "var(--elevated)" }}
                >
                  <div className="flex items-start justify-between">
                    <span
                      className="font-mono text-sm font-semibold"
                      style={{ color: "var(--text)" }}
                    >
                      {card.id}
                    </span>
                    <span
                      className="rounded-full border px-2.5 py-1 text-[10px] font-semibold"
                      style={{
                        background: "rgba(196,214,176,0.1)",
                        borderColor: "rgba(196,214,176,0.25)",
                        color: "var(--sage)",
                      }}
                    >
                      RESOLVED
                    </span>
                  </div>
                  <p
                    className="text-sm font-medium"
                    style={{ color: "var(--text-secondary)" }}
                  >
                    {card.excerpt}
                  </p>
                  <div
                    className="flex items-center justify-between border-t pt-4"
                    style={{ borderColor: "var(--border-subtle)" }}
                  >
                    <span
                      className="text-xs font-medium"
                      style={{ color: "var(--text-muted)" }}
                    >
                      Verified: {card.time}
                    </span>
                    <span
                      className="material-symbols-outlined text-sm"
                      style={{ color: "var(--sage)" }}
                    >
                      verified
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── TRANSPARENCY + STATS ────────────────────────── */}
      <section className="mx-auto max-w-7xl px-6 py-24">
        <div className="grid items-center gap-20 lg:grid-cols-2">
          {/* Quote card */}
          <div className="relative">
            <div
              className="relative z-10 rounded-md border p-12"
              style={{
                background: "rgba(255,165,82,0.06)",
                borderColor: "rgba(255,165,82,0.2)",
              }}
            >
              <span
                className="material-symbols-outlined absolute -left-4 -top-6 text-6xl opacity-30"
                style={{ color: "var(--amber)" }}
              >
                format_quote
              </span>
              <h2
                className="mb-6 text-3xl font-bold tracking-tight"
                style={{ color: "var(--text)" }}
              >
                The Transparency Commitment
              </h2>
              <p
                className="text-xl font-medium leading-relaxed"
                style={{ color: "var(--text-secondary)" }}
              >
                &quot;Our mission is to eliminate the &apos;Bureaucratic Black
                Hole&apos; by ensuring every voice is heard, every action is
                logged, and every resolution is verifiable by the people.&quot;
              </p>
              <div
                className="mt-8 flex items-center gap-4 border-t pt-6"
                style={{ borderColor: "rgba(255,165,82,0.2)" }}
              >
                <div
                  className="flex h-10 w-10 items-center justify-center rounded-full border"
                  style={{
                    background: "rgba(255,165,82,0.1)",
                    borderColor: "rgba(255,165,82,0.3)",
                  }}
                >
                  <span
                    className="material-symbols-outlined text-sm"
                    style={{ color: "var(--amber)" }}
                  >
                    account_balance
                  </span>
                </div>
                <div>
                  <p
                    className="text-sm font-semibold"
                    style={{ color: "var(--text)" }}
                  >
                    GrievanceGrid Council
                  </p>
                  <p
                    className="text-xs font-medium"
                    style={{ color: "var(--text-muted)" }}
                  >
                    Est. 2024
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Gauge charts */}
          <div className="grid grid-cols-3 gap-10 text-center">
            {[
              { pct: 95, label: "Department\nAccountability", stroke: "#381D2A", accent: "var(--text)" },
              { pct: 88, label: "Citizens\nTrust", stroke: "#FFA552", accent: "var(--amber)" },
              { pct: 99, label: "AI\nPrecision", stroke: "#C4D6B0", accent: "var(--sage)" },
            ].map(({ pct, label, stroke, accent }) => {
              const r = 56;
              const circ = 2 * Math.PI * r;
              const offset = circ * (1 - pct / 100);
              return (
                <div key={label} className="flex flex-col items-center">
                  <div className="relative mb-6 flex h-32 w-32 items-center justify-center">
                    <svg className="h-full w-full -rotate-90">
                      <circle
                        cx="64"
                        cy="64"
                        r={r}
                        fill="transparent"
                        stroke="rgba(255,255,255,0.06)"
                        strokeWidth="8"
                      />
                      <circle
                        className="gauge-ring"
                        cx="64"
                        cy="64"
                        r={r}
                        fill="transparent"
                        stroke={stroke}
                        strokeDasharray={circ}
                        strokeDashoffset={offset}
                        strokeLinecap="round"
                        strokeWidth="8"
                      />
                    </svg>
                    <span
                      className="absolute text-2xl font-bold"
                      style={{ color: accent }}
                    >
                      {pct}%
                    </span>
                  </div>
                  <p
                    className="whitespace-pre-line text-sm font-semibold leading-tight"
                    style={{ color: "var(--text-secondary)" }}
                  >
                    {label}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── FOOTER ───────────────────────────────────────── */}
      <footer
        className="border-t px-6 py-16"
        style={{
          background: "var(--surface)",
          borderColor: "var(--border-subtle)",
        }}
      >
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-12 md:grid-cols-4">
          {/* Brand */}
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div
                className="flex items-center justify-center rounded-md p-2"
                style={{ background: "rgba(255,165,82,0.1)" }}
              >
                <span
                  className="material-symbols-outlined font-semibold"
                  style={{ color: "var(--amber)" }}
                >
                  grid_view
                </span>
              </div>
              <h2
                className="text-xl font-bold tracking-tight"
                style={{ color: "var(--text)" }}
              >
                GrievanceGrid
              </h2>
            </div>
            <p
              className="text-sm font-medium leading-relaxed"
              style={{ color: "var(--text-muted)" }}
            >
              Revolutionizing civic engagement through cutting-edge AI and
              transparent reporting structures.
            </p>
            <div className="flex gap-3">
              {["share", "mail"].map((icon) => (
                <a
                  key={icon}
                  href="#"
                  className="flex h-9 w-9 items-center justify-center rounded-md border transition-colors hover:border-amber/30"
                  style={{
                    background: "var(--card)",
                    borderColor: "var(--border)",
                    color: "var(--text-secondary)",
                  }}
                >
                  <span className="material-symbols-outlined text-[18px]">{icon}</span>
                </a>
              ))}
            </div>
          </div>

          {/* Platform */}
          <div className="space-y-5">
            <h4
              className="text-sm font-bold tracking-wide"
              style={{ color: "var(--text)" }}
            >
              Platform
            </h4>
            <ul className="space-y-3 font-medium">
              {["Citizen Portal", "Officer Dashboard", "Open API"].map((item) => (
                <li key={item}>
                  <a
                    href="#"
                    className="text-sm transition-colors hover:text-white"
                    style={{ color: "var(--text-muted)" }}
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div className="space-y-5">
            <h4
              className="text-sm font-bold tracking-wide"
              style={{ color: "var(--text)" }}
            >
              Legal
            </h4>
            <ul className="space-y-3 font-medium">
              {["Privacy Policy", "Terms of Service", "Trust & Security"].map(
                (item) => (
                  <li key={item}>
                    <a
                      href="#"
                      className="text-sm transition-colors hover:text-white"
                      style={{ color: "var(--text-muted)" }}
                    >
                      {item}
                    </a>
                  </li>
                )
              )}
            </ul>
          </div>

          {/* Subscribe */}
          <div className="space-y-5">
            <h4
              className="text-sm font-bold tracking-wide"
              style={{ color: "var(--text)" }}
            >
              Subscribe
            </h4>
            <div className="flex">
              <input
                className="w-full rounded-l-md border border-r-0 px-4 py-2 text-sm focus:outline-none focus:ring-1"
                style={{
                  background: "var(--card)",
                  borderColor: "var(--border)",
                  color: "var(--text)",
                }}
                placeholder="Email"
                type="email"
              />
              <button
                className="rounded-r-md px-4 py-2 text-sm font-semibold transition-colors hover:opacity-90"
                style={{ background: "var(--amber)", color: "#1a0f0a" }}
              >
                Go
              </button>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div
          className="mx-auto mt-16 flex max-w-7xl flex-col items-center justify-between gap-4 border-t pt-8 md:flex-row"
          style={{ borderColor: "var(--border-subtle)" }}
        >
          <p
            className="text-xs font-semibold tracking-wide"
            style={{ color: "var(--text-muted)" }}
          >
            © 2024 GRIEVANCEGRID. ALL RIGHTS RESERVED.
          </p>
          <p
            className="text-xs font-semibold tracking-wide"
            style={{ color: "var(--text-muted)" }}
          >
            SATYAMEVA JAYATE
          </p>
        </div>
      </footer>
    </main>
  );
}