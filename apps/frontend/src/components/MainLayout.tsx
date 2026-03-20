import { useLocation } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";
import Sidebar from "./Sidebar";
import MobileNav from "./MobileNav";
import { motion, AnimatePresence } from "framer-motion";

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
      </main>
    </div>
  );
};

export default MainLayout;
