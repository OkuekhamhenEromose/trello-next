'use client'

import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useState } from 'react'
import Image from 'next/image'

const testimonials = [
  {
    quote:
      "Trello is so visual! It's the perfect way to see what's happening with work across our global offices at a glance.",
    author: 'Joey Rosenberg',
    role: 'Global Leadership Director at Women Who Code',
    companyLogo: 'WOMEN WHO CODE.',
    companyLogoText: true,
    stat: '68% of customers say Trello delivers value to their business within 30 days.',
  },
  {
    quote:
      'Whether someone is in the office, working from home, or working on-site with a client, everyone can share context and information through Trello.',
    author: 'Sumeet Moghe',
    role: 'Product Manager at ThoughtWorks',
    companyLogo: 'thoughtworks',
    companyLogoText: true,
    stat: '81% of customers chose Trello for its ease of use.',
  },
]

const logos = [
  { src: '/trello_visa.svg', alt: 'Visa', width: 960, height: 80 },
  { src: '/trello_coinbase.svg', alt: 'Coinbase', width: 960, height: 80 },
  { src: '/trello_johndierre.svg', alt: 'John Deere', width: 960, height: 80 },
  { src: '/trello_zoom.svg', alt: 'Zoom', width: 960, height: 80 },
  { src: '/trello_grandhyatt.svg', alt: 'Grand Hyatt', width: 960, height: 80 },
  { src: '/trello_fender.svg', alt: 'Fender', width: 960, height: 80 },
]

export default function TestimonialSection() {
  const [currentIndex, setCurrentIndex] = useState(0)

  const next = () => setCurrentIndex((p) => (p + 1) % testimonials.length)
  const prev = () => setCurrentIndex((p) => (p - 1 + testimonials.length) % testimonials.length)

  const t = testimonials[currentIndex]
  if (!t) return null

  return (
    <section className="py-20 lg:py-28 bg-white">
      <div className="container mx-auto px-4 lg:px-8">

        {/* ── Testimonial cards ── */}
        <div className="grid lg:grid-cols-5 gap-6 items-stretch mb-20">

          {/* Quote card */}
          <div className="lg:col-span-3 bg-white rounded-2xl p-8 lg:p-12 border border-[#dfe1e6] relative flex flex-col">
            {/* Nav: dots + arrows */}
            <div className="absolute top-8 right-8 flex items-center gap-4">
              <div className="flex gap-2">
                {testimonials.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentIndex(i)}
                    className={`h-2 rounded-full transition-all duration-300 ${
                      i === currentIndex
                        ? 'w-8 bg-[#172b4d]'
                        : 'w-2 bg-[#dfe1e6]'
                    }`}
                  />
                ))}
              </div>
              <div className="flex gap-2">
                <button
                  onClick={prev}
                  className="w-10 h-10 rounded-full border border-[#dfe1e6] flex items-center justify-center hover:bg-[#f4f5f7] transition-colors"
                >
                  <ChevronLeft className="w-5 h-5 text-[#172b4d]" />
                </button>
                <button
                  onClick={next}
                  className="w-10 h-10 rounded-full border border-[#dfe1e6] flex items-center justify-center hover:bg-[#f4f5f7] transition-colors"
                >
                  <ChevronRight className="w-5 h-5 text-[#172b4d]" />
                </button>
              </div>
            </div>

            <blockquote className="text-xl lg:text-2xl text-[#172b4d] leading-relaxed mt-10 lg:mt-4 flex-1">
              &ldquo;{t.quote}&rdquo;
            </blockquote>

            <div className="mt-8 pt-8 border-t border-[#dfe1e6] flex items-end justify-between">
              <div>
                <div className="w-16 h-px bg-[#172b4d] mb-4" />
                <p className="font-bold text-[#172b4d]">{t.author}</p>
                <p className="text-[#6b778c] text-sm mt-0.5">{t.role}</p>
                <p className="text-xl font-bold text-[#172b4d] mt-4 tracking-tight">
                  {t.companyLogo}
                </p>
              </div>
              <a
                href="#"
                className="text-[#0052cc] font-medium hover:underline text-sm shrink-0 mb-1"
              >
                Read the story
              </a>
            </div>
          </div>

          {/* Stat card */}
          <div className="lg:col-span-2 bg-[#0052cc] rounded-2xl p-8 lg:p-12 flex flex-col justify-center">
            <p className="text-2xl lg:text-3xl font-bold text-white leading-snug mb-6">
              {t.stat}
            </p>
            <a href="#" className="text-white/80 hover:text-white underline font-medium text-sm">
              Trello TechValidate Survey
            </a>
          </div>
        </div>

        {/* ── Company logos ── */}
        <div className="text-center">
          <p className="text-lg text-[#172b4d] mb-10">
            Join a community of millions of users globally who are using Trello to get more done.
          </p>

          <div className="flex flex-wrap justify-center items-center gap-x-10 gap-y-6 lg:gap-x-14">
            {logos.map((logo) => (
              <div
                key={logo.alt}
                className="opacity-70 hover:opacity-100 transition-opacity duration-200 flex items-center"
              >
                <Image
                  src={logo.src}
                  alt={logo.alt}
                  width={logo.width}
                  height={logo.height}
                  // Each SVG is 960px wide — we constrain to a readable size
                  className="h-7 lg:h-8 w-auto object-contain"
                />
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  )
}