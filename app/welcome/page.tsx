"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  ChevronLeft, ChevronRight, X, Inbox,
  Mail, AlignLeft, MoreHorizontal, Plus, Circle, CheckCircle2,
} from "lucide-react";

/* pill mapping */
const TOTAL_PILLS = 4;
const LAST_STEP = 7;
function pillFor(step: number): number {
  if (step <= 1) return 0;
  if (step <= 4) return 1;
  if (step <= 6) return 2;
  return 3;
}

const BG: React.CSSProperties = {
  background: "linear-gradient(175deg,hsl(212,62%,34%) 0%,hsl(214,68%,27%) 55%,hsl(215,66%,21%) 100%)",
  minHeight: "100vh",
};

function TacoMascot({ size = 112, tongue = false }: { size?: number; tongue?: boolean }) {
  return (
    <div style={{ width: size, height: size, borderRadius: "50%", background: "hsl(272,55%,42%)", overflow: "hidden", flexShrink: 0, boxShadow: "0 8px 32px hsla(272,55%,20%,0.55)" }}>
      <svg viewBox="0 0 120 120" fill="none" style={{ width: "100%", height: "100%" }}>
        <ellipse cx="60" cy="100" rx="32" ry="22" fill="hsl(210,10%,67%)" />
        <ellipse cx="60" cy="94" rx="14" ry="16" fill="hsl(0,0%,93%)" />
        <ellipse cx="60" cy="62" rx="29" ry="27" fill="hsl(210,10%,72%)" />
        <polygon points="34,46 26,21 50,40" fill="hsl(210,10%,68%)" />
        <polygon points="86,46 94,21 70,40" fill="hsl(210,10%,68%)" />
        <polygon points="36,44 30,26 50,40" fill="hsl(340,40%,68%)" />
        <polygon points="84,44 90,26 70,40" fill="hsl(340,40%,68%)" />
        <ellipse cx="60" cy="54" rx="19" ry="15" fill="hsl(210,8%,60%)" />
        <ellipse cx="48" cy="62" rx="7.5" ry="8" fill="white" />
        <ellipse cx="72" cy="62" rx="7.5" ry="8" fill="white" />
        <circle cx="49" cy="63" r="5" fill="hsl(208,80%,42%)" />
        <circle cx="73" cy="63" r="5" fill="hsl(208,80%,42%)" />
        <circle cx="49" cy="63" r="2.8" fill="hsl(213,28%,12%)" />
        <circle cx="73" cy="63" r="2.8" fill="hsl(213,28%,12%)" />
        <circle cx="50.5" cy="61.5" r="1.3" fill="white" />
        <circle cx="74.5" cy="61.5" r="1.3" fill="white" />
        <ellipse cx="60" cy="73" rx="11" ry="7.5" fill="hsl(0,0%,92%)" />
        <ellipse cx="60" cy="71" rx="5.5" ry="3.5" fill="hsl(213,22%,20%)" />
        {tongue ? (
          <>
            <path d="M54 76 Q60 80 66 76" stroke="hsl(213,22%,20%)" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
            <ellipse cx="60" cy="81" rx="5" ry="6" fill="hsl(340,65%,65%)"/>
            <ellipse cx="60" cy="84" rx="3.5" ry="4" fill="hsl(340,55%,58%)"/>
          </>
        ) : (
          <path d="M54 76 Q60 81 66 76" stroke="hsl(213,22%,20%)" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
        )}
        <ellipse cx="40" cy="72" rx="5.5" ry="3" fill="hsl(340,50%,70%)" opacity="0.45"/>
        <ellipse cx="80" cy="72" rx="5.5" ry="3" fill="hsl(340,50%,70%)" opacity="0.45"/>
      </svg>
    </div>
  );
}

function MailAppIcon() {
  return (
    <div style={{ width:72,height:72,borderRadius:18,backgroundColor:"hsl(213,28%,22%)",display:"flex",alignItems:"center",justifyContent:"center",boxShadow:"0 6px 20px rgba(0,0,0,0.4)" }}>
      <svg width="38" height="30" viewBox="0 0 38 30" fill="none">
        <rect x="0.5" y="0.5" width="37" height="29" rx="3.5" fill="hsl(212,85%,50%)" stroke="hsl(212,75%,40%)"/>
        <path d="M1 3.5 L19 16 L37 3.5" stroke="white" strokeWidth="2.2" fill="none" strokeLinejoin="round"/>
        <line x1="1" y1="29.5" x2="12" y2="18" stroke="white" strokeWidth="1.6" strokeLinecap="round"/>
        <line x1="37" y1="29.5" x2="26" y2="18" stroke="white" strokeWidth="1.6" strokeLinecap="round"/>
      </svg>
    </div>
  );
}

function MobileAppIcon() {
  return (
    <div style={{ width:72,height:72,borderRadius:18,backgroundColor:"hsl(213,28%,22%)",display:"flex",alignItems:"center",justifyContent:"center",boxShadow:"0 6px 20px rgba(0,0,0,0.4)" }}>
      <svg width="32" height="52" viewBox="0 0 32 52" fill="none">
        <rect x="0.5" y="0.5" width="31" height="51" rx="6.5" fill="hsl(210,12%,55%)" stroke="hsl(210,12%,42%)"/>
        <rect x="2" y="4" width="28" height="42" rx="2.5" fill="hsl(200,55%,88%)"/>
        <rect x="4" y="6" width="11" height="11" rx="2" fill="hsl(340,68%,55%)"/>
        <rect x="17" y="6" width="11" height="11" rx="2" fill="hsl(212,85%,55%)"/>
        <rect x="4" y="19" width="11" height="11" rx="2" fill="hsl(45,85%,58%)"/>
        <rect x="17" y="19" width="11" height="11" rx="2" fill="hsl(160,58%,48%)"/>
        <rect x="4" y="32" width="11" height="8" rx="2" fill="hsl(272,55%,58%)"/>
        <rect x="17" y="32" width="11" height="8" rx="2" fill="hsl(25,82%,54%)"/>
        <rect x="11" y="46" width="10" height="2" rx="1" fill="hsl(210,12%,42%)"/>
      </svg>
    </div>
  );
}

function SlackTeamsCluster() {
  return (
    <div style={{ position:"relative",width:200 }}>
      <div style={{ backgroundColor:"hsl(213,22%,18%)",border:"1px solid hsl(213,18%,28%)",borderRadius:12,padding:"10px 12px",boxShadow:"0 4px 16px rgba(0,0,0,0.35)" }}>
        <div style={{ display:"flex",alignItems:"flex-start",gap:8 }}>
          <div style={{ width:28,height:28,borderRadius:7,background:"linear-gradient(135deg,#f97316,#ec4899)",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,fontSize:12,fontWeight:700,color:"white" }}>J</div>
          <div>
            <div style={{ display:"flex",gap:6,alignItems:"baseline" }}>
              <span style={{ color:"white",fontSize:11,fontWeight:600 }}>Jordan</span>
              <span style={{ color:"rgba(255,255,255,0.38)",fontSize:10 }}>8:30 AM</span>
            </div>
            <p style={{ color:"rgba(255,255,255,0.55)",fontSize:10,marginTop:2,lineHeight:1.3 }}>Forwarded task to Inbox</p>
            <div style={{ display:"flex",alignItems:"center",gap:4,marginTop:5 }}>
              <span style={{ fontSize:11 }}>👍</span><span style={{ color:"rgba(255,255,255,0.35)",fontSize:10 }}>2</span>
              <span style={{ color:"rgba(255,255,255,0.2)",fontSize:10,margin:"0 2px" }}>·</span>
              <span style={{ fontSize:11 }}>💬</span><span style={{ color:"rgba(255,255,255,0.35)",fontSize:10 }}>1</span>
            </div>
          </div>
        </div>
      </div>
      <div style={{ position:"absolute",bottom:-16,right:-8,display:"flex",gap:6 }}>
        <div style={{ width:36,height:36,borderRadius:10,background:"#4A154B",display:"flex",alignItems:"center",justifyContent:"center",boxShadow:"0 3px 10px rgba(0,0,0,0.4)" }}>
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <rect x="3" y="11" width="3" height="6" rx="1.5" fill="#E01E5A"/>
            <rect x="1" y="11" width="3" height="3" rx="1.5" fill="#E01E5A"/>
            <rect x="8" y="3" width="3" height="6" rx="1.5" fill="#2EB67D"/>
            <rect x="8" y="11" width="3" height="3" rx="1.5" fill="#2EB67D"/>
            <rect x="11" y="7" width="6" height="3" rx="1.5" fill="#ECB22E"/>
            <rect x="11" y="7" width="3" height="3" rx="1.5" fill="#ECB22E"/>
            <rect x="3" y="7" width="6" height="3" rx="1.5" fill="#36C5F0"/>
            <rect x="6" y="3" width="3" height="3" rx="1.5" fill="#36C5F0"/>
          </svg>
        </div>
        <div style={{ width:36,height:36,borderRadius:10,background:"#5B5EA6",display:"flex",alignItems:"center",justifyContent:"center",boxShadow:"0 3px 10px rgba(0,0,0,0.4)" }}>
          <svg width="20" height="20" viewBox="0 0 20 20"><text x="4" y="16" fill="white" fontSize="14" fontWeight="800" fontFamily="sans-serif">T</text></svg>
        </div>
      </div>
    </div>
  );
}

