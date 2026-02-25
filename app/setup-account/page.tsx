'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2, Eye, EyeOff, Check } from 'lucide-react';
import TrelloLogo from '@/components/TrelloLogo';
import { api } from '@/services/api';

export default function SetupAccountPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [token, setToken] = useState('');
  const [fullName, setFullName] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [passwordValid, setPasswordValid] = useState(false);

  useEffect(() => {
    // Check if email is verified
    const emailVerified = sessionStorage.getItem('emailVerified');
    const storedEmail = sessionStorage.getItem('verificationEmail');
    const storedToken = sessionStorage.getItem('verificationToken');
    
    if (!emailVerified || !storedEmail || !storedToken) {
      router.push('/signup');
      return;
    }
    
    setEmail(storedEmail);
    setToken(storedToken);
  }, [router]);

  // Validate password (at least 8 characters as shown in screenshot)
  useEffect(() => {
    setPasswordValid(password.length >= 8);
  }, [password]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!passwordValid) {
      setError('Password must be at least 8 characters long');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Complete registration
      const response = await api.completeRegistration({
        email,
        token,
        fullname: fullName,
        username: email.split('@')[0], // Generate username from email
        password,
        password2: password
      });

      // Clear session storage
      sessionStorage.removeItem('verificationEmail');
      sessionStorage.removeItem('verificationToken');
      sessionStorage.removeItem('emailVerified');

      // Store token and redirect to welcome page
      localStorage.setItem('trello_token', response.token);
      router.push('/welcome');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#f4f5f7] to-white flex items-center justify-center py-8">
      <div className="w-full max-w-md mx-4">
        {/* Main Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8 md:p-10">
          {/* Logo */}
          <div className="flex justify-center mb-6">
            <TrelloLogo showAtlassian={false} size="lg" />
          </div>

          {/* Success message */}
          <div className="flex items-center justify-center gap-2 text-green-600 bg-green-50 p-3 rounded-lg mb-6">
            <Check className="w-5 h-5" />
            <span className="text-sm font-medium">Email address verified</span>
          </div>

          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold text-[#172b4d] mb-2">
              Finish setting up your account
            </h1>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 p-4 rounded-lg mb-6 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email (read-only) */}
            <div>
              <label className="text-sm font-medium text-[#44546f] block mb-2">
                Email address
              </label>
              <div className="bg-[#f4f5f7] p-3 rounded-lg border border-[#dfe1e6]">
                <p className="text-[#172b4d] font-medium">{email}</p>
              </div>
            </div>

            {/* Full Name */}
            <div>
              <label className="text-sm font-medium text-[#44546f] block mb-2">
                Full name
              </label>
              <Input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Enter full name"
                className="w-full h-12 px-4 border-2 border-[#dfe1e6] rounded-lg focus:border-[#0052cc] focus:ring-2 focus:ring-[#0052cc]/20"
                required
              />
            </div>

            {/* Password */}
            <div>
              <label className="text-sm font-medium text-[#44546f] block mb-2">
                Password
              </label>
              <div className="relative">
                <Input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Create password"
                  className="w-full h-12 px-4 pr-12 border-2 border-[#dfe1e6] rounded-lg focus:border-[#0052cc] focus:ring-2 focus:ring-[#0052cc]/20"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#6b778c] hover:text-[#172b4d]"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              
              {/* Password requirement message - exactly as in screenshot */}
              <p className="text-sm text-[#6b778c] mt-2">
                Password must have at least 8 characters
              </p>

              {/* Visual password strength indicator (optional enhancement) */}
              {password && (
                <div className="mt-3">
                  <div className="flex gap-1 h-1.5">
                    <div className={`flex-1 h-full rounded-l ${password.length >= 8 ? 'bg-green-500' : 'bg-gray-200'}`} />
                    <div className={`flex-1 h-full ${password.length >= 12 ? 'bg-green-500' : 'bg-gray-200'}`} />
                    <div className={`flex-1 h-full rounded-r ${password.length >= 16 ? 'bg-green-500' : 'bg-gray-200'}`} />
                  </div>
                  <p className="text-xs text-[#6b778c] mt-1">
                    {password.length < 8 ? 'Weak' : password.length < 12 ? 'Medium' : 'Strong'} password
                  </p>
                </div>
              )}
            </div>

            <p className="text-xs text-[#6b778c]">
              By signing up, I accept the Atlassian{' '}
              <a href="#" className="text-[#0052cc] hover:underline">Cloud Terms of Service</a>{' '}
              and acknowledge the{' '}
              <a href="#" className="text-[#0052cc] hover:underline">Privacy Policy</a>.
            </p>

            <Button
              type="submit"
              disabled={loading || !fullName || !password}
              className="w-full h-12 bg-[#0052cc] hover:bg-[#0065ff] text-white font-semibold rounded-lg transition-all transform hover:scale-[1.02]"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Creating account...
                </>
              ) : (
                'Continue'
              )}
            </Button>
          </form>

          <div className="mt-8 flex items-center justify-center gap-2 text-[#6b778c]">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
            </svg>
            <span className="text-sm font-semibold">ATLASSIAN</span>
          </div>

          <p className="text-xs text-[#6b778c] text-center mt-4">
            One account for Trello, Jira, Confluence and more.
          </p>
        </div>

        {/* reCAPTCHA Notice */}
        <p className="text-xs text-[#6b778c] text-center mt-6">
          This site is protected by reCAPTCHA and the Google{' '}
          <a href="#" className="text-[#0052cc] hover:underline">Privacy Policy</a> and{' '}
          <a href="#" className="text-[#0052cc] hover:underline">Terms of Service</a> apply.
        </p>
      </div>
    </div>
  );
}