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
  Check
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { aiService } from "@/services/ai.service";
import { grievanceService } from "@/services/grievance.service";

type Message = {
  id: string;
  sender: "user" | "ai";
  text: string;
  imageBase64?: string;
  location?: boolean;
  isSubmitting?: boolean;
  successData?: {
    gridId: string;
    category: string;
  };
};

type ChatSession = {
  id: string;
  title: string;
  messages: Message[];
  updatedAt: Date;
};

const LOCAL_STORAGE_KEY = "grievance_grid_ai_sessions";

// Helper to safely parse dates from JSON
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

const AIAssistantPage = () => {
  // Chat History State
  const [sessions, setSessions] = useState<ChatSession[]>(loadSessions());
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(
    sessions.length > 0 ? sessions[0].id : null
  );

  // Chat Actions State
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [editingSessionId, setEditingSessionId] = useState<string | null>(null);
  const [editTitleText, setEditTitleText] = useState("");

  // Current Input State
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
    if (sessions.length === 0) {
      startNewSession();
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
    const newSession: ChatSession = {
      id: Date.now().toString(),
      title: "New Chat",
      updatedAt: new Date(),
      messages: [{
        id: "welcome",
        sender: "ai",
        text: "Hello! I am your AI Assistant. Describe your grievance, paste/upload an image, or share your location, and I will analyze the details for you.",
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

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
    // reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Handle Ctrl+V Paste
  const handlePaste = useCallback((e: React.ClipboardEvent) => {
    const items = e.clipboardData?.items;
    if (!items) return;

    for (let i = 0; i < items.length; i++) {
      if (items[i].type.indexOf('image') !== -1) {
        const file = items[i].getAsFile();
        if (file) {
          const reader = new FileReader();
          reader.onloadend = () => {
            setSelectedImage(reader.result as string);
          };
          reader.readAsDataURL(file);
        }
        break;
      }
    }
  }, []);

  const handleSend = async () => {
    if (!inputText.trim() && !selectedImage && !hasLocation) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      sender: "user",
      text: inputText,
      imageBase64: selectedImage || undefined,
      location: hasLocation
    };

    const newMessages = [...messages, userMsg];
    let newTitle = currentSession?.title;
    
    // Auto-generate title for the session on first user message
    if (messages.length === 1 && currentSession?.title === "New Chat") {
      newTitle = inputText.slice(0, 30) + (inputText.length > 30 ? "..." : "") || "Image Upload";
    }

    updateSession(newMessages, newTitle);
    
    // Keep local consts for AI call
    const promptToSend = inputText || "Please analyze this attached image/location for my grievance report.";
    const imageToSend = selectedImage || undefined;

    setInputText("");
    setSelectedImage(null);
    setHasLocation(false);
    setIsTyping(true);

    try {
      // Add loading message
      const loadingMsgId = "loading-" + Date.now();
      updateSession([...newMessages, {
        id: loadingMsgId,
        sender: "ai",
        text: "Analyzing your input...",
        isSubmitting: true
      }], newTitle);

      const aiResult = await aiService.processGrievanceContext(promptToSend, imageToSend);
      
      const updatedMessages = [...newMessages];
      
      updatedMessages.push({
        id: Date.now().toString(),
        sender: "ai",
        text: aiResult.message
      });

      updateSession(updatedMessages, newTitle);

      if (aiResult.action === "submit" && aiResult.report) {
         // Show another temporary progress message
         const submitMsgId = Date.now().toString() + "_submitting";
         const finalMessages = [...updatedMessages, {
           id: submitMsgId,
           sender: "ai",
           text: "Compiling formal report and submitting to the city grid...",
           isSubmitting: true
         } as Message];
         updateSession(finalMessages, newTitle);

         try {
           const payload = {
             title: aiResult.report.title,
             description: aiResult.report.description,
             category: aiResult.report.category,
             latitude: 28.6139, // Mock Coordinates for now
             longitude: 77.2090, 
             location_address: "AI Extracted Context",
             before_photo_url: "" // Usually uploaded to S3 first
           };

           const backendRes = await grievanceService.submit(payload);

           finalMessages.pop(); // Remove the compiling message
           
           finalMessages.push({
             id: Date.now().toString() + "_doc",
             sender: "ai",
             text: "Your grievance is officially logged. Here is your ticket information:",
             successData: {
               gridId: backendRes.grid_id,
               category: aiResult.report.category
             }
           } as Message);
           
           updateSession([...finalMessages], newTitle);
         } catch(submitErr) {
           finalMessages.pop();
           finalMessages.push({
             id: Date.now().toString() + "_err",
             sender: "ai",
             text: "I encountered an error submitting the case directly to the server. Please try again later."
           } as Message);
           updateSession([...finalMessages], newTitle);
         }
      }

    } catch (error) {
       updateSession([...newMessages, {
        id: Date.now().toString(),
        sender: "ai",
        text: "I'm sorry, I encountered an error. Please try again or check your API configuration."
      }], newTitle);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col pt-16 lg:pt-24 pb-0 h-screen overflow-hidden">
      
      {/* Decorative Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none z-0" />

      {/* Main Layout */}
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

        {/* History Sidebar (Left) */}
        <AnimatePresence>
          {(isSidebarOpen || window.innerWidth >= 1024) && (
            <motion.aside
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 280, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              className={`glass-card border-white/5 bg-white/[0.01] rounded-3xl flex flex-col overflow-hidden shadow-2xl shrink-0 absolute lg:relative z-40 h-full ${window.innerWidth < 1024 ? 'left-4 right-4 sm:right-auto' : ''}`}
            >
              <div className="p-4 border-b border-white/5 flex gap-2">
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
                      <button
                        onClick={() => {
                          setCurrentSessionId(session.id);
                          if (window.innerWidth < 1024) setIsSidebarOpen(false);
                          setActiveDropdown(null);
                        }}
                        className={`w-full text-left px-4 py-3 rounded-xl flex items-center justify-between transition-all duration-300 ${
                          currentSessionId === session.id 
                            ? 'bg-blue-600/15 text-blue-300 border border-blue-500/20 shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)]' 
                            : 'text-muted-foreground hover:bg-white/[0.08] hover:text-foreground'
                        }`}
                      >
                        <div className="flex items-center gap-3 overflow-hidden">
                          <MessageSquare className={`w-4 h-4 shrink-0 transition-colors ${currentSessionId === session.id ? 'text-blue-400' : ''}`} />
                          <span className="text-sm font-medium truncate">{session.title}</span>
                        </div>
                        
                        <div className={`shrink-0 flex items-center transition-opacity ${currentSessionId === session.id ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'} md:opacity-0 md:group-hover:opacity-100`}>
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              setActiveDropdown(activeDropdown === session.id ? null : session.id);
                            }}
                            className="p-1 hover:bg-white/10 rounded-md transition-colors text-muted-foreground hover:text-foreground"
                          >
                            <MoreVertical className="w-4 h-4" />
                          </button>
                        </div>
                      </button>
                    )}

                    {/* Custom 3-dots Dropdown Menu built with explicit React logic */}
                    {activeDropdown === session.id && (
                      <>
                        <div className="fixed inset-0 z-40" onClick={(e) => { e.stopPropagation(); setActiveDropdown(null); }} />
                        <div className="absolute right-4 top-10 z-50 w-36 glass-card bg-[#0b0f19]/95 backdrop-blur-2xl border border-white/10 p-1 rounded-xl shadow-2xl origin-top-right animate-in fade-in zoom-in-95">
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
            </motion.aside>
          )}
        </AnimatePresence>

        {/* Main Chat Area (Right) */}
        <div className="flex-1 glass-card border-white/5 bg-white/[0.01] rounded-3xl flex flex-col overflow-hidden shadow-2xl relative h-full">
          
          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6 scroll-smooth" onPaste={handlePaste}>
            <AnimatePresence initial={false}>
              {messages.map((msg) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div className={`flex gap-3 md:gap-4 max-w-[85%] md:max-w-[75%] ${msg.sender === "user" ? "flex-row-reverse" : "flex-row"}`}>
                    
                    {/* Avatar */}
                    <div className={`w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center shrink-0 ${
                      msg.sender === "user" 
                        ? "bg-blue-600 shadow-[0_0_15px_rgba(37,99,235,0.4)]" 
                        : "bg-purple-600 shadow-[0_0_15px_rgba(147,51,234,0.4)]"
                    }`}>
                      {msg.sender === "user" ? <User className="w-4 h-4 md:w-5 md:h-5 text-white" /> : <Bot className="w-4 h-4 md:w-5 md:h-5 text-white" />}
                    </div>

                    {/* Chat Bubble */}
                    <div className={`glass-card p-4 rounded-2xl border-white/10 ${
                      msg.sender === "user" 
                        ? "bg-blue-600/10 rounded-tr-sm border-blue-500/20" 
                        : "bg-white/5 rounded-tl-sm"
                    }`}>
                      
                      {/* Image Preview in Message */}
                      {msg.imageBase64 && (
                        <div className="mb-3 rounded-xl overflow-hidden border border-white/10 max-w-[300px]">
                          <img src={msg.imageBase64} alt="Attached in chat" className="w-full h-auto object-cover" />
                        </div>
                      )}

                      {msg.text && (
                        <div className="text-sm md:text-base text-foreground/90 leading-relaxed whitespace-pre-wrap prose prose-invert max-w-none">
                          {msg.text.split('\n').map((line, i) => <span key={i}>{line}<br/></span>)}
                        </div>
                      )}

                      {/* Attachments UI */}
                      {msg.location && (
                        <div className="flex gap-2 mt-3 pt-3 border-t border-white/5">
                          <Badge variant="outline" className="bg-white/5 border-white/10 gap-1 text-xs py-1">
                            <MapPin className="w-3 h-3 text-red-400" />
                            Location Attached
                          </Badge>
                        </div>
                      )}

                      {/* Submitting Loader */}
                      {msg.isSubmitting && (
                        <div className="flex items-center gap-2 mt-4 text-sm text-blue-400 font-medium">
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Processing...
                        </div>
                      )}

                      {/* Success Card */}
                      {msg.successData && (
                        <div className="mt-4 p-4 rounded-xl bg-green-500/10 border border-green-500/20 space-y-3">
                          <div className="flex items-center gap-2 text-green-400 font-bold">
                            <CheckCircle className="w-5 h-5" />
                            Report Confirmed
                          </div>
                          <div className="flex justify-between items-center text-sm">
                            <span className="text-muted-foreground">ID:</span>
                            <span className="font-mono font-bold text-foreground">{msg.successData.gridId}</span>
                          </div>
                          <div className="flex justify-between items-center text-sm">
                            <span className="text-muted-foreground">Category:</span>
                            <span className="font-bold text-foreground">{msg.successData.category}</span>
                          </div>
                          <Button 
                            className="w-full mt-2 bg-green-600 hover:bg-green-500 text-white h-10"
                            onClick={() => window.location.href = `/track/${msg.successData?.gridId}`}
                          >
                            Track Status
                          </Button>
                        </div>
                      )}

                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {isTyping && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-3 md:gap-4"
              >
                 <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-purple-600/50 shadow-[0_0_15px_rgba(147,51,234,0.4)] flex items-center justify-center shrink-0">
                  <Bot className="w-4 h-4 md:w-5 md:h-5 text-white/70" />
                </div>
                <div className="glass-card p-4 rounded-2xl rounded-tl-sm border-white/10 bg-white/5 flex gap-1">
                  <motion.div className="w-2 h-2 bg-white/40 rounded-full" animate={{ y: [0, -5, 0] }} transition={{ duration: 0.6, repeat: Infinity, delay: 0 }} />
                  <motion.div className="w-2 h-2 bg-white/40 rounded-full" animate={{ y: [0, -5, 0] }} transition={{ duration: 0.6, repeat: Infinity, delay: 0.2 }} />
                  <motion.div className="w-2 h-2 bg-white/40 rounded-full" animate={{ y: [0, -5, 0] }} transition={{ duration: 0.6, repeat: Infinity, delay: 0.4 }} />
                </div>
              </motion.div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-4 md:p-6 bg-white/[0.02] border-t border-white/5 backdrop-blur-xl shrink-0">
             
             {/* Hidden file input for Browsing Images */}
             <input 
               type="file" 
               accept="image/*" 
               className="hidden" 
               ref={fileInputRef} 
               onChange={handleImageSelect}
             />

             {/* Preview area for image before sending */}
             {selectedImage && (
               <div className="mb-4 relative inline-block">
                 <div className="rounded-xl overflow-hidden border border-white/20 w-32 h-32 relative">
                   <img src={selectedImage} alt="Preview" className="w-full h-full object-cover" />
                 </div>
                 <button 
                   onClick={() => setSelectedImage(null)}
                   className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow-lg hover:bg-red-600 transition-colors"
                 >
                   <X className="w-4 h-4" />
                 </button>
               </div>
             )}

             <div className="flex items-end gap-2 md:gap-4 w-full">
               
               {/* Attachment Tools */}
               <div className="flex flex-col gap-2 pb-1 shrink-0">
                 <Button 
                   variant="ghost" 
                   size="icon" 
                   className={`h-10 w-10 md:h-12 md:w-12 rounded-xl transition-all ${selectedImage ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30' : 'bg-white/5 text-muted-foreground hover:bg-white/10 hover:text-foreground'}`}
                   onClick={() => fileInputRef.current?.click()}
                   title="Browse or Paste Image"
                 >
                   <ImageIcon className="w-5 h-5" />
                 </Button>
                 <Button 
                   variant="ghost" 
                   size="icon" 
                   className={`h-10 w-10 md:h-12 md:w-12 rounded-xl transition-all ${hasLocation ? 'bg-red-500/20 text-red-400 border border-red-500/30' : 'bg-white/5 text-muted-foreground hover:bg-white/10 hover:text-foreground'}`}
                   onClick={() => setHasLocation(!hasLocation)}
                   title="Attach Location"
                 >
                   <MapPin className="w-5 h-5" />
                 </Button>
               </div>

               {/* Text Input */}
               <div className="flex-grow relative border-white/10" onPaste={handlePaste}>
                 <Input
                   value={inputText}
                   onChange={(e) => setInputText(e.target.value)}
                   onKeyDown={(e) => {
                     if (e.key === 'Enter' && !e.shiftKey) {
                       e.preventDefault();
                       handleSend();
                     }
                   }}
                   placeholder="Describe your issue or Paste an image"
                   className="min-h-[100px] md:min-h-[120px] w-full rounded-2xl md:rounded-3xl bg-white/5 border-white/10 focus:border-blue-500/50 pb-12 pt-4 px-4 md:px-6 align-top text-base shadow-inner"
                 />
                 <div className="absolute bottom-4 left-4 md:left-6 text-[10px] md:text-xs text-muted-foreground flex gap-3">
                    {selectedImage && <span className="flex items-center gap-1 text-blue-400"><Paperclip className="w-3 h-3"/> Image Ready</span>}
                    {hasLocation && <span className="flex items-center gap-1 text-red-400"><MapPin className="w-3 h-3"/> Location grabbed</span>}
                 </div>
               </div>

               {/* Send Button */}
               <Button 
                 onClick={handleSend}
                 disabled={(!inputText.trim() && !selectedImage && !hasLocation) || isTyping}
                 className="h-[100px] w-[80px] md:h-[120px] md:w-[100px] rounded-2xl md:rounded-3xl bg-blue-600 hover:bg-blue-500 text-white shadow-[0_0_20px_rgba(37,99,235,0.3)] shrink-0 flex flex-col gap-2 transition-all disabled:opacity-50 disabled:shadow-none"
               >
                 <Send className="w-6 h-6 md:w-8 md:h-8" />
                 <span className="text-[10px] md:text-xs font-bold uppercase tracking-wider">Send</span>
               </Button>

             </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default AIAssistantPage;
