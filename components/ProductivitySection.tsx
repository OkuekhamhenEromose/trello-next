'use client'

import { useState } from 'react'
import {
  Inbox as InboxIcon,
  Plus,
  Camera,
  Mic,
  MoreHorizontal,
  Send,
  Info,
  AlignLeft,
  Paperclip,
  Clock,
  FileText,
  ChevronsRight,
  ChevronDown,
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  CheckSquare,
  Users,
  ChevronsUp,
  MessageCircle,
  ThumbsUp,
} from 'lucide-react'

type FeatureId = 'inbox' | 'boards' | 'planner'

const features: { id: FeatureId; title: string; description: string }[] = [
  {
    id: 'inbox',
    title: 'Inbox',
    description:
      "When it's on your mind, it goes in your Inbox. Capture your to-dos from anywhere, anytime.",
  },
  {
    id: 'boards',
    title: 'Boards',
    description:
      'Your to-do list may be long, but it can be manageable! Keep tabs on everything from "to-dos to tackle" to "mission accomplished!"',
  },
  {
    id: 'planner',
    title: 'Planner',
    description:
      'Drag, drop, get it done. Snap your top tasks into your calendar and make time for what truly matters.',
  },
]

export default function ProductivitySection() {
  const [active, setActive] = useState<FeatureId>('inbox')
  const activeIndex = features.findIndex((f) => f.id === active)

  return (
    <section className="py-20 lg:py-28 bg-background">
      <div className="container mx-auto px-4 lg:px-8 max-w-7xl">
        {/* Header */}
        <div className="mb-12 max-w-3xl">
          <p className="section-label mb-3">TRELLO 101</p>
          <h2 className="text-3xl lg:text-5xl font-bold text-foreground mb-4 tracking-tight">
            Your productivity powerhouse
          </h2>
          <p className="text-lg text-muted-foreground">
            Stay organized and efficient with Inbox, Boards, and Planner. Every to-do, idea,
            or responsibility—no matter how small—finds its place, keeping you at the top of
            your game.
          </p>
        </div>

        <div className="grid lg:grid-cols-[minmax(0,1fr)_minmax(0,1.35fr)] gap-8 lg:gap-14 items-start">
          {/* Left – Feature Tabs */}
          <div className="space-y-2 lg:sticky lg:top-24">
            {features.map((feature) => {
              const isActive = active === feature.id
              return (
                <button
                  key={feature.id}
                  onClick={() => setActive(feature.id)}
                  className={`relative w-full text-left p-6 rounded-xl transition-all duration-300 ${
                    isActive
                      ? 'bg-card shadow-card'
                      : 'hover:bg-secondary/60'
                  }`}
                >
                  {isActive && (
                    <span
                      className="absolute left-0 top-3 bottom-3 w-1 rounded-r-full"
                      style={{ backgroundColor: 'var(--color-trello-cyan)' }}
                    />
                  )}
                  <h3
                    className={`text-2xl font-bold mb-2 transition-colors ${
                      isActive ? 'text-foreground' : 'text-muted-foreground'
                    }`}
                  >
                    {feature.title}
                  </h3>
                  <p
                    className={`leading-relaxed ${
                      isActive ? 'text-foreground/80' : 'text-muted-foreground'
                    }`}
                  >
                    {feature.description}
                  </p>
                </button>
              )
            })}

            {/* Pagination dots */}
            <div className="flex items-center gap-2 pt-4 pl-6">
              {features.map((feature) => (
                <button
                  key={feature.id}
                  aria-label={`Show ${feature.title}`}
                  onClick={() => setActive(feature.id)}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    active === feature.id
                      ? 'w-8'
                      : 'w-2 bg-muted-foreground/30 hover:bg-muted-foreground/50'
                  }`}
                  style={
                    active === feature.id
                      ? { backgroundColor: 'var(--color-trello-navy)' }
                      : undefined
                  }
                />
              ))}
            </div>
          </div>

          {/* Right – Preview window */}
          <div className="relative">
            <div className="relative overflow-hidden rounded-2xl bg-secondary/60 ring-1 ring-border/60 shadow-card">
              {/* Window dots */}
              <div className="flex items-center gap-1.5 px-5 py-3 border-b border-border/50">
                <span className="w-2.5 h-2.5 rounded-full bg-muted-foreground/30" />
                <span className="w-2.5 h-2.5 rounded-full bg-muted-foreground/30" />
                <span className="w-2.5 h-2.5 rounded-full bg-muted-foreground/30" />
              </div>

              {/* Sliding track */}
              <div
                className="relative w-full"
                style={{ minHeight: '560px' }}
              >
                <div
                  className="flex w-[300%] transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]"
                  style={{ transform: `translateX(-${activeIndex * (100 / 3)}%)` }}
                >
                  <div className="w-1/3 shrink-0 p-6 lg:p-8">
                    <InboxPreview />
                  </div>
                  <div className="w-1/3 shrink-0 p-6 lg:p-8">
                    <BoardsPreview />
                  </div>
                  <div className="w-1/3 shrink-0 p-6 lg:p-8">
                    <PlannerPreview />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ──────────────── INBOX ──────────────── */
function InboxPreview() {
  return (
    <div className="relative flex gap-4 h-full">
      {/* Inbox column */}
      <div
        className="flex-1 rounded-2xl p-4 shadow-elevated text-white max-w-[58%]"
        style={{ backgroundColor: 'var(--color-trello-purple)' }}
      >
        <div className="flex items-center gap-2 mb-4 font-semibold">
          <InboxIcon className="w-4 h-4" />
          <span>Inbox</span>
        </div>

        {/* Composer */}
        <div className="bg-white rounded-xl p-3 mb-3 text-foreground">
          <p className="text-sm text-muted-foreground mb-3">
            Add a todo, or use <span className="px-1.5 py-0.5 rounded bg-secondary text-xs font-mono">/</span> for actions
          </p>
          <div className="flex items-center justify-between text-muted-foreground">
            <div className="flex items-center gap-3">
              <Plus className="w-4 h-4" />
              <Camera className="w-4 h-4" />
              <Mic className="w-4 h-4" />
              <MoreHorizontal className="w-4 h-4" />
            </div>
            <Send className="w-4 h-4" style={{ color: 'var(--color-primary)' }} />
          </div>
        </div>

        <InboxCard title="Marketing presentation got moved up to Friday" badge="slack" />
        <InboxCard title="Your stay in Austin" badge="gmail" />
        <InboxCard title="Project poster" badge="confluence" subtitle="This page includes the 3.0 script for our Banc.ly Keynote. We previewed it with…" />
      </div>

      {/* Peek of Personal Task Board on the right */}
      <div
        className="flex-1 rounded-2xl p-4 shadow-elevated text-white relative overflow-hidden"
        style={{ backgroundColor: 'var(--color-trello-blue)' }}
      >
        <div className="flex items-center gap-2 mb-4">
          <span className="font-semibold">Personal Task Board</span>
          <ChevronDown className="w-4 h-4 opacity-80" />
        </div>
        <div className="bg-white/15 backdrop-blur rounded-xl p-3">
          <div className="flex items-center justify-between text-sm mb-3">
            <span className="font-medium">To Do - Today</span>
            <div className="flex items-center gap-2 opacity-80">
              <ChevronsRight className="w-3.5 h-3.5" />
              <MoreHorizontal className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="space-y-2">
            <div className="bg-white rounded-md p-2.5 text-xs text-foreground/60">
              Review designs…
              <div className="flex items-center gap-1 mt-1.5 text-muted-foreground">
                <Paperclip className="w-3 h-3" /> 1
              </div>
            </div>
            <div className="bg-white rounded-md p-2.5 text-xs text-foreground/70">
              Create blitz <span className="text-foreground">and write test instructions for project Ranier</span>
            </div>
            <div className="bg-white rounded-md p-2.5 text-xs text-foreground/60">
              Reques…
              <div className="flex items-center gap-1 mt-1.5 text-muted-foreground">
                <Clock className="w-3 h-3" /> Jun…
              </div>
            </div>
          </div>
        </div>

        {/* Hand-drawn arrow + callout */}
        <div className="absolute top-[42%] -left-6 right-2 pointer-events-none">
          <div className="relative">
            <div className="absolute -top-6 left-0 bg-white rounded-lg shadow-elevated px-3 py-2 text-foreground text-xs font-medium max-w-[180px]">
              Prepare analysis of recent campaigns
            </div>
            <svg viewBox="0 0 240 80" className="w-full h-12 mt-6" style={{ color: 'var(--color-trello-navy)' }}>
              <path
                d="M10 60 Q 90 10, 200 40"
                stroke="currentColor"
                strokeWidth="2.5"
                fill="none"
                strokeLinecap="round"
              />
              <path d="M192 30 L 205 41 L 188 50" stroke="currentColor" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  )
}

function InboxCard({
  title,
  badge,
  subtitle,
}: {
  title: string
  badge: 'slack' | 'gmail' | 'confluence'
  subtitle?: string
}) {
  const badgeMap = {
    slack: { bg: '#611f69', label: '#' },
    gmail: { bg: '#ea4335', label: 'M' },
    confluence: { bg: '#0052cc', label: 'C' },
  }
  const b = badgeMap[badge]
  return (
    <div className="bg-white rounded-xl p-3 mb-2 text-foreground shadow-sm">
      <p className="text-sm font-medium mb-1.5">{title}</p>
      {subtitle && <p className="text-xs text-muted-foreground mb-2 line-clamp-2">{subtitle}</p>}
      <div className="flex items-center gap-2 text-muted-foreground">
        <span
          className="w-4 h-4 rounded-sm flex items-center justify-center text-[10px] font-bold text-white"
          style={{ backgroundColor: b.bg }}
        >
          {b.label}
        </span>
        <Info className="w-3.5 h-3.5" />
        <AlignLeft className="w-3.5 h-3.5" />
      </div>
    </div>
  )
}

/* ──────────────── BOARDS ──────────────── */
function BoardsPreview() {
  return (
    <div
      className="rounded-2xl p-4 lg:p-5 shadow-elevated text-white h-full"
      style={{ backgroundColor: 'var(--color-trello-blue)' }}
    >
      <div className="flex items-center gap-2 mb-5">
        <span className="text-lg font-semibold">Personal Task Board</span>
        <ChevronsRight className="w-4 h-4 ml-2 opacity-80" />
        <ChevronDown className="w-4 h-4 opacity-80" />
      </div>

      <div className="grid grid-cols-3 gap-3">
        <BoardColumn title="To Do - Today">
          <BoardCard>
            <p className="text-sm font-medium text-foreground mb-2">Prepare analysis of recent campaigns</p>
            <div className="flex items-center gap-2 text-muted-foreground">
              <span className="w-4 h-4 rounded-sm flex items-center justify-center text-[10px] font-bold text-white" style={{ backgroundColor: '#611f69' }}>#</span>
              <Info className="w-3.5 h-3.5" />
              <AlignLeft className="w-3.5 h-3.5" />
            </div>
          </BoardCard>
          <BoardCard>
            <p className="text-sm text-foreground">Create blitz board and write test instructions for project Ranier</p>
          </BoardCard>
          <AddCard />
        </BoardColumn>

        <BoardColumn title="This week">
          <BoardCard>
            <p className="text-sm font-medium text-foreground mb-1.5">Review designs for Project Everest</p>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Paperclip className="w-3 h-3" /> 1
            </div>
          </BoardCard>
          <BoardCard>
            <p className="text-sm font-medium text-foreground mb-1.5">Create an update…</p>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Clock className="w-3 h-3" /> Jun 20
            </div>
          </BoardCard>
          <BoardCard>
            <p className="text-sm font-medium text-foreground mb-1.5">Request Peer Feedback</p>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Clock className="w-3 h-3" /> Jun 24
            </div>
          </BoardCard>
          <AddCard />
        </BoardColumn>

        <BoardColumn title="Read later">
          <BoardCard>
            <p className="text-sm font-medium text-foreground mb-2 flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5" style={{ color: 'var(--color-primary)' }} />
              <span style={{ color: 'var(--color-primary)' }}>RFC: Card Actions | J…</span>
            </p>
            <p className="text-xs text-muted-foreground mb-2">Jane is working marketing blog…</p>
            <div className="flex items-center gap-3 text-xs text-muted-foreground">
              <span className="flex items-center gap-1"><MessageCircle className="w-3 h-3" /> 2</span>
              <span className="flex items-center gap-1"><ThumbsUp className="w-3 h-3" /> 2</span>
            </div>
          </BoardCard>
          <BoardCard>
            <p className="text-xs font-medium text-muted-foreground">Jira</p>
          </BoardCard>
          <AddCard />
        </BoardColumn>
      </div>
    </div>
  )
}

function BoardColumn({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white/15 backdrop-blur rounded-xl p-2.5">
      <div className="flex items-center justify-between mb-2.5 px-1">
        <span className="text-sm font-semibold">{title}</span>
        <div className="flex items-center gap-1.5 opacity-80">
          <ChevronsRight className="w-3.5 h-3.5" />
          <MoreHorizontal className="w-3.5 h-3.5" />
        </div>
      </div>
      <div className="space-y-2">{children}</div>
    </div>
  )
}

function BoardCard({ children }: { children: React.ReactNode }) {
  return <div className="bg-white rounded-lg p-2.5 shadow-sm">{children}</div>
}

function AddCard() {
  return (
    <button className="w-full flex items-center justify-between text-xs text-white/90 hover:bg-white/10 rounded-md py-1.5 px-2 transition-colors">
      <span className="flex items-center gap-1"><Plus className="w-3.5 h-3.5" /> Add a card</span>
      <FileText className="w-3.5 h-3.5 opacity-70" />
    </button>
  )
}

/* ──────────────── PLANNER ──────────────── */
function PlannerPreview() {
  const hours = ['8am', '9am', '10am', '11am', '12pm', '1pm']
  return (
    <div className="bg-white rounded-2xl shadow-elevated p-4 lg:p-5 h-full relative">
      {/* Toolbar */}
      <div className="flex items-center gap-3 mb-4">
        <button className="flex items-center gap-1.5 text-sm font-medium text-foreground px-2 py-1 rounded hover:bg-secondary">
          <CalendarIcon className="w-4 h-4" style={{ color: 'var(--color-primary)' }} />
          Apr 2025 <ChevronDown className="w-3.5 h-3.5" />
        </button>
        <div className="flex items-center gap-1 ml-auto">
          <button className="p-1.5 rounded hover:bg-secondary"><ChevronLeft className="w-4 h-4" /></button>
          <button className="px-3 py-1 text-sm rounded bg-secondary font-medium">Today</button>
          <button className="p-1.5 rounded hover:bg-secondary"><ChevronRight className="w-4 h-4" /></button>
        </div>
      </div>

      {/* Day headers */}
      <div className="grid grid-cols-[40px_1fr_1fr_1fr] mb-2">
        <div />
        <DayHeader day="Wed" date="23" />
        <DayHeader day="Thurs" date="24" />
        <DayHeader day="Fri" date="25" />
      </div>

      {/* Time grid */}
      <div className="grid grid-cols-[40px_1fr_1fr_1fr] gap-y-0 relative">
        {hours.map((h, i) => (
          <FragmentRow key={h} hour={h} rowIndex={i} />
        ))}

        {/* Events – Wed */}
        <CalEvent col={1} row={1} h={1} color="green" title="XF stand up" />
        <CalEvent col={1} row={2} h={1} color="green" title="Marketing assets a" trailing="3" />
        <CalEvent col={1} row={3} h={1} color="green" title="Trello townhall" subtitle="10 - 11am" />
        <CalEvent col={1} row={4} h={1} color="orange" title="Data team shareout" />
        <CalEvent col={1} row={5} h={2} color="purple" title="Focus time" subtitle="Marketing presentation got move…" />

        {/* Events – Thurs */}
        <CalEvent col={2} row={1} h={1} color="green" title="XF stand up" />
        <CalEvent col={2} row={2} h={1} color="purple" title="Focus time" subtitle="Complete peer review" tertiary="+1 more" highlight />
        <CalEvent col={2} row={3} h={1} color="blue" title="Roadmap shareout" />
        <CalEvent col={2} row={4} h={1} color="orange" title="Taco <> Chorizo" />

        {/* Events – Fri */}
        <CalEvent col={3} row={1} h={1} color="blue" title="Visual design workshop" subtitle="9 - 10am" />
        <CalEvent col={3} row={3} h={1} color="blue" title="User research session #4" subtitle="10:30 - 11:30am" />
        <CalEvent col={3} row={5} h={1} color="blue" title="Team hangout" />
        <CalEvent col={3} row={6} h={1} color="purple" title="Research debrief" />
      </div>

      {/* Callout */}
      <div className="absolute top-[28%] right-3 lg:right-6 bg-white rounded-xl shadow-elevated p-3 max-w-[230px] border border-border">
        <div className="flex items-start gap-2 mb-2">
          <CheckSquare className="w-4 h-4 mt-0.5" style={{ color: 'var(--color-primary)' }} />
          <p className="text-sm font-semibold leading-snug" style={{ color: 'var(--color-primary)' }}>
            RAINIER-8: Implement analytics and observability
          </p>
        </div>
        <div className="flex items-center gap-2 flex-wrap text-xs text-muted-foreground mb-2">
          <span className="px-1.5 py-0.5 rounded bg-secondary font-medium flex items-center gap-1">
            IN REVIEW <ChevronDown className="w-3 h-3" />
          </span>
          <span className="flex items-center gap-1"><ChevronsUp className="w-3 h-3" style={{ color: 'var(--color-trello-orange)' }} /> Medium</span>
          <span className="flex items-center gap-1"><Users className="w-3 h-3" /> 1</span>
        </div>
        <div className="flex items-center justify-between text-xs">
          <span className="flex items-center gap-1 text-muted-foreground">
            <span className="w-3 h-3 rounded-sm" style={{ backgroundColor: '#2684ff' }} />
            Jira
          </span>
          <button className="text-foreground font-medium hover:underline">Open preview</button>
        </div>
      </div>
    </div>
  )
}

function DayHeader({ day, date }: { day: string; date: string }) {
  return (
    <div className="px-2">
      <div className="text-xs text-muted-foreground">{day}</div>
      <div className="text-2xl font-semibold text-foreground leading-tight">{date}</div>
    </div>
  )
}

function FragmentRow({ hour, rowIndex }: { hour: string; rowIndex: number }) {
  return (
    <>
      <div className="text-[11px] text-muted-foreground pr-2 text-right -mt-1.5" style={{ gridColumn: 1, gridRow: rowIndex + 1 }}>
        {hour}
      </div>
      <div className="border-t border-border h-14" style={{ gridColumn: 2, gridRow: rowIndex + 1 }} />
      <div className="border-t border-border h-14" style={{ gridColumn: 3, gridRow: rowIndex + 1 }} />
      <div className="border-t border-border h-14" style={{ gridColumn: 4, gridRow: rowIndex + 1 }} />
    </>
  )
}

function CalEvent({
  col,
  row,
  h,
  color,
  title,
  subtitle,
  tertiary,
  trailing,
  highlight,
}: {
  col: 1 | 2 | 3
  row: number
  h: number
  color: 'green' | 'blue' | 'purple' | 'orange'
  title: string
  subtitle?: string
  tertiary?: string
  trailing?: string
  highlight?: boolean
}) {
  const palette = {
    green: { bg: '#e3fcef', text: '#006644', border: '#abf5d1' },
    blue: { bg: '#deebff', text: '#0747a6', border: '#b3d4ff' },
    purple: { bg: '#eae6ff', text: '#403294', border: '#c0b6f2' },
    orange: { bg: '#fff0b3', text: '#974f0c', border: '#ffe380' },
  }[color]

  return (
    <div
      className={`mx-0.5 rounded-md px-2 py-1.5 text-[11px] leading-tight overflow-hidden ${
        highlight ? 'ring-2 ring-offset-1' : ''
      }`}
      style={{
        gridColumn: col + 1,
        gridRow: `${row + 1} / span ${h}`,
        backgroundColor: palette.bg,
        color: palette.text,
        border: `1px solid ${palette.border}`,
      }}
    >
      <div className="flex items-center justify-between">
        <span className="font-semibold truncate">{title}</span>
        {trailing && <span className="ml-1 opacity-70">{trailing}</span>}
      </div>
      {subtitle && <div className="opacity-80 truncate">{subtitle}</div>}
      {tertiary && <div className="opacity-70">{tertiary}</div>}
    </div>
  )
}
