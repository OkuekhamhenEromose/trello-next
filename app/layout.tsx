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
    default: 'Trello - Manage your team\'s projects',
    template: '%s | Trello'
  },
  description: 'Trello helps teams move work forward. Collaborate, manage projects, and reach new productivity peaks.',
  keywords: ['Trello', 'Project Management', 'Kanban', 'Team Collaboration', 'Task Management'],
  authors: [{ name: 'Atlassian' }],
  creator: 'Atlassian',
  publisher: 'Atlassian',
  metadataBase: new URL('https://trello.com'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://trello.com',
    title: 'Trello - Manage your team\'s projects',
    description: 'Trello helps teams move work forward.',
    siteName: 'Trello',
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
    title: 'Trello - Manage your team\'s projects',
    description: 'Trello helps teams move work forward.',
    creator: '@trello',
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
  themeColor: '#0052CC',
  colorScheme: 'light',
}

interface RootLayoutProps {
  children: React.ReactNode
}

export default function RootLayout({ children }: Readonly<RootLayoutProps>) {
  return (
    <html lang="en" className={`${inter.variable} scroll-smooth`}>
      <body className={`${inter.className} antialiased`}>
        <head>
        <link rel="manifest" href="/manifest.json" />
      </head>
        <AuthProvider>
        {children}
        </AuthProvider>
      </body>
    </html>
  )
}