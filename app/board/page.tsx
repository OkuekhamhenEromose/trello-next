"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Search,
  Plus,
  Bell,
  HelpCircle,
  MoreHorizontal,
  Star,
  Lock,
  Users,
  ChevronDown,
  X,
  Menu,
  Inbox,
  Calendar,
  LayoutDashboard,
  Grid3x3,
  Mail,
  Smartphone,
  Slack,
  Chrome,
  Circle,
  CheckCircle2,
} from "lucide-react";
import TrelloLogo from "@/components/TrelloLogo";

interface Card {
  id: string;
  title: string;
  completed?: boolean;
}

interface List {
  id: string;
  title: string;
  cards: Card[];
}

export default function BoardPage() {
  const [activeTab, setActiveTab] = useState<"inbox" | "planner" | "board">("board");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [showBoardSwitcher, setShowBoardSwitcher] = useState(false);
  const [lists, setLists] = useState<List[]>([
    {
      id: "1",
      title: "To Do",
      cards: [
        { id: "1", title: "Going to pick up a student from his school as a result of mid term break" },
      ],
    },
    {
      id: "2",
      title: "Doing",
      cards: [],
    },
    {
      id: "3",
      title: "Done",
      cards: [],
    },
  ]);
  const [newCardTitle, setNewCardTitle] = useState("");
  const [addingCardToList, setAddingCardToList] = useState<string | null>(null);

  const addCard = (listId: string) => {
    if (!newCardTitle.trim()) return;

    setLists(
      lists.map((list) =>
        list.id === listId
          ? {
              ...list,
              cards: [...list.cards, { id: Date.now().toString(), title: newCardTitle }],
            }
          : list
      )
    );
    setNewCardTitle("");
    setAddingCardToList(null);
  };

  const toggleCardComplete = (listId: string, cardId: string) => {
    setLists(
      lists.map((list) =>
        list.id === listId
          ? {
              ...list,
              cards: list.cards.map((card) =>
                card.id === cardId ? { ...card, completed: !card.completed } : card
              ),
            }
          : list
      )
    );
  };

  return (
    <div className="h-screen flex flex-col bg-gradient-to-br from-[#0747a6] to-[#0052cc] overflow-hidden">
      {/* Top Navigation */}
      <header className="bg-[#1d2125]/60 backdrop-blur-sm border-b border-white/10 px-3 py-2 flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="text-white hover:bg-white/10 lg:hidden"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            <Menu className="w-5 h-5" />
          </Button>
          <TrelloLogo size="sm" />
        </div>

        <div className="flex-1 max-w-md hidden md:block">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/50" />
            <Input
              placeholder="Search"
              className="bg-white/10 border-0 text-white placeholder:text-white/50 pl-10 focus-visible:ring-white/30 h-9"
            />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            size="sm"
            className="bg-[#579dff] hover:bg-[#85b8ff] text-white border-0 hidden md:flex"
          >
            Create
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="text-white hover:bg-white/10 hidden md:inline-flex"
          >
            <Bell className="w-5 h-5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="text-white hover:bg-white/10 hidden md:inline-flex"
          >
            <HelpCircle className="w-5 h-5" />
          </Button>
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center text-white font-semibold text-sm cursor-pointer hover:opacity-90 transition-opacity">
            EO
          </div>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar - Inbox */}
        {sidebarOpen && (
          <aside className="w-80 bg-[#1d2125] border-r border-white/10 flex flex-col">
            <div className="p-4 border-b border-white/10">
              <div className="flex items-center gap-2 text-white">
                <Inbox className="w-5 h-5" />
                <h2 className="font-semibold text-lg">Inbox</h2>
              </div>
            </div>

            <div className="p-4">
              <Input
                placeholder="Add a card"
                className="bg-[#22272b] border-[#3d4c5c] text-white placeholder:text-white/50 h-10"
              />
            </div>

            <div className="flex-1 flex flex-col items-center justify-center px-4 pb-8">
              <h3 className="text-white font-semibold text-lg mb-8">Consolidate your to-dos</h3>

              <div className="relative w-48 h-48">
                <div className="absolute top-8 left-8 w-16 h-16 rounded-full bg-[#2c3e50] border-2 border-[#579dff] flex items-center justify-center">
                  <Mail className="w-8 h-8 text-[#579dff]" />
                </div>
                <div className="absolute top-0 right-8 w-14 h-14 rounded-full bg-[#2c3e50] border-2 border-[#00b8d9] flex items-center justify-center">
                  <Chrome className="w-7 h-7 text-[#00b8d9]" />
                  <span className="absolute -top-1 -right-1 bg-[#ff5630] text-white text-xs px-1.5 py-0.5 rounded font-semibold">
                    NEW
                  </span>
                </div>
                <div className="absolute top-16 right-4 w-14 h-14 rounded-full bg-[#2c3e50] border-2 border-[#ffab00] flex items-center justify-center">
                  <Smartphone className="w-7 h-7 text-[#ffab00]" />
                </div>
                <div className="absolute bottom-8 left-4 w-14 h-14 rounded-full bg-[#2c3e50] border-2 border-[#6554c0] flex items-center justify-center">
                  <Slack className="w-7 h-7 text-[#6554c0]" />
                </div>
                <div className="absolute bottom-4 right-12 w-14 h-14 rounded-full bg-[#2c3e50] border-2 border-[#00b8d9] flex items-center justify-center">
                  <Grid3x3 className="w-7 h-7 text-[#00b8d9]" />
                </div>
              </div>

              <div className="flex items-center gap-2 text-white/70 text-sm mt-8">
                <Lock className="w-4 h-4" />
                <span>Inbox is only visible to you</span>
              </div>
            </div>
          </aside>
        )}

        {/* Main Content */}
        <main className="flex-1 flex flex-col overflow-hidden">
          {activeTab === "board" && (
            <>
              {/* Board Header */}
              <div className="px-4 py-3 flex items-center gap-3 border-b border-white/10">
                <h1 className="text-white font-semibold text-lg">new one1</h1>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-white hover:bg-white/10 h-7 w-7"
                >
                  <Star className="w-4 h-4" />
                </Button>
                <div className="h-5 w-px bg-white/20" />
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-white hover:bg-white/10 h-7 px-2"
                >
                  <Users className="w-4 h-4 mr-1" />
                  <span className="text-sm">Share</span>
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-white hover:bg-white/10 h-7 w-7 ml-auto"
                >
                  <MoreHorizontal className="w-5 h-5" />
                </Button>
              </div>

              {/* Board Lists */}
              <div className="flex-1 overflow-x-auto overflow-y-hidden px-4 py-4">
                <div className="flex gap-3 h-full">
                  {lists.map((list) => (
                    <div
                      key={list.id}
                      className="w-72 bg-[#101204] rounded-xl flex flex-col shrink-0 max-h-full"
                    >
                      <div className="p-3 flex items-center justify-between border-b border-white/5">
                        <h3 className="text-white font-semibold text-sm">{list.title}</h3>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-white/50 hover:text-white hover:bg-white/10 h-7 w-7"
                        >
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </div>

                      <div className="flex-1 overflow-y-auto p-2 space-y-2">
                        {list.cards.map((card) => (
                          <div
                            key={card.id}
                            className="bg-[#22272b] hover:bg-[#2c333a] rounded-lg p-3 cursor-pointer transition-colors group"
                            onClick={() => toggleCardComplete(list.id, card.id)}
                          >
                            <div className="flex items-start gap-2">
                              {card.completed ? (
                                <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                              ) : (
                                <Circle className="w-5 h-5 text-white/30 flex-shrink-0 mt-0.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                              )}
                              <p
                                className={`text-white text-sm leading-relaxed ${
                                  card.completed ? "line-through opacity-60" : ""
                                }`}
                              >
                                {card.title}
                              </p>
                            </div>
                          </div>
                        ))}

                        {addingCardToList === list.id ? (
                          <div className="bg-[#22272b] rounded-lg p-2 space-y-2">
                            <textarea
                              autoFocus
                              value={newCardTitle}
                              onChange={(e) => setNewCardTitle(e.target.value)}
                              placeholder="Enter a title for this card..."
                              className="w-full bg-transparent text-white text-sm border-0 outline-none resize-none min-h-[60px] placeholder:text-white/40"
                              onKeyDown={(e) => {
                                if (e.key === "Enter" && !e.shiftKey) {
                                  e.preventDefault();
                                  addCard(list.id);
                                } else if (e.key === "Escape") {
                                  setAddingCardToList(null);
                                  setNewCardTitle("");
                                }
                              }}
                            />
                            <div className="flex items-center gap-2">
                              <Button
                                size="sm"
                                onClick={() => addCard(list.id)}
                                className="bg-[#579dff] hover:bg-[#85b8ff] text-white border-0 h-8"
                              >
                                Add card
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => {
                                  setAddingCardToList(null);
                                  setNewCardTitle("");
                                }}
                                className="text-white/50 hover:text-white hover:bg-white/10 h-8 w-8"
                              >
                                <X className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        ) : (
                          <button
                            onClick={() => setAddingCardToList(list.id)}
                            className="w-full flex items-center gap-2 text-white/50 hover:text-white hover:bg-white/5 rounded-lg p-2 transition-colors text-sm"
                          >
                            <Plus className="w-4 h-4" />
                            <span>Add a card</span>
                          </button>
                        )}
                      </div>
                    </div>
                  ))}

                  <button className="w-72 bg-white/10 hover:bg-white/20 rounded-xl p-3 flex items-center gap-2 text-white shrink-0 transition-colors h-fit">
                    <Plus className="w-4 h-4" />
                    <span className="text-sm font-medium">Add another list</span>
                  </button>
                </div>
              </div>
            </>
          )}

          {activeTab === "inbox" && (
            <div className="flex-1 flex flex-col items-center justify-center px-4">
              <div className="max-w-md w-full text-center">
                <div className="w-48 h-48 mx-auto mb-8 relative">
                  <div className="absolute top-8 left-8 w-16 h-16 rounded-full bg-[#2c3e50] border-2 border-[#579dff] flex items-center justify-center">
                    <Mail className="w-8 h-8 text-[#579dff]" />
                  </div>
                  <div className="absolute top-0 right-8 w-14 h-14 rounded-full bg-[#2c3e50] border-2 border-[#00b8d9] flex items-center justify-center">
                    <Chrome className="w-7 h-7 text-[#00b8d9]" />
                  </div>
                  <div className="absolute bottom-8 left-4 w-14 h-14 rounded-full bg-[#2c3e50] border-2 border-[#6554c0] flex items-center justify-center">
                    <Slack className="w-7 h-7 text-[#6554c0]" />
                  </div>
                </div>
                <h2 className="text-white font-semibold text-2xl mb-4">Consolidate your to-dos</h2>
                <p className="text-white/70 mb-6">
                  Capture everything, anywhere from email, Trello&apos;s mobile app, Slack, Microsoft
                  Teams, and Trello&apos;s Chrome extension.
                </p>
              </div>
            </div>
          )}

          {activeTab === "planner" && (
            <div className="flex-1 flex flex-col items-center justify-center px-4">
              <div className="max-w-2xl w-full text-center">
                <Calendar className="w-20 h-20 text-white/50 mx-auto mb-6" />
                <h2 className="text-white font-semibold text-2xl mb-4">Planner</h2>
                <p className="text-white/70 mb-6">
                  Connect your calendars to get a side-by-side view of your Planner and your to-do&apos;s.
                </p>
                <Button className="bg-[#579dff] hover:bg-[#85b8ff] text-white border-0">
                  <Calendar className="w-4 h-4 mr-2" />
                  Connect a calendar
                </Button>
                <p className="text-white/50 text-sm mt-4">
                  Try Premium for free to schedule your to-dos on your Planner.
                </p>
                <div className="flex items-center justify-center gap-2 text-white/50 text-sm mt-6">
                  <Lock className="w-4 h-4" />
                  <span>Only you can see your Planner.</span>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Bottom Navigation */}
      <nav className="bg-[#1d2125]/90 backdrop-blur-sm border-t border-white/10 px-4 py-2">
        <div className="flex items-center justify-center gap-2">
          <button
            onClick={() => setActiveTab("inbox")}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
              activeTab === "inbox"
                ? "bg-[#579dff] text-white"
                : "text-white/70 hover:bg-white/10 hover:text-white"
            }`}
          >
            <Inbox className="w-4 h-4" />
            <span className="text-sm font-medium hidden sm:inline">Inbox</span>
          </button>
          <button
            onClick={() => setActiveTab("planner")}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
              activeTab === "planner"
                ? "bg-[#579dff] text-white"
                : "text-white/70 hover:bg-white/10 hover:text-white"
            }`}
          >
            <Calendar className="w-4 h-4" />
            <span className="text-sm font-medium hidden sm:inline">Planner</span>
          </button>
          <button
            onClick={() => setActiveTab("board")}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
              activeTab === "board"
                ? "bg-[#579dff] text-white"
                : "text-white/70 hover:bg-white/10 hover:text-white"
            }`}
          >
            <LayoutDashboard className="w-4 h-4" />
            <span className="text-sm font-medium hidden sm:inline">Board</span>
          </button>
          <button
            onClick={() => setShowBoardSwitcher(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-white/70 hover:bg-white/10 hover:text-white transition-colors"
          >
            <Grid3x3 className="w-4 h-4" />
            <span className="text-sm font-medium hidden sm:inline">Switch boards</span>
          </button>
        </div>
      </nav>

      {/* Board Switcher Modal */}
      {showBoardSwitcher && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#22272b] rounded-xl w-full max-w-2xl max-h-[80vh] overflow-hidden">
            <div className="p-6 border-b border-white/10">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-white font-semibold text-lg">Switch boards</h2>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowBoardSwitcher(false)}
                  className="text-white/50 hover:text-white hover:bg-white/10"
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/50" />
                <Input
                  placeholder="Search your boards"
                  className="bg-[#1d2125] border-[#3d4c5c] text-white placeholder:text-white/50 pl-10"
                />
              </div>
            </div>
            <div className="p-6">
              <div className="flex items-center gap-2 text-white/70 text-sm mb-4">
                <div className="w-5 h-5 rounded-full bg-white/10 flex items-center justify-center">
                  <span className="text-xs">⏱</span>
                </div>
                <span>Recent</span>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-gradient-to-br from-[#0747a6] to-[#0052cc] rounded-lg p-4 cursor-pointer hover:opacity-90 transition-opacity">
                  <h3 className="text-white font-semibold">new one1</h3>
                </div>
                <div className="relative bg-gradient-to-br from-orange-400 via-pink-400 to-cyan-400 rounded-lg p-4 cursor-pointer hover:opacity-90 transition-opacity">
                  <div className="absolute top-2 right-2 bg-white/90 text-gray-800 text-xs px-2 py-1 rounded font-semibold">
                    TEMPLATE
                  </div>
                  <h3 className="text-white font-semibold">Kanban Template</h3>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
