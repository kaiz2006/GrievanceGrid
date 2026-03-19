import Link from "next/link";
import React from "react";

export default function GeneratedPage() {
  return (
    <>
<div className="w-full min-h-screen bg-background font-display text-primary">

<div className="relative flex h-full w-full flex-col p-4 md:p-8">
<header className="bg-white mb-8 flex items-center justify-between px-6 py-4 border border-plum rounded">
<div className="flex items-center gap-4 text-plum">
<span className="material-symbols-outlined text-3xl">engineering</span>
<div className="flex flex-col gap-1">
<h1 className="text-xl font-semibold tracking-tight">Field Verification Workspace</h1>
<span className="font-mono text-xs font-medium bg-soft-grey px-2 py-1 rounded border border-plum/20 text-slate-600">GPS: 34.0522° N, 118.2437° W | ALT: 72m</span>
</div>
</div>
<div className="flex gap-4 items-center">
<div className="bg-sage-light px-3 py-1.5 rounded border border-sage text-sage flex items-center gap-2">
<span className="material-symbols-outlined text-sm font-medium">location_on</span>
<span className="font-medium text-xs tracking-wide uppercase">Location Matched</span>
</div>
<div className="font-mono text-sm font-medium border border-plum/20 p-1.5 bg-soft-grey rounded text-slate-600">
                    ID: 884-GXV-99
                </div>
</div>
</header>
<div className="grid grid-cols-1 lg:grid-cols-3 gap-8 h-full">
<div className="lg:col-span-2 flex flex-col gap-6">
<div className="grid grid-cols-1 md:grid-cols-2 gap-6 h-full">
<div className="bg-white flex flex-col h-[500px] relative overflow-hidden border border-plum rounded">
<div className="bg-slate-50 text-plum font-semibold p-3 border-b border-plum uppercase tracking-wide flex justify-between items-center z-10 text-sm">
<span>Reference: Before</span>
<span className="material-symbols-outlined text-burnt-orange text-lg">cancel</span>
</div>
<div className="flex-1 relative bg-slate-200" data-alt="Broken industrial pipe leaking water" style={{ backgroundImage: 'url(\'https://lh3.googleusercontent.com/aida-public/AB6AXuAIDKSJhbVTGkvI7CTIzbA5l_SrAo--j4HgZdqRqN1m7f-i94Z4XJohWpMR7NZTUDV68eIJnMo11BUuynsvw3Np4v2tuAQI1_zaDv2Ht52QWZ64YvCk2eK1_kcSkUMdy9kNFvN8R8-qP7HNB560Wm8Gh2u8VtXo0mfCYihZYZgmma7zsTPNvTKEmmoUwiFkhEluOVXrE1GvgNw1-90m36oqj0hKvn8tbWky8R0JCXUUohpnBRsVfkZqOeU6wmF6NjOldwGiq0P2ALKc\')', backgroundSize: 'cover', backgroundPosition: 'center' }}>
<div className="absolute inset-0 bg-burnt-orange/10 mix-blend-multiply"></div>
<div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 border border-burnt-orange rounded-full opacity-60 flex items-center justify-center">
<div className="w-2 h-2 bg-burnt-orange rounded-full"></div>
</div>
</div>
<div className="p-3 border-t border-plum bg-slate-50 font-mono text-xs text-slate-500 uppercase flex justify-between">
<span>Logged: 24h Ago</span>
<span className="text-burnt-orange font-medium">Status: Critical Failure</span>
</div>
</div>
<div className="bg-white flex flex-col h-[500px] relative overflow-hidden border border-plum rounded">
<div className="bg-slate-50 text-plum font-semibold p-3 border-b border-plum uppercase tracking-wide flex justify-between items-center z-10 text-sm">
<span>Live Stream: After</span>
<div className="flex items-center gap-2 text-sage">
<div className="w-2 h-2 bg-sage rounded-full animate-pulse"></div>
<span className="text-xs font-medium">LIVE</span>
</div>
</div>
<div className="flex-1 relative bg-slate-200" data-alt="Repaired industrial pipe system" style={{ backgroundImage: 'url(\'https://lh3.googleusercontent.com/aida-public/AB6AXuBSa1GRdJzUmfJB_BistNsa1VgaF6rsvV5RneFM1BUDR4hiYK5alBZiUyyVmH2RUwRJYUwlpmU_pB_f9kh51SRx8ir5uAuAjUSlJ92xLhHxHvk_HuHI1xzCfk6-yWbSvRseV_9JaJPnUqhAMVEv3ljNBeSmPGvQIhNFm8QB0SR3SuhFCHEfLzEgEWycPNYF2XYt9OKWo02mnmcTp_UZcKpsRiiiy2gYR1BBZNlzxdDycnm6HNGeCHWRpMTQOgZzq60YHy0x-1NdBhpo\')', backgroundSize: 'cover', backgroundPosition: 'center' }}>
<div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: 'linear-gradient(rgba(56, 29, 42, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(56, 29, 42, 0.1) 1px, transparent 1px)', backgroundSize: '50px 50px' }}></div>
<div className="absolute bottom-4 right-4 bg-white/90 text-plum p-2 border border-plum/20 rounded font-mono text-xs shadow-sm">
                                SCAN: ALIGNED<br/>
                                STRUCT: 99.8%
                            </div>
