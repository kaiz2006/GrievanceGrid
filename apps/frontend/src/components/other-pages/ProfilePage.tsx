import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import {
  User, Mail, Phone, MapPin, Shield, Bell,
  Edit3, Save, Camera, LogOut, ChevronRight,
  FileText, Clock, Award, TrendingUp, Star,
  CheckCircle, AlertCircle
} from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Cell
} from 'recharts';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { authService } from "@/services/auth.service";
import { grievanceService } from "@/services/grievance.service";
import { getStatusDistribution } from "@/lib/chart-utils";

// Generate initials from name
const getInitials = (name: string) => {
  if (!name) return "?";
  return name.split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2);
};

// Get civic level based on total reports
const getCivicLevel = (total: number) => {
  if (total === 0) return { level: 1, label: "Newcomer", next: 3, color: "from-slate-500 to-slate-600" };
  if (total < 3) return { level: 2, label: "Observer", next: 5, color: "from-blue-500 to-blue-600" };
  if (total < 6) return { level: 3, label: "Reporter", next: 10, color: "from-indigo-500 to-violet-600" };
  if (total < 10) return { level: 4, label: "Advocate", next: 20, color: "from-violet-500 to-purple-600" };
  return { level: 5, label: "Champion", next: total, color: "from-amber-500 to-orange-500" };
};

// Gradient colors for initials avatar
const AVATAR_GRADIENTS = [
  "from-blue-500 to-indigo-600",
  "from-purple-500 to-pink-600",
  "from-emerald-500 to-teal-600",
  "from-orange-500 to-red-600",
];

