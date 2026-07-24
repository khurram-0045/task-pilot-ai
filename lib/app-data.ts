export type Screen =
  | "splash"
  | "dashboard"
  | "projects"
  | "tasks"
  | "ai"
  | "vault"
  | "habits"
  | "analytics"
  | "profile"

export type Priority = "high" | "medium" | "low"

export const priorityConfig: Record<
  Priority,
  { label: string; className: string; dot: string }
> = {
  high: {
    label: "High",
    className: "bg-destructive/15 text-destructive",
    dot: "bg-destructive",
  },
  medium: {
    label: "Medium",
    className: "bg-warning/15 text-warning",
    dot: "bg-warning",
  },
  low: {
    label: "Low",
    className: "bg-success/15 text-success",
    dot: "bg-success",
  },
}

export type Project = {
  id: string
  name: string
  emoji: string
  progress: number
  dueDate: string
  priority: Priority
  workedToday: boolean
  color: string
  tasks: number
  done: number
}

export const projects: Project[] = [
  {
    id: "p1",
    name: "Mobile App Redesign",
    emoji: "◆",
    progress: 72,
    dueDate: "Aug 24",
    priority: "high",
    workedToday: true,
    color: "#7c2d4f",
    tasks: 18,
    done: 13,
  },
  {
    id: "p2",
    name: "AI Research Paper",
    emoji: "★",
    progress: 45,
    dueDate: "Sep 02",
    priority: "medium",
    workedToday: false,
    color: "#a855f7",
    tasks: 12,
    done: 5,
  },
  {
    id: "p3",
    name: "Marketing Launch",
    emoji: "●",
    progress: 88,
    dueDate: "Aug 19",
    priority: "high",
    workedToday: true,
    color: "#f472b6",
    tasks: 24,
    done: 21,
  },
  {
    id: "p4",
    name: "Personal Portfolio",
    emoji: "❖",
    progress: 30,
    dueDate: "Sep 15",
    priority: "low",
    workedToday: false,
    color: "#34d399",
    tasks: 9,
    done: 3,
  },
  {
    id: "p5",
    name: "Fitness Program",
    emoji: "▲",
    progress: 60,
    dueDate: "Ongoing",
    priority: "medium",
    workedToday: true,
    color: "#fbbf24",
    tasks: 30,
    done: 18,
  },
]

export type Task = {
  id: string
  title: string
  time: string
  priority: Priority
  done: boolean
  project: string
  reminder?: string
}

export const tasks: Task[] = [
  {
    id: "t1",
    title: "Finalize onboarding flow screens",
    time: "9:00 AM",
    priority: "high",
    done: false,
    project: "Mobile App Redesign",
    reminder: "In 30 min",
  },
  {
    id: "t2",
    title: "Review AI model benchmark data",
    time: "11:30 AM",
    priority: "medium",
    done: false,
    project: "AI Research Paper",
    reminder: "Today",
  },
  {
    id: "t3",
    title: "Ship landing page copy update",
    time: "2:00 PM",
    priority: "high",
    done: true,
    project: "Marketing Launch",
  },
  {
    id: "t4",
    title: "Morning workout & stretch",
    time: "7:00 AM",
    priority: "low",
    done: true,
    project: "Fitness Program",
  },
  {
    id: "t5",
    title: "Draft investor update email",
    time: "4:30 PM",
    priority: "medium",
    done: false,
    project: "Marketing Launch",
    reminder: "Tomorrow",
  },
  {
    id: "t6",
    title: "Read 20 pages of design systems book",
    time: "9:00 PM",
    priority: "low",
    done: false,
    project: "Personal Portfolio",
  },
]

export type Habit = {
  id: string
  name: string
  emoji: string
  streak: number
  goal: number
  done: number
  color: string
  completedToday: boolean
}

export const habits: Habit[] = [
  {
    id: "h1",
    name: "Deep Work",
    emoji: "◆",
    streak: 24,
    goal: 7,
    done: 6,
    color: "#7c2d4f",
    completedToday: true,
  },
  {
    id: "h2",
    name: "Read 30 min",
    emoji: "✦",
    streak: 12,
    goal: 7,
    done: 5,
    color: "#a855f7",
    completedToday: false,
  },
  {
    id: "h3",
    name: "Exercise",
    emoji: "▲",
    streak: 8,
    goal: 5,
    done: 4,
    color: "#34d399",
    completedToday: true,
  },
  {
    id: "h4",
    name: "No sugar",
    emoji: "●",
    streak: 3,
    goal: 7,
    done: 3,
    color: "#fbbf24",
    completedToday: false,
  },
]

export type Doc = {
  id: string
  name: string
  category: string
  size: string
  date: string
  color: string
}

export const documents: Doc[] = [
  { id: "d1", name: "AWS Solutions Architect", category: "Certificates", size: "2.4 MB", date: "Jul 12", color: "#fbbf24" },
  { id: "d2", name: "Senior Designer Resume", category: "Resume", size: "820 KB", date: "Aug 01", color: "#a855f7" },
  { id: "d3", name: "Degree Transcript", category: "University", size: "1.1 MB", date: "Jun 20", color: "#7c2d4f" },
  { id: "d4", name: "Google Internship Offer", category: "Internship", size: "540 KB", date: "May 15", color: "#34d399" },
  { id: "d5", name: "Passport Scan", category: "Personal", size: "3.2 MB", date: "Apr 09", color: "#f472b6" },
  { id: "d6", name: "UX Certification", category: "Certificates", size: "1.8 MB", date: "Mar 28", color: "#fbbf24" },
]

export const docCategories = [
  { name: "Certificates", count: 8, color: "#fbbf24" },
  { name: "Resume", count: 3, color: "#a855f7" },
  { name: "University", count: 12, color: "#7c2d4f" },
  { name: "Internship", count: 5, color: "#34d399" },
  { name: "Personal", count: 9, color: "#f472b6" },
]

export const activity = [
  { id: "a1", text: "Completed", target: "Ship landing page copy", time: "12m ago", type: "done" },
  { id: "a2", text: "AI generated plan for", target: "Mobile App Redesign", time: "1h ago", type: "ai" },
  { id: "a3", text: "Uploaded", target: "AWS Certificate.pdf", time: "3h ago", type: "upload" },
  { id: "a4", text: "Created project", target: "Fitness Program", time: "Yesterday", type: "project" },
]

// Heatmap: 7 columns (weeks) x 7 rows (days) of intensity 0-4
export const heatmap: number[][] = [
  [2, 0, 3, 1, 4, 2, 0],
  [1, 3, 2, 4, 1, 0, 2],
  [3, 4, 1, 2, 3, 4, 1],
  [0, 2, 4, 3, 2, 1, 3],
  [4, 1, 2, 0, 4, 3, 2],
  [2, 3, 4, 1, 2, 4, 3],
  [1, 0, 2, 3, 4, 2, 4],
]

export const weeklyFocus = [
  { day: "M", hours: 4.2, tasks: 7 },
  { day: "T", hours: 5.8, tasks: 9 },
  { day: "W", hours: 3.1, tasks: 5 },
  { day: "T", hours: 6.4, tasks: 11 },
  { day: "F", hours: 5.0, tasks: 8 },
  { day: "S", hours: 2.3, tasks: 4 },
  { day: "S", hours: 1.5, tasks: 2 },
]
