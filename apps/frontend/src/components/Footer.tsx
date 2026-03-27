"use client";
import React from "react";
import { Github, Twitter, Linkedin, Instagram } from "lucide-react";

export default function Footer() {
  return (
    <footer className="relative bg-black pt-32 pb-20 overflow-hidden">
      {/* Background Watermark */}
      <div className="absolute bottom-[-5%] left-1/2 -translate-x-1/2 w-full select-none pointer-events-none z-0">
        <h2 className="text-[14vw] font-black leading-none text-center uppercase tracking-tighter text-white/[0.03] whitespace-nowrap">
          GrievanceGrid
        </h2>
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="bg-[#0d0d0d] rounded-[2.5rem] border border-white/5 p-12 md:p-16 lg:p-20 shadow-2xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-8">
            {/* Logo and Description */}
            <div className="lg:col-span-5 flex flex-col items-start gap-8">
              <div className="flex items-center gap-3">
                <img src="/logo.jpeg" className="w-10 h-7 object-contain rounded-xl" alt="GrievanceGrid Logo" />
                <span className="text-2xl font-bold text-white tracking-tight">GrievanceGrid</span>
              </div>
              <p className="text-zinc-500 text-lg leading-relaxed max-w-sm">
                GrievanceGrid empowers public administrators to transform citizen complaints into actionable insights — making resolution faster, transparent, and more accountable.
              </p>
              <div className="flex gap-6">
                <SocialIcon icon={<Twitter className="w-5 h-5" />} href="#" />
                <SocialIcon icon={<Instagram className="w-5 h-5" />} href="#" />
                <SocialIcon icon={<Linkedin className="w-5 h-5" />} href="#" />
                <SocialIcon icon={<Github className="w-5 h-5" />} href="#" />
              </div>
            </div>

            {/* Links Columns */}
            <div className="lg:col-span-7 grid grid-cols-2 md:grid-cols-3 gap-12 lg:gap-8">
              <FooterColumn title="Product" links={[
                { label: "Features", href: "#" },
                { label: "Pricing", href: "#" },
                { label: "Integrations", href: "#" },
                { label: "Changelog", href: "#" },
              ]} />
              <FooterColumn title="Resources" links={[
                { label: "Documentation", href: "#" },
                { label: "Tutorials", href: "#" },
                { label: "Blog", href: "#" },
                { label: "Support", href: "#" },
              ]} />
              <FooterColumn title="Company" links={[
                { label: "About", href: "#" },
                { label: "Careers", href: "#" },
                { label: "Contact", href: "#" },
                { label: "Partners", href: "#" },
              ]} />
            </div>
          </div>

          {/* Footer Bottom */}
          <div className="mt-20 pt-10 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8">
            <span className="text-zinc-600 text-sm">
              © 2025 GrievanceGrid. All rights reserved.
            </span>
            <div className="flex gap-8">
              <FooterLegalLink label="Privacy Policy" href="#" />
              <FooterLegalLink label="Terms of Service" href="#" />
              <FooterLegalLink label="Cookies Settings" href="#" />
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({ title, links }: { title: string; links: { label: string; href: string }[] }) {
  return (
    <div className="flex flex-col gap-6">
      <h4 className="text-white font-semibold text-sm tracking-wide">{title}</h4>
      <ul className="flex flex-col gap-4">
        {links.map((link) => (
          <li key={link.label}>
            <a href={link.href} className="text-zinc-500 hover:text-white transition-colors duration-200 text-sm">
              {link.label}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

function SocialIcon({ icon, href }: { icon: React.ReactNode; href: string }) {
  return (
    <a 
      href={href} 
      className="text-zinc-600 hover:text-white transition-all duration-300 transform hover:scale-110"
    >
      {icon}
    </a>
  );
}

function FooterLegalLink({ label, href }: { label: string; href: string }) {
  return (
    <a href={href} className="text-zinc-600 hover:text-zinc-400 transition-colors duration-200 text-sm">
      {label}
    </a>
  );
}
