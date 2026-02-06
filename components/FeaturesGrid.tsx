'use client'

import { Button } from '@/components/ui/button'
import { Puzzle, Zap, Copy } from 'lucide-react'

const features = [
  {
    icon: Puzzle,
    title: 'Integrations',
    description:
      'Connect the apps you are already using into your Trello workflow or add a Power-Up to fine-tune your specific needs.',
    cta: 'Browse Integrations',
  },
  {
    icon: Zap,
    title: 'Automation',
    description:
      'No-code automation is built into every Trello board. Focus on the work that matters most and let the robots do the rest.',
    cta: 'Get to know Automation',
  },
  {
    icon: Copy,
    title: 'Card mirroring',
    description:
      'View all your to-dos from multiple boards in one place. Mirror a card to keep track of work wherever you need it!',
    cta: 'Compare plans',
  },
]

export default function FeaturesGrid() {
  return (
    <section className="py-20 lg:py-28 bg-background">
      <div className="container mx-auto px-4 lg:px-8">
        {/* Section Header */}
        <div className="mb-12 max-w-2xl">
          <p className="section-label mb-3">WORK SMARTER</p>
          <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
            Do more with Trello
          </h2>
          <p className="text-lg text-muted-foreground">
            Customize the way you organize with easy integrations, automation, and mirroring of your to-dos across multiple locations.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature) => {
            const Icon = feature.icon
            return (
              <div
                key={feature.title}
                className="group bg-white rounded-xl p-8 border border-border card-hover"
              >
                <div className="w-16 h-16 mb-6 rounded-lg bg-secondary flex items-center justify-center">
                  <Icon className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl font-bold text-foreground mb-3">{feature.title}</h3>
                <p className="text-muted-foreground mb-6">{feature.description}</p>
                <Button
                  className="btn-trello-outline group-hover:border-primary group-hover:text-primary"
                >
                  {feature.cta}
                </Button>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}