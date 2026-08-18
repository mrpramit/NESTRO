"use client";

import React from "react";
import Hero from "@/components/common/Hero";

export default function AboutPage() {
  const stats = [
    { value: "12K+", label: "Homes transformed" },
    { value: "280+", label: "Curated products" },
    { value: "8", label: "Showrooms across India" },
    { value: "4.9★", label: "Average rating" },
  ];

  const values = [
    {
      title: "Sustainable Craft",
      description: "We source responsibly — FSC-certified woods, natural fibres, and local artisans. Furniture that's good for your home and the planet.",
      icon: (
        <svg className="w-6 h-6 text-[#8C6239]" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M2 22c1.25-1.906 2.5-3.813 4.25-5.188A39.4 39.4 0 0 1 12.5 13.5c1.782-.415 3.564-.83 5.312-1.688A19.8 19.8 0 0 0 22 8c.25-1.563-.5-3.125-1.5-4.125S17.562 2.25 16 2.5A19.8 19.8 0 0 0 12 6.188c-.858 1.748-1.273 3.53-1.688 5.312a39.4 39.4 0 0 1-3.312 6.25c-1.375 1.75-3.281 3-5 4.25Z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 13.5 19.5 4.5" />
        </svg>
      )
    },
    {
      title: "Uncompromising Quality",
      description: "Every piece passes a 23-point quality check before it reaches your home. We back it with a 5-year warranty.",
      icon: (
        <svg className="w-6 h-6 text-[#8C6239]" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 3h12l4 6-10 12L2 9Z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M11 3 8 9l4 12 4-12-3-6" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M2 9h20" />
        </svg>
      )
    },
    {
      title: "Design with Soul",
      description: "We don't chase trends. We design furniture that ages gracefully and belongs in every chapter of your life.",
      icon: (
        <svg className="w-6 h-6 text-[#8C6239]" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
        </svg>
      )
    }
  ];

  const team = [
    {
      initials: "AK",
      name: "Aarav Kumar",
      role: "Founder & CEO",
    },
    {
      initials: "SM",
      name: "Sanya Mehta",
      role: "Head of Design",
    },
    {
      initials: "VR",
      name: "Vikram Rao",
      role: "Chief Craftsman",
    },
    {
      initials: "PJ",
      name: "Preet Joshi",
      role: "Customer Experience",
    },
  ];


  return (
    <main className="bg-[#FAF7F2] pb-16 flex-grow">
      {/* About Reusable Hero Component */}
      <Hero
        title={
          <>
            Furniture crafted with <span className="italic font-serif text-[#C4A484] font-normal">purpose</span>
          </>
        }
        description="Founded in 2018, Nestro was born from a belief that beautiful furniture shouldn't be a luxury. We work directly with master craftsmen across India and Scandinavia to bring you pieces that are honest in material, thoughtful in design, and built to outlast trends."
        image="/about-hero.png"
      />

      {/* Stats Grid Container */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="bg-white border border-[#EFE8DF] rounded-[24px] py-10 px-6 md:px-12 grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-4 divide-y lg:divide-y-0 lg:divide-x divide-[#EFE8DF]/60 shadow-sm">
          {stats.map((stat, index) => (
            <div
              key={stat.label}
              className={`text-center flex flex-col justify-center transition-all duration-300 transform hover:scale-105 group/stat ${
                index > 0 ? "pt-6 lg:pt-0" : ""
              }`}
            >
              <span className="text-3xl md:text-4xl font-bold text-[#281C19] group-hover/stat:text-[#8C6239] transition-colors duration-300 tracking-tight">
                {stat.value}
              </span>
              <span className="text-xs md:text-sm text-[#8A7973] group-hover/stat:text-[#8C6239]/80 font-medium mt-1 transition-colors duration-300">
                {stat.label}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* What Drives Us - Values Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-12">
        {/* Title Header */}
        <div className="space-y-1 mb-8 text-left">
          <span className="text-[10px] md:text-xs font-bold tracking-[0.2em] text-[#8C6239] uppercase block">
            WHAT DRIVES US
          </span>
          <h2 className="text-xl md:text-2xl font-bold text-[#281C19] tracking-tight">
            Our Values
          </h2>
        </div>

        {/* Value Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {values.map((val) => (
            <div
              key={val.title}
              className="bg-white border border-[#EFE8DF] rounded-[20px] p-5 md:p-6 flex flex-col hover:shadow-xl hover:shadow-[#8C6239]/5 hover:border-[#8C6239]/40 hover:-translate-y-2 transition-all duration-300 group"
            >
              <div className="mb-4 text-[#8C6239] transition-all duration-300 group-hover:scale-110 group-hover:-rotate-3">
                {val.icon}
              </div>
              <h3 className="text-sm md:text-base font-bold text-[#281C19] group-hover:text-[#8C6239] transition-colors duration-300 mb-2">
                {val.title}
              </h3>
              <p className="text-xs md:text-sm text-[#8A7973] leading-relaxed">
                {val.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Our Team Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-12">
        {/* Title Header */}
        <div className="space-y-1 mb-8 text-left">
          <span className="text-[10px] md:text-xs font-bold tracking-[0.2em] text-[#8C6239] uppercase block">
            THE PEOPLE BEHIND NESTRO
          </span>
          <h2 className="text-xl md:text-2xl font-bold text-[#281C19] tracking-tight">
            Our Team
          </h2>
        </div>

        {/* Team Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {team.map((member) => (
            <div
              key={member.name}
              className="bg-white border border-[#EFE8DF] rounded-[20px] overflow-hidden flex flex-col hover:shadow-xl hover:shadow-[#8C6239]/5 hover:border-[#8C6239]/40 hover:-translate-y-2 transition-all duration-300 group"
            >
              {/* Initials Placeholder visual container */}
              <div className="bg-[#F4EFE8]/70 aspect-[3/2] flex items-center justify-center text-[#8C6239] font-serif text-3xl font-medium tracking-wider group-hover:bg-[#F3ECE4] transition-all duration-300 overflow-hidden">
                <span className="transform group-hover:scale-110 transition-transform duration-300">
                  {member.initials}
                </span>
              </div>
              
              {/* Info section */}
              <div className="p-4 border-t border-[#EFE8DF]/50">
                <h3 className="font-bold text-[#281C19] group-hover:text-[#8C6239] transition-colors duration-300 text-xs md:text-sm">
                  {member.name}
                </h3>
                <p className="text-[10px] text-[#8A7973] mt-0.5 font-medium">
                  {member.role}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
