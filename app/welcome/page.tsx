"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
// import Link from "next/link";
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
  Mail,
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
      <button onClick={prev} className="text-white/70 hover:text-white">
        <ChevronLeft className="w-5 h-5" />
      </button>
      <div className="flex gap-1.5">
        {Array.from({ length: TOTAL_STEPS }).map((_, i) => (
          <div
            key={i}
            className={`h-1 w-8 rounded-full transition-colors ${
              i <= step ? "bg-[hsl(210,100%,60%)]" : "bg-white/20"
            }`}
          />
        ))}
      </div>
      <button onClick={next} className="text-white/70 hover:text-white">
        <ChevronRight className="w-5 h-5" />
      </button>
    </div>
  );

  const OnboardingHeader = () => (
    <header className="bg-[hsl(215,30%,22%)] px-6 py-3 flex items-center justify-between">
      <TrelloLogo />
      <ProgressBar />
      <button
        onClick={() => router.push("/board")}
        className="text-white/70 hover:text-white"
      >
        <X className="w-5 h-5" />
      </button>
    </header>
  );

  const BoardPreview = ({
    showDragTarget = false,
    showCompletedCard = false,
  }: {
    showDragTarget?: boolean;
    showCompletedCard?: boolean;
  }) => (
    <div className="flex gap-3 flex-1">
      {/* Inbox sidebar */}
      <div className="w-64 shrink-0 bg-[hsl(215,30%,18%)] rounded-lg p-4">
        <div className="flex items-center gap-2 mb-4">
          <Inbox className="w-4 h-4 text-white/70" />
          <span className="text-white font-semibold text-sm">Inbox</span>
        </div>
        {todos.length > 0 &&
          !showCompletedCard &&
          todos.map((t, i) => (
            <div
              key={i}
              draggable
              onDragStart={() => setDraggedTodo(t)}
              className="bg-[hsl(215,25%,25%)] text-white text-sm p-2 rounded mb-1 cursor-grab hover:bg-[hsl(215,25%,30%)]"
            >
              {t}
            </div>
          ))}
        {todos.length === 0 && (
          <div className="text-white/40 text-sm">Start using Trello</div>
        )}
      </div>

      {/* Board */}
      <div
        className="flex-1 rounded-lg overflow-hidden"
        style={{
          background:
            "linear-gradient(135deg, hsl(280,60%,50%), hsl(330,70%,60%))",
        }}
      >
        <div className="p-3">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-white font-semibold text-sm">
              My Trello Board
            </span>
            <div className="w-16 h-1 bg-white/20 rounded" />
          </div>
          <div className="flex gap-3">
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
                  className="w-48 bg-[hsl(215,25%,22%)] rounded-lg p-2"
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={() => {
                    if (draggedTodo) {
                      const todoToAdd = draggedTodo; // Capture the value here
                      setBoardTodos((prev) => ({
                        ...prev,
                        [key]: [...prev[key], todoToAdd], // Use the captured value
                      }));
                      setTodos((prev) => prev.filter((t) => t !== draggedTodo));
                      setDraggedTodo(null);
                    }
                  }}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-white text-xs font-semibold">
                      {list}
                    </span>
                    <MoreHorizontal className="w-3 h-3 text-white/50" />
                  </div>
                  {showDragTarget &&
                    list === "Today" &&
                    boardTodos.today.length === 0 && (
                      <div className="border-2 border-dashed border-white/20 rounded h-20 mb-2" />
                    )}
                  {showCompletedCard && list === "Today" && (
                    <div
                      className="bg-[hsl(215,25%,28%)] rounded p-2 flex items-center gap-2 text-sm cursor-pointer"
                      onClick={() => setCompletedTodo(!completedTodo)}
                    >
                      {completedTodo ? (
                        <CheckCircle2 className="w-4 h-4 text-[hsl(140,60%,50%)]" />
                      ) : (
                        <Circle className="w-4 h-4 text-white/50" />
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
                          className="bg-[hsl(215,25%,28%)] rounded p-2 text-white text-xs mb-1"
                        >
                          {t}
                        </div>
                      ),
                  )}
                  <div className="flex items-center gap-1 text-white/40 text-xs mt-1">
                    <Plus className="w-3 h-3" />
                    <div className="w-16 h-0.5 bg-white/10 rounded" />
                  </div>
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
          <div className="flex-1 bg-white">
            <header className="bg-[hsl(215,30%,22%)] px-6 py-3">
              <TrelloLogo />
            </header>
            <div className="grid lg:grid-cols-2 gap-8 p-8 lg:p-16">
              <div>
                <h1 className="text-3xl font-bold text-foreground mb-8">
                  What brings you here today?
                </h1>
                <div className="space-y-3">
                  {purposes.map((p) => (
                    <button
                      key={p.label}
                      onClick={() => setSelectedPurpose(p.label)}
                      className={`w-full flex items-center gap-4 p-4 rounded-lg border text-left transition-colors ${
                        selectedPurpose === p.label
                          ? "border-primary bg-primary/5"
                          : "border-border hover:border-muted-foreground/30"
                      }`}
                    >
                      <span className="text-muted-foreground">{p.icon}</span>
                      <span className="text-sm font-medium">{p.label}</span>
                    </button>
                  ))}
                </div>
                <div className="flex items-center gap-4 mt-8">
                  <Button
                    onClick={next}
                    disabled={!selectedPurpose}
                    className="bg-primary hover:bg-primary/90 text-primary-foreground"
                  >
                    Continue
                  </Button>
                  <button
                    onClick={() => router.push("/board")}
                    className="text-sm font-medium text-muted-foreground hover:text-foreground"
                  >
                    Skip
                  </button>
                </div>
              </div>
              <div className="hidden lg:flex items-start justify-center">
                <TrelloLogo size="lg" />
              </div>
            </div>
          </div>
        );

      case 1:
        return (
          <div className="flex-1 flex flex-col bg-[hsl(210,100%,40%)]">
            <OnboardingHeader />
            <div className="flex-1 flex flex-col items-center pt-12 px-4">
              <h2 className="text-3xl font-bold text-white mb-2">
                Add a <span className="font-black">to-do</span> to Inbox
              </h2>
              <p className="text-white/80 text-center max-w-lg mb-12">
                Let&apos;s get started by adding a few to-dos as{" "}
                <strong>cards</strong> to your <strong>Inbox</strong>.
              </p>
              <div className="flex items-end gap-4 w-full max-w-lg">
                <div className="shrink-0 mb-4">
                  <div className="bg-[hsl(215,25%,22%)] text-white text-sm p-2 rounded-lg mb-2 whitespace-nowrap">
                    Hey, I&apos;m Taco!
                    <br />
                    Add some to-dos!
                  </div>
                  <div className="w-24 h-24 bg-[hsl(290,60%,60%)] rounded-full flex items-center justify-center text-3xl">
                    🐺
                  </div>
                </div>
                <div className="flex-1 bg-[hsl(215,25%,18%)] rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-4">
                    <Inbox className="w-4 h-4 text-white/70" />
                    <span className="text-white font-semibold text-sm">
                      Inbox
                    </span>
                  </div>
                  <div className="border-2 border-dashed border-[hsl(210,100%,50%)] rounded-lg p-3 mb-3">
                    <Input
                      value={todoText}
                      onChange={(e) => setTodoText(e.target.value)}
                      placeholder="What's on your to-do list?"
                      className="bg-transparent border-none text-white placeholder:text-white/40 p-0 h-8 focus-visible:ring-0"
                      onKeyDown={(e) => e.key === "Enter" && addTodo()}
                    />
                    <div className="flex justify-end mt-2">
                      <Button
                        onClick={addTodo}
                        size="sm"
                        variant="outline"
                        className="text-white border-white/30 hover:bg-white/10 text-xs"
                      >
                        Add card
                      </Button>
                    </div>
                  </div>
                  {todos.map((t, i) => (
                    <div
                      key={i}
                      className="bg-[hsl(215,25%,25%)] text-white text-sm p-2 rounded mb-1"
                    >
                      {t}
                    </div>
                  ))}
                  <button
                    onClick={next}
                    className="w-full bg-[hsl(215,25%,25%)] text-white/70 text-sm p-2 rounded mt-2 hover:bg-[hsl(215,25%,30%)]"
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
          <div className="flex-1 flex flex-col bg-[hsl(210,100%,40%)]">
            <OnboardingHeader />
            <div className="flex-1 flex flex-col items-center pt-12 px-4">
              <h2 className="text-3xl font-bold text-white mb-2">
                Consolidate all your to-dos with Inbox
              </h2>
              <p className="text-white/80 text-center max-w-2xl mb-4">
                Capture everything, anywhere from email, Trello&apos;s mobile
                app, Slack, Microsoft Teams, and Trello&apos;s Chrome extension.
              </p>
              <Button
                onClick={next}
                variant="outline"
                className="text-white border-white/40 hover:bg-white/10 mb-8"
              >
                Continue
              </Button>
              <div className="flex items-center justify-center gap-8 w-full max-w-3xl">
                <div className="flex flex-col items-center gap-4">
                  <div className="w-14 h-14 bg-[hsl(230,60%,55%)] rounded-xl flex items-center justify-center">
                    <Mail className="w-7 h-7 text-white" />
                  </div>
                  <div className="text-white text-2xl">↗</div>
                </div>
                <div className="bg-[hsl(215,25%,18%)] rounded-lg p-4 w-64">
                  <div className="flex items-center gap-2 mb-3">
                    <Inbox className="w-4 h-4 text-white/70" />
                    <span className="text-white font-semibold text-sm">
                      Inbox
                    </span>
                  </div>
                  <div className="bg-[hsl(215,25%,25%)] text-white/70 text-sm p-2 rounded">
                    Start using Trello
                  </div>
                </div>
                <div className="flex flex-col items-center gap-4">
                  <div className="w-14 h-14 bg-[hsl(140,60%,45%)] rounded-xl flex items-center justify-center text-xl">
                    📱
                  </div>
                  <div className="text-white text-2xl">↙</div>
                </div>
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="flex-1 flex flex-col bg-[hsl(210,100%,40%)]">
            <OnboardingHeader />
            <div className="flex-1 flex flex-col items-center pt-12 px-4">
              <h2 className="text-3xl font-bold text-white mb-2">
                Now, here&apos;s your first <strong>board</strong>, where
                you&apos;ll organize your to-dos
              </h2>
              <p className="text-white/80 text-center max-w-lg mb-4">
                Let&apos;s start you off with three <strong>lists</strong>:
                &quot;Today&quot;, &quot;This week&quot;, &quot;Later&quot;.
              </p>
              <Button
                onClick={next}
                variant="outline"
                className="text-white border-white/40 hover:bg-white/10 mb-8"
              >
                Continue
              </Button>
              <div className="w-full max-w-5xl px-4">
                <BoardPreview />
              </div>
            </div>
          </div>
        );
      case 4:
        return (
          <div className="flex-1 flex flex-col bg-[hsl(210,100%,40%)]">
            <OnboardingHeader />
            <div className="flex-1 flex flex-col items-center pt-12 px-4">
              <h2 className="text-3xl font-bold text-white mb-8">
                Let&apos;s start getting organized
              </h2>
              <div className="w-full max-w-5xl px-4">
                <BoardPreview showDragTarget />
              </div>
              <p className="text-white/60 text-sm mt-4">
                Drag a card from your Inbox to a list on the board, or click
                Continue
              </p>
              <Button
                onClick={() => {
                  if (todos.length > 0 && boardTodos.today.length === 0) {
                    const first = todos[0] as string; // Type assertion
                    setBoardTodos((prev) => ({
                      ...prev,
                      today: [...prev.today, first],
                    }));
                    setTodos((prev) => prev.slice(1));
                  }
                  next();
                }}
                variant="outline"
                className="text-white border-white/40 hover:bg-white/10 mt-4"
              >
                Continue
              </Button>
            </div>
          </div>
        );

      case 5:
        return (
          <div className="flex-1 flex flex-col bg-[hsl(210,100%,40%)]">
            <OnboardingHeader />
            <div className="flex-1 flex flex-col items-center pt-12 px-4">
              <h2 className="text-3xl font-bold text-white mb-8">
                You finished your first to-do, mark it complete!
              </h2>
              <div className="w-full max-w-5xl px-4">
                <BoardPreview showCompletedCard />
              </div>
              <div className="mt-6 flex items-center gap-3">
                <div className="w-16 h-16 bg-[hsl(290,60%,60%)] rounded-full flex items-center justify-center text-2xl">
                  🐺
                </div>
                <div className="bg-[hsl(215,25%,22%)] text-white text-sm px-3 py-2 rounded-lg">
                  Check it off!
                </div>
              </div>
              <Button
                onClick={next}
                variant="outline"
                className="text-white border-white/40 hover:bg-white/10 mt-4"
              >
                Continue
              </Button>
            </div>
          </div>
        );

      case 6:
        return (
          <div className="flex-1 flex flex-col bg-[hsl(210,100%,40%)]">
            <OnboardingHeader />
            <div className="flex-1 flex flex-col items-center pt-12 px-4">
              <h2 className="text-3xl font-bold text-white mb-4">
                You&apos;re on your way to better productivity!
              </h2>
              <Button
                onClick={() => router.push("/board")}
                className="bg-primary hover:bg-primary/90 text-primary-foreground px-8"
              >
                One last thing!
              </Button>
              <div className="w-full max-w-5xl px-4 mt-8">
                <BoardPreview showCompletedCard />
              </div>
              <div className="mt-6 flex items-center gap-3">
                <div className="w-16 h-16 bg-[hsl(290,60%,60%)] rounded-full flex items-center justify-center text-2xl">
                  🎉
                </div>
                <div className="bg-[hsl(215,25%,22%)] text-white text-sm px-3 py-2 rounded-lg">
                  Roo!
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
    <div className="min-h-screen flex flex-col bg-[hsl(215,30%,22%)]">
      {renderStep()}
    </div>
  );
}
