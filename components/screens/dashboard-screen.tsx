"use client";

import React, { useState, useRef } from "react";
import { useStore, Project } from "@/lib/storage";
import {
  Menu,
  Bell,
  Plus,
  FolderPlus,
  Upload,
  Sparkles,
  CheckCircle2,
  Circle,
  Flame,
  X,
  ChevronRight,
  Edit2,
  Check,
  LayoutDashboard,
  FolderKanban,
  CheckSquare,
  FolderLock,
  BarChart3,
  Settings,
  Info,
  LogOut,
} from "lucide-react";

const DAYS_OF_WEEK = ["M", "T", "W", "T", "F", "S", "S"];

interface DashboardProps {
  onNavigate?: (screen: string) => void;
}

export function DashboardScreen({ onNavigate }: DashboardProps) {
  const {
    tasks,
    projects,
    documents,
    addTask,
    addProject,
    addDocument,
    toggleTask,
    updateProject,
  } = useStore();

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Active Modals State
  const [activeModal, setActiveModal] = useState<
    "none" | "task" | "project" | "doc" | "mission" | "menu" | "notifications" | "settings" | "about"
  >("none");

  // AI Suggestion State
  const [aiDismissed, setAiDismissed] = useState(false);
  const [aiApplied, setAiApplied] = useState(false);

  // Today's Mission State
  const [missionTitle, setMissionTitle] = useState(
    "Complete the onboarding flow and ship landing page update"
  );
  const [missionProgress, setMissionProgress] = useState(65);
  const [editingMissionTitle, setEditingMissionTitle] = useState(missionTitle);
  const [editingMissionProgress, setEditingMissionProgress] =
    useState(missionProgress);

  // Form States
  const [taskTitle, setTaskTitle] = useState("");
  const [taskPriority, setTaskPriority] = useState<"high" | "medium" | "low">(
    "medium"
  );
  const [taskProject, setTaskProject] = useState("");

  const [projectTitle, setProjectTitle] = useState("");
  const [projectPriority, setProjectPriority] = useState<
    "high" | "medium" | "low"
  >("medium");
  const [projectDueDate, setProjectDueDate] = useState("");
  const [projectTotalTasks, setProjectTotalTasks] = useState(10);

  const [docName, setDocName] = useState("");
  const [docCategory, setDocCategory] = useState("Certificates");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  // Tracking weekly checks per project: { [projectId]: boolean[] }
  const [weeklyProjectChecks, setWeeklyProjectChecks] = useState<
    Record<string, boolean[]>
  >({});

  // Dynamic Metrics Calculations
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((t) => t.completed).length;
  const pendingTasks = tasks.filter((t) => !t.completed);
  const score =
    totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 82;

  // Toggle dynamic day checkbox (M T W T F S S)
  const handleToggleProjectDay = (projectId: string, dayIndex: number) => {
    const currentChecks =
      weeklyProjectChecks[projectId] || [
        false,
        false,
        false,
        false,
        false,
        false,
        false,
      ];
    const updatedChecks = [...currentChecks];
    updatedChecks[dayIndex] = !updatedChecks[dayIndex];

    setWeeklyProjectChecks({
      ...weeklyProjectChecks,
      [projectId]: updatedChecks,
    });

    const workedAnyDay = updatedChecks.some(Boolean);
    updateProject(projectId, { workedToday: workedAnyDay });
  };

  // Toggle individual task box on Project Card (Updates Progress %)
  const handleToggleSubTaskBox = (project: Project, taskIndex: number) => {
    const isCurrentlyDone = taskIndex < project.completedTasks;
    const newCompletedCount = isCurrentlyDone
      ? Math.max(0, project.completedTasks - 1)
      : Math.min(project.totalTasks, project.completedTasks + 1);

    const newProgress =
      project.totalTasks > 0
        ? Math.round((newCompletedCount / project.totalTasks) * 100)
        : 0;

    updateProject(project.id, {
      completedTasks: newCompletedCount,
      progress: newProgress,
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      setDocName(file.name);
    }
  };

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskTitle.trim()) return;

    addTask({
      title: taskTitle,
      priority: taskPriority,
      completed: false,
      project: taskProject || "General",
      time: "Today",
    });

    setTaskTitle("");
    setActiveModal("none");
  };

  const handleCreateProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!projectTitle.trim()) return;

    addProject({
      title: projectTitle,
      priority: projectPriority,
      dueDate: projectDueDate || "Ongoing",
      progress: 0,
      totalTasks: Number(projectTotalTasks) || 10,
      completedTasks: 0,
      workedToday: false,
    });

    setProjectTitle("");
    setProjectDueDate("");
    setProjectTotalTasks(10);
    setActiveModal("none");
  };

  const handleCreateDoc = (e: React.FormEvent) => {
    e.preventDefault();
    if (!docName.trim()) return;

    const formattedSize = selectedFile
      ? `${(selectedFile.size / (1024 * 1024)).toFixed(1)} MB`
      : "1.2 MB";

    addDocument({
      name: docName,
      category: docCategory,
      size: formattedSize,
    });

    setDocName("");
    setSelectedFile(null);
    setActiveModal("none");
  };

  const handleSaveMission = (e: React.FormEvent) => {
    e.preventDefault();
    setMissionTitle(editingMissionTitle);
    setMissionProgress(editingMissionProgress);
    setActiveModal("none");
  };

  const navigateTo = (screen: string) => {
    if (onNavigate) {
      onNavigate(screen);
    }
  };

  return (
    <div className="flex-1 overflow-y-auto px-4 pt-4 pb-32 text-white bg-[#0D0B14] space-y-6 no-scrollbar">
      {/* 1. Header */}
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={() => setActiveModal("menu")}
          className="w-10 h-10 rounded-full bg-[#181524] border border-gray-800 flex items-center justify-center text-gray-300 hover:text-white transition-all active:scale-95"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setActiveModal("notifications")}
            className="relative w-10 h-10 rounded-full bg-[#181524] border border-gray-800 flex items-center justify-center text-gray-300 hover:text-white transition-all active:scale-95"
          >
            <Bell className="w-5 h-5" />
            <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-purple-500 animate-pulse" />
          </button>
          
          <button
            type="button"
            onClick={() => navigateTo("profile")}
            className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-500 to-indigo-600 p-0.5 border border-purple-400/40 transition-all active:scale-95"
          >
            <div className="w-full h-full rounded-full bg-gray-800 flex items-center justify-center font-bold text-xs text-purple-300">
              MC
            </div>
          </button>
        </div>
      </div>

      {/* Greeting */}
      <div>
        <p className="text-sm text-gray-400 font-medium">Good morning,</p>
        <h1 className="text-2xl font-bold">Maya Chen</h1>
      </div>

      {/* 2. Productivity Score Card */}
      <div className="p-5 rounded-3xl bg-[#161322] border border-gray-800/80 flex items-center gap-4 shadow-lg">
        <div className="relative w-20 h-20 flex-shrink-0 flex items-center justify-center">
          <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
            <path
              className="text-gray-800"
              strokeWidth="3.5"
              stroke="currentColor"
              fill="none"
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
            />
            <path
              className="text-purple-500 transition-all duration-500"
              strokeDasharray={`${score}, 100`}
              strokeWidth="3.5"
              strokeLinecap="round"
              stroke="currentColor"
              fill="none"
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-xl font-bold">{score}</span>
            <span className="text-[9px] text-gray-400 -mt-1">score</span>
          </div>
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h2 className="text-base font-bold">Productivity Score</h2>
            <span className="bg-emerald-500/20 text-emerald-400 text-[10px] font-semibold px-2 py-0.5 rounded-full flex items-center gap-0.5">
              ↗ 12%
            </span>
          </div>
          <p className="text-xs text-gray-400 leading-relaxed">
            You&apos;re outperforming last week. {pendingTasks.length} tasks left
            to hit your daily goal.
          </p>
        </div>
      </div>

      {/* 3. Quick Action Buttons Grid */}
      <div className="grid grid-cols-4 gap-3">
        <button
          type="button"
          onClick={() => setActiveModal("task")}
          className="flex flex-col items-center gap-2 group"
        >
          <div className="w-14 h-14 rounded-full bg-[#1C152B] border border-purple-900/40 flex items-center justify-center text-purple-400 group-hover:scale-105 transition-all">
            <Plus className="w-6 h-6" />
          </div>
          <span className="text-xs text-gray-400 group-hover:text-white">
            Add Task
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveModal("project")}
          className="flex flex-col items-center gap-2 group"
        >
          <div className="w-14 h-14 rounded-full bg-[#1C152B] border border-purple-900/40 flex items-center justify-center text-purple-400 group-hover:scale-105 transition-all">
            <FolderPlus className="w-6 h-6" />
          </div>
          <span className="text-xs text-gray-400 group-hover:text-white">
            Add Project
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveModal("doc")}
          className="flex flex-col items-center gap-2 group"
        >
          <div className="w-14 h-14 rounded-full bg-[#13221C] border border-emerald-900/40 flex items-center justify-center text-emerald-400 group-hover:scale-105 transition-all">
            <Upload className="w-6 h-6" />
          </div>
          <span className="text-xs text-gray-400 group-hover:text-white">
            Upload Doc
          </span>
        </button>

        <button
          type="button"
          onClick={() => navigateTo("ai")}
          className="flex flex-col items-center gap-2 group"
        >
          <div className="w-14 h-14 rounded-full bg-[#291728] border border-pink-900/40 flex items-center justify-center text-pink-400 group-hover:scale-105 transition-all">
            <Sparkles className="w-6 h-6" />
          </div>
          <span className="text-xs text-gray-400 group-hover:text-white">
            Ask AI
          </span>
        </button>
      </div>

      {/* 4. Projects Carousel */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold">Projects</h2>
          <button
            type="button"
            onClick={() => navigateTo("projects")}
            className="text-xs text-gray-400 hover:text-white flex items-center gap-1 cursor-pointer"
          >
            See all <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="flex gap-4 overflow-x-auto pb-3 pt-1 no-scrollbar snap-x touch-pan-x">
          {projects.length === 0 ? (
            <div className="w-full p-6 rounded-2xl bg-[#161322] border border-gray-800 text-gray-500 text-xs text-center">
              No projects yet. Click &quot;Add Project&quot; above to create one!
            </div>
          ) : (
            projects.map((project) => {
              const dayChecks =
                weeklyProjectChecks[project.id] || [
                  false,
                  false,
                  false,
                  false,
                  false,
                  false,
                  false,
                ];

              return (
                <div
                  key={project.id}
                  className="w-80 flex-shrink-0 snap-start p-4 rounded-2xl bg-[#161322] border border-gray-800/80 space-y-4 shadow-md"
                >
                  <div className="flex items-center justify-between">
                    <div className="w-7 h-7 rounded-full bg-purple-950 border border-purple-800 flex items-center justify-center text-purple-400 text-xs">
                      ✦
                    </div>
                    {project.priority === "high" && (
                      <span className="bg-red-500/20 text-red-400 text-[10px] font-semibold px-2 py-0.5 rounded-full flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-red-400" /> High
                      </span>
                    )}
                  </div>

                  <div>
                    <h3 className="font-bold text-sm truncate">{project.title}</h3>
                    <p className="text-xs text-gray-400 mt-0.5">
                      Due {project.dueDate}
                    </p>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs text-gray-400 mb-1">
                      <span>Progress ({project.completedTasks}/{project.totalTasks} Tasks)</span>
                      <span className="text-purple-400 font-bold">
                        {project.progress}%
                      </span>
                    </div>
                    <div className="w-full h-2 bg-gray-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full transition-all duration-300"
                        style={{ width: `${project.progress}%` }}
                      />
                    </div>
                  </div>

                  <div className="pt-2 border-t border-gray-800/60">
                    <span className="text-[10px] text-gray-400 font-medium block mb-1">
                      Worked Days:
                    </span>
                    <div className="flex items-center justify-between gap-1">
                      {DAYS_OF_WEEK.map((dayLabel, idx) => {
                        const isChecked = dayChecks[idx];
                        return (
                          <button
                            key={idx}
                            type="button"
                            onClick={() =>
                              handleToggleProjectDay(project.id, idx)
                            }
                            className="flex flex-col items-center gap-1"
                          >
                            <span className="text-[9px] text-gray-500 font-bold">
                              {dayLabel}
                            </span>
                            <div
                              className={`w-5 h-5 rounded-full flex items-center justify-center transition-all ${
                                isChecked
                                  ? "bg-purple-600 text-white"
                                  : "bg-[#0D0B14] border border-gray-700 hover:border-purple-500"
                              }`}
                            >
                              {isChecked && (
                                <Check className="w-3 h-3 stroke-[3]" />
                              )}
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div className="pt-2 border-t border-gray-800/60">
                    <span className="text-[10px] text-gray-400 font-medium block mb-1.5">
                      Task Tracker ({project.totalTasks} Total Boxes):
                    </span>
                    <div className="flex flex-wrap gap-1.5 max-h-20 overflow-y-auto no-scrollbar">
                      {Array.from({ length: project.totalTasks }).map((_, boxIdx) => {
                        const isDone = boxIdx < project.completedTasks;
                        return (
                          <button
                            key={boxIdx}
                            type="button"
                            onClick={() =>
                              handleToggleSubTaskBox(project, boxIdx)
                            }
                            title={`Task ${boxIdx + 1}`}
                            className={`w-6 h-6 rounded-md flex items-center justify-center text-[10px] font-bold transition-all ${
                              isDone
                                ? "bg-purple-600 text-white border border-purple-400/50 shadow-sm"
                                : "bg-[#0D0B14] border border-gray-800 text-gray-500 hover:border-purple-500/50"
                            }`}
                          >
                            {boxIdx + 1}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* 5. Today's Tasks Section */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold">Today&apos;s Tasks</h2>
          <button
            type="button"
            onClick={() => navigateTo("tasks")}
            className="text-xs text-gray-400 hover:text-white flex items-center gap-1 cursor-pointer"
          >
            See all <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="p-4 rounded-2xl bg-[#161322] border border-gray-800/80 space-y-4">
          {tasks.length === 0 ? (
            <p className="text-xs text-gray-500 text-center py-2">
              No tasks for today. Click &quot;Add Task&quot; above to create one.
            </p>
          ) : (
            tasks.slice(0, 4).map((task) => (
              <div
                key={task.id}
                className="flex items-center justify-between gap-3 border-b border-gray-800/50 pb-3 last:border-0 last:pb-0"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <button
                    type="button"
                    onClick={() => toggleTask(task.id)}
                    className="text-gray-500 hover:text-purple-400 transition-colors"
                  >
                    {task.completed ? (
                      <CheckCircle2 className="w-5 h-5 text-purple-400 fill-purple-500/20" />
                    ) : (
                      <Circle className="w-5 h-5 text-gray-600" />
                    )}
                  </button>
                  <div className="min-w-0">
                    <h4
                      className={`text-sm font-semibold truncate ${
                        task.completed ? "line-through text-gray-500" : "text-white"
                      }`}
                    >
                      {task.title}
                    </h4>
                    <p className="text-xs text-gray-400">
                      {task.time} · {task.project}
                    </p>
                  </div>
                </div>

                <span
                  className={`w-2 h-2 rounded-full flex-shrink-0 ${
                    task.priority === "high"
                      ? "bg-red-500"
                      : task.priority === "medium"
                      ? "bg-amber-400"
                      : "bg-emerald-400"
                  }`}
                />
              </div>
            ))
          )}
        </div>
      </div>

      {/* 6. Editable Today's Mission Banner */}
      <div className="p-4 rounded-2xl bg-[#161322] border border-gray-800/80 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-purple-950 border border-purple-800 flex items-center justify-center text-purple-400 text-xs">
              ✓
            </div>
            <h3 className="font-bold text-sm">Today&apos;s Mission</h3>
          </div>
          <button
            type="button"
            onClick={() => {
              setEditingMissionTitle(missionTitle);
              setEditingMissionProgress(missionProgress);
              setActiveModal("mission");
            }}
            className="text-gray-400 hover:text-purple-400 p-1 rounded"
            title="Edit Mission"
          >
            <Edit2 className="w-4 h-4" />
          </button>
        </div>

        <p className="text-xs text-gray-300 leading-relaxed">{missionTitle}</p>

        <div>
          <div className="flex justify-between text-[10px] text-gray-400 mb-1">
            <span>Mission Goal</span>
            <span className="text-purple-400 font-bold">{missionProgress}%</span>
          </div>
          <div className="w-full h-1.5 bg-gray-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-purple-500 rounded-full transition-all duration-300"
              style={{ width: `${missionProgress}%` }}
            />
          </div>
        </div>
      </div>

      {/* --- OVERLAY MODALS (Properly Aligned & Complete Sidebar with Settings/About) --- */}

      {/* Modal: Workspace Menu Sidebar */}
      {activeModal === "menu" && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-md z-[999] flex justify-start">
          <div className="bg-[#181524] border-r border-purple-900/50 w-72 h-full p-5 space-y-4 shadow-2xl overflow-y-auto no-scrollbar pt-12 pb-28">
            <div className="flex justify-between items-center border-b border-gray-800 pb-3">
              <h3 className="font-bold text-base text-white">Workspace Menu</h3>
              <button
                type="button"
                onClick={() => setActiveModal("none")}
                className="w-8 h-8 rounded-full bg-[#0D0B14] flex items-center justify-center text-gray-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Top Workspace Identity Card */}
            <div className="p-3 rounded-2xl bg-[#12101A] border border-purple-900/30 flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-purple-600/20 border border-purple-500/40 flex items-center justify-center text-purple-400">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white">TaskPilot AI</h4>
                <p className="text-[10px] text-gray-400">Pro Workspace</p>
              </div>
            </div>

            {/* User Account Snippet */}
            <div className="p-3 rounded-2xl bg-[#12101A] border border-gray-800 flex items-center gap-3 cursor-pointer" onClick={() => { setActiveModal("none"); navigateTo("profile"); }}>
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-purple-600 to-indigo-500 flex items-center justify-center text-xs font-bold text-white">
                MC
              </div>
              <div className="min-w-0">
                <h4 className="text-xs font-bold text-white truncate">Maya Chen</h4>
                <p className="text-[10px] text-gray-400 truncate">maya@taskpilot.ai</p>
              </div>
            </div>

            {/* Navigation Links */}
            <div className="space-y-1.5 pt-2">
              <button
                type="button"
                onClick={() => { setActiveModal("none"); navigateTo("dashboard"); }}
                className="w-full flex items-center gap-3 p-3 rounded-2xl bg-purple-950/40 border border-purple-500/40 text-xs font-semibold text-white"
              >
                <LayoutDashboard className="w-4 h-4 text-purple-400" /> Dashboard
              </button>
              <button
                type="button"
                onClick={() => { setActiveModal("none"); navigateTo("projects"); }}
                className="w-full flex items-center gap-3 p-3 rounded-2xl hover:bg-[#12101A] text-xs font-medium text-gray-300 transition-colors"
              >
                <FolderKanban className="w-4 h-4 text-gray-400" /> Projects
              </button>
              <button
                type="button"
                onClick={() => { setActiveModal("none"); navigateTo("tasks"); }}
                className="w-full flex items-center gap-3 p-3 rounded-2xl hover:bg-[#12101A] text-xs font-medium text-gray-300 transition-colors"
              >
                <CheckSquare className="w-4 h-4 text-gray-400" /> Tasks
              </button>
              <button
                type="button"
                onClick={() => { setActiveModal("none"); navigateTo("vault"); }}
                className="w-full flex items-center gap-3 p-3 rounded-2xl hover:bg-[#12101A] text-xs font-medium text-gray-300 transition-colors"
              >
                <FolderLock className="w-4 h-4 text-gray-400" /> Vault
              </button>
              <button
                type="button"
                onClick={() => { setActiveModal("none"); navigateTo("ai"); }}
                className="w-full flex items-center gap-3 p-3 rounded-2xl hover:bg-[#12101A] text-xs font-medium text-gray-300 transition-colors"
              >
                <Sparkles className="w-4 h-4 text-gray-400" /> AI Assistant
              </button>
              <button
                type="button"
                onClick={() => { setActiveModal("none"); navigateTo("stats"); }}
                className="w-full flex items-center gap-3 p-3 rounded-2xl hover:bg-[#12101A] text-xs font-medium text-gray-300 transition-colors"
              >
                <BarChart3 className="w-4 h-4 text-gray-400" /> Analytics
              </button>
              <button
                type="button"
                onClick={() => { setActiveModal("none"); navigateTo("habits"); }}
                className="w-full flex items-center gap-3 p-3 rounded-2xl hover:bg-[#12101A] text-xs font-medium text-gray-300 transition-colors"
              >
                <Flame className="w-4 h-4 text-gray-400" /> Habits
              </button>
            </div>

            {/* Extra Menu Items: Settings & About */}
            <div className="space-y-1.5 pt-2 border-t border-gray-800">
              <button
                type="button"
                onClick={() => { setActiveModal("settings"); }}
                className="w-full flex items-center gap-3 p-3 rounded-2xl hover:bg-[#12101A] text-xs font-medium text-gray-300 transition-colors"
              >
                <Settings className="w-4 h-4 text-gray-400" /> Settings
              </button>
              <button
                type="button"
                onClick={() => { setActiveModal("about"); }}
                className="w-full flex items-center gap-3 p-3 rounded-2xl hover:bg-[#12101A] text-xs font-medium text-gray-300 transition-colors"
              >
                <Info className="w-4 h-4 text-gray-400" /> About
              </button>
            </div>

            {/* Logout Button */}
            <div className="pt-2 border-t border-gray-800">
              <button
                type="button"
                onClick={() => { setActiveModal("none"); alert("Logged out successfully."); }}
                className="w-full flex items-center gap-2 p-3 rounded-2xl bg-red-500/10 border border-red-500/30 text-xs font-semibold text-red-400 hover:bg-red-500/20 transition-all"
              >
                <LogOut className="w-4 h-4" /> Logout
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Notifications (Properly aligned at the top/center so it never overlaps the bottom nav) */}
      {activeModal === "notifications" && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-md z-[999] flex items-start justify-center pt-20 px-4 pb-28 overflow-y-auto">
          <div className="bg-[#181524] border border-purple-900/50 rounded-3xl w-full max-w-sm p-5 space-y-4 shadow-2xl">
            <div className="flex justify-between items-center border-b border-gray-800 pb-3">
              <h3 className="font-bold text-sm text-white">Notifications</h3>
              <button
                type="button"
                onClick={() => setActiveModal("none")}
                className="w-7 h-7 rounded-full bg-[#0D0B14] flex items-center justify-center text-gray-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="space-y-2.5">
              <div className="p-3 rounded-2xl bg-[#0D0B14] border border-gray-800 text-xs text-gray-300">
                <p className="font-bold text-white">Task Milestone Reached</p>
                <p className="text-[10px] text-gray-400 mt-0.5">You completed {completedTasks} tasks today. Keep up the momentum!</p>
              </div>
              <div className="p-3 rounded-2xl bg-[#0D0B14] border border-gray-800 text-xs text-gray-300">
                <p className="font-bold text-white">Vault Security Synced</p>
                <p className="text-[10px] text-gray-400 mt-0.5">{documents.length} documents safely stored.</p>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Modal: Settings */}
      {activeModal === "settings" && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-md z-[999] flex items-center justify-center p-4 pb-28">
          <div className="bg-[#181524] border border-purple-900/50 rounded-3xl w-full max-w-sm p-5 space-y-4 shadow-2xl">
            <div className="flex justify-between items-center border-b border-gray-800 pb-3">
              <h3 className="font-bold text-sm text-white">Settings</h3>
              <button onClick={() => setActiveModal("none")} className="w-7 h-7 rounded-full bg-[#0D0B14] flex items-center justify-center text-gray-400 hover:text-white"><X className="w-4 h-4" /></button>
            </div>
            <div className="space-y-3 text-xs text-gray-300">
              <div className="flex items-center justify-between p-3 rounded-2xl bg-[#0D0B14] border border-gray-800">
                <span>Push Notifications</span>
                <span className="text-purple-400 font-semibold">Enabled</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-2xl bg-[#0D0B14] border border-gray-800">
                <span>Dark Neon Theme</span>
                <span className="text-purple-400 font-semibold">Active</span>
              </div>
            </div>
            <button onClick={() => setActiveModal("none")} className="w-full bg-purple-600 text-white py-2.5 rounded-xl text-xs font-semibold">Close</button>
          </div>
        </div>
      )}

      {/* Modal: About */}
      {activeModal === "about" && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-md z-[999] flex items-center justify-center p-4 pb-28">
          <div className="bg-[#181524] border border-purple-900/50 rounded-3xl w-full max-w-sm p-5 space-y-4 shadow-2xl text-center">
            <div className="flex justify-between items-center border-b border-gray-800 pb-3">
              <h3 className="font-bold text-sm text-white">About TaskPilot AI</h3>
              <button onClick={() => setActiveModal("none")} className="w-7 h-7 rounded-full bg-[#0D0B14] flex items-center justify-center text-gray-400 hover:text-white"><X className="w-4 h-4" /></button>
            </div>
            <div className="p-4 rounded-2xl bg-[#0D0B14] border border-gray-800 text-xs text-gray-300 space-y-2">
              <p className="font-bold text-white text-sm">TaskPilot AI v2.4</p>
              <p className="text-gray-400">Your intelligent workspace manager designed for peak developer and designer productivity.</p>
            </div>
            <button onClick={() => setActiveModal("none")} className="w-full bg-purple-600 text-white py-2.5 rounded-xl text-xs font-semibold">Close</button>
          </div>
        </div>
      )}

      {/* Modal: Add Task */}
      {activeModal === "task" && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-md z-[999] flex items-center justify-center p-4 pb-28">
          <div className="bg-[#181524] border border-purple-900/50 rounded-3xl w-full max-w-sm p-5 space-y-4 shadow-2xl">
            <div className="flex justify-between items-center border-b border-gray-800 pb-3">
              <h3 className="font-bold text-sm">Add Task</h3>
              <button onClick={() => setActiveModal("none")} className="text-gray-400 hover:text-white"><X className="w-4 h-4" /></button>
            </div>
            <form onSubmit={handleCreateTask} className="space-y-4">
              <div>
                <label className="block text-xs text-gray-400 mb-1">Task Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ship landing page copy"
                  value={taskTitle}
                  onChange={(e) => setTaskTitle(e.target.value)}
                  className="w-full bg-[#0D0B14] border border-gray-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-purple-500"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-gray-400 mb-1">Priority</label>
                  <select
                    value={taskPriority}
                    onChange={(e: any) => setTaskPriority(e.target.value)}
                    className="w-full bg-[#0D0B14] border border-gray-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-gray-400 mb-1">Project</label>
                  <select
                    value={taskProject}
                    onChange={(e) => setTaskProject(e.target.value)}
                    className="w-full bg-[#0D0B14] border border-gray-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                  >
                    <option value="General">General</option>
                    {projects.map((p) => (
                      <option key={p.id} value={p.title}>
                        {p.title}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setActiveModal("none")} className="flex-1 bg-gray-800 text-gray-300 py-2.5 rounded-xl text-xs font-semibold">Cancel</button>
                <button type="submit" className="flex-1 bg-purple-600 text-white py-2.5 rounded-xl text-xs font-semibold hover:bg-purple-500 transition-colors">Create Task</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Add Project */}
      {activeModal === "project" && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-md z-[999] flex items-center justify-center p-4 pb-28">
          <div className="bg-[#181524] border border-purple-900/50 rounded-3xl w-full max-w-sm p-5 space-y-4 shadow-2xl">
            <div className="flex justify-between items-center border-b border-gray-800 pb-3">
              <h3 className="font-bold text-sm">New Project</h3>
              <button onClick={() => setActiveModal("none")} className="text-gray-400 hover:text-white"><X className="w-4 h-4" /></button>
            </div>
            <form onSubmit={handleCreateProject} className="space-y-4">
              <div>
                <label className="block text-xs text-gray-400 mb-1">Project Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Mobile App Redesign"
                  value={projectTitle}
                  onChange={(e) => setProjectTitle(e.target.value)}
                  className="w-full bg-[#0D0B14] border border-gray-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-purple-500"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-gray-400 mb-1">Priority</label>
                  <select
                    value={projectPriority}
                    onChange={(e: any) => setProjectPriority(e.target.value)}
                    className="w-full bg-[#0D0B14] border border-gray-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-gray-400 mb-1">Total Tasks</label>
                  <input
                    type="number"
                    min="1"
                    max="50"
                    value={projectTotalTasks}
                    onChange={(e) => setProjectTotalTasks(Number(e.target.value))}
                    className="w-full bg-[#0D0B14] border border-gray-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs text-gray-400 mb-1">Due Date</label>
                <input
                  type="text"
                  placeholder="e.g. Aug 24"
                  value={projectDueDate}
                  onChange={(e) => setProjectDueDate(e.target.value)}
                  className="w-full bg-[#0D0B14] border border-gray-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                />
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setActiveModal("none")} className="flex-1 bg-gray-800 text-gray-300 py-2.5 rounded-xl text-xs font-semibold">Cancel</button>
                <button type="submit" className="flex-1 bg-purple-600 text-white py-2.5 rounded-xl text-xs font-semibold hover:bg-purple-500 transition-colors">Create Project</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Upload Document */}
      {activeModal === "doc" && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-md z-[999] flex items-center justify-center p-4 pb-28">
          <div className="bg-[#181524] border border-emerald-900/50 rounded-3xl w-full max-w-sm p-5 space-y-4 shadow-2xl">
            <div className="flex justify-between items-center border-b border-gray-800 pb-3">
              <h3 className="font-bold text-sm">Upload Document</h3>
              <button onClick={() => setActiveModal("none")} className="text-gray-400 hover:text-white"><X className="w-4 h-4" /></button>
            </div>
            <form onSubmit={handleCreateDoc} className="space-y-4">
              <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" />
              <div
                onClick={() => fileInputRef.current?.click()}
                className="p-4 rounded-xl border-2 border-dashed border-emerald-500/40 bg-[#0D0B14] flex flex-col items-center justify-center gap-2 cursor-pointer hover:border-emerald-400 transition-all"
              >
                <Upload className="w-6 h-6 text-emerald-400" />
                <span className="text-xs text-emerald-300 font-medium">
                  {selectedFile ? `Selected: ${selectedFile.name}` : "Tap to select file from device"}
                </span>
              </div>
              <div>
                <label className="block text-xs text-gray-400 mb-1">Document Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. AWS Certificate.pdf"
                  value={docName}
                  onChange={(e) => setDocName(e.target.value)}
                  className="w-full bg-[#0D0B14] border border-gray-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-purple-500"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-400 mb-1">Category</label>
                <select
                  value={docCategory}
                  onChange={(e) => setDocCategory(e.target.value)}
                  className="w-full bg-[#0D0B14] border border-gray-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                >
                  <option value="Certificates">Certificates</option>
                  <option value="Resume">Resume</option>
                  <option value="Personal">Personal</option>
                </select>
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setActiveModal("none")} className="flex-1 bg-gray-800 text-gray-300 py-2.5 rounded-xl text-xs font-semibold">Cancel</button>
                <button type="submit" className="flex-1 bg-emerald-600 text-white py-2.5 rounded-xl text-xs font-semibold hover:bg-emerald-500 transition-colors">Upload</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Edit Mission */}
      {activeModal === "mission" && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-md z-[999] flex items-center justify-center p-4 pb-28">
          <div className="bg-[#181524] border border-purple-900/50 rounded-3xl w-full max-w-sm p-5 space-y-4 shadow-2xl">
            <div className="flex justify-between items-center border-b border-gray-800 pb-3">
              <h3 className="font-bold text-sm">Edit Today&apos;s Mission</h3>
              <button onClick={() => setActiveModal("none")} className="text-gray-400 hover:text-white"><X className="w-4 h-4" /></button>
            </div>
            <form onSubmit={handleSaveMission} className="space-y-4">
              <div>
                <label className="block text-xs text-gray-400 mb-1">Mission Statement</label>
                <textarea
                  required
                  rows={3}
                  value={editingMissionTitle}
                  onChange={(e) => setEditingMissionTitle(e.target.value)}
                  className="w-full bg-[#0D0B14] border border-gray-800 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-purple-500"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-400 mb-1">Progress Percentage ({editingMissionProgress}%)</label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={editingMissionProgress}
                  onChange={(e) => setEditingMissionProgress(Number(e.target.value))}
                  className="w-full accent-purple-600"
                />
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setActiveModal("none")} className="flex-1 bg-gray-800 text-gray-300 py-2.5 rounded-xl text-xs font-semibold">Cancel</button>
                <button type="submit" className="flex-1 bg-purple-600 text-white py-2.5 rounded-xl text-xs font-semibold hover:bg-purple-500 transition-colors">Save Mission</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}