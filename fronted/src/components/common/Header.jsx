"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { toast } from "sonner";
import Swal from "sweetalert2";
import { deleteUserAccount } from "@/utils/api";

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const syncUser = () => {
      if (typeof window !== "undefined") {
        const storedUser = localStorage.getItem("nestro_user");
        if (storedUser) {
          try {
            setUser(JSON.parse(storedUser));
          } catch (e) {
            console.error("Failed to parse nestro_user", e);
          }
        } else {
          setUser(null);
        }
      }
    };

    syncUser();

    if (typeof window !== "undefined") {
      window.addEventListener("userUpdate", syncUser);
      window.addEventListener("storage", syncUser);
      return () => {
        window.removeEventListener("userUpdate", syncUser);
        window.removeEventListener("storage", syncUser);
      };
    }
  }, [pathname]);

  const handleLogout = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("nestro_user");
      document.cookie = "jwt=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
      window.dispatchEvent(new Event("userUpdate"));
    }
    toast.success("Logged out successfully");
    setUser(null);
    router.push("/sign-in");
  };

  const handleDeleteAccount = async () => {
    const result = await Swal.fire({
      title: "Delete Account?",
      text: "Are you sure you want to permanently delete your Nestro account? This action cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#EF4444",
      cancelButtonColor: "#8C6239",
      confirmButtonText: "Yes, delete account",
      cancelButtonText: "Cancel",
      background: "#ffffff",
      color: "#281C19"
    });

    if (result.isConfirmed) {
      try {
        const res = await deleteUserAccount();
        if (res.success) {
          if (typeof window !== "undefined") {
            localStorage.removeItem("nestro_user");
            document.cookie = "jwt=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
            window.dispatchEvent(new Event("userUpdate"));
          }
          toast.success("Your account has been deleted successfully.");
          setUser(null);
          router.push("/register");
        } else {
          toast.error(res.message || "Failed to delete account");
        }
      } catch (err) {
        toast.error("Could not delete account. Please try again.");
      }
    }
  };

  const cartItems = useSelector((state) => state.cart.items);
  const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0);

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Store", href: "/store" },
    { name: "About", href: "/about" },
    { name: "Contact", href: "/contact" },
    { name: "Checkout", href: "/checkout" },
    { name: "Sign In", href: "/sign-in" },
  ];

  return (
    <header className="w-full font-sans sticky top-0 z-50 shadow-sm bg-[#FAF7F2]">
      {/* Announcement Bar */}
      <div className="w-full bg-[#3E2A24] py-2 px-4 text-center">
        <p className="text-[10px] md:text-xs font-semibold tracking-widest text-[#FDFBF7] uppercase">
          Free shipping on all orders over ₹15000 | Code: NESTRO10
        </p>
      </div>

      {/* Main Navigation Bar */}
      <nav className="w-full bg-[#FAF7F2] border-b border-[#EFE8DF] transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 md:h-20">
            
            {/* Logo */}
            <div className="flex-shrink-0">
              <Link href="/" className="flex items-center gap-0.5 group">
                <span className="text-xl md:text-2xl font-bold tracking-[0.2em] text-[#1A1A1A] transition-colors duration-300 group-hover:text-[#8C6239]">
                  NESTRO
                </span>
                <span className="text-xl md:text-2xl font-extrabold text-[#8C6239] animate-pulse">.</span>
              </Link>
            </div>

            {/* Desktop Navigation Links */}
            <div className="hidden lg:flex items-center gap-1 xl:gap-2">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.name}
                    href={link.href}
                    className={`px-4 py-1.5 rounded-full text-sm font-medium tracking-wide transition-all duration-300 hover:scale-105 active:scale-95 ${
                      isActive
                        ? "bg-[#F3ECE4] text-[#8C6239] shadow-sm"
                        : "text-[#5C5C5C] hover:text-[#8C6239] hover:bg-[#F3ECE4]/40"
                    }`}
                  >
                    {link.name}
                  </Link>
                );
              })}
            </div>

            {/* Right-side Icons */}
            <div className="flex items-center gap-4 md:gap-5">
              
              {/* Search Toggle */}
              <div className="relative flex items-center">
                {searchOpen && (
                  <input
                    type="text"
                    placeholder="Search products..."
                    className="absolute right-8 top-1/2 -translate-y-1/2 w-40 md:w-56 bg-white border border-[#EFE8DF] rounded-full px-3 py-1 text-xs text-[#1A1A1A] placeholder-[#9C9C9C] focus:outline-none focus:border-[#8C6239] transition-all duration-300"
                  />
                )}
                <button
                  onClick={() => setSearchOpen(!searchOpen)}
                  className="text-neutral-700 hover:text-[#8C6239] hover:scale-110 active:scale-95 transition-all duration-200 p-1 cursor-pointer"
                  aria-label="Search"
                >
                  <svg className="w-5 h-5 md:w-[22px] md:h-[22px]" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </button>
              </div>

              {/* Cart Button */}
              <Link href="/cart" className="relative p-1 text-neutral-700 hover:text-[#8C6239] hover:scale-110 active:scale-95 transition-all duration-200" aria-label="Cart">
                <svg className="w-[22px] h-[22px] md:w-6 md:h-6" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-[#8C6239] text-[#FAF7F2] text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center border border-[#FAF7F2]">
                    {cartCount}
                  </span>
                )}
              </Link>

              {/* Profile Button and Dropdown */}
              <div className="relative group hidden sm:block">
                <Link
                  href={user ? "/profile" : "/sign-in"}
                  className={`block transition-all duration-200 hover:scale-105 active:scale-95 ${
                    pathname === "/profile" ? "scale-105" : ""
                  }`}
                  aria-label="Profile"
                >
                  {user ? (
                    /* Initialized Avatar with Highlight ring if on /profile */
                    <div
                      className={`w-8 h-8 rounded-full bg-[#8C6239] text-[#FAF7F2] flex items-center justify-center font-bold text-xs shadow-sm transition-all duration-300 ${
                        pathname === "/profile"
                          ? "ring-2 ring-[#8C6239] ring-offset-2 ring-offset-[#FAF7F2] font-black"
                          : "hover:ring-2 hover:ring-[#8C6239]/40 hover:ring-offset-1"
                      }`}
                    >
                      {user.name
                        ? user.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")
                            .substring(0, 2)
                            .toUpperCase()
                        : "U"}
                    </div>
                  ) : (
                    /* Guest Outline Avatar with highlight ring if page active */
                    <div
                      className={`w-8 h-8 rounded-full border flex items-center justify-center transition-all duration-300 ${
                        pathname === "/profile" || pathname === "/sign-in" || pathname === "/register"
                          ? "border-[#8C6239] bg-[#F3ECE4] text-[#8C6239]"
                          : "border-[#8C6239] text-[#8C6239] hover:bg-[#F3ECE4]"
                      }`}
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                  )}
                </Link>

                {/* Dropdown Menu on Hover */}
                <div className="absolute right-0 top-full pt-2 w-52 opacity-0 invisible translate-y-1 group-hover:opacity-100 group-hover:visible group-hover:translate-y-0 transition-all duration-200 z-50">
                  <div className="bg-white border border-[#EFE8DF] rounded-2xl shadow-xl overflow-hidden py-1.5 flex flex-col">
                    {user ? (
                      <>
                        {/* Header Details */}
                        <div className="px-4 py-2 border-b border-[#EFE8DF]/60 text-left bg-[#FAF7F2]/40">
                          <p className="text-[9px] text-[#8A7973] uppercase tracking-wider font-extrabold">Logged in as</p>
                          <p className="text-xs font-bold text-[#281C19] truncate">{user.name}</p>
                          <p className="text-[10px] text-[#8A7973] truncate">{user.email}</p>
                        </div>
                        {/* Menu Items */}
                        <Link
                          href="/profile"
                          className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-[#281C19] hover:bg-[#FAF7F2] hover:text-[#8C6239] transition-all text-left"
                        >
                          <svg className="w-4 h-4 text-[#8C6239]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                          View Profile
                        </Link>
                        <Link
                          href="/sign-in"
                          onClick={() => {
                            if (typeof window !== "undefined") {
                              localStorage.removeItem("nestro_user");
                              document.cookie = "jwt=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
                              window.dispatchEvent(new Event("userUpdate"));
                            }
                          }}
                          className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-[#281C19] hover:bg-[#FAF7F2] hover:text-[#8C6239] transition-all text-left"
                        >
                          <svg className="w-4 h-4 text-[#8C6239]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                          </svg>
                          Switch Account
                        </Link>
                        <button
                          onClick={handleDeleteAccount}
                          className="w-full flex items-center gap-2 px-4 py-2 text-xs font-bold text-red-600 hover:bg-red-50 transition-all text-left cursor-pointer"
                        >
                          <svg className="w-4 h-4 text-red-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                          Delete Account
                        </button>
                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center gap-2 px-4 py-2 text-xs font-bold text-red-600 hover:bg-red-50 border-t border-[#EFE8DF]/60 pt-2 transition-all text-left cursor-pointer"
                        >
                          <svg className="w-4 h-4 text-red-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                          </svg>
                          Logout
                        </button>
                      </>
                    ) : (
                      <>
                        <Link
                          href="/sign-in"
                          className="flex items-center gap-2 px-4 py-2.5 text-xs font-bold text-[#281C19] hover:bg-[#FAF7F2] hover:text-[#8C6239] transition-all text-left"
                        >
                          Sign In
                        </Link>
                        <Link
                          href="/register"
                          className="flex items-center gap-2 px-4 py-2.5 text-xs font-bold text-[#281C19] hover:bg-[#FAF7F2] hover:text-[#8C6239] transition-all text-left border-t border-[#EFE8DF]/60"
                        >
                          Create Account
                        </Link>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Mobile Menu Toggle */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden text-neutral-700 hover:text-[#8C6239] transition-colors p-1"
                aria-label="Toggle Menu"
              >
                {mobileMenuOpen ? (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                ) : (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                )}
              </button>

            </div>

          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        <div
          className={`lg:hidden overflow-hidden transition-all duration-300 ease-in-out border-t border-[#EFE8DF]/60 bg-[#FAF7F2] ${
            mobileMenuOpen ? "max-h-72 opacity-100 py-3" : "max-h-0 opacity-0 pointer-events-none"
          }`}
        >
          <div className="px-4 space-y-1">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`block px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? "bg-[#F3ECE4] text-[#8C6239]"
                      : "text-[#5C5C5C] hover:text-[#8C6239] hover:bg-[#F3ECE4]/30"
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
            
            {/* Mobile Profile Link */}
            <Link
              href="/profile"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-[#5C5C5C] hover:text-[#8C6239] hover:bg-[#F3ECE4]/30 border-t border-[#EFE8DF]/40 mt-2 pt-2 sm:hidden"
            >
              <div className="w-6 h-6 rounded-full border border-[#8C6239] flex items-center justify-center">
                <svg className="w-3.5 h-3.5 text-[#8C6239]" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <span>My Profile</span>
            </Link>
          </div>
        </div>
      </nav>
    </header>
  );
}
