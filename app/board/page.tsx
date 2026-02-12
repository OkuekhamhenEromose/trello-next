'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
  Search, Bell, HelpCircle, Plus, MoreHorizontal, Star, Filter, Zap,
  Users, Share2, Inbox, CalendarDays, LayoutGrid, ChevronDown, Mail,
  Smartphone, Lock, X, Play, Link as LinkIcon, Table, Calendar, BarChart3, Clock, MapPin
} from 'lucide-react'
import TrelloLogo from '@/components/TrelloLogo'

interface Card {
  id: string
  title: string
  completed?: boolean
  labels?: string[]
  hasAttachment?: boolean
}

interface List {
  id: string
  title: string
  cards: Card[]
  color?: string
}

export default function BoardPage() {
  const [showViewsDropdown, setShowViewsDropdown] = useState(false)
  const [addingCardTo, setAddingCardTo] = useState<string | null>(null)
  const [newCardText, setNewCardText] = useState('')

  const [lists, setLists] = useState<List[]>([
    {
      id: 'starter',
      title: 'Trello Starter Guide',
      color: 'hsl(35,90%,55%)',
      cards: [
        { id: 's1', title: 'New to Trello? Start here', hasAttachment: true },
      ],
    },
    {
      id: 'today',
      title: 'Today',
      color: 'hsl(35,80%,50%)',
      cards: [
        { id: 't1', title: 'Start using Trello', completed: true },
      ],
    },
    {
      id: 'this-week',
      title: 'This Week',
      color: 'hsl(35,80%,50%)',
      cards: [],
    },
    {
      id: 'later',
      title: 'Later',
      color: 'hsl(35,80%,50%)',
      cards: [],
    },
  ])

  const [draggedCard, setDraggedCard] = useState<{ card: Card; fromList: string } | null>(null)

  const addCard = (listId: string) => {
    if (!newCardText.trim()) return
    setLists(prev =>
      prev.map(l =>
        l.id === listId
          ? { ...l, cards: [...l.cards, { id: Date.now().toString(), title: newCardText.trim() }] }
          : l
      )
    )
    setNewCardText('')
    setAddingCardTo(null)
  }

  const handleDrop = (targetListId: string) => {
    if (!draggedCard) return
    setLists(prev => {
      const updated = prev.map(l => ({
        ...l,
        cards: l.id === draggedCard.fromList
          ? l.cards.filter(c => c.id !== draggedCard.card.id)
          : l.id === targetListId
          ? [...l.cards, draggedCard.card]
          : l.cards,
      }))
      return updated
    })
    setDraggedCard(null)
  }

  const views = [
    { icon: <LayoutGrid className="w-4 h-4" />, label: 'Board' },
    { icon: <Table className="w-4 h-4" />, label: 'Table' },
    { icon: <Calendar className="w-4 h-4" />, label: 'Calendar' },
    { icon: <BarChart3 className="w-4 h-4" />, label: 'Dashboard' },
    { icon: <Clock className="w-4 h-4" />, label: 'Timeline' },
    { icon: <MapPin className="w-4 h-4" />, label: 'Map' },
  ]

  return (
    <div className="h-screen flex flex-col bg-[hsl(215,30%,22%)]">
      {/* Top Navigation */}
      <header className="bg-[hsl(215,30%,18%)] border-b border-white/10 px-3 py-2 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button className="text-white/70 hover:text-white">
            <LayoutGrid className="w-5 h-5" />
          </button>
          <Link href="/" className="flex items-center gap-1.5">
            <TrelloLogo size="sm" />
          </Link>
        </div>

        <div className="flex-1 max-w-lg mx-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/50" />
            <Input 
              className="bg-white/10 border-none text-white placeholder:text-white/50 pl-9 h-8 text-sm focus-visible:ring-1 focus-visible:ring-white/30" 
              placeholder="Search" 
            />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button size="sm" className="bg-[hsl(210,100%,50%)] hover:bg-[hsl(210,100%,45%)] text-white text-sm h-8 px-3">
            Create
          </Button>
          <span className="text-xs text-white/60 bg-white/10 px-2 py-1 rounded">✨ 14 days left</span>
          <button className="text-white/70 hover:text-white p-1">
            <LayoutGrid className="w-4 h-4" />
          </button>
          <button className="text-white/70 hover:text-white p-1">
            <Bell className="w-4 h-4" />
          </button>
          <button className="text-white/70 hover:text-white p-1">
            <HelpCircle className="w-4 h-4" />
          </button>
          <div className="w-7 h-7 bg-[hsl(25,80%,50%)] rounded-full flex items-center justify-center text-white text-xs font-bold">
            EE
          </div>
        </div>
      </header>

      {/* Board Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Inbox Sidebar */}
        <aside className="w-72 bg-[hsl(215,30%,16%)] border-r border-white/5 flex flex-col p-4 shrink-0">
          <div className="flex items-center gap-2 mb-2">
            <Inbox className="w-4 h-4 text-white/70" />
            <span className="text-white font-semibold text-sm">Inbox</span>
          </div>
          <div className="bg-[hsl(215,25%,22%)] rounded p-2 text-white/50 text-sm mb-6 cursor-text">
            Add a card
          </div>

          <div className="mt-4">
            <h3 className="text-white font-semibold text-sm text-center mb-1">Consolidate your to-dos</h3>
            <p className="text-white/50 text-xs text-center mb-4">
              Email it, say it, forward it — however it comes, get it into Trello fast.
            </p>
            <div className="flex flex-wrap justify-center gap-3 mb-6">
              {[
                { icon: <Mail className="w-5 h-5" />, color: 'hsl(230,60%,55%)' },
                { icon: <span className="text-lg">🟢</span>, color: 'hsl(140,60%,45%)', badge: 'NEW' },
                { icon: <Smartphone className="w-5 h-5" />, color: 'hsl(45,90%,55%)' },
                { icon: <span className="text-lg">💬</span>, color: 'hsl(290,50%,50%)' },
                { icon: <span className="text-lg">👥</span>, color: 'hsl(170,60%,45%)' },
              ].map((item, i) => (
                <div key={i} className="relative">
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center text-white"
                    style={{ background: item.color }}
                  >
                    {item.icon}
                  </div>
                  {item.badge && (
                    <span className="absolute -top-1 -right-1 bg-[hsl(140,60%,45%)] text-white text-[8px] font-bold px-1 rounded">
                      {item.badge}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="mt-auto flex items-center gap-1 text-white/40 text-xs">
            <Lock className="w-3 h-3" />
            <span>Inbox is only visible to you</span>
          </div>
        </aside>

        {/* Board Area */}
        <div 
          className="flex-1 flex flex-col overflow-hidden" 
          style={{ background: 'linear-gradient(135deg, hsl(280,60%,45%), hsl(330,70%,55%))' }}
        >
          {/* Board Header */}
          <div className="flex items-center justify-between px-4 py-2">
            <div className="flex items-center gap-3">
              <h1 className="text-white font-bold text-base">My Trello board</h1>
              <div className="relative">
                <button
                  onClick={() => setShowViewsDropdown(!showViewsDropdown)}
                  className="flex items-center gap-1 text-white/80 hover:text-white bg-white/10 px-2 py-1 rounded text-xs"
                >
                  <LayoutGrid className="w-3 h-3" />
                  <ChevronDown className="w-3 h-3" />
                </button>
                {showViewsDropdown && (
                  <div className="absolute top-8 left-0 bg-[hsl(215,25%,22%)] rounded-lg shadow-xl border border-white/10 p-4 w-64 z-50">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-white font-semibold text-sm">Views</h3>
                      <button 
                        onClick={() => setShowViewsDropdown(false)} 
                        className="text-white/50 hover:text-white"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="bg-[hsl(290,60%,30%)] text-[10px] text-white font-semibold px-1.5 py-0.5 rounded w-fit mb-1">
                      PREMIUM
                    </div>
                    <p className="text-white/50 text-xs mb-1">See your work in a new way</p>
                    <p className="text-white/40 text-[10px] mb-3">
                      Views are only available to Premium Workspaces.
                    </p>
                    {views.map((v) => (
                      <button 
                        key={v.label} 
                        className="flex items-center gap-3 w-full p-2 text-white/80 hover:bg-white/5 rounded text-sm"
                      >
                        {v.icon}
                        {v.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 bg-[hsl(25,80%,50%)] rounded-full flex items-center justify-center text-white text-xs font-bold">
                EE
              </div>
              <button className="text-white/70 hover:text-white p-1">
                <Zap className="w-4 h-4" />
              </button>
              <button className="text-white/70 hover:text-white p-1">
                <Filter className="w-4 h-4" />
              </button>
              <button className="text-white/70 hover:text-white p-1">
                <Star className="w-4 h-4" />
              </button>
              <button className="text-white/70 hover:text-white p-1">
                <Users className="w-4 h-4" />
              </button>
              <Button 
                size="sm" 
                variant="outline" 
                className="text-white border-white/30 hover:bg-white/10 text-xs h-7 gap-1"
              >
                <Share2 className="w-3 h-3" /> Share
              </Button>
              <button className="text-white/70 hover:text-white p-1">
                <MoreHorizontal className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Lists */}
          <div className="flex-1 overflow-x-auto px-4 pb-4">
            <div className="flex gap-3 h-full">
              {lists.map((list) => (
                <div
                  key={list.id}
                  className="w-72 shrink-0 bg-[hsl(215,25%,18%)] rounded-xl flex flex-col max-h-full"
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={() => handleDrop(list.id)}
                >
                  {/* List header */}
                  <div className="flex items-center justify-between p-3 pb-1">
                    <div className="flex items-center gap-2">
                      {list.color && <div className="w-full h-1 rounded-full absolute top-0 left-0" />}
                      <span className="text-white font-semibold text-sm">{list.title}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <button className="text-white/40 hover:text-white">
                        <MoreHorizontal className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Color bar */}
                  {list.color && (
                    <div className="h-1 mx-3 rounded-full mb-1" style={{ background: list.color }} />
                  )}

                  {/* Cards */}
                  <div className="flex-1 overflow-y-auto px-2 py-1 space-y-1.5">
                    {list.cards.map((card) => (
                      <div
                        key={card.id}
                        draggable
                        onDragStart={() => setDraggedCard({ card, fromList: list.id })}
                        className="bg-[hsl(215,25%,24%)] hover:bg-[hsl(215,25%,28%)] rounded-lg p-2.5 cursor-grab active:cursor-grabbing group border border-white/5 hover:border-white/10 transition-colors"
                      >
                        {card.completed !== undefined && (
                          <div className="flex items-center gap-2">
                            <div 
                              className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                                card.completed 
                                  ? 'bg-[hsl(140,60%,45%)] border-[hsl(140,60%,45%)]' 
                                  : 'border-white/30'
                              }`}
                            >
                              {card.completed && <span className="text-white text-[10px]">✓</span>}
                            </div>
                            <span className={`text-sm ${card.completed ? 'text-white/50 line-through' : 'text-white'}`}>
                              {card.title}
                            </span>
                          </div>
                        )}
                        {card.completed === undefined && (
                          <>
                            {card.hasAttachment && (
                              <div className="w-full h-32 bg-[hsl(35,80%,55%)] rounded mb-2 flex items-center justify-center">
                                <Play className="w-10 h-10 text-white bg-[hsl(210,100%,50%)] rounded-full p-2" />
                              </div>
                            )}
                            <p className="text-sm text-[hsl(210,100%,60%)] hover:underline cursor-pointer">
                              {card.title}
                            </p>
                            {card.hasAttachment && (
                              <div className="flex items-center gap-1 mt-1 text-white/40 text-xs">
                                <LinkIcon className="w-3 h-3" /> Loom
                              </div>
                            )}
                          </>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Add card */}
                  <div className="p-2">
                    {addingCardTo === list.id ? (
                      <div>
                        <Input
                          value={newCardText}
                          onChange={(e) => setNewCardText(e.target.value)}
                          placeholder="Enter a title..."
                          className="bg-[hsl(215,25%,24%)] border-none text-white placeholder:text-white/40 text-sm h-8 mb-2"
                          autoFocus
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') addCard(list.id)
                            if (e.key === 'Escape') setAddingCardTo(null)
                          }}
                        />
                        <div className="flex items-center gap-2">
                          <Button 
                            onClick={() => addCard(list.id)} 
                            size="sm" 
                            className="bg-primary hover:bg-primary/90 text-primary-foreground text-xs h-7"
                          >
                            Add card
                          </Button>
                          <button 
                            onClick={() => setAddingCardTo(null)} 
                            className="text-white/50 hover:text-white"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center justify-between">
                        <button
                          onClick={() => setAddingCardTo(list.id)}
                          className="flex items-center gap-1 text-white/50 hover:text-white text-sm"
                        >
                          <Plus className="w-4 h-4" /> Add a card
                        </button>
                        <button className="text-white/40 hover:text-white">
                          <LayoutGrid className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom bar */}
          <div className="bg-[hsl(215,30%,18%)] border-t border-white/10 flex items-center justify-center gap-1 py-2">
            {[
              { icon: <Inbox className="w-4 h-4" />, label: 'Inbox', active: false },
              { icon: <CalendarDays className="w-4 h-4" />, label: 'Planner', active: false },
              { icon: <LayoutGrid className="w-4 h-4" />, label: 'Board', active: true },
              { icon: <LayoutGrid className="w-4 h-4" />, label: 'Switch boards', active: false },
            ].map((item) => (
              <button
                key={item.label}
                className={`flex items-center gap-1.5 px-4 py-1.5 rounded text-sm ${
                  item.active
                    ? 'bg-white/10 text-white font-medium'
                    : 'text-white/60 hover:text-white hover:bg-white/5'
                }`}
              >
                {item.icon}
                {item.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}