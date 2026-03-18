"use client";

import { useState } from "react";
import Navigation from "../../components/Navigation";
import { 
  Mic, 
  Upload, 
  MapPin, 
  Send, 
  Bot, 
  Image as ImageIcon, 
  Clock,
  CheckCircle2,
  AlertCircle
} from "lucide-react";

export default function SubmitGrievancePage() {
  const [isRecording, setIsRecording] = useState(false);

  return (
    <main className="min-h-screen bg-white font-display text-slate-800 antialiased selection:bg-amber selection:text-primary">
      <Navigation />

      <main className="max-w-4xl mx-auto py-12 px-6 flex flex-col gap-12">
        {/* Page Header */}
        <div className="flex flex-col gap-2 border-b border-slate-200 pb-8">
          <h1 className="text-slate-900 text-4xl font-bold tracking-tight">Report a Grievance</h1>
          <p className="text-slate-500 text-lg font-medium">Multimodal Submission Form</p>
        </div>

        {/* Section 1: Voice Recording */}
        <section className="flex flex-col gap-6 bg-slate-50 p-8 rounded-lg border border-slate-200 shadow-sm transition-all hover:bg-slate-50/80">
          <h2 className="text-slate-800 text-2xl font-bold tracking-tight">Section 1: Voice Recording</h2>
          <div className="flex flex-col md:flex-row gap-8 items-center bg-white p-6 rounded-md border border-slate-200 shadow-sm">
            <button 
              onClick={() => setIsRecording(!isRecording)}
              className={`flex shrink-0 items-center justify-center rounded-md size-20 transition-all duration-300 shadow-md ${
                isRecording ? 'bg-red-500 animate-pulse' : 'bg-primary hover:bg-primary/90'
              } text-white`}
            >
              <Mic className="w-8 h-8" />
            </button>
            <div className="flex-1 w-full flex flex-col gap-3">
              <div className="h-20 border border-primary/10 rounded bg-slate-50 flex items-center justify-center overflow-hidden p-2">
                <div className="flex items-center gap-1.5 h-full w-full justify-center">
                  {[0.2, 0.5, 0.8, 1, 0.6, 0.3, 0.4, 0.7, 0.5, 0.9, 0.3].map((h, i) => (
                    <div 
                      key={i} 
                      className={`w-1.5 bg-primary/60 rounded-full transition-all duration-300 ${isRecording ? 'animate-bounce' : ''}`}
                      style={{ height: `${h * 100}%`, animationDelay: `${i * 0.1}s` }}
                    ></div>
                  ))}
                </div>
              </div>
              <div className="flex justify-between font-bold text-xs text-slate-400 tracking-widest uppercase">
                <span>00:00</span>
                <span>MAX: 03:00</span>
              </div>
            </div>
          </div>
        </section>

        {/* Section 2: Image Evidence */}
        <section className="flex flex-col gap-6 bg-slate-50 p-8 rounded-lg border border-slate-200 shadow-sm">
          <h2 className="text-slate-800 text-2xl font-bold tracking-tight">Section 2: Image Evidence</h2>
          <div className="w-full min-h-[250px] bg-white border-2 border-primary border-dashed rounded-md flex flex-col items-center justify-center gap-4 p-8 hover:bg-slate-50 transition-all cursor-pointer group shadow-sm">
            <div className="bg-primary/5 p-4 rounded-full group-hover:scale-110 transition-transform duration-300">
              <Upload className="w-10 h-10 text-primary" />
            </div>
            <div className="text-center">
              <p className="text-xl font-bold text-slate-800 mb-1">Upload Before Photo</p>
              <p className="text-sm font-bold text-slate-400 tracking-widest uppercase">Drag & Drop or Click to Browse</p>
            </div>
          </div>
        </section>

        {/* Section 3: Text Description */}
        <section className="flex flex-col gap-6 bg-slate-50 p-8 rounded-lg border border-slate-200 shadow-sm relative">
          <h2 className="text-slate-800 text-2xl font-bold tracking-tight">Section 3: Text Description</h2>
          <div className="relative">
            <textarea 
              className="w-full min-h-[200px] border-2 border-primary/10 rounded-md bg-white p-5 text-base shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary placeholder:text-slate-400 font-medium transition-all" 
              placeholder="Describe the issue in detail..."
            ></textarea>
            
            {/* AI Suggestion Tooltip */}
            <div className="absolute -right-6 -top-6 w-64 bg-amber/20 backdrop-blur-md text-primary p-4 rounded-md shadow-lg z-10 border border-amber/30 hidden md:flex md:flex-col md:gap-2">
              <div className="flex items-center gap-2 border-b border-amber/20 pb-2">
                <Bot className="w-5 h-5" />
                <span className="font-bold text-xs tracking-widest uppercase">AI Suggestion</span>
              </div>
              <p className="text-xs font-bold leading-relaxed">
                Include specific dates, times, and exact locations for 40% faster resolution.
              </p>
            </div>
          </div>
        </section>

        {/* Section 4: Location Details */}
        <section className="flex flex-col gap-6 bg-slate-50 p-8 rounded-lg border border-slate-200 shadow-sm">
          <h2 className="text-slate-800 text-2xl font-bold tracking-tight">Section 4: Location Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-white p-6 rounded-md border border-slate-200 shadow-sm">
            <div className="flex flex-col justify-center gap-6">
              <p className="text-sm font-bold text-slate-500 leading-relaxed uppercase tracking-widest">
                Pinpoint the exact location for our rapid response field agents.
              </p>
              <button className="w-full bg-primary text-white text-sm font-bold py-4 px-4 rounded-md shadow-md hover:bg-primary/95 transition-all flex items-center justify-center gap-3 active:scale-[0.98]">
                <MapPin className="w-5 h-5 text-amber" />
                Auto-Detect Location
              </button>
            </div>
            <div className="aspect-square border border-primary/10 rounded-md relative overflow-hidden group shadow-inner bg-slate-100">
               {/* Pre-styled map placeholder */}
              <div className="absolute inset-0 bg-[#C4D6B0]/20 mix-blend-multiply transition-opacity group-hover:opacity-40"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-12 h-12 bg-primary/10 border border-primary/20 rounded-full flex items-center justify-center animate-pulse">
                  <div className="w-3 h-3 bg-primary rounded-full"></div>
                </div>
              </div>
              <div className="absolute top-4 left-4 right-4 bg-white/80 backdrop-blur-md px-3 py-2 border border-slate-200 rounded-sm text-[10px] font-bold text-slate-500 uppercase tracking-widest shadow-sm">
                Live Coordinate Tracking...
              </div>
            </div>
          </div>
        </section>

        {/* Submit Button */}
        <div className="pt-8 flex justify-center border-t border-slate-200 mt-8">
          <button className="w-full md:w-auto md:min-w-[400px] bg-primary text-white text-xl font-bold py-5 px-8 rounded-md shadow-xl flex items-center justify-center gap-4 hover:bg-primary/95 transition-all active:scale-[0.98] group">
            SUBMIT TO GRID
            <Send className="w-6 h-6 text-amber group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-slate-100 bg-slate-50 mt-12">
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
          <div className="flex gap-8">
            <span className="flex items-center gap-2"><CheckCircle2 className="w-3 h-3 text-sage" /> SSL Secured</span>
            <span className="flex items-center gap-2"><Clock className="w-3 h-3 text-amber" /> 30s Intake</span>
          </div>
          <p>© 2024 GRIEVANCEGRID SYSTEM</p>
        </div>
      </footer>
    </main>
  );
}
