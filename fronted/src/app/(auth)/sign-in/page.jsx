"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { loginUser } from "@/utils/api";
import { toast } from "sonner";
import { FiEye, FiEyeOff } from "react-icons/fi";

export default function LoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
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
    if (!formData.email || !formData.password) {
      toast.error("Please enter email and password");
      return;
    }

    try {
      setLoading(true);
      const res = await loginUser(formData);
      if (res.success) {
        toast.success(res.message || "Logged in successfully!");
        
        if (typeof window !== "undefined" && res.data?.user) {
          localStorage.setItem("nestro_user", JSON.stringify(res.data.user));
        }

        router.push("/profile");
      } else {
        if (res.message && res.message.toLowerCase().includes("verify your email")) {
          toast.warning(res.message);
          if (typeof window !== "undefined") {
            sessionStorage.setItem("verify_email", formData.email);
          }
          router.push(`/verify-otp?email=${encodeURIComponent(formData.email)}`);
        } else {
          toast.error(res.message || "Invalid credentials");
        }
      }
    } catch (err) {
      toast.error("Could not sign in. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-[440px] bg-white border border-[#EFE8DF] rounded-[24px] p-5 md:p-6 shadow-xl shadow-[#8C6239]/4 space-y-4">
      {/* Segmented Switcher Tabs */}
      <div className="bg-[#F3ECE4]/50 p-1 rounded-xl flex w-full">
        <Link
          href="/sign-in"
          className="flex-1 text-center py-2.5 rounded-lg text-xs font-extrabold bg-white text-[#8C6239] shadow-sm transition-all duration-300"
        >
          Sign in
        </Link>
        <Link
          href="/register"
          className="flex-1 text-center py-2.5 rounded-lg text-xs font-bold text-[#8A7973] hover:text-[#281C19] transition-all duration-300"
        >
          Create account
        </Link>
      </div>

      {/* Header title */}
      <div className="space-y-1">
        <h2 className="text-xl font-bold text-[#281C19] tracking-tight">Welcome back</h2>
        <p className="text-xs text-[#8A7973]">Sign in to your Nestro account to continue.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Email Input */}
        <div className="space-y-1">
          <label className="text-[10px] font-extrabold text-[#281C19] uppercase tracking-wider block">Email address</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="rahul@email.com"
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
          <div className="text-right">
            <Link href="#" className="text-[10px] font-bold text-[#8A7973] hover:text-[#8C6239] hover:underline transition-colors">
              Forgot password?
            </Link>
          </div>
        </div>

        {/* Sign-in button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-[#8C6239] hover:bg-[#724E2B] text-[#FAF7F2] font-bold py-3 px-4 rounded-xl text-xs uppercase tracking-widest transition-all hover:shadow-md active:scale-[0.99] flex items-center justify-center disabled:opacity-50 disabled:pointer-events-none mt-1 cursor-pointer shadow-sm hover:shadow"
        >
          {loading ? (
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            "Sign in"
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
          Don't have an account?{" "}
          <Link href="/register" className="font-bold text-[#8C6239] hover:underline">
            Create one free
          </Link>
        </p>
      </div>

      {/* Admin Login Divider */}
      <div className="relative flex items-center justify-center py-0.5">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-[#EFE8DF]"></div>
        </div>
        <span className="relative bg-white px-3 text-[9px] font-bold text-[#8A7973]/60 uppercase tracking-wider">Admin</span>
      </div>

      {/* Admin Login Link */}
      <div className="text-center">
        <Link
          href="/admin-login"
          id="admin-login-link"
          className="inline-flex items-center gap-1.5 text-[10px] font-bold text-[#8A7973] hover:text-[#281C19] border border-[#EFE8DF] hover:border-[#8C6239]/40 rounded-lg px-4 py-2 transition-all hover:bg-[#FAF7F2]/50 group"
        >
          <svg className="w-3 h-3 text-[#8C6239] group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
          Admin Login
        </Link>
      </div>
    </div>
  );
}
