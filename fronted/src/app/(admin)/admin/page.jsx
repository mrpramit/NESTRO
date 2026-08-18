"use client";

import React from "react";
import { DashboardCard, TrafficChart, TrafficStats } from "@/components/admin/DashboardWidgets";

export default function AdminDashboard() {
  return (
    <div className="space-y-6">
      {/* 1. Overview Metric Cards Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 md:gap-6">
        {/* Card 1: Avg. Client Rating */}
        <DashboardCard
          title="Avg. Client Rating"
          value="7.8/10"
          trend="+20%"
          icon={
            <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.907c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.907a1 1 0 00.95-.69l1.519-4.674z" />
            </svg>
          }
        />

        {/* Card 2: Instagram Followers */}
        <DashboardCard
          title="Instagram Followers"
          value="5,934"
          trend="-3.59%"
          icon={
            <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          }
        />

        {/* Card 3: Total Revenue */}
        <DashboardCard
          title="Total Revenue"
          value="$9,758"
          trend="+15%"
          icon={
            <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M12 16M3 5h18M3 19h18" />
            </svg>
          }
        />
      </div>

      {/* 2. Charts Section */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3 md:gap-6">
        {/* Main Chart: Impression & Data Traffic */}
        <TrafficChart />

        {/* Side Widget: Traffic Stats */}
        <TrafficStats />
      </div>
    </div>
  );
}