</div>
<div className="p-3 border-t border-plum bg-slate-50 font-mono text-xs text-slate-500 uppercase flex justify-between">
<span>Latency: 12ms</span>
<span>Feed: Cam-04 Alpha</span>
</div>
</div>
</div>
<div className="bg-white p-6 mt-auto border border-plum rounded">
<h2 className="text-sm font-semibold uppercase mb-4 text-slate-500 tracking-wider">Control Console</h2>
<div className="flex flex-col md:flex-row gap-4">
<Link href="/admin/mission-control" className="flex-1 bg-plum text-white py-3 px-6 font-medium text-sm tracking-wide uppercase rounded transition-opacity flex items-center justify-center gap-3 hover:opacity-90">
<span className="material-symbols-outlined text-xl">cloud_upload</span>
                            Capture &amp; Sync to Grid
                        </Link>
<Link href="/admin/mission-control" className="md:w-1/3 bg-burnt-orange text-white py-3 px-6 font-medium text-sm tracking-wide uppercase rounded transition-opacity flex items-center justify-center gap-2 hover:opacity-90">
<span className="material-symbols-outlined text-xl">warning</span>
                            Conflict / Cancel
                        </Link>
</div>
</div>
</div>
<div className="flex flex-col gap-6 h-full">
<div className="bg-white p-6 flex flex-col justify-center items-center text-center border border-plum rounded">
<h3 className="font-semibold uppercase tracking-wider text-xs text-slate-500 mb-4 w-full">Severity Reduction Score</h3>
<div className="text-[5rem] font-light leading-none text-plum tracking-tighter">
                        89<span className="text-3xl align-top font-normal">%</span>
</div>
<div className="mt-4 font-mono font-medium bg-sage-light text-sage px-3 py-1 rounded border border-sage/30 text-xs uppercase">
                        Target Exceeded (+14%)
                    </div>
</div>
<div className="bg-slate-100 flex-1 flex flex-col overflow-hidden min-h-[400px] border border-plum rounded">
<div className="bg-slate-200 text-plum font-semibold p-3 border-b border-plum/20 uppercase tracking-wide flex justify-between items-center text-sm">
<span>Object Detection Log</span>
<span className="material-symbols-outlined text-lg">terminal</span>
</div>
<div className="p-4 font-mono text-xs text-slate-600 flex-1 overflow-y-auto flex flex-col gap-2">
<p>&gt; init scan_protocol v4.2.1</p>
<p>&gt; parsing coordinate geometry...</p>
<p className="text-burnt-orange">&gt; warn: structural deviance detected (0.02mm)</p>
<p>&gt; analyzing weld integrity...</p>
<p>&gt; weld_01: pass (98.4%)</p>
<p>&gt; weld_02: pass (99.1%)</p>
<p>&gt; joint_sealant: confirmed active</p>
<p>&gt; comparing reference vectors...</p>
<p className="text-plum font-semibold bg-white p-1.5 border border-plum/10 rounded mt-2">&gt; STATUS: GRID_ALIGNMENT_OPTIMAL</p>
<p className="animate-pulse">_</p>
</div>
</div>
</div>
</div>
</div>

</div>
    </>
  );
}
