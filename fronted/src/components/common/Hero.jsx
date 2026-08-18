"use client";

import React from "react";

export default function Hero({
  tag,
  title,
  description,
  buttons,
  image,
  illustration,
}) {
  const hasRightContent = image || illustration;

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8">
      <div className="bg-[#281C19] rounded-[24px] overflow-hidden px-8 py-10 md:px-12 md:py-14 lg:py-16 relative shadow-xl">
        {/* Decorative background grid elements or subtle ambient glow */}
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-[#8C6239]/5 rounded-full blur-[100px] pointer-events-none" />
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
          {/* Left Text Content */}
          <div className={`${hasRightContent ? "lg:col-span-7" : "lg:col-span-12"} space-y-4 md:space-y-6`}>
            {tag && (
              <span className="text-[10px] md:text-xs font-bold tracking-[0.2em] text-[#C4A484] uppercase block">
                {tag}
              </span>
            )}
            
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-[#FAF7F2] leading-[1.15] font-sans">
              {title}
            </h1>
            
            <p className="text-[#BCAEA5] text-xs sm:text-sm md:text-base max-w-2xl leading-relaxed">
              {description}
            </p>
            
            {buttons && (
              <div className="flex flex-wrap items-center gap-4 pt-2">
                {buttons}
              </div>
            )}
          </div>
          
          {/* Right Visual Image / Illustration */}
          {hasRightContent && (
            <div className="lg:col-span-5 flex items-center justify-center">
              <div className="relative w-full max-w-[380px] aspect-[4/3] flex items-center justify-center">
                {image ? (
                  <img
                    src={image}
                    alt={typeof title === "string" ? title : "Nestro Hero Product"}
                    className="w-full h-full object-contain drop-shadow-[0_15px_35px_rgba(0,0,0,0.4)] transform hover:scale-105 transition-transform duration-700 ease-out animate-float"
                  />
                ) : (
                  illustration
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
