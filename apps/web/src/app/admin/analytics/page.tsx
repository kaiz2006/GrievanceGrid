import Navigation from "../../../components/Navigation";

const kpiCards = [
  { label: "Avg Resolution", value: "3.2", unit: "d", trend: "+10%", trendColor: "#BA5624" },
  { label: "SLA Compliance", value: "92%", unit: "", trend: "+2%", trendColor: "var(--sage)" },
  { label: "Open Grievances", value: "1,048", unit: "", trend: "-5%", trendColor: "var(--sage)" },
  { label: "Citizen Sat", value: "85%", unit: "", trend: "+1%", trendColor: "var(--sage)" },
];

const weeklyBars = [
  { resolved: 45, pending: 30, label: "WK 1" },
  { resolved: 55, pending: 25, label: "WK 2" },
  { resolved: 35, pending: 40, label: "WK 3" },
  { resolved: 70, pending: 15, label: "WK 4 ★" },
];

const bottlenecks = [
  { dept: "Sanitation", level: "High", color: "#BA5624", bg: "rgba(186,86,36,0.12)" },
  { dept: "Roads", level: "Med", color: "#FFA552", bg: "rgba(255,165,82,0.1)" },
  { dept: "Parks", level: "Low", color: "var(--sage)", bg: "rgba(196,214,176,0.08)" },
  { dept: "Water", level: "High", color: "#BA5624", bg: "rgba(186,86,36,0.12)" },
];

const slaRows = [
  { id: "#TKT-8901", issue: "Massive Pothole — Main St Int", dept: "Roads", time: "00:15:00", critical: true },
  { id: "#TKT-8905", issue: "Major Water Main Leak", dept: "Water", time: "00:42:30", critical: true },
  { id: "#TKT-8890", issue: "Missed Sector Trash Pickup", dept: "Sanitation", time: "02:10:00", critical: false },
];

