import { 
  LayoutDashboard, 
  Send, 
  Search, 
  ShieldCheck, 
  TrendingUp, 
  Zap,
  User as UserIcon,
  Menu,
  X,
  Wrench,
  AlertTriangle,
  Activity,
  Gavel,
  Volume2,
  GitCompare,
  History,
  Clock,
  AlertOctagon,
  List,
  Mic,
  User
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useState } from "react";

export const mobileMenuItems = [
  { icon: LayoutDashboard, label: "Feed", href: "/dashboard" },
  { icon: Send, label: "Submit", href: "/submit" },
  { icon: Search, label: "Track", href: "/track/GRV-9901" },
  { icon: ShieldCheck, label: "Admin", href: "/admin/dashboard", roles: ["admin"] },
];

// Admin submenu items for mobile
const adminSubmenuItems = [
  { icon: ShieldCheck, label: "Admin Center", href: "/admin/dashboard" },
  { icon: TrendingUp, label: "SLA Monitoring", href: "/sla-monitoring" },
  { icon: Zap, label: "Crisis Inbox", href: "/admin/crisis-inbox" },
  { icon: Wrench, label: "Predictive Maintenance", href: "/admin/predictive-maintenance" },
  { icon: AlertTriangle, label: "Crisis Clusters", href: "/admin/crisis-clusters" },
  { icon: Gavel, label: "Contestation Audit", href: "/admin/contestation-audit" },
  { icon: Volume2, label: "Voice Results", href: "/admin/voice-results" },
  { icon: GitCompare, label: "Similar Cases", href: "/admin/similar-cases" },
  { icon: AlertOctagon, label: "SLA Breaches", href: "/admin/sla-breaches" },
  { icon: Activity, label: "Escalations", href: "/admin/escalations" },
  { icon: History, label: "Audit History", href: "/admin/audit-history" },
  { icon: Clock, label: "Pending Audits", href: "/admin/pending-audits" },
];

// Citizen submenu items for mobile
const citizenSubmenuItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard" },
  { icon: List, label: "My Grievances", href: "/my-grievances" },
  { icon: Send, label: "Submit", href: "/submit" },
  { icon: Mic, label: "Voice Submit", href: "/submit-voice" },
  { icon: Search, label: "Track", href: "/track/GRV-9901" },
  { icon: User, label: "Profile", href: "/profile" },
];

const MobileNav = () => {
  const location = useLocation();
  const currentRole = localStorage.getItem("userRole") || "citizen";
  const [showAdminMenu, setShowAdminMenu] = useState(false);

  const filteredItems = mobileMenuItems.filter(item => 
    !item.roles || item.roles.includes(currentRole as any)
  );

  const isAdmin = currentRole === "admin";

  return (
    <>
      {/* Top Header */}
      <header className="lg:hidden fixed top-0 inset-x-0 h-16 bg-sidebar/80 backdrop-blur-xl border-b border-sidebar-border z-[100] flex items-center justify-between px-8">
        <div className="flex items-center gap-2">
          <Zap className="w-5 h-5 text-blue-500 fill-blue-500/20" />
          <span className="font-display font-bold text-sm tracking-tight">GrievanceGrid</span>
        </div>
        {(
          <button 
            onClick={() => setShowAdminMenu(!showAdminMenu)}
            className="w-9 h-9 rounded-full bg-blue-600/10 border border-blue-600/20 flex items-center justify-center group active:scale-95 transition-all"
          >
            {showAdminMenu ? <X className="w-4 h-4 text-blue-500" /> : <Menu className="w-4 h-4 text-blue-500" />}
          </button>
        )}
      </header>

      {/* Submenu Overlay */}
      {showAdminMenu && (
        <div className="lg:hidden fixed top-16 inset-x-0 bottom-20 bg-background/95 backdrop-blur-xl z-[99] overflow-y-auto p-4">
          <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-4 px-2">
            {isAdmin ? "Admin Portal" : "Menu"}
          </h3>
          <div className="grid grid-cols-2 gap-3">
            {(isAdmin ? adminSubmenuItems : citizenSubmenuItems).map((item) => {
              const isActive = location.pathname === item.href;
              return (
                <Link
                  key={item.label}
                  to={item.href}
                  onClick={() => setShowAdminMenu(false)}
                  className={`flex flex-col items-center gap-2 p-4 rounded-2xl transition-all ${
                    isActive 
                      ? "bg-blue-600/10 text-blue-500 border border-blue-600/20" 
                      : "bg-white/5 text-muted-foreground hover:bg-white/10"
                  }`}
                >
                  <item.icon className="w-6 h-6" />
                  <span className="text-[10px] font-bold text-center leading-tight">{item.label}</span>
                </Link>
              );
            })}
          </div>
        </div>
      )}

      {/* Bottom Navbar */}
      <nav className="lg:hidden fixed bottom-0 inset-x-0 h-20 bg-sidebar/80 backdrop-blur-xl border-t border-sidebar-border z-[100] flex items-center justify-around px-8 safe-area-bottom">
        {filteredItems.map((item) => {
          const isActive = location.pathname === item.href;
          return (
            <Link 
              key={item.label} 
              to={item.href}
              className={`flex flex-col items-center gap-1.5 transition-all ${
                isActive ? "text-blue-500 scale-110" : "text-muted-foreground"
              }`}
            >
              <item.icon className={`w-5 h-5 ${isActive ? "fill-blue-500/10" : ""}`} />
              <span className="text-[10px] font-bold uppercase tracking-wider">{item.label}</span>
              {isActive && (
                <div className="absolute -bottom-2 w-1 h-1 bg-blue-500 rounded-full" />
              )}
            </Link>
          );
        })}
      </nav>
    </>
  );
};

export default MobileNav;
