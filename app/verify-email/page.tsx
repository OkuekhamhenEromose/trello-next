"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Mail, Loader2, ExternalLink, ArrowLeft, CheckCircle } from "lucide-react";
import TrelloLogo from "@/components/TrelloLogo";

export default function VerifyEmailPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [error, setError] = useState("");
  const [countdown, setCountdown] = useState(0);
  const [canResend, setCanResend] = useState(true);
  const [verificationStatus, setVerificationStatus] = useState<"pending" | "verifying" | "success">("pending");

  useEffect(() => {
    const emailParam = searchParams.get("email");
    const tokenParam = searchParams.get("token");

    if (tokenParam && emailParam) {
      setEmail(emailParam);
      setVerificationStatus("verifying");

      const verifyWithToken = async () => {
        try {
          setVerificationStatus("success");
          setTimeout(() => {
            router.push("/setup-account?email=" + emailParam + "&token=" + tokenParam);
          }, 2000);
        } catch (err: any) {
          setError(err.message || "Verification failed. Please try again.");
          setVerificationStatus("pending");
        }
      };

      verifyWithToken();
    } else {
      const storedEmail = sessionStorage.getItem("verificationEmail");
      if (storedEmail) {
        setEmail(storedEmail);
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

  const handleResendEmail = async () => {
    if (!canResend) return;

    setResendLoading(true);
    setError("");

    try {
      setCanResend(false);
      setCountdown(60);
    } catch (err: any) {
      setError(err.message || "Failed to resend verification email");
    } finally {
      setResendLoading(false);
    }
  };

  const handleDifferentEmail = () => {
    sessionStorage.removeItem("verificationEmail");
    router.push("/signup");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0747a6] to-[#0052cc] flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-xl">
        <button
          onClick={() => router.push("/signup")}
          className="flex items-center text-white/70 hover:text-white mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to sign up
        </button>

        <div className="bg-[#1a1a2e] rounded-2xl shadow-2xl p-8 md:p-12">
          <div className="flex justify-center mb-8">
            <TrelloLogo size="md" />
          </div>

          {verificationStatus === "verifying" ? (
            <div className="text-center py-12">
              <Loader2 className="w-16 h-16 text-[#579dff] animate-spin mx-auto mb-6" />
              <h2 className="text-2xl font-bold text-white mb-3">Verifying your email...</h2>
              <p className="text-white/70">Please wait while we verify your email address.</p>
            </div>
          ) : verificationStatus === "success" ? (
            <div className="text-center py-12">
              <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-10 h-10 text-green-400" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-3">Email verified successfully!</h2>
              <p className="text-white/70 mb-2">Now let's set up your account.</p>
              <p className="text-sm text-white/50">Redirecting you to complete your profile...</p>
            </div>
          ) : (
            <>
              <div className="text-center mb-8">
                <div className="w-20 h-20 bg-[#2c3e50] rounded-full flex items-center justify-center mx-auto mb-6">
                  <Mail className="w-10 h-10 text-[#579dff]" />
                </div>
                <h1 className="text-3xl font-bold text-white mb-3">Let's verify your email</h1>
                <p className="text-white/70 mb-4">We sent a verification link to:</p>
                <div className="bg-[#2c3e50] p-4 rounded-lg inline-block">
                  <p className="text-white font-semibold break-all">{email}</p>
                </div>
              </div>

              {error && (
                <div className="bg-red-500/20 border border-red-500/50 text-red-300 p-4 rounded-lg mb-6 text-sm">
                  {error}
                </div>
              )}

              <div className="space-y-4">
                <Button
                  onClick={handleOpenEmail}
                  className="w-full h-12 bg-[#579dff] hover:bg-[#85b8ff] text-white font-semibold rounded-lg transition-all transform hover:scale-[1.02]"
                >
                  <ExternalLink className="w-5 h-5 mr-2" />
                  Open email
                </Button>

                <p className="text-sm text-white/60 text-center">Didn't receive the email? Check your spam folder</p>

                <Button
                  onClick={handleResendEmail}
                  disabled={!canResend || resendLoading}
                  className="w-full h-12 bg-[#2c3e50] hover:bg-[#3d4c5c] text-white font-semibold rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {resendLoading ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Sending...
                    </>
                  ) : canResend ? (
                    "Resend verification email"
                  ) : (
                    `Resend in ${countdown}s`
                  )}
                </Button>
              </div>

              <div className="mt-8 text-center">
                <button
                  onClick={handleDifferentEmail}
                  className="text-sm text-[#579dff] hover:text-[#85b8ff] transition-colors"
                >
                  Sign up with a different email
                </button>
              </div>
            </>
          )}

          <div className="mt-8 flex items-center justify-center gap-2 text-white/50">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
            </svg>
            <span className="text-sm font-semibold">ATLASSIAN</span>
          </div>

          <p className="text-xs text-white/40 text-center mt-4">One account for Trello, Jira, Confluence and more.</p>
        </div>

        <p className="text-xs text-white/40 text-center mt-6">
          This site is protected by reCAPTCHA and the Google{" "}
          <a href="#" className="text-[#579dff] hover:underline">
            Privacy Policy
          </a>{" "}
          and{" "}
          <a href="#" className="text-[#579dff] hover:underline">
            Terms of Service
          </a>{" "}
          apply.
        </p>
      </div>
    </div>
  );
}
