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
          <div key={s.label} className="flex-1 min-w-[200px] rounded-md border p-4 flex flex-col justify-between"
            style={{ background: "var(--card)", borderColor: "var(--border)" }}>
            <h2 className="mb-2 text-sm font-medium uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>{s.label}</h2>
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
        <div className="absolute inset-0 z-0" style={{ background: "var(--elevated)" }}>
          <div className="absolute inset-0 opacity-5"
            style={{
              backgroundImage: "linear-gradient(rgba(255,165,82,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,165,82,0.5) 1px, transparent 1px)",
              backgroundSize: "50px 50px",
            }} />
          {/* Cluster blobs */}
          <div className="absolute top-1/4 left-1/3 h-32 w-32 rounded-full blur-sm border"
            style={{ background: "rgba(255,165,82,0.07)", borderColor: "rgba(255,165,82,0.15)" }} />
          <div className="absolute bottom-1/3 right-1/4 h-48 w-48 rounded-full blur-md border"
            style={{ background: "rgba(255,165,82,0.04)", borderColor: "rgba(255,165,82,0.1)" }} />
          {/* Warning pin */}
          <div className="absolute top-1/2 left-1/2 flex h-16 w-16 items-center justify-center rounded-full border"
            style={{ background: "rgba(248,113,113,0.08)", borderColor: "rgba(248,113,113,0.3)", boxShadow: "0 0 20px rgba(248,113,113,0.1)" }}>
            <span className="material-symbols-outlined" style={{ color: "#f87171" }}>warning</span>
          </div>
          {/* Diamonds */}
          {[[33, 65], [72, 22]].map(([t, l], i) => (
            <div key={i} className="absolute flex h-4 w-4 rotate-45 items-center justify-center border shadow-sm"
              style={{ top: `${t}%`, left: `${l}%`, background: "var(--sage)", borderColor: "rgba(255,255,255,0.2)" }}>
              <div className="h-1 w-1 rounded-full" style={{ background: "white" }} />
            </div>
          ))}
        </div>

        {/* Left sector panel */}
        <aside className="relative z-10 ml-5 flex w-72 h-full flex-col rounded-md border mb-5"
          style={{ background: "rgba(15,10,13,0.92)", backdropFilter: "blur(12px)", borderColor: "var(--border)" }}>
          <div className="flex items-center justify-between border-b p-4" style={{ borderColor: "var(--border)" }}>
            <h1 className="text-base font-medium uppercase tracking-wider" style={{ color: "var(--text)" }}>Sector Status</h1>
            <span className="material-symbols-outlined text-2xl" style={{ color: "var(--amber)" }}>radar</span>
          </div>

          <div className="flex-1 space-y-3 overflow-y-auto p-4">
            {sectors.map((s) => (
              <div key={s.label} className="cursor-pointer rounded border p-3 transition-all hover:border-amber/40"
                style={{ background: "rgba(255,165,82,0.04)", borderColor: "var(--border-subtle)" }}>
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-sm font-medium uppercase" style={{ color: "var(--text)" }}>{s.label}</span>
                  <span className="material-symbols-outlined text-sm" style={{ color: s.iconColor }}>{s.icon}</span>
                </div>
                <div className="flex gap-1 h-1.5">
                  {s.bars.map((opacity, i) => (
                    <div key={i} className="flex-1 rounded-full" style={{ background: `rgba(255,165,82,${opacity})` }} />
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="border-t p-4" style={{ borderColor: "var(--border)" }}>
            <button className="w-full rounded-md border py-2.5 text-sm font-medium uppercase tracking-wider transition-all hover:opacity-90"
              style={{ background: "var(--amber)", border: "none", color: "#1a0f0a" }}>
              Deploy Crew
            </button>
          </div>
        </aside>

        {/* Map zoom controls (right side) */}
        <div className="absolute right-5 top-5 z-10 flex flex-col gap-2">
          <div className="flex flex-col overflow-hidden rounded-md border" style={{ background: "rgba(15,10,13,0.9)", borderColor: "var(--border)" }}>
            {["+", "−"].map((icon) => (
              <button key={icon} className="flex items-center justify-center border-b p-2 text-lg font-bold transition-colors hover:bg-amber/10"
                style={{ borderColor: "var(--border)", color: "var(--text-secondary)" }}>
                {icon}
              </button>
            ))}
          </div>
          <button className="flex items-center justify-center rounded-md border p-2 mt-1 transition-colors hover:bg-amber/10"
            style={{ background: "rgba(15,10,13,0.9)", borderColor: "var(--border)", color: "var(--text-secondary)" }}>
            <span className="material-symbols-outlined">my_location</span>
          </button>
        </div>

        {/* AI Audit Stream terminal (bottom right) */}
        <div className="absolute bottom-5 right-5 z-10 w-96 overflow-hidden rounded-md border"
          style={{ background: "rgba(15,10,13,0.95)", borderColor: "var(--border)" }}>
          <div className="flex items-center justify-between border-b px-3 py-2" style={{ borderColor: "var(--border)" }}>
            <span className="font-medium uppercase text-xs tracking-wider" style={{ color: "var(--amber)" }}>AI Audit Stream</span>
            <div className="flex gap-1.5">
              {[0, 1].map((i) => (
                <div key={i} className="h-2.5 w-2.5 rounded-full border" style={{ borderColor: "var(--border)" }} />
              ))}
            </div>
          </div>
          <div className="flex h-44 flex-col gap-2 overflow-y-auto p-4 font-mono text-xs">
            {auditLog.map((line, i) => (
              <p key={i} className={line.type === "blink" ? "animate-pulse" : ""}
                style={{
                  color: line.type === "alert" ? "#f87171"
                    : line.type === "warn" ? "var(--amber)"
                      : "var(--text-muted)",
                  fontWeight: line.type === "alert" ? "bold" : "normal",
                }}>
                &gt; {line.text}
              </p>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
