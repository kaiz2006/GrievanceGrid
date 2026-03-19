"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function LandingPage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="bg-surface text-on-surface font-body selection:bg-primary-container/30 selection:text-primary min-h-screen antialiased">
      {/* TopAppBar - Clean Landing Navigation */}
      <header className="w-full sticky top-0 z-50 bg-surface/60 backdrop-blur-xl border-b border-outline-variant/10 shadow-warm-glow">
        <nav className="flex items-center justify-between px-8 h-16 w-full max-w-7xl mx-auto">
          <div className="flex items-center gap-8">
            <Link href="/">
              <span className="text-xl font-bold tracking-tighter text-tertiary cursor-pointer">GrievanceGrid</span>
            </Link>
            <div className="hidden md:flex items-center gap-6 tracking-tight text-on-surface-variant">
              <a className="text-primary-container border-b-2 border-primary-container pb-1 cursor-pointer transition-colors duration-200" href="#">Analytics</a>
              <a className="text-on-surface-variant opacity-70 hover:text-primary transition-colors duration-200 cursor-pointer" href="#">Department</a>
              <a className="text-on-surface-variant opacity-70 hover:text-primary transition-colors duration-200 cursor-pointer" href="#">Reports</a>
              <a className="text-on-surface-variant opacity-70 hover:text-primary transition-colors duration-200 cursor-pointer" href="#">Archive</a>
            </div>
          </div>
          <div className="flex items-center gap-4 text-primary-container">
            <Link href="/login" className="material-symbols-outlined cursor-pointer hover:text-primary transition-colors">login</Link>
            <button className="material-symbols-outlined cursor-pointer hover:text-primary transition-colors">settings</button>
            <div className="w-8 h-8 rounded-full overflow-hidden border border-outline-variant/30 ml-2">
              <img alt="User" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBfbfUaFwYkJ5Te7p12nIWGBxRSBCAjEfpvTGEYnDFYWczjskp43rQjnbgrLhigzbAHwDJqkuKQK2bWtFUh4dlK-aj5kUhXqtoTUtCoLNId7jVaHX0GKyg8wXi-6dPkuKa-_ndxu3qFIDhfqah7VmLDKzumhg7tfcWDP47dZkR_ziuA5YPejyAw5PxAgw-ESLzZYFLf0o3OAwxggcHolnWKab6sWyNDr7aTdKrQD6kj-_40WbNEErrYSlRlKUOaXTfYxdvmkqUK2Ich" />
            </div>
          </div>
        </nav>
      </header>

      <main className="relative overflow-hidden">
        {/* Background Ambient Glows */}
        <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-primary-container/5 rounded-full blur-[120px] -z-10"></div>
        <div className="absolute bottom-[20%] left-[-10%] w-[600px] h-[600px] bg-surface-variant/20 rounded-full blur-[150px] -z-10"></div>

        {/* Hero Section - Full Width Marketing Style */}
        <section className="max-w-7xl mx-auto px-8 pt-20 pb-32 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-8 animate-in fade-in slide-in-from-left duration-700">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface-container-high border border-outline-variant/20">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
              <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-tertiary">V4.0 Stable Engine</span>
            </div>
            <h1 className="text-6xl lg:text-7xl font-bold tracking-tight text-on-surface leading-[1.1]">
              The AI Operating System for <span className="text-tertiary">Civic Infrastructure</span>
            </h1>
            <p className="text-xl text-on-surface-variant max-w-lg font-light leading-relaxed">
              Automate the intake, triage, and resolution of public grievances with sub-second precision using the Grid-Core neural architecture.
            </p>
            <div className="flex items-center gap-6 pt-4">
              <Link href="/login" className="bg-linear-to-br from-primary to-primary-container text-on-primary px-8 py-4 rounded-lg font-semibold shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all">
                Initialize Grid
              </Link>
              <button className="flex items-center gap-2 text-tertiary hover:text-primary transition-colors group">
                <span className="material-symbols-outlined transition-transform group-hover:scale-110">play_circle</span>
                <span className="font-medium">System Walkthrough</span>
              </button>
            </div>
          </div>

          <div className="hidden lg:block animate-in fade-in slide-in-from-right duration-1000">
            <div className="relative bg-surface-container-low rounded-xl p-4 shadow-2xl border border-outline-variant/10 rotate-x-6 -rotate-y-12 rotate-z-2 hover:rotate-0 transition-transform duration-700 cursor-default">
              <div className="absolute inset-0 bg-linear-to-tr from-primary/5 to-transparent rounded-xl pointer-events-none"></div>
              {/* Dashboard Mockup Header */}
              <div className="flex items-center justify-between mb-4 px-2">
                <div className="flex gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-error/40"></div>
                  <div className="w-2.5 h-2.5 rounded-full bg-tertiary/40"></div>
                  <div className="w-2.5 h-2.5 rounded-full bg-on-surface-variant/40"></div>
                </div>
                <div className="text-[10px] font-mono text-on-surface-variant/60">GRID_CORE_OS_v4.02</div>
              </div>
              {/* Map Visualization HUD Mockup */}
              <div className="bg-surface-container-lowest rounded-lg h-[400px] relative overflow-hidden group">
                <img className="w-full h-full object-cover opacity-20 mix-blend-luminosity grayscale group-hover:grayscale-0 transition-all duration-1000" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDNNojjBSBSaciyVzfq1ChqIjWTuDIx9Gnm5ZQxm8jT-ZZarvKL3Qy8k8tFdqjHPZlz2LvYnQ70oDFyufcX0-o40ISsGE270Jks_i9A3f-ENoEwQTcaaS4lZ4jcXaOcaQiWfmTzgGBtxb80_wULCxZHMBvDhbjJRVOmUvrD1pkaW1KM_u_L_qFBjgHzP2pkvNpHs0u-UTA_su4C7djtR3Su9pyV3GuB-hMC1ICk5E4On4JOjFYDtfpCRitgr242BOK2hL32NZc-mTHe" alt="HUD Map" />
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="w-full h-full p-8 grid grid-cols-4 grid-rows-4 gap-4">
                    <div className="col-start-2 row-start-2 w-3 h-3 rounded-full bg-primary animate-pulse shadow-sm shadow-primary"></div>
                    <div className="col-start-3 row-start-1 w-2 h-2 rounded-full bg-tertiary"></div>
                    <div className="col-start-4 row-start-3 w-4 h-4 rounded-full border border-primary/40 flex items-center justify-center">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary"></div>
                    </div>
                  </div>
                </div>
                {/* HUD Overlay Mini-Card */}
                <div className="absolute bottom-4 left-4 bg-surface-container-highest/90 backdrop-blur-md p-4 rounded-lg border border-outline-variant/20 max-w-[200px] shadow-xl">
                  <div className="text-[10px] text-tertiary uppercase tracking-widest mb-1 font-bold">Active Incident</div>
                  <div className="text-sm font-bold text-on-surface">District 7 Block B</div>
                  <div className="mt-2 h-1 w-full bg-outline-variant/30 rounded-full overflow-hidden">
                    <div className="h-full bg-primary w-2/3"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Global Stats Trust Bar */}
        <section className="border-y border-outline-variant/10 py-12 bg-surface-container-lowest/50">
          <div className="max-w-7xl mx-auto px-8 flex flex-wrap justify-center md:justify-between items-center gap-12">
            {[
              { label: 'Requests Managed', val: '15,000+' },
              { label: 'Routing Accuracy', val: '99.8%' },
              { label: 'Avg Response', val: '14ms' },
              { label: 'Cities Integrated', val: '142' }
            ].map((stat, i) => (
              <div key={i} className="text-center md:text-left group">
                <div className="text-3xl font-black text-tertiary group-hover:scale-110 transition-transform origin-left">{stat.val}</div>
                <div className="text-[10px] uppercase tracking-[0.2em] text-on-surface-variant/60 mt-1 font-bold">{stat.label}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Bento Grid Features - Precision & Industrial Aesthetic */}
        <section className="max-w-7xl mx-auto px-8 py-32">
          <div className="mb-16">
            <h2 className="text-4xl font-bold text-on-surface tracking-tight mb-4">Engineered for Industrial <span className="text-tertiary">Performance</span></h2>
            <p className="text-on-surface-variant max-w-2xl font-light">Precision tools for high-stakes civic management. No bloat, just performance.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
            {/* Feature: Neural Routing */}
            <div className="md:col-span-3 bg-surface-container-low border border-outline-variant/10 p-8 rounded-xl relative overflow-hidden group hover:bg-surface-container transition-all">
              <div className="relative z-10">
                <div className="w-12 h-12 rounded-lg bg-surface-container-highest flex items-center justify-center text-primary mb-6 shadow-inner">
                  <span className="material-symbols-outlined text-2xl">neurology</span>
                </div>
                <h3 className="text-2xl font-bold text-tertiary mb-4">AI-Agentic Routing</h3>
                <p className="text-on-surface-variant leading-relaxed">Our grid automatically classifies and directs every grievance to the correct department agent with zero human intervention needed.</p>
              </div>
              <div className="mt-12 bg-surface-container-lowest/50 rounded-lg p-4 border border-outline-variant/10 font-mono text-[9px] text-tertiary/40">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></div>
                  <span>PACKET_ID: 772A-PROC</span>
                </div>
                <div className="h-1 w-full bg-outline-variant/10 rounded-full overflow-hidden">
                  <div className="h-full bg-primary/40 w-[85%]"></div>
                </div>
              </div>
            </div>

            {/* Feature: Verification */}
            <div className="md:col-span-3 bg-surface-container-low border border-outline-variant/10 p-8 rounded-xl group hover:bg-surface-container transition-all flex gap-8 items-center">
              <div className="flex-1">
                <h3 className="text-2xl font-bold text-tertiary mb-3">Institutional Auth</h3>
                <p className="text-on-surface-variant leading-relaxed">Hardware-level verification for civic reporters ensuring data integrity and preventing system spam.</p>
              </div>
              <div className="w-24 h-24 rounded-full bg-surface-container-highest flex items-center justify-center shrink-0 border border-primary/20 shadow-xl group-hover:scale-105 transition-transform">
                <span className="material-symbols-outlined text-4xl text-primary">verified_user</span>
              </div>
            </div>

            {/* Feature: Geo-Intelligence */}
            <div className="md:col-span-6 bg-surface-container-low border border-outline-variant/10 p-10 rounded-xl group hover:bg-surface-container transition-all flex flex-col md:flex-row gap-12 items-center">
              <div className="flex-1">
                 <h3 className="text-3xl font-bold text-tertiary mb-4">Geospatial Intelligence</h3>
                 <p className="text-lg text-on-surface-variant font-light leading-relaxed">Precision mapping and automated geofencing ensure that every grievance is accurately pinned to its physical coordinate.</p>
              </div>
              <div className="flex gap-2 h-32 items-end">
                {[40, 60, 55, 80, 45, 90, 70, 30].map((h, i) => (
                  <div key={i} className="w-4 bg-primary/20 rounded-t-sm group-hover:bg-primary transition-all duration-500" style={{ height: `${h}%`, transitionDelay: `${i * 100}ms` }}></div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Final CTA Strip */}
        <section className="max-w-7xl mx-auto px-8 mb-32">
          <div className="bg-surface-container-low border border-outline-variant/10 rounded-xl p-16 text-center relative overflow-hidden group">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-px bg-linear-to-r from-transparent via-primary/40 to-transparent"></div>
            <div className="relative z-10">
              <h2 className="text-4xl font-bold text-on-surface mb-6">Ready to upgrade your infrastructure?</h2>
              <p className="text-on-surface-variant max-w-xl mx-auto mb-10 text-lg">Deploy GrievanceGrid in your department today and experience the precision of an AI-driven operating system.</p>
              <div className="flex justify-center items-center gap-6">
                <Link href="/login" className="bg-primary text-on-primary px-10 py-4 rounded-lg font-bold hover:bg-primary-container shadow-xl shadow-primary/10 transition-all active:scale-95">
                  Start Onboarding
                </Link>
                <button className="border border-outline-variant/30 text-tertiary px-10 py-4 rounded-lg font-bold hover:bg-surface-container-highest transition-all active:scale-95">
                  Request Brief
                </button>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Corporate Footer */}
      <footer className="bg-surface-container-lowest border-t border-outline-variant/10 py-16 px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="col-span-1 md:col-span-2">
            <span className="text-2xl font-black tracking-tighter text-tertiary mb-6 block">GrievanceGrid</span>
            <p className="text-on-surface-variant/60 max-w-sm leading-relaxed mb-8">Precision-engineered software for the future of civic operations. Built by GovTech Labs.</p>
            <div className="flex gap-4">
              {['terminal', 'public', 'data_thresholding'].map((icon, i) => (
                <div key={i} className="w-10 h-10 rounded-lg bg-surface-container flex items-center justify-center text-on-surface-variant/40 hover:text-primary transition-colors cursor-pointer border border-outline-variant/10">
                  <span className="material-symbols-outlined">{icon}</span>
                </div>
              ))}
            </div>
          </div>
          <div>
            <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-tertiary mb-6">System</h4>
            <ul className="space-y-4 text-sm text-on-surface-variant/60">
              <li><a className="hover:text-primary transition-all" href="#">Core Engine</a></li>
              <li><a className="hover:text-primary transition-all" href="#">Neural Routing</a></li>
              <li><a className="hover:text-primary transition-all" href="#">Security Layer</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-tertiary mb-6">Infrastructure</h4>
            <ul className="space-y-4 text-sm text-on-surface-variant/60">
              <li><a className="hover:text-primary transition-all" href="#">Global Nodes</a></li>
              <li><a className="hover:text-primary transition-all" href="#">API Registry</a></li>
              <li><a className="hover:text-primary transition-all" href="#">Audit Protocol</a></li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-20 pt-8 border-t border-outline-variant/5 flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] text-on-surface-variant/40 uppercase tracking-widest font-mono">
          <div>© 2026 GRIEVANCE_GRID_SYSTEMS. ALL_RIGHTS_RESERVED.</div>
          <div className="flex gap-8">
            <span className="text-primary hover:underline cursor-pointer">Status: Optimal</span>
            <span className="opacity-60">Build: 4.2.1-STABLE</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
