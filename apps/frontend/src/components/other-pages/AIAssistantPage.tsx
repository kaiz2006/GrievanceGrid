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
  FileText,
  Tag,
  AlertTriangle,
  ThumbsUp,
  ThumbsDown,
  RefreshCw,
  Zap
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { aiService, DraftReport } from "@/services/ai.service";
import { grievanceService } from "@/services/grievance.service";

type MessageStatus = "idle" | "submitting" | "approved" | "rejected";

type Message = {
  id: string;
  sender: "user" | "ai";
  text: string;
  imageBase64?: string;
  location?: boolean;
  isTyping?: boolean;
  successData?: { gridId: string; category: string };
  draftReport?: DraftReport;
  draftStatus?: MessageStatus;
};

type ChatSession = {
  id: string;
  title: string;
  messages: Message[];
  updatedAt: Date;
};

const LOCAL_STORAGE_KEY = "grievance_grid_ai_sessions_v2";

const loadSessions = (): ChatSession[] => {
  try {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (!saved) return [];
    const parsed = JSON.parse(saved);
    return parsed.map((s: any) => ({ ...s, updatedAt: new Date(s.updatedAt) }));
  } catch {
    return [];
  }
};

const SEVERITY_CONFIG: Record<string, { label: string; color: string; bg: string }> = {
  LOW: { label: "Low", color: "text-blue-400", bg: "bg-blue-500/10 border-blue-500/20" },
  MEDIUM: { label: "Medium", color: "text-amber-400", bg: "bg-amber-500/10 border-amber-500/20" },
  HIGH: { label: "High", color: "text-orange-400", bg: "bg-orange-500/10 border-orange-500/20" },
  CRITICAL: { label: "Critical", color: "text-red-400", bg: "bg-red-500/10 border-red-500/20" },
};

const CATEGORY_LABELS: Record<string, string> = {
  ROADS: "Roads & Pavements",
  WATER_SUPPLY: "Water Supply",
  SANITATION: "Sanitation",
  ELECTRICITY: "Electricity",
  PUBLIC_TRANSPORT: "Public Transport",
  ENVIRONMENT: "Environment",
  INFRASTRUCTURE: "Infrastructure",
  BUILDING_VIOLATION: "Building Violation",
  OTHER: "Other",
};

