'use client'

import { useState } from 'react'
import type { ChangeEvent } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

export default function CTASection() {
  const [email, setEmail] = useState('')

  return (
    <section className="bg-cta-gradient py-20 lg:py-28">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-8">
            Get started with Trello today
          </h2>

          {/* Email Signup Form */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center mb-4">
            <Input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
              className="h-12 bg-white border-border max-w-sm"
            />
            <Button className="h-12 px-8 btn-trello-primary whitespace-nowrap">
              Sign up - it&apos;s free!
            </Button>
          </div>
          <p className="text-sm text-muted-foreground">
            By entering my email, I acknowledge the{' '}
            <a href="#" className="text-primary hover:underline">
              Atlassian Privacy Policy
            </a>
          </p>
        </div>
      </div>
    </section>
  )
}