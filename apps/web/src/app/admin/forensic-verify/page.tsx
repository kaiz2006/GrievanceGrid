import Link from "next/link";
import React from "react";

export default function GeneratedPage() {
  return (
    <>
<div className="w-full min-h-screen bg-background font-display text-primary">

<header className="bg-white flex items-center justify-between px-6 py-4 shrink-0 shadow-sm border-b border-slate-200">
<div className="flex items-center gap-6">
<div className="flex items-center gap-3 text-deep-plum">
<div className="w-8 h-8 bg-deep-plum text-white flex items-center justify-center rounded-md shadow-ambient">
<span className="material-symbols-outlined font-medium text-xl">policy</span>
</div>
<h1 className="text-xl font-bold uppercase tracking-wide">GrievanceGrid Audit</h1>
</div>
<div className="flex items-center bg-slate-50 border border-slate-200 rounded-md h-10 shadow-sm focus-within:border-deep-plum focus-within:ring-1 focus-within:ring-deep-plum transition-all overflow-hidden">
<div className="flex items-center justify-center px-3 text-slate-400 bg-white border-r border-slate-200 h-full">
<span className="material-symbols-outlined text-[20px]">search</span>
</div>
<input className="border-none focus:ring-0 bg-transparent h-full px-4 w-64 font-mono text-sm placeholder-slate-400 text-slate-700" placeholder="Search LOG_ID..." type="text"/>
</div>
</div>
<Link href="/admin/mission-control" className="bg-deep-plum text-white rounded-md shadow-ambient px-5 py-2.5 font-semibold text-sm tracking-wide hover:bg-opacity-90 transition-all focus:ring-2 focus:ring-offset-2 focus:ring-deep-plum">
            Run Integrity Check
        </Link>
</header>
<div className="flex flex-1 overflow-hidden p-6 gap-6">
<main className="flex-1 flex flex-col min-w-0 bg-transparent overflow-hidden gap-4">
<div className="flex gap-3 flex-wrap shrink-0">
<Link href="/admin/mission-control" className="bg-white border border-slate-200 rounded-md shadow-sm px-4 py-2 flex items-center gap-2 font-medium text-sm text-slate-700 hover:bg-slate-50 transition-colors">
<span>Date Range</span>
<span className="material-symbols-outlined text-[18px]">expand_more</span>
</Link>
<Link href="/admin/mission-control" className="bg-white border border-slate-200 rounded-md shadow-sm px-4 py-2 flex items-center gap-2 font-medium text-sm text-burnt-orange hover:bg-orange-50 transition-colors">
<span>Variance &gt; 50m</span>
<span className="material-symbols-outlined text-[18px]">expand_more</span>
</Link>
<Link href="/admin/forensic-verify" className="bg-white border border-slate-200 rounded-md shadow-sm px-4 py-2 flex items-center gap-2 font-medium text-sm text-slate-700 hover:bg-slate-50 transition-colors">
<span>Status: Unverified</span>
<span className="material-symbols-outlined text-[18px]">expand_more</span>
</Link>
</div>
<div className="flex-1 bg-white border border-slate-200 rounded-md shadow-ambient overflow-auto">
<table className="w-full text-left border-collapse">
<thead className="bg-deep-plum text-white sticky top-0 z-10 shadow-sm">
<tr>
<th className="p-4 border-b border-slate-200 font-display font-semibold text-xs uppercase tracking-wider whitespace-nowrap">LOG_ID</th>
<th className="p-4 border-b border-slate-200 font-display font-semibold text-xs uppercase tracking-wider whitespace-nowrap">TIMESTAMP</th>
<th className="p-4 border-b border-slate-200 font-display font-semibold text-xs uppercase tracking-wider whitespace-nowrap">GPS_VARIANCE</th>
<th className="p-4 border-b border-slate-200 font-display font-semibold text-xs uppercase tracking-wider whitespace-nowrap">STATUS</th>
<th className="p-4 border-b border-slate-200 font-display font-semibold text-xs uppercase tracking-wider whitespace-nowrap w-24 text-center">ACTION</th>
</tr>
</thead>
<tbody className="font-mono text-sm text-slate-600">
<tr className="hover:bg-peach-hover cursor-pointer border-b border-slate-100 transition-colors group">
<td className="p-4 border-r border-slate-100 font-medium text-deep-plum">LOG-8831</td>
<td className="p-4 border-r border-slate-100">2023-10-27T14:32:01Z</td>
<td className="p-4 border-r border-slate-100 text-burnt-orange font-medium">89m</td>
<td className="p-4 border-r border-slate-100">
<span className="bg-amber-flagged/10 text-amber-flagged border border-amber-flagged/20 rounded px-2.5 py-1 uppercase text-xs font-display font-semibold">FLAGGED</span>
</td>
<td className="p-4 text-center">
<Link href="/admin/mission-control" className="p-1.5 rounded-md text-slate-400 hover:text-deep-plum hover:bg-slate-100 transition-colors">
<span className="material-symbols-outlined block text-[20px]">visibility</span>
</Link>
</td>
</tr>
<tr className="hover:bg-peach-hover cursor-pointer border-b border-slate-100 transition-colors group">
<td className="p-4 border-r border-slate-100 font-medium text-deep-plum">LOG-8832</td>
<td className="p-4 border-r border-slate-100">2023-10-27T14:35:12Z</td>
<td className="p-4 border-r border-slate-100">12m</td>
<td className="p-4 border-r border-slate-100">
<span className="bg-slate-100 text-slate-600 border border-slate-200 rounded px-2.5 py-1 uppercase text-xs font-display font-semibold">VERIFIED</span>
</td>
<td className="p-4 text-center">
<Link href="/admin/mission-control" className="p-1.5 rounded-md text-slate-400 hover:text-deep-plum hover:bg-slate-100 transition-colors">
<span className="material-symbols-outlined block text-[20px]">visibility</span>
</Link>
</td>
</tr>
<tr className="hover:bg-peach-hover cursor-pointer border-b border-slate-100 transition-colors group bg-orange-50/30">
<td className="p-4 border-r border-slate-100 font-medium text-deep-plum">LOG-8833</td>
<td className="p-4 border-r border-slate-100">2023-10-27T15:01:44Z</td>
<td className="p-4 border-r border-slate-100 text-burnt-orange font-semibold">145m</td>
<td className="p-4 border-r border-slate-100">
<span className="bg-burnt-orange/10 text-burnt-orange border border-burnt-orange/20 rounded px-2.5 py-1 uppercase text-xs font-display font-semibold">CRITICAL</span>
</td>
<td className="p-4 text-center">
<Link href="/admin/mission-control" className="p-1.5 rounded-md text-burnt-orange hover:bg-burnt-orange/10 transition-colors">
<span className="material-symbols-outlined block text-[20px]">gavel</span>
</Link>
</td>
</tr>
<tr className="hover:bg-peach-hover cursor-pointer border-b border-slate-100 transition-colors group">
<td className="p-4 border-r border-slate-100 font-medium text-deep-plum">LOG-8834</td>
<td className="p-4 border-r border-slate-100">2023-10-27T15:10:05Z</td>
<td className="p-4 border-r border-slate-100">3m</td>
<td className="p-4 border-r border-slate-100">
<span className="bg-slate-100 text-slate-600 border border-slate-200 rounded px-2.5 py-1 uppercase text-xs font-display font-semibold">VERIFIED</span>
</td>
<td className="p-4 text-center">
<Link href="/admin/mission-control" className="p-1.5 rounded-md text-slate-400 hover:text-deep-plum hover:bg-slate-100 transition-colors">
<span className="material-symbols-outlined block text-[20px]">visibility</span>
</Link>
</td>
</tr>
<tr className="hover:bg-peach-hover cursor-pointer border-b border-slate-100 transition-colors group">
<td className="p-4 border-r border-slate-100 font-medium text-deep-plum">LOG-8835</td>
<td className="p-4 border-r border-slate-100">2023-10-27T15:22:30Z</td>
<td className="p-4 border-r border-slate-100 text-amber-flagged font-medium">55m</td>
<td className="p-4 border-r border-slate-100">
<span className="bg-amber-flagged/10 text-amber-flagged border border-amber-flagged/20 rounded px-2.5 py-1 uppercase text-xs font-display font-semibold">FLAGGED</span>
</td>
<td className="p-4 text-center">
<Link href="/admin/mission-control" className="p-1.5 rounded-md text-slate-400 hover:text-deep-plum hover:bg-slate-100 transition-colors">
<span className="material-symbols-outlined block text-[20px]">visibility</span>
</Link>
</td>
</tr>
</tbody>
</table>
</div>
</main>
<aside className="w-[380px] shrink-0 bg-white border border-slate-200 rounded-md shadow-ambient flex flex-col overflow-y-auto">
<div className="p-5 border-b border-slate-200 bg-slate-50 sticky top-0 z-10">
<h2 className="text-lg font-bold text-deep-plum uppercase tracking-wide flex items-center gap-2">
<span className="material-symbols-outlined text-[22px]">folder_open</span>
                    Evidence File
                </h2>
<p className="font-mono text-xs mt-1.5 text-slate-500 flex items-center gap-1.5">
<span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> ACTIVE_LOG: LOG-8831
                </p>
</div>
<div className="p-5 flex flex-col gap-6">
<div className="space-y-3">
<h3 className="font-semibold text-slate-700 uppercase tracking-wider text-xs border-b border-slate-200 pb-2">Visual Verification</h3>
<div className="grid grid-cols-2 gap-3">
<div className="flex flex-col gap-1.5">
<div className="bg-slate-100 aspect-square border border-deep-plum/30 rounded shadow-sm relative overflow-hidden group">
<div className="absolute inset-0 bg-cover bg-center" data-alt="Citizen reported pothole issue" style={{ backgroundImage: 'url(\'https://lh3.googleusercontent.com/aida-public/AB6AXuDoghVjbZJI2wj6Ko7s0NUofZHWkdHD6syBIfjj3fvP3HPirwnBU8yXn5hR_ofZkxrtIcdnf23gOf7VPd02XR0NNvJ10ZAESjUxmGcHYgFhZ__nkgpoPSEzqHdluhGDEFXMgspns-K9uEUGPNt8QtkPahH1wiIHfyMcZbTEBrDU1rybBBSBmSxcVnHW5_tBta8Hw8ISjgUFzD0i351-hmApTaUVHW0nDp1ppES1eD35hxo5ZTye3J4r55n9GmF9OD85rP4c0aS7Pfje\')' }}></div>
<div className="absolute bottom-0 left-0 right-0 bg-deep-plum/90 text-white font-mono text-[9px] p-1.5 truncate">CITIZEN_UPLOAD.JPG</div>
</div>
</div>
<div className="flex flex-col gap-1.5">
<div className="bg-slate-100 aspect-square border border-deep-plum/30 rounded shadow-sm relative overflow-hidden group">
<div className="absolute inset-0 bg-cover bg-center" data-alt="Crew patched road surface" style={{ backgroundImage: 'url(\'https://lh3.googleusercontent.com/aida-public/AB6AXuDy_AK92ejbPF64NcSyZXJDmgdUhytbQfHMMfXlNnepuacnj78Yalu-i73uQP-tI7RRFwhMe0eEURalB74D1Kdo-M9zYpt6BDOis40YV_LxMES-314IyablHbEiEcy563J6Lsx_lwL7QYlziYPK0lWq6HknQ7AXKC3Ut5cm2A7W579SmIoDLEIWkqNiUH5HK734rqQqaMqJyGWNoASCPtfLwnVNLLJeltyEM_zi3I9gLnxTYnVcBEd-ETV6xSSBF8LlUnx24tCiOWYK\')' }}></div>
<div className="absolute bottom-0 left-0 right-0 bg-deep-plum/90 text-white font-mono text-[9px] p-1.5 truncate">CREW_VERIFY.JPG</div>
</div>
</div>
</div>
</div>
<div className="space-y-3">
<h3 className="font-semibold text-slate-700 uppercase tracking-wider text-xs border-b border-slate-200 pb-2">Auditor Memo</h3>
<div className="bg-amber-50 border border-amber-200 rounded shadow-sm p-4 relative min-h-[160px]">
<textarea className="w-full h-full bg-transparent border-none focus:ring-0 resize-none font-mono text-sm p-0 text-slate-800 placeholder-slate-400" placeholder="Enter forensic notes here..."></textarea>
</div>
</div>
<div className="space-y-3 mt-auto pt-4 border-t border-slate-100">
<Link href="/admin/grievances" className="w-full bg-deep-plum text-white rounded py-2.5 font-semibold text-sm tracking-wide hover:bg-opacity-90 transition-colors flex items-center justify-center gap-2 shadow-sm">
<span className="material-symbols-outlined text-[18px]">gavel</span>
                        Issue Violation
                    </Link>
<Link href="/admin/forensic-verify" className="w-full bg-white text-slate-700 border border-slate-300 rounded py-2.5 font-semibold text-sm tracking-wide hover:bg-slate-50 transition-colors flex items-center justify-center gap-2 shadow-sm">
<span className="material-symbols-outlined text-[18px]">check_circle</span>
                        Force Verify
                    </Link>
</div>
</div>
</aside>
</div>
<footer className="bg-deep-plum text-slate-300 font-mono text-xs px-6 py-3 flex justify-between shrink-0 border-t border-deep-plum/20">
<div className="flex gap-6">
<span className="flex items-center gap-1.5">SYS.STATUS: <span className="text-emerald-400 font-medium flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-emerald-400 inline-block"></span>ONLINE</span></span>
<span>NODE: <span className="text-white">US-EAST-G1</span></span>
<span>DB_LATENCY: <span className="text-white">14ms</span></span>
</div>
<div className="flex gap-6">
<span>UNVERIFIED: <span className="text-amber-flagged font-medium">1,204</span></span>
<span>CRITICAL: <span className="text-burnt-orange font-medium">89</span></span>
</div>
</footer>

</div>
    </>
  );
}
