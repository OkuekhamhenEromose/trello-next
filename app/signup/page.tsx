'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Checkbox } from '@/components/ui/checkbox'
import { AlertTriangle } from 'lucide-react'
import TrelloLogo from '@/components/TrelloLogo'
import { useAuth } from '@/contexts/AuthContext'

export default function SignupPage() {
  const router = useRouter()
  const { register, isLoading } = useAuth()
  const [email, setEmail] = useState('')
  const [username, setUsername] = useState('')
  const [fullName, setFullName] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [agreed, setAgreed] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (password !== confirmPassword) {
      setError('Passwords do not match')
      return
    }

    if (!agreed) {
      setError('You must agree to the terms')
      return
    }

    // Validate email exists
  if (!email) {
    setError('Email is required')
    return
  }

    try {
    // Generate username from email safely
    const generatedUsername = username || (email.split('@')[0] || `user_${Date.now()}`)
    
    await register({
      email,
      username: generatedUsername,
      password,
      password2: confirmPassword,
      fullname: fullName || generatedUsername // Use fullName or fallback to username
    })
    router.push('/welcome')
  } catch (err: any) {
    setError(err.message || 'Registration failed')
  }
  }

  return (
    <div className="min-h-screen bg-[hsl(220,20%,97%)] flex items-center justify-center relative overflow-hidden">
      {/* Left decorative illustration */}
      <div className="hidden lg:block absolute left-0 bottom-0 w-80">
        <div className="relative w-full h-[500px]">
          <div className="absolute bottom-20 left-10 w-48 h-64 bg-[hsl(210,60%,90%)] rounded-lg opacity-60" />
          <div className="absolute bottom-10 left-20 w-32 h-40 bg-[hsl(200,70%,85%)] rounded-lg opacity-50" />
          <div className="absolute bottom-40 left-6 w-16 h-16 bg-[hsl(150,50%,70%)] rounded-full opacity-40" />
        </div>
      </div>

      {/* Right decorative illustration */}
      <div className="hidden lg:block absolute right-0 bottom-0 w-80">
        <div className="relative w-full h-[500px]">
          <div className="absolute bottom-20 right-10 w-48 h-64 bg-[hsl(350,60%,85%)] rounded-lg opacity-60" />
          <div className="absolute bottom-10 right-20 w-32 h-40 bg-[hsl(200,70%,85%)] rounded-lg opacity-50" />
          <div className="absolute bottom-40 right-6 w-16 h-16 bg-[hsl(210,60%,70%)] rounded-full opacity-40" />
        </div>
      </div>

      {/* Main Card */}
      <div className="w-full max-w-md mx-4 bg-white rounded-lg shadow-elevated p-8 z-10">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <TrelloLogo showAtlassian={false} size="md" />
        </div>

        <h1 className="text-lg font-semibold text-center text-foreground mb-6">Create your account</h1>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded-md mb-4 text-sm">
            {error}
          </div>
        )}

        {/* Warning banner */}
        <div className="bg-[hsl(45,100%,93%)] border border-[hsl(45,80%,80%)] rounded-md p-4 mb-6 flex gap-3">
          <AlertTriangle className="w-5 h-5 text-[hsl(35,90%,50%)] shrink-0 mt-0.5" />
          <p className="text-sm text-foreground">
            We&apos;d like to make sure it&apos;s really you creating your account. Please confirm you&apos;re not a robot.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
              Email address
            </label>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="mt-1 h-10 text-sm"
              required
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
              Username
            </label>
            <Input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Choose a username"
              className="mt-1 h-10 text-sm"
              required
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
              Full name
            </label>
            <Input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Enter your full name"
              className="mt-1 h-10 text-sm"
              required
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
              Password
            </label>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Create a password"
              className="mt-1 h-10 text-sm"
              required
              minLength={6}
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
              Confirm password
            </label>
            <Input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm your password"
              className="mt-1 h-10 text-sm"
              required
            />
          </div>

          <p className="text-xs text-muted-foreground">
            By creating an account, I accept the Atlassian{' '}
            <a href="#" className="text-primary hover:underline">Cloud Terms of Service ↗</a>
            {' '}and acknowledge the{' '}
            <a href="#" className="text-primary hover:underline">Privacy Policy ↗</a>.
          </p>

          {/* reCAPTCHA */}
          <div className="border rounded-md p-3 flex items-center justify-between bg-[hsl(0,0%,98%)]">
            <div className="flex items-center gap-3">
              <Checkbox
                checked={agreed}
                onCheckedChange={(v) => setAgreed(v as boolean)}
                className="w-6 h-6"
                required
              />
              <span className="text-sm">I&apos;m not a robot</span>
            </div>
            <div className="text-right">
              <div className="text-xs text-muted-foreground">reCAPTCHA</div>
              <div className="text-[10px] text-muted-foreground">Privacy - Terms</div>
            </div>
          </div>

          <Button
            type="submit"
            disabled={isLoading}
            className="w-full h-11 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold"
          >
            {isLoading ? 'Creating account...' : 'Create your account'}
          </Button>
        </form>

        <div className="mt-6 text-center">
          <Link href="/login" className="text-sm text-primary hover:underline">
            Already have an account? Log in
          </Link>
        </div>

        <div className="mt-8 flex items-center justify-center gap-2 text-muted-foreground">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
          </svg>
          <span className="text-sm font-semibold">ATLASSIAN</span>
        </div>
      </div>
    </div>
  )
}