'use client'

import Image from 'next/image'
import { Button } from '@/components/ui/button'

const features = [
  {
    icon: '/trello_integrations.svg',
    title: 'Integrations',
    description:
      'Connect the apps you are already using into your Trello workflow or add a Power-Up to fine-tune your specific needs.',
    cta: 'Browse Integrations',
  },
  {
    icon: '/tello_automation.svg',
    title: 'Automation',
    description:
      'No-code automation is built into every Trello board. Focus on the work that matters most and let the robots do the rest.',
    cta: 'Get to know Automation',
  },
  {
    icon: '/trello_cardmirroring.svg',
    title: 'Card mirroring',
    description:
      'View all your to-dos from multiple boards in one place. Mirror a card to keep track of work wherever you need it!',
    cta: 'Compare plans',
  },
]

export default function FeaturesGrid() {
  return (
    <section className="py-20 lg:py-28 bg-[#f4f5f7]">
      <div className="container mx-auto px-4 lg:px-8">

        {/* Section Header */}
        <div className="mb-12 max-w-2xl">
          <p className="text-xs font-bold text-[#0052cc] uppercase tracking-[0.12em] mb-3">
            Work Smarter
          </p>
          <h2 className="text-3xl lg:text-4xl font-bold text-[#172b4d] mb-4">
            Do more with Trello
          </h2>
          <p className="text-lg text-[#6b778c]">
            Customize the way you organize with easy integrations, automation, and
            mirroring of your to-dos across multiple locations.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="bg-white rounded-xl p-8 border border-[#dfe1e6] hover:shadow-[0_3px_5px_rgba(0,0,0,.10),0_6px_10px_rgba(0,0,0,.08),0_12px_20px_rgba(0,0,0,.06)] hover:-translate-y-1 transition-all duration-300"
            >
              {/* Illustration icon */}
              <div className="mb-6 w-24 h-24 relative">
                <Image
                  src={feature.icon}
                  alt={feature.title}
                  width={96}
                  height={97}
                  className="object-contain"
                />
              </div>

              <h3 className="text-xl font-bold text-[#172b4d] mb-3">
                {feature.title}
              </h3>
              <p className="text-[#6b778c] mb-6 leading-relaxed">
                {feature.description}
              </p>

              <Button
                variant="outline"
                className="border-[#dfe1e6] text-[#172b4d] hover:border-[#0052cc] hover:text-[#0052cc] font-medium rounded-md px-5 py-2 h-auto text-sm"
              >
                {feature.cta}
              </Button>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}