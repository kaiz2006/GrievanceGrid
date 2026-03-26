import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Mail, Lock, Chrome, ArrowRight, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";

import { authService } from "@/services/auth.service";
import { auth, googleProvider, signInWithPopup } from "@/lib/firebase";
import { getRoleLandingPath } from "@/utils/roleLanding";

type DemoCredential = {
  label: string;
  email: string;
  password: string;
};

const DEMO_CREDENTIALS: DemoCredential[] = [
  { label: "Citizen", email: "citizen1@example.com", password: "citizen1" },
  { label: "Officer", email: "officer1@example.com", password: "officer1" },
  { label: "Crew", email: "crew1@example.com", password: "crew1" },
  { label: "Auditor", email: "auditor1@example.com", password: "auditor1" },
  { label: "Admin", email: "admin1@example.com", password: "admin1" },
];

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const applyDemoCredentials = (cred: DemoCredential) => {
    setEmail(cred.email);
    setPassword(cred.password);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await authService.login(email, password);
      console.log("[LOGIN SUCCESS]", response);
      
      const userRole = response.user.role;
      const target = getRoleLandingPath(userRole);
      
      navigate(target);
    } catch (error: any) {
      console.error("[LOGIN ERROR]", error);
      alert(error.message || "Invalid email or password");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    const firebaseAuth = auth;
    if (!firebaseAuth) {
      alert("Firebase configuration is missing.");
      return;
    }

    setIsLoading(true);

    try {
      const result = await signInWithPopup(firebaseAuth, googleProvider);
      const idToken = await result.user.getIdToken();

      // Verify with backend
      const response = await authService.googleLogin(idToken);
      const userRole = response.user.role;

      console.log("[GOOGLE SIGN-IN SUCCESS]", response.user.id, userRole);
      const target = getRoleLandingPath(userRole);
      
      navigate(target);

    } catch (error: any) {
      console.error("[GOOGLE SIGN-IN ERROR]", error);
      alert(error.message || "Failed to sign in with Google.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-white flex flex-col">
      <div className="flex-grow flex items-center justify-center p-6 bg-[radial-gradient(circle_at_50%_50%,rgba(37,99,235,0.05),transparent_70%)]">
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
              <CardTitle className="text-3xl font-bold tracking-tight">Welcome Back</CardTitle>
              <CardDescription className="text-muted-foreground">
                Enter your credentials to access your secure portal
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-6">
              <div className="rounded-xl border border-dashed border-blue-500/30 bg-blue-500/5 p-3">
                <p className="text-[11px] uppercase tracking-[0.18em] text-blue-300/90 mb-2">Demo Credentials</p>
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                  {DEMO_CREDENTIALS.map((cred) => (
                    <Button
                      key={cred.email}
                      type="button"
                      variant="outline"
                      className="h-8 border-white/15 bg-white/5 text-xs hover:bg-blue-500/15"
                      onClick={() => applyDemoCredentials(cred)}
                      disabled={isLoading}
                    >
                      {cred.label}
                    </Button>
                  ))}
                </div>
              </div>
              <div className="grid gap-2">
                <Button
                  variant="outline"
                  className="h-12 border-white/10 bg-white/5 hover:bg-white/10 transition-all font-medium py-6"
                  disabled={isLoading}
                  onClick={handleGoogleSignIn}
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
    </div>
  );
};

export default LoginPage;
