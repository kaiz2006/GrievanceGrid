"use client";

import { useState } from "react";
import Link from "next/link";

export default function Navigation() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav
      className="sticky top-0 z-50 border-b px-6 py-4 backdrop-blur-md"
      style={{
        background: "rgba(13, 8, 11, 0.85)",
        borderColor: "var(--border-subtle)",
      }}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-8">
          <Link href="/" className="group flex cursor-pointer items-center gap-3">
            <div
              className="flex items-center justify-center rounded-md p-2 transition-all group-hover:bg-amber/20"
              style={{ background: "rgba(255,165,82,0.1)" }}
            >
              <span
                className="material-symbols-outlined font-semibold"
                style={{ color: "var(--amber)" }}
              >
                grid_view
              </span>
            </div>
            <h1
              className="text-xl font-bold tracking-tight"
              style={{ color: "var(--text)" }}
            >
              GrievanceGrid
            </h1>
          </Link>

          <div className="hidden items-center gap-8 text-sm font-semibold md:flex">
            <Link
              href="#"
              className="transition-colors hover:text-white"
              style={{ color: "var(--text-secondary)" }}
            >
              Solutions
            </Link>
            <Link
              href="#"
              className="transition-colors hover:text-white"
              style={{ color: "var(--text-secondary)" }}
            >
              Impact
            </Link>
            <Link
              href="#"
              className="transition-colors hover:text-white"
              style={{ color: "var(--text-secondary)" }}
            >
              Transparency
            </Link>
          </div>
        </div>

        {/* Right side */}
        <div className="flex items-center gap-4">
          {/* Search bar */}
          <div
            className="hidden items-center gap-2 rounded-md border px-3 py-1.5 transition-colors focus-within:border-amber/40 lg:flex"
            style={{
              background: "var(--surface)",
              borderColor: "var(--border)",
            }}
          >
            <span
              className="material-symbols-outlined text-sm"
              style={{ color: "var(--text-muted)" }}
            >
              search
            </span>
            <input
              className="w-48 border-none bg-transparent text-sm font-medium focus:outline-none focus:ring-0"
              style={{
                color: "var(--text)",
              }}
              placeholder="Track Grievance ID..."
              type="text"
            />
          </div>

          <Link
            href="/auth"
            className="dark-btn rounded-md px-5 py-2 text-sm font-semibold hover:bg-amber/90 transition-all flex items-center justify-center"
            style={{ background: "var(--amber)", color: "#0d080b" }}
          >
            Login
          </Link>
        </div>
      </div>
    </nav>
  );
}