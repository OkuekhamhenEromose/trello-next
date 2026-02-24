"use client";

import { useState, useRef, useEffect } from "react";
import {
  Search, Plus, Bell, HelpCircle, MoreHorizontal, Star, Users, X,
  Inbox, Calendar, LayoutDashboard, Grid3x3, Mail, Smartphone, Slack,
  Chrome, Lock, ChevronRight, Clock, Pin, ArrowRight, SlidersHorizontal,
  Zap, Filter,
} from "lucide-react";

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────
interface Card  { id: string; title: string }
interface List  { id: string; title: string; cards: Card[] }
type PanelKey = "inbox" | "planner" | "board";

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────
function TrelloLogo() {
  return (
    <div className="flex items-center gap-1.5 select-none">
      <div className="w-7 h-7 bg-[#579dff] rounded-[6px] flex items-center justify-center flex-shrink-0">
        <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
          <rect x="1.5" y="1.5" width="4.5" height="9.5" rx="1" fill="white"/>
          <rect x="9"   y="1.5" width="4.5" height="6"   rx="1" fill="white"/>
        </svg>
      </div>
      <span className="text-white font-bold text-[20px] tracking-tight hidden sm:inline">Trello</span>
    </div>
  );
}

function Avatar({ initials = "EO", size = "md", ring = false }: { initials?: string; size?: "sm"|"md"; ring?: boolean }) {
  const sz = size === "sm" ? "w-7 h-7 text-[11px]" : "w-8 h-8 text-[13px]";
  return (
    <div className={`${sz} rounded-full bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center text-white font-bold cursor-pointer hover:opacity-90 transition-opacity flex-shrink-0 ${ring ? "ring-2 ring-[#579dff] ring-offset-1 ring-offset-[#1d2125]" : ""}`}>
      {initials}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Search
// ─────────────────────────────────────────────────────────────────────────────
function SearchBar() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const h = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false); };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  return (
    <div ref={ref} className="relative w-full max-w-[600px]">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9fadbc] pointer-events-none" />
      <input onFocus={() => setOpen(true)} placeholder="Search"
        className="w-full bg-[#2c333a] border border-[#454f59] hover:border-[#738496] focus:border-[#579dff] rounded-[5px] pl-9 pr-3 py-[7px] text-[#b6c2cf] placeholder:text-[#9fadbc] text-sm focus:outline-none focus:ring-1 focus:ring-[#579dff]/30 transition-all" />
      {open && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-[#282e33] rounded-lg shadow-2xl border border-[#3d4c5c] z-50 py-1">
          <div className="px-3 py-1.5 text-[10px] font-bold text-[#9fadbc] tracking-widest uppercase">Recent Boards</div>
          {[
            { name: "new one1",       ws: "Eromose Okuekhamhen's workspace", g: "from-blue-700 to-blue-900" },
            { name: "Kanban Template",ws: "Private Workspace",               g: "from-orange-400 via-pink-400 to-cyan-400" },
          ].map(b => (
            <button key={b.name} className="w-full flex items-center gap-3 px-3 py-[9px] hover:bg-[#3d4c5c] transition-colors">
              <div className={`w-8 h-6 rounded bg-gradient-to-br ${b.g} flex-shrink-0`} />
              <div className="text-left">
                <div className="text-[#b6c2cf] text-[13px]">{b.name}</div>
                <div className="text-[#9fadbc] text-xs">{b.ws}</div>
              </div>
            </button>
          ))}
          <div className="border-t border-[#3d4c5c] mt-1 pt-1">
            <button className="w-full flex items-center gap-3 px-3 py-[9px] hover:bg-[#3d4c5c] transition-colors">
              <Search className="w-4 h-4 text-[#9fadbc]" />
              <span className="text-[#b6c2cf] text-[13px]">Advanced search</span>
              <ArrowRight className="w-3 h-3 text-[#9fadbc] ml-auto" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Board Switcher Modal
// ─────────────────────────────────────────────────────────────────────────────
function BoardSwitcherModal({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center" onClick={onClose}>
      <div className="absolute inset-0 bg-black/40 backdrop-blur-[1px]" />
      <div className="relative mt-14 bg-[#282e33] rounded-xl w-full max-w-[556px] mx-4 shadow-2xl border border-[#3d4c5c]" onClick={e => e.stopPropagation()}>
        <div className="p-4 border-b border-[#3d4c5c]">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-[#b6c2cf] font-semibold text-[15px]">Switch boards</h2>
            <div className="flex items-center gap-1">
              <button className="p-1.5 hover:bg-[#3d4c5c] rounded text-[#9fadbc]"><Pin className="w-4 h-4" /></button>
              <button onClick={onClose} className="p-1.5 hover:bg-[#3d4c5c] rounded text-[#9fadbc]"><X className="w-4 h-4" /></button>
            </div>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9fadbc]" />
            <input autoFocus placeholder="Search your boards"
              className="w-full bg-[#1d2125] border border-[#579dff] rounded-[4px] pl-9 pr-3 py-2 text-[#b6c2cf] placeholder:text-[#9fadbc] text-[13px] focus:outline-none" />
          </div>
        </div>
        <div className="px-4 pt-3 flex gap-2">
          <button className="px-3 py-1.5 bg-[#579dff]/20 text-[#579dff] rounded-[4px] text-[13px] font-semibold border border-[#579dff]/30">All</button>
          <button className="px-3 py-1.5 text-[#9fadbc] hover:bg-[#3d4c5c] rounded-[4px] text-[13px] transition-colors">Eromose Okuekhamhen's w...</button>
        </div>
        <div className="p-4">
          <div className="flex items-center gap-2 mb-3 text-[#9fadbc] text-[11px] font-bold uppercase tracking-widest">
            <Clock className="w-3.5 h-3.5" /><span>Recent</span>
          </div>
          <div className="grid grid-cols-2 gap-2.5">
            <button className="relative rounded-lg overflow-hidden hover:scale-[1.015] transition-transform">
              <div className="h-[88px] bg-gradient-to-br from-[#0747a6] via-[#0052cc] to-[#0069d9]" />
              <div className="absolute inset-x-0 bottom-0 p-2.5"><span className="text-white font-semibold text-[13px]">new one1</span></div>
            </button>
            <button className="relative rounded-lg overflow-hidden hover:scale-[1.015] transition-transform">
              <div className="h-[88px] bg-gradient-to-br from-orange-400 via-pink-400 to-cyan-400" />
              <div className="absolute top-2 right-2"><span className="bg-white/90 text-gray-800 text-[9px] px-1.5 py-0.5 rounded font-bold uppercase">Template</span></div>
              <div className="absolute inset-x-0 bottom-0 p-2.5"><span className="text-white font-semibold text-[13px]">Kanban Template</span></div>
            </button>
          </div>
        </div>
        <div className="px-4 pb-4">
          <button className="w-full flex items-center gap-2 px-3 py-2 hover:bg-[#3d4c5c] rounded-[4px] transition-colors text-[#9fadbc] text-[13px]">
            <ChevronRight className="w-4 h-4" /><span>Eromose Okuekhamhen's workspace</span>
          </button>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// INBOX  — two modes:
//   • Full page  (only inbox open): dark-navy full screen, centered content
//   • Sidebar    (inbox + other panels): narrow 272px dark-navy column
// ─────────────────────────────────────────────────────────────────────────────

/** Icon cluster shared by both inbox modes */
function InboxIconCluster({ large = false }: { large?: boolean }) {
  const base  = large ? 72 : 56;
  const sm    = large ? 64 : 50;
  const icon  = large ? 28 : 22;
  const iconSm= large ? 24 : 18;
  return (
    <div className="relative mx-auto" style={{ width: large ? 220 : 190, height: large ? 220 : 190 }}>
      {/* Mail */}
      <div style={{ position:"absolute", top: large?36:30, left: large?28:22, width:base, height:base }}
        className="rounded-full bg-[#162032] border-2 border-[#2490c8] flex items-center justify-center shadow-lg">
        <Mail style={{ width:icon, height:icon }} className="text-[#579dff]" />
      </div>
      {/* Chrome + NEW */}
      <div style={{ position:"absolute", top:2, right: large?28:22, width:sm, height:sm }}
        className="rounded-full bg-[#162032] border-2 border-[#4fc3f7] flex items-center justify-center shadow-lg">
        <Chrome style={{ width:iconSm, height:iconSm }} className="text-[#4fc3f7]" />
        <span className="absolute -top-[7px] -right-[8px] bg-[#ef5c48] text-white text-[8px] px-[5px] py-[2px] rounded font-bold leading-none">NEW</span>
      </div>
      {/* Mobile */}
      <div style={{ position:"absolute", top: large?68:56, right: large?68:56, width: large?52:46, height: large?52:46 }}
        className="rounded-full bg-[#1e1a0e] border-2 border-[#f5a623] flex items-center justify-center shadow-lg">
        <Smartphone style={{ width:iconSm, height:iconSm }} className="text-[#f5a623]" />
      </div>
      {/* Slack */}
      <div style={{ position:"absolute", bottom: large?32:26, left: large?18:14, width:sm, height:sm }}
        className="rounded-full bg-[#12102a] border-2 border-[#7c4dff] flex items-center justify-center shadow-lg">
        <Slack style={{ width:iconSm, height:iconSm }} className="text-[#7c4dff]" />
      </div>
      {/* Teams */}
      <div style={{ position:"absolute", bottom: large?14:10, right: large?38:30, width:sm, height:sm }}
        className="rounded-full bg-[#12102a] border-2 border-[#5b5fc7] flex items-center justify-center shadow-lg">
        <Grid3x3 style={{ width:iconSm, height:iconSm }} className="text-[#5b5fc7]" />
      </div>
    </div>
  );
}

/** Inbox as full-page view (Image 4) */
function InboxFullPage() {
  return (
    // Dark navy gradient — exactly Image 4 background
    <div className="flex-1 flex flex-col overflow-hidden" style={{ background: "linear-gradient(180deg,#1a2540 0%,#1c2a4a 100%)" }}>
      {/* Title pinned top-left */}
      <div className="px-5 pt-4 flex items-center gap-2">
        <Inbox className="w-[18px] h-[18px] text-[#b6c2cf]" />
        <span className="text-[#b6c2cf] font-bold text-[16px]">Inbox</span>
      </div>

      {/* Centered content — full width */}
      <div className="flex-1 flex flex-col items-center justify-start pt-6 px-6">
        {/* Wide add-a-card input — spans most of width */}
        <div className="w-full max-w-[860px] mb-10">
          <div className="bg-[#22303f] border border-[#2e3f54] rounded-[6px] px-4 py-3 text-[#9fadbc] text-[14px] cursor-text hover:border-[#579dff]/50 transition-colors">
            Add a card
          </div>
        </div>

        {/* Consolidate section */}
        <h2 className="text-[#b6c2cf] font-bold text-[17px] mb-10">Consolidate your to-dos</h2>
        <InboxIconCluster large />
        <div className="flex items-center gap-2 text-[#9fadbc] text-[13px] mt-10">
          <Lock className="w-3.5 h-3.5" />
          <span>Inbox is only visible to you</span>
        </div>
      </div>
    </div>
  );
}

/** Inbox as narrow sidebar (Image 1, 2, 3) */
function InboxSidebar() {
  return (
    // Same dark-navy background, fixed 272px, right border
    <div className="flex-shrink-0 flex flex-col overflow-hidden"
      style={{ width:272, minWidth:272, background:"linear-gradient(180deg,#1a2540 0%,#1c2a4a 100%)", borderRight:"1px solid rgba(61,76,92,0.5)" }}>
      {/* Title */}
      <div className="px-4 pt-3 pb-2 flex items-center gap-2">
        <Inbox className="w-[17px] h-[17px] text-[#b6c2cf]" />
        <span className="text-[#b6c2cf] font-bold text-[14px]">Inbox</span>
      </div>
      {/* Add a card */}
      <div className="px-3 pb-3">
        <div className="bg-[#22303f] border border-[#2e3f54] rounded-[4px] px-3 py-[7px] text-[#9fadbc] text-[13px] cursor-text hover:border-[#579dff]/50 transition-colors">
          Add a card
        </div>
      </div>
      {/* Consolidate */}
      <div className="flex-1 flex flex-col items-center justify-center px-3 pb-6">
        <h3 className="text-[#b6c2cf] font-semibold text-[13px] mb-6 text-center">Consolidate your to-dos</h3>
        <InboxIconCluster />
        <div className="flex items-center gap-2 text-[#9fadbc] text-[12px] mt-6">
          <Lock className="w-3.5 h-3.5" />
          <span>Inbox is only visible to you</span>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// PLANNER — two modes:
//   • Full page  (no board): Image 3 & 5 — dark bg, wide 7-day calendar
//   • Compact    (with board): Image 2 — single-day Wed 23 column
// ─────────────────────────────────────────────────────────────────────────────
const DAYS  = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];
const DATES = [20,21,22,23,24,25,26];
const SLOTS = ["8am","9am","10am","11am","12pm","1pm","2pm","3pm","4pm"];

type CE = { col:number; row:number; label:string; color:string; box?:boolean };
const EVENTS: CE[] = [
  { col:1,row:1,label:"9am",           color:"bg-[#1f6b44] border-l-[3px] border-green-400" },
  { col:2,row:1,label:"9am",           color:"bg-[#1f6b44] border-l-[3px] border-green-400" },
  { col:2,row:1,label:"9:15",          color:"bg-[#1d3f7a] border-l-[3px] border-blue-400",  box:true },
  { col:3,row:1,label:"9:30am",        color:"bg-[#1f6b44] border-l-[3px] border-green-400", box:true },
  { col:4,row:1,label:"9am",           color:"bg-[#1f6b44] border-l-[3px] border-green-400" },
  { col:5,row:1,label:"9 - 10am",      color:"bg-[#1d3f7a] border-l-[3px] border-blue-400" },
  { col:2,row:2,label:"10am",          color:"bg-[#1f6b44] border-l-[3px] border-green-400", box:true },
  { col:3,row:2,label:"11:30-12:30pm", color:"bg-[#1f6b44] border-l-[3px] border-green-400" },
  { col:4,row:2,label:"12pm",          color:"bg-[#1d3f7a] border-l-[3px] border-blue-400",  box:true },
  { col:5,row:2,label:"10:30-11:30am", color:"bg-[#1d3f7a] border-l-[3px] border-blue-400" },
  { col:2,row:3,label:"11am",          color:"bg-[#5c3000] border-l-[3px] border-orange-400" },
  { col:3,row:3,label:"11am",          color:"bg-[#5c3000] border-l-[3px] border-orange-400" },
  { col:4,row:3,label:"11am",          color:"bg-[#5c3000] border-l-[3px] border-orange-400" },
  { col:5,row:3,label:"11am",          color:"bg-[#1d3f7a] border-l-[3px] border-blue-400" },
  { col:2,row:4,label:"11:30am",       color:"bg-[#5c3000] border-l-[3px] border-orange-400", box:true },
  { col:3,row:4,label:"11:30-12:30pm", color:"bg-[#5c3000] border-l-[3px] border-orange-400" },
  { col:4,row:4,label:"11:30-12:30pm", color:"bg-[#3d1f6d] border-l-[3px] border-purple-400" },
  { col:5,row:4,label:"12pm",          color:"bg-[#1d3f7a] border-l-[3px] border-blue-400",  box:true },
  { col:5,row:5,label:"12:30pm",       color:"bg-[#1d3f7a] border-l-[3px] border-blue-400",  box:true },
  { col:3,row:5,label:"+ — — —",       color:"bg-[#2a3a4a]/70 border border-dashed border-[#4a6880]" },
];

function PlannerFullPage() {
  return (
    // Dark background — exactly Image 3 & 5
    <div className="flex-1 flex flex-col overflow-hidden" style={{ background:"#1d2125" }}>
      {/* Header */}
      <div className="px-6 py-5 flex items-start gap-4 flex-shrink-0">
        <div className="w-[60px] h-[60px] rounded-xl bg-[#22272b] flex items-center justify-center flex-shrink-0">
          <Calendar className="w-7 h-7 text-[#9fadbc]" />
        </div>
        <div className="flex-1 min-w-0">
          <h2 className="text-[#b6c2cf] font-bold text-[22px] mb-0.5">Planner</h2>
          <p className="text-[#9fadbc] text-[13px] leading-relaxed">Connect your calendars to get a side-by-side view of your Planner and your to-do's.</p>
          <p className="text-[13px] mt-0.5">
            <button className="text-[#579dff] hover:underline font-semibold">Try Premium</button>{" "}
            <span className="text-[#9fadbc]">for free to schedule your to-dos on your Planner.</span>
          </p>
          <div className="flex items-center gap-1.5 mt-1 text-[#9fadbc] text-xs">
            <Lock className="w-3 h-3" /><span>Only you can see your Planner.</span>
          </div>
        </div>
        <button className="flex items-center gap-2 bg-[#22272b] hover:bg-[#2c333a] border border-[#3d4c5c] text-[#b6c2cf] px-3 py-2 rounded-lg text-[13px] font-medium transition-colors flex-shrink-0 whitespace-nowrap">
          <Calendar className="w-3.5 h-3.5" />Connect a calendar
        </button>
      </div>
      {/* 7-day grid */}
      <div className="flex-1 overflow-auto">
        <div className="min-w-[700px]">
          <div className="grid sticky top-0 z-10 bg-[#1d2125] border-b border-[#3d4c5c]/40"
            style={{ gridTemplateColumns:"44px repeat(7,1fr)" }}>
            <div />
            {DAYS.map((d,i) => (
              <div key={d} className={`py-3 text-center border-l border-[#3d4c5c]/20 ${i===3?"bg-[#1a2a3a]/40":""}`}>
                <div className="text-[#9fadbc] text-[11px] mb-1">{d}</div>
                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-[13px] font-semibold mx-auto ${i===3?"bg-[#579dff] text-white":"text-[#b6c2cf]"}`}>{DATES[i]}</div>
              </div>
            ))}
          </div>
          {SLOTS.map((slot,si) => (
            <div key={slot} className="grid border-b border-[#3d4c5c]/15"
              style={{ gridTemplateColumns:"44px repeat(7,1fr)", minHeight:72 }}>
              <div className="pt-1.5 pr-2 text-[10px] text-[#9fadbc] text-right leading-none">{slot}</div>
              {DAYS.map((_,di) => {
                const evts = EVENTS.filter(e => e.col===di && e.row===si);
                return (
                  <div key={di} className={`border-l border-[#3d4c5c]/15 p-[3px] ${di===3?"bg-[#1a2a3a]/20":""}`}>
                    {evts.map((ev,ei) => (
                      <div key={ei} className={`${ev.color} rounded-[2px] px-1.5 py-[3px] mb-[2px] text-[10px] text-white/90 truncate flex items-center justify-between`}>
                        <span className="truncate">{ev.label}</span>
                        {ev.box && <span className="w-3 h-3 border border-white/30 rounded-[2px] ml-1 flex-shrink-0" />}
                      </div>
                    ))}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/** Compact planner — single-day view shown when Board is also open (Image 2) */
function PlannerCompact() {
  const todayEvts = EVENTS.filter(e => e.col === 3);
  return (
    <div className="flex-shrink-0 flex flex-col overflow-hidden border-r border-[#3d4c5c]/40"
      style={{ width:370, minWidth:300, background:"#1d2125" }}>
      {/* Header */}
      <div className="px-4 py-4 border-b border-[#3d4c5c]/40 flex-shrink-0">
        <div className="flex justify-end mb-2">
          <div className="flex items-center gap-1.5 bg-[#22272b] border border-[#3d4c5c] rounded-[4px] px-2 py-[3px] text-[#9fadbc] text-xs">
            <Search className="w-3 h-3" /><span className="font-mono">/</span>
          </div>
        </div>
        <h2 className="text-[#b6c2cf] font-bold text-[20px] text-center mb-1">Planner</h2>
        <p className="text-[#9fadbc] text-[12px] text-center leading-relaxed mb-1.5">
          Connect your calendars to get a side-by-side view of your Planner and your to-do's.
        </p>
        <p className="text-[12px] text-center mb-2">
          <span className="text-[#579dff] font-semibold">Premium:</span>{" "}
          <span className="text-[#9fadbc]">Schedule your to-dos on your Planner and connect multiple calendar accounts.</span>
        </p>
        <div className="flex items-center justify-center gap-1 text-[#9fadbc] text-[11px] mb-3">
          <Lock className="w-3 h-3" /><span>Only you can see your Planner.</span>
        </div>
        <div className="flex justify-center">
          <button className="flex items-center gap-2 bg-[#22272b] hover:bg-[#2c333a] border border-[#3d4c5c] text-[#b6c2cf] px-3 py-1.5 rounded-[4px] text-[13px] font-medium transition-colors">
            <Calendar className="w-3.5 h-3.5" />Connect a calendar
          </button>
        </div>
      </div>
      {/* Wed 23 label */}
      <div className="px-4 pt-3 pb-1 flex-shrink-0">
        <div className="text-[#9fadbc] text-[12px]">Wed</div>
        <div className="text-[#b6c2cf] font-bold text-[22px] leading-none">23</div>
      </div>
      {/* Single-day time slots */}
      <div className="flex-1 overflow-y-auto">
        {SLOTS.map((slot,si) => {
          const evts = todayEvts.filter(e => e.row===si);
          return (
            <div key={slot} className="flex border-b border-[#3d4c5c]/15" style={{ minHeight:72 }}>
              <div className="w-10 px-2 pt-1.5 text-[10px] text-[#9fadbc] text-right flex-shrink-0 leading-none">{slot}</div>
              <div className="flex-1 p-[3px] space-y-[2px] bg-[#1a2332]/20">
                {evts.map((ev,i) => (
                  <div key={i} className={`${ev.color} rounded-[2px] px-1.5 py-[3px] text-[10px] text-white/90 truncate flex items-center justify-between`}>
                    <span>{ev.label}</span>
                    {ev.box && <span className="w-3 h-3 border border-white/30 rounded-[2px] flex-shrink-0" />}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// BOARD — light-blue gradient background (Image 6)
// ─────────────────────────────────────────────────────────────────────────────
function BoardCard({ card }: { card: Card }) {
  return (
    <div className="bg-[#22272b] hover:bg-[#2c333a] rounded-[8px] px-3 py-2.5 cursor-pointer transition-colors shadow-sm hover:shadow-md">
      <p className="text-[#b6c2cf] text-[13px] leading-relaxed">{card.title}</p>
    </div>
  );
}

function BoardList({ list, onAddCard, narrow=false }: { list:List; onAddCard:(id:string,t:string)=>void; narrow?:boolean }) {
  const [adding, setAdding] = useState(false);
  const [title,  setTitle]  = useState("");
  const ref = useRef<HTMLTextAreaElement>(null);
  useEffect(() => { if (adding) ref.current?.focus(); }, [adding]);

  const submit = () => {
    if (title.trim()) { onAddCard(list.id, title.trim()); setTitle(""); setAdding(false); }
  };
  const w = narrow ? "w-[240px] min-w-[240px]" : "w-[272px] min-w-[272px]";

  return (
    <div className={`${w} bg-[#101204] rounded-xl flex flex-col max-h-full flex-shrink-0`}>
      <div className="px-3 py-2.5 flex items-center gap-1">
        <h3 className="text-[#b6c2cf] font-semibold text-[13px] flex-1 px-1">{list.title}</h3>
        {/* collapse arrows */}
        <button className="p-1 hover:bg-white/10 rounded text-[#9fadbc] hover:text-[#b6c2cf] transition-colors">
          <svg width="14" height="10" viewBox="0 0 14 10" fill="none">
            <path d="M5 1L2 5L5 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M9 1L12 5L9 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        <button className="p-1 hover:bg-white/10 rounded text-[#9fadbc] hover:text-[#b6c2cf] transition-colors">
          <MoreHorizontal className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-2 space-y-1.5 pb-1">
        {list.cards.map(card => <BoardCard key={card.id} card={card} />)}
        {adding && (
          <div className="bg-[#22272b] rounded-[8px] p-2 space-y-2">
            <textarea ref={ref} value={title} onChange={e => setTitle(e.target.value)}
              placeholder="Enter a title for this card…" rows={2}
              className="w-full bg-transparent text-[#b6c2cf] text-[13px] placeholder:text-[#9fadbc] border-0 outline-none resize-none leading-relaxed"
              onKeyDown={e => {
                if (e.key==="Enter" && !e.shiftKey) { e.preventDefault(); submit(); }
                if (e.key==="Escape") { setAdding(false); setTitle(""); }
              }} />
            <div className="flex items-center gap-2">
              <button onClick={submit} className="bg-[#579dff] hover:bg-[#85b8ff] text-[#1d2125] text-[13px] font-semibold px-3 py-[6px] rounded-[3px] transition-colors">Add card</button>
              <button onClick={() => { setAdding(false); setTitle(""); }} className="p-1.5 hover:bg-white/10 rounded text-[#9fadbc]"><X className="w-4 h-4" /></button>
            </div>
          </div>
        )}
      </div>

      {!adding && (
        <div className="px-2 pb-2 pt-0.5 flex items-center">
          <button onClick={() => setAdding(true)} className="flex items-center gap-1.5 text-[#9fadbc] hover:text-[#b6c2cf] hover:bg-white/5 rounded-lg px-2 py-1.5 transition-colors text-[13px] flex-1">
            <Plus className="w-[14px] h-[14px]" /><span>Add a card</span>
          </button>
          <button className="p-1.5 hover:bg-white/5 rounded text-[#9fadbc] hover:text-[#b6c2cf] transition-colors">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <rect x="1" y="3" width="9" height="10" rx="1.5" stroke="currentColor" strokeWidth="1.3"/>
              <path d="M4 3V2.5A1.5 1.5 0 0 1 5.5 1h6A1.5 1.5 0 0 1 13 2.5v6A1.5 1.5 0 0 1 11.5 10H11" stroke="currentColor" strokeWidth="1.3"/>
            </svg>
          </button>
        </div>
      )}
    </div>
  );
}

function BoardPanel({ lists, onAddCard, narrow=false, standalone=false }:
  { lists:List[]; onAddCard:(id:string,t:string)=>void; narrow?:boolean; standalone?:boolean }) {
  return (
    // Light-blue gradient — exactly Image 6 background when board is only/rightmost panel
    <div className="flex-1 flex flex-col overflow-hidden min-w-0"
      style={{ background: standalone
        ? "linear-gradient(135deg,#0052b8 0%,#0068cc 45%,#0090b8 100%)"
        : "linear-gradient(135deg,#0052b8 0%,#0068cc 45%,#0090b8 100%)" }}>

      {/* Board sub-header */}
      <div className="flex items-center gap-2 px-4 py-[9px] border-b border-white/10 flex-shrink-0">
        <h1 className="text-white font-bold text-[15px]">new one1</h1>
        <div className="flex items-center bg-black/20 rounded-[4px] ml-0.5">
          <button className="p-[5px] hover:bg-white/10 rounded-l-[4px] text-white/70 hover:text-white transition-colors">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <rect x="1"   y="1"   width="4.5" height="4.5" rx="0.8" stroke="currentColor" strokeWidth="1.2"/>
              <rect x="7.5" y="1"   width="4.5" height="4.5" rx="0.8" stroke="currentColor" strokeWidth="1.2"/>
              <rect x="1"   y="8.5" width="4.5" height="4.5" rx="0.8" stroke="currentColor" strokeWidth="1.2"/>
              <rect x="7.5" y="8.5" width="4.5" height="4.5" rx="0.8" stroke="currentColor" strokeWidth="1.2"/>
            </svg>
          </button>
          <button className="p-[5px] hover:bg-white/10 rounded-r-[4px] text-white/70 hover:text-white transition-colors">
            <ChevronRight className="w-3 h-3" />
          </button>
        </div>
        <div className="h-4 w-px bg-white/20 mx-1" />

        <div className="flex items-center gap-1 ml-auto">
          <Avatar size="sm" ring />
          <div className="h-4 w-px bg-white/20 mx-0.5" />
          {/* On standalone board show more icons (Image 6) */}
          {standalone && (
            <>
              <button title="Automation" className="p-[6px] hover:bg-white/10 rounded text-white/60 hover:text-white/90 transition-colors"><Zap className="w-[15px] h-[15px]" /></button>
              <button title="Filter"     className="p-[6px] hover:bg-white/10 rounded text-white/60 hover:text-white/90 transition-colors"><Filter className="w-[15px] h-[15px]" /></button>
            </>
          )}
          <button title="Filter"     className="p-[6px] hover:bg-white/10 rounded text-white/60 hover:text-white/90 transition-colors"><SlidersHorizontal className="w-[15px] h-[15px]" /></button>
          <button title="Star"       className="p-[6px] hover:bg-white/10 rounded text-white/60 hover:text-white/90 transition-colors"><Star className="w-[15px] h-[15px]" /></button>
          <button title="Visibility" className="p-[6px] hover:bg-white/10 rounded text-white/60 hover:text-white/90 transition-colors"><Lock className="w-[15px] h-[15px]" /></button>
          <button className="flex items-center gap-1.5 bg-white/15 hover:bg-white/25 text-white text-[13px] font-semibold px-2.5 py-[6px] rounded-[4px] transition-colors ml-0.5">
            <Users className="w-3.5 h-3.5" />Share
          </button>
          <button className="p-[6px] hover:bg-white/10 rounded text-white/60 hover:text-white/90 transition-colors"><MoreHorizontal className="w-[15px] h-[15px]" /></button>
        </div>
      </div>

      {/* Lists */}
      <div className="flex-1 overflow-x-auto overflow-y-hidden px-3 py-3">
        <div className="flex gap-2.5 h-full items-start">
          {lists.map(list => <BoardList key={list.id} list={list} onAddCard={onAddCard} narrow={narrow} />)}
          <button className={`${narrow?"w-[240px] min-w-[240px]":"w-[272px] min-w-[272px]"} bg-white/10 hover:bg-white/15 rounded-xl p-3 flex items-center gap-2 text-white/80 hover:text-white transition-colors h-fit flex-shrink-0`}>
            <Plus className="w-[14px] h-[14px]" />
            <span className="text-[13px] font-medium">Add another list</span>
          </button>
        </div>
      </div>
      {/* Scrollbar track */}
      <div className="h-3 bg-black/10 border-t border-white/5 flex-shrink-0" />
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Bottom Navigation
// ─────────────────────────────────────────────────────────────────────────────
function BottomNav({ active, onToggle, onSwitch }: {
  active: Set<PanelKey>;
  onToggle: (k: PanelKey) => void;
  onSwitch: () => void;
}) {
  const tabs: { key: PanelKey; label: string; Icon: React.ElementType }[] = [
    { key:"inbox",   label:"Inbox",   Icon:Inbox },
    { key:"planner", label:"Planner", Icon:Calendar },
    { key:"board",   label:"Board",   Icon:LayoutDashboard },
  ];

  return (
    <div className="flex-shrink-0 flex items-center justify-center py-[10px]">
      {/* Pill container — dark background, rounded, bordered */}
      <div className="flex items-center rounded-[18px] border border-[#3d4c5c]/80 shadow-2xl px-1 py-1 gap-0.5"
        style={{ background:"#1d2125" }}>
        {tabs.map(({ key, label, Icon }) => {
          const isActive = active.has(key);
          return (
            <button key={key} onClick={() => onToggle(key)}
              className={`relative flex items-center gap-[7px] px-[18px] py-[9px] rounded-[14px] text-[13px] font-medium transition-all duration-150 select-none ${
                isActive
                  // Active: blue filled button
                  ? "bg-[#1d6ebf] text-white shadow-sm"
                  // Inactive: transparent, muted text
                  : "text-[#9fadbc] hover:text-[#b6c2cf] hover:bg-white/5"
              }`}>
              <Icon className="w-[15px] h-[15px]" />
              <span>{label}</span>
              {/* Blue underline for active */}
              {isActive && (
                <span className="absolute bottom-[-2px] left-1/2 -translate-x-1/2 h-[2.5px] w-5 bg-[#579dff] rounded-full" />
              )}
            </button>
          );
        })}

        {/* Switch boards — never active, always modal */}
        <button onClick={onSwitch}
          className="flex items-center gap-[7px] px-[18px] py-[9px] rounded-[14px] text-[13px] font-medium text-[#9fadbc] hover:text-[#b6c2cf] hover:bg-white/5 transition-all duration-150 select-none">
          <Grid3x3 className="w-[15px] h-[15px]" />
          <span>Switch boards</span>
        </button>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Page Root
// ─────────────────────────────────────────────────────────────────────────────
export default function BoardPage() {
  const [active, setActive] = useState<Set<PanelKey>>(new Set<PanelKey>(["board"]));
  const [showSwitcher, setShowSwitcher] = useState(false);

  const [lists, setLists] = useState<List[]>([
    { id:"1", title:"To Do",  cards:[{ id:"c1", title:"Going to pick up a student from his school as a result of mid term break" }] },
    { id:"2", title:"Doing",  cards:[] },
    { id:"3", title:"Done",   cards:[] },
  ]);

  const addCard = (listId: string, title: string) => {
    setLists(prev => prev.map(l => l.id===listId ? { ...l, cards:[...l.cards,{ id:Date.now().toString(), title }] } : l));
  };

  const toggle = (key: PanelKey) => {
    setActive(prev => {
      const next = new Set(prev);
      if (next.has(key)) {
        if (next.size===1) return next; // keep at least one
        next.delete(key);
      } else {
        next.add(key);
      }
      return next;
    });
  };

  const showInbox   = active.has("inbox");
  const showPlanner = active.has("planner");
  const showBoard   = active.has("board");

  // True when inbox is the ONLY open panel → full-page inbox mode
  const inboxOnly   = showInbox && !showPlanner && !showBoard;
  // True when planner is open WITHOUT board → full 7-day planner
  const plannerFull = showPlanner && !showBoard;
  // True when planner AND board both open → compact single-day planner
  const plannerCompact = showPlanner && showBoard;
  // Three panels
  const allThree = showInbox && showPlanner && showBoard;

  // ── Page background ──
  // When only board is visible → board gradient
  // When only inbox is visible → dark navy
  // When only planner (or inbox+planner) → dark #1d2125
  // Mixed with board → board gradient wraps everything
  const pageBg = showBoard
    ? "linear-gradient(135deg,#0052b8 0%,#0068cc 45%,#0090b8 100%)"
    : showPlanner
      ? "#1d2125"
      : "linear-gradient(180deg,#1a2540 0%,#1c2a4a 100%)";

  return (
    <div className="h-screen flex flex-col overflow-hidden" style={{ background: pageBg }}>

      {/* ── Top Navbar ── */}
      <header className="flex-shrink-0 flex items-center gap-3 px-3 py-[7px] z-30"
        style={{ background:"rgba(29,33,37,0.55)", backdropFilter:"blur(12px)", borderBottom:"1px solid rgba(255,255,255,0.07)" }}>
        <div className="flex items-center gap-1 flex-shrink-0">
          <button className="p-[7px] hover:bg-white/10 rounded text-white/70 hover:text-white transition-colors">
            <Grid3x3 className="w-[17px] h-[17px]" />
          </button>
          <TrelloLogo />
        </div>
        <div className="flex-1 flex justify-center px-2"><SearchBar /></div>
        <div className="flex items-center gap-1 flex-shrink-0">
          <button className="bg-[#579dff] hover:bg-[#85b8ff] text-[#1d2125] font-bold text-[13px] px-3 py-[7px] rounded-[4px] transition-colors mr-0.5">Create</button>
          <button className="p-[7px] hover:bg-white/10 rounded text-white/70 hover:text-white transition-colors"><Bell className="w-[17px] h-[17px]" /></button>
          <button className="p-[7px] hover:bg-white/10 rounded text-white/70 hover:text-white transition-colors"><HelpCircle className="w-[17px] h-[17px]" /></button>
          <Avatar />
        </div>
      </header>

      {/* ── Panel Area ──
          Layout matrix:
          ┌─────────────────────────────────────────────────┐
          │ inbox only     │ full-page InboxFullPage        │
          │ planner only   │ full-page PlannerFullPage      │
          │ board only     │ full-page BoardPanel           │
          │ inbox+board    │ InboxSidebar | BoardPanel      │
          │ inbox+planner  │ InboxSidebar | PlannerFullPage │
          │ planner+board  │ PlannerCompact | BoardPanel    │
          │ all three      │ InboxSidebar | PlannerCompact | BoardPanel │
          └─────────────────────────────────────────────────┘
      */}
      <div className="flex-1 flex overflow-hidden">

        {/* INBOX */}
        {inboxOnly  && <InboxFullPage />}
        {showInbox && !inboxOnly && <InboxSidebar />}

        {/* PLANNER */}
        {plannerFull    && <PlannerFullPage />}
        {plannerCompact && <PlannerCompact />}

        {/* BOARD */}
        {showBoard && (
          <BoardPanel
            lists={lists}
            onAddCard={addCard}
            narrow={allThree}
            standalone={showBoard && !showInbox && !showPlanner}
          />
        )}

      </div>

      {/* ── Bottom Nav ── */}
      <BottomNav active={active} onToggle={toggle} onSwitch={() => setShowSwitcher(true)} />

      {/* ── Board Switcher Modal ── */}
      {showSwitcher && <BoardSwitcherModal onClose={() => setShowSwitcher(false)} />}
    </div>
  );
}