import Navigation from "../../../components/Navigation";

const escalations = [
  {
    badge: "Overdue - 72h",
    id: "#GG-9942",
    title: "Pothole Class 4 — Main St",
    subtitle: "SLA Expired — Resident injury reported",
    log: `"Crew dispatched but could not locate. Reporter claims crew never arrived. Photo timestamp contradicts crew log."`,
    isCritical: true,
  },
  {
    badge: "Contested - 48h",
    id: "#GG-8815",
    title: "Broken Water Main — 5th Ave",
    subtitle: "Repair failed after 2 days — Flooding active",
    log: `"Marked as 'Resolved' by Contractor X, but citizen submitted live video showing continuous geyser. Contractor disputes video authenticity."`,
    isCritical: false,
  },
];

export default function EscalationInboxPage() {
  return (
    <div className="relative flex min-h-screen flex-col font-display antialiased"
      style={{ background: "var(--background)", color: "var(--text)" }}>
      {/* Header */}
      <header className="sticky top-0 z-50 flex items-center justify-between border-b px-8 py-4"
        style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
        <div className="flex items-center gap-4">
          <span className="material-symbols-outlined text-2xl" style={{ color: "#ff5733" }}>warning</span>
          <h2 className="text-xl font-semibold tracking-tight" style={{ color: "var(--text)" }}>GrievanceGrid Escalations</h2>
        </div>
        <div className="flex flex-1 items-center justify-end gap-8">
          <div className="flex items-center gap-6 text-sm font-medium">
            {["Inbox", "Archive", "Settings"].map((l, i) => (
              <a key={l} href="#" className="transition-colors hover:text-white"
                style={{ color: i === 0 ? "var(--amber)" : "var(--text-muted)", borderBottom: i === 0 ? "2px solid var(--amber)" : "none", paddingBottom: i === 0 ? 4 : 0 }}>
                {l}
              </a>
            ))}
          </div>
          <button className="rounded border px-4 py-2 text-sm font-semibold transition-all hover:opacity-90"
            style={{ background: "transparent", borderColor: "var(--amber)", color: "var(--amber)" }}>
            CRISIS MAP
          </button>
        </div>
      </header>

      <div className="mx-auto w-full max-w-[1200px] flex flex-col gap-8 px-8 py-8">
        {/* Summary cards */}
        <div>
          <h3 className="mb-4 text-lg font-semibold" style={{ color: "var(--text)" }}>System Failure Summary</h3>
          <div className="flex flex-wrap gap-4">
            {[
              { label: "Overdue", value: "142", color: "#BA5624", bg: "rgba(186,86,36,0.1)" },
              { label: "Contested", value: "89", color: "var(--text)", bg: "var(--card)" },
              { label: "Avg Delay", value: "48", unit: " hrs", color: "var(--text)", bg: "var(--card)" },
            ].map((s) => (
              <div key={s.label} className="flex min-w-[200px] flex-1 flex-col gap-1 rounded-md border p-5"
                style={{ background: s.bg, borderColor: "var(--border)" }}>
                <p className="text-sm font-medium uppercase tracking-wide" style={{ color: s.color === "var(--text)" ? "var(--text-muted)" : s.color }}>{s.label}</p>
                <p className="text-4xl font-bold" style={{ color: s.color }}>
                  {s.value}{s.unit && <span className="text-xl font-normal ml-1" style={{ color: "var(--text-muted)" }}>{s.unit}</span>}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Escalation cards */}
        <div className="flex flex-col gap-5">
          {escalations.map((e) => (
            <div key={e.id} className="flex overflow-hidden rounded-md border"
              style={{ background: "var(--card)", borderColor: "var(--border)" }}>
              <div className="flex flex-col gap-4 p-6 md:flex-row md:gap-6 w-full">
                {/* Content */}
                <div className="flex flex-[2] flex-col gap-4">
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-3">
                      <span className="rounded-full border px-2.5 py-1 text-xs font-semibold uppercase tracking-wider"
                        style={{ background: "rgba(185,28,28,0.1)", borderColor: "rgba(185,28,28,0.3)", color: "#f87171" }}>
                        {e.badge}
                      </span>
                      <span className="font-mono text-xs" style={{ color: "var(--text-muted)" }}>ID: {e.id}</span>
                    </div>
                    <h4 className="mt-1 text-xl font-bold" style={{ color: "var(--text)" }}>{e.title}</h4>
                    <p className="text-sm font-medium" style={{ color: e.isCritical ? "#f87171" : "#fb923c" }}>{e.subtitle}</p>
                  </div>
                  <div className="w-full max-w-md rounded-md border p-4 font-mono text-sm leading-relaxed"
                    style={{ background: "var(--elevated)", borderColor: "var(--border)", color: "var(--text-secondary)" }}>
                    <p className="mb-2 text-xs font-semibold uppercase" style={{ color: "var(--text-muted)" }}>Audit Log / Contest Reason</p>
                    <p>{e.log}</p>
                  </div>
                </div>

                {/* Image placeholder */}
                <div className="w-full shrink-0 rounded-md border md:w-56" style={{ background: "var(--elevated)", borderColor: "var(--border-subtle)", minHeight: 120 }}>
                  <div className="flex h-full items-center justify-center">
                    <span className="material-symbols-outlined text-4xl" style={{ color: "var(--text-muted)", opacity: 0.3 }}>photo_camera</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex w-full shrink-0 flex-col justify-center gap-3 border-l pl-6 md:w-56"
                  style={{ borderColor: "var(--border)" }}>
                  <button className="flex w-full items-center justify-center gap-2 rounded py-2.5 px-4 text-sm font-semibold transition-all hover:opacity-90"
                    style={{ background: "var(--amber)", color: "#1a0f0a" }}>
                    <span className="material-symbols-outlined text-lg">emergency</span>Emergency Dispatch
                  </button>
                  <button className="flex w-full items-center justify-center gap-2 rounded border py-2.5 px-4 text-sm font-semibold transition-colors hover:border-amber/30"
                    style={{ background: "transparent", borderColor: "var(--border)", color: "var(--text-secondary)" }}>
                    <span className="material-symbols-outlined text-lg">group_add</span>Re-Assign Crew
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
