const auditLog = [
  { text: "[SYSTEM] Processing cluster analysis...", type: "normal" },
  { text: "[AI] Routing field crew to Gamma-7.", type: "normal" },
  { text: "[WARNING] Anomaly detected in Grid 4A.", type: "warn" },
  { text: "[ALERT] Hotspot critical in Sector Zeta.", type: "alert" },
  { text: "[SYSTEM] Re-routing backup protocols.", type: "normal" },
  { text "> _", type: "blink" },
];

const sectors = [
  { label: "Sector Alpha", icon: "error", iconColor: "#f87171", bars: [1, 1, 1, 0.2] },
  { label: "Sector Beta", icon: "check_circle", iconColor: "var(--sage)", bars: [1, 0.2, 0.2, 0.2] },
  { label: "Sector Gamma", icon: "warning", iconColor: "var(--amber)", bars: [1, 1, 0.2, 0.2] },
];

const hudStats = [
  { label: "Total Active", value: "14,285", trend: "+12%", trendColor: "var(--sage)" },
  { label: "SLA Compliance", value: "87.4%", trend: "-2.1%", trendColor: "#f87171" },
  { label: "Critical Clusters", value: "24", trend: "+4", trendColor: "var(--sage)" },
];

export default function MissionControlPage() {
  return (
    <div className="flex h-screen flex-col overflow-hidden font-display antialiased" style={{ background: "var(--background)", color: "var(--text)" }}>
      {/* Top KPI strip */}
      <header className="flex flex-wrap shrink-0 gap-4 p-5 z-10">
        {hudStats.map((s) => (
          <div key={s.label} className="flex-1 min-w-[200px] rounded-md border p-4 flex flex-col justify-between shadow-sm transition-all hover:translate-y-[-1px]"
            style={{ background: "var(--card)", borderColor: "var(--border)" }}>
            <h2 className="mb-2 text-xs font-medium uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>{s.label}</h2>
            <div className="flex items-end justify-between">
              <span className="font-mono text-3xl font-bold" style={{ color: "var(--text)" }}>{s.value}</span>
              <span className="font-bold text-sm" style={{ color: s.trendColor }}>{s.trend}</span>
            </div>
          </div>
        ))}
      </header>

      {/* Main area */}
      <main className="relative flex flex-1 overflow-hidden">
        {/* Background "map" */}
        <div className="absolute inset-0 z-0 bg-surface grid-bg opacity-40" />
        
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 opacity-10"
            style={{
              backgroundImage: "linear-gradient(rgba(255,165,82,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,165,82,0.1) 1px, transparent 1px)",
              backgroundSize: "60px 60px",
            }} />
          
          {/* Cluster blobs */}
          <div className="absolute top-1/4 left-1/3 h-48 w-48 rounded-full blur-3xl"
            style={{ background: "rgba(56, 29, 42, 0.3)" }} />
          <div className="absolute bottom-1/3 right-1/4 h-64 w-64 rounded-full blur-3xl"
            style={{ background: "rgba(255, 165, 82, 0.05)" }} />
          
          {/* Warning pin */}
          <div className="absolute top-1/2 left-1/2 flex h-16 w-16 items-center justify-center rounded-full border pulse-amber"
            style={{ background: "rgba(248,113,113,0.1)", borderColor: "rgba(248,113,113,0.4)", boxShadow: "0 0 30px rgba(248,113,113,0.2)" }}>
            <span className="material-symbols-outlined text-red-400">warning</span>
          </div>

          {/* Diamonds */}
          {[[33, 65], [72, 22]].map(([t, l], i) => (
            <div key={i} className="absolute flex h-5 w-5 rotate-45 items-center justify-center border shadow-glow-sage"
              style={{ top: `${t}%`, left: `${l}%`, background: "var(--sage)", borderColor: "rgba(255,255,255,0.3)" }}>
              <div className="h-1.5 w-1.5 rounded-full bg-white shadow-sm" />
            </div>
          ))}
        </div>

        {/* Left sector panel */}
        <aside className="relative z-10 ml-6 flex w-80 h-[calc(100%-40px)] my-5 flex-col rounded-md border backdrop-blur-xl shadow-2xl"
          style={{ background: "rgba(13, 8, 11, 0.92)", borderColor: "var(--border)" }}>
          <div className="flex items-center justify-between border-b p-4" style={{ borderColor: "var(--border)" }}>
            <h1 className="text-base font-semibold uppercase tracking-wider text-text">Sector Status</h1>
            <span className="material-symbols-outlined text-2xl text-amber">radar</span>
          </div>

          <div className="flex-1 space-y-3 overflow-y-auto p-4 custom-scrollbar">
            {sectors.map((s) => (
              <div key={s.label} className="cursor-pointer rounded border p-4 transition-all hover:bg-white/5 group"
                style={{ background: "rgba(255,165,82,0.03)", borderColor: "var(--border-subtle)" }}>
                <div className="mb-2.5 flex items-center justify-between">
                  <span className="text-sm font-semibold uppercase tracking-wide text-text-secondary group-hover:text-text transition-colors">{s.label}</span>
                  <span className="material-symbols-outlined text-lg" style={{ color: s.iconColor }}>{s.icon}</span>
                </div>
                <div className="flex gap-1.5 h-1.5">
                  {s.bars.map((opacity, i) => (
                    <div key={i} className="flex-1 rounded-full transition-all" style={{ background: `rgba(255,165,82,${opacity * 0.8})` }} />
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="border-t p-4" style={{ borderColor: "var(--border)" }}>
            <button className="dark-btn w-full py-3 text-sm font-bold uppercase tracking-widest transition-all hover:shadow-glow-amber"
              style={{ background: "var(--amber)", border: "none", color: "#0d080b" }}>
              Deploy Crew
            </button>
          </div>
        </aside>

        {/* Map zoom controls */}
        <div className="absolute right-6 top-6 z-10 flex flex-col gap-2">
          <div className="flex flex-col overflow-hidden rounded-md border shadow-lg" 
            style={{ background: "rgba(13, 8, 11, 0.9)", borderColor: "var(--border)" }}>
            {["add", "remove"].map((icon) => (
              <button key={icon} className="flex items-center justify-center border-b p-2.5 transition-colors hover:bg-white/10"
                style={{ borderColor: "var(--border)", color: "var(--text-secondary)" }}>
                <span className="material-symbols-outlined text-[20px]">{icon}</span>
              </button>
            ))}
          </div>
          <button className="flex items-center justify-center rounded-md border p-2.5 shadow-lg transition-colors hover:bg-white/10"
            style={{ background: "rgba(13, 8, 11, 0.9)", borderColor: "var(--border)", color: "var(--text-secondary)" }}>
            <span className="material-symbols-outlined text-[20px]">my_location</span>
          </button>
        </div>

        {/* AI Audit Stream terminal */}
        <div className="absolute bottom-6 right-6 z-10 w-[400px] overflow-hidden rounded-md border shadow-2xl"
          style={{ background: "rgba(13, 8, 11, 0.96)", borderColor: "var(--border)" }}>
          <div className="flex items-center justify-between border-b px-4 py-3" style={{ borderColor: "var(--border)" }}>
            <span className="font-bold uppercase text-[11px] tracking-[0.2em] text-amber">AI Audit Stream</span>
            <div className="flex gap-2">
              {[0, 1].map((i) => (
                <div key={i} className="h-2 w-2 rounded-full border" style={{ borderColor: "var(--border)" }} />
              ))}
            </div>
          </div>
          <div className="flex h-52 flex-col gap-2.5 overflow-y-auto p-5 font-mono text-[11px] leading-relaxed custom-scrollbar">
            {auditLog.map((line, i) => (
              <p key={i} className={`${line.type === "blink" ? "animate-pulse" : ""} opacity-90`}
                style={{
                  color: line.type === "alert" ? "#f87171"
                    : line.type === "warn" ? "var(--amber)"
                      : "var(--text-secondary)",
                  fontWeight: line.type === "alert" ? "bold" : "normal",
                }}>
                <span className="text-amber/50 mr-2">&gt;</span>{line.text}
              </p>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
