"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { fetchCategories, fetchProducts } from "@/utils/api";

// Helper to get matching SVG icons for each category type
const getCategoryIcon = (name) => {
  const lowerName = name.toLowerCase();

  if (lowerName.includes("sofa")) {
    return (
      <svg className="w-8 h-8 text-[#8C6239] transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 9h16v6a2 2 0 01-2 2H6a2 2 0 01-2-2V9z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M2 9a2 2 0 012-2h16a2 2 0 012 2v2a2 2 0 01-2 2H4a2 2 0 01-2-2V9z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 9V5a2 2 0 012-2h8a2 2 0 012 2v4" />
      </svg>
    );
  }
  if (lowerName.includes("bed") || lowerName.includes("mattress")) {
    return (
      <svg className="w-8 h-8 text-[#8C6239] transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 7v11M21 7v11M3 14h18M3 10h18M6 10v4M18 10v4" />
      </svg>
    );
  }
  if (lowerName.includes("table")) {
    return (
      <svg className="w-8 h-8 text-[#8C6239] transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 8h18M5 8v11M19 8v11M12 8v11" />
      </svg>
    );
  }
  if (lowerName.includes("chair")) {
    return (
      <svg className="w-8 h-8 text-[#8C6239] transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 4h12a2 2 0 012 2v8a2 2 0 01-2 2H6a2 2 0 01-2-2V6a2 2 0 012-2zM6 16v5M18 16v5M4 10h16" />
      </svg>
    );
  }
  if (
    lowerName.includes("storage") ||
    lowerName.includes("cabinet") ||
    lowerName.includes("wardrobe") ||
    lowerName.includes("bookshelf") ||
    lowerName.includes("unit")
  ) {
    return (
      <svg className="w-8 h-8 text-[#8C6239] transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
        <rect x="5" y="3" width="14" height="18" rx="2" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 9h14M5 15h14M10 6h4M10 12h4M10 18h4" />
      </svg>
    );
  }
  if (lowerName.includes("light") || lowerName.includes("lamp")) {
    return (
      <svg className="w-8 h-8 text-[#8C6239] transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v12M8 15h8M9 9h6M6 15h12l-3-6H9l-3 6zM9 21h6" />
      </svg>
    );
  }
  if (lowerName.includes("decor") || lowerName.includes("plant") || lowerName.includes("mirror")) {
    return (
      <svg className="w-8 h-8 text-[#8C6239] transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 10V3M12 10a4 4 0 014 4v3H8v-3a4 4 0 014-4zM6 21h12M9 21v-4M15 21v-4" />
      </svg>
    );
  }

  // Fallback Category icon
  return (
    <svg className="w-8 h-8 text-[#8C6239] transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
      <rect x="3" y="3" width="7" height="7" rx="1" />
      <rect x="14" y="3" width="7" height="7" rx="1" />
      <rect x="14" y="14" width="7" height="7" rx="1" />
      <rect x="3" y="14" width="7" height="7" rx="1" />
    </svg>
  );
};

