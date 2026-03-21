import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Search,
  FileText,
  Clock,
  CheckCircle2,
  MapPin,
  TrendingUp,
  AlertTriangle,
  Lightbulb,
  ArrowRight,
  Filter,
  RefreshCw,
  Layers
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface SimilarCase {
  id: string;
  grid_id: string;
  title: string;
  category: string;
  priority: string;
  status: string;
  resolution_summary: string;
  resolution_time_hours: number;
  similarity_score: number;
  department: string;
  resolved_at: string;
}

interface SimilarCasesProps {
  grievanceId?: string;
  category?: string;
  description?: string;
}

const SimilarCasesComponent: React.FC<SimilarCasesProps> = ({ grievanceId, category, description }) => {
  const [cases, setCases] = useState<SimilarCase[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCase, setSelectedCase] = useState<SimilarCase | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      // Simulating vector similarity search from Qdrant
      await new Promise((resolve) => setTimeout(resolve, 400));
      setCases([
        {
          id: "case_001",
          grid_id: "GRI-2026-000089",
          title: "Pothole on Sector 15 Main Road",
          category: "ROADS",
          priority: "HIGH",
          status: "RESOLVED",
          resolution_summary: "Filled with asphalt mix, leveled with road surface. Applied sealant for durability.",
          resolution_time_hours: 18,
          similarity_score: 0.94,
          department: "PWD",
          resolved_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
        },
        {
          id: "case_002",
          grid_id: "GRI-2026-000067",
          title: "Road damage near traffic signal",
          category: "ROADS",
          priority: "HIGH",
          status: "RESOLVED",
          resolution_summary: "Emergency repair completed. Full resurfacing scheduled for next quarter.",
          resolution_time_hours: 24,
          similarity_score: 0.87,
          department: "PWD",
          resolved_at: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString()
        },
        {
          id: "case_003",
          grid_id: "GRI-2026-000045",
          title: "Large crater on highway service road",
          category: "ROADS",
          priority: "CRITICAL",
          status: "RESOLVED",
          resolution_summary: "Major repair with concrete base. Required traffic diversion for 6 hours.",
          resolution_time_hours: 12,
          similarity_score: 0.82,
          department: "PWD",
          resolved_at: new Date(Date.now() - 21 * 24 * 60 * 60 * 1000).toISOString()
        },
        {
          id: "case_004",
          grid_id: "GRI-2026-000023",
          title: "Broken road divider causing accidents",
          category: "ROADS",
          priority: "HIGH",
          status: "RESOLVED",
          resolution_summary: "Replaced divider section. Added reflective paint for visibility.",
          resolution_time_hours: 8,
          similarity_score: 0.76,
          department: "PWD",
          resolved_at: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()
        }
      ]);
      setLoading(false);
    };
    fetchData();
  }, [grievanceId, category]);

  const getSimilarityColor = (score: number) => {
    if (score >= 0.9) return "text-green-500";
    if (score >= 0.8) return "text-blue-500";
    if (score >= 0.7) return "text-amber-500";
    return "text-muted-foreground";
  };

  if (loading) {
    return (
      <div className="p-8">
        <div className="flex items-center justify-center gap-4">
          <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-muted-foreground text-sm">Finding similar cases...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Layers className="w-5 h-5 text-blue-500" />
          <div>
            <h3 className="font-bold">Similar Historical Cases</h3>
            <p className="text-xs text-muted-foreground">Vector similarity search via Qdrant</p>
          </div>
        </div>
        <Badge className="bg-blue-500/10 text-blue-500 border-blue-500/20">
          {cases.length} matches
        </Badge>
      </div>

      {/* Cases Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {cases.map((c, i) => (
          <motion.div
            key={c.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            onClick={() => setSelectedCase(selectedCase?.id === c.id ? null : c)}
            className={`p-5 rounded-2xl border transition-all cursor-pointer ${
              selectedCase?.id === c.id 
                ? "bg-blue-500/5 border-blue-500/20" 
                : "bg-white/[0.02] border-white/5 hover:bg-white/[0.04]"
            }`}
          >
            <div className="flex items-start justify-between mb-3">
              <div>
                <p className="font-mono text-xs text-blue-500">{c.grid_id}</p>
                <h4 className="font-bold text-sm mt-1">{c.title}</h4>
              </div>
              <span className={`text-sm font-bold ${getSimilarityColor(c.similarity_score)}`}>
                {(c.similarity_score * 100).toFixed(0)}%
              </span>
            </div>

            <div className="flex items-center gap-3 mb-3">
              <Badge variant="outline" className="text-[10px]">{c.category}</Badge>
              <Badge variant="outline" className={`text-[10px] ${c.priority === "CRITICAL" ? "text-red-500" : c.priority === "HIGH" ? "text-amber-500" : ""}`}>
                {c.priority}
              </Badge>
              <Badge className="bg-green-500/10 text-green-500 border-green-500/20 text-[10px]">
                <CheckCircle2 className="w-3 h-3 mr-1" />
                Resolved
              </Badge>
            </div>

            <div className="flex items-center gap-4 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {c.resolution_time_hours}h resolution
              </span>
              <span className="flex items-center gap-1">
                <MapPin className="w-3 h-3" />
                {c.department}
              </span>
            </div>

            {/* Similarity Progress */}
            <div className="mt-3">
              <div className="flex justify-between text-[10px] mb-1">
                <span className="text-muted-foreground">Similarity</span>
                <span className={getSimilarityColor(c.similarity_score)}>{(c.similarity_score * 100).toFixed(0)}%</span>
              </div>
              <Progress value={c.similarity_score * 100} className="h-1 bg-white/5" />
            </div>
          </motion.div>
        ))}
      </div>

      {/* Selected Case Resolution */}
      {selectedCase && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          className="p-6 rounded-2xl bg-green-500/5 border border-green-500/10"
        >
          <div className="flex items-start gap-3 mb-4">
            <Lightbulb className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
            <div>
              <h4 className="font-bold text-green-500 mb-1">Resolution Strategy</h4>
              <p className="text-sm text-muted-foreground">{selectedCase.resolution_summary}</p>
            </div>
          </div>
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <span>Resolved in {selectedCase.resolution_time_hours} hours</span>
            <span>•</span>
            <span>By {selectedCase.department}</span>
            <span>•</span>
            <span>{new Date(selectedCase.resolved_at).toLocaleDateString()}</span>
          </div>
        </motion.div>
      )}

      {/* Action */}
      <div className="flex justify-end">
        <Button variant="outline" size="sm" className="border-white/10 bg-white/5">
          View All Similar Cases
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </div>
  );
};

// Standalone page version
const SimilarCasesPage = () => {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <main className="flex-grow pt-8 lg:pt-32 pb-12 px-6">
        <div className="container mx-auto max-w-4xl">
          <div className="flex items-center gap-3 mb-2">
            <Layers className="w-5 h-5 text-blue-500" />
            <span className="text-xs font-bold text-blue-500 uppercase tracking-widest">Vector Similarity Search</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-8">Similar Cases Explorer</h1>

          <Card className="glass-card border-white/5 bg-white/[0.02]">
            <CardContent className="p-8">
              <SimilarCasesComponent category="ROADS" description="Pothole on main road" />
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export { SimilarCasesComponent };
export default SimilarCasesPage;