const ProfilePage = () => {
  const [user, setUser] = useState<any>(null);
  const [grievances, setGrievances] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [notifications, setNotifications] = useState({ email: true, sms: false, push: true });
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ name: "", email: "", phone: "", address: "" });
  const [stats, setStats] = useState({ total: 0, resolved: 0, pending: 0, active: 0 });

  // Pick a consistent gradient based on user email/name
  const avatarGradient = AVATAR_GRADIENTS[(user?.name?.charCodeAt(0) || 0) % AVATAR_GRADIENTS.length];

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("auth_token");
      if (!token) { window.location.href = "/login"; return; }
      setLoading(true);
      try {
        const [profileResult, grievanceResult] = await Promise.all([
          authService.me(),
          grievanceService.getMyGrievances()
        ]);
        setUser(profileResult);
        setFormData({ name: profileResult.name || "", email: profileResult.email || "", phone: profileResult.phone || "", address: "" });
        const items = (grievanceResult as any).grievances || (grievanceResult as any).items || [];
        setGrievances(items);
        const resolved = items.filter((g: any) => ["RESOLVED", "CLOSED", "VERIFIED"].includes(g.status?.toUpperCase())).length;
        const active = items.filter((g: any) => ["OPEN", "IN_PROGRESS", "PENDING"].includes(g.status?.toUpperCase())).length;
        setStats({ total: items.length, resolved, pending: items.length - resolved, active });
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        if (message.includes("401")) {
          localStorage.removeItem("auth_token");
          localStorage.removeItem("refresh_token");
          window.location.href = "/login";
        }
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    await authService.updateProfile({ name: formData.name, phone: formData.phone });
    setUser({ ...user, ...formData });
    setSaving(false);
    setEditing(false);
  };

  const handleLogout = async () => {
    await authService.logout();
    navigate("/");
  };

  const resolutionRate = stats.total > 0 ? Math.round((stats.resolved / stats.total) * 100) : 0;
  const civicLevel = getCivicLevel(stats.total);
  const xpProgress = stats.total > 0 ? Math.min((stats.total / civicLevel.next) * 100, 100) : 0;

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-muted-foreground font-mono uppercase tracking-widest text-xs">Loading Profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* ── Hero Banner ── */}
      <div className="relative h-44 bg-gradient-to-r from-[#0d1829] via-[#0f1f3d] to-[#0d1829] overflow-hidden">
        {/* Animated mesh */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_30%_50%,rgba(37,99,235,0.25),transparent_60%),radial-gradient(ellipse_at_70%_50%,rgba(147,51,234,0.2),transparent_60%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808010_1px,transparent_1px),linear-gradient(to_bottom,#80808010_1px,transparent_1px)] bg-[size:32px_32px]" />
        {/* Glowing orbs */}
        <div className="absolute top-4 left-1/4 w-32 h-32 bg-blue-500/15 rounded-full blur-3xl" />
        <div className="absolute top-4 right-1/3 w-40 h-40 bg-purple-500/10 rounded-full blur-3xl" />

        {/* Sign Out button top-right */}
        <div className="absolute top-5 right-6">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleLogout}
            className="text-white/60 hover:text-red-400 hover:bg-red-500/10 border border-white/10 rounded-xl text-xs font-bold uppercase tracking-widest"
          >
            <LogOut className="w-3.5 h-3.5 mr-1.5" />
            Sign Out
          </Button>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 pb-16">
        {/* ── Avatar Row ── */}
        <div className="relative flex flex-col md:flex-row md:items-end gap-5 -mt-16 mb-8">
          {/* Avatar */}
          <div className="relative shrink-0">
            <div className={`w-28 h-28 rounded-2xl bg-gradient-to-br ${avatarGradient} flex items-center justify-center border-4 border-background shadow-2xl shadow-blue-900/40`}>
              <span className="text-4xl font-black text-white tracking-tight">
                {getInitials(user?.name || "")}
              </span>
            </div>
            <button className="absolute -bottom-2 -right-2 w-8 h-8 rounded-xl bg-blue-600 flex items-center justify-center hover:bg-blue-500 transition-colors border-2 border-background shadow-lg">
              <Camera className="w-3.5 h-3.5 text-white" />
            </button>
          </div>

          {/* Name + role */}
          <div className="flex-1 pb-1">
            <div className="flex flex-col sm:flex-row sm:items-center gap-3">
              <div>
                <h1 className="text-2xl md:text-3xl font-black tracking-tight">{user?.name || "Citizen"}</h1>
                <div className="flex items-center gap-2 mt-1">
                  <Badge className="bg-blue-600/15 text-blue-400 border border-blue-500/25 text-xs font-bold uppercase tracking-widest">
                    {localStorage.getItem("userRole") || user?.role || "Citizen"}
                  </Badge>
                  {stats.resolved > 0 && (
                    <Badge className="bg-green-500/10 text-green-400 border border-green-500/25 text-xs font-semibold">
                      <CheckCircle className="w-2.5 h-2.5 mr-1" />
                      {resolutionRate}% resolved
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── Civic Level Card ── */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className={`rounded-2xl bg-gradient-to-r ${civicLevel.color} p-px mb-8 shadow-lg`}
        >
          <div className="rounded-[calc(1rem-1px)] bg-[#0b0f1a] px-6 py-5 flex flex-col sm:flex-row sm:items-center gap-4">
            <div className="flex items-center gap-4 flex-1">
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${civicLevel.color} flex items-center justify-center shadow-lg`}>
                <Award className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Civic Level {civicLevel.level}</p>
                <p className="text-xl font-black text-foreground">{civicLevel.label}</p>
              </div>
            </div>
            <div className="flex-1 sm:max-w-xs">
              <div className="flex justify-between text-xs font-semibold text-muted-foreground mb-2">
                <span>{stats.total} reports filed</span>
                <span>{civicLevel.next} to next level</span>
              </div>
              <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${xpProgress}%` }}
                  transition={{ duration: 1, delay: 0.3, ease: "easeOut" }}
                  className={`h-full rounded-full bg-gradient-to-r ${civicLevel.color}`}
                />
              </div>
            </div>
          </div>
        </motion.div>

        {/* ── Main Grid ── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* LEFT COLUMN */}
          <div className="lg:col-span-2 space-y-6">

            {/* Personal Info Card */}
            <Card className="border-white/6 bg-white/[0.02] rounded-2xl overflow-hidden">
              <CardHeader className="flex flex-row items-center justify-between pb-4">
                <CardTitle className="flex items-center gap-2.5 text-base">
                  <div className="w-8 h-8 rounded-lg bg-blue-500/15 flex items-center justify-center">
                    <User className="w-4 h-4 text-blue-400" />
                  </div>
                  Personal Information
                </CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => editing ? setEditing(false) : setEditing(true)}
                  className="text-xs font-bold text-muted-foreground hover:text-foreground rounded-xl"
                >
                  {editing ? "Cancel" : <><Edit3 className="w-3.5 h-3.5 mr-1.5" />Edit</>}
                </Button>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* Full Name */}
                  <div>
                    <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1.5 block">Full Name</label>
                    {editing ? (
                      <Input value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="bg-white/5 border-white/10 rounded-xl h-11" />
                    ) : (
                      <div className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.04] border border-white/6 h-11">
                        <User className="w-4 h-4 text-muted-foreground shrink-0" />
                        <span className="text-sm">{user?.name || "—"}</span>
                      </div>
                    )}
                  </div>
                  {/* Email */}
                  <div>
                    <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1.5 block">Email</label>
                    <div className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.04] border border-white/6 h-11">
                      <Mail className="w-4 h-4 text-muted-foreground shrink-0" />
                      <span className="text-sm truncate">{user?.email || "—"}</span>
                    </div>
                  </div>
                  {/* Phone */}
                  <div>
                    <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1.5 block">Phone</label>
                    {editing ? (
                      <Input value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} placeholder="+91-XXXXX-XXXXX" className="bg-white/5 border-white/10 rounded-xl h-11" />
                    ) : (
                      <div className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.04] border border-white/6 h-11">
                        <Phone className="w-4 h-4 text-muted-foreground shrink-0" />
                        <span className="text-sm text-muted-foreground">{user?.phone || "Not provided"}</span>
                      </div>
                    )}
                  </div>
                  {/* Address */}
                  <div>
                    <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1.5 block">Address</label>
                    {editing ? (
                      <Input value={formData.address} onChange={(e) => setFormData({ ...formData, address: e.target.value })} placeholder="Your address" className="bg-white/5 border-white/10 rounded-xl h-11" />
                    ) : (
                      <div className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.04] border border-white/6 h-11">
                        <MapPin className="w-4 h-4 text-muted-foreground shrink-0" />
                        <span className="text-sm text-muted-foreground">{formData.address || "Not provided"}</span>
                      </div>
                    )}
                  </div>
                </div>

                {editing && (
                  <Button className="w-full h-11 bg-blue-600 hover:bg-blue-500 rounded-xl mt-2" onClick={handleSave} disabled={saving}>
                    {saving ? (
                      <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />Saving...</>
                    ) : (
                      <><Save className="w-4 h-4 mr-2" />Save Changes</>
                    )}
                  </Button>
                )}
              </CardContent>
            </Card>

            {/* Stats Row */}
            <div className="grid grid-cols-3 gap-3">
              {[
                { label: "Total Filed", value: stats.total, color: "text-blue-400", icon: FileText, bg: "bg-blue-500/10 border-blue-500/15" },
                { label: "Resolved", value: stats.resolved, color: "text-green-400", icon: CheckCircle, bg: "bg-green-500/10 border-green-500/15" },
                { label: "Active", value: stats.active, color: "text-amber-400", icon: AlertCircle, bg: "bg-amber-500/10 border-amber-500/15" },
              ].map((s) => (
                <div key={s.label} className={`rounded-2xl border p-4 text-center ${s.bg} flex flex-col items-center gap-2`}>
                  <div className="w-9 h-9 rounded-xl bg-white/5 flex items-center justify-center">
                    <s.icon className={`w-4.5 h-4.5 ${s.color}`} />
                  </div>
                  <p className={`text-2xl font-black ${s.color}`}>{s.value}</p>
                  <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">{s.label}</p>
                </div>
              ))}
            </div>

            {/* Resolution Chart */}
            <Card className="border-white/6 bg-white/[0.02] rounded-2xl">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2.5 text-base">
                  <div className="w-8 h-8 rounded-lg bg-purple-500/15 flex items-center justify-center">
                    <TrendingUp className="w-4 h-4 text-purple-400" />
                  </div>
                  Resolution Overview
                </CardTitle>
              </CardHeader>
              <CardContent className="h-[160px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={getStatusDistribution(grievances)} barGap={8}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                    <XAxis dataKey="name" stroke="#ffffff20" fontSize={10} tickLine={false} axisLine={false} />
                    <YAxis stroke="#ffffff20" fontSize={10} tickLine={false} axisLine={false} width={24} />
                    <Tooltip
                      contentStyle={{ backgroundColor: 'rgba(11,15,25,0.95)', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '12px', fontSize: '12px' }}
                      cursor={{ fill: 'rgba(255,255,255,0.03)' }}
                    />
                    <Bar dataKey="count" radius={[6, 6, 0, 0]} maxBarSize={48}>
                      {getStatusDistribution(grievances).map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.name === 'Resolved' ? '#10b981' : entry.name === 'Active' ? '#3b82f6' : '#8b5cf6'} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* RIGHT COLUMN */}
          <div className="space-y-5">

            {/* Civic Score */}
            <Card className="border-white/6 bg-white/[0.02] rounded-2xl overflow-hidden">
              <div className="h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500" />
              <CardContent className="pt-5 space-y-4">
                <div className="flex items-center gap-2">
                  <Star className="w-4 h-4 text-amber-400" />
                  <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Civic Score</span>
                </div>
                <div className="text-center py-2">
                  <p className="text-5xl font-black bg-gradient-to-br from-blue-400 to-purple-400 bg-clip-text text-transparent">
                    {resolutionRate}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">Resolution Rate %</p>
                </div>
                <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${resolutionRate}%` }}
                    transition={{ duration: 1, delay: 0.5, ease: "easeOut" }}
                    className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="border-white/6 bg-white/[0.02] rounded-2xl">
              <CardHeader className="pb-3">
                <CardTitle className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 pt-0">
                {[
                  { to: "/my-grievances", icon: FileText, label: "My Grievances", color: "text-blue-400", bg: "bg-blue-500/10" },
                  { to: "/submit", icon: AlertCircle, label: "Submit New", color: "text-green-400", bg: "bg-green-500/10" },
                  { to: "/ai-assistant", icon: Star, label: "AI Assistant", color: "text-purple-400", bg: "bg-purple-500/10" },
                  { to: "/track/GRI-2026-000102", icon: Clock, label: "Track Status", color: "text-amber-400", bg: "bg-amber-500/10" },
                ].map((item) => (
                  <Link
                    key={item.label}
                    to={item.to}
                    className="flex items-center justify-between p-3 rounded-xl bg-white/[0.03] hover:bg-white/[0.07] border border-white/5 hover:border-white/10 transition-all group"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-lg ${item.bg} flex items-center justify-center`}>
                        <item.icon className={`w-4 h-4 ${item.color}`} />
                      </div>
                      <span className="text-sm font-semibold">{item.label}</span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-foreground group-hover:translate-x-0.5 transition-all" />
                  </Link>
                ))}
              </CardContent>
            </Card>

            {/* Security */}
            <Card className="border-white/6 bg-white/[0.02] rounded-2xl">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-muted-foreground">
                  <Shield className="w-3.5 h-3.5 text-green-400" />
                  Security
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 pt-0">
                <div className="flex items-center justify-between py-1">
                  <span className="text-sm text-foreground/80">Two-Factor Auth</span>
                  <Badge variant="outline" className="text-[10px] border-white/10">Disabled</Badge>
                </div>
                <div className="flex items-center justify-between py-1">
                  <span className="text-sm text-foreground/80">Login Alerts</span>
                  <Badge className="text-[10px] bg-green-500/10 text-green-400 border-green-500/20">Enabled</Badge>
                </div>
                <Button variant="outline" className="w-full border-white/10 bg-white/5 hover:bg-white/10 rounded-xl text-sm h-10 mt-1">
                  Change Password
                </Button>
              </CardContent>
            </Card>

            {/* Notifications */}
            <Card className="border-white/6 bg-white/[0.02] rounded-2xl">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-muted-foreground">
                  <Bell className="w-3.5 h-3.5 text-amber-400" />
                  Notifications
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 pt-0">
                {[
                  { key: "email", label: "Email Updates" },
                  { key: "sms", label: "SMS Alerts" },
                  { key: "push", label: "Push Notifications" },
                ].map((item) => (
                  <div key={item.key} className="flex items-center justify-between py-1">
                    <span className="text-sm text-foreground/80">{item.label}</span>
                    <button
                      onClick={() => setNotifications(prev => ({ ...prev, [item.key]: !prev[item.key as keyof typeof prev] }))}
                      className={`w-11 h-6 rounded-full relative transition-colors duration-200 ${notifications[item.key as keyof typeof notifications] ? 'bg-blue-600' : 'bg-white/10'}`}
                    >
                      <div className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-all duration-200 ${notifications[item.key as keyof typeof notifications] ? 'right-1' : 'left-1'}`} />
                    </button>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
