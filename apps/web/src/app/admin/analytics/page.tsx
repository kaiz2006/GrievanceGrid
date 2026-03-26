import Link from "next/link";
import React from "react";

export default function GeneratedPage() {
  return (
    <>
<div className="w-full min-h-screen bg-background font-display text-primary">

<div className="relative flex h-auto min-h-screen w-full flex-col group/design-root overflow-x-hidden">
<div className="layout-container flex h-full grow flex-col">
<div className="px-8 lg:px-12 xl:px-24 flex flex-1 justify-center py-8">
<div className="layout-content-container flex flex-col w-full max-w-[1440px] flex-1 gap-6">
<header className="flex items-center justify-between whitespace-nowrap bg-surface border border-border rounded-md px-6 py-4 shadow-sm">
<div className="flex items-center gap-3 text-text-main">
<div className="size-8 flex items-center justify-center bg-primary text-white rounded-md">
<span className="material-symbols-outlined text-xl">analytics</span>
</div>
<h2 className="text-text-main text-xl font-semibold tracking-tight">Executive Analytics Suite <span className="text-text-muted font-mono text-xs ml-2 bg-gray-100 px-2 py-0.5 rounded">v2.4</span></h2>
</div>
<div className="flex flex-1 justify-end gap-6 items-center">
<div className="flex items-center gap-6 hidden md:flex">
<Link className="text-text-muted text-sm font-medium hover:text-text-main transition-colors" href="/admin/mission-control">Dashboard</Link>
<Link className="text-text-main text-sm font-medium hover:text-primary transition-colors" href="/admin/ai-assistant">AI Assistant</Link>
<Link className="text-text-muted text-sm font-medium hover:text-text-main transition-colors" href="/admin/analytics">Reports</Link>
<Link className="text-text-muted text-sm font-medium hover:text-text-main transition-colors" href="/admin/escalations">SLA</Link>
</div>
<div className="bg-gray-200 border border-border rounded-full bg-center bg-no-repeat aspect-square bg-cover size-10" data-alt="User avatar placeholder image" style={{ backgroundImage: `url('https://lh3.googleusercontent.com/aida-public/AB6AXuAkxhiXh4a865sTADhmyGLQu7eYfdelrqKzB7sFiX1TjrVrXAqIy_mwITEp5-RhOBtmmvwL0adOu8nGyhkZP30mpyzqpj0TtVegWZ-e9H254Q-x2j0Bxh7UGlxKfUX4YlujdSt403dppQQa-vHzYnpz2e2qDReX_3xZ5sP9Kzc4Rz9ufNsl57Vi_W2OfpNdpkoFHg8a2fnZLQ14oVN3Y1TEuYTwykEq9pdV837FkFAHPf_mTIo2o5-PGqqEM69ylIKVckbNCOQanwp9')` }}></div>
</div>
</header>
<div className="flex flex-wrap items-center justify-between gap-4 bg-surface border border-border rounded-md p-3 shadow-sm">
<div className="flex flex-wrap gap-2 w-full md:w-auto">
<Link href="/admin/mission-control" className="flex items-center gap-2 border border-border bg-white px-3 py-1.5 text-sm font-medium text-text-main hover:bg-gray-50 rounded-md transition-colors">
<span className="material-symbols-outlined text-[18px] text-text-muted">calendar_month</span>
                            Last 30 Days
                        </Link>
<Link href="/admin/mission-control" className="flex items-center gap-2 border border-border bg-white px-3 py-1.5 text-sm font-medium text-text-main hover:bg-gray-50 rounded-md transition-colors">
<span className="material-symbols-outlined text-[18px] text-text-muted">filter_alt</span>
                            All Departments
                        </Link>
<Link href="/admin/mission-control" className="flex items-center gap-2 border border-border bg-white px-3 py-1.5 text-sm font-medium text-text-main hover:bg-gray-50 rounded-md transition-colors">
<span className="material-symbols-outlined text-[18px] text-text-muted">sort</span>
                            Priority: High
                        </Link>
</div>
<div className="flex gap-2">
<Link href="/admin/mission-control" className="flex items-center justify-center bg-primary text-white px-4 py-1.5 text-sm font-medium rounded-md hover:bg-primary/90 transition-colors">
<span className="material-symbols-outlined text-[18px] mr-1.5">refresh</span>
                            Sync Data
                        </Link>
<Link href="/admin/analytics" className="flex items-center justify-center border border-border bg-white text-text-main px-3 py-1.5 rounded-md hover:bg-gray-50 transition-colors">
<span className="material-symbols-outlined text-[18px]">download</span>
</Link>
</div>
</div>
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
<div className="flex flex-col gap-1 border border-border bg-surface rounded-md p-5 shadow-sm relative overflow-hidden group">
<div className="flex items-center justify-between mb-2">
<p className="text-text-muted text-xs font-semibold uppercase tracking-wider">Avg Resolution</p>
<span className="material-symbols-outlined text-text-muted text-xl opacity-50">timer</span>
</div>
<p className="text-primary font-mono text-3xl font-medium tracking-tight">3.2<span className="text-lg text-text-muted ml-0.5">d</span></p>
<div className="flex items-center gap-1 mt-2">
<span className="material-symbols-outlined text-alert-text text-sm">trending_up</span>
<p className="text-alert-text text-xs font-medium font-mono">+10%</p>
<span className="text-text-muted text-xs ml-1">vs last mo</span>
</div>
</div>
<div className="flex flex-col gap-1 border border-border bg-surface rounded-md p-5 shadow-sm relative overflow-hidden group">
<div className="flex items-center justify-between mb-2">
<p className="text-text-muted text-xs font-semibold uppercase tracking-wider">SLA Compliance</p>
<span className="material-symbols-outlined text-text-muted text-xl opacity-50">verified</span>
</div>
<p className="text-success-dark font-mono text-3xl font-medium tracking-tight">92%</p>
<div className="flex items-center gap-1 mt-2">
<span className="material-symbols-outlined text-success-dark text-sm">trending_up</span>
<p className="text-success-dark text-xs font-medium font-mono">+2%</p>
<span className="text-text-muted text-xs ml-1">vs last mo</span>
</div>
</div>
<div className="flex flex-col gap-1 border border-border bg-surface rounded-md p-5 shadow-sm relative overflow-hidden group">
<div className="flex items-center justify-between mb-2">
<p className="text-text-muted text-xs font-semibold uppercase tracking-wider">Open Grievances</p>
<span className="material-symbols-outlined text-text-muted text-xl opacity-50">assignment_late</span>
</div>
<p className="text-primary font-mono text-3xl font-medium tracking-tight">1,048</p>
<div className="flex items-center gap-1 mt-2">
<span className="material-symbols-outlined text-success-dark text-sm">trending_down</span>
<p className="text-success-dark text-xs font-medium font-mono">-5%</p>
<span className="text-text-muted text-xs ml-1">vs last mo</span>
</div>
</div>
<div className="flex flex-col gap-1 border border-border bg-surface rounded-md p-5 shadow-sm relative overflow-hidden group">
<div className="flex items-center justify-between mb-2">
<p className="text-text-muted text-xs font-semibold uppercase tracking-wider">Citizen Sat</p>
<span className="material-symbols-outlined text-text-muted text-xl opacity-50">sentiment_satisfied</span>
</div>
<p className="text-primary font-mono text-3xl font-medium tracking-tight">85%</p>
<div className="flex items-center gap-1 mt-2">
<span className="material-symbols-outlined text-success-dark text-sm">trending_up</span>
<p className="text-success-dark text-xs font-medium font-mono">+1%</p>
<span className="text-text-muted text-xs ml-1">vs last mo</span>
</div>
</div>
</div>
<div className="flex flex-col lg:flex-row gap-6">
<div className="flex-1 lg:w-3/5 border border-border bg-surface rounded-md p-6 shadow-sm flex flex-col">
<div className="flex justify-between items-start mb-6 border-b border-border pb-4">
<div>
<h3 className="text-lg font-semibold tracking-tight text-text-main">Resolution Flow</h3>
<p className="text-xs font-medium text-text-muted mt-1 uppercase tracking-wide">Weekly Trend (Last 4 Wks)</p>
</div>
<div className="flex gap-4">
<div className="flex items-center gap-1.5"><div className="w-3 h-3 bg-primary rounded-sm"></div><span className="text-xs font-medium text-text-muted">Resolved</span></div>
<div className="flex items-center gap-1.5"><div className="w-3 h-3 bg-gray-200 border border-border rounded-sm"></div><span className="text-xs font-medium text-text-muted">Pending</span></div>
</div>
</div>
<div className="flex-1 min-h-[260px] flex items-end justify-between gap-4 pt-4 border-l border-b border-border pb-2 pl-4 relative ml-8">
<div className="absolute left-[-40px] top-0 h-full flex flex-col justify-between text-[10px] font-mono font-medium text-text-muted pb-6">
<span>500</span>
<span>250</span>
<span>0</span>
</div>
<div className="w-full flex flex-col justify-end items-center gap-1 h-full group">
<div className="w-full max-w-[48px] bg-gray-100 border-x border-t border-border rounded-t-sm" style={{ height: '30%' }}></div>
<div className="w-full max-w-[48px] bg-primary rounded-t-sm" style={{ height: '45%' }}></div>
<span className="text-[10px] font-medium text-text-muted mt-2">WK 1</span>
</div>
<div className="w-full flex flex-col justify-end items-center gap-1 h-full group">
<div className="w-full max-w-[48px] bg-gray-100 border-x border-t border-border rounded-t-sm" style={{ height: '25%' }}></div>
<div className="w-full max-w-[48px] bg-primary rounded-t-sm" style={{ height: '55%' }}></div>
<span className="text-[10px] font-medium text-text-muted mt-2">WK 2</span>
</div>
<div className="w-full flex flex-col justify-end items-center gap-1 h-full group">
<div className="w-full max-w-[48px] bg-gray-100 border-x border-t border-border rounded-t-sm" style={{ height: '40%' }}></div>
<div className="w-full max-w-[48px] bg-primary rounded-t-sm" style={{ height: '35%' }}></div>
<span className="text-[10px] font-medium text-text-muted mt-2">WK 3</span>
</div>
<div className="w-full flex flex-col justify-end items-center gap-1 h-full group">
<div className="w-full max-w-[48px] bg-gray-100 border-x border-t border-border rounded-t-sm" style={{ height: '15%' }}></div>
<div className="w-full max-w-[48px] bg-primary rounded-t-sm" style={{ height: '70%' }}></div>
<span className="text-[10px] font-medium text-text-main mt-2 font-bold">WK 4</span>
</div>
</div>
</div>
<div className="flex-1 lg:w-2/5 border border-border bg-surface rounded-md p-6 shadow-sm flex flex-col">
<div className="mb-6 border-b border-border pb-4">
<h3 className="text-lg font-semibold tracking-tight text-text-main">Bottleneck Radar</h3>
<p className="text-xs font-medium text-text-muted mt-1 uppercase tracking-wide">Dept Vulnerability Zones</p>
</div>
<div className="grid grid-cols-2 gap-3 flex-1">
<div className="border border-alert-text/20 rounded-md p-4 flex flex-col justify-between bg-alert-bg">
<span className="font-medium text-sm text-text-main">Sanitation</span>
<span className="font-mono text-xl font-semibold text-alert-text">High</span>
</div>
<div className="border border-warning-text/20 rounded-md p-4 flex flex-col justify-between bg-warning-bg">
<span className="font-medium text-sm text-text-main">Roads</span>
<span className="font-mono text-xl font-semibold text-warning-text">Med</span>
</div>
<div className="border border-success/30 rounded-md p-4 flex flex-col justify-between bg-success/10">
<span className="font-medium text-sm text-text-main">Parks</span>
<span className="font-mono text-xl font-semibold text-success-dark">Low</span>
</div>
<div className="border border-alert-text/20 rounded-md p-4 flex flex-col justify-between bg-alert-bg">
<span className="font-medium text-sm text-text-main">Water</span>
<span className="font-mono text-xl font-semibold text-alert-text">High</span>
</div>
</div>
</div>
</div>
<div className="border border-border bg-surface rounded-md shadow-sm @container overflow-hidden">
<div className="flex items-center justify-between p-5 border-b border-border bg-surface">
<div className="flex items-center gap-3">
<h3 className="text-lg font-semibold tracking-tight text-text-main flex items-center gap-2">
                                SLA Action Required
                            </h3>
<span className="text-[10px] font-medium text-alert-text bg-alert-bg border border-alert-text/20 px-2 py-0.5 rounded-full uppercase tracking-wide">Immediate Action</span>
</div>
<Link href="/admin/escalations" className="text-sm font-medium text-primary hover:text-primary/80 transition-colors">View All</Link>
</div>
<div className="overflow-x-auto">
<table className="w-full text-left border-collapse text-sm">
<thead>
<tr className="bg-gray-50 border-b border-border text-text-muted text-xs font-semibold uppercase tracking-wider">
<th className="p-4 whitespace-nowrap font-medium">Ticket ID</th>
<th className="p-4 min-w-[200px] font-medium">Issue Details</th>
<th className="p-4 font-medium">Department</th>
<th className="p-4 text-center font-medium">Time Remaining</th>
<th className="p-4 text-center font-medium">Action</th>
</tr>
</thead>
<tbody className="divide-y divide-border">
<tr className="hover:bg-gray-50/50 transition-colors">
<td className="p-4 font-mono font-medium text-text-main">#TKT-8901</td>
<td className="p-4 font-medium text-text-main">Massive Pothole - Main St Int</td>
<td className="p-4"><span className="bg-gray-100 text-text-main border border-border px-2.5 py-1 rounded text-xs font-medium">Roads</span></td>
<td className="p-4 text-center">
<div className="inline-flex items-center gap-1.5 bg-alert-bg text-alert-text border border-alert-text/20 px-2.5 py-1 rounded-full font-mono text-xs font-semibold">
<span className="size-1.5 rounded-full bg-alert-text animate-pulse"></span>
                                            00:15:00
                                        </div>
</td>
<td className="p-4 text-center">
<Link href="/admin/escalations" className="bg-primary text-white px-3 py-1.5 rounded text-xs font-medium hover:bg-primary/90 transition-colors w-full max-w-[120px]">
                                            Escalate
                                        </Link>
</td>
</tr>
<tr className="hover:bg-gray-50/50 transition-colors">
<td className="p-4 font-mono font-medium text-text-main">#TKT-8905</td>
<td className="p-4 font-medium text-text-main">Major Water Main Leak</td>
<td className="p-4"><span className="bg-gray-100 text-text-main border border-border px-2.5 py-1 rounded text-xs font-medium">Water</span></td>
<td className="p-4 text-center">
<div className="inline-flex items-center gap-1.5 bg-alert-bg text-alert-text border border-alert-text/20 px-2.5 py-1 rounded-full font-mono text-xs font-semibold">
<span className="size-1.5 rounded-full bg-alert-text animate-pulse"></span>
                                            00:42:30
                                        </div>
</td>
<td className="p-4 text-center">
<Link href="/admin/escalations" className="bg-primary text-white px-3 py-1.5 rounded text-xs font-medium hover:bg-primary/90 transition-colors w-full max-w-[120px]">
                                            Escalate
                                        </Link>
</td>
</tr>
<tr className="hover:bg-gray-50/50 transition-colors">
<td className="p-4 font-mono font-medium text-text-main">#TKT-8890</td>
<td className="p-4 font-medium text-text-main">Missed Sector Trash Pickup</td>
<td className="p-4"><span className="bg-gray-100 text-text-main border border-border px-2.5 py-1 rounded text-xs font-medium">Sanitation</span></td>
<td className="p-4 text-center">
<div className="inline-flex items-center gap-1.5 bg-gray-50 text-text-muted border border-border px-2.5 py-1 rounded-full font-mono text-xs font-medium">
                                            02:10:00
                                        </div>
</td>
<td className="p-4 text-center">
<Link href="/admin/mission-control" className="border border-border bg-white text-text-main px-3 py-1.5 rounded text-xs font-medium hover:bg-gray-50 transition-colors w-full max-w-[120px]">
                                            Nudge
                                        </Link>
</td>
</tr>
</tbody>
</table>
</div>
</div>
</div>
</div>
</div>
</div>


</div>
    </>
  );
}
