"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function AdminDashboard() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="bg-surface text-on-surface font-body h-screen overflow-hidden antialiased selection:bg-primary/30">
      {/* Top HUD Navigation Anchor */}
      <header className="w-full sticky top-0 z-50 flex items-center justify-between px-8 h-16 bg-surface border-b border-outline-variant/10 shadow-warm-glow">
        <div className="flex items-center gap-8">
          <Link href="/">
            <span className="text-xl font-bold tracking-tighter text-tertiary cursor-pointer">GrievanceGrid</span>
          </Link>
          <nav className="hidden md:flex items-center gap-6">
            <a className="text-on-surface-variant opacity-70 hover:text-primary transition-colors duration-200 cursor-pointer text-sm font-medium tracking-tight" href="#">Analytics</a>
            <a className="text-on-surface-variant opacity-70 hover:text-primary transition-colors duration-200 cursor-pointer text-sm font-medium tracking-tight" href="#">Department</a>
            <a className="text-on-surface-variant opacity-70 hover:text-primary transition-colors duration-200 cursor-pointer text-sm font-medium tracking-tight" href="#">Reports</a>
            <a className="text-on-surface-variant opacity-70 hover:text-primary transition-colors duration-200 cursor-pointer text-sm font-medium tracking-tight" href="#">Archive</a>
            <a className="text-primary-container border-b-2 border-primary-container pb-1 text-sm font-medium tracking-tight" href="#">Strategy</a>
          </nav>
        </div>
        <div className="flex items-center gap-4">
          <button className="material-symbols-outlined text-on-surface-variant cursor-pointer hover:text-primary-container transition-all">notifications</button>
          <button className="material-symbols-outlined text-on-surface-variant cursor-pointer hover:text-primary-container transition-all">settings</button>
          <div className="h-8 w-8 rounded-full bg-surface-container-highest border border-outline-variant/20 overflow-hidden ml-2 shadow-inner">
            <img alt="Admin" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBTFqa4DBNinYt1rrzcqNA8_fDDJ_FDY4ElPG0-wuh-N64fNynqbgAcSh2GV_7S19Y6zBGijPAtGz_maFYQNsPskTeN7MBOjaQyiOH7oJgkrgCNb7HqZCn7vMR6sXzRC4O_9BJliydx94NuT-wENezEiEB56YdVD3jVNs3E-qOHu8Nbn_jAu_2KEpkobpUk3xnwqtoGgZlUzwc0O61IadU4aPrVWeqzoSXDbKz4RLDmZlVVzsLn9a9J_hJaIGr3qls5YMGrr4h2u3yy" />
          </div>
        </div>
      </header>

      <main className="relative h-[calc(100vh-64px)] w-full flex overflow-hidden">
        {/* Background Strategic Map Component */}
        <div className="absolute inset-0 z-0 bg-surface industrial-grid pointer-events-none">
          <div className="absolute inset-0 bg-linear-to-b from-transparent via-surface/40 to-surface"></div>
          {/* Tactical Map Mockup */}
          <div className="w-full h-full relative overflow-hidden">
            <img alt="Strategic Map" className="w-full h-full object-cover opacity-10 grayscale contrast-150 mix-blend-luminosity brightness-75 transition-all duration-1000" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDv7yLyNf1iepZoO6mK_pW0vzTupssTX7C4dYDal3CqhpEbhmpMIlRN8wL4Px4NgE_8K3OmLVTIaT2MHNdlsjQBHZwyTtTdeqb1ww5_MILRuvx_eOMmv0fC8RkrSfRxKAhzAv3HMCKTdAI6NEwDLNUqfdclcNwyyIubwugT4vmBpNdXLFeLKQWqXVrEsyYR9olkDPGq876IQM9-KWacih5heVeKNbxafAgEvZfgjqRqGVWkITKjB-dpU1j11rM_dFFXVosv1kyl8YCQ" />
            {/* Pulsing Data Clusters */}
            <div className="absolute top-1/4 left-1/3 group">
              <div className="w-12 h-12 bg-primary/20 rounded-full animate-pulse border border-primary/40"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-2 h-2 bg-primary rounded-full shadow-lg shadow-primary"></div>
              </div>
            </div>
            <div className="absolute top-1/2 left-2/3">
              <div className="w-20 h-20 bg-primary/10 rounded-full border border-primary/30 animate-ping duration-[3000ms]"></div>
            </div>
          </div>
        </div>

        {/* Global Control Sidebar */}
        <aside className="h-full w-64 bg-surface-container/60 backdrop-blur-xl border-r border-outline-variant/15 flex flex-col py-6 px-4 gap-8 z-20">
          <div className="flex flex-col gap-1 px-2">
            <span className="text-tertiary font-black italic tracking-tighter text-lg">GovTech</span>
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-on-surface-variant/40">Strategic Ops HUD</span>
          </div>

          <button className="w-full bg-linear-to-br from-primary to-primary-container text-on-primary py-3 px-4 rounded-lg font-bold text-xs uppercase tracking-widest shadow-xl shadow-primary/10 flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-95 transition-all mb-4">
            <span className="material-symbols-outlined text-sm">add</span>
            New Directive
          </button>

          <nav className="flex flex-col gap-2 flex-grow overflow-y-auto no-scrollbar">
            {[
              { label: 'Dashboard', icon: 'dashboard', active: false },
              { label: 'Cases', icon: 'gavel', active: false },
              { label: 'Queue', icon: 'view_list', active: false },
              { label: 'Personnel', icon: 'group', active: false },
              { label: 'Strategy', icon: 'query_stats', active: true },
              { label: 'System', icon: 'terminal', active: false }
            ].map((item, i) => (
              <a 
                key={i}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg font-medium text-xs uppercase tracking-widest transition-all ${
                  item.active 
                    ? 'text-primary-container bg-surface-container border-r-4 border-primary-container' 
                    : 'text-on-surface-variant/60 hover:bg-surface-container hover:text-tertiary'
                }`}
                href="#"
              >
                <span className="material-symbols-outlined text-lg">{item.icon}</span>
                {item.label}
              </a>
            ))}
          </nav>

          <div className="border-t border-outline-variant/10 pt-4 flex flex-col gap-2">
            <a className="flex items-center gap-3 px-4 py-2 text-on-surface-variant/60 text-[10px] font-bold uppercase tracking-widest hover:text-tertiary transition-colors" href="#">
              <span className="material-symbols-outlined text-base">help</span> Support
            </a>
            <Link href="/login" className="flex items-center gap-3 px-4 py-2 text-on-surface-variant/60 text-[10px] font-bold uppercase tracking-widest hover:text-error transition-colors">
              <span className="material-symbols-outlined text-base">logout</span> Logout
            </Link>
          </div>
        </aside>

        {/* Main HUD Interface */}
        <div className="flex-1 relative z-10 flex flex-col pointer-events-none">
          {/* Top KPI Stream */}
          <div className="w-full p-6 flex justify-between gap-6 pointer-events-auto">
            {[
              { label: 'Total Active', val: '12,842', trend: '+2.4% Δ', color: 'text-primary-container' },
              { label: 'SLA Compliance', val: '98.2%', trend: 'STABLE', color: 'text-tertiary' },
              { label: 'Critical Clusters', val: '07', trend: 'WARNING', color: 'text-error' }
            ].map((kpi, i) => (
              <div key={i} className="flex-1 bg-surface-container/80 backdrop-blur-md border border-outline-variant/15 p-5 rounded-xl shadow-2xl flex flex-col justify-between">
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-on-surface-variant/40">{kpi.label}</span>
                <div className="flex items-end justify-between mt-2">
                  <span className={`text-3xl font-black ${kpi.color} leading-none tracking-tighter`}>{kpi.val}</span>
                  <span className={`text-[9px] font-mono font-bold ${kpi.color === 'text-error' ? 'text-error' : 'text-primary/60'}`}>{kpi.trend}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Central Dashboard View */}
          <div className="flex-1 flex justify-between p-6 gap-6 items-end overflow-hidden">
            {/* Left: Sector Crisis Index */}
            <section className="w-80 bg-surface-container/60 backdrop-blur-xl border border-outline-variant/15 p-6 rounded-2xl pointer-events-auto flex flex-col gap-6 self-start shadow-2xl">
              <div className="flex items-center justify-between border-b border-outline-variant/10 pb-4">
                <h2 className="text-xs font-black uppercase tracking-[0.2em] text-tertiary">Sector Crisis Score</h2>
                <span className="material-symbols-outlined text-sm text-on-surface-variant/40">signal_cellular_alt</span>
              </div>
              <div className="space-y-6">
                {[
                  { name: 'NORTH SECTOR [N-01]', score: 84, active: true },
                  { name: 'CENTRAL HUB [C-04]', score: 42, active: false },
                  { name: 'SOUTHERN EDGE [S-12]', score: 96, active: true }
                ].map((sector, i) => (
                  <div key={i} className="space-y-3">
                    <div className="flex justify-between text-[10px] font-bold tracking-widest uppercase">
                      <span className="text-on-surface-variant/80">{sector.name}</span>
                      <span className={sector.score > 80 ? 'text-primary-container' : 'text-tertiary'}>{sector.score}/100</span>
                    </div>
                    <div className="flex gap-1 h-1.5 w-full">
                      {[...Array(10)].map((_, idx) => (
                        <div 
                          key={idx} 
                          className={`flex-1 rounded-sm transition-all duration-1000 ${
                            idx < Math.floor(sector.score / 10) 
                              ? (sector.score > 80 ? 'bg-primary-container shadow-[0_0_8px_rgba(255,165,82,0.4)]' : 'bg-tertiary') 
                              : 'bg-surface-container-highest'
                          }`}
                        ></div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4 p-4 bg-surface-container-lowest/40 rounded-lg border border-outline-variant/10 text-[9px] text-on-surface-variant/50 font-mono italic leading-relaxed">
                $ analyze --threat-vectors --sector="all"
                <br />[OK] Neural mesh synchronization complete.
                <br />[OK] Accuracy 99.42% verified.
              </div>
            </section>

            {/* Right: AI Audit Stream Terminal */}
            <section className="w-96 h-[500px] bg-surface-container/80 backdrop-blur-2xl border border-outline-variant/15 rounded-2xl pointer-events-auto flex flex-col overflow-hidden shadow-2xl">
              <div className="p-4 border-b border-outline-variant/15 flex items-center justify-between bg-surface-container-high/40">
                <span className="text-[10px] font-black uppercase tracking-widest text-tertiary">Real-time AI Audit</span>
                <div className="flex items-center gap-2">
                  <span className="text-[8px] font-bold text-primary animate-pulse uppercase tracking-tighter">LIVE_FEED</span>
                  <div className="w-1.5 h-1.5 rounded-full bg-primary shadow-glow shadow-primary"></div>
                </div>
              </div>
              <div className="flex-1 p-5 font-mono text-[10px] leading-relaxed text-on-surface-variant/80 overflow-y-auto space-y-4 scanline custom-scrollbar">
                <div className="space-y-2 opacity-50">
                  <p className="text-tertiary">[16:58:12] INITIALIZING_NODE_4...</p>
                  <p>[16:58:45] GLOBAL_SYNC: COMPLETED</p>
                </div>
                <div className="flex gap-3">
                  <span className="text-primary-container opacity-40">17:02:04</span>
                  <p className="text-on-surface"><span className="text-tertiary font-bold">SYS:</span> Scanning N-01 cluster patterns...</p>
                </div>
                <div className="flex gap-3 bg-primary/5 p-2 rounded border-l-2 border-primary">
                  <span className="text-primary-container opacity-40">17:02:08</span>
                  <p className="text-on-surface">AUDIT: Grievance anomaly detected in infrastructure sub-layer Sector [N-01].</p>
                </div>
                <div className="flex gap-3">
                  <span className="text-primary-container opacity-40">17:02:15</span>
                  <p className="text-error font-bold">WARN: Conflict resolution escalation in progress.</p>
                </div>
                <div className="flex gap-3">
                  <span className="text-primary-container opacity-40">17:03:01</span>
                  <p>SYS: Routing additional personnel to S-12 vector for validation.</p>
                </div>
                <div className="flex gap-3 opacity-40">
                  <span className="text-primary-container opacity-40">17:03:22</span>
                  <p>IDLE: Baseline frequency monitoring...</p>
                </div>
                <div className="flex gap-3 border-l-2 border-tertiary pl-2">
                  <span className="text-primary-container opacity-40">17:04:00</span>
                  <p className="text-tertiary font-bold">MATCH: Pattern ID#84920 resolved successfully.</p>
                </div>
              </div>
              <div className="p-3 bg-surface-container-lowest border-t border-outline-variant/15 flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-primary animate-ping"></div>
                <span className="text-[9px] font-bold text-on-surface-variant/60 uppercase tracking-widest uppercase">Grid Mesh Sync Active</span>
              </div>
            </section>
          </div>
        </div>
      </main>

      {/* Mobile Nav Overlay (For Small Screens Only) */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-surface-container border-t border-outline-variant/10 flex items-center justify-around z-50">
        <span className="material-symbols-outlined text-primary-container">dashboard</span>
        <span className="material-symbols-outlined text-on-surface-variant">gavel</span>
        <div className="relative -top-6">
          <button className="h-14 w-14 rounded-full bg-linear-to-br from-primary to-primary-container text-on-primary shadow-xl shadow-primary/20 flex items-center justify-center">
            <span className="material-symbols-outlined text-3xl font-bold">add</span>
          </button>
        </div>
        <span className="material-symbols-outlined text-on-surface-variant">analytics</span>
        <span className="material-symbols-outlined text-on-surface-variant">settings</span>
      </nav>
    </div>
  );
}
