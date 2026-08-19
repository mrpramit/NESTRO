"use client";

import React from "react";
import Link from "next/link";

export default function AuthSidebar() {
  return (
    <div className="w-full lg:w-[45%] bg-[#281C19] text-[#FAF7F2] p-8 md:p-10 lg:p-12 flex flex-col justify-center gap-8 md:gap-10 lg:gap-12 relative overflow-hidden flex-shrink-0 min-h-[320px] lg:min-h-screen lg:self-stretch">
      {/* Background glow flares */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-[#8C6239]/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#FAF7F2]/5 rounded-full blur-[100px] pointer-events-none" />

      {/* Center Graphic and Text */}
      <div className="relative z-10 space-y-6 flex flex-col items-center lg:items-start w-full">
        {/* Sofa Container Icon */}
        <div className="w-20 h-20 bg-white/5 border border-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center shadow-lg group hover:bg-white/10 hover:border-[#C4A484]/30 hover:shadow-xl transition-all duration-500">
          <svg className="w-10 h-8 text-[#C4A484]/95 group-hover:scale-110 transition-transform duration-300" fill="currentColor" viewBox="0 0 100 60">
            {/* Sofa back cushion */}
            <rect x="25" y="10" width="50" height="24" rx="6" />
            <rect x="30" y="14" width="18" height="16" rx="3" fill="#8C6239" fillOpacity="0.5" />
            <rect x="52" y="14" width="18" height="16" rx="3" fill="#8C6239" fillOpacity="0.5" />
            {/* Arms */}
            <rect x="15" y="22" width="10" height="20" rx="3" />
            <rect x="75" y="22" width="10" height="20" rx="3" />
            {/* Seat */}
            <rect x="22" y="30" width="56" height="12" rx="3" fill="#C4A484" />
            {/* Base */}
            <rect x="20" y="40" width="60" height="4" rx="1" />
            {/* Legs */}
            <line x1="26" y1="44" x2="22" y2="52" stroke="#FAF7F2" strokeWidth="3.5" strokeLinecap="round" opacity="0.9" />
            <line x1="74" y1="44" x2="78" y2="52" stroke="#FAF7F2" strokeWidth="3.5" strokeLinecap="round" opacity="0.9" />
          </svg>
        </div>

        {/* Catchy Slogan */}
        <div className="text-center lg:text-left space-y-2">
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-extrabold tracking-tight leading-tight">
            Your <span className="italic font-serif text-[#C4A484] font-normal">Dream Home</span> <br />
            Starts Here
          </h1>
          <p className="text-xs md:text-sm text-[#BCAEA5] max-w-xs leading-relaxed font-light">
            Join 12,000 homeowners who've transformed their living spaces with Nestro.
          </p>
        </div>
      </div>

      {/* Feature check list */}
      <div className="relative z-10 space-y-4 max-w-sm w-full">
        {/* Item 1 */}
        <div className="flex items-start gap-3.5 group/item">
          <div className="w-8 h-8 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-[#C4A484] flex-shrink-0 group-hover/item:bg-white/10 group-hover/item:border-[#C4A484]/30 transition-all duration-300">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124l-.32-4.818a3 3 0 00-2.946-2.808H16.5m-3-3.75h3.75a1.5 1.5 0 011.5 1.5v3m-5.25-6v6m0 0h5.25" />
            </svg>
          </div>
          <div className="space-y-0.5">
            <h3 className="text-xs font-semibold text-[#FAF7F2]">Free White-Glove Delivery</h3>
            <p className="text-[10px] text-[#BCAEA5] font-light leading-relaxed">
              Complimentary shipping and professional assembly on all orders.
            </p>
          </div>
        </div>

        {/* Item 2 */}
        <div className="flex items-start gap-3.5 group/item">
          <div className="w-8 h-8 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-[#C4A484] flex-shrink-0 group-hover/item:bg-white/10 group-hover/item:border-[#C4A484]/30 transition-all duration-300">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499c-.195-.39-.587-.649-1.023-.649s-.828.258-1.023.649L7.33 6.027l-2.79.405c-.435.063-.777.379-.887.808-.11.429.015.89.317 1.218L6.08 10.43l-.478 2.778c-.075.438.106.879.47 1.14.364.263.855.286 1.242.06L9.8 13.11l2.482 1.303c.387.203.878.18 1.242-.06.364-.26.545-.702.47-1.14l-.478-2.778 2.012-1.96c.302-.294.428-.756.317-1.185-.11-.43-.452-.745-.887-.808l-2.79-.405-2.012-2.792z" />
            </svg>
          </div>
          <div className="space-y-0.5">
            <h3 className="text-xs font-semibold text-[#FAF7F2]">Nestro Rewards Club</h3>
            <p className="text-[10px] text-[#BCAEA5] font-light leading-relaxed">
              Earn points on every purchase and redeem them for exclusive benefits.
            </p>
          </div>
        </div>

        {/* Item 3 */}
        <div className="flex items-start gap-3.5 group/item">
          <div className="w-8 h-8 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-[#C4A484] flex-shrink-0 group-hover/item:bg-white/10 group-hover/item:border-[#C4A484]/30 transition-all duration-300">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 6v.75m0 3v.75m0 3v.75m0 3V18m-9-5.25h5.25M7.5 15h3M3.375 5.25c-.621 0-1.125.504-1.125 1.125v3.026a2.999 2.999 0 010 5.198v3.026c0 .621.504 1.125 1.125 1.125h17.25c.621 0 1.125-.504 1.125-1.125v-3.026a2.999 2.999 0 010-5.198V6.375c0-.621-.504-1.125-1.125-1.125H3.375z" />
            </svg>
          </div>
          <div className="space-y-0.5">
            <h3 className="text-xs font-semibold text-[#FAF7F2]">VIP Member Privileges</h3>
            <p className="text-[10px] text-[#BCAEA5] font-light leading-relaxed">
              Unlock special member-only pricing and early access to new collections.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
