"use client";

import React, { useState, useEffect } from "react";
import { useStore, Task } from "@/lib/storage";
import {
  CheckCircle2,
  Circle,
  Plus,
  Trash2,
  Clock,
  Sparkles,
  X,
  Edit2,
  RotateCcw,
  AlertCircle,
} from "lucide-react";

export function TasksScreen() {
  const { tasks, projects, addTask, updateTask, toggleTask, deleteTask } =
    useStore();

  const [filter, setFilter] = useState<"all" | "daily" | "today" | "high">(
    "all"
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  // Form State
  const [title, setTitle] = useState("");
  const [priority, setPriority] = useState<"high" | "medium" | "low">("medium");
  const [project, setProject] = useState("");
  const [time, setTime] = useState("");
  const [isDaily, setIsDaily] = useState(false);

  const todayStr = new Date().toISOString().split("T")[0];

  // Auto-reset Daily Tasks after 24 hours
  useEffect(() => {
    tasks.forEach((task) => {
      if (
        task.isDaily &&
        task.completed &&
        task.lastCompletedDate &&
        task.lastCompletedDate !== todayStr
      ) {
        updateTask(task.id, { completed: false });
      }
    });
  }, [tasks, todayStr, updateTask]);

  const handleToggleTask = (task: Task) => {
    if (task.isDaily) {
      const willBeCompleted = !task.completed;
      updateTask(task.id, {
        completed: willBeCompleted,
        lastCompletedDate: willBeCompleted ? todayStr : undefined,
      });
    } else {
      toggleTask(task.id);
    }
  };

  const filteredTasks = tasks.filter((task) => {
    if (filter === "daily") return task.isDaily;
    if (filter === "high") return task.priority === "high";
    if (filter === "today") return !task.completed;
    return true;
  });

  const dailyTasks = tasks.filter((t) => t.isDaily);
  const regularTasks = filteredTasks.filter((t) => !t.isDaily);

  const handleOpenAddModal = () => {
    setEditingTask(null);
    setTitle("");
    setPriority("medium");
    setProject(projects[0]?.title || "General");
    setTime("Everyday");
    setIsDaily(false);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (task: Task) => {
    setEditingTask(task);
    setTitle(task.title);
    setPriority(task.priority);
    setProject(task.project);
    setTime(task.time);
    setIsDaily(!!task.isDaily);
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    if (editingTask) {
      updateTask(editingTask.id, {
        title,
        priority,
        project,
        time,
        isDaily,
      });
    } else {
      addTask({
        title,
        priority,
        completed: false,
        project: project || "General",
        time: time || (isDaily ? "Everyday" : "Today"),
        isDaily,
      });
    }

    setIsModalOpen(false);
  };

  return (
    <div className="relative flex-1 overflow-y-auto px-4 pt-4 pb-36 text-white bg-[#0D0B14]">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-2xl font-bold">Tasks & Routines</h1>
          <p className="text-xs text-gray-400">
            {tasks.filter((t) => !t.completed).length} pending tasks •{" "}
            {dailyTasks.length} daily routines
          </p>
        </div>
      </div>

      {/* AI Task Breakdown Banner */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-purple-900/50 to-indigo-900/30 border border-purple-500/30 mb-6 flex items-center justify-between shadow-lg">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-purple-600/30 border border-purple-500/40 flex items-center justify-center text-purple-300">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-semibold text-sm">AI Task Breakdown</h3>
            <p className="text-xs text-gray-400">
              Split complex tasks into quick actionable steps
            </p>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 mb-6 overflow-x-auto no-scrollbar">
        {(["all", "daily", "today", "high"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setFilter(tab)}
            className={`px-4 py-1.5 rounded-full text-xs font-medium capitalize transition-all ${
              filter === tab
                ? "bg-purple-600 text-white shadow-md shadow-purple-900/40"
                : "bg-[#181524] text-gray-400 border border-gray-800 hover:text-white"
            }`}
          >
            {tab === "today" ? "Pending" : tab === "daily" ? "Daily Routines" : tab}
          </button>
        ))}
      </div>

      {/* Daily Routine Tasks Section */}
      {(filter === "all" || filter === "daily") && dailyTasks.length > 0 && (
        <div className="mb-6 space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-bold uppercase tracking-wider text-purple-400 flex items-center gap-1.5">
              <RotateCcw className="w-3.5 h-3.5" /> Daily Routine Checklist (24h)
            </h2>
            <span className="text-[11px] text-gray-500">
              {dailyTasks.filter((t) => t.completed).length}/{dailyTasks.length} Done Today
            </span>
          </div>

          <div className="space-y-2">
            {dailyTasks.map((task) => {
              const isOverdueFromYesterday =
                !task.completed &&
                task.lastCompletedDate &&
                task.lastCompletedDate !== todayStr;

              return (
                <div
                  key={task.id}
                  className={`p-3.5 rounded-2xl border transition-all flex items-center justify-between gap-3 ${
                    task.completed
                      ? "bg-[#12101D] border-gray-800/40 opacity-60"
                      : "bg-[#18132B] border-purple-800/40 hover:border-purple-500/50 shadow-sm"
                  }`}
                >
                  <button
                    onClick={() => handleToggleTask(task)}
                    className="text-purple-400 hover:text-purple-300 transition-colors p-1"
                  >
                    {task.completed ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-400 fill-emerald-500/20" />
                    ) : (
                      <Circle className="w-5 h-5 text-purple-400" />
                    )}
                  </button>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h3
                        className={`text-sm font-medium truncate ${
                          task.completed
                            ? "line-through text-gray-500"
                            : "text-white"
                        }`}
                      >
                        {task.title}
                      </h3>
                      <span className="bg-purple-500/20 text-purple-300 text-[9px] px-1.5 py-0.5 rounded font-semibold uppercase">
                        Daily
                      </span>
                    </div>

                    <div className="flex items-center gap-2 mt-1 text-[11px] text-gray-400">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3 text-gray-500" /> {task.time}
                      </span>

                      {isOverdueFromYesterday && (
                        <span className="flex items-center gap-1 text-red-400 font-semibold bg-red-500/10 px-1.5 py-0.5 rounded">
                          <AlertCircle className="w-3 h-3" /> Overdue from yesterday
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleOpenEditModal(task)}
                      className="text-gray-500 hover:text-purple-400 p-1 rounded-lg hover:bg-purple-500/10 transition-all"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => deleteTask(task.id)}
                      className="text-gray-500 hover:text-red-400 p-1 rounded-lg hover:bg-red-500/10 transition-all"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Regular Tasks Section */}
      {filter !== "daily" && (
        <div className="space-y-3">
          {dailyTasks.length > 0 && (
            <h2 className="text-xs font-bold uppercase tracking-wider text-gray-400">
              Standard Tasks
            </h2>
          )}

          {regularTasks.length === 0 ? (
            <div className="text-center py-8 text-gray-500 text-sm">
              No regular tasks found. Tap + to create one.
            </div>
          ) : (
            regularTasks.map((task) => (
              <div
                key={task.id}
                className={`p-3.5 rounded-2xl border transition-all flex items-center justify-between gap-3 ${
                  task.completed
                    ? "bg-[#12101D] border-gray-800/40 opacity-60"
                    : "bg-[#161322] border-gray-800/80 hover:border-purple-500/30 shadow-sm"
                }`}
              >
                <button
                  onClick={() => handleToggleTask(task)}
                  className="text-purple-400 hover:text-purple-300 transition-colors p-1"
                >
                  {task.completed ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 fill-emerald-500/20" />
                  ) : (
                    <Circle className="w-5 h-5 text-gray-500" />
                  )}
                </button>

                <div className="flex-1 min-w-0">
                  <h3
                    className={`text-sm font-medium truncate ${
                      task.completed
                        ? "line-through text-gray-500"
                        : "text-white"
                    }`}
                  >
                    {task.title}
                  </h3>
                  <div className="flex items-center gap-2 mt-1 text-[11px] text-gray-400">
                    <span className="bg-purple-950/60 text-purple-300 px-2 py-0.5 rounded-md border border-purple-800/30">
                      {task.project}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-gray-500" /> {task.time}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span
                    className={`px-2 py-0.5 rounded-md text-[10px] font-semibold uppercase ${
                      task.priority === "high"
                        ? "bg-red-500/20 text-red-400"
                        : task.priority === "medium"
                        ? "bg-amber-500/20 text-amber-400"
                        : "bg-emerald-500/20 text-emerald-400"
                    }`}
                  >
                    {task.priority}
                  </span>

                  <button
                    onClick={() => handleOpenEditModal(task)}
                    className="text-gray-500 hover:text-purple-400 p-1 rounded-lg hover:bg-purple-500/10 transition-all"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => deleteTask(task.id)}
                    className="text-gray-500 hover:text-red-400 p-1 rounded-lg hover:bg-red-500/10 transition-all"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* FIXED + Floating Action Button: Aligned Exactly Above Floating AI Button */}
      <button
        onClick={handleOpenAddModal}
        className="fixed right-4 bottom-[90px] w-12 h-12 rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white flex items-center justify-center shadow-xl shadow-purple-900/60 hover:scale-105 active:scale-95 transition-all z-40 border border-purple-400/30"
      >
        <Plus className="w-6 h-6" />
      </button>

      {/* Add / Edit Task Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#181524] border border-gray-800 rounded-2xl w-full max-w-md p-5 space-y-4 shadow-2xl">
            <div className="flex justify-between items-center border-b border-gray-800 pb-3">
              <h3 className="font-bold text-lg">
                {editingTask ? "Edit Task" : "Add New Task"}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-400 mb-1">
                  Task Title
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Read 20 pages or Check emails"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-[#0D0B14] border border-gray-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-purple-500"
                />
              </div>

              {/* Daily Routine Checkbox */}
              <div className="flex items-center justify-between p-3 rounded-xl bg-[#0D0B14] border border-gray-800">
                <div>
                  <h4 className="text-sm font-semibold">Daily Routine Task</h4>
                  <p className="text-[11px] text-gray-400">
                    Resets every 24 hours & tracks pending state from yesterday
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={isDaily}
                  onChange={(e) => setIsDaily(e.target.checked)}
                  className="w-5 h-5 accent-purple-600 cursor-pointer"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-1">
                    Priority
                  </label>
                  <select
                    value={priority}
                    onChange={(e: any) => setPriority(e.target.value)}
                    className="w-full bg-[#0D0B14] border border-gray-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-purple-500"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-1">
                    Scheduled Time
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 9:00 AM or Everyday"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    className="w-full bg-[#0D0B14] border border-gray-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-purple-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-400 mb-1">
                  Project
                </label>
                <select
                  value={project}
                  onChange={(e) => setProject(e.target.value)}
                  className="w-full bg-[#0D0B14] border border-gray-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-purple-500"
                >
                  <option value="General">General</option>
                  {projects.map((p) => (
                    <option key={p.id} value={p.title}>
                      {p.title}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 bg-gray-800 text-gray-300 py-2.5 rounded-xl text-sm font-medium hover:bg-gray-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-purple-600 text-white py-2.5 rounded-xl text-sm font-medium hover:bg-purple-500 transition-colors"
                >
                  {editingTask ? "Save Changes" : "Create Task"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}