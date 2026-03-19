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
    <div className="bg-[#230B18] text-[#D9C2B2] h-screen w-screen overflow-hidden font-body selection:bg-primary/30">
      {/* Global Layout Wrapper */}
      <div className="flex h-full w-full relative">
        {/* SideNavBar - 1:1 with global_mission_control_hud_dark */}
        <aside className="fixed left-0 top-0 h-full flex flex-col py-6 z-40 bg-surface-container/60 backdrop-blur-xl border-r border-outline-variant/15 w-64 shadow-2xl shadow-primary/5">
          <div className="px-6 mb-8">
            <Link href="/">
              <h1 className="text-lg font-black text-[#F0D291] cursor-pointer">GrievanceGrid</h1>
            </Link>
            <p className="text-xs font-medium uppercase tracking-wider text-[#FFA552] opacity-80">Institutional Suite</p>
          </div>
          <nav className="flex-1 flex flex-col gap-1 px-2">
            <Link className="flex items-center gap-3 bg-surface-container text-primary-container rounded-lg px-4 py-3 border-l-4 border-primary-container text-sm font-medium uppercase tracking-wider hover:translate-x-1 duration-200" href="/admin/dashboard">
              <span className="material-symbols-outlined">dashboard</span>
              <span>Dashboard</span>
            </Link>
            <a className="flex items-center gap-3 text-[#D9C2B2] opacity-70 px-4 py-3 text-sm font-medium uppercase tracking-wider hover:bg-[#311724] hover:text-[#F0D291] transition-all hover:translate-x-1 duration-200" href="#">
              <span className="material-symbols-outlined">folder_open</span>
              <span>Cases</span>
            </a>
            <a className="flex items-center gap-3 text-on-surface-variant opacity-70 px-4 py-3 text-sm font-medium uppercase tracking-wider hover:bg-surface-container hover:text-tertiary transition-all hover:translate-x-1 duration-200" href="#">
              <span className="material-symbols-outlined">gavel</span>
              <span>Audit</span>
            </a>
            <a className="flex items-center gap-3 text-[#D9C2B2] opacity-70 px-4 py-3 text-sm font-medium uppercase tracking-wider hover:bg-[#311724] hover:text-[#F0D291] transition-all hover:translate-x-1 duration-200" href="#">
              <span className="material-symbols-outlined">analytics</span>
              <span>Analytics</span>
            </a>
            <a className="flex items-center gap-3 text-[#D9C2B2] opacity-70 px-4 py-3 text-sm font-medium uppercase tracking-wider hover:bg-[#311724] hover:text-[#F0D291] transition-all hover:translate-x-1 duration-200" href="#">
              <span className="material-symbols-outlined">settings</span>
              <span>Settings</span>
            </a>
          </nav>
          <div className="mt-auto px-6 space-y-4">
            <button className="w-full py-3 bg-linear-to-br from-[#FFCBA2] to-[#FFA552] text-[#4c2700] font-bold text-xs uppercase tracking-widest rounded-lg shadow-lg shadow-[#FFA552]/20 active:scale-95 transition-transform">
              New Case
            </button>
            <div className="flex items-center gap-3 text-[#D9C2B2] opacity-70 px-4 py-3 text-xs font-medium uppercase tracking-wider cursor-pointer">
              <span className="material-symbols-outlined">contact_support</span>
              <span>Support</span>
            </div>
          </div>
        </aside>

        {/* Main Workspace (Canvas) */}
        <main className="flex-1 ml-64 relative overflow-hidden bg-[#1d0612]">
          {/* TopNavBar */}
          <header className="flex justify-between items-center w-full px-6 py-3 h-16 bg-[#230B18] z-30 relative border-b border-[#534437]/15">
            <div className="flex items-center gap-8">
              <div className="flex items-center gap-4 bg-[#2D1320] px-3 py-1.5 rounded-lg border border-[#534437]/15">
                <span className="material-symbols-outlined text-[#FFA552]">search</span>
                <input className="bg-transparent border-none focus:ring-0 text-sm tracking-tight text-[#D9C2B2] placeholder:text-[#D9C2B2]/40 w-64 outline-none" placeholder="Search mission parameters..." type="text"/>
              </div>
              <nav className="hidden lg:flex items-center gap-6 tracking-tight text-[#D9C2B2] text-sm font-medium">
                <a className="text-[#F0D291] border-b-2 border-[#FFA552] pb-1 cursor-pointer" href="#">Reports</a>
                <a className="text-[#D9C2B2] opacity-80 hover:text-[#F0D291] transition-colors cursor-pointer" href="#">Directives</a>
              </nav>
            </div>
            <div className="flex items-center gap-4">
              <span className="material-symbols-outlined text-[#FFA552] cursor-pointer">notifications</span>
              <span className="material-symbols-outlined text-[#D9C2B2]/80 cursor-pointer">help_outline</span>
              <div className="w-8 h-8 rounded-full overflow-hidden border border-[#FFA552]/30">
                <img className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDmMa6b9Ud24XOw2GoZNM_buVL0-wU5ZjlYC_GcdHaPARd1hTiJLyDvLYjKAYNjrP3ReUXS65ca19frAw2khdrWVYxPSZb23fxiv9xIdsMCYr7iAezOvWHNsFG-ZenxoHhqt4gbE0zKF91c15Prw0dSBKRI00sNA7bndu3wuA66tNV57SXQf98XMhD2PORgVQ4t36ikxXi00JdAuaRsogNdwki77OeIuZJf36W9ojidiBHo4fOp1OyKn81yw_jnIck2I11aK5GJG8sQ" alt="Admin" />
              </div>
            </div>
          </header>

          {/* Mission Control Content */}
          <div className="absolute inset-0 z-0 industrial-grid opacity-30"></div>
          
          {/* Full Screen Map Foundation */}
          <div className="absolute inset-0 z-0">
            <img className="w-full h-full object-cover opacity-40 mix-blend-screen" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBFnp4dknxWoGNUZOWw5wVMNNdMToDLj9ME76tUmDHSKwRCx3yV6Y4oK7j3xFYWpQXTSeZasPljmaOWMNRk4Uyp336Fl5Rsmfvx_mlRvLuQ0jQhAiA8gpF9v66kBrurzwHIysgaF9wDPSWWlzLqGGt_L7LV_e8nok3uaAJJWZ4iTJ1Pe4YbEAPE8CvvidxNYKiAP190fouTBydtzVK-j6rGQvr-FOi_1j2J6sORNVwwgBD-11NNFNBf7nc6V11Eme933xnfCbTjG-WG" alt="Satellite" />
            
            {/* Pulsing Hotspots Overlays */}
            <div className="absolute top-[30%] left-[45%] group cursor-pointer">
              <div className="absolute inset-0 bg-primary/20 rounded-full animate-ping"></div>
              <div className="relative w-4 h-4 bg-primary rounded-full shadow-lg shadow-primary/50"></div>
              <div className="absolute top-6 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap bg-surface-container-highest px-3 py-1 rounded-lg text-[10px] font-bold tracking-widest text-tertiary">
                   SECTOR 7G: CRITICAL (9.4)
              </div>
            </div>
            <div className="absolute top-[55%] left-[62%] group cursor-pointer">
              <div className="absolute inset-0 bg-error/20 rounded-full animate-ping"></div>
              <div className="relative w-4 h-4 bg-error rounded-full shadow-lg shadow-error/50"></div>
              <div className="absolute top-6 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap bg-surface-container-highest px-3 py-1 rounded-lg text-[10px] font-bold tracking-widest text-error">
                   SECTOR 12B: BREACH (0.8)
              </div>
            </div>
          </div>

          {/* HUD Panels - Left Sidebar Overlay */}
          <div className="absolute left-6 top-24 bottom-6 w-80 flex flex-col gap-4 z-10">
            {/* Live AI Audit Stream */}
            <section className="bg-surface-container/60 backdrop-blur-xl p-4 rounded-xl border border-outline-variant/15 flex-1 flex flex-col overflow-hidden">
              <header className="flex justify-between items-center mb-4 border-b border-outline-variant/10 pb-2">
                <span className="text-[10px] font-bold tracking-[0.2em] text-tertiary uppercase">AI Audit Stream</span>
                <span className="w-2 h-2 bg-primary rounded-full animate-pulse shadow-sm shadow-primary"></span>
              </header>
              <div className="flex-1 space-y-4 overflow-y-auto pr-2 custom-scrollbar">
                {[
                  { time: '14:02:41', tag: 'SYSTEM', msg: 'Anomalous directive detected in Sector 7G. Initiating sentiment purge sequence.', color: 'primary' },
                  { time: '14:02:12', tag: 'AUDIT', msg: 'Conflict resolution #4412 finalized. Efficiency +12.4% against previous quarter.', color: 'tertiary' },
                  { time: '13:58:04', tag: 'ALERT', msg: 'Protocol violation in Directive 88-Alpha. Human intervention bypassed.', color: 'error' },
                  { time: '13:55:29', tag: 'LOG', msg: 'Institutional stability index remains steady at 98.4%. No immediate threats.', color: 'on-surface-variant' }
                ].map((log, i) => (
                  <div key={i} className={`flex flex-col gap-1 border-l-2 border-${log.color}/40 pl-3 py-1`}>
                    <span className={`text-[9px] font-mono text-${log.color}/60`}>{log.time} // {log.tag}</span>
                    <p className="text-[11px] leading-relaxed text-on-surface-variant">{log.msg}</p>
                  </div>
                ))}
              </div>
            </section>
            
            {/* Sector Metrics */}
            <section className="bg-surface-container/60 backdrop-blur-xl p-4 rounded-xl border border-outline-variant/15 h-48">
              <header className="mb-3">
                <span className="text-[10px] font-bold tracking-[0.2em] text-tertiary uppercase">Resource Allocation</span>
              </header>
              <div className="space-y-3">
                {['Compute Power', 'Personnel Readiness', 'Conflict Suppression'].map((metric, i) => (
                  <div key={i}>
                    <div className="flex justify-between text-[10px] mb-1">
                      <span className="text-on-surface-variant/60 uppercase">{metric}</span>
                      <span className="text-primary font-bold">{i === 0 ? '88%' : i === 1 ? '42%' : '64%'}</span>
                    </div>
                    <div className="h-1 w-full bg-surface-container-highest rounded-full overflow-hidden">
                      <div className={`h-full bg-${i === 1 ? 'tertiary' : 'primary'} w-[${i === 0 ? '88%' : i === 1 ? '42%' : '64%'}]`}></div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* Bottom HUD Panels */}
          <div className="absolute bottom-6 left-[22rem] right-6 h-32 flex gap-4 z-10">
            <div className="flex-1 grid grid-cols-4 gap-4">
              {[
                { label: 'NORTH AMER', val: '0.12', color: 'primary', trend: 'trending_down' },
                { label: 'EURO ZONE', val: '8.94', color: 'error', trend: 'trending_up', alert: true },
                { label: 'APAC RIM', val: '3.41', color: 'tertiary', trend: 'trending_flat' },
                { label: 'GLOBAL AGG', val: '1.04', color: 'on-surface', trend: 'show_chart' }
              ].map((zone, i) => (
                <div key={i} className={`bg-surface-container/60 backdrop-blur-xl p-3 rounded-xl border border-outline-variant/15 flex flex-col justify-center ${zone.alert ? 'border-t-2 border-t-error/50' : ''}`}>
                  <span className="text-[9px] font-bold tracking-widest text-on-surface-variant/50 uppercase">{zone.label}</span>
                  <div className="flex items-end gap-2">
                    <span className={`text-2xl font-black text-${zone.color}`}>{zone.val}</span>
                    <span className={`material-symbols-outlined text-[14px] mb-1 text-${zone.color}`}>{zone.trend}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Visual Deck */}
          <div className="absolute right-6 top-24 bottom-44 w-64 flex flex-col gap-4 z-10">
            <section className="bg-surface-container/60 backdrop-blur-xl p-4 rounded-xl border border-outline-variant/15 flex-1 overflow-hidden relative">
              <header className="mb-4 relative z-10">
                <span className="text-[10px] font-bold tracking-[0.2em] text-tertiary uppercase">Target Feed</span>
              </header>
              <div className="aspect-video bg-[#1d0612] rounded-lg overflow-hidden border border-outline-variant/20 mb-4 relative">
                <img className="w-full h-full object-cover grayscale brightness-75 contrast-125" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCWAGFDPjhr3EnLTGVmelfXxCq21u_GvESHTvBnVQPHDJpIPJswYwDEo6Yslllco6XM_leq43TIrWwBnD_dMBEr00Pr-NB2xKt_d2DWdSIjwshzcV_GCcTeJU9xquv_en2kBZJPAChIuWqfWahMOSVBHXtfLdihKj79CwoyaB2yLSCgJnVGbADHgEs2y3ns7d0kJ-K1zePxVJwKajxIwk5yhYFoMsrbrGRnjj7SxuXcJ0tZhb6D8GU57_Swxpk0OIuxK45lvcf49gDc" alt="CCTV" />
                <div className="absolute top-2 left-2 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-error rounded-full animate-pulse"></span>
                  <span className="text-[8px] font-mono text-error font-bold">LIVE CAM 04-A</span>
                </div>
              </div>
              <div className="space-y-4 relative z-10">
                <div className="flex flex-col gap-1">
                  <span className="text-[9px] text-on-surface-variant/40 uppercase">Identified Subject</span>
                  <span className="text-[11px] font-bold text-on-surface uppercase tracking-wider">Citizen ID: #9901-X</span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-[9px] text-on-surface-variant/40 uppercase">Probability Rating</span>
                  <div className="flex items-center gap-2">
                    <div className="h-2 flex-1 bg-surface-container-highest rounded-full">
                      <div className="h-full bg-error w-[78%]"></div>
                    </div>
                    <span className="text-[10px] text-error font-bold">78.2%</span>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </main>
      </div>
    </div>
  );
}
