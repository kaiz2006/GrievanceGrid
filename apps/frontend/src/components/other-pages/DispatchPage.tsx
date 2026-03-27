import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { 
  Users, 
  MapPin, 
  Clock, 
  ChevronRight, 
  CheckCircle2, 
  AlertTriangle, 
  MoreVertical, 
  PlusCircle, 
  Map as MapIcon, 
  History, 
  Zap,
  TrendingUp,
  LayoutDashboard,
  ShieldAlert,
  Search,
  Filter,
  Loader
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { crewService, type CrewAssignment } from "@/services/crew.service";
import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Tooltip, Legend } from "recharts";

const getTypeFromCategory = (category: string): string => {
  if (category.toLowerCase().includes('emergency')) return 'Emergency';
  if (category.toLowerCase().includes('maintenance') || category.toLowerCase().includes('calibration')) return 'Maintenance';
  return 'Routine';
};

const getImageForCategory = (category: string): string => {
  if (category.toLowerCase().includes('substation')) return 'https://images.unsplash.com/photo-1573166364524-d9dbfd8bbf83?auto=format&fit=crop&q=80&w=400';
  if (category.toLowerCase().includes('relay') || category.toLowerCase().includes('calibration')) return 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?auto=format&fit=crop&q=80&w=400';
  return 'https://images.unsplash.com/photo-1544006659-f0b21884cb1d?auto=format&fit=crop&q=80&w=400';
};

const getSeverityLabel = (severity: number | string | undefined): string => {
  if (typeof severity === 'string') return severity;
  const num = typeof severity === 'number' ? severity : 0;
  if (num >= 0.8) return 'CRITICAL';
  if (num >= 0.5) return 'HIGH';
  if (num >= 0.3) return 'MEDIUM';
  return 'LOW';
};

const getStatusColor = (severity: number | string | undefined): { statusColor: string; badgeColor: string } => {
  const label = getSeverityLabel(severity);
  switch (label) {
    case 'CRITICAL':
      return { statusColor: 'border-red-600', badgeColor: 'bg-red-600/10 text-red-500' };
    case 'HIGH':
      return { statusColor: 'border-orange-600', badgeColor: 'bg-orange-600/10 text-orange-500' };
    case 'MEDIUM':
      return { statusColor: 'border-blue-500', badgeColor: 'bg-blue-600/10 text-blue-500' };
    default:
      return { statusColor: 'border-white/20', badgeColor: 'bg-white/5 text-muted-foreground' };
  }
};

const parseCoordinates = (coordStr: string): { lat: number; long: number } => {
  const parts = coordStr.split(',').map(p => parseFloat(p.trim()));
  return { lat: parts[0] || 0, long: parts[1] || 0 };
};

