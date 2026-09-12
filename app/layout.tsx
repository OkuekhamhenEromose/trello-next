import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import { AuthProvider } from '@/contexts/AuthContext'
import './globals.css'

const inter = Inter({ 
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
})

export const metadata: Metadata = {
  title: {
    default: 'Project Board - Collaborative project management',
    template: '%s | Project Board'
  },
  description: 'Collaborative project management with boards, lists, cards, and real-time teamwork.',
  keywords: ['Project Management', 'Kanban', 'Team Collaboration', 'Task Management'],
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: '/',
    title: 'Project Board - Collaborative project management',
    description: 'Collaborative project management with boards, lists, cards, and real-time teamwork.',
    siteName: 'Project Board',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Trello Dashboard',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Project Board - Collaborative project management',
    description: 'Collaborative project management with boards, lists, cards, and real-time teamwork.',
    
    images: ['/twitter-image.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon-16x16.png',
    apple: '/apple-touch-icon.png',
  },
  manifest: '/manifest.json',
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#0f172a',
  colorScheme: 'light',
}

interface RootLayoutProps {
  children: React.ReactNode
}

export default function RootLayout({ children }: Readonly<RootLayoutProps>) {
  return (
    <html lang="en" className={`${inter.variable} scroll-smooth`}>
      <body className={`${inter.className} antialiased`}>
        <AuthProvider>
        {children}
        </AuthProvider>
      </body>
    </html>
  )
}