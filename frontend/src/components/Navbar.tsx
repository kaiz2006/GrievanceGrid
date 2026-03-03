"use client";

import CardNav from "./CardNav";

export default function Navbar() {
  const navItems = [
    {
      label: "Features",
      bgColor: "#1a1a1a",
      textColor: "#ffffff",
      links: [
        { label: "View All Features", href: "#features", ariaLabel: "View all features" },
        { label: "Documentation", href: "#docs", ariaLabel: "View documentation" },
      ],
    },
    {
      label: "How It Works",
      bgColor: "#2a2a2a",
      textColor: "#ffffff",
      links: [
        { label: "Get Started", href: "#how-it-works", ariaLabel: "Get started guide" },
        { label: "Learn More", href: "#learn", ariaLabel: "Learn more" },
      ],
    },
    {
      label: "Resources",
      bgColor: "#1f1f1f",
      textColor: "#ffffff",
      links: [
        { label: "Blog", href: "#blog", ariaLabel: "Read our blog" },
        { label: "Contact", href: "#contact", ariaLabel: "Contact us" },
      ],
    },
  ];

  return (
    <CardNav
      logo="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20'%3E%3Crect x='2' y='2' width='6' height='6' rx='1' fill='white' opacity='0.9'/%3E%3Crect x='12' y='2' width='6' height='6' rx='1' fill='white' opacity='0.6'/%3E%3Crect x='2' y='12' width='6' height='6' rx='1' fill='white' opacity='0.6'/%3E%3Crect x='12' y='12' width='6' height='6' rx='1' fill='white' opacity='0.9'/%3E%3C/svg%3E"
      logoAlt="Grievance Grid Logo"
      items={navItems}
      // use dark background from theme for navbar
      baseColor="var(--bg-secondary)"
      // menu icon should contrast with navbar background
      menuColor="var(--text-primary)"
      // button uses accent color for visibility
      buttonBgColor="var(--accent)"
      buttonTextColor="var(--text-primary)"
    />
  );
}