function ChromeCluster() {
  return (
    <div style={{ position:"relative" }}>
      <div style={{ width:60,height:60 }}>
        <svg viewBox="0 0 60 60" fill="none" style={{ width:"100%",height:"100%" }}>
          <circle cx="30" cy="30" r="30" fill="white"/>
          <path d="M30 8 A22 22 0 0 1 49.05 19" stroke="#EA4335" strokeWidth="12" fill="none"/>
          <path d="M49.05 19 A22 22 0 0 1 49.05 41" stroke="#FBBC05" strokeWidth="12" fill="none"/>
          <path d="M49.05 41 A22 22 0 0 1 30 52" stroke="#34A853" strokeWidth="12" fill="none"/>
          <path d="M30 52 A22 22 0 0 1 10.95 41" stroke="#34A853" strokeWidth="12" fill="none"/>
          <path d="M10.95 41 A22 22 0 0 1 10.95 19" stroke="#4285F4" strokeWidth="12" fill="none"/>
          <path d="M10.95 19 A22 22 0 0 1 30 8" stroke="#4285F4" strokeWidth="12" fill="none"/>
          <circle cx="30" cy="30" r="14" fill="white"/>
          <circle cx="30" cy="30" r="11" fill="#4285F4"/>
          <circle cx="30" cy="30" r="7.5" fill="white"/>
        </svg>
      </div>
      <div style={{ position:"absolute",top:44,left:-20,width:190,backgroundColor:"hsl(213,22%,18%)",border:"1px solid hsl(213,18%,28%)",borderRadius:10,padding:"8px 10px",boxShadow:"0 4px 16px rgba(0,0,0,0.4)",display:"flex",alignItems:"center",gap:7 }}>
        <div style={{ width:16,height:16,borderRadius:"50%",backgroundColor:"#22c55e",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0 }}>
          <svg width="8" height="7" viewBox="0 0 8 7" fill="none"><path d="M1 3.5L3 5.5L7 1.5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </div>
        <p style={{ color:"white",fontSize:10.5,fontWeight:500,flex:1,lineHeight:1.35 }}>Saved to your Trello Inbox</p>
        <span style={{ color:"rgba(255,255,255,0.28)",fontSize:11,cursor:"pointer" }}>✕</span>
      </div>
    </div>
  );
}

