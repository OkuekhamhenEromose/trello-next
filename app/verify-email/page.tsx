"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2, CheckCircle } from "lucide-react";
import { api } from "@/services/api";

export default function VerifyEmailPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [resendLoading, setResendLoading] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [canResend, setCanResend] = useState(true);
  const [verificationStatus, setVerificationStatus] = useState<
    "pending" | "verifying" | "success" | "error"
  >("pending");
  const [error, setError] = useState("");

  useEffect(() => {
    const emailParam = searchParams.get("email");
    const tokenParam = searchParams.get("token");

    console.log("🔍 URL params:", { emailParam, tokenParam });

    if (tokenParam && emailParam) {
      setEmail(emailParam);
      setVerificationStatus("verifying");
      
      const verify = async () => {
        try {
          console.log("🔍 Calling verifyEmail API...");
          const response = await api.verifyEmail(emailParam, undefined, tokenParam);
          console.log("✅ Verify response:", response);
          
          if (response.verified) {
            setVerificationStatus("success");
            
            // Store verification data
            sessionStorage.setItem("emailVerified", "true");
            sessionStorage.setItem("verificationEmail", emailParam);
            sessionStorage.setItem("verificationToken", tokenParam);
            
            console.log("✅ Verification successful, redirecting in 2 seconds...");
            
            // Redirect to setup account with token
            setTimeout(() => {
              router.push(`/setup-account?email=${emailParam}&token=${tokenParam}`);
            }, 2000);
          } else {
            console.error("❌ Verification failed: response.verified is false");
            setError("Verification failed. Please try again.");
            setVerificationStatus("error");
          }
        } catch (err: any) {
          console.error("❌ Verification error:", err);
          console.error("Error response:", err.response?.data);
          setError(err.response?.data?.error || "Verification failed. Please try again.");
          setVerificationStatus("error");
        }
      };
      
      verify();
    } else {
      const storedEmail = sessionStorage.getItem("verificationEmail");
      if (storedEmail) {
        setEmail(storedEmail);
      } else {
        router.push("/signup");
      }
    }
  }, [searchParams, router]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    } else if (countdown === 0 && !canResend) {
      setCanResend(true);
    }
    return () => clearTimeout(timer);
  }, [countdown, canResend]);

  const handleOpenEmail = () => {
    window.open("https://mail.google.com", "_blank");
  };

  const handleResend = async () => {
    if (!canResend) return;
    setResendLoading(true);
    setError("");
    try {
      await api.startRegistration(email);
      setCanResend(false);
      setCountdown(60);
    } catch (err: any) {
      setError(err.response?.data?.error || "Failed to resend verification email");
    } finally {
      setResendLoading(false);
    }
  };

  const handleDifferentEmail = () => {
    sessionStorage.removeItem("verificationEmail");
    router.push("/signup");
  };

  const handleRetry = () => {
    const emailParam = searchParams.get("email");
    const tokenParam = searchParams.get("token");
    if (emailParam && tokenParam) {
      setVerificationStatus("verifying");
      setError("");
      // Trigger verification again
      setTimeout(() => {
        window.location.reload();
      }, 500);
    }
  };

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{
        background:
          "linear-gradient(160deg, hsl(212,72%,40%) 0%, hsl(212,80%,32%) 40%, hsl(214,75%,28%) 100%)",
      }}
    >
      {/* Top-left Trello logo */}
      <div className="px-5 py-4">
        <div className="flex items-center gap-2">
          <div
            className="w-8 h-8 rounded-md flex items-center justify-center flex-shrink-0"
            style={{ backgroundColor: "hsl(212,100%,42%)" }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
              <rect x="3" y="3" width="8" height="18" rx="1.5" />
              <rect x="13" y="3" width="8" height="11" rx="1.5" />
            </svg>
          </div>
          <span
            className="text-white font-bold text-xl tracking-tight"
            style={{ fontSize: "20px" }}
          >
            Trello
          </span>
        </div>
      </div>

      {/* Centered content */}
      <div className="flex-1 flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-[460px]">
          {verificationStatus === "verifying" ? (
            <div
              className="rounded-xl p-10 text-center"
              style={{ backgroundColor: "hsl(215,18%,20%)" }}
            >
              <Loader2 className="w-14 h-14 mx-auto mb-5 animate-spin text-blue-400" />
              <h2 className="text-xl font-bold text-white mb-2">
                Verifying your email...
              </h2>
              <p className="text-sm" style={{ color: "hsl(215,15%,65%)" }}>
                Please wait while we verify your email address.
              </p>
            </div>
          ) : verificationStatus === "success" ? (
            <div
              className="rounded-xl p-10 text-center"
              style={{ backgroundColor: "hsl(215,18%,20%)" }}
            >
              <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-5">
                <CheckCircle className="w-9 h-9 text-green-400" />
              </div>
              <h2 className="text-xl font-bold text-white mb-2">
                Email verified!
              </h2>
              <p className="text-sm" style={{ color: "hsl(215,15%,65%)" }}>
                Redirecting you to complete your profile...
              </p>
            </div>
          ) : verificationStatus === "error" ? (
            <div
              className="rounded-xl p-10 text-center"
              style={{ backgroundColor: "hsl(215,18%,20%)" }}
            >
              <div className="w-16 h-16 rounded-full bg-red-500/20 flex items-center justify-center mx-auto mb-5">
                <svg className="w-9 h-9 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
              <h2 className="text-xl font-bold text-white mb-2">
                Verification Failed
              </h2>
              <p className="text-sm mb-4" style={{ color: "hsl(215,15%,65%)" }}>
                {error || "Could not verify your email. Please try again."}
              </p>
              <button
                onClick={handleRetry}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Try Again
              </button>
            </div>
          ) : (
            /* Main verification card */
            <div
              className="rounded-xl overflow-hidden"
              style={{
                backgroundColor: "hsl(215,16%,22%)",
                boxShadow: "0 8px 40px rgba(0,0,0,0.35)",
              }}
            >
              <div className="px-12 pt-10 pb-8">
                {/* Envelope illustration */}
                <div className="flex justify-center mb-7">
                  <svg
                    width="130"
                    height="100"
                    viewBox="0 0 130 100"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <rect x="4" y="18" width="122" height="74" rx="6" fill="hsl(215,15%,60%)" />
                    <rect x="4" y="18" width="122" height="74" rx="6" fill="hsl(215,12%,72%)" />
                    <path d="M4 24 L65 62 L126 24" stroke="hsl(215,12%,62%)" strokeWidth="2" fill="none" />
                    <line x1="4" y1="92" x2="48" y2="55" stroke="hsl(215,12%,62%)" strokeWidth="1.5" />
                    <line x1="126" y1="92" x2="82" y2="55" stroke="hsl(215,12%,62%)" strokeWidth="1.5" />
                    <circle cx="65" cy="60" r="18" fill="hsl(212,85%,52%)" />
                    <rect x="55" y="51" width="7" height="18" rx="1.2" fill="white" />
                    <rect x="65" y="51" width="7" height="11" rx="1.2" fill="white" />
                  </svg>
                </div>

                <h1
                  className="text-center font-bold mb-3"
                  style={{
                    color: "hsl(215,20%,90%)",
                    fontSize: "20px",
                    lineHeight: "1.3",
                  }}
                >
                  Let's verify your email
                </h1>

                <p
                  className="text-center text-sm mb-1"
                  style={{ color: "hsl(215,12%,65%)" }}
                >
                  We sent a verification link to:
                </p>
                <p
                  className="text-center font-bold text-sm mb-7"
                  style={{ color: "hsl(215,20%,88%)" }}
                >
                  {email || "your email address"}
                </p>

                {error && (
                  <div className="bg-red-500/15 border border-red-500/40 text-red-300 rounded-md p-3 mb-5 text-xs text-center">
                    {error}
                  </div>
                )}

                <button
                  onClick={handleOpenEmail}
                  className="w-full h-11 rounded-md font-semibold text-white text-sm mb-2.5 transition-opacity hover:opacity-90 active:opacity-80"
                  style={{ backgroundColor: "hsl(212,85%,52%)" }}
                >
                  Open email
                </button>

                <button
                  onClick={handleResend}
                  disabled={!canResend || resendLoading}
                  className="w-full h-11 rounded-md font-semibold text-sm mb-5 transition-opacity hover:opacity-90 active:opacity-80 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  style={{
                    backgroundColor: "hsl(215,14%,30%)",
                    color: "hsl(215,15%,80%)",
                  }}
                >
                  {resendLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Sending...
                    </>
                  ) : canResend ? (
                    "Resend"
                  ) : (
                    `Resend in ${countdown}s`
                  )}
                </button>

                <div className="text-center">
                  <button
                    onClick={handleDifferentEmail}
                    className="text-sm underline underline-offset-2 transition-opacity hover:opacity-80"
                    style={{ color: "hsl(212,85%,65%)" }}
                  >
                    Sign up with a different email
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}