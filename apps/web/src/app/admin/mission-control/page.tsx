"use client";

import Link from "next/link";
import React from "react";
import { motion } from "framer-motion";
import { Bot, Sparkles, Search } from "lucide-react";

export default function GeneratedPage() {
  return (
    <>
<div className="w-full min-h-screen bg-background font-display text-primary">

<header className="flex flex-wrap items-center justify-between p-6 z-10 w-full shrink-0 border-b border-plum/10 bg-white/50 backdrop-blur-md sticky top-0">
  <div className="flex items-center gap-8">
    <Link href="/admin/mission-control">
      <h1 className="text-xl font-bold tracking-tighter text-plum flex items-center gap-2">
        <div className="size-8 bg-plum text-white rounded flex items-center justify-center">
          <span className="material-symbols-outlined text-sm">grid_view</span>
        </div>
        GrievanceGrid
      </h1>
    </Link>
    <nav className="hidden md:flex items-center gap-6">
      <Link className="text-sm font-bold text-plum border-b-2 border-plum pb-1" href="/admin/mission-control">Dashboard</Link>
      <Link className="text-sm font-medium text-slate-500 hover:text-plum transition-colors" href="/admin/ai-assistant">AI Assistant</Link>
      <Link className="text-sm font-medium text-slate-500 hover:text-plum transition-colors" href="/admin/analytics">Reports</Link>
      <Link className="text-sm font-medium text-slate-500 hover:text-plum transition-colors" href="/admin/escalations">SLA</Link>
    </nav>
  </div>
  
  <div className="flex gap-4">
    <div className="flex-1 min-w-[150px] reduced-industrial p-3 flex flex-col justify-between h-16">
      <h2 className="text-[10px] font-bold uppercase tracking-wider text-plum/50">Total Active</h2>
      <span className="text-xl font-bold font-mono text-plum">14,285</span>
    </div>
    <div className="flex-1 min-w-[150px] reduced-industrial p-3 flex flex-col justify-between h-16">
      <h2 className="text-[10px] font-bold uppercase tracking-wider text-plum/50">SLA Compliance</h2>
      <span className="text-xl font-bold font-mono text-plum">87.4%</span>
    </div>
  </div>
</header>
<main className="flex-1 flex overflow-hidden relative">
<div className="absolute inset-0 z-0 bg-white grid-bg" data-alt="High-contrast light grey/white interactive map" style={{ backgroundImage: 'url(\'https://lh3.googleusercontent.com/aida-public/AB6AXuBkbeKEdriTCooN5ES2dwMLlrgitmBb_Qcfdt4I2rfj8loWjN3WHrHKa9K1Par4YJsCBai_1RXnoxJL3FWK7yRdA4tY8D5bw1ZacfeN_IhLbZEhYKHCgp-7sfVu1JfV7YjKm20qo3OAB3p2jfep2QHL2tioilWB4hTQnvNX6Wcn3EZkBfxM8ABeCqLHCMpMnJhQ8tIllWH4UDkuEgtRxVJtHjERmmBX9opI-WPAKjKIjLVoSEPxxbSqNzyOl3L7F8dPD0UAgZExxcbo\')', backgroundSize: 'cover', backgroundPosition: 'center', mixBlendMode: 'luminosity', opacity: '0.7' }}>
<div className="absolute top-1/4 left-1/3 w-32 h-32 bg-plum/10 rounded-full blur-sm border border-plum/20"></div>
<div className="absolute bottom-1/3 right-1/4 w-48 h-48 bg-plum/5 rounded-full blur-md border border-plum/20"></div>
<div className="absolute top-1/2 left-1/2 w-16 h-16 bg-red-100/50 border border-plum rounded-full flex items-center justify-center" style={{ boxShadow: '0 0 15px 2px rgba(56, 29, 42, 0.1)' }}>
<span className="material-symbols-outlined text-plum font-light">warning</span>
</div>
<div className="absolute top-1/3 right-1/3 w-4 h-4 bg-sage border border-plum rotate-45 flex items-center justify-center shadow-sm">
<div className="w-1 h-1 bg-white rounded-full"></div>
</div>
<div className="absolute bottom-1/4 left-1/4 w-4 h-4 bg-sage border border-plum rotate-45 flex items-center justify-center shadow-sm">
<div className="w-1 h-1 bg-white rounded-full"></div>
</div>
</div>
<aside className="w-80 h-[calc(100vh-140px)] ml-6 flex flex-col z-10 reduced-industrial bg-white/95 backdrop-blur-sm relative">
<div className="p-4 border-b border-plum/20 flex items-center justify-between">
<h1 className="text-lg font-medium uppercase tracking-wider text-plum">Sector Status</h1>
<span className="material-symbols-outlined text-plum text-2xl font-light">radar</span>
</div>
<div className="flex-1 overflow-y-auto p-4 space-y-3">
<div className="p-3 bg-gray-50 rounded border border-plum/10 hover:border-plum/30 transition-colors cursor-pointer">
<div className="flex justify-between items-center mb-2">
<span className="text-sm font-medium uppercase text-plum">Sector Alpha</span>
<span className="material-symbols-outlined text-plum text-sm">error</span>
</div>
<div className="flex gap-1 h-1.5">
<div className="flex-1 bg-plum rounded-full"></div>
<div className="flex-1 bg-plum rounded-full"></div>
<div className="flex-1 bg-plum rounded-full"></div>
<div className="flex-1 bg-plum/20 rounded-full"></div>
</div>
</div>
<div className="p-3 bg-gray-50 rounded border border-plum/10 hover:border-plum/30 transition-colors cursor-pointer">
<div className="flex justify-between items-center mb-2">
<span className="text-sm font-medium uppercase text-plum">Sector Beta</span>
<span className="material-symbols-outlined text-sage text-sm">check_circle</span>
</div>
<div className="flex gap-1 h-1.5">
<div className="flex-1 bg-plum rounded-full"></div>
<div className="flex-1 bg-plum/20 rounded-full"></div>
<div className="flex-1 bg-plum/20 rounded-full"></div>
<div className="flex-1 bg-plum/20 rounded-full"></div>
</div>
</div>
<div className="p-3 bg-gray-50 rounded border border-plum/10 hover:border-plum/30 transition-colors cursor-pointer">
<div className="flex justify-between items-center mb-2">
<span className="text-sm font-medium uppercase text-plum">Sector Gamma</span>
<span className="material-symbols-outlined text-yellow-600 text-sm">warning</span>
</div>
<div className="flex gap-1 h-1.5">
<div className="flex-1 bg-plum rounded-full"></div>
<div className="flex-1 bg-plum rounded-full"></div>
<div className="flex-1 bg-plum/20 rounded-full"></div>
<div className="flex-1 bg-plum/20 rounded-full"></div>
</div>
</div>
</div>
<div className="p-4 border-t border-plum/20 bg-white rounded-b">
<Link href="/admin/forensic-verify" className="w-full bg-plum text-white text-sm font-medium py-2.5 uppercase tracking-wider rounded border border-transparent hover:bg-plum/90 transition-colors shadow-sm">
                    Deploy Crew
                </Link>
</div>
</aside>
<div className="absolute top-6 right-6 z-10 flex flex-col gap-2">
<div className="reduced-industrial flex flex-col overflow-hidden">
<Link href="/admin/grievances" className="p-2 border-b border-plum/20 hover:bg-gray-50 flex items-center justify-center transition-colors">
<span className="material-symbols-outlined text-plum font-light">add</span>
</Link>
<Link href="/admin/mission-control" className="p-2 hover:bg-gray-50 flex items-center justify-center transition-colors">
<span className="material-symbols-outlined text-plum font-light">remove</span>
</Link>
</div>
<Link href="/admin/mission-control" className="reduced-industrial p-2 hover:bg-gray-50 flex items-center justify-center mt-2 transition-colors">
<span className="material-symbols-outlined text-plum font-light">my_location</span>
</Link>
</div>
<div className="absolute bottom-6 right-6 z-50 flex flex-col items-end gap-3 group">
  {/* Tooltip Bubble */}
  <motion.div 
    initial={{ opacity: 0, scale: 0.9, x: 20 }}
    animate={{ opacity: 1, scale: 1, x: 0 }}
    transition={{ delay: 1.5, duration: 0.5 }}
    className="glass-card bg-[#0b0f19]/95 backdrop-blur-xl border border-plum/30 text-xs font-medium px-4 py-3 rounded-2xl rounded-br-sm shadow-[0_0_30px_rgba(56,29,42,0.15)] text-plum/80 max-w-[220px] pointer-events-none"
  >
    <div className="flex items-start gap-2 text-plum">
      <Sparkles className="w-3.5 h-3.5 shrink-0 mt-0.5" />
      <span>AI Assistant: Query grid status or operational reports.</span>
    </div>
  </motion.div>
  
  <Link href="/admin/ai-assistant">
    <motion.button 
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      className="w-14 h-14 md:w-16 md:h-16 rounded-full bg-plum text-white shadow-[0_0_25px_rgba(56,29,42,0.4)] transition-all duration-300 flex items-center justify-center p-0 border border-plum/30 hover:shadow-[0_0_35px_rgba(56,29,42,0.6)] relative overflow-hidden"
    >
      <Bot className="w-7 h-7 md:w-8 md:h-8 relative z-10" />
      <div className="absolute inset-0 bg-white/10 animate-pulse" />
      <motion.div 
        animate={{ rotate: 360 }}
        transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
        className="absolute inset-0 border-2 border-dashed border-white/20 rounded-full"
      />
    </motion.button>
  </Link>
</div>

<div className="absolute bottom-6 right-6 z-10 w-96 reduced-industrial overflow-hidden bg-light-slate">
<div className="bg-white px-3 py-2 flex justify-between items-center border-b border-plum/20">
<span className="text-plum font-medium uppercase text-xs tracking-wider">AI Audit Stream</span>
<div className="flex gap-1.5">
<div className="w-2.5 h-2.5 rounded-full border border-plum bg-transparent"></div>
<div className="w-2.5 h-2.5 rounded-full border border-plum bg-transparent"></div>
</div>
</div>
<div className="p-4 h-48 overflow-y-auto font-mono text-plum text-xs flex flex-col gap-2 bg-light-slate/50">
<p className="opacity-80">&gt; [SYSTEM] Processing cluster analysis...</p>
<p className="opacity-80">&gt; [AI] Routing field crew to Gamma-7.</p>
<p className="text-yellow-700">&gt; [WARNING] Anomaly detected in Grid 4A.</p>
<p className="text-red-700 font-bold">&gt; [ALERT] Hotspot critical in Sector Zeta.</p>
<p className="opacity-80">&gt; [SYSTEM] Re-routing backup protocols.</p>
<div className="flex items-center gap-2 mt-2 pt-2 border-t border-plum/10">
  <span className="text-plum font-bold">QUERY_ID:</span>
  <input 
     placeholder="Search ticket..."
     className="bg-transparent border-none focus:ring-0 w-full text-[11px] p-0 placeholder:text-plum/30"
  />
  <Search className="w-3 h-3 text-plum/50 font-bold" />
</div>
</div>
</div>
</main>

</div>
    </>
  );
}
