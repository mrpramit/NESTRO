import React, { useState } from "react";

export function DashboardCard({ title, value, trend, trendLabel = "Vs last month", icon }) {
  const isPositive = trend.startsWith("+");
  return (
    <div className="rounded-sm border border-[#e2e8f0] bg-white p-6 shadow-sm dark:border-[#2e3a47] dark:bg-[#1c2434] transition-colors duration-300">
      <div className="flex h-11.5 w-11.5 items-center justify-center rounded-full bg-[#f7f9fc] dark:bg-[#24303f] text-[#3c50e0] dark:text-blue-400">
        {icon}
      </div>

      <div className="mt-4 flex items-end justify-between">
        <div>
          <span className="text-sm font-medium text-slate-400 dark:text-slate-400">{title}</span>
          <h4 className="mt-1 text-2xl font-bold text-black dark:text-white">{value}</h4>
        </div>
        <span className={`flex items-center gap-1 rounded px-2 py-1 text-xs font-medium ${
          isPositive 
            ? "bg-emerald-500/10 text-emerald-500 dark:text-emerald-400" 
            : "bg-rose-500/10 text-rose-500 dark:text-rose-400"
        }`}>
          {trend} <span className="text-[10px] text-slate-400 dark:text-slate-400">{trendLabel}</span>
        </span>
      </div>
    </div>
  );
}

export function TrafficChart() {
  return (
    <div className="lg:col-span-2 rounded-sm border border-[#e2e8f0] bg-white p-6 shadow-sm dark:border-[#2e3a47] dark:bg-[#1c2434] transition-colors duration-300">
      <div className="flex flex-wrap items-start justify-between gap-3 sm:flex-nowrap">
        <div>
          <h3 className="text-xl font-bold text-black dark:text-white">Impression & Data Traffic</h3>
          <p className="text-sm font-medium text-slate-400">Jun 1, 2024 - Dec 1, 2025</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-2xl font-bold text-black dark:text-white">$9,758.00</span>
          <span className="rounded bg-emerald-500/10 px-2.5 py-0.5 text-xs font-semibold text-emerald-500">
            +7.96%
          </span>
        </div>
      </div>

      {/* SVG Multi-Line Chart Replica */}
      <div className="relative mt-8 h-80 w-full">
        <svg className="h-full w-full" viewBox="0 0 800 300" preserveAspectRatio="none">
          <defs>
            {/* Glow Gradients */}
            <linearGradient id="chartGrad1" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#3c50e0" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#3c50e0" stopOpacity="0.0" />
            </linearGradient>
            <linearGradient id="chartGrad2" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#80caee" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#80caee" stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* Background Grid Lines */}
          <line x1="0" y1="50" x2="800" y2="50" stroke="#e2e8f0" strokeDasharray="4 4" className="dark:hidden" />
          <line x1="0" y1="50" x2="800" y2="50" stroke="#2e3a47" strokeDasharray="4 4" className="hidden dark:block" />

          <line x1="0" y1="125" x2="800" y2="125" stroke="#e2e8f0" strokeDasharray="4 4" className="dark:hidden" />
          <line x1="0" y1="125" x2="800" y2="125" stroke="#2e3a47" strokeDasharray="4 4" className="hidden dark:block" />

          <line x1="0" y1="200" x2="800" y2="200" stroke="#e2e8f0" strokeDasharray="4 4" className="dark:hidden" />
          <line x1="0" y1="200" x2="800" y2="200" stroke="#2e3a47" strokeDasharray="4 4" className="hidden dark:block" />

          <line x1="0" y1="275" x2="800" y2="275" stroke="#e2e8f0" strokeDasharray="4 4" className="dark:hidden" />
          <line x1="0" y1="275" x2="800" y2="275" stroke="#2e3a47" strokeDasharray="4 4" className="hidden dark:block" />

          {/* Area Under Curves */}
          <path
            d="M0,275 Q100,180 200,210 T400,170 T600,230 T800,130 L800,275 L0,275 Z"
            fill="url(#chartGrad1)"
          />
          <path
            d="M0,275 Q120,230 240,250 T480,210 T720,260 T800,185 L800,275 L0,275 Z"
            fill="url(#chartGrad2)"
          />

          {/* Curve 1 (Indigo-Blue) */}
          <path
            d="M0,275 Q100,180 200,210 T400,170 T600,230 T800,130"
            fill="none"
            stroke="#3c50e0"
            strokeWidth="3.5"
            strokeLinecap="round"
          />

          {/* Curve 2 (Light Blue) */}
          <path
            d="M0,275 Q120,230 240,250 T480,210 T720,260 T800,185"
            fill="none"
            stroke="#80caee"
            strokeWidth="3.5"
            strokeLinecap="round"
          />

          {/* Interactive Dot Highlights */}
          <circle cx="400" cy="170" r="6" fill="#3c50e0" stroke="#fff" strokeWidth="2" className="drop-shadow-sm" />
          <circle cx="480" cy="210" r="6" fill="#80caee" stroke="#fff" strokeWidth="2" className="drop-shadow-sm" />
        </svg>
      </div>
    </div>
  );
}