const DispatchPage = () => {
  const [assignments, setAssignments] = useState<CrewAssignment[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState<string>('');
  const [deployingId, setDeployingId] = useState<string | null>(null);
  const [deployedIds, setDeployedIds] = useState<Set<string>>(new Set());

  const DUMMY_ASSIGNMENTS: CrewAssignment[] = [
    { grievance_id: "crew-a01", grid_id: "GRI-2026-002011", status: "ASSIGNED", assigned_team_id: "team-01", assigned_team_name: "Alpha Squad", title: "Substation Fault - Sector 5", priority: 0.9, category: "Electrical Substation", location_city: "New Delhi", location_coordinates: "28.6139,77.2090", damage_description: "Main transformer tripped, affecting 800 households", damage_severity: "CRITICAL", ai_summary: "High-risk electrical failure requiring immediate intervention", reporter_name: "Ramesh Kumar", reporter_email: "rk@example.com", contact_phone: "+91-98001-00001", created_at: new Date(Date.now() - 30 * 60 * 1000).toISOString() },
    { grievance_id: "crew-a02", grid_id: "GRI-2026-002034", status: "IN_PROGRESS", assigned_team_id: "team-02", assigned_team_name: "Beta Unit", title: "Relay Calibration - NH-8 Junction", priority: 0.6, category: "Relay Calibration", location_city: "Gurugram", location_coordinates: "28.4595,77.0266", damage_description: "Traffic signal relay out of sync causing gridlock", damage_severity: "HIGH", ai_summary: "Moderate urgency. Manual calibration needed.", reporter_name: "Priya S", reporter_email: "ps@example.com", contact_phone: "+91-98001-00002", created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString() },
    { grievance_id: "crew-a03", grid_id: "GRI-2026-002056", status: "ASSIGNED", assigned_team_id: "team-03", assigned_team_name: "Delta Force", title: "Water Main Burst - Block B", priority: 0.8, category: "Water Supply Emergency", location_city: "Noida", location_coordinates: "28.5355,77.3910", damage_description: "Underground pipe burst, road flooded", damage_severity: "HIGH", ai_summary: "Immediate excavation and repair needed", reporter_name: "Sunil Verma", reporter_email: "sv@example.com", contact_phone: "+91-98001-00003", created_at: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString() },
    { grievance_id: "crew-a04", grid_id: "GRI-2026-002071", status: "PENDING_VERIFICATION", assigned_team_id: "team-01", assigned_team_name: "Alpha Squad", title: "Road Cave-in Near Flyover", priority: 0.5, category: "Road Maintenance", location_city: "Faridabad", location_coordinates: "28.4089,77.3178", damage_description: "Sinkhole appeared underneath service road", damage_severity: "MEDIUM", ai_summary: "Risk of further collapse. Barricade and repair.", reporter_name: "Anjali R", reporter_email: "ar@example.com", contact_phone: "+91-98001-00004", created_at: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString() },
    { grievance_id: "crew-a05", grid_id: "GRI-2026-002088", status: "ASSIGNED", assigned_team_id: "team-04", assigned_team_name: "Omega Team", title: "Street Light Column Broken", priority: 0.3, category: "Public Lighting", location_city: "Ghaziabad", location_coordinates: "28.6692,77.4538", damage_description: "Column bent by vehicle, poses hazard to pedestrians", damage_severity: "MEDIUM", ai_summary: "Low urgency but safety concern. Replace column.", reporter_name: "Mohit D", reporter_email: "md@example.com", contact_phone: "+91-98001-00005", created_at: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString() },
    { grievance_id: "crew-a06", grid_id: "GRI-2026-002099", status: "IN_PROGRESS", assigned_team_id: "team-02", assigned_team_name: "Beta Unit", title: "Emergency Maintenance - Old Substation", priority: 0.95, category: "Electrical Substation", location_city: "New Delhi", location_coordinates: "28.6270,77.2100", damage_description: "60-year-old substation showing arc flash signs", damage_severity: "CRITICAL", ai_summary: "Imminent failure risk. Emergency shutdown and replacement.", reporter_name: "Deepak S", reporter_email: "ds@example.com", contact_phone: "+91-98001-00006", created_at: new Date(Date.now() - 15 * 60 * 1000).toISOString() },
  ];

  useEffect(() => {
    const fetchAssignments = async () => {
      try {
        setLoading(true);
        const data = await crewService.getAssignments(selectedStatus || undefined);
        if (data.items && data.items.length > 0) {
          setAssignments(data.items);
        } else {
          setAssignments(DUMMY_ASSIGNMENTS);
        }
      } catch (error) {
        console.warn('API unavailable, using demo crew data:', error);
        setAssignments(DUMMY_ASSIGNMENTS);
      } finally {
        setLoading(false);
      }
    };

    fetchAssignments();
  }, [selectedStatus]);

  const handleDeploy = async (id: string) => {
    setDeployingId(id);
    try {
      // Set status to IN_PROGRESS when deploying
      await crewService.updateStatus(id, "IN_PROGRESS", "Unit dispatched to grid location.");
      setDeployedIds(prev => new Set(prev).add(id));
      
      // Refresh assignments to get updated statuses from server
      const data = await crewService.getAssignments(selectedStatus || undefined);
      setAssignments(data.items);
    } catch (error) {
      console.error('Deployment failed:', error);
    } finally {
      setDeployingId(null);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      {/* Success Notification Overlay */}
      {deployedIds.size > 0 && (
        <motion.div 
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          className="fixed top-8 left-1/2 -translate-x-1/2 z-[100] bg-emerald-500 text-black px-6 py-3 rounded-full font-black text-xs uppercase tracking-widest flex items-center gap-3 shadow-[0_0_30px_rgba(16,185,129,0.4)]"
        >
          <CheckCircle2 className="w-4 h-4" />
          Unit Deployed Successfully
          <button onClick={() => setDeployedIds(new Set())} className="ml-4 opacity-50 hover:opacity-100">✕</button>
        </motion.div>
      )}

      <main className="flex-grow pt-12 lg:pt-32 pb-32 px-6 relative overflow-hidden">
        <div className="container mx-auto max-w-7xl relative z-10">
          {/* Dispatch Header */}
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-8 mb-16">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 glow-crew">
                  <ShieldAlert className="w-5 h-5 text-emerald-500" />
                </div>
                <span className="text-xs font-bold text-emerald-500 uppercase tracking-widest">Field Command Center</span>
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-7xl font-black tracking-tighter mb-4 italic text-white flex flex-col leading-[0.8]">
                 <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-blue-400">OPERATIONAL</span>
                 <span>GRID</span>
              </h1>
              <p className="text-muted-foreground text-lg max-w-md leading-relaxed opacity-80 italic">
                Currently coordinating <span className="text-emerald-400 font-bold">42 active units</span>. 
                Average response time is <span className="text-white font-bold">12m 42s</span>.
              </p>
            </motion.div>
          </div>

          {/* Assignment Grid */}
          <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {loading ? (
              <div className="col-span-full flex items-center justify-center py-16">
                <Loader className="w-8 h-8 text-emerald-500 animate-spin" />
              </div>
            ) : assignments.length === 0 ? (
              <div className="col-span-full text-center py-16">
                <p className="text-muted-foreground text-lg">No assignments found</p>
              </div>
            ) : (
              assignments.map((item, i) => {
                const isDeployed = deployedIds.has(item.grievance_id) || item.status === 'IN_PROGRESS';
                const isDeploying = deployingId === item.grievance_id;
                const coords = parseCoordinates(item.location_coordinates || '0,0');
                const type = getTypeFromCategory(item.category || '');
                const image = getImageForCategory(item.category || '');
                const severityLabel = getSeverityLabel(item.damage_severity);
                const { statusColor, badgeColor } = getStatusColor(severityLabel);
                const slaHours = Math.floor(item.priority * 4); 
                const slaMinutes = (item.priority * 15).toFixed(0);
                const slaSeconds = (22).toFixed(0);
                const slaTime = `${slaHours.toString().padStart(2, '0')}:${slaMinutes.toString().padStart(2, '0')}:${slaSeconds.toString().padStart(2, '0')}`;

                return (
                  <motion.div
                    key={item.grievance_id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className={`group relative p-8 rounded-[2.5rem] bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] transition-all cursor-pointer backdrop-blur-md overflow-hidden glow-crew`}
                  >
                    <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-all duration-700">
                        <Zap className="w-24 h-24" />
                    </div>

                    <div className="flex justify-between items-start mb-8 relative z-10">
                      <div>
                        <Badge variant="outline" className={`text-[9px] font-black uppercase tracking-widest ${badgeColor} border-none p-0`}>
                          {severityLabel}
                        </Badge>
                        <h3 className="text-2xl font-black italic mt-3 text-white tracking-tighter leading-tight group-hover:text-emerald-400 transition-colors uppercase">Grid #{item.grievance_id.split('-')[1] || item.grid_id || 'UNKNOWN'}</h3>
                      </div>
                      <div className="text-right">
                        <p className="text-[9px] text-muted-foreground uppercase tracking-[0.2em] mb-2 font-black opacity-60">SLA Timer</p>
                        <p className={`text-xl font-mono font-black italic ${item.damage_severity === 'CRITICAL' ? 'text-red-500 animate-pulse' : 'text-white'}`}>
                          {isDeployed ? "RESOLVED" : slaTime}
                        </p>
                      </div>
                    </div>
                    
                    <div className="h-40 w-full rounded-2xl mb-8 overflow-hidden relative border border-white/5 bg-black/40">
                      <div 
                        className="absolute inset-0 bg-cover bg-center grayscale-0 group-hover:scale-110 transition-all duration-1000"
                        style={{ backgroundImage: `url(${image})` }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
                      <div className="absolute bottom-4 left-5 flex items-center gap-2 text-[9px] font-black font-mono text-emerald-400 tracking-widest bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/5">
                        <MapPin className="w-3 h-3" />
                        COORDS: {coords.lat.toFixed(4)} / {coords.long.toFixed(4)}
                      </div>
                    </div>

                    <div className="space-y-3 mb-6 relative z-10">
                      <div className="text-[10px] text-muted-foreground font-black uppercase tracking-widest">
                        <span className="text-white">{item.location_city}</span> • {item.category}
                      </div>
                      <p className="text-[12px] text-white/70 leading-relaxed line-clamp-2">{item.damage_description}</p>
                    </div>

                    <div className="flex justify-between items-center relative z-10">
                      <div className="flex items-center gap-2">
                        <div className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                            <Users className="w-4 h-4 text-emerald-500" />
                        </div>
                        <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Status: <span className="text-white">{isDeployed ? "DEPLOYED" : item.status}</span></span>
                      </div>
                      <Button 
                        variant="ghost" 
                        disabled={isDeployed || isDeploying}
                        onClick={() => handleDeploy(item.grievance_id)}
                        className={`text-emerald-500 group-hover:bg-emerald-500/10 text-[10px] font-black uppercase tracking-widest px-0 ${isDeployed ? "text-emerald-300" : ""}`}
                      >
                        {isDeploying ? (
                          <Loader className="w-4 h-4 animate-spin mr-2" />
                        ) : isDeployed ? (
                          <CheckCircle2 className="w-4 h-4 mr-2" />
                        ) : (
                          <>DEPLOY <ChevronRight className="w-4 h-4" /></>
                        )}
                      </Button>
                    </div>
                  </motion.div>
                );
              })
            )}
          </section>

          {/* Polygon Radar Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
            {/* Unit Capability Radar */}
            <Card className="glass-premium border-white/5 bg-white/[0.01] glow-crew">
              <CardHeader>
                <CardTitle className="text-xl font-black flex items-center gap-3 italic">
                  <Users className="w-5 h-5 text-emerald-400" />
                  Unit Capability Radar
                </CardTitle>
                <CardDescription className="text-[10px] uppercase tracking-widest font-bold opacity-60">
                  6-axis team readiness & field competency polygon
                </CardDescription>
              </CardHeader>
              <CardContent className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart data={[
                    { axis: 'Response Time', value: 88 },
                    { axis: 'Equipment Ready', value: 92 },
                    { axis: 'Coverage Area', value: 74 },
                    { axis: 'Comms Quality', value: 85 },
                    { axis: 'Incident Close', value: 79 },
                    { axis: 'Safety Protocol', value: 96 },
                  ]}>
                    <PolarGrid stroke="rgba(255,255,255,0.08)" />
                    <PolarAngleAxis dataKey="axis" tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 9, fontWeight: 700 }} />
                    <PolarRadiusAxis angle={90} domain={[0, 100]} tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 8 }} axisLine={false} />
                    <Radar name="Crew Readiness" dataKey="value" stroke="#10b981" fill="#10b981" fillOpacity={0.2} strokeWidth={2} dot={{ fill: '#10b981', r: 3 }} />
                    <Tooltip contentStyle={{ backgroundColor: '#000', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }} itemStyle={{ color: '#fff' }} formatter={(v: any) => [`${v}%`]} />
                  </RadarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Mission Tempo Polygon */}
            <Card className="glass-premium border-white/5 bg-white/[0.01]">
              <CardHeader>
                <CardTitle className="text-xl font-black flex items-center gap-3 italic">
                  <TrendingUp className="w-5 h-5 text-blue-400" />
                  Mission Tempo Polygon
                </CardTitle>
                <CardDescription className="text-[10px] uppercase tracking-widest font-bold opacity-60">
                  7-day deployment frequency vs completion rhythm
                </CardDescription>
              </CardHeader>
              <CardContent className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart data={[
                    { day: 'Mon', deployed: 14, completed: 11 },
                    { day: 'Tue', deployed: 20, completed: 16 },
                    { day: 'Wed', deployed: 18, completed: 15 },
                    { day: 'Thu', deployed: 22, completed: 20 },
                    { day: 'Fri', deployed: 17, completed: 16 },
                    { day: 'Sat', deployed: 9, completed: 9 },
                    { day: 'Sun', deployed: 5, completed: 5 },
                  ]}>
                    <PolarGrid stroke="rgba(255,255,255,0.08)" />
                    <PolarAngleAxis dataKey="day" tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 10, fontWeight: 700 }} />
                    <PolarRadiusAxis angle={90} tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 8 }} axisLine={false} />
                    <Radar name="Deployed" dataKey="deployed" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.15} strokeWidth={2} />
                    <Radar name="Completed" dataKey="completed" stroke="#10b981" fill="#10b981" fillOpacity={0.25} strokeWidth={2} dot={{ fill: '#10b981', r: 3 }} />
                    <Tooltip contentStyle={{ backgroundColor: '#000', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }} itemStyle={{ color: '#fff' }} />
                    <Legend wrapperStyle={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em' }} />
                  </RadarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Dispatch Queue Table */}
          <Card className="glass-premium border-white/5 bg-white/[0.01] overflow-hidden rounded-[3rem]">
            <CardHeader className="px-10 py-10 border-b border-white/5 flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-2xl font-black italic text-white flex items-center gap-3">
                  <Zap className="w-6 h-6 text-emerald-500" />
                  CREW PIPELINE
                </CardTitle>
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.3em] mt-2 opacity-60">Real-time unit allocation & deployment telemetry</p>
              </div>
              <div className="flex gap-4">
                  <div className="relative group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-emerald-500 transition-colors" />
                    <input 
                      type="text" 
                      placeholder="Search units..."
                      className="bg-white/5 border border-white/10 rounded-2xl py-3 pl-12 pr-6 text-[10px] font-black uppercase tracking-widest focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all w-48"
                    />
                  </div>
                  <Button 
                    variant="outline" 
                    className="h-12 border-white/5 bg-white/5 text-[10px] font-black uppercase tracking-widest hover:bg-white/10"
                    onClick={() => setSelectedStatus(selectedStatus === 'IN_PROGRESS' ? '' : 'IN_PROGRESS')}
                  >
                    <Filter className="w-4 h-4 mr-2" /> {selectedStatus ? 'Clear Filter' : 'Filter Active'}
                  </Button>
              </div>
            </CardHeader>
            <CardContent className="p-0 overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-white/[0.02] text-[9px] font-black uppercase tracking-[0.3em] text-muted-foreground">
                  <tr>
                    <th className="px-10 py-6">Assignment ID</th>
                    <th className="px-10 py-6">Location</th>
                    <th className="px-10 py-6">Category</th>
                    <th className="px-10 py-6">Severity</th>
                    <th className="px-10 py-6">Status</th>
                    <th className="px-10 py-6 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {loading ? (
                    <tr>
                      <td colSpan={6} className="px-10 py-8 text-center">
                        <Loader className="w-5 h-5 text-emerald-500 animate-spin mx-auto" />
                      </td>
                    </tr>
                  ) : assignments.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-10 py-8 text-center text-muted-foreground">
                        No assignments to display
                      </td>
                    </tr>
                  ) : (
                    assignments.map((item, i) => {
                      const progressMap: { [key: string]: number } = {
                        'ASSIGNED': 20,
                        'IN_PROGRESS': 60,
                        'PENDING_VERIFICATION': 80,
                        'VERIFIED': 100,
                      };
                      const progress = progressMap[item.status] || 30;
                      const statusColors: { [key: string]: string } = {
                        'EN_ROUTE': 'text-blue-500',
                        'ON_SITE': 'text-emerald-500',
                        'DELAYED': 'text-red-500',
                        'IN_PROGRESS': 'text-emerald-500',
                        'ASSIGNED': 'text-blue-500',
                        'PENDING_VERIFICATION': 'text-amber-500',
                      };
                      const statusColor = statusColors[item.status] || 'text-muted-foreground';
                      const dotColor = statusColor.replace('text-', 'bg-');

                      return (
                        <tr key={item.grievance_id} className="hover:bg-white/[0.02] transition-colors cursor-pointer group">
                          <td className="px-10 py-8">
                            <div className="flex items-center gap-3">
                                <span className="text-sm font-black italic text-white group-hover:text-emerald-400 transition-colors">#{item.grievance_id.substring(0, 8).toUpperCase()}</span>
                            </div>
                          </td>
                          <td className="px-10 py-8 text-[10px] text-muted-foreground font-black uppercase tracking-widest">{item.location_city}</td>
                          <td className="px-10 py-8 text-[10px] text-white font-black uppercase tracking-widest">{item.category}</td>
                          <td className="px-10 py-8">
                            <Badge variant="outline" className={`text-[8px] font-black uppercase tracking-widest ${getSeverityLabel(item.damage_severity) === 'CRITICAL' ? 'bg-red-600/10 text-red-500' : getSeverityLabel(item.damage_severity) === 'HIGH' ? 'bg-orange-600/10 text-orange-500' : getSeverityLabel(item.damage_severity) === 'MEDIUM' ? 'bg-blue-600/10 text-blue-500' : 'bg-white/5 text-muted-foreground'} border-none px-3 py-1.5 rounded-lg`}>
                              {getSeverityLabel(item.damage_severity)}
                            </Badge>
                          </td>
                          <td className="px-10 py-8">
                            <Badge variant="outline" className={`flex items-center gap-2 text-[8px] font-black uppercase tracking-widest ${statusColor} border-none bg-white/5 px-3 py-1.5 rounded-lg`}>
                              <span className={`h-1.5 w-1.5 rounded-full ${dotColor} animate-pulse shadow-[0_0_8px_currentColor]`} />
                              {item.status.replace(/_/g, ' ')}
                            </Badge>
                          </td>
                          <td className="px-10 py-8 text-right">
                            <Button variant="ghost" size="icon" className="group-hover:bg-emerald-500/10 text-muted-foreground group-hover:text-emerald-500">
                              <MoreVertical className="w-4 h-4" />
                            </Button>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </CardContent>
          </Card>
        </div>
      </main>

      {/* Dispatch Action Dock */}
      <div className="fixed bottom-12 left-1/2 -translate-x-1/2 z-50 w-full max-w-3xl px-6">
        <motion.div 
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="bg-[#0a0a0a]/80 backdrop-blur-3xl border border-white/10 rounded-[2.5rem] p-5 flex items-center justify-between shadow-[0_30px_60px_-15px_rgba(0,0,0,0.8)]"
        >
          <div className="flex items-center gap-8 px-6">
            <button className="flex flex-col items-center gap-2 group">
              <PlusCircle className="w-6 h-6 text-muted-foreground group-hover:text-emerald-400 transition-all group-active:scale-90" />
              <span className="text-[8px] uppercase font-black tracking-[0.2em] text-muted-foreground/40 group-hover:text-emerald-400/60">Dispatch</span>
            </button>
            <div className="h-10 w-[1px] bg-white/5" />
            <button className="flex flex-col items-center gap-2 group">
              <MapIcon className="w-6 h-6 text-muted-foreground group-hover:text-blue-400 transition-all group-active:scale-90" />
              <span className="text-[8px] uppercase font-black tracking-[0.2em] text-muted-foreground/40 group-hover:text-blue-400/60">Live Map</span>
            </button>
            <button className="flex flex-col items-center gap-2 group">
              <Users className="w-6 h-6 text-muted-foreground group-hover:text-amber-400 transition-all group-active:scale-90" />
              <span className="text-[8px] uppercase font-black tracking-[0.2em] text-muted-foreground/40 group-hover:text-amber-400/60">Units</span>
            </button>
            <button className="flex flex-col items-center gap-2 group">
              <History className="w-6 h-6 text-muted-foreground group-hover:text-blue-500 transition-all group-active:scale-90" />
              <span className="text-[8px] uppercase font-black tracking-[0.2em] text-muted-foreground/40 group-hover:text-blue-500/60">Audit</span>
            </button>
          </div>
          <div className="flex items-center gap-6">
            <div className="text-right hidden sm:block">
              <p className="text-[8px] text-muted-foreground font-black uppercase tracking-[0.2em] leading-none mb-1 opacity-40">System Mesh</p>
              <p className="text-[10px] text-emerald-500 font-black tracking-widest flex items-center gap-2 justify-end">
                  <span className="h-1.5 w-1.5 bg-emerald-500 rounded-full animate-ping" />
                  NOMINAL
              </p>
            </div>
            <button className="bg-gradient-to-br from-emerald-500 to-emerald-700 text-black h-14 px-10 rounded-[1.5rem] font-black text-[10px] uppercase tracking-[0.2em] hover:brightness-125 shadow-lg shadow-emerald-500/20 active:scale-95 transition-all flex items-center gap-3">
              <Zap className="w-4 h-4 fill-current" /> 
              Emergency Protocol
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default DispatchPage;
