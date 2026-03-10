"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import {
  Search, Plus, Bell, HelpCircle, MoreHorizontal, Users, X,
  Inbox, Calendar, LayoutDashboard, Grid3x3, Mail, Smartphone,
  Lock, ChevronDown, SlidersHorizontal, AlignJustify, ChevronUp,
  MessageSquare, Aperture, Star, ChevronRight, LogOut,
  UserCircle2, Activity, CreditCard, Settings2, Palette,
  PlusCircle, ExternalLink, ArrowLeftRight,
} from "lucide-react";

/* ─────────────────────────────────────────────────────────
   TYPES
───────────────────────────────────────────────────────── */
interface Card { id: string; title: string }
interface List { id: string; title: string; cards: Card[] }
type Panel = "inbox" | "planner" | "board";

/* ─────────────────────────────────────────────────────────
   DESIGN TOKENS  (match screenshot exactly)
───────────────────────────────────────────────────────── */
const T = {
  /* navbar */
  nav:        "rgba(23,28,33,0.96)",
  navBorder:  "rgba(255,255,255,0.07)",
  /* inbox */
  inboxBg:    "#1a2236",
  inboxBg2:   "#1c2846",
  inboxCard:  "#1f3048",
  inboxCardH: "#27394f",
  inboxInput: "#1a2f44",
  /* planner */
  planBg:     "#1d2125",
  /* board */
  boardGrad:  "linear-gradient(175deg,#0044b0 0%,#005fc0 40%,#0088c8 80%,#00a8d8 100%)",
  /* lists */
  listBg:     "#101204",
  cardBg:     "#22272b",
  cardHov:    "#2c333a",
  /* common */
  border:     "rgba(61,76,92,0.6)",
  muted:      "#9fadbc",
  text:       "#b6c2cf",
  blue:       "#579dff",
  blueDark:   "#0c66e4",
};

