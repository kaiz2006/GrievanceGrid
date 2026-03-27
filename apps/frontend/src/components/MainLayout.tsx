import { useLocation } from "react-router-dom";
import { useState } from "react";
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
  const [isExpanded, setIsExpanded] = useState(false);

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
            className="fixed bottom-6 right-6 md:bottom-8 md:right-8 z-[100]"
          >
            {/* Main Bubble */}
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsExpanded(!isExpanded)}
              className="relative bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full p-4 shadow-2xl cursor-pointer"
            >
              {/* Pulsing Animation */}
              <div className="absolute inset-0 bg-white/20 rounded-full animate-ping" />
              
              {/* Icon */}
              <div className="relative z-10">
                <Bot className="w-6 h-6" />
              </div>
              
              {/* Notification Dot */}
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-white" />
            </motion.div>

            {/* Expanded Options */}
            <AnimatePresence>
              {isExpanded && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 20 }}
                  exit={{ opacity: 0, scale: 0.8, y: 20 }}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  className="absolute bottom-full mb-4 right-0 bg-sidebar border border-sidebar-border rounded-2xl shadow-2xl backdrop-blur-md p-4 min-w-[200px]"
                >
                  <div className="space-y-3">
                    <Button 
                      asChild
                      className="w-full h-12 px-4 bg-blue-600 hover:bg-blue-500 text-white rounded-xl transition-all flex items-center gap-3"
                    >
                      <a href="/submit-voice" className="flex items-center justify-center w-full">
                        <Sparkles className="w-4 h-4" />
                        Voice Grievance Submit
                      </a>
                    </Button>
                    
                    <Button 
                      asChild
                      className="w-full h-12 px-4 bg-purple-600 hover:bg-purple-500 text-white rounded-xl transition-all flex items-center gap-3"
                    >
                      <a href="/ai-assistant" className="flex items-center justify-center w-full">
                        <Bot className="w-4 h-4" />
                        AI Chat Agent
                      </a>
                    </Button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </main>

    </div>
  );
};

export default MainLayout;
