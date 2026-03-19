import Link from "next/link";
import React from "react";

export default function GeneratedPage() {
  return (
    <>
<div className="w-full min-h-screen bg-background font-display text-primary">

<header className="flex items-center justify-between border-b border-slate-200 bg-white px-6 py-4">
<div className="flex items-center gap-4">
<div className="w-8 h-8 bg-plum rounded-md shadow-sm flex items-center justify-center text-white">
<span className="material-symbols-outlined text-[20px]">grid_view</span>
</div>
<h1 className="text-xl font-semibold text-plum tracking-tight">GrievanceGrid Admin</h1>
</div>
<nav className="flex items-center gap-8">
<Link className="text-sm font-medium text-slate-500 hover:text-plum transition-colors" href="/admin/mission-control">Dashboard</Link>
<Link className="text-sm font-medium text-plum" href="/admin/forensic-audit">AI Audit</Link>
<Link className="text-sm font-medium text-slate-500 hover:text-plum transition-colors" href="/admin/settings">Settings</Link>
<div className="w-9 h-9 rounded-md shadow-sm border border-slate-200 bg-center bg-cover" style={{ backgroundImage: 'url(\'https://lh3.googleusercontent.com/aida-public/AB6AXuCzcL1fvZRL9PfxS1VAJL5hQWqfAY2H7109UHdDYLmNINzLu_hC9eD0y8dtDE5Newe2VHw2Ib-0I40I30CcKsn1MF-fo8fj4bvW0cdJOYAy3YB-0UxpCQz_kQ_-EopX069MLDxdFz121veDh6Dzjc30qvIeJhpH4TqxOvgWXfER3DAU_o-n8U71wYx5jA0Tbuc86PzOrBvTgBHhLMSxxUPKITTnhOw0EvCxcu3c3I1ZbcVR4tWh-XiMHENSM2WFuDfxYUdNDFXfLXMc\')' }}></div>
</nav>
</header>
<div className="flex flex-1 overflow-hidden">
<main className="flex-1 flex flex-col p-8 overflow-y-auto bg-white">
<div className="flex items-end justify-between mb-8">
<div>
<h2 className="text-2xl font-semibold text-plum mb-1">AI Routing Audit &amp; Logic Dashboard</h2>
<p className="text-sm text-slate-500">Review, audit, and correct automated routing decisions.</p>
</div>
</div>
<div className="mb-6 flex gap-4">
<div className="flex-1 flex border border-slate-200 bg-slate-50 rounded-md shadow-sm overflow-hidden">
<div className="flex items-center justify-center px-4 text-slate-400">
<span className="material-symbols-outlined text-[20px]">search</span>
</div>
<input className="flex-1 px-2 py-2.5 text-sm bg-transparent border-none focus:outline-none focus:ring-0 w-full placeholder-slate-400 text-slate-700" placeholder="Search by ticket ID or keyword" type="text"/>
</div>
<Link href="/admin/mission-control" className="px-5 py-2.5 border border-slate-200 bg-white rounded-md shadow-sm text-sm font-medium text-plum hover:bg-slate-50 transition-colors flex items-center gap-2">
<span className="material-symbols-outlined text-[18px]">filter_alt</span>
                Filters
            </Link>
</div>
<div className="border border-slate-200 bg-white rounded-md shadow-sm overflow-x-auto">
<table className="w-full text-left border-collapse text-sm">
<thead>
<tr className="bg-slate-50 border-b border-slate-200 text-plum">
<th className="p-4 font-semibold w-1/3">Input Text</th>
<th className="p-4 font-semibold w-48">AI Classification</th>
<th className="p-4 font-semibold w-48">Department Assigned</th>
<th className="p-4 font-semibold w-40">Confidence</th>
<th className="p-4 font-semibold w-32 text-center">Actions</th>
</tr>
</thead>
<tbody>
<tr className="border-b border-slate-200 hover:bg-slate-50 transition-colors">
<td className="p-4 text-slate-600">"Huge pothole opened up on 5th Ave near the intersection, damaged my tire."</td>
<td className="p-4">
<span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-700">Infrastructure</span>
</td>
<td className="p-4">
<span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-plum text-white">Public Works</span>
</td>
<td className="p-4">
<div className="flex items-center gap-2 text-slate-700">
<div className="w-2 h-2 rounded-full bg-sage"></div>
<span className="font-medium">High - 98%</span>
</div>
</td>
<td className="p-4 text-center">
<Link href="/admin/mission-control" className="px-3 py-1.5 border border-slate-200 rounded-md bg-white text-xs font-medium text-plum hover:bg-slate-50 shadow-sm transition-colors">View Logic</Link>
</td>
</tr>
<tr className="border-b border-slate-200 hover:bg-slate-50 transition-colors">
<td className="p-4 text-slate-600">"Power outage block 4, entire street is dark since 8 PM."</td>
<td className="p-4">
<span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-700">Electrical</span>
</td>
<td className="p-4">
<span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-plum text-white">Grid Maint</span>
</td>
<td className="p-4">
<div className="flex items-center gap-2 text-slate-700">
<div className="w-2 h-2 rounded-full bg-sage"></div>
<span className="font-medium">High - 92%</span>
</div>
</td>
<td className="p-4 text-center">
<Link href="/admin/mission-control" className="px-3 py-1.5 border border-slate-200 rounded-md bg-white text-xs font-medium text-plum hover:bg-slate-50 shadow-sm transition-colors">View Logic</Link>
</td>
</tr>
<tr className="border-b border-slate-200 hover:bg-slate-50 transition-colors">
<td className="p-4 text-slate-600">"Water pipe broke in the park, flooding the walkway."</td>
<td className="p-4">
<span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-700">Plumbing</span>
</td>
<td className="p-4">
<span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-plum text-white">Parks &amp; Rec</span>
</td>
<td className="p-4">
<div className="flex items-center gap-2 text-slate-700">
<div className="w-2 h-2 rounded-full bg-burnt"></div>
<span className="font-medium">Low - 65%</span>
</div>
</td>
<td className="p-4 text-center">
<Link href="/admin/mission-control" className="px-3 py-1.5 border border-slate-200 rounded-md bg-white text-xs font-medium text-plum hover:bg-slate-50 shadow-sm transition-colors">View Logic</Link>
</td>
</tr>
<tr className="border-b border-slate-200 hover:bg-slate-50 transition-colors">
<td className="p-4 text-slate-600">"Trash not picked up for 3 weeks at apartment complex."</td>
<td className="p-4">
<span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-700">Sanitation</span>
</td>
<td className="p-4">
<span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-plum text-white">Waste Mgt</span>
</td>
<td className="p-4">
<div className="flex items-center gap-2 text-slate-700">
<div className="w-2 h-2 rounded-full bg-sage"></div>
<span className="font-medium">High - 95%</span>
</div>
</td>
<td className="p-4 text-center">
<Link href="/admin/mission-control" className="px-3 py-1.5 border border-slate-200 rounded-md bg-white text-xs font-medium text-plum hover:bg-slate-50 shadow-sm transition-colors">View Logic</Link>
</td>
</tr>
<tr className="hover:bg-slate-50 transition-colors">
<td className="p-4 text-slate-600">"Street light out at the corner of Main and Elm."</td>
<td className="p-4">
<span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-700">Electrical</span>
</td>
<td className="p-4">
<span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-plum text-white">Public Works</span>
</td>
<td className="p-4">
<div className="flex items-center gap-2 text-slate-700">
<div className="w-2 h-2 rounded-full bg-burnt"></div>
<span className="font-medium">Low - 72%</span>
</div>
</td>
<td className="p-4 text-center">
<Link href="/admin/mission-control" className="px-3 py-1.5 border border-slate-200 rounded-md bg-white text-xs font-medium text-plum hover:bg-slate-50 shadow-sm transition-colors">View Logic</Link>
</td>
</tr>
</tbody>
</table>
</div>
</main>
<aside className="w-[350px] bg-slate-50 text-plum p-6 border-l border-slate-200 flex flex-col overflow-y-auto shadow-[-4px_0_10px_rgba(0,0,0,0.02)]">
<div className="flex items-center justify-between mb-6 border-b border-slate-200 pb-3">
<h3 className="font-semibold text-base">Analysis Terminal</h3>
<div className="flex items-center gap-2">
<div className="w-2 h-2 rounded-full bg-sage animate-pulse"></div>
<span className="text-xs font-medium text-slate-500">Active</span>
</div>
</div>
<div className="mb-6 bg-white border border-slate-200 rounded-md p-4 shadow-sm">
<p className="text-xs text-slate-500 mb-1 font-medium">Ticket Ref</p>
<p className="font-semibold text-sm">TKT-8942-WPB</p>
</div>
<div className="mb-6">
<p className="text-xs text-slate-500 mb-2 font-medium">Extracted Keywords</p>
<div className="flex flex-wrap gap-2">
<span className="px-2.5 py-1 bg-white border border-slate-200 rounded-md text-xs font-medium shadow-sm">Water</span>
<span className="px-2.5 py-1 bg-white border border-slate-200 rounded-md text-xs font-medium shadow-sm">Pipe</span>
<span className="px-2.5 py-1 bg-white border border-slate-200 rounded-md text-xs font-medium shadow-sm">Park</span>
<span className="px-2.5 py-1 bg-slate-100 border border-slate-200 rounded-md text-xs font-medium text-slate-500 shadow-sm">Flooding</span>
</div>
</div>
<div className="mb-6 flex-1">
<p className="text-xs text-slate-500 mb-3 font-medium">Vector Similarity</p>
<div className="space-y-4">
<div>
<div className="flex justify-between text-xs mb-1.5 font-medium">
<span>Parks &amp; Rec</span>
<span>65%</span>
</div>
<div className="h-1.5 bg-slate-200 w-full rounded-full overflow-hidden">
<div className="h-full bg-plum rounded-full" style={{ width: '65%' }}></div>
</div>
</div>
<div>
<div className="flex justify-between text-xs mb-1.5 font-medium">
<span>Water Dept</span>
<span>62%</span>
</div>
<div className="h-1.5 bg-slate-200 w-full rounded-full overflow-hidden">
<div className="h-full bg-slate-400 rounded-full" style={{ width: '62%' }}></div>
</div>
</div>
<div>
<div className="flex justify-between text-xs mb-1.5 font-medium">
<span>Public Works</span>
<span>41%</span>
</div>
<div className="h-1.5 bg-slate-200 w-full rounded-full overflow-hidden">
<div className="h-full bg-slate-300 rounded-full" style={{ width: '41%' }}></div>
</div>
</div>
</div>
<div className="mt-6 p-3 border border-burnt/30 bg-white rounded-md flex items-start gap-2 shadow-sm">
<span className="material-symbols-outlined text-[16px] text-burnt mt-0.5">info</span>
<p className="text-xs text-burnt leading-relaxed font-medium">
                    Confidence margin &lt; 5%. Manual review recommended.
                </p>
</div>
</div>
<Link href="/admin/mission-control" className="w-full py-2.5 bg-burnt text-white rounded-md font-medium text-sm hover:opacity-90 shadow-sm mt-auto transition-opacity">
            Manual Correction
        </Link>
</aside>
</div>
<footer className="bg-slate-50 border-t border-slate-200 px-6 py-2.5 text-xs font-medium text-slate-500 flex justify-between items-center z-10">
<div className="flex items-center gap-6">
<span className="flex items-center gap-2">
            Status: <span className="text-plum bg-white border border-slate-200 shadow-sm px-2 py-0.5 rounded-full font-semibold">Online</span>
</span>
<span>Pending Reviews: 14</span>
<span>Last Sync: 2m ago</span>
</div>
<span>Model Version: v2.4.0-STABLE</span>
</footer>


</div>
    </>
  );
}
