import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Shield,
  Bell,
  Edit3,
  Save,
  Camera,
  LogOut,
  ChevronRight,
  FileText,
  Star,
  Clock
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { authService } from "@/services/auth.service";

const ProfilePage = () => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: ""
  });

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const result = await authService.me();
      setUser(result);
      setFormData({
        name: result.name || "",
        email: result.email || "",
        phone: result.phone || "",
        address: ""
      });
      setLoading(false);
    };
    fetchData();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    await authService.updateProfile({
      name: formData.name,
      phone: formData.phone
    });
    setUser({ ...user, ...formData });
    setSaving(false);
    setEditing(false);
  };

  const handleLogout = async () => {
    await authService.logout();
    localStorage.removeItem("userRole");
    window.location.href = "/";
  };

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
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <main className="flex-grow pt-8 lg:pt-32 pb-12 px-6 relative overflow-hidden">
        {/* Ambient Glow */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-[150px] pointer-events-none" />

        <div className="container mx-auto max-w-4xl">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-12">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <User className="w-5 h-5 text-blue-500" />
                <span className="text-xs font-bold text-blue-500 uppercase tracking-widest">My Profile</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight">Account Settings</h1>
              <p className="text-muted-foreground mt-2">Manage your profile and preferences</p>
            </div>

            <Button
              variant="outline"
              className="border-red-500/30 text-red-500 hover:bg-red-500/10"
              onClick={handleLogout}
            >
              <LogOut className="w-4 h-4 mr-2" />
              Sign Out
            </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Profile Info */}
            <div className="lg:col-span-2 space-y-6">
              {/* Profile Card */}
              <Card className="glass-card border-white/5 bg-white/[0.02]">
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="flex items-center gap-3">
                    <User className="w-5 h-5 text-blue-500" />
                    Personal Information
                  </CardTitle>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => editing ? setEditing(false) : setEditing(true)}
                  >
                    {editing ? "Cancel" : <><Edit3 className="w-4 h-4 mr-1" /> Edit</>}
                  </Button>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Avatar */}
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      <div className="w-20 h-20 rounded-full bg-blue-600/20 border-2 border-blue-500/30 flex items-center justify-center">
                        <User className="w-10 h-10 text-blue-500" />
                      </div>
                      <button className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center hover:bg-blue-500 transition-colors">
                        <Camera className="w-4 h-4 text-white" />
                      </button>
                    </div>
                    <div>
                      <h3 className="font-bold text-lg">{user?.name}</h3>
                      <Badge variant="outline" className="text-xs capitalize">
                        {user?.role}
                      </Badge>
                    </div>
                  </div>

                  {/* Form Fields */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-2 block">
                        Full Name
                      </label>
                      {editing ? (
                        <Input
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          className="bg-white/5 border-white/10"
                        />
                      ) : (
                        <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5">
                          <User className="w-4 h-4 text-muted-foreground" />
                          <span>{user?.name}</span>
                        </div>
                      )}
                    </div>

                    <div>
                      <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-2 block">
                        Email
                      </label>
                      <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5">
                        <Mail className="w-4 h-4 text-muted-foreground" />
                        <span>{user?.email}</span>
                      </div>
                    </div>

                    <div>
                      <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-2 block">
                        Phone
                      </label>
                      {editing ? (
                        <Input
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          className="bg-white/5 border-white/10"
                          placeholder="+91-98765-43210"
                        />
                      ) : (
                        <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5">
                          <Phone className="w-4 h-4 text-muted-foreground" />
                          <span>{user?.phone || "Not provided"}</span>
                        </div>
                      )}
                    </div>

                    <div>
                      <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-2 block">
                        Address
                      </label>
                      {editing ? (
                        <Input
                          value={formData.address}
                          onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                          className="bg-white/5 border-white/10"
                          placeholder="Your address"
                        />
                      ) : (
                        <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5">
                          <MapPin className="w-4 h-4 text-muted-foreground" />
                          <span>{formData.address || "Not provided"}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {editing && (
                    <Button
                      className="w-full h-12 bg-blue-600 hover:bg-blue-500"
                      onClick={handleSave}
                      disabled={saving}
                    >
                      {saving ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                          Saving...
                        </>
                      ) : (
                        <>
                          <Save className="w-5 h-5 mr-2" />
                          Save Changes
                        </>
                      )}
                    </Button>
                  )}
                </CardContent>
              </Card>

              {/* Activity Summary */}
              <Card className="glass-card border-white/5 bg-white/[0.02]">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <Clock className="w-5 h-5 text-green-500" />
                    Activity Summary
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="p-4 rounded-2xl bg-white/5 text-center">
                      <p className="text-2xl font-bold text-blue-500">12</p>
                      <p className="text-xs text-muted-foreground mt-1">Total Reports</p>
                    </div>
                    <div className="p-4 rounded-2xl bg-white/5 text-center">
                      <p className="text-2xl font-bold text-green-500">8</p>
                      <p className="text-xs text-muted-foreground mt-1">Resolved</p>
                    </div>
                    <div className="p-4 rounded-2xl bg-white/5 text-center">
                      <p className="text-2xl font-bold text-amber-500">4</p>
                      <p className="text-xs text-muted-foreground mt-1">Pending</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right Column - Quick Links */}
            <div className="space-y-6">
              {/* Quick Actions */}
              <Card className="glass-card border-white/5 bg-white/[0.02]">
                <CardHeader>
                  <CardTitle className="text-sm font-bold uppercase tracking-widest">Quick Links</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Link
                    to="/my-grievances"
                    className="flex items-center justify-between p-4 rounded-2xl bg-white/5 hover:bg-white/10 transition-colors group"
                  >
                    <div className="flex items-center gap-3">
                      <FileText className="w-5 h-5 text-blue-500" />
                      <span className="font-medium">My Grievances</span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors" />
                  </Link>
                  <Link
                    to="/submit"
                    className="flex items-center justify-between p-4 rounded-2xl bg-white/5 hover:bg-white/10 transition-colors group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-5 h-5 rounded-full bg-green-500/20 flex items-center justify-center">
                        <span className="text-green-500 text-xs">+</span>
                      </div>
                      <span className="font-medium">Submit New</span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors" />
                  </Link>
                  <Link
                    to="/track/GRV-9901"
                    className="flex items-center justify-between p-4 rounded-2xl bg-white/5 hover:bg-white/10 transition-colors group"
                  >
                    <div className="flex items-center gap-3">
                      <Clock className="w-5 h-5 text-amber-500" />
                      <span className="font-medium">Track Status</span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors" />
                  </Link>
                </CardContent>
              </Card>

              {/* Security */}
              <Card className="glass-card border-white/5 bg-white/[0.02]">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3 text-sm font-bold uppercase tracking-widest">
                    <Shield className="w-4 h-4 text-green-500" />
                    Security
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Two-Factor Auth</span>
                    <Badge variant="outline" className="text-xs">Disabled</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Login Notifications</span>
                    <Badge className="bg-green-500/10 text-green-500 text-xs">Enabled</Badge>
                  </div>
                  <Button variant="outline" className="w-full border-white/10 bg-white/5">
                    Change Password
                  </Button>
                </CardContent>
              </Card>

              {/* Notifications */}
              <Card className="glass-card border-white/5 bg-white/[0.02]">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3 text-sm font-bold uppercase tracking-widest">
                    <Bell className="w-4 h-4 text-amber-500" />
                    Notifications
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {["Email Updates", "SMS Alerts", "Push Notifications"].map((item) => (
                    <div key={item} className="flex items-center justify-between">
                      <span className="text-sm">{item}</span>
                      <div className="w-10 h-5 rounded-full bg-blue-600 relative cursor-pointer">
                        <div className="absolute right-0.5 top-0.5 w-4 h-4 rounded-full bg-white" />
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ProfilePage;