// Draft Complaint Card
const DraftCard = ({
  draft,
  status,
  onApprove,
  onReject,
}: {
  draft: DraftReport;
  status: MessageStatus;
  onApprove: () => void;
  onReject: () => void;
}) => {
  const sev = SEVERITY_CONFIG[draft.severity || "MEDIUM"];
  const isActioned = status !== "idle";

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="mt-4 rounded-2xl border border-white/10 overflow-hidden bg-[#0b0f1a]"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-white/[0.04] border-b border-white/8">
        <div className="flex items-center gap-2">
          <FileText className="w-4 h-4 text-blue-400" />
          <span className="text-xs font-bold uppercase tracking-widest text-blue-400">
            Draft Complaint
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Badge className={`text-[10px] px-2 py-0.5 border ${sev.bg} ${sev.color} font-bold`}>
            <AlertTriangle className="w-3 h-3 mr-1" />
            {sev.label}
          </Badge>
          <Badge className="text-[10px] px-2 py-0.5 bg-purple-500/10 border-purple-500/20 text-purple-400 font-bold">
            <Tag className="w-3 h-3 mr-1" />
            {CATEGORY_LABELS[draft.category] || draft.category}
          </Badge>
        </div>
      </div>

      {/* Body */}
      <div className="p-4 space-y-3">
        <div>
          <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1">Title</p>
          <p className="text-sm font-semibold text-foreground leading-snug">{draft.title}</p>
        </div>

        {draft.location_address && (
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <MapPin className="w-3.5 h-3.5 text-red-400 shrink-0" />
            <span>{draft.location_address}</span>
          </div>
        )}

        <div>
          <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1">Description</p>
          <div className="text-xs text-foreground/80 leading-relaxed bg-white/[0.03] rounded-xl p-3 border border-white/5 max-h-36 overflow-y-auto">
            {draft.description.split("\n").map((line, i) => (
              <span key={i}>{line}<br /></span>
            ))}
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="px-4 pb-4 flex gap-2">
        {status === "idle" && (
          <>
            <Button
              onClick={onApprove}
              className="flex-1 h-10 bg-green-600 hover:bg-green-500 text-white font-bold text-sm rounded-xl shadow-[0_0_15px_rgba(22,163,74,0.3)] transition-all"
            >
              <ThumbsUp className="w-4 h-4 mr-2" />
              Approve & Submit
            </Button>
            <Button
              onClick={onReject}
              variant="ghost"
              className="flex-1 h-10 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 font-bold text-sm rounded-xl"
            >
              <ThumbsDown className="w-4 h-4 mr-2" />
              Reject / Edit
            </Button>
          </>
        )}
        {status === "submitting" && (
          <div className="flex-1 h-10 flex items-center justify-center gap-2 text-sm text-blue-400 font-medium bg-blue-500/10 rounded-xl border border-blue-500/20">
            <Loader2 className="w-4 h-4 animate-spin" />
            Submitting to GrievanceGrid...
          </div>
        )}
        {status === "approved" && (
          <div className="flex-1 h-10 flex items-center justify-center gap-2 text-sm text-green-400 font-medium bg-green-500/10 rounded-xl border border-green-500/20">
            <CheckCircle className="w-4 h-4" />
            Submitted Successfully
          </div>
        )}
        {status === "rejected" && (
          <div className="flex-1 h-10 flex items-center justify-center gap-2 text-sm text-muted-foreground font-medium bg-white/5 rounded-xl border border-white/10">
            <RefreshCw className="w-4 h-4" />
            Tell me what to change
          </div>
        )}
      </div>
    </motion.div>
  );
};

// ────────────────────────────────────────────────────────────────────────────────

