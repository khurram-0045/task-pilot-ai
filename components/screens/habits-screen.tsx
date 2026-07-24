"use client";

import React, { useState } from "react";
import { useStore } from "@/lib/storage";
import { Flame, Plus, Check, X, Trophy, Trash2 } from "lucide-react";

export function HabitsScreen() {
  const store = useStore() as any;
  const habits = store.habits || [];
  const addHabit = store.addHabit || (() => {});
  const deleteHabit = store.deleteHabit || ((id: string) => {});

  const [habitDays, setHabitDays] = useState<Record<string, boolean[]>>({});
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [habitTitle, setHabitTitle] = useState("");
  const [activeTab, setActiveTab] = useState<"weekly" | "monthly">("weekly");

  const weekDays = ["M", "T", "W", "T", "F", "S", "S"];
  const augustDays = Array.from({ length: 30 }, (_, i) => i + 1);
  
  // Track monthly calendar clicks per habit: { [habitId]: { [dayNum]: boolean } }
  const [monthlyDays, setMonthlyDays] = useState<Record<string, Record<number, boolean>>>({});

  const toggleDay = (habitId: string, dayIndex: number) => {
    setHabitDays((prev) => {
      const currentDays = prev[habitId] || [false, false, false, false, false, false, false];
      const updatedDays = [...currentDays];
      updatedDays[dayIndex] = !updatedDays[dayIndex];
      return { ...prev, [habitId]: updatedDays };
    });
  };

  const toggleMonthlyDay = (habitId: string, dayNum: number) => {
    setMonthlyDays((prev) => {
      const habitMonth = prev[habitId] || {};
      return {
        ...prev,
        [habitId]: {
          ...habitMonth,
          [dayNum]: !habitMonth[dayNum],
        },
      };
    });
  };

  const handleAddHabit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!habitTitle.trim()) return;

    addHabit({
      id: Date.now().toString(),
      title: habitTitle,
      streak: 0,
      completedToday: false,
    });

    setHabitTitle("");
    setIsAddModalOpen(false);
  };

  const totalSlots = habits.length * 7;
  let checkedSlots = 0;
  
  habits.forEach((h: any) => {
    const days = habitDays[h.id] || [false, false, false, false, false, false, false];
    checkedSlots += days.filter(Boolean).length;
  });

  const overallCompletionRate = totalSlots > 0 ? Math.round((checkedSlots / totalSlots) * 100) : 0;
  const maxStreak = habits.reduce((max: number, h: any) => (h.streak > max ? h.streak : max), 0);

  return (
    <div className="flex flex-col h-full justify-between px-5 pt-12 pb-24 text-white bg-[#0D0B14] overflow-y-auto no-scrollbar">
      {/* Top Container Area */}
      <div className="flex flex-col flex-1 min-h-0 space-y-4">
        {/* Header */}
        <header className="flex items-center justify-between pb-3 pt-1 flex-shrink-0">
          <div>
            <h1 className="text-xl font-bold tracking-tight">Habits Tracker</h1>
            <p className="text-xs text-gray-400 mt-0.5">Consistency builds success</p>
          </div>
          <button
            type="button"
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-xs font-semibold text-white shadow-lg shadow-purple-900/40 transition-all active:scale-95"
          >
            <Plus className="w-3.5 h-3.5" /> Add Habit
          </button>
        </header>

        {/* Tab Switcher (Weekly vs Monthly Calendar View) */}
        <div className="flex p-1 rounded-2xl bg-[#161322] border border-gray-800 flex-shrink-0">
          <button
            type="button"
            onClick={() => setActiveTab("weekly")}
            className={`flex-1 py-2 rounded-xl text-xs font-semibold transition-all ${
              activeTab === "weekly"
                ? "bg-purple-600 text-white shadow-md shadow-purple-900/40"
                : "text-gray-400 hover:text-white"
            }`}
          >
            Weekly View
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("monthly")}
            className={`flex-1 py-2 rounded-xl text-xs font-semibold transition-all ${
              activeTab === "monthly"
                ? "bg-purple-600 text-white shadow-md shadow-purple-900/40"
                : "text-gray-400 hover:text-white"
            }`}
          >
            August Tracker
          </button>
        </div>

        {/* Top Streak Banner Card */}
        <div className="p-4 rounded-3xl bg-[#161322] border border-gray-800/80 shadow-xl flex items-center justify-between flex-shrink-0 relative overflow-hidden">
          <div className="space-y-1">
            <p className="text-[11px] text-gray-400 font-medium">Current best streak</p>
            <div className="flex items-baseline gap-1.5">
              <h2 className="text-3xl font-extrabold text-white">{maxStreak}</h2>
              <span className="text-xs text-gray-400 font-semibold">days</span>
            </div>
            <p className="text-[11px] text-emerald-400 font-medium pt-0.5">
              You&apos;re on fire — keep it going!
            </p>

            <div className="pt-2 space-y-1">
              <div className="flex justify-between text-[10px] text-gray-400">
                <span>Today&apos;s completion</span>
                <span className="text-purple-400 font-bold">{overallCompletionRate}%</span>
              </div>
              <div className="w-40 h-2 rounded-full bg-gray-800 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-purple-600 to-pink-500 rounded-full transition-all duration-500"
                  style={{ width: `${overallCompletionRate}%` }}
                />
              </div>
            </div>
          </div>

          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-purple-600/30 to-pink-500/30 border border-purple-500/40 flex items-center justify-center text-purple-400 shadow-lg shadow-purple-900/50 flex-shrink-0">
            <Flame className="w-7 h-7 text-pink-400 animate-pulse" />
          </div>
        </div>

        {/* Conditional Rendering based on Tab */}
        {activeTab === "weekly" ? (
          /* Habits Weekly List Section with Delete Functionality */
          <div className="space-y-3.5 flex-shrink-0">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider px-1">
              YOUR HABITS
            </h3>

            {!habits || habits.length === 0 ? (
              <div className="text-center py-10 text-gray-500 text-xs bg-[#161322] border border-gray-800 rounded-2xl">
                <Trophy className="w-8 h-8 mx-auto mb-2 opacity-40 text-purple-400" />
                No habits created yet. Click &quot;Add Habit&quot; above!
              </div>
            ) : (
              habits.map((habit: any) => {
                const daysState = habitDays[habit.id] || [false, false, false, false, false, false, false];
                const habitStreak = daysState.filter(Boolean).length;

                return (
                  <div
                    key={habit.id}
                    className="p-4 rounded-3xl bg-[#161322] border border-gray-800/80 space-y-4 shadow-md relative group"
                  >
                    {/* Habit Header & Delete Button */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-2xl bg-purple-950/60 border border-purple-800/60 flex items-center justify-center text-purple-400">
                          <Flame className="w-5 h-5 text-pink-400" />
                        </div>
                        <div>
                          <h4 className="text-xs font-bold text-white">{habit.title}</h4>
                          <p className="text-[10px] text-gray-400 mt-0.5">
                            🔥 {habitStreak} day streak
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => deleteHabit(habit.id)}
                          className="p-2 rounded-xl text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                          title="Delete habit"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${habitStreak > 0 ? 'bg-purple-600 text-white shadow-md shadow-purple-900/50' : 'bg-gray-800 text-gray-600'}`}>
                          <Check className="w-4 h-4" />
                        </div>
                      </div>
                    </div>

                    {/* Fully Interactive Weekly Circles (M - S) */}
                    <div className="flex items-center justify-between pt-1 px-1">
                      {weekDays.map((dayLabel, idx) => {
                        const isChecked = daysState[idx];
                        return (
                          <div key={idx} className="flex flex-col items-center gap-1.5">
                            <button
                              type="button"
                              onClick={() => toggleDay(habit.id, idx)}
                              className={`w-9 h-9 rounded-full flex items-center justify-center transition-all cursor-pointer ${
                                isChecked
                                  ? "bg-purple-600 text-white shadow-md shadow-purple-900/50 scale-105 border border-purple-400"
                                  : "bg-[#0D0B14] border border-gray-800 text-gray-600 hover:border-gray-700"
                              }`}
                            >
                              {isChecked && <Check className="w-4 h-4 text-white" />}
                            </button>
                            <span className="text-[10px] font-semibold text-gray-400">
                              {dayLabel}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        ) : (
          /* Monthly Calendar Track View */
          <div className="space-y-4 flex-shrink-0">
            {habits.length === 0 ? (
              <div className="text-center py-10 text-gray-500 text-xs bg-[#161322] border border-gray-800 rounded-2xl">
                No habits found to track monthly.
              </div>
            ) : (
              habits.map((habit: any) => {
                const habitMonth = monthlyDays[habit.id] || {};
                const completedCount = Object.values(habitMonth).filter(Boolean).length;

                return (
                  <div key={habit.id} className="p-4 rounded-3xl bg-[#161322] border border-gray-800/80 space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-xs font-bold text-white">{habit.title}</h4>
                        <p className="text-[10px] text-gray-400">August Progress</p>
                      </div>
                      <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-[10px] text-emerald-400 font-semibold">
                        {completedCount}/30 days
                      </span>
                    </div>

                    <div className="grid grid-cols-7 gap-2 pt-1">
                      {["M", "T", "W", "T", "F", "S", "S"].map((d, i) => (
                        <div key={i} className="text-center text-[10px] font-semibold text-gray-500 pb-1">
                          {d}
                        </div>
                      ))}

                      {augustDays.map((dayNum) => {
                        const isDone = !!habitMonth[dayNum];
                        return (
                          <button
                            key={dayNum}
                            type="button"
                            onClick={() => toggleMonthlyDay(habit.id, dayNum)}
                            className={`aspect-square rounded-full flex items-center justify-center text-[10px] font-semibold transition-all cursor-pointer ${
                              isDone
                                ? "bg-purple-600 text-white shadow-md shadow-purple-900/50 border border-purple-400"
                                : "bg-[#0D0B14] border border-gray-800/80 text-gray-500 hover:border-gray-700"
                            }`}
                          >
                            {dayNum}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}
      </div>

      {/* --- ADD HABIT MODAL --- */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-md z-[999] flex items-center justify-center p-4">
          <div className="bg-[#181524] border border-purple-900/50 rounded-2xl w-full max-w-md p-5 space-y-4 shadow-2xl">
            <div className="flex justify-between items-center border-b border-gray-800 pb-3">
              <h3 className="font-bold text-sm">Create New Habit</h3>
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="text-gray-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleAddHabit} className="space-y-4">
              <div>
                <label className="block text-xs text-gray-400 mb-1">Habit Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Deep Work / Read 30 min / Exercise"
                  value={habitTitle}
                  onChange={(e) => setHabitTitle(e.target.value)}
                  className="w-full bg-[#0D0B14] border border-gray-800 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-purple-500"
                />
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="flex-1 bg-gray-800 text-gray-300 py-2.5 rounded-xl text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-purple-600 text-white py-2.5 rounded-xl text-xs font-semibold hover:bg-purple-500 transition-colors shadow-md shadow-purple-900/40"
                >
                  Save Habit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}