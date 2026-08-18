"use client";

import React, { useState } from "react";

export default function NewsletterBanner() {
  const [email, setEmail] = useState("");
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email) {
      // Simulate API call/subscription
      setIsSubscribed(true);
      setEmail("");
      setTimeout(() => {
        setIsSubscribed(false);
      }, 5000);
    }
  };

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8">
      <div className="bg-[#281C19] rounded-[20px] px-6 py-10 md:py-12 md:px-16 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
        {/* Left Content */}
        <div className="space-y-2">
          <span className="text-[10px] md:text-xs font-bold tracking-[0.2em] text-[#8C6239] uppercase block">
            STAY IN THE LOOP
          </span>
          <h3 className="text-2xl md:text-3xl font-bold text-[#FAF7F2] tracking-tight">
            Design tips & new arrivals
          </h3>
          <p className="text-sm text-[#BCAEA5] leading-relaxed">
            Join 8,000 subscribers who get exclusive first looks.
          </p>
        </div>

        {/* Right Form */}
        <div className="flex flex-col w-full lg:w-auto max-w-md gap-2.5">
          {isSubscribed ? (
            <div className="bg-[#8C6239]/15 border border-[#8C6239] text-[#FAF7F2] px-4 py-3 rounded-lg text-sm text-center">
              Thank you for subscribing! Check your inbox soon.
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex w-full">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Your email address"
                className="bg-[#1F1412]/60 border border-[#42322E] text-[#FAF7F2] placeholder-[#8A7973] px-4 py-3 rounded-l-md text-sm focus:outline-none focus:border-[#8C6239] flex-1 min-w-0 transition-colors"
              />
              <button
                type="submit"
                className="bg-[#8C6239] text-[#FAF7F2] font-semibold px-6 py-3 rounded-r-md text-sm hover:bg-[#724E2B] transition-colors whitespace-nowrap"
              >
                Subscribe
              </button>
            </form>
          )}
          <p className="text-xs text-[#8A7973] text-right">
            No spam. Unsubscribe anytime.
          </p>
        </div>
      </div>
    </section>
  );
}
