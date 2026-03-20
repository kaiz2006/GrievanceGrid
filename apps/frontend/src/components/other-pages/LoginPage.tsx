import { useState } from "react";
import { motion } from "framer-motion";
import { LogIn, Mail, Lock, Chrome, ArrowRight, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";

const LoginPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [role, setRole] = useState<"citizen" | "admin">("citizen");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Mock login logic
    setTimeout(() => {
      localStorage.setItem("userRole", role);
      setIsLoading(false);
      window.location.href = "/dashboard";
    }, 1500);
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
                  className={`flex-1 py-2 px-4 rounded-lg text-xs font-bold transition-all ${
                    role === "citizen" 
                      ? "bg-blue-600 text-white shadow-lg" 
                      : "text-muted-foreground hover:text-white"
                  }`}
                >
                  CITIZEN
                </button>
                <button
                  type="button"
                  onClick={() => setRole("admin")}
                  className={`flex-1 py-2 px-4 rounded-lg text-xs font-bold transition-all ${
                    role === "admin" 
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
                <Button variant="outline" className="h-12 border-white/10 bg-white/5 hover:bg-white/10 transition-all font-medium py-6" disabled={isLoading}>
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
                      required
                    />
                  </div>
                </div>
                <div className="grid gap-2">
                  <div className="flex items-center justify-between ml-1">
                    <Label htmlFor="password">Password</Label>
                    <a href="#" className="text-xs text-blue-500 hover:text-blue-400 transition-colors">
                      Forgot password?
                    </a>
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="password"
                      type="password"
                      className="pl-10 h-12 bg-white/5 border-white/10 focus:border-blue-500/50 transition-all"
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
