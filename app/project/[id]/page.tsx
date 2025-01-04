'use client'

import { useParams } from 'next/navigation'
import { TaskList } from '@/components/task-list'
import { TaskInput } from '@/components/task-input'
import { useTaskStore } from '@/lib/store'
import { useMemo } from 'react'

export default function ProjectPage() {
  const params = useParams()
  const projectId = params.id as string
  const tasks = useTaskStore((state) => state.tasks)
  const projects = useTaskStore((state) => state.projects)
  
  const projectTasks = useMemo(() => {
    return tasks.filter(task => task.projectId === projectId)
  }, [tasks, projectId])

  const project = useMemo(() => {
    return projects.find(p => p.id === projectId)
  }, [projects, projectId])

  if (!project) {
    return <div>Projeto não encontrado</div>
  }

  return (
    <div className="h-full">
      <header className="flex h-14 items-center border-b px-4">
        <h1 className="text-xl font-semibold">{project.name}</h1>
        <span className="ml-2 text-sm text-muted-foreground">
          {projectTasks.length} {projectTasks.length === 1 ? 'tarefa' : 'tarefas'}
        </span>
      </header>
      <div className="p-4">
        <TaskList tasks={projectTasks} />
        <TaskInput defaultProject={projectId} />
      </div>
    </div>
  )
}

