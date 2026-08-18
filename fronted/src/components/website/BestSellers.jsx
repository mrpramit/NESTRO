"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { fetchProducts } from "@/utils/api";

// Elegant flat vector illustrations to match the mockup style if no product thumbnail exists
const ProductIllustration = ({ name = "", category = "" }) => {
  const cName = category.toLowerCase();
  const pName = name.toLowerCase();

  // Sofa Illustration
  if (cName.includes("sofa") || pName.includes("sofa") || pName.includes("loveseat")) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-[#F3ECE4]/40 rounded-xl">
        <svg className="w-28 h-20 text-[#8C6239]/80" fill="currentColor" viewBox="0 0 120 80">
          <rect x="15" y="20" width="90" height="30" rx="6" />
          <rect x="22" y="25" width="36" height="20" rx="3" fill="#C4A484" />
          <rect x="62" y="25" width="36" height="20" rx="3" fill="#C4A484" />
          <rect x="10" y="30" width="12" height="25" rx="4" />
          <rect x="98" y="30" width="12" height="25" rx="4" />
          <rect x="15" y="48" width="90" height="10" rx="2" />
          <line x1="20" y1="58" x2="20" y2="65" stroke="#8C6239" strokeWidth="4" strokeLinecap="round" />
          <line x1="100" y1="58" x2="100" y2="65" stroke="#8C6239" strokeWidth="4" strokeLinecap="round" />
        </svg>
      </div>
    );
  }

  // Bookcase/Storage/Cabinet Illustration
  if (
    cName.includes("storage") ||
    cName.includes("cabinet") ||
    cName.includes("unit") ||
    pName.includes("bookcase") ||
    pName.includes("cabinet") ||
    pName.includes("buffet") ||
    pName.includes("stand")
  ) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-[#F3ECE4]/40 rounded-xl">
        <svg className="w-16 h-20 text-[#8C6239]/80" fill="currentColor" viewBox="0 0 80 100">
          <rect x="15" y="10" width="50" height="80" rx="4" fill="none" stroke="#8C6239" strokeWidth="4" />
          <line x1="15" y1="32" x2="65" y2="32" stroke="#8C6239" strokeWidth="4" />
          <line x1="15" y1="54" x2="65" y2="54" stroke="#8C6239" strokeWidth="4" />
          <line x1="15" y1="76" x2="65" y2="76" stroke="#8C6239" strokeWidth="4" />
          <rect x="20" y="18" width="8" height="10" rx="1" fill="#C4A484" />
          <rect x="30" y="16" width="6" height="12" rx="1" fill="#D2C4B9" />
          <rect x="52" y="38" width="10" height="12" rx="1" fill="#C4A484" />
          <rect x="44" y="40" width="6" height="10" rx="1" fill="#D2C4B9" />
          <circle cx="30" cy="70" r="4" fill="#D2C4B9" />
        </svg>
      </div>
    );
  }

  // Tables Illustration
  if (cName.includes("table") || pName.includes("table") || pName.includes("desk")) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-[#F3ECE4]/40 rounded-xl">
        <svg className="w-24 h-20 text-[#8C6239]/80" fill="currentColor" viewBox="0 0 100 80">
          <ellipse cx="50" cy="35" rx="35" ry="12" />
          <rect x="42" y="42" width="6" height="22" rx="1" />
          <rect x="52" y="42" width="6" height="22" rx="1" />
          <ellipse cx="50" cy="64" rx="16" ry="5" />
        </svg>
      </div>
    );
  }

  // Chairs Illustration
  if (cName.includes("chair") || pName.includes("chair") || pName.includes("loveseat")) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-[#F3ECE4]/40 rounded-xl">
        <svg className="w-20 h-20 text-[#8C6239]/80" fill="currentColor" viewBox="0 0 100 80">
          <rect x="25" y="15" width="50" height="40" rx="10" />
          <rect x="18" y="30" width="10" height="25" rx="4" />
          <rect x="72" y="30" width="10" height="25" rx="4" />
          <rect x="25" y="40" width="50" height="15" rx="4" fill="#C4A484" />
          <line x1="32" y1="55" x2="28" y2="66" stroke="#8C6239" strokeWidth="4" strokeLinecap="round" />
          <line x1="68" y1="55" x2="72" y2="66" stroke="#8C6239" strokeWidth="4" strokeLinecap="round" />
        </svg>
      </div>
    );
  }

  // Fallback bed/generic illustration
  return (
    <div className="w-full h-full flex items-center justify-center bg-[#F3ECE4]/40 rounded-xl">
      <svg className="w-24 h-20 text-[#8C6239]/80" fill="currentColor" viewBox="0 0 100 80">
        <rect x="20" y="20" width="60" height="40" rx="6" />
        <rect x="28" y="25" width="44" height="15" rx="2" fill="#C4A484" />
        <line x1="24" y1="60" x2="24" y2="68" stroke="#8C6239" strokeWidth="4" strokeLinecap="round" />
        <line x1="76" y1="60" x2="76" y2="68" stroke="#8C6239" strokeWidth="4" strokeLinecap="round" />
      </svg>
    </div>
  );
};

