import { 
  LayoutDashboard, 
  Send, 
  Search, 
  ShieldCheck, 
  TrendingUp, 
  Zap,
  User as UserIcon
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";

export const mobileMenuItems = [
  { icon: LayoutDashboard, label: "Feed", href: "/dashboard" },
  { icon: Send, label: "Submit", href: "/submit" },
  { icon: Search, label: "Track", href: "/track/GRV-9901" },
  { icon: ShieldCheck, label: "Admin", href: "/admin/dashboard", roles: ["admin"] },
];

const MobileNav = () => {
  const location = useLocation();
  const currentRole = localStorage.getItem("userRole") || "citizen";

  const filteredItems = mobileMenuItems.filter(item => 
    !item.roles || item.roles.includes(currentRole as any)
  );

  return (
    <>
      {/* Top Header */}
      <header className="lg:hidden fixed top-0 inset-x-0 h-16 bg-sidebar/80 backdrop-blur-xl border-b border-sidebar-border z-[100] flex items-center justify-between px-6">
        <div className="flex items-center gap-2">
          <Zap className="w-5 h-5 text-blue-500 fill-blue-500/20" />
          <span className="font-display font-bold text-sm tracking-tight">GrievanceGrid</span>
        </div>
        <div className="w-9 h-9 rounded-full bg-blue-600/10 border border-blue-600/20 flex items-center justify-center group active:scale-95 transition-all">
          <UserIcon className="w-4 h-4 text-blue-500" />
        </div>
      </header>

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
