import Link from "next/link";
import React from "react";

export default function GeneratedPage() {
  return (
    <>
<div className="w-full min-h-screen bg-background font-display text-primary">

<header className="flex flex-wrap gap-4 p-6 z-10 w-full shrink-0">
<div className="flex-1 min-w-[200px] reduced-industrial p-4 flex flex-col justify-between">
<h2 className="text-sm font-medium uppercase tracking-wider mb-2 text-plum/70">Total Active</h2>
<div className="flex justify-between items-end">
<span className="text-3xl font-bold font-mono text-plum">14,285</span>
<span className="text-sage font-bold text-sm">+12%</span>
</div>
</div>
<div className="flex-1 min-w-[200px] reduced-industrial p-4 flex flex-col justify-between">
<h2 className="text-sm font-medium uppercase tracking-wider mb-2 text-plum/70">SLA Compliance</h2>
<div className="flex justify-between items-end">
<span className="text-3xl font-bold font-mono text-plum">87.4%</span>
<span className="text-red-400 font-bold text-sm">-2.1%</span>
</div>
</div>
<div className="flex-1 min-w-[200px] reduced-industrial p-4 flex flex-col justify-between">
<h2 className="text-sm font-medium uppercase tracking-wider mb-2 text-plum/70">Critical Clusters</h2>
<div className="flex justify-between items-end">
<span className="text-3xl font-bold font-mono text-plum">24</span>
<span className="text-sage font-bold text-sm">+4</span>
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
<p>&gt; _</p>
</div>
</div>
</main>

</div>
    </>
  );
}