export default function Categories() {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const scrollRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [isHovered, setIsHovered] = useState(false);

  // Check if the element can scroll left or right
  const checkScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setCanScrollLeft(scrollLeft > 5);
      setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 5);
    }
  };

  useEffect(() => {
    const el = scrollRef.current;
    if (el) {
      el.addEventListener("scroll", checkScroll);
      // Run initially and on resize
      checkScroll();
      window.addEventListener("resize", checkScroll);
    }
    return () => {
      if (el) el.removeEventListener("scroll", checkScroll);
      window.removeEventListener("resize", checkScroll);
    };
  }, [categories, products]);

  // Load categories and products
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const catRes = await fetchCategories();
        const prodRes = await fetchProducts();
        
        if (catRes.success) {
          // Filter to active categories
          const activeCats = catRes.data.filter((c) => c.status !== false);
          setCategories(activeCats);
        }
        
        if (prodRes.success) {
          setProducts(prodRes.data);
        }
      } catch (error) {
        console.error("Error loading categories:", error);
      } finally {
        setLoading(false);
      }
    };
    loadCategories();
  }, []);

  // Auto-slide effect, pauses on hover, wraps around at the end
  useEffect(() => {
    if (loading || categories.length === 0) return;

    const interval = setInterval(() => {
      if (!isHovered && scrollRef.current) {
        const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
        
        // Wrap back to start if at the end
        if (scrollLeft + clientWidth >= scrollWidth - 10) {
          scrollRef.current.scrollTo({ left: 0, behavior: "smooth" });
        } else {
          // Slide right by a single card width (including gap)
          const cardWidth = window.innerWidth < 640 ? 135 + 16 : 150 + 20;
          scrollRef.current.scrollBy({ left: cardWidth, behavior: "smooth" });
        }
      }
    }, 3000); // Slide every 3 seconds

    return () => clearInterval(interval);
  }, [isHovered, categories, loading]);

  // Scroll logic
  const handleScroll = (direction) => {
    if (scrollRef.current) {
      const { clientWidth } = scrollRef.current;
      const scrollAmount = clientWidth * 0.75;
      scrollRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  // Calculate product counts per category, fallback to mock ranges if 0
  const getProductCount = (category) => {
    const count = products.filter((p) => p.categoryId === category._id).length;
    if (count > 0) return count;

    // Premium fallback mockup counts
    const fallbackCounts = {
      sofas: 42,
      beds: 31,
      dining: 28,
      chairs: 56,
      cabinets: 19,
      lighting: 37,
      decor: 64,
    };
    return fallbackCounts[category.slug] || 15 + (category.name.charCodeAt(0) % 30);
  };

  if (loading) {
    return (
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex items-center justify-center gap-2 py-10">
          <div className="w-5 h-5 border-2 border-[#8C6239] border-t-transparent rounded-full animate-spin" />
          <span className="text-sm font-medium text-[#8A7973]">Loading categories...</span>
        </div>
      </section>
    );
  }

  return (
    <section 
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-10 relative group"
    >
      
      {/* Sleek Carousel Header Row (optional descriptive title or spacer) */}
      <div className="flex items-center justify-between mb-4 px-1">
        <h2 className="text-lg font-bold text-[#281C19] tracking-wide">Shop by Category</h2>
        
        {/* Navigation Buttons on top right (slick style) */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleScroll("left")}
            disabled={!canScrollLeft}
            className={`w-8 h-8 rounded-full border flex items-center justify-center transition-all duration-300 ${
              canScrollLeft
                ? "bg-white border-[#EFE8DF] text-[#8C6239] hover:bg-[#FAF7F2] hover:border-[#8C6239] shadow-sm cursor-pointer"
                : "bg-gray-100/50 border-gray-200 text-gray-400 cursor-not-allowed opacity-50"
            }`}
            aria-label="Previous categories"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>
          
          <button
            onClick={() => handleScroll("right")}
            disabled={!canScrollRight}
            className={`w-8 h-8 rounded-full border flex items-center justify-center transition-all duration-300 ${
              canScrollRight
                ? "bg-white border-[#EFE8DF] text-[#8C6239] hover:bg-[#FAF7F2] hover:border-[#8C6239] shadow-sm cursor-pointer"
                : "bg-gray-100/50 border-gray-200 text-gray-400 cursor-not-allowed opacity-50"
            }`}
            aria-label="Next categories"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>
        </div>
      </div>

      {/* Horizontal Scrollable Slider Container */}
      <div
        ref={scrollRef}
        className="flex items-center gap-4 md:gap-5 overflow-x-auto no-scrollbar pb-4 scroll-smooth"
      >
        {categories.map((category) => {
          const count = getProductCount(category);
          return (
            <Link
              key={category._id}
              href={`/store?category=${category.slug}`}
              className="bg-white border border-[#EFE8DF] rounded-[18px] p-5 flex flex-col items-center justify-center text-center gap-3 transition-all duration-300 hover:shadow-lg hover:shadow-[#8C6239]/5 hover:border-[#8C6239] hover:-translate-y-1.5 cursor-pointer min-w-[135px] sm:min-w-[150px] w-[135px] sm:w-[150px] flex-shrink-0 group"
            >
              {/* Category Icon Container */}
              <div className="w-12 h-12 flex items-center justify-center rounded-full bg-[#FAF7F2] group-hover:bg-[#F3ECE4] transition-colors duration-300">
                {getCategoryIcon(category.name)}
              </div>
              
              {/* Category Texts */}
              <div className="space-y-0.5">
                <h3 className="text-xs sm:text-sm font-bold text-[#281C19] group-hover:text-[#8C6239] transition-colors tracking-wide truncate max-w-[120px]">
                  {category.name}
                </h3>
                <p className="text-[10px] sm:text-xs text-[#8A7973]">
                  {count} pieces
                </p>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
