const logRows = [
  { id: "LOG-8831", ts: "2023-10-27T14:32:01Z", variance: "89m", status: "FLAGGED", statusColor: "var(--amber)", statusBg: "rgba(255,165,82,0.1)", isCritical: false },
  { id: "LOG-8832", ts: "2023-10-27T14:35:12Z", variance: "12m", status: "VERIFIED", statusColor: "var(--sage)", statusBg: "rgba(196,214,176,0.1)", isCritical: false },
  { id: "LOG-8833", ts: "2023-10-27T15:01:44Z", variance: "145m", status: "CRITICAL", statusColor: "#BA5624", statusBg: "rgba(186,86,36,0.1)", isCritical: true },
  { id: "LOG-8834", ts: "2023-10-27T15:10:05Z", variance: "3m", status: "VERIFIED", statusColor: "var(--sage)", statusBg: "rgba(196,214,176,0.1)", isCritical: false },
  { id: "LOG-8835", ts: "2023-10-27T15:22:30Z", variance: "55m", status: "FLAGGED", statusColor: "var(--amber)", statusBg: "rgba(255,165,82,0.1)", isCritical: false },
];

export default function ForensicVerificationPage() {
  return (
    <div className="flex min-h-screen flex-col font-display antialiased" style={{ background: "var(--background)", color: "var(--text)" }}>
      {/* Header */}
      <header className="flex shrink-0 items-center justify-between border-b px-6 py-4 shadow-sm"
        style={{ background: "var(--card)", borderColor: "var(--border)" }}>
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-3" style={{ color: "var(--text)" }}>
            <div className="flex h-8 w-8 items-center justify-center rounded-md" style={{ background: "var(--amber)" }}>
              <span className="material-symbols-outlined font-medium text-xl" style={{ color: "#1a0f0a" }}>policy</span>
            </div>
            <h1 className="text-xl font-bold uppercase tracking-wide">GrievanceGrid Audit</h1>
          </div>
          <div className="flex items-center overflow-hidden rounded-md border h-10"
            style={{ background: "var(--elevated)", borderColor: "var(--border)" }}>
            <div className="flex h-full items-center justify-center border-r px-3" style={{ borderColor: "var(--border)", color: "var(--text-muted)" }}>
              <span className="material-symbols-outlined text-lg">search</span>
            </div>
            <input className="h-full bg-transparent px-4 font-mono text-sm placeholder-muted focus:outline-none w-56"
              style={{ color: "var(--text)" }} placeholder="Search LOG_ID..." />
          </div>
        </div>
        <button className="rounded-md px-5 py-2.5 font-semibold text-sm tracking-wide transition-all hover:opacity-90"
          style={{ background: "var(--amber)", color: "#1a0f0a" }}>
          Run Integrity Check
        </button>
      </header>

      <div className="flex flex-1 gap-5 overflow-hidden p-5">
        {/* Main table */}
        <main className="flex flex-1 min-w-0 flex-col gap-3 overflow-hidden">
          {/* Filters */}
          <div className="flex flex-wrap gap-3 shrink-0">
            {[
              { label: "Date Range", color: "var(--text-secondary)" },
              { label: "Variance > 50m", color: "#BA5624" },
              { label: "Status: Unverified", color: "var(--text-secondary)" },
            ].map((f) => (
              <button key={f.label} className="flex items-center gap-2 rounded-md border px-4 py-2 text-sm font-medium transition-colors"
                style={{ background: "var(--card)", borderColor: "var(--border)", color: f.color }}>
                {f.label}
                <span className="material-symbols-outlined text-lg">expand_more</span>
              </button>
            ))}
          </div>

          {/* Table */}
          <div className="flex-1 overflow-auto rounded-md border" style={{ background: "var(--card)", borderColor: "var(--border)" }}>
            <table className="w-full text-left">
              <thead className="sticky top-0 z-10" style={{ background: "var(--amber)" }}>
                <tr>
                  {["LOG_ID", "TIMESTAMP", "GPS_VARIANCE", "STATUS", "ACTION"].map((h, i) => (
                    <th key={h} className={`border-b p-4 font-semibold text-xs uppercase tracking-wider whitespace-nowrap ${i === 4 ? "w-24 text-center" : ""}`}
                      style={{ borderColor: "rgba(26,15,10,0.2)", color: "#1a0f0a" }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="font-mono text-sm divide-y" style={{ color: "var(--text-secondary)", borderColor: "var(--border-subtle)" }}>
                {logRows.map((r) => (
                  <tr key={r.id} className="cursor-pointer transition-colors hover:bg-elevated/30"
                    style={r.isCritical ? { background: "rgba(186,86,36,0.04)" } : {}}>
                    <td className="border-r p-4 font-medium" style={{ borderColor: "var(--border-subtle)", color: "var(--amber)" }}>{r.id}</td>
                    <td className="border-r p-4" style={{ borderColor: "var(--border-subtle)" }}>{r.ts}</td>
                    <td className="border-r p-4 font-medium" style={{ borderColor: "var(--border-subtle)", color: r.variance.length > 3 ? "#BA5624" : "var(--text-secondary)" }}>
                      {r.variance}
                    </td>
                    <td className="border-r p-4" style={{ borderColor: "var(--border-subtle)" }}>
                      <span className="rounded border px-2.5 py-1 text-xs font-semibold uppercase"
                        style={{ background: r.statusBg, borderColor: `${r.statusColor}33`, color: r.statusColor }}>
                        {r.status}
                      </span>
                    </td>
                    <td className="p-4 text-center">
                      <button className="rounded-md p-1.5 transition-colors hover:bg-elevated"
                        style={{ color: r.isCritical ? "#BA5624" : "var(--text-muted)" }}>
                        <span className="material-symbols-outlined text-lg block">{r.isCritical ? "gavel" : "visibility"}</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </main>

        {/* Evidence sidebar */}
        <aside className="flex w-[360px] shrink-0 flex-col overflow-y-auto rounded-md border"
          style={{ background: "var(--card)", borderColor: "var(--border)" }}>
          <div className="sticky top-0 z-10 border-b p-5" style={{ background: "var(--elevated)", borderColor: "var(--border)" }}>
            <h2 className="flex items-center gap-2 text-lg font-bold uppercase tracking-wide"
              style={{ color: "var(--text)" }}>
              <span className="material-symbols-outlined text-xl" style={{ color: "var(--amber)" }}>folder_open</span>
              Evidence File
            </h2>
            <p className="mt-1.5 flex items-center gap-1.5 font-mono text-xs" style={{ color: "var(--text-muted)" }}>
              <span className="h-1.5 w-1.5 rounded-full" style={{ background: "var(--sage)" }} />
              ACTIVE_LOG: LOG-8831
            </p>
          </div>

          <div className="flex flex-col gap-6 p-5">
            {/* Visual verification */}
            <div className="space-y-3">
              <h3 className="border-b pb-2 text-xs font-semibold uppercase tracking-wider"
                style={{ borderColor: "var(--border-subtle)", color: "var(--text-muted)" }}>Visual Verification</h3>
              <div className="grid grid-cols-2 gap-3">
                {["CITIZEN_UPLOAD.JPG", "CREW_VERIFY.JPG"].map((label) => (
                  <div key={label} className="flex flex-col gap-1">
                    <div className="relative aspect-square overflow-hidden rounded border"
                      style={{ background: "var(--elevated)", borderColor: "rgba(255,165,82,0.25)" }}>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="material-symbols-outlined text-3xl" style={{ color: "var(--text-muted)", opacity: 0.3 }}>image</span>
                      </div>
                      <div className="absolute bottom-0 left-0 right-0 p-1.5 font-mono text-[9px] truncate"
                        style={{ background: "rgba(26,15,10,0.9)", color: "var(--amber)" }}>
                        {label}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Auditor memo */}
            <div className="space-y-3">
              <h3 className="border-b pb-2 text-xs font-semibold uppercase tracking-wider"
                style={{ borderColor: "var(--border-subtle)", color: "var(--text-muted)" }}>Auditor Memo</h3>
              <div className="relative min-h-[140px] rounded border p-4"
                style={{ background: "rgba(255,165,82,0.04)", borderColor: "rgba(255,165,82,0.2)" }}>
                <textarea className="w-full resize-none bg-transparent font-mono text-sm focus:outline-none h-full"
                  style={{ color: "var(--text-secondary)" }}
                  placeholder="Enter forensic notes here..." rows={5} />
              </div>
            </div>

            {/* Actions */}
            <div className="mt-auto space-y-3 border-t pt-4" style={{ borderColor: "var(--border-subtle)" }}>
              <button className="flex w-full items-center justify-center gap-2 rounded py-2.5 font-semibold text-sm tracking-wide transition-all hover:opacity-90"
                style={{ background: "var(--amber)", color: "#1a0f0a" }}>
                <span className="material-symbols-outlined text-lg">gavel</span>Issue Violation
              </button>
              <button className="flex w-full items-center justify-center gap-2 rounded border py-2.5 font-semibold text-sm tracking-wide transition-colors hover:border-amber/30"
                style={{ background: "transparent", borderColor: "var(--border)", color: "var(--text-secondary)" }}>
                <span className="material-symbols-outlined text-lg">check_circle</span>Force Verify
              </button>
            </div>
          </div>
        </aside>
      </div>

      {/* Footer */}
      <footer className="flex shrink-0 items-center justify-between border-t px-6 py-3 font-mono text-xs"
        style={{ background: "var(--amber)", borderColor: "rgba(26,15,10,0.2)", color: "#1a0f0a" }}>
        <div className="flex gap-6">
          <span>SYS.STATUS: <span className="font-medium">ONLINE</span></span>
          <span>NODE: <span className="font-medium">US-EAST-G1</span></span>
          <span>DB_LATENCY: <span className="font-medium">14ms</span></span>
        </div>
        <div className="flex gap-6">
          <span>UNVERIFIED: <span className="font-bold">1,204</span></span>
          <span>CRITICAL: <span className="font-bold">89</span></span>
        </div>
      </footer>
    </div>
  );
}