const AIAssistantPage = () => {
  const [sessions, setSessions] = useState<ChatSession[]>(loadSessions);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(
    sessions.length > 0 ? sessions[0].id : null
  );
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [editingSessionId, setEditingSessionId] = useState<string | null>(null);
  const [editTitleText, setEditTitleText] = useState("");
  const [inputText, setInputText] = useState("");
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [hasLocation, setHasLocation] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Save to LocalStorage whenever sessions change
  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(sessions));
  }, [sessions]);

  // Initialize first session if none exists
  useEffect(() => {
    if (sessions.length === 0) startNewSession();
  }, []);

  const currentSession = sessions.find(s => s.id === currentSessionId) || sessions[0];
  const messages = currentSession?.messages || [];

  const updateSession = (newMessages: Message[], newTitle?: string) => {
    setSessions(prev => prev.map(s => {
      if (s.id === currentSessionId) {
        return { ...s, title: newTitle || s.title, messages: newMessages, updatedAt: new Date() };
      }
      return s;
    }));
  };

  const updateMessageDraftStatus = (msgId: string, draftStatus: MessageStatus) => {
    setSessions(prev => prev.map(s => {
      if (s.id === currentSessionId) {
        return {
          ...s,
          messages: s.messages.map(m => m.id === msgId ? { ...m, draftStatus } : m),
          updatedAt: new Date()
        };
      }
      return s;
    }));
  };

  const addSuccessToMessage = (msgId: string, gridId: string, category: string) => {
    setSessions(prev => prev.map(s => {
      if (s.id === currentSessionId) {
        return {
          ...s,
          messages: s.messages.map(m =>
            m.id === msgId ? { ...m, successData: { gridId, category }, draftStatus: "approved" } : m
          ),
          updatedAt: new Date()
        };
      }
      return s;
    }));
  };

  const startNewSession = () => {
    const newSession: ChatSession = {
      id: Date.now().toString(),
      title: "New Chat",
      updatedAt: new Date(),
      messages: [{
        id: "welcome",
        sender: "ai",
        text: "Hello! I'm your GrievanceGrid AI Assistant 🤖\n\nI can help you file a formal civic complaint. Just describe the issue you've encountered — be it a broken road, power outage, water problem, or anything else.\n\nI'll gather the details and draft a proper complaint for your review before submitting.",
      }]
    };
    setSessions(prev => [newSession, ...prev]);
    setCurrentSessionId(newSession.id);
    if (window.innerWidth < 1024) setIsSidebarOpen(false);
  };

  const deleteSession = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    const updatedSessions = sessions.filter(s => s.id !== id);
    setSessions(updatedSessions);
    if (currentSessionId === id) {
      setCurrentSessionId(updatedSessions.length > 0 ? updatedSessions[0].id : null);
    }
    setActiveDropdown(null);
  };

  const saveRename = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!editingSessionId || !editTitleText.trim()) return;
    setSessions(prev => prev.map(s =>
      s.id === editingSessionId ? { ...s, title: editTitleText.trim() } : s
    ));
    setEditingSessionId(null);
  };

  const startEditing = (e: React.MouseEvent, session: ChatSession) => {
    e.stopPropagation();
    setEditingSessionId(session.id);
    setEditTitleText(session.title);
    setActiveDropdown(null);
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setSelectedImage(reader.result as string);
      reader.readAsDataURL(file);
    }
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handlePaste = useCallback((e: React.ClipboardEvent) => {
    const items = e.clipboardData?.items;
    if (!items) return;
    for (let i = 0; i < items.length; i++) {
      if (items[i].type.indexOf('image') !== -1) {
        const file = items[i].getAsFile();
        if (file) {
          const reader = new FileReader();
          reader.onloadend = () => setSelectedImage(reader.result as string);
          reader.readAsDataURL(file);
        }
        break;
      }
    }
  }, []);

  // Handle approve draft
  const handleApproveDraft = async (msgId: string, draft: DraftReport) => {
    updateMessageDraftStatus(msgId, "submitting");
    try {
      const payload = {
        title: draft.title,
        description: draft.description,
        category: draft.category,
        latitude: draft.latitude || 28.6139,
        longitude: draft.longitude || 77.2090,
        location_address: draft.location_address || "AI Extracted Location",
        before_photo_url: ""
      };

      const backendRes = await grievanceService.submit(payload);
      addSuccessToMessage(msgId, backendRes.grid_id, draft.category);

      // Add a follow-up AI message
      const successFollowup: Message = {
        id: Date.now().toString() + "_followup",
        sender: "ai",
        text: `✅ Your complaint has been officially registered with ID **${backendRes.grid_id}**.\n\nYou can track its progress from your dashboard. Is there anything else I can help you with?`,
        successData: { gridId: backendRes.grid_id, category: draft.category }
      };
      setSessions(prev => prev.map(s => {
        if (s.id === currentSessionId) {
          return { ...s, messages: [...s.messages, successFollowup], updatedAt: new Date() };
        }
        return s;
      }));
    } catch {
      updateMessageDraftStatus(msgId, "idle");
      setSessions(prev => prev.map(s => {
        if (s.id === currentSessionId) {
          return {
            ...s,
            messages: [...s.messages, {
              id: Date.now().toString() + "_err",
              sender: "ai" as const,
              text: "I encountered an error submitting your complaint. Please try again or submit manually from the Submit Grievance page."
            }],
            updatedAt: new Date()
          };
        }
        return s;
      }));
    }
  };

  // Handle reject draft
  const handleRejectDraft = (msgId: string) => {
    updateMessageDraftStatus(msgId, "rejected");
    setSessions(prev => prev.map(s => {
      if (s.id === currentSessionId) {
        return {
          ...s,
          messages: [...s.messages, {
            id: Date.now().toString() + "_reject_reply",
            sender: "ai" as const,
            text: "No problem! Please tell me what you'd like to change — the location, description, category, or anything else. I'll revise the draft for you."
          }],
          updatedAt: new Date()
        };
      }
      return s;
    }));
  };

  const handleSend = async () => {
    if (!inputText.trim() && !selectedImage && !hasLocation) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      sender: "user",
      text: inputText,
      imageBase64: selectedImage || undefined,
      location: hasLocation
    };

    const currentMsgs = currentSession?.messages || [];
    const newMessages = [...currentMsgs, userMsg];
    let newTitle = currentSession?.title;

    if (currentMsgs.length === 1 && currentSession?.title === "New Chat") {
      newTitle = inputText.slice(0, 32) + (inputText.length > 32 ? "..." : "") || "Grievance Chat";
    }

    updateSession(newMessages, newTitle);

    const currentInput = inputText;
    const currentImage = selectedImage || undefined;

    setInputText("");
    setSelectedImage(null);
    setHasLocation(false);
    setIsTyping(true);

    try {
      // Build previous messages context (skip welcome msg)
      const previousMessages = currentMsgs
        .filter(m => m.id !== "welcome")
        .map(m => ({ role: m.sender, text: m.text }));

      const aiResult = await aiService.processGrievanceContext(
        currentInput,
        currentImage,
        previousMessages
      );

      const aiMsg: Message = {
        id: Date.now().toString() + "_ai",
        sender: "ai",
        text: aiResult.message,
        draftReport: aiResult.action === "draft" ? aiResult.report : undefined,
        draftStatus: aiResult.action === "draft" ? "idle" : undefined
      };

      updateSession([...newMessages, aiMsg], newTitle);
    } catch {
      updateSession([...newMessages, {
        id: Date.now().toString() + "_err",
        sender: "ai",
        text: "I'm sorry, something went wrong. Please try again."
      }], newTitle);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col pt-16 lg:pt-24 pb-0 h-screen overflow-hidden">
      {/* Decorative Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none z-0" />

      <div className="relative z-10 flex flex-1 w-full max-w-7xl mx-auto px-4 md:px-6 mb-6 gap-6 h-[calc(100vh-120px)]">

        {/* Mobile Sidebar Toggle */}
        <Button
          variant="outline"
          size="icon"
          className="lg:hidden absolute top-0 left-4 z-50 bg-background/50 border-white/10"
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        >
          {isSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </Button>

        {/* History Sidebar */}
        <AnimatePresence>
          {(isSidebarOpen || window.innerWidth >= 1024) && (
            <motion.aside
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 280, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              className={`glass-card border-white/5 bg-white/[0.01] rounded-3xl flex flex-col overflow-hidden shadow-2xl shrink-0 absolute lg:relative z-40 h-full ${window.innerWidth < 1024 ? 'left-4 right-4 sm:right-auto' : ''}`}
            >
              <div className="p-4 border-b border-white/5">
                <Button
                  onClick={startNewSession}
                  className="w-full bg-blue-600 hover:bg-blue-500 text-white rounded-xl shadow-[0_0_15px_rgba(37,99,235,0.2)] justify-start"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  New Chat
                </Button>
              </div>
              <div className="flex-1 overflow-y-auto p-3 space-y-1">
                {sessions.length === 0 && (
                  <p className="text-xs text-muted-foreground text-center mt-4">No recent chats</p>
                )}
                {sessions.map(session => (
                  <div key={session.id} className="relative group">
                    {editingSessionId === session.id ? (
                      <form onSubmit={saveRename} className="w-full flex items-center gap-2 px-3 py-2 bg-white/5 rounded-xl border border-blue-500/30">
                        <MessageSquare className="w-4 h-4 text-blue-400 shrink-0" />
                        <Input
                          autoFocus
                          className="h-7 bg-transparent border-none p-0 text-sm focus-visible:ring-0 text-foreground"
                          value={editTitleText}
                          onChange={(e) => setEditTitleText(e.target.value)}
                          onBlur={() => saveRename()}
                        />
                        <button type="submit" className="text-blue-400 hover:text-blue-300">
                          <Check className="w-4 h-4" />
                        </button>
                      </form>
                    ) : (
                      <div
                        role="button"
                        tabIndex={0}
                        onClick={() => {
                          setCurrentSessionId(session.id);
                          if (window.innerWidth < 1024) setIsSidebarOpen(false);
                          setActiveDropdown(null);
                        }}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" || e.key === " ") {
                            e.preventDefault();
                            setCurrentSessionId(session.id);
                            if (window.innerWidth < 1024) setIsSidebarOpen(false);
                            setActiveDropdown(null);
                          }
                        }}
                        className={`w-full text-left px-4 py-3 rounded-xl flex items-center justify-between transition-all duration-300 cursor-pointer ${
                          currentSessionId === session.id
                            ? 'bg-blue-600/15 text-blue-300 border border-blue-500/20 shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)]'
                            : 'text-muted-foreground hover:bg-white/[0.08] hover:text-foreground'
                        }`}
                      >
                        <div className="flex items-center gap-3 overflow-hidden">
                          <MessageSquare className={`w-4 h-4 shrink-0 transition-colors ${currentSessionId === session.id ? 'text-blue-400' : ''}`} />
                          <span className="text-sm font-medium truncate">{session.title}</span>
                        </div>
                        <div className={`shrink-0 flex items-center transition-opacity ${currentSessionId === session.id ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
                          <button
                            onClick={(e) => { e.stopPropagation(); setActiveDropdown(activeDropdown === session.id ? null : session.id); }}
                            className="p-1 hover:bg-white/10 rounded-md transition-colors text-muted-foreground hover:text-foreground"
                          >
                            <MoreVertical className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    )}

                    {activeDropdown === session.id && (
                      <>
                        <div className="fixed inset-0 z-40" onClick={(e) => { e.stopPropagation(); setActiveDropdown(null); }} />
                        <div className="absolute right-4 top-10 z-50 w-36 glass-card bg-[#0b0f19]/95 backdrop-blur-2xl border border-white/10 p-1 rounded-xl shadow-2xl">
                          <button
                            onClick={(e) => startEditing(e, session)}
                            className="w-full flex items-center p-2 text-sm text-foreground/80 hover:text-foreground hover:bg-white/10 rounded-lg transition-colors"
                          >
                            <Edit2 className="w-4 h-4 mr-2" /> Rename
                          </button>
                          <button
                            onClick={(e) => deleteSession(e, session.id)}
                            className="w-full flex items-center p-2 text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors mt-1"
                          >
                            <Trash2 className="w-4 h-4 mr-2" /> Delete
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                ))}
              </div>

              {/* AI info footer */}
              <div className="p-4 border-t border-white/5">
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Zap className="w-3.5 h-3.5 text-blue-400" />
                  <span>Powered by Gemini AI</span>
                </div>
              </div>
            </motion.aside>
          )}
        </AnimatePresence>

        {/* Main Chat Area */}
        <div className="flex-1 glass-card border-white/5 bg-white/[0.01] rounded-3xl flex flex-col overflow-hidden shadow-2xl relative h-full">

          {/* Chat Header */}
          <div className="px-6 py-4 border-b border-white/5 flex items-center gap-3 shrink-0">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center shadow-[0_0_15px_rgba(147,51,234,0.3)]">
              <Bot className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="font-bold text-sm">GrievanceGrid AI</p>
              <p className="text-[10px] text-muted-foreground uppercase tracking-widest">Civic Complaint Assistant</p>
            </div>
            <div className="ml-auto flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              <span className="text-xs text-muted-foreground">Online</span>
            </div>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6 scroll-smooth" onPaste={handlePaste}>
            <AnimatePresence initial={false}>
              {messages.map((msg) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 12, scale: 0.97 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ duration: 0.3 }}
                  className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div className={`flex gap-3 md:gap-4 max-w-[88%] md:max-w-[76%] ${msg.sender === "user" ? "flex-row-reverse" : "flex-row"}`}>

                    {/* Avatar */}
                    <div className={`w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center shrink-0 ${
                      msg.sender === "user"
                        ? "bg-blue-600 shadow-[0_0_15px_rgba(37,99,235,0.4)]"
                        : "bg-gradient-to-br from-blue-600 to-purple-600 shadow-[0_0_15px_rgba(147,51,234,0.4)]"
                    }`}>
                      {msg.sender === "user"
                        ? <User className="w-4 h-4 md:w-5 md:h-5 text-white" />
                        : <Bot className="w-4 h-4 md:w-5 md:h-5 text-white" />
                      }
                    </div>

                    {/* Bubble */}
                    <div className={`rounded-2xl border p-4 ${
                      msg.sender === "user"
                        ? "bg-blue-600/10 rounded-tr-sm border-blue-500/20"
                        : "bg-white/[0.04] rounded-tl-sm border-white/8"
                    }`}>
                      {/* Image Preview */}
                      {msg.imageBase64 && (
                        <div className="mb-3 rounded-xl overflow-hidden border border-white/10 max-w-[280px]">
                          <img src={msg.imageBase64} alt="Attached" className="w-full h-auto object-cover" />
                        </div>
                      )}

                      {/* Text */}
                      {msg.text && (
                        <div className="text-sm md:text-base text-foreground/90 leading-relaxed whitespace-pre-wrap">
                          {msg.text.split('\n').map((line, i) => (
                            <span key={i}>{line}<br /></span>
                          ))}
                        </div>
                      )}

                      {/* Location Badge */}
                      {msg.location && (
                        <div className="flex gap-2 mt-3 pt-3 border-t border-white/5">
                          <Badge variant="outline" className="bg-white/5 border-white/10 gap-1 text-xs py-1">
                            <MapPin className="w-3 h-3 text-red-400" />
                            Location Attached
                          </Badge>
                        </div>
                      )}

                      {/* Draft Card */}
                      {msg.draftReport && (
                        <DraftCard
                          draft={msg.draftReport}
                          status={msg.draftStatus || "idle"}
                          onApprove={() => handleApproveDraft(msg.id, msg.draftReport!)}
                          onReject={() => handleRejectDraft(msg.id)}
                        />
                      )}

                      {/* Success Card (after approve) */}
                      {msg.successData && !msg.draftReport && (
                        <div className="mt-4 p-4 rounded-xl bg-green-500/10 border border-green-500/20 space-y-3">
                          <div className="flex items-center gap-2 text-green-400 font-bold">
                            <CheckCircle className="w-5 h-5" />
                            Grievance Registered
                          </div>
                          <div className="flex justify-between items-center text-sm">
                            <span className="text-muted-foreground">Grid ID:</span>
                            <span className="font-mono font-bold text-foreground">{msg.successData.gridId}</span>
                          </div>
                          <div className="flex justify-between items-center text-sm">
                            <span className="text-muted-foreground">Category:</span>
                            <span className="font-bold text-foreground">{CATEGORY_LABELS[msg.successData.category] || msg.successData.category}</span>
                          </div>
                          <Button
                            className="w-full mt-2 bg-green-600 hover:bg-green-500 text-white h-10"
                            onClick={() => window.location.href = `/track/${msg.successData?.gridId}`}
                          >
                            Track Status →
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {/* Typing Indicator */}
            {isTyping && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-3 md:gap-4"
              >
                <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-gradient-to-br from-blue-600/50 to-purple-600/50 flex items-center justify-center shrink-0">
                  <Bot className="w-4 h-4 md:w-5 md:h-5 text-white/70" />
                </div>
                <div className="glass-card p-4 rounded-2xl rounded-tl-sm border-white/10 bg-white/5 flex gap-1.5">
                  <motion.div className="w-2 h-2 bg-blue-400/60 rounded-full" animate={{ y: [0, -5, 0] }} transition={{ duration: 0.6, repeat: Infinity, delay: 0 }} />
                  <motion.div className="w-2 h-2 bg-blue-400/60 rounded-full" animate={{ y: [0, -5, 0] }} transition={{ duration: 0.6, repeat: Infinity, delay: 0.2 }} />
                  <motion.div className="w-2 h-2 bg-blue-400/60 rounded-full" animate={{ y: [0, -5, 0] }} transition={{ duration: 0.6, repeat: Infinity, delay: 0.4 }} />
                </div>
              </motion.div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-4 md:p-6 bg-white/[0.02] border-t border-white/5 backdrop-blur-xl shrink-0">
            <input
              type="file"
              accept="image/*"
              className="hidden"
              ref={fileInputRef}
              onChange={handleImageSelect}
            />

            {selectedImage && (
              <div className="mb-4 relative inline-block">
                <div className="rounded-xl overflow-hidden border border-white/20 w-28 h-28 relative">
                  <img src={selectedImage} alt="Preview" className="w-full h-full object-cover" />
                </div>
                <button
                  onClick={() => setSelectedImage(null)}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow-lg hover:bg-red-600 transition-colors"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

            <div className="flex items-end gap-2 md:gap-3 w-full">
              {/* Attachment Buttons */}
              <div className="flex flex-col gap-2 pb-1 shrink-0">
                <Button
                  variant="ghost"
                  size="icon"
                  className={`h-10 w-10 rounded-xl transition-all ${selectedImage ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30' : 'bg-white/5 text-muted-foreground hover:bg-white/10 hover:text-foreground'}`}
                  onClick={() => fileInputRef.current?.click()}
                  title="Attach Image"
                >
                  <ImageIcon className="w-5 h-5" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className={`h-10 w-10 rounded-xl transition-all ${hasLocation ? 'bg-red-500/20 text-red-400 border border-red-500/30' : 'bg-white/5 text-muted-foreground hover:bg-white/10 hover:text-foreground'}`}
                  onClick={() => setHasLocation(!hasLocation)}
                  title="Attach Location"
                >
                  <MapPin className="w-5 h-5" />
                </Button>
              </div>

              {/* Text Input */}
              <div className="flex-grow relative" onPaste={handlePaste}>
                <Input
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSend();
                    }
                  }}
                  placeholder="Describe the civic issue you've encountered..."
                  className="min-h-[96px] md:min-h-[112px] w-full rounded-2xl bg-white/5 border-white/10 focus:border-blue-500/50 pb-10 pt-4 px-4 md:px-5 align-top text-base shadow-inner"
                />
                <div className="absolute bottom-3 left-4 text-[10px] text-muted-foreground flex gap-3">
                  {selectedImage && <span className="flex items-center gap-1 text-blue-400"><Paperclip className="w-3 h-3" /> Image Ready</span>}
                  {hasLocation && <span className="flex items-center gap-1 text-red-400"><MapPin className="w-3 h-3" /> Location Attached</span>}
                </div>
              </div>

              {/* Send Button */}
              <Button
                onClick={handleSend}
                disabled={(!inputText.trim() && !selectedImage && !hasLocation) || isTyping}
                className="h-[96px] w-[72px] md:h-[112px] md:w-[88px] rounded-2xl bg-blue-600 hover:bg-blue-500 text-white shadow-[0_0_20px_rgba(37,99,235,0.3)] shrink-0 flex flex-col gap-2 transition-all disabled:opacity-50"
              >
                <Send className="w-5 h-5 md:w-6 md:h-6" />
                <span className="text-[9px] md:text-[10px] font-bold uppercase tracking-wider">Send</span>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIAssistantPage;
