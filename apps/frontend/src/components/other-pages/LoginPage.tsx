import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { LogIn, Mail, Lock, Chrome, ArrowRight, ShieldCheck, X, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";

import { authService } from "@/services/auth.service";
import { auth, googleProvider, signInWithPopup } from "@/lib/firebase";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [role, setRole] = useState<"citizen" | "admin">("citizen");

  // Google sign-in modal state
  const [showGoogleModal, setShowGoogleModal] = useState(false);
  const [googleEmail, setGoogleEmail] = useState("");
  const [googleEmailError, setGoogleEmailError] = useState("");
  const [googleLoading, setGoogleLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await authService.login(email, password);
      console.log("[LOGIN SUCCESS]", response);
      localStorage.setItem("auth_token", response.access_token);
      localStorage.setItem("userRole", role);
      const target = role === "admin" ? "/admin/dashboard" : "/my-grievances";
      window.location.href = target;
    } catch (error) {
      console.error("[LOGIN ERROR]", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleModalSubmit = async () => {
    if (!googleEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(googleEmail)) {
      setGoogleEmailError("Please enter a valid email address.");
      return;
    }
    setGoogleEmailError("");
    // Guard against missing Firebase configuration
    if (!auth) {
      setGoogleEmailError("Firebase configuration is missing. Please set your VITE_FIREBASE_* environment variables to enable Google Sign-In.");
      return;
    }

    setGoogleLoading(true);

    try {
      // Force custom params if we wanted to pre-fill email:
      // googleProvider.setCustomParameters({ login_hint: googleEmail });
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;

      localStorage.setItem("auth_token", "firebase_" + user.uid);
      localStorage.setItem("userRole", role);
      localStorage.setItem("userEmail", user.email || googleEmail);
      localStorage.setItem("userUid", user.uid);
      localStorage.setItem("userName", user.displayName || "User");
      if (user.photoURL) {
        localStorage.setItem("userPhoto", user.photoURL);
      }

      console.log("[GOOGLE SIGN-IN SUCCESS]", user.uid, role);
      const target = role === "admin" ? "/admin/dashboard" : "/my-grievances";
      window.location.href = target;

    } catch (error: any) {
      console.error("[GOOGLE SIGN-IN ERROR]", error);
      setGoogleEmailError(error.message || "Failed to sign in with Google.");
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-white flex flex-col">

      <div className="flex-grow flex items-center justify-center p-6 bg-[radial-gradient(circle_at_50%_50%,rgba(37,99,235,0.05),transparent_70%)]">
        {/* Background Gradients */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-[120px] pointer-events-none" />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md relative z-10"
        >
          <Card className="glass-card border-white/10 bg-black/40 backdrop-blur-2xl">
            <CardHeader className="space-y-1 text-center">
              <div className="flex justify-center mb-6">
                <div className="w-16 h-16 rounded-2xl bg-blue-500/10 flex items-center justify-center border border-blue-500/20 shadow-[0_0_20px_rgba(59,130,246,0.15)]">
                  <ShieldCheck className="w-8 h-8 text-blue-500" />
                </div>
              </div>

              {/* Role Selection */}
              <div className="flex p-1 bg-white/5 rounded-xl border border-white/10 mb-6 max-w-[240px] mx-auto">
                <button
                  type="button"
                  onClick={() => setRole("citizen")}
                  className={`flex-1 py-2 px-4 rounded-lg text-xs font-bold transition-all ${role === "citizen"
                      ? "bg-blue-600 text-white shadow-lg"
                      : "text-muted-foreground hover:text-white"
                    }`}
                >
                  CITIZEN
                </button>
                <button
                  type="button"
                  onClick={() => setRole("admin")}
                  className={`flex-1 py-2 px-4 rounded-lg text-xs font-bold transition-all ${role === "admin"
                      ? "bg-blue-600 text-white shadow-lg"
                      : "text-muted-foreground hover:text-white"
                    }`}
                >
                  ADMIN
                </button>
              </div>

              <CardTitle className="text-3xl font-bold tracking-tight">
                {role === "admin" ? "Admin Console" : "Welcome Back"}
              </CardTitle>
              <CardDescription className="text-muted-foreground">
                {role === "admin"
                  ? "Access the administrative grid management system"
                  : "Enter your credentials to access your secure portal"}
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-6">
              <div className="grid gap-2">
                <Button
                  variant="outline"
                  className="h-12 border-white/10 bg-white/5 hover:bg-white/10 transition-all font-medium py-6"
                  disabled={isLoading}
                  onClick={() => { setShowGoogleModal(true); setGoogleEmail(""); setGoogleEmailError(""); }}
                >
                  <Chrome className="mr-2 h-5 w-5" />
                  Continue with Google
                </Button>
              </div>
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-white/10" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground font-medium">Or continue with</span>
                </div>
              </div>
              <form onSubmit={handleSubmit} className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="email" className="text-sm font-medium ml-1">Email Address</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="name@example.com"
                      className="pl-10 h-12 bg-white/5 border-white/10 focus:border-blue-500/50 transition-all"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                </div>
                <div className="grid gap-2">
                  <div className="flex items-center justify-between ml-1">
                    <Label htmlFor="password">Password</Label>
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="password"
                      type="password"
                      className="pl-10 h-12 bg-white/5 border-white/10 focus:border-blue-500/50 transition-all"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>
                </div>
                <Button className="cta-button-primary h-12 mt-2 w-full" disabled={isLoading}>
                  {isLoading ? "Signing in..." : "Sign In"}
                  {!isLoading && <ArrowRight className="ml-2 h-4 w-4" />}
                </Button>
              </form>
            </CardContent>
            <CardFooter className="flex flex-col gap-4 text-center">
              <div className="text-sm text-muted-foreground">
                Don&apos;t have an account?{" "}
                <a href="/register" className="text-blue-500 hover:text-blue-400 font-medium transition-colors">
                  Create account
                </a>
              </div>
            </CardFooter>
          </Card>
        </motion.div>
      </div>

      {/* Google Sign-In Modal */}
      <AnimatePresence>
        {showGoogleModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
            onClick={(e) => { if (e.target === e.currentTarget) setShowGoogleModal(false); }}
          >
            <motion.div
              initial={{ scale: 0.92, opacity: 0, y: 16 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.92, opacity: 0, y: 16 }}
              transition={{ type: "spring", stiffness: 320, damping: 28 }}
              className="w-full max-w-sm bg-[#0d0d0d] border border-white/10 rounded-3xl p-8 shadow-2xl relative"
            >
              {/* Close */}
              <button
                onClick={() => setShowGoogleModal(false)}
                className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors"
              >
                <X className="w-4 h-4 text-muted-foreground" />
              </button>

              {/* Google branding */}
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow">
                  <svg viewBox="0 0 24 24" className="w-5 h-5">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-bold text-white">Sign in with Google</p>
                  <p className="text-xs text-muted-foreground">Enter your Google account email</p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-2 block">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <input
                      type="email"
                      placeholder="you@gmail.com"
                      value={googleEmail}
                      onChange={(e) => { setGoogleEmail(e.target.value); setGoogleEmailError(""); }}
                      onKeyDown={(e) => e.key === "Enter" && handleGoogleModalSubmit()}
                      autoFocus
                      className="w-full pl-10 pr-4 h-12 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500/50 transition-all"
                    />
                  </div>
                  {googleEmailError && (
                    <p className="text-xs text-red-400 mt-1.5">{googleEmailError}</p>
                  )}
                </div>

                <p className="text-[11px] text-muted-foreground leading-relaxed">
                  By continuing, Google will verify your identity. Signing in as <span className="text-white font-semibold uppercase">{role}</span>.
                </p>

                <Button
                  className="w-full h-12 bg-blue-600 hover:bg-blue-500 font-bold"
                  onClick={handleGoogleModalSubmit}
                  disabled={googleLoading}
                >
                  {googleLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Verifying...
                    </>
                  ) : (
                    <>
                      Continue
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </>
                  )}
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default LoginPage;
