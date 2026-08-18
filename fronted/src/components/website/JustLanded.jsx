"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { fetchProducts } from "@/utils/api";

// Custom vector graphics matching the mockup illustrations
const JustLandedIllustration = ({ type = "" }) => {
  if (type === "wardrobe") {
    return (
      <svg className="w-12 h-12 text-[#8C6239]/80" fill="currentColor" viewBox="0 0 60 70">
        <rect x="10" y="5" width="40" height="60" rx="4" fill="none" stroke="#8C6239" strokeWidth="4" />
        <line x1="30" y1="5" x2="30" y2="65" stroke="#8C6239" strokeWidth="3" />
        <circle cx="25" cy="35" r="2.5" fill="#8C6239" />
        <circle cx="35" cy="35" r="2.5" fill="#8C6239" />
      </svg>
    );
  }
  if (type === "tv-console") {
    return (
      <svg className="w-14 h-8 text-[#8C6239]/80" fill="currentColor" viewBox="0 0 80 40">
        <rect x="5" y="10" width="70" height="22" rx="3" fill="none" stroke="#8C6239" strokeWidth="4" />
        <line x1="28" y1="10" x2="28" y2="32" stroke="#8C6239" strokeWidth="3" />
        <line x1="52" y1="10" x2="52" y2="32" stroke="#8C6239" strokeWidth="3" />
        <circle cx="62" cy="21" r="2" fill="#8C6239" />
        <line x1="15" y1="32" x2="10" y2="38" stroke="#8C6239" strokeWidth="4" strokeLinecap="round" />
        <line x1="65" y1="32" x2="70" y2="38" stroke="#8C6239" strokeWidth="4" strokeLinecap="round" />
      </svg>
    );
  }
  return null;
};

