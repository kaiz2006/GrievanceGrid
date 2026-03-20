import { useState } from "react";
import { Menu, X } from "lucide-react";
import Shuffle from "./Shuffle";

const navLinks = ["Home", "Solutions", "Impact", "SLA Monitoring", "Resource Center", "Dashboard"];

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border/30">
      <div className="container mx-auto flex items-center justify-between h-20 px-6">
        <div className="flex items-center gap-2">
          <Shuffle 
            text="GrievanceGrid"
            tag="span"
            className="text-2xl font-bold text-foreground tracking-tight"
            style={{ fontFamily: "'Funnel Display', sans-serif", fontWeight: 800 }}
            shuffleTimes={2}
            stagger={0.05}
            scrambleCharset="ABCDEFGHIJKLMOPQRSTUVWXYZ0123456789"
          />
        </div>

        <div className="hidden lg:flex items-center gap-8">
          {navLinks.map((link) => (
            <a
              key={link}
              href={`#${link.toLowerCase().replace(/\s/g, "-")}`}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              {link}
            </a>
          ))}
        </div>

        <div className="hidden lg:block">
          <a href="#pricing" className="cta-button-primary text-xs px-6 py-3">
            GET STARTED
          </a>
        </div>

        <button
          className="lg:hidden text-foreground"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {mobileOpen && (
        <div className="lg:hidden bg-background/95 backdrop-blur-xl border-t border-border/30 px-6 py-6 space-y-4">
          {navLinks.map((link) => (
            <a
              key={link}
              href={`#${link.toLowerCase().replace(/\s/g, "-")}`}
              className="block text-sm text-muted-foreground hover:text-foreground transition-colors"
              onClick={() => setMobileOpen(false)}
            >
              {link}
            </a>
          ))}
          <a href="#pricing" className="cta-button-primary text-xs px-6 py-3 w-full justify-center">
            GET STARTED
          </a>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
