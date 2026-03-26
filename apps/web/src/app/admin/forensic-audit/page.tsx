import Link from "next/link";
import React from 'react';

export default function GeneratedPage() {
  return (
    <>
      <div className="w-full min-h-screen bg-background font-display text-primary">
        <div className="bg-plum text-white font-mono text-xs py-1 overflow-hidden border-b border-slate-300 flex opacity-90">
          <div className="scrolling-ticker flex-shrink-0 w-full tracking-wider">
            CRITICAL ALERT: MULTIPLE DISCREPANCIES DETECTED IN SECTOR 7G /// [FRAUD_PROB_99%] ///
            AWAITING MANUAL VERIFICATION /// AUDIT LOG CORRUPTION IN REGION BETA ///
          </div>
          <div aria-hidden="true" className="scrolling-ticker flex-shrink-0 w-full tracking-wider">
            CRITICAL ALERT: MULTIPLE DISCREPANCIES DETECTED IN SECTOR 7G /// [FRAUD_PROB_99%] ///
            AWAITING MANUAL VERIFICATION /// AUDIT LOG CORRUPTION IN REGION BETA ///
          </div>
        </div>
        <div className="layout-container flex h-full grow flex-col px-6 py-8 max-w-[1400px] mx-auto">
          <header className="flex items-center justify-between whitespace-nowrap bg-white p-5 rounded-md border border-slate-200 shadow-soft mb-8">
            <div className="flex items-center gap-3 text-plum">
              <span className="material-symbols-outlined text-3xl opacity-80">analytics</span>
              <h2 className="text-2xl font-bold tracking-tight">GrievanceGrid Audit</h2>
            </div>
            <div className="flex flex-1 justify-end gap-6 items-center">
              <nav className="flex items-center gap-6 font-medium text-sm text-slate-600">
                <Link className="hover:text-plum transition-colors" href="/admin/mission-control">
                  Dashboard
                </Link>
                <Link className="hover:text-plum transition-colors" href="/admin/ai-assistant">
                  AI Assistant
                </Link>
                <Link className="text-plum font-bold" href="/admin/forensic-audit">
                  Forensic
                </Link>
                <Link className="hover:text-plum transition-colors" href="/admin/analytics">
                  Reports
                </Link>
              </nav>
              <Link href="/admin/forensic-audit" className="flex items-center justify-center bg-plum text-white text-sm font-medium h-10 px-6 rounded-md shadow-button hover:bg-opacity-90 transition-all">
                New Audit
              </Link>
            </div>
          </header>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="flex flex-col gap-3 p-6 bg-card-fraud border border-slate-200 rounded-md shadow-soft">
              <div className="flex justify-between items-start text-card-fraud-border">
                <p className="text-sm font-semibold uppercase tracking-wider w-2/3">
                  High-Probability Fraud
                </p>
                <span className="material-symbols-outlined text-2xl">gavel</span>
              </div>
              <p className="text-slate-800 text-5xl font-light mt-2 font-mono">07</p>
            </div>
            <div className="flex flex-col gap-3 p-6 bg-card-dispute border border-slate-200 rounded-md shadow-soft">
              <div className="flex justify-between items-start text-card-dispute-border">
                <p className="text-sm font-semibold uppercase tracking-wider w-2/3">
                  Citizen Disputes
                </p>
                <span className="material-symbols-outlined text-2xl">groups</span>
              </div>
              <p className="text-slate-800 text-5xl font-light mt-2 font-mono">24</p>
            </div>
            <div className="flex flex-col gap-3 p-6 bg-card-trust border border-slate-200 rounded-md shadow-soft">
              <div className="flex justify-between items-start text-custom-2">
                <p className="text-sm font-semibold uppercase tracking-wider w-2/3">
                  Integrity Score
                </p>
                <span className="material-symbols-outlined text-2xl">health_and_safety</span>
              </div>
              <p className="text-slate-800 text-5xl font-light mt-2 font-mono">94%</p>
            </div>
          </div>
          <div className="flex flex-col lg:flex-row gap-6 mb-8">
            <div className="flex-1 lg:w-3/5 bg-white border border-slate-200 rounded-md shadow-soft p-6 flex flex-col">
              <div className="flex justify-between items-center border-b border-slate-100 pb-4 mb-6">
                <h3 className="text-lg font-semibold text-slate-800">
                  Reported vs Verified Audits
                </h3>
                <div className="flex gap-4">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-plum rounded-sm"></div>
                    <span className="text-xs text-slate-500 font-medium uppercase tracking-wider">
                      Reported
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-muted-grey rounded-sm"></div>
                    <span className="text-xs text-slate-500 font-medium uppercase tracking-wider">
                      Verified
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex-1 grid min-h-[250px] grid-flow-col gap-6 grid-rows-[1fr_auto] items-end justify-items-center">
                <div className="w-full flex justify-center gap-1 items-end h-[80%]">
                  <div className="w-1/2 bg-plum rounded-t-sm h-full opacity-90 hover:opacity-100 transition-opacity"></div>
                  <div className="w-1/2 bg-muted-grey rounded-t-sm h-[60%] opacity-80 hover:opacity-100 transition-opacity"></div>
                </div>
                <p className="text-slate-500 text-xs font-medium mt-3">M</p>
                <div className="w-full flex justify-center gap-1 items-end h-[60%]">
                  <div className="w-1/2 bg-plum rounded-t-sm h-full opacity-90 hover:opacity-100 transition-opacity"></div>
                  <div className="w-1/2 bg-muted-grey rounded-t-sm h-[90%] opacity-80 hover:opacity-100 transition-opacity"></div>
                </div>
                <p className="text-slate-500 text-xs font-medium mt-3">T</p>
                <div className="w-full flex justify-center gap-1 items-end h-[90%]">
                  <div className="w-1/2 bg-plum rounded-t-sm h-full opacity-90 hover:opacity-100 transition-opacity"></div>
                  <div className="w-1/2 bg-muted-grey rounded-t-sm h-[40%] opacity-80 hover:opacity-100 transition-opacity"></div>
                </div>
                <p className="text-slate-500 text-xs font-medium mt-3">W</p>
                <div className="w-full flex justify-center gap-1 items-end h-[40%]">
                  <div className="w-1/2 bg-plum rounded-t-sm h-full opacity-90 hover:opacity-100 transition-opacity"></div>
                  <div className="w-1/2 bg-muted-grey rounded-t-sm h-[30%] opacity-80 hover:opacity-100 transition-opacity"></div>
                </div>
                <p className="text-slate-500 text-xs font-medium mt-3">T</p>
                <div className="w-full flex justify-center gap-1 items-end h-[100%]">
                  <div className="w-1/2 bg-plum rounded-t-sm h-full opacity-90 hover:opacity-100 transition-opacity"></div>
                  <div className="w-1/2 bg-muted-grey rounded-t-sm h-[80%] opacity-80 hover:opacity-100 transition-opacity"></div>
                </div>
                <p className="text-slate-500 text-xs font-medium mt-3">F</p>
              </div>
            </div>
            <div className="flex-none lg:w-2/5 bg-white border border-slate-200 rounded-md shadow-soft p-6 flex flex-col">
              <h3 className="text-lg font-semibold text-slate-800 border-b border-slate-100 pb-4 mb-6">
                Hotspot Audit Map
              </h3>
              <div
                className="flex-1 rounded-sm border border-slate-200 relative bg-slate-100 overflow-hidden min-h-[250px] bg-center bg-cover toner-map"
                style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuCGHv0GMIw2T-uJ8pPQUHQF3fMHAoTjmjIcb7hqoXvYWRXI5c4GUzVIdFwVmFnmHbHjx-1p5nQqCu35stLvNh6kJUngk2LRdfRPA1zByiTlyuZeHXJeJmmn5uJQXQBnl3W0HdADjawuhEw-ZooRdVjf1eIWSZzpdHu4_dEqsAfTWwajUqBX48eGpULBKyIW1hpqVy1LnqFpDQjCv2pTnVpIq3Q6u-Ms6oaokwxmkHrjgHOKcp6TRPhda2ei2wBaKqsfk29yE6udWHT5')" }}
              >
                <div className="absolute top-1/4 left-1/4 w-8 h-8 bg-plum opacity-40 rounded-full flex items-center justify-center">
                  <div className="w-2 h-2 bg-plum rounded-full"></div>
                </div>
                <div className="absolute top-1/2 right-1/3 w-12 h-12 bg-plum opacity-30 rounded-full flex items-center justify-center">
                  <div className="w-3 h-3 bg-plum rounded-full"></div>
                </div>
                <div className="absolute bottom-1/4 right-1/4 w-6 h-6 bg-plum opacity-50 rounded-full flex items-center justify-center">
                  <div className="w-1.5 h-1.5 bg-plum rounded-full"></div>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-white border border-slate-200 rounded-md shadow-soft p-6 mb-8">
            <h3 className="text-lg font-semibold text-slate-800 border-b border-slate-100 pb-4 mb-4">
              Audit Evidence Log
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="text-slate-500 font-display text-xs uppercase tracking-wider border-b border-slate-200">
                    <th className="p-3 font-medium">ID</th>
                    <th className="p-3 font-medium">Date</th>
                    <th className="p-3 font-medium">Location</th>
                    <th className="p-3 font-medium">Status Tag</th>
                    <th className="p-3 font-medium text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="text-sm font-mono text-slate-700">
                  <tr className="border-b border-slate-100 hover:bg-peach-hover transition-colors">
                    <td className="p-3">#GG-4921</td>
                    <td className="p-3">2023-10-24</td>
                    <td className="p-3 font-display">Sector 7G</td>
                    <td className="p-3">
                      <span className="bg-red-50 text-red-600 border border-red-200 px-2 py-0.5 rounded text-xs">
                        [GPS_FAIL]
                      </span>
                    </td>
                    <td className="p-3 text-right">
                      <Link href="/admin/mission-control" className="text-plum font-display font-medium text-xs hover:underline underline-offset-2">
                        Review
                      </Link>
                    </td>
                  </tr>
                  <tr className="border-b border-slate-100 hover:bg-peach-hover transition-colors">
                    <td className="p-3">#GG-4922</td>
                    <td className="p-3">2023-10-24</td>
                    <td className="p-3 font-display">Region Beta</td>
                    <td className="p-3">
                      <span className="bg-orange-50 text-orange-600 border border-orange-200 px-2 py-0.5 rounded text-xs">
                        [IMG_CORRUPT]
                      </span>
                    </td>
                    <td className="p-3 text-right">
                      <Link href="/admin/mission-control" className="text-plum font-display font-medium text-xs hover:underline underline-offset-2">
                        Review
                      </Link>
                    </td>
                  </tr>
                  <tr className="border-b border-slate-100 hover:bg-peach-hover transition-colors">
                    <td className="p-3">#GG-4923</td>
                    <td className="p-3">2023-10-23</td>
                    <td className="p-3 font-display">Zone Alpha</td>
                    <td className="p-3">
                      <span className="bg-green-50 text-green-700 border border-green-200 px-2 py-0.5 rounded text-xs">
                        [VERIFIED]
                      </span>
                    </td>
                    <td className="p-3 text-right">
                      <Link href="/admin/mission-control" className="text-slate-500 font-display font-medium text-xs hover:underline underline-offset-2">
                        View Log
                      </Link>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