export default function DeptHeadAnalyticsPage() {
  return (
    <main className="min-h-screen font-display antialiased" style={{ background: "var(--background)", color: "var(--text)" }}>
      <Navigation />
      <div className="mx-auto w-full max-w-[1440px] flex flex-col gap-5 px-8 py-8">

        {/* Filters bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-md border p-3"
          style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
          <div className="flex flex-wrap gap-2">
            {["Last 30 Days", "All Departments", "Priority: High"].map((label, i) => (
              <button key={label} className="flex items-center gap-2 rounded-md border px-3 py-1.5 text-sm font-medium transition-colors hover:border-amber/30"
                style={{ background: "var(--card)", borderColor: "var(--border)", color: "var(--text-secondary)" }}>
                <span className="material-symbols-outlined text-lg">{["calendar_month", "filter_alt", "sort"][i]}</span>
                {label}
              </button>
            ))}
          </div>
          <div className="flex gap-2">
            <button className="flex items-center gap-2 rounded-md px-4 py-1.5 text-sm font-medium"
              style={{ background: "var(--amber)", color: "#1a0f0a" }}>
              <span className="material-symbols-outlined text-lg">refresh</span>Sync Data
            </button>
            <button className="flex items-center justify-center rounded-md border p-1.5" style={{ borderColor: "var(--border)", color: "var(--text-secondary)" }}>
              <span className="material-symbols-outlined text-lg">download</span>
            </button>
          </div>
        </div>

        {/* KPI cards */}
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {kpiCards.map((k) => (
            <div key={k.label} className="flex flex-col gap-1 rounded-md border p-5"
              style={{ background: "var(--card)", borderColor: "var(--border)" }}>
              <div className="mb-2 flex items-center justify-between">
                <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>{k.label}</p>
              </div>
              <p className="font-mono text-3xl font-medium tracking-tight" style={{ color: "var(--amber)" }}>
                {k.value}<span className="text-lg" style={{ color: "var(--text-muted)" }}>{k.unit}</span>
              </p>
              <p className="mt-2 text-xs font-medium font-mono" style={{ color: k.trendColor }}>{k.trend} vs last mo</p>
            </div>
          ))}
        </div>

        {/* Chart + Bottleneck */}
        <div className="flex flex-col gap-5 lg:flex-row">
          {/* Resolution flow chart */}
          <div className="flex-1 lg:w-3/5 rounded-md border p-6" style={{ background: "var(--card)", borderColor: "var(--border)" }}>
            <div className="mb-5 flex items-start justify-between border-b pb-4" style={{ borderColor: "var(--border-subtle)" }}>
              <div>
                <h3 className="text-lg font-semibold" style={{ color: "var(--text)" }}>Resolution Flow</h3>
                <p className="mt-1 text-xs font-medium uppercase tracking-wide" style={{ color: "var(--text-muted)" }}>Weekly Trend (Last 4 Wks)</p>
              </div>
              <div className="flex gap-4">
                <span className="flex items-center gap-1.5 text-xs" style={{ color: "var(--text-muted)" }}>
                  <span className="h-3 w-3 rounded-sm" style={{ background: "var(--amber)" }} />Resolved
                </span>
                <span className="flex items-center gap-1.5 text-xs" style={{ color: "var(--text-muted)" }}>
                  <span className="h-3 w-3 rounded-sm" style={{ background: "var(--border)" }} />Pending
                </span>
              </div>
            </div>
            <div className="flex items-end justify-between gap-4 border-b border-l pb-2 pl-4 relative ml-8"
              style={{ borderColor: "var(--border-subtle)", minHeight: 220 }}>
              <div className="absolute -left-10 top-0 flex h-full flex-col justify-between pb-6 text-[10px] font-mono" style={{ color: "var(--text-muted)" }}>
                {["500", "250", "0"].map(v => <span key={v}>{v}</span>)}
              </div>
              {weeklyBars.map((b) => (
                <div key={b.label} className="flex w-full flex-col items-center gap-1">
                  <div className="flex w-full max-w-[48px] flex-col gap-1" style={{ height: 200 }}>
                    <div className="w-full rounded-t-sm" style={{ height: `${b.pending}%`, background: "var(--border)" }} />
                    <div className="w-full rounded-t-sm" style={{ height: `${b.resolved}%`, background: "var(--amber)" }} />
                  </div>
                  <span className="mt-2 text-[10px] font-medium" style={{ color: "var(--text-muted)" }}>{b.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Bottleneck radar */}
          <div className="flex-1 lg:w-2/5 rounded-md border p-6" style={{ background: "var(--card)", borderColor: "var(--border)" }}>
            <div className="mb-5 border-b pb-4" style={{ borderColor: "var(--border-subtle)" }}>
              <h3 className="text-lg font-semibold" style={{ color: "var(--text)" }}>Bottleneck Radar</h3>
              <p className="mt-1 text-xs font-medium uppercase tracking-wide" style={{ color: "var(--text-muted)" }}>Dept Vulnerability Zones</p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {bottlenecks.map((b) => (
                <div key={b.dept} className="flex flex-col justify-between rounded-md border p-4"
                  style={{ background: b.bg, borderColor: `${b.color}33` }}>
                  <span className="font-medium text-sm" style={{ color: "var(--text)" }}>{b.dept}</span>
                  <span className="font-mono text-xl font-semibold" style={{ color: b.color }}>{b.level}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* SLA Action Table */}
        <div className="overflow-hidden rounded-md border" style={{ background: "var(--card)", borderColor: "var(--border)" }}>
          <div className="flex items-start justify-between border-b p-5" style={{ borderColor: "var(--border)" }}>
            <div className="flex items-center gap-3">
              <h3 className="text-lg font-semibold" style={{ color: "var(--text)" }}>SLA Action Required</h3>
              <span className="rounded-full border px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide"
                style={{ background: "rgba(186,86,36,0.1)", borderColor: "rgba(186,86,36,0.25)", color: "#BA5624" }}>
                Immediate Action
              </span>
            </div>
            <button className="text-sm font-medium" style={{ color: "var(--amber)" }}>View All</button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b text-xs font-semibold uppercase tracking-wider"
                  style={{ background: "var(--elevated)", borderColor: "var(--border)", color: "var(--text-muted)" }}>
                  {["Ticket ID", "Issue Details", "Department", "Time Remaining", "Action"].map((h) => (
                    <th key={h} className="p-4 font-medium whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y" style={{ borderColor: "var(--border-subtle)" }}>
                {slaRows.map((r) => (
                  <tr key={r.id} className="transition-colors hover:bg-elevated/20">
                    <td className="p-4 font-mono font-medium" style={{ color: "var(--text)" }}>{r.id}</td>
                    <td className="p-4 font-medium" style={{ color: "var(--text)" }}>{r.issue}</td>
                    <td className="p-4">
                      <span className="rounded border px-2.5 py-1 text-xs font-medium"
                        style={{ background: "var(--elevated)", borderColor: "var(--border)", color: "var(--text-secondary)" }}>
                        {r.dept}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 font-mono text-xs font-semibold"
                        style={r.critical ? {
                          background: "rgba(186,86,36,0.1)", borderColor: "rgba(186,86,36,0.3)", color: "#BA5624",
                        } : {
                          background: "var(--elevated)", borderColor: "var(--border)", color: "var(--text-muted)",
                        }}>
                        {r.critical && <span className="h-1.5 w-1.5 animate-pulse rounded-full" style={{ background: "#BA5624" }} />}
                        {r.time}
                      </div>
                    </td>
                    <td className="p-4">
                      <button className="rounded px-3 py-1.5 text-xs font-medium transition-colors w-full max-w-[120px]"
                        style={r.critical ? { background: "var(--amber)", color: "#1a0f0a" }
                          : { background: "transparent", border: "1px solid var(--border)", color: "var(--text-secondary)" }}>
                        {r.critical ? "Escalate" : "Nudge"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </main>
  );
}
