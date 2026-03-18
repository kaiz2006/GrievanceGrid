const ticker = "CRITICAL ALERT: MULTIPLE DISCREPANCIES DETECTED IN SECTOR 7G /// [FRAUD_PROB_99%] /// AWAITING MANUAL VERIFICATION /// AUDIT LOG CORRUPTION IN REGION BETA ///";

const kpiCards = [
  { label: "High-Probability Fraud", value: "07", icon: "gavel", color: "#BA5624", bg: "rgba(186,86,36,0.1)" },
  { label: "Citizen Disputes", value: "24", icon: "groups", color: "var(--amber)", bg: "rgba(255,165,82,0.07)" },
  { label: "Integrity Score", value: "94%", icon: "health_and_safety", color: "var(--sage)", bg: "rgba(196,214,176,0.08)" },
];

const auditRows = [
  { id: "#GG-4921", date: "2023-10-24", location: "Sector 7G", tag: "[GPS_FAIL]", tagColor: "#f87171", tagBg: "rgba(248,113,113,0.1)" },
  { id: "#GG-4922", date: "2023-10-24", location: "Region Beta", tag: "[IMG_CORRUPT]", tagColor: "#fb923c", tagBg: "rgba(251,146,60,0.1)" },
  { id: "#GG-4923", date: "2023-10-23", location: "Zone Alpha", tag: "[VERIFIED]", tagColor: "var(--sage)", tagBg: "rgba(196,214,176,0.1)" },
];

const chartBars = [
  [80, 60], [60, 90], [90, 40], [40, 30], [100, 80],
];
const days = ["M", "T", "W", "T", "F"];

