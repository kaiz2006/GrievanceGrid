import Link from "next/link";
import React from "react";

export default function GeneratedPage() {
  return (
    <>
<div className="w-full min-h-screen bg-background font-display text-primary">

<div className="min-h-screen flex flex-col items-center p-8">
<div className="w-full max-w-[1200px] bg-background-light flex flex-col">
<div className="bg-white border-b border-slate-border px-8 py-4 flex justify-between items-center rounded-t-md">
<div className="flex items-center gap-4">
<span className="material-symbols-outlined text-primary text-2xl">grid_view</span>
<h1 className="text-xl font-semibold text-primary">GrievanceGrid</h1>
</div>
<div className="hidden md:flex items-center gap-8 text-sm font-semibold text-gray-600">
<span className="text-primary italic">तमसो मा ज्योतिर्गमय</span>
<Link className="hover:text-primary transition-colors" href="/admin/mission-control">Dashboard</Link>
<Link className="hover:text-primary transition-colors" href="/admin/grievances">My Tickets</Link>
<Link className="hover:text-primary transition-colors" href="/admin/analytics">Reports</Link>
</div>
</div>
<header className="flex flex-col md:flex-row items-center justify-between bg-white border-b border-slate-border px-8 py-6 gap-6">
<div className="flex flex-1 w-full gap-4">
<div className="flex-1 relative flex items-center">
<span className="material-symbols-outlined absolute left-4 text-gray-400">search</span>
<input className="w-full pl-12 pr-4 py-2 border border-slate-border rounded-md focus:ring-1 focus:ring-primary focus:border-primary text-gray-800 placeholder:text-gray-400" placeholder="Search tickets..." type="text"/>
</div>
</div>
<div className="flex items-center gap-4 w-full md:w-auto">
<Link href="/admin/settings" className="border border-slate-border text-primary px-6 py-2 rounded-md hover:bg-gray-50 transition-colors">
                        Profile
                    </Link>
<div className="w-10 h-10 border border-slate-border bg-gray-100 rounded-md flex items-center justify-center">
<span className="material-symbols-outlined text-gray-600">person</span>
</div>
</div>
</header>
<main className="py-8 space-y-8">
<div className="grid grid-cols-1 md:grid-cols-2 gap-8">
<div className="bg-white border border-slate-border p-8 rounded-md shadow-ambient flex flex-col justify-between">
<div className="flex justify-between items-start mb-6">
<p className="text-lg text-gray-600">Active</p>
<span className="material-symbols-outlined text-2xl text-gray-400">pending_actions</span>
</div>
<p className="text-6xl text-primary mb-4">3</p>
<div className="flex items-center gap-2 text-sm text-gray-500">
<span className="material-symbols-outlined text-base">trending_flat</span>
<span>No change this week</span>
</div>
</div>
<div className="bg-sage border border-slate-border p-8 rounded-md shadow-ambient flex flex-col justify-between">
<div className="flex justify-between items-start mb-6">
<p className="text-lg text-green-900">Resolved</p>
<span className="material-symbols-outlined text-2xl text-green-800">task_alt</span>
</div>
<p className="text-6xl text-green-900 mb-4">12</p>
<div className="flex items-center gap-2 text-sm text-green-800">
<span className="material-symbols-outlined text-base">trending_up</span>
<span>+5% from last month</span>
</div>
</div>
</div>
<div className="bg-orange-50 border border-safety-orange p-6 rounded-md shadow-ambient">
<div className="flex flex-col md:flex-row items-center justify-between gap-6">
<div className="flex items-center gap-4">
<span className="material-symbols-outlined text-safety-orange text-3xl">warning</span>
<div>
<p className="text-safety-orange text-sm uppercase mb-1">Immediate Action</p>
<p className="text-gray-800 max-w-md">
                                You have contested tickets that require your review immediately.
                            </p>
</div>
</div>
<Link href="/admin/grievances" className="bg-white border border-slate-border text-safety-orange px-6 py-2 rounded-md hover:bg-orange-100 transition-colors">
                            View Tickets
                        </Link>
</div>
</div>
<div className="flex justify-center py-4">
<Link href="/admin/grievances" className="w-full md:w-auto bg-primary text-white text-xl px-8 py-4 rounded-md shadow-ambient hover:bg-opacity-90 transition-colors flex items-center justify-center gap-3">
<span className="material-symbols-outlined text-2xl">add_circle</span>
                        New Complaint
                    </Link>
</div>
<div className="space-y-4">
<h2 className="text-xl text-gray-800">Recent Activity</h2>
<div className="space-y-4">
<div className="bg-white border border-slate-border p-4 rounded-md flex flex-col md:flex-row justify-between items-center shadow-ambient">
<div className="flex items-center gap-4">
<div className="w-10 h-10 bg-gray-100 border border-slate-border rounded-md flex items-center justify-center text-sm text-gray-600">#42</div>
<div>
<p className="text-gray-800">Street Light Outage - Sector 7</p>
<p className="text-sm text-gray-500 font-normal">Filed 2 hours ago</p>
</div>
</div>
<div className="mt-4 md:mt-0 px-3 py-1 bg-gray-100 border border-slate-border text-gray-700 rounded-md text-xs">Processing</div>
</div>
<div className="bg-white border border-slate-border p-4 rounded-md flex flex-col md:flex-row justify-between items-center shadow-ambient">
<div className="flex items-center gap-4">
<div className="w-10 h-10 bg-sage border border-slate-border rounded-md flex items-center justify-center text-sm text-green-900">#39</div>
<div>
<p className="text-gray-800">Water Supply Contamination</p>
<p className="text-sm text-gray-500 font-normal">Resolved yesterday</p>
</div>
</div>
<div className="mt-4 md:mt-0 px-3 py-1 bg-sage border border-slate-border text-green-900 rounded-md text-xs">Completed</div>
</div>
</div>
</div>
</main>
<footer className="bg-white border-t border-slate-border p-8 rounded-b-md flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-600">
<p>© 2024 GrievanceGrid System</p>
<div className="flex gap-6">
<Link className="hover:text-primary transition-colors" href="#">Privacy Policy</Link>
<Link className="hover:text-primary transition-colors" href="#">Terms of Use</Link>
<Link className="hover:text-primary transition-colors" href="#">Contact Admin</Link>
</div>
</footer>
</div>
</div>

</div>
    </>
  );
}
