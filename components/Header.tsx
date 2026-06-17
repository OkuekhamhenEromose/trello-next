'use client'

import { useState, useCallback } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ChevronDown, Menu, X } from 'lucide-react'
import { Button } from '@/components/ui/button'

// Define proper type for nav items
type NavItem = {
  label: string
  hasDropdown: boolean
  href: string
}

const navItems: readonly NavItem[] = [
  { label: 'Features', hasDropdown: false, href: '/' },
  { label: 'Solutions', hasDropdown: false, href: '/' },
  { label: 'Plans', hasDropdown: false, href: '/' },
  { label: 'Pricing', hasDropdown: false, href: '/' },
  { label: 'Resources', hasDropdown: false, href: '/' },
] as const

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const pathname = usePathname()

  const handleMobileMenuToggle = useCallback(() => {
    setMobileMenuOpen(prev => !prev)
  }, [])

  const closeMobileMenu = useCallback(() => {
    setMobileMenuOpen(false)
  }, [])

  return (
    <header className="w-full bg-white border-b border-[var(--color-border)]">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-10 flex items-center justify-between h-20">
        {/* Logo */}
        <div className="flex items-center gap-10">
          <Link href="/" className="flex items-center gap-2" onClick={closeMobileMenu}>
            <div className="flex flex-col leading-none">
              <span className="text-[10px] font-bold tracking-[0.18em] text-[var(--color-trello-navy)] uppercase">
                Atlassian
              </span>
              <div className="flex items-center gap-1.5 mt-0.5">
                <svg
                  width="28"
                  height="28"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden="true"
                >
                  <rect width="24" height="24" rx="3" fill="#0052CC" />
                  <rect x="3.5" y="3.5" width="7" height="13" rx="1" fill="white" />
                  <rect x="13.5" y="3.5" width="7" height="9" rx="1" fill="white" />
                </svg>
                <span className="text-3xl font-extrabold text-[var(--color-trello-navy)] tracking-tight">
                  Trello
                </span>
              </div>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                prefetch={false}
                className="flex items-center gap-1 px-4 py-2 text-[17px] font-medium text-[var(--color-trello-navy)] hover:text-[var(--color-primary)] transition-colors"
              >
                {item.label}
                {item.hasDropdown && <ChevronDown className="w-4 h-4" strokeWidth={2.5} />}
              </Link>
            ))}
          </nav>
        </div>

        {/* Desktop Actions */}
        <div className="hidden lg:flex items-center gap-2">
          <Link
            href="/login"
            className="px-5 py-3 text-[17px] font-medium text-[var(--color-trello-navy)] hover:text-[var(--color-primary)] transition-colors"
          >
            Log in
          </Link>
          <Link
            href="/signup"
            className="px-6 py-3 text-[17px] font-semibold text-white bg-[var(--color-primary)] hover:bg-[var(--color-trello-blue-light)] transition-colors rounded-sm"
          >
            Get Trello for free
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="lg:hidden text-white p-2"
          onClick={handleMobileMenuToggle}
          aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={mobileMenuOpen}
        >
          {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-trello-navy border-t border-white/10">
          <nav className="container mx-auto px-4 py-4 flex flex-col gap-2">
            {navItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                prefetch={false}
                className="flex items-center justify-between py-3 text-white/90 hover:text-white transition-colors"
                onClick={closeMobileMenu}
              >
                {item.label}
              </Link>
            ))}
            <div className="flex flex-col gap-3 mt-4 pt-4 border-t border-white/10">
              <Button className="text-white justify-start bg-transparent hover:bg-white/10" asChild>
                <Link href="/login" prefetch={false} onClick={closeMobileMenu}>
                  Log in
                </Link>
              </Button>
              <Button className="bg-primary hover:bg-trello-blue-light text-white" asChild>
                <Link href="/signup" prefetch={false} onClick={closeMobileMenu}>
                  Get Trello for free
                </Link>
              </Button>
            </div>
          </nav>
        </div>
      )}
    </header>
  )
}