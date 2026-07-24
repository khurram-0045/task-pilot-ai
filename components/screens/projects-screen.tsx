"use client";

import React, { useState } from "react";
import { useStore, Project } from "@/lib/storage";
import {
  Search,
  Plus,
  Minus,
  CheckCircle2,
  Calendar,
  Trash2,
  Edit2,
  X,
  Check,
} from "lucide-react";

export function ProjectsScreen() {
  const {
    projects,
    addProject,
    updateProject,
    toggleProjectWorkedToday,
    deleteProject,
  } = useStore();

  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<"all" | "active" | "high" | "done">(
    "all"
  );

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);

  // Form State
  const [title, setTitle] = useState("");
  const [priority, setPriority] = useState<"high" | "medium" | "low">("medium");
  const [dueDate, setDueDate] = useState("");
  const [totalTasks, setTotalTasks] = useState(10);
  const [completedTasks, setCompletedTasks] = useState(0);

  // Filter projects based on Search and Tab
  const filteredProjects = projects.filter((project) => {
    const matchesSearch = project.title
      .toLowerCase()
      .includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;

    if (activeTab === "active") return project.progress < 100;
    if (activeTab === "high") return project.priority === "high";
    if (activeTab === "done") return project.progress === 100;
    return true;
  });

  // Overall progress average across all projects
  const totalProgressSum = projects.reduce((acc, p) => acc + p.progress, 0);
  const averageProgress =
    projects.length > 0 ? Math.round(totalProgressSum / projects.length) : 0;

  // Open modal for Adding
  const handleOpenAddModal = () => {
    setEditingProject(null);
    setTitle("");
    setPriority("medium");
    setDueDate("");
    setTotalTasks(10);
    setCompletedTasks(0);
    setIsModalOpen(true);
  };

  // Open modal for Editing
  const handleOpenEditModal = (project: Project) => {
    setEditingProject(project);
    setTitle(project.title);
    setPriority(project.priority);
    setDueDate(project.dueDate);
    setTotalTasks(project.totalTasks);
    setCompletedTasks(project.completedTasks);
    setIsModalOpen(true);
  };

  // Quick Increment Completed Task (+1)
  const handleIncrementTask = (project: Project) => {
    if (project.completedTasks >= project.totalTasks) return;
    const newCompleted = project.completedTasks + 1;
    const newProgress = Math.round((newCompleted / project.totalTasks) * 100);

    updateProject(project.id, {
      completedTasks: newCompleted,
      progress: newProgress,
      workedToday: true,
    });
  };

  // Quick Decrement Completed Task (-1)
  const handleDecrementTask = (project: Project) => {
    if (project.completedTasks <= 0) return;
    const newCompleted = project.completedTasks - 1;
    const newProgress = Math.round((newCompleted / project.totalTasks) * 100);

    updateProject(project.id, {
      completedTasks: newCompleted,
      progress: newProgress,
    });
  };

  // Form Submit
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const computedProgress =
      totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

    if (editingProject) {
      updateProject(editingProject.id, {
        title,
        priority,
        dueDate: dueDate || "Ongoing",
        totalTasks: Number(totalTasks),
        completedTasks: Number(completedTasks),
        progress: Math.min(100, Math.max(0, computedProgress)),
      });
    } else {
      addProject({
        title,
        priority,
        dueDate: dueDate || "Ongoing",
        progress: Math.min(100, Math.max(0, computedProgress)),
        totalTasks: Number(totalTasks) || 10,
        completedTasks: Number(completedTasks) || 0,
        workedToday: false,
      });
    }

    setIsModalOpen(false);
  };

  return (
    <div className="relative flex-1 overflow-y-auto px-4 pt-4 pb-28 text-white bg-[#0D0B14]">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-2xl font-bold">Projects</h1>
          <p className="text-xs text-gray-400">
            {projects.length} active projects
          </p>
        </div>
      </div>

      {/* Weekly Progress Banner */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-purple-900/40 to-indigo-900/30 border border-purple-500/20 mb-6 flex items-center justify-between">
        <div>
          <h3 className="font-semibold text-sm">Weekly Progress</h3>
          <p className="text-xs text-gray-400 mt-1 max-w-[200px]">
            Across all projects, you&apos;ve advanced key milestones this week.
          </p>
        </div>
        <div className="relative w-16 h-16 flex items-center justify-center rounded-full bg-purple-950/80 border-2 border-purple-500 shadow-md shadow-purple-900/30">
          <span className="text-lg font-bold">{averageProgress}%</span>
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          type="text"
          placeholder="Search projects"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-[#181524] border border-gray-800 rounded-xl pl-9 pr-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition-all"
        />
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 mb-6 overflow-x-auto no-scrollbar">
        {(["all", "active", "high", "done"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-1.5 rounded-full text-xs font-medium capitalize transition-all ${
              activeTab === tab
                ? "bg-purple-600 text-white shadow-md shadow-purple-900/40"
                : "bg-[#181524] text-gray-400 border border-gray-800 hover:text-white"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Project Cards List */}
      <div className="space-y-4">
        {filteredProjects.length === 0 ? (
          <div className="text-center py-12 text-gray-500 text-sm">
            No projects found. Tap + to create one.
          </div>
        ) : (
          filteredProjects.map((project) => (
            <div
              key={project.id}
              className="p-4 rounded-2xl bg-[#161322] border border-gray-800/80 hover:border-purple-500/30 transition-all space-y-3 shadow-sm"
            >
              {/* Card Header */}
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="font-semibold text-base flex items-center gap-2">
                    {project.title}
                    {project.progress === 100 && (
                      <span className="bg-emerald-500/20 text-emerald-400 text-[10px] px-2 py-0.5 rounded-full font-bold">
                        DONE
                      </span>
                    )}
                  </h2>
                  <div className="flex items-center gap-2 mt-1 text-xs text-gray-400">
                    <span
                      className={`px-2 py-0.5 rounded-md text-[10px] font-semibold uppercase ${
                        project.priority === "high"
                          ? "bg-red-500/20 text-red-400"
                          : project.priority === "medium"
                          ? "bg-amber-500/20 text-amber-400"
                          : "bg-emerald-500/20 text-emerald-400"
                      }`}
                    >
                      {project.priority}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" /> Due {project.dueDate}
                    </span>
                  </div>
                </div>

                {/* Edit & Delete Action Buttons */}
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleOpenEditModal(project)}
                    className="text-gray-400 hover:text-purple-400 p-1.5 rounded-lg hover:bg-purple-500/10 transition-all"
                    title="Edit Project"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => deleteProject(project.id)}
                    className="text-gray-400 hover:text-red-400 p-1.5 rounded-lg hover:bg-red-500/10 transition-all"
                    title="Delete Project"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Progress Bar & Interactive Counter */}
              <div className="bg-[#0D0B14] p-3 rounded-xl border border-gray-800/60 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-400 font-medium">
                    Tasks Progress:
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-purple-400 font-bold">
                      {project.completedTasks} / {project.totalTasks} tasks
                    </span>

                    {/* Quick + / - Task Tick Controls */}
                    <div className="flex items-center gap-1 bg-[#181524] rounded-lg border border-gray-700/60 p-0.5">
                      <button
                        onClick={() => handleDecrementTask(project)}
                        disabled={project.completedTasks <= 0}
                        className="w-5 h-5 flex items-center justify-center rounded text-gray-400 hover:text-white disabled:opacity-30"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <button
                        onClick={() => handleIncrementTask(project)}
                        disabled={project.completedTasks >= project.totalTasks}
                        className="w-5 h-5 flex items-center justify-center rounded bg-purple-600 text-white hover:bg-purple-500 disabled:opacity-30 transition-all"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Dynamic Progress Bar */}
                <div className="w-full h-2 bg-gray-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full transition-all duration-300"
                    style={{ width: `${project.progress}%` }}
                  />
                </div>
              </div>

              {/* Worked Today Pill Action */}
              <div className="pt-1 flex items-center justify-between">
                <button
                  onClick={() => toggleProjectWorkedToday(project.id)}
                  className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium transition-all ${
                    project.workedToday
                      ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/40"
                      : "bg-gray-800/50 text-gray-400 border border-transparent hover:text-white"
                  }`}
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  {project.workedToday ? "Worked on today" : "Mark worked today"}
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Properly Aligned Floating Action Button (+ Add) */}
      <button
        onClick={handleOpenAddModal}
        className="fixed right-6 bottom-24 w-14 h-14 rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white flex items-center justify-center shadow-xl shadow-purple-900/50 hover:scale-105 active:scale-95 transition-all z-40 border border-purple-400/30"
      >
        <Plus className="w-7 h-7" />
      </button>

      {/* Add / Edit Project Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#181524] border border-gray-800 rounded-2xl w-full max-w-md p-5 space-y-4 shadow-2xl">
            <div className="flex justify-between items-center border-b border-gray-800 pb-3">
              <h3 className="font-bold text-lg">
                {editingProject ? "Edit Project" : "Create New Project"}
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
                  Project Title
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Mobile App Redesign"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-[#0D0B14] border border-gray-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-purple-500"
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
                    Due Date
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Aug 24"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    className="w-full bg-[#0D0B14] border border-gray-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-purple-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-1">
                    Completed Tasks
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={completedTasks}
                    onChange={(e) => setCompletedTasks(Number(e.target.value))}
                    className="w-full bg-[#0D0B14] border border-gray-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-1">
                    Total Tasks
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={totalTasks}
                    onChange={(e) => setTotalTasks(Number(e.target.value))}
                    className="w-full bg-[#0D0B14] border border-gray-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-purple-500"
                  />
                </div>
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
                  {editingProject ? "Save Changes" : "Create Project"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}