import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export interface Task {
  id: string;
  title: string;
  priority: "high" | "medium" | "low";
  completed: boolean;
  project: string;
  time: string;
  dueDate?: string;
  isDaily?: boolean;
  lastCompletedDate?: string;
}

export interface Project {
  id: string;
  title: string;
  progress: number;
  totalTasks: number;
  completedTasks: number;
  priority: "high" | "medium" | "low";
  dueDate: string;
  workedToday?: boolean;
}

export interface Habit {
  id: string;
  title: string;
  category: string;
  streak: number;
  completedDates: string[];
}

export interface VaultDoc {
  id: string;
  name: string;
  category: string;
  size: string;
  date: string;
}

interface StoreState {
  tasks: Task[];
  projects: Project[];
  habits: Habit[];
  documents: VaultDoc[];
  profileImage: string | null; // Added profile image state

  // Tasks actions
  addTask: (task: Omit<Task, "id">) => void;
  updateTask: (id: string, updatedTask: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  toggleTask: (id: string) => void;

  // Projects actions
  addProject: (project: Omit<Project, "id">) => void;
  updateProject: (id: string, updatedProject: Partial<Project>) => void;
  deleteProject: (id: string) => void;
  toggleProjectWorkedToday: (id: string) => void;

  // Habits actions
  addHabit: (habit: Omit<Habit, "id" | "streak" | "completedDates">) => void;
  toggleHabitDate: (id: string, dateStr: string) => void;
  deleteHabit: (id: string) => void;

  // Documents actions
  addDocument: (doc: Omit<VaultDoc, "id" | "date">) => void;
  deleteDocument: (id: string) => void;

  // Profile actions
  setProfileImage: (url: string | null) => void; // Added profile image action
}

export const useStore = create<StoreState>()(
  persist(
    (set) => ({
      tasks: [],
      projects: [],
      habits: [],
      documents: [],
      profileImage: null, // Initial state

      // --- TASK ACTIONS ---
      addTask: (task) =>
        set((state) => ({
          tasks: [
            { ...task, id: Date.now().toString() },
            ...state.tasks,
          ],
        })),

      updateTask: (id, updatedTask) =>
        set((state) => ({
          tasks: state.tasks.map((t) =>
            t.id === id ? { ...t, ...updatedTask } : t
          ),
        })),

      deleteTask: (id) =>
        set((state) => ({
          tasks: state.tasks.filter((t) => t.id !== id),
        })),

      toggleTask: (id) =>
        set((state) => ({
          tasks: state.tasks.map((t) =>
            t.id === id ? { ...t, completed: !t.completed } : t
          ),
        })),

      // --- PROJECT ACTIONS ---
      addProject: (project) =>
        set((state) => ({
          projects: [
            { ...project, id: Date.now().toString() },
            ...state.projects,
          ],
        })),

      updateProject: (id, updatedProject) =>
        set((state) => ({
          projects: state.projects.map((p) =>
            p.id === id ? { ...p, ...updatedProject } : p
          ),
        })),

      deleteProject: (id) =>
        set((state) => ({
          projects: state.projects.filter((p) => p.id !== id),
        })),

      toggleProjectWorkedToday: (id) =>
        set((state) => ({
          projects: state.projects.map((p) =>
            p.id === id ? { ...p, workedToday: !p.workedToday } : p
          ),
        })),

      // --- HABIT ACTIONS ---
      addHabit: (habit) =>
        set((state) => ({
          habits: [
            {
              ...habit,
              id: Date.now().toString(),
              streak: 0,
              completedDates: [],
            },
            ...state.habits,
          ],
        })),

      toggleHabitDate: (id, dateStr) =>
        set((state) => ({
          habits: state.habits.map((h) => {
            if (h.id !== id) return h;
            const exists = h.completedDates.includes(dateStr);
            const newDates = exists
              ? h.completedDates.filter((d) => d !== dateStr)
              : [...h.completedDates, dateStr];
            return {
              ...h,
              completedDates: newDates,
              streak: newDates.length,
            };
          }),
        })),

      deleteHabit: (id) =>
        set((state) => ({
          habits: state.habits.filter((h) => h.id !== id),
        })),

      // --- DOCUMENT ACTIONS ---
      addDocument: (doc) =>
        set((state) => ({
          documents: [
            {
              ...doc,
              id: Date.now().toString(),
              date: new Date().toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
              }),
            },
            ...state.documents,
          ],
        })),

      deleteDocument: (id) =>
        set((state) => ({
          documents: state.documents.filter((d) => d.id !== id),
        })),

      // --- PROFILE ACTIONS ---
      setProfileImage: (url) => set({ profileImage: url }),
    }),
    {
      name: "taskpilot-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);