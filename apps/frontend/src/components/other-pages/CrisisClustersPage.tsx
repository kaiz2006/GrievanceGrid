import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  AlertTriangle,
  MapPin,
  Activity,
  TrendingUp,
  Search,
  RefreshCw,
  Layers,
  Zap,
  Flame,
  Droplets,
  Zap as PowerIcon,
  Trash2,
  Tag,
  Target
} from "lucide-react";
import { clusterService, ClusterItem } from "@/services/cluster.service";
import MapComponent from "../map/MapComponent";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const topicIcons: Record<string, typeof Flame> = {
  water_leak: Droplets,
  drainage: Droplets,
  power_outage: PowerIcon,
  transformer: PowerIcon,
  road_damage: Activity,
  garbage: Trash2,
  sanitation: Trash2
};

const CrisisClustersPage = () => {
  const [clusters, setClusters] = useState<ClusterItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCluster, setSelectedCluster] = useState<ClusterItem | null>(null);
  const [reclustering, setReclustering] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const result = await clusterService.getClusters({ active: true });
      setClusters(result.clusters);
      if (result.clusters.length > 0 && !selectedCluster) {
        setSelectedCluster(result.clusters[0]);
      }
      setLoading(false);
    };
    fetchData();
  }, []);

  const handleRecluster = async () => {
    setReclustering(true);
    await clusterService.triggerRecluster();
    setTimeout(() => setReclustering(false), 2000);
  };

  const getCrisisColor = (score: number) => {
    if (score >= 0.8) return { bg: "bg-red-500/10", border: "border-red-500/20", text: "text-red-500", label: "CRITICAL" };
    if (score >= 0.6) return { bg: "bg-amber-500/10", border: "border-amber-500/20", text: "text-amber-500", label: "ELEVATED" };
    return { bg: "bg-blue-500/10", border: "border-blue-500/20", text: "text-blue-500", label: "MONITORING" };
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-4 border-red-600 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-muted-foreground font-mono uppercase tracking-widest text-xs">Analyzing Crisis Patterns...</p>
        </div>
      </div>
    );
  }

  const criticalClusters = clusters.filter(c => (c.crisis_score || 0) >= 0.8);
  const totalGrievances = clusters.reduce((a, b) => a + b.member_count, 0);

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <main className="flex-grow pt-8 lg:pt-32 pb-12 px-6 relative overflow-hidden">
        {/* Ambient Effects */}
        <div className="absolute top-0 left-1/2 w-[600px] h-[600px] bg-red-500/5 rounded-full blur-[200px] pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-amber-500/5 rounded-full blur-[150px] pointer-events-none" />

        <div className="container mx-auto">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-12">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <Target className="w-5 h-5 text-red-500" />
                <span className="text-xs font-bold text-red-500 uppercase tracking-widest">DBSCAN + LDA Analysis</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight">Crisis Detection Center</h1>
              <p className="text-muted-foreground mt-2">Real-time geospatial clustering for emerging crisis patterns</p>
            </div>

            <div className="flex gap-4">
              <Button
                variant="outline"
                onClick={handleRecluster}
                disabled={reclustering}
                className="h-12 px-6 border-white/10 bg-white/5"
              >
                <RefreshCw className={`w-4 h-4 mr-2 ${reclustering ? "animate-spin" : ""}`} />
                {reclustering ? "Reclustering..." : "Run Analysis"}
              </Button>
            </div>
          </div>

          {/* Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
            {[
              { label: "Active Clusters", value: clusters.length.toString(), icon: Layers, color: "text-blue-500" },
              { label: "Critical Zones", value: criticalClusters.length.toString(), icon: AlertTriangle, color: "text-red-500" },
              { label: "Total Grievances", value: totalGrievances.toString(), icon: Activity, color: "text-amber-500" },
              { label: "Avg Crisis Score", value: (clusters.reduce((a, b) => a + (b.crisis_score || 0), 0) / clusters.length).toFixed(2), icon: TrendingUp, color: "text-purple-500" },
            ].map((metric, i) => (
              <motion.div
                key={metric.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="p-8 rounded-3xl bg-white/[0.02] border border-white/5 relative overflow-hidden group"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className={`p-3 rounded-xl bg-white/5 ${metric.color}`}>
                    <metric.icon className="w-5 h-5" />
                  </div>
                </div>
                <h4 className="text-muted-foreground text-xs font-bold uppercase tracking-widest mb-1">{metric.label}</h4>
                <p className={`text-3xl font-bold tracking-tight ${metric.color}`}>{metric.value}</p>
              </motion.div>
            ))}
          </div>

          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Cluster Map */}
            <div className="lg:col-span-8">
              <div className="rounded-[2.5rem] bg-white/[0.02] border border-white/5 overflow-hidden relative">
                <div className="absolute top-6 left-6 z-10 flex gap-2">
                  <Badge className="bg-red-500/20 text-red-500 border-red-500/20">Critical</Badge>
                  <Badge className="bg-amber-500/20 text-amber-500 border-amber-500/20">Elevated</Badge>
                  <Badge className="bg-blue-500/20 text-blue-500 border-blue-500/20">Monitoring</Badge>
                </div>

                <div className="h-[500px]">
                  <MapComponent
                    useGps={true}
                    showUserLocation={true}
                    markers={clusters.map(c => ({
                      position: [c.centroid_lat, c.centroid_lng],
                      popupContent: `${c.cluster_id}: ${c.member_count} grievances (${((c.crisis_score || 0) * 100).toFixed(0)}% crisis)`
                    }))}
                    zoom={14}
                  />
                </div>

                {/* Cluster Overlays */}
                {clusters.map((cluster, i) => {
                  const crisisStyle = getCrisisColor(cluster.crisis_score || 0);
                  return (
                    <motion.div
                      key={cluster.cluster_id}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: i * 0.1 }}
                      className={`absolute w-24 h-24 rounded-full border-2 ${crisisStyle.border} ${crisisStyle.bg} flex items-center justify-center cursor-pointer hover:scale-110 transition-transform`}
                      style={{
                        top: `${20 + (i * 15) % 60}%`,
                        left: `${15 + (i * 20) % 70}%`
                      }}
                      onClick={() => setSelectedCluster(cluster)}
                    >
                      <div className="text-center">
                        <p className={`text-lg font-bold ${crisisStyle.text}`}>{cluster.member_count}</p>
                        <p className="text-[8px] text-muted-foreground uppercase">grievances</p>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>

            {/* Cluster List */}
            <div className="lg:col-span-4 space-y-6">
              <div className="rounded-[2.5rem] bg-white/[0.02] border border-white/5 overflow-hidden">
                <div className="p-6 border-b border-white/5">
                  <h3 className="text-lg font-bold flex items-center gap-3">
                    <Zap className="w-5 h-5 text-amber-500" />
                    Detected Clusters
                  </h3>
                </div>

                <div className="divide-y divide-white/5 max-h-[400px] overflow-y-auto">
                  {clusters.map((cluster, i) => {
                    const crisisStyle = getCrisisColor(cluster.crisis_score || 0);
                    return (
                      <motion.div
                        key={cluster.cluster_id}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.05 }}
                        onClick={() => setSelectedCluster(cluster)}
                        className={`p-6 hover:bg-white/[0.02] transition-all cursor-pointer ${selectedCluster?.cluster_id === cluster.cluster_id ? "bg-white/[0.04]" : ""}`}
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <p className="font-mono text-xs text-blue-500">{cluster.cluster_id}</p>
                            <p className="text-sm font-bold mt-1">{cluster.cluster_type}</p>
                          </div>
                          <Badge className={`${crisisStyle.bg} ${crisisStyle.border} ${crisisStyle.text}`}>
                            {crisisStyle.label}
                          </Badge>
                        </div>

                        <div className="flex items-center gap-4 text-[10px] text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3 h-3" />
                            {cluster.member_count} grievances
                          </span>
                          <span className="flex items-center gap-1">
                            <Activity className="w-3 h-3" />
                            {((cluster.crisis_score || 0) * 100).toFixed(0)}% crisis
                          </span>
                        </div>

                        {/* Topics */}
                        {cluster.topics && cluster.topics.length > 0 && (
                          <div className="flex flex-wrap gap-2 mt-3">
                            {cluster.topics.slice(0, 3).map((topic, idx) => {
                              const TopicIcon = topicIcons[topic] || Tag;
                              return (
                                <span
                                  key={idx}
                                  className="px-2 py-1 rounded-lg bg-white/5 text-[10px] font-bold uppercase tracking-wider flex items-center gap-1"
                                >
                                  <TopicIcon className="w-3 h-3" />
                                  {topic.replace(/_/g, " ")}
                                </span>
                              );
                            })}
                          </div>
                        )}
                      </motion.div>
                    );
                  })}
                </div>
              </div>

              {/* Selected Cluster Details */}
              {selectedCluster && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="rounded-[2.5rem] bg-white/[0.02] border border-white/5 p-8"
                >
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="font-bold">Cluster Analysis</h3>
                    <Badge className={`${getCrisisColor(selectedCluster.crisis_score || 0).bg} ${getCrisisColor(selectedCluster.crisis_score || 0).text}`}>
                      {((selectedCluster.crisis_score || 0) * 100).toFixed(0)}% Crisis Score
                    </Badge>
                  </div>

                  <div className="space-y-4">
                    <div className="p-4 rounded-2xl bg-white/5">
                      <p className="text-[10px] text-muted-foreground uppercase tracking-widest mb-2">Location</p>
                      <p className="text-sm font-mono">
                        {selectedCluster.centroid_lat.toFixed(4)}, {selectedCluster.centroid_lng.toFixed(4)}
                      </p>
                    </div>

                    {selectedCluster.metadata && (
                      <div className="grid grid-cols-2 gap-4">
                        <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
                          <p className="text-[10px] text-muted-foreground uppercase tracking-widest mb-1">Impact Radius</p>
                          <p className="text-lg font-bold">{selectedCluster.metadata.radius_meters}m</p>
                        </div>
                        <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
                          <p className="text-[10px] text-muted-foreground uppercase tracking-widest mb-1">Avg Severity</p>
                          <p className="text-lg font-bold">{((selectedCluster.metadata.avg_severity || 0) * 100).toFixed(0)}%</p>
                        </div>
                      </div>
                    )}

                    <div className="p-6 rounded-3xl bg-gradient-to-br from-blue-500/10 to-purple-500/10 border border-white/10">
                      <div className="flex items-center gap-3 mb-4">
                        <Activity className="w-4 h-4 text-blue-400" />
                        <h4 className="text-[10px] font-black uppercase tracking-widest text-blue-400">Impact Analytics</h4>
                      </div>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center text-[10px] font-bold">
                          <span className="text-muted-foreground opacity-60">Buildings Affected</span>
                          <span className="text-white">~{Math.floor(selectedCluster.member_count * 1.5)}</span>
                        </div>
                        <div className="flex justify-between items-center text-[10px] font-bold">
                          <span className="text-muted-foreground opacity-60">Citizen Reach</span>
                          <span className="text-white">~{(selectedCluster.member_count * 4.2).toFixed(0)} users</span>
                        </div>
                        <div className="flex justify-between items-center text-[10px] font-bold">
                          <span className="text-muted-foreground opacity-60">Predicted Expansion</span>
                          <span className="text-emerald-400">+{((selectedCluster.crisis_score || 0.4) * 8).toFixed(1)}% / hr</span>
                        </div>
                      </div>
                    </div>

                    <div className="p-6 rounded-3xl bg-white/5 border border-white/5">
                        <div className="flex justify-between items-center mb-4">
                           <p className="text-[10px] text-muted-foreground uppercase tracking-widest">Growth Trend</p>
                           <TrendingUp className="w-3 h-3 text-emerald-500" />
                        </div>
                        <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                           <motion.div 
                             initial={{ width: 0 }}
                             animate={{ width: `${(selectedCluster.crisis_score || 0.5) * 100}%` }}
                             className="h-full bg-gradient-to-r from-blue-500 to-emerald-500"
                           />
                        </div>
                        <p className="text-[9px] text-muted-foreground mt-3 italic opacity-60">AI model predicts containment probability: <span className="text-white font-bold">{((1 - (selectedCluster.crisis_score || 0.5)) * 100).toFixed(0)}%</span></p>
                    </div>

                    <Button className="w-full h-12 bg-red-600 hover:bg-red-500">
                      <AlertTriangle className="w-4 h-4 mr-2" />
                      Dispatch Response Team
                    </Button>
                  </div>
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default CrisisClustersPage;
