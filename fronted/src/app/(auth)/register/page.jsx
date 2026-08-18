"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { registerUser } from "@/utils/api";
import { toast } from "sonner";
import { FiEye, FiEyeOff } from "react-icons/fi";

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.password) {
      toast.error("Please fill in all fields");
      return;
    }
    if (formData.password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    try {
      setLoading(true);
      const res = await registerUser(formData);
      if (res.success) {
        toast.success(res.message || "Registration successful!");
        if (typeof window !== "undefined") {
          sessionStorage.setItem("verify_email", formData.email);
        }
        router.push(`/verify-otp?email=${encodeURIComponent(formData.email)}`);
      } else {
        toast.error(res.message || "Registration failed");
      }
    } catch (err) {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-[440px] bg-white border border-[#EFE8DF] rounded-[24px] p-6 md:p-8 shadow-xl shadow-[#8C6239]/4 space-y-6">
      {/* Segmented Switcher Tabs */}
      <div className="bg-[#F3ECE4]/50 p-1 rounded-xl flex w-full">
        <Link
          href="/sign-in"
          className="flex-1 text-center py-2.5 rounded-lg text-xs font-bold text-[#8A7973] hover:text-[#281C19] transition-all duration-300"
        >
          Sign in
        </Link>
        <Link
          href="/register"
          className="flex-1 text-center py-2.5 rounded-lg text-xs font-extrabold bg-white text-[#8C6239] shadow-sm transition-all duration-300"
        >
          Create account
        </Link>
      </div>

      {/* Header title */}
      <div className="space-y-1">
        <h2 className="text-xl font-bold text-[#281C19] tracking-tight">Get started</h2>
        <p className="text-xs text-[#8A7973]">Create a new Nestro account to continue.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Full Name Input */}
        <div className="space-y-1">
          <label className="text-[10px] font-extrabold text-[#281C19] uppercase tracking-wider block">Full name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="John Doe"
            disabled={loading}
            className="w-full bg-[#FAF7F2]/40 border border-[#EFE8DF] rounded-xl px-3.5 py-2.5 text-xs text-[#281C19] placeholder-[#8A7973]/50 focus:outline-none focus:border-[#8C6239] focus:bg-white focus:ring-2 focus:ring-[#8C6239]/10 transition-all disabled:opacity-50"
          />
        </div>

        {/* Email Input */}
        <div className="space-y-1">
          <label className="text-[10px] font-extrabold text-[#281C19] uppercase tracking-wider block">Email address</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="john@example.com"
            disabled={loading}
            className="w-full bg-[#FAF7F2]/40 border border-[#EFE8DF] rounded-xl px-3.5 py-2.5 text-xs text-[#281C19] placeholder-[#8A7973]/50 focus:outline-none focus:border-[#8C6239] focus:bg-white focus:ring-2 focus:ring-[#8C6239]/10 transition-all disabled:opacity-50"
          />
        </div>

        {/* Password Input */}
        <div className="space-y-1">
          <label className="text-[10px] font-extrabold text-[#281C19] uppercase tracking-wider block">Password</label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
              disabled={loading}
              className="w-full bg-[#FAF7F2]/40 border border-[#EFE8DF] rounded-xl pl-3.5 pr-10 py-2.5 text-xs text-[#281C19] placeholder-[#8A7973]/50 focus:outline-none focus:border-[#8C6239] focus:bg-white focus:ring-2 focus:ring-[#8C6239]/10 transition-all disabled:opacity-50"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8A7973] hover:text-[#281C19] transition-colors p-1"
            >
              {showPassword ? <FiEyeOff className="w-4 h-4" /> : <FiEye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Create account button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-[#8C6239] hover:bg-[#724E2B] text-[#FAF7F2] font-bold py-3 px-4 rounded-xl text-xs uppercase tracking-widest transition-all hover:shadow-md active:scale-[0.99] flex items-center justify-center disabled:opacity-50 disabled:pointer-events-none mt-1 cursor-pointer shadow-sm hover:shadow"
        >
          {loading ? (
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            "Create Account"
          )}
        </button>
      </form>

      {/* Divider */}
      <div className="relative flex items-center justify-center py-1">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-[#EFE8DF]"></div>
        </div>
        <span className="relative bg-white px-3 text-[10px] font-bold text-[#8A7973] uppercase tracking-wider">or</span>
      </div>

      {/* Social options */}
      <div className="flex gap-3">
        <button className="flex-1 bg-white border border-[#EFE8DF] hover:border-[#8C6239]/40 rounded-xl py-2.5 px-3 text-xs font-bold text-[#281C19] flex items-center justify-center gap-2 hover:bg-[#FAF7F2]/30 active:scale-[0.98] transition-all cursor-pointer">
          <svg className="w-4 h-4 flex-shrink-0" viewBox="0 0 24 24" fill="currentColor">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05" />
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.53 12-4.53z" fill="#EA4335" />
          </svg>
          Google
        </button>
        <button className="flex-1 bg-white border border-[#EFE8DF] hover:border-[#8C6239]/40 rounded-xl py-2.5 px-3 text-xs font-bold text-[#281C19] flex items-center justify-center gap-2 hover:bg-[#FAF7F2]/30 active:scale-[0.98] transition-all cursor-pointer">
          <svg className="w-4 h-4 flex-shrink-0" viewBox="0 0 24 24" fill="currentColor">
            <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 4.17c.67-.81 1.11-1.93.99-3.06-1 .04-2.17.67-2.88 1.49-.62.71-1.16 1.85-1.01 2.96 1.12.09 2.23-.58 2.9-1.39z" />
          </svg>
          Apple
        </button>
      </div>

      {/* Alternative Footer */}
      <div className="text-center pt-1">
        <p className="text-xs text-[#8A7973]">
          Already have an account?{" "}
          <Link href="/sign-in" className="font-bold text-[#8C6239] hover:underline">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}
