import React from "react";

export default function ProductIllustration({ name = "", category = "", isLarge = false }) {
  const cName = category.toLowerCase();
  const pName = name.toLowerCase();
  const containerClass = `w-full h-full flex items-center justify-center bg-[#F3ECE4]/40 rounded-xl ${
    isLarge ? "min-h-[300px] md:min-h-[450px] rounded-3xl" : ""
  }`;

  if (cName.includes("sofa") || pName.includes("sofa") || pName.includes("loveseat") || pName.includes("sectional")) {
    return (
      <div className={containerClass}>
        <svg className={`${isLarge ? "w-64 h-48" : "w-24 h-16"} text-[#8C6239]/80`} fill="currentColor" viewBox="0 0 120 80">
          <rect x="15" y="20" width="90" height="30" rx="6" />
          <rect x="22" y="25" width="36" height="20" rx="3" fill="#C4A484" />
          <rect x="62" y="25" width="36" height="20" rx="3" fill="#C4A484" />
          <rect x="10" y="30" width="12" height="25" rx="4" />
          <rect x="98" y="30" width="12" height="25" rx="4" />
          <rect x="15" y="48" width="90" height="10" rx="2" />
          <line x1="20" y1="58" x2="20" y2="65" stroke="#8C6239" strokeWidth="4" strokeLinecap="round" />
          <line x1="100" y1="58" x2="100" y2="65" stroke="#8C6239" strokeWidth="4" strokeLinecap="round" />
        </svg>
      </div>
    );
  }

  if (
    cName.includes("storage") ||
    cName.includes("cabinet") ||
    cName.includes("unit") ||
    pName.includes("bookcase") ||
    pName.includes("cabinet") ||
    pName.includes("stand") ||
    pName.includes("wardrobe")
  ) {
    return (
      <div className={containerClass}>
        <svg className={`${isLarge ? "w-48 h-64" : "w-12 h-16"} text-[#8C6239]/80`} fill="currentColor" viewBox="0 0 80 100">
          <rect x="15" y="10" width="50" height="80" rx="4" fill="none" stroke="#8C6239" strokeWidth="4" />
          <line x1="15" y1="32" x2="65" y2="32" stroke="#8C6239" strokeWidth="4" />
          <line x1="15" y1="54" x2="65" y2="54" stroke="#8C6239" strokeWidth="4" />
          <line x1="15" y1="76" x2="65" y2="76" stroke="#8C6239" strokeWidth="4" />
          <rect x="20" y="18" width="8" height="10" rx="1" fill="#C4A484" />
          <rect x="30" y="16" width="6" height="12" rx="1" fill="#D2C4B9" />
          <rect x="52" y="38" width="10" height="12" rx="1" fill="#C4A484" />
          <circle cx="30" cy="70" r="4" fill="#D2C4B9" />
        </svg>
      </div>
    );
  }

  if (cName.includes("table") || pName.includes("table") || pName.includes("desk") || pName.includes("coffee")) {
    return (
      <div className={containerClass}>
        <svg className={`${isLarge ? "w-56 h-48" : "w-20 h-16"} text-[#8C6239]/80`} fill="currentColor" viewBox="0 0 100 80">
          <ellipse cx="50" cy="35" rx="35" ry="12" />
          <rect x="42" y="42" width="6" height="22" rx="1" />
          <rect x="52" y="42" width="6" height="22" rx="1" />
          <ellipse cx="50" cy="64" rx="16" ry="5" />
        </svg>
      </div>
    );
  }

  if (cName.includes("chair") || pName.includes("chair") || pName.includes("armchair") || pName.includes("pouf")) {
    return (
      <div className={containerClass}>
        <svg className={`${isLarge ? "w-48 h-48" : "w-16 h-16"} text-[#8C6239]/80`} fill="currentColor" viewBox="0 0 100 80">
          <rect x="25" y="15" width="50" height="40" rx="10" />
          <rect x="18" y="30" width="10" height="25" rx="4" />
          <rect x="72" y="30" width="10" height="25" rx="4" />
          <rect x="25" y="40" width="50" height="15" rx="4" fill="#C4A484" />
          <line x1="32" y1="55" x2="28" y2="66" stroke="#8C6239" strokeWidth="4" strokeLinecap="round" />
          <line x1="68" y1="55" x2="72" y2="66" stroke="#8C6239" strokeWidth="4" strokeLinecap="round" />
        </svg>
      </div>
    );
  }

  return (
    <div className={containerClass}>
      <svg className={`${isLarge ? "w-56 h-48" : "w-20 h-16"} text-[#8C6239]/80`} fill="currentColor" viewBox="0 0 100 80">
        <rect x="20" y="20" width="60" height="40" rx="6" />
        <rect x="28" y="25" width="44" height="15" rx="2" fill="#C4A484" />
        <line x1="24" y1="60" x2="24" y2="68" stroke="#8C6239" strokeWidth="4" strokeLinecap="round" />
        <line x1="76" y1="60" x2="76" y2="68" stroke="#8C6239" strokeWidth="4" strokeLinecap="round" />
      </svg>
    </div>
  );
}
