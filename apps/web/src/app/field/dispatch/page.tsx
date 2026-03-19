import Link from "next/link";
import React from "react";

export default function GeneratedPage() {
  return (
    <>
<div className="w-full min-h-screen bg-background font-display text-primary">

<aside className="w-full md:w-[280px] bg-primary text-white flex flex-col h-auto md:h-screen shrink-0 border-r border-primary z-20 shadow-lg">
<div className="p-6 border-b border-white/10 flex items-center gap-4">
<div className="relative size-12 flex items-center justify-center">
<div className="absolute inset-0 bg-white/10 transform rotate-45 rounded-md border border-white/20"></div>
<span className="relative text-white font-bold text-2xl z-10">G</span>
</div>
<h1 className="font-bold text-xl leading-tight tracking-tight uppercase">Grievance<br/>Grid</h1>
</div>
<div className="p-6 border-b border-white/10 flex items-center gap-4">
<div className="size-12 rounded-full border border-white/20 bg-white bg-cover bg-center shadow-sm" data-alt="Field worker profile picture" style={{ backgroundImage: 'url(\'https://lh3.googleusercontent.com/aida-public/AB6AXuD3gHndj2L4_-9-M9QPndzNG-hFAM3DewOdV1cMW2GXcFcqPRmLwzYCJY20QxAZ7EBCeC50dFnKMSscKpaVnAQMqL7I_16xhtM_ijmQE3KDeCTfUGOeqCVTqpfbMqgJynrV0KwHB8WY63uXBVqC0ROcyVzTFEz5j3ruqVTIfHuv6rEeXl43zTp2RWtBTW9ywO8KKE-XwogZT6r0HhEPRLFUudpRvxKuUILmX47xm9_LZsi7cA6sm5iSFvWVSvqhvEra9ZAjjGKZJNur\')' }}></div>
<div>
<p className="font-semibold uppercase text-xs text-white/60 tracking-wider">Command Center</p>
<p className="font-medium text-lg text-white">Field Crew</p>
</div>
</div>
<nav className="flex-1 overflow-y-auto p-6 space-y-3">
<Link className="flex items-center gap-3 p-3 rounded-md bg-white/10 text-white font-semibold transition-all hover:bg-white/20 shadow-sm" href="/admin/mission-control">
<span className="material-symbols-outlined">dashboard</span>
            Dashboard
        </Link>
<Link className="flex items-center gap-3 p-3 rounded-md border border-transparent text-white/80 hover:bg-white/5 hover:text-white font-medium transition-colors" href="#">
<span className="material-symbols-outlined">work</span>
            Assignments
            <span className="ml-auto bg-sla-text text-white px-2 py-0.5 rounded-full text-xs font-bold shadow-sm">12</span>
</Link>
<Link className="flex items-center gap-3 p-3 rounded-md border border-transparent text-white/80 hover:bg-white/5 hover:text-white font-medium transition-colors" href="#">
<span className="material-symbols-outlined">map</span>
            Map View
        </Link>
<Link className="flex items-center gap-3 p-3 rounded-md border border-transparent text-white/80 hover:bg-white/5 hover:text-white font-medium transition-colors" href="#">
<span className="material-symbols-outlined">history</span>
            History
        </Link>
<Link className="flex items-center gap-3 p-3 rounded-md border border-transparent text-white/80 hover:bg-white/5 hover:text-white font-medium transition-colors" href="/admin/settings">
<span className="material-symbols-outlined">settings</span>
            Settings
        </Link>
</nav>
<div className="p-6 border-t border-white/10">
<Link href="/auth" className="w-full flex items-center justify-center gap-2 p-3 rounded-md border border-white/20 text-white hover:bg-white/10 font-semibold transition-colors">
<span className="material-symbols-outlined">logout</span>
            Clock Out
        </Link>
</div>
</aside>
<main className="flex-1 flex flex-col h-screen overflow-hidden relative z-10 bg-workspace">
<header className="h-20 bg-white/80 backdrop-blur-sm border-b border-gray-200 flex items-center justify-between px-6 shrink-0 z-20 shadow-sm">
<h2 className="text-2xl font-bold tracking-tight text-primary">Active Assignments</h2>
<div className="flex items-center gap-4 w-full max-w-xl ml-8">
<div className="relative w-full shadow-sm rounded-md">
<span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">search</span>
<input className="w-full h-11 pl-10 pr-4 bg-white border border-gray-300 rounded-md font-medium text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all" placeholder="Search GRID-ID or location..." type="text"/>
</div>
<Link href="/admin/mission-control" className="size-11 shrink-0 bg-white border border-gray-300 rounded-md flex items-center justify-center text-primary hover:bg-gray-50 transition-colors shadow-sm">
<span className="material-symbols-outlined font-medium">filter_list</span>
</Link>
</div>
</header>
<div className="px-6 py-3 flex gap-3 overflow-x-auto shrink-0 bg-workspace border-b border-gray-200 z-10">
<Link href="/admin/mission-control" className="px-4 py-2 bg-white border border-gray-200 rounded-md font-semibold text-sm flex items-center gap-2 whitespace-nowrap text-gray-700 hover:bg-gray-50 shadow-sm transition-colors">
            All Status
            <span className="material-symbols-outlined text-[18px]">expand_more</span>
</Link>
<Link href="/admin/mission-control" className="px-4 py-2 bg-sla-text/10 border border-sla-text/20 rounded-md font-semibold text-sm flex items-center gap-2 whitespace-nowrap text-sla-text hover:bg-sla-text/20 shadow-sm transition-colors">
            Urgent Only
            <span className="material-symbols-outlined text-[18px]">warning</span>
</Link>
<Link href="/admin/mission-control" className="px-4 py-2 bg-white border border-gray-200 rounded-md font-semibold text-sm flex items-center gap-2 whitespace-nowrap text-gray-700 hover:bg-gray-50 shadow-sm transition-colors">
            SLA &lt; 2hrs
            <span className="material-symbols-outlined text-[18px]">timer</span>
</Link>
<Link href="/admin/mission-control" className="px-4 py-2 bg-white border border-gray-200 rounded-md font-semibold text-sm flex items-center gap-2 whitespace-nowrap text-gray-700 hover:bg-gray-50 shadow-sm transition-colors">
            My Zone
            <span className="material-symbols-outlined text-[18px]">my_location</span>
</Link>
</div>
<div className="flex-1 overflow-y-auto p-6 pb-32">
<div className="grid grid-cols-1 xl:grid-cols-2 2xl:grid-cols-3 gap-6 max-w-7xl mx-auto">
<article className="bg-white border border-gray-200 rounded-md shadow-sm flex flex-col overflow-hidden group hover:shadow-md transition-shadow">
<div className="bg-primary text-white px-4 py-3 flex justify-between items-center border-b border-primary/10">
<span className="font-mono font-bold text-sm tracking-wide">GRID-ID: #160408</span>
<span className="material-symbols-outlined text-[20px]">priority_high</span>
</div>
<div className="p-5 flex-1 flex flex-col gap-5">
<div className="bg-sla-bg text-sla-text p-4 rounded-md border border-sla-text/20 text-center relative overflow-hidden shadow-sm">
<div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMiIgY3k9IjIiIHI9IjIiIGZpbGw9IiMzMzMiLz48L3N2Zz4=')] opacity-10 mix-blend-multiply"></div>
<p className="font-semibold text-xs tracking-wider uppercase mb-1 relative z-10 opacity-80">SLA Countdown</p>
<p className="font-mono text-3xl font-bold tracking-widest relative z-10">01:42:15</p>
</div>
<div className="flex flex-col sm:flex-row gap-5 flex-1">
<div className="flex-1 flex flex-col justify-center">
<dl className="space-y-2">
<div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between border-b border-gray-100 pb-2">
<dt className="font-medium text-xs uppercase text-gray-500 tracking-wide">Type</dt>
<dd className="font-semibold text-gray-800 text-sm">Pothole Repair</dd>
</div>
<div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between border-b border-gray-100 pb-2">
<dt className="font-medium text-xs uppercase text-gray-500 tracking-wide">Location</dt>
<dd className="font-semibold text-gray-800 text-sm text-right">402 W 8th St,<br/>Sector 7</dd>
</div>
<div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between pb-1">
<dt className="font-medium text-xs uppercase text-gray-500 tracking-wide">Priority</dt>
<dd className="font-bold text-red-600 text-sm">Critical</dd>
</div>
</dl>
</div>
<div className="shrink-0 w-full sm:w-28 aspect-square border border-gray-200 rounded-md bg-gray-100 relative overflow-hidden shadow-sm">
<div className="absolute inset-0 bg-cover bg-center" data-alt="Abstract map thumbnail showing location" data-location="Sector 7" style={{ backgroundImage: 'url(\'https://lh3.googleusercontent.com/aida-public/AB6AXuC61llPYQZQzOyYs8sI9XoLszy-MStf0IN37K_huw0XqpB5jySZblZoyTZYwwY082FwOzRJW14LQU8_gPPnsnjFgyccLtlJjaYAcqiq1ZDFdfcNZq-217gZCiCNWlAcfS0eXBrBoaTCs6aQERjjCZHed_H4ocTuyr4sVpcXl9ED21tQ76ckRGYGv27ITijrZFnbaPCyxK0WxRpNdskf75lT5F2n_EUbZjd413MeCrnlEqn3ngwq4_82fBcO8E-dh8-NveTHisFcdRSr\')' }}></div>
<div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 size-3 bg-primary rounded-full border border-white shadow-sm animate-pulse"></div>
</div>
</div>
</div>
<div className="px-5 py-4 border-t border-gray-100 bg-gray-50 flex flex-col sm:flex-row gap-3">
<Link href="/admin/mission-control" className="flex-1 bg-primary text-white font-semibold text-sm py-2.5 px-4 rounded-md shadow-sm hover:bg-primary/90 transition-colors">
                        Navigate
                    </Link>
<Link href="/admin/forensic-verify" className="flex-1 bg-white border border-primary text-primary font-semibold text-sm py-2.5 px-4 rounded-md shadow-sm hover:bg-gray-50 transition-colors">
                        Verify
                    </Link>
</div>
</article>
<article className="bg-white border border-gray-200 rounded-md shadow-sm flex flex-col overflow-hidden group hover:shadow-md transition-shadow">
<div className="bg-gray-800 text-white px-4 py-3 flex justify-between items-center border-b border-gray-800/10">
<span className="font-mono font-bold text-sm tracking-wide">GRID-ID: #160409</span>
</div>
<div className="p-5 flex-1 flex flex-col gap-5">
<div className="bg-gray-50 text-gray-800 p-4 rounded-md border border-gray-200 text-center shadow-sm">
<p className="font-semibold text-xs tracking-wider uppercase mb-1 opacity-70">SLA Countdown</p>
<p className="font-mono text-3xl font-bold tracking-widest text-gray-600">08:12:00</p>
</div>
<div className="flex flex-col sm:flex-row gap-5 flex-1">
<div className="flex-1 flex flex-col justify-center">
<dl className="space-y-2">
<div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between border-b border-gray-100 pb-2">
<dt className="font-medium text-xs uppercase text-gray-500 tracking-wide">Type</dt>
<dd className="font-semibold text-gray-800 text-sm">Streetlight Out</dd>
</div>
<div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between border-b border-gray-100 pb-2">
<dt className="font-medium text-xs uppercase text-gray-500 tracking-wide">Location</dt>
<dd className="font-semibold text-gray-800 text-sm text-right">Park Ave &amp; 4th,<br/>Sector 2</dd>
</div>
<div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between pb-1">
<dt className="font-medium text-xs uppercase text-gray-500 tracking-wide">Priority</dt>
<dd className="font-bold text-orange-600 text-sm">Medium</dd>
</div>
</dl>
</div>
<div className="shrink-0 w-full sm:w-28 aspect-square border border-gray-200 rounded-md bg-gray-100 relative overflow-hidden shadow-sm">
<div className="absolute inset-0 bg-cover bg-center grayscale opacity-80" data-alt="Abstract map thumbnail showing location" data-location="Sector 2" style={{ backgroundImage: 'url(\'https://lh3.googleusercontent.com/aida-public/AB6AXuDMlyZJmJ3Z4_L6_kMBMePG4wd3NfYHC9MZgWaKL12aKiOVbI7Kv5TV2Uxb4cuoC-9K4S2P7cXpHHf0GhEA30Vr1B0b5pkcDqzxjMK9kzVX_44pX4md2m-vr9Rrjc9fjscEwaHfFpnNqM_vCeaZdxdOWzqnonQKBDbV8nju8CxgnSABlwKK3e0AyujM5ZqlctyXxa0Lowf6N4YmjszmimZW9H_7WbJxkwk9jUBzPE_zzyapHmxdNIDu9zCn4I2ZoQeMeGV39z85P_Lh\')' }}></div>
<div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 size-3 bg-gray-600 rounded-full border border-white shadow-sm"></div>
</div>
</div>
</div>
<div className="px-5 py-4 border-t border-gray-100 bg-gray-50 flex flex-col sm:flex-row gap-3">
<Link href="/admin/ai-audit" className="flex-1 bg-white border border-gray-300 text-gray-700 font-semibold text-sm py-2.5 px-4 rounded-md shadow-sm hover:bg-gray-50 transition-colors">
                        Details
                    </Link>
</div>
</article>
<article className="bg-white border border-gray-200 rounded-md shadow-sm flex flex-col overflow-hidden group opacity-60">
<div className="bg-gray-200 text-gray-500 px-4 py-3 flex justify-between items-center border-b border-gray-300">
<span className="font-mono font-bold text-sm tracking-wide">GRID-ID: #160405</span>
<span className="material-symbols-outlined text-[20px]">check_circle</span>
</div>
<div className="p-5 flex-1 flex flex-col gap-5">
<div className="bg-gray-50 text-gray-400 p-4 rounded-md border border-gray-200 text-center shadow-sm">
<p className="font-semibold text-xs tracking-wider uppercase mb-1 opacity-70">SLA Completed</p>
<p className="font-mono text-3xl font-bold tracking-widest line-through">00:00:00</p>
</div>
<div className="flex flex-col sm:flex-row gap-5 flex-1">
<div className="flex-1 flex flex-col justify-center">
<dl className="space-y-2">
<div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between border-b border-gray-100 pb-2">
<dt className="font-medium text-xs uppercase text-gray-400 tracking-wide">Type</dt>
<dd className="font-semibold text-gray-500 text-sm">Graffiti Removal</dd>
</div>
<div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between border-b border-gray-100 pb-2">
<dt className="font-medium text-xs uppercase text-gray-400 tracking-wide">Location</dt>
<dd className="font-semibold text-gray-500 text-sm text-right">Main Station,<br/>Sector 1</dd>
</div>
<div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between pb-1">
<dt className="font-medium text-xs uppercase text-gray-400 tracking-wide">Status</dt>
<dd className="font-bold text-green-600/70 text-sm">Resolved</dd>
</div>
</dl>
</div>
</div>
</div>
</article>
</div>
</div>
<div className="absolute bottom-0 left-0 right-0 bg-white/80 backdrop-blur-md border-t border-gray-200 p-4 z-30 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
<div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-4 items-center justify-between">
<div className="text-gray-800 hidden md:block">
<p className="font-medium text-xs uppercase text-gray-500 tracking-wide mb-1">Active Selection</p>
<p className="font-mono font-bold text-lg tracking-wider text-primary">GRID-ID: #160408</p>
</div>
<div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
<Link href="/admin/mission-control" className="bg-primary text-white font-semibold text-sm py-3 px-6 rounded-md border border-transparent hover:bg-primary/90 transition-colors flex items-center justify-center gap-2 flex-1 md:flex-none shadow-sm">
<span className="material-symbols-outlined text-[20px]">navigation</span>
                    Navigate
                </Link>
<Link href="/admin/mission-control" className="bg-white text-gray-700 font-semibold text-sm py-3 px-6 rounded-md border border-gray-300 hover:bg-gray-50 transition-colors flex items-center justify-center gap-2 flex-1 md:flex-none shadow-sm">
<span className="material-symbols-outlined text-[20px]">photo_camera</span>
                    Before Photo
                </Link>
<Link href="/admin/forensic-verify" className="bg-white border border-primary text-primary font-semibold text-sm py-3 px-6 rounded-md hover:bg-gray-50 transition-colors flex items-center justify-center gap-2 flex-1 md:flex-none shadow-sm">
<span className="material-symbols-outlined text-[20px]">play_arrow</span>
                    Start Verif.
                </Link>
</div>
</div>
</div>
</main>


</div>
    </>
  );
}
