"use client";

import { useEffect, useState, use } from 'react';
import Link from 'next/link';
import { trackingService, TrackingInfo } from '@/services/trackingService';

export default function TrackingPage({ params }: { params: Promise<{ grid_id: string }> }) {
  const { grid_id } = use(params);
  const [tracking, setTracking] = useState<TrackingInfo | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTracking = async () => {
      try {
        const data = await trackingService.getTrackingInfo(grid_id);
        setTracking(data);
      } catch (err) {
        console.error('Tracking fetch failed', err);
      } finally {
        setLoading(false);
      }
    };
    fetchTracking();
  }, [grid_id]);

  if (loading) {
    return (
      <div className="bg-surface min-h-screen flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="bg-surface text-on-surface font-body selection:bg-primary-container/30 min-h-screen">
      {/* Top Navigation Bar */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-[#230B18] flex justify-between items-center w-full px-6 py-3 h-16 border-b border-outline-variant/5">
        <div className="flex items-center gap-8">
          <Link href="/">
            <span className="text-xl font-bold tracking-tighter text-[#F0D291] cursor-pointer">GrievanceGrid</span>
          </Link>
          <nav className="hidden md:flex gap-6 tracking-tight text-on-surface-variant text-sm">
            <a className="text-on-surface-variant opacity-80 hover:bg-surface-container transition-colors cursor-pointer px-2 py-1" href="#">Reports</a>
            <a className="text-tertiary border-b-2 border-primary-container pb-1 cursor-pointer" href="#">Directives</a>
          </nav>
        </div>
        <div className="flex items-center gap-4">
          <div className="relative hidden sm:block">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-sm">search</span>
            <input className="bg-surface-container-high border-none rounded-lg pl-10 pr-4 py-1.5 text-xs w-64 focus:ring-1 focus:ring-primary-container outline-none" placeholder="Search directives..." type="text"/>
          </div>
          <button className="material-symbols-outlined text-on-surface-variant hover:text-tertiary transition-colors">notifications</button>
          <button className="material-symbols-outlined text-on-surface-variant hover:text-tertiary transition-colors">help_outline</button>
          <div className="w-8 h-8 rounded-full overflow-hidden bg-surface-container-highest flex items-center justify-center border border-outline-variant/20">
            <img className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuD3-MGtP5KEowXAdsuL5omKdlpHTrSUHw3BqRn4nrLzIIZJCKDvEiXP5ap8XiVvXpIwnxnxxxMRwR78gd0Dqdwg3Muge9R9IVUaL4CUf_xgb_dYJNZ3XtjPKbejHROMmjRH-f741OisN_w533HjKo1K4tCSWzICDwI5-3IC_MQmC7p8uRZoxladHxGBM1RmUDmKOOWa060g6Zy9VVT05gWI_bMWgBfQmC_6ovLlZRXqwgOuNQkB4SPl3i9T_J4CJ_Ef9dD4G1Civxsn" alt="User" />
          </div>
        </div>
      </header>

      {/* Side Navigation Bar */}
      <aside className="fixed left-0 top-0 h-full flex flex-col py-6 z-40 bg-surface-container/60 backdrop-blur-xl w-64 border-r border-outline-variant/15 shadow-2xl shadow-primary/5 hidden md:flex">
        <div className="px-6 mb-10 mt-16">
          <Link href="/">
            <h2 className="text-lg font-black text-tertiary cursor-pointer">GrievanceGrid</h2>
          </Link>
          <p className="text-[10px] font-medium uppercase tracking-wider text-on-surface-variant opacity-60">Institutional Suite</p>
        </div>
        <nav className="flex-1 px-3 flex flex-col gap-1">
          <Link className="flex items-center gap-3 text-on-surface-variant opacity-70 px-4 py-3 text-sm font-medium uppercase tracking-wider hover:bg-surface-container hover:text-tertiary transition-all hover:translate-x-1 duration-200" href="/dashboard">
            <span className="material-symbols-outlined">dashboard</span> Dashboard
          </Link>
          <a className="flex items-center gap-3 bg-surface-container text-primary-container rounded-lg px-4 py-3 border-l-4 border-primary-container text-sm font-medium uppercase tracking-wider transition-all" href="#">
            <span className="material-symbols-outlined">folder_open</span> Cases
          </a>
          <a className="flex items-center gap-3 text-on-surface-variant opacity-70 px-4 py-3 text-sm font-medium uppercase tracking-wider hover:bg-surface-container hover:text-tertiary transition-all hover:translate-x-1 duration-200" href="#">
            <span className="material-symbols-outlined">gavel</span> Audit
          </a>
          <a className="flex items-center gap-3 text-on-surface-variant opacity-70 px-4 py-3 text-sm font-medium uppercase tracking-wider hover:bg-surface-container hover:text-tertiary transition-all hover:translate-x-1 duration-200" href="#">
            <span className="material-symbols-outlined">analytics</span> Analytics
          </a>
          <a className="flex items-center gap-3 text-on-surface-variant opacity-70 px-4 py-3 text-sm font-medium uppercase tracking-wider hover:bg-surface-container hover:text-tertiary transition-all hover:translate-x-1 duration-200" href="#">
            <span className="material-symbols-outlined">settings</span> Settings
          </a>
        </nav>
        <div className="mt-auto px-4">
          <Link href="/submit" className="w-full bg-linear-to-br from-primary to-primary-container text-on-primary font-bold py-3 rounded-lg flex items-center justify-center gap-2 shadow-lg shadow-primary-container/20 active:opacity-70 transition-all text-center">
            <span className="material-symbols-outlined text-lg">add_circle</span>
            <span className="text-xs uppercase tracking-widest">New Case</span>
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="md:ml-64 pt-20 p-8 min-h-screen bg-surface">
        <div className="max-w-7xl mx-auto">
          {/* Header Section */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2 mb-2">
                <span className="px-2 py-0.5 bg-surface-container-highest text-primary-container text-[10px] font-bold tracking-widest uppercase rounded">Priority α-1</span>
                <span className="text-on-surface-variant/40 text-[10px] uppercase font-bold tracking-widest">ID: {grid_id}</span>
              </div>
              <h1 className="text-4xl font-black text-tertiary tracking-tighter">Resolution Matrix: {tracking?.current_status || 'INITIALIZING'}</h1>
              <p className="text-on-surface-variant max-w-lg">Live monitoring of technical response and institutional grievance resolution node.</p>
            </div>
            {/* Digital Countdown SLA Timer */}
            <div className="bg-surface-container-low p-6 rounded-xl border-l-4 border-primary-container flex flex-col items-center min-w-[200px]">
              <span className="text-[10px] uppercase font-bold tracking-[0.2em] text-on-surface-variant/60 mb-2">SLA Time Remaining</span>
              <div className="text-4xl font-mono font-black text-primary tracking-widest flex gap-1">
                <span>04</span><span className="animate-pulse">:</span><span>28</span><span className="animate-pulse">:</span><span>51</span>
              </div>
              <div className="w-full h-1 bg-surface-container-highest mt-4 rounded-full overflow-hidden">
                <div className="bg-primary-container h-full w-2/3"></div>
              </div>
            </div>
          </div>

          {/* Bento Grid Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Vertical Timeline */}
            <div className="lg:col-span-5 bg-surface-container-low rounded-xl p-8 shadow-inner overflow-hidden relative border border-outline-variant/10">
              <h3 className="text-xs font-bold uppercase tracking-widest text-tertiary mb-8 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-primary animate-ping"></span> Resolution Protocol
              </h3>
              <div className="relative flex flex-col gap-10">
                <div className="absolute left-[15px] top-2 bottom-2 w-0.5 bg-outline-variant/20"></div>
                
                {tracking?.nodes.map((step, i) => (
                  <div key={i} className="relative flex gap-6 group">
                    <div className={`z-10 w-8 h-8 rounded-full ${i === 0 ? 'bg-primary-container' : 'bg-surface-container-highest'} flex items-center justify-center shadow-lg shadow-primary-container/20`}>
                      <span className="material-symbols-outlined text-sm">{i === 0 ? 'verified' : 'history'}</span>
                    </div>
                    <div className="flex-1">
                      <span className="text-[10px] font-bold text-primary tracking-widest uppercase">{step.timestamp ? new Date(step.timestamp).toLocaleTimeString() : 'PENDING'}</span>
                      <h4 className="text-lg font-bold text-on-surface">{step.title}</h4>
                      <p className="text-sm text-on-surface-variant leading-relaxed">{step.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Column: Map and Metadata */}
            <div className="lg:col-span-7 flex flex-col gap-6">
              <div className="h-[400px] bg-surface-container rounded-xl overflow-hidden relative group shadow-2xl border border-outline-variant/10">
                <img className="w-full h-full object-cover opacity-60 mix-blend-luminosity" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCBOEx6wQNJNidRxbjcerNbWfOexWwu4zMrpRS8kveE3oHqhT4d6uiQ6Q_IMg92DIoOiQxr9Zo9yNMSOfiAi84dUoClUNgmq2H7R4-e5kiRib9a6QSNjcro12m02ht6vSueT265Cr7AGT_ZM5gNzRwTrOci6ZiDfM52klhEJA8ZazqMP-KV1xR88VKIHB0uOjD9PD8OuRVoU4qJeLasxUFTMWS5LMOKyyJYn3rD_liEJY2ErtUePGZxUwABbGp58t0WzPcZdQQiOXu7" alt="Map" />
                <div className="absolute inset-0 bg-gradient-to-t from-surface-container via-transparent to-transparent"></div>
                <div className="absolute top-4 right-4 bg-surface/80 backdrop-blur-md p-3 rounded-lg border border-outline-variant/10">
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="text-[9px] uppercase font-black text-on-surface-variant/40 tracking-widest leading-tight">Live Velocity</p>
                      <p className="text-lg font-mono text-tertiary">42 KM/H</p>
                    </div>
                    <div className="h-8 w-px bg-outline-variant/20"></div>
                    <div className="text-right">
                      <p className="text-[9px] uppercase font-black text-on-surface-variant/40 tracking-widest leading-tight">Heading</p>
                      <p className="text-lg font-mono text-tertiary">NW 32°</p>
                    </div>
                  </div>
                </div>
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="relative">
                    <div className="absolute -inset-8 bg-primary/20 rounded-full animate-ping"></div>
                    <div className="w-4 h-4 bg-primary rounded-full shadow-[0_0_15px_#ffcba2]"></div>
                    <div className="absolute top-6 left-1/2 -translate-x-1/2 bg-surface p-2 rounded border border-primary/40 whitespace-nowrap">
                      <span className="text-[10px] font-bold text-on-surface uppercase tracking-tighter">NODE POSITION</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-surface-container-low p-6 rounded-xl border border-outline-variant/5">
                  <h5 className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant/60 mb-4">Assigned Crew</h5>
                  <div className="flex items-center gap-4">
                    <img className="w-12 h-12 rounded-lg object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuB4IMhS951BfOg3LxZIN7xJtt381lUC4HoN_8agRlOHS_pNj4kQNcfyENnT2ORMXK_tCFngK7_rtkZvc_F0030JLKgVr9uzbGfOtVs1cHf84c38roj-nkrEh49KeZqpBvDS3mP42QOT7eyAofY56_XOT5UfUAfeitYlCyBfXjCTn1Rtcjn0O2Lm1offt57el9NHIh4tI2c3LTR5w5ygQrGlG-MOm-I8PWp5WuifzQ_2A7KNjCasB4MSN0mCi9ijUuHGzxU8ae6lU91h" alt="Supervisor" />
                    <div>
                      <p className="text-on-surface font-bold">John Vance</p>
                      <p className="text-xs text-on-surface-variant">Field Supervisor • 12 Years Exp.</p>
                    </div>
                  </div>
                </div>
                <div className="bg-surface-container-low p-6 rounded-xl border border-outline-variant/5">
                  <h5 className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant/60 mb-4">Resources Deployed</h5>
                  <div className="flex flex-wrap gap-2">
                    <span className="bg-surface-container px-3 py-1 rounded text-[10px] font-bold text-tertiary">1x Heavy Duty Utility</span>
                    <span className="bg-surface-container px-3 py-1 rounded text-[10px] font-bold text-tertiary">2x Signal Techs</span>
                    <span className="bg-surface-container px-3 py-1 rounded text-[10px] font-bold text-tertiary">1x AI-Integrator</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
