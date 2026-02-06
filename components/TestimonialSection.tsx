'use client'

import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useState } from 'react'

const testimonials = [
  {
    quote:
      'Whether someone is in the office, working from home, or working on-site with a client, everyone can share context and information through Trello.',
    author: 'Sumeet Moghe',
    role: 'Product Manager at ThoughtWorks',
    company: 'thoughtworks',
  },
  {
    quote:
      'Trello makes it easy to keep everyone on the same page. We&apos;ve seen productivity increase by 25% since implementing it across our teams.',
    author: 'Sarah Chen',
    role: 'Engineering Lead at TechCorp',
    company: 'techcorp',
  },
]

const logos = [
  { name: 'VISA', text: 'VISA', className: 'font-black tracking-tight text-2xl lg:text-3xl italic' },
  { name: 'Coinbase', text: 'coinbase', className: 'font-semibold text-xl lg:text-2xl' },
  { name: 'John Deere', text: 'JOHN DEERE', className: 'font-bold text-sm lg:text-base tracking-widest' },
  { name: 'Zoom', text: 'zoom', className: 'font-bold text-2xl lg:text-3xl' },
  { name: 'Grand Hyatt', text: 'GRAND | HYATT', className: 'font-light text-lg lg:text-xl tracking-[0.2em]' },
  { name: 'Fender', text: 'Fender', className: 'font-serif italic text-2xl lg:text-3xl' },
]

export default function TestimonialSection() {
  const [currentIndex, setCurrentIndex] = useState(0)

  const nextTestimonial = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length)
  }

  const prevTestimonial = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length)
  }

  const testimonial = testimonials[currentIndex]

  if (!testimonial) {
    return null
  }

  return (
    <section className="py-20 lg:py-28 bg-background">
      <div className="container mx-auto px-4 lg:px-8">
        {/* Company Logos */}
        <div className="text-center mb-16">
          <p className="text-lg lg:text-xl text-foreground mb-10">
            Join a community of millions of users globally who are using Trello to get more done.
          </p>
          <div className="flex flex-wrap justify-center items-center gap-8 lg:gap-12 xl:gap-16">
            {logos.map((logo) => (
              <div
                key={logo.name}
                className={`text-trello-navy opacity-80 hover:opacity-100 transition-opacity ${logo.className}`}
              >
                {logo.text}
              </div>
            ))}
          </div>
        </div>

        {/* Testimonial */}
        <div className="grid lg:grid-cols-5 gap-8 items-stretch">
          {/* Quote */}
          <div className="lg:col-span-3 bg-white rounded-xl p-8 lg:p-12 border border-border relative">
            {/* Navigation dots */}
            <div className="absolute top-8 right-8 flex items-center gap-4">
              <div className="flex gap-2">
                {testimonials.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentIndex(i)}
                    className={`h-2 rounded-full transition-all ${
                      i === currentIndex ? 'w-8 bg-trello-navy' : 'w-2 bg-muted'
                    }`}
                  />
                ))}
              </div>
              <div className="flex gap-2">
                <button
                  onClick={prevTestimonial}
                  className="w-10 h-10 rounded-full border border-border flex items-center justify-center hover:bg-secondary transition-colors"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={nextTestimonial}
                  className="w-10 h-10 rounded-full border border-border flex items-center justify-center hover:bg-secondary transition-colors"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>

            <blockquote className="text-xl lg:text-2xl text-foreground leading-relaxed mt-8 lg:mt-0">
              {testimonial.quote}
            </blockquote>

            <div className="mt-8 pt-8 border-t border-border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-bold text-foreground">{testimonial.author}</p>
                  <p className="text-muted-foreground">{testimonial.role}</p>
                  <p className="text-2xl font-bold text-trello-navy mt-4">
                    /{testimonial.company}
                  </p>
                </div>
                <a href="#" className="text-primary font-medium hover:underline">
                  Read the story
                </a>
              </div>
            </div>
          </div>

          {/* Stat Card */}
          <div className="lg:col-span-2 bg-primary rounded-xl p-8 lg:p-12 flex flex-col justify-center">
            <p className="text-3xl lg:text-4xl font-bold text-white leading-tight mb-6">
              81% of customers chose Trello for its ease of use.
            </p>
            <a
              href="#"
              className="text-white/80 hover:text-white underline font-medium"
            >
              Trello TechValidate Survey
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}