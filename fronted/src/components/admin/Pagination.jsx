import React from "react";

export default function Pagination({
  totalItems,
  itemsPerPage,
  currentPage,
  onPageChange
}) {
  const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;
  const activePage = Math.min(currentPage, totalPages);
  const startIndex = (activePage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, totalItems);

  if (totalItems === 0) return null;

  return (
    <div className="flex flex-col gap-4 border-t border-[#e2e8f0] px-6 py-5.5 sm:flex-row sm:items-center sm:justify-between dark:border-[#2e3a47] bg-[#fcfdfe] dark:bg-[#18202d] rounded-b-sm transition-colors duration-300">
      <div>
        <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
          Showing <span className="font-bold text-black dark:text-white">{totalItems > 0 ? startIndex + 1 : 0}</span> to{" "}
          <span className="font-bold text-black dark:text-white">{endIndex}</span> of{" "}
          <span className="font-bold text-black dark:text-white">{totalItems}</span> items
        </p>
      </div>
      <div className="flex items-center gap-1.5">
        {/* Prev Button */}
        <button
          type="button"
          disabled={activePage === 1}
          onClick={() => onPageChange(Math.max(activePage - 1, 1))}
          className="flex items-center justify-center h-8.5 px-3 rounded-sm border border-[#e2e8f0] hover:bg-slate-50 disabled:opacity-40 disabled:hover:bg-transparent dark:border-[#2e3a47] dark:hover:bg-[#24303f] dark:disabled:hover:bg-transparent text-sm font-semibold text-black dark:text-white transition-all cursor-pointer"
        >
          Previous
        </button>
        
        {/* Page Number Buttons */}
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
          <button
            key={p}
            type="button"
            onClick={() => onPageChange(p)}
            className={`flex items-center justify-center w-8.5 h-8.5 rounded-sm text-sm font-bold transition-all cursor-pointer ${
              activePage === p
                ? "bg-black text-white dark:bg-white dark:text-black shadow-sm"
                : "border border-[#e2e8f0] hover:bg-slate-50 dark:border-[#2e3a47] dark:hover:bg-[#24303f] text-black dark:text-white"
            }`}
          >
            {p}
          </button>
        ))}

        {/* Next Button */}
        <button
          type="button"
          disabled={activePage === totalPages}
          onClick={() => onPageChange(Math.min(activePage + 1, totalPages))}
          className="flex items-center justify-center h-8.5 px-3 rounded-sm border border-[#e2e8f0] hover:bg-slate-50 disabled:opacity-40 disabled:hover:bg-transparent dark:border-[#2e3a47] dark:hover:bg-[#24303f] dark:disabled:hover:bg-transparent text-sm font-semibold text-black dark:text-white transition-all cursor-pointer"
        >
          Next
        </button>
      </div>
    </div>
  );
}
