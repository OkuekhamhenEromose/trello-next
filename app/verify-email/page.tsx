'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Mail, Loader2, ExternalLink, ArrowLeft, CheckCircle } from 'lucide-react';
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

  // Check for token in URL (when user clicks email link) - THIS MUST RUN FIRST!
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const urlToken = urlParams.get('token');
    const urlEmail = urlParams.get('email');

    console.log('🔍 VerifyEmailPage - URL params:', { urlToken, urlEmail });

    if (urlToken && urlEmail) {
      // We have URL params, use them directly without checking sessionStorage
      setEmail(urlEmail);
      setToken(urlToken);
      setVerificationStatus('verifying');
      
      const verifyWithToken = async () => {
        try {
          console.log('🔍 Verifying email with token:', urlToken);
          const response = await api.verifyEmail(urlEmail, undefined, urlToken);
          
          console.log('🔍 Verify response:', response);
          
          if (response.verified) {
            setVerificationStatus('success');
            
            // Store verification data in session storage for the setup page
            sessionStorage.setItem('emailVerified', 'true');
            sessionStorage.setItem('verificationEmail', urlEmail);
            sessionStorage.setItem('verificationToken', urlToken);
            
            console.log('✅ Session storage after verification:', {
              emailVerified: sessionStorage.getItem('emailVerified'),
              verificationEmail: sessionStorage.getItem('verificationEmail'),
              verificationToken: sessionStorage.getItem('verificationToken')
            });
            
            // Redirect to setup account page after 2 seconds
            setTimeout(() => {
              console.log('➡️ Redirecting to /setup-account');
              router.push('/setup-account');
            }, 2000);
          } else {
            setError('Verification failed. Please try again.');
            setVerificationStatus('pending');
          }
        } catch (error: any) {
          console.error('❌ Verification error:', error);
          setError(error.response?.data?.error || 'Verification failed. Please try again.');
          setVerificationStatus('pending');
        }
      };

      verifyWithToken();
    } else {
      // No URL params, check session storage (for when user navigates directly to this page)
      const storedEmail = sessionStorage.getItem('verificationEmail');
      const storedToken = sessionStorage.getItem('verificationToken');
      
      console.log('🔍 VerifyEmailPage - Session storage:', { 
        storedEmail, 
        storedToken 
      });
      
      if (!storedEmail) {
        console.log('❌ No stored email found and no URL params, redirecting to signup');
        router.push('/signup');
        return;
      }
      
      setEmail(storedEmail);
      setToken(storedToken || '');
    }
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

  // Also fix the SVG attribute warnings by removing className from SVG elements
  // I'll update the SVG in the return statement

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
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <h2 className="text-xl font-semibold text-[#172b4d] mb-2">Email verified successfully!</h2>
              <p className="text-[#44546f] mb-4">Now let's set up your account.</p>
              <p className="text-sm text-[#6b778c]">Redirecting you to complete your profile...</p>
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
