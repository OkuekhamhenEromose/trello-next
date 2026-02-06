'use client'

import { Calendar, Mail } from 'lucide-react'

export default function MessageToActionSection() {
  return (
    <section className="bg-primary py-16 lg:py-20">
      <div className="container mx-auto px-4 lg:px-8 text-center">
        <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
          From message to action
        </h2>
        <p className="text-lg text-white/80 max-w-2xl mx-auto mb-12">
          Quickly turn communication from your favorite apps into to-dos, keeping all your discussions and tasks organized in one place.
        </p>
      </div>

      <div className="container mx-auto px-4 lg:px-8">
        <div className="bg-white rounded-2xl shadow-hero p-8 lg:p-12">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left - Email mockup */}
            <div className="relative">
              {/* Email card */}
              <div className="bg-white border rounded-xl p-4 shadow-card max-w-sm">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-sm text-muted-foreground">To</span>
                  <span className="bg-primary text-white text-xs px-3 py-1 rounded-full flex items-center gap-1">
                    <Mail className="w-3 h-3" />
                    INBOX@TRELLO.COM
                  </span>
                </div>
                <div className="text-sm space-y-1 text-muted-foreground">
                  <p>
                    <strong>From:</strong> bookings@acmehotel.com
                  </p>
                  <p>
                    <strong>Date:</strong> Tue, April 9 at 10:06 AM
                  </p>
                  <p>
                    <strong>Subject:</strong> Hotel - BOOKED - Fairmont Austin
                  </p>
                </div>
                <div className="mt-4 h-32 bg-muted rounded-lg" />
              </div>

              {/* Gmail icon */}
              <div className="absolute bottom-4 right-1/3 w-12 h-12 bg-card rounded-xl shadow-elevated flex items-center justify-center">
                <span className="text-xl">📧</span>
              </div>

              {/* Arrow */}
              <svg className="absolute top-1/2 right-0 w-16" viewBox="0 0 60 20">
                <path
                  d="M0 10 L 50 10"
                  stroke="currentColor"
                  strokeWidth="2"
                  className="text-trello-navy"
                />
                <path
                  d="M45 5 L 55 10 L 45 15"
                  stroke="currentColor"
                  strokeWidth="2"
                  fill="none"
                  className="text-trello-navy"
                />
              </svg>

              {/* Trello Inbox card */}
              <div className="absolute -right-4 top-1/4 bg-trello-green rounded-xl p-4 shadow-elevated w-48">
                <div className="flex items-center gap-2 text-white mb-3">
                  <Mail className="w-4 h-4" />
                  <span className="font-semibold text-sm">Inbox</span>
                </div>
                <div className="bg-card/90 rounded-lg p-3">
                  <p className="text-xs font-medium text-foreground">Your stay in Austin</p>
                  <div className="flex gap-1 mt-2">
                    <span className="w-4 h-4 rounded bg-destructive" />
                    <span className="w-4 h-4 rounded bg-muted" />
                  </div>
                </div>
              </div>
            </div>

            {/* Right - Feature description */}
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center">
                  <span className="text-primary">⚡</span>
                </div>
                <span className="font-bold text-primary uppercase tracking-wide text-sm">
                  Email Magic
                </span>
              </div>
              <p className="text-lg text-foreground leading-relaxed">
                Easily turn your emails into to-dos! Just forward them to your Trello Inbox, and they&apos;ll be transformed by AI into organized to-dos with all the links you need.
              </p>
            </div>
          </div>

          {/* Second feature - Message App */}
          <div className="grid lg:grid-cols-2 gap-12 items-center mt-16 pt-16 border-t">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-primary" />
                </div>
                <span className="font-bold text-primary uppercase tracking-wide text-sm">
                  Message App Sorcery
                </span>
              </div>
              <p className="text-lg text-foreground leading-relaxed">
                Need to follow up on a message from Slack or Microsoft Teams? Send it directly to your Trello board! Your favorite app interface lets you save messages that appear in your Trello Inbox with AI-generated summaries and links.
              </p>
            </div>

            {/* Chat mockup */}
            <div className="relative bg-secondary rounded-xl p-6">
              <div className="bg-white rounded-xl p-4 shadow-card mb-4">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full bg-muted" />
                  <div>
                    <p className="font-semibold text-sm text-foreground">Gabrielle Bossio</p>
                    <p className="text-sm text-muted-foreground">
                      Hey 👋 Send over your Banc.ly competitive analysis draft when it&apos;s ready - I can give you some early feedback!
                    </p>
                  </div>
                  <button className="ml-auto text-primary">🔖</button>
                </div>
              </div>

              {/* App icons */}
              <div className="flex gap-3 mb-4">
                <div className="w-12 h-12 rounded-xl bg-trello-purple flex items-center justify-center text-primary-foreground text-xl shadow-card">
                  T
                </div>
                <div className="w-12 h-12 rounded-xl bg-trello-green flex items-center justify-center shadow-card">
                  💬
                </div>
              </div>

              {/* Arrow to inbox */}
              <div className="absolute bottom-8 right-8 bg-trello-green rounded-xl p-4 shadow-elevated w-56">
                <div className="flex items-center gap-2 text-white mb-2">
                  <Mail className="w-4 h-4" />
                  <span className="font-semibold text-sm">Inbox</span>
                </div>
                <div className="bg-white rounded-lg p-3">
                  <p className="text-xs text-foreground">
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