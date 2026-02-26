"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  ChevronLeft,
  ChevronRight,
  X,
  Inbox,
  Plus,
  MoreHorizontal,
  CheckCircle2,
  Circle,
} from "lucide-react";

/* ─────────────────────────────────────────
   CONSTANTS
───────────────────────────────────────── */
const TOTAL_STEPS = 4;

/* ─────────────────────────────────────────
   TACO MASCOT — husky dog in purple circle
───────────────────────────────────────── */
function TacoMascot({ className = "" }: { className?: string }) {
  return (
    <div
      className={`relative rounded-full overflow-hidden flex items-center justify-center ${className}`}
      style={{ background: "hsl(272,55%,42%)" }}
    >
      <svg
        viewBox="0 0 120 120"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full"
      >
        {/* Body */}
        <ellipse cx="60" cy="98" rx="30" ry="22" fill="hsl(210,10%,68%)" />
        {/* Chest white */}
        <ellipse cx="60" cy="94" rx="14" ry="16" fill="hsl(0,0%,93%)" />
        {/* Head */}
        <ellipse cx="60" cy="62" rx="29" ry="27" fill="hsl(210,10%,72%)" />
        {/* Ears outer */}
        <polygon points="35,46 27,22 50,40" fill="hsl(210,10%,68%)" />
        <polygon points="85,46 93,22 70,40" fill="hsl(210,10%,68%)" />
        {/* Ears inner */}
        <polygon points="37,44 31,27 50,40" fill="hsl(340,38%,68%)" />
        <polygon points="83,44 89,27 70,40" fill="hsl(340,38%,68%)" />
        {/* Forehead gray patch */}
        <ellipse cx="60" cy="55" rx="19" ry="15" fill="hsl(210,8%,60%)" />
        {/* Eyes white */}
        <ellipse cx="48" cy="62" rx="7.5" ry="8" fill="white" />
        <ellipse cx="72" cy="62" rx="7.5" ry="8" fill="white" />
        {/* Iris */}
        <circle cx="49" cy="63" r="5" fill="hsl(208,80%,42%)" />
        <circle cx="73" cy="63" r="5" fill="hsl(208,80%,42%)" />
        {/* Pupil */}
        <circle cx="49" cy="63" r="2.8" fill="hsl(213,28%,12%)" />
        <circle cx="73" cy="63" r="2.8" fill="hsl(213,28%,12%)" />
        {/* Shine */}
        <circle cx="50.5" cy="61.5" r="1.3" fill="white" />
        <circle cx="74.5" cy="61.5" r="1.3" fill="white" />
        {/* Muzzle */}
        <ellipse cx="60" cy="73" rx="11" ry="7.5" fill="hsl(0,0%,92%)" />
        {/* Nose */}
        <ellipse cx="60" cy="71" rx="5.5" ry="3.5" fill="hsl(213,22%,20%)" />
        {/* Mouth */}
        <path
          d="M54 76 Q60 81 66 76"
          stroke="hsl(213,22%,20%)"
          strokeWidth="1.5"
          fill="none"
          strokeLinecap="round"
        />
        {/* Cheek blush */}
        <ellipse cx="40" cy="72" rx="5.5" ry="3" fill="hsl(340,50%,70%)" opacity="0.45" />
        <ellipse cx="80" cy="72" rx="5.5" ry="3" fill="hsl(340,50%,70%)" opacity="0.45" />
      </svg>
    </div>
  );
}

