"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { fetchProducts } from "@/utils/api";
import { toast } from "sonner";
import { FiMinus, FiPlus, FiShoppingBag, FiHeart, FiCheck, FiTruck, FiShield, FiRotateCcw } from "react-icons/fi";
import { useDispatch } from "react-redux";
import { addToCart } from "@/store/cartSlice";
import ProductIllustration from "@/components/website/ProductIllustration";
import { MOCK_PRODUCTS, colorSwatches, materialsList } from "@/utils/mockData";

export default function ProductDetailPage() {
  const { slug } = useParams();
  const dispatch = useDispatch();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(null);
  const [selectedColor, setSelectedColor] = useState("");
  const [selectedMaterial, setSelectedMaterial] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState("description");

  useEffect(() => {
    const loadProduct = async () => {
      try {
        setLoading(true);
        // Fetch from API with slug filter
        const response = await fetchProducts({ slug });
        if (response.success && response.data.length > 0) {
          const fetchedProd = response.data[0];
          
          // Map reviews count and rating if not present in DB
          const processedProd = {
            ...fetchedProd,
            reviewsCount: fetchedProd.reviewsCount || Math.floor(Math.random() * 80) + 15,
            rating: fetchedProd.rating || 5,
            material: fetchedProd.material || (fetchedProd.name.includes("Velvet") ? "Velvet" : "Solid Wood"),
            color: fetchedProd.color || "Medium Brown",
            dimensions: fetchedProd.dimensions || { width: 180, height: 75, depth: 90 },
            weight: fetchedProd.weight || 45,
            shortDescription: fetchedProd.shortDescription || "A beautiful handmade addition to your home furniture lineup. Engineered for high performance comfort and sleek premium looks.",
            description: fetchedProd.description || "Every detail has been crafted to perfection by expert furniture makers. Using sustainable timbers and heavy-duty, certified fabrics, this piece is built to elevate your daily living environment with classic textures and structural resilience.",
          };
          setProduct(processedProd);
          setSelectedColor(processedProd.color);
          setSelectedMaterial(processedProd.material);
          setActiveImage(processedProd.thumbnail);
        } else {
          // Fallback to local mock array
          const mock = MOCK_PRODUCTS.find((p) => p.slug === slug);
          if (mock) {
            setProduct(mock);
            setSelectedColor(mock.color);
            setSelectedMaterial(mock.material);
            setActiveImage(mock.thumbnail || null);
          }
        }
      } catch (error) {
        console.error("Error loading product details:", error);
        const mock = MOCK_PRODUCTS.find((p) => p.slug === slug);
        if (mock) {
          setProduct(mock);
          setSelectedColor(mock.color);
          setSelectedMaterial(mock.material);
          setActiveImage(mock.thumbnail || null);
        }
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      loadProduct();
    }
  }, [slug]);

  if (loading) {
    return (
      <div className="flex-grow flex flex-col items-center justify-center py-40 gap-3 bg-[#FAF7F2]">
        <div className="w-10 h-10 border-4 border-[#8C6239] border-t-transparent rounded-full animate-spin" />
        <span className="text-sm font-bold text-[#8C6239] tracking-wider uppercase">Loading product details...</span>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex-grow flex flex-col items-center justify-center py-32 text-center px-4 bg-[#FAF7F2]">
        <h2 className="text-2xl font-bold text-[#281C19]">Product Not Found</h2>
        <p className="text-sm text-[#8A7973] mt-2">The product you are looking for does not exist or has been removed.</p>
        <Link
          href="/store"
          className="mt-6 bg-[#8C6239] text-[#FAF7F2] hover:bg-[#724E2B] transition-all px-6 py-2.5 rounded-lg text-xs font-bold"
        >
          Return to Store
        </Link>
      </div>
    );
  }

  const discountPct = product.discount || (product.originalPrice ? Math.round(((product.originalPrice - product.salePrice) / product.originalPrice) * 100) : 0);
  const ratingStars = Math.round(product.rating || 5);
  const isOutOfStock = product.stock === false;

  const handleAddToCart = () => {
    dispatch(
      addToCart({
        id: product._id,
        name: product.name,
        price: product.salePrice,
        thumbnail: product.thumbnail,
        color: selectedColor,
        material: selectedMaterial,
        quantity,
      })
    );
    toast.success(
      <div className="flex flex-col gap-1">
        <span className="font-bold text-sm text-[#281C19]">Added to Cart!</span>
        <span className="text-xs text-[#8A7973]">
          {quantity}x {product.name} ({selectedColor}, {selectedMaterial})
        </span>
      </div>
    );
  };

  // Combine thumbnail and product images for the gallery
  const allImages = [product.thumbnail, ...(product.images || [])].filter(Boolean);

  return (
    <div className="bg-[#FAF7F2] min-h-screen py-8 md:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center gap-2 text-[10px] md:text-xs font-bold tracking-widest text-[#8A7973] uppercase mb-8 md:mb-12">
          <Link href="/" className="hover:text-[#8C6239] transition-colors">Home</Link>
          <span>/</span>
          <Link href="/store" className="hover:text-[#8C6239] transition-colors">Store</Link>
          <span>/</span>
          <span className="text-[#8C6239] truncate max-w-[150px] md:max-w-xs">{product.name}</span>
        </nav>

        {/* Detail Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          
          {/* LEFT COLUMN: Images & Visual Representation */}
          <div className="lg:col-span-7 space-y-4">
            
            {/* Main Visual Frame */}
            <div className="aspect-[4/3] w-full bg-white border border-[#EFE8DF] rounded-3xl overflow-hidden shadow-sm relative flex items-center justify-center p-6">
              {discountPct > 0 && (
                <span className="absolute top-6 left-6 text-[10px] font-extrabold text-[#FAF7F2] bg-[#8C6239] px-3 py-1.5 rounded tracking-widest uppercase z-10">
                  -{discountPct}% OFF
                </span>
              )}
              {isOutOfStock && (
                <span className="absolute top-6 left-6 text-[10px] font-extrabold text-white bg-red-600 px-3 py-1.5 rounded tracking-widest uppercase z-10">
                  Sold Out
                </span>
              )}

              {/* Main Image or Illustration */}
              {activeImage && activeImage.startsWith("http") ? (
                <img
                  src={activeImage}
                  alt={product.name}
                  className="max-h-[90%] max-w-[90%] object-contain transform hover:scale-105 transition-transform duration-500"
                />
              ) : (
                <div className="w-full h-full">
                  <ProductIllustration name={product.name} category={product.categoryId?.name || ""} isLarge />
                </div>
              )}
            </div>

            {/* Gallery Thumbnails (only shown if multiple images exist) */}
            {allImages.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-2">
                {allImages.map((img, index) => (
                  <button
                    key={index}
                    onClick={() => setActiveImage(img)}
                    className={`w-20 h-20 bg-white border rounded-xl overflow-hidden flex-shrink-0 flex items-center justify-center p-2 cursor-pointer transition-all ${
                      activeImage === img
                        ? "border-[#8C6239] ring-2 ring-[#8C6239]/20"
                        : "border-[#EFE8DF] hover:border-[#8C6239]/60"
                    }`}
                  >
                    {img.startsWith("http") ? (
                      <img src={img} alt={`Thumbnail ${index}`} className="max-h-full max-w-full object-contain" />
                    ) : (
                      <span className="text-[10px] font-bold text-[#8A7973]">Image {index + 1}</span>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* RIGHT COLUMN: Configuration & Purchasing Info */}
          <div className="lg:col-span-5 bg-white border border-[#EFE8DF] rounded-[32px] p-6 md:p-8 shadow-sm space-y-6 md:space-y-8">
            
            {/* Title / Badges */}
            <div className="space-y-2">
              <span className="text-[10px] font-extrabold text-[#8C6239] tracking-[0.25em] uppercase block">
                {product.categoryId?.name || "Premium Collection"}
              </span>
              <h1 className="text-2xl md:text-3xl font-extrabold text-[#281C19] tracking-tight leading-tight">
                {product.name}
              </h1>

              {/* Review Stars Row */}
              <div className="flex items-center gap-2 pt-1.5 text-xs text-[#8A7973]">
                <div className="flex text-sm tracking-tighter">
                  {Array.from({ length: 5 }).map((_, idx) => (
                    <span key={idx} className={idx < ratingStars ? "text-[#8C6239]" : "text-gray-200"}>★</span>
                  ))}
                </div>
                <span className="font-bold text-[#281C19]">{product.rating}</span>
                <span>•</span>
                <span className="hover:text-[#8C6239] transition-colors cursor-pointer">{product.reviewsCount} reviews</span>
              </div>
            </div>

            {/* Pricing Section */}
            <div className="border-y border-[#EFE8DF]/60 py-4 flex items-baseline gap-3">
              <span className="text-3xl font-extrabold text-[#281C19]">
                ₹{product.salePrice?.toLocaleString("en-IN")}
              </span>
              {product.originalPrice && product.originalPrice > product.salePrice && (
                <span className="text-base text-[#8A7973] line-through">
                  ₹{product.originalPrice?.toLocaleString("en-IN")}
                </span>
              )}
            </div>

            {/* Short Description */}
            <p className="text-xs md:text-sm text-[#8A7973] leading-relaxed">
              {product.shortDescription}
            </p>

            {/* OPTION: Material Choice */}
            <div className="space-y-3">
              <span className="text-[10px] font-extrabold text-[#281C19] uppercase tracking-widest block">
                Material: <span className="text-[#8C6239] font-black">{selectedMaterial}</span>
              </span>
              <div className="flex flex-wrap gap-2">
                {materialsList.map((material) => (
                  <button
                    key={material}
                    onClick={() => setSelectedMaterial(material)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      selectedMaterial === material
                        ? "bg-[#3E2A24] text-white shadow-sm"
                        : "bg-[#FAF7F2] border border-[#EFE8DF] text-[#8A7973] hover:border-[#8C6239] hover:text-[#8C6239]"
                    }`}
                  >
                    {material}
                  </button>
                ))}
              </div>
            </div>

            {/* OPTION: Color Selection Swatches */}
            <div className="space-y-3">
              <span className="text-[10px] font-extrabold text-[#281C19] uppercase tracking-widest block">
                Color: <span className="text-[#8C6239] font-black">{selectedColor}</span>
              </span>
              <div className="flex flex-wrap gap-3">
                {colorSwatches.map((color) => {
                  const isSelected = selectedColor === color.name;
                  return (
                    <button
                      key={color.name}
                      title={color.name}
                      onClick={() => setSelectedColor(color.name)}
                      className={`w-8 h-8 rounded-full border cursor-pointer relative flex items-center justify-center transition-all ${
                        color.borderClass
                      } ${isSelected ? "ring-2 ring-[#8C6239] ring-offset-2 scale-110" : "hover:scale-110"}`}
                      style={{ backgroundColor: color.value }}
                    >
                      {isSelected && (
                        <FiCheck className={`text-xs ${
                          color.name.includes("Off-white") ? "text-[#8C6239]" : "text-white"
                        }`} />
                      )}
                    </button>
                  );
                })}
                {/* Fallback swatch if the product color is custom and not in swatches list */}
                {!colorSwatches.some(s => s.name === selectedColor) && selectedColor && (
                  <button
                    title={selectedColor}
                    className="px-3.5 py-1.5 rounded-full border border-[#8C6239] text-[10px] font-bold text-[#8C6239] bg-[#FAF7F2] scale-110 relative flex items-center gap-1.5"
                  >
                    <FiCheck className="text-[10px]" /> {selectedColor}
                  </button>
                )}
              </div>
            </div>

            {/* Quantity Selector & Add to Cart Action Row */}
            <div className="space-y-4 pt-2">
              <div className="flex gap-4 items-center">
                
                {/* Quantity adjuster */}
                <div className="flex items-center bg-[#FAF7F2] border border-[#EFE8DF] rounded-xl px-2.5 py-2">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={quantity <= 1 || isOutOfStock}
                    className="p-1 hover:text-[#8C6239] text-[#8A7973] disabled:opacity-40 cursor-pointer"
                  >
                    <FiMinus className="w-3.5 h-3.5" />
                  </button>
                  <span className="px-4 text-xs font-extrabold text-[#281C19] w-8 text-center select-none">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    disabled={isOutOfStock}
                    className="p-1 hover:text-[#8C6239] text-[#8A7973] cursor-pointer"
                  >
                    <FiPlus className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Add to Cart Trigger */}
                <button
                  onClick={handleAddToCart}
                  disabled={isOutOfStock}
                  className="flex-1 bg-[#8C6239] hover:bg-[#724E2B] text-white disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed hover:shadow-lg hover:shadow-[#8C6239]/10 active:scale-[0.98] transition-all py-3.5 rounded-xl font-bold text-xs tracking-wider uppercase flex items-center justify-center gap-2 cursor-pointer"
                >
                  <FiShoppingBag className="w-4 h-4" />
                  {isOutOfStock ? "Out of Stock" : "Add to Cart"}
                </button>

                {/* Wishlist button */}
                <button className="w-12 h-12 rounded-xl bg-[#FAF7F2] border border-[#EFE8DF] hover:border-[#8C6239] hover:text-[#8C6239] transition-all flex items-center justify-center text-[#8A7973] cursor-pointer hover:scale-105 active:scale-95">
                  <FiHeart className="w-4 h-4" />
                </button>

              </div>
            </div>

            {/* Extra product confidence specifications list */}
            <div className="border-t border-[#EFE8DF]/60 pt-6 space-y-3">
              <div className="flex items-center gap-3 text-xs text-[#8A7973]">
                <FiTruck className="text-[#8C6239] w-4 h-4 flex-shrink-0" />
                <span>Free White Glove delivery on premium shipping orders</span>
              </div>
              <div className="flex items-center gap-3 text-xs text-[#8A7973]">
                <FiRotateCcw className="text-[#8C6239] w-4 h-4 flex-shrink-0" />
                <span>30-day hassle-free returns on standard items</span>
              </div>
              <div className="flex items-center gap-3 text-xs text-[#8A7973]">
                <FiShield className="text-[#8C6239] w-4 h-4 flex-shrink-0" />
                <span>10-year structural frame warranty coverage</span>
              </div>
            </div>

          </div>

        </div>

        {/* Tabbed Specifications & Descriptions Segment */}
        <div className="mt-12 md:mt-16 bg-white border border-[#EFE8DF] rounded-[32px] overflow-hidden shadow-sm">
          <div className="flex border-b border-[#EFE8DF] bg-[#FAF7F2]/40">
            <button
              onClick={() => setActiveTab("description")}
              className={`flex-1 md:flex-none px-6 py-4 text-xs font-bold tracking-widest uppercase cursor-pointer border-b-2 transition-all ${
                activeTab === "description"
                  ? "border-[#8C6239] text-[#8C6239] bg-white"
                  : "border-transparent text-[#8A7973] hover:text-[#281C19]"
              }`}
            >
              Description
            </button>
            <button
              onClick={() => setActiveTab("specifications")}
              className={`flex-1 md:flex-none px-6 py-4 text-xs font-bold tracking-widest uppercase cursor-pointer border-b-2 transition-all ${
                activeTab === "specifications"
                  ? "border-[#8C6239] text-[#8C6239] bg-white"
                  : "border-transparent text-[#8A7973] hover:text-[#281C19]"
              }`}
            >
              Specifications
            </button>
          </div>

          <div className="p-6 md:p-8">
            {activeTab === "description" ? (
              <div className="space-y-4">
                <h3 className="text-sm font-bold text-[#281C19] uppercase tracking-wide">Product Details</h3>
                <p className="text-xs md:text-sm text-[#8A7973] leading-relaxed font-normal">
                  {product.description}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                <div className="flex justify-between py-2.5 border-b border-[#EFE8DF]/60 text-xs">
                  <span className="font-bold text-[#8A7973] uppercase tracking-wide">Material</span>
                  <span className="text-[#281C19] font-semibold">{selectedMaterial}</span>
                </div>
                <div className="flex justify-between py-2.5 border-b border-[#EFE8DF]/60 text-xs">
                  <span className="font-bold text-[#8A7973] uppercase tracking-wide">Colorway</span>
                  <span className="text-[#281C19] font-semibold">{selectedColor}</span>
                </div>
                <div className="flex justify-between py-2.5 border-b border-[#EFE8DF]/60 text-xs">
                  <span className="font-bold text-[#8A7973] uppercase tracking-wide">Width (cm)</span>
                  <span className="text-[#281C19] font-semibold">{product.dimensions?.width || "-"}</span>
                </div>
                <div className="flex justify-between py-2.5 border-b border-[#EFE8DF]/60 text-xs">
                  <span className="font-bold text-[#8A7973] uppercase tracking-wide">Height (cm)</span>
                  <span className="text-[#281C19] font-semibold">{product.dimensions?.height || "-"}</span>
                </div>
                <div className="flex justify-between py-2.5 border-b border-[#EFE8DF]/60 text-xs">
                  <span className="font-bold text-[#8A7973] uppercase tracking-wide">Depth (cm)</span>
                  <span className="text-[#281C19] font-semibold">{product.dimensions?.depth || "-"}</span>
                </div>
                <div className="flex justify-between py-2.5 border-b border-[#EFE8DF]/60 text-xs">
                  <span className="font-bold text-[#8A7973] uppercase tracking-wide">Weight (kg)</span>
                  <span className="text-[#281C19] font-semibold">{product.weight || "-"}</span>
                </div>
                <div className="flex justify-between py-2.5 border-b border-[#EFE8DF]/60 text-xs col-span-1 md:col-span-2">
                  <span className="font-bold text-[#8A7973] uppercase tracking-wide">Availability</span>
                  <span className={`font-semibold ${product.stock ? "text-[#8C6239]" : "text-red-600"}`}>
                    {product.stock ? "In Stock (Ships in 3-5 days)" : "Made to Order (Ships in 4-6 weeks)"}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
