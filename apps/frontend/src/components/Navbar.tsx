import { useState, useEffect } from "react";
import { Menu, X, LayoutDashboard } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import Shuffle from "./Shuffle";

const navLinks = ["Home", "Solutions", "Impact", "SLA Monitoring", "Resource Center"];

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("auth_token");
    const role = localStorage.getItem("userRole");
    setIsLoggedIn(!!token);
    setUserRole(role);
  }, [location.pathname]);

  const dashboardPath = (userRole === "ADMIN" || userRole === "OFFICER" || userRole === "CREW" || userRole === "AUDITOR")
    ? "/admin/dashboard"
    : "/my-grievances";

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border/30">
      <div className="container mx-auto flex items-center justify-between h-20 px-6">
        <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
          <Shuffle 
            text="GrievanceGrid"
            tag="span"
            className="text-2xl font-bold text-foreground tracking-tight"
            style={{ fontFamily: "'Funnel Display', sans-serif", fontWeight: 800 }}
            shuffleTimes={2}
            stagger={0.05}
            scrambleCharset="ABCDEFGHIJKLMOPQRSTUVWXYZ0123456789"
          />
        </Link>

        <div className="hidden lg:flex items-center gap-8">
          {navLinks.map((link) => {
            let sectionId = link.toLowerCase().replace(/\s/g, "-").replace("sla-monitoring", "monitoring").replace("resource-center", "resources");
            if (link === "Solutions") sectionId = "pricing";
            
            const href = `${window.location.pathname === "/" ? "" : "/"}\#${sectionId}`;
            
            return (
              <a
                key={link}
                href={href}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                {link}
              </a>
            );
          })}
        </div>

        <div className="hidden lg:block">
          {isLoggedIn ? (
            <Link to={dashboardPath} className="cta-button-primary text-xs px-6 py-3 gap-2">
              <LayoutDashboard className="w-4 h-4" />
              DASHBOARD
            </Link>
          ) : (
            <Link to="/login" className="cta-button-primary text-xs px-6 py-3">
              GET STARTED
            </Link>
          )}
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
          {navLinks.map((link) => {
            let sectionId = link.toLowerCase().replace(/\s/g, "-").replace("sla-monitoring", "monitoring").replace("resource-center", "resources");
            if (link === "Solutions") sectionId = "pricing";
            
            const href = `${window.location.pathname === "/" ? "" : "/"}\#${sectionId}`;
            
            return (
              <a
                key={link}
                href={href}
                className="block text-sm text-muted-foreground hover:text-foreground transition-colors"
                onClick={() => setMobileOpen(false)}
              >
                {link}
              </a>
            );
          })}
          {isLoggedIn ? (
            <Link 
              to={dashboardPath} 
              className="cta-button-primary text-xs px-6 py-3 w-full justify-center gap-2"
              onClick={() => setMobileOpen(false)}
            >
              <LayoutDashboard className="w-4 h-4" />
              DASHBOARD
            </Link>
          ) : (
            <Link 
              to="/login" 
              className="cta-button-primary text-xs px-6 py-3 w-full justify-center"
              onClick={() => setMobileOpen(false)}
            >
              GET STARTED
            </Link>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
