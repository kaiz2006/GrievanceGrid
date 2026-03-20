import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import LoginPage from "./components/other-pages/LoginPage";
import RegisterPage from "./components/other-pages/RegisterPage";
import DashboardPage from "./components/other-pages/DashboardPage";
import SubmitPage from "./components/other-pages/SubmitPage";
import TrackingPage from "./components/other-pages/TrackingPage";
import AdminDashboardPage from "./components/other-pages/AdminDashboardPage";
import GrievanceDetailPage from "./components/other-pages/GrievanceDetailPage";
import SolutionsPage from "./components/other-pages/SolutionsPage";
import ImpactPage from "./components/other-pages/ImpactPage";
import SLAMonitoringPage from "./components/other-pages/SLAMonitoringPage";
import ResourceCenterPage from "./components/other-pages/ResourceCenterPage";
import ContactPage from "./components/other-pages/ContactPage";
import MainLayout from "./components/MainLayout";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <MainLayout>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/submit" element={<SubmitPage />} />
            <Route path="/track/:grid_id" element={<TrackingPage />} />
            <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
            <Route path="/grievance/:id" element={<GrievanceDetailPage />} />
            <Route path="/solutions" element={<SolutionsPage />} />
            <Route path="/impact" element={<ImpactPage />} />
            <Route path="/sla-monitoring" element={<SLAMonitoringPage />} />
            <Route path="/resource-center" element={<ResourceCenterPage />} />
            <Route path="/contact" element={<ContactPage />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </MainLayout>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
