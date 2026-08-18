import React from "react";

export default function SearchAndFilter({
  searchTerm,
  onSearchChange,
  searchPlaceholder = "Search...",
  filters = []
}) {
  return (
    <div className="rounded-sm border border-[#e2e8f0] bg-white p-4 shadow-sm dark:border-[#2e3a47] dark:bg-[#1c2434] transition-colors duration-300">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        {/* Search Box */}
        <div className="relative flex-1 max-w-md">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
          </span>
          <input
            type="text"
            placeholder={searchPlaceholder}
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full rounded-sm border border-[#e2e8f0] bg-[#f8fafc] py-3 pl-12 pr-4 text-black outline-none focus:border-[#3c50e0] dark:border-[#2e3a47] dark:bg-[#24303f] dark:text-white dark:focus:border-blue-500 transition-colors"
          />
        </div>

        {/* Filters */}
        {filters.length > 0 && (
          <div className="flex flex-wrap items-center gap-3">
            {filters.map((filter, index) => (
              <div className="relative" key={index}>
                <select
                  value={filter.value}
                  onChange={(e) => filter.onChange(e.target.value)}
                  className="appearance-none rounded-sm border border-[#e2e8f0] bg-[#f8fafc] py-3 pl-5 pr-10 text-black outline-none focus:border-[#3c50e0] dark:border-[#2e3a47] dark:bg-[#24303f] dark:text-white dark:focus:border-blue-500 transition-colors cursor-pointer"
                >
                  {filter.options.map((opt) => (
                    <option key={opt.value} value={opt.value} className="dark:bg-[#1c2434]">
                      {opt.label}
                    </option>
                  ))}
                </select>
                <span className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <polyline points="6 9 12 15 18 9" />
                  </svg>
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
