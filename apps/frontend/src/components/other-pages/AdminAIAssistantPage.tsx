import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Bot, 
  User, 
  Send, 
  ImageIcon, 
  MapPin, 
  Loader2,
  CheckCircle,
  Settings,
  Shield,
  Plus,
  Menu,
  X,
  MoreVertical,
  Edit2,
  Trash2,
  MessageSquare,
  Check,
  Activity,
  Zap,
  Terminal,
  Search,
  LayoutDashboard
} from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { GroqService, AIResponse } from "../../services/groqService";
import { grievanceService } from "../../services/grievance.service";
import { adminService } from "../../services/admin.service";

// Types
type Message = {
  id: string;
  sender: "user" | "ai";
  text: string;
  isSubmitting?: boolean;
  statusData?: {
    gridId: string;
    status: string;
    description: string;
  };
  listData?: any[];
  summaryData?: any;
};

type ChatSession = {
  id: string;
  title: string;
  messages: Message[];
  updatedAt: Date;
};

const LOCAL_STORAGE_KEY = "admin_v10_ai_sessions";
const GROQ_API_KEY_STORAGE = "admin_v10_groq_api_key";

const loadSessions = (): ChatSession[] => {
  try {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (!saved) return [];
    const parsed = JSON.parse(saved);
    return parsed.map((s: any) => ({
      ...s,
      updatedAt: new Date(s.updatedAt)
    }));
  } catch (e) {
    return [];
  }
};

