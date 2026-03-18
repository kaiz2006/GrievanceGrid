import Navigation from "../../components/Navigation";

const bars = [
  { label: "Jan", resolved: 60, pending: 20 },
  { label: "Feb", resolved: 40, pending: 30 },
  { label: "Mar", resolved: 75, pending: 15 },
  { label: "Apr", resolved: 85, pending: 10 },
  { label: "May", resolved: 65, pending: 25 },
];

export default function TransparencyPage() {
  return (
    <main className="min-h-screen font-display antialiased" style={{ background: "var(--background)", color: "var(--text)" }}>
      <Navigation />
      <div className="mx-auto flex max-w-6xl flex-col gap-8 p-8 lg:flex-row">
        {/* Left column */}
        <section className="flex flex-1 flex-col gap-8">
          {/* Hero */}
          <div className="flex flex-col gap-3">
            <h1 className="text-4xl font-bold tracking-tight md:text-5xl" style={{ color: "var(--text)" }}>
              Public Transparency<br />Dashboard
            </h1>
            <span className="inline-flex w-fit items-center rounded-full border px-3 py-1 text-sm font-semibold"
              style={{ background: "rgba(196,214,176,0.1)", borderColor: "rgba(196,214,176,0.25)", color: "var(--sage)" }}>
              Trustworthy &amp; Open
            </span>
          </div>

          {/* Stat cards */}
          <div className="grid grid-cols-2 gap-4">
            {[
              { label: "Overall Transparency", value: "4.2" },
              { label: "City Resolution Score", value: "4.8", sub: " / 5" },
            ].map((s) => (
              <div key={s.label} className="flex flex-col justify-between rounded-md border p-6"
                style={{ background: "var(--card)", borderColor: "var(--border)" }}>
                <p className="mb-2 text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>{s.label}</p>
                <p className="mt-auto font-mono text-5xl font-semibold leading-none tracking-tight" style={{ color: "var(--amber)" }}>
                  {s.value}
                  {s.sub && <span className="text-2xl font-normal" style={{ color: "var(--text-muted)" }}>{s.sub}</span>}
                </p>
              </div>
            ))}
          </div>

          {/* Chart */}
          <div className="rounded-md border p-6" style={{ background: "var(--card)", borderColor: "var(--border)" }}>
            <div className="mb-4 flex items-start justify-between border-b pb-4" style={{ borderColor: "var(--border-subtle)" }}>
              <div>
                <p className="text-lg font-semibold" style={{ color: "var(--text)" }}>Resolved vs Pending</p>
                <p className="mt-1 text-3xl font-bold" style={{ color: "var(--sage)" }}>82% Resolved</p>
              </div>
              <div className="flex items-center gap-2 rounded-full border px-3 py-1 text-sm font-semibold"
                style={{ background: "rgba(196,214,176,0.1)", borderColor: "rgba(196,214,176,0.2)", color: "var(--sage)" }}>
                <span className="material-symbols-outlined text-sm">trending_up</span>+12% YTD
              </div>
            </div>
            <div className="mb-4 flex gap-6 justify-end text-xs font-semibold" style={{ color: "var(--text-muted)" }}>
              <span className="flex items-center gap-2"><span className="h-3 w-3 rounded-sm" style={{ background: "var(--sage)" }} /> Resolved</span>
              <span className="flex items-center gap-2"><span className="h-3 w-3 rounded-sm" style={{ background: "var(--border)" }} /> Pending</span>
            </div>
            <div className="flex items-end justify-between gap-4 border-b border-l pb-2 pl-2" style={{ borderColor: "var(--border-subtle)", minHeight: 200 }}>
              {bars.map((b) => (
                <div key={b.label} className="flex flex-1 flex-col items-center gap-1">
                  <div className="flex w-full max-w-[40px] flex-col justify-end gap-1" style={{ height: 180 }}>
                    <div className="w-full rounded-t-sm transition-all" style={{ height: `${b.pending}%`, background: "var(--border)" }} />
                    <div className="w-full rounded-t-sm transition-all" style={{ height: `${b.resolved}%`, background: "var(--sage)" }} />
                  </div>
                  <p className="mt-2 text-xs font-semibold" style={{ color: "var(--text-muted)" }}>{b.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Right column */}
        <aside className="flex w-full flex-col gap-4 lg:w-[340px]">
          <a href="/submit" className="flex w-full items-center justify-center gap-3 rounded-md py-4 text-base font-bold transition-all hover:opacity-90"
            style={{ background: "var(--amber)", color: "#1a0f0a" }}>
            <span className="material-symbols-outlined">campaign</span>Submit Grievance
          </a>

          <div className="flex-1 rounded-md border p-6" style={{ background: "var(--card)", borderColor: "var(--border)" }}>
            <h2 className="mb-6 flex items-center gap-2 text-lg font-semibold" style={{ color: "var(--text)" }}>
              <span className="material-symbols-outlined" style={{ color: "var(--sage)" }}>dynamic_feed</span>Impact Feed
            </h2>
            <div className="flex flex-col gap-6">
              {[
                { title: "Pothole on 5th Ave filled", time: "2h ago" },
                { title: "Broken Streetlight fixed — Downtown", time: "5h ago" },
              ].map((item) => (
                <div key={item.title}>
                  <div className="mb-2 flex justify-between items-center">
                    <span className="rounded-full border px-2.5 py-0.5 text-xs font-semibold"
                      style={{ background: "rgba(196,214,176,0.1)", borderColor: "rgba(196,214,176,0.25)", color: "var(--sage)" }}>Resolved</span>
                    <span className="text-xs font-semibold" style={{ color: "var(--text-muted)" }}>{item.time}</span>
                  </div>
                  <p className="mb-3 font-semibold" style={{ color: "var(--text)" }}>{item.title}</p>
                  <div className="flex gap-2">
                    {["Before", "After"].map((label) => (
                      <div key={label} className="relative flex h-24 flex-1 items-end justify-start overflow-hidden rounded border p-1.5"
                        style={{ background: "var(--elevated)", borderColor: "var(--border-subtle)" }}>
                        <span className="rounded-sm px-1.5 py-0.5 text-[10px] font-semibold"
                          style={{ background: label === "After" ? "var(--sage)" : "rgba(240,240,240,0.15)", color: label === "After" ? "#1a2a10" : "var(--text-muted)" }}>
                          {label}
                        </span>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 h-px" style={{ background: "var(--border-subtle)" }} />
                </div>
              ))}
            </div>

            <div className="mt-6 flex gap-3 border-t pt-6" style={{ borderColor: "var(--border-subtle)" }}>
              {["Share", "Discuss"].map((label) => (
                <button key={label} className="flex flex-1 items-center justify-center gap-2 rounded-md border py-2.5 text-sm font-semibold transition-colors hover:border-amber/30"
                  style={{ background: "var(--elevated)", borderColor: "var(--border)", color: "var(--text-secondary)" }}>
                  <span className="material-symbols-outlined text-lg">{label === "Share" ? "share" : "forum"}</span>{label}
                </button>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </main>
  );
}
