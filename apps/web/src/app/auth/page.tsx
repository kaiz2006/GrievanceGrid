"use client";

import { useState } from "react";

export default function AuthPage() {
  const [tab, setTab] = useState<"login" | "signup">("login");

  return (
    <main
      className="flex min-h-screen flex-col items-center justify-center overflow-x-hidden p-4 font-display antialiased"
      style={{
        background:
          "radial-gradient(ellipse at 50% 0%, rgba(56,29,42,0.35) 0%, #0f0a0d 60%)",
        color: "var(--text)",
      }}
    >
      {/* Top announcement bar */}
      <div
        className="fixed left-0 top-0 z-50 w-full border-b py-2.5"
        style={{
          background: "rgba(196,214,176,0.07)",
          borderColor: "rgba(196,214,176,0.15)",
        }}
      >
        <div
          className="flex items-center justify-center gap-8 text-xs font-medium uppercase tracking-wider"
          style={{ color: "var(--sage)" }}
        >
          <span>Secure Enterprise Gateway • System Active</span>
        </div>
      </div>

      <main className="relative mt-16 mb-8 w-full max-w-[460px]">
        {/* Card */}
        <div
          className="relative flex flex-col items-center overflow-hidden rounded-md border p-8 shadow-dark md:p-10"
          style={{
            background: "var(--card)",
            borderColor: "var(--border)",
          }}
        >
          {/* Subtle glow at top */}
          <div
            className="pointer-events-none absolute left-1/2 top-0 h-32 w-48 -translate-x-1/2 rounded-full blur-3xl"
            style={{ background: "rgba(255,165,82,0.08)" }}
          />

          {/* Icon + header */}
          <div className="relative mb-6 flex flex-col items-center">
            <div
              className="mb-3 flex h-10 w-10 items-center justify-center rounded-full border"
              style={{
                background: "var(--elevated)",
                borderColor: "var(--border)",
              }}
            >
              <span
                className="material-symbols-outlined text-2xl"
                style={{ color: "var(--amber)" }}
              >
                shield_lock
              </span>
            </div>
            <h2
              className="mb-1 text-center text-xl font-semibold tracking-tight"
              style={{ color: "var(--text)" }}
            >
              Enterprise Portal
            </h2>
            <p
              className="text-center text-xs tracking-wide"
              style={{ color: "var(--text-muted)" }}
            >
              GrievanceGrid Redressal System
            </p>
          </div>

          {/* Tabs */}
          <div
            className="mb-6 flex w-full border-b"
            style={{ borderColor: "var(--border-subtle)" }}
          >
            {(["login", "signup"] as const).map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className="flex-1 pb-3 text-sm font-semibold uppercase tracking-wide transition-colors"
                style={{
                  color: tab === t ? "var(--amber)" : "var(--text-muted)",
                  borderBottom:
                    tab === t
                      ? "2px solid var(--amber)"
                      : "2px solid transparent",
                }}
              >
                {t}
              </button>
            ))}
          </div>

          {/* Google OAuth */}
          <button
            className="mb-6 flex w-full items-center justify-center gap-3 rounded-md border py-3 text-sm font-medium transition-all hover:border-amber/30"
            style={{
              background: "var(--elevated)",
              borderColor: "var(--border)",
              color: "var(--text)",
            }}
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24">
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                fill="#EA4335"
              />
            </svg>
            Continue with Google
          </button>

          {/* Divider */}
          <div className="mb-6 flex w-full items-center">
            <div
              className="flex-1 border-t"
              style={{ borderColor: "var(--border-subtle)" }}
            />
            <span
              className="px-3 text-[10px] font-semibold uppercase tracking-widest"
              style={{ color: "var(--text-muted)" }}
            >
              OR
            </span>
            <div
              className="flex-1 border-t"
              style={{ borderColor: "var(--border-subtle)" }}
            />
          </div>

          {/* Login form */}
          {tab === "login" && (
            <form className="flex w-full flex-col gap-4">
              <div>
                <label
                  className="mb-1.5 block text-[10px] font-semibold uppercase tracking-wider"
                  style={{ color: "var(--text-muted)" }}
                >
                  Email Address
                </label>
                <input
                  className="w-full rounded-md border px-4 py-2.5 text-sm transition-all focus:outline-none focus:ring-1"
                  style={{
                    background: "var(--elevated)",
                    borderColor: "var(--border)",
                    color: "var(--text)",
                  }}
                  placeholder="Enter your email"
                  type="email"
                />
              </div>
              <div>
                <label
                  className="mb-1.5 block text-[10px] font-semibold uppercase tracking-wider"
                  style={{ color: "var(--text-muted)" }}
                >
                  Password
                </label>
                <input
                  className="w-full rounded-md border px-4 py-2.5 text-sm transition-all focus:outline-none focus:ring-1"
                  style={{
                    background: "var(--elevated)",
                    borderColor: "var(--border)",
                    color: "var(--text)",
                  }}
                  placeholder="Enter your password"
                  type="password"
                />
              </div>
              <div className="flex justify-end">
                <a
                  href="#"
                  className="text-xs font-medium transition-colors hover:text-white"
                  style={{ color: "var(--amber)" }}
                >
                  Forgot password?
                </a>
              </div>
              <button
                className="mt-2 w-full rounded-md py-3 text-sm font-semibold tracking-wide transition-all hover:opacity-90"
                style={{ background: "var(--amber)", color: "#1a0f0a" }}
                type="submit"
              >
                SIGN IN
              </button>
            </form>
          )}

          {/* Signup form */}
          {tab === "signup" && (
            <form className="flex w-full flex-col gap-4">
              <div>
                <label
                  className="mb-1.5 block text-[10px] font-semibold uppercase tracking-wider"
                  style={{ color: "var(--text-muted)" }}
                >
                  Full Name
                </label>
                <input
                  className="w-full rounded-md border px-4 py-2.5 text-sm transition-all focus:outline-none"
                  style={{
                    background: "var(--elevated)",
                    borderColor: "var(--border)",
                    color: "var(--text)",
                  }}
                  placeholder="John Doe"
                  type="text"
                />
              </div>
              <div>
                <label
                  className="mb-1.5 block text-[10px] font-semibold uppercase tracking-wider"
                  style={{ color: "var(--text-muted)" }}
                >
                  Email Address
                </label>
                <input
                  className="w-full rounded-md border px-4 py-2.5 text-sm transition-all focus:outline-none"
                  style={{
                    background: "var(--elevated)",
                    borderColor: "var(--border)",
                    color: "var(--text)",
                  }}
                  placeholder="Enter your email"
                  type="email"
                />
              </div>
              <div>
                <label
                  className="mb-1.5 block text-[10px] font-semibold uppercase tracking-wider"
                  style={{ color: "var(--text-muted)" }}
                >
                  Password
                </label>
                <input
                  className="w-full rounded-md border px-4 py-2.5 text-sm transition-all focus:outline-none"
                  style={{
                    background: "var(--elevated)",
                    borderColor: "var(--border)",
                    color: "var(--text)",
                  }}
                  placeholder="Create a password"
                  type="password"
                />
              </div>
              <button
                className="mt-3 w-full rounded-md py-3 text-sm font-semibold tracking-wide transition-all hover:opacity-90"
                style={{ background: "var(--amber)", color: "#1a0f0a" }}
                type="submit"
              >
                CREATE ACCOUNT
              </button>
            </form>
          )}

          {/* Footer note */}
          <div
            className="mt-8 w-full border-t pt-6 text-center"
            style={{ borderColor: "var(--border-subtle)" }}
          >
            <p
              className="text-xs font-normal leading-relaxed"
              style={{ color: "var(--text-muted)" }}
            >
              Registering as a{" "}
              <span
                className="px-1 font-semibold"
                style={{ color: "var(--amber)" }}
              >
                CITIZEN
              </span>{" "}
              by default. <br />
              Full transparency starts here.
            </p>
          </div>
        </div>

        {/* Bottom chips */}
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          {["Public Redressal Active", "Est. 2024", "AI Moderated"].map(
            (chip) => (
              <div
                key={chip}
                className="rounded-full border px-4 py-1.5 text-[10px] font-medium uppercase tracking-wider"
                style={{
                  background: "var(--card)",
                  borderColor: "var(--border)",
                  color: "var(--text-muted)",
                }}
              >
                {chip}
              </div>
            )
          )}
        </div>
      </main>

      {/* Footer */}
      <footer
        className="mt-auto w-full max-w-3xl py-8 flex flex-col items-center justify-between gap-4 text-[10px] font-medium uppercase tracking-widest md:flex-row"
        style={{ color: "var(--text-muted)" }}
      >
        <div className="flex gap-6">
          {["Privacy Policy", "Terms of Redressal", "API Status"].map((link) => (
            <a
              key={link}
              href="#"
              className="transition-colors hover:text-white"
            >
              {link}
            </a>
          ))}
        </div>
        <div>© GrievanceGrid Systems v2.0</div>
      </footer>
    </main>
  );
}
