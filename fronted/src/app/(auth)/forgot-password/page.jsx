"use client";

import React, { useState } from "react";
import Link from "next/link";
import { requestPasswordReset } from "@/utils/api";
import { toast } from "sonner";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!email) return toast.error("Please enter your email address");

    setLoading(true);
    const result = await requestPasswordReset(email);
    setLoading(false);

    if (result.success) {
      setSent(true);
      toast.success(result.message);
    } else {
      toast.error(result.message);
    }
  };

  return (
    <div className="w-full max-w-[440px] bg-white border border-[#EFE8DF] rounded-[24px] p-6 md:p-8 shadow-xl shadow-[#8C6239]/4 space-y-6">
      <div className="space-y-1">
        <h1 className="text-xl font-bold text-[#281C19] tracking-tight">Reset your password</h1>
        <p className="text-xs text-[#8A7973]">Enter your email and we’ll send you a secure reset link.</p>
      </div>

      {sent ? (
        <div className="rounded-xl border border-emerald-100 bg-emerald-50 p-4 text-xs leading-relaxed text-emerald-800">
          Check your inbox for the reset link. It expires in 15 minutes.
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="text-[10px] font-extrabold text-[#281C19] uppercase tracking-wider block">Email address</label>
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="you@example.com"
              disabled={loading}
              className="w-full bg-[#FAF7F2]/40 border border-[#EFE8DF] rounded-xl px-3.5 py-2.5 text-xs text-[#281C19] focus:outline-none focus:border-[#8C6239] focus:bg-white focus:ring-2 focus:ring-[#8C6239]/10 transition-all disabled:opacity-50"
            />
          </div>
          <button type="submit" disabled={loading} className="w-full bg-[#8C6239] hover:bg-[#724E2B] text-[#FAF7F2] font-bold py-3 px-4 rounded-xl text-xs uppercase tracking-widest transition-all disabled:opacity-50">
            {loading ? "Sending..." : "Send reset link"}
          </button>
        </form>
      )}

      <Link href="/sign-in" className="block text-center text-xs font-bold text-[#8C6239] hover:underline">Back to sign in</Link>
    </div>
  );
}
