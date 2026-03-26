import Link from "next/link";
import React from "react";

export default function GeneratedPage() {
  return (
    <>
<div className="w-full min-h-screen bg-background font-display text-primary">

<div className="relative flex min-h-screen w-full flex-col group/design-root overflow-x-hidden">
<div className="layout-container flex h-full grow flex-col">
<header className="flex items-center justify-between whitespace-nowrap border-b border-[var(--slate-border)] bg-white px-8 py-4 sticky top-0 z-50">
<div className="flex items-center gap-4 text-slate-900">
<span className="material-symbols-outlined text-2xl text-[var(--primary-plum)]">warning</span>
<h2 className="text-xl font-semibold tracking-tight text-[var(--text-main)]">GrievanceGrid Escalations</h2>
</div>
<div className="flex flex-1 justify-end gap-8 items-center">
<div className="flex items-center gap-6 text-sm font-medium">
<Link className="text-[var(--text-muted)] hover:text-[var(--primary-plum)] transition-colors" href="/admin/mission-control">Dashboard</Link>
<Link className="text-[var(--text-main)] hover:text-[var(--primary-plum)] transition-colors border-b-2 border-[var(--primary-plum)] pb-1" href="/admin/ai-assistant">AI Assistant</Link>
<Link className="text-[var(--text-muted)] hover:text-[var(--primary-plum)] transition-colors" href="/admin/analytics">Reports</Link>
<Link className="text-[var(--text-muted)] hover:text-[var(--primary-plum)] transition-colors" href="/admin/escalations">SLA</Link>
</div>
<Link href="/admin/mission-control" className="flex items-center justify-center bg-white text-[var(--primary-plum)] border border-[var(--primary-plum)] px-4 py-2 text-sm font-semibold rounded hover:bg-[var(--primary-plum)] hover:text-white transition-colors">
                        CRISIS MAP
                    </Link>
<div className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10 border border-[var(--slate-border)]" data-alt="User profile avatar placeholder" style={{ backgroundImage: `url('https://lh3.googleusercontent.com/aida-public/AB6AXuDKxh-1GKS8CEQwfoVT4dd0vyk_HCxMaBz3b0TkFH3Z5YG3vtl9UPykEbltY-t9Hv0F4fPmlWdy7biGP_E05Jba7tILXbZyH_lHnMBecmlxpoIKPV3KPHF7p9LnPyHJiRKtJ19ufjFVROaEv_wxu7bVbN4EOMHQY0qDrh7wO9MMHojTHtPpeaGv7cWrO3SRX3jlhCwjCx6WqXf4UX9rvZ0yBNIoDQuSV40odymc7pHAcxJA-QxiHT6ik0zqZU-N46hnWsRyGBq3u1VL')` }}></div>
</div>
</header>
<div className="px-8 flex flex-1 justify-center py-8">
<div className="layout-content-container flex flex-col max-w-[1200px] w-full flex-1 gap-8">
<div className="flex flex-col gap-4">
<h3 className="text-lg font-semibold text-[var(--text-main)]">System Failure Summary</h3>
<div className="flex flex-wrap gap-4">
<div className="flex min-w-[200px] flex-1 flex-col gap-1 p-5 border border-[var(--slate-border)] rounded-md bg-custom-1">
<p className="text-sm font-medium text-[var(--overdue-orange)] uppercase tracking-wide">Overdue</p>
<p className="text-4xl font-bold text-[var(--overdue-orange)]">142</p>
</div>
<div className="flex min-w-[200px] flex-1 flex-col gap-1 p-5 border border-[var(--slate-border)] rounded-md bg-white">
<p className="text-sm font-medium text-[var(--text-muted)] uppercase tracking-wide">Contested</p>
<p className="text-4xl font-bold text-[var(--text-main)]">89</p>
</div>
<div className="flex min-w-[200px] flex-1 flex-col gap-1 p-5 border border-[var(--slate-border)] rounded-md bg-white">
<p className="text-sm font-medium text-[var(--text-muted)] uppercase tracking-wide">Avg Delay</p>
<p className="text-4xl font-bold text-[var(--text-main)]">48 <span className="text-xl text-[var(--text-muted)] font-normal">hrs</span></p>
</div>
</div>
</div>
<div className="flex flex-col gap-6 mt-2">
<div className="flex bg-white border border-[var(--slate-border)] rounded-md overflow-hidden relative">
<div className="flex flex-col md:flex-row p-6 gap-6 w-full">
<div className="flex flex-[2_2_0px] flex-col gap-4 relative">
<div className="flex flex-col gap-2">
<div className="flex items-center gap-3">
<span className="bg-red-50 text-red-700 font-semibold text-xs px-2.5 py-1 rounded-full border border-red-200 uppercase tracking-wider">Overdue - 72h</span>
<span className="mono-text text-xs text-[var(--text-muted)]">ID: #GG-9942</span>
</div>
<h4 className="text-xl font-bold text-[var(--text-main)] mt-1">Pothole Class 4 - Main St</h4>
<p className="text-red-700 font-medium text-sm">SLA Expired - Resident injury reported</p>
</div>
<div className="bg-[var(--slate-bg)] text-[var(--text-main)] p-4 rounded-md mt-2 w-full max-w-md mono-text text-sm border border-[var(--slate-border)]">
<p className="font-semibold text-xs text-[var(--text-muted)] uppercase mb-2">Audit Log / Contest Reason</p>
<p className="leading-relaxed">"Crew dispatched but could not locate. Reporter claims crew never arrived. Photo timestamp contradicts crew log."</p>
</div>
</div>
<div className="w-full md:w-56 bg-center bg-no-repeat aspect-video bg-cover rounded-md border border-[var(--slate-border)] shrink-0" data-alt="Deep pothole on asphalt road" style={{ backgroundImage: `url('https://lh3.googleusercontent.com/aida-public/AB6AXuDMdglL7DhRn-ZSZfTW6aeW4A15xhG4-R5PkKI1I4OO9IyLthq0AtyEkQhaHBdrnkbyEbPYKb2mE_Jl7uZPmulMaHHaImfPeC0piNczMXdgBAyL5UBFc6ibJX_in2-CBDtiYcWFZQYgN0wwDGWUiPNqmqQLVCDrhY3mOTOM64-dcQdGFxeb5u4m9BrgP9pZeowNIKcgymbfSOSFRGhGXxX9X3anCJQjmqAtrNSbVzmxpf5TzEl0GMSt0TdeuI9lVHLd0_KXM_XgztgV')` }}></div>
<div className="flex flex-col gap-3 pl-6 shrink-0 w-full md:w-56 justify-center border-l border-[var(--slate-border)]">
<Link href="/admin/mission-control" className="flex w-full cursor-pointer items-center justify-center bg-[var(--primary-plum)] text-white py-2.5 px-4 text-sm font-semibold rounded hover:bg-opacity-90 transition-colors">
<span className="material-symbols-outlined mr-2 text-[18px]">emergency</span>
                                        Emergency Dispatch
                                    </Link>
<Link href="/admin/grievances" className="flex w-full cursor-pointer items-center justify-center bg-white text-[var(--text-main)] border border-[var(--slate-border)] py-2.5 px-4 text-sm font-semibold rounded hover:bg-gray-50 transition-colors">
<span className="material-symbols-outlined mr-2 text-[18px]">group_add</span>
                                        Re-Assign Crew
                                    </Link>
</div>
</div>
</div>
<div className="flex bg-white border border-[var(--slate-border)] rounded-md overflow-hidden relative">
<div className="flex flex-col md:flex-row p-6 gap-6 w-full">
<div className="flex flex-[2_2_0px] flex-col gap-4 relative">
<div className="flex flex-col gap-2">
<div className="flex items-center gap-3">
<span className="bg-red-50 text-red-700 font-semibold text-xs px-2.5 py-1 rounded-full border border-red-200 uppercase tracking-wider">Contested - 48h</span>
<span className="mono-text text-xs text-[var(--text-muted)]">ID: #GG-8815</span>
</div>
<h4 className="text-xl font-bold text-[var(--text-main)] mt-1">Broken Water Main - 5th Ave</h4>
<p className="text-orange-700 font-medium text-sm">Repair failed after 2 days - Flooding active</p>
</div>
<div className="bg-[var(--slate-bg)] text-[var(--text-main)] p-4 rounded-md mt-2 w-full max-w-md mono-text text-sm border border-[var(--slate-border)]">
<p className="font-semibold text-xs text-[var(--text-muted)] uppercase mb-2">Audit Log / Contest Reason</p>
<p className="leading-relaxed">"Marked as 'Resolved' by Contractor X, but citizen submitted live video showing continuous geyser. Contractor disputes video authenticity."</p>
</div>
</div>
<div className="w-full md:w-56 bg-center bg-no-repeat aspect-video bg-cover rounded-md border border-[var(--slate-border)] shrink-0" data-alt="Water erupting from broken street main" style={{ backgroundImage: `url('https://lh3.googleusercontent.com/aida-public/AB6AXuAQpyRiq7_Zv2KjsUIGLNUYastAqQZQj4ds5DmGypfxGk_Dp7iGJ6euVTLq-6th8fCAi5jILH8yQmcmyFYz8J_-jdOIOOr1-cK33q6xpojwRXU_eKc10xSHGckDzQLx6uVMyomqKmnZOJMOHbxbjYTEtycccXhVUNAC53WjakBLlPKtpTQDr7ngwUMs6_KgIUb-Wyi7k1602EbeXnnvYXk1LOQnFGun6VvH2x6RWPSzzPcR7Jp9jwJVuHV3ukNY9As3amquP_QrSC0v')` }}></div>
<div className="flex flex-col gap-3 pl-6 shrink-0 w-full md:w-56 justify-center border-l border-[var(--slate-border)]">
<Link href="/admin/mission-control" className="flex w-full cursor-pointer items-center justify-center bg-[var(--primary-plum)] text-white py-2.5 px-4 text-sm font-semibold rounded hover:bg-opacity-90 transition-colors">
<span className="material-symbols-outlined mr-2 text-[18px]">emergency</span>
                                        Emergency Dispatch
                                    </Link>
<Link href="/admin/grievances" className="flex w-full cursor-pointer items-center justify-center bg-white text-[var(--text-main)] border border-[var(--slate-border)] py-2.5 px-4 text-sm font-semibold rounded hover:bg-gray-50 transition-colors">
<span className="material-symbols-outlined mr-2 text-[18px]">group_add</span>
                                        Re-Assign Crew
                                    </Link>
</div>
</div>
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
