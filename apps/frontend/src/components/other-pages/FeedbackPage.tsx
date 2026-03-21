import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  Star,
  MessageSquare,
  CheckCircle2,
  ArrowLeft,
  ThumbsUp,
  ThumbsDown,
  Send,
  AlertCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { grievanceService } from "@/services/grievance.service";

const FeedbackPage = () => {
  const { grievanceId } = useParams();
  const navigate = useNavigate();
  const [grievance, setGrievance] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");
  const [isSatisfied, setIsSatisfied] = useState<boolean | null>(null);
  const [submitted, setSubmitted] = useState(false);

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

  const handleSubmit = async () => {
    if (!grievanceId || rating === 0) return;
    
    setSubmitting(true);
    await grievanceService.submitFeedback(grievanceId, {
      rating,
      comment,
      is_satisfied: isSatisfied || false
    });
    setSubmitting(false);
    setSubmitted(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto" />
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
              <div className="w-24 h-24 rounded-full bg-green-500/10 flex items-center justify-center mx-auto mb-6">
                <CheckCircle2 className="w-12 h-12 text-green-500" />
              </div>
              <h1 className="text-3xl font-bold mb-4">Thank You!</h1>
              <p className="text-muted-foreground mb-8">Your feedback helps us improve our services.</p>
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
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-green-500/5 rounded-full blur-[150px] pointer-events-none" />

        <div className="container mx-auto max-w-2xl">
          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <Button variant="ghost" size="icon" className="h-10 w-10" asChild>
              <Link to="/my-grievances">
                <ArrowLeft className="w-5 h-5" />
              </Link>
            </Button>
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Rate Resolution</h1>
              <p className="text-muted-foreground">Share your feedback on the resolved grievance</p>
            </div>
          </div>

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

          {/* Feedback Form */}
          <Card className="glass-card border-white/5 bg-white/[0.02]">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <Star className="w-5 h-5 text-amber-500" />
                Your Rating
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Star Rating */}
              <div className="text-center py-4">
                <p className="text-sm text-muted-foreground mb-4">How would you rate the resolution?</p>
                <div className="flex justify-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      onClick={() => setRating(star)}
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                      className="p-2 transition-transform hover:scale-110"
                    >
                      <Star
                        className={`w-10 h-10 transition-colors ${
                          star <= (hoverRating || rating)
                            ? "fill-amber-500 text-amber-500"
                            : "text-muted-foreground/30"
                        }`}
                      />
                    </button>
                  ))}
                </div>
                <p className="text-sm font-medium mt-2">
                  {rating === 1 && "Very Dissatisfied"}
                  {rating === 2 && "Dissatisfied"}
                  {rating === 3 && "Neutral"}
                  {rating === 4 && "Satisfied"}
                  {rating === 5 && "Very Satisfied"}
                </p>
              </div>

              {/* Satisfaction Toggle */}
              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => setIsSatisfied(true)}
                  className={`p-4 rounded-2xl border transition-all flex flex-col items-center gap-2 ${
                    isSatisfied === true
                      ? "bg-green-500/10 border-green-500/30 text-green-500"
                      : "bg-white/5 border-white/10 hover:bg-white/10"
                  }`}
                >
                  <ThumbsUp className="w-6 h-6" />
                  <span className="text-sm font-bold">Satisfied</span>
                </button>
                <button
                  onClick={() => setIsSatisfied(false)}
                  className={`p-4 rounded-2xl border transition-all flex flex-col items-center gap-2 ${
                    isSatisfied === false
                      ? "bg-red-500/10 border-red-500/30 text-red-500"
                      : "bg-white/5 border-white/10 hover:bg-white/10"
                  }`}
                >
                  <ThumbsDown className="w-6 h-6" />
                  <span className="text-sm font-bold">Not Satisfied</span>
                </button>
              </div>

              {/* Comment */}
              <div>
                <label className="text-sm font-medium mb-2 block flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-muted-foreground" />
                  Additional Comments (Optional)
                </label>
                <Textarea
                  placeholder="Tell us more about your experience..."
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  className="bg-white/5 border-white/10 min-h-[120px] resize-none"
                />
              </div>

              {/* Submit */}
              <Button
                className="w-full h-14 bg-blue-600 hover:bg-blue-500"
                disabled={rating === 0 || submitting}
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
                    Submit Feedback
                  </>
                )}
              </Button>

              {rating === 0 && (
                <p className="text-xs text-amber-500 flex items-center justify-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  Please select a rating to continue
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default FeedbackPage;
