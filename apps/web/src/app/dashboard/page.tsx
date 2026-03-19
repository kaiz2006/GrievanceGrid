"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { grievanceService, Grievance } from '@/services/grievanceService';

export default function CitizenDashboard() {
  const [grievances, setGrievances] = useState<Grievance[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGrievances = async () => {
      try {
        const data = await grievanceService.getAllGrievances();
        setGrievances(data);
      } catch (err) {
        console.error('Failed to fetch grievances', err);
      } finally {
        setLoading(false);
      }
    };
    fetchGrievances();
  }, []);

  if (loading) {
     return (
      <div className="bg-surface min-h-screen flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="bg-surface font-body text-on-surface-variant selection:bg-primary selection:text-on-primary min-h-screen">
      {/* SideNavBar Shell - 1:1 with citizen_portal_dashboard_dark */}
      <aside className="fixed left-0 top-0 h-full flex flex-col py-6 z-40 bg-surface-container/60 backdrop-blur-xl border-r border-outline-variant/15 shadow-2xl shadow-primary/5 w-64 hidden md:flex">
        <div className="px-6 mb-10">
          <Link href="/">
            <h1 className="text-lg font-black text-[#F0D291] tracking-tight cursor-pointer">GrievanceGrid</h1>
          </Link>
          <p className="text-[10px] font-medium uppercase tracking-widest text-on-surface-variant opacity-60">Institutional Suite</p>
        </div>
        <nav className="flex-1 space-y-1 px-3">
          <Link className="flex items-center gap-3 bg-surface-container text-primary-container rounded-lg px-4 py-3 border-l-4 border-primary-container transition-all hover:translate-x-1 duration-200" href="/dashboard">
            <span className="material-symbols-outlined">dashboard</span>
            <span className="text-sm font-medium uppercase tracking-wider">Dashboard</span>
          </Link>
          <a className="flex items-center gap-3 text-on-surface-variant opacity-70 px-4 py-3 hover:bg-surface-container hover:text-tertiary transition-all hover:translate-x-1 duration-200" href="#">
            <span className="material-symbols-outlined">folder_open</span>
            <span className="text-sm font-medium uppercase tracking-wider">Cases</span>
          </a>
          <a className="flex items-center gap-3 text-[#D9C2B2] opacity-70 px-4 py-3 hover:bg-[#311724] hover:text-[#F0D291] transition-all hover:translate-x-1 duration-200" href="#">
            <span className="material-symbols-outlined">gavel</span>
            <span className="text-sm font-medium uppercase tracking-wider">Audit</span>
          </a>
          <a className="flex items-center gap-3 text-[#D9C2B2] opacity-70 px-4 py-3 hover:bg-[#311724] hover:text-[#F0D291] transition-all hover:translate-x-1 duration-200" href="#">
            <span className="material-symbols-outlined">analytics</span>
            <span className="text-sm font-medium uppercase tracking-wider">Analytics</span>
          </a>
          <a className="flex items-center gap-3 text-[#D9C2B2] opacity-70 px-4 py-3 hover:bg-[#311724] hover:text-[#F0D291] transition-all hover:translate-x-1 duration-200" href="#">
            <span className="material-symbols-outlined">settings</span>
            <span className="text-sm font-medium uppercase tracking-wider">Settings</span>
          </a>
        </nav>
        <div className="px-4 mt-auto">
          <Link href="/submit" className="w-full bg-linear-to-br from-primary to-primary-container text-on-primary font-bold py-3 rounded-lg flex items-center justify-center gap-2 shadow-lg shadow-primary/10 active:opacity-70 transition-all text-center">
            <span className="material-symbols-outlined text-lg">add_circle</span>
            <span className="text-sm uppercase tracking-tighter">New Case</span>
          </Link>
        </div>
      </aside>

      {/* TopNavBar Shell */}
      <header className="fixed top-0 md:left-64 right-0 h-16 flex justify-between items-center px-8 bg-[#230B18] z-30 border-b border-outline-variant/10">
        <div className="flex items-center gap-8">
          <div className="relative hidden sm:block">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-on-surface-variant/40 text-lg">search</span>
            <input className="bg-surface-container-low border-none rounded-lg pl-10 pr-4 py-2 text-sm w-80 focus:ring-1 focus:ring-primary-container text-on-surface placeholder:text-on-surface-variant/30 outline-none" placeholder="Search directives or reports..." type="text"/>
          </div>
          <nav className="hidden lg:flex items-center gap-6">
            <a className="text-tertiary border-b-2 border-primary-container pb-1 tracking-tight text-sm" href="#">Reports</a>
            <a className="text-on-surface-variant opacity-80 tracking-tight text-sm hover:text-tertiary transition-colors" href="#">Directives</a>
          </nav>
        </div>
        <div className="flex items-center gap-4">
          <button className="p-2 rounded-lg text-on-surface-variant hover:bg-[#311724] transition-colors">
            <span className="material-symbols-outlined">notifications</span>
          </button>
          <div className="h-8 w-8 rounded-full overflow-hidden border border-outline-variant/30">
            <img className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDLaaBf59qJ5nVSeuUDP6euEJocV37nr9Y_SvVwhs2j_l8-Z95_e10AvxK2YmvujdwkLs8lGp3TVB3204xtrJ3V5-uyKf7y1OgkRjcV-73Y1HBEkHS_B5tjGzHqmc5l-tZRdqQVpa1bADCLDQOScw_a2YF3FQc4Kdn0zQ4UGLV5-Z6xBhSyxxdxvyW_c0QRHpbGRrHUZYoHNvNEmwn2i-eziL_K09tCNIf27HYrqeGlFDRtzRjIMbsTl7F35AsTicLN6whE1ew9ID8l" alt="Profile" />
          </div>
        </div>
      </header>

      {/* Main Content Canvas */}
      <main className="md:ml-64 pt-24 px-8 pb-12">
        <header className="mb-10 flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-primary-container">Citizen Portal</span>
            <h2 className="text-4xl font-black text-tertiary tracking-tighter mt-1">Grievance Dashboard</h2>
            <p className="text-on-surface-variant/60 text-sm mt-2">Precision oversight for institutional transparency.</p>
          </div>
          <div className="bg-surface-container-low px-4 py-2 rounded-lg border-b-2 border-primary-container/30">
            <span className="block text-[10px] uppercase tracking-widest text-on-surface-variant/50">System Load</span>
            <span className="text-sm font-mono text-primary uppercase">Operational</span>
          </div>
        </header>

        {/* Status Grid */}
        <section className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <div className="md:col-span-2 bg-surface-container-low p-6 rounded-xl border-l-4 border-primary shadow-sm relative overflow-hidden">
            <div className="relative z-10">
              <div className="flex justify-between items-start mb-6">
                <span className="material-symbols-outlined text-primary p-2 bg-primary/10 rounded-lg">pending_actions</span>
                <span className="text-[10px] font-bold text-primary px-2 py-1 bg-primary/10 rounded uppercase tracking-tighter">Live Track</span>
              </div>
              <h3 className="text-3xl font-black text-on-surface tracking-tighter">{grievances.filter(g => g.status !== 'RESOLVED').length}</h3>
              <p className="text-sm font-semibold text-on-surface-variant/70 uppercase tracking-widest mt-1">Active Grievances</p>
              <div className="mt-4 flex items-center gap-2">
                <div className="flex-1 h-1 bg-surface-container-highest rounded-full overflow-hidden">
                  <div className="h-full bg-primary w-2/3"></div>
                </div>
                <span className="text-[10px] font-mono text-primary">+3 THIS WEEK</span>
              </div>
            </div>
          </div>
          <div className="bg-surface-container-low p-6 rounded-xl border-l-4 border-muted-sage shadow-sm">
            <div className="flex justify-between items-start mb-6">
              <span className="material-symbols-outlined text-muted-sage p-2 bg-muted-sage/10 rounded-lg">check_circle</span>
            </div>
            <h3 className="text-3xl font-black text-on-surface tracking-tighter">{grievances.filter(g => g.status === 'RESOLVED').length}</h3>
            <p className="text-sm font-semibold text-on-surface-variant/70 uppercase tracking-widest mt-1">Resolved</p>
            <p className="text-[10px] text-muted-sage font-mono mt-4 uppercase">98.2% Efficiency Rate</p>
          </div>
          <div className="bg-surface-container-low p-6 rounded-xl border-l-4 border-tertiary shadow-sm">
            <div className="flex justify-between items-start mb-6">
              <span className="material-symbols-outlined text-tertiary p-2 bg-tertiary/10 rounded-lg">schedule</span>
            </div>
            <h3 className="text-3xl font-black text-on-surface tracking-tighter">03</h3>
            <p className="text-sm font-semibold text-on-surface-variant/70 uppercase tracking-widest mt-1">In Audit</p>
            <p className="text-[10px] text-tertiary font-mono mt-4 uppercase">Est. 48h Remaining</p>
          </div>
        </section>

        {/* Main Tracking Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <section className="lg:col-span-2 space-y-4">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-sm font-black uppercase tracking-[0.2em] text-on-surface-variant/40">Tracking Pipeline</h3>
            </div>
            
            {grievances.map((g) => (
              <Link key={g.id} href={`/track/${g.id}`} className="group block bg-surface-container-low hover:bg-surface-container transition-all p-5 rounded-lg border border-outline-variant/5">
                <div className="flex items-start justify-between gap-6">
                  <div className="flex gap-5 flex-1">
                    <div className="h-12 w-12 rounded bg-surface-container-highest flex items-center justify-center text-primary border border-outline-variant/10">
                      <span className="material-symbols-outlined">
                        {g.category === 'SANITATION' ? 'delete' : g.category === 'TRAFFIC' ? 'traffic' : 'electric_bolt'}
                      </span>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <span className="text-[10px] font-mono text-primary-container tracking-tighter">{g.id}</span>
                        <span className="text-[10px] uppercase font-bold text-on-surface-variant/30">• {g.status}</span>
                      </div>
                      <h4 className="text-lg font-bold text-tertiary mt-1">{g.category}: {g.description.substring(0, 40)}...</h4>
                      <p className="text-sm text-on-surface-variant mt-1 leading-relaxed max-w-lg">{g.description}</p>
                      <div className="mt-6 flex flex-wrap items-center gap-4">
                        <div className="flex items-center gap-1">
                          <div className={`h-2 rounded-sm ${g.status === 'RESOLVED' ? 'bg-muted-sage w-32' : 'bg-primary w-16'}`}></div>
                          <div className={`h-2 rounded-sm bg-primary/10 w-16 ${g.status === 'RESOLVED' ? 'hidden' : ''}`}></div>
                          <span className="ml-2 text-[10px] font-bold text-primary uppercase">{g.status}</span>
                        </div>
                        <div className="h-4 w-[1px] bg-outline-variant/20"></div>
                        <div className="flex items-center gap-2">
                          <span className="material-symbols-outlined text-sm text-on-surface-variant/40">calendar_today</span>
                          <span className="text-xs text-on-surface-variant/60">{new Date(g.date).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="bg-surface-container-highest p-2 rounded-lg text-on-surface-variant group-hover:text-primary transition-all self-center">
                    <span className="material-symbols-outlined">chevron_right</span>
                  </div>
                </div>
              </Link>
            ))}
          </section>

          {/* Action & Insights Column */}
          <section className="space-y-6">
            <div className="bg-surface-container-low p-8 rounded-xl relative overflow-hidden group border border-outline-variant/10">
              <div className="relative z-10">
                <h3 className="text-xl font-black text-on-surface tracking-tighter mb-2">Have a Concern?</h3>
                <p className="text-sm text-on-surface-variant/60 mb-8 leading-relaxed">Our grid ensures every grievance is tracked, audited, and resolved with mathematical certainty.</p>
                <Link href="/submit" className="w-full bg-linear-to-br from-primary to-primary-container text-on-primary font-black py-4 rounded-lg flex items-center justify-center gap-3 shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all text-center">
                   <span className="material-symbols-outlined font-bold">rate_review</span>
                   <span className="uppercase tracking-widest text-sm">New Complaint</span>
                </Link>
              </div>
            </div>
            <div className="bg-surface-container-low p-6 rounded-xl border border-outline-variant/10">
              <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-on-surface-variant/40 mb-6">Community Pulse</h3>
              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="h-8 w-8 rounded-full bg-surface-container-highest flex items-center justify-center">
                    <span className="material-symbols-outlined text-sm text-muted-sage">thumb_up</span>
                  </div>
                  <div>
                    <p className="text-xs text-on-surface font-semibold">Street lighting in North Park resolved 3 days ahead of schedule.</p>
                    <p className="text-[10px] text-on-surface-variant/40 mt-1 uppercase tracking-tighter">2 hours ago</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-surface-container-low rounded-xl overflow-hidden border border-outline-variant/10">
              <div className="p-4 flex items-center justify-between">
                <span className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant/40">Grievance Hotspots</span>
                <span className="material-symbols-outlined text-sm text-on-surface-variant/40">map</span>
              </div>
              <div className="h-32 bg-surface-container-highest relative">
                <img className="w-full h-full object-cover opacity-50 grayscale contrast-125" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDsQAxV1svkc116tKsHINllyoSKHtrkdKFD5tedAS_XA-RO3fin7NTonrtdexml55-2r48vUjYy11fiiSNz9TmBcR7qbFQOO7rxcgEtNuPTC_M3KZKWfRge67jPtFgQWrZVMeMmJYLWx288RfujNGjsPF6vH3D_CdFA2EIYYvdW4iWtHdEhWXQhS2a-TempyAYMfCBaXXf_xWotKTPUNg4Ch5Y2pxl_xN4k09FuPe6rogD-VpJuO7GfPSKXvwgcQxNORjUJvCAVJgA6" alt="Heatmap" />
                <div className="absolute inset-0 bg-linear-to-t from-surface-container-low to-transparent"></div>
                <div className="absolute top-1/2 left-1/3 h-3 w-3 bg-primary rounded-full shadow-[0_0_15px_rgba(255,165,82,0.8)]"></div>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
