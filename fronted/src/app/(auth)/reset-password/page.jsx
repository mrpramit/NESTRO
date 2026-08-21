"use client";

import React, { Suspense, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { resetUserPassword } from "@/utils/api";
import { toast } from "sonner";

function ResetPasswordForm() {
  const router = useRouter();
  const token = useSearchParams().get("token");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!token) return toast.error("This password reset link is invalid.");
    if (password.length < 6) return toast.error("Password must be at least 6 characters");
    if (password !== confirmPassword) return toast.error("Passwords do not match");

    setLoading(true);
    const result = await resetUserPassword({ token, password });
    setLoading(false);

    if (result.success) {
      toast.success(result.message);
      router.replace("/sign-in");
    } else {
      toast.error(result.message);
    }
  };

  return (
    <div className="w-full max-w-[440px] bg-white border border-[#EFE8DF] rounded-[24px] p-6 md:p-8 shadow-xl shadow-[#8C6239]/4 space-y-6">
      <div className="space-y-1">
        <h1 className="text-xl font-bold text-[#281C19] tracking-tight">Choose a new password</h1>
        <p className="text-xs text-[#8A7973]">Use at least six characters for your new password.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input type="password" value={password} onChange={(event) => setPassword(event.target.value)} placeholder="New password" disabled={loading} className="w-full bg-[#FAF7F2]/40 border border-[#EFE8DF] rounded-xl px-3.5 py-2.5 text-xs text-[#281C19] focus:outline-none focus:border-[#8C6239]" />
        <input type="password" value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} placeholder="Confirm new password" disabled={loading} className="w-full bg-[#FAF7F2]/40 border border-[#EFE8DF] rounded-xl px-3.5 py-2.5 text-xs text-[#281C19] focus:outline-none focus:border-[#8C6239]" />
        <button type="submit" disabled={loading || !token} className="w-full bg-[#8C6239] hover:bg-[#724E2B] text-[#FAF7F2] font-bold py-3 px-4 rounded-xl text-xs uppercase tracking-widest transition-all disabled:opacity-50">
          {loading ? "Updating..." : "Reset password"}
        </button>
      </form>

      <Link href="/sign-in" className="block text-center text-xs font-bold text-[#8C6239] hover:underline">Back to sign in</Link>
    </div>
  );
}

export default function ResetPasswordPage() {
  return <Suspense fallback={<div className="text-xs text-[#8A7973]">Loading reset form...</div>}><ResetPasswordForm /></Suspense>;
}
