import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  AlertTriangle,
  Activity,
  Zap,
  Clock,
  TrendingUp,
  Search,
  Filter,
  RefreshCw,
  MapPin,
  Gauge,
  AlertCircle,
  Wrench,
  Battery,
  Droplets,
  Route,
  Lightbulb
} from "lucide-react";
import { infrastructureService, InfrastructureAsset } from "@/services/infrastructure.service";
import MapComponent from "../map/MapComponent";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const assetTypeIcons: Record<string, typeof Zap> = {
  TRANSFORMER: Battery,
  WATER_MAIN: Droplets,
  ROAD_SECTION: Route,
  STREET_LIGHT: Lightbulb,
  DRAINAGE: Droplets
};

const PredictiveMaintenancePage = () => {
  const [assets, setAssets] = useState<InfrastructureAsset[]>([]);
  const [loading, setLoading] = useState(true);
  const [highRiskOnly, setHighRiskOnly] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState<InfrastructureAsset | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const result = await infrastructureService.getAssets(highRiskOnly);
      setAssets(result);
      setLoading(false);
    };
    fetchData();
  }, [highRiskOnly]);

  const getRiskColor = (score: number) => {
    if (score >= 0.8) return "text-red-500 bg-red-500/10 border-red-500/20";
    if (score >= 0.6) return "text-amber-500 bg-amber-500/10 border-amber-500/20";
    return "text-green-500 bg-green-500/10 border-green-500/20";
  };

  const getRiskLabel = (score: number) => {
    if (score >= 0.8) return "Critical";
    if (score >= 0.6) return "High";
    return "Moderate";
  };

  const formatDaysUntil = (dateStr?: string) => {
    if (!dateStr) return "N/A";
    const days = Math.ceil((new Date(dateStr).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
    if (days <= 0) return "Overdue";
    return `${days} days`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-muted-foreground font-mono uppercase tracking-widest text-xs">Loading Infrastructure Data...</p>
        </div>
      </div>
    );
  }

  const criticalCount = assets.filter(a => (a.failure_risk_score || 0) >= 0.8).length;
  const highRiskCount = assets.filter(a => (a.failure_risk_score || 0) >= 0.6 && (a.failure_risk_score || 0) < 0.8).length;

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <main className="flex-grow pt-8 lg:pt-32 pb-12 px-6 relative overflow-hidden">
        {/* Ambient Glows */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-red-500/5 rounded-full blur-[150px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-[150px] pointer-events-none" />

        <div className="container mx-auto">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-12">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <AlertTriangle className="w-5 h-5 text-red-500" />
                <span className="text-xs font-bold text-red-500 uppercase tracking-widest">Predictive Analytics Engine</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight">Infrastructure Risk Monitor</h1>
              <p className="text-muted-foreground mt-2">AI-powered failure prediction for city assets</p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search assets..."
                  className="bg-white/5 border border-white/10 rounded-2xl py-3 pl-12 pr-6 text-sm w-full sm:w-64 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all font-medium"
                />
              </div>
              <Button
                variant="outline"
                onClick={() => setHighRiskOnly(!highRiskOnly)}
                className={`h-12 px-6 border-white/10 ${highRiskOnly ? "bg-red-600/20 border-red-500/30 text-red-500" : "bg-white/5"}`}
              >
                <Filter className="w-4 h-4 mr-2" />
                {highRiskOnly ? "High Risk Only" : "All Assets"}
              </Button>
            </div>
          </div>

          {/* Metrics Row */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
            {[
              { label: "Total Assets", value: assets.length.toString(), icon: Activity, color: "text-blue-500", trend: "Monitored" },
              { label: "Critical Risk", value: criticalCount.toString(), icon: AlertTriangle, color: "text-red-500", trend: "Immediate action" },
              { label: "High Risk", value: highRiskCount.toString(), icon: AlertCircle, color: "text-amber-500", trend: "Review needed" },
              { label: "Avg Risk Score", value: (assets.reduce((a, b) => a + (b.failure_risk_score || 0), 0) / assets.length).toFixed(2), icon: Gauge, color: "text-purple-500", trend: "System health" },
            ].map((metric, i) => (
              <motion.div
                key={metric.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="p-8 rounded-3xl bg-white/[0.02] border border-white/5 relative overflow-hidden group"
              >
                <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                  <metric.icon className="w-16 h-16" />
                </div>
                <div className="flex justify-between items-start mb-4 relative z-10">
                  <div className={`p-3 rounded-xl bg-white/5 ${metric.color}`}>
                    <metric.icon className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{metric.trend}</span>
                </div>
                <h4 className="text-muted-foreground text-xs font-bold uppercase tracking-widest mb-1">{metric.label}</h4>
                <p className={`text-3xl font-bold tracking-tight ${metric.color}`}>{metric.value}</p>
              </motion.div>
            ))}
          </div>

          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Asset List */}
            <div className="lg:col-span-7">
              <div className="rounded-[2.5rem] bg-white/[0.02] border border-white/5 overflow-hidden">
                <div className="p-6 border-b border-white/5 flex justify-between items-center">
                  <h3 className="text-lg font-bold flex items-center gap-3">
                    <Wrench className="w-5 h-5 text-blue-500" />
                    Asset Risk Registry
                  </h3>
                  <Button variant="ghost" size="sm" className="text-xs uppercase tracking-widest">
                    <RefreshCw className="w-3 h-3 mr-2" />
                    Refresh
                  </Button>
                </div>

                <div className="divide-y divide-white/5">
                  {assets.map((asset, i) => {
                    const IconComponent = assetTypeIcons[asset.asset_type] || Activity;
                    return (
                      <motion.div
                        key={asset.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.05 }}
                        onClick={() => setSelectedAsset(asset)}
                        className={`p-6 hover:bg-white/[0.02] transition-all cursor-pointer group ${selectedAsset?.id === asset.id ? "bg-white/[0.04]" : ""}`}
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex items-start gap-4">
                            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
                              (asset.failure_risk_score || 0) >= 0.8 ? "bg-red-500/10" : (asset.failure_risk_score || 0) >= 0.6 ? "bg-amber-500/10" : "bg-white/5"
                            }`}>
                              <IconComponent className={`w-5 h-5 ${
                                (asset.failure_risk_score || 0) >= 0.8 ? "text-red-500" : (asset.failure_risk_score || 0) >= 0.6 ? "text-amber-500" : "text-muted-foreground"
                              }`} />
                            </div>
                            <div>
                              <h4 className="font-bold group-hover:text-blue-400 transition-colors">{asset.asset_name}</h4>
                              <p className="text-xs text-muted-foreground mt-1">{asset.asset_type.replace(/_/g, " ")}</p>
                              <div className="flex items-center gap-4 mt-2">
                                <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                                  <Activity className="w-3 h-3" />
                                  {asset.complaint_count_7d} complaints (7d)
                                </span>
                                <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                                  <Clock className="w-3 h-3" />
                                  {asset.unresolved_count} unresolved
                                </span>
                              </div>
                            </div>
                          </div>

                          <div className="text-right">
                            <div className={`px-3 py-1.5 rounded-xl border text-xs font-bold ${getRiskColor(asset.failure_risk_score || 0)}`}>
                              {((asset.failure_risk_score || 0) * 100).toFixed(0)}% Risk
                            </div>
                            {asset.predicted_failure_date && (
                              <p className="text-[10px] text-muted-foreground mt-2">
                                Failure in {formatDaysUntil(asset.predicted_failure_date)}
                              </p>
                            )}
                          </div>
                        </div>

                        {/* Risk Progress Bar */}
                        <div className="mt-4 h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${(asset.failure_risk_score || 0) * 100}%` }}
                            className={`h-full ${
                              (asset.failure_risk_score || 0) >= 0.8 ? "bg-red-500" : (asset.failure_risk_score || 0) >= 0.6 ? "bg-amber-500" : "bg-green-500"
                            }`}
                          />
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Right Column - Map & Details */}
            <div className="lg:col-span-5 space-y-8">
              {/* Risk Map */}
              <div className="rounded-[2.5rem] bg-white/[0.02] border border-white/5 overflow-hidden">
                <div className="p-6 border-b border-white/5">
                  <h3 className="text-lg font-bold flex items-center gap-3">
                    <MapPin className="w-5 h-5 text-blue-500" />
                    Risk Heatmap
                  </h3>
                </div>
                <div className="h-[300px] relative">
                  <MapComponent
                    center={[28.6139, 77.2090]}
                    zoom={12}
                    markers={assets.slice(0, 5).map(a => ({
                      position: [28.6 + Math.random() * 0.05, 77.2 + Math.random() * 0.05],
                      popupContent: `${a.asset_name}: ${((a.failure_risk_score || 0) * 100).toFixed(0)}% risk`
                    }))}
                    className="w-full h-full"
                  />
                </div>
              </div>

              {/* Selected Asset Details */}
              {selectedAsset && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="rounded-[2.5rem] bg-white/[0.02] border border-white/5 p-8"
                >
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-bold">Asset Details</h3>
                    <Badge className={`${getRiskColor(selectedAsset.failure_risk_score || 0)}`}>
                      {getRiskLabel(selectedAsset.failure_risk_score || 0)} Risk
                    </Badge>
                  </div>

                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-4 rounded-2xl bg-white/5">
                        <p className="text-[10px] text-muted-foreground uppercase tracking-widest mb-1">Asset ID</p>
                        <p className="font-mono text-sm">{selectedAsset.id}</p>
                      </div>
                      <div className="p-4 rounded-2xl bg-white/5">
                        <p className="text-[10px] text-muted-foreground uppercase tracking-widest mb-1">Type</p>
                        <p className="text-sm font-bold">{selectedAsset.asset_type}</p>
                      </div>
                    </div>

                    <div className="p-4 rounded-2xl bg-white/5">
                      <p className="text-[10px] text-muted-foreground uppercase tracking-widest mb-2">Complaint Metrics</p>
                      <div className="grid grid-cols-3 gap-4 text-center">
                        <div>
                          <p className="text-2xl font-bold text-blue-500">{selectedAsset.complaint_count_7d}</p>
                          <p className="text-[10px] text-muted-foreground">7 Days</p>
                        </div>
                        <div>
                          <p className="text-2xl font-bold text-amber-500">{selectedAsset.complaint_count_30d}</p>
                          <p className="text-[10px] text-muted-foreground">30 Days</p>
                        </div>
                        <div>
                          <p className="text-2xl font-bold text-red-500">{selectedAsset.unresolved_count}</p>
                          <p className="text-[10px] text-muted-foreground">Unresolved</p>
                        </div>
                      </div>
                    </div>

                    {selectedAsset.predicted_failure_date && (
                      <div className="p-4 rounded-2xl bg-red-500/5 border border-red-500/10">
                        <p className="text-[10px] text-red-500 uppercase tracking-widest mb-1 flex items-center gap-2">
                          <AlertTriangle className="w-3 h-3" />
                          Predicted Failure
                        </p>
                        <p className="text-lg font-bold text-red-400">
                          {new Date(selectedAsset.predicted_failure_date).toLocaleDateString()}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {formatDaysUntil(selectedAsset.predicted_failure_date)} from now
                        </p>
                      </div>
                    )}

                    <Button className="w-full h-12 bg-blue-600 hover:bg-blue-500">
                      <Wrench className="w-4 h-4 mr-2" />
                      Schedule Maintenance
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

export default PredictiveMaintenancePage;