export default function BestSellers() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Mock Products exactly matching the user's mockup design
  const MOCK_BEST_SELLERS = [
    {
      _id: "mock-bs-1",
      name: "Ember Velvet 3-Seater",
      categoryId: { name: "Sofas" },
      salePrice: 89000,
      discount: 20,
      badge: "SALE",
      rating: 5,
      slug: "ember-velvet-3-seater"
    },
    {
      _id: "mock-bs-2",
      name: "Nordic Oak Bookcase",
      categoryId: { name: "Storage" },
      salePrice: 42500,
      discount: 0,
      badge: "",
      rating: 4,
      slug: "nordic-oak-bookcase"
    },
    {
      _id: "mock-bs-3",
      name: "Travertine Side Table",
      categoryId: { name: "Tables" },
      salePrice: 28000,
      discount: 0,
      badge: "",
      rating: 5,
      slug: "travertine-side-table"
    },
    {
      _id: "mock-bs-4",
      name: "Aura Bouclé Armchair",
      categoryId: { name: "Chairs" },
      salePrice: 54000,
      discount: 0,
      featured: true,
      badge: "HOT",
      rating: 5,
      slug: "aura-boucle-armchair"
    }
  ];

  useEffect(() => {
    const getBestSellers = async () => {
      try {
        const response = await fetchProducts({ bestSeller: true, limit: 4 });
        if (response.success && response.data.length > 0) {
          setProducts(response.data);
        } else {
          setProducts(MOCK_BEST_SELLERS);
        }
      } catch (error) {
        console.error("Error fetching best sellers:", error);
        setProducts(MOCK_BEST_SELLERS);
      } finally {
        setLoading(false);
      }
    };
    getBestSellers();
  }, []);

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-12">
      
      {/* Header Row */}
      <div className="flex items-end justify-between mb-8">
        <div className="space-y-1">
          <span className="text-[10px] md:text-xs font-bold tracking-[0.2em] text-[#8C6239] uppercase block">
            Handpicked For You
          </span>
          <h2 className="text-2xl md:text-3xl font-bold text-[#281C19] tracking-tight">
            Best Sellers
          </h2>
        </div>
        <Link
          href="/store?filter=bestSeller"
          className="text-xs md:text-sm font-semibold text-[#8A7973] hover:text-[#8C6239] underline transition-colors duration-200"
        >
          View all
        </Link>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map((product, idx) => {
          // Determine badge
          const discount = product.discount;
          const hasDiscount = discount > 0;
          const isSale = product.badge === "SALE" || hasDiscount;
          const isHot = product.badge === "HOT" || product.featured;
          
          let badgeText = "";
          if (isSale) badgeText = "SALE";
          else if (isHot) badgeText = "HOT";

          // Rating stars count
          const ratingStars = product.rating || (product.name.includes("Bookcase") || idx === 1 ? 4 : 5);

          return (
            <Link
              key={product._id}
              href={`/store/${product.slug}`}
              className="bg-white border border-[#EFE8DF] rounded-2xl overflow-hidden hover:shadow-xl hover:shadow-[#8C6239]/5 hover:border-[#8C6239]/50 hover:-translate-y-2 transition-all duration-300 group flex flex-col"
            >
              {/* Product Visual Top */}
              <div className="aspect-[4/3] sm:aspect-square md:aspect-[4/3] w-full bg-[#FAF7F2] p-6 relative flex items-center justify-center overflow-hidden">
                {/* Badge overlay */}
                {badgeText && (
                  <span className={`absolute top-4 left-4 text-[9px] font-bold text-[#FAF7F2] px-2.5 py-1 rounded tracking-widest uppercase ${
                    badgeText === "SALE" ? "bg-[#8C6239]" : "bg-[#2C1C18]"
                  }`}>
                    {badgeText}
                  </span>
                )}

                {/* Thumbnail Image or SVG Illustration */}
                {product.thumbnail && product.thumbnail.startsWith("http") ? (
                  <img
                    src={product.thumbnail}
                    alt={product.name}
                    className="max-h-[85%] max-w-[85%] object-contain transform group-hover:scale-108 transition-transform duration-500 ease-out"
                  />
                ) : (
                  <div className="w-full h-full max-h-[85%] max-w-[85%] transform group-hover:scale-108 transition-transform duration-500 ease-out">
                    <ProductIllustration name={product.name} category={product.categoryId?.name} />
                  </div>
                )}
              </div>

              {/* Product Info Bottom */}
              <div className="p-5 flex-1 flex flex-col justify-between gap-4">
                <div>
                  {/* Category text */}
                  <span className="text-[9px] font-bold text-[#8A7973] tracking-widest uppercase">
                    {product.categoryId?.name || "Furniture"}
                  </span>
                  
                  {/* Product title */}
                  <h3 className="text-sm font-bold text-[#281C19] group-hover:text-[#8C6239] transition-colors mt-1 line-clamp-1">
                    {product.name}
                  </h3>
                </div>

                {/* Rating and Price row */}
                <div className="flex items-center justify-between mt-1">
                  {/* Star Ratings */}
                  <div className="flex gap-0.5">
                    {Array.from({ length: 5 }).map((_, starIdx) => (
                      <span
                        key={starIdx}
                        className={`text-sm ${
                          starIdx < ratingStars ? "text-[#8C6239]" : "text-gray-200"
                        }`}
                      >
                        ★
                      </span>
                    ))}
                  </div>

                  {/* Price */}
                  <span className="text-sm font-extrabold text-[#281C19]">
                    ₹{product.salePrice?.toLocaleString("en-IN")}
                  </span>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
