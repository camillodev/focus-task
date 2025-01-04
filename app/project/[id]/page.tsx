'use client'

import { useParams } from 'next/navigation'
import { TaskList } from '@/components/task-list'
import { TaskInput } from '@/components/task-input'
import { useTaskStore } from '@/lib/store'
import { useMemo } from 'react'
import { FocusModeButton } from '@/components/focus-mode-button'

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
    <>
      <div className="flex items-center justify-between h-14 border-b px-4">
        <h1 className="text-xl font-semibold">{project.name}</h1>
        <FocusModeButton />
      </div>
      <div className="p-4">
        <TaskList tasks={projectTasks} />
        <TaskInput defaultProject={projectId} />
      </div>
    </>
  )
}

