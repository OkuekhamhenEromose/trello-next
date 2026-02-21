"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  ChevronLeft,
  ChevronRight,
  X,
  Briefcase,
  ListTodo,
  Users,
  TrendingUp,
  Inbox,
  CheckCircle2,
  Circle,
  Plus,
  MoreHorizontal,
} from "lucide-react";
import TrelloLogo from "@/components/TrelloLogo";

const TOTAL_STEPS = 7;

export default function WelcomePage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [selectedPurpose, setSelectedPurpose] = useState<string | null>(null);
  const [todoText, setTodoText] = useState("");
  const [todos, setTodos] = useState<string[]>([]);
  const [completedTodo, setCompletedTodo] = useState(false);
  const [draggedTodo, setDraggedTodo] = useState<string | null>(null);
  const [boardTodos, setBoardTodos] = useState<{
    today: string[];
    thisWeek: string[];
    later: string[];
  }>({
    today: [],
    thisWeek: [],
    later: [],
  });

  const next = () => {
    if (step < TOTAL_STEPS - 1) setStep(step + 1);
    else router.push("/board");
  };

  const prev = () => {
    if (step > 0) setStep(step - 1);
  };

  const addTodo = () => {
    if (todoText.trim()) {
      setTodos([...todos, todoText.trim()]);
      setTodoText("");
    }
  };

  const purposes = [
    {
      icon: <Briefcase className="w-5 h-5" />,
      label: "Organize ideas and work",
    },
    {
      icon: <ListTodo className="w-5 h-5" />,
      label: "Track personal tasks and to-dos",
    },
    { icon: <Users className="w-5 h-5" />, label: "Manage team projects" },
    {
      icon: <TrendingUp className="w-5 h-5" />,
      label: "Create and automate your team's workflows",
    },
  ];

  const ProgressBar = () => (
    <div className="flex items-center gap-2">
      <button
        onClick={prev}
        className="text-white/70 hover:text-white transition-colors p-1 rounded hover:bg-white/10"
        disabled={step === 0}
      >
        <ChevronLeft className="w-5 h-5" />
      </button>
      <div className="flex gap-2">
        {Array.from({ length: TOTAL_STEPS }).map((_, i) => (
          <div
            key={i}
            className={`h-2 rounded-full transition-all duration-300 ${
              i === step
                ? "bg-white w-10"
                : i < step
                  ? "bg-white/60 w-8"
                  : "bg-white/20 w-8"
            }`}
          />
        ))}
      </div>
      <button
        onClick={next}
        className="text-white/70 hover:text-white transition-colors p-1 rounded hover:bg-white/10"
      >
        <ChevronRight className="w-5 h-5" />
      </button>
    </div>
  );

  const OnboardingHeader = () => (
    <header className="px-6 py-4 flex items-center justify-between">
      <TrelloLogo size="md" />
      <ProgressBar />
      <button
        onClick={() => router.push("/board")}
        className="text-white/70 hover:text-white transition-colors p-1 rounded hover:bg-white/10"
      >
        <X className="w-6 h-6" />
      </button>
    </header>
  );

  const TacoMascot = ({ message, position = "left" }: { message?: string; position?: "left" | "bottom" }) => (
    <div className={`flex ${position === "left" ? "flex-col" : "flex-row"} items-center gap-3`}>
      {message && position === "left" && (
        <div className="bg-[#2c3e50] text-white text-sm px-4 py-2 rounded-lg shadow-lg max-w-xs">
          {message}
        </div>
      )}
      <div className="w-24 h-24 bg-gradient-to-br from-purple-500 to-purple-700 rounded-full flex items-center justify-center text-5xl shadow-xl">
        🐺
      </div>
      {message && position === "bottom" && (
        <div className="bg-[#2c3e50] text-white text-sm px-4 py-2 rounded-lg shadow-lg">
          {message}
        </div>
      )}
    </div>
  );

  const MiniBoard = () => (
    <div className="w-full max-w-sm bg-white rounded-lg shadow-2xl overflow-hidden">
      <div className="bg-gradient-to-r from-teal-400 to-teal-500 p-4">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-2 h-2 bg-white rounded-full" />
          <span className="text-white font-semibold text-sm">To-dos and Reading List</span>
        </div>
        <div className="flex gap-3 overflow-x-auto pb-2">
          <div className="min-w-[140px] bg-[#ebecf0] rounded-lg p-2">
            <h3 className="text-xs font-semibold text-gray-800 mb-2">Ideas</h3>
            <div className="bg-white rounded shadow-sm p-2 mb-2">
              <p className="text-xs text-gray-700">Provide feedback on...</p>
            </div>
            <div className="bg-white rounded shadow-sm p-2 mb-2">
              <p className="text-xs text-gray-700">Plan family vacation</p>
            </div>
            <div className="bg-white rounded shadow-sm p-2">
              <p className="text-xs text-gray-700">Q3 hiring</p>
            </div>
          </div>
          <div className="min-w-[140px] bg-[#ebecf0] rounded-lg p-2">
            <h3 className="text-xs font-semibold text-gray-800 mb-2">Work</h3>
            <div className="bg-white rounded shadow-sm p-2 mb-2">
              <p className="text-xs text-gray-700">Send presentation to...</p>
              <div className="mt-1 w-full h-1 bg-green-500 rounded" />
            </div>
            <div className="bg-white rounded shadow-sm p-2">
              <p className="text-xs text-gray-700">Prep for leadership...</p>
            </div>
          </div>
          <div className="min-w-[140px] bg-[#ebecf0] rounded-lg p-2">
            <h3 className="text-xs font-semibold text-gray-800 mb-2">Read later</h3>
            <div className="bg-white rounded shadow-sm p-2 mb-2">
              <div className="w-full h-12 bg-gradient-to-r from-blue-400 to-purple-400 rounded mb-1" />
              <p className="text-xs text-gray-700">Fuji Project Poster</p>
            </div>
            <div className="bg-white rounded shadow-sm p-2">
              <p className="text-xs text-gray-700">Retro notes + action...</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const BoardPreview = ({
    showDragTarget = false,
    showCompletedCard = false,
  }: {
    showDragTarget?: boolean;
    showCompletedCard?: boolean;
  }) => (
    <div className="flex gap-4 flex-1 max-w-6xl">
      <div className="w-72 shrink-0 bg-[#1f2937] rounded-xl p-4 shadow-xl">
        <div className="flex items-center gap-2 mb-4">
          <Inbox className="w-5 h-5 text-white/70" />
          <span className="text-white font-semibold">Inbox</span>
        </div>
        {todos.length > 0 &&
          !showCompletedCard &&
          todos.map((t, i) => (
            <div
              key={i}
              draggable
              onDragStart={() => setDraggedTodo(t)}
              className="bg-[#374151] text-white text-sm p-3 rounded-lg mb-2 cursor-grab hover:bg-[#4b5563] transition-colors shadow-md"
            >
              {t}
            </div>
          ))}
        {todos.length === 0 && (
          <div className="text-white/40 text-sm">Start using Trello</div>
        )}
      </div>

      <div
        className="flex-1 rounded-xl overflow-hidden shadow-2xl"
        style={{
          background: "linear-gradient(135deg, #ec4899 0%, #a855f7 50%, #f97316 100%)",
        }}
      >
        <div className="p-4">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-white font-semibold">My Trello Board</span>
          </div>
          <div className="flex gap-3 overflow-x-auto pb-2">
            {(["Today", "This week", "Later"] as const).map((list) => {
              const key =
                list === "Today"
                  ? "today"
                  : list === "This week"
                    ? "thisWeek"
                    : "later";
              return (
                <div
                  key={list}
                  className="min-w-[240px] bg-[#1f2937] rounded-xl p-3"
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={() => {
                    if (draggedTodo) {
                      const todoToAdd = draggedTodo;
                      setBoardTodos((prev) => ({
                        ...prev,
                        [key]: [...prev[key], todoToAdd],
                      }));
                      setTodos((prev) => prev.filter((t) => t !== draggedTodo));
                      setDraggedTodo(null);
                    }
                  }}
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-white text-sm font-semibold">
                      {list}
                    </span>
                    <MoreHorizontal className="w-4 h-4 text-white/50 hover:text-white cursor-pointer" />
                  </div>
                  {showDragTarget &&
                    list === "Today" &&
                    boardTodos.today.length === 0 && (
                      <div className="border-2 border-dashed border-blue-400 rounded-lg h-24 mb-2 bg-blue-400/10 flex items-center justify-center">
                        <span className="text-white/40 text-xs">Drop here</span>
                      </div>
                    )}
                  {showCompletedCard && list === "Today" && (
                    <div
                      className="bg-[#374151] rounded-lg p-3 flex items-start gap-2 text-sm cursor-pointer hover:bg-[#4b5563] transition-colors mb-2 shadow-md"
                      onClick={() => setCompletedTodo(!completedTodo)}
                    >
                      {completedTodo ? (
                        <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                      ) : (
                        <Circle className="w-5 h-5 text-white/50 flex-shrink-0 mt-0.5" />
                      )}
                      <span
                        className={`text-white ${completedTodo ? "line-through opacity-60" : ""}`}
                      >
                        {boardTodos.today[0] || "Start using Trello"}
                      </span>
                    </div>
                  )}
                  {boardTodos[key].map(
                    (t, i) =>
                      !showCompletedCard && (
                        <div
                          key={i}
                          className="bg-[#374151] rounded-lg p-3 text-white text-sm mb-2 shadow-md"
                        >
                          {t}
                        </div>
                      ),
                  )}
                  <button className="flex items-center gap-2 text-white/50 hover:text-white text-sm mt-2 w-full hover:bg-white/10 rounded-lg p-2 transition-colors">
                    <Plus className="w-4 h-4" />
                    <span>Add a card</span>
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );

  const renderStep = () => {
    switch (step) {
      case 0:
        return (
          <div className="flex-1 bg-gradient-to-b from-[#1a1f2e] to-[#2d1b3d] min-h-screen">
            <header className="bg-gradient-to-r from-[#0052cc] via-[#0065ff] to-[#579dff] px-6 py-4 shadow-lg">
              <TrelloLogo size="md" />
            </header>
            <div className="grid lg:grid-cols-2 gap-12 p-8 lg:p-16 items-center">
              <div className="space-y-8">
                <h1 className="text-4xl lg:text-5xl font-bold text-white leading-tight">
                  What brings you here today?
                </h1>
                <div className="space-y-3">
                  {purposes.map((p) => (
                    <button
                      key={p.label}
                      onClick={() => setSelectedPurpose(p.label)}
                      className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 text-left transition-all ${
                        selectedPurpose === p.label
                          ? "border-blue-500 bg-blue-500/20 shadow-lg shadow-blue-500/20"
                          : "border-white/20 bg-white/5 hover:border-white/40 hover:bg-white/10"
                      }`}
                    >
                      <span className="text-white/80">{p.icon}</span>
                      <span className="text-white font-medium">{p.label}</span>
                    </button>
                  ))}
                </div>
                <div className="flex items-center gap-4 pt-4">
                  <Button
                    onClick={next}
                    disabled={!selectedPurpose}
                    size="lg"
                    className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 rounded-lg shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Continue
                  </Button>
                  <button
                    onClick={() => router.push("/board")}
                    className="text-white/70 hover:text-white font-medium transition-colors"
                  >
                    Skip
                  </button>
                </div>
              </div>
              <div className="hidden lg:flex items-center justify-center">
                <MiniBoard />
              </div>
            </div>
          </div>
        );

      case 1:
        return (
          <div className="flex-1 flex flex-col bg-gradient-to-br from-[#0065ff] to-[#0052cc] min-h-screen">
            <OnboardingHeader />
            <div className="flex-1 flex flex-col items-center justify-center px-4 pb-16">
              <h2 className="text-4xl font-bold text-white mb-4 text-center">
                Add a <span className="font-black">to-do</span> to Inbox
              </h2>
              <p className="text-white/90 text-center max-w-2xl mb-12 text-lg">
                Let&apos;s get started by adding a few to-dos as{" "}
                <strong>cards</strong> to your <strong>Inbox</strong>.
              </p>
              <div className="flex items-end gap-6 w-full max-w-2xl">
                <div className="shrink-0 mb-6">
                  <TacoMascot message="Hey, I'm Taco! Add some to-dos!" position="left" />
                </div>
                <div className="flex-1 bg-[#1f2937] rounded-xl p-5 shadow-2xl">
                  <div className="flex items-center gap-2 mb-4">
                    <Inbox className="w-5 h-5 text-white/70" />
                    <span className="text-white font-semibold">Inbox</span>
                  </div>
                  <div className="border-2 border-dashed border-blue-400 rounded-lg p-4 mb-3 bg-blue-400/5">
                    <Input
                      value={todoText}
                      onChange={(e) => setTodoText(e.target.value)}
                      placeholder="What's on your to-do list?"
                      className="bg-transparent border-none text-white placeholder:text-white/50 p-0 h-10 focus-visible:ring-0 text-base"
                      onKeyDown={(e) => e.key === "Enter" && addTodo()}
                    />
                    <div className="flex justify-end mt-3">
                      <Button
                        onClick={addTodo}
                        size="sm"
                        className="bg-blue-600 hover:bg-blue-700 text-white border-0 shadow-md"
                      >
                        Add card
                      </Button>
                    </div>
                  </div>
                  {todos.map((t, i) => (
                    <div
                      key={i}
                      className="bg-[#374151] text-white text-sm p-3 rounded-lg mb-2 shadow-md"
                    >
                      {t}
                    </div>
                  ))}
                  <button
                    onClick={next}
                    className="w-full bg-[#374151] text-white/70 hover:text-white text-sm p-3 rounded-lg mt-2 hover:bg-[#4b5563] transition-colors"
                  >
                    Start using Trello
                  </button>
                </div>
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="flex-1 flex flex-col bg-gradient-to-br from-[#0065ff] to-[#0052cc] min-h-screen">
            <OnboardingHeader />
            <div className="flex-1 flex flex-col items-center justify-center px-4">
              <h2 className="text-4xl font-bold text-white mb-4 text-center max-w-3xl">
                Consolidate all your to-dos with Inbox
              </h2>
              <p className="text-white/90 text-center max-w-2xl mb-6 text-lg">
                Capture everything, anywhere from email, Trello&apos;s mobile
                app, Slack, Microsoft Teams, and Trello&apos;s Chrome extension.
              </p>
              <Button
                onClick={next}
                size="lg"
                variant="outline"
                className="text-white border-white/30 hover:bg-white/10 mb-12 bg-transparent rounded-lg"
              >
                Continue
              </Button>
              <div className="flex items-center justify-center gap-12 w-full max-w-4xl">
                <div className="flex flex-col items-center gap-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl flex items-center justify-center shadow-xl">
                    <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                      <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                    </svg>
                  </div>
                  <div className="text-white text-3xl">→</div>
                </div>
                <div className="bg-[#1f2937] rounded-xl p-5 w-80 shadow-2xl">
                  <div className="flex items-center gap-2 mb-4">
                    <Inbox className="w-5 h-5 text-white/70" />
                    <span className="text-white font-semibold">Inbox</span>
                  </div>
                  <div className="bg-[#374151] text-white/70 text-sm p-3 rounded-lg shadow-md">
                    Start using Trello
                  </div>
                </div>
                <div className="flex flex-col items-center gap-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center text-3xl shadow-xl">
                    📱
                  </div>
                  <div className="text-white text-3xl">←</div>
                </div>
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="flex-1 flex flex-col bg-gradient-to-br from-[#0065ff] to-[#0052cc] min-h-screen">
            <OnboardingHeader />
            <div className="flex-1 flex flex-col items-center justify-center px-4 pb-16">
              <h2 className="text-4xl font-bold text-white mb-4 text-center max-w-4xl leading-tight">
                Now, here&apos;s your first <strong>board</strong>, where
                you&apos;ll organize your to-dos
              </h2>
              <p className="text-white/90 text-center max-w-2xl mb-6 text-lg">
                Let&apos;s start you off with three <strong>lists</strong>:
                &quot;Today&quot;, &quot;This week&quot;, &quot;Later&quot;.
              </p>
              <Button
                onClick={next}
                size="lg"
                variant="outline"
                className="text-white border-white/30 hover:bg-white/10 mb-12 bg-transparent rounded-lg"
              >
                Continue
              </Button>
              <div className="w-full px-4 flex justify-center">
                <BoardPreview />
              </div>
              <div className="mt-8">
                <TacoMascot message="Boards and lists are customizable!" position="bottom" />
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="flex-1 flex flex-col bg-gradient-to-br from-[#0065ff] to-[#0052cc] min-h-screen">
            <OnboardingHeader />
            <div className="flex-1 flex flex-col items-center justify-center px-4 pb-16">
              <h2 className="text-4xl font-bold text-white mb-12 text-center">
                Let&apos;s start getting organized
              </h2>
              <div className="relative w-full px-4 flex justify-center mb-8">
                <div className="absolute left-[20%] top-1/2 -translate-y-1/2 z-10">
                  <TacoMascot message="Drag a card from your Inbox to a list on the board" position="left" />
                </div>
                <BoardPreview showDragTarget />
                {todos.length > 0 && boardTodos.today.length === 0 && (
                  <div className="absolute left-[35%] top-1/2 w-48 pointer-events-none">
                    <svg className="w-full h-24" viewBox="0 0 200 100">
                      <path
                        d="M10 10 Q 100 80, 180 50"
                        fill="none"
                        stroke="#f97316"
                        strokeWidth="4"
                        strokeDasharray="8,4"
                        markerEnd="url(#arrowhead)"
                      />
                      <defs>
                        <marker
                          id="arrowhead"
                          markerWidth="10"
                          markerHeight="10"
                          refX="5"
                          refY="3"
                          orient="auto"
                        >
                          <polygon points="0 0, 10 3, 0 6" fill="#f97316" />
                        </marker>
                      </defs>
                    </svg>
                  </div>
                )}
              </div>
              <p className="text-white/70 text-sm mt-4">
                Drag a card from your Inbox to a list on the board, or click Continue
              </p>
              <Button
                onClick={() => {
                  if (todos.length > 0 && boardTodos.today.length === 0) {
                    const first = todos[0] as string;
                    setBoardTodos((prev) => ({
                      ...prev,
                      today: [...prev.today, first],
                    }));
                    setTodos((prev) => prev.slice(1));
                  }
                  next();
                }}
                variant="outline"
                size="lg"
                className="text-white border-white/30 hover:bg-white/10 mt-6 bg-transparent rounded-lg"
              >
                Continue
              </Button>
            </div>
          </div>
        );

      case 5:
        return (
          <div className="flex-1 flex flex-col bg-gradient-to-br from-[#0065ff] to-[#0052cc] min-h-screen">
            <OnboardingHeader />
            <div className="flex-1 flex flex-col items-center justify-center px-4 pb-16">
              <h2 className="text-4xl font-bold text-white mb-12 text-center max-w-3xl">
                You finished your first to-do, mark it complete!
              </h2>
              <div className="w-full px-4 flex justify-center mb-8">
                <BoardPreview showCompletedCard />
              </div>
              <div className="mt-6">
                <TacoMascot message="Check it off!" position="bottom" />
              </div>
              <Button
                onClick={next}
                variant="outline"
                size="lg"
                className="text-white border-white/30 hover:bg-white/10 mt-6 bg-transparent rounded-lg"
              >
                Continue
              </Button>
            </div>
          </div>
        );

      case 6:
        return (
          <div className="flex-1 flex flex-col bg-gradient-to-br from-[#0065ff] to-[#0052cc] min-h-screen">
            <OnboardingHeader />
            <div className="flex-1 flex flex-col items-center justify-center px-4 pb-16">
              <h2 className="text-4xl font-bold text-white mb-6 text-center">
                You&apos;re on your way to better productivity!
              </h2>
              <Button
                onClick={() => router.push("/board")}
                size="lg"
                className="bg-white hover:bg-gray-100 text-blue-600 font-semibold px-10 rounded-lg shadow-lg mb-12"
              >
                One last thing!
              </Button>
              <div className="w-full px-4 flex justify-center mb-8">
                <BoardPreview showCompletedCard />
              </div>
              <div className="mt-6">
                <div className="flex items-center gap-4">
                  <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-purple-700 rounded-full flex items-center justify-center text-5xl shadow-xl">
                    🎉
                  </div>
                  <div className="bg-[#2c3e50] text-white text-base px-5 py-3 rounded-lg shadow-lg">
                    Woohoo!
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0065ff] to-[#0052cc]">
      {renderStep()}
    </div>
  );
}
