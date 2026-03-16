"use client";

import CardNav, { CardNavItem } from "./CardNav";
import { useAuth } from "../lib/auth-context";

const navItems: CardNavItem[] = [
  {
    label: "Smart Routing",
    bgColor: "#1e4d8c",   // Light cobalt blue
    textColor: "#f0f8ff",
    links: [
      { label: "AI Categorisation", href: "#features", ariaLabel: "AI Categorisation Features" },
      { label: "Priority Tagging", href: "#features", ariaLabel: "Priority Tagging" },
      { label: "Dept. Assignment", href: "#features", ariaLabel: "Department Assignment" },
      { label: "Keyword Engine", href: "#features", ariaLabel: "Keyword Engine" },
    ],
  },
  {
    label: "Command Center",
    bgColor: "#1a6fa8",   // Sky / cerulean blue
    textColor: "#f0f8ff",
    links: [
      { label: "Live Dashboard", href: "#features", ariaLabel: "Live Dashboard" },
      { label: "SLA Engine", href: "#features", ariaLabel: "SLA Engine" },
      { label: "Escalation Alerts", href: "#features", ariaLabel: "Escalation Alerts" },
      { label: "Geo Heatmaps", href: "#features", ariaLabel: "Geo Heatmaps" },
    ],
  },
  {
    label: "Citizen Portal",
    bgColor: "#1b5e8e",   // Muted steel blue
    textColor: "#f0f8ff",
    links: [
      { label: "Grievance Submission", href: "#how-it-works", ariaLabel: "Grievance Submission" },
      { label: "Real-Time Tracking", href: "#how-it-works", ariaLabel: "Real-Time Tracking" },
      { label: "Status Notifications", href: "#how-it-works", ariaLabel: "Status Notifications" },
      { label: "Feedback & Rating", href: "#how-it-works", ariaLabel: "Feedback and Rating" },
    ],
  },
];

export default function Navbar() {
  const { signIn } = useAuth();

  return (
    <CardNav
      logo="" // We bypassed this by building the logo markup directly into CardNav.tsx as requested by GrievanceGrid styling
      logoAlt="GrievanceGrid Logo"
      items={navItems}
      className="mix-blend-normal"
      baseColor="transparent"
      menuColor="#ffffff"
      buttonBgColor="#2563eb"
      buttonTextColor="#ffffff"
      ease="power3.out"
      onGetStarted={signIn}
    />
  );
}

