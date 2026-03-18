"use client";

import { useState } from "react";
import Navigation from "../../components/Navigation";

export default function SubmitGrievancePage() {
  const [isRecording, setIsRecording] = useState(false);

  const waveHeights = [0.2, 0.5, 0.8, 1, 0.6, 0.3, 0.4, 0.7, 0.5, 0.9, 0.3];

  return (
    <main
      className="min-h-screen font-display antialiased"
      style={{ background: "var(--background)", color: "var(--text)" }}
    >
      <Navigation />

      <div className="mx-auto flex max-w-4xl flex-col gap-12 px-6 py-12">
        {/* Page header */}
        <div
          className="flex flex-col gap-2 border-b pb-8"
          style={{ borderColor: "var(--border-subtle)" }}
        >
          <h1
            className="text-4xl font-bold tracking-tight"
            style={{ color: "var(--text)" }}
          >
            Report a Grievance
          </h1>
          <p className="text-lg font-medium" style={{ color: "var(--text-secondary)" }}>
            Multimodal Submission Form
          </p>
        </div>

        {/* ─── Section 1: Voice Recording ─────────────────── */}
        <section
          className="flex flex-col gap-6 rounded-md border p-8 transition-all"
          style={{
            background: "var(--surface)",
            borderColor: "var(--border-subtle)",
          }}
        >
          <h2
            className="text-2xl font-bold tracking-tight"
            style={{ color: "var(--text)" }}
          >
            Section 1: Voice Recording
          </h2>
          <div
            className="flex flex-col items-center gap-8 rounded-md border p-6 md:flex-row"
            style={{ background: "var(--card)", borderColor: "var(--border)" }}
          >
            {/* Mic button */}
            <button
              onClick={() => setIsRecording(!isRecording)}
              className={`flex h-20 w-20 shrink-0 items-center justify-center rounded-md text-white shadow-md transition-all duration-300 ${
                isRecording ? "animate-pulse" : ""
              }`}
              style={{
                background: isRecording
                  ? "#b91c1c"
                  : "var(--amber)",
                boxShadow: isRecording
                  ? "0 0 20px rgba(185,28,28,0.4)"
                  : "0 0 20px rgba(255,165,82,0.25)",
                color: "#1a0f0a",
              }}
            >
              <span className="material-symbols-outlined text-4xl">mic</span>
            </button>

            {/* Waveform area */}
            <div className="flex w-full flex-1 flex-col gap-3">
              <div
                className="flex h-20 items-center justify-center overflow-hidden rounded border p-2"
                style={{
                  background: "var(--elevated)",
                  borderColor: "var(--border-subtle)",
                }}
              >
                <div className="flex h-full w-full items-center justify-center gap-1.5">
                  {waveHeights.map((h, i) => (
                    <div
                      key={i}
                      className={`w-1.5 rounded-full transition-all duration-300 ${
                        isRecording ? "animate-bounce" : ""
                      }`}
                      style={{
                        height: `${h * 100}%`,
                        background: isRecording
                          ? "var(--amber)"
                          : "rgba(255,165,82,0.4)",
                        animationDelay: `${i * 0.1}s`,
                      }}
                    />
                  ))}
                </div>
              </div>
              <div
                className="flex justify-between text-xs font-bold uppercase tracking-widest"
                style={{ color: "var(--text-muted)" }}
              >
                <span>00:00</span>
                <span>MAX: 03:00</span>
              </div>
            </div>
          </div>
        </section>

        {/* ─── Section 2: Image Evidence ───────────────────── */}
        <section
          className="flex flex-col gap-6 rounded-md border p-8"
          style={{
            background: "var(--surface)",
            borderColor: "var(--border-subtle)",
          }}
        >
          <h2
            className="text-2xl font-bold tracking-tight"
            style={{ color: "var(--text)" }}
          >
            Section 2: Image Evidence
          </h2>
          <div
            className="group flex min-h-[250px] w-full cursor-pointer flex-col items-center justify-center gap-4 rounded-md border-2 border-dashed p-8 transition-all"
            style={{
              background: "var(--card)",
              borderColor: "rgba(255,165,82,0.3)",
            }}
          >
            <div
              className="rounded-full p-4 transition-transform duration-300 group-hover:scale-110"
              style={{ background: "rgba(255,165,82,0.1)" }}
            >
              <span
                className="material-symbols-outlined text-4xl"
                style={{ color: "var(--amber)" }}
              >
                cloud_upload
              </span>
            </div>
            <div className="text-center">
              <p
                className="mb-1 text-xl font-bold"
                style={{ color: "var(--text)" }}
              >
                Upload Before Photo
              </p>
              <p
                className="text-sm font-bold uppercase tracking-widest"
                style={{ color: "var(--text-muted)" }}
              >
                Drag and Drop or Click to Browse
              </p>
            </div>
            <div
              className="flex items-center gap-2 text-xs font-semibold"
              style={{ color: "var(--text-muted)" }}
            >
              <span className="material-symbols-outlined text-base">image</span>
              JPG, PNG, WEBP supported
            </div>
          </div>
        </section>

        {/* ─── Section 3: Text Description ────────────────── */}
        <section
          className="relative flex flex-col gap-6 rounded-md border p-8"
          style={{
            background: "var(--surface)",
            borderColor: "var(--border-subtle)",
          }}
        >
          <h2
            className="text-2xl font-bold tracking-tight"
            style={{ color: "var(--text)" }}
          >
            Section 3: Text Description
          </h2>
          <div className="relative">
            <textarea
              className="min-h-[200px] w-full rounded-md border-2 p-5 text-base font-medium transition-all focus:outline-none focus:ring-2"
              style={{
                background: "var(--card)",
                borderColor: "rgba(255,165,82,0.2)",
                color: "var(--text)",
              }}
              placeholder="Describe the issue in detail..."
            />
            {/* AI suggestion tooltip */}
            <div
              className="absolute -right-4 -top-6 z-10 hidden w-64 flex-col gap-2 rounded-md border p-4 backdrop-blur-md md:flex"
              style={{
                background: "rgba(255,165,82,0.1)",
                borderColor: "rgba(255,165,82,0.25)",
                color: "var(--amber)",
              }}
            >
              <div
                className="flex items-center gap-2 border-b pb-2"
                style={{ borderColor: "rgba(255,165,82,0.2)" }}
              >
                <span className="material-symbols-outlined text-sm">smart_toy</span>
                <span className="text-xs font-bold uppercase tracking-widest">
                  AI Suggestion
                </span>
              </div>
              <p className="text-xs font-bold leading-relaxed" style={{ color: "var(--text)" }}>
                Include specific dates, times, and exact locations for 40%
                faster resolution.
              </p>
            </div>
          </div>
        </section>

        {/* ─── Section 4: Location Details ────────────────── */}
        <section
          className="flex flex-col gap-6 rounded-md border p-8"
          style={{
            background: "var(--surface)",
            borderColor: "var(--border-subtle)",
          }}
        >
          <h2
            className="text-2xl font-bold tracking-tight"
            style={{ color: "var(--text)" }}
          >
            Section 4: Location Details
          </h2>
          <div
            className="grid grid-cols-1 gap-8 rounded-md border p-6 md:grid-cols-2"
            style={{ background: "var(--card)", borderColor: "var(--border)" }}
          >
            <div className="flex flex-col justify-center gap-6">
              <p
                className="text-sm font-bold uppercase tracking-widest"
                style={{ color: "var(--text-secondary)" }}
              >
                Pinpoint the exact location for our rapid response field agents.
              </p>
              <button
                className="flex w-full items-center justify-center gap-3 rounded-md px-4 py-4 text-sm font-bold shadow-md transition-all hover:opacity-90 active:scale-[0.98]"
                style={{ background: "var(--amber)", color: "#1a0f0a" }}
              >
                <span className="material-symbols-outlined text-xl">my_location</span>
                Auto-Detect Location
              </button>
            </div>

            {/* Map placeholder */}
            <div
              className="group relative aspect-square overflow-hidden rounded-md border"
              style={{
                background: "var(--elevated)",
                borderColor: "rgba(255,165,82,0.15)",
              }}
            >
              {/* Grid lines */}
              <div
                className="absolute inset-0 opacity-20"
                style={{
                  backgroundImage:
                    "linear-gradient(rgba(255,165,82,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(255,165,82,0.3) 1px, transparent 1px)",
                  backgroundSize: "10% 10%",
                }}
              />
              {/* Center pin */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div
                  className="flex h-12 w-12 animate-pulse items-center justify-center rounded-full border"
                  style={{
                    background: "rgba(255,165,82,0.15)",
                    borderColor: "rgba(255,165,82,0.3)",
                  }}
                >
                  <div
                    className="h-3 w-3 rounded-full"
                    style={{ background: "var(--amber)" }}
                  />
                </div>
              </div>
              {/* Label */}
              <div
                className="absolute left-4 right-4 top-4 rounded-sm border px-3 py-2 text-[10px] font-bold uppercase tracking-widest backdrop-blur-md"
                style={{
                  background: "rgba(26,17,24,0.85)",
                  borderColor: "var(--border)",
                  color: "var(--text-muted)",
                }}
              >
                Live Coordinate Tracking...
              </div>
            </div>
          </div>
        </section>

        {/* ─── Submit Button ───────────────────────────────── */}
        <div
          className="mt-8 flex justify-center border-t pt-8"
          style={{ borderColor: "var(--border-subtle)" }}
        >
          <button
            className="group flex w-full items-center justify-center gap-4 rounded-md px-8 py-5 text-xl font-bold shadow-xl transition-all hover:opacity-95 active:scale-[0.98] md:w-auto md:min-w-[400px]"
            style={{ background: "var(--amber)", color: "#1a0f0a" }}
          >
            SUBMIT TO GRID
            <span
              className="material-symbols-outlined h-6 w-6 transition-transform group-hover:translate-x-1"
              style={{ color: "rgba(26,15,10,0.7)" }}
            >
              send
            </span>
          </button>
        </div>
      </div>

      {/* Footer */}
      <footer
        className="mt-12 border-t px-6 py-12"
        style={{
          background: "var(--surface)",
          borderColor: "var(--border-subtle)",
        }}
      >
        <div
          className="mx-auto flex max-w-4xl flex-col items-center justify-between gap-6 text-[10px] font-bold uppercase tracking-widest md:flex-row"
          style={{ color: "var(--text-muted)" }}
        >
          <div className="flex gap-8">
            <span className="flex items-center gap-2">
              <span
                className="material-symbols-outlined text-xs"
                style={{ color: "var(--sage)" }}
              >
                check_circle
              </span>
              SSL Secured
            </span>
            <span className="flex items-center gap-2">
              <span
                className="material-symbols-outlined text-xs"
                style={{ color: "var(--amber)" }}
              >
                timer
              </span>
              30s Intake
            </span>
          </div>
          <p>© 2024 GRIEVANCEGRID SYSTEM</p>
          <span className="flex items-center gap-2">
            <span
              className="material-symbols-outlined text-xs"
              style={{ color: "var(--amber)" }}
            >
              smart_toy
            </span>
            AI triage enabled
          </span>
        </div>
      </footer>
    </main>
  );
}
