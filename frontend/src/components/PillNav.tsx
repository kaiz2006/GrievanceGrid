"use client";

import { useState, useRef, useEffect } from "react";
import { GoArrowUpRight } from "react-icons/go";
import { useAuth } from "../lib/auth-context";
import "./PillNav.css";

const NAV_LINKS = [
  { label: "Features",     href: "#features" },
  { label: "How It Works", href: "#how-it-works" },
  { label: "Stats",        href: "#stats" },
];

const PANEL_SECTIONS = [
  {
    label: "Smart Routing",
    accent: "#1e4d8c",
    links: [
      { label: "AI Categorisation", href: "#features" },
      { label: "Priority Tagging",  href: "#features" },
      { label: "Dept. Assignment",  href: "#features" },
      { label: "Keyword Engine",    href: "#features" },
    ],
  },
  {
    label: "Command Center",
    accent: "#1a6fa8",
    links: [
      { label: "Live Dashboard",    href: "#features" },
      { label: "SLA Engine",        href: "#features" },
      { label: "Escalation Alerts", href: "#features" },
      { label: "Geo Heatmaps",      href: "#features" },
    ],
  },
  {
    label: "Citizen Portal",
    accent: "#1b5e8e",
    links: [
      { label: "Grievance Submission",  href: "#how-it-works" },
      { label: "Real-Time Tracking",    href: "#how-it-works" },
      { label: "Status Notifications",  href: "#how-it-works" },
      { label: "Feedback & Rating",     href: "#how-it-works" },
    ],
  },
];

export default function PillNav() {
  const [ctaHovered, setCtaHovered] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [panelOpen,  setPanelOpen]  = useState(false);
  const [scrolled,   setScrolled]   = useState(false);
  const wrapperRef = useRef<HTMLElement>(null);
  const { signIn } = useAuth();

  // Close panel on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setPanelOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Opaque on scroll
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className={`pill-nav-wrapper${scrolled ? " pill-scrolled" : ""}`} ref={wrapperRef}>
      <nav className="pill-nav">

        {/* ── Brand wordmark ── */}
        <a href="#" className="pill-nav-brand" aria-label="GrievanceGrid Home">
          <span className="pill-brand-wordmark">GrievanceGrid</span>
        </a>

        {/* ── Center links ── */}
        <ul className="pill-nav-links" role="list">
          {NAV_LINKS.map((link) => (
            <li key={link.href}>
              <a href={link.href} className="pill-nav-link">{link.label}</a>
            </li>
          ))}
        </ul>

        {/* ── Panel toggle button ── */}
        <button
          className={`pill-panel-btn ${panelOpen ? "active" : ""}`}
          onClick={() => setPanelOpen((v) => !v)}
          aria-label={panelOpen ? "Close menu" : "Open menu"}
          aria-expanded={panelOpen}
        >
          <span className="pill-panel-btn-grid">
            {[...Array(6)].map((_, i) => <span key={i} className="pill-panel-dot" />)}
          </span>
          <span className="pill-panel-btn-label">{panelOpen ? "Close" : "Menu"}</span>
        </button>

        {/* ── CTA pill ── */}
        <button
          className="pill-nav-cta"
          onMouseEnter={() => setCtaHovered(true)}
          onMouseLeave={() => setCtaHovered(false)}
          onClick={signIn}
          aria-label="Get Started"
        >
          <span className={`pill-cta-text ${ctaHovered ? "hide" : "show"}`}>Get Started</span>
          <span className={`pill-cta-text pill-cta-hover ${ctaHovered ? "show" : "hide"}`}>
            Launch Now →
          </span>
        </button>

        {/* ── Mobile hamburger ── */}
        <button
          className={`pill-hamburger ${mobileOpen ? "open" : ""}`}
          onClick={() => setMobileOpen((v) => !v)}
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
        >
          <span /><span />
        </button>
      </nav>

      {/* ── Drop panel ── */}
      <div className={`pill-drop-panel ${panelOpen ? "open" : ""}`} aria-hidden={!panelOpen}>
        {PANEL_SECTIONS.map((section) => (
          <div
            key={section.label}
            className="pill-panel-card"
            style={{ "--card-accent": section.accent } as React.CSSProperties}
          >
            <div className="pill-panel-card-title">{section.label}</div>
            <div className="pill-panel-card-links">
              {section.links.map((lnk) => (
                <a
                  key={lnk.label}
                  href={lnk.href}
                  className="pill-panel-card-link"
                  onClick={() => setPanelOpen(false)}
                >
                  <GoArrowUpRight className="pill-panel-link-icon" aria-hidden />
                  {lnk.label}
                </a>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* ── Mobile dropdown ── */}
      <div className={`pill-mobile-menu ${mobileOpen ? "open" : ""}`}>
        {NAV_LINKS.map((link) => (
          <a
            key={link.href}
            href={link.href}
            className="pill-mobile-link"
            onClick={() => setMobileOpen(false)}
          >
            {link.label}
          </a>
        ))}
        <a href="#features" className="pill-mobile-cta" onClick={() => setMobileOpen(false)}>
          Get Started
        </a>
      </div>
    </header>
  );
}
