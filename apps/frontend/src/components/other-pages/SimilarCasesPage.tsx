import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  Layers,
  Search,
  FileText,
  Clock,
  CheckCircle2,
  MapPin,
  Lightbulb,
  ArrowRight,
  RefreshCw,
  GitCompare,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { grievanceService } from "@/services/grievance.service";

interface GrievanceItem {
  id: string;
  grid_id: string;
  title: string;
  category: string;
  priority: string;
  status: string;
  created_at: string;
}

interface SimilarCase {
  grid_id: string;
  title: string;
  similarity_score: number;
  resolution_summary: string;
  resolution_time_hours: number;
  department: string;
}

const getSimilarityColor = (score: number) => {
  if (score >= 0.9) return "text-green-500";
  if (score >= 0.8) return "text-blue-500";
  if (score >= 0.7) return "text-amber-500";
  return "text-muted-foreground";
};

const normalizeGrievance = (g: any): GrievanceItem => ({
  id: String(g.id || ""),
  grid_id: String(g.grid_id || "N/A"),
  title: String(g.title || "Untitled Grievance"),
  category: String(g.category || "UNCLASSIFIED"),
  priority: String(g.priority || "NORMAL"),
  status: String(g.status || "CREATED"),
  created_at: String(g.created_at || new Date().toISOString()),
});

