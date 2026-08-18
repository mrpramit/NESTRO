"use client";

import React, { useState, useEffect, useRef, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { verifyUserOtp, resendUserOtp } from "@/utils/api";
import { toast } from "sonner";

function VerifyOtpContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [timer, setTimer] = useState(60);
  const inputRefs = useRef([]);

  useEffect(() => {
    // Get email from URL params or sessionStorage
    const emailParam = searchParams.get("email");
    if (emailParam) {
      setEmail(emailParam);
    } else if (typeof window !== "undefined") {
      const sessionEmail = sessionStorage.getItem("verify_email");
      if (sessionEmail) {
        setEmail(sessionEmail);
      } else {
        toast.error("No verification email found. Redirecting to register.");
        router.push("/register");
      }
    }
  }, [searchParams, router]);

  // Resend countdown timer
  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [timer]);

  const handleChange = (index, value) => {
    if (isNaN(value)) return; // Only allow numbers

    const newOtp = [...otp];
    // Take only the last character if multiple are entered
    newOtp[index] = value.substring(value.length - 1);
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (index, e) => {
    // Move to previous input on backspace
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text");
    if (pastedData.length !== 6 || isNaN(pastedData)) {
      toast.error("Please paste a valid 6-digit code");
      return;
    }

    const pastedDigits = pastedData.split("");
    setOtp(pastedDigits);
    // Focus the last input box
    inputRefs.current[5].focus();
  };

  const handleResend = async () => {
    if (timer > 0 || resending) return;

    try {
      setResending(true);
      const res = await resendUserOtp({ email });
      if (res.success) {
        toast.success(res.message || "OTP resent successfully. Check your email!");
        setTimer(60); // Reset timer
      } else {
        toast.error(res.message || "Failed to resend OTP");
      }
    } catch (err) {
      toast.error("Could not resend OTP. Please try again.");
    } finally {
      setResending(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const otpCode = otp.join("");
    if (otpCode.length !== 6) {
      toast.error("Please enter a 6-digit verification code");
      return;
    }

    try {
      setLoading(true);
      const res = await verifyUserOtp({ email, otp: Number(otpCode) });
      if (res.success) {
        toast.success(res.message || "Verification successful!");
        if (typeof window !== "undefined") {
          sessionStorage.removeItem("verify_email");
        }
        router.push("/sign-in");
      } else {
        toast.error(res.message || "Verification failed");
      }
    } catch (err) {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-[440px] bg-white border border-[#EFE8DF] rounded-[24px] p-6 md:p-8 shadow-xl shadow-[#8C6239]/4 space-y-6">
      {/* Header title */}
      <div className="space-y-1">
        <h2 className="text-xl font-bold text-[#281C19] tracking-tight">Verify your email</h2>
        <p className="text-xs text-[#8A7973]">
          We sent a 6-digit verification code to <span className="font-bold text-[#281C19]">{email || "your email"}</span>.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* OTP Input Fields */}
        <div className="flex justify-between gap-2.5" onPaste={handlePaste}>
          {otp.map((digit, idx) => (
            <input
              key={idx}
              type="text"
              inputMode="numeric"
              ref={(el) => (inputRefs.current[idx] = el)}
              value={digit}
              onChange={(e) => handleChange(idx, e.target.value)}
              onKeyDown={(e) => handleKeyDown(idx, e)}
              className="w-12 h-14 text-center text-lg font-extrabold bg-[#FAF7F2]/40 border border-[#EFE8DF] rounded-xl text-[#281C19] focus:outline-none focus:border-[#8C6239] focus:bg-white focus:ring-2 focus:ring-[#8C6239]/10 transition-all text-ellipsis"
              maxLength={1}
              disabled={loading}
              autoFocus={idx === 0}
            />
          ))}
        </div>

        {/* Submit button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-[#8C6239] hover:bg-[#724E2B] text-[#FAF7F2] font-bold py-3 px-4 rounded-xl text-xs uppercase tracking-widest transition-all hover:shadow-md active:scale-[0.99] flex items-center justify-center disabled:opacity-50 disabled:pointer-events-none cursor-pointer shadow-sm hover:shadow"
        >
          {loading ? (
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            "Verify Code"
          )}
        </button>
      </form>

      {/* Resend and Actions Footer */}
      <div className="text-center space-y-4 pt-2">
        <p className="text-xs text-[#8A7973]">
          Didn't receive the code?{" "}
          <button
            onClick={handleResend}
            disabled={timer > 0 || resending}
            className={`font-bold transition-colors ${
              timer > 0 ? "text-gray-400 cursor-not-allowed" : "text-[#8C6239] hover:underline cursor-pointer"
            }`}
          >
            {resending ? "Sending..." : "Resend OTP"}
          </button>
        </p>

        {timer > 0 && (
          <p className="text-[10px] font-bold text-[#8A7973] uppercase tracking-wider bg-[#FAF7F2] inline-block px-3 py-1 rounded-full border border-[#EFE8DF]">
            Resend in {timer}s
          </p>
        )}

        <div className="pt-2">
          <Link href="/register" className="text-xs font-bold text-[#8A7973] hover:text-[#8C6239] transition-colors">
            ← Back to Registration
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function VerifyOtpPage() {
  return (
    <Suspense fallback={
      <div className="w-full max-w-[440px] bg-white border border-[#EFE8DF] rounded-[24px] p-6 md:p-8 shadow-xl shadow-[#8C6239]/4 flex flex-col items-center justify-center py-16 gap-3">
        <div className="w-8 h-8 border-3 border-[#8C6239] border-t-transparent rounded-full animate-spin" />
        <span className="text-xs font-bold text-[#8C6239] tracking-wider uppercase">Loading verification...</span>
      </div>
    }>
      <VerifyOtpContent />
    </Suspense>
  );
}
