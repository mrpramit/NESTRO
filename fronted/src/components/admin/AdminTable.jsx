import React from "react";

export default function AdminTable({
  loading,
  loadingText = "Loading data...",
  empty,
  emptyTitle = "No Data Found",
  emptyDescription = "There are no records matching your request.",
  headers = [],
  children
}) {
  return (
    <div className="rounded-sm border border-[#e2e8f0] bg-white shadow-sm dark:border-[#2e3a47] dark:bg-[#1c2434] transition-colors duration-300 md:overflow-visible overflow-hidden">
      <div className="max-w-full overflow-x-auto md:overflow-visible max-md:min-h-[180px]">
        <table className="w-full min-w-[700px] table-auto border-collapse">
          <thead>
            <tr className="bg-[#f7f9fc] text-left dark:bg-[#24303f] transition-colors duration-300">
              {headers.map((hdr, idx) => {
                const isObj = typeof hdr === "object";
                const label = isObj ? hdr.label : hdr;
                const className = isObj ? hdr.className : "";
                return (
                  <th
                    key={idx}
                    className={`px-6 py-4 text-xs font-semibold uppercase text-slate-400 dark:text-slate-400 ${className}`}
                  >
                    {label}
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={headers.length || 1} className="px-6 py-20 text-center">
                  <div className="flex flex-col items-center justify-center gap-3">
                    <div className="h-10 w-10 animate-spin rounded-full border-4 border-solid border-[#3c50e0] border-t-transparent dark:border-blue-500"></div>
                    <span className="text-sm font-medium text-slate-400">{loadingText}</span>
                  </div>
                </td>
              </tr>
            ) : empty ? (
              <tr>
                <td colSpan={headers.length || 1} className="px-6 py-16 text-center">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <svg className="w-12 h-12 text-slate-300 dark:text-slate-600" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 9h16.5m-16.5 6.75h16.5" />
                    </svg>
                    <span className="text-base font-semibold text-slate-500 dark:text-slate-400">
                      {emptyTitle}
                    </span>
                    {emptyDescription && (
                      <p className="text-xs text-slate-400 max-w-xs mx-auto">
                        {emptyDescription}
                      </p>
                    )}
                  </div>
                </td>
              </tr>
            ) : (
              children
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
