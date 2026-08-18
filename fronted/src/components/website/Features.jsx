"use client";

import React from "react";

export default function Features() {
  const items = [
    {
      icon: (
        <svg className="w-5 h-5 text-[#8C6239]" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.75a1.125 1.125 0 01-1.125-1.125V9.75c0-.621.504-1.125 1.125-1.125h9.75c.621 0 1.125.504 1.125 1.125v5.625c0 .621-.504 1.125-1.125 1.125H8.25zM19.5 10.5h.375c.621 0 1.125.504 1.125 1.125v3.375c0 .621-.504 1.125-1.125 1.125h-.375M16.5 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h3.75a1.125 1.125 0 001.125-1.125V13.5h-4.875v5.25z" />
        </svg>
      ),
      title: "Free Delivery",
      desc: "On all orders above ₹50,000"
    },
    {
      icon: (
        <svg className="w-5 h-5 text-[#8C6239]" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
        </svg>
      ),
      title: "30-Day Returns",
      desc: "Hassle-free return policy"
    },
    {
      icon: (
        <svg className="w-5 h-5 text-[#8C6239]" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125" />
        </svg>
      ),
      title: "Expert Assembly",
      desc: "Professional setup at home"
    },
    {
      icon: (
        <svg className="w-5 h-5 text-[#8C6239]" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.57-.598-3.749A11.96 11.96 0 0112 2.714z" />
        </svg>
      ),
      title: "5-Year Warranty",
      desc: "On all furniture items"
    }
  ];

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="bg-white rounded-[20px] border border-[#EFE8DF] shadow-sm overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 divide-y lg:divide-y-0 lg:divide-x divide-[#EFE8DF]/70">
          {items.map((item, index) => (
            <div key={index} className="flex flex-col items-center justify-center text-center p-6 space-y-2 group hover:bg-white hover:-translate-y-1 hover:shadow-lg hover:shadow-[#8C6239]/5 rounded-xl transition-all duration-300 cursor-default">
              <div className="w-10 h-10 rounded-full bg-[#FAF7F2] flex items-center justify-center group-hover:bg-[#F3ECE4] group-hover:scale-110 transition-all duration-300">
                <div className="transform group-hover:rotate-6 transition-transform duration-300">
                  {item.icon}
                </div>
              </div>
              <h3 className="text-sm font-bold text-[#281C19] tracking-wide transition-colors duration-300 group-hover:text-[#8C6239]">
                {item.title}
              </h3>
              <p className="text-[11px] text-[#8A7973]">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