export function TrafficStats() {
  const [trafficTab, setTrafficTab] = useState("today");

  const trafficStatsData = {
    today: { subscribers: "567K", trend: "+3.85%", rate: "27.6%", rateTrend: "+1.2%" },
    week: { subscribers: "3.4M", trend: "+12.4%", rate: "28.1%", rateTrend: "+2.5%" },
    month: { subscribers: "15.2M", trend: "+24.8%", rate: "29.4%", rateTrend: "+5.1%" }
  };

  return (
    <div className="rounded-sm border border-[#e2e8f0] bg-white p-6 shadow-sm dark:border-[#2e3a47] dark:bg-[#1c2434] transition-colors duration-300">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-bold text-black dark:text-white">Traffic Stats</h3>
        <button className="text-slate-400 hover:text-slate-600 dark:hover:text-white">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
          </svg>
        </button>
      </div>

      {/* Today, Week, Month switcher */}
      <div className="mt-5 flex gap-1 rounded bg-[#f1f5f9] dark:bg-[#24303f] p-1">
        {["today", "week", "month"].map((tab) => (
          <button
            key={tab}
            onClick={() => setTrafficTab(tab)}
            className={`flex-1 rounded py-1.5 text-xs font-semibold uppercase transition-all duration-200 ${
              trafficTab === tab
                ? "bg-white text-black dark:bg-[#1c2434] dark:text-white shadow-sm"
                : "text-slate-400 hover:text-black dark:hover:text-white"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Stats content details */}
      <div className="mt-7 space-y-6">
        <div>
          <p className="text-sm font-medium text-slate-400">New Subscribers</p>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-black dark:text-white">
              {trafficStatsData[trafficTab].subscribers}
            </span>
            <span className="text-xs font-medium text-emerald-500">
              {trafficStatsData[trafficTab].trend} <span className="text-[10px] text-slate-400">then last week</span>
            </span>
          </div>

          {/* Sparkline mini-graph */}
          <div className="mt-3 h-12 w-full">
            <svg className="h-full w-full" viewBox="0 0 200 40">
              <path
                d="M0,35 Q30,10 60,30 T120,15 T180,25 L200,10"
                fill="none"
                stroke="#10b981"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </div>
        </div>

        <div className="border-t border-[#e2e8f0] dark:border-[#2e3a47] pt-5">
          <p className="text-sm font-medium text-slate-400">Conversion Rate</p>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-black dark:text-white">
              {trafficStatsData[trafficTab].rate}
            </span>
            <span className="text-xs font-medium text-emerald-500">
              {trafficStatsData[trafficTab].rateTrend}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
