import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useParams, Link } from "react-router-dom";
import {
  AlertTriangle,
  ArrowLeft,
  Camera,
  MessageSquare,
  Send,
  CheckCircle2,
  AlertCircle,
  RotateCcw,
  FileText
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { grievanceService } from "@/services/grievance.service";

const ContestationPage = () => {
  const { grievanceId } = useParams();
  const [grievance, setGrievance] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [reason, setReason] = useState("");
  const [evidencePhoto, setEvidencePhoto] = useState<File | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [auditId, setAuditId] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      if (!grievanceId) return;
      setLoading(true);
      const result = await grievanceService.getDetail(grievanceId);
      setGrievance(result);
      setLoading(false);
    };
    fetchData();
  }, [grievanceId]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setEvidencePhoto(e.target.files[0]);
    }
  };

  const handleSubmit = async () => {
    if (!grievanceId || !reason.trim()) return;
    
    setSubmitting(true);
    const result = await grievanceService.contest(grievanceId, reason, evidencePhoto ? "photo_url" : undefined);
    setAuditId(result.audit_id);
    setSubmitting(false);
    setSubmitted(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-4 border-amber-600 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-muted-foreground font-mono uppercase tracking-widest text-xs">Loading...</p>
        </div>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-background text-foreground flex flex-col">
        <main className="flex-grow pt-8 lg:pt-32 pb-12 px-6">
          <div className="container mx-auto max-w-2xl">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="text-center py-16"
            >
              <div className="w-24 h-24 rounded-full bg-amber-500/10 flex items-center justify-center mx-auto mb-6">
                <CheckCircle2 className="w-12 h-12 text-amber-500" />
              </div>
              <h1 className="text-3xl font-bold mb-4">Contestation Submitted</h1>
              <p className="text-muted-foreground mb-4">
                Your case has been queued for AI audit. An officer will review your submission.
              </p>
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 mb-8">
                <p className="text-xs text-muted-foreground uppercase tracking-widest mb-1">Audit ID</p>
                <p className="font-mono text-lg text-amber-500">{auditId}</p>
              </div>
              <div className="flex gap-4 justify-center">
                <Button asChild>
                  <Link to="/my-grievances">View My Grievances</Link>
                </Button>
                <Button variant="outline" asChild>
                  <Link to="/">Go Home</Link>
                </Button>
              </div>
            </motion.div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <main className="flex-grow pt-8 lg:pt-32 pb-12 px-6 relative overflow-hidden">
        {/* Ambient Glow */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-red-500/5 rounded-full blur-[150px] pointer-events-none" />

        <div className="container mx-auto max-w-2xl">
          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <Button variant="ghost" size="icon" className="h-10 w-10" asChild>
              <Link to="/my-grievances">
                <ArrowLeft className="w-5 h-5" />
              </Link>
            </Button>
            <div>
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-amber-500" />
                <h1 className="text-3xl font-bold tracking-tight">Contest Resolution</h1>
              </div>
              <p className="text-muted-foreground">Request a review if you're not satisfied with the resolution</p>
            </div>
          </div>

          {/* Warning Card */}
          <Card className="glass-card border-amber-500/20 bg-amber-500/5 mb-8">
            <CardContent className="p-6 flex items-start gap-4">
              <AlertCircle className="w-6 h-6 text-amber-500 shrink-0 mt-0.5" />
              <div>
                <h3 className="font-bold text-amber-500 mb-1">Before You Contest</h3>
                <p className="text-sm text-muted-foreground">
                  Please ensure you have valid evidence that the issue was not properly resolved. 
                  False contestations may delay genuine grievances. An AI audit will be triggered 
                  to verify your claim.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Grievance Info */}
          <Card className="glass-card border-white/5 bg-white/[0.02] mb-8">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-2">
                <span className="font-mono text-sm text-blue-500">{grievance?.grid_id}</span>
                <span className="px-2 py-0.5 rounded-full bg-green-500/10 text-green-500 text-xs font-bold">RESOLVED</span>
              </div>
              <h3 className="text-lg font-bold">{grievance?.title}</h3>
              <p className="text-sm text-muted-foreground mt-1">{grievance?.description}</p>
            </CardContent>
          </Card>

          {/* Contestation Form */}
          <Card className="glass-card border-white/5 bg-white/[0.02]">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <RotateCcw className="w-5 h-5 text-red-500" />
                Contestation Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Reason */}
              <div>
                <label className="text-sm font-medium mb-2 block flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-muted-foreground" />
                  Why are you contesting this resolution? *
                </label>
                <Textarea
                  placeholder="Explain why the resolution is unsatisfactory. Be specific about what was not done properly..."
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  className="bg-white/5 border-white/10 min-h-[150px] resize-none"
                />
              </div>

              {/* Evidence Photo */}
              <div>
                <label className="text-sm font-medium mb-2 block flex items-center gap-2">
                  <Camera className="w-4 h-4 text-muted-foreground" />
                  Upload Evidence Photo (Optional)
                </label>
                <div className="border-2 border-dashed border-white/10 rounded-2xl p-8 text-center hover:border-white/20 transition-colors">
                  {evidencePhoto ? (
                    <div className="space-y-2">
                      <FileText className="w-8 h-8 text-blue-500 mx-auto" />
                      <p className="text-sm font-medium">{evidencePhoto.name}</p>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setEvidencePhoto(null)}
                        className="text-red-500"
                      >
                        Remove
                      </Button>
                    </div>
                  ) : (
                    <label className="cursor-pointer block">
                      <Camera className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                      <p className="text-sm text-muted-foreground">Click to upload photo evidence</p>
                      <p className="text-xs text-muted-foreground/60 mt-1">Supports JPG, PNG up to 10MB</p>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="hidden"
                      />
                    </label>
                  )}
                </div>
              </div>

              {/* Submit */}
              <Button
                className="w-full h-14 bg-amber-600 hover:bg-amber-500"
                disabled={!reason.trim() || submitting}
                onClick={handleSubmit}
              >
                {submitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5 mr-2" />
                    Submit Contestation
                  </>
                )}
              </Button>

              {!reason.trim() && (
                <p className="text-xs text-amber-500 flex items-center justify-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  Please provide a reason for contestation
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default ContestationPage;
