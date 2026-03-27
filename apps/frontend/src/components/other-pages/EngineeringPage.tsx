import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Activity, CheckCircle2, Clock, Cpu, FileText, Search } from "lucide-react";
import { grievanceService } from "@/services/grievance.service";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

type EngineeringGrievance = {
   id: string;
   grid_id: string;
   title: string;
   category?: string;
   priority?: string;
   status: string;
   description?: string;
   created_at?: string;
   resolved_at?: string;
   timeline?: Array<{ status?: string; timestamp?: string; description?: string }>;
};

const isSolvedStatus = (status?: string) => {
   const normalized = String(status || "").toUpperCase();
   return normalized === "RESOLVED" || normalized === "CLOSED";
};

const getResolvedTimestamp = (g: EngineeringGrievance) => {
   if (g.resolved_at) return g.resolved_at;
   const event = (g.timeline || []).find((t) => isSolvedStatus(t.status));
   return event?.timestamp || g.created_at || new Date().toISOString();
};

const getBeforeAfterNarrative = (g: EngineeringGrievance) => {
   const timeline = g.timeline || [];
   const firstEvent = timeline[timeline.length - 1] || timeline[0];
   const resolvedEvent = timeline.find((t) => isSolvedStatus(t.status)) || timeline[0];

   return {
      before:
         firstEvent?.description ||
         g.description ||
         "Initial field issue documented by complaint intake.",
      after:
         resolvedEvent?.description ||
         "Resolution completed and verified by engineering workflow.",
   };
};

