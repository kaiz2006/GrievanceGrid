import { useLocation } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";
import Sidebar from "./Sidebar";
import MobileNav from "./MobileNav";
import { motion, AnimatePresence } from "framer-motion";
import { Bot, Sparkles } from "lucide-react";
import { Button } from "./ui/button";


interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout = ({ children }: MainLayoutProps) => {
  const location = useLocation();
  const isLandingPage = location.pathname === "/";
  const isContactPage = location.pathname === "/contact";
  const isAuthPage = location.pathname === "/login" || location.pathname === "/register";

  if (isAuthPage) {
    return <div className="min-h-screen bg-background text-foreground">{children}</div>;
  }

  if (isLandingPage || isContactPage) {
    return (
      <div className="min-h-screen bg-background text-white flex flex-col">
        <Navbar />
        <main className="flex-grow">
          {children}
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-background text-foreground overflow-hidden flex-col lg:flex-row">
      <Sidebar />
      <MobileNav />
      <main className="flex-1 overflow-y-auto relative bg-[#0a0a0a] pt-16 pb-20 lg:pt-0 lg:pb-0">
        {/* Background mesh for dashboard feel */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(37,99,235,0.03),transparent_70%)] pointer-events-none" />
        
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

        {/* Global Floating AI Assistant Widget - Only for Citizens */}
        {localStorage.getItem("userRole")?.toUpperCase() === "CITIZEN" && location.pathname !== "/ai-assistant" && (
          <motion.div 
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.6, type: "spring", stiffness: 200, damping: 20 }}
            className="fixed bottom-6 right-6 md:bottom-8 md:right-8 z-[100] flex flex-col items-end gap-3 group"
          >
            {/* Tooltip Bubble */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, x: 20 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              transition={{ delay: 1.5, duration: 0.5 }}
              className="glass-card bg-[#0b0f19]/90 backdrop-blur-xl border border-blue-500/30 text-[10px] md:text-sm font-medium px-3.5 py-2.5 rounded-2xl rounded-br-sm shadow-[0_0_20px_rgba(37,99,235,0.2)] text-blue-500 max-w-[180px] md:max-w-[220px] pointer-events-none group-hover:bg-[#0b0f19] group-hover:border-blue-400/50 transition-colors"
            >
              <div className="flex items-start gap-2">
                <Sparkles className="w-3.5 h-3.5 text-blue-400 shrink-0 mt-0.5" />
                <span>I can help you in writing your issues / complaints instantly!</span>
              </div>
            </motion.div>
            
            {/* Floating Button */}
            <Button 
              asChild
              className="w-11 h-11 md:w-13 md:h-13 rounded-full bg-blue-600 hover:bg-blue-500 shadow-[0_0_20px_rgba(37,99,235,0.4)] transition-all duration-300 hover:scale-110 flex items-center justify-center p-0 border border-blue-400/30 hover:shadow-[0_0_30px_rgba(37,99,235,0.6)]"
            >
              <a href="/ai-assistant">
                <Bot className="w-5 h-5 md:w-6 md:h-6 text-white relative z-10" />
                <div className="absolute inset-0 rounded-full bg-blue-400/20 animate-ping opacity-75" style={{ animationDuration: '3s' }} />
              </a>
            </Button>
          </motion.div>
        )}
      </main>

    </div>
  );
};

export default MainLayout;
