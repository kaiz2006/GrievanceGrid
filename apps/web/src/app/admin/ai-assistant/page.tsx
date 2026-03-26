"use client";

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
  Paperclip,
  Trash2,
  MessageSquare,
  Plus,
  Menu,
  X,
  MoreVertical,
  Edit2,
  Check,
  Settings,
  Shield,
  Activity,
  Terminal
} from "lucide-react";
import Link from "next/link";
import { GroqService, AIResponse } from "@/services/groqService";
import { trackingService } from "@/services/trackingService";

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
    nodes: any[];
  };
};

type ChatSession = {
  id: string;
  title: string;
  messages: Message[];
  updatedAt: Date;
};

const LOCAL_STORAGE_KEY = "admin_ai_sessions";
const GROQ_API_KEY_STORAGE = "admin_groq_api_key";

const loadSessions = (): ChatSession[] => {
  if (typeof window === "undefined") return [];
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

export default function AdminAIAssistant() {
  const [mounted, setMounted] = useState(false);
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  
  // UI State
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [inputText, setInputText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [apiKey, setApiKey] = useState("");
  const [tempApiKey, setTempApiKey] = useState("");

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
    const initialSessions = loadSessions();
    setSessions(initialSessions);
    if (initialSessions.length > 0) {
      setCurrentSessionId(initialSessions[0].id);
    } else {
      const newId = Date.now().toString();
      const newSession: ChatSession = {
        id: newId,
        title: "New Administrative Ops",
        updatedAt: new Date(),
        messages: [{
            id: "welcome",
            sender: "ai" as "ai",
            text: "Initializing Strategic AI Core... System Ready. How can I assist you with city grid operations today, Commander?"
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

  useEffect(() => {
    if (mounted) {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(sessions));
    }
  }, [sessions, mounted]);

  const currentSession = sessions.find(s => s.id === currentSessionId);
  const messages = currentSession?.messages || [];

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

    const updatedMessages = [...messages, userMsg];
    setSessions(prev => prev.map(s => 
      s.id === currentSessionId ? { ...s, messages: updatedMessages, updatedAt: new Date() } : s
    ));

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
          const tracking = await trackingService.getTrackingInfo(aiResult.gridId);
          aiMsg.statusData = {
            gridId: tracking.grid_id,
            status: tracking.current_status,
            description: tracking.nodes[tracking.nodes.length-1]?.description || "No recent updates.",
            nodes: tracking.nodes
          };
        } catch (err) {
          aiMsg.text += "\n\n(Error: System was unable to retrieve live grid data for this ID.)";
        }
      }

      setSessions(prev => prev.map(s => 
        s.id === currentSessionId ? { ...s, messages: [...updatedMessages, aiMsg], updatedAt: new Date() } : s
      ));
    } catch (error) {
      const errorMsg: Message = {
        id: (Date.now() + 1).toString(),
        sender: "ai",
        text: "System Error: Failed to communicate with Groq AI. Please verify your API key in settings."
      };
      setSessions(prev => prev.map(s => 
        s.id === currentSessionId ? { ...s, messages: [...updatedMessages, errorMsg], updatedAt: new Date() } : s
      ));
    } finally {
      setIsTyping(false);
    }
  };

  if (!mounted) return null;

  return (
    <div className="h-screen bg-[#070708] text-slate-200 font-sans selection:bg-primary/30 flex flex-col overflow-hidden">
      
      {/* HUD Header */}
      <header className="h-16 border-b border-white/5 bg-black/40 backdrop-blur-xl px-8 flex items-center justify-between z-50 shrink-0">
        <div className="flex items-center gap-8">
          <Link href="/admin/mission-control">
            <span className="text-xl font-bold tracking-tighter text-amber-500 cursor-pointer flex items-center gap-2">
              <Bot className="w-6 h-6" /> GrievanceGrid AI
            </span>
          </Link>
          <nav className="hidden md:flex items-center gap-6">
            <Link className="text-slate-400 hover:text-white transition-colors text-sm font-medium uppercase tracking-widest" href="/admin/mission-control">Dashboard</Link>
            <span className="text-amber-500 text-sm font-bold uppercase tracking-widest border-b-2 border-amber-500 pb-1 cursor-default">AI Assistant</span>
            <Link className="text-slate-400 hover:text-white transition-colors text-sm font-medium uppercase tracking-widest" href="/admin/analytics">Reports</Link>
            <Link className="text-slate-400 hover:text-white transition-colors text-sm font-medium uppercase tracking-widest" href="/admin/escalations">SLA</Link>
          </nav>
        </div>
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setShowSettings(true)}
            className={`p-2 rounded-full transition-all ${apiKey ? 'text-slate-400 hover:text-white' : 'text-amber-500 animate-pulse'}`}
          >
            <Settings className="w-5 h-5" />
          </button>
          <div className="h-8 w-8 rounded-full bg-slate-800 border border-white/10 overflow-hidden shadow-inner">
             <img alt="Admin" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBTFqa4DBNinYt1rrzcqNA8_fDDJ_FDY4ElPG0-wuh-N64fNynqbgAcSh2GV_7S19Y6zBGijPAtGz_maFYQNsPskTeN7MBOjaQyiOH7oJgkrgCNb7HqZCn7vMR6sXzRC4O_9BJliydx94NuT-wENezEiEB56YdVD3jVNs3E-qOHu8Nbn_jAu_2KEpkobpUk3xnwqtoGgZlUzwc0O61IadU4aPrVWeqzoSXDbKz4RLDmZlVVzsLn9a9J_hJaIGr3qls5YMGrr4h2u3yy" />
          </div>
        </div>
      </header>

      <main className="flex-1 flex overflow-hidden relative">
        
        {/* Ambient Grid Background */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />

        {/* Sidebar - Historical Commands */}
        <AnimatePresence>
          {isSidebarOpen && (
            <motion.aside
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 300, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              className="border-r border-white/5 bg-black/20 backdrop-blur-md flex flex-col shrink-0 overflow-hidden"
            >
              <div className="p-4 border-b border-white/5 flex flex-col gap-4">
                 <button 
                   onClick={() => {
                     const newId = Date.now().toString();
                     setSessions(prev => [{
                       id: newId,
                       title: "New Strategy",
                       updatedAt: new Date(),
                       messages: [{ id: "welcome", sender: "ai", text: "Ready for command dispatch." }]
                     }, ...prev]);
                     setCurrentSessionId(newId);
                   }}
                   className="w-full bg-amber-600/20 hover:bg-amber-600/30 text-amber-500 border border-amber-600/30 py-2 rounded-lg flex items-center justify-center gap-2 font-bold text-xs uppercase tracking-widest transition-all"
                 >
                   <Plus className="w-4 h-4" /> New Dispatch
                 </button>
              </div>
              <div className="flex-1 overflow-y-auto p-4 space-y-2 no-scrollbar">
                {sessions.map(s => (
                  <button
                    key={s.id}
                    onClick={() => setCurrentSessionId(s.id)}
                    className={`w-full text-left px-4 py-3 rounded-lg flex items-center gap-3 transition-all ${currentSessionId === s.id ? 'bg-white/10 text-white border-l-4 border-amber-500' : 'text-slate-500 hover:bg-white/5 hover:text-slate-300'}`}
                  >
                    <Terminal className="w-4 h-4 shrink-0" />
                    <span className="text-xs uppercase tracking-widest font-bold truncate">{s.title}</span>
                  </button>
                ))}
              </div>
            </motion.aside>
          )}
        </AnimatePresence>

        {/* Chat Workspace */}
        <div className="flex-1 flex flex-col min-w-0 relative">
          
          <div className="flex-1 overflow-y-auto p-6 md:p-12 space-y-8 no-scrollbar scroll-smooth">
            {messages.map((msg) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
              >
                <div className={`flex gap-4 max-w-[85%] md:max-w-[70%] ${msg.sender === "user" ? "flex-row-reverse" : "flex-row"}`}>
                  <div className={`size-10 rounded-lg flex items-center justify-center shrink-0 shadow-2xl ${msg.sender === "user" ? 'bg-amber-600/20 text-amber-500 border border-amber-600/30' : 'bg-blue-600/20 text-blue-400 border border-blue-600/30'}`}>
                    {msg.sender === "user" ? <User className="w-5 h-5" /> : <Bot className="w-5 h-5" />}
                  </div>
                  <div className={`flex flex-col gap-3 ${msg.sender === "user" ? 'items-end' : 'items-start'}`}>
                    <div className={`px-5 py-4 rounded-2xl border ${msg.sender === "user" ? 'bg-amber-600/5 border-amber-600/20 text-slate-200 rounded-tr-none' : 'bg-blue-600/5 border-blue-600/20 text-slate-200 rounded-tl-none shadow-[0_0_30px_rgba(37,99,235,0.05)]'}`}>
                      <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.text}</p>
                    </div>

                    {/* Status Payload Card */}
                    {msg.statusData && (
                      <motion.div 
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="w-full bg-slate-900/80 border border-white/10 rounded-xl overflow-hidden shadow-2xl backdrop-blur-xl"
                      >
                        <div className="px-4 py-2 bg-white/5 border-b border-white/5 flex items-center justify-between">
                          <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Node Status Lookup</span>
                          <Activity className="w-3 h-3 text-amber-500" />
                        </div>
                        <div className="p-4 space-y-3">
                          <div className="flex justify-between items-center text-xs">
                            <span className="text-slate-500">ID:</span>
                            <span className="font-mono font-bold text-amber-500">{msg.statusData.gridId}</span>
                          </div>
                          <div className="flex justify-between items-center text-xs">
                            <span className="text-slate-500">Operational:</span>
                            <span className="text-emerald-500 font-bold">{msg.statusData.status}</span>
                          </div>
                          <div className="pt-2 border-t border-white/5 text-[10px] text-slate-400 italic">
                            {msg.statusData.description}
                          </div>
                          <Link href={`/admin/investigation/${msg.statusData.gridId}`} className="block w-full py-2 bg-white/5 hover:bg-white/10 text-center text-[10px] font-bold uppercase tracking-[0.2em] rounded border border-white/10 transition-all mt-2">
                             Full Forensic Report
                          </Link>
                        </div>
                      </motion.div>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}

            {isTyping && (
              <div className="flex gap-4">
                <div className="size-10 rounded-lg bg-blue-600/20 text-blue-400 border border-blue-600/30 flex items-center justify-center shrink-0 animate-pulse">
                  <Bot className="w-5 h-5" />
                </div>
                <div className="bg-blue-600/5 border border-blue-600/20 rounded-2xl rounded-tl-none px-4 py-3 flex gap-1 items-center">
                  <div className="w-1.5 h-1.5 bg-blue-400/50 rounded-full animate-bounce" />
                  <div className="w-1.5 h-1.5 bg-blue-400/50 rounded-full animate-bounce [animation-delay:0.2s]" />
                  <div className="w-1.5 h-1.5 bg-blue-400/50 rounded-full animate-bounce [animation-delay:0.4s]" />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Terminal Input Bar */}
          <div className="p-8 pb-12 bg-black/40 backdrop-blur-2xl border-t border-white/5 z-20">
             <div className="max-w-4xl mx-auto flex gap-4">
               <button 
                 onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                 className="p-3 bg-white/5 rounded-xl border border-white/10 text-slate-500 hover:text-white transition-colors"
               >
                 <Menu className="w-5 h-5" />
               </button>
               <div className="flex-1 relative">
                 <input 
                   value={inputText}
                   onChange={(e) => setInputText(e.target.value)}
                   onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                   placeholder="Enter ops directive or grid ID query..."
                   className="w-full bg-white/5 border border-white/10 rounded-xl px-6 py-4 text-sm font-medium focus:outline-none focus:border-amber-500/50 placeholder:text-slate-600 transition-all shadow-inner"
                 />
                 <div className="absolute right-4 top-1/2 -translate-y-1/2 flex gap-2">
                    <button className="text-slate-500 hover:text-white transition-colors"><ImageIcon className="w-4 h-4" /></button>
                 </div>
               </div>
               <button 
                 onClick={handleSend}
                 disabled={!inputText.trim() || isTyping}
                 className="bg-amber-600 hover:bg-amber-500 disabled:opacity-50 text-black px-6 rounded-xl flex items-center justify-center gap-2 transition-all font-black uppercase tracking-widest text-xs"
               >
                 Execute <Send className="w-4 h-4" />
               </button>
             </div>
          </div>
        </div>

      </main>

      {/* Settings Modal */}
      <AnimatePresence>
        {showSettings && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowSettings(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm" 
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-md bg-slate-900 border border-white/10 rounded-2xl overflow-hidden shadow-2xl p-8"
            >
              <div className="flex items-center gap-4 mb-8">
                 <div className="size-12 rounded-xl bg-amber-600/20 text-amber-500 border border-amber-600/30 flex items-center justify-center">
                    <Shield className="w-6 h-6" />
                 </div>
                 <div>
                    <h3 className="text-lg font-bold text-white">Security Cluster</h3>
                    <p className="text-xs text-slate-500 uppercase tracking-widest">Authentication Interface</p>
                 </div>
              </div>
              
              <div className="space-y-6">
                 <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Groq Cloud API Key</label>
                    <div className="relative">
                      <input 
                        type="password"
                        value={tempApiKey}
                        onChange={(e) => setTempApiKey(e.target.value)}
                        placeholder="gsk_..."
                        className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-sm font-mono text-amber-500 focus:outline-none focus:border-amber-500/50"
                      />
                    </div>
                    <p className="text-[9px] text-slate-600 leading-relaxed pt-2 italic">
                      Admin: Your API key is stored locally on this terminal and is never transmitted to our telemetry servers.
                    </p>
                 </div>
                 
                 <div className="flex gap-4 pt-4">
                    <button 
                      onClick={() => setShowSettings(false)}
                      className="flex-1 px-4 py-3 text-sm font-bold text-slate-400 hover:text-white border border-white/10 rounded-lg transition-all"
                    >
                      Dismiss
                    </button>
                    <button 
                      onClick={saveApiKey}
                      className="flex-1 px-4 py-3 text-sm font-bold bg-amber-600 hover:bg-amber-500 text-black rounded-lg transition-all"
                    >
                      Sync Vault
                    </button>
                 </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