const EngineeringPage = () => {
   const [loading, setLoading] = useState(true);
   const [solvedGrievances, setSolvedGrievances] = useState<EngineeringGrievance[]>([]);
   const [query, setQuery] = useState("");
   const [selectedId, setSelectedId] = useState<string | null>(null);

   useEffect(() => {
      const fetchSolved = async () => {
         setLoading(true);
         // DEMO MODE: Using hardcoded resolved grievances for Engineering Verification
         await new Promise(resolve => setTimeout(resolve, 800));
         
         const demoSolved: EngineeringGrievance[] = [
            {
               id: "eng_001",
               grid_id: "GRI-2026-000442",
               title: "Structural Crack in North Bridge Pylon",
               category: "Infrastructure",
               priority: "CRITICAL",
               status: "RESOLVED",
               description: "Deep structural fissure detected during routine inspection of the North Bridge pylon C-4.",
               created_at: new Date(Date.now() - 7 * 24 * 3600000).toISOString(),
               resolved_at: new Date(Date.now() - 2 * 24 * 3600000).toISOString(),
               timeline: [
                  { status: "RESOLVED", timestamp: new Date(Date.now() - 2 * 24 * 3600000).toISOString(), description: "Structural reinforcement successfully applied. Pylon integrity verified via ultrasonic testing." },
                  { status: "IN_PROGRESS", timestamp: new Date(Date.now() - 4 * 24 * 3600000).toISOString(), description: "Injecting high-tensile epoxy and installing carbon fiber wraps." },
                  { status: "FIELD_VERIFIED", timestamp: new Date(Date.now() - 5 * 24 * 3600000).toISOString(), description: "Engineering team confirmed depth of fissure is 4.5 inches. Immediate stabilization required." },
                  { status: "REPORTED", timestamp: new Date(Date.now() - 7 * 24 * 3600000).toISOString(), description: "System alert: Unusual vibration detected by sensor B-12." }
               ]
            },
            {
               id: "eng_002",
               grid_id: "GRI-2026-000512",
               title: "Transformer Overheating - Substation 9",
               category: "Power Grid",
               priority: "HIGH",
               status: "RESOLVED",
               description: "Substation 9 transformer T-2 exhibiting thermal runaway conditions (115°C).",
               created_at: new Date(Date.now() - 3 * 24 * 3600000).toISOString(),
               resolved_at: new Date(Date.now() - 3600000 * 5).toISOString(),
               timeline: [
                  { status: "RESOLVED", timestamp: new Date(Date.now() - 3600000 * 5).toISOString(), description: "Cooling system overhauled. Oil filtration complete. Load restored to 100%." },
                  { status: "IN_PROGRESS", timestamp: new Date(Date.now() - 3600000 * 12).toISOString(), description: "Emergency shutdown initiated. Replacing faulty radiator fans and heat sensors." },
                  { status: "REPORTED", timestamp: new Date(Date.now() - 3 * 24 * 3600000).toISOString(), description: "Thermal telemetry alert: Rapid temperature spike detected." }
               ]
            },
            {
               id: "eng_003",
               grid_id: "GRI-2026-000601",
               title: "Main Water Main Burst - Sector 12",
               category: "Water Supply",
               priority: "CRITICAL",
               status: "RESOLVED",
               description: "48-inch high-pressure water main rupture causing severe flooding on 5th Avenue.",
               created_at: new Date(Date.now() - 2 * 24 * 3600000).toISOString(),
               resolved_at: new Date(Date.now() - 3600000 * 2).toISOString(),
               timeline: [
                  { status: "RESOLVED", timestamp: new Date(Date.now() - 3600000 * 2).toISOString(), description: "Pipeline section replaced. Pressure testing successful. Road restoration in progress." },
                  { status: "IN_PROGRESS", timestamp: new Date(Date.now() - 3600000 * 15).toISOString(), description: "Excavating site. Isolating Segment 12-B for pipe bypass installation." },
                  { status: "REPORTED", timestamp: new Date(Date.now() - 2 * 24 * 3600000).toISOString(), description: "Multiple reports of low pressure and surface flooding." }
               ]
            },
            {
               id: "eng_004",
               grid_id: "GRI-2026-000688",
               title: "Smart Traffic Signal Controller Defect",
               category: "Traffic Management",
               priority: "MEDIUM",
               status: "RESOLVED",
               description: "AI controller unit #ST-094 malfunctioning, causing irregular signal cycles at Central Junction.",
               created_at: new Date(Date.now() - 5 * 24 * 3600000).toISOString(),
               resolved_at: new Date(Date.now() - 24 * 3600000).toISOString(),
               timeline: [
                  { status: "RESOLVED", timestamp: new Date(Date.now() - 24 * 3600000).toISOString(), description: "Firmware v4.2.1 patched. Hardware diagnostic pass. Synchronization verified." },
                  { status: "IN_PROGRESS", timestamp: new Date(Date.now() - 3 * 24 * 3600000).toISOString(), description: "Analyzing logic logs. Identified memory leak in pedestrian detection module." },
                  { status: "REPORTED", timestamp: new Date(Date.now() - 5 * 24 * 3600000).toISOString(), description: "Citizen reports of persistent red light for over 10 minutes." }
               ]
            }
         ];

         setSolvedGrievances(demoSolved);
         setSelectedId(demoSolved[0]?.id || null);
         setLoading(false);
      };
      void fetchSolved();
   }, []);

   const filtered = useMemo(() => {
      const q = query.trim().toLowerCase();
      if (!q) return solvedGrievances;
      return solvedGrievances.filter((g) => {
         return (
            g.grid_id?.toLowerCase().includes(q) ||
            g.title?.toLowerCase().includes(q) ||
            g.category?.toLowerCase().includes(q)
         );
      });
   }, [query, solvedGrievances]);

   const selected = filtered.find((g) => g.id === selectedId) || filtered[0] || null;
   const narrative = selected ? getBeforeAfterNarrative(selected) : null;

   return (
      <div className="min-h-screen bg-background text-foreground flex flex-col">
         <main className="flex-grow pt-8 lg:pt-32 pb-12 px-6 relative">
            <div className="container mx-auto max-w-7xl">
               <div className="mb-8 rounded-[2rem] border border-white/5 bg-white/[0.02] p-8">
                  <div className="flex items-center gap-3 mb-2">
                     <Cpu className="w-5 h-5 text-blue-500" />
                     <span className="text-[10px] font-black text-blue-500 uppercase tracking-[0.2em]">Engineering Verification</span>
                  </div>
                  <h1 className="text-4xl md:text-5xl font-black tracking-tight italic text-white">Resolved Grievance Analysis</h1>
                  <p className="text-muted-foreground mt-2">Open any solved grievance to inspect before/after verification details.</p>
               </div>

               <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
                  <section className="xl:col-span-4 rounded-[2rem] border border-white/5 bg-white/[0.02] p-6">
                     <div className="flex items-center justify-between mb-4">
                        <h2 className="text-sm font-black uppercase tracking-[0.2em] text-blue-500">Solved Grievances</h2>
                        <Badge className="bg-emerald-500/10 border-emerald-500/20 text-emerald-400">{filtered.length}</Badge>
                     </div>

                     <div className="relative mb-4">
                        <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                        <Input
                           value={query}
                           onChange={(e) => setQuery(e.target.value)}
                           placeholder="Search solved grievances"
                           className="pl-9 bg-black/30 border-white/10"
                        />
                     </div>

                     <div className="space-y-3 max-h-[630px] overflow-y-auto pr-1">
                        {loading && <p className="text-xs text-muted-foreground">Loading solved grievances...</p>}

                        {!loading && filtered.length === 0 && (
                           <div className="rounded-xl border border-white/10 bg-black/30 p-4 text-xs text-muted-foreground">
                              No solved grievances found.
                           </div>
                        )}

                        {filtered.map((g) => {
                           const active = selected?.id === g.id;
                           return (
                              <button
                                 key={g.id}
                                 onClick={() => setSelectedId(g.id)}
                                 className={`w-full text-left rounded-2xl border p-4 transition-all ${
                                    active
                                       ? "border-blue-500/40 bg-blue-500/10"
                                       : "border-white/10 bg-black/30 hover:border-white/20"
                                 }`}
                              >
                                 <div className="flex items-start justify-between gap-3 mb-2">
                                    <p className="text-[10px] font-black uppercase tracking-widest text-blue-400">{g.grid_id}</p>
                                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                                 </div>
                                 <p className="text-sm font-bold text-white line-clamp-2">{g.title}</p>
                                 <div className="mt-3 flex items-center justify-between text-[10px] uppercase tracking-widest text-muted-foreground">
                                    <span>{g.category || "General"}</span>
                                    <span>{new Date(getResolvedTimestamp(g)).toLocaleDateString()}</span>
                                 </div>
                              </button>
                           );
                        })}
                     </div>
                  </section>

                  <section className="xl:col-span-8 rounded-[2rem] border border-white/5 bg-white/[0.02] p-6 md:p-8">
                     {!selected && (
                        <div className="h-[620px] rounded-2xl border border-dashed border-white/10 flex items-center justify-center text-muted-foreground">
                           Select a solved grievance to view before/after analysis.
                        </div>
                     )}

                     {selected && narrative && (
                        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                           <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                              <div>
                                 <p className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-500 mb-1">Analysis Case</p>
                                 <h2 className="text-2xl md:text-3xl font-black italic text-white tracking-tight">{selected.title}</h2>
                              </div>
                              <div className="flex gap-2">
                                 <Badge className="bg-white/10 border-white/20 text-white">{selected.grid_id}</Badge>
                                 <Badge className="bg-emerald-500/10 border-emerald-500/20 text-emerald-400">Solved</Badge>
                              </div>
                           </div>

                           <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                              <article className="relative min-h-[320px] overflow-hidden rounded-[2rem] border border-white/10 bg-black/40">
                                 <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1581092160562-40aa08e78837?auto=format&fit=crop&q=80&w=1200')] bg-cover opacity-25 grayscale" />
                                 <div className="absolute inset-0 bg-gradient-to-t from-black/85 to-transparent" />
                                 <div className="relative z-10 p-6 flex h-full flex-col justify-end">
                                    <p className="text-[10px] font-black uppercase tracking-widest text-amber-400 mb-2">Before</p>
                                    <p className="text-sm text-white/90 leading-relaxed">{narrative.before}</p>
                                 </div>
                              </article>

                              <article className="relative min-h-[320px] overflow-hidden rounded-[2rem] border border-blue-500/30 bg-black/40">
                                 <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1581094281212-d1987adae50e?auto=format&fit=crop&q=80&w=1200')] bg-cover opacity-60" />
                                 <div className="absolute inset-0 bg-gradient-to-t from-blue-950/70 to-transparent" />
                                 <div className="relative z-10 p-6 flex h-full flex-col justify-end">
                                    <p className="text-[10px] font-black uppercase tracking-widest text-blue-400 mb-2">After</p>
                                    <p className="text-sm text-white/95 leading-relaxed">{narrative.after}</p>
                                 </div>
                              </article>
                           </div>

                           <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                              <div className="rounded-2xl border border-white/10 bg-black/30 p-4">
                                 <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1">Status</p>
                                 <p className="text-lg font-black text-emerald-400">{selected.status}</p>
                              </div>
                              <div className="rounded-2xl border border-white/10 bg-black/30 p-4">
                                 <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1">Priority</p>
                                 <p className="text-lg font-black text-amber-400">{selected.priority || "NORMAL"}</p>
                              </div>
                              <div className="rounded-2xl border border-white/10 bg-black/30 p-4">
                                 <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1">Resolved On</p>
                                 <p className="text-lg font-black text-blue-400">{new Date(getResolvedTimestamp(selected)).toLocaleDateString()}</p>
                              </div>
                           </div>

                           <div className="rounded-2xl border border-white/10 bg-black/30 p-5">
                              <div className="flex items-center gap-2 mb-3">
                                 <Activity className="w-4 h-4 text-blue-500" />
                                 <p className="text-[10px] font-black uppercase tracking-widest text-blue-500">Resolution Timeline</p>
                              </div>
                              <div className="space-y-3">
                                 {(selected.timeline || []).slice(0, 6).map((t, idx) => (
                                    <div key={`${t.timestamp || idx}`} className="flex items-start gap-3 text-xs">
                                       <Clock className="w-3.5 h-3.5 text-muted-foreground mt-0.5" />
                                       <div>
                                          <p className="text-white font-bold uppercase tracking-wide">{t.status || "EVENT"}</p>
                                          <p className="text-muted-foreground">{t.description || "No event description"}</p>
                                       </div>
                                    </div>
                                 ))}
                              </div>
                           </div>
                        </motion.div>
                     )}
                  </section>
               </div>
            </div>
         </main>
      </div>
   );
};

export default EngineeringPage;
