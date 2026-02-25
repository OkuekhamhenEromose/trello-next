'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Mail, Loader2, ExternalLink, ArrowLeft } from 'lucide-react';
import TrelloLogo from '@/components/TrelloLogo';
import { api } from '@/services/api';

export default function VerifyEmailPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [token, setToken] = useState('');
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [error, setError] = useState('');
  const [countdown, setCountdown] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const [verificationStatus, setVerificationStatus] = useState<'pending' | 'verifying' | 'success'>('pending');

  useEffect(() => {
    // Get email and token from session storage
    const storedEmail = sessionStorage.getItem('verificationEmail');
    const storedToken = sessionStorage.getItem('verificationToken');
    
    if (!storedEmail) {
      router.push('/signup');
      return;
    }
    
    setEmail(storedEmail);
    setToken(storedToken || '');
  }, [router]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (!canResend && countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    } else if (countdown === 0) {
      setCanResend(true);
    }
    return () => clearTimeout(timer);
  }, [countdown, canResend]);

  const handleOpenEmail = () => {
    // Open Gmail in a new tab
    window.open('https://mail.google.com', '_blank');
  };

  const handleResendEmail = async () => {
    if (!canResend) return;
    
    setResendLoading(true);
    setError('');
    
    try {
      await api.startRegistration(email);
      setCanResend(false);
      setCountdown(60);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to resend verification email');
    } finally {
      setResendLoading(false);
    }
  };

  const handleDifferentEmail = () => {
    sessionStorage.removeItem('verificationEmail');
    sessionStorage.removeItem('verificationToken');
    router.push('/signup');
  };

  // Check for token in URL (when user clicks email link)
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const urlToken = urlParams.get('token');
    const urlEmail = urlParams.get('email');

    if (urlToken && urlEmail && urlEmail === email) {
      setVerificationStatus('verifying');
      
      // Verify the email
      const verifyWithToken = async () => {
        try {
          const response = await api.verifyEmail(urlEmail, undefined, urlToken);
          if (response.verified) {
            setVerificationStatus('success');
            // Store that email is verified
            sessionStorage.setItem('emailVerified', 'true');
            // Redirect to account setup after 1.5 seconds
            setTimeout(() => {
              router.push('/setup-account');
            }, 1500);
          }
        } catch (error) {
          setError('Verification failed. Please try again.');
          setVerificationStatus('pending');
        }
      };

      verifyWithToken();
    }
  }, [router, email]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#f4f5f7] to-white flex items-center justify-center">
      <div className="w-full max-w-md mx-4">
        {/* Back button */}
        <button
          onClick={() => router.push('/signup')}
          className="flex items-center text-[#6b778c] hover:text-[#172b4d] mb-4 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to sign up
        </button>

        {/* Main Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8 md:p-10">
          {/* Logo */}
          <div className="flex justify-center mb-6">
            <TrelloLogo showAtlassian={false} size="lg" />
          </div>

          {verificationStatus === 'verifying' ? (
            <div className="text-center py-8">
              <Loader2 className="w-12 h-12 text-[#0052cc] animate-spin mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-[#172b4d] mb-2">Verifying your email...</h2>
              <p className="text-[#44546f]">Please wait while we verify your email address.</p>
            </div>
          ) : verificationStatus === 'success' ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="text-xl font-semibold text-[#172b4d] mb-2">Email verified!</h2>
              <p className="text-[#44546f]">Redirecting you to set up your account...</p>
            </div>
          ) : (
            <>
              <div className="text-center mb-8">
                <h1 className="text-2xl font-bold text-[#172b4d] mb-2">
                  Check your email
                </h1>
                <p className="text-[#44546f]">
                  We sent a verification link to:
                </p>
                <div className="mt-3 flex items-center justify-center gap-2 bg-[#f4f5f7] p-3 rounded-lg">
                  <Mail className="w-5 h-5 text-[#0052cc]" />
                  <span className="text-[#172b4d] font-medium break-all">{email}</span>
                </div>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-600 p-4 rounded-lg mb-6 text-sm">
                  {error}
                </div>
              )}

              <div className="space-y-4">
                <Button
                  onClick={handleOpenEmail}
                  className="w-full h-12 bg-[#0052cc] hover:bg-[#0065ff] text-white font-semibold rounded-lg transition-all transform hover:scale-[1.02]"
                >
                  <ExternalLink className="w-5 h-5 mr-2" />
                  Open Gmail
                </Button>

                <p className="text-sm text-[#6b778c] text-center">
                  Didn't receive the email? Check your spam folder
                </p>

                <Button
                  onClick={handleResendEmail}
                  disabled={!canResend || resendLoading}
                  variant="outline"
                  className="w-full h-12 border-2 border-[#dfe1e6] hover:bg-[#f4f5f7] hover:border-[#0052cc] text-[#172b4d] font-medium rounded-lg transition-all"
                >
                  {resendLoading ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Sending...
                    </>
                  ) : canResend ? (
                    'Resend verification email'
                  ) : (
                    `Resend in ${countdown}s`
                  )}
                </Button>
              </div>

              <div className="mt-6 text-center">
                <button
                  onClick={handleDifferentEmail}
                  className="text-sm text-[#0052cc] hover:underline"
                >
                  Use a different email address
                </button>
              </div>
            </>
          )}

          <div className="mt-8 flex items-center justify-center gap-2 text-[#6b778c]">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
            </svg>
            <span className="text-sm font-semibold">ATLASSIAN</span>
          </div>
        </div>
      </div>
    </div>
  );
}