export default function JustLanded() {
  const [newArrivals, setNewArrivals] = useState([]);
  const [loading, setLoading] = useState(true);

  // Mocked products matching the mockup exactly if no DB items
  const MOCK_NEW_ARRIVALS = [
    {
      _id: "mock-na-1",
      name: "Linen Wardrobe",
      categoryId: { name: "Bedroom" },
      salePrice: 118000,
      rating: 5,
      slug: "linen-wardrobe",
      illustration: "wardrobe"
    },
    {
      _id: "mock-na-2",
      name: "Walnut TV Console",
      categoryId: { name: "Media" },
      salePrice: 67000,
      rating: 4,
      slug: "walnut-tv-console",
      illustration: "tv-console"
    }
  ];

  useEffect(() => {
    const getNewArrivals = async () => {
      try {
        const response = await fetchProducts({ newArrival: true, limit: 2 });
        if (response.success && response.data.length >= 2) {
          setNewArrivals(response.data);
        } else {
          setNewArrivals(MOCK_NEW_ARRIVALS);
        }
      } catch (error) {
        console.error("Error fetching new arrivals:", error);
        setNewOriginal(MOCK_NEW_ARRIVALS);
      } finally {
        setLoading(false);
      }
    };
    getNewArrivals();
  }, []);

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-10">
      
      {/* Header Row */}
      <div className="flex items-end justify-between mb-6">
        <div className="space-y-0.5">
          <span className="text-[10px] md:text-xs font-bold tracking-[0.2em] text-[#8C6239] uppercase block">
            New Arrivals
          </span>
          <h2 className="text-2xl md:text-3xl font-bold text-[#281C19] tracking-tight">
            Just Landed
          </h2>
        </div>
        <Link
          href="/store?filter=newArrival"
          className="text-xs md:text-sm font-semibold text-[#8A7973] hover:text-[#8C6239] underline transition-colors duration-200"
        >
          View all
        </Link>
      </div>

      {/* Grid Layout with fixed height on desktop for perfect alignments */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5 lg:h-[420px]">
        
        {/* Left Column - Large Featured Product Card */}
        <div className="lg:col-span-2 bg-[#281C19] border border-transparent hover:border-[#8C6239]/50 rounded-[20px] p-6 relative flex flex-col justify-between overflow-hidden shadow-sm hover:shadow-xl hover:shadow-[#8C6239]/10 transition-all duration-300 group h-full min-h-[300px] lg:min-h-0">
          {/* Ambient Glow */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-[#8C6239]/5 rounded-full blur-[80px] pointer-events-none" />

          {/* Texts */}
          <div className="space-y-3 relative z-10 max-w-xs md:max-w-md">
            <span className="text-[10px] font-bold tracking-[0.25em] text-[#C4A484] uppercase block">
              Featured
            </span>
            <h3 className="text-xl md:text-2xl lg:text-3xl font-bold text-[#FAF7F2] tracking-tight leading-[1.2]">
              Scandinavian <br /> Dining Set
            </h3>
            <p className="text-[#BCAEA5] text-xs leading-relaxed">
              Ash wood + linen chairs. Set of 4.
            </p>
            <span className="text-sm md:text-base font-bold text-[#FAF7F2] block">
              ₹1,24,000
            </span>
          </div>

          {/* Bottom Left Button */}
          <div className="relative z-10 mt-4">
            <Link
              href="/store/scandinavian-dining-set"
              className="bg-[#8C6239] text-[#FAF7F2] hover:bg-[#724E2B] transition-all duration-300 px-4.5 py-2 rounded-md text-xs font-semibold inline-block shadow-sm hover:scale-105 hover:shadow-lg hover:shadow-[#8C6239]/20"
            >
              View in Store
            </Link>
          </div>

          {/* Product Image on the right */}
          <div className="absolute bottom-3 right-3 w-40 h-28 sm:w-48 sm:h-36 lg:w-56 lg:h-44 flex items-center justify-center pointer-events-none z-10">
            <img
              src="/dining-set.png"
              alt="Scandinavian Dining Set"
              className="max-w-full max-h-full object-contain drop-shadow-[0_12px_30px_rgba(0,0,0,0.55)] transform group-hover:scale-108 group-hover:-rotate-2 transition-transform duration-500 ease-out"
            />
          </div>
        </div>

        {/* Middle Column - Stacked Small Cards (Dynamic height grids) */}
        <div className="lg:col-span-1 grid grid-rows-2 gap-4 h-full">
          {newArrivals.map((product, idx) => {
            const ratingStars = product.rating || (idx === 0 ? 5 : 4);
            return (
              <Link
                key={product._id}
                href={`/store/${product.slug}`}
                className="bg-white border border-[#EFE8DF] rounded-[18px] overflow-hidden hover:shadow-lg hover:shadow-[#8C6239]/5 hover:border-[#8C6239]/50 hover:-translate-y-1 transition-all duration-300 flex flex-col group h-full"
              >
                {/* Visual Area */}
                <div className="h-32 sm:h-36 md:h-40 lg:h-32 bg-[#FAF7F2] flex items-center justify-center relative overflow-hidden flex-shrink-0">
                  {product.thumbnail && product.thumbnail.startsWith("http") ? (
                    <img
                      src={product.thumbnail}
                      alt={product.name}
                      className="w-full h-full object-cover transform group-hover:scale-108 transition-transform duration-500 ease-out"
                    />
                  ) : (
                    <div className="p-4 transform group-hover:scale-110 group-hover:rotate-3 transition-transform duration-500 ease-out">
                      <JustLandedIllustration type={product.illustration || (idx === 0 ? "wardrobe" : "tv-console")} />
                    </div>
                  )}
                </div>

                {/* Text Area */}
                <div className="p-3 flex flex-col justify-between flex-1 gap-1">
                  <div>
                    <span className="text-[8px] font-bold text-[#8A7973] tracking-widest uppercase">
                      {product.categoryId?.name || "Bedroom"}
                    </span>
                    <h4 className="text-[11px] font-bold text-[#281C19] group-hover:text-[#8C6239] transition-colors mt-0.5 line-clamp-1">
                      {product.name}
                    </h4>
                  </div>

                  <div className="flex items-center justify-between mt-1">
                    {/* Stars */}
                    <div className="flex gap-0.5">
                      {Array.from({ length: 5 }).map((_, starIdx) => (
                        <span
                          key={starIdx}
                          className={`text-[10px] ${
                            starIdx < ratingStars ? "text-[#8C6239]" : "text-gray-200"
                          }`}
                        >
                          ★
                        </span>
                      ))}
                    </div>
                    {/* Price */}
                    <span className="text-[11px] font-extrabold text-[#281C19]">
                      ₹{product.salePrice?.toLocaleString("en-IN")}
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        {/* Right Column - Stacked Promo Banners */}
        <div className="lg:col-span-1 grid grid-rows-2 gap-4 h-full">
          
          {/* Banner A - Promo Offer */}
          <div className="bg-[#FAF7F2] border border-[#EFE8DF] rounded-[18px] p-4.5 flex flex-col justify-between h-full shadow-sm hover:shadow-md hover:border-[#8C6239]/30 hover:-translate-y-0.5 transition-all duration-300 group/promo">
            <div className="space-y-0.5">
              <span className="text-[8px] font-bold text-[#8C6239] tracking-widest uppercase block">
                Offer
              </span>
              <h4 className="text-xs font-bold text-[#281C19] leading-snug">
                First order 15% off
              </h4>
              <p className="text-[10px] text-[#8A7973] leading-relaxed">
                Use code Nestro15 at checkout
              </p>
            </div>
            <Link
              href="/store"
              className="bg-[#8C6239] text-[#FAF7F2] hover:bg-[#724E2B] transition-all duration-200 text-[9px] font-bold px-3 py-1.5 rounded self-start mt-2 hover:scale-105 shadow-sm"
            >
              Shop Now
            </Link>
          </div>

          {/* Banner B - Delivery Info */}
          <div className="bg-white border border-[#EFE8DF] rounded-[18px] p-4.5 flex flex-col justify-between h-full shadow-sm hover:shadow-md hover:border-[#8C6239]/30 hover:-translate-y-0.5 transition-all duration-300 group/promo">
            <div className="space-y-0.5">
              <span className="text-[8px] font-bold text-[#8C6239] tracking-widest uppercase block">
                Free Delivery
              </span>
              <h4 className="text-xs font-bold text-[#281C19] leading-snug">
                On orders above ₹50,000
              </h4>
              <p className="text-[10px] text-[#8A7973] leading-relaxed">
                White glove service. Assembly included.
              </p>
            </div>
            
            {/* Delivery truck icon */}
            <div className="mt-2 flex transform group-hover/promo:translate-x-2 transition-transform duration-500 ease-out">
              <svg className="w-4.5 h-4.5 text-[#8C6239]" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.75a1.125 1.125 0 01-1.125-1.125V9.75c0-.621.504-1.125 1.125-1.125h9.75c.621 0 1.125.504 1.125 1.125v5.625c0 .621-.504 1.125-1.125 1.125H8.25zM19.5 10.5h.375c.621 0 1.125.504 1.125 1.125v3.375c0 .621-.504 1.125-1.125 1.125h-.375M16.5 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h3.75a1.125 1.125 0 001.125-1.125V13.5h-4.875v5.25z" />
              </svg>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
