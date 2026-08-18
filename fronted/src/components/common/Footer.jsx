"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Footer() {
  const pathname = usePathname();
  const [email, setEmail] = useState("");

  if (pathname === "/contact") return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle subscription logic here
    alert(`Subscribed with: ${email}`);
    setEmail("");
  };

  return (
    <footer className="w-full bg-[#1F1412] text-[#E5D5CD] font-sans pt-16 pb-8 border-t border-[#EFE8DF]/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 md:gap-12 pb-12">
          
          {/* Brand & Newsletter Column */}
          <div className="lg:col-span-2 space-y-6">
            <div>
              <Link href="/" className="flex items-center gap-0.5 group">
                <span className="text-xl md:text-2xl font-bold tracking-[0.2em] text-[#FAF7F2] transition-colors duration-300 group-hover:text-[#8C6239]">
                  NESTRO
                </span>
                <span className="text-xl md:text-2xl font-extrabold text-[#8C6239]">.</span>
              </Link>
              <p className="mt-4 text-sm text-[#BCAEA5] leading-relaxed max-w-sm">
                Curated furniture for thoughtful homes. Crafted with intention, made to endure.
              </p>
            </div>

            {/* Newsletter Form */}
            <form onSubmit={handleSubmit} className="flex max-w-md w-full">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Your email address"
                className="bg-[#2D1F1C] border border-[#42322E] text-[#FAF7F2] placeholder-[#8A7973] px-4 py-2.5 rounded-l text-sm focus:outline-none focus:border-[#8C6239] flex-1 min-w-0 transition-colors"
              />
              <button
                type="submit"
                className="bg-[#8C6239] text-[#FAF7F2] font-semibold px-6 py-2.5 rounded-r text-sm hover:bg-[#724E2B] transition-colors whitespace-nowrap"
              >
                Subscribe
              </button>
            </form>
          </div>

          {/* Company Links */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold tracking-[0.15em] text-[#8C6239] uppercase">
              Company
            </h4>
            <ul className="space-y-2.5">
              {[
                { name: "Our Story", href: "/about" },
                { name: "Sustainability", href: "/sustainability" },
                { name: "Showrooms", href: "/showrooms" },
                { name: "Careers", href: "/careers" }
              ].map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-sm text-[#BCAEA5] hover:text-[#FAF7F2] transition-all duration-200 inline-block hover:translate-x-1">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support Links */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold tracking-[0.15em] text-[#8C6239] uppercase">
              Support
            </h4>
            <ul className="space-y-2.5">
              {[
                { name: "Track Order", href: "/track-order" },
                { name: "Returns & Exchange", href: "/returns" },
                { name: "Assembly Help", href: "/assembly" },
                { name: "Contact Us", href: "/contact" }
              ].map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-sm text-[#BCAEA5] hover:text-[#FAF7F2] transition-all duration-200 inline-block hover:translate-x-1">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Follow Us / Social Links */}
          <div className="space-y-6">
            <div className="space-y-4">
              <h4 className="text-xs font-bold tracking-[0.15em] text-[#8C6239] uppercase">
                Follow Us
              </h4>
              <ul className="space-y-2.5">
                {[
                  { name: "Instagram", href: "https://instagram.com" },
                  { name: "Pinterest", href: "https://pinterest.com" },
                  { name: "Houzz", href: "https://houzz.com" }
                ].map((link) => (
                  <li key={link.name}>
                    <a
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-[#BCAEA5] hover:text-[#FAF7F2] transition-all duration-200 inline-block hover:translate-x-1"
                    >
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Social Icon Circles */}
            <div className="flex items-center gap-3">
              {/* Instagram */}
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full border border-[#8C6239]/40 flex items-center justify-center text-[#8C6239] hover:text-[#FAF7F2] hover:border-[#8C6239] hover:bg-[#8C6239] hover:scale-110 hover:rotate-6 transition-all duration-300"
                aria-label="Instagram"
              >
                <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37zM17.5 6.5h.01" />
                </svg>
              </a>

              {/* Pinterest */}
              <a
                href="https://pinterest.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full border border-[#8C6239]/40 flex items-center justify-center text-[#8C6239] hover:text-[#FAF7F2] hover:border-[#8C6239] hover:bg-[#8C6239] hover:scale-110 hover:rotate-6 transition-all duration-300"
                aria-label="Pinterest"
              >
                <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                  <path strokeLinecap="round" d="M8 22a9 9 0 0 1-1.9-8.9A9 9 0 1 1 20 12c0 4.4-3.6 8-8 8a7.9 7.9 0 0 1-4-1.1L8 22z" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
              </a>

              {/* Youtube */}
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full border border-[#8C6239]/40 flex items-center justify-center text-[#8C6239] hover:text-[#FAF7F2] hover:border-[#8C6239] hover:bg-[#8C6239] hover:scale-110 hover:rotate-6 transition-all duration-300"
                aria-label="YouTube"
              >
                <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                  <path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46a2.78 2.78 0 0 0-1.95 1.96A29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58 2.78 2.78 0 0 0 1.95 1.96C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.95-1.96A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z" />
                  <polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" fill="currentColor" />
                </svg>
              </a>
            </div>
          </div>

        </div>

        {/* Bottom Bar Divider */}
        <div className="border-t border-[#42322E]/40 pt-8 mt-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-[#8A7973]">
            <p>© 2026 Nestro. All rights reserved.</p>
            <div className="flex items-center gap-6">
              <Link href="/privacy" className="hover:text-white transition-colors duration-200">
                Privacy
              </Link>
              <span>·</span>
              <Link href="/terms" className="hover:text-white transition-colors duration-200">
                Terms
              </Link>
              <span>·</span>
              <Link href="/sitemap" className="hover:text-white transition-colors duration-200">
                Sitemap
              </Link>
            </div>
          </div>
        </div>

      </div>
    </footer>
  );
}
