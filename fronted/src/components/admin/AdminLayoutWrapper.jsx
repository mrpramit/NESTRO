"use client";

import React, { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";
import { Toaster } from "sonner";

export default function AdminLayoutWrapper({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [darkMode, setDarkMode] = useState(true); // Default to dark mode matching screenshot
  const [mounted, setMounted] = useState(false);

  // Sync theme to document element on mount
  useEffect(() => {
    const localTheme = localStorage.getItem("theme");
    let initialDark = true;
    if (localTheme) {
      initialDark = localTheme === "dark";
    } else {
      // Check system preference
      const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
      initialDark = mediaQuery.matches;
    }
    
    setTimeout(() => {
      setDarkMode(initialDark);
      setMounted(true);
    }, 0);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    const root = window.document.documentElement;
    if (darkMode) {
      root.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      root.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode, mounted]);

  return (
    <div className="flex h-screen overflow-hidden bg-[#f1f5f9] dark:bg-[#121824] text-slate-800 dark:text-[#a3b1c6] font-sans transition-colors duration-300">
      <Toaster position="top-right" richColors />
      
      {/* Sidebar Navigation */}
      <Sidebar 
        sidebarOpen={sidebarOpen} 
        setSidebarOpen={setSidebarOpen} 
        sidebarCollapsed={sidebarCollapsed}
      />

      {/* Main Content Area */}
      <div className="relative flex flex-1 flex-col h-screen overflow-hidden">
        
        {/* Top Header */}
        <Header 
          sidebarOpen={sidebarOpen} 
          setSidebarOpen={setSidebarOpen} 
          sidebarCollapsed={sidebarCollapsed}
          setSidebarCollapsed={setSidebarCollapsed}
          darkMode={darkMode} 
          setDarkMode={setDarkMode} 
        />

        {/* Dynamic page content */}
        <main className="flex-grow overflow-y-auto overflow-x-hidden">
          <div className="mx-auto max-w-screen-2xl p-4 md:p-6 2xl:p-10">
            {children}
          </div>
        </main>
        
      </div>
    </div>
  );
}
