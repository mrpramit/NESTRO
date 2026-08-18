"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import { addToCart, removeFromCart, updateQuantity } from "@/store/cartSlice";
import { toast } from "sonner";
import { FiEye, FiHeart, FiShoppingBag, FiMinus, FiPlus } from "react-icons/fi";
import ProductIllustration from "./ProductIllustration";

export default function ProductCard({ product }) {
  const dispatch = useDispatch();
  const cartItems = useSelector((state) => state.cart.items);
  const [isInWishlist, setIsInWishlist] = useState(false);

  const ratingStars = product.rating || 5;
  const reviewsCount = product.reviewsCount || 24;

  // Discount badge
  const hasDiscount = product.discount > 0 || (product.originalPrice && product.originalPrice > product.salePrice);
  const discountPct = product.discount || (product.originalPrice ? Math.round(((product.originalPrice - product.salePrice) / product.originalPrice) * 100) : 0);

  let badgeText = product.badge || "";
  if (discountPct > 0 && !badgeText) badgeText = `-${discountPct}%`;

  // Find if this product is in the cart
  const cartItem = cartItems.find((item) => item.id === product._id);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem(`wishlist_${product._id}`);
      setIsInWishlist(stored === "true");
    }
  }, [product._id]);

  const handleToggleWishlist = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const nextState = !isInWishlist;
    setIsInWishlist(nextState);
    if (typeof window !== "undefined") {
      localStorage.setItem(`wishlist_${product._id}`, String(nextState));
    }
    if (nextState) {
      toast.success(`${product.name} added to Wishlist!`);
    } else {
      toast.info(`${product.name} removed from Wishlist.`);
    }
  };

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    dispatch(
      addToCart({
        id: product._id,
        name: product.name,
        price: product.salePrice,
        thumbnail: product.thumbnail,
        color: product.color || "Medium Brown",
        material: product.material || "Solid Wood",
        quantity: 1,
      })
    );
    toast.success(
      <div className="flex flex-col gap-1">
        <span className="font-bold text-sm text-[#281C19]">Added to Cart!</span>
        <span className="text-xs text-[#8A7973]">
          1x {product.name}
        </span>
      </div>
    );
  };

  const handleIncrement = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (cartItem) {
      dispatch(
        updateQuantity({
          id: cartItem.id,
          color: cartItem.color,
          material: cartItem.material,
          quantity: cartItem.quantity + 1,
        })
      );
    }
  };

  const handleDecrement = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (cartItem) {
      if (cartItem.quantity > 1) {
        dispatch(
          updateQuantity({
            id: cartItem.id,
            color: cartItem.color,
            material: cartItem.material,
            quantity: cartItem.quantity - 1,
          })
        );
      } else {
        dispatch(
          removeFromCart({
            id: cartItem.id,
            color: cartItem.color,
            material: cartItem.material,
          })
        );
        toast.info(`${product.name} removed from Cart.`);
      }
    }
  };

  return (
    <div
      className="bg-white border border-[#EFE8DF] rounded-2xl overflow-hidden hover:shadow-xl hover:shadow-[#8C6239]/5 hover:border-[#8C6239]/40 hover:-translate-y-1.5 transition-all duration-300 group flex flex-col h-full relative"
    >
      {/* Visual container top */}
      <div className="aspect-[4/3] w-full bg-[#FAF7F2] p-6 relative flex items-center justify-center overflow-hidden flex-shrink-0">
        <Link
          href={`/store/${product.slug}`}
          className="absolute inset-0 flex items-center justify-center p-6 z-10"
        >
          {badgeText && (
            <span className={`absolute top-4 left-4 text-[9px] font-extrabold text-[#FAF7F2] px-2.5 py-1 rounded tracking-widest uppercase z-10 ${badgeText.startsWith("-") ? "bg-[#8C6239]" : badgeText === "NEW" ? "bg-[#2C1C18]" : "bg-[#3E2A24]"
              }`}>
              {badgeText}
            </span>
          )}

          {/* Image representation */}
          {product.thumbnail && product.thumbnail.startsWith("http") ? (
            <img
              src={product.thumbnail}
              alt={product.name}
              className="max-h-[85%] max-w-[85%] object-contain transform group-hover:scale-108 transition-transform duration-500 ease-out"
            />
          ) : (
            <div className="w-full h-full max-h-[85%] max-w-[85%] transform group-hover:scale-108 transition-transform duration-500 ease-out">
              <ProductIllustration name={product.name} category={product.categoryId?.name || ""} />
            </div>
          )}
        </Link>

        {/* Hover Overlay Icons */}
        <div className="absolute inset-0 bg-[#3E2A24]/10 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center gap-4 z-20 pointer-events-none group-hover:pointer-events-auto">
          <Link
            href={`/store/${product.slug}`}
            className="w-10 h-10 rounded-full bg-white text-[#3E2A24] hover:bg-[#8C6239] hover:text-white transition-all duration-200 flex items-center justify-center shadow-md hover:scale-110 pointer-events-auto cursor-pointer"
            title="View Product"
          >
            <FiEye className="w-5 h-5" />
          </Link>
          <button
            onClick={handleToggleWishlist}
            className={`w-10 h-10 rounded-full transition-all duration-200 flex items-center justify-center shadow-md hover:scale-110 cursor-pointer pointer-events-auto ${isInWishlist
                ? "bg-[#8C6239] text-white"
                : "bg-white text-[#3E2A24] hover:bg-[#8C6239] hover:text-white"
              }`}
            title={isInWishlist ? "Remove from Wishlist" : "Add to Wishlist"}
          >
            <FiHeart className={`w-5 h-5 ${isInWishlist ? "fill-current" : ""}`} />
          </button>
        </div>
      </div>

      {/* Info details bottom */}
      <div className="p-5 flex-1 flex flex-col justify-between gap-3 bg-white">
        <div className="space-y-1">
          <Link href={`/store/${product.slug}`} className="block group/title">
            <span className="text-[9px] font-extrabold text-[#8A7973] tracking-widest uppercase block">
              {product.categoryId?.name || "Furniture"}
            </span>
            <h3 className="text-sm font-bold text-[#281C19] group-hover/title:text-[#8C6239] group-hover:text-[#8C6239] transition-colors line-clamp-1">
              {product.name}
            </h3>
          </Link>
        </div>

        {/* Rating row */}
        <div className="flex items-center gap-1.5 text-xs text-[#8A7973] font-medium">
          <div className="flex gap-0.5">
            {Array.from({ length: 5 }).map((_, starIdx) => (
              <span
                key={starIdx}
                className={`text-sm ${starIdx < ratingStars ? "text-[#8C6239]" : "text-gray-200"
                  }`}
              >
                ★
              </span>
            ))}
          </div>
          <span>({reviewsCount})</span>
        </div>

        {/* Price Row */}
        <div className="flex items-center gap-2.5">
          <span className="text-sm font-extrabold text-[#281C19]">
            ₹{product.salePrice?.toLocaleString("en-IN")}
          </span>
          {product.originalPrice && product.originalPrice > product.salePrice && (
            <span className="text-xs text-[#8A7973] line-through">
              ₹{product.originalPrice?.toLocaleString("en-IN")}
            </span>
          )}
        </div>

        {/* Add to Cart / Quantity Selector button */}
        {cartItem ? (
          <div className="flex gap-2 items-center w-full mt-2">
            {/* Quantity selector */}
            <div className="flex items-center bg-[#FAF7F2] border border-[#EFE8DF] rounded-xl px-2.5 py-1.5 flex-shrink-0">
              <button
                onClick={handleDecrement}
                className="p-1 hover:text-[#8C6239] text-[#8A7973] cursor-pointer"
                title="Decrease quantity"
              >
                <FiMinus className="w-3.5 h-3.5" />
              </button>
              <span className="px-3.5 text-xs font-extrabold text-[#281C19] w-7 text-center select-none">
                {cartItem.quantity}
              </span>
              <button
                onClick={handleIncrement}
                className="p-1 hover:text-[#8C6239] text-[#8A7973] cursor-pointer"
                title="Increase quantity"
              >
                <FiPlus className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Go to Cart button */}
            <Link
              href="/cart"
              className="flex-1 bg-[#8C6239] hover:bg-[#724E2B] text-white py-2.5 px-3 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 active:scale-95 hover:scale-[1.02] transition-all cursor-pointer shadow-sm hover:shadow-md border border-[#8C6239]/10"
            >
              Go to Cart
              <span>→</span>
            </Link>
          </div>
        ) : (
          <button
            onClick={handleAddToCart}
            className="w-full bg-[#8C6239] hover:bg-[#724E2B] text-white py-2.5 px-4 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 active:scale-95 hover:scale-[1.02] transition-all mt-2 cursor-pointer shadow-sm hover:shadow-md border border-[#8C6239]/10"
          >
            <FiShoppingBag className="w-4 h-4" />
            Add to Cart
          </button>
        )}
      </div>
    </div>
  );
}
