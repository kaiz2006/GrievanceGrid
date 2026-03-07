"use client";

const footerLinks = {
  Product: [
    { label: "Features", href: "#features" },
    { label: "How It Works", href: "#how-it-works" },
    { label: "Command Center", href: "#" },
    { label: "Changelog", href: "#" },
  ],
  Resources: [
    { label: "Documentation", href: "#" },
    { label: "API Reference", href: "#" },
    { label: "Blog", href: "#" },
    { label: "Support", href: "#" },
  ],
  Company: [
    { label: "About", href: "#" },
    { label: "Careers", href: "#" },
    { label: "Contact", href: "#contact" },
    { label: "Partners", href: "#" },
  ],
};

const socials = [
  {
    label: "X",
    href: "#",
    icon: (
      <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ),
  },
  {
    label: "LinkedIn",
    href: "#",
    icon: (
      <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
      </svg>
    ),
  },
  {
    label: "GitHub",
    href: "#",
    icon: (
      <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
      </svg>
    ),
  },
];

export default function Footer() {
  return (
    <footer
      id="contact"
      style={{
        position: "relative",
        zIndex: 10,
        background: "var(--bg-primary)",
        padding: "32px 24px 24px",
      }}
    >
      {/* Card container */}
      <div
        style={{
          maxWidth: 1100,
          margin: "0 auto",
          background: "rgba(255,255,255,0.03)",
          border: "1px solid rgba(255,255,255,0.08)",
          borderRadius: 20,
          padding: "40px 48px 28px",
        }}
      >
        {/* Top row: brand + columns */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "2fr 1fr 1fr 1fr",
            gap: 48,
            alignItems: "start",
            marginBottom: 36,
          }}
        >
          {/* Brand */}
          <div>
            {/* Logo */}
            <a
              href="#"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 10,
                textDecoration: "none",
                marginBottom: 14,
              }}
            >
              <div
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: 8,
                  background: "linear-gradient(135deg,#1e40af,#3b82f6)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                <svg width="16" height="16" viewBox="0 0 20 20" fill="none">
                  <rect x="2" y="2" width="6" height="6" rx="1" fill="white" opacity="0.95" />
                  <rect x="12" y="2" width="6" height="6" rx="1" fill="white" opacity="0.6" />
                  <rect x="2" y="12" width="6" height="6" rx="1" fill="white" opacity="0.6" />
                  <rect x="12" y="12" width="6" height="6" rx="1" fill="white" opacity="0.95" />
                </svg>
              </div>
              <span style={{ fontSize: "1rem", fontWeight: 700, color: "#f8fafc" }}>
                Grievance<span style={{ color: "#60a5fa" }}>Grid</span>
              </span>
            </a>

            {/* Tagline */}
            <p
              style={{
                fontSize: "0.85rem",
                color: "rgba(255,255,255,0.45)",
                lineHeight: 1.6,
                maxWidth: 260,
                marginBottom: 20,
              }}
            >
              Transforming public service delivery through intelligent grievance management — built for governments that care.
            </p>

            {/* Socials */}
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              {socials.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  aria-label={s.label}
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: 8,
                    border: "1px solid rgba(255,255,255,0.1)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "rgba(255,255,255,0.5)",
                    textDecoration: "none",
                    transition: "color 0.2s ease, background 0.2s ease",
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.color = "#fff";
                    (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.08)";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.5)";
                    (e.currentTarget as HTMLElement).style.background = "transparent";
                  }}
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h4
                style={{
                  fontSize: "0.78rem",
                  fontWeight: 700,
                  color: "#f8fafc",
                  letterSpacing: "0.07em",
                  textTransform: "uppercase",
                  marginBottom: 14,
                }}
              >
                {category}
              </h4>
              <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "flex", flexDirection: "column", gap: 8 }}>
                {links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      style={{
                        fontSize: "0.85rem",
                        color: "rgba(255,255,255,0.45)",
                        textDecoration: "none",
                        transition: "color 0.18s ease",
                      }}
                      onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = "#fff"; }}
                      onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.45)"; }}
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Divider */}
        <div style={{ height: 1, background: "rgba(255,255,255,0.07)", marginBottom: 20 }} />

        {/* Bottom bar */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: 12,
          }}
        >
          <p style={{ fontSize: "0.8rem", color: "rgba(255,255,255,0.3)", margin: 0 }}>
            © {new Date().getFullYear()} GrievanceGrid. All rights reserved.
          </p>
          <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
            {["Privacy Policy", "Terms of Service", "Cookie Settings"].map((label) => (
              <a
                key={label}
                href="#"
                style={{
                  fontSize: "0.8rem",
                  color: "rgba(255,255,255,0.35)",
                  textDecoration: "none",
                  transition: "color 0.18s ease",
                }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = "#fff"; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.35)"; }}
              >
                {label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
