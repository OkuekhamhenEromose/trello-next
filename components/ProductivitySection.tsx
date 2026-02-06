'use client'

import { useState } from 'react'
import { Mail, Layout, Calendar } from 'lucide-react'

const features = [
  {
    id: 'inbox',
    icon: Mail,
    title: 'Inbox',
    description:
      'When it&apos;s on your mind, it goes in your Inbox. Capture your to-dos from anywhere, anytime.',
  },
  {
    id: 'boards',
    icon: Layout,
    title: 'Boards',
    description:
      'Your to-do list may be long, but it can be manageable! Keep tabs on everything from "to-dos to tackle" to "mission accomplished!"',
  },
  {
    id: 'planner',
    icon: Calendar,
    title: 'Planner',
    description:
      'Drag, drop, get it done. Snap your top tasks into your calendar and make time for what truly matters.',
  },
]

export default function ProductivitySection() {
  const [activeFeature, setActiveFeature] = useState('inbox')

  return (
    <section className="py-20 lg:py-28 bg-background">
      <div className="container mx-auto px-4 lg:px-8">
        {/* Section Header */}
        <div className="mb-12">
          <p className="section-label mb-3">TRELLO 101</p>
          <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
            Your productivity powerhouse
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl">
            Stay organized and efficient with Inbox, Boards, and Planner. Every to-do, idea, or responsibility—no matter how small—finds its place, keeping you at the top of your game.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-16">
          {/* Left - Feature Tabs */}
          <div className="space-y-4">
            {features.map((feature) => (
              <button
                key={feature.id}
                onClick={() => setActiveFeature(feature.id)}
                className={`w-full text-left p-6 rounded-lg transition-all duration-300 ${
                  activeFeature === feature.id
                    ? 'bg-white shadow-card border-l-4 border-trello-cyan'
                    : 'hover:bg-secondary/50'
                }`}
              >
                <h3 className="text-xl font-bold text-foreground mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </button>
            ))}

            {/* Pagination dots */}
            <div className="flex items-center gap-2 pt-4">
              {features.map((feature) => (
                <button
                  key={feature.id}
                  onClick={() => setActiveFeature(feature.id)}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    activeFeature === feature.id
                      ? 'w-8 bg-trello-navy'
                      : 'w-2 bg-muted-foreground/30'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Right - Feature Preview */}
          <div className="relative bg-secondary rounded-2xl p-6 lg:p-8 min-h-[400px]">
            {/* Mock Trello UI */}
            <div className="flex gap-4">
              {/* Inbox Column */}
              <div className="flex-1 bg-trello-purple rounded-xl p-4 shadow-elevated">
                <div className="flex items-center gap-2 text-white mb-4">
                  <Mail className="w-5 h-5" />
                  <span className="font-semibold">Inbox</span>
                </div>
                <div className="space-y-3">
                  <div className="bg-white/90 rounded-lg p-3">
                    <p className="text-muted-foreground text-xs">Add a todo, or use</p>
                    <p className="text-muted-foreground text-xs">/ for actions</p>
                  </div>
                  <TaskCard title="Marketing presentation got moved up to Friday" hasSlack />
                  <TaskCard title="Your stay in Austin" hasGmail />
                  <TaskCard title="Project poster" hasConfluence />
                </div>
              </div>

              {/* Board Column */}
              <div className="flex-1 bg-primary rounded-xl p-4 shadow-elevated">
                <div className="flex items-center justify-between text-white mb-4">
                  <span className="font-semibold">Personal Task Board</span>
                </div>
                <div className="bg-secondary/20 rounded-lg p-3">
                  <div className="flex items-center justify-between text-white text-sm mb-3">
                    <span>To Do - Today</span>
                    <span>⚡</span>
                  </div>
                  <div className="space-y-2">
                    <div className="bg-white rounded p-2 text-xs text-foreground">
                      Prepare analysis of recent campaigns
                    </div>
                    <div className="bg-white rounded p-2 text-xs text-foreground">
                      Create brief and write test instructions for project Ranier
                    </div>
                    <button className="text-white/80 text-xs flex items-center gap-1">
                      + Add a card
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Arrow decoration */}
            <svg
              className="absolute top-1/2 left-1/2 -translate-x-1/2 w-24 text-trello-navy"
              viewBox="0 0 100 30"
              fill="none"
            >
              <path
                d="M5 15 C 30 15, 50 5, 80 15"
                stroke="currentColor"
                strokeWidth="2"
                strokeDasharray="5,5"
              />
              <path d="M75 10 L 85 15 L 75 20" stroke="currentColor" strokeWidth="2" />
            </svg>
          </div>
        </div>
      </div>
    </section>
  )
}

interface TaskCardProps {
  title: string
  hasGmail?: boolean
  hasSlack?: boolean
  hasConfluence?: boolean
}

function TaskCard({ title, hasGmail, hasSlack, hasConfluence }: TaskCardProps) {
  return (
    <div className="bg-white rounded-lg p-3 shadow-sm">
      <p className="text-sm text-foreground mb-2">{title}</p>
      <div className="flex gap-2">
        {hasGmail && (
          <div className="w-5 h-5 rounded bg-red-500 flex items-center justify-center text-white text-xs">
            M
          </div>
        )}
        {hasSlack && (
          <div className="w-5 h-5 rounded bg-purple-600 flex items-center justify-center text-white text-xs">
            #
          </div>
        )}
        {hasConfluence && (
          <div className="w-5 h-5 rounded bg-blue-600 flex items-center justify-center text-white text-xs">
            C
          </div>
        )}
        <div className="w-5 h-5 rounded bg-muted flex items-center justify-center text-muted-foreground text-xs">
          ℹ
        </div>
      </div>
    </div>
  )
}