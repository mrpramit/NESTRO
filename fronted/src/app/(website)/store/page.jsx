"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import Hero from "@/components/common/Hero";
import { fetchCategories, fetchProducts, fetchRooms } from "@/utils/api";
import ProductCard from "@/components/website/ProductCard";
import { MOCK_PRODUCTS, colorSwatches, materialsList, roomFallback } from "@/utils/mockData";

function StoreContent() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Filters State
  const [rooms, setRooms] = useState([]);
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Active filter bindings
  const [selectedRooms, setSelectedRooms] = useState([]);
  const [selectedMaterials, setSelectedMaterials] = useState([]);
  const [selectedColors, setSelectedColors] = useState([]);
  const [selectedAvailability, setSelectedAvailability] = useState([]);
  const [selectedRating, setSelectedRating] = useState(null);
  
  const [minPrice, setMinPrice] = useState("8000");
  const [maxPrice, setMaxPrice] = useState("250000");
  const [sortBy, setSortBy] = useState("default");
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 15;

  // Read URL Category on load
  useEffect(() => {
    const catQuery = searchParams.get("category");
    if (catQuery && catQuery !== "all") {
      // Find matching category name
      const matched = categories.find(c => c.slug === catQuery);
      if (matched) {
        setSelectedRooms([matched.name]);
      } else {
        // Fallback to formatted title
        const formatted = catQuery.replace("-", " ");
        const firstLetterCap = formatted.charAt(0).toUpperCase() + formatted.slice(1);
        setSelectedRooms([firstLetterCap]);
      }
    }
  }, [searchParams, categories]);

  // Load backend categories and products
  useEffect(() => {
    const loadStoreData = async () => {
      try {
        const catRes = await fetchCategories();
        const prodRes = await fetchProducts();
        const roomRes = await fetchRooms();

        if (catRes.success) {
          setCategories(catRes.data.filter((c) => c.status !== false));
        }
        
        if (roomRes.success && roomRes.data.length > 0) {
          setRooms(roomRes.data);
        }

        if (prodRes.success && prodRes.data.length > 0) {
          // Map backend attributes to filter schema
          const mapped = prodRes.data.map(p => ({
            ...p,
            reviewsCount: p.reviewsCount || Math.floor(Math.random() * 80) + 15,
            rating: p.rating || 5,
            material: p.material || (p.name.includes("Velvet") ? "Velvet" : "Solid Wood"),
            color: p.color || "Medium Brown",
          }));
          setProducts(mapped);
        } else {
          setProducts(MOCK_PRODUCTS);
        }
      } catch (error) {
        console.error("Error loading store details:", error);
        setProducts(MOCK_PRODUCTS);
      } finally {
        setLoading(false);
      }
    };
    loadStoreData();
  }, []);

  // Filter application
  useEffect(() => {
    let items = [...products];

    // Filter by Room Type
    if (selectedRooms.length > 0) {
      items = items.filter(p => 
        selectedRooms.some(r => 
          (p.roomId?.name && p.roomId.name.toLowerCase().includes(r.toLowerCase())) ||
          (p.categoryId?.name && p.categoryId.name.toLowerCase().includes(r.toLowerCase()))
        )
      );
    }

    // Filter by Material
    if (selectedMaterials.length > 0) {
      items = items.filter(p => p.material && selectedMaterials.includes(p.material));
    }

    // Filter by Color
    if (selectedColors.length > 0) {
      items = items.filter(p => p.color && selectedColors.includes(p.color));
    }

    // Filter by Availability
    if (selectedAvailability.length > 0) {
      items = items.filter(p => {
        const availabilityStr = p.stock ? "In Stock" : "Made to Order";
        return selectedAvailability.includes(availabilityStr);
      });
    }

    // Filter by Rating
    if (selectedRating !== null) {
      items = items.filter(p => (p.rating || 5) >= selectedRating);
    }

    // Filter by Price Range
    const min = parseFloat(minPrice) || 0;
    const max = parseFloat(maxPrice) || 99999999;
    items = items.filter(p => p.salePrice >= min && p.salePrice <= max);

    // Sorting
    if (sortBy === "price-asc") {
      items.sort((a, b) => a.salePrice - b.salePrice);
    } else if (sortBy === "price-desc") {
      items.sort((a, b) => b.salePrice - a.salePrice);
    } else if (sortBy === "rating") {
      items.sort((a, b) => (b.rating || 5) - (a.rating || 5));
    }

    setFilteredProducts(items);
    setCurrentPage(1); // Reset page offset on filter change
  }, [products, selectedRooms, selectedMaterials, selectedColors, selectedAvailability, selectedRating, minPrice, maxPrice, sortBy]);

  // Handle checkboxes
  const handleCheckboxToggle = (value, list, setList) => {
    if (list.includes(value)) {
      setList(list.filter(item => item !== value));
    } else {
      setList([...list, value]);
    }
  };

  // Clear specific badges
  const handleRemoveFilter = (type, val) => {
    if (type === "room") setSelectedRooms(selectedRooms.filter(r => r !== val));
    if (type === "material") setSelectedMaterials(selectedMaterials.filter(m => m !== val));
    if (type === "color") setSelectedColors(selectedColors.filter(c => c !== val));
    if (type === "availability") setSelectedAvailability(selectedAvailability.filter(a => a !== val));
    if (type === "rating") setSelectedRating(null);
  };

  // Calculate product counts dynamically for Room Type sidebar labels
  const getProductCountForRoom = (roomName) => {
    return products.filter(p => 
      (p.roomId?.name && p.roomId.name.toLowerCase().includes(roomName.toLowerCase())) ||
      (p.categoryId?.name && p.categoryId.name.toLowerCase().includes(roomName.toLowerCase()))
    ).length;
  };

  // Pagination indexing
  const indexOfLastProduct = currentPage * itemsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - itemsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage) || 1;

  // Hero custom graphics
  const storeHeroIllustration = (
    <svg
      className="w-72 h-44 text-[#FAF7F2] opacity-85 transform hover:scale-[1.03] transition-transform duration-700 ease-out animate-float"
      viewBox="0 0 200 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect x="20" y="30" width="160" height="40" rx="8" fill="#FAF7F2" fillOpacity="0.08" stroke="#C4A484" strokeWidth="2" strokeOpacity="0.6" />
      <rect x="30" y="40" width="65" height="30" rx="6" fill="#FAF7F2" fillOpacity="0.12" stroke="#C4A484" strokeWidth="1.5" strokeOpacity="0.8" />
      <rect x="105" y="40" width="65" height="30" rx="6" fill="#FAF7F2" fillOpacity="0.12" stroke="#C4A484" strokeWidth="1.5" strokeOpacity="0.8" />
      <rect x="10" y="45" width="20" height="35" rx="6" fill="#FAF7F2" fillOpacity="0.1" stroke="#C4A484" strokeWidth="1.8" strokeOpacity="0.7" />
      <rect x="170" y="45" width="20" height="35" rx="6" fill="#FAF7F2" fillOpacity="0.1" stroke="#C4A484" strokeWidth="1.8" strokeOpacity="0.7" />
      <rect x="20" y="70" width="160" height="12" rx="2" fill="#8C6239" fillOpacity="0.8" />
      <line x1="35" y1="82" x2="35" y2="90" stroke="#8C6239" strokeWidth="4" strokeLinecap="round" />
      <line x1="165" y1="82" x2="165" y2="90" stroke="#8C6239" strokeWidth="4" strokeLinecap="round" />
      <ellipse cx="100" cy="92" rx="75" ry="4" fill="#000000" fillOpacity="0.15" />
    </svg>
  );

  return (
    <>
      {/* Visual store hero banner */}
      <Hero
        tag="NEW COLLECTION — SS 2026"
        title={
          <>
            Modern Living <br />
            <span className="italic font-serif text-[#C4A484] font-normal">Collection</span>
          </>
        }
        description="Timeless furniture crafted for elegant spaces. Designed with intention, built to endure."
        buttons={
          <a
            href="#catalog-layout"
            className="bg-[#8C6239] text-[#FAF7F2] hover:bg-[#724E2B] transition-all duration-300 font-semibold px-6 py-3 rounded text-sm md:text-base flex items-center gap-2 group/btn hover:scale-[1.03] hover:shadow-lg hover:shadow-[#8C6239]/25 cursor-pointer"
          >
            Explore Collection
            <span className="transform group-hover/btn:translate-x-2 transition-transform duration-200">→</span>
          </a>
        }
        illustration={storeHeroIllustration}
      />

      {/* Main filterable store directory */}
      <section id="catalog-layout" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
          
          {/* Left Sidebar Filter panel */}
          <aside className="bg-white border border-[#EFE8DF] rounded-[24px] p-6 space-y-6 shadow-sm sticky top-24 self-start">
            <span className="text-[10px] font-bold text-[#8A7973] uppercase tracking-wider block border-b border-[#EFE8DF]/60 pb-3">
              FILTERS
            </span>

            {/* Room Type checkboxes */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-[#281C19] uppercase tracking-wide">Room Type</h4>
              <div className="space-y-2">
                {roomFallback.map(room => {
                  const count = getProductCountForRoom(room);
                  return (
                    <label key={room} className="flex items-center justify-between text-xs text-[#8A7973] cursor-pointer group">
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={selectedRooms.includes(room)}
                          onChange={() => handleCheckboxToggle(room, selectedRooms, setSelectedRooms)}
                          className="w-3.5 h-3.5 accent-[#8C6239] rounded border-gray-300 cursor-pointer"
                        />
                        <span className="group-hover:text-[#8C6239] transition-colors">{room}</span>
                      </div>
                      <span className="text-[10px] text-gray-400 font-medium">{count}</span>
                    </label>
                  );
                })}
              </div>
            </div>

            <hr className="border-[#EFE8DF]/60" />

            {/* Price Range input boxes */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-[#281C19] uppercase tracking-wide">Price Range</h4>
              <div className="flex items-center gap-2">
                <div className="relative flex-1">
                  <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[10px] font-bold text-[#8A7973]">₹</span>
                  <input
                    type="number"
                    value={minPrice}
                    onChange={(e) => setMinPrice(e.target.value)}
                    placeholder="Min"
                    className="w-full bg-[#FAF7F2]/40 border border-[#EFE8DF] rounded-lg pl-6 pr-2 py-1.5 text-xs text-[#281C19] focus:outline-none focus:border-[#8C6239] transition-all"
                  />
                </div>
                <span className="text-[#8A7973] text-xs font-bold">-</span>
                <div className="relative flex-1">
                  <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[10px] font-bold text-[#8A7973]">₹</span>
                  <input
                    type="number"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(e.target.value)}
                    placeholder="Max"
                    className="w-full bg-[#FAF7F2]/40 border border-[#EFE8DF] rounded-lg pl-6 pr-2 py-1.5 text-xs text-[#281C19] focus:outline-none focus:border-[#8C6239] transition-all"
                  />
                </div>
              </div>
            </div>

            <hr className="border-[#EFE8DF]/60" />

            {/* Material selector */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-[#281C19] uppercase tracking-wide">Material</h4>
              <div className="space-y-2">
                {materialsList.map(mat => (
                  <label key={mat} className="flex items-center gap-2 text-xs text-[#8A7973] cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={selectedMaterials.includes(mat)}
                      onChange={() => handleCheckboxToggle(mat, selectedMaterials, setSelectedMaterials)}
                      className="w-3.5 h-3.5 accent-[#8C6239] rounded border-gray-300 cursor-pointer"
                    />
                    <span className="group-hover:text-[#8C6239] transition-colors">{mat}</span>
                  </label>
                ))}
              </div>
            </div>

            <hr className="border-[#EFE8DF]/60" />

            {/* Color swatches */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-[#281C19] uppercase tracking-wide">Color</h4>
              <div className="flex flex-wrap gap-2.5">
                {colorSwatches.map(color => {
                  const isSelected = selectedColors.includes(color.name);
                  return (
                    <button
                      key={color.name}
                      title={color.name}
                      onClick={() => handleCheckboxToggle(color.name, selectedColors, setSelectedColors)}
                      className={`w-6 h-6 rounded-full border cursor-pointer relative flex items-center justify-center transition-all ${
                        color.borderClass
                      } ${isSelected ? "ring-2 ring-[#8C6239] ring-offset-2 scale-105" : "hover:scale-110"}`}
                      style={{ backgroundColor: color.value }}
                    >
                      {isSelected && (
                        <span className={`text-[10px] font-bold ${
                          color.name.includes("Off-white") ? "text-[#8C6239]" : "text-white"
                        }`}>✓</span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            <hr className="border-[#EFE8DF]/60" />

            {/* Availability */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-[#281C19] uppercase tracking-wide">Availability</h4>
              <div className="space-y-2">
                {["In Stock", "Made to Order"].map(avail => (
                  <label key={avail} className="flex items-center gap-2 text-xs text-[#8A7973] cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={selectedAvailability.includes(avail)}
                      onChange={() => handleCheckboxToggle(avail, selectedAvailability, setSelectedAvailability)}
                      className="w-3.5 h-3.5 accent-[#8C6239] rounded border-gray-300 cursor-pointer"
                    />
                    <span className="group-hover:text-[#8C6239] transition-colors">{avail}</span>
                  </label>
                ))}
              </div>
            </div>

            <hr className="border-[#EFE8DF]/60" />

            {/* Rating stars filter */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-[#281C19] uppercase tracking-wide">Rating</h4>
              <div className="space-y-2">
                {[5, 4].map(stars => (
                  <button
                    key={stars}
                    onClick={() => setSelectedRating(selectedRating === stars ? null : stars)}
                    className={`flex items-center gap-2 text-xs w-full text-left cursor-pointer hover:text-[#8C6239] transition-all ${
                      selectedRating === stars ? "text-[#8C6239] font-bold" : "text-[#8A7973]"
                    }`}
                  >
                    <span className="flex text-sm tracking-tighter">
                      {Array.from({ length: 5 }).map((_, idx) => (
                        <span key={idx} className={idx < stars ? "text-[#8C6239]" : "text-gray-200"}>★</span>
                      ))}
                    </span>
                    <span>& up</span>
                  </button>
                ))}
              </div>
            </div>

          </aside>

          {/* Right Product Grid Area */}
          <div className="lg:col-span-3 space-y-6">
            
            {/* Header row details */}
            <div className="bg-white border border-[#EFE8DF] rounded-[20px] px-6 py-4 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between shadow-sm">
              <div className="text-xs md:text-sm text-[#8A7973]">
                <span className="font-extrabold text-[#281C19]">{filteredProducts.length}</span> products found
              </div>

              {/* Sorting Control */}
              <div className="flex items-center gap-2 self-end sm:self-auto">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="bg-white border border-[#EFE8DF] rounded-xl px-3 py-1.5 text-xs text-[#281C19] focus:outline-none focus:border-[#8C6239]"
                >
                  <option value="default">Sort: Featured</option>
                  <option value="price-asc">Sort: Price Low to High</option>
                  <option value="price-desc">Sort: Price High to Low</option>
                  <option value="rating">Sort: Top Rated</option>
                </select>
              </div>
            </div>

            {/* Active filter badges indicator bar */}
            {(selectedRooms.length > 0 || selectedMaterials.length > 0 || selectedColors.length > 0 || selectedAvailability.length > 0 || selectedRating !== null) && (
              <div className="flex flex-wrap gap-2 items-center">
                <span className="text-[10px] font-bold text-[#8A7973] uppercase tracking-wider mr-1">Active:</span>
                
                {/* Room badges */}
                {selectedRooms.map(r => (
                  <button
                    key={r}
                    onClick={() => handleRemoveFilter("room", r)}
                    className="bg-white border border-[#EFE8DF] hover:border-[#8C6239] rounded-full px-3 py-1 text-[11px] text-[#281C19] font-medium flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
                  >
                    {r} <span className="text-gray-400 hover:text-[#8C6239]">×</span>
                  </button>
                ))}

                {/* Material badges */}
                {selectedMaterials.map(m => (
                  <button
                    key={m}
                    onClick={() => handleRemoveFilter("material", m)}
                    className="bg-white border border-[#EFE8DF] hover:border-[#8C6239] rounded-full px-3 py-1 text-[11px] text-[#281C19] font-medium flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
                  >
                    {m} <span className="text-gray-400 hover:text-[#8C6239]">×</span>
                  </button>
                ))}

                {/* Color badges */}
                {selectedColors.map(c => (
                  <button
                    key={c}
                    onClick={() => handleRemoveFilter("color", c)}
                    className="bg-white border border-[#EFE8DF] hover:border-[#8C6239] rounded-full px-3 py-1 text-[11px] text-[#281C19] font-medium flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
                  >
                    {c} <span className="text-gray-400 hover:text-[#8C6239]">×</span>
                  </button>
                ))}

                {/* Availability badges */}
                {selectedAvailability.map(a => (
                  <button
                    key={a}
                    onClick={() => handleRemoveFilter("availability", a)}
                    className="bg-white border border-[#EFE8DF] hover:border-[#8C6239] rounded-full px-3 py-1 text-[11px] text-[#281C19] font-medium flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
                  >
                    {a} <span className="text-gray-400 hover:text-[#8C6239]">×</span>
                  </button>
                ))}

                {/* Rating badges */}
                {selectedRating !== null && (
                  <button
                    onClick={() => handleRemoveFilter("rating", null)}
                    className="bg-white border border-[#EFE8DF] hover:border-[#8C6239] rounded-full px-3 py-1 text-[11px] text-[#281C19] font-medium flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
                  >
                    {selectedRating}★ & up <span className="text-gray-400 hover:text-[#8C6239]">×</span>
                  </button>
                )}
              </div>
            )}

            {/* Products grid display */}
            {loading ? (
              <div className="flex flex-col items-center justify-center py-24 gap-3 bg-white border border-[#EFE8DF] rounded-[24px]">
                <div className="w-8 h-8 border-3 border-[#8C6239] border-t-transparent rounded-full animate-spin" />
                <span className="text-sm font-semibold text-[#8A7973]">Loading products catalog...</span>
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="text-center py-20 bg-white border border-[#EFE8DF] rounded-[24px] p-8 shadow-sm">
                <h3 className="text-base font-bold text-[#281C19]">No products match these filters</h3>
                <p className="text-xs text-[#8A7973] mt-1.5">Try resetting some parameters in the sidebar panel.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {currentProducts.map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>
            )}

            {/* Mid-page offer promo banner (placed when grid has elements) */}
            {!loading && filteredProducts.length > 0 && (
              <div className="bg-[#281C19] text-[#E5D5CD] rounded-[20px] p-6 md:py-8 md:px-12 flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm overflow-hidden relative">
                {/* Background lighting flare */}
                <div className="absolute top-0 right-0 w-48 h-48 bg-[#8C6239]/5 rounded-full blur-[80px] pointer-events-none" />
                
                <div className="space-y-1 text-center md:text-left">
                  <span className="text-[9px] font-bold text-[#C4A484] tracking-[0.25em] uppercase block">
                    Limited Time Offer
                  </span>
                  <h3 className="text-base md:text-lg font-bold text-[#FAF7F2] tracking-tight">
                    Free White Glove Delivery on orders above ₹75,000
                  </h3>
                </div>
                <Link
                  href="/store"
                  className="bg-[#8C6239] text-[#FAF7F2] hover:bg-[#724E2B] transition-all duration-300 px-6 py-2.5 rounded-lg text-xs font-bold hover:scale-105 shadow-sm whitespace-nowrap cursor-pointer"
                >
                  Shop Now
                </Link>
              </div>
            )}

            {/* Pagination numbers control bar */}
            {!loading && filteredProducts.length > 0 && (
              <div className="flex flex-col items-center gap-6 pt-6">
                
                {/* Page number buttons */}
                <div className="flex items-center gap-1.5">
                  {/* Prev page */}
                  <button
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage(currentPage - 1)}
                    className="w-8 h-8 rounded-lg border border-[#EFE8DF] flex items-center justify-center hover:border-[#8C6239] transition-all cursor-pointer disabled:opacity-45 disabled:cursor-not-allowed text-xs text-[#8A7973]"
                  >
                    &lt;
                  </button>

                  {/* Dynamic page buttons */}
                  {Array.from({ length: totalPages }).map((_, idx) => {
                    const page = idx + 1;
                    return (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`w-8 h-8 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                          currentPage === page
                            ? "bg-[#281C19] text-white"
                            : "bg-white border border-[#EFE8DF] text-[#8A7973] hover:border-[#8C6239] hover:text-[#8C6239]"
                        }`}
                      >
                        {page}
                      </button>
                    );
                  })}

                  {/* Next page */}
                  <button
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage(currentPage + 1)}
                    className="w-8 h-8 rounded-lg border border-[#EFE8DF] flex items-center justify-center hover:border-[#8C6239] transition-all cursor-pointer disabled:opacity-45 disabled:cursor-not-allowed text-xs text-[#8A7973]"
                  >
                    &gt;
                  </button>
                </div>

                {/* LOAD MORE PRODUCTS button */}
                <button
                  onClick={() => {
                    if (currentPage < totalPages) {
                      setCurrentPage(currentPage + 1);
                    }
                  }}
                  disabled={currentPage >= totalPages}
                  className="bg-white border border-[#8C6239]/40 text-[#8C6239] hover:bg-[#8C6239] hover:text-white transition-all duration-300 font-bold px-8 py-3 rounded-xl text-[10px] tracking-wider uppercase cursor-pointer disabled:opacity-45 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:text-[#8C6239]"
                >
                  LOAD MORE PRODUCTS
                </button>

              </div>
            )}

          </div>

        </div>
      </section>
    </>
  );
}

export default function StorePage() {
  return (
    <main className="bg-[#FAF7F2] pb-16 flex-grow">
      <Suspense fallback={
        <div className="flex items-center justify-center py-24 gap-3">
          <div className="w-8 h-8 border-3 border-[#8C6239] border-t-transparent rounded-full animate-spin" />
          <span className="text-sm font-semibold text-[#8A7973]">Loading store components...</span>
        </div>
      }>
        <StoreContent />
      </Suspense>
    </main>
  );
}
