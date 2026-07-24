"use client";

import React, { useState } from "react";
import { useStore } from "@/lib/storage";
import {
  Sparkles,
  Send,
  Scissors,
  CalendarDays,
  ListOrdered,
  Flame,
  Plus,
  X,
  Zap,
} from "lucide-react";
import { cn } from "@/lib/utils";

type Msg = {
  id: number;
  role: "ai" | "user";
  text: string;
};

const quickActions = [
  { label: "Break big task", icon: Scissors },
  { label: "Today's plan", icon: CalendarDays },
  { label: "Prioritize work", icon: ListOrdered },
  { label: "Good habits for focus", icon: Flame },
];

export function AiScreen() {
  const { tasks, projects, habits } = useStore();

  const [messages, setMessages] = useState<Msg[]>([
    {
      id: 1,
      role: "ai",
      text: `Hi Maya! I'm synced with your workspace (${tasks.length} tasks, ${projects.length} projects, and ${habits.length} habits tracked). Ask me anything about your schedule, habit optimization, or project planning!`,
    },
  ]);

  const [input, setInput] = useState("");
  const [selectedContext, setSelectedContext] = useState<string | null>(null);
  const [showAttachMenu, setShowAttachMenu] = useState(false);

  // Send Prompt Logic reading REAL store data
  const handleSend = (textToSend?: string) => {
    const query = (textToSend || input).trim();
    if (!query) return;

    const fullMessageText = selectedContext
      ? `[Context: ${selectedContext}] ${query}`
      : query;

    const userMsg: Msg = { id: Date.now(), role: "user", text: fullMessageText };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setSelectedContext(null);

    // AI Dynamic Response Reading Real Store Data
    setTimeout(() => {
      let aiReplyText = "";
      const lowerQuery = query.toLowerCase();

      if (lowerQuery.includes("project") || lowerQuery.includes("progress")) {
        if (projects.length === 0) {
          aiReplyText =
            "You have no active projects yet. Add one from the Dashboard to start tracking progress.";
        } else {
          const list = projects
            .map(
              (p) =>
                `• ${p.title}: ${p.progress}% completed (${p.completedTasks}/${p.totalTasks} tasks done, Due ${p.dueDate})`
            )
            .join("\n");
          aiReplyText = `Here is your current project progress report:\n\n${list}`;
        }
      } else if (
        lowerQuery.includes("today") ||
        lowerQuery.includes("do") ||
        lowerQuery.includes("task") ||
        lowerQuery.includes("plan") ||
        lowerQuery.includes("work")
      ) {
        const pending = tasks.filter((t) => !t.completed);
        if (pending.length === 0) {
          aiReplyText =
            "You have no pending tasks scheduled for today. Great job!";
        } else {
          const list = pending
            .map(
              (t) =>
                `• ${t.title} (${t.priority.toUpperCase()} priority · ${t.project})`
            )
            .join("\n");
          aiReplyText = `Today's work checklist:\n\n${list}`;
        }
      } else if (lowerQuery.includes("habit")) {
        if (habits.length === 0) {
          aiReplyText =
            "No active habits logged. Recommended daily habits for focus: Deep Work (45 mins), Reading (20 mins), and Morning Planning.";
        } else {
          const list = habits
            .map((h) => `• ${h.title}: ${h.streak} day streak 🔥`)
            .join("\n");
          aiReplyText = `Your habit streak summary:\n\n${list}`;
        }
      } else {
        const pendingCount = tasks.filter((t) => !t.completed).length;
        aiReplyText = `Workspace Status: You currently have ${pendingCount} pending tasks and ${projects.length} active projects. Let me know if you want to break down a project or reprioritize today's schedule!`;
      }

      setMessages((prev) => [
        ...prev,
        { id: Date.now() + 1, role: "ai", text: aiReplyText },
      ]);
    }, 500);
  };

  return (
    <div className="flex flex-col h-full justify-between px-5 pt-12 pb-4 text-white bg-[#0D0B14]">
      {/* Top Container Area */}
      <div className="flex flex-col flex-1 min-h-0 space-y-3">
        {/* 1. Header with Live Workspace Sync Indicator */}
        <header className="flex items-center gap-3 pb-3 pt-1 border-b border-gray-800/60 flex-shrink-0">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 p-0.5 border border-purple-400/40 shadow-lg shadow-purple-900/40 flex items-center justify-center flex-shrink-0">
            <div className="w-full h-full rounded-[14px] bg-purple-950 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-purple-300" />
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <h1 className="text-lg font-bold tracking-tight">AI Assistant</h1>
            <p className="flex items-center gap-1.5 text-xs text-gray-400 truncate">
              <Zap className="w-3 h-3 text-amber-400 fill-amber-400" />
              Connected: {tasks.length} Tasks · {habits.length} Habits
            </p>
          </div>
        </header>

        {/* 2. Quick Action Chips Bar */}
        <div className="-mx-5 flex gap-2 overflow-x-auto no-scrollbar px-5 py-2 flex-shrink-0">
          {quickActions.map((q) => {
            const Icon = q.icon;
            return (
              <button
                key={q.label}
                type="button"
                onClick={() => handleSend(q.label)}
                className="flex shrink-0 items-center gap-2 rounded-full px-4 py-2 bg-[#181524] border border-gray-800 text-xs font-medium text-gray-300 hover:border-purple-500/50 hover:text-white transition-all active:scale-95"
              >
                <Icon className="h-3.5 w-3.5 text-purple-400" />
                {q.label}
              </button>
            );
          })}
        </div>

        {/* 3. Chat Messages Scroll List */}
        <div className="flex-1 space-y-4 overflow-y-auto no-scrollbar py-2">
          {messages.map((m) => (
            <div
              key={m.id}
              className={cn(
                "flex animate-in fade-in duration-200",
                m.role === "user" ? "justify-end" : "justify-start"
              )}
            >
              {m.role === "ai" && (
                <span className="mr-2 mt-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-xl bg-purple-950 border border-purple-800 text-purple-400">
                  <Sparkles className="h-3.5 w-3.5" />
                </span>
              )}
              <div
                className={cn(
                  "max-w-[80%] rounded-2xl px-4 py-3 text-xs leading-relaxed whitespace-pre-line shadow-md",
                  m.role === "user"
                    ? "bg-purple-600 text-white rounded-br-xs"
                    : "bg-[#161322] border border-gray-800 text-gray-200 rounded-bl-xs"
                )}
              >
                {m.text}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Fixed Container Area */}
      <div className="flex flex-col flex-shrink-0 pt-2">
        {/* 4. Active Context Tag Banner */}
        {selectedContext && (
          <div className="mb-2 px-3 py-1.5 rounded-xl bg-purple-950/80 border border-purple-500/40 flex items-center justify-between text-xs text-purple-300">
            <span className="truncate">Attached Context: {selectedContext}</span>
            <button
              type="button"
              onClick={() => setSelectedContext(null)}
              className="text-gray-400 hover:text-white ml-2"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* 5. Input Bar */}
        <div className="bg-[#161322] border border-gray-800 rounded-2xl p-2 flex items-center gap-2 shadow-xl mb-2">
          <button
            type="button"
            aria-label="Attach Workspace Context"
            onClick={() => setShowAttachMenu(true)}
            className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#0D0B14] border border-gray-800 text-gray-400 hover:text-purple-400 hover:border-purple-500/40 transition-all active:scale-90"
          >
            <Plus className="h-5 w-5" />
          </button>
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSend();
            }}
            placeholder="Ask TaskPilot about habits, tasks, or projects..."
            className="min-w-0 flex-1 bg-transparent px-1 text-xs text-white outline-none placeholder:text-gray-500"
          />
          <button
            type="button"
            onClick={() => handleSend()}
            aria-label="Send message"
            className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-600 text-white hover:bg-purple-500 transition-transform active:scale-90 shadow-md shadow-purple-900/30"
          >
            <Send className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* --- ATTACHMENT CONTEXT PICKER MODAL --- */}
      {showAttachMenu && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-md z-[999] flex items-start justify-center pt-12 px-4 pb-20 overflow-y-auto">
          <div className="bg-[#181524] border border-purple-900/50 rounded-2xl w-full max-w-md p-5 space-y-4 shadow-2xl mt-4">
            <div className="flex justify-between items-center border-b border-gray-800 pb-3">
              <h3 className="font-bold text-sm">Attach Item as Context</h3>
              <button
                type="button"
                onClick={() => setShowAttachMenu(false)}
                className="text-gray-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 max-h-60 overflow-y-auto no-scrollbar">
              {/* Projects */}
              <div>
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1.5">
                  Projects
                </span>
                {projects.length === 0 ? (
                  <p className="text-xs text-gray-500">No projects available.</p>
                ) : (
                  projects.map((p) => (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => {
                        setSelectedContext(`Project: ${p.title}`);
                        setShowAttachMenu(false);
                      }}
                      className="w-full text-left p-2 rounded-xl bg-[#0D0B14] border border-gray-800 hover:border-purple-500/50 mb-1.5 text-xs text-gray-200 truncate flex justify-between items-center"
                    >
                      <span>📁 {p.title}</span>
                      <span className="text-[10px] text-purple-400 font-semibold">
                        {p.progress}%
                      </span>
                    </button>
                  ))
                )}
              </div>

              {/* Habits */}
              <div>
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1.5">
                  Habits
                </span>
                {habits.length === 0 ? (
                  <p className="text-xs text-gray-500">No habits available.</p>
                ) : (
                  habits.map((h) => (
                    <button
                      key={h.id}
                      type="button"
                      onClick={() => {
                        setSelectedContext(`Habit: ${h.title}`);
                        setShowAttachMenu(false);
                      }}
                      className="w-full text-left p-2 rounded-xl bg-[#0D0B14] border border-gray-800 hover:border-purple-500/50 mb-1.5 text-xs text-gray-200 truncate flex justify-between items-center"
                    >
                      <span>🔥 {h.title}</span>
                      <span className="text-[10px] text-amber-400 font-semibold">
                        {h.streak}d streak
                      </span>
                    </button>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}