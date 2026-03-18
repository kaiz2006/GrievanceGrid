const logLines = [
  { text: "> init scan_protocol v4.2.1", type: "normal" },
  { text: "> parsing coordinate geometry...", type: "normal" },
  { text: "> warn: structural deviance detected (0.02mm)", type: "warn" },
  { text: "> analyzing weld integrity...", type: "normal" },
  { text: "> weld_01: pass (98.4%)", type: "normal" },
  { text: "> weld_02: pass (99.1%)", type: "normal" },
  { text: "> joint_sealant: confirmed active", type: "normal" },
  { text: "> comparing reference vectors...", type: "normal" },
  { text: "> STATUS: GRID_ALIGNMENT_OPTIMAL", type: "success" },
  { text: "_", type: "blink" },
];

export default function FieldVerificationPage() {
  return (
    <div className="min-h-screen font-display antialiased" style={{ background: "var(--background)", color: "var(--text)" }}>
      {/* Header */}
      <header className="mb-8 flex items-center justify-between rounded-md border px-6 py-4 m-8"
        style={{ background: "var(--card)", borderColor: "var(--border)" }}>
        <div className="flex items-center gap-4" style={{ color: "var(--text)" }}>
          <span className="material-symbols-outlined text-3xl" style={{ color: "var(--amber)" }}>engineering</span>
          <div className="flex flex-col gap-1">
            <h1 className="text-xl font-semibold tracking-tight">Field Verification Workspace</h1>
            <span className="font-mono text-xs font-medium rounded border px-2 py-1"
              style={{ background: "var(--elevated)", borderColor: "var(--border-subtle)", color: "var(--text-muted)" }}>
              GPS: 34.0522° N, 118.2437° W | ALT: 72m
            </span>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 rounded border px-3 py-1.5"
            style={{ background: "rgba(196,214,176,0.1)", borderColor: "rgba(196,214,176,0.25)", color: "var(--sage)" }}>
            <span className="material-symbols-outlined text-sm">location_on</span>
            <span className="text-xs font-medium uppercase tracking-wide">Location Matched</span>
          </div>
          <div className="font-mono text-sm font-medium rounded border px-2 py-1.5"
            style={{ background: "var(--elevated)", borderColor: "var(--border-subtle)", color: "var(--text-muted)" }}>
            ID: 884-GXV-99
          </div>
        </div>
      </header>

      <div className="mx-auto grid grid-cols-1 gap-8 px-8 pb-8 lg:grid-cols-3">
        {/* Left: Before/After + console */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            {/* Before */}
            <div className="flex h-[420px] flex-col overflow-hidden rounded-md border"
              style={{ background: "var(--card)", borderColor: "rgba(186,86,36,0.4)" }}>
              <div className="flex items-center justify-between border-b px-3 py-2 text-sm font-semibold uppercase tracking-wide"
                style={{ background: "var(--elevated)", borderColor: "rgba(186,86,36,0.3)", color: "var(--text-secondary)" }}>
                <span>Reference: Before</span>
                <span className="material-symbols-outlined text-lg" style={{ color: "#BA5624" }}>cancel</span>
              </div>
              <div className="relative flex-1" style={{ background: "var(--elevated)" }}>
                <div className="absolute inset-0 flex items-center justify-center opacity-10">
                  <div className="h-40 w-40 rounded-full border-2" style={{ borderColor: "#BA5624" }}>
                    <div className="flex h-full items-center justify-center">
                      <div className="h-4 w-4 rounded-full" style={{ background: "#BA5624" }} />
                    </div>
                  </div>
                </div>
                <div className="absolute inset-0 flex items-center justify-center opacity-20"
                  style={{ background: "rgba(186,86,36,0.15)" }}>
                  <span className="font-mono text-6xl font-bold" style={{ color: "#BA5624" }}>✕</span>
                </div>
              </div>
              <div className="flex justify-between border-t px-3 py-2 font-mono text-xs uppercase"
                style={{ background: "var(--elevated)", borderColor: "rgba(186,86,36,0.3)", color: "var(--text-muted)" }}>
                <span>Logged: 24h Ago</span>
                <span style={{ color: "#BA5624" }}>Status: Critical Failure</span>
              </div>
            </div>

            {/* After / Live */}
            <div className="flex h-[420px] flex-col overflow-hidden rounded-md border"
              style={{ background: "var(--card)", borderColor: "rgba(196,214,176,0.4)" }}>
              <div className="flex items-center justify-between border-b px-3 py-2 text-sm font-semibold uppercase tracking-wide"
                style={{ background: "var(--elevated)", borderColor: "rgba(196,214,176,0.3)", color: "var(--text-secondary)" }}>
                <span>Live Stream: After</span>
                <div className="flex items-center gap-2" style={{ color: "var(--sage)" }}>
                  <div className="h-2 w-2 animate-pulse rounded-full" style={{ background: "var(--sage)" }} />
                  <span className="text-xs font-medium">LIVE</span>
                </div>
              </div>
              <div className="relative flex-1" style={{ background: "var(--elevated)" }}>
                <div className="absolute inset-0 opacity-10"
                  style={{
                    backgroundImage: "linear-gradient(rgba(196,214,176,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(196,214,176,0.3) 1px, transparent 1px)",
                    backgroundSize: "40px 40px",
                  }} />
                <div className="absolute bottom-3 right-3 rounded border px-2 py-1 font-mono text-xs"
                  style={{ background: "rgba(15,10,13,0.85)", borderColor: "var(--border)", color: "var(--sage)" }}>
                  SCAN: ALIGNED<br />STRUCT: 99.8%
                </div>
              </div>
              <div className="flex justify-between border-t px-3 py-2 font-mono text-xs uppercase"
                style={{ background: "var(--elevated)", borderColor: "rgba(196,214,176,0.3)", color: "var(--text-muted)" }}>
                <span>Latency: 12ms</span>
                <span>Feed: Cam-04 Alpha</span>
              </div>
            </div>
          </div>

          {/* Control console */}
          <div className="rounded-md border p-6" style={{ background: "var(--card)", borderColor: "var(--border)" }}>
            <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>Control Console</h2>
            <div className="flex flex-col gap-3 md:flex-row">
              <button className="flex flex-1 items-center justify-center gap-3 rounded-md py-3 px-6 text-sm font-medium uppercase tracking-wide transition-opacity hover:opacity-90"
                style={{ background: "var(--amber)", color: "#1a0f0a" }}>
                <span className="material-symbols-outlined text-xl">cloud_upload</span>Capture &amp; Sync to Grid
              </button>
              <button className="flex items-center justify-center gap-2 rounded-md py-3 px-6 text-sm font-medium uppercase tracking-wide transition-opacity hover:opacity-90 md:w-1/3"
                style={{ background: "#BA5624", color: "#fff" }}>
                <span className="material-symbols-outlined text-xl">warning</span>Conflict / Cancel
              </button>
            </div>
          </div>
        </div>

        {/* Right sidebar */}
        <div className="flex flex-col gap-6">
          {/* Score */}
          <div className="flex flex-col items-center rounded-md border p-8 text-center"
            style={{ background: "var(--card)", borderColor: "var(--border)" }}>
            <h3 className="mb-4 text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>Severity Reduction Score</h3>
            <div className="font-light leading-none tracking-tighter" style={{ fontSize: "5rem", color: "var(--amber)" }}>
              89<span className="align-top text-3xl font-normal">%</span>
            </div>
            <div className="mt-4 rounded border px-3 py-1 text-xs font-mono font-medium uppercase"
              style={{ background: "rgba(196,214,176,0.1)", borderColor: "rgba(196,214,176,0.25)", color: "var(--sage)" }}>
              Target Exceeded (+14%)
            </div>
          </div>

          {/* Detection log */}
          <div className="flex flex-1 flex-col overflow-hidden rounded-md border"
            style={{ background: "var(--elevated)", borderColor: "var(--border)" }}>
            <div className="flex items-center justify-between border-b px-3 py-3 text-sm font-semibold uppercase tracking-wide"
              style={{ background: "var(--card)", borderColor: "var(--border)", color: "var(--text-secondary)" }}>
              <span>Object Detection Log</span>
              <span className="material-symbols-outlined text-lg">terminal</span>
            </div>
            <div className="flex flex-col gap-2 overflow-y-auto p-4 font-mono text-xs" style={{ maxHeight: 280 }}>
              {logLines.map((line, i) => (
                <p key={i} className={line.type === "blink" ? "animate-pulse" : ""}
                  style={{
                    color: line.type === "warn" ? "#BA5624"
                      : line.type === "success" ? "var(--sage)"
                        : "var(--text-secondary)",
                    background: line.type === "success" ? "rgba(196,214,176,0.06)" : "transparent",
                    borderLeft: line.type === "success" ? "2px solid var(--sage)" : "none",
                    paddingLeft: line.type === "success" ? 8 : 0,
                  }}>
                  {line.text}
                </p>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
