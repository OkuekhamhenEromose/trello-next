'use client'

import { useState } from 'react'
import type { ChangeEvent } from 'react'
// import Image from 'next/image'
import { Play } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

export default function HeroSection() {
  const [email, setEmail] = useState('')

  return (
    <section className="bg-hero-gradient overflow-hidden">
      {/* Announcement Banner */}
      <div className="bg-primary py-3 text-center">
        <p className="text-sm text-white">
          Accelerate your teams&apos; work with AI features ✨ now available for all Premium and Enterprise!{' '}
          <a href="#" className="underline hover:no-underline font-medium">
            Learn more.
          </a>
        </p>
      </div>

      <div className="container mx-auto px-4 lg:px-8 py-16 lg:py-24">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="animate-fade-in-up">
            <h1 className="text-4xl lg:text-5xl xl:text-6xl font-bold text-foreground leading-tight mb-6">
              Capture, organize, and tackle your to-dos from anywhere.
            </h1>
            <p className="text-lg lg:text-xl text-muted-foreground mb-8 max-w-lg">
              Escape the clutter and chaos—unleash your productivity with Trello.
            </p>

            {/* Email Signup Form */}
            <div className="flex flex-col sm:flex-row gap-3 max-w-lg mb-4">
              <Input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                className="h-12 bg-white border-border"
              />
              <Button className="h-12 px-6 btn-trello-primary whitespace-nowrap">
                Sign up - it&apos;s free!
              </Button>
            </div>
            <p className="text-sm text-muted-foreground">
              By entering my email, I acknowledge the{' '}
              <a href="#" className="text-primary hover:underline">
                Atlassian Privacy Policy
              </a>
            </p>

            {/* Watch Video Link */}
            <a
              href="#"
              className="inline-flex items-center gap-2 mt-8 text-primary font-medium hover:underline"
            >
              Watch video
              <span className="flex items-center justify-center w-7 h-7 rounded-full border-2 border-primary">
                <Play className="w-3 h-3 ml-0.5" />
              </span>
            </a>
          </div>

          {/* Right Content - Mockup */}
          <div className="relative flex justify-center lg:justify-end">
            {/* Decorative shapes */}
            <div className="absolute -bottom-8 right-0 w-48 lg:w-64 h-48 lg:h-64 bg-gradient-to-br from-trello-cyan/20 to-trello-purple/20 rounded-full blur-3xl animate-float" />
            
            {/* Phone mockup container */}
            <div className="relative z-10">
              <div className="w-64 lg:w-80 h-[500px] lg:h-[600px] bg-white rounded-3xl shadow-2xl p-4 border-8 border-gray-900">
                {/* Phone notch */}
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-32 h-6 bg-gray-900 rounded-b-2xl" />
                
                {/* App content */}
                <div className="h-full flex flex-col pt-6">
                  {/* App header */}
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-trello-purple flex items-center justify-center">
                        <span className="text-white text-sm">📥</span>
                      </div>
                      <span className="font-semibold text-sm text-gray-900">Inbox</span>
                    </div>
                    <span className="text-gray-500 text-xs">⚡</span>
                  </div>
                  
                  {/* Inbox content */}
                  <div className="space-y-3 flex-1">
                    <div className="bg-gray-100 rounded-lg p-3">
                      <p className="text-xs text-gray-500">Add a todo, or use / for actions</p>
                    </div>
                    
                    <div className="bg-white border rounded-lg p-3 shadow-sm">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-6 h-6 rounded-full bg-trello-red" />
                        <span className="text-sm font-medium text-gray-900">Marketing presentation got moved up to Friday</span>
                      </div>
                      <div className="flex gap-1">
                        <span className="text-xs text-gray-500">📅</span>
                        <span className="text-xs text-gray-500">🔗</span>
                      </div>
                    </div>
                    
                    <div className="bg-white border rounded-lg p-3 shadow-sm">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-6 h-6 rounded-full bg-trello-purple" />
                        <span className="text-sm font-medium text-gray-900">Your stay in Austin</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="text-xs text-gray-900">M</span>
                        <span className="w-2 h-2 rounded-full bg-trello-red" />
                      </div>
                    </div>
                  </div>
                  
                  {/* Board preview */}
                  <div className="mt-4 bg-trello-blue rounded-xl p-3">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-semibold text-white">Personal Task Board</span>
                      <span className="text-xs text-white/80">📄</span>
                    </div>
                    <div className="bg-white/10 rounded-lg p-2">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-medium text-white">To Do - Today</span>
                        <span className="text-xs text-white/80">⚡</span>
                      </div>
                      <div className="bg-white rounded p-2 mb-1">
                        <p className="text-xs text-gray-900">Create brief and write test instructions for project Ranier</p>
                      </div>
                      <button className="text-xs text-white/80 hover:text-white flex items-center gap-1">
                        + Add a card
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Floating app icons */}
            <div className="absolute top-1/4 -right-4 lg:right-0 flex flex-col gap-3">
              {['T', '∞', 'S', 'M'].map((icon, i) => (
                <div
                  key={i}
                  className="w-10 h-10 rounded-xl bg-white shadow-card flex items-center justify-center text-sm font-bold"
                  style={{
                    animationDelay: `${i * 0.1}s`,
                    animation: 'float 3s ease-in-out infinite',
                  }}
                >
                  {icon}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}