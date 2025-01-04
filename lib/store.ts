import { create } from 'zustand'
import { v4 as uuidv4 } from 'uuid'
import { isToday } from 'date-fns'

export interface Task {
  id: string
  title: string
  description?: string
  projectId: string | null
  dueDate?: Date
  priority: 1 | 2 | 3 | 4
  completed: boolean
  order: number
}

export interface Project {
  id: string
  name: string
  color: string
}

interface FocusSettings {
  workDuration: number; // in minutes
  breakDuration: number; // in minutes
  longBreakDuration: number; // in minutes
  sessionsUntilLongBreak: number;
}

interface FocusState {
  isActive: boolean;
  currentTaskId: string | null;
  settings: FocusSettings;
  currentSession: number;
  isBreak: boolean;
}

interface TaskStore {
  tasks: Task[]
  projects: Project[]
  addTask: (task: Omit<Task, 'id' | 'completed' | 'order'>) => void
  editTask: (id: string, updatedTask: Partial<Omit<Task, 'id'>>) => void
  toggleTask: (id: string) => void
  deleteTask: (id: string) => void
  reorderTasks: (startIndex: number, endIndex: number) => void
  addProject: (name: string, color: string) => void
  editProject: (id: string, updatedProject: Partial<Omit<Project, 'id'>>) => void
  deleteProject: (id: string) => void
  focusState: FocusState;
  focusSettings: FocusSettings;
  setFocusSettings: (settings: Partial<FocusSettings>) => void;
  startFocusMode: (taskId: string) => void;
  stopFocusMode: () => void;
  skipTask: () => void;
  completeCurrentTask: () => void;
  startBreak: () => void;
}

export const useTaskStore = create<TaskStore>((set, get) => ({
  tasks: [],
  projects: [],
  addTask: (task) =>
    set((state) => ({
      tasks: [
        ...state.tasks,
        { 
          ...task, 
          id: uuidv4(), 
          completed: false,
          order: state.tasks.length 
        },
      ].sort((a, b) => a.order - b.order),
    })),
  editTask: (id, updatedTask) =>
    set((state) => ({
      tasks: state.tasks.map((task) =>
        task.id === id ? { ...task, ...updatedTask } : task
      ),
    })),
  toggleTask: (id) =>
    set((state) => ({
      tasks: state.tasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      ),
    })),
  deleteTask: (id) =>
    set((state) => ({
      tasks: state.tasks
        .filter((task) => task.id !== id)
        .map((task, index) => ({ ...task, order: index })),
    })),
  reorderTasks: (startIndex: number, endIndex: number) =>
    set((state) => {
      const result = Array.from(state.tasks)
      const [removed] = result.splice(startIndex, 1)
      result.splice(endIndex, 0, removed)
      
      return {
        tasks: result.map((task, index) => ({ ...task, order: index })),
      }
    }),
  addProject: (name, color) =>
    set((state) => ({
      projects: [...state.projects, { id: uuidv4(), name, color }],
    })),
  editProject: (id, updatedProject) =>
    set((state) => ({
      projects: state.projects.map((project) =>
        project.id === id ? { ...project, ...updatedProject } : project
      ),
    })),
  deleteProject: (id) =>
    set((state) => ({
      projects: state.projects.filter((project) => project.id !== id),
      tasks: state.tasks.filter((task) => task.projectId !== id),
    })),
  focusSettings: {
    workDuration: 25,
    breakDuration: 5,
    longBreakDuration: 15,
    sessionsUntilLongBreak: 4,
  },
  focusState: {
    isActive: false,
    currentTaskId: null,
    settings: {
      workDuration: 25,
      breakDuration: 5,
      longBreakDuration: 15,
      sessionsUntilLongBreak: 4,
    },
    currentSession: 0,
    isBreak: false,
  },
  setFocusSettings: (settings) =>
    set((state) => ({
      focusSettings: { ...state.focusSettings, ...settings },
      focusState: {
        ...state.focusState,
        settings: { ...state.focusState.settings, ...settings },
      },
    })),
  startFocusMode: (taskId) =>
    set((state) => ({
      focusState: {
        ...state.focusState,
        isActive: true,
        currentTaskId: taskId,
        currentSession: state.focusState.currentSession + 1,
        isBreak: false,
      },
    })),
  stopFocusMode: () =>
    set((state) => ({
      focusState: {
        ...state.focusState,
        isActive: false,
        currentTaskId: null,
        currentSession: 0,
        isBreak: false,
      },
    })),
  skipTask: () => {
    const state = get();
    const tasks = state.tasks.filter((t) => !t.completed);
    const currentIndex = tasks.findIndex((t) => t.id === state.focusState.currentTaskId);
    const nextTask = tasks[currentIndex + 1];
    
    if (nextTask) {
      set((state) => ({
        focusState: {
          ...state.focusState,
          currentTaskId: nextTask.id,
          isBreak: false,
          currentSession: state.focusState.currentSession,
        },
      }));
    } else {
      state.stopFocusMode();
    }
  },
  completeCurrentTask: () => {
    const state = get();
    if (state.focusState.currentTaskId) {
      state.toggleTask(state.focusState.currentTaskId);
      state.skipTask();
    }
  },
  startBreak: () =>
    set((state) => ({
      focusState: {
        ...state.focusState,
        isBreak: true,
      },
    })),
}))

export const projectColors = [
  { name: 'Vermelho', value: 'red' },
  { name: 'Laranja', value: 'orange' },
  { name: 'Amarelo', value: 'yellow' },
  { name: 'Verde', value: 'green' },
  { name: 'Azul', value: 'blue' },
  { name: 'Índigo', value: 'indigo' },
  { name: 'Violeta', value: 'violet' },
  { name: 'Rosa', value: 'pink' },
]

export interface PriorityDetails {
  color: string
  description: string
  textColor: string
}

export function getPriorityDetails(priority: 1 | 2 | 3 | 4): PriorityDetails {
  switch (priority) {
    case 1:
      return { color: 'bg-red-500', description: 'Urgente', textColor: 'text-red-500' }
    case 2:
      return { color: 'bg-yellow-500', description: 'Alta prioridade', textColor: 'text-yellow-500' }
    case 3:
      return { color: 'bg-green-500', description: 'Normal', textColor: 'text-green-500' }
    case 4:
      return { color: 'bg-blue-500', description: 'Baixa prioridade', textColor: 'text-blue-500' }
  }
}

