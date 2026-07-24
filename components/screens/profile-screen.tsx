"use client";

import React, { useState, useRef } from "react";
import { useStore } from "@/lib/storage";
import {
  Settings,
  Flame,
  Zap,
  Award,
  Crown,
  Target,
  Edit3,
  Camera,
  Bell,
  Palette,
  X,
} from "lucide-react";

export function ProfileScreen() {
  const { tasks, projects, habits, profileImage, setProfileImage } = useStore() as any;

  // Profile Customization State
  const [name, setName] = useState("Maya Chen");
  const [role, setRole] = useState("Product Designer · Pro Member");

  // Settings & Edit Modals State
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(true);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Live Functional Metrics from Global Store
  const totalProjects = projects?.length || 0;
  const completedTasks = tasks?.filter((t: any) => t.completed).length || 0;
  const maxStreak = habits?.reduce((max: number, h: any) => (h.streak > max ? h.streak : max), 0) || 0;

  // Monthly Goals Progress Calculations
  const taskGoalMax = 60;
  const taskProgressPercent = Math.min(100, Math.round((completedTasks / taskGoalMax) * 100));

  const booksGoalMax = 12;
  const booksCompleted = 8;
  const booksProgressPercent = Math.round((booksCompleted / booksGoalMax) * 100);

  const deepWorkGoalMax = 50;
  const deepWorkCompleted = Math.min(50, Math.round(completedTasks * 0.8 + 12));
  const deepWorkProgressPercent = Math.round((deepWorkCompleted / deepWorkGoalMax) * 100);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const url = URL.createObjectURL(file);
      setProfileImage(url); // Save globally so it persists when switching tabs
    }
  };

  return (
    <div className="flex flex-col h-full justify-between px-5 pt-12 pb-24 text-white bg-[#0D0B14] overflow-y-auto no-scrollbar">
      {/* Top Container Area */}
      <div className="flex flex-col flex-1 min-h-0 space-y-4">
        {/* Header Bar */}
        <header className="flex items-center justify-between pb-2 pt-1 flex-shrink-0">
          <button
            type="button"
            onClick={() => setIsEditProfileOpen(true)}
            className="w-10 h-10 rounded-2xl bg-[#161322] border border-gray-800 flex items-center justify-center text-gray-300 hover:text-white transition-all active:scale-95"
          >
            <Edit3 className="w-4 h-4" />
          </button>
          <h1 className="text-base font-bold tracking-tight">Profile</h1>
          <button
            type="button"
            onClick={() => setIsSettingsOpen(true)}
            className="w-10 h-10 rounded-2xl bg-[#161322] border border-gray-800 flex items-center justify-center text-gray-300 hover:text-white transition-all active:scale-95"
          >
            <Settings className="w-4 h-4" />
          </button>
        </header>

        {/* Main User Card with Persistent Image */}
        <div className="p-5 rounded-3xl bg-[#161322] border border-gray-800/80 shadow-2xl flex flex-col items-center text-center space-y-4 flex-shrink-0">
          <div className="relative">
            <div
              onClick={() => fileInputRef.current?.click()}
              className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-500 p-0.5 shadow-lg shadow-purple-900/45 cursor-pointer group overflow-hidden"
            >
              <div className="w-full h-full rounded-[14px] bg-[#0D0B14] flex items-center justify-center overflow-hidden">
                {profileImage ? (
                  <img src={profileImage} alt="Avatar" className="w-full h-full object-cover" />
                ) : (
                  <span className="font-bold text-2xl text-purple-300">
                    {name.substring(0, 2).toUpperCase()}
                  </span>
                )}
              </div>
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-2xl">
                <Camera className="w-5 h-5 text-white" />
              </div>
            </div>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImageUpload}
              accept="image/*"
              className="hidden"
            />
          </div>

          <div>
            <h2 className="text-base font-bold text-white">{name}</h2>
            <p className="text-[11px] text-gray-400 mt-0.5">{role}</p>
          </div>

          {/* Live Workspace Stats Row */}
          <div className="w-full grid grid-cols-3 pt-3 border-t border-gray-800/60">
            <div className="flex flex-col items-center">
              <span className="text-sm font-extrabold text-white">{totalProjects}</span>
              <span className="text-[10px] text-gray-400 mt-0.5">Projects</span>
            </div>
            <div className="flex flex-col items-center border-x border-gray-800/60">
              <span className="text-sm font-extrabold text-white">{completedTasks}</span>
              <span className="text-[10px] text-gray-400 mt-0.5">Tasks Done</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-sm font-extrabold text-white">{maxStreak}d</span>
              <span className="text-[10px] text-gray-400 mt-0.5">Streak</span>
            </div>
          </div>
        </div>

        {/* Achievements Section */}
        <div className="space-y-2 flex-shrink-0">
          <div className="flex items-center gap-1.5 px-1">
            <Award className="w-4 h-4 text-amber-400" />
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">
              Achievements
            </h3>
          </div>

          <div className="flex gap-3 overflow-x-auto no-scrollbar py-1">
            <div className="w-24 h-28 rounded-2xl bg-[#161322] border border-gray-800 flex flex-col items-center justify-center p-3 flex-shrink-0 space-y-2">
              <div className="w-10 h-10 rounded-xl bg-purple-950 border border-purple-800 flex items-center justify-center text-purple-400">
                <Flame className="w-5 h-5 text-amber-400" />
              </div>
              <span className="text-[10px] font-semibold text-center text-gray-200">
                {maxStreak > 0 ? `${maxStreak}-Day Streak` : "Active Streak"}
              </span>
            </div>

            <div className="w-24 h-28 rounded-2xl bg-[#161322] border border-gray-800 flex flex-col items-center justify-center p-3 flex-shrink-0 space-y-2">
              <div className="w-10 h-10 rounded-xl bg-purple-950 border border-purple-800 flex items-center justify-center text-purple-400">
                <Zap className="w-5 h-5 text-purple-400" />
              </div>
              <span className="text-[10px] font-semibold text-center text-gray-200">
                {completedTasks} Tasks Done
              </span>
            </div>

            <div className="w-24 h-28 rounded-2xl bg-[#161322] border border-gray-800 flex flex-col items-center justify-center p-3 flex-shrink-0 space-y-2">
              <div className="w-10 h-10 rounded-xl bg-purple-950 border border-purple-800 flex items-center justify-center text-purple-400">
                <Award className="w-5 h-5 text-amber-300" />
              </div>
              <span className="text-[10px] font-semibold text-center text-gray-200">
                Early Bird
              </span>
            </div>

            <div className="w-24 h-28 rounded-2xl bg-[#161322] border border-gray-800 flex flex-col items-center justify-center p-3 flex-shrink-0 space-y-2">
              <div className="w-10 h-10 rounded-xl bg-purple-950 border border-purple-800 flex items-center justify-center text-purple-400">
                <Crown className="w-5 h-5 text-pink-400" />
              </div>
              <span className="text-[10px] font-semibold text-center text-gray-200">
                Pro Member
              </span>
            </div>
          </div>
        </div>

        {/* Monthly Goals Section */}
        <div className="p-4 rounded-2xl bg-[#161322] border border-gray-800 space-y-4 flex-shrink-0">
          <div className="flex items-center gap-1.5">
            <Target className="w-4 h-4 text-purple-400" />
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">
              Monthly Goals
            </h3>
          </div>

          <div className="space-y-1.5">
            <div className="flex justify-between text-xs">
              <span className="font-medium text-gray-200">Complete {taskGoalMax} tasks</span>
              <span className="text-gray-400">{completedTasks}/{taskGoalMax}</span>
            </div>
            <div className="w-full h-2 rounded-full bg-gray-800 overflow-hidden">
              <div
                className="h-full bg-purple-600 rounded-full transition-all duration-500"
                style={{ width: `${taskProgressPercent}%` }}
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <div className="flex justify-between text-xs">
              <span className="font-medium text-gray-200">Read {booksGoalMax} books</span>
              <span className="text-gray-400">{booksCompleted}/{booksGoalMax}</span>
            </div>
            <div className="w-full h-2 rounded-full bg-gray-800 overflow-hidden">
              <div
                className="h-full bg-pink-600 rounded-full transition-all duration-500"
                style={{ width: `${booksProgressPercent}%` }}
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <div className="flex justify-between text-xs">
              <span className="font-medium text-gray-200">{deepWorkGoalMax}h deep work</span>
              <span className="text-gray-400">{deepWorkCompleted}/{deepWorkGoalMax}</span>
            </div>
            <div className="w-full h-2 rounded-full bg-gray-800 overflow-hidden">
              <div
                className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                style={{ width: `${deepWorkProgressPercent}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* --- EDIT PROFILE MODAL --- */}
      {isEditProfileOpen && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-md z-[999] flex items-center justify-center p-4">
          <div className="bg-[#181524] border border-purple-900/50 rounded-2xl w-full max-w-md p-5 space-y-4 shadow-2xl">
            <div className="flex justify-between items-center border-b border-gray-800 pb-3">
              <h3 className="font-bold text-sm">Edit Profile</h3>
              <button
                type="button"
                onClick={() => setIsEditProfileOpen(false)}
                className="text-gray-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-3">
              <div>
                <label className="block text-xs text-gray-400 mb-1">Display Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-[#0D0B14] border border-gray-800 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-purple-500"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-400 mb-1">Title / Profession</label>
                <input
                  type="text"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full bg-[#0D0B14] border border-gray-800 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-purple-500"
                />
              </div>
            </div>
            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsEditProfileOpen(false)}
                className="w-full bg-purple-600 text-white py-2.5 rounded-xl text-xs font-semibold"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- SETTINGS MODAL --- */}
      {isSettingsOpen && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-md z-[999] flex items-center justify-center p-4">
          <div className="bg-[#181524] border border-purple-900/50 rounded-2xl w-full max-w-md p-5 space-y-4 shadow-2xl">
            <div className="flex justify-between items-center border-b border-gray-800 pb-3">
              <h3 className="font-bold text-sm">Workspace Settings</h3>
              <button
                type="button"
                onClick={() => setIsSettingsOpen(false)}
                className="text-gray-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 rounded-xl bg-[#0D0B14] border border-gray-800">
                <div className="flex items-center gap-2.5 text-xs">
                  <Bell className="w-4 h-4 text-purple-400" />
                  <span>Push Notifications</span>
                </div>
                <button
                  type="button"
                  onClick={() => setNotifications(!notifications)}
                  className={`w-10 h-6 rounded-full transition-colors relative p-0.5 ${
                    notifications ? "bg-purple-600" : "bg-gray-800"
                  }`}
                >
                  <div
                    className={`w-5 h-5 rounded-full bg-white transition-transform ${
                      notifications ? "translate-x-4" : "translate-x-0"
                    }`}
                  />
                </button>
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-[#0D0B14] border border-gray-800">
                <div className="flex items-center gap-2.5 text-xs">
                  <Palette className="w-4 h-4 text-purple-400" />
                  <span>Dark Neon Theme</span>
                </div>
                <button
                  type="button"
                  onClick={() => setDarkMode(!darkMode)}
                  className={`w-10 h-6 rounded-full transition-colors relative p-0.5 ${
                    darkMode ? "bg-purple-600" : "bg-gray-800"
                  }`}
                >
                  <div
                    className={`w-5 h-5 rounded-full bg-white transition-transform ${
                      darkMode ? "translate-x-4" : "translate-x-0"
                    }`}
                  />
                </button>
              </div>
            </div>
            <div className="pt-2">
              <button
                type="button"
                onClick={() => setIsSettingsOpen(false)}
                className="w-full bg-purple-600 text-white py-2.5 rounded-xl text-xs font-semibold hover:bg-purple-500 transition-colors shadow-md shadow-purple-900/40"
              >
                Save Settings
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}