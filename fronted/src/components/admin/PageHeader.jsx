import React from "react";
import Link from "next/link";

export default function PageHeader({ title, description, actionText, actionHref, backHref }) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-3">
        {backHref && (
          <Link
            href={backHref}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-black hover:bg-slate-100 dark:bg-[#1c2434] dark:text-white dark:hover:bg-[#24303f] border border-[#e2e8f0] dark:border-[#2e3a47] transition-all shrink-0"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </Link>
        )}
        <div>
          <h1 className="text-2xl font-bold text-black dark:text-white sm:text-3xl">
            {title}
          </h1>
          {description && (
            <p className="mt-1 text-sm font-medium text-slate-400">
              {description}
            </p>
          )}
        </div>
      </div>

      {actionText && actionHref && (
        <Link
          href={actionHref}
          className="inline-flex items-center justify-center rounded-sm bg-black px-6 py-3 text-center font-medium text-white hover:bg-opacity-90 dark:bg-white dark:text-black dark:hover:bg-opacity-90 transition-all duration-150 shadow-sm"
        >
          <span className="mr-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
          </span>
          {actionText}
        </Link>
      )}
    </div>
  );
}
