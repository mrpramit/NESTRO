"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { loginAdmin } from "@/utils/api";
import { toast } from "sonner";
import { FiEye, FiEyeOff, FiShield, FiLock, FiMail } from "react-icons/fi";

export default function AdminLoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      toast.error("Please enter email and password");
      return;
    }

    try {
      setLoading(true);
      const res = await loginAdmin(formData);

      if (res.success) {
        const user = res.data?.user;

        // Role check: only admin or superAdmin allowed
        if (user?.role !== "admin" && user?.role !== "superAdmin") {
          toast.error("Access denied. Admin privileges required.");
          return;
        }

        toast.success("Welcome back, Admin!");

        if (typeof window !== "undefined" && user) {
          localStorage.setItem("nestro_admin", JSON.stringify(user));
        }

        router.push("/admin");
      } else {
        if (res.message?.toLowerCase().includes("verify your email")) {
          toast.warning(res.message);
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
    <div className="min-h-screen bg-[#0F0A07] flex items-center justify-center px-4 relative overflow-hidden">
      {/* Background glow effects */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-[#8C6239]/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-[#4A2E14]/20 rounded-full blur-[100px] pointer-events-none" />

      {/* Grid pattern overlay */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "linear-gradient(#8C6239 1px, transparent 1px), linear-gradient(90deg, #8C6239 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      <div className="relative w-full max-w-[420px] z-10">
        {/* Logo / Brand */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-[#8C6239] to-[#4A2E14] shadow-lg shadow-[#8C6239]/30 mb-4">
            <FiShield className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">
            NESTRO Admin
          </h1>
          <p className="text-sm text-[#8A7973] mt-1">
            Secure admin portal access
          </p>
        </div>

        {/* Card */}
        <div className="bg-white/[0.05] backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-2xl">
          {/* Warning badge */}
          <div className="flex items-center gap-2 bg-[#8C6239]/10 border border-[#8C6239]/20 rounded-xl px-4 py-2.5 mb-6">
            <FiShield className="w-4 h-4 text-[#C49A6C] flex-shrink-0" />
            <p className="text-xs text-[#C49A6C] font-medium">
              Restricted — Admin access only
            </p>
          </div>

          <h2 className="text-lg font-bold text-white mb-1">
            Sign in to Dashboard
          </h2>
          <p className="text-xs text-[#8A7973] mb-6">
            Enter your admin credentials to continue.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-extrabold text-[#8A7973] uppercase tracking-wider block">
                Email Address
              </label>
              <div className="relative">
                <FiMail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8A7973]" />
                <input
                  type="email"
                  name="email"
                  id="admin-email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="admin@nestro.com"
                  disabled={loading}
                  className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-3.5 py-2.5 text-xs text-white placeholder-[#8A7973]/50 focus:outline-none focus:border-[#8C6239] focus:bg-white/10 focus:ring-2 focus:ring-[#8C6239]/20 transition-all disabled:opacity-50"
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-extrabold text-[#8A7973] uppercase tracking-wider block">
                Password
              </label>
              <div className="relative">
                <FiLock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8A7973]" />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  id="admin-password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  disabled={loading}
                  className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-10 py-2.5 text-xs text-white placeholder-[#8A7973]/50 focus:outline-none focus:border-[#8C6239] focus:bg-white/10 focus:ring-2 focus:ring-[#8C6239]/20 transition-all disabled:opacity-50"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8A7973] hover:text-white transition-colors p-1"
                >
                  {showPassword ? (
                    <FiEyeOff className="w-4 h-4" />
                  ) : (
                    <FiEye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              id="admin-login-btn"
              disabled={loading}
              className="w-full mt-2 bg-gradient-to-r from-[#8C6239] to-[#724E2B] hover:from-[#9E7044] hover:to-[#8C6239] text-white font-bold py-3 px-4 rounded-xl text-xs uppercase tracking-widest transition-all hover:shadow-lg hover:shadow-[#8C6239]/25 active:scale-[0.99] flex items-center justify-center gap-2 disabled:opacity-50 disabled:pointer-events-none cursor-pointer"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <FiShield className="w-4 h-4" />
                  Access Dashboard
                </>
              )}
            </button>
          </form>

          {/* Back link */}
          <div className="text-center mt-6">
            <a
              href="/sign-in"
              className="text-xs text-[#8A7973] hover:text-[#C49A6C] transition-colors"
            >
              ← Back to customer sign-in
            </a>
          </div>
        </div>

        {/* Footer note */}
        <p className="text-center text-[10px] text-[#8A7973]/50 mt-6">
          Unauthorized access attempts are logged and reported.
        </p>
      </div>
    </div>
  );
}