export default function ForensicAuditPage() {
  return (
    <main className="min-h-screen font-display antialiased" style={{ background: "var(--background)", color: "var(--text)" }}>
      {/* Alert ticker */}
      <div className="overflow-hidden border-b py-1 opacity-90" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
        <div className="whitespace-nowrap font-mono text-xs tracking-wider" style={{ color: "var(--amber)", animation: "ticker 30s linear infinite" }}>
          {ticker} {ticker}
        </div>
      </div>
      <style>{`@keyframes ticker { from { transform: translateX(100vw); } to { transform: translateX(-100%); } }`}</style>

      <div className="mx-auto max-w-[1400px] px-6 py-8">
        {/* Header */}
        <header className="mb-8 flex items-center justify-between rounded-md border p-5"
          style={{ background: "var(--card)", borderColor: "var(--border)" }}>
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-3xl opacity-80" style={{ color: "var(--amber)" }}>analytics</span>
            <h2 className="text-2xl font-bold tracking-tight" style={{ color: "var(--text)" }}>GrievanceGrid Audit</h2>
          </div>
          <div className="flex flex-1 items-center justify-end gap-6">
            <nav className="flex items-center gap-6 text-sm font-medium" style={{ color: "var(--text-muted)" }}>
              {["Dashboard", "Hotspots", "Evidence Log"].map((l) => (
                <a key={l} href="#" className="transition-colors hover:text-white">{l}</a>
              ))}
            </nav>
            <button className="h-10 rounded-md px-6 text-sm font-medium transition-all hover:opacity-90"
              style={{ background: "var(--amber)", color: "#1a0f0a" }}>New Audit</button>
          </div>
        </header>

        {/* KPI cards */}
        <div className="mb-8 grid grid-cols-1 gap-5 md:grid-cols-3">
          {kpiCards.map((k) => (
            <div key={k.label} className="flex flex-col gap-3 rounded-md border p-6"
              style={{ background: k.bg, borderColor: "var(--border)" }}>
              <div className="flex items-start justify-between" style={{ color: k.color }}>
                <p className="w-2/3 text-sm font-semibold uppercase tracking-wider">{k.label}</p>
                <span className="material-symbols-outlined text-2xl">{k.icon}</span>
              </div>
              <p className="mt-2 font-mono text-5xl font-light" style={{ color: "var(--text)" }}>{k.value}</p>
            </div>
          ))}
        </div>

        {/* Chart + map */}
        <div className="mb-8 flex flex-col gap-5 lg:flex-row">
          <div className="flex-1 lg:w-3/5 flex flex-col rounded-md border p-6"
            style={{ background: "var(--card)", borderColor: "var(--border)" }}>
            <div className="mb-5 flex justify-between items-center border-b pb-4" style={{ borderColor: "var(--border-subtle)" }}>
              <h3 className="text-lg font-semibold" style={{ color: "var(--text)" }}>Reported vs Verified Audits</h3>
              <div className="flex gap-4">
                <span className="flex items-center gap-2 text-xs" style={{ color: "var(--text-muted)" }}>
                  <span className="h-3 w-3 rounded-sm" style={{ background: "var(--amber)" }} />Reported
                </span>
                <span className="flex items-center gap-2 text-xs" style={{ color: "var(--text-muted)" }}>
                  <span className="h-3 w-3 rounded-sm" style={{ background: "var(--border)" }} />Verified
                </span>
              </div>
            </div>
            <div className="flex flex-1 items-end justify-between gap-5 border-b border-l pb-2 pl-2"
              style={{ borderColor: "var(--border-subtle)", minHeight: 220 }}>
              {chartBars.map((([rep, ver], i)) => (
                <div key={i} className="flex flex-1 flex-col items-center gap-1">
                  <div className="flex w-full max-w-[40px] flex-col gap-1 justify-end" style={{ height: 200 }}>
                    <div className="w-full max-w-full rounded-t-sm" style={{ height: `${ver * 0.9}%`, background: "var(--border)" }} />
                    <div className="w-full max-w-full rounded-t-sm" style={{ height: `${rep * 0.9}%`, background: "var(--amber)" }} />
                  </div>
                  <p className="mt-2 text-xs font-medium" style={{ color: "var(--text-muted)" }}>{days[i]}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Hotspot map */}
          <div className="flex-none lg:w-2/5 rounded-md border p-6" style={{ background: "var(--card)", borderColor: "var(--border)" }}>
            <h3 className="mb-5 border-b pb-4 text-lg font-semibold" style={{ color: "var(--text)", borderColor: "var(--border-subtle)" }}>Hotspot Audit Map</h3>
            <div className="relative min-h-[220px] overflow-hidden rounded-sm border" style={{ background: "var(--elevated)", borderColor: "var(--border)" }}>
              <div className="absolute inset-0 opacity-10"
                style={{ backgroundImage: "radial-gradient(rgba(255,165,82,0.6) 1px, transparent 1px)", backgroundSize: "20px 20px" }} />
              {[[25, 40], [55, 55], [75, 70]].map(([t, l], i) => (
                <div key={i} className="absolute rounded-full opacity-60"
                  style={{ top: `${t}%`, left: `${l}%`, width: [32, 48, 24][i], height: [32, 48, 24][i], background: "var(--amber)", mixBlendMode: "screen" }}>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="h-2 w-2 rounded-full" style={{ background: "rgba(255,165,82,0.8)" }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Audit evidence log */}
        <div className="mb-8 rounded-md border p-6" style={{ background: "var(--card)", borderColor: "var(--border)" }}>
          <h3 className="mb-4 border-b pb-4 text-lg font-semibold" style={{ color: "var(--text)", borderColor: "var(--border-subtle)" }}>Audit Evidence Log</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b text-xs font-medium uppercase tracking-wider" style={{ borderColor: "var(--border)", color: "var(--text-muted)" }}>
                  {["ID", "Date", "Location", "Status Tag", "Action"].map((h) => (
                    <th key={h} className="p-3 font-medium">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="font-mono text-sm" style={{ color: "var(--text-secondary)" }}>
                {auditRows.map((r) => (
                  <tr key={r.id} className="border-b transition-colors hover:bg-elevated/20" style={{ borderColor: "var(--border-subtle)" }}>
                    <td className="p-3">{r.id}</td>
                    <td className="p-3">{r.date}</td>
                    <td className="p-3 font-display">{r.location}</td>
                    <td className="p-3">
                      <span className="rounded border px-2 py-0.5 text-xs"
                        style={{ background: r.tagBg, borderColor: `${r.tagColor}33`, color: r.tagColor }}>
                        {r.tag}
                      </span>
                    </td>
                    <td className="p-3">
                      <button className="text-xs font-medium hover:underline underline-offset-2" style={{ color: "var(--amber)" }}>Review</button>
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
