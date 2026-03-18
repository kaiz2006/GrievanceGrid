import Navigation from "../../components/Navigation";
import Link from "next/link";

export default function CitizenPortalPage() {
  return (
    <main className="min-h-screen font-display antialiased" style={{ background: "var(--background)", color: "var(--text)" }}>
      {/* Top logo bar */}
      <div className="flex items-center justify-between border-b px-8 py-4"
        style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
        <div className="flex items-center gap-4">
          <span className="material-symbols-outlined text-2xl" style={{ color: "var(--amber)" }}>grid_view</span>
          <h1 className="text-xl font-semibold" style={{ color: "var(--text)" }}>GrievanceGrid</h1>
        </div>
        <div className="hidden md:flex items-center gap-8 text-sm font-semibold" style={{ color: "var(--text-muted)" }}>
          <span className="italic" style={{ color: "var(--amber)" }}>तमसो मा ज्योतिर्गमय</span>
          {["Dashboard", "My Tickets", "Reports"].map((l) => (
            <a key={l} href="#" className="transition-colors hover:text-white">{l}</a>
          ))}
        </div>
      </div>

      {/* Search header */}
      <header className="flex flex-col items-center justify-between gap-6 border-b px-8 py-6 md:flex-row"
        style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
        <div className="flex w-full flex-1 items-center rounded-md border px-4 py-2.5"
          style={{ background: "var(--card)", borderColor: "var(--border)" }}>
          <span className="material-symbols-outlined mr-3 text-lg" style={{ color: "var(--text-muted)" }}>search</span>
          <input className="flex-1 bg-transparent text-sm focus:outline-none"
            style={{ color: "var(--text)" }} placeholder="Search tickets..." />
        </div>
        <div className="flex items-center gap-4">
          <button className="rounded-md border px-5 py-2 text-sm font-medium transition-colors hover:border-amber/30"
            style={{ background: "transparent", borderColor: "var(--border)", color: "var(--text-secondary)" }}>Profile</button>
          <div className="flex h-10 w-10 items-center justify-center rounded-md border"
            style={{ background: "var(--card)", borderColor: "var(--border)" }}>
            <span className="material-symbols-outlined" style={{ color: "var(--text-muted)" }}>person</span>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-4xl px-8 py-10 space-y-8">
        {/* Stat cards */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div className="flex flex-col justify-between rounded-md border p-8"
            style={{ background: "var(--card)", borderColor: "var(--border)" }}>
            <div className="mb-6 flex items-start justify-between">
              <p className="text-lg" style={{ color: "var(--text-secondary)" }}>Active</p>
              <span className="material-symbols-outlined text-2xl" style={{ color: "var(--text-muted)" }}>pending_actions</span>
            </div>
            <p className="mb-4 text-6xl font-semibold" style={{ color: "var(--amber)" }}>3</p>
            <div className="flex items-center gap-2 text-sm" style={{ color: "var(--text-muted)" }}>
              <span className="material-symbols-outlined text-base">trending_flat</span>
              <span>No change this week</span>
            </div>
          </div>
          <div className="flex flex-col justify-between rounded-md border p-8"
            style={{ background: "rgba(196,214,176,0.08)", borderColor: "rgba(196,214,176,0.25)" }}>
            <div className="mb-6 flex items-start justify-between">
              <p className="text-lg" style={{ color: "var(--sage)" }}>Resolved</p>
              <span className="material-symbols-outlined text-2xl" style={{ color: "var(--sage)" }}>task_alt</span>
            </div>
            <p className="mb-4 text-6xl font-semibold" style={{ color: "var(--sage)" }}>12</p>
            <div className="flex items-center gap-2 text-sm" style={{ color: "var(--sage)" }}>
              <span className="material-symbols-outlined text-base">trending_up</span>
              <span>+5% from last month</span>
            </div>
          </div>
        </div>

        {/* Alert banner */}
        <div className="rounded-md border p-6" style={{ background: "rgba(255,87,51,0.07)", borderColor: "rgba(255,87,51,0.2)" }}>
          <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
            <div className="flex items-center gap-4">
              <span className="material-symbols-outlined text-3xl" style={{ color: "#ff5733" }}>warning</span>
              <div>
                <p className="text-sm font-semibold uppercase mb-1" style={{ color: "#ff5733" }}>Immediate Action</p>
                <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
                  You have contested tickets that require your review immediately.
                </p>
              </div>
            </div>
            <button className="shrink-0 rounded-md border px-5 py-2 text-sm font-semibold transition-colors hover:opacity-90"
              style={{ background: "rgba(255,87,51,0.1)", borderColor: "rgba(255,87,51,0.3)", color: "#ff5733" }}>
              View Tickets
            </button>
          </div>
        </div>

        {/* CTA */}
        <div className="flex justify-center">
          <Link href="/submit" className="flex items-center gap-3 rounded-md px-8 py-4 text-xl font-semibold shadow-xl transition-all hover:opacity-90"
            style={{ background: "var(--amber)", color: "#1a0f0a" }}>
            <span className="material-symbols-outlined text-2xl">add_circle</span>New Complaint
          </Link>
        </div>

        {/* Recent Activity */}
        <div className="space-y-4">
          <h2 className="text-xl" style={{ color: "var(--text)" }}>Recent Activity</h2>
          <div className="space-y-4">
            {[
              { id: "#42", title: "Street Light Outage — Sector 7", time: "Filed 2 hours ago", status: "Processing", resolved: false },
              { id: "#39", title: "Water Supply Contamination", time: "Resolved yesterday", status: "Completed", resolved: true },
            ].map((item) => (
              <div key={item.id} className="flex flex-col items-start justify-between gap-4 rounded-md border p-4 md:flex-row md:items-center"
                style={{ background: "var(--card)", borderColor: "var(--border)" }}>
                <div className="flex items-center gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-md border text-sm font-medium"
                    style={{
                      background: item.resolved ? "rgba(196,214,176,0.1)" : "var(--elevated)",
                      borderColor: item.resolved ? "rgba(196,214,176,0.25)" : "var(--border-subtle)",
                      color: item.resolved ? "var(--sage)" : "var(--text-muted)",
                    }}>
                    {item.id}
                  </div>
                  <div>
                    <p style={{ color: "var(--text)" }}>{item.title}</p>
                    <p className="text-sm font-normal" style={{ color: "var(--text-muted)" }}>{item.time}</p>
                  </div>
                </div>
                <span className="rounded-md border px-3 py-1 text-xs font-medium"
                  style={{
                    background: item.resolved ? "rgba(196,214,176,0.1)" : "var(--elevated)",
                    borderColor: item.resolved ? "rgba(196,214,176,0.25)" : "var(--border-subtle)",
                    color: item.resolved ? "var(--sage)" : "var(--text-muted)",
                  }}>
                  {item.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <footer className="mt-8 flex flex-col items-center justify-between gap-4 border-t px-8 py-8 text-sm md:flex-row"
        style={{ background: "var(--surface)", borderColor: "var(--border)", color: "var(--text-muted)" }}>
        <p>© 2024 GrievanceGrid System</p>
        <div className="flex gap-6">
          {["Privacy Policy", "Terms of Use", "Contact Admin"].map((l) => (
            <a key={l} href="#" className="transition-colors hover:text-white">{l}</a>
          ))}
        </div>
      </footer>
    </main>
  );
}
