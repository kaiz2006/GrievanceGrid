import { motion } from "framer-motion";
import { 
  LayoutDashboard, 
  Send, 
  Search, 
  TrendingUp, 
  ShieldCheck, 
  Layers, 
  FileText, 
  Settings, 
  LogOut,
  ChevronLeft,
  ChevronRight,
  Menu,
  X,
  Home,
  Zap,
  Layout,
  Globe,
  Cpu,
  Users,
  // New icons for missing pages
  AlertTriangle,
  Activity,
  Wrench,
  Gavel,
  Volume2,
  Clock,
  GitCompare,
  History,
  AlertOctagon,
  MapPin,
  Route,
  Lightbulb,
  // Citizen page icons
  List,
  Mic,
  User,
  // Officer workflow icons
  CheckCircle,
  RefreshCw,
  Bot
} from "lucide-react";
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import Shuffle from "./Shuffle";

const menuItems = [
  // Admin prioritized items
  { icon: ShieldCheck, label: "Admin Center", href: "/admin/dashboard", roles: ["admin"] },
  { icon: TrendingUp, label: "SLA Monitoring", href: "/sla-monitoring", roles: ["admin"] },
  { icon: Cpu, label: "AI Audit", href: "/admin/ai-audit", roles: ["admin"] },
  { icon: Globe, label: "Transparency", href: "/admin/transparency", roles: ["admin"] },
  { icon: Search, label: "Forensic", href: "/admin/forensic", roles: ["admin"] },
  { icon: Zap, label: "Crisis Inbox", href: "/admin/crisis-inbox", roles: ["admin"] },
  { icon: ShieldCheck, label: "Fraud Detection", href: "/admin/fraud-detection", roles: ["admin"] },
  { icon: Layout, label: "Mission Control", href: "/admin/mission-control", roles: ["admin"] },
  { icon: Users, label: "Crew Dispatch", href: "/admin/dispatch", roles: ["admin"] },
  { icon: Settings, label: "Engineering", href: "/admin/engineering", roles: ["admin"] },
  { icon: Layers, label: "Industrial Hub", href: "/admin/industrial", roles: ["admin"] },
  
  // NEW: Predictive Governance & Analytics (P1 Priority)
  { icon: Wrench, label: "Predictive Maintenance", href: "/admin/predictive-maintenance", roles: ["admin"] },
  { icon: AlertTriangle, label: "Crisis Clusters", href: "/admin/crisis-clusters", roles: ["admin"] },
  { icon: Gavel, label: "Contestation Audit", href: "/admin/contestation-audit", roles: ["admin"] },
  
  // NEW: Voice & Similar Cases (P2 Priority)
  { icon: Volume2, label: "Voice Results", href: "/admin/voice-results", roles: ["admin"] },
  { icon: GitCompare, label: "Similar Cases", href: "/admin/similar-cases", roles: ["admin"] },
  
  // NEW: SLA & Escalation Management (P2 Priority)
  { icon: AlertOctagon, label: "SLA Breaches", href: "/admin/sla-breaches", roles: ["admin"] },
  { icon: Activity, label: "Escalations", href: "/admin/escalations", roles: ["admin"] },
  
  // NEW: Audit Management (P3 Priority)
  { icon: History, label: "Audit History", href: "/admin/audit-history", roles: ["admin"] },
  { icon: Clock, label: "Pending Audits", href: "/admin/pending-audits", roles: ["admin"] },
  
  // NEW: Officer Workflow Pages
  { icon: CheckCircle, label: "Field Verification", href: "/officer/workflow", roles: ["admin"] },
  { icon: RefreshCw, label: "Update Status", href: "/officer/workflow", roles: ["admin"] },
  
  // Citizen-specific pages
  { icon: List, label: "My Grievances", href: "/my-grievances", roles: ["citizen"] },
  { icon: Mic, label: "Voice Submit", href: "/submit-voice", roles: ["citizen"] },
  { icon: User, label: "My Profile", href: "/profile", roles: ["citizen", "admin"] },
  
  // Common/Citizen items
  { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard", roles: ["citizen", "admin"] },
  { icon: Bot, label: "AI Assistant", href: "/ai-assistant", roles: ["citizen"] },
  { icon: Send, label: "Submit Grievance", href: "/submit", roles: ["citizen"] },
  { icon: Search, label: "Track Status", href: "/track/GRV-9901", roles: ["citizen"] },
  { icon: Layers, label: "Impact", href: "/impact", roles: ["citizen"] },
  { icon: FileText, label: "Resources", href: "/resource-center", roles: ["citizen"] },
];

const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const currentRole = localStorage.getItem("userRole") || "citizen";

  const filteredItems = menuItems.filter(item => item.roles.includes(currentRole as any));

  return (
    <motion.aside
      initial={false}
      animate={{ 
        width: collapsed ? "88px" : "280px",
      }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className={`hidden lg:flex fixed lg:relative inset-y-0 left-0 z-50 bg-sidebar border-r border-sidebar-border flex-col shadow-2xl`}
    >
      {/* Interaction Ball / Collapse Toggle */}
      <button 
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-3 top-10 w-6 h-6 bg-blue-600 rounded-full items-center justify-center border border-white/20 shadow-[0_0_20px_rgba(37,99,235,0.4)] hover:scale-110 active:scale-95 transition-all z-[60]"
      >
        {collapsed ? <ChevronRight className="w-4 h-4 text-white" /> : <ChevronLeft className="w-4 h-4 text-white" />}
      </button>

      <div className="w-full h-full flex flex-col overflow-hidden">
        <div className="h-24 flex items-center px-6 mb-4">
          <Link to="/" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center shrink-0 shadow-[0_0_20px_rgba(37,99,235,0.4)]">
              <Zap className="w-6 h-6 text-white" />
            </div>
            <motion.div 
              animate={{ 
                width: collapsed ? 0 : "auto", 
                opacity: collapsed ? 0 : 1,
                marginLeft: collapsed ? 0 : 12 
              }}
              className="overflow-hidden"
            >
              <Shuffle 
                text="GrievanceGrid"
                tag="span"
                className="text-lg font-bold text-foreground tracking-tight whitespace-nowrap"
                style={{ fontFamily: "'Funnel Display', sans-serif" }}
                shuffleTimes={1}
                stagger={0.03}
              />
            </motion.div>
          </Link>
        </div>

        <div className="flex-1 px-4 space-y-2 overflow-y-auto overflow-x-hidden">
          {filteredItems.map((item) => {
            const isActive = location.pathname === item.href || (item.href.includes('/track') && location.pathname.includes('/track'));
            return (
              <Link
                key={item.label}
                to={item.href}
                className={`flex items-center gap-3 px-4 py-3.5 rounded-2xl transition-all group relative ${
                  isActive 
                    ? "bg-blue-600/10 text-white border border-blue-600/20" 
                    : "text-muted-foreground hover:text-foreground hover:bg-white/[0.03]"
                }`}
              >
                {isActive && (
                  <motion.div 
                    layoutId="active-pill"
                    className="absolute left-0 w-1 h-6 bg-blue-600 rounded-r-full"
                  />
                )}
                <item.icon className={`shrink-0 w-5 h-5 ${isActive ? "text-blue-500" : "group-hover:text-foreground"}`} />
                <motion.span
                  animate={{
                    width: collapsed ? 0 : "auto",
                    opacity: collapsed ? 0 : 1,
                    marginLeft: collapsed ? 0 : 12
                  }}
                  className="text-sm font-bold tracking-wide uppercase whitespace-nowrap overflow-hidden"
                >
                  {item.label}
                </motion.span>
                {collapsed && (
                  <div className="absolute left-full ml-4 px-3 py-1 bg-white/10 backdrop-blur-md rounded-lg text-xs font-bold opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50 border border-white/10 whitespace-nowrap">
                    {item.label}
                  </div>
                )}
              </Link>
            );
          })}
        </div>

        {/* User / Footer Section */}
        <div className="p-4 mt-auto border-t border-white/5 space-y-2">
          <button 
            onClick={() => {
              localStorage.removeItem("userRole");
              window.location.href = "/";
            }}
            className="w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl text-muted-foreground hover:text-red-500 hover:bg-red-500/5 transition-all group"
          >
            <LogOut className={`shrink-0 w-5 h-5 group-hover:rotate-180 transition-transform duration-500 ${collapsed ? "mx-auto" : ""}`} />
            <motion.span
              animate={{ 
                width: collapsed ? 0 : "auto", 
                opacity: collapsed ? 0 : 1,
                marginLeft: collapsed ? 0 : 12 
              }}
              className="text-sm font-bold tracking-wide uppercase whitespace-nowrap overflow-hidden"
            >
              Sign Out
            </motion.span>
          </button>
        </div>
      </div>
    </motion.aside>
);
};

export default Sidebar;
