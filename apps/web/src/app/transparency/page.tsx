import Link from "next/link";
import React from "react";

export default function GeneratedPage() {
  return (
    <>
<div className="w-full min-h-screen bg-background font-display text-primary">

<div className="layout-container flex h-full grow flex-col max-w-[1440px] mx-auto bg-background">
<header className="flex items-center justify-between whitespace-nowrap border-b border-border-light bg-white px-10 py-6">
<div className="flex items-center gap-4 text-primary">
<div className="size-8 bg-secondary rounded-md flex items-center justify-center text-primary">
<span className="material-symbols-outlined font-semibold">grid_view</span>
</div>
<h2 className="text-primary text-2xl font-semibold leading-tight tracking-tight">Citizen Trust</h2>
</div>
<div className="flex flex-1 justify-end gap-8">
<div className="flex items-center gap-9">
<Link className="text-text-light text-base font-semibold leading-normal hover:text-primary transition-colors" href="/admin/mission-control">Dashboard</Link>
<Link className="text-text-light text-base font-semibold leading-normal hover:text-primary transition-colors" href="#">Submit</Link>
<Link className="text-text-light text-base font-semibold leading-normal hover:text-primary transition-colors" href="#">About</Link>
</div>
<Link href="/admin/mission-control" className="flex min-w-[120px] cursor-pointer items-center justify-center rounded-md border border-border-light h-10 px-6 bg-white text-primary text-base font-semibold hover:bg-gray-50 transition-colors">
<span>Log In</span>
</Link>
</div>
</header>
<div className="flex flex-col lg:flex-row p-8 gap-12 max-w-[1200px] mx-auto w-full">
<div className="flex-1 flex flex-col gap-10">
<div className="relative py-4">
<h1 className="text-primary text-4xl md:text-5xl font-semibold leading-tight tracking-tight">Public Transparency<br/>Dashboard</h1>
<div className="inline-block mt-4 bg-secondary/20 text-primary text-sm font-semibold px-3 py-1 rounded-full">
                        Trustworthy &amp; Open
                    </div>
</div>
<div className="flex flex-col md:flex-row gap-6">
<div className="flex-1 bg-white border border-border-light rounded-lg p-6 soft-shadow flex flex-col justify-between min-h-[180px]">
<p className="text-text-light text-sm font-semibold uppercase tracking-wider mb-2">Overall Transparency</p>
<p className="text-primary text-6xl font-semibold leading-none tracking-tight mt-auto">4.2</p>
</div>
<div className="flex-1 bg-white border border-border-light rounded-lg p-6 soft-shadow flex flex-col justify-between min-h-[180px]">
<p className="text-text-light text-sm font-semibold uppercase tracking-wider mb-2">City Resolution Score</p>
<p className="text-primary text-6xl font-semibold leading-none tracking-tight mt-auto">4.8 <span className="text-2xl text-text-light">/ 5</span></p>
</div>
</div>
<div className="bg-white border border-border-light rounded-lg p-8 soft-shadow mt-4">
<div className="flex justify-between items-start mb-10 border-b border-border-light pb-6">
<div>
<p className="text-primary text-xl font-semibold">Resolved vs Pending</p>
<p className="text-secondary text-4xl font-semibold leading-none tracking-tight mt-3 text-custom-9">82% Resolved</p>
</div>
<div className="bg-secondary/10 text-primary px-3 py-1.5 rounded-full font-semibold text-sm flex items-center gap-1">
<span className="material-symbols-outlined text-sm">trending_up</span>
                            +12% YTD
                        </div>
</div>
<div className="flex gap-6 justify-end mb-8 font-semibold text-sm text-text-light">
<div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-secondary"></div> Resolved</div>
<div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-gray-200"></div> Pending</div>
</div>
<div className="grid min-h-[250px] grid-flow-col gap-8 grid-rows-[1fr_auto] items-end justify-items-center px-4">
<div className="w-full flex flex-col justify-end items-center gap-1.5 h-full">
<div className="bg-gray-200 rounded-t-sm w-full max-w-[40px] transition-all hover:bg-gray-300" style={{ height: '20%' }}></div>
<div className="bg-secondary rounded-t-sm w-full max-w-[40px] transition-all hover:brightness-95" style={{ height: '60%' }}></div>
</div>
<p className="text-text-light text-sm font-semibold mt-4 w-full text-center">Jan</p>
<div className="w-full flex flex-col justify-end items-center gap-1.5 h-full">
<div className="bg-gray-200 rounded-t-sm w-full max-w-[40px] transition-all hover:bg-gray-300" style={{ height: '30%' }}></div>
<div className="bg-secondary rounded-t-sm w-full max-w-[40px] transition-all hover:brightness-95" style={{ height: '40%' }}></div>
</div>
<p className="text-text-light text-sm font-semibold mt-4 w-full text-center">Feb</p>
<div className="w-full flex flex-col justify-end items-center gap-1.5 h-full">
<div className="bg-gray-200 rounded-t-sm w-full max-w-[40px] transition-all hover:bg-gray-300" style={{ height: '15%' }}></div>
<div className="bg-secondary rounded-t-sm w-full max-w-[40px] transition-all hover:brightness-95" style={{ height: '75%' }}></div>
</div>
<p className="text-text-light text-sm font-semibold mt-4 w-full text-center">Mar</p>
<div className="w-full flex flex-col justify-end items-center gap-1.5 h-full">
<div className="bg-gray-200 rounded-t-sm w-full max-w-[40px] transition-all hover:bg-gray-300" style={{ height: '10%' }}></div>
<div className="bg-secondary rounded-t-sm w-full max-w-[40px] transition-all hover:brightness-95" style={{ height: '85%' }}></div>
</div>
<p className="text-text-light text-sm font-semibold mt-4 w-full text-center">Apr</p>
<div className="w-full flex flex-col justify-end items-center gap-1.5 h-full">
<div className="bg-gray-200 rounded-t-sm w-full max-w-[40px] transition-all hover:bg-gray-300" style={{ height: '25%' }}></div>
<div className="bg-secondary rounded-t-sm w-full max-w-[40px] transition-all hover:brightness-95" style={{ height: '65%' }}></div>
</div>
<p className="text-text-light text-sm font-semibold mt-4 w-full text-center">May</p>
</div>
</div>
</div>
<div className="w-full lg:w-[380px] flex flex-col gap-8">
<Link href="/admin/grievances" className="w-full bg-primary rounded-lg p-5 text-white text-lg font-semibold soft-shadow hover:bg-opacity-90 transition-colors flex items-center justify-center gap-3">
<span className="material-symbols-outlined text-xl">campaign</span>
                    Submit Grievance
                </Link>
<div className="bg-white border border-border-light rounded-lg p-6 soft-shadow flex-1">
<h2 className="text-primary text-xl font-semibold mb-6 flex items-center gap-2">
<span className="material-symbols-outlined text-secondary">dynamic_feed</span>
                        Impact Feed
                    </h2>
<div className="flex flex-col gap-6">
<div className="group">
<div className="flex justify-between items-center mb-2">
<span className="pill-resolved px-2.5 py-0.5 rounded-full font-semibold text-xs">Resolved</span>
<span className="text-text-light text-xs font-semibold">2h ago</span>
</div>
<p className="font-semibold text-primary mb-3 text-base leading-snug">Pothole on 5th Ave filled</p>
<div className="flex gap-3">
<div className="relative flex-1 h-28 rounded-[6px] bg-gray-100 overflow-hidden" data-alt="Pothole on street before repair" style={{ backgroundImage: 'url(\'https://lh3.googleusercontent.com/aida-public/AB6AXuCAza14EeI5IbmFxSNzGdKbAKQFDASCEW7oluiBRce3KQiaCEmRnVxVyT2CKtKILdvCKHYCXt97G8F5X1yCCs5o76lEyt6KNQfU_FviIfsXoLRDkzR08hwcGV6U-lGp6trLx4njqCXHHMGgddqAnMjeHTQzm9YxOqhN-FZqct7qct67NwV6Y6hTG2SUvEIaye3F8Ej9G_7FVdREQ2emrue4a3XQaBJNqyFrBfxwXycEGoUiaY6lUSmtawCy2L41YG0C8XI_i_WvXafD\')', backgroundSize: 'cover', backgroundPosition: 'center' }}>
<span className="absolute bottom-2 left-2 bg-white/90 text-primary text-[10px] font-semibold px-1.5 py-0.5 rounded-sm shadow-sm backdrop-blur-sm">Before</span>
</div>
<div className="relative flex-1 h-28 rounded-[6px] bg-gray-100 overflow-hidden" data-alt="Repaired street surface" style={{ backgroundImage: 'url(\'https://lh3.googleusercontent.com/aida-public/AB6AXuC9eFxwW6ZxS-_JaGaRi0Zeo4CY05H_tFIkMwN6g25Zi47R5z1M2OiBkc4fGPz000EsNx7YkvCFqIeRcprs0GEoaYBltsj5MkDgx5zt7HAJcdqI_jKeJFPgraMqOEYFind4q0ThVSSQdF50MKikJEOtXn-WfPwwhu7bpCs_6Qr2271XSU4_xjh-NIgcjtaA9gP2CIqQp1E1OnDmOXN0J-06CZy3Gp59jnLoQQ4pc9ZRv-DNtdCHqoPT2NhNxb6RHtmGIrvj4BT8wIAp\')', backgroundSize: 'cover', backgroundPosition: 'center' }}>
<span className="absolute bottom-2 left-2 bg-secondary text-primary text-[10px] font-semibold px-1.5 py-0.5 rounded-sm shadow-sm">After</span>
</div>
</div>
</div>
<div className="h-px bg-border-light w-full"></div>
<div className="group">
<div className="flex justify-between items-center mb-2">
<span className="pill-resolved px-2.5 py-0.5 rounded-full font-semibold text-xs">Resolved</span>
<span className="text-text-light text-xs font-semibold">5h ago</span>
</div>
<p className="font-semibold text-primary mb-3 text-base leading-snug">Broken Streetlight fixed - Downtown</p>
<div className="flex gap-3">
<div className="relative flex-1 h-28 rounded-[6px] bg-gray-100 flex items-center justify-center font-semibold text-gray-400 text-sm">Image</div>
<div className="relative flex-1 h-28 rounded-[6px] bg-gray-100 flex items-center justify-center font-semibold text-gray-400 text-sm">Image</div>
</div>
</div>
</div>
</div>
<div className="flex gap-4 mt-auto border-t border-border-light pt-6">
<Link href="/admin/mission-control" className="flex-1 bg-white border border-border-light rounded-md py-2.5 text-text-light hover:text-primary hover:bg-gray-50 transition-colors flex justify-center items-center gap-2 text-sm font-semibold">
<span className="material-symbols-outlined text-lg">share</span> Share
                </Link>
<Link href="/admin/mission-control" className="flex-1 bg-white border border-border-light rounded-md py-2.5 text-text-light hover:text-primary hover:bg-gray-50 transition-colors flex justify-center items-center gap-2 text-sm font-semibold">
<span className="material-symbols-outlined text-lg">forum</span> Discuss
                </Link>
</div>
</div>
</div>
</div>

</div>
    </>
  );
}
