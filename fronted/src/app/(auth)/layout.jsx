"use client";

import React from "react";
import { Geist, Geist_Mono } from "next/font/google";
import "../globals.css";
import { usePathname } from "next/navigation";
import { Toaster } from "sonner";
import StoreProvider from "@/store/StoreProvider";
import AuthSidebar from "@/components/common/AuthSidebar";
import Header from "@/components/common/Header";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function AuthLayout({ children }) {
  const pathname = usePathname();
  const isProfile = pathname === "/profile";

  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-screen flex flex-col bg-[#FAF7F2]">
        <StoreProvider>
          <Header/>
          <Toaster position="bottom-right" richColors />
          {isProfile ? (
            // Full width container for Profile Page
            <div className="flex-grow flex flex-col justify-center items-center py-10 px-4">
              {children}
            </div>
          ) : (
            // Split layout container for Auth pages
            <div className="flex-grow flex flex-col lg:flex-row w-full items-stretch overflow-y-auto lg:overflow-hidden" style={{minHeight: 'calc(100vh - 112px)'}}>
              {/* Left Column (Sidebar) */}
              <AuthSidebar />
              
              {/* Right Column (Form Content) */}
              <div className="flex-grow flex items-start lg:items-center justify-center py-8 lg:py-8 px-4 sm:px-8 lg:px-16 bg-[#FAF7F2] lg:h-full lg:overflow-y-auto">
                {children}
              </div>
            </div>
          )}
        </StoreProvider>
      </body>
    </html>
  );
}
