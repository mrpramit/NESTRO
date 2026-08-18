import React, { useState } from "react";
import Link from "next/link";
import { ProductIcon } from "@/components/admin/Icons";

export default function ProductDetailsModal({ product, onClose }) {
  const [activeImage, setActiveImage] = useState(product.thumbnail);

  // Combine thumbnail and additional images for the gallery
  const allImages = [product.thumbnail, ...(product.images || [])].filter(Boolean);

  // Dimensions formatted string
  const dimensionsStr = product.dimensions
    ? `${product.dimensions.width || 0}W × ${product.dimensions.height || 0}H × ${product.dimensions.depth || 0}D cm`
    : "Not specified";

  return (
    <div 
      className="fixed inset-0 z-[999] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in"
      onClick={onClose}
    >
      <div 
        className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-sm border border-[#e2e8f0] bg-white shadow-xl dark:border-[#2e3a47] dark:bg-[#1c2434] text-black dark:text-white transition-all duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-[#e2e8f0] px-6 py-4 dark:border-[#2e3a47]">
          <h2 className="text-xl font-bold">Product Information</h2>
          <div className="flex items-center gap-3">
            <Link
              href={`/admin/product/add?id=${product._id}`}
              className="inline-flex items-center justify-center rounded-sm bg-black px-4 py-2 text-center text-sm font-semibold text-white hover:bg-opacity-90 dark:bg-white dark:text-black dark:hover:bg-opacity-90 transition-all shadow-sm"
            >
              Edit Details
            </Link>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-slate-600 dark:hover:text-white transition-colors cursor-pointer text-2xl font-bold leading-none"
            >
              ×
            </button>
          </div>
        </div>

        {/* Modal Content */}
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Left Column: Images and Badges */}
          <div className="space-y-4">
            {/* Main Preview Image */}
            <div className="relative aspect-video w-full rounded border border-[#e2e8f0] dark:border-[#2e3a47] overflow-hidden bg-slate-50 dark:bg-slate-800 flex items-center justify-center">
              {activeImage ? (
                <img
                  src={activeImage}
                  alt={product.name}
                  className="h-full w-full object-cover"
                />
              ) : (
                <ProductIcon className="w-12 h-12 text-[#3c50e0] dark:text-blue-400" />
              )}
            </div>

            {/* Image Thumbnails Carousel */}
            {allImages.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
                {allImages.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImage(img)}
                    className={`h-16 w-16 shrink-0 rounded border overflow-hidden transition-all bg-slate-50 dark:bg-slate-800 cursor-pointer ${
                      activeImage === img
                        ? "border-[#3c50e0] ring-2 ring-[#3c50e0]/20"
                        : "border-[#e2e8f0] dark:border-[#2e3a47] hover:border-slate-400"
                    }`}
                  >
                    <img src={img} alt={`Preview ${idx + 1}`} className="h-full w-full object-cover" />
                  </button>
                ))}
              </div>
            )}

            {/* Badges / Status tags */}
            <div className="flex flex-wrap gap-2 pt-2">
              <span className={`px-2.5 py-1 text-xs font-bold rounded-full border ${
                product.stock
                  ? "bg-emerald-50 text-emerald-600 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20"
                  : "bg-slate-50 text-slate-500 border-slate-200 dark:bg-slate-500/10 dark:text-slate-400 dark:border-slate-500/20"
              }`}>
                {product.stock ? "In Stock" : "Out of Stock"}
              </span>

              <span className={`px-2.5 py-1 text-xs font-bold rounded-full border ${
                product.status
                  ? "bg-blue-50 text-blue-600 border-blue-200 dark:bg-blue-500/10 dark:text-blue-400 dark:border-blue-500/20"
                  : "bg-rose-50 text-rose-600 border-rose-200 dark:bg-rose-500/10 dark:text-rose-400 dark:border-rose-500/20"
              }`}>
                {product.status ? "Status: Active" : "Status: Inactive"}
              </span>

              {product.featured && (
                <span className="px-2.5 py-1 text-xs font-bold rounded-full bg-amber-50 text-amber-600 border border-amber-200 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/20">
                  Featured
                </span>
              )}

              {product.bestSeller && (
                <span className="px-2.5 py-1 text-xs font-bold rounded-full bg-purple-50 text-purple-600 border border-purple-200 dark:bg-purple-500/10 dark:text-purple-400 dark:border-purple-500/20">
                  Best Seller
                </span>
              )}

              {product.newArrival && (
                <span className="px-2.5 py-1 text-xs font-bold rounded-full bg-sky-50 text-sky-600 border border-sky-200 dark:bg-sky-500/10 dark:text-sky-400 dark:border-sky-500/20">
                  New Arrival
                </span>
              )}
            </div>
          </div>

          {/* Right Column: Text Information */}
          <div className="space-y-5">
            <div>
              <h3 className="text-2xl font-bold text-black dark:text-white leading-tight">
                {product.name}
              </h3>
              <p className="text-xs text-slate-400 font-medium mt-1">
                Slug: <code className="bg-slate-100 dark:bg-[#24303f] px-1.5 py-0.5 rounded text-xs">{product.slug}</code>
              </p>
            </div>

            {/* Category and Room Type */}
            <div className="grid grid-cols-2 gap-4 border-t border-b border-[#e2e8f0] py-3 dark:border-[#2e3a47]">
              <div>
                <span className="block text-xs font-bold text-slate-400 uppercase">Category</span>
                <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                  {product.categoryId?.name || "Unknown"}
                </span>
              </div>
              <div>
                <span className="block text-xs font-bold text-slate-400 uppercase">Room Type</span>
                <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                  {product.roomId?.name || "Unknown"}
                </span>
              </div>
            </div>

            {/* Price Detail */}
            <div>
              <span className="block text-xs font-bold text-slate-400 uppercase mb-1">Pricing</span>
              <div className="flex items-baseline gap-3">
                <span className="text-3xl font-black text-black dark:text-white">
                  ₹{product.salePrice.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                </span>
                <span className="text-base font-semibold text-slate-400 line-through">
                  ₹{product.originalPrice.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                </span>
                <span className="text-sm font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-500/10 px-2 py-0.5 rounded-sm">
                  {product.discount}% OFF
                </span>
              </div>
            </div>

            {/* Specs / Attributes */}
            <div className="grid grid-cols-2 gap-4 bg-[#f8fafc] dark:bg-[#24303f] p-4 rounded-sm border border-[#e2e8f0] dark:border-[#2e3a47]">
              <div>
                <span className="block text-xs font-bold text-slate-400 uppercase">Material</span>
                <span className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                  {product.material || "Not specified"}
                </span>
              </div>
              <div>
                <span className="block text-xs font-bold text-slate-400 uppercase">Color</span>
                <span className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                  {product.color || "Not specified"}
                </span>
              </div>
              <div>
                <span className="block text-xs font-bold text-slate-400 uppercase">Dimensions</span>
                <span className="text-sm font-semibold text-slate-800 dark:text-slate-200 font-mono text-xs">
                  {dimensionsStr}
                </span>
              </div>
              <div>
                <span className="block text-xs font-bold text-slate-400 uppercase">Weight</span>
                <span className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                  {product.weight ? `${product.weight} kg` : "Not specified"}
                </span>
              </div>
            </div>

            {/* Descriptions */}
            <div className="space-y-2">
              {product.shortDescription && (
                <div>
                  <span className="block text-xs font-bold text-slate-400 uppercase">Short Summary</span>
                  <p className="text-sm text-slate-600 dark:text-slate-300 italic">
                    &ldquo;{product.shortDescription}&rdquo;
                  </p>
                </div>
              )}

              {product.description && (
                <div>
                  <span className="block text-xs font-bold text-slate-400 uppercase">Description</span>
                  <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed max-h-[120px] overflow-y-auto pr-1">
                    {product.description}
                  </p>
                </div>
              )}
            </div>

            {/* SEO Section */}
            {(product.seoTitle || product.seoDescription) && (
              <div className="border-t border-[#e2e8f0] pt-3 dark:border-[#2e3a47]">
                <span className="block text-xs font-bold text-slate-400 uppercase mb-1">SEO Preview</span>
                <div className="text-xs bg-slate-50 dark:bg-[#18202d] p-3 rounded-sm space-y-1 border border-[#e2e8f0] dark:border-[#2e3a47]">
                  {product.seoTitle && <p className="font-bold text-[#1a0dab] dark:text-[#8ab4f8]">{product.seoTitle}</p>}
                  {product.seoDescription && <p className="text-slate-500 dark:text-slate-400">{product.seoDescription}</p>}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-end gap-3 border-t border-[#e2e8f0] px-6 py-4 dark:border-[#2e3a47]">
          <button
            onClick={onClose}
            className="rounded-sm border border-[#e2e8f0] px-6 py-2.5 text-center text-sm font-semibold text-black hover:bg-slate-50 dark:border-[#2e3a47] dark:text-white dark:hover:bg-[#24303f] transition-all cursor-pointer"
          >
            Close
          </button>
          <Link
            href={`/admin/product/add?id=${product._id}`}
            className="rounded-sm bg-black px-6 py-2.5 text-center text-sm font-semibold text-white hover:bg-opacity-90 dark:bg-white dark:text-black dark:hover:bg-opacity-90 transition-all shadow-sm"
          >
            Edit Product
          </Link>
        </div>
      </div>
    </div>
  );
}
