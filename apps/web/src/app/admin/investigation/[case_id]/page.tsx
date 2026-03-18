const timelineEvents = [
  {
    title: "Citizen Complaint",
    time: "T-00:00",
    dotColor: "var(--amber)",
    notes: `Massive crater on 5th Ave. Blew out my tire. Needs fixing ASAP.`,
    geo: "40.7128° N, 74.0060° W",
    meta: "iPhone 13 Pro, Flash: Off",
  },
  {
    title: "AI Routing",
    time: "T+00:05",
    dotColor: "#3b82f6",
    tag: "NLP Applied",
    confidence: "Confidence score 94%",
    category: "CRITICAL_INFRA_STREET",
    routed: "Crew Sector 4 (Heavy Machinery)",
  },
  {
    title: "Crew Resolution",
    time: "T+14:22",
    dotColor: "var(--text-muted)",
    notes: `Status: Job Completed\nFilled and leveled. 4 bags cold patch used.`,
    warning: "GPS EXIF mismatch detected: Variance 450m",
  },
  {
    title: "Citizen Dispute",
    time: "T+18:05",
    dotColor: "#f87171",
    dispute: `"THIS IS A LIE! They took a picture of a different street! My pothole is still here! Look at the background buildings!"`,
  },
];

export default function ForensicInvestigationPage() {
  return (
    <main className="min-h-screen font-display antialiased" style={{ background: "var(--background)", color: "var(--text)" }}>
      <header className="flex items-center justify-between border-b px-10 py-5"
        style={{ background: "var(--card)", borderColor: "var(--border)" }}>
        <div className="flex items-center gap-4" style={{ color: "var(--text)" }}>
          <div className="flex h-8 w-8 items-center justify-center rounded" style={{ background: "var(--amber)" }}>
            <svg className="h-5 w-5" fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
              <path clipRule="evenodd" d="M24 4H42V17.3333V30.6667H24V44H6V30.6667V17.3333H24V4Z" fill="#1a0f0a" fillRule="evenodd" />
            </svg>
          </div>
          <h2 className="text-xl font-bold" style={{ color: "var(--text)" }}>GrievanceGrid</h2>
        </div>
        <div className="flex items-center gap-9 text-sm font-medium" style={{ color: "var(--text-muted)" }}>
          {["Dashboard", "Active Cases"].map((l) => (
            <a key={l} href="#" className="transition-colors hover:text-white">{l}</a>
          ))}
          <a href="#" className="font-semibold border-b-2 pb-1" style={{ color: "var(--amber)", borderColor: "var(--amber)" }}>Investigation File</a>
        </div>
      </header>

      <div className="mx-auto flex max-w-[1200px] flex-col gap-8 px-10 py-10 w-full">
        {/* Case header */}
        <div className="relative flex flex-col gap-6 rounded-md border p-8"
          style={{ background: "var(--card)", borderColor: "var(--border)" }}>
          <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-start">
            <div>
              <h1 className="mb-2 text-4xl font-bold tracking-tight" style={{ color: "var(--text)" }}>Case File #160408</h1>
              <p className="text-lg" style={{ color: "var(--text-muted)" }}>Disputed Resolution Investigation</p>
            </div>
            <div className="flex flex-col items-end gap-2">
              <span className="flex items-center gap-2 rounded-full border px-4 py-1.5 text-sm font-semibold"
                style={{ background: "rgba(255,165,82,0.1)", borderColor: "rgba(255,165,82,0.25)", color: "var(--amber)" }}>
                <span className="h-2 w-2 animate-pulse rounded-full" style={{ background: "var(--amber)" }} />
                Investigation Open
              </span>
              <span className="rounded-full border px-4 py-1.5 text-sm font-semibold"
                style={{ background: "rgba(248,113,113,0.08)", borderColor: "rgba(248,113,113,0.3)", color: "#f87171" }}>
                High Priority
              </span>
            </div>
          </div>
          <div className="flex flex-wrap gap-12 border-t pt-6 text-sm" style={{ borderColor: "var(--border-subtle)" }}>
            {[["Filed Date", "2023-10-24 14:32:01"], ["Subject", "Pothole Repair"], ["Crew ID", "C-8842"]].map(([label, val]) => (
              <div key={label}>
                <span className="mb-1 block text-xs font-semibold uppercase" style={{ color: "var(--text-muted)" }}>{label}</span>
                <span className="font-medium" style={{ color: "var(--text)" }}>{val}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Timeline */}
          <div className="lg:col-span-2 rounded-md border p-8" style={{ background: "var(--card)", borderColor: "var(--border)" }}>
            <h3 className="mb-8 border-b pb-4 text-2xl font-bold" style={{ color: "var(--text)", borderColor: "var(--border-subtle)" }}>Evidence Timeline</h3>
            <div className="relative pl-10 pb-4">
              {/* Vertical line */}
              <div className="absolute bottom-0 left-[19px] top-2 w-[2px]" style={{ background: "rgba(255,165,82,0.2)" }} />

              {timelineEvents.map((ev, i) => (
                <div key={i} className="relative mb-10">
                  {/* Dot */}
                  <div className="absolute -left-10 top-1 z-10 flex h-6 w-6 items-center justify-center rounded-full border-2"
                    style={{ background: "var(--card)", borderColor: ev.dotColor }}>
                    <span className="h-2 w-2 rounded-full" style={{ background: ev.dotColor }} />
                  </div>

                  <div className="rounded-md border p-5"
                    style={{
                      background: ev.dispute ? "rgba(248,113,113,0.05)" : "var(--elevated)",
                      borderColor: ev.dispute ? "rgba(248,113,113,0.2)" : "var(--border)",
                    }}>
                    <div className="mb-4 flex items-start justify-between">
                      <h4 className="text-lg font-semibold" style={{ color: ev.dotColor }}>{ev.title}</h4>
                      <span className="rounded border px-2 py-0.5 text-[10px] font-medium"
                        style={{ background: "var(--card)", borderColor: "var(--border)", color: "var(--text-muted)" }}>{ev.time}</span>
                    </div>

                    {ev.notes && (
                      <p className="text-sm" style={{ color: "var(--text-secondary)" }}>{ev.notes}</p>
                    )}
                    {ev.geo && (
                      <div className="mt-2 grid grid-cols-2 gap-2 border-t pt-2 text-xs" style={{ borderColor: "var(--border-subtle)" }}>
                        <div><strong style={{ color: "var(--text-muted)" }}>GEO:</strong> <span style={{ color: "var(--text)" }}>{ev.geo}</span></div>
                        <div><strong style={{ color: "var(--text-muted)" }}>META:</strong> <span style={{ color: "var(--text)" }}>{ev.meta}</span></div>
                      </div>
                    )}
                    {ev.tag && (
                      <div className="text-sm space-y-2" style={{ color: "var(--text-secondary)" }}>
                        <div className="flex items-center gap-2">
                          <span className="rounded border px-2 py-0.5 text-xs font-semibold"
                            style={{ background: "rgba(59,130,246,0.1)", borderColor: "rgba(59,130,246,0.3)", color: "#60a5fa" }}>
                            {ev.tag}
                          </span>
                          <span>{ev.confidence}</span>
                        </div>
                        <p>Categorized as: <strong style={{ color: "var(--text)" }}>{ev.category}</strong></p>
                        <p className="border-t pt-2" style={{ borderColor: "var(--border-subtle)" }}>Routed to: {ev.routed}</p>
                      </div>
                    )}
                    {ev.warning && (
                      <div className="mt-3 flex items-start gap-2 rounded border p-2 text-xs"
                        style={{ background: "rgba(255,165,82,0.08)", borderColor: "rgba(255,165,82,0.25)", color: "var(--amber)" }}>
                        <span className="material-symbols-outlined text-sm">warning</span>
                        <span><strong>GPS EXIF mismatch:</strong> Variance 450m</span>
                      </div>
                    )}
                    {ev.dispute && (
                      <div className="rounded border p-4 text-sm italic leading-relaxed"
                        style={{ background: "rgba(248,113,113,0.05)", borderColor: "rgba(248,113,113,0.15)", color: "#f87171" }}>
                        {ev.dispute}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Geo Analysis sidebar */}
          <div className="flex flex-col gap-6">
            <div className="rounded-md border p-6" style={{ background: "var(--card)", borderColor: "var(--border)" }}>
              <h3 className="mb-5 flex items-center gap-2 border-b pb-3 text-xl font-bold"
                style={{ color: "var(--text)", borderColor: "var(--border-subtle)" }}>
                <span className="material-symbols-outlined">my_location</span>Geo-Analysis
              </h3>
              {/* Map */}
              <div className="relative mb-5 min-h-[200px] overflow-hidden rounded border" style={{ background: "var(--elevated)", borderColor: "var(--border)" }}>
                <div className="absolute inset-0 opacity-10"
                  style={{ backgroundImage: "linear-gradient(rgba(255,165,82,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(255,165,82,0.3) 1px, transparent 1px)", backgroundSize: "25px 25px" }} />
                {/* Reported point */}
                <div className="absolute" style={{ top: "30%", left: "40%" }}>
                  <div className="h-3 w-3 rounded-full border-2 border-white" style={{ background: "#f87171" }} />
                  <div className="absolute -mt-5 -ml-4 rounded px-1 py-0.5 text-[10px] font-medium backdrop-blur-sm"
                    style={{ background: "rgba(15,10,13,0.8)", borderColor: "var(--border)", color: "#f87171" }}>Reported</div>
                </div>
                {/* EXIF point */}
                <div className="absolute" style={{ top: "60%", left: "65%" }}>
                  <div className="h-3 w-3 rounded-full border-2 border-white" style={{ background: "var(--amber)" }} />
                  <div className="absolute -mt-5 -ml-4 rounded px-1 py-0.5 text-[10px] font-medium backdrop-blur-sm"
                    style={{ background: "rgba(15,10,13,0.8)", borderColor: "var(--border)", color: "var(--amber)" }}>Photo EXIF</div>
                </div>
              </div>
              <div className="space-y-4">
                <div className="rounded border p-3 text-xs" style={{ background: "var(--elevated)", borderColor: "var(--border)" }}>
                  <div className="mb-2 flex items-center gap-2" style={{ color: "var(--text-secondary)" }}>
                    <span className="h-2 w-2 rounded-full" style={{ background: "#f87171" }} />Reported Location
                  </div>
                  <div className="mb-3 flex items-center gap-2" style={{ color: "var(--text-secondary)" }}>
                    <span className="h-2 w-2 rounded-full" style={{ background: "var(--amber)" }} />Resolution Photo EXIF
                  </div>
                  <div className="flex justify-between border-t pt-2 font-medium" style={{ borderColor: "var(--border-subtle)", color: "var(--text)" }}>
                    <span>Variance Distance:</span><span>450 Meters</span>
                  </div>
                </div>
                <div className="rounded border p-4" style={{ background: "rgba(248,113,113,0.06)", borderColor: "rgba(248,113,113,0.2)" }}>
                  <h4 className="mb-1 flex items-center gap-1.5 text-sm font-semibold" style={{ color: "#f87171" }}>
                    <span className="material-symbols-outlined text-sm">flag</span>System Flag
                  </h4>
                  <p className="text-xs leading-relaxed" style={{ color: "#f87171" }}>
                    High probability of fraudulent resolution. Metadata indicates photo was taken outside acceptable bounding box.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex flex-col gap-4 border-t pt-8 md:flex-row" style={{ borderColor: "var(--border-subtle)" }}>
          <button className="flex flex-1 items-center justify-center gap-2 rounded-md py-4 px-6 font-medium transition-all hover:opacity-90"
            style={{ background: "var(--amber)", color: "#1a0f0a" }}>
            <span className="material-symbols-outlined text-lg">policy</span>Reopen &amp; Penalize Crew
          </button>
          <button className="flex flex-1 items-center justify-center gap-2 rounded-md border py-4 px-6 font-medium transition-colors hover:border-amber/20"
            style={{ background: "transparent", borderColor: "var(--border)", color: "var(--text-secondary)" }}>
            <span className="material-symbols-outlined text-lg">close</span>Dismiss Case
          </button>
        </div>
      </div>
    </main>
  );
}
