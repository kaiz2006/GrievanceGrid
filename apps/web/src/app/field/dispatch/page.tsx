"use client";

const navItems = [
  { label: "Dashboard", icon: "dashboard", active: true },
  { label: "Assignments", icon: "work", badge: "12" },
  { label: "Map View", icon: "map" },
  { label: "History", icon: "history" },
  { label: "Settings", icon: "settings" },
];

const assignments = [
  {
    id: "#160408",
    sla: "01:42:15",
    slaUrgent: true,
    type: "Pothole Repair",
    location: "402 W 8th St, Sector 7",
    priority: "Critical",
    priorityColor: "#f87171",
    active: true,
  },
  {
    id: "#160409",
    sla: "08:12:00",
    slaUrgent: false,
    type: "Streetlight Out",
    location: "Park Ave & 4th, Sector 2",
    priority: "Medium",
    priorityColor: "#fb923c",
    active: true,
  },
  {
    id: "#160405",
    sla: "00:00:00",
    slaUrgent: false,
    type: "Graffiti Removal",
    location: "Main Station, Sector 1",
    priority: "Resolved",
    priorityColor: "var(--sage)",
    active: false,
  },
];

export default function FieldCrewDispatchPage() {
  return (
    <div className="flex min-h-screen flex-col font-display antialiased md:flex-row" style={{ background: "var(--background)", color: "var(--text)" }}>
      {/* Sidebar */}
      <aside className="flex flex-col border-r md:h-screen md:w-[280px] md:shrink-0"
        style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
        <div className="flex items-center gap-4 border-b p-6" style={{ borderColor: "var(--border)" }}>
          <div className="relative flex h-12 w-12 items-center justify-center">
            <div className="absolute inset-0 rotate-45 rounded-md border" style={{ background: "rgba(255,165,82,0.15)", borderColor: "rgba(255,165,82,0.3)" }} />
            <span className="relative z-10 text-2xl font-bold" style={{ color: "var(--amber)" }}>G</span>
          </div>
          <h1 className="font-bold text-xl leading-tight tracking-tight uppercase" style={{ color: "var(--text)" }}>
            Grievance<br />Grid
          </h1>
        </div>
        <div className="flex items-center gap-4 border-b p-6" style={{ borderColor: "var(--border)" }}>
          <div className="h-12 w-12 rounded-full border flex items-center justify-center"
            style={{ background: "var(--elevated)", borderColor: "var(--border)" }}>
            <span className="material-symbols-outlined" style={{ color: "var(--amber)" }}>person</span>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>Command Center</p>
            <p className="font-medium text-lg" style={{ color: "var(--text)" }}>Field Crew</p>
          </div>
        </div>
        <nav className="flex-1 space-y-2 overflow-y-auto p-5">
          {navItems.map((item) => (
            <a key={item.label} href="#"
              className="flex items-center gap-3 rounded-md p-3 font-semibold transition-all"
              style={item.active ? {
                background: "rgba(255,165,82,0.12)",
                color: "var(--amber)",
                border: "1px solid rgba(255,165,82,0.2)",
              } : {
                color: "var(--text-secondary)",
              }}>
              <span className="material-symbols-outlined">{item.icon}</span>
              {item.label}
              {item.badge && (
                <span className="ml-auto rounded-full px-2 py-0.5 text-xs font-bold" style={{ background: "#BA5624", color: "#fff" }}>
                  {item.badge}
                </span>
              )}
            </a>
          ))}
        </nav>
        <div className="border-t p-5" style={{ borderColor: "var(--border)" }}>
          <button className="flex w-full items-center justify-center gap-2 rounded-md border py-3 font-semibold transition-colors hover:border-amber/30"
            style={{ borderColor: "var(--border)", color: "var(--text-secondary)" }}>
            <span className="material-symbols-outlined">logout</span>Clock Out
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="relative flex flex-1 flex-col overflow-hidden">
        {/* Header */}
        <header className="flex h-20 items-center justify-between border-b px-6 shadow-sm"
          style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
          <h2 className="text-2xl font-bold tracking-tight" style={{ color: "var(--text)" }}>Active Assignments</h2>
          <div className="flex w-full max-w-xl items-center gap-4 ml-8">
            <div className="relative w-full rounded-md">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-lg" style={{ color: "var(--text-muted)" }}>search</span>
              <input className="w-full rounded-md border py-2.5 pl-10 pr-4 text-sm focus:outline-none"
                style={{ background: "var(--card)", borderColor: "var(--border)", color: "var(--text)" }}
                placeholder="Search GRID-ID or location..." />
            </div>
          </div>
        </header>

        {/* Filter pills */}
        <div className="flex gap-3 overflow-x-auto border-b px-5 py-3" style={{ borderColor: "var(--border)", background: "var(--background)" }}>
          {["All Status", "Urgent Only", "SLA < 2hrs", "My Zone"].map((label, i) => (
            <button key={label} className="flex shrink-0 items-center gap-2 whitespace-nowrap rounded-md border px-4 py-2 text-sm font-semibold transition-colors"
              style={i === 1 ? {
                background: "rgba(186,86,36,0.1)", borderColor: "rgba(186,86,36,0.25)", color: "#BA5624",
              } : {
                background: "var(--card)", borderColor: "var(--border)", color: "var(--text-secondary)",
              }}>
              {label}
            </button>
          ))}
        </div>

        {/* Cards */}
        <div className="flex-1 overflow-y-auto p-6 pb-32">
          <div className="mx-auto grid max-w-7xl grid-cols-1 gap-5 xl:grid-cols-2 2xl:grid-cols-3">
            {assignments.map((a) => (
              <article key={a.id} className={`flex flex-col overflow-hidden rounded-md border shadow-sm transition-shadow hover:shadow-md ${!a.active ? "opacity-50" : ""}`}
                style={{ background: "var(--card)", borderColor: "var(--border)" }}>
                {/* Card header */}
                <div className="flex items-center justify-between border-b px-4 py-3"
                  style={a.slaUrgent ? { background: "rgba(255,165,82,0.15)", borderColor: "rgba(255,165,82,0.3)" }
                    : a.active ? { background: "var(--elevated)", borderColor: "var(--border)" }
                      : { background: "var(--border)", borderColor: "var(--border-subtle)" }}>
                  <span className="font-mono text-sm font-bold tracking-wide" style={{ color: a.active ? "var(--amber)" : "var(--text-muted)" }}>
                    GRID-ID: {a.id}
                  </span>
                  {a.slaUrgent && <span className="material-symbols-outlined text-lg" style={{ color: "var(--amber)" }}>priority_high</span>}
                  {!a.active && <span className="material-symbols-outlined text-lg" style={{ color: "var(--sage)" }}>check_circle</span>}
                </div>

                <div className="flex flex-1 flex-col gap-4 p-5">
                  {/* SLA countdown */}
                  <div className="rounded-md border p-4 text-center"
                    style={a.slaUrgent ? { background: "rgba(186,86,36,0.1)", borderColor: "rgba(186,86,36,0.25)" }
                      : { background: "var(--elevated)", borderColor: "var(--border-subtle)" }}>
                    <p className="mb-1 text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>
                      {a.active ? "SLA Countdown" : "SLA Completed"}
                    </p>
                    <p className={`font-mono text-3xl font-bold tracking-widest ${!a.active ? "line-through" : ""}`}
                      style={{ color: a.slaUrgent ? "#BA5624" : "var(--text-muted)" }}>
                      {a.sla}
                    </p>
                  </div>

                  {/* Details */}
                  <dl className="space-y-2">
                    {[
                      { label: "Type", value: a.type },
                      { label: "Location", value: a.location },
                      { label: "Priority", value: a.priority },
                    ].map((row) => (
                      <div key={row.label} className="flex items-baseline justify-between border-b pb-2"
                        style={{ borderColor: "var(--border-subtle)" }}>
                        <dt className="text-xs font-medium uppercase tracking-wide" style={{ color: "var(--text-muted)" }}>{row.label}</dt>
                        <dd className="text-sm font-semibold" style={{ color: row.label === "Priority" ? a.priorityColor : "var(--text)" }}>
                          {row.value}
                        </dd>
                      </div>
                    ))}
                  </dl>
                </div>

                {/* Footer actions */}
                <div className="flex gap-3 border-t px-5 py-4" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
                  {a.active ? (
                    <>
                      <button className="flex-1 rounded-md py-2.5 text-sm font-semibold transition-colors hover:opacity-90"
                        style={{ background: "var(--amber)", color: "#1a0f0a" }}>Navigate</button>
                      <button className="flex-1 rounded-md border py-2.5 text-sm font-semibold transition-colors hover:border-amber/30"
                        style={{ background: "transparent", borderColor: "var(--border)", color: "var(--text-secondary)" }}>Verify</button>
                    </>
                  ) : (
                    <button className="flex-1 rounded-md border py-2.5 text-sm font-semibold transition-colors"
                      style={{ background: "transparent", borderColor: "var(--border-subtle)", color: "var(--text-muted)" }}>Details</button>
                  )}
                </div>
              </article>
            ))}
          </div>
        </div>

        {/* Bottom action bar */}
        <div className="absolute bottom-0 left-0 right-0 z-30 border-t p-4"
          style={{ background: "rgba(15,10,13,0.92)", backdropFilter: "blur(12px)", borderColor: "var(--border)" }}>
          <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 md:flex-row">
            <div className="hidden md:block">
              <p className="text-xs font-medium uppercase tracking-wide" style={{ color: "var(--text-muted)" }}>Active Selection</p>
              <p className="font-mono text-lg font-bold tracking-wider" style={{ color: "var(--amber)" }}>GRID-ID: #160408</p>
            </div>
            <div className="flex w-full flex-col gap-3 sm:flex-row md:w-auto">
              {[
                { label: "Navigate", icon: "navigation", primary: true },
                { label: "Before Photo", icon: "photo_camera", primary: false },
                { label: "Start Verif.", icon: "play_arrow", primary: false },
              ].map((btn) => (
                <button key={btn.label}
                  className="flex flex-1 items-center justify-center gap-2 rounded-md border py-3 px-6 text-sm font-semibold transition-colors md:flex-none"
                  style={btn.primary ? { background: "var(--amber)", border: "none", color: "#1a0f0a" }
                    : { background: "transparent", borderColor: "var(--border)", color: "var(--text-secondary)" }}>
                  <span className="material-symbols-outlined text-lg">{btn.icon}</span>{btn.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
