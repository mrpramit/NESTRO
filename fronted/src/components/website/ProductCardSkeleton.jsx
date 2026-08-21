import React from "react";

export default function ProductCardSkeleton({ compact = false }) {
  return (
    <div
      className="animate-pulse overflow-hidden rounded-2xl border border-[#EFE8DF] bg-white flex h-full flex-col"
      aria-label="Loading product"
      role="status"
    >
      <div className={compact ? "h-32 shrink-0 bg-[#F3ECE4]/60 sm:h-36 md:h-40 lg:h-32" : "aspect-[4/3] w-full shrink-0 bg-[#F3ECE4]/60"} />
      <div className={compact ? "flex flex-1 flex-col justify-between gap-3 p-3" : "flex flex-1 flex-col gap-4 p-5"}>
        <div className="space-y-2">
          <div className="h-2 w-16 rounded bg-[#F3ECE4]" />
          <div className="h-3 w-4/5 rounded bg-[#F3ECE4]" />
        </div>
        <div className="flex items-center justify-between gap-3">
          <div className="h-3 w-20 rounded bg-[#F3ECE4]" />
          <div className="h-3 w-14 rounded bg-[#F3ECE4]" />
        </div>
        {!compact && <div className="h-10 w-full rounded-xl bg-[#F3ECE4]" />}
      </div>
      <span className="sr-only">Loading product</span>
    </div>
  );
}
