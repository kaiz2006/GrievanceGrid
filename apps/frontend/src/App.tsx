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
import AIAuditPage from "./components/other-pages/AIAuditPage";
import TransparencyPage from "./components/other-pages/TransparencyPage";
import ForensicPage from "./components/other-pages/ForensicPage";
import CrisisInboxPage from "./components/other-pages/CrisisInboxPage";
import FraudDetectionPage from "./components/other-pages/FraudDetectionPage";
import DispatchPage from "./components/other-pages/DispatchPage";
import EngineeringPage from "./components/other-pages/EngineeringPage";
import IndustrialInterfacePage from "./components/other-pages/IndustrialInterfacePage";
// New pages for missing functionality
import PredictiveMaintenancePage from "./components/other-pages/PredictiveMaintenancePage";
import CrisisClustersPage from "./components/other-pages/CrisisClustersPage";
import ContestationAuditPage from "./components/other-pages/ContestationAuditPage";
import VoiceResultPage from "./components/other-pages/VoiceResultPage";
import SLABreachPage from "./components/other-pages/SLABreachPage";
import EscalationManagementPage from "./components/other-pages/EscalationManagementPage";
import AuditHistoryPage from "./components/other-pages/AuditHistoryPage";
import SimilarCasesPage from "./components/other-pages/SimilarCasesPage";
import PendingAuditsPage from "./components/other-pages/PendingAuditsPage";
// New citizen-facing pages
import MyGrievancesPage from "./components/other-pages/MyGrievancesPage";
import FeedbackPage from "./components/other-pages/FeedbackPage";
import ContestationPage from "./components/other-pages/ContestationPage";
import VoiceSubmitPage from "./components/other-pages/VoiceSubmitPage";
import ProfilePage from "./components/other-pages/ProfilePage";
import AIAssistantPage from "./components/other-pages/AIAssistantPage";
// New officer workflow pages
import FieldVerificationPage from "./components/other-pages/FieldVerificationPage";
import OfficerDashboardPage from "./components/other-pages/OfficerDashboardPage";
import OfficerWorkflowPage from "./components/other-pages/OfficerWorkflowPage";
import MainLayout from "./components/MainLayout";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter
        future={{
          v7_startTransition: true,
          v7_relativeSplatPath: true,
        }}
      >
        <MainLayout>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/citizen/dashboard" element={<MyGrievancesPage />} />
            <Route path="/officer/dashboard" element={<OfficerDashboardPage />} />
            <Route path="/crew/dashboard" element={<DispatchPage />} />
            <Route path="/auditor/dashboard" element={<PendingAuditsPage />} />
            <Route path="/submit" element={<SubmitPage />} />
            <Route path="/track" element={<MyGrievancesPage />} />
            <Route path="/track/:grid_id" element={<TrackingPage />} />
            <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
            <Route path="/admin/ai-audit" element={<AIAuditPage />} />
            <Route path="/admin/transparency" element={<TransparencyPage />} />
            <Route path="/admin/forensic" element={<ForensicPage />} />
            <Route path="/admin/crisis-inbox" element={<CrisisInboxPage />} />
            <Route path="/admin/fraud-detection" element={<FraudDetectionPage />} />
            <Route path="/admin/dispatch" element={<DispatchPage />} />
            <Route path="/admin/engineering" element={<EngineeringPage />} />
            <Route path="/admin/industrial" element={<IndustrialInterfacePage />} />
            <Route path="/admin/predictive-maintenance" element={<PredictiveMaintenancePage />} />
            <Route path="/admin/crisis-clusters" element={<CrisisClustersPage />} />
            <Route path="/admin/contestation-audit" element={<ContestationAuditPage />} />
            <Route path="/admin/voice-results" element={<VoiceResultPage />} />
            <Route path="/admin/sla-breaches" element={<SLABreachPage />} />
            <Route path="/admin/escalations" element={<EscalationManagementPage />} />
            <Route path="/admin/audit-history" element={<AuditHistoryPage />} />
            <Route path="/admin/similar-cases" element={<SimilarCasesPage />} />
            <Route path="/admin/pending-audits" element={<PendingAuditsPage />} />
            {/* Citizen-facing pages */}
            <Route path="/my-grievances" element={<MyGrievancesPage />} />
            <Route path="/feedback/:grievanceId" element={<FeedbackPage />} />
            <Route path="/contest/:grievanceId" element={<ContestationPage />} />
            <Route path="/submit-voice" element={<VoiceSubmitPage />} />
            <Route path="/ai-assistant" element={<AIAssistantPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/verify/:grievanceId" element={<FieldVerificationPage />} />
            <Route path="/officer/field-verification" element={<FieldVerificationPage />} />
            <Route path="/officer/workflow" element={<OfficerWorkflowPage />} />
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