function InboxCard({ cards, style }: { cards: Array<{ text:string; hasIcons?:boolean }>; style?: React.CSSProperties }) {
  return (
    <div style={{ backgroundColor:"hsl(215,18%,20%)",borderRadius:16,overflow:"hidden",boxShadow:"0 8px 32px rgba(0,0,0,0.4)",...style }}>
      <div style={{ display:"flex",alignItems:"center",gap:10,padding:"16px 20px 12px" }}>
        <Inbox size={18} style={{ color:"rgba(255,255,255,0.55)" }}/>
        <span style={{ color:"white",fontWeight:700,fontSize:15 }}>Inbox</span>
      </div>
      <div style={{ padding:"0 16px 18px" }}>
        {cards.map((c,i) => (
          <div key={i} style={{ backgroundColor:"hsl(215,14%,28%)",borderRadius:10,padding:"11px 14px",marginBottom:i<cards.length-1?8:0 }}>
            <p style={{ color:"rgba(255,255,255,0.75)",fontSize:13.5,lineHeight:1.4 }}>{c.text}</p>
            {c.hasIcons && (
              <div style={{ display:"flex",gap:8,marginTop:8 }}>
                <Mail size={14} style={{ color:"rgba(255,255,255,0.38)" }}/>
                <AlignLeft size={14} style={{ color:"rgba(255,255,255,0.38)" }}/>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function BoardPanel({ todayCards=[], showDropZone=false }: { todayCards?: Array<{text:string;checked?:boolean;showCircle?:boolean}>; showDropZone?:boolean }) {
  return (
    <div style={{ flex:1,borderRadius:"16px 16px 0 0",overflow:"hidden",background:"linear-gradient(135deg,hsl(295,55%,50%) 0%,hsl(280,50%,45%) 40%,hsl(330,55%,50%) 100%)",boxShadow:"0 -4px 32px rgba(0,0,0,0.3)",minHeight:280 }}>
      <div style={{ padding:"14px 20px 10px",display:"flex",alignItems:"center",justifyContent:"space-between" }}>
        <span style={{ color:"white",fontWeight:700,fontSize:15 }}>My Trello Board</span>
        <div style={{ display:"flex",gap:8,alignItems:"center" }}>
          {[42,28,20].map((w,i)=><div key={i} style={{ width:w,height:8,borderRadius:4,backgroundColor:"rgba(255,255,255,0.2)" }}/>)}
          <div style={{ width:24,height:24,borderRadius:6,backgroundColor:"rgba(255,255,255,0.18)",display:"flex",alignItems:"center",justifyContent:"center" }}>
            <span style={{ color:"rgba(255,255,255,0.7)",fontSize:14 }}>⋯</span>
          </div>
        </div>
      </div>
      <div style={{ display:"flex",gap:12,padding:"0 14px 14px" }}>
        {/* TODAY */}
        <div style={{ flex:1,backgroundColor:"hsl(215,18%,20%)",borderRadius:12,padding:"12px 10px" }}>
          <div style={{ display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:10 }}>
            <span style={{ color:"white",fontSize:13,fontWeight:600 }}>Today</span>
            <MoreHorizontal size={14} style={{ color:"rgba(255,255,255,0.35)" }}/>
          </div>
          {todayCards.map((c,i) => (
            <div key={i} style={{ backgroundColor:"hsl(215,14%,28%)",borderRadius:8,padding:"10px",marginBottom:8,border:c.showCircle?"2px solid rgba(255,255,255,0.35)":"2px solid transparent",display:"flex",alignItems:"center",gap:8 }}>
              {c.showCircle && (c.checked ? <CheckCircle2 size={16} style={{ color:"#22c55e",flexShrink:0 }}/> : <Circle size={16} style={{ color:"rgba(255,255,255,0.45)",flexShrink:0 }}/>)}
              <span style={{ color:c.checked?"rgba(255,255,255,0.38)":"rgba(255,255,255,0.78)",fontSize:12,textDecoration:c.checked?"line-through":"none",lineHeight:1.35 }}>{c.text}</span>
            </div>
          ))}
          {showDropZone && todayCards.length===0 && (
            <div style={{ border:"2px solid rgba(255,255,255,0.25)",borderRadius:8,height:80,backgroundColor:"rgba(255,255,255,0.06)",marginBottom:8 }}/>
          )}
          <div style={{ display:"flex",alignItems:"center",gap:4,marginTop:4 }}>
            <Plus size={12} style={{ color:"rgba(255,255,255,0.35)" }}/>
            <div style={{ flex:1,height:6,borderRadius:3,backgroundColor:"rgba(255,255,255,0.18)" }}/>
            <div style={{ width:16,height:16,borderRadius:"50%",backgroundColor:"rgba(255,255,255,0.18)" }}/>
          </div>
        </div>
        {/* THIS WEEK */}
        <div style={{ flex:1,backgroundColor:"hsl(215,18%,20%)",borderRadius:12,padding:"12px 10px" }}>
          <div style={{ display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:10 }}>
            <span style={{ color:"white",fontSize:13,fontWeight:600 }}>This week</span>
            <MoreHorizontal size={14} style={{ color:"rgba(255,255,255,0.35)" }}/>
          </div>
          <div style={{ display:"flex",alignItems:"center",gap:4,marginTop:4 }}>
            <Plus size={12} style={{ color:"rgba(255,255,255,0.35)" }}/>
            <div style={{ flex:1,height:6,borderRadius:3,backgroundColor:"rgba(255,255,255,0.18)" }}/>
            <div style={{ width:16,height:16,borderRadius:"50%",backgroundColor:"rgba(255,255,255,0.18)" }}/>
          </div>
        </div>
        {/* LATER */}
        <div style={{ flex:1,backgroundColor:"hsl(215,18%,20%)",borderRadius:12,padding:"12px 10px" }}>
          <div style={{ display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:10 }}>
            <span style={{ color:"white",fontSize:13,fontWeight:600 }}>Later</span>
            <MoreHorizontal size={14} style={{ color:"rgba(255,255,255,0.35)" }}/>
          </div>
          <div style={{ display:"flex",alignItems:"center",gap:4,marginTop:4 }}>
            <Plus size={12} style={{ color:"rgba(255,255,255,0.35)" }}/>
            <div style={{ flex:1,height:6,borderRadius:3,backgroundColor:"rgba(255,255,255,0.18)" }}/>
            <div style={{ width:16,height:16,borderRadius:"50%",backgroundColor:"rgba(255,255,255,0.18)" }}/>
          </div>
        </div>
      </div>
    </div>
  );
}

function PageHeader({ step, onPrev, onNext, onClose }: { step:number; onPrev:()=>void; onNext:()=>void; onClose:()=>void }) {
  const active = pillFor(step);
  return (
    <header style={{ display:"flex",alignItems:"center",justifyContent:"space-between",padding:"14px 24px",position:"relative",zIndex:10,flexShrink:0 }}>
      <div style={{ display:"flex",alignItems:"center",gap:8 }}>
        <div style={{ width:32,height:32,borderRadius:8,backgroundColor:"hsl(212,100%,42%)",display:"flex",alignItems:"center",justifyContent:"center" }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="white"><rect x="3" y="3" width="8" height="18" rx="1.5"/><rect x="13" y="3" width="8" height="11" rx="1.5"/></svg>
        </div>
        <span style={{ color:"white",fontWeight:700,fontSize:17,letterSpacing:"-0.3px" }}>Trello</span>
      </div>
      <div style={{ position:"absolute",left:"50%",transform:"translateX(-50%)",display:"flex",alignItems:"center",gap:10 }}>
        <button onClick={onPrev} disabled={step===0} style={{ background:"none",border:"none",color:step===0?"rgba(255,255,255,0.2)":"rgba(255,255,255,0.55)",cursor:step===0?"default":"pointer",padding:2,display:"flex" }}><ChevronLeft size={20}/></button>
        <div style={{ display:"flex",gap:8 }}>
          {Array.from({length:TOTAL_PILLS}).map((_,i)=>(
            <div key={i} style={{ height:8,borderRadius:4,transition:"all 0.45s ease",width:i===active?42:28,backgroundColor:i===active?"white":i<active?"rgba(255,255,255,0.52)":"rgba(255,255,255,0.22)" }}/>
          ))}
        </div>
        <button onClick={onNext} style={{ background:"none",border:"none",color:"rgba(255,255,255,0.55)",cursor:"pointer",padding:2,display:"flex" }}><ChevronRight size={20}/></button>
      </div>
      <button onClick={onClose} style={{ background:"none",border:"none",color:"rgba(255,255,255,0.55)",cursor:"pointer",padding:4,borderRadius:6,display:"flex" }}><X size={20}/></button>
    </header>
  );
}

function Btn({ onClick, label="Continue" }: { onClick:()=>void; label?:string }) {
  return (
    <button onClick={onClick} style={{ backgroundColor:"hsl(212,85%,52%)",color:"white",border:"none",borderRadius:8,padding:"10px 28px",fontSize:14,fontWeight:600,cursor:"pointer",boxShadow:"0 2px 12px hsla(212,85%,45%,0.45)" }}
      onMouseEnter={e=>(e.currentTarget.style.opacity="0.88")}
      onMouseLeave={e=>(e.currentTarget.style.opacity="1")}>
      {label}
    </button>
  );
}

/* Side inbox panel for stages 3-4 */
function SideInbox({ cards }: { cards: Array<{text:string;hasIcons?:boolean}> }) {
  return (
    <div style={{ width:230,flexShrink:0,backgroundColor:"hsl(213,22%,16%)",borderRadius:"16px 0 0 0",padding:"20px 16px",alignSelf:"stretch" }}>
      <div style={{ display:"flex",alignItems:"center",gap:9,marginBottom:16 }}>
        <Inbox size={17} style={{ color:"rgba(255,255,255,0.55)" }}/>
        <span style={{ color:"white",fontWeight:700,fontSize:14 }}>Inbox</span>
      </div>
      {cards.map((c,i)=>(
        <div key={i} style={{ backgroundColor:"hsl(215,14%,26%)",borderRadius:9,padding:"10px 12px",marginBottom:8,cursor:"grab" }}>
          <p style={{ color:"rgba(255,255,255,0.72)",fontSize:12.5,lineHeight:1.4 }}>{c.text}</p>
          {c.hasIcons && (
            <div style={{ display:"flex",gap:7,marginTop:7 }}>
              <Mail size={12} style={{ color:"rgba(255,255,255,0.38)" }}/>
              <AlignLeft size={12} style={{ color:"rgba(255,255,255,0.38)" }}/>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

/* ════ MAIN ════ */
export default function WelcomePage() {
  const router = useRouter();
  const [step, setStep] = useState(0);

  const NORMAL_TXT = "Welcome to Trello! Meet your ";
  const BOLD_TXT   = "Inbox";
  const FULL       = NORMAL_TXT + BOLD_TXT;
  const INPUT_DEMO = "Start using Trello";
  const [typed, setTyped]           = useState(0);
  const [headingDone, setHDone]     = useState(false);
  const [subIn, setSubIn]           = useState(false);
  const [cardIn, setCardIn]         = useState(false);
  const [inputTyped, setInputTyped] = useState(0);

  const [todoText, setTodoText] = useState("");
  const [todos, setTodos]       = useState<string[]>([]);
  const [tacoIn, setTacoIn]     = useState(false);
  const [arrowIn, setArrowIn]   = useState(false);
  const todoRef = useRef<HTMLInputElement>(null);

  const [iconsIn, setIconsIn]   = useState(false);
  const [composeIn, setComposeIn] = useState(false);
  const [inboxRIn, setInboxRIn]   = useState(false);
  const [sendHover, setSendHover] = useState(false);
  const [successIn, setSuccessIn] = useState(false);

  const [inboxS5In, setInboxS5In] = useState(false);
  const [boardS5In, setBoardS5In] = useState(false);
  const [tacoS5In, setTacoS5In]   = useState(false);

  const [tacoS6In, setTacoS6In]   = useState(false);
  const [arrowS6In, setArrowS6In] = useState(false);

  const [checked, setChecked]     = useState(false);
  const [tacoS7In, setTacoS7In]   = useState(false);
  const [arrowS7In, setArrowS7In] = useState(false);
  const [s7In, setS7In]           = useState(false);

  useEffect(() => {
    if (step !== 0) return;
    setTyped(0); setHDone(false); setSubIn(false); setCardIn(false); setInputTyped(0);
    let c = 0;
    const iv = setInterval(() => { c++; setTyped(c); if (c >= FULL.length) { clearInterval(iv); setTimeout(() => setHDone(true), 80); } }, 38);
    return () => clearInterval(iv);
  }, [step]); // eslint-disable-line

  useEffect(() => {
    if (!headingDone || step !== 0) return;
    const a = setTimeout(() => setSubIn(true), 180);
    const b = setTimeout(() => setCardIn(true), 520);
    return () => { clearTimeout(a); clearTimeout(b); };
  }, [headingDone, step]);

  useEffect(() => {
    if (!cardIn || step !== 0) return;
    let i = 0;
    const iv = setInterval(() => { i++; setInputTyped(i); if (i >= INPUT_DEMO.length) clearInterval(iv); }, 62);
    return () => clearInterval(iv);
  }, [cardIn, step]);

  useEffect(() => {
    if (step !== 1) return;
    setTacoIn(false); setArrowIn(false);
    const a = setTimeout(() => setTacoIn(true), 160);
    const b = setTimeout(() => setArrowIn(true), 600);
    return () => { clearTimeout(a); clearTimeout(b); };
  }, [step]);

  useEffect(() => {
    if (step !== 2) return;
    setIconsIn(false);
    const t = setTimeout(() => setIconsIn(true), 80);
    return () => clearTimeout(t);
  }, [step]);

  useEffect(() => {
    if (step !== 3) return;
    setComposeIn(false); setInboxRIn(false); setSendHover(false);
    const a = setTimeout(() => setComposeIn(true), 80);
    const b = setTimeout(() => setInboxRIn(true), 240);
    return () => { clearTimeout(a); clearTimeout(b); };
  }, [step]);

  useEffect(() => {
    if (step !== 4) return;
    setSuccessIn(false);
    const t = setTimeout(() => setSuccessIn(true), 80);
    return () => clearTimeout(t);
  }, [step]);

  useEffect(() => {
    if (step !== 5) return;
    setInboxS5In(false); setBoardS5In(false); setTacoS5In(false);
    const a = setTimeout(() => setInboxS5In(true), 80);
    const b = setTimeout(() => setBoardS5In(true), 220);
    const c = setTimeout(() => setTacoS5In(true), 720);
    return () => { clearTimeout(a); clearTimeout(b); clearTimeout(c); };
  }, [step]);

  useEffect(() => {
    if (step !== 6) return;
    setTacoS6In(false); setArrowS6In(false);
    const a = setTimeout(() => setTacoS6In(true), 100);
    const b = setTimeout(() => setArrowS6In(true), 500);
    return () => { clearTimeout(a); clearTimeout(b); };
  }, [step]);

  useEffect(() => {
    if (step !== 7) return;
    setChecked(false); setTacoS7In(false); setArrowS7In(false); setS7In(false);
    const a = setTimeout(() => setS7In(true), 80);
    const b = setTimeout(() => setTacoS7In(true), 420);
    const c = setTimeout(() => setArrowS7In(true), 720);
    return () => { clearTimeout(a); clearTimeout(b); clearTimeout(c); };
  }, [step]);

  const next = useCallback(() => { if (step < LAST_STEP) setStep(s => s+1); else router.push("/board"); }, [step, router]);
  const prev = useCallback(() => { if (step > 0) setStep(s => s-1); }, [step]);
  const addTodo = () => { const v = todoText.trim(); if (v) { setTodos(p=>[...p,v]); setTodoText(""); todoRef.current?.focus(); } };

  const iconStyle = (tx: number, ty: number, delay: number): React.CSSProperties => ({
    opacity: iconsIn ? 1 : 0,
    transform: iconsIn ? "translate(0,0) scale(1)" : `translate(${tx}px,${ty}px) scale(0.65)`,
    transition: `opacity 0.6s ease ${delay}ms, transform 0.65s cubic-bezier(0.34,1.4,0.64,1) ${delay}ms`,
  });

  const firstCard = todos[0] || "Start using Trello";

  return (
    <>
      <style>{`
        @keyframes strokePop { from{opacity:0;transform:translateX(-6px) rotate(-42deg) scaleX(0.4);}to{opacity:1;transform:translateX(0) rotate(-42deg) scaleX(1);} }
        .sp1{animation:strokePop 0.16s ease-out 0ms forwards;}
        .sp2{animation:strokePop 0.16s ease-out 55ms forwards;}
        .sp3{animation:strokePop 0.16s ease-out 110ms forwards;}
        @keyframes drawArrow { from{stroke-dashoffset:300;opacity:0;}to{stroke-dashoffset:0;opacity:1;} }
        .yarrow{stroke-dasharray:300;stroke-dashoffset:300;animation:drawArrow 0.75s ease-out forwards;}
        .yarrow2{stroke-dasharray:60;stroke-dashoffset:60;animation:drawArrow 0.3s ease-out 0.65s forwards;}
      `}</style>

      <div style={{ ...BG, display:"flex", flexDirection:"column" }}>
        <PageHeader step={step} onPrev={prev} onNext={next} onClose={()=>router.push("/board")}/>

        {/* ── STEP 0 ── */}
        {step === 0 && (() => {
          const vis = FULL.slice(0, typed);
          const np = vis.slice(0, Math.min(typed, NORMAL_TXT.length));
          const bp = vis.slice(NORMAL_TXT.length);
          return (
            <div style={{ display:"flex",flexDirection:"column",alignItems:"center",paddingTop:64,paddingBottom:48,paddingLeft:16,paddingRight:16,minHeight:"calc(100vh - 62px)" }}>
              <h1 style={{ fontSize:"clamp(22px,3.8vw,36px)",color:"rgba(255,255,255,0.88)",textAlign:"center",marginBottom:20,lineHeight:1.35,minHeight:"1.4em",fontWeight:400 }}>
                {np}<strong style={{ fontWeight:900,color:"white" }}>{bp}</strong>
                {typed < FULL.length && <span className="animate-pulse" style={{ display:"inline-block",width:2,height:"0.85em",backgroundColor:"white",verticalAlign:"middle",marginLeft:2 }}/>}
              </h1>
              <p style={{ textAlign:"center",maxWidth:520,marginBottom:44,fontSize:16.5,lineHeight:1.6,color:"rgba(255,255,255,0.78)",opacity:subIn?1:0,transform:subIn?"translateY(0)":"translateY(8px)",transition:"opacity 0.7s ease,transform 0.7s ease" }}>
                This is a space for you to <strong style={{ color:"white" }}>add to-dos</strong> or <strong style={{ color:"white" }}>import them</strong> from other apps.
              </p>
              <div style={{ width:"100%",maxWidth:430,opacity:cardIn?1:0,transform:cardIn?"translateY(0) scale(1)":"translateY(20px) scale(0.97)",transition:"opacity 0.7s ease,transform 0.7s ease" }}>
                <div style={{ backgroundColor:"hsl(215,18%,20%)",borderRadius:16,overflow:"hidden",boxShadow:"0 8px 40px rgba(0,0,0,0.45)" }}>
                  <div style={{ display:"flex",alignItems:"center",gap:10,padding:"18px 20px 12px" }}>
                    <Inbox size={19} style={{ color:"rgba(255,255,255,0.55)" }}/><span style={{ color:"white",fontWeight:600,fontSize:15 }}>Inbox</span>
                  </div>
                  <div style={{ padding:"0 16px 16px" }}>
                    <div style={{ backgroundColor:"hsl(215,16%,25%)",borderRadius:12,padding:"16px 16px 14px",border:"2px solid hsl(212,85%,52%)",boxShadow:"0 0 0 3px hsla(212,85%,52%,0.22)" }}>
                      <p style={{ color:"rgba(255,255,255,0.86)",fontSize:15,minHeight:28,marginBottom:16 }}>
                        {INPUT_DEMO.slice(0,inputTyped)}
                        {inputTyped<INPUT_DEMO.length && <span className="animate-pulse" style={{ display:"inline-block",width:2,height:"0.85em",backgroundColor:"white",verticalAlign:"middle",marginLeft:1 }}/>}
                      </p>
                      <div style={{ display:"flex",justifyContent:"flex-end" }}>
                        <button style={{ backgroundColor:"hsl(212,85%,52%)",color:"white",border:"none",borderRadius:7,padding:"7px 16px",fontSize:13,fontWeight:600,cursor:"pointer" }}>Add card</button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })()}

        {/* ── STEP 1 ── */}
        {step === 1 && (
          <div style={{ display:"flex",flexDirection:"column",alignItems:"center",paddingTop:"clamp(28px,4.5vh,52px)",paddingBottom:48,paddingLeft:24,paddingRight:24,minHeight:"calc(100vh - 62px)" }}>
            <h2 style={{ fontSize:"clamp(22px,3.5vw,34px)",color:"rgba(255,255,255,0.85)",textAlign:"center",marginBottom:14,lineHeight:1.3,fontWeight:400 }}>
              <strong style={{ fontWeight:900,color:"white" }}>Add a to-do</strong> to Inbox
            </h2>
            <p style={{ textAlign:"center",maxWidth:560,marginBottom:40,fontSize:16,color:"rgba(255,255,255,0.72)",lineHeight:1.6 }}>
              Let&apos;s get started by adding a few to-dos as <strong style={{ color:"white" }}>cards</strong> to your <strong style={{ color:"white" }}>Inbox</strong>.
            </p>
            <div style={{ display:"flex",alignItems:"flex-start",justifyContent:"center",gap:32,width:"100%",maxWidth:700,position:"relative" }}>
              <div style={{ display:"flex",flexDirection:"column",alignItems:"center",position:"relative",flexShrink:0,width:150,marginTop:8 }}>
                <div style={{ position:"relative",backgroundColor:"hsl(215,18%,24%)",color:"rgba(255,255,255,0.9)",padding:"10px 14px",borderRadius:12,fontSize:13,fontWeight:500,lineHeight:1.5,maxWidth:155,marginBottom:14,boxShadow:"0 4px 16px rgba(0,0,0,0.3)",opacity:tacoIn?1:0,transform:tacoIn?"translateY(0) scale(1)":"translateY(-10px) scale(0.9)",transition:"opacity 0.5s ease,transform 0.5s ease" }}>
                  Hey, I&apos;m Taco!<br/>Add some to-dos!
                  <div style={{ position:"absolute",bottom:-7,left:18,width:0,height:0,borderLeft:"7px solid transparent",borderRight:"7px solid transparent",borderTop:"8px solid hsl(215,18%,24%)" }}/>
                </div>
                <div style={{ opacity:tacoIn?1:0,transform:tacoIn?"scale(1) rotate(0deg)":"scale(0.55) rotate(-14deg)",transition:"opacity 0.5s ease,transform 0.5s cubic-bezier(0.34,1.56,0.64,1)" }}>
                  <TacoMascot size={118}/>
                </div>
                <div style={{ position:"absolute",right:-56,bottom:10,opacity:arrowIn?1:0,transform:arrowIn?"scale(1)":"scale(0.7)",transition:"opacity 0.4s ease,transform 0.4s ease" }}>
                  <svg width="88" height="68" viewBox="0 0 88 68" fill="none">
                    <path d="M6 54 C18 14, 56 5, 82 32" stroke="hsl(213,25%,18%)" strokeWidth="2.8" strokeLinecap="round" fill="none"/>
                    <path d="M75 26 L82 32 L86 23" stroke="hsl(213,25%,18%)" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
                  </svg>
                </div>
              </div>
              <div style={{ flex:1,maxWidth:395,backgroundColor:"hsl(215,18%,20%)",borderRadius:16,overflow:"hidden",boxShadow:"0 8px 36px rgba(0,0,0,0.42)" }}>
                <div style={{ display:"flex",alignItems:"center",gap:10,padding:"18px 20px 12px" }}>
                  <Inbox size={19} style={{ color:"rgba(255,255,255,0.55)" }}/><span style={{ color:"white",fontWeight:600,fontSize:15 }}>Inbox</span>
                </div>
                <div style={{ padding:"0 16px 16px" }}>
                  <div style={{ backgroundColor:"hsl(215,16%,25%)",borderRadius:12,padding:"14px 14px 12px",border:"2px solid hsl(212,85%,52%)",boxShadow:"0 0 0 3px hsla(212,85%,52%,0.18)",marginBottom:10 }}>
                    <input ref={todoRef} value={todoText} onChange={e=>setTodoText(e.target.value)} onKeyDown={e=>e.key==="Enter"&&addTodo()} placeholder="What's on your to-do list?" autoFocus
                      style={{ width:"100%",background:"transparent",border:"none",outline:"none",color:"white",fontSize:13.5,caretColor:"white",marginBottom:14,minHeight:26 }}/>
                    <div style={{ display:"flex",justifyContent:"flex-end" }}>
                      <button onClick={addTodo} style={{ backgroundColor:"hsl(212,85%,52%)",color:"white",border:"none",borderRadius:7,padding:"7px 16px",fontSize:13,fontWeight:600,cursor:"pointer" }}>Add card</button>
                    </div>
                  </div>
                  {todos.map((t,i)=><div key={i} style={{ backgroundColor:"hsl(215,14%,28%)",borderRadius:9,padding:"10px 13px",color:"rgba(255,255,255,0.78)",fontSize:13.5,marginBottom:8 }}>{t}</div>)}
                  <div style={{ color:"rgba(255,255,255,0.32)",fontSize:13.5,padding:"8px 4px" }}>Start using Trello</div>
                </div>
              </div>
            </div>
            <button onClick={next} style={{ marginTop:28,background:"none",border:"none",color:"rgba(255,255,255,0.48)",cursor:"pointer",fontSize:13.5,textDecoration:"underline",textUnderlineOffset:3 }}>Skip for now</button>
          </div>
        )}

        {/* ── STEP 2 ── */}
        {step === 2 && (
          <div style={{ display:"flex",flexDirection:"column",alignItems:"center",paddingTop:"clamp(24px,3.5vh,44px)",paddingBottom:32,paddingLeft:16,paddingRight:16,minHeight:"calc(100vh - 62px)" }}>
            <h2 style={{ fontSize:"clamp(22px,3.2vw,34px)",color:"rgba(255,255,255,0.9)",textAlign:"center",marginBottom:14,fontWeight:500,lineHeight:1.3 }}>Consolidate all your to-dos with Inbox</h2>
            <p style={{ textAlign:"center",maxWidth:700,marginBottom:24,fontSize:15,color:"rgba(255,255,255,0.65)",lineHeight:1.6 }}>
              Capture everything, anywhere from email, Trello&apos;s mobile app, Slack, Microsoft Teams, and Trello&apos;s Chrome extension.
            </p>
            <Btn onClick={next}/>
            <div style={{ position:"relative",width:"100%",maxWidth:860,height:350,marginTop:36 }}>
              <div style={{ position:"absolute",left:"50%",top:"50%",transform:"translate(-50%,-50%)",width:310,zIndex:5 }}>
                <InboxCard cards={[{text:firstCard}]}/>
              </div>
              <div style={{ position:"absolute",top:24,left:96,...iconStyle(-80,-60,0) }}><MailAppIcon/></div>
              <div style={{ position:"absolute",top:24,right:96,...iconStyle(80,-60,110) }}><MobileAppIcon/></div>
              <div style={{ position:"absolute",bottom:16,left:40,...iconStyle(-80,70,220) }}><SlackTeamsCluster/></div>
              <div style={{ position:"absolute",bottom:8,right:40,...iconStyle(80,70,330) }}><ChromeCluster/></div>
            </div>
          </div>
        )}

        {/* ── STEP 3 ── */}
        {step === 3 && (
          <div style={{ display:"flex",flexDirection:"column",alignItems:"center",paddingTop:"clamp(24px,3.5vh,44px)",paddingBottom:32,paddingLeft:16,paddingRight:16,minHeight:"calc(100vh - 62px)" }}>
            <h2 style={{ fontSize:"clamp(22px,3.2vw,34px)",color:"rgba(255,255,255,0.9)",textAlign:"center",marginBottom:12,fontWeight:500 }}>Forward emails directly to Trello</h2>
            <p style={{ textAlign:"center",maxWidth:500,marginBottom:22,fontSize:15,color:"rgba(255,255,255,0.65)",lineHeight:1.6 }}>Each message becomes a card in your Inbox.</p>
            <Btn onClick={next}/>
            <div style={{ display:"flex",alignItems:"flex-start",justifyContent:"center",gap:28,width:"100%",maxWidth:900,marginTop:32,paddingLeft:8,paddingRight:8 }}>
              <div style={{ position:"relative",flexShrink:0,width:340 }}>
                <div style={{ position:"absolute",top:-14,left:-18,zIndex:10,opacity:composeIn?1:0,transition:"opacity 0.5s ease 0.3s" }}>
                  <div style={{ width:52,height:52,borderRadius:14,backgroundColor:"hsl(213,28%,22%)",display:"flex",alignItems:"center",justifyContent:"center",boxShadow:"0 4px 16px rgba(0,0,0,0.45)" }}>
                    <Mail size={26} style={{ color:"hsl(212,85%,60%)" }}/>
                  </div>
                </div>
                <div style={{ backgroundColor:"hsl(213,22%,18%)",border:"1px solid hsl(213,18%,28%)",borderRadius:16,overflow:"hidden",boxShadow:"0 8px 32px rgba(0,0,0,0.4)",marginTop:24,opacity:composeIn?1:0,transform:composeIn?"translateX(0)":"translateX(-60px)",transition:"opacity 0.55s cubic-bezier(0.16,1,0.3,1),transform 0.55s cubic-bezier(0.16,1,0.3,1)" }}>
                  <div style={{ padding:"22px 24px 20px" }}>
                    <div style={{ paddingBottom:12,marginBottom:12,borderBottom:"1px solid rgba(255,255,255,0.09)" }}>
                      <span style={{ color:"rgba(255,255,255,0.45)",fontSize:13.5 }}>To: </span>
                      <span style={{ color:"rgba(255,255,255,0.85)",fontSize:13.5,fontWeight:600 }}>inbox@app.trello.com</span>
                    </div>
                    <div style={{ paddingBottom:14,marginBottom:14,borderBottom:"1px solid rgba(255,255,255,0.09)" }}>
                      <span style={{ color:"rgba(255,255,255,0.45)",fontSize:13.5 }}>Subject: </span>
                      <strong style={{ color:"white",fontSize:13.5 }}>See it, send it, save it for later</strong>
                    </div>
                    <p style={{ color:"rgba(255,255,255,0.58)",fontSize:13,lineHeight:1.65,marginBottom:20 }}>
                      Don&apos;t lose to-dos in your email. Forward any message to Trello and instantly save the task to your Trello Inbox.<br/><br/>Click &ldquo;Send&rdquo; to try it out!
                    </p>
                    <div style={{ display:"flex",justifyContent:"flex-end" }}>
                      <div style={{ position:"relative" }}>
                        {sendHover && (
                          <div style={{ position:"absolute",top:-16,right:-20,display:"flex",flexDirection:"column",alignItems:"flex-start",gap:5,pointerEvents:"none" }}>
                            <div className="sp1" style={{ width:22,height:2.5,backgroundColor:"rgba(255,255,255,0.75)",borderRadius:2,opacity:0 }}/>
                            <div className="sp2" style={{ width:15,height:2.5,backgroundColor:"rgba(255,255,255,0.52)",borderRadius:2,opacity:0,marginLeft:4 }}/>
                            <div className="sp3" style={{ width:9,height:2.5,backgroundColor:"rgba(255,255,255,0.32)",borderRadius:2,opacity:0,marginLeft:9 }}/>
                          </div>
                        )}
                        <button onMouseEnter={()=>setSendHover(true)} onMouseLeave={()=>setSendHover(false)} onClick={next}
                          style={{ backgroundColor:"hsl(212,85%,52%)",color:"white",border:"none",borderRadius:50,padding:"11px 22px",fontSize:14,fontWeight:600,cursor:"pointer",display:"flex",alignItems:"center",gap:6,boxShadow:sendHover?"0 10px 28px hsla(212,85%,50%,0.55)":"0 3px 12px hsla(212,85%,50%,0.3)",transform:sendHover?"rotate(12deg) translateY(-7px) translateX(-3px)":"rotate(0deg) translateY(0) translateX(0)",transition:"transform 0.26s cubic-bezier(0.175,0.885,0.32,1.275),box-shadow 0.2s ease" }}>
                          Send
                          <div style={{ width:1,height:16,backgroundColor:"rgba(255,255,255,0.35)",margin:"0 2px" }}/>
                          <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M3 4.5L6 7.5L9 4.5" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div style={{ flexShrink:0,width:340,opacity:inboxRIn?1:0,transform:inboxRIn?"translateX(0)":"translateX(64px)",transition:"opacity 0.6s cubic-bezier(0.16,1,0.3,1) 0.08s,transform 0.6s cubic-bezier(0.16,1,0.3,1) 0.08s" }}>
                <InboxCard cards={[{text:firstCard},{text:"See it, send it, save it for later",hasIcons:true}]}/>
              </div>
            </div>
          </div>
        )}

        {/* ── STEP 4 ── */}
        {step === 4 && (
          <div style={{ display:"flex",flexDirection:"column",alignItems:"center",paddingTop:"clamp(36px,5.5vh,64px)",paddingBottom:48,paddingLeft:16,paddingRight:16,minHeight:"calc(100vh - 62px)",opacity:successIn?1:0,transform:successIn?"translateY(0)":"translateY(14px)",transition:"opacity 0.6s ease,transform 0.6s ease" }}>
            <h2 style={{ fontSize:"clamp(28px,5vw,46px)",color:"white",textAlign:"center",marginBottom:14,fontWeight:700 }}>Success!</h2>
            <p style={{ textAlign:"center",maxWidth:500,marginBottom:24,fontSize:15,color:"rgba(255,255,255,0.65)",lineHeight:1.6 }}>You&apos;ve added a card to your Inbox. Next, let&apos;s set up your boards.</p>
            <Btn onClick={next}/>
            <div style={{ marginTop:40,width:"100%",maxWidth:400 }}>
              <InboxCard cards={[{text:firstCard},{text:"See it, send it, save it for later",hasIcons:true}]}/>
            </div>
          </div>
        )}

        {/* ════════════════════════════════════════════════════════
            STEP 5 — Stage 3A: "Now, here's your first board"
            Screenshot: trellowelcomestage3A
            Inbox fades from left | Board zooms from below
            Taco pops at bottom-center of board (with tongue)
            Speech bubble: "Boards and lists are customizable!"
        ════════════════════════════════════════════════════════ */}
        {step === 5 && (
          <div style={{ display:"flex",flexDirection:"column",height:"calc(100vh - 62px)",overflow:"hidden" }}>
            {/* Top copy + Continue */}
            <div style={{ display:"flex",flexDirection:"column",alignItems:"center",padding:"4px 24px 18px",flexShrink:0 }}>
              <h2 style={{ fontSize:"clamp(17px,2.5vw,30px)",color:"rgba(255,255,255,0.9)",textAlign:"center",marginBottom:10,fontWeight:500,lineHeight:1.3,maxWidth:860 }}>
                Now, here&apos;s your first{" "}
                <strong style={{ fontWeight:900,color:"white" }}>board</strong>
                , where you&apos;ll organize your to-dos
              </h2>
              <p style={{ textAlign:"center",maxWidth:600,marginBottom:16,fontSize:14.5,color:"rgba(255,255,255,0.62)",lineHeight:1.6 }}>
                Let&apos;s start you off with three <strong style={{ color:"white" }}>lists</strong>:{" "}
                &ldquo;Today&rdquo;, &ldquo;This week&rdquo;, &ldquo;Later&rdquo;.
              </p>
              <Btn onClick={next}/>
            </div>

            {/* Two-panel bottom: Inbox left, Board right */}
            <div style={{ display:"flex",flex:1,overflow:"hidden",position:"relative" }}>

              {/* LEFT — Inbox panel slides in from left */}
              <div style={{
                width:240, flexShrink:0,
                backgroundColor:"hsl(213,22%,15%)",
                borderRadius:"14px 0 0 0",
                padding:"18px 16px",
                display:"flex", flexDirection:"column",
                opacity: inboxS5In ? 1 : 0,
                transform: inboxS5In ? "translateX(0)" : "translateX(-60px)",
                transition:"opacity 0.6s cubic-bezier(0.16,1,0.3,1), transform 0.6s cubic-bezier(0.16,1,0.3,1)",
              }}>
                <div style={{ display:"flex",alignItems:"center",gap:9,marginBottom:16 }}>
                  <Inbox size={17} style={{ color:"rgba(255,255,255,0.52)" }}/>
                  <span style={{ color:"white",fontWeight:700,fontSize:14 }}>Inbox</span>
                </div>
                {[{text:firstCard},{text:"See it, send it, save it for later",hasIcons:true}].map((c,i)=>(
                  <div key={i} style={{ backgroundColor:"hsl(215,14%,24%)",borderRadius:9,padding:"10px 12px",marginBottom:8 }}>
                    <p style={{ color:"rgba(255,255,255,0.70)",fontSize:12.5,lineHeight:1.4 }}>{c.text}</p>
                    {c.hasIcons && (
                      <div style={{ display:"flex",gap:7,marginTop:7 }}>
                        <Mail size={12} style={{ color:"rgba(255,255,255,0.35)" }}/>
                        <AlignLeft size={12} style={{ color:"rgba(255,255,255,0.35)" }}/>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* RIGHT — Board panel zooms from bottom */}
              <div style={{
                flex:1, position:"relative",
                opacity: boardS5In ? 1 : 0,
                transform: boardS5In ? "translateY(0) scale(1)" : "translateY(70px) scale(0.96)",
                transition:"opacity 0.65s cubic-bezier(0.16,1,0.3,1) 0.12s, transform 0.65s cubic-bezier(0.16,1,0.3,1) 0.12s",
              }}>
                {/* Board background — full height pink/purple gradient */}
                <div style={{
                  position:"absolute",inset:0,
                  background:"linear-gradient(140deg,hsl(295,58%,52%) 0%,hsl(278,52%,46%) 45%,hsl(325,58%,52%) 100%)",
                  borderRadius:"14px 14px 0 0",
                }}/>

                {/* Board content */}
                <div style={{ position:"relative",zIndex:2,height:"100%",display:"flex",flexDirection:"column" }}>
                  {/* Board header */}
                  <div style={{ padding:"14px 18px 10px",display:"flex",alignItems:"center",justifyContent:"space-between",flexShrink:0 }}>
                    <span style={{ color:"white",fontWeight:700,fontSize:15 }}>My Trello Board</span>
                    <div style={{ display:"flex",gap:8,alignItems:"center" }}>
                      {[42,28,20].map((w,i)=>(
                        <div key={i} style={{ width:w,height:7,borderRadius:4,backgroundColor:"rgba(255,255,255,0.22)" }}/>
                      ))}
                      <div style={{ width:24,height:24,borderRadius:6,backgroundColor:"rgba(255,255,255,0.18)",display:"flex",alignItems:"center",justifyContent:"center" }}>
                        <span style={{ color:"rgba(255,255,255,0.65)",fontSize:13 }}>⋯</span>
                      </div>
                    </div>
                  </div>

                  {/* 3 columns */}
                  <div style={{ display:"flex",gap:12,padding:"0 14px 14px",flex:1 }}>
                    {["Today","This week","Later"].map((col)=>(
                      <div key={col} style={{ flex:1,backgroundColor:"hsl(215,18%,20%)",borderRadius:12,padding:"12px 10px",display:"flex",flexDirection:"column" }}>
                        <div style={{ display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:10 }}>
                          <span style={{ color:"white",fontSize:13,fontWeight:600 }}>{col}</span>
                          <MoreHorizontal size={14} style={{ color:"rgba(255,255,255,0.35)" }}/>
                        </div>
                        <div style={{ display:"flex",alignItems:"center",gap:4,marginTop:"auto" }}>
                          <Plus size={12} style={{ color:"rgba(255,255,255,0.35)" }}/>
                          <div style={{ flex:1,height:6,borderRadius:3,backgroundColor:"rgba(255,255,255,0.18)" }}/>
                          <div style={{ width:15,height:15,borderRadius:"50%",backgroundColor:"rgba(255,255,255,0.18)" }}/>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Taco + bubble — bottom-center of board, pops in */}
                <div style={{
                  position:"absolute",
                  bottom:16, left:"50%", transform:`translateX(-50%) ${tacoS5In?"scale(1) translateY(0)":"scale(0.7) translateY(22px)"}`,
                  display:"flex", alignItems:"center", gap:14,
                  zIndex:10,
                  opacity: tacoS5In ? 1 : 0,
                  transition:"opacity 0.5s cubic-bezier(0.34,1.56,0.64,1), transform 0.5s cubic-bezier(0.34,1.56,0.64,1)",
                }}>
                  <TacoMascot size={90} tongue/>
                  <div style={{
                    backgroundColor:"hsl(215,18%,22%)",
                    borderRadius:12,
                    padding:"11px 16px",
                    fontSize:13.5, fontWeight:500, color:"white",
                    lineHeight:1.5, boxShadow:"0 4px 20px rgba(0,0,0,0.4)",
                    position:"relative", whiteSpace:"nowrap",
                  }}>
                    Boards and lists are customizable!
                    {/* left tail */}
                    <div style={{ position:"absolute",top:"50%",left:-7,transform:"translateY(-50%)",width:0,height:0,borderTop:"7px solid transparent",borderBottom:"7px solid transparent",borderRight:"8px solid hsl(215,18%,22%)" }}/>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ════════════════════════════════════════════════════════
            STEP 6 — Stage 3B: "Let's start getting organized"
            Screenshot: trellowelcomestage3B
            Taco positioned ABOVE inbox (floating, overlapping top edge)
            Speech bubble to right of Taco
            Yellow arrow: starts from inbox right-edge, curves into Today drop zone
            Today column has a large gray drop zone rectangle
        ════════════════════════════════════════════════════════ */}
        {step === 6 && (
          <div style={{ display:"flex",flexDirection:"column",height:"calc(100vh - 62px)",overflow:"hidden" }}>
            {/* Title */}
            <div style={{ display:"flex",flexDirection:"column",alignItems:"center",padding:"4px 24px 16px",flexShrink:0 }}>
              <h2 style={{ fontSize:"clamp(17px,2.5vw,30px)",color:"rgba(255,255,255,0.9)",textAlign:"center",fontWeight:500 }}>
                Let&apos;s start getting organized
              </h2>
            </div>

            {/* Main layout — relative wrapper so SVG arrow can span both panels */}
            <div style={{ flex:1,position:"relative",display:"flex",overflow:"hidden" }}>

              {/* LEFT — Inbox panel (full height) */}
              <div style={{
                width:240, flexShrink:0, position:"relative",
                backgroundColor:"hsl(213,22%,15%)",
                borderRadius:"14px 0 0 0",
                padding:"18px 16px",
                display:"flex", flexDirection:"column",
                zIndex:2,
              }}>
                <div style={{ display:"flex",alignItems:"center",gap:9,marginBottom:16 }}>
                  <Inbox size={17} style={{ color:"rgba(255,255,255,0.52)" }}/>
                  <span style={{ color:"white",fontWeight:700,fontSize:14 }}>Inbox</span>
                </div>
                {/* firstCard card */}
                <div style={{ backgroundColor:"hsl(215,14%,24%)",borderRadius:9,padding:"10px 12px",marginBottom:8,cursor:"grab" }}>
                  <p style={{ color:"rgba(255,255,255,0.70)",fontSize:12.5,lineHeight:1.4 }}>{firstCard}</p>
                </div>
                {/* email card */}
                <div style={{ backgroundColor:"hsl(215,14%,24%)",borderRadius:9,padding:"10px 12px",marginBottom:8,cursor:"grab" }}>
                  <p style={{ color:"rgba(255,255,255,0.70)",fontSize:12.5,lineHeight:1.4 }}>See it, send it, save it for later</p>
                  <div style={{ display:"flex",gap:7,marginTop:7 }}>
                    <Mail size={12} style={{ color:"rgba(255,255,255,0.35)" }}/>
                    <AlignLeft size={12} style={{ color:"rgba(255,255,255,0.35)" }}/>
                  </div>
                </div>
              </div>

              {/* RIGHT — Board (full height pink/purple) */}
              <div style={{ flex:1, position:"relative" }}>
                {/* board gradient bg */}
                <div style={{
                  position:"absolute",inset:0,
                  background:"linear-gradient(140deg,hsl(295,58%,52%) 0%,hsl(278,52%,46%) 45%,hsl(325,58%,52%) 100%)",
                  borderRadius:"14px 14px 0 0",
                }}/>

                <div style={{ position:"relative",zIndex:2,height:"100%",display:"flex",flexDirection:"column" }}>
                  {/* Board header */}
                  <div style={{ padding:"14px 18px 10px",display:"flex",alignItems:"center",justifyContent:"space-between",flexShrink:0 }}>
                    <span style={{ color:"white",fontWeight:700,fontSize:15 }}>My Trello Board</span>
                    <div style={{ display:"flex",gap:8,alignItems:"center" }}>
                      {[42,28,20].map((w,i)=>(
                        <div key={i} style={{ width:w,height:7,borderRadius:4,backgroundColor:"rgba(255,255,255,0.22)" }}/>
                      ))}
                      <div style={{ width:24,height:24,borderRadius:6,backgroundColor:"rgba(255,255,255,0.18)",display:"flex",alignItems:"center",justifyContent:"center" }}>
                        <span style={{ color:"rgba(255,255,255,0.65)",fontSize:13 }}>⋯</span>
                      </div>
                    </div>
                  </div>

                  {/* Columns */}
                  <div style={{ display:"flex",gap:12,padding:"0 14px 14px",flex:1 }}>
                    {/* TODAY — has drop zone */}
                    <div style={{ flex:1,backgroundColor:"hsl(215,18%,20%)",borderRadius:12,padding:"12px 10px",display:"flex",flexDirection:"column" }}>
                      <div style={{ display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:10 }}>
                        <span style={{ color:"white",fontSize:13,fontWeight:600 }}>Today</span>
                        <MoreHorizontal size={14} style={{ color:"rgba(255,255,255,0.35)" }}/>
                      </div>
                      {/* Large drop zone rectangle — matches screenshot */}
                      <div style={{
                        flex:1,
                        border:"2px solid rgba(255,255,255,0.22)",
                        borderRadius:9,
                        backgroundColor:"rgba(255,255,255,0.05)",
                        marginBottom:10,
                        minHeight:120,
                      }}/>
                      <div style={{ display:"flex",alignItems:"center",gap:4 }}>
                        <Plus size={12} style={{ color:"rgba(255,255,255,0.35)" }}/>
                        <div style={{ flex:1,height:6,borderRadius:3,backgroundColor:"rgba(255,255,255,0.18)" }}/>
                        <div style={{ width:15,height:15,borderRadius:"50%",backgroundColor:"rgba(255,255,255,0.18)" }}/>
                      </div>
                    </div>

                    {/* THIS WEEK */}
                    <div style={{ flex:1,backgroundColor:"hsl(215,18%,20%)",borderRadius:12,padding:"12px 10px",display:"flex",flexDirection:"column" }}>
                      <div style={{ display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:10 }}>
                        <span style={{ color:"white",fontSize:13,fontWeight:600 }}>This week</span>
                        <MoreHorizontal size={14} style={{ color:"rgba(255,255,255,0.35)" }}/>
                      </div>
                      <div style={{ display:"flex",alignItems:"center",gap:4,marginTop:"auto" }}>
                        <Plus size={12} style={{ color:"rgba(255,255,255,0.35)" }}/>
                        <div style={{ flex:1,height:6,borderRadius:3,backgroundColor:"rgba(255,255,255,0.18)" }}/>
                        <div style={{ width:15,height:15,borderRadius:"50%",backgroundColor:"rgba(255,255,255,0.18)" }}/>
                      </div>
                    </div>

                    {/* LATER */}
                    <div style={{ flex:1,backgroundColor:"hsl(215,18%,20%)",borderRadius:12,padding:"12px 10px",display:"flex",flexDirection:"column" }}>
                      <div style={{ display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:10 }}>
                        <span style={{ color:"white",fontSize:13,fontWeight:600 }}>Later</span>
                        <MoreHorizontal size={14} style={{ color:"rgba(255,255,255,0.35)" }}/>
                      </div>
                      <div style={{ display:"flex",alignItems:"center",gap:4,marginTop:"auto" }}>
                        <Plus size={12} style={{ color:"rgba(255,255,255,0.35)" }}/>
                        <div style={{ flex:1,height:6,borderRadius:3,backgroundColor:"rgba(255,255,255,0.18)" }}/>
                        <div style={{ width:15,height:15,borderRadius:"50%",backgroundColor:"rgba(255,255,255,0.18)" }}/>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* ── YELLOW ARROW ── spans across full width (inbox right → Today drop zone) */}
              {arrowS6In && (
                <svg
                  style={{ position:"absolute",top:0,left:0,width:"100%",height:"100%",pointerEvents:"none",zIndex:30 }}
                  viewBox="0 0 1000 460"
                  preserveAspectRatio="none"
                >
                  {/* Curved path: starts left of inbox area, sweeps right then turns DOWN into Today column */}
                  <path
                    className="yarrow"
                    d="M120 370 C220 360, 300 280, 360 230 C400 195, 430 175, 450 190 C465 200, 468 240, 455 280"
                    stroke="#f59e0b"
                    strokeWidth="5"
                    fill="none"
                    strokeLinecap="round"
                  />
                  {/* Arrow head pointing DOWN into Today column */}
                  <path
                    className="yarrow2"
                    d="M441 272 L455 286 L469 272"
                    stroke="#f59e0b"
                    strokeWidth="5"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              )}

              {/* ── TACO — floats ABOVE the inbox panel top edge, with bubble to right ── */}
              <div style={{
                position:"absolute",
                top: -10,
                left: 140,
                zIndex:25,
                display:"flex",
                alignItems:"flex-start",
                gap:12,
                opacity: tacoS6In ? 1 : 0,
                transform: tacoS6In
                  ? "translateY(0) scale(1)"
                  : "translateY(-20px) scale(0.82)",
                transition:"opacity 0.55s cubic-bezier(0.34,1.4,0.64,1), transform 0.55s cubic-bezier(0.34,1.4,0.64,1)",
              }}>
                <TacoMascot size={108} tongue/>
                <div style={{
                  marginTop:12,
                  backgroundColor:"hsl(215,18%,22%)",
                  borderRadius:12,
                  padding:"11px 16px",
                  fontSize:13.5, fontWeight:500, color:"white",
                  lineHeight:1.5, boxShadow:"0 4px 20px rgba(0,0,0,0.4)",
                  position:"relative", whiteSpace:"nowrap",
                }}>
                  Drag a card from your Inbox<br/>to a list on the board
                  <div style={{ position:"absolute",top:"50%",left:-7,transform:"translateY(-50%)",width:0,height:0,borderTop:"7px solid transparent",borderBottom:"7px solid transparent",borderRight:"8px solid hsl(215,18%,22%)" }}/>
                </div>
              </div>

            </div>
          </div>
        )}

        {/* ════════════════════════════════════════════════════════
            STEP 7 — Stage 4A: "You finished your first to-do, mark it complete!"
            Screenshot: trellowelcomestage4A
            Inbox left: only "See it, send it..." card
            Board Today: "Start using Trello" with ○ circle + white border
            Taco in purple circle bottom-center of board, "Check it off!" speech bubble
            Yellow arrow curves from Taco area UP to Today card
        ════════════════════════════════════════════════════════ */}
        {step === 7 && (
          <div style={{
            display:"flex",flexDirection:"column",
            height:"calc(100vh - 62px)",overflow:"hidden",
            opacity:s7In?1:0, transform:s7In?"translateY(0)":"translateY(14px)",
            transition:"opacity 0.55s ease, transform 0.55s ease",
          }}>
            {/* Title */}
            <div style={{ display:"flex",flexDirection:"column",alignItems:"center",padding:"4px 24px 20px",flexShrink:0 }}>
              <h2 style={{ fontSize:"clamp(16px,2.4vw,28px)",color:"rgba(255,255,255,0.9)",textAlign:"center",fontWeight:500,lineHeight:1.3 }}>
                You finished your first to-do, mark it complete!
              </h2>
            </div>

            {/* Two-panel */}
            <div style={{ flex:1,display:"flex",overflow:"hidden",position:"relative" }}>

              {/* LEFT — Inbox (only email card) */}
              <div style={{
                width:240,flexShrink:0,
                backgroundColor:"hsl(213,22%,15%)",
                borderRadius:"14px 0 0 0",
                padding:"18px 16px",
                display:"flex",flexDirection:"column",
                zIndex:2,
              }}>
                <div style={{ display:"flex",alignItems:"center",gap:9,marginBottom:16 }}>
                  <Inbox size={17} style={{ color:"rgba(255,255,255,0.52)" }}/>
                  <span style={{ color:"white",fontWeight:700,fontSize:14 }}>Inbox</span>
                </div>
                <div style={{ backgroundColor:"hsl(215,14%,24%)",borderRadius:9,padding:"10px 12px" }}>
                  <p style={{ color:"rgba(255,255,255,0.70)",fontSize:12.5,lineHeight:1.4 }}>See it, send it, save it for later</p>
                  <div style={{ display:"flex",gap:7,marginTop:7 }}>
                    <Mail size={12} style={{ color:"rgba(255,255,255,0.35)" }}/>
                    <AlignLeft size={12} style={{ color:"rgba(255,255,255,0.35)" }}/>
                  </div>
                </div>
              </div>

              {/* RIGHT — Board */}
              <div style={{ flex:1,position:"relative" }}>
                {/* board gradient bg */}
                <div style={{
                  position:"absolute",inset:0,
                  background:"linear-gradient(140deg,hsl(295,58%,52%) 0%,hsl(278,52%,46%) 45%,hsl(325,58%,52%) 100%)",
                  borderRadius:"14px 14px 0 0",
                }}/>

                <div style={{ position:"relative",zIndex:2,height:"100%",display:"flex",flexDirection:"column" }}>
                  {/* Board header */}
                  <div style={{ padding:"14px 18px 10px",display:"flex",alignItems:"center",justifyContent:"space-between",flexShrink:0 }}>
                    <span style={{ color:"white",fontWeight:700,fontSize:15 }}>My Trello Board</span>
                    <div style={{ display:"flex",gap:8,alignItems:"center" }}>
                      {[42,28,20].map((w,i)=>(
                        <div key={i} style={{ width:w,height:7,borderRadius:4,backgroundColor:"rgba(255,255,255,0.22)" }}/>
                      ))}
                      <div style={{ width:24,height:24,borderRadius:6,backgroundColor:"rgba(255,255,255,0.18)",display:"flex",alignItems:"center",justifyContent:"center" }}>
                        <span style={{ color:"rgba(255,255,255,0.65)",fontSize:13 }}>⋯</span>
                      </div>
                    </div>
                  </div>

                  {/* Columns */}
                  <div style={{ display:"flex",gap:12,padding:"0 14px 14px",flex:1,alignItems:"flex-start" }}>
                    {/* TODAY — contains the checkable card */}
                    <div style={{ flex:1,backgroundColor:"hsl(215,18%,20%)",borderRadius:12,padding:"12px 10px" }}>
                      <div style={{ display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:10 }}>
                        <span style={{ color:"white",fontSize:13,fontWeight:600 }}>Today</span>
                        <MoreHorizontal size={14} style={{ color:"rgba(255,255,255,0.35)" }}/>
                      </div>

                      {/* The checkable card — white border outline like in screenshot */}
                      <div
                        onClick={()=>{ if(!checked){ setChecked(true); setTimeout(()=>next(),700); } }}
                        style={{
                          backgroundColor:"hsl(215,14%,26%)",
                          borderRadius:9,
                          padding:"11px 12px",
                          marginBottom:10,
                          border:"2px solid rgba(255,255,255,0.5)",
                          display:"flex",
                          alignItems:"center",
                          gap:10,
                          cursor:"pointer",
                          transition:"border-color 0.2s ease",
                        }}
                      >
                        {checked
                          ? <CheckCircle2 size={17} style={{ color:"#22c55e",flexShrink:0 }}/>
                          : <Circle size={17} style={{ color:"rgba(255,255,255,0.5)",flexShrink:0 }}/>
                        }
                        <span style={{
                          color:checked?"rgba(255,255,255,0.35)":"rgba(255,255,255,0.82)",
                          fontSize:12.5,
                          textDecoration:checked?"line-through":"none",
                          transition:"all 0.25s ease",
                        }}>
                          {firstCard}
                        </span>
                      </div>

                      <div style={{ display:"flex",alignItems:"center",gap:4 }}>
                        <Plus size={12} style={{ color:"rgba(255,255,255,0.35)" }}/>
                        <div style={{ flex:1,height:6,borderRadius:3,backgroundColor:"rgba(255,255,255,0.18)" }}/>
                        <div style={{ width:15,height:15,borderRadius:"50%",backgroundColor:"rgba(255,255,255,0.18)" }}/>
                      </div>
                    </div>

                    {/* THIS WEEK */}
                    <div style={{ flex:1,backgroundColor:"hsl(215,18%,20%)",borderRadius:12,padding:"12px 10px" }}>
                      <div style={{ display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:10 }}>
                        <span style={{ color:"white",fontSize:13,fontWeight:600 }}>This week</span>
                        <MoreHorizontal size={14} style={{ color:"rgba(255,255,255,0.35)" }}/>
                      </div>
                      <div style={{ display:"flex",alignItems:"center",gap:4,marginTop:4 }}>
                        <Plus size={12} style={{ color:"rgba(255,255,255,0.35)" }}/>
                        <div style={{ flex:1,height:6,borderRadius:3,backgroundColor:"rgba(255,255,255,0.18)" }}/>
                        <div style={{ width:15,height:15,borderRadius:"50%",backgroundColor:"rgba(255,255,255,0.18)" }}/>
                      </div>
                    </div>

                    {/* LATER */}
                    <div style={{ flex:1,backgroundColor:"hsl(215,18%,20%)",borderRadius:12,padding:"12px 10px" }}>
                      <div style={{ display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:10 }}>
                        <span style={{ color:"white",fontSize:13,fontWeight:600 }}>Later</span>
                        <MoreHorizontal size={14} style={{ color:"rgba(255,255,255,0.35)" }}/>
                      </div>
                      <div style={{ display:"flex",alignItems:"center",gap:4,marginTop:4 }}>
                        <Plus size={12} style={{ color:"rgba(255,255,255,0.35)" }}/>
                        <div style={{ flex:1,height:6,borderRadius:3,backgroundColor:"rgba(255,255,255,0.18)" }}/>
                        <div style={{ width:15,height:15,borderRadius:"50%",backgroundColor:"rgba(255,255,255,0.18)" }}/>
                      </div>
                    </div>
                  </div>
                </div>

                {/* ── YELLOW ARROW: curves from bottom-center up to Today card ── */}
                {arrowS7In && (
                  <svg
                    style={{ position:"absolute",top:0,left:0,width:"100%",height:"100%",pointerEvents:"none",zIndex:12 }}
                    viewBox="0 0 1000 500"
                    preserveAspectRatio="none"
                  >
                    {/* Path starts near Taco (bottom-center ~x:380,y:460) curves up-left to Today card (~x:180,y:95) */}
                    <path
                      className="yarrow"
                      d="M370 455 C340 380, 270 300, 210 200 C185 155, 180 120, 185 95"
                      stroke="#f59e0b"
                      strokeWidth="5"
                      fill="none"
                      strokeLinecap="round"
                    />
                    {/* Arrowhead pointing UP */}
                    <path
                      className="yarrow2"
                      d="M172 108 L185 93 L198 108"
                      stroke="#f59e0b"
                      strokeWidth="5"
                      fill="none"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                )}

                {/* ── TACO + "Check it off!" bubble — bottom-center of board ── */}
                <div style={{
                  position:"absolute",
                  bottom:12,
                  left:"55%",
                  transform:`translateX(-50%)`,
                  display:"flex",
                  alignItems:"center",
                  gap:12,
                  zIndex:14,
                  opacity: tacoS7In ? 1 : 0,
                  transition:"opacity 0.5s cubic-bezier(0.34,1.56,0.64,1)",
                }}>
                  <TacoMascot size={82}/>
                  <div style={{
                    backgroundColor:"hsl(213,22%,19%)",
                    borderRadius:10,
                    padding:"10px 18px",
                    fontSize:14,
                    fontWeight:700,
                    color:"white",
                    boxShadow:"0 4px 16px rgba(0,0,0,0.4)",
                    whiteSpace:"nowrap",
                  }}>
                    {checked ? "🎉 Great job!" : "Check it off!"}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}