/* ─────────────────────────────────────────
   BOARD PREVIEW (stages 2-3)
───────────────────────────────────────── */
function BoardPreview({
  allTodos,
  placedCards,
}: {
  allTodos: string[];
  placedCards: { today: string[]; thisWeek: string[]; later: string[] };
}) {
  return (
    <div
      className="flex-1 rounded-2xl overflow-hidden shadow-2xl"
      style={{
        background:
          "linear-gradient(135deg, hsl(340,65%,52%) 0%, hsl(270,58%,48%) 50%, hsl(28,88%,52%) 100%)",
      }}
    >
      <div className="p-4">
        <p className="text-white font-bold text-sm mb-4 opacity-90">My Trello Board</p>
        <div className="flex gap-3">
          {(["Today", "This week", "Later"] as const).map((col) => {
            const key =
              col === "Today" ? "today" : col === "This week" ? "thisWeek" : "later";
            return (
              <div
                key={col}
                className="flex-1 rounded-xl p-3"
                style={{ backgroundColor: "hsl(215,18%,20%)" }}
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-white text-xs font-semibold">{col}</span>
                  <MoreHorizontal className="w-3.5 h-3.5 text-white/35" />
                </div>
                {placedCards[key as keyof typeof placedCards].map((t, i) => (
                  <div
                    key={i}
                    className="rounded-lg p-2.5 text-white text-xs mb-2 shadow"
                    style={{ backgroundColor: "hsl(215,14%,30%)" }}
                  >
                    {t}
                  </div>
                ))}
                {key === "today" && placedCards.today.length === 0 && allTodos.length > 0 && (
                  <div
                    className="border-2 border-dashed rounded-lg h-14 flex items-center justify-center mb-2"
                    style={{
                      borderColor: "hsl(212,85%,55%)",
                      backgroundColor: "hsla(212,85%,55%,0.07)",
                    }}
                  >
                    <span className="text-white/35 text-xs">Drop here</span>
                  </div>
                )}
                <button className="flex items-center gap-1.5 text-white/35 hover:text-white/65 text-xs mt-1 w-full p-1.5 rounded transition-colors">
                  <Plus className="w-3 h-3" />
                  <span>Add a card</span>
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────
   PROGRESS HEADER
───────────────────────────────────────── */
function OnboardingHeader({
  step,
  onPrev,
  onNext,
  onSkip,
}: {
  step: number;
  onPrev: () => void;
  onNext: () => void;
  onSkip: () => void;
}) {
  return (
    <header className="flex items-center justify-between px-6 py-4 relative z-10 flex-shrink-0">
      {/* Trello logo */}
      <div className="flex items-center gap-2">
        <div
          className="w-8 h-8 rounded-md flex items-center justify-center flex-shrink-0"
          style={{ backgroundColor: "hsl(212,100%,42%)" }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
            <rect x="3" y="3" width="8" height="18" rx="1.5" />
            <rect x="13" y="3" width="8" height="11" rx="1.5" />
          </svg>
        </div>
        <span className="text-white font-bold text-[17px] tracking-tight">Trello</span>
      </div>

      {/* Progress + arrows — absolutely centered */}
      <div className="flex items-center gap-3 absolute left-1/2 -translate-x-1/2">
        <button
          onClick={onPrev}
          disabled={step === 0}
          className="text-white/55 hover:text-white disabled:opacity-20 transition-colors p-0.5"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <div className="flex items-center gap-2">
          {Array.from({ length: TOTAL_STEPS }).map((_, i) => (
            <div
              key={i}
              className="h-2 rounded-full transition-all duration-500 ease-out"
              style={{
                width: i === step ? "42px" : "28px",
                backgroundColor:
                  i === step
                    ? "white"
                    : i < step
                    ? "rgba(255,255,255,0.52)"
                    : "rgba(255,255,255,0.22)",
              }}
            />
          ))}
        </div>
        <button
          onClick={onNext}
          className="text-white/55 hover:text-white transition-colors p-0.5"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      {/* Close */}
      <button
        onClick={onSkip}
        className="text-white/55 hover:text-white transition-colors p-1 rounded hover:bg-white/10"
      >
        <X className="w-5 h-5" />
      </button>
    </header>
  );
}

/* ─────────────────────────────────────────
   MAIN WELCOME PAGE
───────────────────────────────────────── */
export default function WelcomePage() {
  const router = useRouter();
  const [step, setStep] = useState(0);

  /* ── Step 0 typewriter state ── */
  const HEADING_NORMAL = "Welcome to Trello! Meet your ";
  const HEADING_BOLD = "Inbox";
  const fullHeading = HEADING_NORMAL + HEADING_BOLD;
  const [typedChars, setTypedChars] = useState(0);
  const [headingDone, setHeadingDone] = useState(false);
  const [subVisible, setSubVisible] = useState(false);
  const [cardVisible, setCardVisible] = useState(false);
  const [inputTyped, setInputTyped] = useState(0);
  const INPUT_DEMO = "Start using Trello";

  /* ── Step 1 state ── */
  const [todoText, setTodoText] = useState("");
  const [todos, setTodos] = useState<string[]>([]);
  const [tacoVisible, setTacoVisible] = useState(false);
  const [arrowVisible, setArrowVisible] = useState(false);
  const todoInputRef = useRef<HTMLInputElement>(null);

  /* ── Step 2 state ── */
  const [placedCards] = useState({
    today: [] as string[],
    thisWeek: [] as string[],
    later: [] as string[],
  });

  /* ── Step 3 state ── */
  const [checked, setChecked] = useState(false);

  /* Typewriter — stage 0 */
  useEffect(() => {
    if (step !== 0) return;
    setTypedChars(0);
    setHeadingDone(false);
    setSubVisible(false);
    setCardVisible(false);
    setInputTyped(0);

    let count = 0;
    const interval = setInterval(() => {
      count++;
      setTypedChars(count);
      if (count >= fullHeading.length) {
        clearInterval(interval);
        setTimeout(() => setHeadingDone(true), 80);
      }
    }, 38);
    return () => clearInterval(interval);
  }, [step]); // eslint-disable-line

  useEffect(() => {
    if (!headingDone || step !== 0) return;
    const t1 = setTimeout(() => setSubVisible(true), 180);
    const t2 = setTimeout(() => setCardVisible(true), 500);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [headingDone, step]);

  /* Animate demo text in inbox */
  useEffect(() => {
    if (!cardVisible || step !== 0) return;
    let i = 0;
    const interval = setInterval(() => {
      i++;
      setInputTyped(i);
      if (i >= INPUT_DEMO.length) clearInterval(interval);
    }, 62);
    return () => clearInterval(interval);
  }, [cardVisible, step]);

  /* Taco pop-in — stage 1 */
  useEffect(() => {
    if (step !== 1) return;
    setTacoVisible(false);
    setArrowVisible(false);
    const t1 = setTimeout(() => setTacoVisible(true), 160);
    const t2 = setTimeout(() => setArrowVisible(true), 580);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [step]);

  const next = useCallback(() => {
    if (step < TOTAL_STEPS - 1) setStep((s) => s + 1);
    else router.push("/board");
  }, [step, router]);

  const prev = useCallback(() => {
    if (step > 0) setStep((s) => s - 1);
  }, [step]);

  const addTodo = () => {
    const val = todoText.trim();
    if (val) {
      setTodos((p) => [...p, val]);
      setTodoText("");
      todoInputRef.current?.focus();
    }
  };

  /* Shared BG */
  const bgStyle = {
    background:
      "linear-gradient(175deg, hsl(212,65%,35%) 0%, hsl(214,70%,28%) 55%, hsl(215,68%,22%) 100%)",
    minHeight: "100vh",
  };

  /* ══════════════════════════════════════
     RENDER
  ══════════════════════════════════════ */
  return (
    <div className="flex flex-col" style={bgStyle}>
      <OnboardingHeader step={step} onPrev={prev} onNext={next} onSkip={() => router.push("/board")} />

      {/* ─── STEP 0: Welcome / Meet Inbox ─── */}
      {step === 0 && (() => {
        const visible = fullHeading.slice(0, typedChars);
        const normalPart = visible.slice(0, Math.min(typedChars, HEADING_NORMAL.length));
        const boldPart = visible.slice(HEADING_NORMAL.length);
        const showCursor = typedChars < fullHeading.length;

        return (
          <div className="flex flex-col items-center pt-16 pb-12 px-4" style={{ minHeight: "calc(100vh - 62px)" }}>
            {/* Heading */}
            <h1
              className="text-center mb-5 leading-snug"
              style={{
                fontSize: "clamp(22px,3.8vw,36px)",
                color: "rgba(255,255,255,0.88)",
                minHeight: "2em",
              }}
            >
              {normalPart}
              <strong className="font-black text-white">{boldPart}</strong>
              {showCursor && (
                <span
                  className="inline-block w-0.5 h-7 ml-0.5 animate-pulse"
                  style={{
                    backgroundColor: "white",
                    verticalAlign: "middle",
                    display: "inline-block",
                  }}
                />
              )}
            </h1>

            {/* Subtitle */}
            <p
              className="text-center max-w-[520px] mb-11 transition-all duration-700"
              style={{
                color: "rgba(255,255,255,0.78)",
                fontSize: "16.5px",
                lineHeight: "1.6",
                opacity: subVisible ? 1 : 0,
                transform: subVisible ? "translateY(0)" : "translateY(8px)",
              }}
            >
              This is a space for you to{" "}
              <strong className="text-white">add to-dos</strong> or{" "}
              <strong className="text-white">import them</strong> from other apps.
            </p>

            {/* Inbox card */}
            <div
              className="w-full max-w-[430px] transition-all duration-700"
              style={{
                opacity: cardVisible ? 1 : 0,
                transform: cardVisible ? "translateY(0) scale(1)" : "translateY(18px) scale(0.97)",
              }}
            >
              <div
                className="rounded-2xl shadow-2xl overflow-hidden"
                style={{ backgroundColor: "hsl(215,18%,20%)" }}
              >
                {/* Header row */}
                <div className="flex items-center gap-2.5 px-5 pt-5 pb-3">
                  <Inbox className="w-5 h-5" style={{ color: "rgba(255,255,255,0.55)" }} />
                  <span className="text-white font-semibold text-[15px]">Inbox</span>
                </div>

                {/* Animated input card */}
                <div className="px-4 pb-4">
                  <div
                    className="rounded-xl p-4 border-2"
                    style={{
                      backgroundColor: "hsl(215,16%,25%)",
                      borderColor: "hsl(212,85%,52%)",
                      boxShadow: "0 0 0 3px hsla(212,85%,52%,0.2)",
                    }}
                  >
                    <p
                      className="text-[15px] min-h-[28px] mb-4"
                      style={{ color: "rgba(255,255,255,0.86)" }}
                    >
                      {INPUT_DEMO.slice(0, inputTyped)}
                      {inputTyped < INPUT_DEMO.length && (
                        <span
                          className="inline-block w-0.5 h-5 ml-px animate-pulse"
                          style={{ backgroundColor: "white", verticalAlign: "middle" }}
                        />
                      )}
                    </p>
                    <div className="flex justify-end">
                      <button
                        className="px-4 py-1.5 rounded-md text-white text-sm font-semibold"
                        style={{ backgroundColor: "hsl(212,85%,52%)" }}
                      >
                        Add card
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      })()}

      {/* ─── STEP 1: Add a to-do to Inbox ─── */}
      {step === 1 && (
        <div
          className="flex flex-col items-center px-6 pb-12"
          style={{
            paddingTop: "clamp(32px, 5vh, 60px)",
            minHeight: "calc(100vh - 62px)",
          }}
        >
          {/* Heading */}
          <h2
            className="text-center mb-4"
            style={{
              fontSize: "clamp(22px,3.5vw,34px)",
              color: "rgba(255,255,255,0.85)",
              lineHeight: 1.3,
            }}
          >
            <strong className="text-white font-black">Add a to-do</strong> to Inbox
          </h2>
          <p
            className="text-center max-w-xl mb-10"
            style={{ fontSize: "16px", color: "rgba(255,255,255,0.72)", lineHeight: "1.6" }}
          >
            Let&apos;s get started by adding a few to-dos as{" "}
            <strong className="text-white">cards</strong> to your{" "}
            <strong className="text-white">Inbox</strong>.
          </p>

          {/* Taco + Inbox layout */}
          <div className="relative flex items-start justify-center gap-8 w-full max-w-2xl">

            {/* ── Taco column ── */}
            <div className="flex flex-col items-center relative flex-shrink-0" style={{ width: "160px" }}>
              {/* Speech bubble */}
              <div
                className="relative px-4 py-3 rounded-xl text-[13px] font-medium shadow-lg mb-4 transition-all duration-500"
                style={{
                  backgroundColor: "hsl(215,18%,24%)",
                  color: "rgba(255,255,255,0.88)",
                  lineHeight: 1.55,
                  opacity: tacoVisible ? 1 : 0,
                  transform: tacoVisible ? "translateY(0) scale(1)" : "translateY(-10px) scale(0.9)",
                  maxWidth: "160px",
                }}
              >
                Hey, I&apos;m Taco!
                <br />
                Add some to-dos!
                {/* Tail */}
                <div
                  className="absolute"
                  style={{
                    bottom: "-7px",
                    left: "18px",
                    width: 0,
                    height: 0,
                    borderLeft: "7px solid transparent",
                    borderRight: "7px solid transparent",
                    borderTop: "8px solid hsl(215,18%,24%)",
                  }}
                />
              </div>

              {/* Taco avatar */}
              <div
                className="transition-all duration-500"
                style={{
                  opacity: tacoVisible ? 1 : 0,
                  transform: tacoVisible ? "scale(1) rotate(0deg)" : "scale(0.55) rotate(-15deg)",
                }}
              >
                <TacoMascot className="w-28 h-28 shadow-2xl" />
              </div>

              {/* Curvy arrow */}
              <div
                className="absolute transition-all duration-400"
                style={{
                  right: "-55px",
                  bottom: "10px",
                  opacity: arrowVisible ? 1 : 0,
                  transform: arrowVisible ? "scale(1)" : "scale(0.7)",
                }}
              >
                <svg width="85" height="65" viewBox="0 0 85 65" fill="none">
                  <path
                    d="M6 52 C16 14, 52 6, 78 30"
                    stroke="hsl(213,25%,18%)"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    fill="none"
                  />
                  <path
                    d="M72 24 L78 30 L82 22"
                    stroke="hsl(213,25%,18%)"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    fill="none"
                  />
                </svg>
              </div>
            </div>

            {/* ── Inbox card ── */}
            <div
              className="flex-1 rounded-2xl overflow-hidden shadow-2xl"
              style={{
                backgroundColor: "hsl(215,18%,20%)",
                maxWidth: "390px",
              }}
            >
              {/* Card header */}
              <div className="flex items-center gap-2.5 px-5 pt-5 pb-3">
                <Inbox className="w-5 h-5" style={{ color: "rgba(255,255,255,0.55)" }} />
                <span className="text-white font-semibold text-[15px]">Inbox</span>
              </div>

              <div className="px-4 pb-4">
                {/* Text input area */}
                <div
                  className="rounded-xl p-4 mb-3 border-2 transition-shadow duration-200"
                  style={{
                    backgroundColor: "hsl(215,16%,25%)",
                    borderColor: "hsl(212,85%,52%)",
                    boxShadow: "0 0 0 3px hsla(212,85%,52%,0.18)",
                  }}
                >
                  <input
                    ref={todoInputRef}
                    value={todoText}
                    onChange={(e) => setTodoText(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && addTodo()}
                    placeholder="What's on your to-do list?"
                    className="w-full bg-transparent text-white text-sm outline-none mb-4 min-h-[28px]"
                    style={{ caretColor: "white" }}
                    autoFocus
                  />
                  <div className="flex justify-end">
                    <button
                      onClick={addTodo}
                      className="px-4 py-1.5 rounded-md text-white text-sm font-semibold transition-opacity hover:opacity-85"
                      style={{ backgroundColor: "hsl(212,85%,52%)" }}
                    >
                      Add card
                    </button>
                  </div>
                </div>

                {/* Added todos */}
                {todos.map((t, i) => (
                  <div
                    key={i}
                    className="rounded-lg px-3 py-2.5 text-sm mb-2 text-white/80"
                    style={{ backgroundColor: "hsl(215,14%,28%)" }}
                  >
                    {t}
                  </div>
                ))}

                {/* Default placeholder card */}
                <div
                  className="px-3 py-2.5 rounded-lg text-sm text-white/35"
                >
                  Start using Trello
                </div>
              </div>
            </div>
          </div>

          <button
            onClick={next}
            className="mt-8 text-white/50 hover:text-white/80 text-sm transition-colors underline underline-offset-2"
          >
            Skip for now
          </button>
        </div>
      )}

      {/* ─── STEP 2: Here's your board ─── */}
      {step === 2 && (
        <div
          className="flex flex-col items-center px-6 pb-12"
          style={{ paddingTop: "clamp(32px,5vh,56px)", minHeight: "calc(100vh - 62px)" }}
        >
          <h2
            className="text-center mb-4"
            style={{ fontSize: "clamp(22px,3.2vw,32px)", color: "rgba(255,255,255,0.9)", lineHeight: 1.3 }}
          >
            Here&apos;s your first{" "}
            <strong className="text-white font-black">board</strong>
          </h2>
          <p
            className="text-center max-w-xl mb-4"
            style={{ fontSize: "15.5px", color: "rgba(255,255,255,0.68)", lineHeight: 1.6 }}
          >
            Organize your to-dos with <strong className="text-white">lists</strong>{" "}
            &amp; <strong className="text-white">cards</strong>. Start by moving a card
            from Inbox to &ldquo;Today&rdquo;.
          </p>

          <button
            onClick={next}
            className="mb-10 px-6 py-2 rounded-lg text-white text-sm font-semibold border transition-colors hover:bg-white/10"
            style={{ borderColor: "rgba(255,255,255,0.25)" }}
          >
            Continue
          </button>

          <div className="flex items-start gap-4 w-full max-w-3xl">
            {/* Mini inbox */}
            <div
              className="w-48 flex-shrink-0 rounded-xl shadow-xl"
              style={{ backgroundColor: "hsl(215,18%,20%)" }}
            >
              <div className="flex items-center gap-2 px-4 pt-4 pb-3">
                <Inbox className="w-4 h-4" style={{ color: "rgba(255,255,255,0.5)" }} />
                <span className="text-white font-semibold text-sm">Inbox</span>
              </div>
              <div className="px-3 pb-4">
                {(todos.length > 0 ? todos : ["Start using Trello"]).map((t, i) => (
                  <div
                    key={i}
                    draggable
                    className="rounded-lg px-3 py-2.5 text-xs text-white/78 mb-2 cursor-grab shadow transition-opacity hover:opacity-70"
                    style={{ backgroundColor: "hsl(215,14%,28%)" }}
                  >
                    {t}
                  </div>
                ))}
              </div>
            </div>

            <BoardPreview
              allTodos={todos.length > 0 ? todos : ["Start using Trello"]}
              placedCards={placedCards}
            />
          </div>
        </div>
      )}

      {/* ─── STEP 3: Mark complete ─── */}
      {step === 3 && (
        <div
          className="flex flex-col items-center px-6 pb-12"
          style={{ paddingTop: "clamp(40px,6vh,72px)", minHeight: "calc(100vh - 62px)" }}
        >
          <h2
            className="text-center mb-4"
            style={{ fontSize: "clamp(22px,3.2vw,32px)", color: "white", lineHeight: 1.3 }}
          >
            You finished your first to-do!
            <br />
            Mark it complete 🎉
          </h2>
          <p
            className="text-center max-w-lg mb-10"
            style={{ fontSize: "15.5px", color: "rgba(255,255,255,0.68)", lineHeight: 1.6 }}
          >
            Click the card below to check it off.
          </p>

          {/* Completable card */}
          <div
            className="w-full max-w-xs rounded-2xl overflow-hidden shadow-2xl mb-8"
            style={{ backgroundColor: "hsl(215,18%,20%)" }}
          >
            <div className="px-5 pt-4 pb-2">
              <span className="text-white font-semibold text-sm">Today</span>
            </div>
            <div className="px-4 pb-5">
              <button
                onClick={() => setChecked((c) => !c)}
                className="w-full flex items-start gap-3 rounded-xl p-3.5 text-left transition-all duration-200 hover:brightness-110"
                style={{ backgroundColor: "hsl(215,14%,28%)" }}
              >
                {checked ? (
                  <CheckCircle2 className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                ) : (
                  <Circle className="w-5 h-5 text-white/30 flex-shrink-0 mt-0.5" />
                )}
                <span
                  className="text-sm transition-all duration-300"
                  style={{
                    color: checked ? "rgba(255,255,255,0.38)" : "rgba(255,255,255,0.85)",
                    textDecoration: checked ? "line-through" : "none",
                  }}
                >
                  {todos[0] || "Start using Trello"}
                </span>
              </button>
            </div>
          </div>

          {/* Taco celebration */}
          <div className="flex items-center gap-4 mb-10">
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center shadow-2xl"
              style={{ background: "hsl(272,55%,42%)" }}
            >
              <span className="text-3xl">{checked ? "🎉" : "👇"}</span>
            </div>
            {checked && (
              <div
                className="px-4 py-2.5 rounded-xl text-sm font-medium text-white shadow-lg"
                style={{ backgroundColor: "hsl(215,18%,26%)" }}
              >
                Woohoo! You&apos;re on your way!
              </div>
            )}
          </div>

          <button
            onClick={() => router.push("/board")}
            className="px-10 py-3 rounded-lg text-blue-700 bg-white hover:bg-blue-50 font-bold shadow-xl transition-colors text-[15px]"
          >
            Go to my board →
          </button>
        </div>
      )}
    </div>
  );
}