'use client'

import { Calendar } from 'lucide-react'
import Image from 'next/image'

export default function MessageToActionSection() {
  return (
    <section className="bg-[#0052cc] py-16 lg:py-24">

      {/* ── Section header ── */}
      <div className="text-center px-4 mb-14">
        <h2 className="text-3xl lg:text-[2.5rem] font-bold text-white mb-4 leading-tight">
          From message to action
        </h2>
        <p className="text-[1.0625rem] text-white/80 max-w-xl mx-auto leading-relaxed">
          Quickly turn communication from your favorite apps into to-dos, keeping all
          your discussions and tasks organized in one place.
        </p>
      </div>

      {/* ── Cards stack ── */}
      <div className="mx-auto max-w-[1100px] px-4 lg:px-8 flex flex-col gap-6">

        {/* ══════════════════════════════════════
            CARD 1 – Email Magic
            Gray image panel (left) | Copy (right)
        ══════════════════════════════════════ */}
        <div className="bg-white rounded-2xl overflow-hidden shadow-[0_8px_32px_rgba(0,0,0,0.12)] grid lg:grid-cols-2">

          {/* Left – gray image panel, flush to card edges */}
          <div className="bg-[#f4f5f7] flex items-center justify-center p-8 lg:p-10 min-h-[300px] lg:min-h-[380px]">
            <Image
              src="/trelloemailmagic.webp"
              alt="Email forwarded to Trello Inbox"
              width={540}
              height={380}
              className="w-full max-w-[460px] h-auto object-contain"
              priority
            />
          </div>

          {/* Right – copy */}
          <div className="flex flex-col justify-center px-10 py-10 lg:px-14 lg:py-0">
            {/* Label */}
            <div className="flex items-center gap-3 mb-5">
              <div className="w-9 h-9 rounded-lg bg-[#f0f0ff] flex items-center justify-center shrink-0">
                {/* Stacked-rows icon matching Trello's Email Magic label */}
                <svg width="18" height="14" viewBox="0 0 18 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect x="0" y="0"   width="18" height="3" rx="1.5" fill="#6554c0"/>
                  <rect x="0" y="5.5" width="13" height="3" rx="1.5" fill="#6554c0"/>
                  <rect x="0" y="11"  width="9"  height="3" rx="1.5" fill="#6554c0"/>
                </svg>
              </div>
              <span className="text-[0.68rem] font-bold text-[#6554c0] uppercase tracking-[0.13em]">
                Email Magic
              </span>
            </div>

            <p className="text-[1.0625rem] leading-[1.8] text-[#172b4d]">
              Easily turn your emails into to-dos! Just forward them to your Trello
              Inbox, and they&apos;ll be transformed by AI into organized to-dos with
              all the links you need.
            </p>
          </div>
        </div>

        {/* ══════════════════════════════════════
            CARD 2 – Message App Sorcery
            Copy (left) | Gray image panel (right)
        ══════════════════════════════════════ */}
        <div className="bg-white rounded-2xl overflow-hidden shadow-[0_8px_32px_rgba(0,0,0,0.12)] grid lg:grid-cols-2">

          {/* Left – copy */}
          <div className="flex flex-col justify-center px-10 py-10 lg:px-14 lg:py-0 order-2 lg:order-1">
            {/* Label */}
            <div className="flex items-center gap-3 mb-5">
              <div className="w-9 h-9 rounded-lg bg-[#f0f0ff] flex items-center justify-center shrink-0">
                <Calendar className="w-[18px] h-[18px] text-[#6554c0]" strokeWidth={2} />
              </div>
              <span className="text-[0.68rem] font-bold text-[#6554c0] uppercase tracking-[0.13em]">
                Message App Sorcery
              </span>
            </div>

            <p className="text-[1.0625rem] leading-[1.8] text-[#172b4d]">
              Need to follow up on a message from Slack or Microsoft Teams? Send it
              directly to your Trello board! Your favorite app interface lets you save
              messages that appear in your Trello Inbox with AI-generated summaries
              and links.
            </p>
          </div>

          {/* Right – gray image panel, flush to card edges */}
          <div className="bg-[#f4f5f7] flex items-center justify-center p-8 lg:p-10 min-h-[300px] lg:min-h-[380px] order-1 lg:order-2">
            <Image
              src="/slackteams-to-inbox.webp"
              alt="Slack or Teams message saved to Trello Inbox"
              width={540}
              height={380}
              className="w-full max-w-[460px] h-auto object-contain"
            />
          </div>
        </div>

      </div>
    </section>
  )
}