const SimilarCasesComponent: React.FC = () => {
  const [grievances, setGrievances] = useState<GrievanceItem[]>([]);
  const [query, setQuery] = useState("");
  const [loadingGrievances, setLoadingGrievances] = useState(true);
  const [loadingCases, setLoadingCases] = useState(false);
  const [selectedGrievance, setSelectedGrievance] = useState<GrievanceItem | null>(null);
  const [cases, setCases] = useState<SimilarCase[]>([]);

  const fetchGrievances = async () => {
    setLoadingGrievances(true);
    // DEMO MODE: Hardcoded list for instant loading
    await new Promise(resolve => setTimeout(resolve, 500));
    const demoGrievances: GrievanceItem[] = [
      { id: "g_1", grid_id: "GRI-2026-0045", title: "Frequent Power Surges in Block B", category: "Electricity", priority: "HIGH", status: "IN_PROGRESS", created_at: new Date().toISOString() },
      { id: "g_2", grid_id: "GRI-2026-0089", title: "Uncollected Garbage - Main Road", category: "Sanitation", priority: "MEDIUM", status: "CREATED", created_at: new Date().toISOString() },
      { id: "g_3", grid_id: "GRI-2026-0122", title: "Unauthorized Construction on Footpath", category: "Revenue", priority: "HIGH", status: "PENDING_VERIFICATION", created_at: new Date().toISOString() },
      { id: "g_4", grid_id: "GRI-2026-0156", title: "Street Light Pole Damage", category: "Lighting", priority: "LOW", status: "ASSIGNED", created_at: new Date().toISOString() },
      { id: "g_5", grid_id: "GRI-2026-0210", title: "Contaminated Water Supply", category: "Water", priority: "CRITICAL", status: "ESCALATED", created_at: new Date().toISOString() }
    ];
    setGrievances(demoGrievances);
    setLoadingGrievances(false);
  };

  useEffect(() => {
    void fetchGrievances();
  }, []);

  const fetchSimilarCases = async (grievance: GrievanceItem) => {
    setSelectedGrievance(grievance);
    setLoadingCases(true);
    // DEMO MODE: Pre-computed similarity results
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const demoCases: SimilarCase[] = [
      {
        grid_id: "HIST-2025-0922",
        title: "Fluctuating Voltage in Block A Substation",
        similarity_score: 0.94,
        resolution_summary: "Replaced 400kVA transformer primary fuse and updated load balancing software.",
        resolution_time_hours: 14,
        department: "Electricity Dept"
      },
      {
        grid_id: "HIST-2025-1104",
        title: "Transformer Leakage Near Industrial Area",
        similarity_score: 0.81,
        resolution_summary: "Cleaned insulator bushings and topped up dielectric oil. Sealed gasket leaks.",
        resolution_time_hours: 22,
        department: "Engineering Division"
      },
      {
        grid_id: "HIST-2024-0615",
        title: "Underground Cable Fault - Phase 1",
        similarity_score: 0.76,
        resolution_summary: "Located insulation breach using TDR. Splice and joint repair completed.",
        resolution_time_hours: 48,
        department: "Electricity Dept"
      }
    ];
    
    setCases(demoCases);
    setLoadingCases(false);
  };

  const filteredGrievances = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return grievances;
    return grievances.filter((g) => {
      return (
        g.grid_id.toLowerCase().includes(q) ||
        g.title.toLowerCase().includes(q) ||
        g.category.toLowerCase().includes(q) ||
        g.status.toLowerCase().includes(q)
      );
    });
  }, [grievances, query]);

  return (
    <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
      <Card className="xl:col-span-5 glass-card border-white/5 bg-white/[0.02]">
        <CardContent className="p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <FileText className="w-5 h-5 text-blue-500" />
              <div>
                <h3 className="font-bold">All Grievances</h3>
                <p className="text-xs text-muted-foreground">Select one grievance to find similar historical cases</p>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => void fetchGrievances()}
              className="border-white/10 bg-white/5"
            >
              <RefreshCw className="w-4 h-4" />
            </Button>
          </div>

          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by Grid ID, title, category"
              className="pl-9 border-white/10 bg-white/5"
            />
          </div>

          <div className="max-h-[520px] overflow-y-auto pr-1 space-y-3">
            {loadingGrievances && (
              <div className="p-4 rounded-xl border border-white/10 bg-white/[0.02] text-sm text-muted-foreground">
                Loading grievances...
              </div>
            )}

            {!loadingGrievances && filteredGrievances.length === 0 && (
              <div className="p-4 rounded-xl border border-white/10 bg-white/[0.02] text-sm text-muted-foreground">
                No grievances found.
              </div>
            )}

            {filteredGrievances.map((g, i) => (
              <motion.div
                key={g.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.02 }}
                className={`p-4 rounded-2xl border transition-all ${
                  selectedGrievance?.id === g.id
                    ? "bg-blue-500/5 border-blue-500/20"
                    : "bg-white/[0.02] border-white/5 hover:bg-white/[0.04]"
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="font-mono text-xs text-blue-500 truncate">{g.grid_id}</p>
                    <h4 className="font-bold text-sm mt-1 truncate">{g.title}</h4>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge variant="outline" className="text-[10px]">{g.category}</Badge>
                      <Badge variant="outline" className="text-[10px]">{g.status}</Badge>
                    </div>
                  </div>
                  <Button
                    size="sm"
                    onClick={() => void fetchSimilarCases(g)}
                    className="h-8 px-3 text-[10px] bg-blue-600 hover:bg-blue-500 text-white"
                  >
                    Similar Cases
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="xl:col-span-7 glass-card border-white/5 bg-white/[0.02]">
        <CardContent className="p-6 space-y-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <GitCompare className="w-5 h-5 text-blue-500" />
              <div>
                <h3 className="font-bold">Similar Historical Cases</h3>
                <p className="text-xs text-muted-foreground">Vector similarity search output</p>
              </div>
            </div>
            <Badge className="bg-blue-500/10 text-blue-500 border-blue-500/20">
              {cases.length} matches
            </Badge>
          </div>

          {!selectedGrievance && (
            <div className="p-6 rounded-2xl border border-dashed border-white/10 text-sm text-muted-foreground">
              Pick a grievance from the left panel and click Similar Cases to load matches.
            </div>
          )}

          {selectedGrievance && (
            <div className="p-4 rounded-2xl border border-white/10 bg-white/[0.02]">
              <p className="text-[10px] uppercase tracking-widest text-muted-foreground">Selected Grievance</p>
              <p className="font-mono text-xs text-blue-500 mt-1">{selectedGrievance.grid_id}</p>
              <p className="font-bold text-sm mt-1">{selectedGrievance.title}</p>
            </div>
          )}

          {loadingCases && (
            <div className="p-6 rounded-2xl border border-white/10 bg-white/[0.02] text-sm text-muted-foreground">
              Finding similar cases...
            </div>
          )}

          {!loadingCases && selectedGrievance && cases.length === 0 && (
            <div className="p-6 rounded-2xl border border-white/10 bg-white/[0.02] text-sm text-muted-foreground">
              No similar historical cases found for this grievance.
            </div>
          )}

          {!loadingCases && cases.length > 0 && (
            <div className="space-y-4">
              {cases.map((c, i) => (
                <motion.div
                  key={`${c.grid_id}-${i}`}
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="p-5 rounded-2xl border border-white/5 bg-white/[0.02]"
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

                  <div className="flex items-center gap-4 text-xs text-muted-foreground mb-3">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {c.resolution_time_hours}h resolution
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      {c.department}
                    </span>
                  </div>

                  <div className="mb-3">
                    <div className="flex justify-between text-[10px] mb-1">
                      <span className="text-muted-foreground">Similarity</span>
                      <span className={getSimilarityColor(c.similarity_score)}>{(c.similarity_score * 100).toFixed(0)}%</span>
                    </div>
                    <Progress value={c.similarity_score * 100} className="h-1 bg-white/5" />
                  </div>

                  <div className="p-4 rounded-xl bg-green-500/5 border border-green-500/10">
                    <div className="flex items-start gap-2">
                      <Lightbulb className="w-4 h-4 text-green-500 mt-0.5" />
                      <p className="text-sm text-muted-foreground">{c.resolution_summary}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          {selectedGrievance && cases.length > 0 && !loadingCases && (
            <div className="flex justify-end">
              <Button variant="outline" size="sm" className="border-white/10 bg-white/5">
                View All Similar Cases
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

const SimilarCasesPage = () => {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <main className="flex-grow pt-8 lg:pt-32 pb-12 px-6">
        <div className="container mx-auto max-w-7xl">
          <div className="flex items-center gap-3 mb-2">
            <Layers className="w-5 h-5 text-blue-500" />
            <span className="text-xs font-bold text-blue-500 uppercase tracking-widest">Vector Similarity Search</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-8">Similar Cases Explorer</h1>

          <SimilarCasesComponent />
        </div>
      </main>
    </div>
  );
};

export { SimilarCasesComponent };
export default SimilarCasesPage;
