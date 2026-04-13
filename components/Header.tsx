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
    <header className="sticky top-0 z-50 w-full bg-trello-navy supports-[backdrop-filter]:bg-trello-navy/95 backdrop-blur">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 lg:px-8">
        {/* Logo */}
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-2" onClick={closeMobileMenu}>
            <div className="flex h-8 w-8 items-center justify-center rounded bg-white">
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="#0052CC">
                <rect x="3" y="3" width="7" height="18" rx="1.5" />
                <rect x="14" y="3" width="7" height="12" rx="1.5" />
              </svg>
            </div>
            <span className="text-xl font-bold text-white">Trello</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className={`flex items-center gap-1 px-3 py-2 text-sm font-medium transition-colors ${
                  pathname === item.href
                    ? 'text-white'
                    : 'text-white/90 hover:text-white'
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>

        {/* Desktop Actions */}
        <div className="hidden lg:flex items-center gap-4">
          <Button
            className="text-white hover:text-white hover:bg-white/10"
            asChild
          >
            <Link href="/login">Log in</Link>
          </Button>
          <Button className="bg-primary hover:bg-trello-blue-light text-white font-medium" asChild>
            <Link href="/signup">Get Trello for free</Link>
          </Button>
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
                className="flex items-center justify-between py-3 text-white/90 hover:text-white transition-colors"
                onClick={closeMobileMenu}
              >
                {item.label}
              </Link>
            ))}
            <div className="flex flex-col gap-3 mt-4 pt-4 border-t border-white/10">
              <Button className="text-white justify-start bg-transparent hover:bg-white/10" asChild>
                <Link href="/login" onClick={closeMobileMenu}>
                  Log in
                </Link>
              </Button>
              <Button className="bg-primary hover:bg-trello-blue-light text-white" asChild>
                <Link href="/signup" onClick={closeMobileMenu}>
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