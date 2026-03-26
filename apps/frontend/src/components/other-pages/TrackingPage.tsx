import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useParams } from 'react-router-dom';
import {
  CheckCircle2,
  Clock,
  MapPin,
  Phone,
  MessageSquare,
  AlertCircle,
  ChevronRight,
  TrendingUp,
  ShieldCheck,
  ArrowUpRight,
  Wifi,
  WifiOff,
  Zap,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';

import { grievanceService } from '@/services/grievance.service';
import { useTrackingWebSocket } from '@/hooks/useWebSocket';

import MapComponent from '../map/MapComponent';
import AIAssignmentFlow from '../AIAssignmentFlow';
import GrievanceSLA from '../GrievanceSLA';

const TrackingPage = () => {
  const { grid_id } = useParams();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showMap, setShowMap] = useState(false);

  // WebSocket for real-time updates
  const { isConnected, isConnecting, liveUpdates, eta, teamLocation } = useTrackingWebSocket(
    grid_id || null
  );

  useEffect(() => {
    const fetchData = async () => {
      if (grid_id) {
        try {
          const result = await grievanceService.getTrack(grid_id);
          setData(result);
        } catch (error) {
          console.error('Failed to fetch tracking data:', error);
        } finally {
          setLoading(false);
        }
      }
    };
    fetchData();
  }, [grid_id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-muted-foreground font-mono uppercase tracking-widest text-xs">
            Accessing Grid Node...
          </p>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-6">
        <div className="text-center space-y-6 max-w-md">
          <div className="w-20 h-20 bg-red-500/10 border border-red-500/20 rounded-3xl flex items-center justify-center mx-auto">
            <AlertCircle className="w-10 h-10 text-red-500" />
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-bold tracking-tight">Grievance Not Found</h2>
            <p className="text-muted-foreground leading-relaxed">
              The tracking ID{' '}
              <span className="text-foreground font-mono font-bold bg-white/5 px-2 py-0.5 rounded">
                {grid_id}
              </span>{' '}
              could not be found in the city ledger.
            </p>
          </div>
          <Button className="cta-button-primary w-full h-14" asChild>
            <a href="/my-grievances">Back to My Grievances</a>
          </Button>
        </div>
      </div>
    );
  }

  const timelineEvents = data.timeline.map((event: any, index: number) => ({
    id: index, // Use index since real API might not provide ID
    title: (event.status || 'UNKNOWN').replace(/_/g, ' '),
    date: new Date(event.timestamp).toLocaleString(),
    description: event.description,
    status: index === 0 ? 'current' : 'completed', // Simplistic mapping for now
  }));

  const formatRemainingTime = (seconds: number) => {
    if (seconds <= 0) return 'BREACHED';
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const slaProgress = data.sla_remaining_seconds
    ? Math.max(0, Math.min(100, (1 - data.sla_remaining_seconds / (48 * 3600)) * 100))
    : 0;

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <main className="flex-grow pt-12 lg:pt-32 pb-12 px-6 relative overflow-hidden">
        {/* Ambient Glows */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[150px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-[150px] pointer-events-none" />

        <div className="container mx-auto">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-12">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <Badge className="bg-blue-600 hover:bg-blue-500 text-white px-3 py-1 text-xs font-bold tracking-widest uppercase">
                  ACTIVE CASE
                </Badge>
                <span className="text-muted-foreground font-mono text-sm">
                  {grid_id || 'GRI-2026-000102'}
                </span>
                {/* WebSocket Connection Status */}
                <Badge
                  className={`${
                    isConnected
                      ? 'bg-green-500/10 text-green-500 border-green-500/20'
                      : isConnecting
                        ? 'bg-amber-500/10 text-amber-500 border-amber-500/20'
                        : 'bg-red-500/10 text-red-500 border-red-500/20'
                  } border text-xs`}
                >
                  {isConnected ? (
                    <>
                      <Wifi className="w-3 h-3 mr-1" /> Live
                    </>
                  ) : isConnecting ? (
                    <>
                      <Clock className="w-3 h-3 mr-1 animate-spin" /> Connecting
                    </>
                  ) : (
                    <>
                      <WifiOff className="w-3 h-3 mr-1" /> Offline
                    </>
                  )}
                </Badge>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight">Tracking Resolution</h1>
            </div>

            <div className="grid grid-cols-2 md:flex items-center gap-4">
              <Button
                variant="outline"
                className="h-12 sm:h-14 px-4 sm:px-8 border-white/10 bg-white/[0.03] hover:bg-white/[0.06] text-xs sm:text-sm uppercase tracking-widest font-bold"
              >
                <MessageSquare className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                Contact
              </Button>
              <Button className="cta-button-primary h-12 sm:h-14 px-4 sm:px-8 shadow-[0_0_20px_rgba(59,130,246,0.3)] text-xs sm:text-sm uppercase tracking-widest font-bold">
                Escalate
                <AlertCircle className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Timeline Column */}
            <div className="lg:col-span-8">
              <div className="glass-card p-8 md:p-12 border-white/5 bg-white/[0.02]">
                <h3 className="text-2xl font-bold mb-10 flex items-center gap-3">
                  <TrendingUp className="text-blue-500" />
                  Status Timeline
                </h3>

                {/* AI Flow Visualization */}
                <div className="mb-12">
                  <AIAssignmentFlow currentStatus={data.status} />
                </div>

                {/* Live Updates Feed */}
                <AnimatePresence>
                  {liveUpdates.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mb-8 p-4 rounded-2xl bg-green-500/5 border border-green-500/10"
                    >
                      <div className="flex items-center gap-2 mb-3">
                        <Zap className="w-4 h-4 text-green-500" />
                        <span className="text-sm font-medium text-green-500">Live Updates</span>
                      </div>
                      <ScrollArea className="h-32">
                        <div className="space-y-2">
                          {liveUpdates.map((update, i) => (
                            <motion.div
                              key={i}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              className="flex items-center gap-3 text-sm"
                            >
                              <span className="text-xs text-muted-foreground">
                                {new Date(update.timestamp).toLocaleTimeString()}
                              </span>
                              <span className="text-foreground">{update.message}</span>
                            </motion.div>
                          ))}
                        </div>
                      </ScrollArea>
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="relative space-y-0">
                  <div className="absolute left-[27px] top-2 bottom-2 w-0.5 bg-white/5" />

                  {timelineEvents.map((event, i) => (
                    <motion.div
                      key={event.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.1 }}
                      className="relative pl-20 pb-12 last:pb-0"
                    >
                      {/* Node Icon */}
                      <div
                        className={`absolute left-0 top-0 w-14 h-14 rounded-2xl flex items-center justify-center border-2 z-10 transition-all duration-500 ${
                          event.status === 'completed'
                            ? 'bg-green-500/10 border-green-500/20 text-green-500'
                            : event.status === 'current'
                              ? 'bg-blue-600 border-blue-600 text-white shadow-[0_0_15px_rgba(37,99,235,0.4)]'
                              : 'bg-background border-white/10 text-muted-foreground/30'
                        }`}
                      >
                        {event.status === 'completed' ? (
                          <CheckCircle2 className="w-7 h-7" />
                        ) : event.status === 'current' ? (
                          <Clock className="w-7 h-7 animate-pulse" />
                        ) : (
                          <div className="w-3 h-3 rounded-full bg-current" />
                        )}
                      </div>

                      {/* Content */}
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <h4
                            className={`text-xl font-bold ${event.status === 'pending' ? 'text-muted-foreground/40' : 'text-foreground'}`}
                          >
                            {event.title}
                          </h4>
                          <span className="text-sm font-mono text-muted-foreground/60">
                            {event.date}
                          </span>
                        </div>
                        <p
                          className={`text-base leading-relaxed ${event.status === 'pending' ? 'text-muted-foreground/20' : 'text-muted-foreground'}`}
                        >
                          {event.description}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>

            {/* Sidebar Column */}
            <div className="lg:col-span-4 space-y-8">
              {/* SLA Card */}
              <Card className="glass-card border-white/5 bg-white/[0.02] overflow-hidden">
                <CardHeader className="pb-4">
                  <CardTitle className="text-lg font-bold uppercase tracking-widest text-blue-500 flex items-center justify-between">
                    SLA Countdown
                    <Clock className="h-5 w-5" />
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0 space-y-4">
                  <GrievanceSLA createdAt={data.created_at} />
                  <div className="px-6 pb-6">
                    <Button 
                      variant="outline"
                      className="w-full bg-blue-500/10 border-blue-500/20 text-blue-400 hover:bg-blue-500/20 hover:text-blue-300 font-black uppercase tracking-widest text-[10px] h-12"
                      onClick={async () => {
                        try {
                          await fetch(`/api/v1/grievances/${data.grid_id}/simulate`, { method: 'POST' });
                          alert('Simulation started. Status updates will follow every few minutes.');
                        } catch (e) {
                          console.error(e);
                        }
                      }}
                    >
                      Simulate Resolution Process
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Assignment Card */}
              <Card className="glass-card border-white/5 bg-white/[0.02] overflow-hidden group">
                <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                  <ArrowUpRight className="h-5 w-5 text-blue-500" />
                </div>
                <CardHeader>
                  <CardTitle className="text-sm font-bold uppercase tracking-widest text-muted-foreground">
                    Assigned Team
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-2xl bg-white/[0.05] border border-white/10 flex items-center justify-center overflow-hidden">
                      <img
                        src="https://api.dicebear.com/7.x/avataaars/svg?seed=Rajesh"
                        alt="Officer"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <h4 className="font-bold text-lg">Rajesh Kumar</h4>
                      <p className="text-sm text-muted-foreground">Lead Technical Officer</p>
                      {isConnected && (
                        <Badge className="mt-1 bg-green-500/10 text-green-500 border-0 text-xs">
                          <span className="w-1.5 h-1.5 rounded-full bg-green-500 mr-1 animate-pulse" />
                          Online
                        </Badge>
                      )}
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <Button
                      variant="outline"
                      className="h-12 border-white/10 bg-white/[0.03] hover:bg-white/[0.06]"
                    >
                      <Phone className="mr-2 h-4 w-4 text-blue-500" />
                      Call
                    </Button>
                    <Button
                      variant={showMap ? 'default' : 'outline'}
                      onClick={() => setShowMap(!showMap)}
                      className={`h-12 border-white/10 ${showMap ? 'bg-blue-600' : 'bg-white/[0.03] hover:bg-white/[0.06]'}`}
                    >
                      <MapPin className="mr-2 h-4 w-4 text-blue-500" />
                      {showMap ? 'Close Map' : 'Live Map'}
                    </Button>
                  </div>

                  {showMap && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="pt-4"
                    >
                      <MapComponent
                        center={
                          teamLocation
                            ? [teamLocation.lat, teamLocation.lng]
                            : data.assigned_team_location
                              ? [
                                  data.assigned_team_location.latitude,
                                  data.assigned_team_location.longitude,
                                ]
                              : [28.6139, 77.209]
                        }
                        zoom={15}
                        markers={[
                          { position: [28.6139, 77.209], popupContent: 'Grievance Location' },
                          {
                            position: teamLocation
                              ? [teamLocation.lat, teamLocation.lng]
                              : data.assigned_team_location
                                ? [
                                    data.assigned_team_location.latitude,
                                    data.assigned_team_location.longitude,
                                  ]
                                : [28.6145, 77.2105],
                            popupContent: 'Officer (Live Location)',
                          },
                        ]}
                        className="w-full h-[250px] rounded-xl overflow-hidden"
                      />

                      {teamLocation && (
                        <p className="text-xs text-muted-foreground mt-2 text-center">
                          Live: {teamLocation.lat.toFixed(4)}, {teamLocation.lng.toFixed(4)}
                        </p>
                      )}
                    </motion.div>
                  )}
                </CardContent>
              </Card>

              {/* Security Badge */}
              <div className="p-6 rounded-3xl bg-blue-500/5 border border-blue-500/10 flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-blue-500/10 flex items-center justify-center shrink-0 border border-blue-500/20">
                  <ShieldCheck className="w-6 h-6 text-blue-500" />
                </div>
                <p className="text-xs text-blue-500/80 leading-relaxed font-medium">
                  Resolution updates are cryptographically signed and stored on the city ledger for
                  full transparency.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default TrackingPage;
