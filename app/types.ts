export interface Task {
  id: string
  title: string
  completed: boolean
  priority: 'low' | 'normal' | 'high'
  projectId: string
  dueDate?: Date
  description?: string
}

export interface Project {
  id: string
  name: string
  color: string
}

