import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";
import Sidebar from "./Sidebar";
import MobileNav from "./MobileNav";
import { motion, AnimatePresence } from "framer-motion";
import { Bot, Sparkles } from "lucide-react";
import { Button } from "./ui/button";

const AI_POPUP_KEY = "ai_popup_shown";

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout = ({ children }: MainLayoutProps) => {
  const location = useLocation();
  const isLandingPage = location.pathname === "/";
  const isContactPage = location.pathname === "/contact";
  const isAuthPage = location.pathname === "/login" || location.pathname === "/register";

  // One-time login popup state
  const [showLoginPopup, setShowLoginPopup] = useState(false);
  const loginPopupTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const alreadyShown = localStorage.getItem(AI_POPUP_KEY);
    if (!alreadyShown) {
      // Small delay so the page settles before showing
      const showDelay = setTimeout(() => {
        setShowLoginPopup(true);
        // Auto-hide after 4 seconds
        loginPopupTimerRef.current = setTimeout(() => {
          setShowLoginPopup(false);
          localStorage.setItem(AI_POPUP_KEY, "true");
        }, 4000);
      }, 1200);
      return () => {
        clearTimeout(showDelay);
        if (loginPopupTimerRef.current) clearTimeout(loginPopupTimerRef.current);
      };
    }
  }, []);

  if (isAuthPage) {
    return <div className="min-h-screen bg-background text-foreground">{children}</div>;
  }

  if (isLandingPage || isContactPage) {
    return (
      <div className="min-h-screen bg-background text-white flex flex-col">
        <Navbar />
        <main className="flex-grow">{children}</main>
        <Footer />
      </div>
    );
  }

  const isCitizen = localStorage.getItem("userRole")?.toUpperCase() === "CITIZEN";

  return (
    <div className="flex h-screen bg-background text-foreground overflow-hidden flex-col lg:flex-row">
      <Sidebar />
      <MobileNav />
      <main className="flex-1 overflow-y-auto relative bg-[#0a0a0a] pt-16 pb-20 lg:pt-0 lg:pb-0">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="relative z-10 w-full"
          >
            {children}
          </motion.div>
        </AnimatePresence>

        {isCitizen && location.pathname !== "/ai-assistant" && (
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.6, type: "spring", stiffness: 200, damping: 20 }}
            className="fixed bottom-6 right-6 md:bottom-8 md:right-8 z-[100] group"
          >
            {/* One-time login popup */}
            <AnimatePresence>
              {showLoginPopup && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9, x: 20 }}
                  animate={{ opacity: 1, scale: 1, x: 0 }}
                  exit={{ opacity: 0, scale: 0.9, x: 20 }}
                  transition={{ duration: 0.3 }}
                  className="absolute bottom-12 right-0 glass-card bg-[#0b0f19]/90 backdrop-blur-xl border border-blue-500/30 text-[10px] md:text-sm font-medium px-3.5 py-2.5 rounded-2xl rounded-br-sm shadow-[0_0_20px_rgba(37,99,235,0.2)] text-blue-500 w-[170px] md:w-[200px] pointer-events-none"
                >
                  <div className="flex items-start gap-2">
                    <Sparkles className="w-3.5 h-3.5 text-blue-400 shrink-0 mt-0.5" />
                    <span>I can help you write your complaints instantly!</span>
                  </div>
                  {/* Tail */}
                  <div className="absolute -bottom-1.5 right-3 w-3 h-3 bg-[#0b0f19] border-r border-b border-blue-500/30 rotate-45" />
                </motion.div>
              )}
            </AnimatePresence>

            {/* Hover popup (always available) */}
            <div className="absolute bottom-12 right-0 glass-card bg-[#0b0f19]/90 backdrop-blur-xl border border-blue-500/30 text-[10px] md:text-sm font-medium px-3.5 py-2.5 rounded-2xl rounded-br-sm shadow-[0_0_20px_rgba(37,99,235,0.2)] text-blue-500 w-[170px] md:w-[200px] pointer-events-none opacity-0 group-hover:opacity-100 transition-all duration-200 group-hover:translate-y-0 translate-y-1">
              <div className="flex items-start gap-2">
                <Sparkles className="w-3.5 h-3.5 text-blue-400 shrink-0 mt-0.5" />
                <span>I can help you write your complaints instantly!</span>
              </div>
              <div className="absolute -bottom-1.5 right-3 w-3 h-3 bg-[#0b0f19] border-r border-b border-blue-500/30 rotate-45" />
            </div>

            <Button
              asChild
              className="w-9 h-9 md:w-10 md:h-10 rounded-full bg-blue-600 hover:bg-blue-500 shadow-[0_0_20px_rgba(37,99,235,0.4)] transition-all duration-300 hover:scale-110 flex items-center justify-center p-0 border border-blue-400/30 hover:shadow-[0_0_30px_rgba(37,99,235,0.6)] relative"
            >
              <a href="/ai-assistant">
                <Bot className="w-4 h-4 md:w-5 md:h-5 text-white relative z-10" />
                <div className="absolute inset-0 rounded-full bg-blue-400/20 animate-ping opacity-75" style={{ animationDuration: "3s" }} />
              </a>
            </Button>
          </motion.div>
        )}
      </main>
    </div>
  );
};

export default MainLayout;