/* ─────────────────────────────────────────────────────────
   TRELLO LOGO
───────────────────────────────────────────────────────── */
function Logo() {
  return (
    <div style={{ display:"flex", alignItems:"center", gap:6, flexShrink:0, userSelect:"none" }}>
      <div style={{ width:32, height:32, background:"#579dff", borderRadius:8,
        display:"flex", alignItems:"center", justifyContent:"center" }}>
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
          <rect x="2" y="2" width="5" height="11" rx="1.2" fill="white"/>
          <rect x="11" y="2" width="5" height="7" rx="1.2" fill="white"/>
        </svg>
      </div>
      <span style={{ color:"white", fontWeight:700, fontSize:20, letterSpacing:"-0.3px" }}>Trello</span>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────
   AVATAR
───────────────────────────────────────────────────────── */
function Av({ size=32, bg="linear-gradient(135deg,#eb5a46,#c9372c)", initials="EC", onClick }:
  { size?:number; bg?:string; initials?:string; onClick?:()=>void }) {
  const [hov, setHov] = useState(false);
  return (
    <div
      onClick={onClick}
      onMouseEnter={()=>setHov(true)}
      onMouseLeave={()=>setHov(false)}
      style={{
        width:size, height:size, borderRadius:"50%", background:bg, flexShrink:0,
        display:"flex", alignItems:"center", justifyContent:"center", cursor:"pointer",
        color:"white", fontWeight:700, fontSize:size*0.38,
        outline: hov ? "2px solid rgba(87,157,255,0.55)" : "2px solid transparent",
        outlineOffset:2, transition:"outline 0.12s",
      }}>
      {initials}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────
   PROFILE DROPDOWN
   Matches screenshots exactly:
   • ACCOUNT section — user row, Switch accounts, Manage account
   • TRELLO section — menu items with icons
   • Footer — Help, Shortcuts, Log out
───────────────────────────────────────────────────────── */

/** Single menu row */
function PRow({
  icon, label, sub, right, danger=false, onClick,
}: {
  icon?:React.ReactNode; label:string; sub?:string;
  right?:React.ReactNode; danger?:boolean; onClick?:()=>void;
}) {
  const [hov, setHov] = useState(false);
  return (
    <button
      onClick={onClick}
      onMouseEnter={()=>setHov(true)}
      onMouseLeave={()=>setHov(false)}
      style={{
        width:"100%", display:"flex", alignItems:"center", gap:10,
        padding:"9px 16px", background:hov?"rgba(255,255,255,0.07)":"transparent",
        border:"none", cursor:"pointer", textAlign:"left",
        transition:"background 0.1s",
      }}>
      {icon && (
        <span style={{ color: danger ? "#ef5c48" : T.muted, flexShrink:0, display:"flex" }}>
          {icon}
        </span>
      )}
      <span style={{ flex:1 }}>
        <span style={{ display:"block", fontSize:14, color: danger?"#ef5c48":T.text, lineHeight:1.35 }}>
          {label}
        </span>
        {sub && <span style={{ fontSize:12, color:T.muted, lineHeight:1.3 }}>{sub}</span>}
      </span>
      {right && <span style={{ color:T.muted, display:"flex", flexShrink:0 }}>{right}</span>}
    </button>
  );
}

/** Section label */
function PSect({ label }:{ label:string }) {
  return (
    <div style={{ padding:"10px 16px 4px",
      fontSize:11, fontWeight:700, letterSpacing:"0.07em",
      color:T.muted, textTransform:"uppercase" }}>
      {label}
    </div>
  );
}

/** Thin divider */
function PDivider() {
  return <div style={{ height:1, background:"rgba(61,76,92,0.45)", margin:"4px 0" }}/>;
}

interface ProfileDropdownProps {
  name:    string;
  email:   string;
  initials:string;
  onClose: ()=>void;
}

function ProfileDropdown({ name, email, initials, onClose }: ProfileDropdownProps) {
  /* Close on outside click */
  const ref = useRef<HTMLDivElement>(null);
  useEffect(()=>{
    const handler = (e:MouseEvent)=>{
      if (ref.current && !ref.current.contains(e.target as Node)) onClose();
    };
    /* slight delay so the triggering click doesn't immediately close */
    const t = setTimeout(()=>document.addEventListener("mousedown", handler), 50);
    return ()=>{ clearTimeout(t); document.removeEventListener("mousedown", handler); };
  },[onClose]);

  return (
    <div
      ref={ref}
      style={{
        position:"fixed",
        top:50,           /* just below the 44px navbar */
        right:8,
        width:280,
        zIndex:9999,
        background:"#282e33",
        border:`1px solid rgba(61,76,92,0.7)`,
        borderRadius:10,
        boxShadow:"0 12px 40px rgba(0,0,0,0.65), 0 2px 8px rgba(0,0,0,0.4)",
        overflow:"hidden",
        animation:"dropIn 0.15s cubic-bezier(.22,.61,.36,1)",
      }}>
      <style>{`
        @keyframes dropIn {
          from { opacity:0; transform:translateY(-8px) scale(0.97); }
          to   { opacity:1; transform:translateY(0)   scale(1);    }
        }
      `}</style>

      {/* ── ACCOUNT section ── */}
      <PSect label="Account"/>

      {/* User identity row */}
      <div style={{ display:"flex", alignItems:"center", gap:12, padding:"6px 16px 10px" }}>
        <div style={{
          width:40, height:40, borderRadius:"50%", flexShrink:0,
          background:"linear-gradient(135deg,#eb5a46,#c9372c)",
          display:"flex", alignItems:"center", justifyContent:"center",
          color:"white", fontWeight:700, fontSize:15,
        }}>
          {initials}
        </div>
        <div style={{ minWidth:0 }}>
          <div style={{ fontSize:14, fontWeight:700, color:"white",
            whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>
            {name}
          </div>
          <div style={{ fontSize:12, color:T.muted,
            whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>
            {email}
          </div>
        </div>
      </div>

      <PRow label="Switch accounts" icon={<ArrowLeftRight size={15}/>}/>
      <PRow label="Manage account"  icon={<ExternalLink   size={15}/>}
        right={<ExternalLink size={12}/>}/>

      <PDivider/>

      {/* ── TRELLO section ── */}
      <PSect label="Trello"/>

      <PRow label="Profile and visibility" icon={<UserCircle2  size={15}/>}/>
      <PRow label="Activity"               icon={<Activity     size={15}/>}/>
      <PRow label="Cards"                  icon={<CreditCard   size={15}/>}/>
      <PRow label="Settings"               icon={<Settings2    size={15}/>}/>
      <PRow label="Theme"                  icon={<Palette      size={15}/>}
        right={<ChevronRight size={14}/>}/>

      <PDivider/>

      <PRow label="Create Workspace"
        icon={
          <span style={{ width:18, height:18, borderRadius:4, background:"rgba(87,157,255,0.2)",
            display:"flex", alignItems:"center", justifyContent:"center" }}>
            <PlusCircle size={13} style={{ color:T.blue }}/>
          </span>
        }/>

      <PDivider/>

      <PRow label="Help"      icon={<HelpCircle size={15}/>}/>
      <PRow label="Shortcuts" icon={
        <span style={{ fontSize:11, fontFamily:"monospace", background:"rgba(255,255,255,0.1)",
          borderRadius:3, padding:"1px 4px", color:T.muted }}>/</span>
      }/>

      <PDivider/>

      <PRow label="Log out" icon={<LogOut size={15}/>} danger onClick={()=>{
        onClose();
        /* hook into authService.logout() or router.push('/login') here */
        if (typeof window !== "undefined") window.location.href = "/login";
      }}/>

      {/* small bottom padding */}
      <div style={{ height:6 }}/>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────
   ICON BUTTON
───────────────────────────────────────────────────────── */
function IconBtn({ children, badge }: { children:React.ReactNode; badge?:number }) {
  const [hov, setHov] = useState(false);
  return (
    <button
      onMouseEnter={()=>setHov(true)} onMouseLeave={()=>setHov(false)}
      style={{ position:"relative", padding:7, background:hov?"rgba(255,255,255,0.1)":"none",
        border:"none", cursor:"pointer", color:"rgba(255,255,255,0.65)", borderRadius:5,
        display:"flex", alignItems:"center", justifyContent:"center", transition:"background 0.12s" }}>
      {children}
      {badge != null && (
        <span style={{ position:"absolute", top:2, right:2, width:14, height:14,
          background:"#ef5c48", borderRadius:"50%", fontSize:9, fontWeight:800,
          color:"white", display:"flex", alignItems:"center", justifyContent:"center", lineHeight:1 }}>
          {badge}
        </span>
      )}
    </button>
  );
}

/* ─────────────────────────────────────────────────────────
   SEARCH BAR
───────────────────────────────────────────────────────── */
function SearchBar() {
  const [foc, setFoc] = useState(false);
  return (
    <div style={{ position:"relative", width:"100%", maxWidth:700 }}>
      <Search style={{ position:"absolute", left:10, top:"50%", transform:"translateY(-50%)",
        width:15, height:15, color:T.muted, pointerEvents:"none" }}/>
      <input
        placeholder="Search"
        onFocus={()=>setFoc(true)} onBlur={()=>setFoc(false)}
        style={{ width:"100%", background:"#2c333a",
          border:`1px solid ${foc?"#579dff":"#454f59"}`,
          borderRadius:5, padding:"8px 10px 8px 34px",
          color:T.text, fontSize:13, outline:"none",
          transition:"border 0.15s",
          boxShadow: foc?"0 0 0 2px rgba(87,157,255,0.25)":"none" }}/>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────
   BOARD SWITCHER MODAL
───────────────────────────────────────────────────────── */
function SwitcherModal({ onClose }: { onClose:()=>void }) {
  return (
    <div style={{ position:"fixed", inset:0, zIndex:9999, display:"flex",
      alignItems:"flex-start", justifyContent:"center" }} onClick={onClose}>
      <div style={{ position:"absolute", inset:0, background:"rgba(0,0,0,0.45)", backdropFilter:"blur(2px)" }}/>
      <div style={{ position:"relative", marginTop:60, width:"100%", maxWidth:560, margin:"60px 16px 0",
        background:"#282e33", borderRadius:14, boxShadow:"0 16px 48px rgba(0,0,0,0.6)",
        border:`1px solid ${T.border}`, overflow:"hidden" }}
        onClick={e=>e.stopPropagation()}>
        <div style={{ padding:"16px 16px 12px", borderBottom:`1px solid ${T.border}` }}>
          <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:12 }}>
            <span style={{ color:T.text, fontWeight:600, fontSize:15 }}>Switch boards</span>
            <button onClick={onClose} style={{ padding:6, background:"none", border:"none", cursor:"pointer",
              color:T.muted, borderRadius:4, display:"flex" }}>
              <X size={16}/>
            </button>
          </div>
          <div style={{ position:"relative" }}>
            <Search style={{ position:"absolute", left:10, top:"50%", transform:"translateY(-50%)",
              width:14, height:14, color:T.muted }}/>
            <input autoFocus placeholder="Search your boards"
              style={{ width:"100%", background:"#1d2125", border:`1px solid ${T.blue}`,
                borderRadius:4, padding:"8px 10px 8px 32px", color:T.text, fontSize:13, outline:"none" }}/>
          </div>
        </div>
        <div style={{ padding:16 }}>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10 }}>
            {[
              { name:"My first workspace board", g:"linear-gradient(135deg,#0044b0,#0088c8)" },
              { name:"Kanban Template",           g:"linear-gradient(135deg,#f97316,#ec4899,#06b6d4)" },
            ].map(b=>(
              <button key={b.name} style={{ position:"relative", borderRadius:10, overflow:"hidden",
                border:"none", cursor:"pointer", padding:0 }}>
                <div style={{ height:88, background:b.g }}/>
                <div style={{ position:"absolute", bottom:0, left:0, right:0,
                  padding:"8px 10px", background:"linear-gradient(transparent,rgba(0,0,0,0.5))", textAlign:"left" }}>
                  <span style={{ color:"white", fontWeight:600, fontSize:13 }}>{b.name}</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────
   INBOX PANEL
   Matches screenshot:
   • dark navy bg
   • "Inbox" title + ≡ filter + ⋯
   • "Add a card" input
   • cards below
   • "Consolidate your to-dos" collapsed bottom bar
───────────────────────────────────────────────────────── */
function InboxPanel({ cards, onAdd }: {
  cards: {id:string;title:string}[];
  onAdd:(t:string)=>void;
}) {
  const [draft, setDraft] = useState("");
  const [consolidateOpen, setConsolidateOpen] = useState(false);

  const submit = () => {
    if (draft.trim()) { onAdd(draft.trim()); setDraft(""); }
  };

  /* mini icon cluster for the collapsed bar */
  const CLUSTERS = [
    { bg:"#162032", border:"#2490c8", color:"#579dff",  C: Mail },
    { bg:"#12102a", border:"#7c4dff", color:"#9f7dff",  C: Grid3x3 },
    { bg:"#1e1a0e", border:"#f5a623", color:"#f5a623",  C: Smartphone },
    { bg:"#162032", border:"#4fc3f7", color:"#4fc3f7",  C: MessageSquare },
  ];

  return (
    <div style={{ width:282, minWidth:282, flexShrink:0, display:"flex", flexDirection:"column",
      background:`linear-gradient(180deg,${T.inboxBg} 0%,${T.inboxBg2} 100%)`,
      borderRight:`1px solid ${T.border}` }}>

      {/* Header */}
      <div style={{ padding:"13px 14px 8px", display:"flex", alignItems:"center", gap:6, flexShrink:0 }}>
        <Inbox size={17} style={{ color:T.muted }}/>
        <span style={{ color:T.text, fontWeight:700, fontSize:15, flex:1 }}>Inbox</span>
        <HovBtn><AlignJustify size={15}/></HovBtn>
        <HovBtn><MoreHorizontal size={15}/></HovBtn>
      </div>

      {/* Add a card input */}
      <div style={{ padding:"0 11px 10px", flexShrink:0 }}>
        <div style={{ background:T.inboxInput, border:`1px solid rgba(61,76,92,0.55)`,
          borderRadius:6, padding:"9px 12px", display:"flex", alignItems:"center", gap:8 }}>
          <input value={draft} onChange={e=>setDraft(e.target.value)}
            onKeyDown={e=>e.key==="Enter"&&submit()}
            placeholder="Add a card"
            style={{ background:"transparent", border:"none", outline:"none",
              color:T.muted, fontSize:13, width:"100%", caretColor:"white" }}/>
        </div>
      </div>

      {/* Card list */}
      <div style={{ flex:1, overflowY:"auto", padding:"0 10px 8px" }}>
        {cards.map(c=>(
          <div key={c.id}
            style={{ background:T.inboxCard, borderRadius:8, padding:"10px 13px", marginBottom:5,
              cursor:"pointer", transition:"background 0.12s", color:T.text, fontSize:13.5, lineHeight:1.45 }}
            onMouseEnter={e=>(e.currentTarget.style.background=T.inboxCardH)}
            onMouseLeave={e=>(e.currentTarget.style.background=T.inboxCard)}>
            {c.title}
          </div>
        ))}
      </div>

      {/* Consolidate bottom bar */}
      <div style={{ flexShrink:0, borderTop:`1px solid rgba(61,76,92,0.35)` }}>
        {!consolidateOpen ? (
          <div style={{ padding:"9px 12px", display:"flex", alignItems:"center", gap:9,
            cursor:"pointer" }} onClick={()=>setConsolidateOpen(true)}>
            {/* icon cluster overlapping circles */}
            <div style={{ position:"relative", width:54, height:26, flexShrink:0 }}>
              {CLUSTERS.map((ic,i)=>(
                <div key={i} style={{ position:"absolute", left:i*12, top:1,
                  width:24, height:24, borderRadius:"50%",
                  background:ic.bg, border:`2px solid ${ic.border}`,
                  display:"flex", alignItems:"center", justifyContent:"center",
                  zIndex:4-i }}>
                  <ic.C size={11} style={{ color:ic.color }}/>
                </div>
              ))}
            </div>
            <span style={{ color:T.muted, fontSize:12.5, flex:1 }}>Consolidate your to-dos</span>
            <ChevronUp size={14} style={{ color:T.muted, flexShrink:0 }}/>
          </div>
        ) : (
          <div style={{ padding:"14px 14px 16px" }}>
            <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:10 }}>
              <span style={{ color:T.text, fontWeight:600, fontSize:13 }}>Consolidate your to-dos</span>
              <button onClick={()=>setConsolidateOpen(false)}
                style={{ padding:3, background:"none", border:"none", cursor:"pointer", color:T.muted, display:"flex" }}>
                <X size={14}/>
              </button>
            </div>
            <p style={{ color:T.muted, fontSize:12, lineHeight:1.55, marginBottom:12 }}>
              Capture from email, mobile, Slack, Teams, and Chrome — all in one Inbox.
            </p>
            <div style={{ display:"flex", justifyContent:"center", gap:14, marginBottom:12 }}>
              {CLUSTERS.map((ic,i)=>(
                <div key={i} style={{ width:38, height:38, borderRadius:"50%",
                  background:ic.bg, border:`2px solid ${ic.border}`,
                  display:"flex", alignItems:"center", justifyContent:"center" }}>
                  <ic.C size={16} style={{ color:ic.color }}/>
                </div>
              ))}
            </div>
            <div style={{ display:"flex", alignItems:"center", gap:5, justifyContent:"center" }}>
              <Lock size={11} style={{ color:T.muted }}/>
              <span style={{ color:T.muted, fontSize:11 }}>Inbox is only visible to you</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* tiny hover-button helper */
function HovBtn({ children }: { children:React.ReactNode }) {
  const [h, setH] = useState(false);
  return (
    <button onMouseEnter={()=>setH(true)} onMouseLeave={()=>setH(false)}
      style={{ padding:5, background:h?"rgba(255,255,255,0.09)":"none",
        border:"none", cursor:"pointer", color:T.muted, borderRadius:4, display:"flex",
        transition:"background 0.12s" }}>
      {children}
    </button>
  );
}

/* ─────────────────────────────────────────────────────────
   PLANNER PANEL
   Matches screenshot exactly:
   • Header with Planner title, desc, Upgrade link, lock, "Connect an account" button
   • "Wed 23" date
   • Time grid with colored event bars
   • Card-popup overlay at bottom (purple new-card block + dark detail card)
───────────────────────────────────────────────────────── */
const TIME_SLOTS = ["9am","10am","11am","12pm","1pm","2pm","3pm","4pm"];

type PlanEv = { slot:number; label:string; color:string; leftBorder:string; hasBox?:boolean };
const PLANNER_EVENTS: PlanEv[] = [
  { slot:0, label:"9am",     color:"#1a5c38", leftBorder:"#4ade80", hasBox:false },
  { slot:0, label:"9:30am",  color:"#1a3c72", leftBorder:"#60a5fa", hasBox:true  },
  { slot:1, label:"10am",    color:"#1a5c38", leftBorder:"#4ade80", hasBox:true  },
];

function PlannerPanel() {
  return (
    <div style={{ width:430, minWidth:360, flexShrink:0, display:"flex", flexDirection:"column",
      background:T.planBg, borderRight:`1px solid ${T.border}`, overflow:"hidden" }}>

      {/* ── Header ── */}
      <div style={{ padding:"18px 22px 16px", borderBottom:`1px solid rgba(61,76,92,0.3)`, flexShrink:0 }}>
        {/* keyboard hint top-right */}
        <div style={{ display:"flex", justifyContent:"flex-end", marginBottom:8 }}>
          <div style={{ display:"flex", alignItems:"center", gap:4,
            background:"#22272b", border:`1px solid ${T.border}`,
            borderRadius:4, padding:"2px 8px" }}>
            <Search size={10} style={{ color:T.muted }}/>
            <span style={{ color:T.muted, fontSize:11, fontFamily:"monospace" }}>/</span>
          </div>
        </div>

        <h2 style={{ color:T.text, fontWeight:800, fontSize:26, textAlign:"center",
          marginBottom:8, letterSpacing:"-0.4px" }}>Planner</h2>

        <p style={{ color:T.muted, fontSize:12.5, textAlign:"center", lineHeight:1.6, marginBottom:6 }}>
          Connect your calendars to get a side-by-side<br/>view of your Planner and your to-do&apos;s.
        </p>

        <p style={{ fontSize:12.5, textAlign:"center", marginBottom:6, lineHeight:1.5 }}>
          <button style={{ background:"none", border:"none", cursor:"pointer", color:T.blue,
            fontWeight:600, padding:0, fontSize:12.5 }}>Upgrade</button>
          <span style={{ color:T.muted }}> to schedule your to-dos on your Planner and connect multiple calendar accounts.</span>
        </p>

        <div style={{ display:"flex", alignItems:"center", gap:5, justifyContent:"center", marginBottom:14 }}>
          <Lock size={11} style={{ color:T.muted }}/>
          <span style={{ color:T.muted, fontSize:12 }}>Only you can see your Planner.</span>
        </div>

        {/* Connect an account button */}
        <div style={{ display:"flex", justifyContent:"center" }}>
          <button style={{ display:"flex", alignItems:"center", gap:8,
            background:T.blueDark, color:"white",
            border:"none", borderRadius:7, padding:"10px 22px",
            fontSize:13.5, fontWeight:600, cursor:"pointer", transition:"background 0.15s" }}
            onMouseEnter={e=>(e.currentTarget.style.background="#0052cc")}
            onMouseLeave={e=>(e.currentTarget.style.background=T.blueDark)}>
            <Aperture size={15}/>
            Connect an account
          </button>
        </div>
      </div>

      {/* ── Wed 23 ── */}
      <div style={{ padding:"12px 18px 6px", flexShrink:0 }}>
        <div style={{ color:T.muted, fontSize:12 }}>Wed</div>
        <div style={{ color:T.text, fontWeight:800, fontSize:28, lineHeight:1, letterSpacing:"-0.5px" }}>23</div>
      </div>

      {/* ── Time grid ── */}
      <div style={{ flex:1, overflowY:"auto", position:"relative" }}>
        {TIME_SLOTS.map((slot,si)=>{
          const evts = PLANNER_EVENTS.filter(e=>e.slot===si);
          return (
            <div key={slot} style={{ display:"flex", minHeight:72,
              borderBottom:`1px solid rgba(61,76,92,0.15)` }}>
              <div style={{ width:42, paddingTop:6, paddingRight:8,
                fontSize:10.5, color:T.muted, textAlign:"right", flexShrink:0 }}>{slot}</div>
              <div style={{ flex:1, padding:"3px 6px 3px 2px",
                background:`rgba(26,33,50,${si===0?0.25:0.1})` }}>
                {evts.map((ev,i)=>(
                  <div key={i} style={{
                    background:ev.color,
                    borderLeft:`3px solid ${ev.leftBorder}`,
                    borderRadius:3, padding:"4px 8px", marginBottom:2,
                    fontSize:11, color:"rgba(255,255,255,0.88)",
                    display:"flex", alignItems:"center", justifyContent:"space-between" }}>
                    <span>{ev.label}</span>
                    {ev.hasBox && (
                      <span style={{ width:12, height:12,
                        border:"1px solid rgba(255,255,255,0.35)", borderRadius:2, flexShrink:0 }}/>
                    )}
                  </div>
                ))}
              </div>
            </div>
          );
        })}

        {/* ── Purple "new card" overlay block (matches screenshot) ── */}
        <div style={{ margin:"0 8px 0 44px", position:"relative" }}>
          {/* The purple/lavender add-card block */}
          <div style={{ background:"hsl(267,60%,72%)", borderRadius:8,
            padding:"10px 16px", marginBottom:0,
            display:"flex", alignItems:"center", justifyContent:"space-between",
            minHeight:48 }}>
            <Plus size={16} style={{ color:"rgba(30,20,50,0.7)" }}/>
            <div style={{ display:"flex", gap:6, alignItems:"center" }}>
              <div style={{ height:2.5, width:44, background:"rgba(30,20,50,0.25)", borderRadius:2 }}/>
              <div style={{ height:2.5, width:28, background:"rgba(30,20,50,0.25)", borderRadius:2 }}/>
            </div>
          </div>

          {/* Dark card detail overlay — pops forward */}
          <div style={{ position:"relative", margin:"0 -4px",
            background:"#1e2430", borderRadius:10,
            boxShadow:"0 8px 30px rgba(0,0,0,0.6)",
            padding:"14px 14px 12px", border:`1px solid rgba(61,76,92,0.5)`,
            zIndex:2 }}>
            {/* skeleton lines */}
            {[["60%","rgba(182,194,207,0.35)"],["80%","rgba(182,194,207,0.22)"],
              ["45%","rgba(182,194,207,0.22)"]].map(([w,c],i)=>(
              <div key={i} style={{ height:9, width:w as string, background:c,
                borderRadius:4, marginBottom:8 }}/>
            ))}
            {/* bottom icons row */}
            <div style={{ display:"flex", alignItems:"center", gap:10, marginTop:10 }}>
              <div style={{ width:16, height:16, borderRadius:"50%",
                background:"rgba(255,255,255,0.08)", display:"flex", alignItems:"center", justifyContent:"center" }}>
                <span style={{ color:T.muted, fontSize:9 }}>ℹ</span>
              </div>
              <div style={{ width:14, height:14, borderRadius:2, border:`1px solid ${T.border}` }}/>
              <div style={{ width:18, height:18, borderRadius:"50%",
                background:"hsl(45,85%,55%)", display:"flex", alignItems:"center", justifyContent:"center" }}>
                <span style={{ fontSize:9 }}>⚡</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────
   BOARD — blue-to-teal gradient, "My first workspace board"
───────────────────────────────────────────────────────── */
function BoardCard({ card }: { card:Card }) {
  const [hov, setHov] = useState(false);
  return (
    <div onMouseEnter={()=>setHov(true)} onMouseLeave={()=>setHov(false)}
      style={{ background:hov?T.cardHov:T.cardBg, borderRadius:9, padding:"10px 12px",
        cursor:"pointer", transition:"background 0.12s", marginBottom:6, boxShadow:"0 1px 4px rgba(0,0,0,0.3)" }}>
      <p style={{ color:T.text, fontSize:13, lineHeight:1.45, margin:0 }}>{card.title}</p>
    </div>
  );
}

function BoardList({ list, onAddCard }: { list:List; onAddCard:(id:string,t:string)=>void }) {
  const [adding, setAdding] = useState(false);
  const [title,  setTitle]  = useState("");
  const ref = useRef<HTMLTextAreaElement>(null);
  useEffect(()=>{ if(adding) ref.current?.focus(); },[adding]);

  const submit = () => {
    if (title.trim()) { onAddCard(list.id, title.trim()); setTitle(""); setAdding(false); }
  };

  return (
    <div style={{ width:272, minWidth:272, background:T.listBg, borderRadius:12,
      display:"flex", flexDirection:"column", flexShrink:0, maxHeight:"100%" }}>
      {/* list header */}
      <div style={{ padding:"10px 12px 8px", display:"flex", alignItems:"center" }}>
        <span style={{ color:T.text, fontWeight:600, fontSize:14, flex:1 }}>{list.title}</span>
        <HovBtn><MoreHorizontal size={15}/></HovBtn>
      </div>
      {/* cards */}
      <div style={{ flex:1, overflowY:"auto", padding:"0 8px 4px" }}>
        {list.cards.map(c=><BoardCard key={c.id} card={c}/>)}
        {adding && (
          <div style={{ background:T.cardBg, borderRadius:9, padding:10, marginBottom:6 }}>
            <textarea ref={ref} value={title} onChange={e=>setTitle(e.target.value)}
              placeholder="Enter a title for this card…" rows={2}
              style={{ width:"100%", background:"transparent", border:"none", outline:"none",
                color:T.text, fontSize:13, resize:"none", lineHeight:1.5, fontFamily:"inherit" }}
              onKeyDown={e=>{ if(e.key==="Enter"&&!e.shiftKey){e.preventDefault();submit();}
                              if(e.key==="Escape"){setAdding(false);setTitle("");} }}/>
            <div style={{ display:"flex", alignItems:"center", gap:8, marginTop:6 }}>
              <button onClick={submit}
                style={{ background:"#579dff", color:"#1d2125", border:"none",
                  borderRadius:4, padding:"6px 14px", fontSize:13, fontWeight:700, cursor:"pointer" }}>
                Add card
              </button>
              <button onClick={()=>{setAdding(false);setTitle("");}}
                style={{ padding:4, background:"none", border:"none", cursor:"pointer",
                  color:T.muted, display:"flex" }}>
                <X size={15}/>
              </button>
            </div>
          </div>
        )}
      </div>
      {/* Add a card + copy icon row */}
      {!adding && (
        <div style={{ padding:"3px 8px 8px", display:"flex", alignItems:"center" }}>
          <button onClick={()=>setAdding(true)}
            style={{ flex:1, display:"flex", alignItems:"center", gap:6,
              color:T.muted, background:"none", border:"none", cursor:"pointer",
              borderRadius:7, padding:"7px 8px", fontSize:13, transition:"background 0.1s" }}
            onMouseEnter={e=>(e.currentTarget.style.background="rgba(255,255,255,0.07)")}
            onMouseLeave={e=>(e.currentTarget.style.background="none")}>
            <Plus size={14}/><span>Add a card</span>
          </button>
          {/* template/copy icon */}
          <button style={{ padding:7, background:"none", border:"none", cursor:"pointer",
            color:T.muted, borderRadius:4, display:"flex" }}
            onMouseEnter={e=>(e.currentTarget.style.background="rgba(255,255,255,0.07)")}
            onMouseLeave={e=>(e.currentTarget.style.background="none")}>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <rect x="0.75" y="3.25" width="8.5" height="9.5" rx="1.5" stroke="currentColor" strokeWidth="1.3"/>
              <path d="M3.5 3V2.5C3.5 1.67 4.17 1 5 1h6.5C12.33 1 13 1.67 13 2.5v6C13 9.33 12.33 10 11.5 10H11"
                stroke="currentColor" strokeWidth="1.3"/>
            </svg>
          </button>
        </div>
      )}
    </div>
  );
}

function BoardArea({ lists, onAddCard }: { lists:List[]; onAddCard:(id:string,t:string)=>void }) {
  return (
    <div style={{ flex:1, display:"flex", flexDirection:"column",
      background:T.boardGrad, overflow:"hidden", minWidth:0 }}>

      {/* ── Board sub-header (matches screenshot exactly) ── */}
      <div style={{ display:"flex", alignItems:"center", gap:8, padding:"8px 14px",
        borderBottom:"1px solid rgba(255,255,255,0.12)", flexShrink:0, flexWrap:"wrap" }}>

        <span style={{ color:"white", fontWeight:700, fontSize:15, marginRight:2 }}>
          My first workspace board
        </span>

        {/* grid / view toggle */}
        <div style={{ display:"flex", background:"rgba(0,0,0,0.18)", borderRadius:4 }}>
          <button style={{ padding:"5px 7px", background:"none", border:"none", cursor:"pointer",
            color:"rgba(255,255,255,0.65)", display:"flex" }}>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <rect x="1" y="1" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.3"/>
              <rect x="8" y="1" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.3"/>
              <rect x="1" y="8" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.3"/>
              <rect x="8" y="8" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.3"/>
            </svg>
          </button>
          <button style={{ padding:"5px 5px", background:"none", border:"none", cursor:"pointer",
            color:"rgba(255,255,255,0.65)", display:"flex" }}>
            <ChevronDown size={13}/>
          </button>
        </div>

        {/* divider */}
        <div style={{ width:1, height:18, background:"rgba(255,255,255,0.2)" }}/>

        {/* right side */}
        <div style={{ display:"flex", alignItems:"center", gap:4, marginLeft:"auto" }}>
          <Av size={28}/>
          <div style={{ width:1, height:16, background:"rgba(255,255,255,0.2)" }}/>
          {/* filter icon */}
          <button style={{ padding:"5px 7px", background:"none", border:"none", cursor:"pointer",
            color:"rgba(255,255,255,0.65)", borderRadius:4, display:"flex" }}
            onMouseEnter={e=>(e.currentTarget.style.background="rgba(255,255,255,0.12)")}
            onMouseLeave={e=>(e.currentTarget.style.background="none")}>
            <SlidersHorizontal size={15}/>
          </button>
          {/* Share + badge */}
          <button style={{ display:"flex", alignItems:"center", gap:6,
            background:"rgba(255,255,255,0.0)", color:"white",
            border:"1px solid rgba(255,255,255,0.55)",
            borderRadius:5, padding:"5px 12px", fontSize:13, fontWeight:600, cursor:"pointer",
            transition:"background 0.12s" }}
            onMouseEnter={e=>(e.currentTarget.style.background="rgba(255,255,255,0.12)")}
            onMouseLeave={e=>(e.currentTarget.style.background="rgba(255,255,255,0.0)")}>
            <Users size={13}/>
            <span>Share</span>
            <span style={{ background:"rgba(255,255,255,0.22)", borderRadius:10,
              padding:"1px 6px", fontSize:11, fontWeight:700 }}>1</span>
          </button>
          <button style={{ padding:"5px 6px", background:"none", border:"none", cursor:"pointer",
            color:"rgba(255,255,255,0.65)", borderRadius:4, display:"flex" }}>
            <MoreHorizontal size={15}/>
          </button>
        </div>
      </div>

      {/* ── Lists ── */}
      <div style={{ flex:1, overflowX:"auto", overflowY:"hidden",
        padding:"12px 12px 0", display:"flex" }}>
        <div style={{ display:"flex", gap:10, alignItems:"flex-start", height:"100%" }}>
          {lists.map(list=>(
            <BoardList key={list.id} list={list} onAddCard={onAddCard}/>
          ))}
          {/* Add another list */}
          <button style={{ width:272, minWidth:272, background:"rgba(255,255,255,0.14)",
            border:"none", borderRadius:12, padding:"10px 12px",
            display:"flex", alignItems:"center", gap:8, color:"rgba(255,255,255,0.85)",
            cursor:"pointer", fontSize:13, fontWeight:500, flexShrink:0,
            transition:"background 0.12s", height:"fit-content" }}
            onMouseEnter={e=>(e.currentTarget.style.background="rgba(255,255,255,0.22)")}
            onMouseLeave={e=>(e.currentTarget.style.background="rgba(255,255,255,0.14)")}>
            <Plus size={14}/> Add another list
          </button>
        </div>
      </div>

      {/* Scrollbar track */}
      <div style={{ height:12, background:"rgba(0,0,0,0.15)",
        borderTop:"1px solid rgba(255,255,255,0.05)", flexShrink:0 }}>
        <div style={{ height:"100%", width:"22%", marginLeft:"4%",
          background:"rgba(255,255,255,0.28)", borderRadius:6 }}/>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────
   BOTTOM NAV BAR
   Screenshot: all 3 tabs active (blue filled + underline),
   "Switch boards" has purple border
───────────────────────────────────────────────────────── */
function BottomNav({ active, onToggle, onSwitch }: {
  active:Set<Panel>; onToggle:(k:Panel)=>void; onSwitch:()=>void;
}) {
  const TABS: {key:Panel; label:string; Icon:React.ElementType}[] = [
    {key:"inbox",   label:"Inbox",   Icon:Inbox},
    {key:"planner", label:"Planner", Icon:Calendar},
    {key:"board",   label:"Board",   Icon:LayoutDashboard},
  ];

  return (
    <div style={{ flexShrink:0, display:"flex", justifyContent:"center", padding:"8px 0 10px",
      background:"transparent" }}>
      <div style={{ display:"flex", alignItems:"center", gap:2,
        background:"#1d2125", border:`1px solid rgba(61,76,92,0.75)`,
        borderRadius:20, padding:"4px 5px", boxShadow:"0 4px 24px rgba(0,0,0,0.55)" }}>

        {TABS.map(({key,label,Icon})=>{
          const on = active.has(key);
          return (
            <button key={key} onClick={()=>onToggle(key)}
              style={{ position:"relative", display:"flex", alignItems:"center", gap:7,
                padding:"8px 18px", borderRadius:16, border:"none", cursor:"pointer",
                fontSize:13, fontWeight:500, transition:"all 0.15s",
                background: on ? "#1a5fa5" : "transparent",
                color: on ? "white" : T.muted }}
              onMouseEnter={e=>{ if(!on)(e.currentTarget as HTMLElement).style.background="rgba(255,255,255,0.07)"; }}
              onMouseLeave={e=>{ if(!on)(e.currentTarget as HTMLElement).style.background="transparent"; }}>
              <Icon size={15}/>
              <span>{label}</span>
              {/* bright underline when active */}
              {on && (
                <span style={{ position:"absolute", bottom:-1, left:"50%",
                  transform:"translateX(-50%)", width:22, height:2.5,
                  background:"#579dff", borderRadius:3 }}/>
              )}
            </button>
          );
        })}

        {/* Switch boards — purple outline */}
        <button onClick={onSwitch}
          style={{ display:"flex", alignItems:"center", gap:7,
            padding:"8px 18px", borderRadius:16, cursor:"pointer",
            fontSize:13, fontWeight:500, transition:"all 0.15s",
            background:"transparent", color:T.muted,
            border:"2px solid hsl(272,55%,52%)" }}
          onMouseEnter={e=>{
            (e.currentTarget as HTMLElement).style.background="rgba(255,255,255,0.07)";
            (e.currentTarget as HTMLElement).style.color=T.text;
          }}
          onMouseLeave={e=>{
            (e.currentTarget as HTMLElement).style.background="transparent";
            (e.currentTarget as HTMLElement).style.color=T.muted;
          }}>
          <Grid3x3 size={15}/>
          <span>Switch boards</span>
        </button>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────
   PAGE ROOT
───────────────────────────────────────────────────────── */
export default function BoardPage() {
  /* ── Default: ALL THREE panels open — exactly matches screenshot ── */
  const [active, setActive] = useState<Set<Panel>>(
    new Set<Panel>(["inbox","planner","board"])
  );
  const [showSwitcher, setShowSwitcher] = useState(false);
  const [showProfile,  setShowProfile]  = useState(false);

  /* User info — swap with real data from useAuth() / authService in production */
  const PROFILE = { name:"eromose charles", email:"charleschmidth@gmail.com", initials:"EC" };

  /* Inbox cards (pre-populated from screenshot) */
  const [inboxCards, setInboxCards] = useState([
    { id:"ic1", title:"This is a little to do" },
    { id:"ic2", title:"To understand trello" },
  ]);

  /* Board lists — "Doing" and "Done" as in screenshot */
  const [lists, setLists] = useState<List[]>([
    { id:"doing", title:"Doing", cards:[] },
    { id:"done",  title:"Done",  cards:[] },
  ]);

  const addCard = useCallback((listId:string, title:string) => {
    setLists(prev=>prev.map(l=>l.id===listId
      ? {...l, cards:[...l.cards,{id:Date.now().toString(),title}]}
      : l));
  },[]);

  const addInboxCard = useCallback((t:string) => {
    setInboxCards(prev=>[{id:Date.now().toString(),title:t},...prev]);
  },[]);

  const toggle = useCallback((key:Panel) => {
    setActive(prev=>{
      const next = new Set(prev);
      if (next.has(key)) {
        if (next.size===1) return prev; // at least one stays open
        next.delete(key);
      } else {
        next.add(key);
      }
      return next;
    });
  },[]);

  const showInbox   = active.has("inbox");
  const showPlanner = active.has("planner");
  const showBoard   = active.has("board");

  return (
    <div style={{ height:"100vh", display:"flex", flexDirection:"column",
      overflow:"hidden", background:T.boardGrad }}>

      {/* ══ TOP NAVBAR ══ */}
      <header style={{ flexShrink:0, display:"flex", alignItems:"center", gap:10,
        padding:"6px 12px", zIndex:30,
        background:T.nav, backdropFilter:"blur(14px)",
        borderBottom:`1px solid ${T.navBorder}` }}>

        {/* Left: apps grid + logo */}
        <div style={{ display:"flex", alignItems:"center", gap:4, flexShrink:0 }}>
          <IconBtn><Grid3x3 size={17}/></IconBtn>
          <Logo/>
        </div>

        {/* Center: search */}
        <div style={{ flex:1, display:"flex", justifyContent:"center", padding:"0 10px" }}>
          <SearchBar/>
        </div>

        {/* Right: Create + icons */}
        <div style={{ display:"flex", alignItems:"center", gap:3, flexShrink:0 }}>
          <button style={{ background:"#579dff", color:"#1d2125", border:"none",
            borderRadius:4, padding:"7px 14px", fontSize:13, fontWeight:700, cursor:"pointer",
            transition:"background 0.12s", marginRight:4 }}
            onMouseEnter={e=>(e.currentTarget.style.background="#85b8ff")}
            onMouseLeave={e=>(e.currentTarget.style.background="#579dff")}>
            Create
          </button>
          <IconBtn><MessageSquare size={17}/></IconBtn>
          <IconBtn badge={1}><Bell size={17}/></IconBtn>
          <IconBtn><HelpCircle size={17}/></IconBtn>
          <Av size={32} onClick={()=>setShowProfile(v=>!v)}/>
        </div>
      </header>

      {/* ══ PANELS ══ */}
      <div style={{ flex:1, display:"flex", overflow:"hidden" }}>
        {showInbox   && <InboxPanel cards={inboxCards} onAdd={addInboxCard}/>}
        {showPlanner && <PlannerPanel/>}
        {showBoard   && <BoardArea  lists={lists} onAddCard={addCard}/>}
      </div>

      {/* ══ BOTTOM NAV ══ */}
      <BottomNav active={active} onToggle={toggle} onSwitch={()=>setShowSwitcher(true)}/>

      {/* ══ MODAL ══ */}
      {showSwitcher && <SwitcherModal onClose={()=>setShowSwitcher(false)}/>}

      {/* ══ PROFILE DROPDOWN ══ */}
      {showProfile && (
        <ProfileDropdown
          name={PROFILE.name}
          email={PROFILE.email}
          initials={PROFILE.initials}
          onClose={()=>setShowProfile(false)}
        />
      )}
    </div>
  );
}