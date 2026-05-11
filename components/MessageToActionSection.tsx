'use client'

import { Mail } from 'lucide-react'
import Image from 'next/image'

export default function MessageToActionSection() {
  return (
    <section className="bg-[#0052cc] py-16 lg:py-24">
      {/* Section Header */}
      <div className="container mx-auto px-4 lg:px-8 text-center mb-14">
        <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
          From message to action
        </h2>
        <p className="text-lg text-white/80 max-w-2xl mx-auto">
          Quickly turn communication from your favorite apps into to-dos, keeping all your
          discussions and tasks organized in one place.
        </p>
      </div>

      {/* White Card Container */}
      <div className="container mx-auto px-4 lg:px-8">
        <div className="bg-white rounded-2xl shadow-hero px-8 py-12 lg:px-16 lg:py-16">

          {/* ── FEATURE 1: Email Magic ── */}
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">

            {/* Left – Email mockup */}
            <div className="relative flex items-center justify-center min-h-[320px]">

              {/* Email card */}
              <div className="relative bg-white border border-[#dfe1e6] rounded-2xl p-5 shadow-card w-full max-w-[340px] z-10">
                {/* To field */}
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-sm text-[#6b778c] font-medium">To</span>
                  <span className="bg-[#519839] text-white text-xs px-3 py-1.5 rounded-full flex items-center gap-1.5 font-semibold tracking-wide">
                    <Mail className="w-3 h-3" />
                    INBOX@TRELLO.COM
                  </span>
                </div>

                {/* Email meta */}
                <div className="text-sm space-y-0.5 text-[#6b778c]">
                  <p><strong className="text-[#172b4d]">From:</strong> bookings@acmehotel.com</p>
                  <p><strong className="text-[#172b4d]">Date:</strong> Tue, April 9 at 10:06 AM</p>
                  <p><strong className="text-[#172b4d]">Subject:</strong> Hotel - BOOKED - Fairmont Austin</p>
                </div>

                {/* Image placeholder / photo */}
                <div className="mt-4 h-28 bg-[#f4f5f7] rounded-xl overflow-hidden">
                  <Image
                    src="/trelloemailmagic.webp"
                    alt="Hotel photo"
                    width={320}
                    height={112}
                    className="w-full h-full object-cover grayscale"
                  />
                </div>

                {/* Gmail icon — bottom right of email card */}
                <div className="absolute -bottom-5 right-10 w-12 h-12 bg-white rounded-2xl shadow-elevated flex items-center justify-center">
                  {/* Gmail "M" logo */}
                  <svg viewBox="0 0 48 48" className="w-7 h-7">
                    <path fill="#4caf50" d="M45 16.2l-5 2.75-5 4.75V40h7a3 3 0 003-3V16.2z"/>
                    <path fill="#1e88e5" d="M3 16.2l5 2.75 5 4.75V40H6a3 3 0 01-3-3V16.2z"/>
                    <path fill="#e53935" d="M35 11.2l-11 8.25L13 11.2 12 14l12 9 12-9-1-2.8z"/>
                    <path fill="#c62828" d="M3 12.298V16.2l10 7.53V11.2L9.876 8.292C9.132 7.692 8 8.158 8 9.298v3z"/>
                    <path fill="#fbc02d" d="M45 12.298V16.2l-10 7.53V11.2l3.124-2.908C38.868 7.692 40 8.158 40 9.298v3z"/>
                  </svg>
                </div>
              </div>

              {/* Arrow SVG */}
              <div className="hidden lg:flex absolute right-[-60px] top-1/2 -translate-y-1/2 z-20 items-center">
                <svg width="72" height="24" viewBox="0 0 72 24" fill="none">
                  <line x1="0" y1="12" x2="58" y2="12" stroke="#172b4d" strokeWidth="2.5"/>
                  <polyline points="50,4 62,12 50,20" fill="none" stroke="#172b4d" strokeWidth="2.5" strokeLinejoin="round"/>
                </svg>
              </div>

              {/* Trello Inbox card */}
              <div className="hidden lg:block absolute right-[-180px] top-1/2 -translate-y-1/2 z-20 bg-[#519839] rounded-2xl p-4 shadow-elevated w-48">
                <div className="flex items-center gap-2 text-white mb-3">
                  <Mail className="w-4 h-4" />
                  <span className="font-bold text-sm">Inbox</span>
                </div>
                <div className="bg-white rounded-xl p-3 shadow-sm">
                  <p className="text-xs font-semibold text-[#172b4d] leading-snug">Your stay in Austin</p>
                  <div className="flex items-center gap-1.5 mt-2">
                    {/* Gmail M icon tiny */}
                    <svg viewBox="0 0 48 48" className="w-4 h-4 shrink-0">
                      <path fill="#4caf50" d="M45 16.2l-5 2.75-5 4.75V40h7a3 3 0 003-3V16.2z"/>
                      <path fill="#1e88e5" d="M3 16.2l5 2.75 5 4.75V40H6a3 3 0 01-3-3V16.2z"/>
                      <path fill="#e53935" d="M35 11.2l-11 8.25L13 11.2 12 14l12 9 12-9-1-2.8z"/>
                      <path fill="#c62828" d="M3 12.298V16.2l10 7.53V11.2L9.876 8.292C9.132 7.692 8 8.158 8 9.298v3z"/>
                      <path fill="#fbc02d" d="M45 12.298V16.2l-10 7.53V11.2l3.124-2.908C38.868 7.692 40 8.158 40 9.298v3z"/>
                    </svg>
                    <div className="w-4 h-4 rounded-full border border-[#dfe1e6] flex items-center justify-center">
                      <span className="text-[8px] text-[#6b778c]">i</span>
                    </div>
                    <div className="flex flex-col gap-0.5">
                      <div className="w-10 h-1 bg-[#dfe1e6] rounded-full" />
                      <div className="w-8 h-1 bg-[#dfe1e6] rounded-full" />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right – Email Magic copy */}
            <div className="lg:pl-32">
              {/* Label */}
              <div className="flex items-center gap-3 mb-4">
                <div className="w-9 h-9 rounded-lg bg-[#f0f2f5] flex items-center justify-center">
                  {/* Atlassian-style sparkle / lightning icon */}
                  <svg className="w-5 h-5 text-[#0052cc]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <span className="text-xs font-bold text-[#6554c0] uppercase tracking-widest">
                  Email Magic
                </span>
              </div>

              <p className="text-lg text-[#172b4d] leading-relaxed">
                Easily turn your emails into to-dos! Just forward them to your Trello Inbox,
                and they&apos;ll be transformed by AI into organized to-dos with all the links
                you need.
              </p>
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-[#dfe1e6] my-14" />

          {/* ── FEATURE 2: Message App Sorcery ── */}
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">

            {/* Left – Message App Sorcery copy */}
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-9 h-9 rounded-lg bg-[#f0f2f5] flex items-center justify-center">
                  {/* Calendar icon */}
                  <svg className="w-5 h-5 text-[#0052cc]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                    <line x1="16" y1="2" x2="16" y2="6"/>
                    <line x1="8" y1="2" x2="8" y2="6"/>
                    <line x1="3" y1="10" x2="21" y2="10"/>
                  </svg>
                </div>
                <span className="text-xs font-bold text-[#6554c0] uppercase tracking-widest">
                  Message App Sorcery
                </span>
              </div>

              <p className="text-lg text-[#172b4d] leading-relaxed">
                Need to follow up on a message from Slack or Microsoft Teams? Send it directly
                to your Trello board! Your favorite app interface lets you save messages that
                appear in your Trello Inbox with AI-generated summaries and links.
              </p>
            </div>

            {/* Right – Chat mockup */}
            <div className="relative bg-[#f0f2f5] rounded-2xl p-6 min-h-[280px]">

              {/* Chat bubble */}
              <div className="bg-white rounded-2xl p-4 shadow-card mb-5 relative">
                <div className="flex items-start gap-3">
                  {/* Avatar */}
                  <div className="w-10 h-10 rounded-full overflow-hidden shrink-0 bg-[#0052cc] flex items-center justify-center text-white font-bold text-sm">
                    GB
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-sm text-[#172b4d] mb-1">Gabrielle Bossio</p>
                    <p className="text-sm text-[#6b778c] leading-snug">
                      Hey 😊 Send over your Banc.ly competitive analysis draft when it&apos;s
                      ready - I can give you some early feedback!
                    </p>
                  </div>
                  {/* Bookmark button */}
                  <button className="shrink-0 w-8 h-8 rounded-lg bg-[#0052cc] flex items-center justify-center shadow-sm">
                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M5 3a2 2 0 00-2 2v16l7-3 7 3V5a2 2 0 00-2-2H5z"/>
                    </svg>
                  </button>
                </div>
              </div>

              {/* App icons row – Teams + Slack */}
              <div className="flex items-center gap-3 mb-6">
                {/* Microsoft Teams */}
                <div className="w-12 h-12 rounded-2xl bg-[#5059C9] shadow-card flex items-center justify-center">
                  <svg viewBox="0 0 48 48" className="w-7 h-7" fill="white">
                    <path d="M30 18h8a2 2 0 012 2v10a6 6 0 01-6 6h-1a6 6 0 01-5.83-4.56A8 8 0 0030 18z"/>
                    <circle cx="34" cy="12" r="4"/>
                    <path d="M18 10a6 6 0 110 12A6 6 0 0118 10z"/>
                    <path d="M8 24a2 2 0 012-2h16a2 2 0 012 2v10a8 8 0 01-8 8h-4a8 8 0 01-8-8V24z"/>
                  </svg>
                </div>

                {/* Slack */}
                <div className="w-12 h-12 rounded-2xl bg-white shadow-card flex items-center justify-center">
                  <svg viewBox="0 0 48 48" className="w-7 h-7">
                    <path fill="#E01E5A" d="M13 28a4 4 0 110 8 4 4 0 010-8zm0-4a4 4 0 01-4-4V9a4 4 0 018 0v11a4 4 0 01-4 4z"/>
                    <path fill="#36C5F0" d="M20 35a4 4 0 118 0 4 4 0 01-8 0zm4-8a4 4 0 01-4-4V12a4 4 0 018 0v11a4 4 0 01-4 4z"/>
                    <path fill="#2EB67D" d="M35 20a4 4 0 11-8 0 4 4 0 018 0zm4 0a4 4 0 014 4v11a4 4 0 01-8 0V24a4 4 0 014-4z"/>
                    <path fill="#ECB22E" d="M28 13a4 4 0 11-8 0 4 4 0 018 0zm0 4a4 4 0 014 4H21a4 4 0 01-4-4v-1a4 4 0 014-4h7a4 4 0 014 4v1z"/>
                  </svg>
                </div>

                {/* Curved arrow SVG */}
                <svg className="w-16 h-16 text-[#172b4d]" viewBox="0 0 80 80" fill="none">
                  <path
                    d="M10 20 C 10 60, 60 65, 68 56"
                    stroke="#172b4d"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    fill="none"
                  />
                  <path
                    d="M62 48 L68 56 L58 58"
                    stroke="#172b4d"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    fill="none"
                  />
                </svg>
              </div>

              {/* Trello Inbox result card */}
              <div className="absolute bottom-6 right-6 bg-[#519839] rounded-2xl p-4 shadow-elevated w-56">
                <div className="flex items-center gap-2 text-white mb-2">
                  <Mail className="w-4 h-4" />
                  <span className="font-bold text-sm">Inbox</span>
                </div>
                <div className="bg-white rounded-xl p-3 shadow-sm">
                  <p className="text-xs text-[#172b4d] leading-snug font-medium">
                    Send Banc.ly Competitive Analysis Draft to Gabrielle
                  </p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}