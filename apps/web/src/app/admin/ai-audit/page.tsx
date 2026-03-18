import Navigation from "../../../components/Navigation";

const rows = [
  { text: "Huge pothole opened up on 5th Ave near the intersection, damaged my tire.", classification: "Infrastructure", dept: "Public Works", confidence: "High - 98%", confHigh: true },
  { text: "Power outage block 4, entire street is dark since 8 PM.", classification: "Electrical", dept: "Grid Maint", confidence: "High - 92%", confHigh: true },
  { text: "Water pipe broke in the park, flooding the walkway.", classification: "Plumbing", dept: "Parks & Rec", confidence: "Low - 65%", confHigh: false },
  { text: "Trash not picked up for 3 weeks at apartment complex.", classification: "Sanitation", dept: "Waste Mgt", confidence: "High - 95%", confHigh: true },
  { text: "Street light out at the corner of Main and Elm.", classification: "Electrical", dept: "Public Works", confidence: "Low - 72%", confHigh: false },
];

const vectorScores = [
  { label: "Parks & Rec", pct: 65, color: "var(--amber)" },
  { label: "Water Dept", pct: 62, color: "var(--border)" },
  { label: "Public Works", pct: 41, color: "rgba(100,100,100,0.5)" },
];

export default function AIAuditPage() {
  return (
    <div className="flex min-h-screen flex-col font-display antialiased" style={{ background: "var(--background)", color: "var(--text)" }}>
      <Navigation />
      <div className="flex flex-1 overflow-hidden">
        {/* Main table */}
        <main className="flex flex-1 flex-col overflow-y-auto p-8">
          <div className="mb-6">
            <h2 className="mb-1 text-2xl font-semibold" style={{ color: "var(--text)" }}>AI Routing Audit &amp; Logic Dashboard</h2>
            <p className="text-sm" style={{ color: "var(--text-muted)" }}>Review, audit, and correct automated routing decisions.</p>
          </div>

          {/* Search + filter */}
          <div className="mb-5 flex gap-3">
            <div className="flex flex-1 items-center overflow-hidden rounded-md border" style={{ background: "var(--card)", borderColor: "var(--border)" }}>
              <div className="flex items-center justify-center px-4" style={{ color: "var(--text-muted)" }}>
                <span className="material-symbols-outlined text-lg">search</span>
              </div>
              <input className="flex-1 bg-transparent py-2.5 text-sm focus:outline-none"
                style={{ color: "var(--text)" }} placeholder="Search by ticket ID or keyword" />
            </div>
            <button className="flex items-center gap-2 rounded-md border px-4 py-2.5 text-sm font-medium transition-colors hover:border-amber/30"
              style={{ background: "var(--card)", borderColor: "var(--border)", color: "var(--text)" }}>
              <span className="material-symbols-outlined text-lg">filter_alt</span>Filters
            </button>
          </div>

          {/* Table */}
          <div className="overflow-x-auto rounded-md border" style={{ background: "var(--card)", borderColor: "var(--border)" }}>
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b text-xs font-semibold uppercase tracking-wider"
                  style={{ background: "var(--elevated)", borderColor: "var(--border)", color: "var(--text-muted)" }}>
                  <th className="p-4 w-1/3">Input Text</th>
                  <th className="p-4 w-40">AI Classification</th>
                  <th className="p-4 w-40">Department</th>
                  <th className="p-4 w-36">Confidence</th>
                  <th className="p-4 w-28 text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r, i) => (
                  <tr key={i} className="border-b transition-colors hover:bg-elevated/30" style={{ borderColor: "var(--border-subtle)" }}>
                    <td className="p-4 text-sm" style={{ color: "var(--text-secondary)" }}>&ldquo;{r.text}&rdquo;</td>
                    <td className="p-4">
                      <span className="rounded-full border px-2.5 py-0.5 text-xs font-medium"
                        style={{ background: "var(--elevated)", borderColor: "var(--border)", color: "var(--text-secondary)" }}>
                        {r.classification}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className="rounded-full border px-2.5 py-0.5 text-xs font-medium"
                        style={{ background: "rgba(56,29,42,0.6)", borderColor: "rgba(56,29,42,0.8)", color: "var(--amber)" }}>
                        {r.dept}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2" style={{ color: "var(--text-secondary)" }}>
                        <div className="h-2 w-2 rounded-full" style={{ background: r.confHigh ? "var(--sage)" : "#BA5624" }} />
                        <span className="font-medium">{r.confidence}</span>
                      </div>
                    </td>
                    <td className="p-4 text-center">
                      <button className="rounded-md border px-3 py-1.5 text-xs font-medium transition-colors hover:border-amber/30"
                        style={{ background: "transparent", borderColor: "var(--border)", color: "var(--amber)" }}>
                        View Logic
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </main>

        {/* Sidebar */}
        <aside className="w-[320px] shrink-0 flex flex-col border-l p-5 overflow-y-auto"
          style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
          <div className="mb-5 flex items-center justify-between border-b pb-3" style={{ borderColor: "var(--border-subtle)" }}>
            <h3 className="font-semibold text-base" style={{ color: "var(--text)" }}>Analysis Terminal</h3>
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 animate-pulse rounded-full" style={{ background: "var(--sage)" }} />
              <span className="text-xs font-medium" style={{ color: "var(--text-muted)" }}>Active</span>
            </div>
          </div>

          <div className="mb-5 rounded-md border p-4" style={{ background: "var(--card)", borderColor: "var(--border)" }}>
            <p className="mb-1 text-xs text-muted font-medium" style={{ color: "var(--text-muted)" }}>Ticket Ref</p>
            <p className="font-mono font-semibold text-sm" style={{ color: "var(--text)" }}>TKT-8942-WPB</p>
          </div>

          <div className="mb-5">
            <p className="mb-2 text-xs font-medium" style={{ color: "var(--text-muted)" }}>Extracted Keywords</p>
            <div className="flex flex-wrap gap-2">
              {["Water", "Pipe", "Park", "Flooding"].map((kw) => (
                <span key={kw} className="rounded-md border px-2.5 py-1 text-xs font-medium shadow-sm"
                  style={{ background: "var(--card)", borderColor: "var(--border)", color: "var(--text-secondary)" }}>
                  {kw}
                </span>
              ))}
            </div>
          </div>

          <div className="mb-5 flex-1">
            <p className="mb-3 text-xs font-medium" style={{ color: "var(--text-muted)" }}>Vector Similarity</p>
            <div className="space-y-4">
              {vectorScores.map((v) => (
                <div key={v.label}>
                  <div className="mb-1.5 flex justify-between text-xs font-medium" style={{ color: "var(--text-secondary)" }}>
                    <span>{v.label}</span><span>{v.pct}%</span>
                  </div>
                  <div className="h-1.5 w-full overflow-hidden rounded-full" style={{ background: "var(--elevated)" }}>
                    <div className="h-full rounded-full" style={{ width: `${v.pct}%`, background: v.color }} />
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-5 flex items-start gap-2 rounded-md border p-3"
              style={{ background: "rgba(186,86,36,0.08)", borderColor: "rgba(186,86,36,0.25)" }}>
              <span className="material-symbols-outlined text-sm mt-0.5" style={{ color: "#BA5624" }}>info</span>
              <p className="text-xs leading-relaxed font-medium" style={{ color: "#BA5624" }}>
                Confidence margin &lt; 5%. Manual review recommended.
              </p>
            </div>
          </div>

          <button className="mt-auto w-full rounded-md py-2.5 text-sm font-medium transition-opacity hover:opacity-90"
            style={{ background: "#BA5624", color: "#fff" }}>
            Manual Correction
          </button>
        </aside>
      </div>

      {/* Footer */}
      <footer className="flex items-center justify-between border-t px-6 py-2.5 text-xs font-medium"
        style={{ background: "var(--surface)", borderColor: "var(--border)", color: "var(--text-muted)" }}>
        <div className="flex items-center gap-6">
          <span>Status: <span className="rounded-full border px-2 py-0.5 font-semibold ml-1" style={{ background: "var(--card)", borderColor: "var(--border)", color: "var(--sage)" }}>Online</span></span>
          <span>Pending Reviews: 14</span>
          <span>Last Sync: 2m ago</span>
        </div>
        <span>Model Version: v2.4.0-STABLE</span>
      </footer>
    </div>
  );
}
