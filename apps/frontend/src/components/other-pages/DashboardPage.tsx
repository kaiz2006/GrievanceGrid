import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Plus, Search, Filter, Clock, CheckCircle2, AlertCircle, MapPin, Calendar, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { grievanceService } from "@/services/grievance.service";

const DashboardPage = () => {
  const [grievances, setGrievances] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      console.log("[API CALL]: GET /grievances/me");
      await new Promise(resolve => setTimeout(resolve, 1000));
      setGrievances([
        {
          id: "GRI-2026-008821",
          title: "Street Light Failure",
          category: "Infrastructure",
          status: "In Progress",
          statusColor: "text-blue-500 bg-blue-500/10 border-blue-500/20",
          location: "Park Avenue, Sector 4",
          date: "2024-03-15",
          description: "Main street lights have been off for three days, creating safety concerns at night."
        },
        {
          id: "GRI-2026-007740",
          title: "Water Leakage",
          category: "Utilities",
          status: "Resolved",
          statusColor: "text-green-500 bg-green-500/10 border-green-500/20",
          location: "Oak Drive, Block B",
          date: "2024-03-12",
          description: "Major pipe burst near the community center is wasting significant water."
        }
      ]);
      setLoading(false);
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-muted-foreground font-mono uppercase tracking-widest text-xs">Syncing with Grid Dashboard...</p>
        </div>
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      
      <main className="flex-grow pt-32 pb-12 px-6">
        <div className="container mx-auto">
          {/* Header Section */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-12">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-2">Citizen Dashboard</h1>
              <p className="text-muted-foreground text-lg">Manage and track your reported grievances</p>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Button className="cta-button-primary h-14 px-8 text-base shadow-[0_0_20px_rgba(59,130,246,0.2)]" asChild>
                <a href="/submit">
                  <Plus className="mr-2 h-5 w-5" />
                  Report New Grievance
                </a>
              </Button>
            </motion.div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {[
              { label: "Active Reports", value: "12", icon: Clock, color: "text-blue-500" },
              { label: "Resolved Cases", value: "48", icon: CheckCircle2, color: "text-green-500" },
              { label: "Pending Review", value: "05", icon: AlertCircle, color: "text-yellow-500" }
            ].map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="glass-card p-8 flex items-center justify-between border-white/5 bg-white/[0.02]"
              >
                <div>
                  <p className="text-sm text-muted-foreground font-medium mb-1">{stat.label}</p>
                  <p className="text-4xl font-bold tracking-tight">{stat.value}</p>
                </div>
                <div className={`w-14 h-14 rounded-2xl bg-white/[0.03] border border-white/5 flex items-center justify-center ${stat.color}`}>
                  <stat.icon className="w-7 h-7" />
                </div>
              </motion.div>
            ))}
          </div>

          {/* Filters & Search */}
          <div className="flex flex-col md:flex-row gap-4 mb-8">
            <div className="relative flex-grow">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input 
                placeholder="Search by ID, title or location..." 
                className="pl-12 h-14 bg-white/[0.03] border-white/10 focus:border-blue-500/50 transition-all text-base"
              />
            </div>
            <Button variant="outline" className="h-14 px-6 border-white/10 bg-white/[0.03] hover:bg-white/[0.06] text-base">
              <Filter className="mr-2 h-5 w-5" />
              Filters
            </Button>
          </div>

          {/* Grievances List */}
          <div className="grid grid-cols-1 gap-6">
            {grievances.map((grievance, i) => (
              <motion.div
                key={grievance.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 + i * 0.1 }}
                whileHover={{ y: -4 }}
                className="group"
              >
                <Card className="glass-card border-white/5 bg-white/[0.01] hover:bg-white/[0.03] transition-all overflow-hidden">
                  <div className="absolute top-0 left-0 w-1 h-full bg-blue-500/40 group-hover:bg-blue-500 transition-colors" />
                  <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                    <div className="flex items-center gap-4">
                      <Badge className={`px-3 py-1 text-xs font-bold uppercase tracking-wider border ${grievance.statusColor}`}>
                        {grievance.status}
                      </Badge>
                      <span className="text-xs font-mono text-muted-foreground/60">{grievance.id}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      {grievance.date}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-4 gap-8">
                      <div className="md:col-span-3">
                        <CardTitle className="text-2xl font-bold mb-3 group-hover:text-blue-400 transition-colors">
                          {grievance.title}
                        </CardTitle>
                        <p className="text-muted-foreground leading-relaxed">
                          {grievance.description}
                        </p>
                      </div>
                      <div className="flex flex-col justify-center space-y-3">
                        <div className="flex items-center gap-3 text-sm font-medium text-foreground">
                          <MapPin className="h-4 w-4 text-blue-500" />
                          {grievance.location}
                        </div>
                        <div className="flex items-center gap-3 text-sm text-muted-foreground">
                          <span className="w-2 h-2 rounded-full bg-blue-500/50" />
                          {grievance.category}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="pt-2 border-t border-white/5 flex justify-end">
                    <Button variant="ghost" className="text-blue-500 hover:text-blue-400 hover:bg-transparent p-0 flex items-center group/btn" asChild>
                      <a href={`/track/${grievance.id}`}>
                        View Progress Tracking
                        <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
                      </a>
                    </Button>
                  </CardFooter>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </main>

      
    </div>
  );
};

export default DashboardPage;
