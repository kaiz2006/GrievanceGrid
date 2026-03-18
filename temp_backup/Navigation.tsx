"use client";

import Link from "next/link";
import { Search } from "lucide-react";

export default function Navigation() {
  return (
    <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-100 px-6 py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-3 group cursor-pointer">
            <div className="bg-primary/5 p-2 rounded-md text-primary">
              <span className="material-symbols-outlined font-semibold block">grid_view</span>
            </div>
            <h1 className="text-xl font-bold tracking-tight text-primary">GrievanceGrid</h1>
          </Link>
          <div className="hidden md:flex items-center gap-8 font-semibold text-sm text-slate-600">
            <a className="hover:text-primary transition-colors" href="#">Solutions</a>
            <a className="hover:text-primary transition-colors" href="#">Impact</a>
            <a className="hover:text-primary transition-colors" href="#">Transparency</a>
          </div>
        </div>
        <div className="flex items-center gap-6">
          <div className="hidden lg:flex items-center bg-slate-50 rounded-md border border-slate-200 px-3 py-1.5 gap-2 focus-within:border-primary/30 transition-colors">
            <Search className="w-4 h-4 text-slate-400" />
            <input 
              className="bg-transparent border-none focus:ring-0 text-sm w-48 font-medium text-primary placeholder-slate-400" 
              placeholder="Track Grievance ID..." 
              type="text"
            />
          </div>
          <button className="saas-btn bg-primary text-white px-5 py-2 font-semibold text-sm shadow-sm hover:shadow-md transition-all">
            Login
          </button>
        </div>
      </div>
    </nav>
  );
}
