'use client'

import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useState } from 'react'

const testimonials = [
  {
    quote:
      "Trello is so visual! It's the perfect way to see what's happening with work across our global offices at a glance.",
    author: 'Joey Rosenberg',
    role: 'Global Leadership Director at Women Who Code',
    companyLogo: (
      <span className="text-[#172b4d]" style={{ fontFamily: 'inherit' }}>
        <span className="text-[11px] font-semibold tracking-widest uppercase leading-none block">
          WOMEN WHO
        </span>
        <span className="text-[22px] font-black tracking-tight leading-none block">
          CODE<span className="text-[14px] align-super">.</span>
        </span>
      </span>
    ),
    stat: '68% of customers say Trello delivers value to their business within 30 days.',
  },
  {
    quote:
      'Whether someone is in the office, working from home, or working on-site with a client, everyone can share context and information through Trello.',
    author: 'Sumeet Moghe',
    role: 'Product Manager at ThoughtWorks',
    companyLogo: (
      <span className="text-[#172b4d] text-[22px] font-bold tracking-[-0.5px]">
        thoughtworks
      </span>
    ),
    stat: '81% of customers chose Trello for its ease of use.',
  },
]

export default function TestimonialSection() {
  const [currentIndex, setCurrentIndex] = useState(0)

  const next = () => setCurrentIndex((p) => (p + 1) % testimonials.length)
  const prev = () => setCurrentIndex((p) => (p - 1 + testimonials.length) % testimonials.length)

  const t = testimonials[currentIndex]
  if (!t) return null

  return (
    <section className="py-20 lg:py-28 bg-white">
      <div className="container mx-auto px-4 lg:px-8 max-w-6xl">
        <div className="grid lg:grid-cols-5 gap-6 items-stretch">

          {/* ── Quote card ── */}
          <div className="lg:col-span-3 bg-white rounded-2xl p-8 lg:p-12 border border-[#dfe1e6] relative flex flex-col min-h-[360px]">

            {/* Navigation: dots + arrows — top right */}
            <div className="absolute top-8 right-8 flex items-center gap-3">
              {/* Dots */}
              <div className="flex items-center gap-1.5">
                {testimonials.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentIndex(i)}
                    aria-label={`Go to testimonial ${i + 1}`}
                    className={`h-2 rounded-full transition-all duration-300 focus:outline-none ${
                      i === currentIndex
                        ? 'w-8 bg-[#172b4d]'
                        : 'w-2 bg-[#dfe1e6] hover:bg-[#b3bac5]'
                    }`}
                  />
                ))}
              </div>

              {/* Arrow buttons */}
              <div className="flex gap-1.5">
                <button
                  onClick={prev}
                  aria-label="Previous testimonial"
                  className="w-9 h-9 rounded-full border border-[#dfe1e6] flex items-center justify-center hover:bg-[#f4f5f7] transition-colors focus:outline-none focus:ring-2 focus:ring-[#0052cc]/30"
                >
                  <ChevronLeft className="w-4 h-4 text-[#172b4d]" />
                </button>
                <button
                  onClick={next}
                  aria-label="Next testimonial"
                  className="w-9 h-9 rounded-full border border-[#dfe1e6] flex items-center justify-center hover:bg-[#f4f5f7] transition-colors focus:outline-none focus:ring-2 focus:ring-[#0052cc]/30"
                >
                  <ChevronRight className="w-4 h-4 text-[#172b4d]" />
                </button>
              </div>
            </div>

            {/* Quote text */}
            <blockquote className="text-xl lg:text-[22px] text-[#172b4d] leading-[1.5] mt-10 lg:mt-6 flex-1 font-normal">
              &ldquo;{t.quote}&rdquo;
            </blockquote>

            {/* Author footer */}
            <div className="mt-8 pt-8 border-t border-[#dfe1e6] flex items-end justify-between gap-4">
              <div className="flex flex-col gap-1">
                {/* Short horizontal rule */}
                <div className="w-16 h-px bg-[#172b4d] mb-3" />
                <p className="font-bold text-[#172b4d] text-[15px] leading-snug">{t.author}</p>
                <p className="text-[#6b778c] text-[13px] leading-snug mt-0.5">{t.role}</p>
                <div className="mt-3">{t.companyLogo}</div>
              </div>

              <a
                href="#"
                className="text-[#0052cc] font-medium hover:underline text-[13px] shrink-0 mb-0.5 whitespace-nowrap"
              >
                Read the story
              </a>
            </div>
          </div>

          {/* ── Stat card ── */}
          <div className="lg:col-span-2 bg-[#0052cc] rounded-2xl p-8 lg:p-12 flex flex-col justify-center">
            <p className="text-[26px] lg:text-[30px] font-bold text-white leading-[1.25] mb-6">
              {t.stat}
            </p>
            <a
              href="#"
              className="text-white/75 hover:text-white underline underline-offset-2 font-medium text-[13px] transition-colors"
            >
              Trello TechValidate Survey
            </a>
          </div>

        </div>
      </div>
    </section>
  )
}