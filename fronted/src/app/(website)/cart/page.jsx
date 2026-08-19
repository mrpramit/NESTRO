"use client";

import React from "react";
import Link from "next/link";
import { useSelector, useDispatch } from "react-redux";
import { removeFromCart, updateQuantity, clearCart } from "@/store/cartSlice";
import { FiTrash2, FiMinus, FiPlus, FiArrowLeft, FiShoppingBag } from "react-icons/fi";
import ProductIllustration from "@/components/website/ProductIllustration";

export default function CartPage() {
  const dispatch = useDispatch();
  const cartItems = useSelector((state) => state.cart.items);

  const subtotal = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  const shippingThreshold = 75000;
  const shipping = subtotal === 0 || subtotal >= shippingThreshold ? 0 : 1500;
  const gst = Math.round(subtotal * 0.18); // 18% GST estimate
  const total = subtotal + shipping + gst;

  const handleQtyChange = (item, delta) => {
    const newQty = item.quantity + delta;
    if (newQty > 0) {
      dispatch(
        updateQuantity({
          id: item.id,
          color: item.color,
          material: item.material,
          quantity: newQty,
        })
      );
    }
  };

  const handleRemove = (item) => {
    dispatch(
      removeFromCart({
        id: item.id,
        color: item.color,
        material: item.material,
      })
    );
  };

  return (
    <main className="bg-[#FAF7F2] min-h-screen py-10 md:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="border-b border-[#EFE8DF] pb-5 mb-10 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-extrabold text-[#281C19] tracking-tight">Shopping Bag</h1>
            <p className="text-xs text-[#8A7973] mt-1 font-medium tracking-wide uppercase">
              {cartItems.length === 0 ? "Your bag is empty" : `${cartItems.length} unique selections`}
            </p>
          </div>
          <Link
            href="/store"
            className="text-xs font-bold text-[#8C6239] hover:text-[#724E2B] transition-colors flex items-center gap-1.5 uppercase tracking-wider"
          >
            <FiArrowLeft /> Back to Store
          </Link>
        </div>

        {cartItems.length === 0 ? (
          /* Empty State */
          <div className="bg-white border border-[#EFE8DF] rounded-[32px] p-12 text-center shadow-sm max-w-lg mx-auto mt-10">
            <div className="w-16 h-16 bg-[#F3ECE4]/40 rounded-full flex items-center justify-center mx-auto text-[#8C6239]">
              <FiShoppingBag className="w-8 h-8" />
            </div>
            <h2 className="text-xl font-bold text-[#281C19] mt-6">Your shopping bag is empty</h2>
            <p className="text-sm text-[#8A7973] mt-2 max-w-sm mx-auto">
              Looks like you haven't added any luxury furniture to your order yet. Let's explore our catalog!
            </p>
            <Link
              href="/store"
              className="mt-8 inline-block bg-[#8C6239] text-[#FAF7F2] hover:bg-[#724E2B] px-8 py-3.5 rounded-xl font-bold text-xs tracking-wider uppercase transition-all hover:scale-105 active:scale-95 shadow-sm"
            >
              Continue Shopping
            </Link>
          </div>
        ) : (
          /* Cart Grid */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left Items Column */}
            <div className="lg:col-span-8 space-y-4">
              {cartItems.map((item, index) => (
                <div
                  key={`${item.id}-${item.color}-${item.material}`}
                  className="bg-white border border-[#EFE8DF] rounded-2xl p-4 md:p-5 flex gap-4 md:gap-6 shadow-sm hover:shadow-md transition-shadow"
                >
                  {/* Thumbnail Image */}
                  <div className="w-24 h-24 md:w-28 md:h-28 bg-[#FAF7F2] border border-[#EFE8DF] rounded-xl overflow-hidden flex-shrink-0 flex items-center justify-center p-2">
                    {item.thumbnail && item.thumbnail.startsWith("http") ? (
                      <img src={item.thumbnail} alt={item.name} className="max-h-full max-w-full object-contain" />
                    ) : (
                      <div className="w-full h-full max-h-[85%] max-w-[85%]">
                        <ProductIllustration name={item.name} category="" />
                      </div>
                    )}
                  </div>

                  {/* Item Details */}
                  <div className="flex-1 flex flex-col justify-between min-w-0 py-0.5">
                    <div className="flex justify-between items-start gap-4">
                      <div>
                        <h3 className="text-sm md:text-base font-bold text-[#281C19] truncate pr-4" title={item.name}>
                          {item.name}
                        </h3>
                        <div className="flex flex-wrap gap-x-3 gap-y-1 mt-1 text-[10px] md:text-xs text-[#8A7973] font-medium">
                          <span>Material: <strong className="text-[#3E2A24]">{item.material}</strong></span>
                          <span>Color: <strong className="text-[#3E2A24]">{item.color}</strong></span>
                        </div>
                      </div>
                      <span className="text-sm md:text-base font-extrabold text-[#281C19] whitespace-nowrap">
                        ₹{(item.price * item.quantity).toLocaleString("en-IN")}
                      </span>
                    </div>

                    <div className="flex justify-between items-center mt-4">
                      {/* Quantity Controls */}
                      <div className="flex items-center bg-[#FAF7F2] border border-[#EFE8DF] rounded-xl px-2 py-1">
                        <button
                          onClick={() => handleQtyChange(item, -1)}
                          disabled={item.quantity <= 1}
                          className="p-1 hover:text-[#8C6239] text-[#8A7973] disabled:opacity-40 cursor-pointer"
                        >
                          <FiMinus className="w-3 h-3" />
                        </button>
                        <span className="px-3 text-xs font-extrabold text-[#281C19] w-6 text-center select-none">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => handleQtyChange(item, 1)}
                          className="p-1 hover:text-[#8C6239] text-[#8A7973] cursor-pointer"
                        >
                          <FiPlus className="w-3 h-3" />
                        </button>
                      </div>

                      {/* Remove Button */}
                      <button
                        onClick={() => handleRemove(item)}
                        className="text-gray-400 hover:text-red-600 transition-colors p-1.5 hover:bg-red-50 rounded-lg cursor-pointer"
                        title="Remove selection"
                      >
                        <FiTrash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}

              {/* Clear Cart Button */}
              <div className="pt-2">
                <button
                  onClick={() => dispatch(clearCart())}
                  className="text-xs font-bold text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100/80 px-4 py-2.5 rounded-xl transition-colors cursor-pointer"
                >
                  Clear Entire Bag
                </button>
              </div>
            </div>

            {/* Right Summary Column */}
            <div className="lg:col-span-4 bg-white border border-[#EFE8DF] rounded-3xl p-6 md:p-8 shadow-sm space-y-6 sticky top-24">
              <h2 className="text-lg font-extrabold text-[#281C19] border-b border-[#EFE8DF]/60 pb-3 uppercase tracking-wider text-xs">
                Order Summary
              </h2>

              <div className="space-y-4 text-xs font-medium text-[#8A7973]">
                {/* Subtotal */}
                <div className="flex justify-between">
                  <span>Bag Subtotal</span>
                  <span className="text-[#281C19] font-bold">₹{subtotal.toLocaleString("en-IN")}</span>
                </div>

                {/* Shipping */}
                <div className="flex justify-between">
                  <span>Shipping & Handling</span>
                  <span className="text-[#281C19] font-bold">
                    {shipping === 0 ? <span className="text-emerald-600 uppercase font-extrabold text-[10px] tracking-wider bg-emerald-50 px-2 py-0.5 rounded">Free</span> : `₹${shipping.toLocaleString("en-IN")}`}
                  </span>
                </div>

                {/* GST Tax */}
                <div className="flex justify-between">
                  <span>GST (18% estimated)</span>
                  <span className="text-[#281C19] font-bold">₹{gst.toLocaleString("en-IN")}</span>
                </div>

                <hr className="border-[#EFE8DF]/60" />

                {/* Total */}
                <div className="flex justify-between items-baseline text-sm">
                  <span className="font-bold text-[#281C19]">Estimated Order Total</span>
                  <span className="text-lg md:text-xl font-black text-[#8C6239]">
                    ₹{total.toLocaleString("en-IN")}
                  </span>
                </div>
              </div>

              {/* Progress Indicator for Free Shipping */}
              {subtotal < shippingThreshold && (
                <div className="bg-[#FAF7F2] border border-[#EFE8DF] p-4 rounded-2xl space-y-2 text-xs">
                  <p className="text-[#8A7973] font-medium leading-relaxed">
                    Add <strong className="text-[#8C6239]">₹{(shippingThreshold - subtotal).toLocaleString("en-IN")}</strong> more for <strong className="text-emerald-600">Free Delivery</strong>!
                  </p>
                  <div className="w-full bg-gray-200 h-1.5 rounded-full overflow-hidden">
                    <div 
                      className="bg-[#8C6239] h-full transition-all duration-500" 
                      style={{ width: `${(subtotal / shippingThreshold) * 100}%` }}
                    />
                  </div>
                </div>
              )}

              {/* Checkout Button */}
              <Link
                href="/checkout"
                className="w-full bg-[#3E2A24] hover:bg-[#2C1C18] text-white py-4 rounded-xl font-bold text-xs tracking-widest uppercase transition-all shadow-sm hover:scale-[1.02] active:scale-[0.98] cursor-pointer flex items-center justify-center text-center"
              >
                Proceed to Secure Checkout
              </Link>

              <div className="text-[10px] text-center text-[#8A7973] leading-relaxed font-medium">
                Security & checkout simulations configured using standard secure SSL patterns. All payments are sandbox simulated.
              </div>
            </div>

          </div>
        )}

      </div>
    </main>
  );
}
