"use client";

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { grievanceService } from '@/services/grievanceService';

export default function SubmissionPage() {
  const router = useRouter();
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('GENERAL');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [gridId, setGridId] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const response = await grievanceService.submitGrievance({
        description,
        category,
        location: { lat: 40.7128, lng: -74.0060, address: 'Sector 4-B, Administrative District' }
      });
      
      if (response.success) {
        setGridId(response.grid_id);
        setSubmitted(true);
        setTimeout(() => {
          router.push(`/track/${response.grid_id}`);
        }, 3000);
      }
    } catch (error) {
      console.error('Submission failed', error);
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="bg-surface min-h-screen flex items-center justify-center p-6 text-center">
        <div className="max-w-md space-y-6">
          <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
             <span className="material-symbols-outlined text-primary text-4xl animate-pulse">verified</span>
          </div>
          <h2 className="text-3xl font-black text-tertiary tracking-tighter uppercase">Transmission Success</h2>
          <p className="text-on-surface-variant leading-relaxed">
            Your grievance has been cryptographically signed and routed to the central node. 
            Verification ID: <span className="text-primary font-mono">{gridId}</span>
          </p>
          <p className="text-[10px] text-on-surface-variant opacity-50 uppercase tracking-widest">Redirecting to resolution HUD...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-surface text-on-surface-variant min-h-screen font-body selection:bg-primary-container selection:text-on-primary-container">
      {/* SideNavBar - 1:1 with grievance_submission_form_dark */}
      <aside className="fixed left-0 top-0 h-full flex flex-col py-6 z-40 bg-surface-container/60 backdrop-blur-xl border-r border-outline-variant/15 w-64 hidden md:flex shadow-2xl shadow-primary/5">
        <div className="px-6 mb-10">
          <Link href="/">
            <h1 className="text-lg font-black text-[#F0D291] tracking-tighter cursor-pointer">GrievanceGrid</h1>
          </Link>
          <p className="text-[10px] font-medium uppercase tracking-widest text-[#FFA552] opacity-60">Institutional Suite</p>
        </div>
        <nav className="flex-1 px-4 space-y-2">
          <Link className="flex items-center gap-3 text-[#D9C2B2] opacity-70 px-4 py-3 hover:bg-[#311724] hover:text-[#F0D291] transition-all hover:translate-x-1 duration-200 text-sm font-medium uppercase tracking-wider" href="/dashboard">
            <span className="material-symbols-outlined">dashboard</span>
            <span>Dashboard</span>
          </Link>
          <a className="flex items-center gap-3 bg-[#311724] text-[#FFA552] rounded-lg px-4 py-3 border-l-4 border-[#FFA552] text-sm font-medium uppercase tracking-wider" href="#">
            <span className="material-symbols-outlined">folder_open</span>
            <span>Cases</span>
          </a>
          <a className="flex items-center gap-3 text-[#D9C2B2] opacity-70 px-4 py-3 hover:bg-[#311724] hover:text-[#F0D291] transition-all hover:translate-x-1 duration-200 text-sm font-medium uppercase tracking-wider" href="#">
            <span className="material-symbols-outlined">gavel</span>
            <span>Audit</span>
          </a>
          <a className="flex items-center gap-3 text-[#D9C2B2] opacity-70 px-4 py-3 hover:bg-[#311724] hover:text-[#F0D291] transition-all hover:translate-x-1 duration-200 text-sm font-medium uppercase tracking-wider" href="#">
            <span className="material-symbols-outlined">analytics</span>
            <span>Analytics</span>
          </a>
          <a className="flex items-center gap-3 text-[#D9C2B2] opacity-70 px-4 py-3 hover:bg-[#311724] hover:text-[#F0D291] transition-all hover:translate-x-1 duration-200 text-sm font-medium uppercase tracking-wider" href="#">
            <span className="material-symbols-outlined">settings</span>
            <span>Settings</span>
          </a>
        </nav>
        <div className="px-4 mt-auto">
          <button className="w-full bg-linear-to-br from-primary to-primary-container text-on-primary font-bold py-3 rounded-lg text-sm flex items-center justify-center gap-2 shadow-lg shadow-primary-container/10 active:scale-95 transition-all">
            <span className="material-symbols-outlined text-sm">add</span>
            New Case
          </button>
          <div className="mt-6 border-t border-outline-variant/15 pt-4">
            <a className="flex items-center gap-3 text-[#D9C2B2] opacity-70 px-4 py-3 hover:text-[#F0D291] transition-all text-sm font-medium uppercase tracking-wider" href="#">
              <span className="material-symbols-outlined">contact_support</span>
              <span>Support</span>
            </a>
          </div>
        </div>
      </aside>

      {/* Main Canvas */}
      <main className="md:ml-64 min-h-screen industrial-grid">
        {/* TopAppBar */}
        <header className="flex justify-between items-center w-full px-6 py-3 h-16 bg-surface border-b border-outline-variant/10 sticky top-0 z-30">
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-2 bg-surface-container-low px-3 py-1.5 rounded-lg border border-outline-variant/20">
              <span className="material-symbols-outlined text-[#FFA552] text-lg">search</span>
              <input className="bg-transparent border-none text-sm text-[#D9C2B2] focus:ring-0 w-48 outline-none" placeholder="Search directives..." type="text"/>
            </div>
            <nav className="hidden md:flex gap-6 items-center">
              <a className="text-[#D9C2B2] opacity-80 text-sm font-medium hover:text-[#F0D291] transition-colors" href="#">Reports</a>
              <a className="text-[#F0D291] border-b-2 border-[#FFA552] pb-1 text-sm font-medium" href="#">Directives</a>
            </nav>
          </div>
          <div className="flex items-center gap-4">
            <button className="p-2 text-[#D9C2B2] hover:bg-[#311724] rounded-lg transition-colors">
              <span className="material-symbols-outlined">notifications</span>
            </button>
            <button className="p-2 text-[#D9C2B2] hover:bg-[#311724] rounded-lg transition-colors">
              <span className="material-symbols-outlined">help_outline</span>
            </button>
            <div className="w-8 h-8 rounded-full overflow-hidden border border-primary/20">
              <img className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBReOqVVp43d_TX6m9tGSO9skaTpFe08gcKbTAfX7qy0R7vF_BgcLyrmo9GUxfPbOqZ6f2Jt9mRRWkblcCDT-Zcx4MZrO3FefGwF0MMzN-XB7jdiM7WTI58g7mRNrsnVFCouMPWZt0-JiPJ34qIK1L-as0MFwmPNeCenHbxBvsvsEesM15uH5Rk44foXsbJ8dSVhOuEne8pQgksvP6xLsPHo_1ZBHz3jsjqDQg1vVYnHtX3UilDuh9gcII6pCdF45PrQyGPzRTDma8L" alt="Profile" />
            </div>
          </div>
        </header>

        {/* Content Area */}
        <div className="max-w-4xl mx-auto p-12 space-y-12">
          {/* Header Section */}
          <section className="space-y-2">
            <div className="flex items-center gap-3 text-tertiary mb-2">
              <span className="material-symbols-outlined text-sm">history_edu</span>
              <span className="text-xs font-bold uppercase tracking-[0.2em]">Form Protocol 11-A</span>
            </div>
            <h2 className="text-4xl font-extrabold text-tertiary tracking-tighter">Multimodal Grievance Submission</h2>
            <p className="text-on-surface-variant max-w-2xl leading-relaxed">Capture and document institutional discrepancies using voice, visual evidence, and precise textual descriptions.</p>
          </section>

          {/* Multimodal Input Flow */}
          <form className="grid grid-cols-1 gap-6" onSubmit={handleSubmit}>
            {/* 1. Voice Intake */}
            <div className="group relative bg-surface-container-low rounded-xl p-8 border border-outline-variant/5 hover:border-primary-container/20 transition-all">
              <div className="flex flex-col md:flex-row gap-8 items-start">
                <div className="shrink-0">
                  <div className="w-16 h-16 rounded-full bg-surface-container-highest flex items-center justify-center text-primary-container shadow-inner">
                    <span className="material-symbols-outlined text-3xl">mic</span>
                  </div>
                </div>
                <div className="grow space-y-4">
                  <div>
                    <h3 className="text-xl font-bold text-tertiary">Voice Documentation</h3>
                    <p className="text-sm text-on-surface-variant/70">Record verbal testimony for rapid intake. AI transcription will be applied automatically.</p>
                  </div>
                  <div className="h-16 flex items-end gap-1 px-4 bg-surface-container-highest rounded-lg">
                    {[4, 8, 10, 6, 12, 14, 8, 10, 4, 8, 10, 6, 12, 14, 10].map((h, i) => (
                      <div key={i} className={`w-1 bg-primary/${(i*5)+20} h-${h} rounded-full`}></div>
                    ))}
                  </div>
                  <div className="flex items-center gap-4">
                    <button type="button" className="px-6 py-2 bg-primary-container text-on-primary font-bold rounded-lg text-xs uppercase tracking-widest hover:brightness-110 transition-all">Start Recording</button>
                    <span className="text-xs font-mono text-primary opacity-50">00:00:00</span>
                  </div>
                </div>
              </div>
            </div>

            {/* 2. Image Evidence & Location */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="grow bg-surface-container-low rounded-xl p-8 border border-outline-variant/5 flex flex-col justify-between">
                <div className="space-y-2">
                  <h3 className="text-xl font-bold text-tertiary">Visual Evidence</h3>
                  <p className="text-sm text-on-surface-variant/70">Attach high-resolution photographs or document scans relevant to the grievance.</p>
                </div>
                <div className="mt-8 border-2 border-dashed border-outline-variant/20 rounded-xl h-48 flex flex-col items-center justify-center text-on-surface-variant/40 hover:border-primary-container/40 hover:bg-surface-container transition-all cursor-pointer">
                  <span className="material-symbols-outlined text-4xl mb-2">add_a_photo</span>
                  <p className="text-xs uppercase tracking-widest font-bold">Drop files or click to upload</p>
                  <p className="text-[10px] mt-1 italic">Supports: JPG, PNG, PDF (Max 25MB)</p>
                </div>
              </div>

              {/* Location Utility */}
              <div className="bg-surface-container rounded-xl p-6 border border-outline-variant/10 flex flex-col">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[10px] font-black uppercase tracking-widest text-primary">Geo-Tagging</span>
                  <span className="material-symbols-outlined text-primary text-lg">location_on</span>
                </div>
                <div className="grow rounded-lg overflow-hidden relative border border-outline-variant/10 mb-4 grayscale">
                  <img className="w-full h-full object-cover opacity-60" src="https://lh3.googleusercontent.com/aida-public/AB6AXuB2IRRvyIQoqqKiF0iSF8RNnotZMiUu1ezWNc9VytYo6PR_jZmn4eYnLyzLMC3vtqvZ-qmPoU8zNlzp6hDh2MokY_1h_Eysm9ggSd9AOZBFcLUFpGlnE-2gs4p8b-zvxuiAJh0nxl5lGBH3jFK7P5SDlDAHYM_6-xZwDZaRy42uh_U-fn9BNxf4hfQ1IsLxgFe6SZrxoDo7b07Ir_WXYXY_PUlANqu2emLDhLy7x2b3v7w8ttM2lEF46jxvEipM4pjC9vxW8ThykOQW" alt="Map" />
                  <div className="absolute inset-0 bg-linear-to-t from-surface to-transparent"></div>
                  <div className="absolute bottom-2 left-2 flex items-center gap-1">
                    <div className="w-2 h-2 rounded-full bg-primary animate-pulse"></div>
                    <span className="text-[10px] text-primary font-bold">DETECTING...</span>
                  </div>
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-bold text-tertiary">Sector 4-B, Administrative District</p>
                  <p className="text-[10px] text-on-surface-variant/60 font-mono">LAT: 40.7128° N | LONG: 74.0060° W</p>
                </div>
              </div>
            </div>

            {/* 3. Text Intake */}
            <div className="bg-surface-container-low rounded-xl p-8 border border-outline-variant/5">
              <div className="flex items-center justify-between mb-6">
                <div className="space-y-1">
                  <h3 className="text-xl font-bold text-tertiary">Technical Specification</h3>
                  <p className="text-sm text-on-surface-variant/70">Provide a structured narrative of the grievance.</p>
                </div>
                <select 
                  className="bg-surface-container-highest border-none text-xs font-bold text-tertiary rounded-lg px-3 py-1.5 outline-none"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                >
                  <option value="GENERAL">GENERAL</option>
                  <option value="INFRASTRUCTURE">INFRASTRUCTURE</option>
                  <option value="UTILITY">UTILITY</option>
                  <option value="SANITATION">SANITATION</option>
                </select>
              </div>
              <div className="relative group">
                <textarea 
                  className="w-full bg-surface-container-highest/50 border-0 border-b border-outline-variant/30 focus:ring-0 focus:border-primary text-[#D9C2B2] text-sm leading-relaxed p-4 rounded-t-lg transition-all outline-none" 
                  placeholder="Enter detailed grievance report here..." 
                  rows={6}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                ></textarea>
                <div className="absolute bottom-0 left-0 h-0.5 bg-primary w-0 group-focus-within:w-full transition-all duration-500"></div>
              </div>
              <div className="mt-4 flex justify-between items-center text-[10px] font-mono text-on-surface-variant/40">
                <span>AUTO-SAVE ENABLED</span>
                <span>{description.length} / 5000 CHARACTERS</span>
              </div>
            </div>

            {/* 4. Final Submission CTA */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-6 pt-6 border-t border-outline-variant/10">
              <div className="flex items-center gap-4">
                <div className="flex -space-x-2">
                  <div className="w-8 h-8 rounded-full bg-surface-container-highest border border-outline-variant/20 flex items-center justify-center">
                    <span className="material-symbols-outlined text-xs text-on-surface-variant/60">description</span>
                  </div>
                  <div className="w-8 h-8 rounded-full bg-surface-container-highest border border-outline-variant/20 flex items-center justify-center">
                    <span className="material-symbols-outlined text-xs text-on-surface-variant/60">image</span>
                  </div>
                  <div className="w-8 h-8 rounded-full bg-surface-container-highest border border-outline-variant/20 flex items-center justify-center">
                    <span className="material-symbols-outlined text-xs text-on-surface-variant/60">mic</span>
                  </div>
                </div>
                <p className="text-xs text-on-surface-variant/60 italic">3 components prepared for transmission.</p>
              </div>
              <div className="flex items-center gap-4 w-full md:w-auto">
                <button type="button" className="flex-1 md:flex-none px-8 py-3 bg-transparent border border-outline-variant/30 text-tertiary font-bold text-xs uppercase tracking-widest rounded-lg hover:bg-surface-container-highest transition-all">Save Draft</button>
                <button 
                  type="submit" 
                  className="flex-1 md:flex-none px-12 py-3 bg-linear-to-br from-primary to-primary-container text-on-primary font-bold text-xs uppercase tracking-[0.2em] rounded-lg shadow-lg shadow-primary-container/10 active:scale-95 transition-all disabled:opacity-50"
                  disabled={loading}
                >
                  {loading ? 'TRANSMITTING...' : 'Submit Case'}
                </button>
              </div>
            </div>
          </form>
        </div>

        {/* System Footer */}
        <footer className="max-w-4xl mx-auto px-12 pb-12">
          <div className="flex flex-col md:flex-row justify-between items-center pt-12 border-t border-outline-variant/5 text-[10px] text-on-surface-variant/30 uppercase tracking-[0.3em]">
            <div>© 2024 GrievanceGrid Institutional</div>
            <div className="flex gap-8 mt-4 md:mt-0">
              <a className="hover:text-primary transition-colors" href="#">Privacy Protocol</a>
              <a className="hover:text-primary transition-colors" href="#">Audit Standards</a>
              <a className="hover:text-primary transition-colors" href="#">Secure Node v.2.4</a>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}
