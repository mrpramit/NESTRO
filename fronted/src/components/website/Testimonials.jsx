"use client";

import React from "react";

export default function Testimonials() {
  const reviews = [
    {
      _id: "rev-1",
      name: "Priya Rao",
      location: "Mumbai",
      initials: "PR",
      stars: 5,
      quote: "The Ember Velvet sofa is absolutely stunning. Delivery was flawless and the quality is beyond what I expected."
    },
    {
      _id: "rev-2",
      name: "Arjun Sharma",
      location: "Bangalore",
      initials: "AS",
      stars: 5,
      quote: "Nestro transformed our living room. Every piece feels like it belongs — timeless and beautifully crafted."
    },
    {
      _id: "rev-3",
      name: "Neha Kapoor",
      location: "Delhi",
      initials: "NK",
      stars: 5,
      quote: "Premium quality at a fair price. The travertine side table is a conversation starter every time."
    }
  ];

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-12">
      {/* Title Header */}
      <div className="space-y-1 mb-10 text-left">
        <span className="text-[10px] md:text-xs font-bold tracking-[0.2em] text-[#8C6239] uppercase block">
          What Our Customers Say
        </span>
        <h2 className="text-2xl md:text-3xl font-bold text-[#281C19] tracking-tight">
          Loved by 12,000+ homes
        </h2>
      </div>

      {/* Testimonial Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {reviews.map((rev) => (
          <div
            key={rev._id}
            className="bg-white border border-[#EFE8DF] rounded-2xl p-6 md:p-8 flex flex-col justify-between hover:shadow-xl hover:shadow-[#8C6239]/5 hover:border-[#8C6239]/40 hover:-translate-y-1.5 transition-all duration-300 h-full group"
          >
            {/* Stars & Quote */}
            <div>
              {/* Stars */}
              <div className="flex gap-0.5">
                {Array.from({ length: rev.stars }).map((_, idx) => (
                  <span key={idx} className="text-sm text-[#8C6239]">
                    ★
                  </span>
                ))}
              </div>
              
              {/* Quote Text */}
              <p className="text-sm leading-relaxed text-[#281C19] italic mt-4 mb-6">
                "{rev.quote}"
              </p>
            </div>

            {/* Author Profile */}
            <div className="flex items-center gap-3 pt-4 border-t border-[#EFE8DF]/50 mt-auto">
              <div className="w-9 h-9 rounded-full bg-[#FAF7F2] text-[#8C6239] font-bold text-xs flex items-center justify-center flex-shrink-0 group-hover:bg-[#F3ECE4] group-hover:scale-110 transition-all duration-300 border border-[#EFE8DF]/40">
                {rev.initials}
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-bold text-[#281C19]">
                  {rev.name}
                </span>
                <span className="text-[10px] text-[#8A7973]">
                  {rev.location}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