const AdminAIAssistantPage = () => {
  const [sessions, setSessions] = useState<ChatSession[]>(loadSessions());
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(
    sessions.length > 0 ? sessions[0].id : null
  );

  const [inputText, setInputText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [showSettings, setShowSettings] = useState(false);
  const [apiKey, setApiKey] = useState("");
  const [tempApiKey, setTempApiKey] = useState("");
  
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [editingSessionId, setEditingSessionId] = useState<string | null>(null);
  const [editTitleText, setEditTitleText] = useState("");

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(sessions));
  }, [sessions]);

  useEffect(() => {
    if (sessions.length === 0) {
      const newId = Date.now().toString();
      const newSession: ChatSession = {
        id: newId,
        title: "Strategic AI Protocol",
        updatedAt: new Date(),
        messages: [{
            id: "welcome",
            sender: "ai",
            text: "Neural Link Established. Strategic Core v10.0 Online. I am ready to process city grid diagnostics or assist with administrative directives."
        }]
      };
      setSessions([newSession]);
      setCurrentSessionId(newId);
    }

    const savedKey = localStorage.getItem(GROQ_API_KEY_STORAGE);
    if (savedKey) {
      setApiKey(savedKey);
      setTempApiKey(savedKey);
    } else {
      setShowSettings(true);
    }
  }, []);

  const currentSession = sessions.find(s => s.id === currentSessionId) || sessions[0];
  const messages = currentSession?.messages || [];

  const updateSession = (newMessages: Message[], newTitle?: string) => {
    setSessions(prev => prev.map(s => {
      if (s.id === currentSessionId) {
        return {
          ...s,
          title: newTitle || s.title,
          messages: newMessages,
          updatedAt: new Date()
        };
      }
      return s;
    }));
  };

  const startNewSession = () => {
    const newId = Date.now().toString();
    const newSession: ChatSession = {
      id: newId,
      title: "New Tactical Ops",
      updatedAt: new Date(),
      messages: [{ 
        id: "welcome", 
        sender: "ai", 
        text: "Standby for strategic analysis. Specify your objective." 
      }]
    };
    setSessions(prev => [newSession, ...prev]);
    setCurrentSessionId(newId);
    if (window.innerWidth < 1024) setIsSidebarOpen(false);
  };

  const deleteSession = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    const updated = sessions.filter(s => s.id !== id);
    setSessions(updated);
    if (currentSessionId === id) {
      setCurrentSessionId(updated.length > 0 ? updated[0].id : null);
    }
    setActiveDropdown(null);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const saveApiKey = () => {
    localStorage.setItem(GROQ_API_KEY_STORAGE, tempApiKey);
    setApiKey(tempApiKey);
    setShowSettings(false);
  };

  const handleSend = async () => {
    if (!inputText.trim()) return;
    if (!apiKey) {
      setShowSettings(true);
      return;
    }

    const userMsg: Message = {
      id: Date.now().toString(),
      sender: "user",
      text: inputText
    };

    const newMessages = [...messages, userMsg];
    let newTitle = currentSession?.title;
    if (messages.length === 1 && currentSession?.title === "Strategic AI Protocol") {
      newTitle = inputText.slice(0, 30) + "...";
    }

    updateSession(newMessages, newTitle);
    setInputText("");
    setIsTyping(true);

    try {
      const groq = new GroqService(apiKey);
      const aiResult = await groq.processQuery(inputText);

      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        sender: "ai",
        text: aiResult.message
      };

      if (aiResult.action === "lookup_status" && aiResult.gridId) {
          try {
            const track = await grievanceService.getTrack(aiResult.gridId);
            aiMsg.statusData = {
              gridId: aiResult.gridId,
              status: track.current_status,
              description: track.timeline[0]?.description || "Node synchronized."
            };
          } catch (e) {
            aiMsg.text += "\n\n[ERROR]: Grid Node not found in active sectors.";
          }
      }

      if (aiResult.action === "list_recent") {
          try {
            const escalations = await adminService.getEscalations(10);
            aiMsg.listData = escalations.items;
          } catch (e) {
            aiMsg.text += "\n\n[ERROR]: Failed to access escalation logs.";
          }
      }

      if (aiResult.action === "get_summary") {
          try {
            const summary = await adminService.getDashboard();
            aiMsg.summaryData = summary;
          } catch (e) {
            aiMsg.text += "\n\n[ERROR]: Failed to synchronize city health data.";
          }
      }

      updateSession([...newMessages, aiMsg], newTitle);
    } catch (error) {
      updateSession([...newMessages, {
        id: Date.now().toString(),
        sender: "ai",
        text: "Neural Link Divergence: Check Groq API Authentication."
      }], newTitle);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050506] text-foreground flex flex-col pt-16 lg:pt-24 pb-0 h-screen overflow-hidden font-industrial relative">
      
      {/* HUD Ambient Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#3b82f60a_1px,transparent_1px),linear-gradient(to_bottom,#3b82f60a_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none z-0" />
      
      {/* Top Header Blur */}
      <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-blue-600/10 to-transparent pointer-events-none z-0" />

      {/* Main Layout Content */}
      <div className="relative z-10 flex flex-1 w-full max-w-7xl mx-auto px-4 md:px-6 mb-6 gap-6 h-[calc(100vh-120px)]">
        
        {/* Sidebar Toggle for Mobile */}
        <Button 
          variant="outline" 
          size="icon" 
          className="lg:hidden absolute top-0 left-0 z-50 bg-black/50 border-white/10 text-blue-500"
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        >
          {isSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </Button>

        {/* History Sidebar */}
        <AnimatePresence>
          {(isSidebarOpen || window.innerWidth >= 1024) && (
            <motion.aside
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 300, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              className={`glass-card border-white/5 bg-black/40 backdrop-blur-3xl rounded-[2.5rem] flex flex-col overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.5)] shrink-0 absolute lg:relative z-40 h-full ${window.innerWidth < 1024 ? 'left-0 right-0 max-w-[300px]' : ''}`}
            >
              <div className="p-6 border-b border-white/5">
                <Button 
                  onClick={startNewSession}
                  className="w-full bg-blue-600 hover:bg-blue-500 text-white rounded-2xl shadow-[0_0_20px_rgba(37,99,235,0.3)] justify-start font-black uppercase tracking-widest text-[10px] h-12"
                >
                  <Plus className="w-4 h-4 mr-3" />
                  Initialize Link
                </Button>
              </div>
              <div className="flex-1 overflow-y-auto px-4 py-6 space-y-2 no-scrollbar">
                {sessions.map(s => (
                  <div key={s.id} className="relative group">
                    <button
                      onClick={() => {
                        setCurrentSessionId(s.id);
                        if (window.innerWidth < 1024) setIsSidebarOpen(false);
                      }}
                      className={`w-full text-left px-5 py-4 rounded-2xl flex items-center justify-between transition-all duration-300 ${
                        currentSessionId === s.id 
                          ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30 shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)]' 
                          : 'text-slate-500 hover:bg-white/5 hover:text-slate-200'
                      }`}
                    >
                      <div className="flex items-center gap-3 overflow-hidden">
                        <Terminal className={`w-4 h-4 shrink-0 ${currentSessionId === s.id ? 'text-blue-500 animate-pulse' : ''}`} />
                        <span className="text-[10px] uppercase font-black tracking-widest truncate">{s.title}</span>
                      </div>
                      <MoreVertical className="w-4 h-4 opacity-0 group-hover:opacity-40 transition-opacity" />
                    </button>
                    {currentSessionId === s.id && (
                       <div className="absolute right-4 top-1/2 -translate-y-1/2 flex gap-1">
                          <button onClick={(e) => deleteSession(e, s.id)} className="p-1.5 hover:bg-red-500/10 rounded-lg text-red-500/50 hover:text-red-500 transition-colors">
                             <Trash2 className="w-3.5 h-3.5" />
                          </button>
                       </div>
                    )}
                  </div>
                ))}
              </div>
              <div className="p-6 border-t border-white/5">
                 <button 
                   onClick={() => setShowSettings(true)}
                   className="w-full py-3 rounded-2xl border border-white/5 flex items-center justify-center gap-3 text-slate-500 hover:text-blue-400 transition-colors"
                 >
                    <Settings className="w-4 h-4" />
                    <span className="text-[9px] font-black uppercase tracking-[0.3em]">Core Config</span>
                 </button>
              </div>
            </motion.aside>
          )}
        </AnimatePresence>

        {/* Workspace */}
        <div className="flex-1 glass-card border-white/5 bg-black/20 rounded-[2.5rem] flex flex-col overflow-hidden shadow-2xl relative h-full backdrop-blur-sm">
          
          <div className="flex-1 overflow-y-auto p-6 md:p-12 space-y-10 no-scrollbar scroll-smooth">
            {messages.map((msg) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
              >
                <div className={`flex gap-4 md:gap-6 max-w-[90%] md:max-w-[80%] ${msg.sender === "user" ? "flex-row-reverse" : "flex-row"}`}>
                  
                  <div className={`size-10 md:size-12 rounded-2xl flex items-center justify-center shrink-0 shadow-2xl border ${
                    msg.sender === "user" 
                      ? "bg-blue-600/20 text-blue-500 border-blue-500/30" 
                      : "bg-slate-900 text-blue-400 border-white/10"
                  }`}>
                    {msg.sender === "user" ? <User className="w-5 h-5 md:w-6 md:h-6" /> : <Bot className="w-5 h-5 md:w-6 md:h-6" />}
                  </div>

                  <div className={`flex flex-col gap-4 ${msg.sender === "user" ? 'items-end' : 'items-start'}`}>
                    <div className={`px-6 py-5 rounded-3xl border ${
                      msg.sender === "user" 
                        ? "bg-blue-600/5 border-blue-600/20 text-slate-200 rounded-tr-none" 
                        : "bg-white/5 border-white/10 text-slate-200 rounded-tl-none shadow-[0_0_50px_rgba(59,130,246,0.05)]"
                    }`}>
                      <p className="text-sm md:text-base leading-relaxed whitespace-pre-wrap">{msg.text}</p>
                    </div>

                    {msg.statusData && (
                      <motion.div 
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="w-full max-w-sm bg-black/60 border border-blue-500/20 rounded-3xl overflow-hidden shadow-2xl backdrop-blur-2xl"
                      >
                        <div className="px-5 py-3 bg-blue-600/10 border-b border-blue-500/20 flex items-center justify-between">
                          <span className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-400">Node Sync</span>
                          <Activity className="w-3.5 h-3.5 text-blue-500 animate-pulse" />
                        </div>
                        <div className="p-6 space-y-4">
                          <div className="flex justify-between items-center text-xs">
                            <span className="text-slate-500 uppercase tracking-widest font-black">ID:</span>
                            <span className="font-mono font-black text-blue-500">{msg.statusData.gridId}</span>
                          </div>
                          <div className="flex justify-between items-center text-xs">
                            <span className="text-slate-500 uppercase tracking-widest font-black">Pulse:</span>
                            <span className="text-emerald-500 font-bold">{msg.statusData.status}</span>
                          </div>
                          <div className="pt-4 border-t border-white/5 text-[11px] text-slate-400 leading-relaxed font-medium italic">
                            "{msg.statusData.description}"
                          </div>
                          <Link to={`/admin/mission-control`} className="block w-full py-3 bg-blue-600 hover:bg-blue-500 text-center text-[10px] font-black uppercase tracking-[0.3em] rounded-2xl text-black transition-all mt-4 shadow-lg shadow-blue-600/20">
                             Go to Operations
                          </Link>
                        </div>
                      </motion.div>
                    )}

                    {msg.listData && (
                      <motion.div 
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="w-full max-w-md bg-black/40 border border-white/5 rounded-3xl overflow-hidden shadow-2xl backdrop-blur-3xl mt-4"
                      >
                        <div className="px-5 py-3 border-b border-white/5 flex items-center justify-between bg-blue-600/5">
                          <span className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-500">Active High-Priority Nodes</span>
                          <span className="px-2 py-0.5 bg-blue-500 text-black text-[8px] font-black rounded-sm">{msg.listData.length} ACTIVE</span>
                        </div>
                        <div className="p-4 space-y-2">
                          {msg.listData.map((item, idx) => (
                            <div key={idx} className="p-4 bg-white/5 border border-white/5 rounded-2xl flex items-center justify-between hover:border-blue-500/30 transition-all group">
                               <div className="space-y-1">
                                  <div className="flex items-center gap-2">
                                     <span className="text-[10px] font-mono font-bold text-blue-500">{item.grid_id}</span>
                                     <span className={`text-[8px] font-black px-1.5 py-0.5 rounded border ${item.priority === 'CRITICAL' ? 'bg-red-500/10 text-red-500 border-red-500/20' : 'bg-blue-500/10 text-blue-500 border-blue-500/20'}`}>{item.priority}</span>
                                  </div>
                                  <p className="text-xs font-bold text-slate-300 truncate w-48">{item.title}</p>
                               </div>
                               <Button size="sm" variant="ghost" className="text-[9px] font-black uppercase tracking-widest text-slate-500 hover:text-blue-500" asChild>
                                  <Link to={`/admin/dashboard`}>INSPECT</Link>
                               </Button>
                            </div>
                          ))}
                        </div>
                      </motion.div>
                    )}

                    {msg.summaryData && (
                      <motion.div 
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="w-full max-w-md bg-black/60 border border-blue-500/30 rounded-3xl overflow-hidden shadow-2xl backdrop-blur-3xl mt-4 p-6 space-y-6"
                      >
                        <div className="flex items-center gap-3">
                           <div className="p-2 bg-blue-500/10 rounded-lg">
                              <LayoutDashboard className="w-5 h-5 text-blue-500" />
                           </div>
                           <h4 className="text-sm font-black uppercase tracking-widest">Grid Health Report</h4>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4">
                           <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
                              <p className="text-[10px] font-bold text-slate-500 uppercase mb-1">Total</p>
                              <p className="text-xl font-black">{msg.summaryData.summary.total_grievances}</p>
                           </div>
                           <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
                              <p className="text-[10px] font-bold text-slate-500 uppercase mb-1">Resolved</p>
                              <p className="text-xl font-black text-emerald-500">{msg.summaryData.summary.resolved}</p>
                           </div>
                           <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
                              <p className="text-[10px] font-bold text-slate-500 uppercase mb-1">Pending</p>
                              <p className="text-xl font-black text-amber-500">{msg.summaryData.summary.pending}</p>
                           </div>
                           <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
                              <p className="text-[10px] font-bold text-slate-500 uppercase mb-1">Avg SLA</p>
                              <p className="text-xl font-black text-blue-500">{msg.summaryData.summary.avg_resolution_hours}h</p>
                           </div>
                        </div>

                        <Button className="w-full h-12 bg-blue-600 hover:bg-blue-500 text-black text-[10px] font-black uppercase tracking-widest rounded-2xl transition-all" asChild>
                           <Link to="/admin/dashboard">VIEW FULL ANALYTICS</Link>
                        </Button>
                      </motion.div>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}

            {isTyping && (
              <div className="flex gap-4 items-center">
                 <div className="size-10 rounded-2xl bg-slate-900 text-blue-400 border border-white/10 flex items-center justify-center shrink-0 animate-pulse">
                  <Bot className="w-5 h-5" />
                </div>
                <div className="bg-white/5 border border-white/10 rounded-2xl rounded-tl-none px-5 py-3 flex gap-1.5 items-center">
                  <motion.div className="w-2 h-2 bg-blue-500/50 rounded-full" animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1 }} />
                  <motion.div className="w-2 h-2 bg-blue-500/50 rounded-full" animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1, delay: 0.2 }} />
                  <motion.div className="w-2 h-2 bg-blue-500/50 rounded-full" animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1, delay: 0.4 }} />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Tactical Bar */}
          <div className="p-8 pb-12 bg-black/60 backdrop-blur-3xl border-t border-white/5">
             <div className="max-w-4xl mx-auto flex gap-4">
               <div className="flex-1 relative">
                 <Input 
                   value={inputText}
                   onChange={(e) => setInputText(e.target.value)}
                   onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                   placeholder="Enter directive or scan node ID..."
                   className="w-full h-16 bg-white/5 border-white/10 rounded-2xl px-8 text-sm font-medium focus-visible:ring-1 focus-visible:ring-blue-500/50 placeholder:text-slate-700 transition-all text-white"
                 />
                 <div className="absolute right-5 top-1/2 -translate-y-1/2 flex gap-4">
                    <Search className="w-4 h-4 text-blue-500/30" />
                 </div>
               </div>
               <Button 
                 onClick={handleSend}
                 disabled={!inputText.trim() || isTyping}
                 className="h-16 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-black px-10 rounded-2xl flex items-center justify-center gap-3 transition-all font-black uppercase tracking-[0.2em] text-[10px] shadow-[0_0_30px_rgba(37,99,235,0.2)] hover:scale-[1.02] active:scale-[0.98]"
               >
                 Transmit <Send className="w-4 h-4" />
               </Button>
             </div>
          </div>
        </div>

      </div>

      {/* Security Vault */}
      <AnimatePresence>
        {showSettings && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowSettings(false)}
              className="absolute inset-0 bg-black/95 backdrop-blur-xl" 
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 30 }}
              className="relative w-full max-w-lg bg-[#0d0f14] border border-blue-500/20 rounded-[3rem] overflow-hidden shadow-[0_0_150px_rgba(37,99,235,0.15)] p-12"
            >
              <div className="flex items-center gap-6 mb-10">
                 <div className="size-16 rounded-[1.5rem] bg-blue-600/20 text-blue-500 border border-blue-500/30 flex items-center justify-center shadow-[0_0_30px_rgba(37,99,235,0.2)]">
                    <Shield className="w-8 h-8" />
                 </div>
                 <div className="space-y-1">
                    <h3 className="text-2xl font-black text-white uppercase tracking-tighter italic">Security Vault</h3>
                    <p className="text-[10px] text-blue-500/60 font-black uppercase tracking-[0.4em]">Auth Protocol 1.0</p>
                 </div>
              </div>
              
              <div className="space-y-8">
                 <div className="space-y-4">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Groq Strategic Key</label>
                    <Input 
                      type="password"
                      value={tempApiKey}
                      onChange={(e) => setTempApiKey(e.target.value)}
                      placeholder="gsk_..."
                      className="h-14 bg-black/60 border-white/5 rounded-2xl px-6 text-sm font-mono text-blue-400 focus-visible:ring-1 focus-visible:ring-blue-500/50 transition-all placeholder:text-white/5"
                    />
                    <div className="p-6 bg-blue-500/5 rounded-3xl border border-blue-500/10">
                      <p className="text-[11px] text-slate-400 leading-relaxed font-medium italic">
                        [LOG]: Key is cached in local terminal storage. Strategic data never leaves the encrypted partition.
                      </p>
                    </div>
                 </div>
                 
                 <div className="flex gap-4 pt-4">
                    <Button 
                      variant="ghost"
                      onClick={() => setShowSettings(false)}
                      className="flex-1 h-14 text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-white border border-white/5 rounded-2xl transition-all"
                    >
                      Abort
                    </Button>
                    <Button 
                      onClick={saveApiKey}
                      className="flex-1 h-14 text-[10px] font-black uppercase tracking-widest bg-blue-600 hover:bg-blue-500 text-black rounded-2xl transition-all shadow-xl shadow-blue-600/30"
                    >
                      Authorize Link
                    </Button>
                 </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};

export default AdminAIAssistantPage;
