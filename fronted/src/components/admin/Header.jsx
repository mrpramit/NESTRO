"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  MenuIcon,
  SearchIcon,
  SunIcon,
  MoonIcon,
  BellIcon,
  MessageIcon,
  ChevronDownIcon
} from "./Icons";

export default function Header({
  sidebarOpen,
  setSidebarOpen,
  sidebarCollapsed,
  setSidebarCollapsed,
  darkMode,
  setDarkMode
}) {
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [notifDropdownOpen, setNotifDropdownOpen] = useState(false);
  const profileRef = useRef(null);
  const notifRef = useRef(null);

  // Close dropdowns on clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setProfileDropdownOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(event.target)) {
        setNotifDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-30 flex w-full bg-white dark:bg-[#1c2434] border-b border-[#e2e8f0] dark:border-[#2e3a47] drop-shadow-1 dark:drop-shadow-none transition-colors duration-300">
      <div className="flex flex-grow items-center justify-between px-4 py-4 shadow-2 md:px-6 2xl:px-11">
        
        {/* Left Side: Burger Menu & Search */}
        <div className="flex items-center gap-3 mr-4">
          {/* Hamburger toggle */}
          <button
            onClick={() => {
              if (window.innerWidth >= 1024) {
                setSidebarCollapsed(!sidebarCollapsed);
              } else {
                setSidebarOpen(!sidebarOpen);
              }
            }}
            className="z-50 block rounded-sm border border-[#e2e8f0] bg-white p-1.5 shadow-sm dark:border-[#2e3a47] dark:bg-[#24303f] text-black dark:text-white cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
            aria-label="Toggle Sidebar"
          >
            <MenuIcon className="w-5 h-5" />
          </button>
        </div>


        {/* Search Command Input */}
        <div className="hidden sm:block">
          <form action="" method="POST">
            <div className="relative">
              <button className="absolute left-0 top-1/2 -translate-y-1/2 text-body dark:text-bodydark hover:text-primary">
                <SearchIcon className="w-5 h-5 text-slate-400 dark:text-slate-300" />
              </button>
              <input
                type="text"
                placeholder="Search or type command..."
                className="w-full bg-transparent pl-9 pr-4 text-black focus:outline-none dark:text-white xl:w-125 placeholder:text-slate-400 dark:placeholder:text-slate-400"
              />
              <span className="absolute right-0 top-1/2 -translate-y-1/2 hidden md:inline-flex items-center gap-1 rounded bg-[#f1f5f9] dark:bg-[#24303f] px-1.5 py-0.5 text-xs font-medium text-slate-400 dark:text-slate-300 border border-[#e2e8f0] dark:border-[#2e3a47]">
                <span>⌘</span><span>K</span>
              </span>
            </div>
          </form>
        </div>

        {/* Right Side: Theme, Notif, Messages, User Profile */}
        <div className="flex items-center gap-3 2x1:gap-7 ml-auto">
          {/* Action Icons List */}
          <ul className="flex items-center gap-2 2x1:gap-4">
            {/* Dark Mode Switcher */}
            <li>
              <button
                onClick={() => setDarkMode(!darkMode)}
                className="relative flex h-8.5 w-8.5 items-center justify-center rounded-full border border-[#e2e8f0] bg-[#f7f9fc] hover:text-blue-600 dark:border-[#2e3a47] dark:bg-[#24303f] dark:hover:text-blue-400 text-black dark:text-white transition-colors"
                aria-label="Toggle Theme"
              >
                {darkMode ? <SunIcon className="w-5 h-5" /> : <MoonIcon className="w-5 h-5" />}
              </button>
            </li>

            {/* Notifications Panel */}
            <li className="relative" ref={notifRef}>
              <button
                onClick={() => setNotifDropdownOpen(!notifDropdownOpen)}
                className="relative flex h-8.5 w-8.5 items-center justify-center rounded-full border border-[#e2e8f0] bg-[#f7f9fc] text-black hover:text-blue-600 dark:border-[#2e3a47] dark:bg-[#24303f] dark:text-white dark:hover:text-blue-400 transition-colors"
              >
                <span className="absolute -top-0.5 -right-0.5 z-1 h-2 w-2 rounded-full bg-red-500 animate-ping"></span>
                <span className="absolute -top-0.5 -right-0.5 z-1 h-2 w-2 rounded-full bg-red-500"></span>
                <BellIcon className="w-5 h-5" />
              </button>

              {/* Notification Dropdown list */}
              {notifDropdownOpen && (
                <div className="absolute -right-27 mt-2.5 flex h-90 w-75 flex-col rounded-sm border border-[#e2e8f0] bg-white shadow-default dark:border-[#2e3a47] dark:bg-[#1c2434] sm:right-0 sm:w-80 transition-all duration-300">
                  <div className="px-4.5 py-3 border-b border-[#e2e8f0] dark:border-[#2e3a47]">
                    <h5 className="text-sm font-medium text-slate-500 dark:text-slate-300">Notification</h5>
                  </div>
                  <ul className="flex h-auto flex-col overflow-y-auto divide-y divide-[#e2e8f0] dark:divide-[#2e3a47]">
                    <li>
                      <a className="flex flex-col gap-2.5 border-t border-[#e2e8f0] px-4.5 py-3 hover:bg-[#f7f9fc] dark:border-[#2e3a47] dark:hover:bg-[#24303f]" href="#">
                        <p className="text-sm text-black dark:text-white">
                          <span className="text-black font-semibold dark:text-white">Edit your information in a minutes</span>
                          {" "}Scribble some words in user profile page.
                        </p>
                        <p className="text-xs text-[#8a99ad]">12 May, 2026</p>
                      </a>
                    </li>
                    <li>
                      <a className="flex flex-col gap-2.5 border-t border-[#e2e8f0] px-4.5 py-3 hover:bg-[#f7f9fc] dark:border-[#2e3a47] dark:hover:bg-[#24303f]" href="#">
                        <p className="text-sm text-black dark:text-white">
                          <span className="text-black font-semibold dark:text-white">New layout uploaded</span>
                          {" "}Check layouts panel to check out premium pages.
                        </p>
                        <p className="text-xs text-[#8a99ad]">24 Feb, 2026</p>
                      </a>
                    </li>
                  </ul>
                </div>
              )}
            </li>

            {/* Messages Panel */}
            <li className="relative">
              <button
                className="relative flex h-8.5 w-8.5 items-center justify-center rounded-full border border-[#e2e8f0] bg-[#f7f9fc] text-black hover:text-blue-600 dark:border-[#2e3a47] dark:bg-[#24303f] dark:text-white dark:hover:text-blue-400 transition-colors"
              >
                <span className="absolute -top-0.5 -right-0.5 z-1 h-2 w-2 rounded-full bg-emerald-500"></span>
                <MessageIcon className="w-5 h-5" />
              </button>
            </li>
          </ul>

          {/* User Area */}
          <div className="relative" ref={profileRef}>
            <button
              onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
              className="flex items-center gap-4 text-left"
            >
              <span className="hidden text-right lg:block">
                <span className="block text-sm font-medium text-black dark:text-white">
                  Musharof
                </span>
                <span className="block text-xs text-[#8a99ad]">
                  Admin Specialist
                </span>
              </span>

              {/* User Avatar */}
              <div className="h-10 w-10 rounded-full overflow-hidden border border-[#e2e8f0] dark:border-[#2e3a47] bg-blue-100 flex items-center justify-center">
                <span className="font-semibold text-blue-600">MU</span>
              </div>

              <ChevronDownIcon className="hidden sm:block w-4 h-4 text-slate-400 dark:text-slate-300" />
            </button>

            {/* User Dropdown */}
            {profileDropdownOpen && (
              <div className="absolute right-0 mt-4 flex w-62.5 flex-col rounded-sm border border-[#e2e8f0] bg-white shadow-default dark:border-[#2e3a47] dark:bg-[#1c2434] transition-all duration-300">
                <ul className="flex flex-col gap-5 border-b border-[#e2e8f0] px-6 py-5 dark:border-[#2e3a47]">
                  <li>
                    <a className="flex items-center gap-3.5 text-sm font-medium text-black dark:text-white duration-300 ease-in-out hover:text-blue-500" href="/admin/profile">
                      My Profile
                    </a>
                  </li>
                  <li>
                    <a className="flex items-center gap-3.5 text-sm font-medium text-black dark:text-white duration-300 ease-in-out hover:text-blue-500" href="/admin/settings">
                      Account Settings
                    </a>
                  </li>
                </ul>
                <button className="flex items-center gap-3.5 px-6 py-4 text-sm font-medium text-slate-500 hover:text-red-500 dark:text-slate-300 dark:hover:text-red-400 transition-colors">
                  Log Out
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
