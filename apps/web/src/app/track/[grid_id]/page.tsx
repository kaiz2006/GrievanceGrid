import Navigation from "../../../components/Navigation";

export default function TrackPage({ params }: { params: { grid_id: string } }) {
  const gridId = params.grid_id ?? "GRI-2026-000001";

  const timeline = [
    {
      status: "CREATED",
      time: "08:14 AM",
      desc: "Grievance submitted successfully.",
      isCompleted: true,
      isCurrent: false,
    },
    {
      status: "AI-ROUTED",
      time: "08:15 AM",
      desc: "Assigned to Zone B — PWD Team Alpha-3.",
      isCompleted: true,
      isCurrent: false,
      detail: "> Optimization Log: Analyzing 12 active crews.\n> Selected Crew 4. Estimated TT: 15m. Saving: 8m.",
    },
    {
      status: "IN-PROGRESS",
      time: "08:22 AM",
      desc: "Crew dispatched to site location.",
      isCompleted: false,
      isCurrent: true,
      detail: "Status Update: Expected arrival in 15 mins. Traffic nominal.",
    },
    {
      status: "RESOLVED",
      time: "Pending",
      desc: "Awaiting final inspection...",
      isCompleted: false,
      isCurrent: false,
    },
  ];

  return (
    <main
      className="min-h-screen font-display antialiased"
      style={{ background: "var(--background)", color: "var(--text)" }}
    >
      <Navigation />

      <div className="mx-auto flex max-w-6xl flex-col gap-8 p-8 lg:flex-row">
        {/* ─── Main Timeline ─────────────────────────────── */}
        <section className="flex w-full flex-col gap-8 lg:w-2/3">
          {/* Header */}
          <div
            className="flex flex-col items-start justify-between gap-4 border-b pb-4 md:flex-row md:items-end"
            style={{ borderColor: "var(--border-subtle)" }}
          >
            <h2
              className="text-3xl font-semibold tracking-tight md:text-4xl"
              style={{ color: "var(--text)" }}
            >
              Resolution Lifecycle
            </h2>
            <div
              className="flex shrink-0 flex-col gap-2 rounded-md border p-4"
              style={{
                background: "var(--card)",
                borderColor: "var(--border)",
              }}
            >
              <div
                className="text-[10px] font-semibold uppercase tracking-wider"
                style={{ color: "var(--text-muted)" }}
              >
                Case Overview
              </div>
              <div className="flex items-center gap-3">
                <span
                  className="font-mono text-sm font-semibold"
                  style={{ color: "var(--text)" }}
                >
                  #{gridId}
                </span>
                <span style={{ color: "var(--border)" }}>|</span>
                <span
                  className="text-sm font-medium"
                  style={{ color: "var(--text-secondary)" }}
                >
                  Sanitation
                </span>
                <span
                  className="rounded border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider"
                  style={{
                    background: "rgba(255,87,51,0.1)",
                    borderColor: "rgba(255,87,51,0.25)",
                    color: "#ff5733",
                  }}
                >
                  High Priority
                </span>
              </div>
            </div>
          </div>

          {/* Timeline */}
          <div className="relative mt-2 pl-8">
            {/* Vertical line */}
            <div
              className="absolute bottom-8 left-[5px] top-2 w-[2px]"
              style={{ background: "var(--border)" }}
            />

            {timeline.map((step, idx) => (
              <div
                key={step.status}
                className={`relative mb-8 flex items-start gap-6 ${
                  !step.isCompleted && !step.isCurrent ? "opacity-40" : ""
                }`}
              >
                {/* Node */}
                <div
                  className={`absolute left-0 top-1.5 z-10 h-3 w-3 rounded`}
                  style={{
                    background: step.isCurrent
                      ? "var(--amber)"
                      : step.isCompleted
                      ? "var(--sage)"
                      : "transparent",
                    border: !step.isCompleted && !step.isCurrent
                      ? "2px solid var(--border)"
                      : "none",
                    boxShadow: step.isCurrent
                      ? "0 0 0 4px rgba(255,165,82,0.2)"
                      : "none",
                  }}
                />

                <div className="flex-1">
                  <h3
                    className={`font-semibold ${
                      step.isCurrent ? "text-xl md:text-2xl" : "text-lg md:text-xl"
                    }`}
                    style={{ color: "var(--text)" }}
                  >
                    {step.status}
                  </h3>
                  <div className="mt-1 flex items-center gap-2">
                    <span
                      className="text-sm font-medium"
                      style={{ color: "var(--text-muted)" }}
                    >
                      {step.time}
                    </span>
                    {step.desc && (
                      <>
                        <span style={{ color: "var(--border)" }}>•</span>
                        <span
                          className="text-sm font-medium"
                          style={{ color: "var(--text-secondary)" }}
                        >
                          {step.desc}
                        </span>
                      </>
                    )}
                  </div>

                  {/* Detail block */}
                  {step.detail && (
                    <div
                      className="mt-4 rounded border p-3 text-xs font-mono leading-relaxed"
                      style={{
                        background: "var(--elevated)",
                        borderColor: "var(--border)",
                        color: step.isCurrent ? "var(--text)" : "var(--text-secondary)",
                        whiteSpace: "pre-line",
                      }}
                    >
                      {step.isCurrent && (
                        <span
                          className="material-symbols-outlined mr-2 align-middle text-sm"
                          style={{ color: "var(--sage)" }}
                        >
                          check_circle
                        </span>
                      )}
                      {step.detail}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Recent Activity */}
          <div
            className="border-t pt-8"
            style={{ borderColor: "var(--border-subtle)" }}
          >
            <h3
              className="mb-4 border-b pb-2 text-xs font-semibold uppercase tracking-widest"
              style={{
                color: "var(--text-secondary)",
                borderColor: "var(--border-subtle)",
              }}
            >
              Recent Activity
            </h3>
            <ul className="space-y-3">
              {[
                { time: "08:22 AM", text: "Crew moving at 30km/h on Main St.", active: true },
                { time: "08:18 AM", text: "GPS signal verified for Vehicle #42.", active: true },
                { time: "08:16 AM", text: "Dispatch notification acknowledged by Crew.", active: false },
              ].map((item, i) => (
                <li key={i} className="flex items-center gap-3 text-sm">
                  <span
                    className="h-1.5 w-1.5 shrink-0 rounded-full"
                    style={{
                      background: item.active ? "var(--sage)" : "var(--border)",
                    }}
                  />
                  <span
                    className="w-16 font-mono text-xs"
                    style={{ color: "var(--text-muted)" }}
                  >
                    {item.time}
                  </span>
                  <span style={{ color: "var(--text-secondary)" }}>{item.text}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* ─── Sidebar ────────────────────────────────────── */}
        <aside className="w-full lg:w-1/3">
          <div
            className="dark-card sticky top-24 flex flex-col gap-8 p-6"
            style={{ background: "var(--card)" }}
          >
            {/* SLA Timer */}
            <div>
              <h3
                className="mb-4 flex items-center justify-between border-b pb-2 text-xs font-semibold uppercase tracking-widest"
                style={{
                  color: "var(--text-secondary)",
                  borderColor: "var(--border-subtle)",
                }}
              >
                SLA Target
                <span
                  className="material-symbols-outlined text-lg"
                  style={{ color: "var(--text-muted)" }}
                >
                  timer
                </span>
              </h3>
              <div className="flex gap-4 text-center">
                {[
                  { val: "23", label: "Hours" },
                  { val: "45", label: "Mins" },
                ].map(({ val, label }) => (
                  <div
                    key={label}
                    className="flex-1 rounded-md border p-4"
                    style={{
                      background: "var(--elevated)",
                      borderColor: "var(--border-subtle)",
                    }}
                  >
                    <div
                      className="font-mono text-4xl font-medium tracking-tight md:text-5xl"
                      style={{ color: "var(--amber)" }}
                    >
                      {val}
                    </div>
                    <div
                      className="mt-1 text-[10px] font-semibold uppercase tracking-wider"
                      style={{ color: "var(--text-muted)" }}
                    >
                      {label}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Live Location */}
            <div>
              <h3
                className="mb-3 border-b pb-2 text-xs font-semibold uppercase tracking-widest"
                style={{
                  color: "var(--text-secondary)",
                  borderColor: "var(--border-subtle)",
                }}
              >
                Live Location
              </h3>
              <div
                className="relative flex h-48 items-center justify-center overflow-hidden rounded-md border"
                style={{
                  background: "var(--elevated)",
                  borderColor: "var(--border)",
                }}
              >
                {/* Dot grid */}
                <div
                  className="absolute inset-0 opacity-10"
                  style={{
                    backgroundImage:
                      "radial-gradient(var(--amber) 1px, transparent 1px)",
                    backgroundSize: "16px 16px",
                  }}
                />
                {/* Bouncing pin */}
                <div
                  className="relative z-10 animate-bounce"
                  style={{ color: "var(--amber)" }}
                >
                  <span
                    className="material-symbols-outlined text-4xl"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    location_on
                  </span>
                  <div
                    className="absolute -bottom-1 left-1/2 h-1 w-3 -translate-x-1/2 rounded-full blur-[2px]"
                    style={{ background: "rgba(255,165,82,0.3)" }}
                  />
                </div>
                {/* Sector label */}
                <div
                  className="absolute bottom-3 left-3 z-10 rounded border px-2 py-1 text-[10px] font-semibold uppercase tracking-wider"
                  style={{
                    background: "rgba(26,17,24,0.9)",
                    borderColor: "var(--border)",
                    color: "var(--amber)",
                  }}
                >
                  Sector 42
                </div>
              </div>
            </div>

            {/* System Health */}
            <div>
              <h3
                className="mb-3 border-b pb-2 text-xs font-semibold uppercase tracking-widest"
                style={{
                  color: "var(--text-secondary)",
                  borderColor: "var(--border-subtle)",
                }}
              >
                System Health
              </h3>
              <div
                className="flex items-center justify-between rounded-md border p-4"
                style={{
                  background: "var(--elevated)",
                  borderColor: "var(--border-subtle)",
                }}
              >
                <div className="flex items-center gap-3">
                  <span
                    className="material-symbols-outlined"
                    style={{ color: "var(--sage)" }}
                  >
                    analytics
                  </span>
                  <span
                    className="text-sm font-semibold"
                    style={{ color: "var(--text)" }}
                  >
                    Routing Precision
                  </span>
                </div>
                <span
                  className="font-mono text-lg font-bold"
                  style={{ color: "var(--sage)" }}
                >
                  98.4%
                </span>
              </div>
            </div>

            {/* Field Officer */}
            <div
              className="flex items-center gap-4 rounded-md border p-4"
              style={{
                background: "var(--elevated)",
                borderColor: "var(--border)",
              }}
            >
              <div
                className="flex h-12 w-12 shrink-0 items-center justify-center rounded border"
                style={{
                  background: "var(--card)",
                  borderColor: "var(--border-subtle)",
                }}
              >
                <span
                  className="material-symbols-outlined text-2xl"
                  style={{
                    color: "var(--amber)",
                    fontVariationSettings: "'FILL' 1",
                  }}
                >
                  badge
                </span>
              </div>
              <div className="overflow-hidden">
                <div
                  className="text-[10px] font-semibold uppercase tracking-wider"
                  style={{ color: "var(--text-muted)" }}
                >
                  Field Officer
                </div>
                <div
                  className="truncate text-lg font-semibold"
                  style={{ color: "var(--text)" }}
                >
                  R. Sharma
                </div>
              </div>
            </div>

            {/* Contact button */}
            <button
              className="flex w-full items-center justify-center gap-2 rounded-md border py-3 text-sm font-semibold transition-colors hover:border-amber/30"
              style={{
                background: "transparent",
                borderColor: "var(--border)",
                color: "var(--text-secondary)",
              }}
            >
              <span className="material-symbols-outlined text-sm">support_agent</span>
              Contact Support
            </button>
          </div>
        </aside>
      </div>
    </main>
  );
}
