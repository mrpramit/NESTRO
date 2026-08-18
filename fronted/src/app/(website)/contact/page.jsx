"use client";

import React, { useState } from "react";
import Link from "next/link";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    subject: "General Enquiry",
    message: "",
  });

  const [loading, setLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.firstName || !formData.email || !formData.message) return;

    setLoading(true);
    // Simulate submission
    setTimeout(() => {
      setLoading(false);
      setIsSubmitted(true);
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        subject: "General Enquiry",
        message: "",
      });
      // Auto-reset success message after 6 seconds
      setTimeout(() => {
        setIsSubmitted(false);
      }, 6000);
    }, 1200);
  };

  const contactInfo = [
    {
      label: "PHONE",
      value: "+91 98765 43210",
      icon: (
        <svg className="w-5 h-5 text-[#8C6239]" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.657a8.25 8.25 0 0115.485-3.814l2.828 2.828a1.5 1.5 0 010 2.122l-1.06 1.06a1.5 1.5 0 01-2.122 0L15.3 6.75a.75.75 0 00-1.06 0l-1.06 1.06a1.5 1.5 0 01-2.122 0l-3.535-3.536a1.5 1.5 0 010-2.122L8.583 1.1A.75.75 0 007.52 1.1l-2.12 2.12a1.5 1.5 0 000 2.122l2.828 2.828a8.25 8.25 0 01-3.813 15.486l-2.828-2.828a1.5 1.5 0 010-2.122l1.06-1.06a1.5 1.5 0 012.122 0L6.75 15.3a.75.75 0 001.06 0l1.06-1.06a1.5 1.5 0 012.122 0l3.536 3.535a1.5 1.5 0 010 2.122l-1.06 1.06a.75.75 0 000 1.06l2.12 2.12a1.5 1.5 0 002.122 0l2.828-2.828a8.25 8.25 0 01-15.485 3.813z" />
        </svg>
      ),
    },
    {
      label: "EMAIL",
      value: "hello@Nestro.in",
      icon: (
        <svg className="w-5 h-5 text-[#8C6239]" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
        </svg>
      ),
    },
    {
      label: "HOURS",
      value: "Mon - Sat, 10am - 7pm IST",
      icon: (
        <svg className="w-5 h-5 text-[#8C6239]" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
    {
      label: "FLAGSHIP SHOWROOM",
      value: "MI Road, Jaipur, Rajasthan",
      icon: (
        <svg className="w-5 h-5 text-[#8C6239]" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25s-7.5-4.108-7.5-11.25a7.5 7.5 0 1115 0z" />
        </svg>
      ),
    },
  ];

  const showrooms = [
    {
      city: "Jaipur",
      address: "MI Road, near Ajmeri Gate",
      hours: "10am - 7pm",
    },
    {
      city: "Mumbai",
      address: "Bandra West, Linking Road",
      hours: "11am - 8pm",
    },
    {
      city: "Bangalore",
      address: "Indiranagar, 100ft Road",
      hours: "10am - 7pm",
    },
  ];

  return (
    <main className="bg-[#FAF7F2] pb-16 flex-grow font-sans">
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-12">
        {/* Title Header */}
        <div className="space-y-1 mb-10 text-left">
          <span className="text-[10px] md:text-xs font-bold tracking-[0.2em] text-[#8C6239] uppercase block">
            GET IN TOUCH
          </span>
          <h1 className="text-3xl md:text-4xl font-bold text-[#281C19] tracking-tight">
            We'd love to hear from you
          </h1>
          <p className="text-sm md:text-base text-[#8A7973] max-w-2xl leading-relaxed mt-2">
            Whether it's a question, a custom order, or just a love note — we're here.
          </p>
        </div>

        {/* Contact Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Side Panel (Info cards & Map link) */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Info Items List Container */}
            <div className="bg-white border border-[#EFE8DF] rounded-[24px] p-6 md:p-8 space-y-6 shadow-sm">
              {contactInfo.map((info) => (
                <div key={info.label} className="flex gap-4 items-start group/item">
                  <div className="w-10 h-10 rounded-full bg-[#FAF7F2] flex items-center justify-center flex-shrink-0 group-hover/item:bg-[#F3ECE4] group-hover/item:scale-105 transition-all duration-300 border border-[#EFE8DF]/40">
                    <div className="transform group-hover/item:rotate-6 transition-transform duration-300">
                      {info.icon}
                    </div>
                  </div>
                  <div className="space-y-0.5">
                    <span className="text-[9px] font-bold text-[#8A7973] tracking-widest uppercase block">
                      {info.label}
                    </span>
                    <span className="text-xs md:text-sm font-semibold text-[#281C19] block group-hover/item:text-[#8C6239] transition-colors duration-200">
                      {info.value}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Map Link Card */}
            <a
              href="https://maps.google.com"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-[#281C19] border border-transparent hover:border-[#8C6239]/50 rounded-[24px] p-8 flex flex-col items-center justify-center text-center gap-3.5 transition-all duration-300 group hover:shadow-xl hover:shadow-[#8C6239]/10 h-56 cursor-pointer relative overflow-hidden"
            >
              {/* Subtle map glow background overlay */}
              <div className="absolute top-0 right-0 w-44 h-44 bg-[#8C6239]/5 rounded-full blur-3xl pointer-events-none" />
              
              <div className="w-12 h-12 rounded-full bg-[#3E2A24] flex items-center justify-center border border-[#8C6239]/30 group-hover:scale-110 transition-transform duration-300">
                <svg className="w-6 h-6 text-[#FAF7F2]" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 6.75V15m6-8.25V15m-9 3h12a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0018 4.5H6a2.25 2.25 0 00-2.25 2.25v9.25A2.25 2.25 0 006 18z" />
                </svg>
              </div>
              <span className="text-sm font-semibold text-[#FAF7F2] tracking-wider group-hover:text-[#C4A484] transition-colors duration-200">
                View on Google Maps
              </span>
            </a>

          </div>

          {/* Right Side Form Panel */}
          <div className="lg:col-span-7 bg-white border border-[#EFE8DF] rounded-[24px] p-6 md:p-8 shadow-sm relative overflow-hidden min-h-[500px]">
            {isSubmitted ? (
              // Success visual state
              <div className="absolute inset-0 bg-white flex flex-col items-center justify-center text-center p-6 space-y-4 animate-fade-in">
                <div className="w-16 h-16 rounded-full bg-[#FAF7F2] border border-[#8C6239]/30 flex items-center justify-center text-[#8C6239] animate-bounce">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-[#281C19]">Message Sent Successfully!</h3>
                <p className="text-xs md:text-sm text-[#8A7973] max-w-sm leading-relaxed">
                  Thank you for reaching out to Nestro. Our team will review your message and respond within 24 hours.
                </p>
                <button
                  onClick={() => setIsSubmitted(false)}
                  className="text-xs font-bold text-[#8C6239] hover:text-[#724E2B] underline mt-4 cursor-pointer"
                >
                  Send another message
                </button>
              </div>
            ) : null}

            {/* Title & Subtitle inside the form */}
            <div className="space-y-1 mb-6">
              <h2 className="text-lg md:text-xl font-bold text-[#281C19] tracking-tight">
                Send us a message
              </h2>
              <p className="text-[11px] md:text-xs text-[#8A7973]">
                We typically respond within 24 hours.
              </p>
            </div>

            {/* Contact Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Row for Name fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col">
                  <label htmlFor="firstName" className="text-[10px] md:text-xs font-bold text-[#8A7973] mb-1.5 uppercase tracking-wide">
                    First Name
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    id="firstName"
                    required
                    placeholder="Rahul"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    className="bg-[#FAF7F2]/40 border border-[#EFE8DF] rounded-xl px-4 py-2.5 text-xs md:text-sm text-[#281C19] placeholder-[#8A7973]/50 focus:outline-none focus:border-[#8C6239] focus:bg-white transition-all duration-200"
                  />
                </div>
                <div className="flex flex-col">
                  <label htmlFor="lastName" className="text-[10px] md:text-xs font-bold text-[#8A7973] mb-1.5 uppercase tracking-wide">
                    Last Name
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    id="lastName"
                    placeholder="Khanna"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    className="bg-[#FAF7F2]/40 border border-[#EFE8DF] rounded-xl px-4 py-2.5 text-xs md:text-sm text-[#281C19] placeholder-[#8A7973]/50 focus:outline-none focus:border-[#8C6239] focus:bg-white transition-all duration-200"
                  />
                </div>
              </div>

              {/* Email Address input */}
              <div className="flex flex-col">
                <label htmlFor="email" className="text-[10px] md:text-xs font-bold text-[#8A7973] mb-1.5 uppercase tracking-wide">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  id="email"
                  required
                  placeholder="rahul@email.com"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="bg-[#FAF7F2]/40 border border-[#EFE8DF] rounded-xl px-4 py-2.5 text-xs md:text-sm text-[#281C19] placeholder-[#8A7973]/50 focus:outline-none focus:border-[#8C6239] focus:bg-white transition-all duration-200"
                />
              </div>

              {/* Subject dropdown list */}
              <div className="flex flex-col">
                <label htmlFor="subject" className="text-[10px] md:text-xs font-bold text-[#8A7973] mb-1.5 uppercase tracking-wide">
                  Subject
                </label>
                <select
                  name="subject"
                  id="subject"
                  value={formData.subject}
                  onChange={handleInputChange}
                  className="bg-[#FAF7F2]/40 border border-[#EFE8DF] rounded-xl px-4 py-2.5 text-xs md:text-sm text-[#281C19] focus:outline-none focus:border-[#8C6239] focus:bg-white transition-all duration-200"
                >
                  <option value="General Enquiry">General Enquiry</option>
                  <option value="Custom Furniture Order">Custom Furniture Order</option>
                  <option value="Partnership Inquiry">Partnership Inquiry</option>
                  <option value="Support & Returns">Support & Returns</option>
                  <option value="Other">Other Inquiry</option>
                </select>
              </div>

              {/* Message textarea box */}
              <div className="flex flex-col">
                <label htmlFor="message" className="text-[10px] md:text-xs font-bold text-[#8A7973] mb-1.5 uppercase tracking-wide">
                  Message
                </label>
                <textarea
                  name="message"
                  id="message"
                  required
                  rows={4}
                  placeholder="Tell us how we can help..."
                  value={formData.message}
                  onChange={handleInputChange}
                  className="bg-[#FAF7F2]/40 border border-[#EFE8DF] rounded-xl px-4 py-2.5 text-xs md:text-sm text-[#281C19] placeholder-[#8A7973]/50 focus:outline-none focus:border-[#8C6239] focus:bg-white transition-all duration-200 resize-none"
                />
              </div>

              {/* Submit Button inside Form */}
              <button
                type="submit"
                disabled={loading}
                className="bg-[#8C6239] text-[#FAF7F2] font-semibold py-3 px-6 rounded-xl text-xs md:text-sm w-full hover:bg-[#724E2B] active:scale-98 transform transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer disabled:bg-[#8A7973] disabled:cursor-not-allowed hover:shadow-lg hover:shadow-[#8C6239]/20"
              >
                {loading ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    Send Message
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L6 12zm0 0h7.5" />
                    </svg>
                  </>
                )}
              </button>
            </form>
          </div>

        </div>

        {/* Bottom Showrooms Section */}
        <div className="mt-16 md:mt-20">
          <div className="space-y-1 mb-8 text-left">
            <span className="text-[10px] md:text-xs font-bold tracking-[0.2em] text-[#8C6239] uppercase block">
              SHOWROOMS
            </span>
          </div>

          {/* Showroom Cards list grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {showrooms.map((room) => (
              <div
                key={room.city}
                className="bg-white border border-[#EFE8DF] rounded-[20px] p-5 flex flex-col justify-between hover:shadow-md hover:border-[#8C6239]/40 hover:-translate-y-1 transition-all duration-300 group cursor-default"
              >
                <div className="space-y-1">
                  <h3 className="font-bold text-[#281C19] text-sm md:text-base group-hover:text-[#8C6239] transition-colors duration-200">
                    {room.city}
                  </h3>
                  <p className="text-xs text-[#8A7973] leading-relaxed">
                    {room.address}
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-[#EFE8DF]/60 flex justify-between items-center text-[10px] md:text-xs text-[#8A7973] font-medium">
                  <span>Open Hours:</span>
                  <span className="text-[#281C19] font-semibold">{room.hours}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </section>
    </main>
  );
}
